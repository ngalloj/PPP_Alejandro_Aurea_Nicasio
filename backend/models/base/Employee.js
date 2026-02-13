const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'id' }, allowNull: false },
    nombre: { type: DataTypes.STRING(100), allowNull: false },
    apellidos: { type: DataTypes.STRING(150), allowNull: false },
    dni: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    email: { type: DataTypes.STRING(150), unique: true, allowNull: false, validate: { isEmail: true } },
    telefono: { type: DataTypes.STRING(20) },
    direccion: { type: DataTypes.TEXT },
    puesto: { type: DataTypes.ENUM('veterinario', 'recepcionista', 'auxiliar', 'administrador', 'peluquero'), allowNull: false, defaultValue: 'auxiliar' },
    numeroColegiadoVeterinario: { type: DataTypes.STRING(50) },
    especialidad: { type: DataTypes.STRING(100) },
    fechaContratacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    salario: { type: DataTypes.DECIMAL(10, 2) },
    horaInicio: { type: DataTypes.TIME },
    horaFin: { type: DataTypes.TIME },
    diasTrabajo: { type: DataTypes.JSON, defaultValue: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'] },
    estado: { type: DataTypes.ENUM('activo', 'inactivo', 'vacaciones', 'baja_temporal'), defaultValue: 'activo' },
    fotoPerfil: { type: DataTypes.STRING(255) },
    notas: { type: DataTypes.TEXT }
  }, { tableName: 'employees', timestamps: true });

  Employee.associate = (models) => {
    Employee.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Employee.hasMany(models.Cita, { foreignKey: 'veterinarioId', as: 'citas' });
  };
  
  return Employee;
};
