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
      // Triángulo: timbre claro y sin cola reverberante
      o.type = 'triangle';
      o.frequency.value = f;
      var start = t0 + i * seg;
      var end = start + seg * 0.92;
      // Envolvente corta y seca (ataque rápido, caída limpia)
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(vol, start + 0.008);
      g.gain.linearRampToValueAtTime(vol * 0.35, end - 0.02);
      g.gain.linearRampToValueAtTime(0.0001, end);
      o.connect(g); g.connect(c.destination);
      o.start(start); o.stop(end + 0.02);
    });
  }

  window.pjSonido = {
    clic: function () { tono([720], 55, 0.11); },
    pop: function () { tono([560, 830], 90, 0.15); },
    abrir: function () { tono([392, 523, 659], 150, 0.16); },
    exito: function () { tono([523, 659, 784], 200, 0.16); },
    error: function () { tono([220, 175], 190, 0.14); },
    victoria: function () { tono([523, 659, 784, 1047], 280, 0.18); }
  };
})();
