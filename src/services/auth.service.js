const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

const users = [
  {
    usuario: 'admin',
    contrasena: 'Admin123!',
    rol: 'ADMIN',
    email: 'admin@hospital.local'
  },
  {
    usuario: 'dr.martinez',
    contrasena: 'Medico123!',
    rol: 'MEDICO',
    email: 'dr.martinez@hospital.local'
  },
  {
    usuario: 'recepcion',
    contrasena: 'Recep123!',
    rol: 'RECEPCION',
    email: 'recepcion@hospital.local'
  },
  {
    usuario: 'auditor',
    contrasena: 'Audita123!',
    rol: 'AUDITOR',
    email: 'auditor@hospital.local'
  }
];

function login(usuario, contrasena) {
  const user = users.find((item) => item.usuario === usuario && item.contrasena === contrasena);

  if (!user) {
    throw new AppError(401, 'Credenciales incorrectas', {
      codigo: 'ERR-AUTH-003'
    });
  }

  const payload = {
    usuario: user.usuario,
    rol: user.rol,
    email: user.email
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'clave_super_secreta', {
    expiresIn: '1h'
  });

  return {
    token,
    expiraEn: '1h',
    usuario: payload
  };
}

module.exports = {
  login
};
