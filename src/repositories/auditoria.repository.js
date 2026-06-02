const { AuditoriaEvento } = require('../models/auditoria.model');

const eventos = [];

function findAll(filters = {}) {
  return eventos.filter((evento) => {
    const matchesAccion = filters.accion ? evento.accion === filters.accion : true;
    const matchesUsuario = filters.usuario ? evento.usuario === filters.usuario : true;
    const matchesRecurso = filters.recursoId ? evento.recursoId === filters.recursoId : true;

    return matchesAccion && matchesUsuario && matchesRecurso;
  });
}

function create(data) {
  const evento = new AuditoriaEvento(data);
  eventos.push(evento);
  return evento;
}

module.exports = {
  findAll,
  create
};
