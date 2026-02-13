const { Employee, Usuario, Cita } = require('../models');

exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'username', 'email', 'rol'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id, {
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'username', 'email', 'rol'] },
        { model: Cita, as: 'citas', limit: 10, order: [['fecha', 'DESC']] }
      ]
    });
    if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
    await employee.update(req.body);
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Empleado no encontrado' });
    await employee.destroy();
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getVeterinarios = async (req, res) => {
  try {
    const veterinarios = await Employee.findAll({
      where: { puesto: 'veterinario', estado: 'activo' },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'username', 'email'] }]
    });
    res.json(veterinarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
