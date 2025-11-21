// backend/controllers/cita.controller.js
const { Cita, Animal, Usuario } = require('../models');

// Listar todas las citas (con animal y usuario)
exports.getAll = async (req, res) => {
  const citas = await Cita.findAll({ include: [Animal, Usuario] });
  res.json(citas);
};

// Buscar cita por ID (con animal y usuario)
exports.getById = async (req, res) => {
  const cita = await Cita.findByPk(req.params.id, { include: [Animal, Usuario] });
  if (cita) res.json(cita);
  else res.status(404).json({ error: 'No encontrada' });
};

// Crear cita (requiere animal_id y usuario_id)
exports.create = async (req, res) => {
  try {
    if (!req.body.fecha) throw new Error('Falta fecha');
    if (!req.body.animal_id) throw new Error('Falta animal_id');
    if (!req.body.usuario_id) throw new Error('Falta usuario_id');
    const cita = await Cita.create(req.body);
    res.status(201).json(cita);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar cita
exports.update = async (req, res) => {
  await Cita.update(req.body, { where: { id: req.params.id } });
  res.json({ actualizado: true });
};

// Eliminar cita
exports.delete = async (req, res) => {
  await Cita.destroy({ where: { id: req.params.id } });
  res.json({ eliminado: true });
};
