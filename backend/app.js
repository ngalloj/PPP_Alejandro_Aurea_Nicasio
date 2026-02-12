// backend/app.js - VERSIÓN SIMPLIFICADA QUE FUNCIONA

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
const rutas = require('./routes');
const usuarioRutas = require('./routes/usuario.routes');

const app = express();

console.log("=== INICIANDO APP ===");

// Middlewares
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path}`);
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS,PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.use(cors({ origin: 'http://localhost:4200', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api', rutas);
app.use('/api/usuario', usuarioRutas);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// 404
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(500).json({ mensaje: 'Error interno del servidor', error: err.message });
});



// Iniciar
const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Base de datos sincronizada");
    app.listen(PORT, () => {
      console.log(`
╔═══════════════════════════════════╗
║  🏥 API DG Mascotas INICIADA     ║
║  Puerto: ${PORT}                  ║
║  http://localhost:${PORT}         ║
╚═══════════════════════════════════╝
      `);
    });
  })
  .catch(error => {
    console.error("❌ Error DB:", error);
    process.exit(1);
  });

  // Agregar DESPUÉS de las rutas actuales:
//app.use('/api/recepcionista', require('./routes/recepcionista.routes'));
//app.use('/api/inventario', require('./routes/inventario.routes'));
//app.use('/api/facturas', require('./routes/factura.routes'));


module.exports = app;
