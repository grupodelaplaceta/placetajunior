'use strict';
// Rutas de centros. Cada una valida su método y su identidad; el despachador está en api/centros.js
const crypto = require('node:crypto');
const { exigirUsuario, exigirRSP, membresia } = require('../auth.js');
const { eq, select, insert, update, rpc, auditar } = require('../supabase.js');
const { httpError, envolver, metodoNoPermitido } = require('../errores.js');
const { configPublica } = require('../config.js');
const { validarSolicitud, resumenSolicitud } = require('./validacion.js');
const estadoEducacion = require('../educacion/estado.js');
const politica = require('../educacion/politica.js');
const pin = require('../educacion/pin.js');

async function centroAdministrador(req, orgId) {
  const usuario = await exigirUsuario(req);
  if (!/^[0-9a-f-]{36}$/i.test(String(orgId || ''))) throw httpError(404, 'no_encontrado');
  const [centro] = await select('PJ27_organizaciones', `id=${eq(orgId)}`);
  if (!centro) throw httpError(404, 'no_encontrado');
  let miembro = await membresia(orgId, usuario.id);
  if (!miembro) {
    const [solicitudPropia] = await select('PJ27_solicitudes', `id=${eq(centro.solicitud_id)}&user_id=${eq(usuario.id)}&estado=eq.aprobada`);
    if (solicitudPropia) miembro = await asegurarMiembroPropietario(centro, usuario);
  }
  if (miembro && miembro.rol !== 'administrador') {
    const [solicitudPropia] = await select('PJ27_solicitudes', `id=${eq(centro.solicitud_id)}&user_id=${eq(usuario.id)}&estado=eq.aprobada`);
    if (solicitudPropia) miembro = await asegurarMiembroPropietario(centro, usuario);
  }
  if (!miembro || miembro.rol !== 'administrador') throw httpError(403, 'no_autorizado');
  if (centro.estado !== 'activo') throw httpError(403, 'centro_no_activo');
  return { usuario, centro };
}

function asegurarOrganizacionEducacion(datos, centro) {
  let org = datos.orgs.find((x) => x.codigoCentro === centro.codigo_centro);
  if (!org) {
    const fecha = new Date().toISOString();
    org = {
      id: `org_${crypto.randomBytes(6).toString('hex')}`,
      nombre: centro.nombre,
      codigoCentro: centro.codigo_centro,
      creadaEn: fecha,
      revision: 1,
      config: politica.configDefecto(),
      ultimoCambio: { tipo: 'tecnico', fecha },
      historial: []
    };
    datos.orgs.push(org);
  }
  return org;
}

async function obtenerOrganizacionEducacion(centro) {
  let resultado;
  await estadoEducacion.transaccion(async (datos) => {
    resultado = asegurarOrganizacionEducacion(datos, centro);
    return resultado;
  });
  return resultado;
}

function vistaConfiguracion(config) {
  const validada = politica.validar(config);
  const registro = validada.seguridad.pinApagado;
  return {
    ...validada,
    seguridad: { pinDefinido: !!registro, tipoPin: registro ? registro.tipo : null }
  };
}

function pinResultante(actual, intencion) {
  if (intencion.quitarPin === true) return null;
  if (intencion.pinNuevo !== undefined && intencion.pinNuevo !== '') {
    if (!pin.validarPin(intencion.pinNuevo)) throw httpError(400, 'pin_no_valido');
    return pin.crearRegistroPin(intencion.pinNuevo);
  }
  return actual.seguridad && actual.seguridad.pinApagado ? actual.seguridad.pinApagado : null;
}

async function centroDeSolicitudAprobada(solicitud) {
  const existente = await select('PJ27_organizaciones', `solicitud_id=${eq(solicitud.id)}`);
  if (existente.length) return existente[0];
  const caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  for (let intento = 0; intento < 100; intento++) {
    const bytes = crypto.randomBytes(8);
    let codigo = '';
    for (const byte of bytes) codigo += caracteres[byte % caracteres.length];
    codigo = `PJ-${codigo.slice(0, 4)}-${codigo.slice(4, 8)}`;
    try {
      const [creada] = await insert('PJ27_organizaciones', [{
        solicitud_id: solicitud.id,
        nombre: solicitud.nombre_centro,
        codigo_centro: codigo
      }]);
      return creada;
    } catch (e) {
      if (e.status !== 409) throw e;
      const porSolicitud = await select('PJ27_organizaciones', `solicitud_id=${eq(solicitud.id)}`);
      if (porSolicitud.length) return porSolicitud[0];
    }
  }
  throw httpError(500, 'no_se_pudo_generar_codigo');
}

