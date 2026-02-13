const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { auth, roleAuth } = require('../middlewares/auth');

router.get('/', auth, employeeController.getAllEmployees);
router.get('/veterinarios', auth, employeeController.getVeterinarios);
router.get('/:id', auth, employeeController.getEmployeeById);
router.post('/', auth, roleAuth('admin'), employeeController.createEmployee);
router.put('/:id', auth, roleAuth('admin'), employeeController.updateEmployee);
router.delete('/:id', auth, roleAuth('admin'), employeeController.deleteEmployee);

module.exports = router;
