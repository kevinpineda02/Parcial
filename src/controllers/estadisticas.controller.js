const estadisticasService = require('../services/estadisticas.service');

function obtenerEstadisticas(req, res) {
  res.status(200).json(estadisticasService.obtenerEstadisticas());
}

module.exports = {
  obtenerEstadisticas
};
