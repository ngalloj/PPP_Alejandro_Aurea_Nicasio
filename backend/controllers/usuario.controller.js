// usuario.controller.js

const { Usuario } = require('../models'); // Ajusta la ruta a tu modelo si es necesario

// LOGIN (ajusta según tu lógica y modelo)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario || usuario.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  // Aquí puedes generar token JWT si lo usas
  res.json({ mensaje: 'Login correcto', usuario });
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

// Obtener usuario por ID
exports.getById = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) res.json(usuario);
  else res.status(404).json({ error: 'No encontrado' });
};

// Crear usuario
exports.create = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  const [actualizado] = await Usuario.update(req.body, { where: { id: req.params.id } });
  res.json({ actualizado });
};

// Borrar usuario
exports.delete = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.json({ eliminado: true });
};
