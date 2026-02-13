const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AppointmentTracking = sequelize.define('AppointmentTracking', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    citaId: { type: DataTypes.INTEGER, allowNull: false },
    estadoAnterior: { type: DataTypes.STRING(50) },
    estadoNuevo: { type: DataTypes.STRING(50), allowNull: false },
    usuarioId: { type: DataTypes.INTEGER },
    motivoCambio: { type: DataTypes.TEXT },
    tipoAccion: { type: DataTypes.ENUM('creacion', 'confirmacion', 'cancelacion', 'reprogramacion', 'inicio', 'finalizacion', 'modificacion'), allowNull: false },
    datosModificados: { type: DataTypes.JSON },
    ipAddress: { type: DataTypes.STRING(45) }
  }, { tableName: 'appointment_tracking', timestamps: true, updatedAt: false });

  AppointmentTracking.associate = (models) => {
    AppointmentTracking.belongsTo(models.Cita, { foreignKey: 'citaId', as: 'cita' });
    AppointmentTracking.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
  };
  
  return AppointmentTracking;
};
