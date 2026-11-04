'use strict';
/* Firma de políticas (HMAC-SHA256 sobre JSON canónico). Mismo formato que shared/firma.js
   de la app de escritorio: un cambio manipulado en tránsito se detecta. */
const crypto = require('node:crypto');

function canonico(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return '[' + v.map(canonico).join(',') + ']';
  return '{' + Object.keys(v).sort().filter((k) => v[k] !== undefined)
    .map((k) => JSON.stringify(k) + ':' + canonico(v[k])).join(',') + '}';
}

function firmar(bundle, secretoB64) {
  const sinFirma = { ...bundle };
  delete sinFirma.firma;
  return crypto.createHmac('sha256', Buffer.from(secretoB64, 'base64')).update(canonico(sinFirma)).digest('hex');
}

module.exports = { canonico, firmar };
