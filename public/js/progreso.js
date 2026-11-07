/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Progreso local (niveles por puntos verdes)
   Igual que la app: Nivel = floor(verdes / 50) + 1, con barra de
   progreso "X / 50 para el siguiente nivel". Se guarda en localStorage
   para que el progreso se mantenga entre visitas (como en la app).
   ═══════════════════════════════════════════════════════════════════ */
function contextoIO() {
  try {
    const host = window.parent;
    if (host === window || !host.PJPerfiles) return null;
    return { host, perfilId: host.PJPerfiles.activo(), modo: host.PJModoProgreso || 'local' };
  } catch (e) { return null; }
}

function progresoVacio() {
  return { verdes: 0, rojos: 0, jugadas: 0, xp: 0, monedas: 0, victorias: 0, estadisticas: {}, medallas: [], habilidadesDominadas: [] };
}

const progresoTemporal = new Map();
const perfilesCache = new Map();
const cargasPerfil = new Map();
const guardadosPerfil = new Map();

function clavePerfil(contexto) {
  return `${contexto.perfilId}:${contexto.modo}`;
}

function estadoNormalizado(p) {
  const base = progresoVacio();
  const entero = (valor) => Math.floor(Math.max(0, Number(valor) || 0));
  const porTipo = p?.estadisticas?.porTipo;
  return {
    ...base,
    ...p,
    verdes: entero(p?.verdes),
    rojos: entero(p?.rojos),
    jugadas: entero(p?.jugadas),
    xp: entero(p?.xp),
    monedas: entero(p?.monedas),
    victorias: entero(p?.victorias),
    estadisticas: {
      porTipo: porTipo && typeof porTipo === 'object'
        ? Object.fromEntries(Object.entries(porTipo).slice(0, 50).map(([id, r]) => [id, {
          victorias: entero(r?.victorias), xp: entero(r?.xp), monedas: entero(r?.monedas)
        }]))
        : {}
    },
    medallas: Array.isArray(p?.medallas) ? p.medallas : [],
    habilidadesDominadas: Array.isArray(p?.habilidadesDominadas) ? p.habilidadesDominadas : []
  };
}

function informarError(error) {
  console.error('No se pudo sincronizar el progreso del perfil.', error);
  try { window.dispatchEvent(new CustomEvent('pj:progreso-error', { detail: { error: error?.message || 'error' } })); } catch (e) { /* evento no disponible */ }
}

function cargarPerfil(contexto) {
  const clave = clavePerfil(contexto);
  if (perfilesCache.has(clave)) return Promise.resolve(perfilesCache.get(clave));
  if (cargasPerfil.has(clave)) return cargasPerfil.get(clave);
  const carga = Promise.resolve().then(async () => {
    const politica = await contexto.host.PJVinculo.leerPolitica();
    if (!contexto.host.PJPerfiles.progresoPermitido(politica).permitido) {
      perfilesCache.set(clave, { politica, datos: null, permitido: false });
    } else {
      const datos = await contexto.host.PJPerfiles.leerProgreso(contexto.perfilId, politica);
      perfilesCache.set(clave, { politica, datos: datos || {}, permitido: true });
    }
    return perfilesCache.get(clave);
  }).then((registro) => {
    try { window.dispatchEvent(new CustomEvent('pj:progreso')); } catch (e) { /* evento no disponible */ }
    return registro;
  }).catch((error) => {
    informarError(error);
    throw error;
  }).finally(() => cargasPerfil.delete(clave));
  cargasPerfil.set(clave, carga);
  return carga;
}

function guardarPerfil(contexto, progreso) {
  const clave = clavePerfil(contexto);
  const anterior = guardadosPerfil.get(clave) || Promise.resolve();
  const guardado = anterior.catch(() => {}).then(async () => {
    const registro = await cargarPerfil(contexto);
    if (!registro.permitido) return;
    const politica = await contexto.host.PJVinculo.leerPolitica();
    if (!contexto.host.PJPerfiles.progresoPermitido(politica).permitido) return;
    const datos = { ...(registro.datos || {}), resumen: estadoNormalizado(progreso) };
    const resultado = await contexto.host.PJPerfiles.guardarProgreso(contexto.perfilId, datos, politica);
    if (resultado?.guardado) perfilesCache.set(clave, { politica, datos, permitido: true });
  });
  guardadosPerfil.set(clave, guardado);
  guardado.catch(informarError).finally(() => {
    if (guardadosPerfil.get(clave) === guardado) guardadosPerfil.delete(clave);
  });
}

