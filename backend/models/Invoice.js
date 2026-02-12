// backend/models/Invoice.js
// Facturas automáticas generadas desde citas

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Invoice = sequelize.define('Invoice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    number: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    citaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'citas', key: 'id' }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'usuarios', key: 'id' }
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { isDecimal: true, min: 0 }
    },
    items: {
      type: DataTypes.JSONB,
      // Estructura: [{inventoryId, qty, price, name}]
      allowNull: true
    },
    pdfUrl: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pendiente', 'pagada', 'cancelada'),
      defaultValue: 'pendiente'
    },
    paymentMethod: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia', 'cheque'),
      allowNull: true
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'invoices',
    timestamps: true
  });

  return Invoice;
};
