// backend/routes/animal.routes.js
const express = require('express');
const router = express.Router();
const animalController = require('../controllers/animal.controller');
const { auth, allowRoles } = require('../middlewares/auth');
const { validarCampos, validarAnimal } = require('../middlewares/validators');

// Rutas públicas
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Rutas protegidas (requieren login/JWT)
router.post('/', auth, validarAnimal, validarCampos, animalController.create);
router.put('/:id', auth, validarAnimal, validarCampos, animalController.update);
router.delete('/:id', auth, allowRoles(['admin', 'recepcionista']), animalController.delete);

module.exports = router;
