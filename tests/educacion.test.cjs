const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');

process.env.PJ27_CLAVE_CIFRADO = crypto.randomBytes(32).toString('base64');

const pol = require('../lib/education/core/politica.js');
const cifrado = require('../lib/education/core/cifrado.js');
const firma = require('../lib/education/core/firma.js');
const sesion = require('../lib/education/core/sesion.js');
const rutas = require('../lib/education/core/rutas.js');

test('la política por defecto es válida y no cambia al validarla', () => {
  const d = pol.configDefecto();
  assert.deepEqual(pol.validar(d), d);
});

test('clasifica cambios: técnico, organizativo y normativo', () => {
  const base = pol.configDefecto();
  const tecnico = { ...base };
  const organizativo = { ...base, juegos: { defecto: 'oculto', estados: {} } };
  const normativo = { ...base, progreso: 'centro' };
  assert.equal(pol.clasificar(base, tecnico), 'tecnico');
  assert.equal(pol.clasificar(base, organizativo), 'organizativo');
  assert.equal(pol.clasificar(base, normativo), 'normativo');
});

test('rechaza configuraciones inválidas', () => {
  assert.throws(() => pol.validar({ identificacion: 'publico' }), (e) => e.message === 'identificacion_invalida');
  assert.throws(() => pol.validar({ restricciones: { tiempoMaxMinutos: 1 } }), (e) => e.message === 'tiempo_maximo_invalido');
});

test('valida progreso de perfil con IdAlum, resumen y actividades acotadas', () => {
  const datos = rutas.progresoAlumnoValido({
    datos: {
      actividades: { 'actividad-1': { verdes: 4, rojos: 1, completada: true } },
      resumen: { verdes: 4, rojos: 1, jugadas: 1, medallas: ['Primera victoria'] }
    }
  });
  assert.deepEqual(datos.actividades['actividad-1'], { verdes: 4, rojos: 1, completada: true });
  assert.deepEqual(datos.resumen, { verdes: 4, rojos: 1, jugadas: 1, medallas: ['Primera victoria'] });
  assert.ok(rutas.buscar('GET', '/api/dispositivo/alumnos/alum_0123456789abcdef0123456789abcdef/progreso'));
  assert.ok(rutas.buscar('POST', '/api/dispositivo/alumnos/alum_0123456789abcdef0123456789abcdef/progreso'));
  assert.throws(() => rutas.progresoAlumnoValido({ datos: { actividades: { a: { verdes: -1, rojos: 0, completada: true } } } }), /progreso_no_valido/);
  assert.throws(() => rutas.progresoAlumnoValido({ datos: { actividades: {}, resumen: { verdes: 'muchos' } } }), /progreso_no_valido/);
});

test('los secretos se cifran y solo se descifran con la clave correcta', () => {
  const c = cifrado.cifrar('secreto-de-prueba');
  assert.notEqual(c, 'secreto-de-prueba');
  assert.equal(cifrado.descifrar(c), 'secreto-de-prueba');
  const alterado = c.slice(0, -2) + (c.endsWith('A') ? 'B' : 'A');
  assert.throws(() => cifrado.descifrar(alterado));
});

test('la firma de la política detecta cualquier cambio', () => {
  const secreto = crypto.randomBytes(32).toString('base64');
  const bundle = { orgId: 'org_1', revision: 3, config: { progreso: 'local' }, documentos: [] };
  const f = firma.firmar(bundle, secreto);
  assert.equal(firma.firmar({ ...bundle }, secreto), f);
  assert.notEqual(firma.firmar({ ...bundle, revision: 4 }, secreto), f);
  assert.notEqual(firma.firmar({ ...bundle, config: { progreso: 'centro' } }, secreto), f);
});

test('la sesión de administración es un token firmado que caduca', () => {
  const token = sesion.emitirToken('admin');
  assert.equal(sesion.usuarioDeToken(token), 'admin');
  const [cuerpo, firmaTok] = token.split('.');
  const manipulado = Buffer.from(JSON.stringify({ u: 'otro', exp: Date.now() + 3600e3 })).toString('base64url');
  assert.equal(sesion.usuarioDeToken(`${manipulado}.${firmaTok}`), null);
  assert.equal(sesion.usuarioDeToken(`${cuerpo}.x`), null);
  assert.equal(sesion.usuarioDeToken('basura'), null);
});

test('la contraseña de administración se guarda con scrypt, nunca en claro', () => {
  const salt = crypto.randomBytes(16).toString('hex');
  const h = sesion.hashClave('mi-clave', salt);
  assert.equal(h.length, 128);
  assert.notEqual(h, 'mi-clave');
  assert.equal(sesion.hashClave('mi-clave', salt), h);
});

const pin = require('../lib/education/core/pin.js');

