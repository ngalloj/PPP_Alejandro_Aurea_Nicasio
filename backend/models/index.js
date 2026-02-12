// backend/models/index.js - VERSIÓN FINAL QUE FUNCIONA

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,

  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false
  }
);

const db = {};

// Cargar modelos (solo archivos .js en raíz de models/)
const modelsToLoad = ['usuario', 'animal', 'cita', 'catalogo', 'facturacion', 'historiales', 'Inventory', 'Invoice'];

modelsToLoad.forEach(modelName => {
  try {
    const model = require(`./${modelName}`)(sequelize, DataTypes);
    db[model.name] = model;
    console.log(`✅ Modelo cargado: ${model.name}`);
  } catch (err) {
    console.log(`⚠️  Modelo ${modelName} no encontrado o error: ${err.message}`);
  }
});

// Asociaciones
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
    } catch (err) {
      console.log(`⚠️  Error asociación ${modelName}: ${err.message}`);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Factura = require('./Factura')(sequelize);


module.exports = db;
