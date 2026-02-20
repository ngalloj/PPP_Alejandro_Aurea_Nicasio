"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const dbConfig = require("../config/db.config.js");

// SSL (Aiven)
// SSL opcional (Aiven CA si la tienes)
let sslOptions;
try {
  const caPath = path.join(__dirname, "../certs/aiven-ca.pem");
  if (fs.existsSync(caPath)) {
    const ca = fs.readFileSync(caPath, "utf8");
    sslOptions = { ssl: { ca, require: true, rejectUnauthorized: true } };
  } else {
    sslOptions = { ssl: { require: true, rejectUnauthorized: false } };
  }
} catch (e) {
  sslOptions = undefined;
  // Si no tienes el CA en repo, prueba sin validar (no ideal, pero sirve)
  dialectOptions = {
    ssl: { require: true, rejectUnauthorized: false },
  };
}

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: Number(dbConfig.PORT || 3306),
  dialect: dbConfig.dialect || "mysql",
  logging: false,
  ...(sslOptions ? { dialectOptions: sslOptions } : {}),
  pool: { max: 5, min: 0, idle: 10000, acquire: 60000 },
  retry: { max: 3 },
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

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
db.Servicio = require("./catalogo/Servicio.js")(sequelize, Sequelize);
db.ServicioClinico = require("./catalogo/servicioClinico.js")(sequelize, Sequelize);

// Compras
db.Pedido = require("./compras/pedido.js")(sequelize, Sequelize);
db.LineaPedido = require("./compras/lineaPedido.js")(sequelize, Sequelize);

// Facturación
db.Factura = require("./facturacion/factura.js")(sequelize, Sequelize);
db.LineaFactura = require("./facturacion/lineaFactura.js")(sequelize, Sequelize);

// Unión
db.Atienden = require("./union/atienden.js")(sequelize, Sequelize);
db.Consultan = require("./union/consultan.js")(sequelize, Sequelize);
db.Incluyen = require("./union/incluyen.js")(sequelize, Sequelize);
db.Necesitan = require("./union/necesitan.js")(sequelize, Sequelize);
db.Realizan = require("./union/realizan.js")(sequelize, Sequelize);

// Asociaciones
Object.keys(db).forEach((modelName) => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

module.exports = db;