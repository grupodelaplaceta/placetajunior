'use strict';
/* PIN de apagado y cierre de sesión. El servidor guarda solo un hash PBKDF2-SHA256 (nunca el PIN).
   El equipo verifica el PIN con el mismo algoritmo (pj-os: ui/js/pin.js). */
const crypto = require('node:crypto');

const ALG = 'pbkdf2-sha256';
const ITER = 200000;
const PIN_RE = /^[A-Za-z0-9]{4,12}$/;

function validarPin(pin) {
  return typeof pin === 'string' && PIN_RE.test(pin);
}

function crearRegistroPin(pin) {
  if (!validarPin(pin)) throw Object.assign(new Error('pin_no_valido'), { status: 400, codigo: 'pin_no_valido' });
  const salt = crypto.randomBytes(16);
  const hash = crypto.pbkdf2Sync(pin, salt, ITER, 32, 'sha256');
  return {
    alg: ALG, iter: ITER,
    salt: salt.toString('base64'), hash: hash.toString('base64'),
    tipo: /^[0-9]+$/.test(pin) ? 'numerico' : 'alfanumerico'
  };
}

function registroPinValido(r) {
  return !!r && typeof r === 'object' && r.alg === ALG && Number.isInteger(r.iter) &&
    r.iter >= 100000 && r.iter <= 1000000 && typeof r.salt === 'string' && r.salt.length > 0 && r.salt.length <= 64 &&
    typeof r.hash === 'string' && r.hash.length > 0 && r.hash.length <= 128 &&
    (r.tipo === 'numerico' || r.tipo === 'alfanumerico');
}

module.exports = { ALG, ITER, validarPin, crearRegistroPin, registroPinValido };
