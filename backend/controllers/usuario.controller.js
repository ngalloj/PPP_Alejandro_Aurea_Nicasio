const { Usuario } = require('../models'); // Ajusta la ruta si es necesario
const jwt = require('jsonwebtoken'); // AGREGADO
const SECRET = "CLAVE_SUPERSECRETA"; // usa una clave secreta fija (en prod, ponlo en variable de entorno)

// LOGIN (devuelve sólo datos serializables y oculta password)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas (usuario)' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas (password)' });
    }

    const { id, email: userEmail, rol } = usuario.get();

    // CREA UN TOKEN JWT REAL CON LOS DATOS QUE EL FRONT NECESITA LEER
    const token = jwt.sign(
      { id, email: userEmail, rol }, // payload
      SECRET,
      { expiresIn: "4h" } // caduca en 4 horas
    );

    return res.json({
      mensaje: 'Login correcto',
      usuario: { id, email: userEmail, rol },
      token // este será un JWT válido y tu frontend podrá usar atob sin errores
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

// Crear usuario
exports.create = async (req, res) => {
  try {
    const usuario = await Usuario.create(req.body);
    const { id, email, rol } = usuario.get();
    res.status(201).json({ id, email, rol });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  try {
    const [actualizado] = await Usuario.update(req.body, { where: { id: req.params.id } });
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
