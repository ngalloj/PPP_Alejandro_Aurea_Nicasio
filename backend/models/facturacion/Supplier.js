const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('Supplier', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(200), allowNull: false },
    nombreComercial: { type: DataTypes.STRING(200) },
    cif: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    direccion: { type: DataTypes.TEXT },
    ciudad: { type: DataTypes.STRING(100) },
    provincia: { type: DataTypes.STRING(100) },
    codigoPostal: { type: DataTypes.STRING(10) },
    pais: { type: DataTypes.STRING(100), defaultValue: 'España' },
    telefono: { type: DataTypes.STRING(20) },
    telefonoAlternativo: { type: DataTypes.STRING(20) },
    email: { type: DataTypes.STRING(150), validate: { isEmail: true } },
    web: { type: DataTypes.STRING(255) },
    personaContacto: { type: DataTypes.STRING(150) },
    telefonoContacto: { type: DataTypes.STRING(20) },
    emailContacto: { type: DataTypes.STRING(150) },
    tipoProveedor: { type: DataTypes.ENUM('medicamentos', 'alimentos', 'material_quirurgico', 'equipamiento', 'limpieza', 'general', 'otro'), defaultValue: 'general' },
    condicionesPago: { type: DataTypes.STRING(100) },
    descuentoGeneral: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0 },
    iban: { type: DataTypes.STRING(34) },
    estado: { type: DataTypes.ENUM('activo', 'inactivo', 'bloqueado'), defaultValue: 'activo' },
    calificacion: { type: DataTypes.INTEGER, validate: { min: 1, max: 5 } },
    notas: { type: DataTypes.TEXT },
    ultimaCompra: { type: DataTypes.DATE },
    totalComprado: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 }
  }, { tableName: 'suppliers', timestamps: true });

  Supplier.associate = (models) => {
    if (models.Inventory) Supplier.hasMany(models.Inventory, { foreignKey: 'supplierId', as: 'productos' });
  };
  
  return Supplier;
};
