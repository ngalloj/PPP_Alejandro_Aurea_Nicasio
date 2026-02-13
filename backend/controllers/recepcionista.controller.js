// backend/controllers/recepcionista.controller.js
// Funcionalidades completas para RECEPCIONISTA

const { Cita, Animal, Usuario, Inventario, Factura } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
let io;

// Inicializar Socket.io (opcional)
try {
  io = require('../socket');
} catch (error) {
  console.log('⚠️ Socket.io no disponible en recepcionista controller');
}

// ==================== GESTIÓN DE CITAS ====================

// 📋 COLA DE ESPERA - Citas pendientes de hoy
exports.getColaEspera = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const cola = await Cita.findAll({
      where: {
        estado: 'pendiente',
        fecha: { [Op.between]: [hoy, manana] }
      },
      include: [
        { 
          model: Animal,
          as: 'animal',
          include: [{ 
            model: Usuario, 
            as: 'propietario',
            attributes: ['id', 'email', 'nombre', 'telefono'] 
          }]
        },
        { 
          model: Usuario, 
          as: 'veterinario', 
          attributes: ['id', 'email', 'nombre'] 
        }
      ],
      order: [['fecha', 'ASC']]
    });

    res.json({
      total: cola.length,
      cola,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getColaEspera:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📅 OBTENER CITAS DEL DÍA (todas, no solo pendientes)
exports.getCitasDelDia = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const citas = await Cita.findAll({
      where: {
        fecha: { [Op.between]: [hoy, manana] }
      },
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{ 
            model: Usuario, 
            as: 'propietario',
            attributes: ['id', 'email', 'nombre', 'telefono']
          }]
        },
        { 
          model: Usuario, 
          as: 'veterinario',
          attributes: ['id', 'email', 'nombre']
        }
      ],
      order: [['fecha', 'ASC']]
    });

    res.json({
      total: citas.length,
      citas,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getCitasDelDia:', error);
    res.status(500).json({ error: error.message });
  }
};

// ⚡ CITA RÁPIDA - Sin mascota preregistrada
exports.crearCitaRapida = async (req, res) => {
  try {
    const { telefonoCliente, motivo, nombreCliente, veterinarioId } = req.body;

    const cita = await Cita.create({
      fecha: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      estado: 'pendiente',
      motivo: `RÁPIDA: ${motivo}`,
      observaciones: `Cliente: ${nombreCliente || 'No especificado'} - Tel: ${telefonoCliente}`,
      veterinarioId: veterinarioId || null,
      animalId: null // Sin mascota asignada
    });

    // Emitir evento Socket.io si está disponible
    if (io && io.getIO) {
      try {
        io.getIO().emit('nueva-cita-rapida', {
          id: cita.id,
          motivo,
          fecha: cita.fecha,
          telefono: telefonoCliente
        });
      } catch (socketError) {
        console.log('⚠️ Socket.io emit falló:', socketError.message);
      }
    }

    res.status(201).json({
      mensaje: 'Cita rápida creada',
      cita,
      aviso: 'Cliente será contactado para confirmar'
    });
  } catch (error) {
    console.error('Error crearCitaRapida:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📝 CREAR CITA NORMAL (con animal registrado)
exports.crearCita = async (req, res) => {
  try {
    const { animalId, veterinarioId, fecha, motivo, observaciones } = req.body;

    // Verificar disponibilidad del veterinario
    const citaExistente = await Cita.findOne({
      where: {
        veterinarioId,
        fecha: new Date(fecha),
        estado: { [Op.ne]: 'cancelada' }
      }
    });

    if (citaExistente) {
      return res.status(400).json({ 
        error: 'El veterinario ya tiene una cita a esa hora' 
      });
    }

    const cita = await Cita.create({
      animalId,
      veterinarioId,
      fecha: new Date(fecha),
      motivo,
      observaciones,
      estado: 'pendiente'
    });

    const citaCompleta = await Cita.findByPk(cita.id, {
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{ 
            model: Usuario, 
            as: 'propietario',
            attributes: ['id', 'email', 'nombre', 'telefono']
          }]
        },
        { 
          model: Usuario, 
          as: 'veterinario',
          attributes: ['id', 'email', 'nombre']
        }
      ]
    });

    // Emitir notificación Socket.io
    if (io && io.getIO) {
      try {
        io.getIO().emit('nuevaCita', citaCompleta);
      } catch (socketError) {
        console.log('⚠️ Socket.io emit falló:', socketError.message);
      }
    }

    res.status(201).json(citaCompleta);
  } catch (error) {
    console.error('Error crearCita:', error);
    res.status(500).json({ error: error.message });
  }
};

