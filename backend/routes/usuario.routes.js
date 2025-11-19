// backend/routes/usuario.routes.js
const express = require('express');
const ctrl = require('../controllers/usuario.controller');
const auth = require('../middlewares/auth');
const router = express.Router();

// Rutas de login y registro
router.post('/login', ctrl.login); // Login usuario

// Rutas protegidas
router.get('/', auth.authenticateToken, ctrl.getAll); // Listar todos los usuarios
router.get('/:id', auth.authenticateToken, ctrl.getById); // Obtener usuario por ID
router.post('/', auth.authenticateToken, auth.allowRoles(['admin', 'veterinario']), ctrl.create); // Crear usuario (solo admin/veterinario)
router.put('/:id', auth.authenticateToken, auth.allowRoles(['admin', 'veterinario']), ctrl.update); // Actualizar usuario
router.delete('/:id', auth.authenticateToken, auth.allowRoles(['admin']), ctrl.delete); // Eliminar usuario (solo admin)

// Exportar
module.exports = router;
