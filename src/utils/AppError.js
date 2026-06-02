const STATUS_TEXT = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error'
};

const DEFAULT_CODES = {
  400: 'ERR-VAL-001',
  401: 'ERR-AUTH-002',
  403: 'ERR-RBAC-001',
  404: 'ERR-PAC-001',
  409: 'ERR-PAC-409',
  500: 'ERR-SRV-500'
};

class AppError extends Error {
  constructor(statusCode, mensaje, options = {}) {
    super(mensaje);

    const normalizedOptions = Array.isArray(options) ? { detalles: options } : options;

    this.statusCode = statusCode;
    this.status = statusCode;
    this.codigo = normalizedOptions.codigo || DEFAULT_CODES[statusCode] || 'ERR-SRV-500';
    this.detalle = normalizedOptions.detalle;
    this.detalles = normalizedOptions.detalles;
    this.error = normalizedOptions.error || STATUS_TEXT[statusCode] || 'Error';
    this.isOperational = true;
  }
}

module.exports = AppError;
