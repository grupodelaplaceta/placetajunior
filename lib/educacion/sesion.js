'use strict';
/* Sesión del administrador sin estado en memoria (las funciones de Vercel no comparten memoria).
   El token lleva usuario y caducidad, firmados con HMAC usando una clave derivada de PJ27_CLAVE_CIFRADO. */
const crypto = require('node:crypto');
const { clave } = require('./cifrado.js');
const { httpError } = require('../errores.js');

const DURACION_MS = 8 * 60 * 60 * 1000;

const hashClave = (texto, salt) => crypto.scryptSync(String(texto), salt, 64).toString('hex');

function claveFirma() {
  return Buffer.from(crypto.hkdfSync('sha256', clave(), Buffer.alloc(0), 'pj27-sesion-admin', 32));
}

function emitirToken(usuario) {
  const cuerpo = Buffer.from(JSON.stringify({ u: usuario, exp: Date.now() + DURACION_MS })).toString('base64url');
  const firma = crypto.createHmac('sha256', claveFirma()).update(cuerpo).digest('base64url');
  return `${cuerpo}.${firma}`;
}

function usuarioDeToken(token) {
  const partes = String(token || '').split('.');
  if (partes.length !== 2) return null;
  const esperada = crypto.createHmac('sha256', claveFirma()).update(partes[0]).digest();
  const recibida = Buffer.from(partes[1], 'base64url');
  if (recibida.length !== esperada.length || !crypto.timingSafeEqual(recibida, esperada)) return null;
  try {
    const datos = JSON.parse(Buffer.from(partes[0], 'base64url').toString('utf8'));
    if (typeof datos.exp !== 'number' || datos.exp < Date.now() || typeof datos.u !== 'string') return null;
    return datos.u;
  } catch {
    return null;
  }
}

function exigirAdmin(req) {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '');
  const usuario = usuarioDeToken(t);
  if (!usuario) throw httpError(401, 'no_autorizado');
  return usuario;
}

module.exports = { hashClave, emitirToken, usuarioDeToken, exigirAdmin };
