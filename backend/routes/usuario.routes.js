// backend/routes/usuario.routes.js
const express = require('express');
const ctrl = require('../controllers/usuario.controller')
const auth = require('../middlewares/auth')
const router = express.Router();

// Rutas típicas de usuario (ajusta según tus necesidades)
router.post('/login', ctrl.login);        // Login usuario
router.get('/', auth.authenticateToken, ctrl.getAll);          // Listar todos los usuarios
router.get('/:id', ctrl.getById);         // Obtener usuario por ID
router.post('/', ctrl.create);            // Crear nuevo usuario
router.put('/:id', ctrl.update);          // Actualizar usuario
router.delete('/:id', ctrl.delete);       // Eliminar usuario

// Exportar el router para usar en app.js
module.exports = router;
