/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Sonidos de la web (archivos reales, librería Mixkit)
   pjSonido.clic / pop / abrir / exito / error / victoria
   Archivos cortos y limpios en public/sounds/*.wav (licencia gratuita
   Mixkit). Se decodifican con Web Audio API y se reproducen sin
   solaparse, con fundidos suaves: nada de tonos largos ni reverb.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__pjSonidos) return;
  window.__pjSonidos = true;

  var muted = false;
  try { muted = localStorage.getItem('pj_snd') === '0'; } catch (e) { /* ok */ }

  var NOMBRES = ['clic', 'pop', 'abrir', 'exito', 'error', 'victoria', 'letra', 'hoja'];
  var buffers = {};   // nombre -> AudioBuffer decodificado
  var ctx = null;
  var master = null;

  function ac() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.9;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') {
        var pr = ctx.resume();
        if (pr && pr.catch) pr.catch(function () { /* ok */ });
      }
    } catch (e) { /* sin audio */ }
    return ctx;
  }

  // Carga y decodifica un sonido (fetch funciona en file:// y en https)
  function cargar(n) {
    if (buffers[n]) return;
    try {
      fetch('sounds/' + n + '.wav')
        .then(function (r) { return r.arrayBuffer(); })
        .then(function (b) {
          var c = ac();
          if (!c) return;
          return c.decodeAudioData(b).then(function (buf) { buffers[n] = buf; }).catch(function () { /* no decodificable */ });
        })
        .catch(function () { /* sin red */ });
    } catch (e) { /* ok */ }
  }

  // Reproduce un sonido decodificado: corto, sin solaparse y con fundido
  function reproducir(n) {
    if (muted) return;
    var buf = buffers[n];
    var c = ac();
    if (!buf || !c || !master) { cargar(n); return; }
    try {
      var src = c.createBufferSource();
      src.buffer = buf;
      var g = c.createGain();
      var t = c.currentTime;
      var fin = Math.min(buf.duration, 0.4); // fundido de salida: corto y limpio
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(1, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + fin);
      src.connect(g); g.connect(master);
      src.start(t);
      src.stop(t + buf.duration + 0.05);
    } catch (e) { /* ok */ }
  }

  window.pjSonido = {
    setMuted: function (m) { muted = !!m; try { localStorage.setItem('pj_snd', muted ? '0' : '1'); } catch (e) { /* ok */ } },
    isMuted: function () { return muted; },
    clic: function () { reproducir('clic'); },
    pop: function () { reproducir('pop'); },
    abrir: function () { reproducir('abrir'); },
    exito: function () { reproducir('exito'); },
    error: function () { reproducir('error'); },
    victoria: function () { reproducir('victoria'); },
    letra: function () { reproducir('letra'); },
    hoja: function () { reproducir('hoja'); },

    // ── Sonidos sintetizados (sin archivos) para el editor de código ──
    // Pequeños "ticks" con osciladores: distintos para cada acción.
    paso: function () { tono(660, 0.07, 'square', 0.25); },          // avanzar/retroceder
    saltar: function () { tono(520, 0.06, 'square', 0.25); tono(780, 0.06, 'square', 0.25, 0.07); }, // salto (dos pasos)
    girar: function () { tono(440, 0.09, 'triangle', 0.3); },        // girar
    moneda: function () { tono(880, 0.05, 'sine', 0.3); tono(1320, 0.08, 'sine', 0.3, 0.05); },      // recoger moneda (sube)
    colocarBloque: function () { tono(740, 0.05, 'triangle', 0.22); },  // añadir bloque
    quitarBloque: function () { tono(300, 0.06, 'triangle', 0.22); },   // borrar bloque
    soltar: function () { tono(500, 0.08, 'sine', 0.3); },              // soltar con drag&drop
    golpe: function () { tono(160, 0.12, 'sawtooth', 0.3); }            // chocar / error de ejecución
  };

  // Genera un tono corto (oscillator + gain) sin depender de archivos
  function tono(freq, dur, tipo, vol, delay) {
    if (muted) return;
    var c = ac();
    if (!c || !master) return;
    try {
      var t0 = c.currentTime + (delay || 0);
      var osc = c.createOscillator();
      var g = c.createGain();
      osc.type = tipo || 'sine';
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g); g.connect(master);
      osc.start(t0); osc.stop(t0 + dur + 0.03);
    } catch (e) { /* ok */ }
  }

  // Primer gesto del usuario: crea el contexto y carga todos los sonidos
  function primerGesto() { ac(); NOMBRES.forEach(cargar); }
  if (window.requestIdleCallback) {
    try { window.requestIdleCallback(function () { NOMBRES.forEach(cargar); }, { timeout: 3000 }); } catch (e) { NOMBRES.forEach(cargar); }
  } else {
    setTimeout(function () { NOMBRES.forEach(cargar); }, 800);
  }
  try { document.addEventListener('pointerdown', primerGesto, { once: true, passive: true }); } catch (e) { /* ok */ }
  try { document.addEventListener('keydown', primerGesto, { once: true, passive: true }); } catch (e) { /* ok */ }

  // Sonidos de interfaz por delegación: hover sutil (letra) y clic en menú/botones
  function prepararSonidosUI() {
    var SEL = '.nav-links a, .nav-cta .btn, .cover-play, .ef-btn, .block-btn';
    document.addEventListener('pointerover', function (e) {
      if (muted) return;
      var t = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (t && !t.__snd) { t.__snd = 1; reproducir('letra'); }
    });
    document.addEventListener('pointerout', function (e) {
      var t = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (t) t.__snd = 0;
    });
    document.addEventListener('click', function (e) {
      var t = e.target && e.target.closest ? e.target.closest(SEL) : null;
      if (t) reproducir('clic');
    }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', prepararSonidosUI);
  else prepararSonidosUI();
})();
