const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, reminderController.getAllReminders);
router.get('/user/:usuarioId', verifyToken, reminderController.getRemindersByUser);
router.get('/pending', verifyToken, reminderController.getPendingReminders);
router.post('/', verifyToken, checkRole(['veterinario', 'recepcionista', 'administrador']), reminderController.createReminder);
router.put('/:id', verifyToken, checkRole(['veterinario', 'recepcionista', 'administrador']), reminderController.updateReminder);
router.put('/:id/complete', verifyToken, reminderController.markAsCompleted);
router.delete('/:id', verifyToken, checkRole(['veterinario', 'recepcionista', 'administrador']), reminderController.deleteReminder);

module.exports = router;
