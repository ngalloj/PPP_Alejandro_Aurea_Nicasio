// backend/controllers/usuario.controllers.js
const { Usuario, Animal } = require('../../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = 'admin1234';

// Login (NO CAMBIAR - ya está bien)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario)
      return res.status(401).json({ error: 'Credenciales inválidas (usuario)' });

    const passwordCorrecta = await bcrypt.compare(password, usuario.password);
    console.log(`¿Password coincide para ${email}? => ${passwordCorrecta}`);
    if (!passwordCorrecta)
      return res.status(401).json({ error: 'Credenciales inválidas (password)' });

    const { id, email: userEmail, rol, dni } = usuario.get();
    const token = jwt.sign({ id, email: userEmail, rol, dni }, SECRET, { expiresIn: '4h' });
    return res.json({
      mensaje: 'Login correcto',
      usuario: { id, email: userEmail, rol, dni },
      token
    });
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor: ' + err.message });
  }
};

// Listar todos (NO CAMBIAR - ya está bien)
exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ include: [{ model: Animal }] });
    res.json(usuarios.map(u => {
      const { id, email, rol, dni, Animales } = u.get({ plain: true });
      return { id, email, rol, dni, animales: Animales };
    }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// Obtener por ID (NO CAMBIAR - ya está bien)
exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { include: [{ model: Animal }] });
    if (!usuario)
      return res.status(404).json({ error: 'No encontrado' });
    const { id, email, rol, dni, Animales } = usuario.get({ plain: true });
    res.json({ id, email, rol, dni, animales: Animales });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ✅ CREAR - AÑADIR VALIDACIÓN DE CLIENTE
exports.create = async (req, res) => {
  try {
    const rolSolicitante = req.usuario?.rol || 'admin';
    let { password, rol, ...resto } = req.body;
    
    if (!resto.dni) 
      return res.status(400).json({ error: 'Falta dni' });

    // ✅ NUEVO: Cliente NO puede crear usuarios
    if (rolSolicitante === 'cliente') {
      return res.status(403).json({ error: 'Cliente no autorizado para crear usuarios.' });
    }

    // ✅ YA EXISTÍA: Recepcionista solo puede crear clientes
    if (rolSolicitante === 'recepcionista' && rol !== 'cliente') {
      return res.status(403).json({ error: 'Recepcionista sólo puede crear clientes.' });
    }
    
    if (!rol) rol = 'cliente';

    if (password) password = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ ...resto, password, rol });
    const { id, email, dni: dniCreado } = usuario.get();
    res.status(201).json({ id, email, rol, dni: dniCreado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ ACTUALIZAR - AÑADIR VALIDACIÓN
exports.update = async (req, res) => {
  try {
    const rolSolicitante = req.usuario?.rol;
    
    // ✅ NUEVO: Solo admin y veterinario pueden modificar
    if (rolSolicitante !== 'admin' && rolSolicitante !== 'veterinario') {
      return res.status(403).json({ error: 'Solo admin y veterinario pueden modificar usuarios.' });
    }

    let datos = { ...req.body };
    if (datos.password)
      datos.password = await bcrypt.hash(datos.password, 10);
    const [actualizado] = await Usuario.update(datos, { where: { id: req.params.id } });
    res.json({ actualizado });
  } catch (err) { res.status(400).json({ error: err.message }); }
};

// ✅ ELIMINAR - AÑADIR VALIDACIÓN
exports.delete = async (req, res) => {
  try {
    const rolSolicitante = req.usuario?.rol;
    
    // ✅ NUEVO: Solo admin y veterinario pueden eliminar
    if (rolSolicitante !== 'admin' && rolSolicitante !== 'veterinario') {
      return res.status(403).json({ error: 'Solo admin y veterinario pueden eliminar usuarios.' });
    }

    await Usuario.destroy({ where: { id: req.params.id } });
    res.json({ eliminado: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
};
