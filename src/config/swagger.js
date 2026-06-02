const swaggerJsdoc = require('swagger-jsdoc');

const bearerAuth = [
  {
    bearerAuth: []
  }
];

const jsonError = {
  'application/json': {
    schema: {
      $ref: '#/components/schemas/ErrorResponse'
    }
  }
};

const idParam = {
  name: 'id',
  in: 'path',
  required: true,
  schema: {
    type: 'string',
    format: 'uuid'
  }
};

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hospital Regional API - Parcial 4',
      version: '2.0.0',
      description: 'API REST segura con JWT, RBAC, auditoria automatica, cache, optimistic locking, busqueda avanzada, CSV, errores con codigo especifico y pruebas automatizadas.'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['usuario', 'contrasena'],
          properties: {
            usuario: {
              type: 'string',
              example: 'admin'
            },
            contrasena: {
              type: 'string',
              example: 'Admin123!'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            },
            expiraEn: {
              type: 'string',
              example: '1h'
            },
            usuario: {
              type: 'object',
              properties: {
                usuario: {
                  type: 'string',
                  example: 'admin'
                },
                rol: {
                  type: 'string',
                  enum: ['ADMIN', 'MEDICO', 'RECEPCION', 'AUDITOR'],
                  example: 'ADMIN'
                },
                email: {
                  type: 'string',
                  example: 'admin@hospital.local'
                }
              }
            }
          }
        },
        Consulta: {
          type: 'object',
          properties: {
            idConsulta: {
              type: 'string',
              format: 'uuid'
            },
            fecha: {
              type: 'string',
              format: 'date-time'
            },
            medico: {
              type: 'string',
              example: 'Dr. Martinez'
            },
            notas: {
              type: 'string',
              minLength: 10,
              example: 'Paciente requiere control en siete dias'
            },
            medicamentos: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Losartan']
            },
            seguimiento: {
              type: 'boolean',
              example: true
            }
          }
        },
        ConsultaRequest: {
          type: 'object',
          required: ['medico', 'notas', 'seguimiento'],
          properties: {
            medico: {
              type: 'string',
              example: 'Dr. Martinez'
            },
            notas: {
              type: 'string',
              minLength: 10,
              example: 'Paciente evoluciona favorablemente'
            },
            medicamentos: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Ibuprofeno']
            },
            seguimiento: {
              type: 'boolean',
              example: true
            }
          }
        },
        Paciente: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            nombre: {
              type: 'string',
              minLength: 3,
              maxLength: 60
            },
            apellido: {
              type: 'string',
              minLength: 3,
              maxLength: 60
            },
            edad: {
              type: 'integer',
              minimum: 1,
              maximum: 120
            },
            dui: {
              type: 'string',
              pattern: '^\\d{8}-\\d$',
              example: '01234567-8'
            },
            diagnostico: {
              type: 'string',
              minLength: 10
            },
            fechaIngreso: {
              type: 'string',
              format: 'date-time'
            },
            estado: {
              type: 'string',
              enum: ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO']
            },
            especialidad: {
              type: 'string',
              enum: ['GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'NEUROLOGIA', 'TRAUMATOLOGIA']
            },
            historialConsultas: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Consulta'
              }
            },
            creadoPor: {
              type: 'string',
              example: 'admin'
            },
            modificadoPor: {
              type: 'string',
              example: 'dr.martinez'
            },
            fechaCreacion: {
              type: 'string',
              format: 'date-time'
            },
            fechaModificacion: {
              type: 'string',
              format: 'date-time'
            },
            version: {
              type: 'integer',
              example: 2
            }
          }
        },
        PacienteRequest: {
          type: 'object',
          required: ['nombre', 'apellido', 'edad', 'dui', 'diagnostico', 'especialidad'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Carlos'
            },
            apellido: {
              type: 'string',
              example: 'Ramirez'
            },
            edad: {
              type: 'integer',
              example: 40
            },
            dui: {
              type: 'string',
              example: '12345670-1'
            },
            diagnostico: {
              type: 'string',
              example: 'Hipertension arterial'
            },
            estado: {
              type: 'string',
              enum: ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO'],
              example: 'ACTIVO'
            },
            especialidad: {
              type: 'string',
              enum: ['GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'NEUROLOGIA', 'TRAUMATOLOGIA'],
              example: 'CARDIOLOGIA'
            }
          }
        },
        PacienteUpdateRequest: {
          type: 'object',
          required: ['nombre', 'apellido', 'edad', 'dui', 'diagnostico', 'especialidad', 'version'],
          properties: {
            nombre: {
              type: 'string',
              example: 'Carlos'
            },
            apellido: {
              type: 'string',
              example: 'Ramirez'
            },
            edad: {
              type: 'integer',
              example: 40
            },
            dui: {
              type: 'string',
              example: '12345670-1'
            },
            diagnostico: {
              type: 'string',
              example: 'Hipertension arterial en seguimiento'
            },
            especialidad: {
              type: 'string',
              enum: ['GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'NEUROLOGIA', 'TRAUMATOLOGIA'],
              example: 'CARDIOLOGIA'
            },
            version: {
              type: 'integer',
              example: 1
            }
          }
        },
        EstadoRequest: {
          type: 'object',
          required: ['estado'],
          properties: {
            estado: {
              type: 'string',
              enum: ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO'],
              example: 'EN_TRATAMIENTO'
            }
          }
        },
        VersionResponse: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            version: {
              type: 'integer',
              example: 2
            },
            fechaModificacion: {
              type: 'string',
              format: 'date-time'
            },
            modificadoPor: {
              type: 'string',
              example: 'dr.martinez'
            }
          }
        },
        PacientesPaginados: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Paciente'
              }
            },
            paginacion: {
              type: 'object',
              properties: {
                paginaActual: {
                  type: 'integer',
                  example: 0
                },
                totalPaginas: {
                  type: 'integer',
                  example: 2
                },
                totalRegistros: {
                  type: 'integer',
                  example: 15
                },
                registrosPorPagina: {
                  type: 'integer',
                  example: 10
                }
              }
            }
          }
        },
        AuditoriaEvento: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            usuario: {
              type: 'string',
              example: 'admin'
            },
            accion: {
              type: 'string',
              enum: ['CREATE', 'UPDATE', 'DELETE', 'ESTADO_CHANGE']
            },
            recursoId: {
              type: 'string',
              format: 'uuid'
            },
            detalles: {
              type: 'string',
              example: 'Paciente creado con DUI 12345678-9'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        AuditoriaResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/AuditoriaEvento'
              }
            },
            total: {
              type: 'integer',
              example: 1
            }
          }
        },
        Estadisticas: {
          type: 'object',
          properties: {
            totalPacientes: {
              type: 'integer',
              example: 15
            },
            porEstado: {
              type: 'object',
              properties: {
                activos: {
                  type: 'integer'
                },
                inactivos: {
                  type: 'integer'
                },
                enTratamiento: {
                  type: 'integer'
                }
              }
            },
            porEspecialidad: {
              type: 'object',
              additionalProperties: {
                type: 'integer'
              }
            },
            edadPromedio: {
              type: 'number',
              example: 38.4
            },
            pacientesConSeguimiento: {
              type: 'integer',
              example: 5
            },
            ultimaActualizacion: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            codigo: {
              type: 'string',
              example: 'ERR-PAC-001'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            status: {
              type: 'integer',
              example: 404
            },
            error: {
              type: 'string',
              example: 'Not Found'
            },
            mensaje: {
              type: 'string',
              example: 'Paciente no encontrado'
            },
            detalle: {
              type: 'string',
              example: 'id = 123'
            },
            detalles: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            path: {
              type: 'string',
              example: '/api/v1/pacientes/123'
            }
          }
        }
      }
    },
    paths: {
      '/': {
        get: {
          summary: 'Informacion general de la API',
          responses: {
            200: {
              description: 'API disponible'
            }
          }
        }
      },
      '/auth/login': {
        post: {
          summary: 'Autenticar usuario y obtener JWT',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login exitoso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/LoginResponse'
                  }
                }
              }
            },
            400: {
              description: 'Validacion fallida',
              content: jsonError
            },
            401: {
              description: 'Credenciales incorrectas',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes': {
        get: {
          summary: 'Listar pacientes con cache, paginacion, filtros avanzados y ordenamiento multiple',
          description: 'Roles permitidos: ADMIN, MEDICO. Devuelve header X-Cache con HIT o MISS.',
          security: bearerAuth,
          parameters: [
            {
              name: 'page',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 0,
                default: 0
              }
            },
            {
              name: 'size',
              in: 'query',
              schema: {
                type: 'integer',
                minimum: 1,
                default: 10
              }
            },
            {
              name: 'sortBy',
              in: 'query',
              description: 'Uno o varios campos separados por coma.',
              schema: {
                type: 'string',
                default: 'nombre',
                example: 'nombre,edad'
              }
            },
            {
              name: 'order',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['asc', 'desc'],
                default: 'asc'
              }
            },
            {
              name: 'estado',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO']
              }
            },
            {
              name: 'especialidad',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['GENERAL', 'CARDIOLOGIA', 'PEDIATRIA', 'NEUROLOGIA', 'TRAUMATOLOGIA']
              }
            },
            {
              name: 'edadMin',
              in: 'query',
              schema: {
                type: 'integer',
                example: 18
              }
            },
            {
              name: 'edadMax',
              in: 'query',
              schema: {
                type: 'integer',
                example: 60
              }
            },
            {
              name: 'diagnostico',
              in: 'query',
              schema: {
                type: 'string',
                example: 'hipertension'
              }
            }
          ],
          responses: {
            200: {
              description: 'Listado paginado',
              headers: {
                'X-Cache': {
                  schema: {
                    type: 'string',
                    enum: ['HIT', 'MISS']
                  }
                }
              },
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/PacientesPaginados'
                  }
                }
              }
            },
            400: {
              description: 'Parametros invalidos',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        },
        post: {
          summary: 'Crear paciente',
          description: 'Rol permitido: ADMIN. Registra auditoria CREATE e invalida cache.',
          security: bearerAuth,
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PacienteRequest'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Paciente creado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Paciente'
                  }
                }
              }
            },
            400: {
              description: 'Validacion fallida',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            409: {
              description: 'DUI duplicado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/search': {
        get: {
          summary: 'Busqueda avanzada de pacientes',
          description: 'Roles permitidos: ADMIN, MEDICO. Busca por nombre, DUI y diagnostico.',
          security: bearerAuth,
          parameters: [
            {
              name: 'nombre',
              in: 'query',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'dui',
              in: 'query',
              schema: {
                type: 'string',
                example: '12345678-9'
              }
            },
            {
              name: 'diagnostico',
              in: 'query',
              schema: {
                type: 'string',
                example: 'hipertension'
              }
            },
            {
              name: 'estado',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['ACTIVO', 'INACTIVO', 'EN_TRATAMIENTO']
              }
            }
          ],
          responses: {
            200: {
              description: 'Pacientes encontrados',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Paciente'
                    }
                  }
                }
              }
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/export/csv': {
        get: {
          summary: 'Exportar pacientes activos a CSV',
          description: 'Rol permitido: ADMIN.',
          security: bearerAuth,
          responses: {
            200: {
              description: 'Archivo CSV',
              headers: {
                'Content-Disposition': {
                  schema: {
                    type: 'string',
                    example: 'attachment; filename="pacientes-activos.csv"'
                  }
                }
              },
              content: {
                'text/csv': {
                  schema: {
                    type: 'string'
                  }
                }
              }
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/{id}/version': {
        get: {
          summary: 'Consultar version actual del paciente',
          description: 'Roles permitidos: ADMIN, MEDICO.',
          security: bearerAuth,
          parameters: [idParam],
          responses: {
            200: {
              description: 'Version actual',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/VersionResponse'
                  }
                }
              }
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/{id}': {
        get: {
          summary: 'Obtener paciente por ID',
          description: 'Roles permitidos: ADMIN, MEDICO.',
          security: bearerAuth,
          parameters: [idParam],
          responses: {
            200: {
              description: 'Paciente encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Paciente'
                  }
                }
              }
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        },
        put: {
          summary: 'Actualizar expediente con optimistic locking',
          description: 'Roles permitidos: ADMIN, MEDICO. Requiere version actual del paciente.',
          security: bearerAuth,
          parameters: [idParam],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/PacienteUpdateRequest'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Paciente actualizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Paciente'
                  }
                }
              }
            },
            400: {
              description: 'Validacion fallida o intento de modificar estado por PUT',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            409: {
              description: 'Conflicto de version o DUI duplicado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        },
        delete: {
          summary: 'Eliminacion logica del paciente',
          description: 'Rol permitido: ADMIN. Cambia estado a INACTIVO, registra auditoria DELETE e invalida cache.',
          security: bearerAuth,
          parameters: [idParam],
          responses: {
            204: {
              description: 'Paciente marcado como INACTIVO'
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/{id}/estado': {
        patch: {
          summary: 'Cambiar estado del paciente',
          description: 'Rol permitido: ADMIN. Registra auditoria ESTADO_CHANGE e invalida cache.',
          security: bearerAuth,
          parameters: [idParam],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EstadoRequest'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Estado actualizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Paciente'
                  }
                }
              }
            },
            400: {
              description: 'Estado invalido',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/{id}/historial': {
        get: {
          summary: 'Ver historial de consultas del paciente',
          description: 'Roles permitidos: ADMIN, MEDICO.',
          security: bearerAuth,
          parameters: [idParam],
          responses: {
            200: {
              description: 'Historial del paciente'
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/pacientes/{id}/consultas': {
        post: {
          summary: 'Agregar consulta medica',
          description: 'Roles permitidos: ADMIN, MEDICO. Invalida cache.',
          security: bearerAuth,
          parameters: [idParam],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ConsultaRequest'
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Consulta agregada',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Consulta'
                  }
                }
              }
            },
            400: {
              description: 'Validacion fallida',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            404: {
              description: 'Paciente no encontrado',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/estadisticas': {
        get: {
          summary: 'Obtener estadisticas generales',
          description: 'Roles permitidos: ADMIN, AUDITOR.',
          security: bearerAuth,
          responses: {
            200: {
              description: 'Estadisticas generadas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Estadisticas'
                  }
                }
              }
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      },
      '/api/v1/auditoria': {
        get: {
          summary: 'Consultar eventos de auditoria',
          description: 'Roles permitidos: ADMIN, AUDITOR. Soporta filtros por accion, usuario y recursoId.',
          security: bearerAuth,
          parameters: [
            {
              name: 'accion',
              in: 'query',
              schema: {
                type: 'string',
                enum: ['CREATE', 'UPDATE', 'DELETE', 'ESTADO_CHANGE']
              }
            },
            {
              name: 'usuario',
              in: 'query',
              schema: {
                type: 'string',
                example: 'admin'
              }
            },
            {
              name: 'recursoId',
              in: 'query',
              schema: {
                type: 'string',
                format: 'uuid'
              }
            }
          ],
          responses: {
            200: {
              description: 'Eventos encontrados',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AuditoriaResponse'
                  }
                }
              }
            },
            400: {
              description: 'Parametros invalidos',
              content: jsonError
            },
            401: {
              description: 'Token ausente o invalido',
              content: jsonError
            },
            403: {
              description: 'Rol insuficiente',
              content: jsonError
            },
            500: {
              description: 'Error interno',
              content: jsonError
            }
          }
        }
      }
    }
  },
  apis: []
});

module.exports = swaggerSpec;
