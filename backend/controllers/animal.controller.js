// backend/controllers/animal.controller.js
const { Animal, Cita, Usuario } = require('../models');

// Listar todos los animales (con dueño y paginación)
exports.getAll = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const offset = (page - 1) * limit;
  const { rows, count } = await Animal.findAndCountAll({
    include: [{ model: Usuario }, { model: Cita }],
    limit,
    offset
  });
  res.json({ total: count, data: rows, page, pages: Math.ceil(count / limit) });
};

// Buscar animal por ID (con citas y dueño)
exports.getById = async (req, res) => {
  const animal = await Animal.findByPk(req.params.id, {
    include: [{ model: Usuario }, { model: Cita }]
  });
  if (animal) res.json(animal);
  else res.status(404).json({ error: 'No encontrado' });
};

// Crear animal (requiere usuario_id)
exports.create = async (req, res) => {
  try {
    if (!req.body.nombre) throw new Error('Falta nombre');
    if (!req.body.usuario_id) throw new Error('Falta usuario_id (dueño)');
    const animal = await Animal.create(req.body);
    res.status(201).json(animal);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar animal
exports.update = async (req, res) => {
  const actualizado = await Animal.update(req.body, { where: { id: req.params.id } });
  res.json({ actualizado });
};

// Borrar animal
exports.delete = async (req, res) => {
  await Animal.destroy({ where: { id: req.params.id } });
  res.json({ eliminado: true });
};
