/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Música ambiental (web)
   · Menú: canción de DÍA o NOCHE según la hora (7:00–21:00 día).
   · Actividades: canción según la asignatura (Coding, Animales, Mundo,
     Logicamente, Clasico).
   · Todas las canciones subidas UN SEMITONO (playbackRate = 2^(1/12)).
   · Cambios de música suaves (crossfade de ganancia).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  const SEMITONO = Math.pow(2, 1 / 12); // ≈1.0595 → +1 semitono

  const CANCIONES = {
    dia: 'sounds/Día.mp3',
    noche: 'sounds/Noche.mp3',
    coding: 'sounds/Coding.mp3',
    animales: 'sounds/Animales.mp3',
    mundo: 'sounds/Mundo.mp3',
    logicamente: 'sounds/Logicamente.mp3',
    clasico: 'sounds/Clasico.mp3'
  };

  const cache = {};       // url -> AudioBuffer
  let ctx = null;
  let fuente = null;      // AudioBufferSourceNode actual
  let ganancia = null;    // GainNode actual
  let claveActual = null; // qué canción suena
  let contextoActivo = false;
  let sonidoActivado = true; // respeta la accesibilidad (sonidos)

  function esDeDia() {
    const h = new Date().getHours();
    return h >= 7 && h < 21;
  }

  /** Mapea la categoría de una actividad a su canción. */
  function cancionParaCategoria(cat) {
    const c = String(cat || '').toLowerCase();
    if (c.includes('code') || c.includes('progra') || c.includes('inform')) return CANCIONES.coding;
    if (c.includes('natur') || c.includes('cien') || c.includes('bio') || c.includes('animal')) return CANCIONES.animales;
    if (c.includes('geo') || c.includes('hist') || c.includes('social') || c.includes('mundo')) return CANCIONES.mundo;
    if (c.includes('mate') || c.includes('lóg') || c.includes('log') || c.includes('razon')) return CANCIONES.logicamente;
    return CANCIONES.clasico;
  }

  async function cargarBuffer(url) {
    if (cache[url]) return cache[url];
    const res = await fetch(url);
    const arr = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(arr);
    cache[url] = buf;
    return buf;
  }

  /** Arranca el AudioContext en la primera interacción del usuario. */
  function asegurarCtx() {
    if (!ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        ctx = new AC();
      } catch (e) { return null; }
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }

  /** Cambia la canción con crossfade suave (2s). */
  async function cambiar(url, clave) {
    if (clave === claveActual) return;
    const c = asegurarCtx();
    if (!c || !sonidoActivado) return;
    try {
      const buf = await cargarBuffer(url);
      if (clave === claveActual) return; // ya cambió mientras se cargaba

      const nuevoGain = c.createGain();
      nuevoGain.gain.value = 0;
      nuevoGain.connect(c.destination);

      const nuevo = c.createBufferSource();
      nuevo.buffer = buf;
      nuevo.loop = true;
      nuevo.playbackRate.value = SEMITONO; // +1 semitono
      nuevo.connect(nuevoGain);
      nuevo.start();

      // Crossfade: baja la actual y sube la nueva (2s)
      const actualGain = ganancia;
      const actual = fuente;
      if (actualGain && actual) {
        actualGain.gain.cancelScheduledValues(c.currentTime);
        actualGain.gain.setValueAtTime(actualGain.gain.value, c.currentTime);
        actualGain.gain.linearRampToValueAtTime(0, c.currentTime + 2);
      }
      nuevoGain.gain.cancelScheduledValues(c.currentTime);
      nuevoGain.gain.setValueAtTime(0, c.currentTime);
      nuevoGain.gain.linearRampToValueAtTime(0.45, c.currentTime + 2);

      setTimeout(() => {
        try { if (actual) actual.stop(); } catch (e) { /* ya parado */ }
      }, 2100);

      ganancia = nuevoGain;
      fuente = nuevo;
      claveActual = clave;
    } catch (e) {
      // sin música si falla la carga
    }
  }

  /** Música del menú según la hora (día/noche). */
  function menu() {
    const clave = esDeDia() ? 'dia' : 'noche';
    cambiar(CANCIONES[clave], clave);
  }

  /** Música de una actividad según su categoría. */
  function actividad(cat) {
    const clave = cancionParaCategoria(cat);
    cambiar(clave, clave);
  }

  function setSonido(on) {
    sonidoActivado = !!on;
    if (!on) detener();
    else if (claveActual === null) menu();
  }

  function detener() {
    try { if (fuente) fuente.stop(); } catch (e) { /* ok */ }
    fuente = null; ganancia = null; claveActual = null;
  }

  // Activa el audio con la primera interacción (política de autoplay).
  function primeraInteraccion() {
    if (contextoActivo) return;
    contextoActivo = true;
    if (sonidoActivado) menu();
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) =>
    window.addEventListener(ev, primeraInteraccion, { once: false, passive: true })
  );

  window.PJMusic = {
    menu, actividad, detener, setSonido, esDeDia,
    cancionParaCategoria
  };
})();
