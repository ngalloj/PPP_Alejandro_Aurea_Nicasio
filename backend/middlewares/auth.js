const jwt = require('jsonwebtoken');
const SECRET = 'admin1234';

exports.authenticateToken = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Falta token' });
  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
};

exports.requireRole = (role) => (req, res, next) => {
    if (!req.usuario || req.usuario.rol !== role)
      return res.status(403).json({ error: 'Acceso solo para ' + role });
    next();
  };