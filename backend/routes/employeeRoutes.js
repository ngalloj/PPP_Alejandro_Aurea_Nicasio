const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, employeeController.getAllEmployees);
router.get('/veterinarios', verifyToken, employeeController.getVeterinarios);
router.get('/:id', verifyToken, employeeController.getEmployeeById);
router.post('/', verifyToken, checkRole(['administrador']), employeeController.createEmployee);
router.put('/:id', verifyToken, checkRole(['administrador']), employeeController.updateEmployee);
router.delete('/:id', verifyToken, checkRole(['administrador']), employeeController.deleteEmployee);

module.exports = router;
