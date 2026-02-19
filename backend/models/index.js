'use strict';

const fs = require('fs');
const path = require('path');
const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");

// ---- SSL (Aiven) ----
let sslOptions = null;

// Opción A: leer CA desde archivo (recomendado)
try {
  const caPath = path.join(__dirname, '../certs/aiven-ca.pem');
  if (fs.existsSync(caPath)) {
    const ca = fs.readFileSync(caPath, 'utf8');
    sslOptions = {
      require: true,
      rejectUnauthorized: true,
      ca
    };
  }
} catch (e) {
  // si falla, seguimos sin CA
}

// Opción B: sin CA (solo para probar; en producción mejor con CA)
if (!sslOptions) {
  sslOptions = {
    require: true,
    rejectUnauthorized: false
  };
}

// ---- Sequelize ----
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: Number(dbConfig.PORT || 3306),
  dialect: dbConfig.dialect,
  logging: false,
  dialectOptions: {
    ssl: sslOptions
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 60000
  },
  retry: { max: 3 }
});

// ---- Contenedor de modelos ----
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ---- CARGA DE MODELOS ----
// Base
db.Usuario = require("./base/usuario.js")(sequelize, Sequelize);

// Animales
db.Animal = require("./animales/animal.js")(sequelize, Sequelize);

// Historial
db.Historial = require("./historiales/historial.js")(sequelize, Sequelize);
db.LineaHistorial = require("./historiales/lineaHistorial.js")(sequelize, Sequelize);

// Citas
db.Cita = require("./citas/cita.js")(sequelize, Sequelize);

// Catálogo
db.Elemento = require("./catalogo/elemento.js")(sequelize, Sequelize);
db.Producto = require("./catalogo/producto.js")(sequelize, Sequelize);

// ⚠️ OJO CON EL NOMBRE DEL ARCHIVO EN LINUX:
// Si tu archivo real se llama "servicio.js" (minúscula), CAMBIA esta línea a "./catalogo/servicio.js"
db.Servicio = require("./catalogo/Servicio.js")(sequelize, Sequelize);

// Facturación
db.Factura = require("./facturacion/factura.js")(sequelize, Sequelize);
db.LineaFactura = require("./facturacion/lineaFactura.js")(sequelize, Sequelize);

// ---- ASOCIACIONES ----
Object.keys(db).forEach(modelName => {
  if (db[modelName] && typeof db[modelName].associate === "function") {
    db[modelName].associate(db);
  }
});

module.exports = db;







// // Se importan parametros del modelo
// const dbConfig = require("../config/db.config.js");
// //Se importa Sequelize del node module
// const Sequelize = require("sequelize");

// // Se crea la instancia de Sequelize con la configuración de la base de datos
// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,
//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

// //Se crea un objeto para almacenar Sequelize y sequelize 
// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;

// // //Se cargar el Sequelize y sequelize de los modelos
// db.animal = require("./animales/animal.js")(sequelize, Sequelize);
// db.cliente = require("./base/cliente.js")(sequelize, Sequelize);
// db.usuario = require("./base/usuario.js")(sequelize, Sequelize);
// db.producto = require("./catalogo/producto.js")(sequelize, Sequelize);
// db.servicioClinico = require("./catalogo/servicioClinico.js")(sequelize, Sequelize);
// db.cita = require("./citas/cita.js")(sequelize, Sequelize);
// db.pedido = require("./compras/pedido.js")(sequelize, Sequelize);
// db.lineaPedido = require("./compras/lineaPedido.js")(sequelize, Sequelize);
// db.factura = require("./facturacion/factura.js")(sequelize, Sequelize);
// db.lineaFactura = require("./facturacion/lineaFactura.js")(sequelize, Sequelize);

// db.atienden = require("./union/atienden.js")(sequelize, Sequelize);
// db.consultan = require("./union/consultan.js")(sequelize, Sequelize);
// db.incluyen = require("./union/incluyen.js")(sequelize, Sequelize);
// db.necesitan = require("./union/necesitan.js")(sequelize, Sequelize);
// db.realizan = require("./union/realizan.js")(sequelize, Sequelize);

// //Relaciones de los modelos

// // Usuarios - Clientes (Consultan)

// db.usuario.belongsToMany(db.cliente, {
//   through: db.consultan,
//   foreignKey: "idUsuario",
//   otherKey: "idCliente",
//   as: "ClientesConsultados"
// });
// db.cliente.belongsToMany(db.usuario, {
//   through: db.consultan,
//   foreignKey: "idCliente",
//   otherKey: "idUsuario",
//   as: "UsuariosQueConsultan"
// });

// // Usuarios - Clientes (Atienden)
// db.usuario.belongsToMany(db.cliente, {
//   through: db.atienden,
//   foreignKey: "idUsuario",
//   otherKey: "idCliente",
//   as: "ClientesAtendidos"
// });
// db.cliente.belongsToMany(db.usuario, {
//   through: db.atienden,
//   foreignKey: "idCliente",
//   otherKey: "idUsuario",
//   as: "UsuariosQueAtienden"
// });

// // Citas - Productos (Incluyen)
// db.cita.belongsToMany(db.producto, {
//   through: db.incluyen,
//   foreignKey: "idCita",
//   otherKey: "idProducto",
//   as: "Productos"
// });
// db.producto.belongsToMany(db.cita, {
//   through: db.incluyen,
//   foreignKey: "idProducto",
//   otherKey: "idCita",
//   as: "Citas"
// });

// // Productos -ServicioClinico (Necesitan)
// db.producto.belongsToMany(db.servicioClinico, {
//   through: db.necesitan,
//   foreignKey: "idProducto",
//   otherKey: "idServicio",
//   as: "ServiciosNecesarios"
// });
// db.servicioClinico.belongsToMany(db.producto, {
//   through: db.necesitan,
//   foreignKey: "idServicio",
//   otherKey: "idProducto",
//   as: "ProductosQueNecesitan"
// });

// // Productos - Pedidos (Realizan)
// db.producto.belongsToMany(db.pedido, {
//   through: db.realizan,
//   foreignKey: "idProducto",
//   otherKey: "idPedido",
//   as: "Pedidos"
// });
// db.pedido.belongsToMany(db.producto, {
//   through: db.realizan,
//   foreignKey: "idPedido",
//   otherKey: "idProducto",
//   as: "Productos"
// });

// module.exports = db;
