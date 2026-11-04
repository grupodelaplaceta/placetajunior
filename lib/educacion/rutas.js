'use strict';
/* API de educación (portal de administración y dispositivos de Placeta Junior IO).
   Las rutas se despachan desde api/educacion.js. Escrituras con transacción sobre el estado en Supabase. */
const crypto = require('node:crypto');
const firma = require('./firma.js');
const pol = require('./politica.js');
const pin = require('./pin.js');
const cifrado = require('./cifrado.js');
const estado = require('./estado.js');
const sesion = require('./sesion.js');
const { httpError } = require('../errores.js');

// Edad a partir de la cual el menor puede prestar consentimiento propio (art. 7 LOPDGDD).
// Confirmar con asesoría jurídica antes de publicar.
const EDAD_CONSENTIMIENTO = 14;
const TIPOS_DOC = ['condiciones', 'privacidad', 'informacion'];
const TIPOS_CAMBIO = ['tecnico', 'organizativo', 'normativo'];
const CODIGO_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const PLATAFORMAS_DISPOSITIVO = ['windows', 'chromebook'];
const BLOQUEO_INTENTOS = 8;
const BLOQUEO_MS = 15 * 60 * 1000;

const ahora = () => new Date().toISOString();
const sha256 = (t) => crypto.createHash('sha256').update(String(t)).digest('hex');
const nuevoId = (p) => p + crypto.randomBytes(6).toString('hex');
const ultima = (arr) => arr[arr.length - 1];
const esAplicable = (doc, org) => doc.ambito === 'todas' || (Array.isArray(doc.ambito) && doc.ambito.includes(org.id));

function auditar(d, actor, accion, detalle) {
  d.auditoria.push({ fecha: ahora(), actor, accion, detalle });
  if (d.auditoria.length > 5000) d.auditoria.splice(0, d.auditoria.length - 5000);
}

function generarCodigo(d) {
  for (let intento = 0; intento < 100; intento++) {
    const bytes = crypto.randomBytes(8);
    let s = '';
    for (const b of bytes) s += CODIGO_CHARS[b % CODIGO_CHARS.length];
    const codigo = `PJ-${s.slice(0, 4)}-${s.slice(4, 8)}`;
    if (!d.orgs.some((o) => o.codigoCentro === codigo)) return codigo;
  }
  throw httpError(500, 'no_se_pudo_generar_codigo');
}

function orgDe(d, id) {
  const o = d.orgs.find((x) => x.id === id);
  if (!o) throw httpError(404, 'no_encontrado');
  return o;
}

function dispositivoDe(d, req) {
  const t = (req.headers.authorization || '').replace(/^Bearer /, '');
  if (!t) throw httpError(401, 'no_autorizado');
  const h = sha256(t);
  const disp = d.devices.find((x) => x.tokenHash === h);
  if (!disp) throw httpError(401, 'no_autorizado');
  if (disp.estado !== 'activo') throw httpError(403, 'desvinculado');
  return disp;
}

function documentosParaOrg(d, org) {
  return d.documentos.filter((doc) => esAplicable(doc, org)).map((doc) => {
    const v = ultima(doc.versiones);
    return {
      id: doc.id, tipo: doc.tipo, titulo: doc.titulo, version: v.version, hash: v.hash,
      requiereAceptacion: !!v.requiereAceptacion, requiereLectura: !!v.requiereLectura, tipoCambio: v.tipoCambio
    };
  });
}

// Política firmada para un dispositivo: lo que la app debe aplicar
function paquetePolitica(d, org, disp) {
  const documentos = documentosParaOrg(d, org);
  const pendientes = documentos
    .filter((doc) => doc.requiereAceptacion || doc.requiereLectura)
    .map((doc) => ({ documentoId: doc.id, titulo: doc.titulo, version: doc.version, hash: doc.hash, tipo: doc.requiereAceptacion ? 'aceptacion' : 'lectura' }))
    .filter((p) => !d.aceptaciones.some((a) =>
      a.deviceId === disp.id && a.documentoId === p.documentoId && a.version === p.version && a.tipo === p.tipo && a.estado === 'vigente'));
  const instrucciones = org.config.progreso === 'ninguno' ? ['borrar-progreso-local'] : [];
  const bundle = {
    orgId: org.id, codigoCentro: org.codigoCentro, nombre: org.nombre, revision: org.revision,
    tipoCambio: org.ultimoCambio.tipo, emitidoEn: ahora(), config: org.config, documentos, pendientes, instrucciones
  };
  bundle.firma = firma.firmar(bundle, cifrado.descifrar(disp.secreto));
  return bundle;
}

