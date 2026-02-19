// Cargar .env solo en local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const bcrypt = require("bcryptjs");

const app = express();

// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// CORS (en Render usar CORS_ORIGIN)
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:8100",
  credentials: true,
};
app.use(cors(corsOptions));

// Body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Modelos
const db = require("./models");
const Usuario = db.Usuario;

// Control sync
const FORCE_SYNC = process.env.DB_FORCE_SYNC === "true";
const adminPass = process.env.DEFAULT_ADMIN_PASSWORD || "alejandro";

// Sync DB sin tumbar el servidor si falla
db.sequelize
  .sync({ force: FORCE_SYNC })
  .then(async () => {
    console.log("DB sync OK ✅");

    if (FORCE_SYNC) {
      const hashedPassword = await bcrypt.hash(adminPass, 10);

      await Usuario.findOrCreate({
        where: { email: "alejandro@ppp.com" },
        defaults: {
          nombre: "Alejandro",
          email: "alejandro@ppp.com",
          contrasena: hashedPassword,
          rol: "administrativo",
        },
      });

      console.log("Usuario administrador creado");
    }
  })
  .catch((err) => {
    console.error("DB sync FAILED ❌", err.message || err);
  });

// Middleware auth (Basic y JWT)
app.use((req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return next();

  // Basic Auth
  if (authHeader.startsWith("Basic ")) {
    const base64Credentials = authHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
    const [username, password] = credentials.split(":");

    if (!req.body || typeof req.body !== "object") req.body = {};
    req.body.email = username;
    req.body.contrasena = password;

    return next();
  }

  // Bearer JWT
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json({ error: true, message: "Invalid user." });
      }
      req.user = user;
      req.token = token;
      return next();
    });

    return;
  }

  return next();
});

// Health / root
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API ClinicaVeterinaria2.0 funcionando ✅",
    timestamp: new Date().toISOString(),
  });
});

// Rutas
require("./routes/usuario.routes")(app);
require("./routes/animal.routes")(app);
require("./routes/cliente.routes")(app);
require("./routes/producto.routes")(app);
require("./routes/servicioClinico.routes")(app);
require("./routes/cita.routes")(app);
require("./routes/pedido.routes")(app);
require("./routes/factura.routes")(app);

require("./routes/lineaPedido.routes")(app);
require("./routes/lineaFactura.routes")(app);

require("./routes/atienden.routes")(app);
require("./routes/consultan.routes")(app);
require("./routes/incluyen.routes")(app);
require("./routes/necesitan.routes")(app);
require("./routes/realizan.routes")(app);

// Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
