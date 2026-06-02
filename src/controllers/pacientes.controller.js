const pacientesService = require('../services/pacientes.service');

function listarPacientes(req, res) {
  const result = pacientesService.listarPacientes(req.query);
  res.set('X-Cache', result.cache).status(200).json(result.data);
}

function obtenerPacientePorId(req, res) {
  res.status(200).json(pacientesService.obtenerPacientePorId(req.params.id));
}

function crearPaciente(req, res) {
  res.status(201).json(pacientesService.crearPaciente(req.body, req.user.usuario));
}

function actualizarPaciente(req, res) {
  res.status(200).json(pacientesService.actualizarPaciente(req.params.id, req.body, req.user.usuario));
}

function cambiarEstado(req, res) {
  res.status(200).json(pacientesService.cambiarEstado(req.params.id, req.body.estado, req.user.usuario));
}

function eliminarPaciente(req, res) {
  pacientesService.eliminarPaciente(req.params.id, req.user.usuario);
  res.status(204).send();
}

function obtenerHistorial(req, res) {
  res.status(200).json(pacientesService.obtenerHistorial(req.params.id));
}

function agregarConsulta(req, res) {
  res.status(201).json(pacientesService.agregarConsulta(req.params.id, req.body, req.user.usuario));
}

function obtenerVersion(req, res) {
  res.status(200).json(pacientesService.obtenerVersion(req.params.id));
}

function buscarPacientes(req, res) {
  res.status(200).json(pacientesService.buscarPacientes(req.query));
}

function exportarCsv(req, res) {
  const csv = pacientesService.exportarCsvPacientesActivos();

  res
    .status(200)
    .set('Content-Type', 'text/csv; charset=utf-8')
    .set('Content-Disposition', 'attachment; filename="pacientes-activos.csv"')
    .send(csv);
}

module.exports = {
  listarPacientes,
  obtenerPacientePorId,
  crearPaciente,
  actualizarPaciente,
  cambiarEstado,
  eliminarPaciente,
  obtenerHistorial,
  agregarConsulta,
  obtenerVersion,
  buscarPacientes,
  exportarCsv
};
