module.exports = require("./baseControllers/auth.js");
const db = require("../models");
const User = db.Usuario; // ✅ no db.usuario

