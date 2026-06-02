const { Paciente } = require('../models/paciente.model');
const Consulta = require('../models/consulta.model');

const pacientes = [
  new Paciente({
    nombre: 'Ana',
    apellido: 'Martinez',
    edad: 34,
    dui: '01234567-8',
    diagnostico: 'Control general preventivo',
    estado: 'ACTIVO',
    especialidad: 'GENERAL',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dr. Martinez',
        notas: 'Paciente estable, controles normales',
        medicamentos: ['Multivitaminico'],
        seguimiento: true
      })
    ]
  }),
  new Paciente({
    nombre: 'Carlos',
    apellido: 'Ramirez',
    edad: 58,
    dui: '12345678-9',
    diagnostico: 'Hipertension arterial cronica',
    estado: 'EN_TRATAMIENTO',
    especialidad: 'CARDIOLOGIA',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dra. Lopez',
        notas: 'Ajuste de tratamiento antihipertensivo',
        medicamentos: ['Losartan'],
        seguimiento: true
      })
    ]
  }),
  new Paciente({
    nombre: 'Sofia',
    apellido: 'Hernandez',
    edad: 9,
    dui: '23456789-0',
    diagnostico: 'Evaluacion pediatrica rutinaria',
    estado: 'ACTIVO',
    especialidad: 'PEDIATRIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Miguel',
    apellido: 'Castro',
    edad: 42,
    dui: '34567890-1',
    diagnostico: 'Dolor lumbar persistente',
    estado: 'ACTIVO',
    especialidad: 'TRAUMATOLOGIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Lucia',
    apellido: 'Vargas',
    edad: 27,
    dui: '45678901-2',
    diagnostico: 'Cefalea recurrente severa',
    estado: 'EN_TRATAMIENTO',
    especialidad: 'NEUROLOGIA',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dr. Martinez',
        notas: 'Solicitar estudios neurologicos complementarios',
        medicamentos: ['Paracetamol'],
        seguimiento: true
      })
    ]
  }),
  new Paciente({
    nombre: 'Jorge',
    apellido: 'Mendez',
    edad: 63,
    dui: '56789012-3',
    diagnostico: 'Seguimiento postoperatorio cardiaco',
    estado: 'INACTIVO',
    especialidad: 'CARDIOLOGIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Patricia',
    apellido: 'Reyes',
    edad: 51,
    dui: '67890123-4',
    diagnostico: 'Fractura de radio en recuperacion',
    estado: 'EN_TRATAMIENTO',
    especialidad: 'TRAUMATOLOGIA',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dra. Molina',
        notas: 'Revisar movilidad y dolor residual',
        medicamentos: ['Ibuprofeno'],
        seguimiento: false
      })
    ]
  }),
  new Paciente({
    nombre: 'Daniel',
    apellido: 'Torres',
    edad: 16,
    dui: '78901234-5',
    diagnostico: 'Asma bronquial intermitente',
    estado: 'ACTIVO',
    especialidad: 'PEDIATRIA',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dra. Lopez',
        notas: 'Educar sobre inhalador de rescate',
        medicamentos: ['Salbutamol'],
        seguimiento: true
      })
    ]
  }),
  new Paciente({
    nombre: 'Elena',
    apellido: 'Flores',
    edad: 45,
    dui: '89012345-6',
    diagnostico: 'Diabetes tipo 2 controlada',
    estado: 'ACTIVO',
    especialidad: 'GENERAL',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Roberto',
    apellido: 'Navas',
    edad: 72,
    dui: '90123456-7',
    diagnostico: 'Evaluacion neurologica por temblor',
    estado: 'INACTIVO',
    especialidad: 'NEUROLOGIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Marcela',
    apellido: 'Ortega',
    edad: 31,
    dui: '11223344-5',
    diagnostico: 'Infeccion respiratoria aguda',
    estado: 'ACTIVO',
    especialidad: 'GENERAL',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Fernando',
    apellido: 'Aguilar',
    edad: 39,
    dui: '22334455-6',
    diagnostico: 'Lesion de rodilla derecha',
    estado: 'ACTIVO',
    especialidad: 'TRAUMATOLOGIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Gabriela',
    apellido: 'Santos',
    edad: 24,
    dui: '33445566-7',
    diagnostico: 'Migrana cronica con aura frecuente',
    estado: 'EN_TRATAMIENTO',
    especialidad: 'NEUROLOGIA',
    creadoPor: 'sistema',
    historialConsultas: [
      new Consulta({
        medico: 'Dr. Martinez',
        notas: 'Indicar diario de sintomas neurologicos',
        medicamentos: ['Sumatriptan'],
        seguimiento: true
      })
    ]
  }),
  new Paciente({
    nombre: 'Ricardo',
    apellido: 'Pineda',
    edad: 47,
    dui: '44556677-8',
    diagnostico: 'Arritmia cardiaca en estudio',
    estado: 'ACTIVO',
    especialidad: 'CARDIOLOGIA',
    creadoPor: 'sistema'
  }),
  new Paciente({
    nombre: 'Valeria',
    apellido: 'Campos',
    edad: 6,
    dui: '55667788-9',
    diagnostico: 'Control de crecimiento infantil',
    estado: 'ACTIVO',
    especialidad: 'PEDIATRIA',
    creadoPor: 'sistema'
  })
];

function findAll() {
  return pacientes;
}

function findById(id) {
  return pacientes.find((paciente) => paciente.id === id);
}

function findByDui(dui) {
  return pacientes.find((paciente) => paciente.dui === dui);
}

function create(data) {
  const paciente = new Paciente(data);
  pacientes.push(paciente);
  return paciente;
}

function touchPaciente(paciente, modificadoPor) {
  paciente.modificadoPor = modificadoPor;
  paciente.fechaModificacion = new Date().toISOString();
  paciente.version += 1;
}

function update(id, data, modificadoPor) {
  const paciente = findById(id);

  if (!paciente) {
    return null;
  }

  Object.assign(paciente, {
    nombre: data.nombre,
    apellido: data.apellido,
    edad: data.edad,
    dui: data.dui,
    diagnostico: data.diagnostico,
    especialidad: data.especialidad
  });
  touchPaciente(paciente, modificadoPor);

  return paciente;
}

function updateEstado(id, estado, modificadoPor) {
  const paciente = findById(id);

  if (!paciente) {
    return null;
  }

  paciente.estado = estado;
  touchPaciente(paciente, modificadoPor);
  return paciente;
}

function logicalDelete(id, modificadoPor) {
  return updateEstado(id, 'INACTIVO', modificadoPor);
}

function addConsulta(id, consultaData, modificadoPor) {
  const paciente = findById(id);

  if (!paciente) {
    return null;
  }

  const consulta = new Consulta(consultaData);
  paciente.historialConsultas.push(consulta);
  touchPaciente(paciente, modificadoPor);
  return consulta;
}

module.exports = {
  findAll,
  findById,
  findByDui,
  create,
  update,
  updateEstado,
  logicalDelete,
  addConsulta
};
