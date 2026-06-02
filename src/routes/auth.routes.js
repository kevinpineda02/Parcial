const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.post(
  '/login',
  [
    body('usuario')
      .notEmpty()
      .withMessage('El campo usuario es obligatorio'),
    body('contrasena')
      .notEmpty()
      .withMessage('El campo contrasena es obligatorio')
  ],
  validate,
  authController.login
);

module.exports = router;
