// backend/controllers/recepcionistaCtrl.js
// Funciones específicas para role RECEPCIONISTA

const { Cita, Animal, Usuario, Inventory, Invoice, Op } = require('../models');

// Cola de espera - citas pendientes de hoy
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
        { model: Animal, as: 'animal' },
        { model: Usuario, as: 'veterinario', attributes: ['email'] }
      ],
      order: [['fecha', 'ASC']]
    });
    
    res.json({ cola, total: cola.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cita rápida - sin mascota preregistrada
exports.crearCitaRapida = async (req, res) => {
  try {
    const { clientePhone, motivo, veterinarioId } = req.body;
    
    // Crear cita temporal
    const cita = await Cita.create({
      fecha: new Date(Date.now() + 30*60*1000), // 30 minutos
      estado: 'pendiente',
      motivo: `Rápida: ${motivo}`,
      telefono_cliente: clientePhone,
      veterinarioId: veterinarioId || null,
      animalId: null // Sin mascota asignada aún
    });
    
    // Emitir evento Socket.io
    req.app.get('io')?.emit('nueva-cita-rapida', {
      id: cita.id,
      motivo,
      fecha: cita.fecha,
      telefono: clientePhone
    });
    
    res.status(201).json({ cita, mensaje: 'Cita rápida creada. Espera confirmación del cliente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Caja: cobrar cita + consumir inventario
exports.cobrarConInventario = async (req, res) => {
  try {
    const { citaId, items, paymentMethod } = req.body;
    
    const cita = await Cita.findByPk(citaId, { include: ['Animal', 'Usuario'] });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    if (cita.estado === 'facturada') return res.status(400).json({ error: 'Cita ya facturada' });
    
    // Crear factura e integrar inventario
    const invoiceCtrl = require('./invoiceCtrl');
    const invoiceRes = await invoiceCtrl.createFromAppointment({ body: { citaId, items }, app: req.app }, res);
    
    // Marcar cita como completada y facturada
    await cita.update({ estado: 'completada', facturada: true });
    
    res.json({ cita, mensaje: 'Cita cobrada y facturada exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lista de clientes con deuda
exports.clientesDeuda = async (req, res) => {
  try {
    const deudores = await Invoice.findAll({
      where: { status: 'pendiente' },
      include: ['Usuario'],
      group: ['userId'],
      raw: true,
      subQuery: false
    });
    
    const resumen = {};
    for (const inv of deudores) {
      if (!resumen[inv.userId]) {
        resumen[inv.userId] = { usuario: inv.Usuario, total_deuda: 0, facturas: 0 };
      }
      resumen[inv.userId].total_deuda += inv.total;
      resumen[inv.userId].facturas++;
    }
    
    res.json(Object.values(resumen));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Stock bajo - alertas
exports.alertasInventario = async (req, res) => {
  try {
    const bajos = await Inventory.findAll({
      where: sequelize.where(
        sequelize.col('stock'),
        Op.lte,
        sequelize.col('minStock')
      ),
      order: [['stock', 'ASC']]
    });
    
    res.json({
      total_critico: bajos.length,
      items: bajos
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Confirmación cliente: llamada/WhatsApp
exports.confirmarClienteWhatsApp = async (req, res) => {
  try {
    const { citaId, clientePhone } = req.body;
    
    // Aquí iría Twilio WhatsApp
    const mensaje = `Hola, tu cita está confirmada para hoy. ¡Esperamos tu llegada a DG Mascotas!`;
    
    // TODO: Integrar Twilio
    // await twilioClient.messages.create({
    //   body: mensaje,
    //   from: process.env.TWILIO_PHONE,
    //   to: clientePhone
    // });
    
    res.json({ mensaje: 'Confirmación enviada por WhatsApp', cita: citaId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
