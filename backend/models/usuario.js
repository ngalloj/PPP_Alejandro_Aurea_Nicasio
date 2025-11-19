// backend/models/usuario.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('usuario', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: { type: DataTypes.STRING, defaultValue: 'usuario' }
  }, { timestamps: false });
  return Usuario;
};
