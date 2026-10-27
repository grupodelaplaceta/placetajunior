'use strict';
// Función única de centros (límite de funciones de Vercel). Vercel.json reescribe cada ruta
// pública a esta función con el parámetro ?ruta=...
const { envolver, httpError } = require('../lib/errores.js');
const h = require('../lib/centros/handlers.js');

const RUTAS = {
  config: h.config,
  mi: h.mi,
  solicitud: h.solicitud,
  'crear-actividad': h.crearActividad,
  dispositivos: h.dispositivos,
  'config-dispositivos': h.configDispositivos,
  'guardar-config-dispositivos': h.guardarConfigDispositivos,
  'desvincular-dispositivo': h.desvincularDispositivo,
  org: h.org,
  'rsp-lista': h.rspLista,
  'rsp-decision': h.rspDecision
};

module.exports = envolver(async (req, res) => {
  const fn = Object.prototype.hasOwnProperty.call(RUTAS, req.query.ruta) ? RUTAS[req.query.ruta] : null;
  if (!fn) throw httpError(404, 'ruta_no_encontrada');
  return fn(req, res);
});
