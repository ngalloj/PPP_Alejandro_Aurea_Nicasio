// backend/app.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const rutas = require('./routes'); // Centralizado (animales, citas, usuarios "plural")
const usuarioRutas = require('./routes/usuario.routes'); // Solo para login y CRUD usuario singular

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', rutas); // /api/animales, /api/citas, /api/usuarios
app.use('/api/usuario', usuarioRutas); // /api/usuario/login, /api/usuario/...

sequelize.sync()
  .then(() => {
    console.log("Tablas sincronizadas correctamente");
    app.listen(3000, () => {
      console.log('Servidor escuchando en el puerto 3000');
    });
  })
  .catch((error) => {
    console.error("Error creando tablas:", error);
  });
