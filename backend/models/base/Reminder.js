const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reminder = sequelize.define('Reminder', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    animalId: { type: DataTypes.INTEGER, references: { model: 'animals', key: 'id' }, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'id' }, allowNull: false },
    tipo: { type: DataTypes.ENUM('vacuna', 'desparasitacion', 'revision', 'medicacion', 'cirugia_control', 'analisis', 'otro'), allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    fechaRecordatorio: { type: DataTypes.DATE, allowNull: false },
    fechaVencimiento: { type: DataTypes.DATE },
    estado: { type: DataTypes.ENUM('pendiente', 'enviado', 'completado', 'vencido', 'cancelado'), defaultValue: 'pendiente' },
    prioridad: { type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'), defaultValue: 'media' },
    enviado: { type: DataTypes.BOOLEAN, defaultValue: false },
    fechaEnvio: { type: DataTypes.DATE },
    completado: { type: DataTypes.BOOLEAN, defaultValue: false },
    fechaCompletado: { type: DataTypes.DATE },
    notasCompletado: { type: DataTypes.TEXT },
    repetir: { type: DataTypes.BOOLEAN, defaultValue: false },
    frecuencia: { type: DataTypes.ENUM('semanal', 'mensual', 'trimestral', 'semestral', 'anual') },
    metadatos: { type: DataTypes.JSON }
  }, { tableName: 'reminders', timestamps: true });

  Reminder.associate = (models) => {
    Reminder.belongsTo(models.Animal, { foreignKey: 'animalId', as: 'animal' });
    Reminder.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
  };
  
  return Reminder;
};
