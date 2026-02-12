// backend/controllers/inventoryCtrl.js
// Gestión completa de inventario

const { Inventory, Op } = require('../models');

exports.getAll = async (req, res) => {
  try {
    const { category, lowStock } = req.query;
    let where = {};
    
    if (category) where.category = category;
    if (lowStock === 'true') {
      where[Op.where] = sequelize.where(
        sequelize.col('stock'),
        Op.lte,
        sequelize.col('minStock')
      );
    }

    const items = await Inventory.findAll({ where, order: [['stock', 'ASC']] });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { name, category, stock, minStock, price, unit } = req.body;
    const item = await Inventory.create({ name, category, stock, minStock, price, unit });
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    
    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.reduceStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    
    const item = await Inventory.findByPk(id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    
    if (item.stock < quantity) {
      return res.status(400).json({ error: 'Stock insuficiente' });
    }
    
    item.stock -= quantity;
    item.soldUnits = (item.soldUnits || 0) + quantity;
    await item.save();
    
    // Alerta si stock bajo
    if (item.stock <= item.minStock) {
      // Emitir Socket.io event a recepcionistas
      req.app.get('io')?.emit('inventory:low-stock', { item: item.toJSON() });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const item = await Inventory.findByPk(req.params.id);
    if (!item) return res.status(404).json({ error: 'Producto no encontrado' });
    
    await item.destroy();
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
