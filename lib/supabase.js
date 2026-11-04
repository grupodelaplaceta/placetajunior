'use strict';
// Acceso a la base de datos mediante la API REST de Supabase, con la clave secreta (solo servidor).
const { leerSupabase } = require('./config.js');
const { httpError } = require('./errores.js');

const eq = (v) => `eq.${encodeURIComponent(String(v))}`;

async function rest(metodo, tabla, { filtros = '', cuerpo, prefer } = {}) {
  const c = leerSupabase();
  let r;
  try {
    r = await fetch(`${c.url}/rest/v1/${tabla}${filtros}`, {
      method: metodo,
      headers: {
        apikey: c.secretKey,
        Authorization: `Bearer ${c.secretKey}`,
        'Content-Type': 'application/json',
        ...(prefer ? { Prefer: prefer } : {})
      },
      body: cuerpo !== undefined ? JSON.stringify(cuerpo) : undefined
    });
  } catch {
    throw httpError(502, 'bd_no_disponible');
  }
  const texto = await r.text();
  let datos = null;
  try { datos = texto ? JSON.parse(texto) : null; } catch { /* respuesta del proveedor no JSON */ }
  if (!r.ok) {
    // 409 = conflicto (p. ej. clave duplicada); 400 = petición rechazada; el resto, error de la base
    const status = r.status === 409 ? 409 : r.status === 400 ? 400 : 502;
    const codigoBD = datos && typeof datos.code === 'string' ? datos.code : '';
    const codigo = r.status === 401 || r.status === 403
      ? 'bd_credenciales_invalidas'
      : r.status === 404 && (codigoBD === 'PGRST205' || codigoBD === '42P01')
        ? 'bd_tabla_no_encontrada'
        : 'bd_error';
    const e = httpError(status, codigo);
    e.bdStatus = r.status;
    e.bdCode = codigoBD;
    e.mensajeBD = datos && datos.message ? String(datos.message) : '';
    throw e;
  }
  return datos;
}

const select = (tabla, filtros = '', extra = '') => rest('GET', tabla, { filtros: `?${filtros}${extra}` });
const insert = (tabla, filas) => rest('POST', tabla, { cuerpo: filas, prefer: 'return=representation' });
const update = (tabla, filtros, cambios) => rest('PATCH', tabla, { filtros: `?${filtros}`, cuerpo: cambios, prefer: 'return=representation' });

async function rpc(nombre, args) {
  try {
    return await rest('POST', `rpc/${nombre}`, { cuerpo: args });
  } catch (e) {
    const m = e.mensajeBD || '';
    if (m.includes('solicitud_no_pendiente')) throw httpError(409, 'solicitud_no_pendiente');
    if (m.includes('solicitud_no_encontrada')) throw httpError(404, 'solicitud_no_encontrada');
    throw e;
  }
}

async function auditar(actor, accion, detalle = {}) {
  await insert('PJ27_auditoria', [{ actor, accion, detalle }]);
}

module.exports = { eq, rest, select, insert, update, rpc, auditar };