// 🔄 ACTUALIZAR ESTADO DE CITA
exports.actualizarEstadoCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cita = await Cita.findByPk(id);
    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    cita.estado = estado;
    await cita.save();

    const citaCompleta = await Cita.findByPk(id, {
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{ 
            model: Usuario, 
            as: 'propietario',
            attributes: ['id', 'email', 'nombre', 'telefono']
          }]
        },
        { 
          model: Usuario, 
          as: 'veterinario',
          attributes: ['id', 'email', 'nombre']
        }
      ]
    });

    // Emitir actualización Socket.io
    if (io && io.getIO) {
      try {
        io.getIO().emit('citaActualizada', citaCompleta);
      } catch (socketError) {
        console.log('⚠️ Socket.io emit falló:', socketError.message);
      }
    }

    res.json(citaCompleta);
  } catch (error) {
    console.error('Error actualizarEstadoCita:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== COBROS Y FACTURACIÓN ====================

// 💰 COBRAR + CONSUMIR INVENTARIO
exports.cobrarConInventario = async (req, res) => {
  try {
    const { citaId, items, metodoPago } = req.body;
    // items: [{inventarioId, cantidad, precioUnitario, concepto}]

    const cita = await Cita.findByPk(citaId, {
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{ model: Usuario, as: 'propietario' }]
        },
        { model: Usuario, as: 'veterinario' }
      ]
    });

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    if (cita.estado === 'completada') {
      return res.status(400).json({ error: 'Cita ya completada y cobrada' });
    }

    let subtotal = 0;
    const itemsFactura = [];

    // Consumir inventario y calcular total
    for (const item of items) {
      if (item.inventarioId) {
        const inv = await Inventario.findByPk(item.inventarioId);
        
        if (!inv) {
          return res.status(404).json({ 
            error: `Producto ${item.inventarioId} no encontrado` 
          });
        }
        
        if (inv.cantidad < item.cantidad) {
          return res.status(400).json({ 
            error: `Stock insuficiente: ${inv.nombre}. Disponible: ${inv.cantidad}` 
          });
        }

        // Descontar stock
        inv.cantidad -= item.cantidad;
        inv.unidadesVendidas = (inv.unidadesVendidas || 0) + item.cantidad;
        await inv.save();

        const subtotalItem = item.cantidad * item.precioUnitario;
        subtotal += subtotalItem;

        itemsFactura.push({
          concepto: item.concepto || inv.nombre,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          total: subtotalItem,
          inventarioId: inv.id
        });
      } else {
        // Item sin inventario (ej: consulta)
        const subtotalItem = item.cantidad * item.precioUnitario;
        subtotal += subtotalItem;

        itemsFactura.push({
          concepto: item.concepto,
          cantidad: item.cantidad,
          precioUnitario: item.precioUnitario,
          total: subtotalItem
        });
      }
    }

    const iva = subtotal * 0.21; // IVA 21%
    const total = subtotal + iva;

    // Crear factura
    const factura = await Factura.create({
      clienteId: cita.animal.propietarioId,
      citaId: citaId,
      fecha: new Date(),
      subtotal,
      iva,
      total,
      estado: 'pagada', // Ya está pagada
      metodoPago,
      items: itemsFactura
    });

    // Marcar cita como completada
    await cita.update({ estado: 'completada' });

    res.json({
      mensaje: 'Cita cobrada y completada exitosamente',
      cita: { 
        id: cita.id, 
        fecha: cita.fecha, 
        animal: cita.animal.nombre 
      },
      factura: {
        id: factura.id,
        numeroFactura: factura.numeroFactura,
        subtotal,
        iva,
        total,
        metodoPago,
        items: itemsFactura
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error cobrarConInventario:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== BÚSQUEDAS Y CONSULTAS ====================

// 🔍 BUSCAR CLIENTE
exports.buscarCliente = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res.status(400).json({ 
        error: 'Debe proporcionar al menos 2 caracteres para buscar' 
      });
    }

    const clientes = await Usuario.findAll({
      where: {
        rol: 'cliente',
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { telefono: { [Op.iLike]: `%${query}%` } }
        ]
      },
      include: [{ 
        model: Animal, 
        as: 'mascotas',
        attributes: ['id', 'nombre', 'especie', 'raza']
      }],
      limit: 10,
      attributes: ['id', 'email', 'nombre', 'telefono', 'rol']
    });

    res.json({
      total: clientes.length,
      clientes
    });
  } catch (error) {
    console.error('Error buscarCliente:', error);
    res.status(500).json({ error: error.message });
  }
};