async function asegurarMiembroPropietario(centro, usuario) {
  let miembro = await membresia(centro.id, usuario.id);
  if (!miembro) {
    try {
      await insert('PJ27_miembros', [{ org_id: centro.id, user_id: usuario.id, email: usuario.email, rol: 'administrador' }]);
    } catch (e) {
      if (e.status !== 409) throw e;
    }
    miembro = await membresia(centro.id, usuario.id);
  }
  if (miembro && miembro.rol !== 'administrador') {
    await update('PJ27_miembros', `org_id=${eq(centro.id)}&user_id=${eq(usuario.id)}`, { rol: 'administrador' });
    miembro = { ...miembro, rol: 'administrador' };
  }
  return miembro;
}

const config = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).json(configPublica());
});

// Lo que ve una persona al entrar: sus solicitudes y los centros de los que es titular o admin
const mi = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  res.setHeader('Cache-Control', 'no-store');
  const u = await exigirUsuario(req);
  const solicitudes = await select('PJ27_solicitudes', `user_id=${eq(u.id)}`, '&order=creada_en.desc');
  const miembros = await select('PJ27_miembros', `user_id=${eq(u.id)}`);
  const porId = new Map();
  if (miembros.length) {
    const ids = miembros.map((m) => m.org_id).join(',');
    const orgs = await select('PJ27_organizaciones', `id=in.(${ids})`);
    orgs.forEach((o) => {
      const m = miembros.find((x) => x.org_id === o.id);
      porId.set(o.id, { id: o.id, nombre: o.nombre, codigoCentro: o.codigo_centro, estado: o.estado, rol: m.rol });
    });
  }
  const aprobadas = solicitudes.filter((s) => s.estado === 'aprobada' && s.tipo_centro !== 'docente');
  if (aprobadas.length) {
    for (const solicitud of aprobadas) {
      const o = await centroDeSolicitudAprobada(solicitud);
      await asegurarMiembroPropietario(o, u);
      porId.set(o.id, { id: o.id, nombre: o.nombre, codigoCentro: o.codigo_centro, estado: o.estado, rol: 'administrador' });
    }
  }
  const organizaciones = [...porId.values()];
  const docenteAprobado = solicitudes.some((solicitud) => solicitud.tipo_centro === 'docente' && solicitud.estado === 'aprobada');
  res.status(200).json({ nombre: u.nombre, email: u.email, docenteAprobado, solicitudes: solicitudes.map(resumenSolicitud), organizaciones });
});

// GET: solicitudes de la persona. POST: nueva solicitud (queda pendiente de revisión por RSP)
const solicitud = envolver(async (req, res) => {
  if (req.method === 'GET') {
    const u = await exigirUsuario(req);
    const filas = await select('PJ27_solicitudes', `user_id=${eq(u.id)}`, '&order=creada_en.desc');
    return res.status(200).json({ solicitudes: filas.map(resumenSolicitud) });
  }
  if (req.method !== 'POST') return metodoNoPermitido(res, 'GET, POST');

  const u = await exigirUsuario(req);
  const { datos, aceptaciones } = validarSolicitud(req.body);
  const pendientes = await select('PJ27_solicitudes', `user_id=${eq(u.id)}&estado=eq.pendiente`);
  if (pendientes.length) throw httpError(409, 'solicitud_pendiente');

  const [fila] = await insert('PJ27_solicitudes', [{ ...datos, user_id: u.id, email: u.email }]);
  await insert('PJ27_aceptaciones_documentos', aceptaciones.map((a) => ({ ...a, solicitud_id: fila.id, user_id: u.id })));
  await auditar(u.email, 'solicitud_creada', { solicitud: fila.id });
  res.status(201).json({ id: fila.id, estado: fila.estado });
});

// Panel del centro: solo para quienes son miembros de esa organización
const org = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  const u = await exigirUsuario(req);
  const orgId = String(req.query.orgId || '');
  if (!/^[0-9a-f-]{36}$/i.test(orgId)) throw httpError(404, 'no_encontrado');
  const m = await membresia(orgId, u.id);
  if (!m) throw httpError(403, 'no_autorizado');

  const [o] = await select('PJ27_organizaciones', `id=${eq(orgId)}`);
  if (!o) throw httpError(404, 'no_encontrado');
  const miembros = await select('PJ27_miembros', `org_id=${eq(orgId)}`);
  const [sol] = await select('PJ27_solicitudes', `id=${eq(o.solicitud_id)}`);

  res.status(200).json({
    organizacion: { id: o.id, nombre: o.nombre, codigoCentro: o.codigo_centro, estado: o.estado, creadaEn: o.creada_en },
    tuRol: m.rol,
    miembros: miembros.map((x) => ({ email: x.email, rol: x.rol, desde: x.creado_en })),
    solicitud: sol ? resumenSolicitud(sol) : null
  });
});

