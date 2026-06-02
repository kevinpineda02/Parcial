const { v4: uuidv4 } = require('uuid');

const ACCIONES_AUDITORIA = ['CREATE', 'UPDATE', 'DELETE', 'ESTADO_CHANGE'];

class AuditoriaEvento {
  constructor({ usuario, accion, recursoId, detalles }) {
    this.id = uuidv4();
    this.usuario = usuario;
    this.accion = accion;
    this.recursoId = recursoId;
    this.detalles = detalles;
    this.timestamp = new Date().toISOString();
  }
}

module.exports = {
  AuditoriaEvento,
  ACCIONES_AUDITORIA
};
