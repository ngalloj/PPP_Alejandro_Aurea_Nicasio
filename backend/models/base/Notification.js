const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    usuarioId: { type: DataTypes.INTEGER, allowNull: false },
    tipo: { type: DataTypes.ENUM('cita_proxima', 'cita_confirmada', 'cita_cancelada', 'recordatorio_vacuna', 'resultado_analisis', 'factura_pendiente', 'mensaje_veterinario', 'stock_bajo', 'sistema'), allowNull: false },
    titulo: { type: DataTypes.STRING(200), allowNull: false },
    mensaje: { type: DataTypes.TEXT, allowNull: false },
    leida: { type: DataTypes.BOOLEAN, defaultValue: false },
    fechaLectura: { type: DataTypes.DATE },
    prioridad: { type: DataTypes.ENUM('baja', 'media', 'alta', 'urgente'), defaultValue: 'media' },
    enlace: { type: DataTypes.STRING(255) },
    metadatos: { type: DataTypes.JSON },
    canalEnvio: { type: DataTypes.JSON, defaultValue: ['app'] },
    enviadaEmail: { type: DataTypes.BOOLEAN, defaultValue: false },
    enviadaSms: { type: DataTypes.BOOLEAN, defaultValue: false },
    fechaEnvio: { type: DataTypes.DATE }
  }, { tableName: 'notifications', timestamps: true });

  Notification.associate = (models) => {
    Notification.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
  };
  
  return Notification;
};
