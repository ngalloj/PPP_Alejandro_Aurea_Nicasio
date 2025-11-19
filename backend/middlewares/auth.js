// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const SECRET = "admin1234";

exports.authenticateToken = (req, res, next) => {
  console.log('Authorization header:', req.headers['authorization']);

  const authHeader = req.headers['authorization'];
  // Espera 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Falta token' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      console.log('JWT VERIFY ERROR:', err); // <--- LOG ERROR EXACTO
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.usuario = user;
    next();
  });
};

exports.requireRole = (role) => (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== role)
      return res.status(403).json({ error: 'Acceso solo para ' + role });
    next();
  };