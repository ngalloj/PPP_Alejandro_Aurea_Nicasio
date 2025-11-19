// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const SECRET = 'admin1234';

// Middleware: verifica JWT
exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Falta token' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.log('JWT VERIFY ERROR:', err);
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = user;
    next();
  });
};

// Middleware: solo un rol permitido
exports.requireRole = (role) => (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== role)
    return res.status(403).json({ error: `Acceso solo para ${role}` });
  next();
};

// Middleware: permite varios roles
exports.allowRoles = (rolesArray) => (req, res, next) => {
  const rol = req.usuario?.rol;
  if (!rolesArray.includes(rol)) {
    return res.status(403).json({ error: `Acceso solo para ${rolesArray.join(' o ')}` });
  }
  next();
};
