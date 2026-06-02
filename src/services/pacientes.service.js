const AppError = require('../utils/AppError');
const pacientesRepository = require('../repositories/pacientes.repository');
const auditoriaService = require('./auditoria.service');
const cache = require('../utils/cache');
const { paginate, parsePagination } = require('../utils/pagination');

const SORTABLE_FIELDS = ['nombre', 'apellido', 'edad', 'fechaIngreso', 'especialidad', 'estado'];
const CSV_COLUMNS = [
  'id',
  'nombre',
  'apellido',
  'edad',
  'dui',
  'diagnostico',
  'estado',
  'especialidad',
  'fechaIngreso',
  'creadoPor',
  'modificadoPor',
  'fechaCreacion',
  'fechaModificacion',
  'version'
];

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function compareValues(firstValue, secondValue, direction) {
  if (typeof firstValue === 'number' && typeof secondValue === 'number') {
    return (firstValue - secondValue) * direction;
  }

  return String(firstValue ?? '').localeCompare(String(secondValue ?? '')) * direction;
}

function sortPacientes(pacientes, sortBy, order) {
  const direction = order === 'desc' ? -1 : 1;
  const fields = String(sortBy || 'nombre')
    .split(',')
    .map((field) => field.trim())
    .filter(Boolean);

  return [...pacientes].sort((first, second) => {
    for (const field of fields) {
      const result = compareValues(first[field], second[field], direction);

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });
}

function aplicarFiltrosListado(pacientes, query) {
  let filtered = [...pacientes];

  if (query.estado) {
    filtered = filtered.filter((paciente) => paciente.estado === query.estado);
  } else {
    filtered = filtered.filter((paciente) => paciente.estado !== 'INACTIVO');
  }

  if (query.especialidad) {
    filtered = filtered.filter((paciente) => paciente.especialidad === query.especialidad);
  }

  if (query.edadMin !== undefined) {
    const edadMin = Number.parseInt(query.edadMin, 10);
    filtered = filtered.filter((paciente) => paciente.edad >= edadMin);
  }

  if (query.edadMax !== undefined) {
    const edadMax = Number.parseInt(query.edadMax, 10);
    filtered = filtered.filter((paciente) => paciente.edad <= edadMax);
  }

  if (query.diagnostico) {
    const diagnostico = normalizeText(query.diagnostico);
    filtered = filtered.filter((paciente) => normalizeText(paciente.diagnostico).includes(diagnostico));
  }

  return filtered;
}

function listarPacientes(query) {
  const cacheKey = cache.buildPacientesListKey(query);
  const cached = cache.get(cacheKey);

  if (cached) {
    return {
      data: cached,
      cache: 'HIT'
    };
  }

  const { page, size, sortBy, order } = parsePagination(query);
  const pacientes = aplicarFiltrosListado(pacientesRepository.findAll(), query);
  const sorted = sortPacientes(pacientes, sortBy, order);
  const result = paginate(sorted, page, size);

  cache.set(cacheKey, result);

  return {
    data: result,
    cache: 'MISS'
  };
}

function obtenerPacientePorId(id) {
  const paciente = pacientesRepository.findById(id);

  if (!paciente) {
    throw new AppError(404, 'Paciente no encontrado', {
      codigo: 'ERR-PAC-001',
      detalle: `id = ${id}`
    });
  }

  return paciente;
}

function validarDuiUnico(dui, pacienteId) {
  const paciente = pacientesRepository.findByDui(dui);

  if (paciente && paciente.id !== pacienteId) {
    throw new AppError(409, 'DUI duplicado', {
      codigo: 'ERR-PAC-002',
      detalle: `dui = ${dui}`
    });
  }
}

function crearPaciente(data, usuario) {
  validarDuiUnico(data.dui);

  const paciente = pacientesRepository.create({
    ...data,
    creadoPor: usuario,
    modificadoPor: usuario
  });

  auditoriaService.registrarEvento({
    usuario,
    accion: 'CREATE',
    recursoId: paciente.id,
    detalles: `Paciente creado con DUI ${paciente.dui}`
  });
  cache.clear();

  return paciente;
}

function actualizarPaciente(id, data, usuario) {
  if (Object.prototype.hasOwnProperty.call(data, 'estado')) {
    throw new AppError(400, 'El estado debe modificarse usando PATCH /api/v1/pacientes/:id/estado', {
      codigo: 'ERR-PAC-003',
      detalle: 'Use PATCH /api/v1/pacientes/:id/estado'
    });
  }

  const pacienteActual = obtenerPacientePorId(id);
  const versionEnviada = Number.parseInt(data.version, 10);

  if (versionEnviada !== pacienteActual.version) {
    throw new AppError(409, 'Conflicto de version', {
      codigo: 'ERR-PAC-409',
      detalle: 'La version enviada no coincide con la version actual del paciente'
    });
  }

  validarDuiUnico(data.dui, id);

  const versionAnterior = pacienteActual.version;
  const pacienteActualizado = pacientesRepository.update(id, data, usuario);

  auditoriaService.registrarEvento({
    usuario,
    accion: 'UPDATE',
    recursoId: pacienteActualizado.id,
    detalles: `Paciente actualizado. Version anterior: ${versionAnterior}, nueva version: ${pacienteActualizado.version}`
  });
  cache.clear();

  return pacienteActualizado;
}

function cambiarEstado(id, estado, usuario) {
  const pacienteActual = obtenerPacientePorId(id);
  const estadoAnterior = pacienteActual.estado;
  const pacienteActualizado = pacientesRepository.updateEstado(id, estado, usuario);

  auditoriaService.registrarEvento({
    usuario,
    accion: 'ESTADO_CHANGE',
    recursoId: pacienteActualizado.id,
    detalles: `Estado cambiado de ${estadoAnterior} a ${estado}`
  });
  cache.clear();

  return pacienteActualizado;
}

function eliminarPaciente(id, usuario) {
  const paciente = obtenerPacientePorId(id);

  pacientesRepository.logicalDelete(id, usuario);
  auditoriaService.registrarEvento({
    usuario,
    accion: 'DELETE',
    recursoId: paciente.id,
    detalles: 'Eliminacion logica del paciente'
  });
  cache.clear();
}

function obtenerHistorial(id) {
  const paciente = obtenerPacientePorId(id);

  return {
    idPaciente: paciente.id,
    paciente: `${paciente.nombre} ${paciente.apellido}`,
    historialConsultas: paciente.historialConsultas
  };
}

function agregarConsulta(id, data, usuario) {
  obtenerPacientePorId(id);
  const consulta = pacientesRepository.addConsulta(id, data, usuario);
  cache.clear();
  return consulta;
}

function obtenerVersion(id) {
  const paciente = obtenerPacientePorId(id);

  return {
    id: paciente.id,
    version: paciente.version,
    fechaModificacion: paciente.fechaModificacion,
    modificadoPor: paciente.modificadoPor
  };
}

function buscarPacientes(query) {
  let pacientes = pacientesRepository.findAll();

  if (query.estado) {
    pacientes = pacientes.filter((paciente) => paciente.estado === query.estado);
  } else {
    pacientes = pacientes.filter((paciente) => paciente.estado !== 'INACTIVO');
  }

  if (query.nombre) {
    const nombre = normalizeText(query.nombre);
    pacientes = pacientes.filter((paciente) => normalizeText(paciente.nombre).includes(nombre));
  }

  if (query.dui) {
    pacientes = pacientes.filter((paciente) => paciente.dui === query.dui);
  }

  if (query.diagnostico) {
    const diagnostico = normalizeText(query.diagnostico);
    pacientes = pacientes.filter((paciente) => normalizeText(paciente.diagnostico).includes(diagnostico));
  }

  return pacientes;
}

function escapeCsv(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const text = String(value).replace(/"/g, '""');
  return /[",\r\n]/.test(text) ? `"${text}"` : text;
}

function exportarCsvPacientesActivos() {
  const pacientesActivos = pacientesRepository
    .findAll()
    .filter((paciente) => paciente.estado === 'ACTIVO');

  const lines = [
    CSV_COLUMNS.join(','),
    ...pacientesActivos.map((paciente) =>
      CSV_COLUMNS.map((column) => escapeCsv(paciente[column])).join(',')
    )
  ];

  return `${lines.join('\r\n')}\r\n`;
}

module.exports = {
  SORTABLE_FIELDS,
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
  exportarCsvPacientesActivos
};
