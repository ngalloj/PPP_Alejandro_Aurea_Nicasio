const express = require('express');
const { sequelize } = require('./models'); // ruta correcta según tu proyecto
const animalRoutes = require('./routes/animal.routes');
const citaRoutes = require('./routes/cita.routes');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();
app.use(express.json())

app.use('/api/animales', animalRoutes);
app.use('/api/cita', citaRoutes);
app.use('/api/usuario', usuarioRoutes);

sequelize.sync({ alter: true }) // Usa { force: true } para borrar y recrear tablas cada vez (solo en desarrollo)
  .then(() => {
    console.log("Tablas sincronizadas correctamente");
  })
  .catch((error) => {
    console.error("Error creando tablas:", error);
  });
