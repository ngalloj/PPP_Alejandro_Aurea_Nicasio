const { Cita, Animal, Usuario } = require('../models');

exports.getAll = async (req, res) => {
  const citas = await Cita.findAll({ include: [Animal, Usuario] });
  res.json(citas);
};

exports.getById = async (req, res) => {
  const cita = await Cita.findByPk(req.params.id, { include: [Animal, Usuario] });
  if (cita) res.json(cita);
  else res.status(404).json({ error: 'No encontrada' });
};

exports.create = async (req, res) => {
  const cita = await Cita.create(req.body);
  res.status(201).json(cita);
};

exports.update = async (req, res) => {
  await Cita.update(req.body, { where: { id: req.params.id } });
  res.json({ actualizado: true });
};

exports.delete = async (req, res) => {
  await Cita.destroy({ where: { id: req.params.id } });
  res.json({ eliminado: true });
};

// Citas con animales y usuarios relacionados
exports.getAll = async (req, res) => {
    const citas = await Cita.findAll({ include: [Animal, Usuario] });
    res.json(citas);
  };

// Errores y validaciones uniformes
exports.create = async (req, res) => {
    try {
      if (!req.body.nombre) throw new Error('Falta nombre');
      const animal = await Animal.create(req.body);
      res.status(201).json(animal);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  