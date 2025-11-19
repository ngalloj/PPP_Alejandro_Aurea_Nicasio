// backend/models/index.js
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('clinica_vet', 'postgres', 'admin1234', {
  host: 'localhost', // o 'db' en docker
  dialect: 'postgres'
});

const Animal = require('./animal')(sequelize, DataTypes);
const Usuario = require('./usuario')(sequelize, DataTypes);
const Cita = require('./cita')(sequelize, DataTypes);

// Relaciones
Animal.hasMany(Cita, { foreignKey: 'animal_id' });
Cita.belongsTo(Animal, { foreignKey: 'animal_id' });

Usuario.hasMany(Cita, { foreignKey: 'usuario_id' });
Cita.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Exporta modelos y sequelize para usar
module.exports = { sequelize, Animal, Usuario, Cita };
