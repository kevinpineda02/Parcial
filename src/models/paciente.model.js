const { v4: uuidv4 } = require('uuid');

const ESTADOS = ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO'];
const ESPECIALIDADES = ['GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'NEUROLOGIA', 'TRAUMATOLOGIA'];

class Paciente {
  constructor({
    nombre,
    apellido,
    edad,
    dui,
    diagnostico,
    fechaIngreso,
    estado = 'ACTIVO',
    especialidad,
    historialConsultas = [],
    creadoPor = 'sistema',
    modificadoPor,
    fechaCreacion,
    fechaModificacion,
    version = 1
  }) {
    const now = new Date().toISOString();

    this.id = uuidv4();
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.dui = dui;
    this.diagnostico = diagnostico;
    this.fechaIngreso = fechaIngreso || now;
    this.estado = estado;
    this.especialidad = especialidad;
    this.historialConsultas = historialConsultas;
    this.creadoPor = creadoPor;
    this.modificadoPor = modificadoPor || creadoPor;
    this.fechaCreacion = fechaCreacion || now;
    this.fechaModificacion = fechaModificacion || now;
    this.version = version;
  }
}

module.exports = {
  Paciente,
  ESTADOS,
  ESPECIALIDADES
};
