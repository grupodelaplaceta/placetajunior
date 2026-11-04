const test = require('node:test');
const crypto = require('node:crypto');
process.env.PJ27_CLAVE_CIFRADO = crypto.randomBytes(32).toString('base64');
const assert = require('node:assert/strict');

// Ejecuta las funciones de Vercel reales con una petición construida a mano (sin red ni base de datos)
function invocar(fn, { metodo = 'GET', ruta, query = {}, cabeceras = {}, body } = {}) {
  return new Promise((resolve) => {
    const res = {
      statusCode: 200, cuerpo: undefined, cab: {},
      status(c) { this.statusCode = c; return this; },
      setHeader(k, v) { this.cab[k] = v; },
      json(o) { this.cuerpo = o; resolve({ status: this.statusCode, cuerpo: o, cab: this.cab }); return this; },
      end(t) { resolve({ status: this.statusCode, cuerpo: t, cab: this.cab }); return this; }
    };
    const req = { method: metodo, query: { ...query, ...(ruta !== undefined ? { ruta } : {}) }, headers: cabeceras, body };
    Promise.resolve(fn(req, res)).catch((e) => resolve({ status: 500, cuerpo: { error: 'no_capturado', detalle: e.message } }));
  });
}

const educacion = require('../api/educacion.js');
const centros = require('../api/centros.js');
const supabase = require('../lib/supabase.js');

