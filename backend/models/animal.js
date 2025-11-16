'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  const Animal = sequelize.define('animal', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    especie: DataTypes.STRING,
    edad: DataTypes.INTEGER,
    peso: DataTypes.DECIMAL(5,2)
  }, { timestamps: false });
  return Animal;
};
