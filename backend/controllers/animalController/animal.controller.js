// backend/controllers/animal.controller.js
const { Animal, Cita, Usuario } = require('../../models');
// const multer = require('multer');
const path = require('path');

/* // Configuración de multer para subir fotos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/animales/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'animal-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes'));
  }
});

// Middleware para exportar
exports.uploadFoto = upload.single('foto');
 */

// Crear animal (requiere usuario_dni)
exports.create = async (req, res) => {
  try {
    console.log('Datos recibidos para crear animal:', req.body);
    console.log('Archivo recibido:', req.file);
    
    if (!req.body.nombre) throw new Error('Falta nombre');
    if (!req.body.usuario_dni) throw new Error('Falta usuario_dni (dueño)');
    
    const datosAnimal = { ...req.body };
    
    // Si se subió una foto, guardar la URL
    if (req.file) {
      datosAnimal.foto_url = `/uploads/animales/${req.file.filename}`;
    }
    
    const animal = await Animal.create(datosAnimal);
    console.log('Animal creado:', animal.get({ plain: true }));
    
    res.status(201).json(animal);
  } catch (err) {
    console.error('Error creando animal:', err);
    res.status(400).json({ error: err.message });
  }
};

// Actualizar animal
exports.update = async (req, res) => {
  try {
    const datosActualizar = { ...req.body };
    
    // Si se subió una foto nueva, actualizar la URL
    if (req.file) {
      datosActualizar.foto_url = `/uploads/animales/${req.file.filename}`;
    }
    
    const [actualizado] = await Animal.update(datosActualizar, { 
      where: { id: req.params.id } 
    });
    res.json({ actualizado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Borrar animal
exports.delete = async (req, res) => {
  try {
    await Animal.destroy({ where: { id: req.params.id } });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Listar todos los animales (con dueño y paginación)
exports.getAll = async (req, res) => {
  try {
    const page = +req.query.page || 1;
    const limit = +req.query.limit || 10;
    const offset = (page - 1) * limit;
    const { rows, count } = await Animal.findAndCountAll({
      include: [{ model: Usuario }],
      limit,
      offset
    });
    res.json({ 
      total: count, 
      data: rows, 
      page, 
      pages: Math.ceil(count / limit) 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener animales del usuario autenticado POR DNI
exports.getMisAnimales = async (req, res) => {
  try {
    const usuario_dni = req.usuario.dni; // Del token JWT
    console.log('Buscando animales para DNI:', usuario_dni);
    
    const animales = await Animal.findAll({ 
      where: { usuario_dni },
      include: [{ model: Usuario }]
    });
    
    console.log('Animales encontrados:', animales.length);
    res.json({ animales });
  } catch (err) {
    console.error('Error en getMisAnimales:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar animal por ID (con citas y dueño)
exports.getById = async (req, res) => {
  try {
    const animal = await Animal.findByPk(req.params.id, {
      include: [{ model: Usuario }, { model: Cita }]
    });
    if (animal) res.json(animal);
    else res.status(404).json({ error: 'No encontrado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




