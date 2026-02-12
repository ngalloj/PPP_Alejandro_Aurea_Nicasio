// backend/controllers/cita.controller.js
const { Cita, Animal, Usuario } = require('../../models');
const { Op } = require('sequelize');

// Crear cita (requiere usuario_dni)
exports.create = async (req, res) => {
  try {
    console.log('Datos recibidos para crear cita:', req.body);
    
    if (!req.body.fecha) throw new Error('Falta fecha');
    if (!req.body.usuario_dni) throw new Error('Falta usuario_dni');
    
    const cita = await Cita.create(req.body);
    console.log('Cita creada:', cita.get({ plain: true }));
    
    res.status(201).json(cita);
  } catch (err) {
    console.error('Error creando cita:', err);
    res.status(400).json({ error: err.message });
  }
};

// Actualizar cita
exports.update = async (req, res) => {
  try {
    const [actualizado] = await Cita.update(req.body, { 
      where: { id: req.params.id } 
    });
    res.json({ actualizado: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar cita
exports.delete = async (req, res) => {
  try {
    await Cita.destroy({ where: { id: req.params.id } });
    res.json({ eliminado: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar todas las citas (con animal y usuario)
exports.getAll = async (req, res) => {
  try {
    const citas = await Cita.findAll({ 
      include: [
        { model: Animal },
        { model: Usuario }
      ],
      order: [['fecha', 'DESC']]
    });
    res.json({ citas });
  } catch (err) {
    console.error('Error obteniendo citas:', err);
    res.status(500).json({ error: err.message });
  }
};

// Obtener citas del usuario autenticado (por DNI)
exports.getMisCitas = async (req, res) => {
  try {
    const usuario_dni = req.usuario.dni;
    console.log('Buscando citas para DNI:', usuario_dni);
    
    const now = new Date();
    
    // Citas pasadas
    const citasPasadas = await Cita.findAll({
      where: { 
        usuario_dni,
        fecha: { [Op.lt]: now }
      },
      include: [{ model: Animal }, { model: Usuario }],
      order: [['fecha', 'DESC']]
    });
    
    // Citas futuras
    const citasFuturas = await Cita.findAll({
      where: { 
        usuario_dni,
        fecha: { [Op.gte]: now }
      },
      include: [{ model: Animal }, { model: Usuario }],
      order: [['fecha', 'ASC']]
    });
    
    res.json({ 
      citasPasadas, 
      citasFuturas,
      total: citasPasadas.length + citasFuturas.length
    });
  } catch (err) {
    console.error('Error en getMisCitas:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar cita por ID (con animal y usuario)
exports.getById = async (req, res) => {
  try {
    const cita = await Cita.findByPk(req.params.id, { 
      include: [Animal, Usuario] 
    });
    if (cita) res.json(cita);
    else res.status(404).json({ error: 'No encontrada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




