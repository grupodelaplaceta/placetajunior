const test = require('node:test');
const assert = require('node:assert/strict');
const { validarSolicitud, DOCUMENTOS } = require('../lib/centros/validacion.js');

const buena = () => ({
  nombreCentro: 'CEIP Los Olivos', tipoCentro: 'primaria', ciudad: 'Sevilla',
  responsableNombre: 'Ana Ruiz', responsableCargo: 'Directora', telefono: '954 123 456',
  emailContacto: 'direccion@colegio.test', codigoCentroOficial: '41012345',
  aceptaciones: { ...DOCUMENTOS }, declaraVeracidad: true
});

test('una solicitud completa y correcta se acepta', () => {
  const r = validarSolicitud(buena());
  assert.equal(r.datos.nombre_centro, 'CEIP Los Olivos');
  assert.equal(r.aceptaciones.length, 2);
});

test('el email de contacto debe ser válido', () => {
  const b = buena(); b.emailContacto = 'no-es-email';
  assert.throws(() => validarSolicitud(b), (e) => e.codigo === 'campo_invalido' && e.campo === 'emailContacto');
});

test('el teléfono debe tener formato numérico', () => {
  const b = buena(); b.telefono = 'llame-me-pronto';
  assert.throws(() => validarSolicitud(b), (e) => e.campo === 'telefono');
});

test('sin aceptar cada documento en su versión vigente no se acepta la solicitud', () => {
  const b = buena(); delete b.aceptaciones.privacidad;
  assert.throws(() => validarSolicitud(b), (e) => e.status === 409 && e.codigo === 'version_documentos_actualizada');
  const c = buena(); c.aceptaciones.condiciones = '2020-01-01';
  assert.throws(() => validarSolicitud(c), (e) => e.codigo === 'version_documentos_actualizada');
});

test('la declaración de veracidad es obligatoria', () => {
  const b = buena(); b.declaraVeracidad = false;
  assert.throws(() => validarSolicitud(b), (e) => e.campo === 'declaraVeracidad');
});

test('el tipo de centro debe ser de la lista', () => {
  const b = buena(); b.tipoCentro = 'universidad';
  assert.throws(() => validarSolicitud(b), (e) => e.campo === 'tipoCentro');
});

test('el código oficial del centro es opcional', () => {
  const b = buena(); delete b.codigoCentroOficial;
  assert.equal(validarSolicitud(b).datos.codigo_centro_oficial, null);
});
