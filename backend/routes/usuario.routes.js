// backend/routes/usuario.routes.js
const express = require('express');
const router = express.Router();

const usuarioController = require('../controllers/usuario.controller');
const { auth, allowRoles } = require('../middlewares/auth');
const { validarCampos, validarUsuario } = require('../middlewares/validators');

// Login usuario (¡SOLO aquí!)
router.post('/login', usuarioController.login);

// CRUD usuario
router.get('/', auth, usuarioController.getAll);
router.get('/:id', auth, usuarioController.getById);
router.post('/', auth, validarUsuario, validarCampos, usuarioController.create);
router.put('/:id', auth, validarUsuario, validarCampos, usuarioController.update);
router.delete('/:id', auth, allowRoles(['admin']), usuarioController.delete);

module.exports = router;