// Publica un cambio: sube la revisión de todas las organizaciones afectadas
function registrarCambio(d, tipo) {
  for (const o of d.orgs) {
    o.revision += 1;
    o.ultimoCambio = { tipo, fecha: ahora() };
  }
}

function validarVersion(body) {
  const texto = String(body.texto || '').trim();
  if (texto.length < 20) throw httpError(400, 'texto_demasiado_corto');
  if (!TIPOS_CAMBIO.includes(body.tipoCambio)) throw httpError(400, 'tipo_cambio_no_valido');
  return {
    texto, hash: sha256(texto), creadaEn: ahora(), tipoCambio: body.tipoCambio,
    requiereAceptacion: !!body.requiereAceptacion, requiereLectura: !!body.requiereLectura
  };
}

// Vista para el portal: sin el hash del PIN (solo si está definido y de qué tipo)
function vistaAdmin(configValidada) {
  const r = configValidada.seguridad && configValidada.seguridad.pinApagado;
  return { ...configValidada, seguridad: { pinDefinido: !!r, tipoPin: r ? r.tipo : null } };
}

// Decide el PIN resultante a partir de la intención del portal: quitar, cambiar o mantener
function pinResultante(actual, cuerpoConfig) {
  const intencion = (cuerpoConfig && cuerpoConfig.seguridad) || {};
  if (intencion.quitarPin === true) return null;
  if (intencion.pinNuevo !== undefined && intencion.pinNuevo !== '') {
    if (!pin.validarPin(intencion.pinNuevo)) throw httpError(400, 'pin_no_valido');
    return pin.crearRegistroPin(intencion.pinNuevo);
  }
  return actual.seguridad && actual.seguridad.pinApagado ? actual.seguridad.pinApagado : null;
}

function exigirAdminCuerpo(req) {
  return sesion.exigirAdmin(req);
}

// ── Rutas ──────────────────────────────────────────────────────────
const RUTAS = [];
const ruta = (metodo, patron, fn) => {
  const claves = [];
  const re = new RegExp('^' + patron.replace(/:(\w+)/g, (_, k) => { claves.push(k); return '([^/]+)'; }) + '$');
  RUTAS.push({ metodo, re, claves, fn });
};

ruta('GET', '/api/salud', async () => ({ ok: true }));

ruta('POST', '/api/admin/sesion', async ({ body }) => {
  const usuario = String(body.usuario || '').slice(0, 64);
  const clave = String(body.clave || '');
  const resultado = await estado.transaccion(async (d) => {
    const intentos = d.intentosLogin[usuario] || { n: 0, hasta: 0 };
    if (intentos.hasta > Date.now()) return { bloqueado: true };
    if (!d.admin) {
      const claveInicial = process.env.PJ_ADMIN_CLAVE;
      if (!claveInicial) throw httpError(503, 'admin_no_configurado');
      const salt = crypto.randomBytes(16).toString('hex');
      d.admin = { usuario: process.env.PJ_ADMIN_USUARIO || 'admin', salt, hash: sesion.hashClave(claveInicial, salt) };
    }
    const ok = usuario === d.admin.usuario &&
      crypto.timingSafeEqual(Buffer.from(sesion.hashClave(clave, d.admin.salt), 'hex'), Buffer.from(d.admin.hash, 'hex'));
    if (ok) {
      delete d.intentosLogin[usuario];
      auditar(d, usuario, 'sesion_iniciada', {});
      return { ok: true };
    }
    const n = intentos.n + 1;
    d.intentosLogin[usuario] = { n: n >= BLOQUEO_INTENTOS ? 0 : n, hasta: n >= BLOQUEO_INTENTOS ? Date.now() + BLOQUEO_MS : 0 };
    return { ok: false };
  });
  if (resultado.bloqueado) throw httpError(429, 'demasiados_intentos');
  if (!resultado.ok) throw httpError(401, 'credenciales_no_validas');
  return { token: sesion.emitirToken(usuario) };
});

