const { Notification, Usuario } = require('../models');

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { usuarioId: req.params.usuarioId },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { usuarioId: req.params.usuarioId, leida: false },
      order: [['createdAt', 'DESC']]
    });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    await notification.update({ leida: true, fechaLectura: new Date() });
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { leida: true, fechaLectura: new Date() },
      { where: { usuarioId: req.params.usuarioId, leida: false } }
    );
    res.json({ message: 'Todas las notificaciones marcadas como leídas' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification) return res.status(404).json({ error: 'Notificación no encontrada' });
    await notification.destroy();
    res.json({ message: 'Notificación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
