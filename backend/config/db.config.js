/* //Carga las varibles de entorno de .env y asigna sus valores a process.env
require('dotenv').config();

//se asigna valores a los parametros de la base de datos. 
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.MYSQL_USER,
  PASSWORD: process.env.MYSQL_PASSWORD,
  DB:  process.env.MYSQL_DATABASE,
  dialect: "mysql",
  pool: {
    max: 25,
    min: 0,
    acquire: 30000,
    idle: 100000
  }
}; */

require('dotenv').config();

// Configuración BD (Render + Aiven)
module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: "mysql",
  port: process.env.DB_PORT,      // añade esto para que use el puerto 10529
  pool: {
    max: 25,
    min: 0,
    acquire: 30000,
    idle: 100000
  }
};
