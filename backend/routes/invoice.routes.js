// backend/routes/invoice.routes.js

const express = require('express');
const router = express.Router();
const invoiceCtrl = require('../controllers/invoiceCtrl');
const { auth, roleAuth } = require('../middlewares/auth');

router.use(auth);

// GET
router.get('/', invoiceCtrl.getAll);
router.get('/:id', invoiceCtrl.getById);

// POST - Crear desde cita
router.post('/from-appointment', roleAuth('recepcionista', 'veterinario'), invoiceCtrl.createFromAppointment);

// PUT - Actualizar estado pago
router.put('/:id/payment', roleAuth('recepcionista', 'admin'), invoiceCtrl.updatePaymentStatus);

module.exports = router;
