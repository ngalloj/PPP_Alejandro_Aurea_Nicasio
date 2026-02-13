const { Reminder, Animal, Usuario } = require('../models');

exports.getAllReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Usuario, as: 'usuario', attributes: ['id', 'username', 'email'] }
      ],
      order: [['fechaRecordatorio', 'ASC']]
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRemindersByUser = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { usuarioId: req.params.usuarioId },
      include: [{ model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] }],
      order: [['fechaRecordatorio', 'ASC']]
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPendingReminders = async (req, res) => {
  try {
    const reminders = await Reminder.findAll({
      where: { estado: 'pendiente' },
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Usuario, as: 'usuario', attributes: ['id', 'username', 'email'] }
      ],
      order: [['fechaRecordatorio', 'ASC']]
    });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Recordatorio no encontrado' });
    await reminder.update(req.body);
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAsCompleted = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Recordatorio no encontrado' });
    await reminder.update({
      completado: true,
      fechaCompletado: new Date(),
      estado: 'completado',
      notasCompletado: req.body.notasCompletado
    });
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Recordatorio no encontrado' });
    await reminder.destroy();
    res.json({ message: 'Recordatorio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
