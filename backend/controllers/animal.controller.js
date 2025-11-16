const { Animal, Cita } = require('../models');

// Listar todos los animales
exports.getAll = async (req, res) => {
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const offset = (page - 1) * limit;
  const { rows, count } = await Animal.findAndCountAll({ limit, offset });
  res.json({ total: count, data: rows, page, pages: Math.ceil(count / limit) });
};

// Buscar por ID
exports.getById = async (req, res) => {
  const animal = await Animal.findByPk(req.params.id, { include: Cita });
  if (animal) res.json(animal);
  else res.status(404).json({ error: 'No encontrado' });
};

// Crear animal
exports.create = async (req, res) => {
  try {
    if (!req.body.nombre) throw new Error('Falta nombre');
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
