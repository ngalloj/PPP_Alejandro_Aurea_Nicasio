const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { auth } = require('../middlewares/auth');

router.get('/user/:usuarioId', auth, notificationController.getAllNotifications);
router.get('/user/:usuarioId/unread', auth, notificationController.getUnreadNotifications);
router.post('/', auth, notificationController.createNotification);
router.put('/:id/read', auth, notificationController.markAsRead);
router.put('/user/:usuarioId/read-all', auth, notificationController.markAllAsRead);
router.delete('/:id', auth, notificationController.deleteNotification);

module.exports = router;
