// backend/models/catalogo/index.js
const fs = require('fs');
const path = require('path');

module.exports = (sequelize, DataTypes) => {
  const models = {};
  
  // Cargar todos los archivos .js de esta carpeta excepto index.js
  fs.readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== 'index.js' &&
        file.slice(-3) === '.js'
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, DataTypes);
      models[model.name] = model;
    });

  return models;
};
