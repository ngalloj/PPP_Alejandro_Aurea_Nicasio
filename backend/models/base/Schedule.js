const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    employeeId: { type: DataTypes.INTEGER, references: { model: 'employees', key: 'id' }, allowNull: false },
    diaSemana: { type: DataTypes.ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'), allowNull: false },
    horaInicio: { type: DataTypes.TIME, allowNull: false },
    horaFin: { type: DataTypes.TIME, allowNull: false },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true },
    tipoJornada: { type: DataTypes.ENUM('completa', 'mañana', 'tarde', 'noche'), defaultValue: 'completa' },
    descansoInicio: { type: DataTypes.TIME },
    descansoFin: { type: DataTypes.TIME },
    notas: { type: DataTypes.TEXT }
  }, { tableName: 'schedules', timestamps: true });

  Schedule.associate = (models) => {
    if (models.Employee) {
      Schedule.belongsTo(models.Employee, { foreignKey: 'employeeId', as: 'employee' });
    }
  };
  
  return Schedule;
};
