// backend/routes/cita.routes.js
const express = require('express');
const router = express.Router();
const citaController = require('../controllers/cita.controller');
const { auth, allowRoles } = require('../middlewares/auth');
const { validarCampos, validarCita } = require('../middlewares/validators');

// Rutas públicas
router.get('/', auth, citaController.getAll);
router.get('/:id', auth, citaController.getById);

// Rutas protegidas (requieren login/JWT)
router.post('/', auth, validarCita, validarCampos, citaController.create);
router.put('/:id', auth, validarCita, validarCampos, citaController.update);
router.delete('/:id', auth, allowRoles(['admin', 'recepcionista']), citaController.delete);

module.exports = router;