ruta('GET', '/api/admin/resumen', async ({ req }) => {
  const usuario = exigirAdminCuerpo(req);
  const d = await estado.leer();
  return {
    usuario,
    organizaciones: d.orgs.length,
    dispositivosActivos: d.devices.filter((x) => x.estado === 'activo').length,
    documentos: d.documentos.length,
    aceptaciones: d.aceptaciones.filter((a) => a.estado === 'vigente').length
  };
});

ruta('GET', '/api/admin/organizaciones', async ({ req }) => {
  exigirAdminCuerpo(req);
  const d = await estado.leer();
  return d.orgs.map((o) => ({
    id: o.id, nombre: o.nombre, codigoCentro: o.codigoCentro, revision: o.revision, ultimoCambio: o.ultimoCambio,
    dispositivos: d.devices.filter((x) => x.orgId === o.id && x.estado === 'activo').length
  }));
});

ruta('POST', '/api/admin/organizaciones', async ({ req, body }) => {
  const usuario = exigirAdminCuerpo(req);
  const nombre = String(body.nombre || '').trim();
  if (nombre.length < 2 || nombre.length > 120) throw httpError(400, 'nombre_no_valido');
  return estado.transaccion(async (d) => {
    const org = {
      id: nuevoId('org_'), nombre, codigoCentro: generarCodigo(d), creadaEn: ahora(), revision: 1,
      config: pol.configDefecto(), ultimoCambio: { tipo: 'tecnico', fecha: ahora() }, historial: []
    };
    d.orgs.push(org);
    auditar(d, usuario, 'organizacion_creada', { id: org.id, codigoCentro: org.codigoCentro });
    return org;
  });
});

ruta('GET', '/api/admin/organizaciones/:id', async ({ req, params }) => {
  exigirAdminCuerpo(req);
  const d = await estado.leer();
  const o = orgDe(d, params.id);
  const { historial, ...resto } = o;
  return {
    ...resto,
    config: vistaAdmin(pol.validar(o.config)),
    historial: (historial || []).map((h) => ({ ...h, anterior: h.anterior ? vistaAdmin(pol.validar(h.anterior)) : null })),
    dispositivos: d.devices.filter((x) => x.orgId === o.id && x.estado === 'activo').length
  };
});

ruta('PUT', '/api/admin/organizaciones/:id/configuracion', async ({ req, body, params }) => {
  const usuario = exigirAdminCuerpo(req);
  return estado.transaccion(async (d) => {
    const o = orgDe(d, params.id);
    const anterior = pol.validar(o.config);
    const nueva = pol.validar({ ...anterior, ...(body.config || {}), seguridad: { pinApagado: pinResultante(anterior, body.config) } });
    const tipo = pol.clasificar(anterior, nueva);
    if (tipo === 'tecnico' && JSON.stringify(nueva) === JSON.stringify(anterior)) return { sinCambios: true, revision: o.revision };
    o.historial.push({ revision: o.revision, fecha: ahora(), tipoCambio: tipo, anterior });
    o.config = nueva;
    o.revision += 1;
    o.ultimoCambio = { tipo, fecha: ahora() };
    auditar(d, usuario, 'configuracion_cambiada', { orgId: o.id, tipo, revision: o.revision });
    return { revision: o.revision, tipoCambio: tipo };
  });
});

ruta('GET', '/api/admin/organizaciones/:id/dispositivos', async ({ req, params }) => {
  exigirAdminCuerpo(req);
  const d = await estado.leer();
  orgDe(d, params.id);
  return d.devices.filter((x) => x.orgId === params.id).map((x) => ({
    id: x.id, nombre: x.nombre, estado: x.estado, appVersion: x.appVersion,
    vinculadoEn: x.vinculadoEn, ultimoContacto: x.ultimoContacto, revocadoEn: x.revocadoEn || null
  }));
});

