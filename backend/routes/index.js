// backend/routes/index.js
const express = require('express');
const router = express.Router();

const animalController = require('../controllers/animal.controller');
const usuarioController = require('../controllers/usuario.controller');
const citaController = require('../controllers/cita.controller');
const { auth, requireRole, allowRoles } = require('../middlewares/auth');
const { validarCampos, validarAnimal, validarUsuario, validarCita } = require('../middlewares/validators');

// --- Animales ---
router.get('/animales', auth, animalController.getAll);
router.get('/animales/:id', auth, animalController.getById);
router.post('/animales', auth, validarAnimal, validarCampos, animalController.create);
router.put('/animales/:id', auth, validarAnimal, validarCampos, animalController.update);
// ✅ Solo admin y veterinario pueden eliminar
router.delete('/animales/:id', auth, allowRoles(['admin', 'veterinario']), animalController.delete);

// --- Usuarios CRUD ---
router.get('/usuarios', auth, usuarioController.getAll);
router.get('/usuarios/:id', auth, usuarioController.getById);
// ✅ Crear: todos menos cliente (validación en controller)
router.post('/usuarios', auth, validarUsuario, validarCampos, usuarioController.create);
// ✅ Modificar: solo admin y veterinario (validación en controller)
router.put('/usuarios/:id', auth, validarUsuario, validarCampos, usuarioController.update);
// ✅ Eliminar: solo admin y veterinario (validación en controller)
router.delete('/usuarios/:id', auth, usuarioController.delete);

// --- Citas ---
router.get('/citas', auth, citaController.getAll);
router.get('/citas/:id', auth, citaController.getById);
router.post('/citas', auth, validarCita, validarCampos, citaController.create);
router.put('/citas/:id', auth, validarCita, validarCampos, citaController.update);
// ✅ Solo admin, veterinario y recepcionista pueden eliminar
router.delete('/citas/:id', auth, allowRoles(['admin', 'veterinario', 'recepcionista']), citaController.delete);

module.exports = router;