// Gestión de equipos y política por parte de la cuenta administradora del centro.
const dispositivos = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  const { centro } = await centroAdministrador(req, req.query.orgId);
  const orgCentro = await obtenerOrganizacionEducacion(centro);
  const datos = await estadoEducacion.leer();
  const org = datos.orgs.find((x) => x.id === orgCentro.id);
  return res.status(200).json({
    codigoCentro: centro.codigo_centro,
    revision: org.revision,
    config: vistaConfiguracion(org.config),
    dispositivos: datos.devices.filter((x) => x.orgId === org.id).map((x) => ({
      id: x.id, nombre: x.nombre, plataforma: x.plataforma || null, estado: x.estado, appVersion: x.appVersion,
      vinculadoEn: x.vinculadoEn, ultimoContacto: x.ultimoContacto, revocadoEn: x.revocadoEn || null
    }))
  });
});

const configDispositivos = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  const { centro } = await centroAdministrador(req, req.query.orgId);
  const org = await obtenerOrganizacionEducacion(centro);
  return res.status(200).json({ config: vistaConfiguracion(org.config), revision: org.revision });
});

const guardarConfigDispositivos = envolver(async (req, res) => {
  if (req.method !== 'PUT') return metodoNoPermitido(res, 'PUT');
  const { centro, usuario } = await centroAdministrador(req, req.query.orgId);
  const resultado = await estadoEducacion.transaccion(async (datos) => {
    const org = asegurarOrganizacionEducacion(datos, centro);
    const anterior = politica.validar(org.config);
    const cuerpoConfig = req.body && req.body.config || {};
    const nueva = politica.validar({
      ...anterior,
      ...cuerpoConfig,
      seguridad: { pinApagado: pinResultante(anterior, cuerpoConfig.seguridad || {}) }
    });
    const tipoCambio = politica.clasificar(anterior, nueva);
    if (JSON.stringify(anterior) === JSON.stringify(nueva)) return { sinCambios: true, revision: org.revision };
    org.historial = org.historial || [];
    org.historial.push({ revision: org.revision, fecha: new Date().toISOString(), tipoCambio, anterior });
    org.config = nueva;
    org.revision += 1;
    org.ultimoCambio = { tipo: tipoCambio, fecha: new Date().toISOString() };
    datos.auditoria.push({ fecha: new Date().toISOString(), actor: usuario.email, accion: 'configuracion_cambiada', detalle: { orgId: org.id, tipo: tipoCambio, revision: org.revision } });
    return { revision: org.revision, tipoCambio };
  });
  return res.status(200).json(resultado);
});

const desvincularDispositivo = envolver(async (req, res) => {
  if (req.method !== 'POST') return metodoNoPermitido(res, 'POST');
  const { centro, usuario } = await centroAdministrador(req, req.query.orgId);
  const dispositivoId = String(req.query.deviceId || '');
  await estadoEducacion.transaccion(async (datos) => {
    const org = asegurarOrganizacionEducacion(datos, centro);
    const dispositivo = datos.devices.find((x) => x.id === dispositivoId && x.orgId === org.id);
    if (!dispositivo) throw httpError(404, 'no_encontrado');
    dispositivo.estado = 'desvinculado';
    dispositivo.secreto = null;
    dispositivo.revocadoEn = new Date().toISOString();
    datos.auditoria.push({ fecha: new Date().toISOString(), actor: usuario.email, accion: 'dispositivo_desvinculado', detalle: { id: dispositivo.id, orgId: org.id } });
    return { ok: true };
  });
  return res.status(200).json({ ok: true });
});

