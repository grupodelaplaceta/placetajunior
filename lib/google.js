'use strict';
// Verificación del token de identidad (ID token) que entrega Google Identity Services.
// El navegador obtiene el token de Google; el servidor comprueba su firma con las claves públicas
// oficiales de Google y que el token es para esta aplicación. No necesita ningún secreto.
const crypto = require('node:crypto');
const { httpError } = require('./errores.js');
const { leerGoogleClientId } = require('./config.js');

const URL_CLAVES = 'https://www.googleapis.com/oauth2/v3/certs';
const EMISORES = ['https://accounts.google.com', 'accounts.google.com'];
const TOLERANCIA_S = 60;            // margen por diferencias de reloj
const CACHE_MS = 60 * 60 * 1000;    // claves en caché 1 hora
const ESPERA_RECARGA_MS = 30 * 1000; // evita pedir las claves sin parar si llega un "kid" desconocido

let claves = new Map();
let caducaCache = 0;
let ultimaCarga = 0;

async function cargarClaves() {
  const r = await fetch(URL_CLAVES);
  if (!r.ok) throw httpError(502, 'google_no_disponible');
  const datos = await r.json();
  const mapa = new Map();
  for (const k of (datos && datos.keys) || []) {
    if (k.kid && k.kty === 'RSA') mapa.set(k.kid, k);
  }
  claves = mapa;
  ultimaCarga = Date.now();
  caducaCache = ultimaCarga + CACHE_MS;
}

async function clavePublica(kid) {
  const desconocida = !claves.has(kid);
  if (Date.now() > caducaCache || (desconocida && Date.now() - ultimaCarga > ESPERA_RECARGA_MS)) {
    await cargarClaves();
  }
  const jwk = claves.get(kid);
  if (!jwk) throw httpError(401, 'no_autenticado');
  return crypto.createPublicKey({ key: jwk, format: 'jwk' });
}

const decodificar = (parte) => JSON.parse(Buffer.from(parte, 'base64url').toString('utf8'));

// Devuelve { sub, email, nombre } si el token es válido; si no, lanza 401 sin detalles.
async function verificarIdToken(jwt) {
  const noAutenticado = () => httpError(401, 'no_autenticado');
  const clientId = leerGoogleClientId(); // error de configuración → 500
  const partes = String(jwt || '').split('.');
  if (partes.length !== 3) throw noAutenticado();

  let cabecera;
  let datos;
  try {
    cabecera = decodificar(partes[0]);
    datos = decodificar(partes[1]);
  } catch {
    throw noAutenticado();
  }
  if (cabecera.alg !== 'RS256' || !cabecera.kid) throw noAutenticado();

  const clave = await clavePublica(cabecera.kid);
  const firmaValida = crypto.verify(
    'sha256',
    Buffer.from(`${partes[0]}.${partes[1]}`),
    clave,
    Buffer.from(partes[2], 'base64url')
  );
  if (!firmaValida) throw noAutenticado();

  const ahora = Math.floor(Date.now() / 1000);
  if (!EMISORES.includes(datos.iss)) throw noAutenticado();
  if (datos.aud !== clientId) throw noAutenticado();              // token de otra aplicación
  if (typeof datos.exp !== 'number' || datos.exp + TOLERANCIA_S < ahora) throw noAutenticado();
  if (typeof datos.iat === 'number' && datos.iat - TOLERANCIA_S > ahora) throw noAutenticado();
  if (typeof datos.sub !== 'string' || !datos.sub) throw noAutenticado();
  if (datos.email_verified !== true && datos.email_verified !== 'true') throw noAutenticado();
  if (typeof datos.email !== 'string' || !datos.email) throw noAutenticado();

  return {
    sub: datos.sub,
    email: datos.email.toLowerCase(),
    nombre: typeof datos.name === 'string' ? datos.name : ''
  };
}

module.exports = { verificarIdToken };