window.PJProgreso = {
  KEY: 'pj_progreso_web',

  leer: function () {
    const contexto = contextoIO();
    if (contexto && !contexto.perfilId) return progresoVacio();
    if (contexto?.modo === 'ninguno') return progresoVacio();
    if (contexto) {
      const registro = perfilesCache.get(clavePerfil(contexto));
      if (!registro) {
        cargarPerfil(contexto).catch(() => {});
        return estadoNormalizado(progresoTemporal.get(clavePerfil(contexto)));
      }
      if (!registro.permitido) return progresoVacio();
      const datos = registro.datos || {};
      return estadoNormalizado({ ...(datos.resumen || {}), ...(progresoTemporal.get(clavePerfil(contexto)) || {}) });
    }
    try {
      return estadoNormalizado(JSON.parse(localStorage.getItem(this.KEY) || '{}'));
    } catch (e) {
      return progresoVacio();
    }
  },

  guardar: function (p) {
    const contexto = contextoIO();
    if (contexto?.modo === 'ninguno' || (contexto && !contexto.perfilId)) return;
    if (contexto) {
      const clave = clavePerfil(contexto);
      const normalizado = estadoNormalizado(p);
      progresoTemporal.set(clave, normalizado);
      guardarPerfil(contexto, normalizado);
      return;
    }
    try {
      localStorage.setItem(this.KEY, JSON.stringify(p));
    } catch (e) { /* sin almacenamiento */ }
  },

  // Fórmula de nivel de la app: cada 50 puntos verdes se sube de nivel
  nivelDeVerdes: function (verdes) { return Math.floor((Number(verdes) || 0) / 50) + 1; },

  // Suma los puntos de una partida terminada
  sumar: function (verdes, rojos) {
    const p = this.leer();
    p.verdes += Number(verdes) || 0;
    p.rojos += Number(rojos) || 0;
    p.jugadas += 1;
    this.guardar(p);
    return p;
  },

  recompensar: function (recompensa, tipo) {
    const p = this.leer();
    const xp = Math.max(0, Number(recompensa && recompensa.xp) || 0);
    const monedas = Math.max(0, Number(recompensa && recompensa.coins) || 0);
    const clave = String(tipo || 'actividad');
    p.xp += xp;
    p.monedas += monedas;
    p.victorias += 1;
    p.estadisticas.porTipo = p.estadisticas.porTipo || {};
    const registro = p.estadisticas.porTipo[clave] || { victorias: 0, xp: 0, monedas: 0 };
    registro.victorias += 1;
    registro.xp += xp;
    registro.monedas += monedas;
    p.estadisticas.porTipo[clave] = registro;
    p.estadisticas.ultimaVictoria = { tipo: clave, fecha: Date.now() };
    const medallas = [[1, 'Primera victoria'], [5, 'Cinco victorias'], [10, 'Diez victorias']];
    medallas.forEach(([umbral, nombre]) => { if (p.victorias >= umbral && !p.medallas.includes(nombre)) p.medallas.push(nombre); });
    if (registro.victorias >= 5 && !p.habilidadesDominadas.includes(clave)) p.habilidadesDominadas.push(clave);
    this.guardar(p);
    return p;
  },

  // Estado completo: nivel actual y progreso hacia el siguiente
  estado: function () {
    const p = this.leer();
    const nivel = this.nivelDeVerdes(p.verdes);
    const enNivel = p.verdes % 50;
    const paraSiguiente = p.verdes > 0 && enNivel === 0 ? 50 : 50 - enNivel;
    return {
      verdes: p.verdes,
      rojos: p.rojos,
      jugadas: p.jugadas,
      xp: p.xp,
      nivelXP: Math.floor(p.xp / 100) + 1,
      xpEnNivel: p.xp % 100,
      xpParaSiguiente: p.xp > 0 && p.xp % 100 === 0 ? 100 : 100 - (p.xp % 100),
      xpPct: (p.xp % 100) / 100,
      monedas: p.monedas,
      victorias: p.victorias,
      estadisticas: p.estadisticas,
      medallas: p.medallas,
      habilidadesDominadas: p.habilidadesDominadas,
      nivel: nivel,
      enNivel: enNivel,
      paraSiguiente: paraSiguiente,
      pct: enNivel / 50
    };
  }
};
