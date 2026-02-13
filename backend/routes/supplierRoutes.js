const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, supplierController.getAllSuppliers);
router.get('/active', verifyToken, supplierController.getActiveSuppliers);
router.get('/:id', verifyToken, supplierController.getSupplierById);
router.post('/', verifyToken, checkRole(['administrador', 'recepcionista']), supplierController.createSupplier);
router.put('/:id', verifyToken, checkRole(['administrador', 'recepcionista']), supplierController.updateSupplier);
router.delete('/:id', verifyToken, checkRole(['administrador']), supplierController.deleteSupplier);

module.exports = router;
