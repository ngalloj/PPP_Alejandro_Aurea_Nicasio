// backend/controllers/invoiceCtrl.js
// Facturación automática integrada con inventario

const { Invoice, Inventory, Cita, Op } = require('../models');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateInvoiceNumber = async () => {
  const lastInvoice = await Invoice.findOne({
    order: [['id', 'DESC']]
  });
  const nextNumber = (lastInvoice?.id || 0) + 1;
  const date = new Date();
  return `DGM-${date.getFullYear()}-${String(nextNumber).padStart(5, '0')}`;
};

exports.createFromAppointment = async (req, res) => {
  try {
    const { citaId, items } = req.body; // items: [{inventoryId, qty, price}]
    
    const cita = await Cita.findByPk(citaId, { include: ['Animal', 'Usuario'] });
    if (!cita) return res.status(404).json({ error: 'Cita no encontrada' });
    
    let total = 0;
    const invoiceItems = [];
    
    // Consumir inventario y calcular total
    for (const item of items) {
      const inv = await Inventory.findByPk(item.inventoryId);
      if (!inv) return res.status(404).json({ error: `Producto ${item.inventoryId} no encontrado` });
      
      if (inv.stock < item.qty) {
        return res.status(400).json({ error: `Stock insuficiente: ${inv.name}` });
      }
      
      inv.stock -= item.qty;
      inv.soldUnits = (inv.soldUnits || 0) + item.qty;
      await inv.save();
      
      total += item.qty * item.price;
      invoiceItems.push({ ...item, name: inv.name });
    }
    
    // Generar número de factura
    const number = await generateInvoiceNumber();
    
    // Crear factura
    const invoice = await Invoice.create({
      number,
      citaId,
      userId: cita.usuarioDni,  // Cliente dueño mascota
      total,
      items: invoiceItems,
      paymentMethod: 'efectivo'
    });
    
    // Generar PDF
    const pdfPath = `${path.join(__dirname, '../uploads')}/invoice-${number}.pdf`;
    await generatePDF(invoice, invoiceItems, cita, pdfPath);
    invoice.pdfUrl = `/uploads/invoice-${number}.pdf`;
    await invoice.save();
    
    res.status(201).json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// backend/controllers/invoiceCtrl.js - CONTINUACIÓN COMPLETA

const generatePDF = async (invoice, items, cita, filepath) => {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ bufferPages: true });
        const stream = fs.createWriteStream(filepath);
        
        doc.pipe(stream);
        
        // Header
        doc.fontSize(25).text('DG MASCOTAS', { align: 'center' }).moveDown();
        doc.fontSize(12).text('Factura de Servicios Veterinarios', { align: 'center' });
        doc.fontSize(10).text(`Factura No. ${invoice.number}`, { align: 'center' }).moveDown();
        
        // Fecha
        doc.fontSize(10).text(`Fecha: ${new Date(invoice.issuedAt).toLocaleDateString('es-ES')}`).moveDown();
        
        // Datos cliente
        doc.fontSize(12).text('CLIENTE:', { underline: true });
        doc.fontSize(10).text(`Nombre: ${cita.Animal.nombre_animal}`);
        doc.text(`Propietario: ${cita.Usuario.email}`).moveDown();
        
        // Tabla de items
        doc.fontSize(12).text('SERVICIOS Y PRODUCTOS:', { underline: true }).moveDown();
        
        let y = doc.y;
        doc.fontSize(10).text('Descripción', 50, y).text('Cantidad', 300, y).text('Precio Unit.', 380, y).text('Total', 480, y);
        doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke();
        doc.moveDown();
        
        items.forEach(item => {
          const itemTotal = item.qty * item.price;
          doc.text(item.name, 50).text(item.qty.toString(), 300).text(`€${item.price.toFixed(2)}`, 380).text(`€${itemTotal.toFixed(2)}`, 480);
        });
        
        doc.moveTo(50, doc.y + 5).lineTo(550, doc.y + 5).stroke().moveDown();
        
        // Total
        doc.fontSize(14).text(`TOTAL: €${invoice.total.toFixed(2)}`, { align: 'right' }).moveDown();
        
        // Footer
        doc.fontSize(8).text('Gracias por confiar en DG Mascotas', { align: 'center' });
        
        doc.end();
        
        stream.on('finish', resolve);
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  };
  
  exports.getAll = async (req, res) => {
    try {
      const invoices = await Invoice.findAll({
        include: ['Cita', 'Usuario'],
        order: [['createdAt', 'DESC']]
      });
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.getById = async (req, res) => {
    try {
      const invoice = await Invoice.findByPk(req.params.id, { include: ['Cita', 'Usuario'] });
      if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  exports.updatePaymentStatus = async (req, res) => {
    try {
      const { status, paymentMethod } = req.body;
      const invoice = await Invoice.findByPk(req.params.id);
      if (!invoice) return res.status(404).json({ error: 'Factura no encontrada' });
      
      invoice.status = status;
      if (paymentMethod) invoice.paymentMethod = paymentMethod;
      await invoice.save();
      
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  