// backend/middlewares/validators.js

exports.validarCampos = (req, res, next) => {
  if (req.errors && req.errors.length) {
    return res.status(400).json({ errors: req.errors });
  }
  next();
};

exports.validarAnimal = (req, res, next) => {
  req.errors = [];
  if (!req.body.nombre) req.errors.push('Falta nombre');
  if (!req.body.usuario_id) req.errors.push('Falta usuario_id');
  next();
};

exports.validarUsuario = (req, res, next) => {
  req.errors = [];
  if (!req.body.email) req.errors.push('Falta email');
  if (!req.body.password && req.method === 'POST') req.errors.push('Falta password');
  if (!req.body.dni) req.errors.push('Falta dni');
  next();
};

exports.validarCita = (req, res, next) => {
  req.errors = [];
  if (!req.body.fecha) req.errors.push('Falta fecha');
  if (!req.body.animal_id) req.errors.push('Falta animal_id');
  if (!req.body.usuario_id) req.errors.push('Falta usuario_id');
  next();
};
