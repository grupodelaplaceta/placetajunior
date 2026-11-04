'use strict';
// Identidad de centros: la persona inicia sesión con Google y el servidor verifica su token (lib/google.js).
const crypto = require('node:crypto');
const { httpError } = require('./errores.js');
const { verificarIdToken } = require('./google.js');
const { eq, select } = require('./supabase.js');

function tokenDe(req) {
  const cab = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
  const m = /^Bearer (.+)$/.exec(cab);
  return m ? m[1].trim() : null;
}

// Identificador interno estable (UUID) derivado del identificador de Google (sub)
function idInterno(sub) {
  const b = Buffer.from(crypto.createHash('sha256').update(`pj27:google:${sub}`).digest().subarray(0, 16));
  b[6] = (b[6] & 0x0f) | 0x50;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = b.toString('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

async function exigirUsuario(req) {
  const t = tokenDe(req);
  if (!t) throw httpError(401, 'no_autenticado');
  const g = await verificarIdToken(t);
  return { id: idInterno(g.sub), email: g.email, nombre: g.nombre };
}

async function exigirRSP(req) {
  const u = await exigirUsuario(req);
  const filas = await select('PJ27_rsp_usuarios', `email=${eq(u.email)}`);
  if (!filas.length) throw httpError(403, 'no_autorizado');
  return u;
}

async function membresia(orgId, userId) {
  const filas = await select('PJ27_miembros', `org_id=${eq(orgId)}&user_id=${eq(userId)}`);
  return filas[0] || null;
}

module.exports = { exigirUsuario, exigirRSP, membresia, tokenDe, idInterno };
