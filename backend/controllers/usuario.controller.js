// backend/controllers/usuario.controllers.js
const { Usuario } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'admin1234';

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales inválidas (usuario)' });

    // Auditar passwords
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    console.log(`¿Password coincide para ${email}? => ${passwordCorrecta}`);
    if (!passwordCorrecta)
      return res.status(401).json({ error: 'Credenciales inválidas (password)' });

    const { id, email: userEmail, rol } = usuario.get();
    const token = jwt.sign({ id, email: userEmail, rol }, SECRET, { expiresIn: '4h' });
    return res.json({
      mensaje: 'Login correcto',
      usuario: { id, email: userEmail, rol },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor: ' + err.message });
  }
};

// Listar todos
exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios.map(u => {
      const { id, email, rol } = u.get();
      return { id, email, rol };
    }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};
// Obtener por ID
exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: 'No encontrado' });
    const { id, email, rol } = usuario.get();
    res.json({ id, email, rol });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
// Crear
exports.create = async (req, res) => {
  try {
    // QUIÉN está creando
    const rolSolicitante = req.usuario.rol; // el rol del usuario autenticado
    let { password, rol, ...resto } = req.body;

    // Recepcionista SOLO puede crear clientes
    if (rolSolicitante === 'recepcionista' && rol !== 'cliente') {
      return res.status(403).json({ error: 'Recepcionista sólo puede crear clientes.' });
    }

    // Evitar que un cliente se autologue y cree usuarios
    if (rolSolicitante === 'cliente') {
      return res.status(403).json({ error: 'Cliente no autorizado para crear usuarios.' });
    }

    if (!rol) rol = 'cliente'; // Previene rol vacío (o puedes controlar en frontend/validación extra)

    if (password) password = await require('bcrypt').hash(password, 10);
    const usuario = await require('../models').Usuario.create({ ...resto, password, rol });
    const { id, email } = usuario.get();
    res.status(201).json({ id, email, rol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar
exports.update = async (req, res) => {
  try {
    let datos = { ...req.body };
    if (datos.password)
      datos.password = await bcrypt.hash(datos.password, 10);
    const [actualizado] = await Usuario.update(datos, { where: { id: req.params.id } });
    res.json({ actualizado });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
// Eliminar
exports.delete = async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.params.id } });
    res.json({ eliminado: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
