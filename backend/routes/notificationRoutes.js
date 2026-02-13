const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/user/:usuarioId', verifyToken, notificationController.getAllNotifications);
router.get('/user/:usuarioId/unread', verifyToken, notificationController.getUnreadNotifications);
router.post('/', verifyToken, notificationController.createNotification);
router.put('/:id/read', verifyToken, notificationController.markAsRead);
router.put('/user/:usuarioId/read-all', verifyToken, notificationController.markAllAsRead);
router.delete('/:id', verifyToken, notificationController.deleteNotification);

module.exports = router;
