const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    facturaId: { type: DataTypes.INTEGER, references: { model: 'facturas', key: 'id' }, allowNull: false },
    metodoPago: { type: DataTypes.ENUM('efectivo', 'tarjeta_credito', 'tarjeta_debito', 'transferencia', 'bizum', 'paypal', 'aplazado', 'seguro', 'otro'), allowNull: false },
    cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    referenciaPago: { type: DataTypes.STRING(100) },
    fechaPago: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('pendiente', 'completado', 'fallido', 'reembolsado'), defaultValue: 'completado' },
    ultimos4Digitos: { type: DataTypes.STRING(4) },
    tipoTarjeta: { type: DataTypes.STRING(50) },
    numeroCuota: { type: DataTypes.INTEGER },
    totalCuotas: { type: DataTypes.INTEGER },
    companiaSeguro: { type: DataTypes.STRING(150) },
    numeroPoliza: { type: DataTypes.STRING(100) },
    porcentajeCobertura: { type: DataTypes.DECIMAL(5, 2) },
    notas: { type: DataTypes.TEXT }
  }, { tableName: 'payment_methods', timestamps: true });

  PaymentMethod.associate = (models) => {
    PaymentMethod.belongsTo(models.Factura, { foreignKey: 'facturaId', as: 'factura' });
  };
  
  return PaymentMethod;
};
