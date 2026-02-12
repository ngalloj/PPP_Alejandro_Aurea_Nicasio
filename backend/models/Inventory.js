// backend/models/Inventory.js
// Gestión de inventario: medicamentos, alimentos, productos

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Inventory = sequelize.define('Inventory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notEmpty: true }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('medicamento', 'alimento', 'suplemento', 'otro'),
      defaultValue: 'medicamento'
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: { isInt: true, min: 0 }
    },
    minStock: {
      type: DataTypes.INTEGER,
      defaultValue: 5,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { isDecimal: true, min: 0 }
    },
    unit: {
      type: DataTypes.STRING(50),
      defaultValue: 'unidad'  // unidad, ml, gr, etc
    },
    barcode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      unique: true
    },
    soldUnits: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'inventories',
    timestamps: true
  });

  return Inventory;
};
