/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Progreso local (niveles por puntos verdes)
   Igual que la app: Nivel = floor(verdes / 50) + 1, con barra de
   progreso "X / 50 para el siguiente nivel". Se guarda en localStorage
   para que el progreso se mantenga entre visitas (como en la app).
   ═══════════════════════════════════════════════════════════════════ */
window.PJProgreso = {
  KEY: 'pj_progreso_web',

  leer: function () {
    try {
      const p = JSON.parse(localStorage.getItem(this.KEY) || '{}');
      return {
        verdes: Number(p.verdes) || 0,
        rojos: Number(p.rojos) || 0,
        jugadas: Number(p.jugadas) || 0
      };
    } catch (e) {
      return { verdes: 0, rojos: 0, jugadas: 0 };
    }
  },

  guardar: function (p) {
    try { localStorage.setItem(this.KEY, JSON.stringify(p)); } catch (e) { /* sin almacenamiento */ }
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
      nivel: nivel,
      enNivel: enNivel,
      paraSiguiente: paraSiguiente,
      pct: enNivel / 50
    };
  }
};
