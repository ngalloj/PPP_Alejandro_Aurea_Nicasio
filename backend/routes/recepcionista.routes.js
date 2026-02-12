// backend/routes/recepcionista.routes.js

const express = require('express');
const router = express.Router();
const recepcionistaCtrl = require('../controllers/recepcionista.controller');
const { auth, roleAuth } = require('../middlewares/auth');

router.use(auth);
router.use(roleAuth('recepcionista', 'admin'));

// Cola y citas
router.get('/cola-espera', recepcionistaCtrl.getColaEspera);
router.post('/cita-rapida', recepcionistaCtrl.crearCitaRapida);
router.post('/cobrar', recepcionistaCtrl.cobrarConInventario);

// Reportes
router.get('/deudores', recepcionistaCtrl.clientesDeuda);
router.get('/alertas-inventario', recepcionistaCtrl.alertasInventario);
router.get('/dashboard', recepcionistaCtrl.getDashboard);

module.exports = router;
