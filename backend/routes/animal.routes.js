const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/animal.controller');
const auth = require('../middlewares/auth');

// Rutas públicas
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);

// Rutas protegidas (requieren login/JWT)
router.post('/', auth.authenticateToken, ctrl.create);
router.put('/:id', auth.authenticateToken, ctrl.update);
router.delete('/:id', auth.authenticateToken, ctrl.delete);

module.exports = router;


