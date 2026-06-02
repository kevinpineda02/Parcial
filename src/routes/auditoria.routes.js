const express = require('express');
const { query } = require('express-validator');
const auditoriaController = require('../controllers/auditoria.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');
const validate = require('../middlewares/validate.middleware');
const { ACCIONES_AUDITORIA } = require('../models/auditoria.model');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN', 'AUDITOR'),
  [
    query('accion')
      .optional()
      .isIn(ACCIONES_AUDITORIA)
      .withMessage(`El parametro accion debe ser uno de: ${ACCIONES_AUDITORIA.join(', ')}`),
    query('usuario')
      .optional()
      .isString()
      .withMessage('El parametro usuario debe ser string'),
    query('recursoId')
      .optional()
      .isString()
      .withMessage('El parametro recursoId debe ser string')
  ],
  validate,
  auditoriaController.listarEventos
);

module.exports = router;
