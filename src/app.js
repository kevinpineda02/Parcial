require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const estadisticasRoutes = require('./routes/estadisticas.routes');
const auditoriaRoutes = require('./routes/auditoria.routes');
const AppError = require('./utils/AppError');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    nombre: 'hospital-api-node',
    version: '1.0.0',
    estado: 'OK',
    documentacion: '/api-docs'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/api/v1/pacientes', pacientesRoutes);
app.use('/api/v1/estadisticas', estadisticasRoutes);
app.use('/api/v1/auditoria', auditoriaRoutes);

app.use((req, res, next) => {
  next(new AppError(404, 'Ruta no encontrada'));
});

app.use(errorMiddleware);

module.exports = app;
