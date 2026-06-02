const express = require('express');
const estadisticasController = require('../controllers/estadisticas.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const authorizeRoles = require('../middlewares/role.middleware');

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  authorizeRoles('ADMIN', 'AUDITOR'),
  estadisticasController.obtenerEstadisticas
);

module.exports = router;
