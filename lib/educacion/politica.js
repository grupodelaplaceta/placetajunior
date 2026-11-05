'use strict';
/* Configuración de la organización: valores por defecto, validación y
   clasificación de cambios (técnico, organizativo o normativo). */

const { registroPinValido } = require('./pin.js');

const ETAPAS = ['infantil', 'primaria'];
const VENTANAS = ['maximizadas', 'libres'];
const MAYUSCULAS = ['mixtas', 'mayusculas', 'minusculas'];
const IDIOMAS = ['es', 'ca', 'en'];
const ESTADOS_JUEGO = ['visible', 'oculto', 'desactivado'];
const IDENTIFICACION = ['anonimo', 'alias', 'nominal'];
const PROGRESO = ['local', 'centro', 'ninguno'];

// Secciones que implican información o aceptación de las familias si cambian
const NORMATIVAS = ['identificacion', 'progreso', 'privacidad'];
// Secciones que afectan al funcionamiento, sin cambiar la normativa
const ORGANIZATIVAS = ['actividades', 'juegos', 'herramientas', 'restricciones', 'contenido', 'interfaz', 'seguridad'];

function configDefecto() {
  return {
    actividades: { ocultas: [] },
    juegos: { defecto: 'visible', estados: {} },
    herramientas: { actividades: true, juegos: true, biblioteca: true, ajustes: true },
    restricciones: { tiempoMaxMinutos: null, permitirGuardarBiblioteca: true },
    contenido: { etapas: ['infantil', 'primaria'] },
    identificacion: 'anonimo',
    progreso: 'local',
    privacidad: { almacenamientoLocal: true, transmisionCentral: false, conservacionDias: 365 },
    interfaz: { ventanas: 'maximizadas', mayusculas: 'mixtas', idioma: 'es', politicaContenido: 'disponible', excepcionesIdioma: [], nombreNavegador: 'Google' },
    seguridad: { pinApagado: null }
  };
}

// Devuelve 'tecnico' (sin cambios de contenido), 'organizativo' o 'normativo'
function clasificar(anterior, nueva) {
  const cambio = (s) => JSON.stringify(anterior[s]) !== JSON.stringify(nueva[s]);
  if (NORMATIVAS.some(cambio)) return 'normativo';
  if (ORGANIZATIVAS.some(cambio)) return 'organizativo';
  return 'tecnico';
}

function error(msg) {
  const e = new Error(msg);
  e.status = 400;
  return e;
}

function esEntero(v, min, max) {
  return Number.isInteger(v) && v >= min && v <= max;
}

// Valida la configuración completa y devuelve una copia limpia
function validar(c) {
  if (!c || typeof c !== 'object') throw error('configuracion_invalida');
  const d = configDefecto();

  const ocultas = c.actividades?.ocultas ?? d.actividades.ocultas;
  if (!Array.isArray(ocultas) || ocultas.length > 2000 || ocultas.some((x) => typeof x !== 'string' || x.length > 64)) {
    throw error('actividades_ocultas_invalidas');
  }

  const juegos = { ...d.juegos, ...(c.juegos ?? {}) };
  if (!ESTADOS_JUEGO.includes(juegos.defecto)) throw error('estado_juego_defecto_invalido');
  const estados = juegos.estados ?? {};
  for (const [id, est] of Object.entries(estados)) {
    if (id.length > 64 || !ESTADOS_JUEGO.includes(est)) throw error('estado_juego_invalido');
  }

  const herr = { ...d.herramientas, ...(c.herramientas ?? {}) };
  for (const k of Object.keys(herr)) if (typeof herr[k] !== 'boolean') throw error('herramienta_invalida');

  const r = { ...d.restricciones, ...(c.restricciones ?? {}) };
  if (r.tiempoMaxMinutos !== null && !esEntero(r.tiempoMaxMinutos, 5, 240)) throw error('tiempo_maximo_invalido');
  if (typeof r.permitirGuardarBiblioteca !== 'boolean') throw error('restriccion_invalida');

  const etapas = c.contenido?.etapas ?? d.contenido.etapas;
  if (!Array.isArray(etapas) || etapas.length === 0 || etapas.some((e) => !ETAPAS.includes(e))) throw error('etapas_invalidas');

  const identificacion = c.identificacion ?? d.identificacion;
  const progreso = c.progreso ?? d.progreso;
  if (!IDENTIFICACION.includes(identificacion)) throw error('identificacion_invalida');
  if (!PROGRESO.includes(progreso)) throw error('progreso_invalido');

  const p = { ...d.privacidad, ...(c.privacidad ?? {}) };
  if (typeof p.almacenamientoLocal !== 'boolean' || typeof p.transmisionCentral !== 'boolean') throw error('privacidad_invalida');
  if (!esEntero(p.conservacionDias, 1, 3650)) throw error('conservacion_invalida');

  const interfaz = { ...d.interfaz, ...(c.interfaz ?? {}) };
  if (!VENTANAS.includes(interfaz.ventanas)) throw error('ventanas_invalidas');
  if (!MAYUSCULAS.includes(interfaz.mayusculas)) throw error('mayusculas_invalidas');
  if (!IDIOMAS.includes(interfaz.idioma)) throw error('idioma_invalido');
  const politicaContenido = interfaz.politicaContenido ?? d.interfaz.politicaContenido;
  if (!['disponible', 'excepciones', 'estricto'].includes(politicaContenido)) throw error('politica_contenido_invalida');
  const excepcionesIdioma = interfaz.excepcionesIdioma ?? d.interfaz.excepcionesIdioma;
  if (!Array.isArray(excepcionesIdioma) || excepcionesIdioma.length > 500 || excepcionesIdioma.some((x) => typeof x !== 'string' || x.length > 64)) throw error('excepciones_idioma_invalidas');
  const nombreNavegador = typeof interfaz.nombreNavegador === 'string' ? interfaz.nombreNavegador.trim() : d.interfaz.nombreNavegador;
  if (!nombreNavegador || nombreNavegador.length > 32) throw error('nombre_navegador_invalido');

  const seguridad = { ...d.seguridad, ...(c.seguridad ?? {}) };
  if (seguridad.pinApagado !== null && !registroPinValido(seguridad.pinApagado)) throw error('pin_no_valido');

  return {
    actividades: { ocultas: [...new Set(ocultas)] },
    juegos: { defecto: juegos.defecto, estados },
    herramientas: herr,
    restricciones: r,
    contenido: { etapas: [...new Set(etapas)] },
    identificacion,
    progreso,
    privacidad: p,
    interfaz: { ventanas: interfaz.ventanas, mayusculas: interfaz.mayusculas, idioma: interfaz.idioma, politicaContenido, excepcionesIdioma: [...new Set(excepcionesIdioma)], nombreNavegador },
    seguridad: { pinApagado: seguridad.pinApagado }
  };
}

module.exports = { configDefecto, clasificar, validar, ETAPAS, ESTADOS_JUEGO, IDENTIFICACION, PROGRESO, NORMATIVAS, ORGANIZATIVAS, VENTANAS, MAYUSCULAS, IDIOMAS };
