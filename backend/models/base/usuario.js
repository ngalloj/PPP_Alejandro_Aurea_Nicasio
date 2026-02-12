// backend/models/usuario.js
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    dni: { type: DataTypes.STRING, unique: true, allowNull: false }, // Nuevo campo
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.STRING, defaultValue: 'usuario' }
  }, {
    timestamps: false,
    tableName: 'usuarios' // Nombre real de la tabla
  });

  Usuario.associate = (models) => {
    Usuario.hasMany(models.Animal, { foreignKey: 'usuario_id' });
    Usuario.hasMany(models.Cita, { foreignKey: 'usuario_id' });
  };

  return Usuario;
};
