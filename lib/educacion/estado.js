'use strict';
/* Estado de educación en Supabase: un único documento jsonb (fila 'principal').
   Cada cambio es una transacción optimista: se escribe solo si nadie ha cambiado el documento
   desde que se leyó (columna version). Si hay conflicto, se vuelve a leer y se reintenta. */
const { eq, select, insert, update } = require('../supabase.js');
const { httpError } = require('../errores.js');

const TABLA = 'PJ27_estado';
const ID = 'principal';
const REINTENTOS = 8;

const datosIniciales = () => ({
  admin: null, orgs: [], devices: [], documentos: [], aceptaciones: [], auditoria: [], intentosLogin: {}
});

async function leerFila() {
  const filas = await select(TABLA, `id=${eq(ID)}`);
  return filas[0] || null;
}

async function leer() {
  const fila = await leerFila();
  return fila ? fila.datos : datosIniciales();
}

// Ejecuta fn(copia) y guarda el resultado solo si cambia algo. fn puede lanzar httpError (no guarda).
async function transaccion(fn) {
  for (let intento = 0; intento < REINTENTOS; intento++) {
    const fila = await leerFila();
    const original = fila ? fila.datos : datosIniciales();
    const version = fila ? fila.version : 0;
    const copia = JSON.parse(JSON.stringify(original));
    const resultado = await fn(copia);
    if (JSON.stringify(copia) === JSON.stringify(original)) return resultado;

    const cambios = { datos: copia, version: version + 1, actualizado_en: new Date().toISOString() };
    try {
      if (!fila) {
        await insert(TABLA, [{ id: ID, ...cambios }]);
        return resultado;
      }
      const filas = await update(TABLA, `id=${eq(ID)}&version=${eq(version)}`, cambios);
      if (filas.length) return resultado;
    } catch (e) {
      if (e.status !== 409) throw e; // 409: otra petición escribió antes; reintentar
    }
  }
  throw httpError(503, 'conflicto_concurrente');
}

module.exports = { leer, transaccion, datosIniciales };
