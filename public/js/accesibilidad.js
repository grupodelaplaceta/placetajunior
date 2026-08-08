/* ═══════════════════════════════════════════════════════════════════════
   Placeta Junior — Accesibilidad web
   MAYÚSCULAS (CSS) + AUDIO (lectura con SpeechSynthesis) + botón Leer.
   Expone:
     window.__juniorLeer(texto)   → lee SIEMPRE (botón Leer / auto)
     window.__juniorAudio         → bool (lectura automática activada)
   El reproductor (player.js) llama a __juniorLeer con el texto de cada pantalla.
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  if (window.__juniorAccesibilidad) return;
  window.__juniorAccesibilidad = true;

  let mayus = false;
  let audio = false;
  const KEY = 'junior_acc_web';
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); mayus = !!s.mayus; audio = !!s.audio; } catch (e) { /* ok */ }
  window.__juniorAudio = audio;

  function aplicar() {
    document.body.classList.toggle('acces-mayusculas', mayus);
  }
  aplicar();

  const synth = window.speechSynthesis || null;

  function hablar(texto) {
    if (!texto || !synth) return;
    try {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(String(texto).slice(0, 1500));
      u.lang = 'es-ES';
      u.rate = 0.95;
      synth.speak(u);
    } catch (e) { /* sin audio */ }
  }

  window.__juniorLeer = function (texto) { hablar(texto); };

  function leerPagina() {
    const sel = document.querySelector('.kp-stage, main, #app, body');
    const txt = (sel ? sel.innerText : document.body.innerText) || '';
    hablar(txt.slice(0, 1500));
  }

  // ── Botón y panel flotante ──────────────────────────────────────────
  const btn = document.createElement('button');
  btn.id = 'juniorAccBtn';
  btn.textContent = '♿';
  btn.setAttribute('aria-label', 'Accesibilidad');

  const panel = document.createElement('div');
  panel.id = 'juniorAccPanel';
  panel.hidden = true;
  panel.innerHTML =
    '<div class="acc-head">♿ Accesibilidad</div>' +
    '<button type="button" class="acc-toggle" id="accMayus">🔠 MAYÚSCULAS</button>' +
    '<button type="button" class="acc-toggle" id="accAudio">🔊 AUDIO</button>' +
    '<button type="button" class="acc-toggle" id="accLeer">📖 Leer</button>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener('click', () => { panel.hidden = !panel.hidden; });

  function guardar() { try { localStorage.setItem(KEY, JSON.stringify({ mayus, audio })); } catch (e) { /* ok */ } }
  function refrescar() {
    document.getElementById('accMayus').classList.toggle('on', mayus);
    document.getElementById('accAudio').classList.toggle('on', audio);
    aplicar();
  }

  document.getElementById('accMayus').addEventListener('click', () => { mayus = !mayus; guardar(); refrescar(); });
  document.getElementById('accAudio').addEventListener('click', () => {
    audio = !audio;
    window.__juniorAudio = audio;
    guardar(); refrescar();
    if (audio) hablar('Audio activado. Todo se leerá en voz alta.');
  });
  document.getElementById('accLeer').addEventListener('click', leerPagina);
  refrescar();

  // Autoleer si el jugador expone el texto de la pantalla y el audio está activo
  document.addEventListener('junior:texto', (e) => {
    const t = (e && e.detail) || '';
    if (audio && t) hablar(t);
  });
})();
