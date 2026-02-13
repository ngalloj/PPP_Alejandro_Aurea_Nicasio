const express = require('express');
const router = express.Router();
const reminderController = require('../controllers/reminderController');
const { auth, roleAuth } = require('../middlewares/auth');

router.get('/', auth, reminderController.getAllReminders);
router.get('/user/:usuarioId', auth, reminderController.getRemindersByUser);
router.get('/pending', auth, reminderController.getPendingReminders);
router.post('/', auth, roleAuth('veterinario', 'recepcionista', 'admin'), reminderController.createReminder);
router.put('/:id', auth, roleAuth('veterinario', 'recepcionista', 'admin'), reminderController.updateReminder);
router.put('/:id/complete', auth, reminderController.markAsCompleted);
router.delete('/:id', auth, roleAuth('veterinario', 'recepcionista', 'admin'), reminderController.deleteReminder);

module.exports = router;
