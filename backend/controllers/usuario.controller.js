// backend/controllers/usuario.controllers.js
const { Usuario } = require('../models'); // Ajusta la ruta si es necesario
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = "CLAVE_SUPERSECRETA"; // Usa variable de entorno en producción

// LOGIN profesional (bcrypt + JWT)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas (usuario)' });
    }

    // LOGS
    console.log('Probando login para:', email);

    // SOLO UNA vez, aquí:
    const passwordCorrecta = await bcrypt.compare(password, usuario.password);

    console.log('¿Password coincide para', email, '? =>', passwordCorrecta);

    if (!passwordCorrecta) {
      return res.status(401).json({ error: 'Credenciales inválidas (password)' });
    }

    const { id, email: userEmail, rol } = usuario.get();

    // Crea el token JWT
    const token = jwt.sign(
      { id, email: userEmail, rol },
      SECRET,
      { expiresIn: "4h" }
    );

    return res.json({
      mensaje: 'Login correcto',
      usuario: { id, email: userEmail, rol },
      token
    });

  } catch (err) {
    res.status(500).json({ error: "Error del servidor: " + err.message });
  }
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    // Oculta password de la respuesta
    const result = usuarios.map(u => {
      const { id, email, rol } = u.get();
      return { id, email, rol };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener usuario por ID
exports.getById = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      const { id, email, rol } = usuario.get();
      res.json({ id, email, rol });
    } else {
      res.status(404).json({ error: 'No encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear usuario (asegúrate de hashear contraseña antes de guardar)
exports.create = async (req, res) => {
  try {
    let { password, ...resto } = req.body;
    if (password) {
      password = await bcrypt.hash(password, 10);
    }
    const usuario = await Usuario.create({ ...resto, password });
    const { id, email, rol } = usuario.get();
    res.status(201).json({ id, email, rol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar usuario (si actualizas password, hashea)
exports.update = async (req, res) => {
  try {
    let datos = { ...req.body };
    if (datos.password) {
      datos.password = await bcrypt.hash(datos.password, 10);
    }
    const [actualizado] = await Usuario.update(datos, { where: { id: req.params.id } });
    res.json({ actualizado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrar usuario
exports.delete = async (req, res) => {
  try {
    await Usuario.destroy({ where: { id: req.params.id } });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
