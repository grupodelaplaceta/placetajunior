'use strict';
// Función única de educación (límite de funciones de Vercel). Vercel.json reescribe /api/admin/* y
// /api/dispositivo/* a esta función con ?ruta=admin/... o dispositivo/...
const { envolver, httpError } = require('../lib/errores.js');
const { buscar } = require('../lib/educacion/rutas.js');

const LIMITE_CUERPO = 256 * 1024;

module.exports = envolver(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const pathname = '/api/' + String(req.query.ruta || '');
  const r = buscar(req.method, pathname);
  if (!r) throw httpError(404, 'ruta_no_encontrada');

  let body = {};
  if (req.method === 'POST' || req.method === 'PUT') {
    if (typeof req.body === 'string') {
      if (req.body.length > LIMITE_CUERPO) throw httpError(413, 'demasiado_grande');
      try { body = req.body ? JSON.parse(req.body) : {}; } catch { throw httpError(400, 'json_no_valido'); }
    } else if (req.body && typeof req.body === 'object') {
      body = req.body;
    }
    if (JSON.stringify(body).length > LIMITE_CUERPO) throw httpError(413, 'demasiado_grande');
  }

  const salida = await r.fn({ req, body, params: r.params, query: req.query });
  res.status(200).json(salida);
});