// 👨‍⚕️ OBTENER VETERINARIOS DISPONIBLES
exports.getVeterinariosDisponibles = async (req, res) => {
  try {
    const { fecha } = req.query;

    const veterinarios = await Usuario.findAll({
      where: { rol: 'veterinario' },
      attributes: ['id', 'email', 'nombre']
    });

    if (fecha) {
      const fechaCita = new Date(fecha);
      const citasEnHora = await Cita.findAll({
        where: {
          fecha: fechaCita,
          estado: { [Op.ne]: 'cancelada' }
        },
        attributes: ['veterinarioId']
      });

      const veterinariosOcupados = citasEnHora.map(c => c.veterinarioId);
      const disponibles = veterinarios.filter(
        v => !veterinariosOcupados.includes(v.id)
      );

      return res.json({
        total: disponibles.length,
        veterinarios: disponibles,
        ocupados: veterinariosOcupados.length
      });
    }

    res.json({
      total: veterinarios.length,
      veterinarios
    });
  } catch (error) {
    console.error('Error getVeterinariosDisponibles:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== CLIENTES Y DEUDAS ====================

// 👥 CLIENTES CON DEUDA
exports.clientesDeuda = async (req, res) => {
  try {
    const deudores = await Factura.findAll({
      where: { estado: 'pendiente' },
      include: [{
        model: Usuario,
        as: 'cliente',
        attributes: ['id', 'email', 'nombre', 'telefono']
      }],
      attributes: [
        'clienteId',
        [sequelize.fn('COUNT', sequelize.col('Factura.id')), 'facturas_pendientes'],
        [sequelize.fn('SUM', sequelize.col('total')), 'total_deuda']
      ],
      group: ['Factura.clienteId', 'cliente.id', 'cliente.email', 'cliente.nombre', 'cliente.telefono'],
      order: [[sequelize.literal('total_deuda'), 'DESC']],
      raw: false
    });

    res.json({
      total_clientes_deuda: deudores.length,
      clientes: deudores
    });
  } catch (error) {
    console.error('Error clientesDeuda:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== INVENTARIO ====================

// ⚠️ ALERTAS INVENTARIO - Stock bajo
exports.alertasInventario = async (req, res) => {
  try {
    const bajos = await Inventario.findAll({
      where: sequelize.where(
        sequelize.col('cantidad'),
        Op.lte,
        sequelize.col('stockMinimo')
      ),
      order: [['cantidad', 'ASC']]
    });

    res.json({
      total_critico: bajos.length,
      items: bajos.map(i => ({
        id: i.id,
        nombre: i.nombre,
        cantidad: i.cantidad,
        stockMinimo: i.stockMinimo,
        urgencia: i.cantidad === 0 ? 'CRÍTICA' : 'BAJA',
        proveedor: i.proveedor
      }))
    });
  } catch (error) {
    console.error('Error alertasInventario:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== ESTADÍSTICAS Y DASHBOARD ====================

// 📊 DASHBOARD RECEPCIONISTA - Resumen diario
exports.getDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const [citasHoy, completadas, pendientes, canceladas, stockBajo, deudaPendiente] = await Promise.all([
      Cita.count({ 
        where: { 
          fecha: { [Op.between]: [hoy, manana] } 
        } 
      }),
      Cita.count({ 
        where: { 
          estado: 'completada', 
          fecha: { [Op.between]: [hoy, manana] } 
        } 
      }),
      Cita.count({ 
        where: { 
          estado: 'pendiente', 
          fecha: { [Op.between]: [hoy, manana] } 
        } 
      }),
      Cita.count({ 
        where: { 
          estado: 'cancelada', 
          fecha: { [Op.between]: [hoy, manana] } 
        } 
      }),
      Inventario.count({ 
        where: sequelize.where(
          sequelize.col('cantidad'), 
          Op.lte, 
          sequelize.col('stockMinimo')
        ) 
      }),
      Factura.sum('total', {
        where: { estado: 'pendiente' }
      })
    ]);

    const tasaCompletacion = citasHoy > 0 
      ? Math.round((completadas / citasHoy) * 100) 
      : 0;

    res.json({
      resumen: {
        citasHoy,
        completadas,
        pendientes,
        canceladas,
        tasaCompletacion: `${tasaCompletacion}%`
      },
      alertas: {
        stockBajo,
        deudaPendiente: deudaPendiente || 0
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error getDashboard:', error);
    res.status(500).json({ error: error.message });
  }
};

// 📈 ESTADÍSTICAS GENERALES
exports.getEstadisticas = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);

    const citasHoy = await Cita.count({
      where: {
        fecha: { [Op.gte]: hoy, [Op.lt]: manana }
      }
    });

    const citasPendientes = await Cita.count({
      where: {
        fecha: { [Op.gte]: hoy, [Op.lt]: manana },
        estado: 'pendiente'
      }
    });

    const citasCompletadas = await Cita.count({
      where: {
        fecha: { [Op.gte]: hoy, [Op.lt]: manana },
        estado: 'completada'
      }
    });

    const citasCanceladas = await Cita.count({
      where: {
        fecha: { [Op.gte]: hoy, [Op.lt]: manana },
        estado: 'cancelada'
      }
    });

    res.json({
      citasHoy,
      citasPendientes,
      citasCompletadas,
      citasCanceladas,
      tasaCompletacion: citasHoy > 0 ? Math.round((citasCompletadas / citasHoy) * 100) : 0
    });
  } catch (error) {
    console.error('Error getEstadisticas:', error);
    res.status(500).json({ error: error.message });
  }
};

// ==================== COMUNICACIÓN ====================

// 📱 CONFIRMACIÓN CLIENTE: WhatsApp (placeholder)
exports.confirmarClienteWhatsApp = async (req, res) => {
  try {
    const { citaId, clientePhone } = req.body;

    const cita = await Cita.findByPk(citaId, {
      include: [
        {
          model: Animal,
          as: 'animal',
          include: [{ model: Usuario, as: 'propietario' }]
        }
      ]
    });

    if (!cita) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }

    // Mensaje de confirmación
    const mensaje = `Hola ${cita.animal?.propietario?.nombre || 'cliente'}, tu cita para ${cita.animal?.nombre || 'tu mascota'} está confirmada para hoy a las ${new Date(cita.fecha).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}. ¡Te esperamos en DG Mascotas! 🐾`;

    // TODO: Integrar Twilio WhatsApp API
    // const twilioClient = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await twilioClient.messages.create({
    //   body: mensaje,
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to: `whatsapp:${clientePhone}`
    // });

    console.log('📱 Mensaje WhatsApp (simulado):', mensaje);
    console.log('📱 Destinatario:', clientePhone);

    res.json({ 
      mensaje: 'Confirmación enviada por WhatsApp (simulado)', 
      citaId,
      texto: mensaje,
      destinatario: clientePhone
    });
  } catch (error) {
    console.error('Error confirmarClienteWhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
};
