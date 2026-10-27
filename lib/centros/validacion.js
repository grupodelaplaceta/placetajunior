'use strict';
const { httpError } = require('../errores.js');

// Versiones vigentes de los documentos que se aceptan al solicitar un centro.
// Cambiarlas obliga a volver a aceptar: la solicitud debe citar la versión actual.
const DOCUMENTOS = { condiciones: '2026-06-01', privacidad: '2026-06-01' };
const TIPOS_CENTRO = ['infantil', 'primaria', 'infantil_primaria', 'secundaria', 'otro', 'docente'];

function campo(nombre) {
  return httpError(400, 'campo_invalido', { campo: nombre });
}

function texto(v, nombre, min, max) {
  const s = typeof v === 'string' ? v.trim() : '';
  if (s.length < min || s.length > max) throw campo(nombre);
  return s;
}

function validarSolicitud(b) {
  if (!b || typeof b !== 'object') throw httpError(400, 'cuerpo_no_valido');
  const email = texto(b.emailContacto, 'emailContacto', 6, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw campo('emailContacto');
  const telefono = texto(b.telefono, 'telefono', 6, 20);
  if (!/^\+?[0-9 ]{6,20}$/.test(telefono)) throw campo('telefono');
  if (!TIPOS_CENTRO.includes(b.tipoCentro)) throw campo('tipoCentro');

  const datos = {
    nombre_centro: texto(b.nombreCentro, 'nombreCentro', 3, 160),
    tipo_centro: b.tipoCentro,
    ciudad: texto(b.ciudad, 'ciudad', 2, 80),
    codigo_centro_oficial: b.codigoCentroOficial ? texto(b.codigoCentroOficial, 'codigoCentroOficial', 3, 20) : null,
    responsable_nombre: texto(b.responsableNombre, 'responsableNombre', 2, 120),
    responsable_cargo: texto(b.responsableCargo, 'responsableCargo', 2, 80),
    telefono,
    email_contacto: email
  };

  // Aceptaciones: cada documento debe aceptarse en su versión vigente
  const acept = b.aceptaciones || {};
  for (const [doc, version] of Object.entries(DOCUMENTOS)) {
    if (acept[doc] !== version) {
      throw httpError(409, 'version_documentos_actualizada', { campo: doc });
    }
  }
  if (b.declaraVeracidad !== true) throw campo('declaraVeracidad');
  return { datos, aceptaciones: Object.keys(DOCUMENTOS).map((d) => ({ documento: d, version: DOCUMENTOS[d] })) };
}

function resumenSolicitud(f) {
  return {
    id: f.id,
    nombreCentro: f.nombre_centro,
    estado: f.estado,
    motivoRechazo: f.motivo_rechazo || null,
    creadaEn: f.creada_en,
    revisadaEn: f.revisada_en || null
  };
}

module.exports = { DOCUMENTOS, TIPOS_CENTRO, validarSolicitud, resumenSolicitud };
