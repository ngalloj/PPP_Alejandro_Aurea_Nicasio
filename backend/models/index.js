// backend/models/index.js
'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('clinica_vet', 'postgres', 'admin1234', {
  host: 'localhost',
  dialect: 'postgres'
});

// Modelos
const Usuario = require('./usuario')(sequelize, DataTypes);
const Animal = require('./animal')(sequelize, DataTypes);
const Cita = require('./cita/cita')(sequelize, DataTypes);

// Asociaciones ACTUALIZADAS
Usuario.hasMany(Animal, { foreignKey: 'usuario_dni', sourceKey: 'dni' });
Animal.belongsTo(Usuario, { foreignKey: 'usuario_dni', targetKey: 'dni' });

Usuario.hasMany(Cita, { foreignKey: 'usuario_dni', sourceKey: 'dni' });
Cita.belongsTo(Usuario, { foreignKey: 'usuario_dni', targetKey: 'dni' });

Animal.hasMany(Cita, { foreignKey: 'animal_id' });
Cita.belongsTo(Animal, { foreignKey: 'animal_id' });

module.exports = { sequelize, Animal, Usuario, Cita };
