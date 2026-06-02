const authService = require('../services/auth.service');

function login(req, res) {
  const { usuario, contrasena } = req.body;
  const result = authService.login(usuario, contrasena);
  res.status(200).json(result);
}

module.exports = {
  login
};
