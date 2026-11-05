const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const google = require('./fake-google.cjs');

// Configuración de prueba: el ID de cliente real se define en Vercel (GOOGLE_CLIENT_ID)
process.env.GOOGLE_CLIENT_ID = google.CLIENT_ID;

// Las claves públicas de Google se piden por red; aquí se sirven en local con la misma forma (JWKS)
const originalFetch = globalThis.fetch;
globalThis.fetch = (url, opts) => (String(url) === google.JWKS_URL
  ? Promise.resolve(new Response(JSON.stringify(google.jwks()), { status: 200 }))
  : originalFetch(url, opts));

const { verificarIdToken } = require('../lib/google.js');
const { idInterno } = require('../lib/auth.js');

const ahora = () => Math.floor(Date.now() / 1000);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

test('acepta un token válido y devuelve la identidad', async () => {
  const r = await verificarIdToken(google.emitir({ sub: '1111', email: 'Ana@Colegio.test', nombre: 'Ana Ruiz' }));
  assert.equal(r.sub, '1111');
  assert.equal(r.email, 'ana@colegio.test');
  assert.equal(r.nombre, 'Ana Ruiz');
});

test('rechaza lo que no es un token de Google', async () => {
  for (const t of [undefined, '', 'hola', 'a.b.c']) {
    await assert.rejects(() => verificarIdToken(t), (e) => e.status === 401);
  }
});

test('rechaza una firma de otra clave', async () => {
  const falso = google.firmar({ iss: 'https://accounts.google.com', aud: google.CLIENT_ID, sub: '1', email: 'x@x.test', email_verified: true, exp: ahora() + 600 },
    { clave: google.claveAjena() });
  await assert.rejects(() => verificarIdToken(falso), (e) => e.status === 401);
});

test('rechaza un token de otra aplicación', async () => {
  await assert.rejects(() => verificarIdToken(google.emitir({ aud: 'otra.apps.googleusercontent.com' })), (e) => e.status === 401);
});

test('rechaza tokens caducados, de otro emisor y con correo sin verificar', async () => {
  await assert.rejects(() => verificarIdToken(google.emitir({ exp: ahora() - 3600, iat: ahora() - 7200 })), (e) => e.status === 401);
  await assert.rejects(() => verificarIdToken(google.emitir({ iss: 'https://otro.example' })), (e) => e.status === 401);
  await assert.rejects(() => verificarIdToken(google.emitir({ verificado: false })), (e) => e.status === 401);
});

test('no acepta "none" ni HS256 aunque el resto parezca correcto', async () => {
  const cuerpo = Buffer.from(JSON.stringify({ iss: 'https://accounts.google.com', aud: google.CLIENT_ID, sub: '1', email: 'x@x.test', email_verified: true, exp: ahora() + 600 })).toString('base64url');
  const none = `${Buffer.from(JSON.stringify({ alg: 'none', kid: 'clave-prueba-1' })).toString('base64url')}.${cuerpo}.`;
  const hs = google.firmar({ iss: 'https://accounts.google.com', aud: google.CLIENT_ID, sub: '1', email: 'x@x.test', email_verified: true, exp: ahora() + 600 }, { alg: 'HS256' });
  await assert.rejects(() => verificarIdToken(none), (e) => e.status === 401);
  await assert.rejects(() => verificarIdToken(hs), (e) => e.status === 401);
});

test('identificador interno estable por persona', () => {
  assert.match(idInterno('777'), UUID);
  assert.equal(idInterno('777'), idInterno('777'));
  assert.notEqual(idInterno('777'), idInterno('888'));
});

test('la clave de cliente de Google no aparece en el código del sitio', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const raiz = path.join(__dirname, '..');
  const recorrer = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.name === 'node_modules' || e.name === '.git' || e.name === 'tests') return [];
    const p = path.join(dir, e.name);
    return e.isDirectory() ? recorrer(p) : [p];
  });
  for (const f of recorrer(raiz)) {
    if (!/\.(js|cjs|html|json|md)$/.test(f)) continue;
    assert.ok(!/GOCSPX-/.test(fs.readFileSync(f, 'utf8')), `secreto de cliente en ${path.relative(raiz, f)}`);
  }
});
