const AppError = require('../utils/AppError');

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Token de autenticacion requerido', {
        codigo: 'ERR-AUTH-001'
      }));
    }

    if (!roles.includes(req.user.rol)) {
      return next(new AppError(403, 'Rol insuficiente para acceder a este recurso', {
        codigo: 'ERR-RBAC-001'
      }));
    }

    return next();
  };
}

module.exports = authorizeRoles;
