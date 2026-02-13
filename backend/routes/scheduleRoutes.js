const express = require('express');
const router = express.Router();
const { Schedule, Employee } = require('../models');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      include: [{ model: Employee, as: 'employee', attributes: ['id', 'nombre', 'apellidos', 'puesto'] }]
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/employee/:employeeId', verifyToken, async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      where: { employeeId: req.params.employeeId },
      order: [['diaSemana', 'ASC']]
    });
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const schedule = await Schedule.create(req.body);
    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Horario no encontrado' });
    await schedule.update(req.body);
    res.json(schedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', verifyToken, checkRole(['administrador']), async (req, res) => {
  try {
    const schedule = await Schedule.findByPk(req.params.id);
    if (!schedule) return res.status(404).json({ error: 'Horario no encontrado' });
    await schedule.destroy();
    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
