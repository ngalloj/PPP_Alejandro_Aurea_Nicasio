const { Treatment, Animal, Employee, Historial, Cita } = require('../models');

exports.getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id, {
      include: [
        { model: Animal, as: 'animal' },
        { model: Employee, as: 'veterinario' },
        { model: Historial, as: 'historial' },
        { model: Cita, as: 'cita' }
      ]
    });
    if (!treatment) return res.status(404).json({ error: 'Tratamiento no encontrado' });
    res.json(treatment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTreatmentsByAnimal = async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      where: { animalId: req.params.animalId },
      include: [{ model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }],
      order: [['fechaInicio', 'DESC']]
    });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getActiveTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.findAll({
      where: { estado: 'en_curso' },
      include: [
        { model: Animal, as: 'animal', attributes: ['id', 'nombre', 'especie'] },
        { model: Employee, as: 'veterinario', attributes: ['id', 'nombre', 'apellidos'] }
      ],
      order: [['fechaInicio', 'DESC']]
    });
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.create(req.body);
    res.status(201).json(treatment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) return res.status(404).json({ error: 'Tratamiento no encontrado' });
    await treatment.update(req.body);
    res.json(treatment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addSeguimiento = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) return res.status(404).json({ error: 'Tratamiento no encontrado' });
    
    const seguimientos = treatment.seguimientos || [];
    seguimientos.push({
      fecha: new Date(),
      observaciones: req.body.observaciones,
      veterinarioId: req.body.veterinarioId
    });
    
    await treatment.update({ seguimientos });
    res.json(treatment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByPk(req.params.id);
    if (!treatment) return res.status(404).json({ error: 'Tratamiento no encontrado' });
    await treatment.destroy();
    res.json({ message: 'Tratamiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
