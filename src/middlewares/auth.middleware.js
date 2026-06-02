const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AppError(401, 'Token de autenticacion requerido', {
      codigo: 'ERR-AUTH-001'
    }));
  }

  const token = authorization.split(' ')[1];

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'clave_super_secreta');
    return next();
  } catch (error) {
    return next(new AppError(401, 'Token invalido o expirado', {
      codigo: 'ERR-AUTH-002'
    }));
  }
}

module.exports = authMiddleware;
