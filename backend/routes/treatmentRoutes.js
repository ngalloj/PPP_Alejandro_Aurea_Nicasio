const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { verifyToken, checkRole } = require('../middleware/authMiddleware');

router.get('/', verifyToken, treatmentController.getAllTreatments);
router.get('/active', verifyToken, treatmentController.getActiveTreatments);
router.get('/animal/:animalId', verifyToken, treatmentController.getTreatmentsByAnimal);
router.get('/:id', verifyToken, treatmentController.getTreatmentById);
router.post('/', verifyToken, checkRole(['veterinario', 'administrador']), treatmentController.createTreatment);
router.put('/:id', verifyToken, checkRole(['veterinario', 'administrador']), treatmentController.updateTreatment);
router.post('/:id/seguimiento', verifyToken, checkRole(['veterinario', 'administrador']), treatmentController.addSeguimiento);
router.delete('/:id', verifyToken, checkRole(['veterinario', 'administrador']), treatmentController.deleteTreatment);

module.exports = router;
