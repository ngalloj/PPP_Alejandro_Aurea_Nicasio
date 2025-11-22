// backend/app.js

const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');

const rutas = require('./routes');
const usuarioRutas = require('./routes/usuario.routes');

const app = express();

console.log("=== EXPRESS CORS FIX START ===");

// --- Handler UNIVERSAL OPTIONS: DEBE SER EL PRIMERO ---
app.use((req, res, next) => {
  console.log('Universal middleware:', req.method, req.path);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
}));

app.use(express.json());

// ✅ NUEVO: Servir archivos estáticos (fotos de animales)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', rutas);
app.use('/api/usuario', usuarioRutas);

// Catch-all de rutas NO encontradas
app.use((req, res, next) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

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
