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
  let grande = false;
  let contraste = false;
  let sonido = true;
  const KEY = 'junior_acc_web';
  try { const s = JSON.parse(localStorage.getItem(KEY) || '{}'); mayus = !!s.mayus; audio = !!s.audio; grande = !!s.grande; contraste = !!s.contraste; sonido = s.sonido !== false; } catch (e) { /* ok */ }
  window.__juniorAudio = audio;

  function aplicar() {
    document.body.classList.toggle('acces-mayusculas', mayus);
    document.body.classList.toggle('acces-letra-grande', grande);
    document.body.classList.toggle('acces-contraste', contraste);
    if (window.pjSonido) pjSonido.setMuted(!sonido);
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
    '<button type="button" class="acc-toggle" id="accMayus"><span class="acc-ico material-symbols-rounded">text_fields</span> MAYÚSCULAS</button>' +
    '<button type="button" class="acc-toggle" id="accAudio"><span class="acc-ico material-symbols-rounded">volume_up</span> AUDIO</button>' +
    '<button type="button" class="acc-toggle" id="accGrande"><span class="acc-ico material-symbols-rounded">text_increase</span> Letra grande</button>' +
    '<button type="button" class="acc-toggle" id="accContraste"><span class="acc-ico material-symbols-rounded">contrast</span> Alto contraste</button>' +
    '<button type="button" class="acc-toggle" id="accSonido"><span class="acc-ico material-symbols-rounded">volume_up</span> Sonidos</button>' +
    '<button type="button" class="acc-toggle" id="accLeer"><span class="acc-ico material-symbols-rounded">record_voice_over</span> Leer</button>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  btn.addEventListener('click', () => { panel.hidden = !panel.hidden; if (window.pjSonido) pjSonido.clic(); });

  function guardar() { try { localStorage.setItem(KEY, JSON.stringify({ mayus, audio, grande, contraste, sonido })); } catch (e) { /* ok */ } }
  function refrescar() {
    document.getElementById('accMayus').classList.toggle('on', mayus);
    document.getElementById('accAudio').classList.toggle('on', audio);
    document.getElementById('accGrande').classList.toggle('on', grande);
    document.getElementById('accContraste').classList.toggle('on', contraste);
    var sIco = document.querySelector('#accSonido .acc-ico');
    if (sIco) sIco.textContent = sonido ? 'volume_up' : 'volume_off';
    document.getElementById('accSonido').classList.toggle('on', sonido);
    aplicar();
  }

  document.getElementById('accMayus').addEventListener('click', () => { mayus = !mayus; guardar(); refrescar(); });
  document.getElementById('accAudio').addEventListener('click', () => {
    audio = !audio;
    window.__juniorAudio = audio;
    guardar(); refrescar();
    if (audio) hablar('Audio activado. Todo se leerá en voz alta.');
  });
  document.getElementById('accGrande').addEventListener('click', () => { grande = !grande; guardar(); refrescar(); if (grande) hablar('Letra grande activada.'); });
  document.getElementById('accContraste').addEventListener('click', () => { contraste = !contraste; guardar(); refrescar(); if (contraste) hablar('Alto contraste activado.'); });
  document.getElementById('accSonido').addEventListener('click', () => {
    sonido = !sonido;
    if (window.pjSonido) pjSonido.setMuted(!sonido);
    guardar(); refrescar();
    if (sonido && window.pjSonido) pjSonido.clic();
  });
  document.getElementById('accLeer').addEventListener('click', leerPagina);
  refrescar();

  // Autoleer si el jugador expone el texto de la pantalla y el audio está activo
  document.addEventListener('junior:texto', (e) => {
    const t = (e && e.detail) || '';
    if (audio && t) hablar(t);
  });
})();
