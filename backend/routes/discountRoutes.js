const express = require('express');
const router = express.Router();
const { Discount } = require('../models');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');
const { Op } = require('sequelize');

router.get('/', verifyToken, async (req, res) => {
  try {
    const discounts = await Discount.findAll({ order: [['createdAt', 'DESC']] });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/active', verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const discounts = await Discount.findAll({
      where: {
        estado: 'activo',
        fechaInicio: { [Op.lte]: now },
        fechaFin: { [Op.gte]: now }
      }
    });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/validate/:codigo', verifyToken, async (req, res) => {
  try {
    const now = new Date();
    const discount = await Discount.findOne({
      where: {
        codigo: req.params.codigo,
        estado: 'activo',
        fechaInicio: { [Op.lte]: now },
        fechaFin: { [Op.gte]: now }
      }
    });
    
    if (!discount) {
      return res.status(404).json({ error: 'Código de descuento no válido o expirado' });
    }
    
    if (discount.usoMaximo && discount.vecesUsado >= discount.usoMaximo) {
      return res.status(400).json({ error: 'Código de descuento agotado' });
    }
    
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const discount = await Discount.create(req.body);
    res.status(201).json(discount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    if (!discount) return res.status(404).json({ error: 'Descuento no encontrado' });
    await discount.update(req.body);
    res.json(discount);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    if (!discount) return res.status(404).json({ error: 'Descuento no encontrado' });
    await discount.destroy();
    res.json({ message: 'Descuento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