const crearActividad = envolver(async (req, res) => {
  if (req.method !== 'POST') return metodoNoPermitido(res, 'POST');
  const usuario = await exigirUsuario(req);
  const body = req.body || {};
  const titulo = String(body.titulo || '').trim();
  const descripcion = String(body.descripcion || '').trim();
  const contenido = body.contenido;
  if (titulo.length < 3 || titulo.length > 160) throw httpError(400, 'titulo_no_valido');
  if (descripcion.length < 10 || descripcion.length > 2000) throw httpError(400, 'descripcion_no_valida');
  if (!contenido || typeof contenido !== 'object' || !Array.isArray(contenido.bloques) || !contenido.bloques.length) {
    throw httpError(400, 'contenido_no_valido');
  }
  if (JSON.stringify(body).length > 256 * 1024) throw httpError(413, 'demasiado_grande');

  let autor;
  let payload;
  if (body.tipoAutor === 'centro') {
    const { centro } = await centroAdministrador(req, body.orgId);
    autor = centro.nombre;
    payload = {
      tipo_titular: 'centro', dip: null, eip: null,
      codigo_centro: centro.codigo_centro, nombre_entidad: autor, nombre_autor: null
    };
  } else if (body.tipoAutor === 'docente') {
    const aprobadas = await select('PJ27_solicitudes', `user_id=${eq(usuario.id)}&tipo_centro=eq.docente&estado=eq.aprobada`);
    if (!aprobadas.length) throw httpError(403, 'docente_no_aprobado');
    autor = usuario.nombre || usuario.email;
    payload = { tipo_titular: 'profesor', dip: null, eip: null, nombre_entidad: null, nombre_autor: autor };
  } else {
    throw httpError(400, 'tipo_autor_no_valido');
  }

  const actividad = {
    ...payload,
    titulo, descripcion,
    categoria: String(body.categoria || 'General').slice(0, 80),
    tipo: 'otro',
    edad_recomendada: String(body.edad_recomendada || '6-12').slice(0, 20),
    dificultad: ['facil', 'media', 'dificil'].includes(body.dificultad) ? body.dificultad : 'media',
    tiempo_estimado: Math.max(1, Math.min(240, Number(body.tiempo_estimado) || 10)),
    num_preguntas: Math.max(0, Number(body.num_preguntas) || 0),
    num_fases: contenido.bloques.length,
    precio_licencia: 0, precio_intento: 0, recompensa: 0, subvencionada: false,
    contenido
  };
  const endpoint = process.env.PJ_ACTIVIDADES_API_URL || 'https://rsp.laplaceta.org/api/junior/actividades';
  const respuesta = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(actividad)
  });
  const resultado = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok || !resultado.success) {
    return res.status(respuesta.status || 502).json(resultado.error || resultado.mensaje
      ? resultado
      : { success: false, error: 'revision_no_disponible' });
  }
  await auditar(usuario.email, 'actividad_enviada_revision', { titulo, autor, tipoAutor: body.tipoAutor });
  return res.status(200).json({ ...resultado, autor });
});

// Cola de revisión de RSP (solo personal autorizado)
const rspLista = envolver(async (req, res) => {
  if (req.method !== 'GET') return metodoNoPermitido(res, 'GET');
  await exigirRSP(req);
  const estado = ['pendiente', 'aprobada', 'rechazada'].includes(req.query.estado) ? req.query.estado : 'pendiente';
  const filas = await select('PJ27_solicitudes', `estado=${eq(estado)}`, '&order=creada_en.asc');
  res.status(200).json({
    solicitudes: filas.map((f) => ({
      id: f.id, nombreCentro: f.nombre_centro, tipoCentro: f.tipo_centro, ciudad: f.ciudad,
      codigoCentroOficial: f.codigo_centro_oficial, responsable: f.responsable_nombre, cargo: f.responsable_cargo,
      telefono: f.telefono, emailContacto: f.email_contacto, cuentaSolicitante: f.email,
      estado: f.estado, creadaEn: f.creada_en, motivoRechazo: f.motivo_rechazo
    }))
  });
});

// Decisión de RSP: aprobar (crea el centro y su código) o rechazar con motivo
const rspDecision = envolver(async (req, res) => {
  if (req.method !== 'POST') return metodoNoPermitido(res, 'POST');
  const rsp = await exigirRSP(req);
  const id = String(req.query.id || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw httpError(404, 'solicitud_no_encontrada');
  const accion = req.body && req.body.accion;

  if (accion === 'aprobar') {
    const r = await rpc('PJ27_aprobar_solicitud', { p_solicitud: id, p_revisor: rsp.email });
    await auditar(rsp.email, 'solicitud_aprobada', { solicitud: id, organizacion: r.organizacion_id });
    return res.status(200).json({ estado: 'aprobada', codigoCentro: r.codigo_centro, organizacionId: r.organizacion_id });
  }

  if (accion === 'rechazar') {
    const motivo = String((req.body && req.body.motivo) || '').trim();
    if (motivo.length < 10 || motivo.length > 500) throw httpError(400, 'campo_invalido', { campo: 'motivo' });
    const filas = await update('PJ27_solicitudes', `id=${eq(id)}&estado=eq.pendiente`,
      { estado: 'rechazada', motivo_rechazo: motivo, revisada_en: new Date().toISOString(), revisada_por: rsp.email });
    if (!filas.length) throw httpError(409, 'solicitud_no_pendiente');
    await auditar(rsp.email, 'solicitud_rechazada', { solicitud: id });
    return res.status(200).json({ estado: 'rechazada' });
  }

  throw httpError(400, 'accion_no_valida');
});

module.exports = { config, mi, solicitud, org, dispositivos, configDispositivos, guardarConfigDispositivos, desvincularDispositivo, crearActividad, rspLista, rspDecision };
