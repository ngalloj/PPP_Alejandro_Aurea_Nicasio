// backend/models/index.js
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
/*const sequelize = new Sequelize('clinica_vet', 'postgres', 'admin1234', {
  host: 'localhost', //host: 'pg-clinica' -> el nombre del servicio en docker-compose host: 'localhost' -> en local 
  dialect: 'postgres'*/


const sequelize = new Sequelize('clinica_vet', 'root', 'gamusino', {
  host: '127.0.0.1',
  dialect: 'mysql',
});

// Modelos
const Usuario = require('./usuario')(sequelize, DataTypes);
const Animal = require('./animal')(sequelize, DataTypes);
const Cita = require('./cita')(sequelize, DataTypes);

// Asociaciones (relaciones)
Usuario.hasMany(Animal, { foreignKey: 'usuario_id' });
Animal.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Usuario.hasMany(Cita, { foreignKey: 'usuario_id' });
Cita.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Si quieres relación cita-animal (un animal puede tener varias citas)
Animal.hasMany(Cita, { foreignKey: 'animal_id' });
Cita.belongsTo(Animal, { foreignKey: 'animal_id' });

// Exporta los modelos y la conexión
module.exports = { sequelize, Animal, Usuario, Cita };
