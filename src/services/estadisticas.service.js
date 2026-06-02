const pacientesRepository = require('../repositories/pacientes.repository');
const { ESPECIALIDADES } = require('../models/paciente.model');

function obtenerEstadisticas() {
  const pacientes = pacientesRepository.findAll();
  const totalPacientes = pacientes.length;
  const sumaEdades = pacientes.reduce((total, paciente) => total + paciente.edad, 0);
  const edadPromedio = totalPacientes === 0 ? 0 : Number((sumaEdades / totalPacientes).toFixed(1));

  const porEspecialidad = ESPECIALIDADES.reduce((result, especialidad) => {
    result[especialidad] = pacientes.filter((paciente) => paciente.especialidad === especialidad).length;
    return result;
  }, {});

  const pacientesConSeguimiento = pacientes.filter((paciente) =>
    paciente.historialConsultas.some((consulta) => consulta.seguimiento === true)
  ).length;

  return {
    totalPacientes,
    porEstado: {
      activos: pacientes.filter((paciente) => paciente.estado === 'ACTIVO').length,
      inactivos: pacientes.filter((paciente) => paciente.estado === 'INACTIVO').length,
      enTratamiento: pacientes.filter((paciente) => paciente.estado === 'EN_TRATAMIENTO').length
    },
    porEspecialidad,
    edadPromedio,
    pacientesConSeguimiento,
    ultimaActualizacion: new Date().toISOString()
  };
}

module.exports = {
  obtenerEstadisticas
};
