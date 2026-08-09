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
  function ac() {
    try {
      if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* sin audio */ }
    return ctx;
  }
  function tono(frecs, dur, vol) {
    var c = ac();
    if (!c) return;
    var t0 = c.currentTime;
    var seg = dur / frecs.length;
    frecs.forEach(function (f, i) {
      var o = c.createOscillator();
      var g = c.createGain();
      o.type = 'sine';
      o.frequency.value = f;
      var start = t0 + i * seg;
      var end = start + seg;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(vol, start + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, end);
      o.connect(g); g.connect(c.destination);
      o.start(start); o.stop(end + 0.03);
    });
  }

  window.pjSonido = {
    clic: function () { tono([660], 70, 0.12); },
    pop: function () { tono([520, 780], 110, 0.16); },
    abrir: function () { tono([392, 523, 659], 200, 0.18); },
    exito: function () { tono([523, 659, 784, 1047], 300, 0.18); },
    error: function () { tono([233, 185], 280, 0.16); },
    victoria: function () { tono([523, 659, 784, 659, 784, 1047], 420, 0.2); }
  };
})();
