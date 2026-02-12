// backend/routes/inventario.routes.js

const express = require('express');
const router = express.Router();
const inventarioCtrl = require('../controllers/inventario.controller');
const { auth, roleAuth } = require('../middlewares/auth');

router.use(auth);

// CRUD
router.get('/', inventarioCtrl.getAll);
router.post('/', roleAuth('admin', 'recepcionista'), inventarioCtrl.create);
router.get('/:id', inventarioCtrl.getById);
router.put('/:id', roleAuth('admin', 'recepcionista'), inventarioCtrl.update);
router.delete('/:id', roleAuth('admin'), inventarioCtrl.delete);

// Operaciones
router.post('/:id/consumir', roleAuth('veterinario', 'recepcionista'), inventarioCtrl.consumir);
router.post('/:id/reponer', roleAuth('admin', 'recepcionista'), inventarioCtrl.reponer);

// Reportes
router.get('/reportes/stock', inventarioCtrl.reporteStock);

module.exports = router;
