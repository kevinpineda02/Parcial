const auditoriaService = require('../services/auditoria.service');

function listarEventos(req, res) {
  res.status(200).json(auditoriaService.listarEventos(req.query));
}

module.exports = {
  listarEventos
};
