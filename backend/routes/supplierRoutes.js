const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { auth, roleAuth } = require('../middlewares/auth');

router.get('/', auth, supplierController.getAllSuppliers);
router.get('/active', auth, supplierController.getActiveSuppliers);
router.get('/:id', auth, supplierController.getSupplierById);
router.post('/', auth, roleAuth('admin', 'recepcionista'), supplierController.createSupplier);
router.put('/:id', auth, roleAuth('admin', 'recepcionista'), supplierController.updateSupplier);
router.delete('/:id', auth, roleAuth('admin'), supplierController.deleteSupplier);

module.exports = router;
