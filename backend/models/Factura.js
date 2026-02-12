// backend/models/Factura.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Factura = sequelize.define('Factura', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING, unique: true },
    citaId: { type: DataTypes.INTEGER, references: { model: 'citas', key: 'id' } },
    usuarioId: { type: DataTypes.INTEGER, references: { model: 'usuarios', key: 'id' } },
    total: DataTypes.DECIMAL(10, 2),
    items: DataTypes.JSONB,
    metodoPago: { type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'), default: 'efectivo' },
    estado: { type: DataTypes.ENUM('pendiente', 'pagada'), default: 'pendiente' },
    urlPdf: DataTypes.STRING
  }, { tableName: 'Facturas', timestamps: true });

  return Factura;
};
