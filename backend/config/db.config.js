require('dotenv').config();

module.exports = {
  HOST: process.env.DB_HOST || process.env.MYSQL_HOST || 'localhost',
  USER: process.env.DB_USER || process.env.MYSQL_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || process.env.MYSQL_PASSWORD || '',
  DB: process.env.DB_NAME || process.env.MYSQL_DATABASE || '',
  PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  dialect: "mysql",
  pool: {
    max: 25,
    min: 0,
    acquire: 30000,
    idle: 100000
  }
};