const express = require('express');
const router = express.Router();
const vaccineController = require('../controllers/vaccineController');
const { auth, roleAuth } = require('../middlewares/auth');

router.get('/', auth, vaccineController.getAllVaccines);
router.get('/upcoming', auth, vaccineController.getUpcomingVaccines);
router.get('/animal/:animalId', auth, vaccineController.getVaccinesByAnimal);
router.get('/:id', auth, vaccineController.getVaccineById);
router.post('/', auth, roleAuth('veterinario', 'admin'), vaccineController.createVaccine);
router.put('/:id', auth, roleAuth('veterinario', 'admin'), vaccineController.updateVaccine);
router.delete('/:id', auth, roleAuth('veterinario', 'admin'), vaccineController.deleteVaccine);

module.exports = router;
