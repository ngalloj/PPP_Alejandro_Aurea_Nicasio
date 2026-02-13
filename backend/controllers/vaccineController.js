const { Vaccine, Animal, Employee, Historial } = require('../models');
const { Op } = require('sequelize');

exports.getAllVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.findAll({
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }
      ],
      order: [['fechaAplicacion', 'DESC']]
    });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVaccineById = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id, {
      include: [
        { model: Animal, as: 'animal' },
        { model: Employee, as: 'veterinario' },
        { model: Historial, as: 'historial' }
      ]
    });
    if (!vaccine) return res.status(404).json({ error: 'Vacuna no encontrada' });
    res.json(vaccine);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVaccinesByAnimal = async (req, res) => {
  try {
    const vaccines = await Vaccine.findAll({
      where: { animalId: req.params.animalId },
      include: [{ model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }],
      order: [['fechaAplicacion', 'DESC']]
    });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUpcomingVaccines = async (req, res) => {
  try {
    const vaccines = await Vaccine.findAll({
      where: {
        estado: 'programada',
        fechaProximaDosis: { [Op.gte]: new Date() }
      },
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }
      ],
      order: [['fechaProximaDosis', 'ASC']]
    });
    res.json(vaccines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.create(req.body);
    res.status(201).json(vaccine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Vacuna no encontrada' });
    await vaccine.update(req.body);
    res.json(vaccine);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteVaccine = async (req, res) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Vacuna no encontrada' });
    await vaccine.destroy();
    res.json({ message: 'Vacuna eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
