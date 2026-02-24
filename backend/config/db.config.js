// config/db.config.js
require('dotenv').config();

//se asigna valores a los parametros de la base de datos. 
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,   // <-- solo env, NUNCA texto
  DB: process.env.DB_NAME,
  dialect: "mysql",
  port: Number(process.env.DB_PORT),
  pool: {
    max: 25,
    min: 0,
    acquire: 30000,
    idle: 100000
  }
};