ruta('POST', '/api/admin/dispositivos/:id/desvincular', async ({ req, params }) => {
  const usuario = exigirAdminCuerpo(req);
  return estado.transaccion(async (d) => {
    const disp = d.devices.find((x) => x.id === params.id);
    if (!disp) throw httpError(404, 'no_encontrado');
    disp.estado = 'desvinculado';
    disp.secreto = null;
    disp.revocadoEn = ahora();
    auditar(d, usuario, 'dispositivo_desvinculado', { id: disp.id, orgId: disp.orgId });
    return { ok: true };
  });
});

ruta('GET', '/api/admin/organizaciones/:id/aceptaciones', async ({ req, params }) => {
  exigirAdminCuerpo(req);
  const d = await estado.leer();
  orgDe(d, params.id);
  const disp = new Set(d.devices.filter((x) => x.orgId === params.id).map((x) => x.id));
  return d.aceptaciones.filter((a) => disp.has(a.deviceId));
});

ruta('GET', '/api/admin/documentos', async ({ req }) => {
  exigirAdminCuerpo(req);
  const d = await estado.leer();
  return d.documentos.map((doc) => ({
    id: doc.id, tipo: doc.tipo, titulo: doc.titulo, ambito: doc.ambito,
    versiones: doc.versiones.map((v) => ({ version: v.version, hash: v.hash, creadaEn: v.creadaEn, tipoCambio: v.tipoCambio, requiereAceptacion: v.requiereAceptacion, requiereLectura: v.requiereLectura }))
  }));
});

ruta('POST', '/api/admin/documentos', async ({ req, body }) => {
  const usuario = exigirAdminCuerpo(req);
  if (!TIPOS_DOC.includes(body.tipo)) throw httpError(400, 'tipo_documento_no_valido');
  const titulo = String(body.titulo || '').trim();
  if (titulo.length < 3 || titulo.length > 160) throw httpError(400, 'titulo_no_valido');
  const v = { version: 1, ...validarVersion(body) };
  return estado.transaccion(async (d) => {
    const doc = { id: nuevoId('doc_'), tipo: body.tipo, titulo, ambito: 'todas', creadoEn: ahora(), versiones: [v] };
    d.documentos.push(doc);
    registrarCambio(d, v.tipoCambio);
    auditar(d, usuario, 'documento_publicado', { id: doc.id, version: 1, tipoCambio: v.tipoCambio });
    return { id: doc.id, version: 1, hash: v.hash };
  });
});

ruta('POST', '/api/admin/documentos/:id/versiones', async ({ req, body, params }) => {
  const usuario = exigirAdminCuerpo(req);
  const nueva = validarVersion(body);
  return estado.transaccion(async (d) => {
    const doc = d.documentos.find((x) => x.id === params.id);
    if (!doc) throw httpError(404, 'no_encontrado');
    if (nueva.hash === ultima(doc.versiones).hash) throw httpError(409, 'sin_cambios_en_el_texto');
    nueva.version = ultima(doc.versiones).version + 1;
    doc.versiones.push(nueva);
    registrarCambio(d, nueva.tipoCambio);
    auditar(d, usuario, 'documento_versionado', { id: doc.id, version: nueva.version, tipoCambio: nueva.tipoCambio });
    return { id: doc.id, version: nueva.version, hash: nueva.hash };
  });
});

ruta('POST', '/api/dispositivo/vincular', async ({ body }) => {
  const codigo = String(body.codigoCentro || '').trim().toUpperCase();
  return estado.transaccion(async (d) => {
    const org = d.orgs.find((o) => o.codigoCentro === codigo);
    if (!org) throw httpError(404, 'codigo_no_valido');
    const token = crypto.randomBytes(32).toString('hex');
    const secreto = crypto.randomBytes(32).toString('base64');
    const disp = {
      id: nuevoId('dis_'), orgId: org.id, nombre: String(body.nombre || 'Dispositivo').slice(0, 80),
      plataforma: PLATAFORMAS_DISPOSITIVO.includes(body.plataforma) ? body.plataforma : null,
      appVersion: String(body.appVersion || '').slice(0, 20), tokenHash: sha256(token), secreto: cifrado.cifrar(secreto),
      estado: 'activo', vinculadoEn: ahora(), ultimoContacto: ahora()
    };
    d.devices.push(disp);
    auditar(d, 'dispositivo', 'dispositivo_vinculado', { id: disp.id, orgId: org.id });
    return { deviceToken: token, secreto, orgId: org.id, deviceId: disp.id, codigoCentro: org.codigoCentro, politica: paquetePolitica(d, org, disp) };
  });
});