test('la organización tiene ventanas maximizadas, mayúsculas mixtas, español y sin PIN por defecto', () => {
  const d = pol.configDefecto();
  assert.deepEqual(d.interfaz, { ventanas: 'maximizadas', mayusculas: 'mixtas', idioma: 'es' });
  assert.deepEqual(d.seguridad, { pinApagado: null });
});

test('rechaza valores de interfaz fuera de lista', () => {
  assert.throws(() => pol.validar({ interfaz: { ventanas: 'flotantes' } }), (e) => e.message === 'ventanas_invalidas');
  assert.throws(() => pol.validar({ interfaz: { mayusculas: 'SI' } }), (e) => e.message === 'mayusculas_invalidas');
  assert.throws(() => pol.validar({ interfaz: { idioma: 'fr' } }), (e) => e.message === 'idioma_invalido');
});

test('cambiar la interfaz o el PIN no es un cambio normativo', () => {
  const base = pol.configDefecto();
  assert.equal(pol.clasificar(base, { ...base, interfaz: { ...base.interfaz, ventanas: 'libres' } }), 'organizativo');
  assert.equal(pol.clasificar(base, { ...base, seguridad: { pinApagado: pin.crearRegistroPin('abc12') } }), 'organizativo');
});

test('el PIN solo se acepta con letras o números, entre 4 y 12 caracteres', () => {
  for (const ok of ['1234', 'abcd', 'Ab12', 'a1b2c3d4e5f6']) assert.equal(pin.validarPin(ok), true, ok);
  for (const mal of ['123', 'a1b2c3d4e5f6g', 'ab-12', 'ab 12', '', null, 1234]) assert.equal(pin.validarPin(mal), false, String(mal));
});

test('el PIN se guarda como hash PBKDF2, nunca en claro', () => {
  const r = pin.crearRegistroPin('MiClave9');
  assert.equal(pin.registroPinValido(r), true);
  assert.equal(r.alg, 'pbkdf2-sha256');
  assert.equal(r.iter, 200000);
  assert.equal(r.tipo, 'alfanumerico');
  assert.ok(!JSON.stringify(r).includes('MiClave9'));
  assert.equal(pin.crearRegistroPin('2468').tipo, 'numerico');
});

test('un registro de PIN alterado o con parámetros fuera de rango se rechaza', () => {
  const r = pin.crearRegistroPin('1234');
  assert.equal(pin.registroPinValido({ ...r, iter: 10 }), false);
  assert.equal(pin.registroPinValido({ ...r, alg: 'md5' }), false);
  assert.throws(() => pol.validar({ seguridad: { pinApagado: { ...r, iter: 10 } } }), (e) => e.message === 'pin_no_valido');
});

test('los bloqueos globales requieren motivo y soportan suspensión temporal o indefinida', () => {
  const ahora = Date.UTC(2030, 0, 1);
  assert.equal(rutas.validarMotivoBloqueo('  Incumplimiento   de normativa  '), 'Incumplimiento de normativa');
  assert.throws(() => rutas.validarMotivoBloqueo(''), (e) => e.message === 'motivo_obligatorio');
  assert.throws(() => rutas.validarMotivoBloqueo('no'), (e) => e.message === 'motivo_no_valido');
  assert.deepEqual(rutas.validarBloqueoOrganizacion({
    tipo: 'temporal', motivo: 'Revisión administrativa pendiente', hasta: '2030-01-02'
  }, ahora), {
    tipo: 'temporal', motivo: 'Revisión administrativa pendiente', hasta: '2030-01-02T23:59:59.999Z'
  });
  assert.deepEqual(rutas.validarBloqueoOrganizacion({
    tipo: 'indefinido', motivo: 'Incumplimiento grave de condiciones'
  }, ahora), {
    tipo: 'indefinido', motivo: 'Incumplimiento grave de condiciones', hasta: null
  });
  assert.throws(() => rutas.validarBloqueoOrganizacion({
    tipo: 'temporal', motivo: 'Revisión administrativa pendiente', hasta: '2029-12-31'
  }, ahora), (e) => e.message === 'fecha_fin_debe_ser_futura');
  assert.equal(rutas.bloqueoOrganizacionActual({
    bloqueo: { tipo: 'temporal', motivo: 'revisión', hasta: '2029-12-31T23:59:59.999Z' }
  }, ahora), null);
});

test('las rutas de bloqueo están protegidas por el espacio de administración global', () => {
  for (const [metodo, ruta] of [
    ['POST', '/api/admin/dispositivos/dis_123/bloquear'],
    ['POST', '/api/admin/dispositivos/dis_123/reactivar'],
    ['POST', '/api/admin/organizaciones/org_123/bloquear'],
    ['POST', '/api/admin/organizaciones/org_123/activar']
  ]) assert.ok(rutas.buscar(metodo, ruta), `${metodo} ${ruta}`);
});
