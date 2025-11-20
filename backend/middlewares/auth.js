// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const SECRET = 'admin1234';

// Middleware: verifica JWT (token en autorización tipo Bearer)
exports.auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Falta token' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = user; // payload del JWT, incluye id, email, rol, etc.
    next();
  });
};

// Middleware: exige que el usuario tenga un rol (string o en array)
exports.requireRole = (role) => (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== role)
    return res.status(403).json({ error: `Acceso solo para ${role}` });
  next();
};

exports.allowRoles = (rolesArray) => (req, res, next) => {
  const rol = req.usuario?.rol;
  if (!rolesArray.includes(rol)) {
    return res.status(403).json({ error: `Acceso solo para ${rolesArray.join(' o ')}` });
  }
  next();
};