ruta('GET', '/api/dispositivo/politica', async ({ req, query }) => {
  const d = await estado.leer();
  const disp = dispositivoDe(d, req);
  const org = orgDe(d, disp.orgId);
  const revisionCliente = Number(query.revision);
  return estado.transaccion(async (dt) => {
    const dispT = dt.devices.find((x) => x.id === disp.id);
    const orgT = orgDe(dt, org.id);
    dispT.ultimoContacto = ahora();
    if (revisionCliente === orgT.revision) return { sinCambios: true, revision: orgT.revision };
    return paquetePolitica(dt, orgT, dispT);
  });
});

ruta('GET', '/api/dispositivo/documentos/:id/versiones/:version', async ({ req, params }) => {
  const d = await estado.leer();
  const disp = dispositivoDe(d, req);
  const org = orgDe(d, disp.orgId);
  const doc = d.documentos.find((x) => x.id === params.id);
  if (!doc) throw httpError(404, 'documento_no_encontrado');
  if (!esAplicable(doc, org)) throw httpError(403, 'documento_no_aplicable');
  const v = doc.versiones.find((x) => x.version === Number(params.version));
  if (!v) throw httpError(404, 'version_no_encontrada');
  return { id: doc.id, titulo: doc.titulo, tipo: doc.tipo, version: v.version, hash: v.hash, texto: v.texto };
});

ruta('POST', '/api/dispositivo/aceptaciones', async ({ req, body }) => {
  return estado.transaccion(async (d) => {
    const disp = dispositivoDe(d, req);
    const org = orgDe(d, disp.orgId);
    const doc = d.documentos.find((x) => x.id === body.documentoId);
    if (!doc) throw httpError(404, 'documento_no_encontrado');
    if (!esAplicable(doc, org)) throw httpError(403, 'documento_no_aplicable');
    const version = ultima(doc.versiones);
    if (Number(body.version) !== version.version) throw httpError(409, 'version_obsoleta');
    const tipo = String(body.tipo || '');
    if (tipo !== 'lectura' && tipo !== 'aceptacion' && tipo !== 'consentimiento') throw httpError(400, 'tipo_no_valido');
    if (tipo === 'lectura' && !version.requiereLectura) throw httpError(400, 'lectura_no_requerida');
    if (tipo === 'aceptacion' && !version.requiereAceptacion) throw httpError(400, 'aceptacion_no_requerida');
    const edad = body.usuarioEdad === undefined ? null : Number(body.usuarioEdad);
    if (edad !== null && (!Number.isInteger(edad) || edad < 3 || edad > 99)) throw httpError(400, 'edad_no_valida');
    if (edad !== null && edad < EDAD_CONSENTIMIENTO && (tipo === 'aceptacion' || tipo === 'consentimiento') && body.tutorConfirmado !== true) {
      throw httpError(400, 'requiere_tutor_legal');
    }
    const registro = {
      id: nuevoId('acc_'), deviceId: disp.id, documentoId: doc.id, version: version.version, hash: version.hash,
      tipo, fecha: ahora(), ambito: 'dispositivo', estado: 'vigente',
      usuarioRef: body.usuarioRef ? sha256(String(body.usuarioRef)).slice(0, 24) : null,
      tutorConfirmado: body.tutorConfirmado === true
    };
    d.aceptaciones.push(registro);
    disp.ultimoContacto = ahora();
    return { ok: true, id: registro.id };
  });
});

// Busca la ruta para método y ruta (p. ej. '/api/admin/resumen'); devuelve fn y parámetros
function buscar(metodo, pathname) {
  for (const r of RUTAS) {
    if (r.metodo !== metodo) continue;
    const m = pathname.match(r.re);
    if (m) {
      return { fn: r.fn, params: Object.fromEntries(r.claves.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
    }
  }
  return null;
}

module.exports = { buscar, EDAD_CONSENTIMIENTO };
