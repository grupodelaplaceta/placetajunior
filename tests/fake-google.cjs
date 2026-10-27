'use strict';
// Simulación de Google Identity: emite tokens de identidad firmados con una clave de prueba y sirve
// la clave pública como lo hace Google (JWKS). Así la verificación real del servidor se prueba de verdad.
const crypto = require('node:crypto');

const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
const KID = 'clave-prueba-1';
const CLIENT_ID = 'prueba-cliente.apps.googleusercontent.com';
const JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const jwk = { ...publicKey.export({ format: 'jwk' }), kid: KID, alg: 'RS256', use: 'sig' };

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');

function firmar(payload, { clave = privateKey, kid = KID, alg = 'RS256' } = {}) {
  const cab = b64({ alg, kid, typ: 'JWT' });
  const cuerpo = b64(payload);
  const firma = crypto.sign('sha256', Buffer.from(`${cab}.${cuerpo}`), clave).toString('base64url');
  return `${cab}.${cuerpo}.${firma}`;
}

function emitir({ sub = '1234567890', email = 'persona@colegio.test', nombre = 'Persona de prueba',
  verificado = true, aud = CLIENT_ID, iss = 'https://accounts.google.com', exp, iat, ...extra } = {}) {
  const ahora = Math.floor(Date.now() / 1000);
  return firmar({
    iss, aud, sub, email, email_verified: verificado, name: nombre,
    iat: iat ?? ahora, exp: exp ?? ahora + 3600, ...extra
  });
}

module.exports = {
  emitir, firmar, CLIENT_ID, JWKS_URL,
  jwks: () => ({ keys: [jwk] }),
  claveAjena: () => crypto.generateKeyPairSync('rsa', { modulusLength: 2048 }).privateKey
};
