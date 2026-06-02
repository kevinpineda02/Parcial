const AppError = require('../utils/AppError');

function errorMiddleware(error, req, res, next) {
  const appError = error instanceof AppError
    ? error
    : new AppError(500, 'Error inesperado', ['Ha ocurrido un error interno']);

  const response = {
    codigo: appError.codigo,
    timestamp: new Date().toISOString(),
    status: appError.statusCode,
    error: appError.error,
    mensaje: appError.message,
    path: req.originalUrl
  };

  if (appError.detalle) {
    response.detalle = appError.detalle;
  }

  if (Array.isArray(appError.detalles) && appError.detalles.length > 0) {
    response.detalles = appError.detalles;
  }

  res.status(appError.statusCode).json(response);
}

module.exports = errorMiddleware;
