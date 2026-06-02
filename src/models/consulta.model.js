const { v4: uuidv4 } = require('uuid');

class Consulta {
  constructor({ medico, notas, medicamentos = [], seguimiento }) {
    this.idConsulta = uuidv4();
    this.fecha = new Date().toISOString();
    this.medico = medico;
    this.notas = notas;
    this.medicamentos = medicamentos;
    this.seguimiento = seguimiento;
  }
}

module.exports = Consulta;
