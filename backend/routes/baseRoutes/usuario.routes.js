// backend/routes/baseRoutes/usuario.routes.js
// ----------------------------------------------------------
// Rutas de usuarios: CRUD + autenticación (signin)
// Se montan bajo el prefijo /api/usuario
// ----------------------------------------------------------

module.exports = app => {
  const users = require("../../controllers/baseControllers/usuario.controller.js");
  const auth = require("../../controllers/baseControllers/auth.js");

  const router = require("express").Router();

  // Crea un nuevo usuario
  // POST /api/usuario
  router.post("/", auth.isAuthenticated, /* upload.single('file'), */ users.create);

  // Muestra todos los usuarios
  // GET /api/usuario
  router.get("/", auth.isAuthenticated, users.findAll);

  // Localiza un usuario por id
  // GET /api/usuario/:id
  router.get("/:id", auth.isAuthenticated, users.findOne);

  // Actualiza un usuario por id
  // PUT /api/usuario/:id
  router.put("/:id", auth.isAuthenticated, /* upload.single('file'), */ users.update);

  // Autenticación de usuario (login)
  // POST /api/usuario/signin
  // Body: { email, contrasena }
  router.post("/signin", auth.signin);

  // Borra un usuario por id
  // DELETE /api/usuario/:id
  router.delete("/:id", auth.isAuthenticated, users.delete);

  // Prefijo común para todas las rutas anteriores
  app.use("/api/usuario", router);
};
