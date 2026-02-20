"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");

// --- SSL CA (Aiven) opcional: si existe certs/aiven-ca.pem lo usa ---
let sslOptions = undefined;
try {
  const caPath = path.join(__dirname, "../certs/aiven-ca.pem");
  if (fs.existsSync(caPath)) {
    const ca = fs.readFileSync(caPath, "utf8");
    sslOptions = {
      ssl: {
        ca,
        require: true,
        rejectUnauthorized: true,
      },
    };
  } else {
    // Si no hay CA, intenta SSL sin validar (solo pruebas)
    sslOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    };
  }
} catch (e) {
  sslOptions = undefined;
}

// --- Instancia Sequelize ---
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: Number(dbConfig.PORT || process.env.DB_PORT || 3306),
  dialect: dbConfig.dialect || "mysql",
  logging: false,

  ...(sslOptions ? { dialectOptions: sslOptions } : {}),

  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 60000,
  },
  retry: { max: 3 },
});

// --- Contenedor de modelos ---
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// =========================
// CARGA DE MODELOS
// =========================

// Base
db.Usuario = require("./base/usuario.js")(sequelize, Sequelize);
db.Cliente = require("./base/cliente.js")(sequelize, Sequelize);

// Animales
db.Animal = require("./animales/animal.js")(sequelize, Sequelize);

// Historiales
db.Historial = require("./historiales/historial.js")(sequelize, Sequelize);
db.LineaHistorial = require("./historiales/lineaHistorial.js")(sequelize, Sequelize);

// Citas
db.Cita = require("./citas/cita.js")(sequelize, Sequelize);

// Catálogo
db.Elemento = require("./catalogo/elemento.js")(sequelize, Sequelize);
db.Producto = require("./catalogo/producto.js")(sequelize, Sequelize);

// OJO: tu archivo es models/catalogo/Servicio.js (S mayúscula)
db.Servicio = require("./catalogo/Servicio.js")(sequelize, Sequelize);

db.ServicioClinico = require("./catalogo/servicioClinico.js")(sequelize, Sequelize);

// Compras
db.Pedido = require("./compras/pedido.js")(sequelize, Sequelize);
db.LineaPedido = require("./compras/lineaPedido.js")(sequelize, Sequelize);

// Facturación
db.Factura = require("./facturacion/factura.js")(sequelize, Sequelize);
db.LineaFactura = require("./facturacion/lineaFactura.js")(sequelize, Sequelize);

// Unión (tablas puente)
db.Atienden = require("./union/atienden.js")(sequelize, Sequelize);
db.Consultan = require("./union/consultan.js")(sequelize, Sequelize);
db.Incluyen = require("./union/incluyen.js")(sequelize, Sequelize);
db.Necesitan = require("./union/necesitan.js")(sequelize, Sequelize);
db.Realizan = require("./union/realizan.js")(sequelize, Sequelize);

// =========================
// EJECUCIÓN DE ASOCIACIONES
// =========================
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

module.exports = db;