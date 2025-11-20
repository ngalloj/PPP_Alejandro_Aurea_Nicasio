// backend/app.js
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); // ruta correcta según tu proyecto
const animalRoutes = require('./routes/animal.routes');
const citaRoutes = require('./routes/cita.routes');
const usuarioRoutes = require('./routes/usuario.routes');

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/animales', animalRoutes);
app.use('/api/cita', citaRoutes);
app.use('/api/usuario', usuarioRoutes);

sequelize.sync()
  .then(() => {
    console.log("Tablas sincronizadas correctamente");
    app.listen(3000, () => { // <-- AGREGA ESTO
      console.log('Servidor escuchando en el puerto 3000');
    });
  })
  .catch((error) => {
    console.error("Error creando tablas:", error);
  });
  