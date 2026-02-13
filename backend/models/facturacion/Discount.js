const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Discount = sequelize.define('Discount', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    tipo: { type: DataTypes.ENUM('porcentaje', 'fijo'), defaultValue: 'porcentaje' },
    valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fechaInicio: { type: DataTypes.DATE, allowNull: false },
    fechaFin: { type: DataTypes.DATE, allowNull: false },
    usoMaximo: { type: DataTypes.INTEGER },
    vecesUsado: { type: DataTypes.INTEGER, defaultValue: 0 },
    estado: { type: DataTypes.ENUM('activo', 'inactivo', 'expirado'), defaultValue: 'activo' },
    aplicableA: { type: DataTypes.ENUM('servicios', 'productos', 'todo'), defaultValue: 'todo' },
    minimoCompra: { type: DataTypes.DECIMAL(10, 2) }
  }, { tableName: 'discounts', timestamps: true });

  return Discount;
};
