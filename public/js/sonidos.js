/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Sonidos de la web (Web Audio API, sin archivos)
   pjSonido.clic / pop / abrir / exito / error / victoria
   Se sintetizan tonos en el dispositivo; solo suenan tras un gesto del
   usuario (política de autoplay de los navegadores).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__pjSonidos) return;
  window.__pjSonidos = true;

  var ctx = null;
  var muted = false;
  try { muted = localStorage.getItem('pj_snd') === '0'; } catch (e) { /* ok */ }
  function ac() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* sin audio */ }
    return ctx;
  }
  function tono(frecs, dur, vol) {
    if (muted) return;
    var c = ac();
    if (!c) return;
    var t0 = c.currentTime;
    var seg = dur / frecs.length;
    frecs.forEach(function (f, i) {
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'triangle';
      o.frequency.value = f;
      var start = t0 + i * seg;
      var end = start + seg * 0.9;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(vol, start + 0.006);
      g.gain.linearRampToValueAtTime(0.0001, end);
      o.connect(g); g.connect(c.destination);
      o.start(start); o.stop(end + 0.015);
    });
  }

  window.pjSonido = {
    setMuted: function (m) { muted = !!m; try { localStorage.setItem('pj_snd', muted ? '0' : '1'); } catch (e) { /* ok */ } },
    isMuted: function () { return muted; },
    clic: function () { tono([760], 40, 0.08); },
    pop: function () { tono([620, 880], 55, 0.10); },
    abrir: function () { tono([440, 660], 90, 0.11); },
    exito: function () { tono([660, 990], 100, 0.11); },
    error: function () { tono([210], 110, 0.09); },
    victoria: function () { tono([523, 784, 1047], 170, 0.12); }
  };
})();
