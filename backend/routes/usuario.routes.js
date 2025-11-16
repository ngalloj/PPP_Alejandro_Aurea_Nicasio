const express = require('express');
const router = express.Router();

// Asegúrate que la ruta es correcta y coincide nombre y carpeta:
const ctrl = require('../controllers/usuario.controller');

// Rutas típicas de usuario (ajusta según tus necesidades)
router.post('/login', ctrl.login);        // Login usuario
router.get('/', ctrl.getAll);             // Listar todos los usuarios
router.get('/:id', ctrl.getById);         // Obtener usuario por ID
router.post('/', ctrl.create);            // Crear nuevo usuario
router.put('/:id', ctrl.update);          // Actualizar usuario
router.delete('/:id', ctrl.delete);       // Eliminar usuario

// Exportar el router para usar en app.js
module.exports = router;
