/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Partidas guardadas LOCALMENTE (retomar)
   Guarda el estado de cada partida en localStorage (sin usuario):
   pantalla actual, respuestas, programa de code, puntuación.
   Así se puede salir y retomar donde se dejó, en el mismo navegador.
   ═══════════════════════════════════════════════════════════════════ */
window.PJPartidas = {
  KEY: 'pj_partidas_v1',

  leer: function () {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || '{}');
    } catch (e) { return {}; }
  },
  guardarTodo: function (obj) {
    try { localStorage.setItem(this.KEY, JSON.stringify(obj)); } catch (e) { /* sin almacenamiento */ }
  },

  // Guarda una partida en curso
  set: function (actividadId, partida) {
    const todas = this.leer();
    todas[actividadId] = { ...partida, guardado: Date.now() };
    this.guardarTodo(todas);
  },

  // Devuelve la partida guardada de una actividad (o null)
  get: function (actividadId) {
    const todas = this.leer();
    const p = todas[actividadId];
    if (!p) return null;
    if (p.completada) return p; // para mostrar "completada" en la tarjeta
    return p;
  },

  // Marca una actividad como completada (conserva el resumen, no rejugable)
  completar: function (actividadId, resumen) {
    const todas = this.leer();
    todas[actividadId] = { ...(todas[actividadId] || {}), ...resumen, completada: true, guardado: Date.now() };
    this.guardarTodo(todas);
  },

  // Elimina la partida de una actividad
  borrar: function (actividadId) {
    const todas = this.leer();
    delete todas[actividadId];
    this.guardarTodo(todas);
  },

  // Lista de actividades con partida en curso (para badges "En curso")
  enCurso: function () {
    const todas = this.leer();
    return Object.keys(todas).filter(id => !todas[id].completada);
  },

  // Lista de actividades completadas localmente
  completadas: function () {
    const todas = this.leer();
    return Object.keys(todas).filter(id => todas[id].completada);
  },

  // ¿La actividad está en curso localmente?
  estaEnCurso: function (id) {
    const p = this.get(id);
    return !!(p && !p.completada);
  },
  // ¿La actividad está completada localmente?
  estaCompletada: function (id) {
    const p = this.get(id);
    return !!(p && p.completada);
  }
};
