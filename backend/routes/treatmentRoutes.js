const express = require('express');
const router = express.Router();
const treatmentController = require('../controllers/treatmentController');
const { auth, roleAuth } = require('../middlewares/auth');

router.get('/', auth, treatmentController.getAllTreatments);
router.get('/active', auth, treatmentController.getActiveTreatments);
router.get('/animal/:animalId', auth, treatmentController.getTreatmentsByAnimal);
router.get('/:id', auth, treatmentController.getTreatmentById);
router.post('/', auth, roleAuth('veterinario', 'admin'), treatmentController.createTreatment);
router.put('/:id', auth, roleAuth('veterinario', 'admin'), treatmentController.updateTreatment);
router.post('/:id/seguimiento', auth, roleAuth('veterinario', 'admin'), treatmentController.addSeguimiento);
router.delete('/:id', auth, roleAuth('veterinario', 'admin'), treatmentController.deleteTreatment);

module.exports = router;
