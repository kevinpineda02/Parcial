const request = require('supertest');
const app = require('../src/app');

describe('Hospital API Parcial 4', () => {
  let adminToken;
  let auditorToken;
  let pacienteId;
  let pacienteVersion;

  test('login exitoso con admin', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        usuario: 'admin',
        contrasena: 'Admin123!'
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.usuario).toMatchObject({
      usuario: 'admin',
      rol: 'ADMIN',
      email: 'admin@hospital.local'
    });

    adminToken = response.body.token;
  });

  test('acceso denegado sin token', async () => {
    const response = await request(app).get('/api/v1/pacientes');

    expect(response.status).toBe(401);
    expect(response.body.codigo).toBe('ERR-AUTH-001');
  });

  test('crear paciente con token ADMIN', async () => {
    const response = await request(app)
      .post('/api/v1/pacientes')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Paciente',
        apellido: 'Prueba',
        edad: 40,
        dui: '77778888-9',
        diagnostico: 'Hipertension arterial controlada',
        especialidad: 'CARDIOLOGIA'
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.version).toBe(1);
    expect(response.body.creadoPor).toBe('admin');

    pacienteId = response.body.id;
    pacienteVersion = response.body.version;
  });

  test('verificar auditoria al crear paciente', async () => {
    const response = await request(app)
      .get('/api/v1/auditoria?accion=CREATE')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          accion: 'CREATE',
          recursoId: pacienteId,
          usuario: 'admin'
        })
      ])
    );
  });

  test('obtener version actual del paciente', async () => {
    const response = await request(app)
      .get(`/api/v1/pacientes/${pacienteId}/version`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: pacienteId,
      version: pacienteVersion,
      modificadoPor: 'admin'
    });
  });

  test('actualizar paciente con version correcta', async () => {
    const response = await request(app)
      .put(`/api/v1/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Paciente',
        apellido: 'Actualizado',
        edad: 41,
        dui: '77778888-9',
        diagnostico: 'Hipertension arterial en seguimiento',
        especialidad: 'CARDIOLOGIA',
        version: pacienteVersion
      });

    expect(response.status).toBe(200);
    expect(response.body.version).toBe(pacienteVersion + 1);
    expect(response.body.modificadoPor).toBe('admin');

    pacienteVersion = response.body.version;
  });

  test('actualizar paciente con version incorrecta devuelve 409', async () => {
    const response = await request(app)
      .put(`/api/v1/pacientes/${pacienteId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        nombre: 'Paciente',
        apellido: 'Actualizado',
        edad: 42,
        dui: '77778888-9',
        diagnostico: 'Hipertension arterial en seguimiento',
        especialidad: 'CARDIOLOGIA',
        version: pacienteVersion - 1
      });

    expect(response.status).toBe(409);
    expect(response.body.codigo).toBe('ERR-PAC-409');
  });

  test('listar pacientes dos veces permite ver cache HIT', async () => {
    const url = '/api/v1/pacientes?page=0&size=5&sortBy=nombre,edad&order=asc';
    const first = await request(app)
      .get(url)
      .set('Authorization', `Bearer ${adminToken}`);
    const second = await request(app)
      .get(url)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(first.status).toBe(200);
    expect(first.headers['x-cache']).toBe('MISS');
    expect(second.status).toBe(200);
    expect(second.headers['x-cache']).toBe('HIT');
  });

  test('exportar CSV con token ADMIN', async () => {
    const response = await request(app)
      .get('/api/v1/pacientes/export/csv')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.headers['content-disposition']).toContain('pacientes-activos.csv');
    expect(response.text).toContain('id,nombre,apellido,edad,dui');
  });

  test('consultar auditoria con token AUDITOR', async () => {
    const login = await request(app)
      .post('/auth/login')
      .send({
        usuario: 'auditor',
        contrasena: 'Audita123!'
      });

    auditorToken = login.body.token;

    const response = await request(app)
      .get('/api/v1/auditoria')
      .set('Authorization', `Bearer ${auditorToken}`);

    expect(login.status).toBe(200);
    expect(response.status).toBe(200);
    expect(response.body.total).toBeGreaterThan(0);
  });
});
