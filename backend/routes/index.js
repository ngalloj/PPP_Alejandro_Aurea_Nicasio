// backend/routes/index.js
const express = require('express');
const router = express.Router();

const animalController = require('../controllers/animal.controller');
const usuarioController = require('../controllers/usuario.controller');
const citaController = require('../controllers/cita.controller');
const { auth, requireRole, allowRoles } = require('../middlewares/auth');
const { validarCampos, validarAnimal, validarUsuario, validarCita } = require('../middlewares/validators');

// --- Animales ---
router.get('/animales/mios', auth, animalController.getMisAnimales);
router.get('/animales', auth, animalController.getAll);
router.get('/animales/:id', auth, animalController.getById);
router.post('/animales', auth, animalController.uploadFoto, animalController.create); // ✅ Con upload
router.put('/animales/:id', auth, animalController.uploadFoto, animalController.update); // ✅ Con upload
router.delete('/animales/:id', auth, allowRoles(['admin', 'veterinario']), animalController.delete);

// --- Usuarios CRUD ---
router.get('/usuarios', auth, usuarioController.getAll);
router.get('/usuarios/:id', auth, usuarioController.getById);
router.post('/usuarios', auth, validarUsuario, validarCampos, usuarioController.create);
router.put('/usuarios/:id', auth, validarUsuario, validarCampos, usuarioController.update);
router.delete('/usuarios/:id', auth, usuarioController.delete);

// --- Citas ---
router.get('/citas/mias', auth, citaController.getMisCitas); // ✅ NUEVA RUTA
router.get('/citas', auth, citaController.getAll);
router.get('/citas/:id', auth, citaController.getById);
router.post('/citas', auth, citaController.create);
router.put('/citas/:id', auth, citaController.update);
router.delete('/citas/:id', auth, allowRoles(['admin', 'veterinario', 'recepcionista']), citaController.delete);

module.exports = router;
