const express = require('express');
const { body, query } = require('express-validator');
const pacientesController = require('../controllers/pacientes.controller');
const pacientesService = require('../services/pacientes.service');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { ESTADOS, ESPECIALIDADES } = require('../models/paciente.model');

const router = express.Router();
const nombreRegex = /^[A-Za-z\s]+$/;

const pacienteValidators = [
  body('nombre')
    .notEmpty()
    .withMessage('El campo nombre es obligatorio')
    .isLength({ min: 3, max: 60 })
    .withMessage('El campo nombre debe tener entre 3 y 60 caracteres')
    .matches(nombreRegex)
    .withMessage('El campo nombre solo permite letras y espacios'),
  body('apellido')
    .notEmpty()
    .withMessage('El campo apellido es obligatorio')
    .isLength({ min: 3, max: 60 })
    .withMessage('El campo apellido debe tener entre 3 y 60 caracteres')
    .matches(nombreRegex)
    .withMessage('El campo apellido solo permite letras y espacios'),
  body('edad')
    .notEmpty()
    .withMessage('El campo edad es obligatorio')
    .isInt({ min: 1, max: 120 })
    .withMessage('El campo edad debe ser un entero entre 1 y 120')
    .toInt(),
  body('dui')
    .notEmpty()
    .withMessage('El campo dui es obligatorio')
    .matches(/^\d{8}-\d$/)
    .withMessage('El campo dui debe tener formato 00000000-0'),
  body('diagnostico')
    .notEmpty()
    .withMessage('El campo diagnostico es obligatorio')
    .isLength({ min: 10 })
    .withMessage('El campo diagnostico debe tener al menos 10 caracteres'),
  body('especialidad')
    .notEmpty()
    .withMessage('El campo especialidad es obligatorio')
    .isIn(ESPECIALIDADES)
    .withMessage(`El campo especialidad debe ser uno de: ${ESPECIALIDADES.join(', ')}`)
];

const crearPacienteValidators = [
  ...pacienteValidators,
  body('estado')
    .optional()
    .isIn(ESTADOS)
    .withMessage(`El campo estado debe ser uno de: ${ESTADOS.join(', ')}`)
];

const actualizarPacienteValidators = [
  ...pacienteValidators,
  body('version')
    .exists()
    .withMessage('El campo version es obligatorio')
    .isInt({ min: 1 })
    .withMessage('El campo version debe ser un entero mayor o igual a 1')
    .toInt(),
  body('estado').custom((value, { req }) => {
    if (Object.prototype.hasOwnProperty.call(req.body, 'estado')) {
      throw new Error('El estado debe modificarse usando PATCH /api/v1/pacientes/:id/estado');
    }

    return true;
  })
];

const estadoValidators = [
  body('estado')
    .notEmpty()
    .withMessage('El campo estado es obligatorio')
    .isIn(ESTADOS)
    .withMessage(`El campo estado debe ser uno de: ${ESTADOS.join(', ')}`)
];

const consultaValidators = [
  body('medico')
    .notEmpty()
    .withMessage('El campo consulta.medico es obligatorio'),
  body('notas')
    .notEmpty()
    .withMessage('El campo consulta.notas es obligatorio')
    .isLength({ min: 10 })
    .withMessage('El campo consulta.notas debe tener al menos 10 caracteres'),
  body('medicamentos')
    .optional()
    .isArray()
    .withMessage('El campo consulta.medicamentos debe ser un array'),
  body('medicamentos.*')
    .optional()
    .isString()
    .withMessage('Cada medicamento debe ser string'),
  body('seguimiento')
    .exists()
    .withMessage('El campo consulta.seguimiento es obligatorio')
    .isBoolean()
    .withMessage('El campo consulta.seguimiento debe ser boolean')
    .toBoolean()
];

const sortByValidator = query('sortBy')
  .optional()
  .custom((value) => {
    const fields = String(value)
      .split(',')
      .map((field) => field.trim())
      .filter(Boolean);

    return fields.length > 0 && fields.every((field) => pacientesService.SORTABLE_FIELDS.includes(field));
  })
  .withMessage(`El parametro sortBy debe contener campos validos: ${pacientesService.SORTABLE_FIELDS.join(', ')}`);

const listadoValidators = [
  query('page')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El parametro page debe ser un entero mayor o igual a 0'),
  query('size')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El parametro size debe ser un entero entre 1 y 100'),
  sortByValidator,
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('El parametro order debe ser asc o desc'),
  query('estado')
    .optional()
    .isIn(ESTADOS)
    .withMessage(`El parametro estado debe ser uno de: ${ESTADOS.join(', ')}`),
  query('especialidad')
    .optional()
    .isIn(ESPECIALIDADES)
    .withMessage(`El parametro especialidad debe ser uno de: ${ESPECIALIDADES.join(', ')}`),
  query('edadMin')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('El parametro edadMin debe ser un entero entre 0 y 120'),
  query('edadMax')
    .optional()
    .isInt({ min: 0, max: 120 })
    .withMessage('El parametro edadMax debe ser un entero entre 0 y 120'),
  query('diagnostico')
    .optional()
    .isString()
    .withMessage('El parametro diagnostico debe ser string')
];

const searchValidators = [
  query('nombre')
    .optional()
    .isString()
    .withMessage('El parametro nombre debe ser string'),
  query('dui')
    .optional()
    .matches(/^\d{8}-\d$/)
    .withMessage('El parametro dui debe tener formato 00000000-0'),
  query('diagnostico')
    .optional()
    .isString()
    .withMessage('El parametro diagnostico debe ser string'),
  query('estado')
    .optional()
    .isIn(ESTADOS)
    .withMessage(`El parametro estado debe ser uno de: ${ESTADOS.join(', ')}`)
];

router.get(
  '/',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  listadoValidators,
  validate,
  pacientesController.listarPacientes
);

router.get(
  '/search',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  searchValidators,
  validate,
  pacientesController.buscarPacientes
);

router.get(
  '/export/csv',
  authMiddleware,
  authorizeRoles('ADMIN'),
  pacientesController.exportarCsv
);

router.get(
  '/:id/version',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  pacientesController.obtenerVersion
);

router.get(
  '/:id',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  pacientesController.obtenerPacientePorId
);

router.post(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN'),
  crearPacienteValidators,
  validate,
  pacientesController.crearPaciente
);

router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  actualizarPacienteValidators,
  validate,
  pacientesController.actualizarPaciente
);

router.patch(
  '/:id/estado',
  authMiddleware,
  authorizeRoles('ADMIN'),
  estadoValidators,
  validate,
  pacientesController.cambiarEstado
);

router.delete(
  '/:id',
  authMiddleware,
  authorizeRoles('ADMIN'),
  pacientesController.eliminarPaciente
);

router.get(
  '/:id/historial',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  pacientesController.obtenerHistorial
);

router.post(
  '/:id/consultas',
  authMiddleware,
  authorizeRoles('MEDICO', 'ADMIN'),
  consultaValidators,
  validate,
  pacientesController.agregarConsulta
);

module.exports = router;
