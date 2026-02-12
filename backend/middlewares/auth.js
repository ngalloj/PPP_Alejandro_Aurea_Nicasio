// backend/middlewares/auth.js - COMPLETO Y FUNCIONAL

const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const rolePermissions = {
  admin: ['*'],
  veterinario: ['citas.*', 'historiales.*', 'animales.read', 'inventario.read'],
  recepcionista: ['citas.create', 'citas.read', 'citas.cancel', 'facturas.*', 'inventario.read', 'clientes.read'],
  cliente: ['citas.read', 'animales.read', 'historiales.read']
};

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado', code: 'NO_TOKEN' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu-secret-key');
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = usuario;
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({ error: 'Token inválido o expirado', code: 'INVALID_TOKEN' });
  }
};

const roleAuth = (...requiredRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userRole = req.user.rol || 'cliente';

    if (!requiredRoles.includes(userRole)) {
      return res.status(403).json({
        error: `Rol no autorizado. Se requiere: ${requiredRoles.join(' o ')}`,
        userRole,
        code: 'FORBIDDEN'
      });
    }

    next();
  };
};

// ALIAS: allowRoles es lo mismo que roleAuth
const allowRoles = roleAuth;

const requireRole = roleAuth;

const hasPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const userRole = req.user.rol || 'cliente';
    const permissions = rolePermissions[userRole] || [];

    const hasWildcard = permissions.includes('*');
    const hasSpecific = permissions.includes(permission);
    const hasCategory = permissions.some(p => p.endsWith('.*') && permission.startsWith(p.split('.')[0]));

    if (!hasWildcard && !hasSpecific && !hasCategory) {
      return res.status(403).json({
        error: `Permiso requerido: ${permission}`,
        code: 'PERMISSION_DENIED'
      });
    }

    next();
  };
};

module.exports = { auth, roleAuth, requireRole, allowRoles, hasPermission };
