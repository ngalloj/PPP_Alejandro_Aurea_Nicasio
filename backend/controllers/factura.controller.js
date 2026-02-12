// backend/controllers/factura.controller.js
// Facturación: crear, listar, pagar, reportes, PDF

const { Factura, Cita, Inventario, Usuario, Op, sequelize } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generar número factura único
const generarNumeroFactura = async () => {
  const fecha = new Date();
  const año = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const ultima = await Factura.max('id') || 0;
  return `DGM-${año}${mes}-${String(ultima + 1).padStart(5, '0')}`;
};

// POST - Crear factura desde cita
exports.crearDesdeC ita = async (req, res) => {
  try {
    const { citaId, items, metodoPago } = req.body;
    // items: [{inventoryId, cantidad, precio, nombre}]

    const cita = await Cita.findByPk(citaId, { include: [Animal, Usuario] });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });

    let total = 0;
    const itemsFactura = [];

    // Consumir inventario
    for (const item of items) {
      const inv = await Inventario.findByPk(item.inventoryId);
      if (!inv) continue;

      if (inv.stock >= item.cantidad) {
        inv.stock -= item.cantidad;
        await inv.save();
      }

      total += item.cantidad * item.precio;
      itemsFactura.push({
        nombre: item.nombre || inv.nombre,
        cantidad: item.cantidad,
        precio: item.precio,
        subtotal: item.cantidad * item.precio
      });
    }

    // Crear factura
    const numero = await generarNumeroFactura();
    const factura = await Factura.create({
      numero,
      citaId,
      usuarioId: cita.usuarioId,
      total,
      items: itemsFactura,
      metodoPago: metodoPago || 'efectivo',
      estado: 'pagada'
    });

    // Generar PDF
    const pdfPath = await generarPDF(factura, itemsFactura);
    factura.urlPdf = `/facturas/${path.basename(pdfPath)}`;
    await factura.save();

    res.status(201).json({
      mensaje: 'Factura creada',
      factura,
      pdfUrl: factura.urlPdf
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generar PDF con pdfkit
const generarPDF = (factura, items) => {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.join(__dirname, '../public/facturas');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filename = path.join(dir, `factura-${factura.numero}.pdf`);
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(filename);

      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('DG MASCOTAS', { align: 'center' });
      doc.fontSize(14).text('Factura de Servicios Veterinarios', { align: 'center' }).moveDown();
      doc.fontSize(12).text(`Factura No. ${factura.numero}`, { align: 'center' });
      doc.fontSize(10).text(`Fecha: ${new Date(factura.createdAt).toLocaleDateString('es-ES')}`).moveDown();

      // Tabla items
      doc.text('CONCEPTO', 50, 150);
      doc.text('CANTIDAD', 250, 150);
      doc.text('PRECIO', 350, 150);
      doc.text('SUBTOTAL', 450, 150);
      doc.moveTo(40, 165).lineTo(550, 165).stroke();

      let y = 180;
      items.forEach(item => {
        doc.text(item.nombre, 50, y);
        doc.text(item.cantidad.toString(), 250, y);
        doc.text(`€${item.precio.toFixed(2)}`, 350, y);
        doc.text(`€${item.subtotal.toFixed(2)}`, 450, y);
        y += 20;
      });

      doc.moveTo(40, y).lineTo(550, y).stroke();
      doc.fontSize(14).text(`TOTAL: €${factura.total.toFixed(2)}`, 350, y + 20, { align: 'right' });

      // Footer
      doc.fontSize(8).text('Gracias por tu confianza', { align: 'center' });
      doc.end();

      stream.on('finish', () => resolve(filename));
      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// GET - Listar facturas
exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10, estado } = req.query;
    let where = {};
    if (estado) where.estado = estado;

    const offset = (page - 1) * limit;
    const { count, rows } = await Factura.findAndCountAll({
      where,
      include: [Cita, Usuario],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      facturas: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET - Ver factura
exports.getById = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id, {
      include: [Cita, Usuario]
    });
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT - Marcar como pagada
exports.marcarPagada = async (req, res) => {
  try {
    const factura = await Factura.findByPk(req.params.id);
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' });

    await factura.update({
      estado: 'pagada',
      metodoPago: req.body.metodoPago || factura.metodoPago
    });

    res.json({ mensaje: 'Factura marcada como pagada', factura });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 REPORTES
exports.reportePeriodo = async (req, res) => {
  try {
    const { desde, hasta } = req.query;
    let where = {};
    if (desde || hasta) {
      where.createdAt = {};
      if (desde) where.createdAt[Op.gte] = new Date(desde);
      if (hasta) where.createdAt[Op.lte] = new Date(hasta);
    }

    const facturas = await Factura.findAll({ where });
    const resumen = {
      periodo: { desde: desde || 'inicio', hasta: hasta || 'hoy' },
      totalFacturas: facturas.length,
      ingresoTotal: facturas.reduce((sum, f) => sum + parseFloat(f.total), 0),
      facturasPromedio: (facturas.reduce((sum, f) => sum + parseFloat(f.total), 0) / facturas.length).toFixed(2),
      metodoPago: {},
      facturas
    };

    // Contar por método de pago
    facturas.forEach(f => {
      resumen.metodoPago[f.metodoPago] = (resumen.metodoPago[f.metodoPago] || 0) + 1;
    });

    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
