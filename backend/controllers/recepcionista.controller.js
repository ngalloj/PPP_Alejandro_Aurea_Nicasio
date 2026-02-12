// backend/controllers/recepcionista.controller.js
// Funciones para RECEPCIONISTA: Cola espera, citas rápidas, cobro

const { Cita, Animal, Usuario, Inventario, Factura, Op, sequelize } = require('../models');

// 📋 COLA DE ESPERA - Citas pendientes de hoy
exports.getColaEspera = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const cola = await Cita.findAll({
      where: {
        estado: 'pendiente',
        fecha: { [Op.between]: [hoy, mañana] }
      },
      include: [
        { 
          model: Animal,
          include: [{ model: Usuario, attributes: ['email', 'nombre_usuario', 'telefono'] }]
        },
        { model: Usuario, as: 'veterinario', attributes: ['email', 'nombre_usuario'] }
      ],
      order: [['fecha', 'ASC']]
    });

    res.json({
      total: cola.length,
      cola,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⚡ CITA RÁPIDA - Sin mascota preregistrada
exports.crearCitaRapida = async (req, res) => {
  try {
    const { telefonoCliente, motivo, nombreCliente } = req.body;

    const cita = await Cita.create({
      fecha: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
      estado: 'pendiente',
      motivo: `RÁPIDA: ${motivo}`,
      telefono_cliente: telefonoCliente,
      nombre_cliente: nombreCliente,
      veterinarioId: null,
      animalId: null
    });

    res.status(201).json({
      mensaje: 'Cita rápida creada',
      cita,
      aviso: 'Cliente será contactado para confirmar'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 💰 COBRAR + CONSUMIR INVENTARIO
exports.cobrarConInventario = async (req, res) => {
  try {
    const { citaId, items, metodoPago } = req.body;
    // items: [{inventoryId, cantidad, precio}]

    const cita = await Cita.findByPk(citaId, {
      include: [Animal, { model: Usuario, as: 'veterinario' }]
    });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    if (cita.estado === 'completada') return res.status(400).json({ error: 'Cita ya completada' });

    let total = 0;
    const itemsConsumo = [];

    // Consumir inventario
    for (const item of items) {
      const inv = await Inventario.findByPk(item.inventoryId);
      if (!inv) return res.status(404).json({ error: `Producto ${item.inventoryId} no encontrado` });
      
      if (inv.stock < item.cantidad) {
        return res.status(400).json({ error: `Stock insuficiente: ${inv.nombre}` });
      }

      inv.stock -= item.cantidad;
      inv.unidadesVendidas = (inv.unidadesVendidas || 0) + item.cantidad;
      await inv.save();

      total += item.cantidad * item.precio;
      itemsConsumo.push({
        nombre: inv.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.cantidad * item.precio
      });
    }

    // Marcar cita completada
    await cita.update({ estado: 'completada' });

    res.json({
      mensaje: 'Cita cobrada y completada',
      cita: { id: cita.id, fecha: cita.fecha, animal: cita.Animal.nombre },
      detalles: {
        items: itemsConsumo,
        total,
        metodoPago,
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 👥 CLIENTES CON DEUDA
exports.clientesDeuda = async (req, res) => {
  try {
    const deudores = await sequelize.query(`
      SELECT DISTINCT 
        u.id, 
        u.email, 
        u.nombre_usuario,
        COUNT(f.id) as facturas_pendientes,
        COALESCE(SUM(f.total), 0) as total_deuda
      FROM "Usuarios" u
      LEFT JOIN "Facturas" f ON u.id = f.usuario_id AND f.estado = 'pendiente'
      WHERE f.estado = 'pendiente'
      GROUP BY u.id, u.email, u.nombre_usuario
      ORDER BY total_deuda DESC
    `, { type: sequelize.QueryTypes.SELECT });

    res.json({
      total_clientes_deuda: deudores.length,
      clientes: deudores
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ⚠️ ALERTAS INVENTARIO - Stock bajo
exports.alertasInventario = async (req, res) => {
  try {
    const bajos = await Inventario.findAll({
      where: sequelize.where(
        sequelize.col('stock'),
        Op.lte,
        sequelize.col('minStock')
      ),
      order: [['stock', 'ASC']]
    });

    res.json({
      total_critico: bajos.length,
      items: bajos.map(i => ({
        id: i.id,
        nombre: i.nombre,
        stock: i.stock,
        minStock: i.minStock,
        urgencia: i.stock === 0 ? 'CRÍTICA' : 'BAJA'
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 DASHBOARD RECEPCIONISTA - Resumen diario
exports.getDashboard = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const [citasHoy, completadas, stockBajo] = await Promise.all([
      Cita.count({ where: { fecha: { [Op.between]: [hoy, mañana] } } }),
      Cita.count({ where: { estado: 'completada', fecha: { [Op.between]: [hoy, mañana] } } }),
      Inventario.count({ where: sequelize.where(sequelize.col('stock'), Op.lte, sequelize.col('minStock')) })
    ]);

    res.json({
      citasHoy,
      completadas,
      pendientes: citasHoy - completadas,
      tasaCompletacion: Math.round((completadas / citasHoy * 100) || 0),
      alertasInventario: stockBajo,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
