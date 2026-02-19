//Rutas de usuarios

module.exports = app => {
    const users = require("../../controllers/baseControllers/usuario.controller.js");
    //var upload = require('../multer/upload');
    const auth = require("../../controllers/baseControllers/auth.js");
  
    var router = require("express").Router();
  
   
// 1) LOGIN SIEMPRE ARRIBA
router.post("/signin", auth.signin);    

// Crea un nuevo usuario
router.post("/", auth.isAuthenticated, users.create);

// Muestra todos los usuarios
router.get("/", auth.isAuthenticated, users.findAll);

// Localiza un usuario por la id
router.get("/:id", auth.isAuthenticated, users.findOne);

// Actualiza un usuario por la id
router.put("/:id", auth.isAuthenticated, users.update);

// Borra un usuario por la id
router.delete("/:id", auth.isAuthenticated, users.delete);

app.use("/api/usuario", router);

  };