const auditoriaRepository = require('../repositories/auditoria.repository');

function registrarEvento({ usuario, accion, recursoId, detalles }) {
  return auditoriaRepository.create({
    usuario,
    accion,
    recursoId,
    detalles
  });
}

function listarEventos(filters) {
  const data = auditoriaRepository.findAll(filters);

  return {
    data,
    total: data.length
  };
}

module.exports = {
  registrarEvento,
  listarEventos
};
