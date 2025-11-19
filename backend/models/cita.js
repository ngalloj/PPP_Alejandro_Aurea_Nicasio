// backend/models/cita.js
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Cita = sequelize.define('cita', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.DATE, allowNull: false },
    motivo: DataTypes.STRING
  }, { timestamps: false });

  return Cita;
};
