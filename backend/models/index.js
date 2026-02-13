// backend/models/index.js - SISTEMA AUTOMÁTICO Y ESCALABLE
const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

// ==================== CONEXIÓN A BASE DE DATOS ====================
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
const loadedModels = new Set(); // Para evitar duplicados

// ==================== FUNCIONES AUXILIARES ====================

/**
 * Verifica si un archivo es un modelo válido
 */
function isValidModelFile(file) {
  return (
    file.indexOf('.') !== 0 &&
    file !== 'index.js' &&
    file !== 'index-base.js' &&
    file.slice(-3) === '.js'
  );
}

/**
 * Verifica si es una carpeta válida para modelos
 */
function isValidModelFolder(itemPath) {
  try {
    return fs.statSync(itemPath).isDirectory() && 
           !itemPath.includes('node_modules');
  } catch (err) {
    return false;
  }
}

/**
 * Carga un modelo individual desde un archivo
 */
function loadModelFromFile(filePath, fileName) {
  try {
    const modelDefiner = require(filePath);
    
    // Verificar si es una función (modelo Sequelize estándar)
    if (typeof modelDefiner === 'function') {
      const model = modelDefiner(sequelize, DataTypes);
      
      if (model && model.name && !loadedModels.has(model.name)) {
        db[model.name] = model;
        loadedModels.add(model.name);
        console.log(`✅ Modelo cargado: ${model.name} (${fileName})`);
        return true;
      }
    } else if (modelDefiner && modelDefiner.name) {
      // Si ya es un modelo instanciado
      if (!loadedModels.has(modelDefiner.name)) {
        db[modelDefiner.name] = modelDefiner;
        loadedModels.add(modelDefiner.name);
        console.log(`✅ Modelo cargado: ${modelDefiner.name} (${fileName})`);
        return true;
      }
    }
    return false;
  } catch (err) {
    console.log(`⚠️  Error cargando ${fileName}: ${err.message}`);
    return false;
  }
}

/**
 * Carga todos los modelos de una carpeta recursivamente
 */
function loadModelsFromFolder(folderPath, folderName = '') {
  try {
    const items = fs.readdirSync(folderPath);
    
    items.forEach(item => {
      const itemPath = path.join(folderPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        // Es una subcarpeta, cargar recursivamente
        loadModelsFromFolder(itemPath, `${folderName}/${item}`);
      } else if (isValidModelFile(item)) {
        // Es un archivo de modelo
        loadModelFromFile(itemPath, `${folderName}/${item}`.replace(/^\//, ''));
      }
    });
  } catch (err) {
    console.log(`⚠️  Error escaneando carpeta ${folderName}: ${err.message}`);
  }
}

// ==================== CARGA AUTOMÁTICA DE MODELOS ====================

console.log('\n🔄 Iniciando carga de modelos...\n');

// 1. Cargar archivos .js en la raíz de /models (excepto index.js)
const rootFiles = fs.readdirSync(__dirname);

rootFiles.forEach(file => {
  if (isValidModelFile(file)) {
    const filePath = path.join(__dirname, file);
    loadModelFromFile(filePath, file);
  }
});

// 2. Cargar carpetas recursivamente
rootFiles.forEach(item => {
  const itemPath = path.join(__dirname, item);
  
  if (isValidModelFolder(itemPath)) {
    console.log(`📁 Escaneando carpeta: ${item}`);
    loadModelsFromFolder(itemPath, item);
  }
});

console.log(`\n✅ Total de modelos cargados: ${loadedModels.size}\n`);

// ==================== ASOCIACIONES ====================

console.log('🔗 Aplicando asociaciones...\n');

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    try {
      db[modelName].associate(db);
      console.log(`🔗 Asociaciones aplicadas: ${modelName}`);
    } catch (err) {
      console.log(`⚠️  Error asociación ${modelName}: ${err.message}`);
    }
  }
});

console.log('\n✅ Sistema de modelos inicializado correctamente\n');

// ==================== EXPORTAR ====================

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
