'use strict';
/* Cifrado en reposo de secretos de dispositivo (AES-256-GCM, autenticado).
   La clave viene de la variable de entorno PJ27_CLAVE_CIFRADO (32 bytes en base64).
   Generarla: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   Si la clave cambia, los secretos guardados dejan de descifrarse. */
const crypto = require('node:crypto');

const PREFIJO = 'v1:';

function clave() {
  const k = Buffer.from(process.env.PJ27_CLAVE_CIFRADO || '', 'base64');
  if (k.length !== 32) {
    const e = new Error('clave_cifrado_no_configurada');
    e.codigo = 'clave_cifrado_no_configurada';
    e.status = 500;
    throw e;
  }
  return k;
}

function cifrar(texto) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv('aes-256-gcm', clave(), iv);
  const cuerpo = Buffer.concat([c.update(String(texto), 'utf8'), c.final()]);
  return PREFIJO + Buffer.concat([iv, c.getAuthTag(), cuerpo]).toString('base64');
}

function descifrar(valor) {
  if (typeof valor !== 'string' || !valor.startsWith(PREFIJO)) throw new Error('formato_no_valido');
  const buf = Buffer.from(valor.slice(PREFIJO.length), 'base64');
  const d = crypto.createDecipheriv('aes-256-gcm', clave(), buf.subarray(0, 12));
  d.setAuthTag(buf.subarray(12, 28));
  return Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8');
}

module.exports = { cifrar, descifrar, clave };
