const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, vaccineController.getAllVaccines);
router.get('/upcoming', verifyToken, vaccineController.getUpcomingVaccines);
router.get('/animal/:animalId', verifyToken, vaccineController.getVaccinesByAnimal);
router.get('/:id', verifyToken, vaccineController.getVaccineById);
router.post('/', verifyToken, checkRole(['veterinario', 'administrador']), vaccineController.createVaccine);
router.put('/:id', verifyToken, checkRole(['veterinario', 'administrador']), vaccineController.updateVaccine);
router.delete('/:id', verifyToken, checkRole(['veterinario', 'administrador']), vaccineController.deleteVaccine);

module.exports = router;
