// backend/controllers/inventario.controller.js
// CRUD Inventario: crear, listar, actualizar, eliminar, reportes

const { Inventario, Op } = require('../models');

// GET - Listar inventario con filtros
exports.getAll = async (req, res) => {
  try {
    const { categoria, bajoStock, page = 1, limit = 10 } = req.query;
    let where = {};

    if (categoria) where.categoria = categoria;
    if (bajoStock === 'true') {
      where = sequelize.where(sequelize.col('stock'), Op.lte, sequelize.col('minStock'));
    }

    const offset = (page - 1) * limit;
    const { count, rows } = await Inventario.findAndCountAll({
      where,
      order: [['nombre', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      page: parseInt(page),
      items: rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST - Crear producto
exports.create = async (req, res) => {
  try {
    const { nombre, categoria, stock, minStock, precio, unidad } = req.body;

    if (!nombre || !precio || stock === undefined) {
      return res.status(400).json({ error: 'Campos requeridos: nombre, precio, stock' });
    }

    const item = await Inventario.create({
      nombre,
      categoria: categoria || 'general',
      stock: parseInt(stock),
      minStock: parseInt(minStock) || 5,
      precio: parseFloat(precio),
      unidad: unidad || 'unidad'
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET - Ver un producto
exports.getById = async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT - Actualizar producto
exports.update = async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// POST - Reducir stock (al consumir en cita)
exports.consumir = async (req, res) => {
  try {
    const { cantidad } = req.body;
    if (!cantidad || cantidad <= 0) {
      return res.status(400).json({ error: 'Cantidad debe ser > 0' });
    }

    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    
    if (item.stock < cantidad) {
      return res.status(400).json({ error: `Stock insuficiente. Disponible: ${item.stock}` });
    }

    item.stock -= cantidad;
    item.unidadesVendidas = (item.unidadesVendidas || 0) + cantidad;
    await item.save();

    // Alerta si stock bajo
    if (item.stock <= item.minStock) {
      console.log(`⚠️ ALERTA: Stock bajo para ${item.nombre} (${item.stock} unidades)`);
    }

    res.json({
      mensaje: 'Stock actualizado',
      producto: item.nombre,
      stockAnterior: item.stock + cantidad,
      stockActual: item.stock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST - Reponer stock
exports.reponer = async (req, res) => {
  try {
    const { cantidad } = req.body;
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });

    item.stock += parseInt(cantidad);
    await item.save();

    res.json({
      mensaje: 'Stock repuesto',
      producto: item.nombre,
      stockActual: item.stock
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE - Eliminar producto
exports.delete = async (req, res) => {
  try {
    const item = await Inventario.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });

    await item.destroy();
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📊 REPORTES
exports.reporteStock = async (req, res) => {
  try {
    const items = await Inventario.findAll({
      order: [['stock', 'ASC']],
      attributes: ['nombre', 'stock', 'minStock', 'categoria', 'precio', 'unidadesVendidas']
    });

    const resumen = {
      totalProductos: items.length,
      stockCritico: items.filter(i => i.stock <= i.minStock).length,
      sinStock: items.filter(i => i.stock === 0).length,
      valorTotalInventario: items.reduce((sum, i) => sum + (i.stock * i.precio), 0),
      items
    };

    res.json(resumen);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