test('centros: una solicitud aprobada sin organización ni membresía se repara y aparece en mi', async () => {
  const fakeGoogle = require('./fake-google.cjs');
  const { idInterno } = require('../lib/auth.js');
  const envOriginal = {
    google: process.env.GOOGLE_CLIENT_ID,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SECRET_KEY
  };
  const fetchOriginal = global.fetch;
  const sub = 'cuenta-centro-pruebas-aprobada';
  const userId = idInterno(sub);
  const solicitud = {
    id: '00000000-0000-4000-8000-000000000101', user_id: userId,
    nombre_centro: 'Centro de pruebas', tipo_centro: 'primaria', estado: 'aprobada',
    motivo_rechazo: null, creada_en: '2026-10-25T12:00:00.000Z', revisada_en: '2026-10-26T09:00:00.000Z'
  };
  let organizacion = null;
  let miembro = null;
  process.env.GOOGLE_CLIENT_ID = fakeGoogle.CLIENT_ID;
  process.env.SUPABASE_URL = 'https://ejemplo.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'clave-test';
  global.fetch = async (url, opciones = {}) => {
    if (url === fakeGoogle.JWKS_URL) return { ok: true, json: async () => fakeGoogle.jwks() };
    const destino = new URL(url);
    const tabla = destino.pathname.split('/').pop();
    if (tabla === 'PJ27_solicitudes') return { ok: true, text: async () => JSON.stringify([solicitud]) };
    if (tabla === 'PJ27_organizaciones' && opciones.method === 'POST') {
      const fila = JSON.parse(opciones.body)[0];
      organizacion = { id: '00000000-0000-4000-8000-000000000202', ...fila, estado: 'activo', creada_en: '2026-10-26T09:00:00.000Z' };
      return { ok: true, text: async () => JSON.stringify([organizacion]) };
    }
    if (tabla === 'PJ27_organizaciones') return { ok: true, text: async () => JSON.stringify(organizacion ? [organizacion] : []) };
    if (tabla === 'PJ27_miembros' && opciones.method === 'POST') {
      miembro = JSON.parse(opciones.body)[0];
      return { ok: true, text: async () => JSON.stringify([miembro]) };
    }
    if (tabla === 'PJ27_miembros') return { ok: true, text: async () => JSON.stringify(miembro ? [miembro] : []) };
    throw new Error(`Solicitud Supabase inesperada: ${opciones.method} ${destino.pathname}`);
  };

  try {
    const r = await invocar(centros, {
      ruta: 'mi',
      cabeceras: { authorization: `Bearer ${fakeGoogle.emitir({ sub })}` }
    });
    assert.equal(r.status, 200);
    assert.equal(r.cuerpo.organizaciones.length, 1);
    assert.equal(r.cuerpo.organizaciones[0].nombre, 'Centro de pruebas');
    assert.equal(r.cuerpo.organizaciones[0].rol, 'administrador');
    assert.equal(r.cuerpo.organizaciones[0].codigoCentro, organizacion.codigo_centro);
    assert.equal(r.cuerpo.docenteAprobado, false);
    assert.equal(r.cab['Cache-Control'], 'no-store');
    assert.equal(miembro.user_id, userId);
  } finally {
    global.fetch = fetchOriginal;
    if (envOriginal.google === undefined) delete process.env.GOOGLE_CLIENT_ID;
    else process.env.GOOGLE_CLIENT_ID = envOriginal.google;
    if (envOriginal.supabaseUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = envOriginal.supabaseUrl;
    if (envOriginal.supabaseKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = envOriginal.supabaseKey;
  }
});

test('centros: un docente aprobado recibe permiso de creación sin generar un centro', async () => {
  const fakeGoogle = require('./fake-google.cjs');
  const envOriginal = {
    google: process.env.GOOGLE_CLIENT_ID,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_SECRET_KEY
  };
  const fetchOriginal = global.fetch;
  const solicitud = {
    id: '00000000-0000-4000-8000-000000000303',
    nombre_centro: 'Docente de pruebas',
    tipo_centro: 'docente',
    estado: 'aprobada'
  };
  process.env.GOOGLE_CLIENT_ID = fakeGoogle.CLIENT_ID;
  process.env.SUPABASE_URL = 'https://ejemplo.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'clave-test';
  global.fetch = async (url) => {
    if (url === fakeGoogle.JWKS_URL) return { ok: true, json: async () => fakeGoogle.jwks() };
    const destino = new URL(url);
    const tabla = destino.pathname.split('/').pop();
    if (tabla === 'PJ27_solicitudes') return { ok: true, text: async () => JSON.stringify([solicitud]) };
    if (tabla === 'PJ27_miembros') return { ok: true, text: async () => '[]' };
    throw new Error(`Solicitud Supabase inesperada: ${destino.pathname}`);
  };

  try {
    const r = await invocar(centros, {
      ruta: 'mi',
      cabeceras: { authorization: `Bearer ${fakeGoogle.emitir({ sub: 'cuenta-docente-pruebas-aprobada' })}` }
    });
    assert.equal(r.status, 200);
    assert.equal(r.cuerpo.docenteAprobado, true);
    assert.deepEqual(r.cuerpo.organizaciones, []);
    assert.equal(r.cab['Cache-Control'], 'no-store');
  } finally {
    global.fetch = fetchOriginal;
    if (envOriginal.google === undefined) delete process.env.GOOGLE_CLIENT_ID;
    else process.env.GOOGLE_CLIENT_ID = envOriginal.google;
    if (envOriginal.supabaseUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = envOriginal.supabaseUrl;
    if (envOriginal.supabaseKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = envOriginal.supabaseKey;
  }
});

test('educación: salud responde y no cachea', async () => {
  const r = await invocar(educacion, { ruta: 'salud' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.cuerpo, { ok: true });
  assert.equal(r.cab['Cache-Control'], 'no-store');
});

test('educación: ruta desconocida y rutas de administración sin sesión', async () => {
  assert.equal((await invocar(educacion, { ruta: 'no-existe' })).status, 404);
  const sin = await invocar(educacion, { ruta: 'admin/resumen' });
  assert.equal(sin.status, 401);
  assert.equal(sin.cuerpo.error, 'no_autorizado');
  const falso = await invocar(educacion, { ruta: 'admin/resumen', cabeceras: { authorization: 'Bearer x.y' } });
  assert.equal(falso.status, 401);
});

test('educación: un cuerpo JSON mal formado se rechaza con 400', async () => {
  const r = await invocar(educacion, { metodo: 'POST', ruta: 'admin/sesion', body: '{no-json' });
  assert.equal(r.status, 400);
  assert.equal(r.cuerpo.error, 'json_no_valido');
});

test('centros: configuración pública sin variables de entorno falla de forma segura', async () => {
  const guardada = process.env.GOOGLE_CLIENT_ID;
  delete process.env.GOOGLE_CLIENT_ID;
  try {
    const r = await invocar(centros, { ruta: 'config' });
    assert.equal(r.status, 500);
    assert.equal(r.cuerpo.error, 'configuracion_incompleta');
  } finally { if (guardada !== undefined) process.env.GOOGLE_CLIENT_ID = guardada; }
});

test('centros: la configuración pública solo expone el ID de cliente de Google', async () => {
  process.env.GOOGLE_CLIENT_ID = 'cliente-prueba.apps.googleusercontent.com';
  const r = await invocar(centros, { ruta: 'config' });
  assert.equal(r.status, 200);
  assert.deepEqual(r.cuerpo, { googleClientId: 'cliente-prueba.apps.googleusercontent.com' });
  assert.equal(r.cab['Cache-Control'], 'public, max-age=300');
});

test('Supabase: clasifica tabla inexistente sin exponer el mensaje upstream', async () => {
  const fetchOriginal = global.fetch;
  const urlOriginal = process.env.SUPABASE_URL;
  const claveOriginal = process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_URL = 'https://ejemplo.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'clave-de-prueba';
  global.fetch = async () => ({
    ok: false,
    status: 404,
    text: async () => JSON.stringify({ code: 'PGRST205', message: 'tabla no encontrada' })
  });
  try {
    await assert.rejects(supabase.select('PJ27_solicitudes'), (e) => {
      assert.equal(e.status, 502);
      assert.equal(e.codigo, 'bd_tabla_no_encontrada');
      assert.equal(e.bdStatus, 404);
      assert.equal(e.bdCode, 'PGRST205');
      return true;
    });
  } finally {
    global.fetch = fetchOriginal;
    if (urlOriginal === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = urlOriginal;
    if (claveOriginal === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = claveOriginal;
  }
});

test('Supabase: distingue credenciales rechazadas', async () => {
  const fetchOriginal = global.fetch;
  const urlOriginal = process.env.SUPABASE_URL;
  const claveOriginal = process.env.SUPABASE_SECRET_KEY;
  process.env.SUPABASE_URL = 'https://ejemplo.supabase.co';
  process.env.SUPABASE_SECRET_KEY = 'clave-de-prueba';
  global.fetch = async () => ({ ok: false, status: 401, text: async () => '{"code":"PGRST301"}' });
  try {
    await assert.rejects(supabase.select('PJ27_solicitudes'), (e) => {
      assert.equal(e.codigo, 'bd_credenciales_invalidas');
      assert.equal(e.bdStatus, 401);
      return true;
    });
  } finally {
    global.fetch = fetchOriginal;
    if (urlOriginal === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = urlOriginal;
    if (claveOriginal === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = claveOriginal;
  }
});

test('centros: sin token no hay acceso a rutas de persona ni de RSP', async () => {
  assert.equal((await invocar(centros, { ruta: 'mi' })).status, 401);
  assert.equal((await invocar(centros, { ruta: 'solicitud', metodo: 'POST', body: {} })).status, 401);
  assert.equal((await invocar(centros, { ruta: 'rsp-lista' })).status, 401);
  assert.equal((await invocar(centros, { ruta: 'rsp-decision', metodo: 'POST', query: { id: '00000000-0000-4000-8000-000000000000' }, body: {} })).status, 401);
});

test('centros: métodos no permitidos y rutas desconocidas', async () => {
  assert.equal((await invocar(centros, { ruta: 'config', metodo: 'POST' })).status, 405);
  assert.equal((await invocar(centros, { ruta: 'nada' })).status, 404);
});
