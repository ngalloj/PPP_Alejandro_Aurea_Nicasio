// backend/routes/factura.routes.js

const express = require('express');
const router = express.Router();
const facturaCtrl = require('../controllers/factura.controller');
const { auth, roleAuth } = require('../middlewares/auth');

router.use(auth);

// CRUD
router.get('/', facturaCtrl.getAll);
router.get('/:id', facturaCtrl.getById);
router.post('/crear-desde-cita', roleAuth('recepcionista', 'admin'), facturaCtrl.crearDesdeCita);
router.put('/:id/marcar-pagada', roleAuth('recepcionista', 'admin'), facturaCtrl.marcarPagada);

// Reportes
router.get('/reportes/periodo', facturaCtrl.reportePeriodo);

module.exports = router;
