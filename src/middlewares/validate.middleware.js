const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validate(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const detalles = result.array().map((error) => error.msg);
  return next(new AppError(400, 'Validacion fallida', {
    codigo: 'ERR-VAL-001',
    detalles
  }));
}

module.exports = validate;
