/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Reproductor jugable (web pública)
   Abre una actividad publicada y permite jugarla tal y como la verá el niño.
   ═══════════════════════════════════════════════════════════════════ */

let pantallas = [];
let pantallaIdx = 0;
let kpEstado = [];
let bloquesJuego = [];
let kpScore = { verdes: 0, rojos: 0 };
let kpCelebrado = false;
let actividadActual = null;   // actividad que se está jugando (para guardar progreso)
let dipGuardado = '';
let msgGuardar = '';
let guardandoDIP = false;

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function kpImg(url, fuente) {
  return `<div class="kp-img"><img src="${esc(url)}" alt=""><div class="kp-fuente">📸 ${esc(fuente || 'Fuente sin indicar')}</div></div>`;
}
function shuffleArr(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}
function chipColor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return 'blue';
  if (c.includes('leng') || c.includes('lect')) return 'green';
  if (c.includes('cien') || c.includes('medio')) return 'orange';
  if (c.includes('geo')) return 'red';
  return 'purple';
}
function emojiCat(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return '🔢';
  if (c.includes('leng') || c.includes('lect')) return '📖';
  if (c.includes('cien')) return '🔬';
  if (c.includes('geo')) return '🌍';
  if (c.includes('tecn') || c.includes('inform')) return '💻';
  if (c.includes('logic')) return '🧠';
  return '🧩';
}
function generarSopa(palabras, tamano) {
  const MAX = 16;
  const validas = (palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const maxLen = validas.length ? Math.max(...validas.map(p => p.length)) : 3;
  let size = Math.min(MAX, Math.max(Number(tamano) || 10, maxLen + 1, 8));

  const colocar = (grid, palabra) => {
    const L = palabra.length;
    if (L > size) return false;
    // Prueba ambas orientaciones y varios intentos para evitar colisiones
    const dirs = Math.random() < 0.5 ? [0, 1] : [1, 0];
    for (const d of dirs) {
      const rowMax = d === 0 ? size - 1 : size - L;   // fila válida máxima
      const colMax = d === 0 ? size - L : size - 1;   // columna válida máxima
      for (let att = 0; att < 80; att++) {
        const row = Math.floor(Math.random() * (rowMax + 1));
        const col = Math.floor(Math.random() * (colMax + 1));
        let ok = true;
        for (let k = 0; k < L; k++) {
          const c = d === 0 ? grid[row][col + k] : grid[row + k][col];
          if (c && c !== palabra[k]) { ok = false; break; }
        }
        if (ok) {
          for (let k = 0; k < L; k++) { if (d === 0) grid[row][col + k] = palabra[k]; else grid[row + k][col] = palabra[k]; }
          return true;
        }
      }
    }
    return false;
  };

  // Intenta colocar todas; si alguna no cabe, amplía la rejilla (hasta 16) y reintenta
  let grid;
  while (true) {
    grid = Array.from({ length: size }, () => Array(size).fill(''));
    const falladas = [];
    validas.forEach((p) => { if (!colocar(grid, p)) falladas.push(p); });
    if (!falladas.length || size >= MAX) break;
    size = Math.min(size + 1, MAX);
  }
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = abc[Math.floor(Math.random() * 26)];
  return { grid, size };
}

// ── Abrir el juego de una actividad publicada ────────────────────────
function abrirJuego(act) {
  actividadActual = act || null;
  if (window.pjSonido) pjSonido.abrir();
  bloquesJuego = (act && act.contenido && act.contenido.bloques) ? act.contenido.bloques : [];
  if (!bloquesJuego.length) { juniorAviso('Esta actividad aún no tiene contenido jugable.', 'error'); return; }
  pantallas = [];
  kpEstado = [];
  const tit = act.titulo || 'Mi actividad';
  const desc = act.descripcion || '';
  const cat = act.categoria || 'General';
  const edad = act.edad_recomendada || '6-12';
  const dif = act.dificultad || 'media';
  const tiempo = act.tiempo_estimado || 10;

  pantallas.push({ tipo: 'portada', tit, desc, cat, edad, dif, tiempo });
  kpEstado.push({});

  bloquesJuego.forEach((b, bi) => {
    if (b.tipo === 'test') {
      (b.preguntas || []).forEach((p, pi) => {
        pantallas.push({ tipo: 'test', bi, pi, nPreg: b.preguntas.length });
        kpEstado.push({ respondida: false, sel: null, acierto: null });
      });
    } else if (b.tipo === 'texto') {
      pantallas.push({ tipo: 'texto', bi });
      kpEstado.push({});
    } else if (b.tipo === 'sopa_letras') {
      const { grid, size } = generarSopa(b.palabras, b.tamano);
      pantallas.push({ tipo: 'sopa', bi, grid, size });
      kpEstado.push({ encontradas: {}, sel: [], foundCells: [], error: false, toqueInicio: null });
    } else if (b.tipo === 'relacionar') {
      const n = (b.pares || []).length;
      const indices = Array.from({ length: n }, (_, k) => k);
      pantallas.push({ tipo: 'relacionar', bi });
      kpEstado.push({ izq: null, hechas: {}, escrito: {}, ordenIzq: shuffleArr(indices), ordenDer: shuffleArr(indices) });
    } else if (b.tipo === 'ordenar') {
      pantallas.push({ tipo: 'ordenar', bi });
      kpEstado.push({ orden: shuffleArr((b.items || []).map((_, k) => k)), hechas: 0 });
    } else if (b.tipo === 'completar') {
      pantallas.push({ tipo: 'completar', bi });
      kpEstado.push({ estado: {} });
    } else if (b.tipo === 'calculo_mental') {
      (b.sumas || []).forEach((s, si) => {
        const a = Number(s.a) || 0, bb = Number(s.b) || 0;
        const correcta = a + bb;
        const opciones = b.modo === 'opciones' ? generarOpcionesCalculo(correcta) : [];
        pantallas.push({ tipo: 'calculo', bi, si, n: (b.sumas || []).length });
        kpEstado.push({ respondida: false, sel: null, acierto: null, opciones, correcta });
      });
    } else if (b.tipo === 'mapa_mundi') {
      const paises = (b.paises || []).map(p => String(p).trim()).filter(Boolean).filter(p => window.MAPA_MUNDI && MAPA_MUNDI.paises[p]);
      const preg = (b.preguntas && b.preguntas.length) ? b.preguntas : paises.map(p => ({ pide: 'Haz clic en ' + p, correcta: p }));
      (preg || []).forEach((q, qi) => {
        const corr = String(q.correcta || '').trim();
        if (!window.MAPA_MUNDI || !MAPA_MUNDI.paises[corr]) return;
        pantallas.push({ tipo: 'mapa', bi, qi, n: (preg || []).length, paises, pide: q.pide || ('Haz clic en ' + corr), correcta: corr, correctaEn: MAPA_MUNDI.paises[corr] });
        kpEstado.push({ respondida: false, acierto: null, sel: null });
      });
    }
  });

  pantallas.push({ tipo: 'final', tit, cat });
  kpEstado.push({});
  kpScore = { verdes: 0, rojos: 0 };
  kpCelebrado = false;
  pantallaIdx = 0;
  // Página completa (no popup): renderiza el juego en su propia página
  const gamePage = document.getElementById('game-page');
  if (gamePage) {
    gamePage.innerHTML = '<div id="player-content"></div>';
    // Si veníamos del detalle, lo cerramos para que el juego abra en su propia página
    window.__pjDesdeDetalle = document.body.classList.contains('mostrando-detalle');
    document.body.classList.remove('mostrando-detalle');
    document.body.classList.add('mostrando-juego');
  }
  asegurarFeedback();
  renderPantalla();
  try { if (act && act.id && !location.search.includes('jugar=')) history.pushState(null, '', '/?jugar=' + encodeURIComponent(act.id)); } catch (e) { /* sin historial */ }
}

function generarOpcionesCalculo(correcta) {
  const opts = new Set([correcta]);
  let tries = 0;
  while (opts.size < 3 && tries < 120) {
    const d = Math.max(2, Math.round(Math.abs(correcta) * 0.2) + 1);
    const cand = Math.max(0, correcta + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * d) + 1));
    opts.add(cand);
    tries++;
  }
  const arr = [...opts];
  while (arr.length < 3) arr.push(Math.max(0, correcta + arr.length));
  return shuffleArr(arr);
}

function renderPantalla() {
  const s = pantallas[pantallaIdx];
  const est = kpEstado[pantallaIdx] || {};
  let cuerpo = '';
  if (s.tipo === 'portada') cuerpo = screenPortada(s);
  else if (s.tipo === 'texto') cuerpo = screenTexto(s, est);
  else if (s.tipo === 'test') cuerpo = screenTest(s, est);
  else if (s.tipo === 'sopa') cuerpo = screenSopa(s, est);
  else if (s.tipo === 'relacionar') cuerpo = screenRelacionar(s, est);
  else if (s.tipo === 'ordenar') cuerpo = screenOrdenar(s, est);
  else if (s.tipo === 'completar') cuerpo = screenCompletar(s, est);
  else if (s.tipo === 'calculo') cuerpo = screenCalculo(s, est);
  else if (s.tipo === 'mapa') cuerpo = screenMapa(s, est);
  else if (s.tipo === 'final') { cuerpo = screenFinal(s); if (!kpCelebrado) { kpCelebrado = true; lluviaConfetti(); if (window.pjSonido) pjSonido.victoria(); } }
  ocultarFeedback();
  destruirMapas();
  const total = pantallas.length;
  const pct = total > 1 ? Math.round((pantallaIdx / (total - 1)) * 100) : 0;
  let etiqueta;
  if (s.tipo === 'test') etiqueta = 'Pregunta ' + (s.pi + 1) + ' de ' + s.nPreg;
  else if (s.tipo === 'calculo') etiqueta = 'Cálculo ' + (s.si + 1) + ' de ' + s.n;
  else if (s.tipo === 'final') etiqueta = '¡Resultado!';
  else if (s.tipo === 'portada') etiqueta = 'Empieza';
  else etiqueta = 'Pantalla ' + (pantallaIdx + 1) + ' de ' + total;
  document.getElementById('player-content').innerHTML = `
    <div class="kp-top">
      <button type="button" class="kp-nav-btn kp-salir" onclick="cerrarPlayer()" title="Salir de la actividad"><span class="material-symbols-rounded">close</span><span class="kp-salir-txt">Salir</span></button>
      <div class="kp-progress" aria-hidden="true">
        <span class="kp-progress-label">${esc(etiqueta)}</span>
        <div class="kp-progress-track"><div class="kp-progress-bar" style="width:${pct}%"></div></div>
      </div>
      <div class="kp-score-chips" aria-label="Resultado">
        <span class="kp-chip-score ok"><span class="material-symbols-rounded">check_circle</span>${kpScore.verdes}</span>
        <span class="kp-chip-score bad"><span class="material-symbols-rounded">cancel</span>${kpScore.rojos}</span>
      </div>
    </div>
    <div class="kp-nav-row">
      <button type="button" class="kp-nav-btn" onclick="pantallaPrev()" ${pantallaIdx === 0 ? 'disabled' : ''} title="Anterior"><span class="material-symbols-rounded">chevron_left</span></button>
      <span class="kp-dots">${pantallas.map((_, i) => `<span class="kp-dot ${i === pantallaIdx ? 'on' : ''}"></span>`).join('')}</span>
      <button type="button" class="kp-nav-btn" onclick="pantallaNext()" ${pantallaIdx === pantallas.length - 1 ? 'disabled' : ''} title="Siguiente"><span class="material-symbols-rounded">chevron_right</span></button>
    </div>
    <div class="kp-stage" aria-live="polite">${cuerpo}</div>`;
  clearInterval(calcTimer);
  if (s.tipo === 'calculo') iniciarTimerCalculo();
  if (s.tipo === 'mapa') iniciarMapa(pantallaIdx);
  if (s.tipo === 'portada') cargarPortadaImg(pantallaIdx);

  // Accesibilidad: exponer el texto de la pantalla para la lectura con audio
  document.dispatchEvent(new CustomEvent('junior:texto', { detail: textoPantallaWeb(s) }));
}

// Cierra el reproductor y limpia el feedback
function cerrarPlayer() {
  ocultarFeedback();
  const m = document.getElementById('player-modal');
  if (m) m.classList.add('hidden');
}

// Overlay de feedback (éxito/error) con ARIA y foco accesible
function asegurarFeedback() {
  if (document.getElementById('kp-feedback')) return;
  const fb = document.createElement('div');
  fb.id = 'kp-feedback';
  fb.className = 'kp-feedback hidden';
  fb.setAttribute('role', 'dialog');
  fb.setAttribute('aria-modal', 'true');
  fb.setAttribute('aria-label', 'Resultado de la respuesta');
  const m = document.getElementById('game-page');
  (m || document.body).appendChild(fb);
}
function mostrarFeedback(acierto, correctaTexto, onNext) {
  const fb = document.getElementById('kp-feedback');
  if (!fb) { if (onNext) onNext(); return; }
  window.__kpNext = function () { ocultarFeedback(); if (window.pjSonido) pjSonido.pop(); if (onNext) onNext(); };
  fb.innerHTML = acierto
    ? `<div class="kp-fb-card kp-fb-ok" role="alert">
        <div class="kp-fb-ico"><span class="material-symbols-rounded">check_circle</span></div>
        <h3 class="kp-fb-title">¡Correcto!</h3>
        <p class="kp-fb-sub">Has sumado +1 punto verde. ¡Sigue así!</p>
        <button type="button" class="kp-btn kp-fb-next" onclick="window.__kpNext()">Siguiente</button>
      </div>`
    : `<div class="kp-fb-card kp-fb-bad" role="alert">
        <div class="kp-fb-ico"><span class="material-symbols-rounded">cancel</span></div>
        <h3 class="kp-fb-title">Casi lo logras</h3>
        <p class="kp-fb-sub">La respuesta correcta era «${esc(correctaTexto)}».</p>
        <button type="button" class="kp-btn kp-fb-next" onclick="window.__kpNext()">Continuar</button>
      </div>`;
  fb.classList.remove('hidden');
  const nb = fb.querySelector('.kp-fb-next');
  if (nb) nb.focus();
}
function ocultarFeedback() {
  const fb = document.getElementById('kp-feedback');
  if (fb) fb.classList.add('hidden');
}

function textoPantallaWeb(s) {
  if (s.tipo === 'portada') return 'Actividad ' + (s.tit || '') + '. ' + (s.desc || '');
  if (s.tipo === 'texto') { const b = bloquesJuego[s.bi]; return 'Explicación. ' + (b.contenido || ''); }
  if (s.tipo === 'test') { const p = bloquesJuego[s.bi].preguntas[s.pi]; return p ? (p.pregunta || '') : ''; }
  if (s.tipo === 'sopa') return 'Encuentra las palabras';
  if (s.tipo === 'relacionar') return 'Relaciona las parejas';
  if (s.tipo === 'ordenar') return 'Ordena los elementos';
  if (s.tipo === 'completar') return 'Completa las frases';
  if (s.tipo === 'calculo') return 'Calcula';
  if (s.tipo === 'mapa') return 'Localiza en el mapamundi: ' + (s.pide || '');
  if (s.tipo === 'final') return '¡Enhorabuena! Actividad completada.';
  return '';
}

// ── Cálculo mental (reproductor) ──────────────────────────────────────
let calcTimer = null;
let calcAutoTimer = null;
// Avanza solo al siguiente ejercicio del cálculo mental (o al final)
function avanzarCalculo() {
  clearTimeout(calcAutoTimer);
  if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
  renderPantalla();
}
function numTile(n) { return `<span class="kp-numtile">${n}</span>`; }
function screenCalculo(s, est) {
  const b = bloquesJuego[s.bi];
  const suma = (b.sumas || [])[s.si] || { a: 0, b: 0 };
  const a = Number(suma.a) || 0, bb = Number(suma.b) || 0;
  const totalSeg = Math.max(1, Number(b.segundos) || 10);
  let html = `<div class="kp-screen kp-calc-screen">
    <div class="kp-qt">🧮 Cálculo mental · ${s.si + 1} / ${s.n || 1}</div>
    <div class="kp-calc-timer"><span class="kp-timer" data-timer="${totalSeg}">⏱️ ${totalSeg}s</span>
      <div class="kp-timer-track"><div class="kp-timer-bar" style="width:100%"></div></div></div>
    <div class="kp-calc">${numTile(a)} <span class="kp-calc-op">+</span> ${numTile(bb)} <span class="kp-calc-op">=</span> <span class="kp-calc-q">?</span></div>`;
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : 'La respuesta era: ' + est.correcta + ' 💪'}</div>`;
  } else if (b.modo === 'escribir') {
    html += `<div class="kp-input-row">
      <input id="kp-calc-input" type="number" inputmode="numeric" placeholder="Tu respuesta"
        onkeydown="if(event.key==='Enter')kpResponderCalculo(${pantallaIdx})" />
      <button class="kp-btn" onclick="kpResponderCalculo(${pantallaIdx})">Comprobar</button>
    </div>`;
  } else {
    html += `<div class="kp-opts">${(est.opciones || []).map((o, k) => `
      <div class="kp-opt" onclick="kpResponderCalculo(${pantallaIdx},${k})"><span class="kp-letra">${'ABC'[k]}</span>${o}</div>`).join('')}</div>`;
  }
  html += `<div class="kp-hint">⚡ Responde antes de que acabe el tiempo.</div></div>`;
  return html;
}
function iniciarTimerCalculo() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'calculo') return;
  const b = bloquesJuego[s.bi];
  const total = Math.max(1, Number(b.segundos) || 10);
  let seg = total;
  const el = document.querySelector('[data-timer]');
  if (el) { el.textContent = '⏱️ ' + seg + 's'; el.classList.remove('warn'); }
  const bar = document.querySelector('.kp-timer-bar');
  if (bar) bar.style.width = '100%';
  calcTimer = setInterval(() => {
    seg--;
    const el2 = document.querySelector('[data-timer]');
    if (el2) { el2.textContent = '⏱️ ' + seg + 's'; el2.classList.toggle('warn', seg <= 3); }
    const bar2 = document.querySelector('.kp-timer-bar');
    if (bar2) { bar2.style.width = Math.max(0, (seg / total) * 100) + '%'; bar2.classList.toggle('warn', seg <= 3); }
    if (seg <= 0) { clearInterval(calcTimer); calcTimer = null; kpTimeoutCalculo(pantallaIdx); }
  }, 1000);
}
function kpResponderCalculo(idx, k) {
  const s = pantallas[idx], est = kpEstado[idx];
  if (!est || est.respondida) return;
  let ok;
  if ((bloquesJuego[s.bi] || {}).modo === 'escribir') {
    const v = parseInt(document.getElementById('kp-calc-input')?.value, 10);
    if (isNaN(v)) return;
    ok = v === est.correcta;
  } else {
    ok = (est.opciones || [])[k] === est.correcta;
  }
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  clearInterval(calcTimer); calcTimer = null;
  renderPantalla();
  mostrarFeedback(ok, 'La respuesta era ' + est.correcta, avanzarCalculo);
  clearTimeout(calcAutoTimer);
  calcAutoTimer = setTimeout(avanzarCalculo, 1400);
}
function kpTimeoutCalculo(idx) {
  const est = kpEstado[idx];
  if (est && !est.respondida) {
    est.respondida = true; est.acierto = false; kpScore.rojos++;
    if (window.pjSonido) pjSonido.error();
    renderPantalla();
    mostrarFeedback(false, 'La respuesta era ' + est.correcta, avanzarCalculo);
    clearTimeout(calcAutoTimer);
    calcAutoTimer = setTimeout(avanzarCalculo, 1600);
  }
}

function screenTexto(s, est) {
  const b = bloquesJuego[s.bi];
  const parrafos = (b.contenido || '').split(/\n+/).map(t => t.trim()).filter(Boolean);
  let html = `<div class="kp-screen">
    <div class="kp-qt">📖 ${esc(b.titulo || 'Aprende')}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-explicacion">`;
  parrafos.forEach(p => {
    if (p.startsWith('- ') || p.startsWith('• ')) html += `<div class="kp-expl-item">• ${esc(p.slice(2))}</div>`;
    else html += `<p>${esc(p)}</p>`;
  });
  html += `</div>`;
  html += `<div style="text-align:center;margin-top:14px;"><button class="kp-check" onclick="pantallaNext()">Continuar →</button></div>`;
  html += `<div class="kp-hint">📖 Lee y luego pulsa Continuar para responder</div></div>`;
  return html;
}

function screenPortada(s) {
  return `
    <div class="kp-screen">
      <div class="kp-cover-img" id="kp-portada-img"><span class="kp-cover-emoji">${emojiCat(s.cat)}</span></div>
      <h3 class="kp-title">${esc(s.tit)}</h3>
      <p class="kp-desc">${esc(s.desc)}</p>
      <div class="kp-chips">
        <span class="kp-chip chip-${chipColor(s.cat)}">${esc(s.cat)}</span>
        <span class="kp-chip">👧 ${esc(s.edad)}</span>
        <span class="kp-chip">⭐ ${esc(s.dif)}</span>
        <span class="kp-chip">⏱️ ${esc(s.tiempo)} min</span>
      </div>
      <button type="button" class="kp-btn kp-start" onclick="pantallaNext()">🚀 ¡Empezar!</button>
      <div class="kp-hint">👆 Pulsa «¡Empezar!» cuando estés listo.</div>
    </div>`;
}

// Carga la portada real (16:9) en la pantalla de inicio, en vez del emoji
function cargarPortadaImg(idx) {
  const el = document.getElementById('kp-portada-img');
  if (!el) return;
  const s = pantallas[idx];
  const a = actividadActual;
  const fill = (u) => {
    if (!u) return;
    el.style.backgroundImage = `url('${u}')`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    const em = el.querySelector('.kp-cover-emoji');
    if (em) em.remove();
  };
  if (a && a.portada_url) fill(a.portada_url);
  else if (typeof generarCaratula === 'function') {
    generarCaratula({ cat: s.cat, tit: s.tit, tipo: a ? a.tipo : '' }).then(fill);
  }
}

function screenTest(s, est) {
  const b = bloquesJuego[s.bi];
  const p = b.preguntas[s.pi];
  // Barajar SIEMPRE las opciones (permutación estable por pantalla).
  if (!est.opciones) est.opciones = shuffleArr(p.opciones.map((_, i) => i));
  const orden = est.opciones;
  const correcta = p.correcta;
  let html = `<div class="kp-screen kp-test">
    <div class="kp-qcard">
      <span class="kp-orb" aria-hidden="true"></span>
      <div class="kp-qt">📝 Pregunta ${s.pi + 1} de ${s.nPreg}</div>
      <div class="kp-q">${esc(p.pregunta || '…')}</div>`;
  if (p.imagen_url) html += kpImg(p.imagen_url, p.fuente);
  if (p.pictograma) html += kpImg(p.pictograma, p.fuente);
  html += `</div>`;
  html += `<div class="kp-answers">`;
  orden.forEach((k, idx) => {
    const op = p.opciones[k];
    let cls = 'kp-answer';
    if (est.respondida) {
      if (k === correcta) cls += ' ok';
      else if (k === est.sel) cls += ' bad';
      else cls += ' muted';
    }
    // No revelar la respuesta: icono neutro hasta que se responde
    const icono = !est.respondida
      ? 'chevron_right'
      : (k === correcta ? 'check_circle' : (k === est.sel ? 'cancel' : 'radio_button_unchecked'));
    html += `<button type="button" class="${cls}" onclick="kpResponder(${pantallaIdx},${k})" ${est.respondida ? 'disabled' : ''}>
      <span class="kp-letra">${'ABCDEFGH'[idx] || '•'}</span>
      <span class="kp-answer-txt">${esc(op || '…')}</span>
      <span class="kp-answer-ico"><span class="material-symbols-rounded">${icono}</span></span>
    </button>`;
  });
  html += `</div>`;
  return html;
}
function kpResponder(idx, k) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (est.respondida) return;
  est.respondida = true;
  est.sel = k;
  const b = bloquesJuego[s.bi];
  const p = b.preguntas[s.pi];
  est.acierto = (k === p.correcta);
  if (est.acierto) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  renderPantalla();
  mostrarFeedback(est.acierto, p.opciones[p.correcta], function () {
    if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
    renderPantalla();
  });
}

function screenSopa(s, est) {
  const b = bloquesJuego[s.bi];
  const enc = est.encontradas || {};
  const foundCells = est.foundCells || [];
  const sel = est.sel || [];
  const validas = (b.palabras || []).filter(Boolean);
  const chips = validas.map((p, j) => {
    const en = !!enc[j];
    return `<span class="kp-chip ${en ? 'ok' : ''}">${en ? '✅ ' : ''}${esc(String(p).toUpperCase())}</span>`;
  }).join('');
  const total = validas.length;
  const hechas = Object.keys(enc).length;
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔤 Sopa de letras</div>
    <div class="kp-wordchips">${chips}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-grid" data-pantalla="${pantallaIdx}" data-size="${s.size}" style="grid-template-columns:repeat(${s.size},1fr);">`;
  s.grid.forEach((row, r) => row.forEach((c, cc) => {
    let cls = 'kp-cell';
    if (foundCells.some(f => f.r === r && f.c === cc)) cls += ' found';
    else if (sel.some(p => p.r === r && p.c === cc)) cls += ' sel';
    html += `<span class="${cls}" data-r="${r}" data-c="${cc}">${esc(c)}</span>`;
  }));
  html += `</div>`;
  if (est.error) html += `<div class="kp-msg bad">👀 Esa letra no sigue ninguna palabra…</div>`;
  else if (hechas >= total && total > 0) html += `<div class="kp-msg ok">¡Has encontrado todas! 🎉</div>`;
  else if (total > 0) html += `<div class="kp-msg">🔤 ${hechas} / ${total}</div>`;
  html += `<div class="kp-hint">👆 Toca la primera y la última letra, o desliza para formar la palabra</div></div>`;
  return html;
}
// ── Sopa: arrastrar / deslizar para formar las palabras ──────────────
let kpDrag = { on: false, idx: -1, dir: null, cells: [] };
// Celdas en línea recta entre dos puntos (para completar con dos toques)
function lineaEntre(a, b) {
  const dr = Math.sign(b.r - a.r), dc = Math.sign(b.c - a.c);
  const n = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c)) + 1;
  const out = [];
  for (let i = 0; i < n; i++) out.push({ r: a.r + dr * i, c: a.c + dc * i });
  return out;
}
// Comprueba una palabra marcada (arrastrada o completada con dos toques)
function comprobarSopa(idx, word) {
  const est = kpEstado[idx];
  const s = pantallas[idx];
  const rev = word.split('').reverse().join('');
  const b = bloquesJuego[s.bi];
  const validas = (b.palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const wi = validas.findIndex((w, i) => !est.encontradas[i] && (w === word || w === rev));
  if (wi >= 0) {
    est.encontradas[wi] = true;
    est.foundCells = [...(est.foundCells || []), ...(est.sel || [])];
    kpScore.verdes++;
    if (window.pjSonido) pjSonido.exito();
  } else {
    kpScore.rojos++;
    est.error = true;
    if (window.pjSonido) pjSonido.error();
    setTimeout(() => { if (kpEstado[idx]) { kpEstado[idx].error = false; renderPantalla(); } }, 700);
  }
  renderPantalla();
}
function kpStart(e) {
  const cell = e.target && e.target.closest ? e.target.closest('.kp-cell') : null;
  if (!cell) return;
  const grid = cell.closest('.kp-grid');
  if (!grid) return;
  const idx = +grid.dataset.pantalla;
  const s = pantallas[idx];
  if (!s || s.tipo !== 'sopa') return;
  const est = kpEstado[idx];
  const p = { r: +cell.dataset.r, c: +cell.dataset.c };
  const prev = est.toqueInicio;
  // Segundo toque: completar la palabra en línea recta (mucho más fácil en móvil)
  if (prev && (prev.r !== p.r || prev.c !== p.c) && (prev.r === p.r || prev.c === p.c || Math.abs(prev.r - p.r) === Math.abs(prev.c - p.c))) {
    est.toqueInicio = null;
    est.sel = lineaEntre(prev, p);
    comprobarSopa(idx, est.sel.map(q => s.grid[q.r][q.c]).join(''));
    return;
  }
  est.toqueInicio = null;
  kpDrag = { on: true, idx, dir: null, cells: [p] };
  est.sel = kpDrag.cells;
  pintarSel(idx);
  if (window.pjSonido) pjSonido.letra();
}
function kpMove(e) {
  if (!kpDrag.on) return;
  const grid = document.querySelector(`.kp-grid[data-pantalla="${kpDrag.idx}"]`);
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  const size = Number(grid.dataset.size) || 10;
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 3;
  const cellSize = (rect.width - (size - 1) * gap) / size;
  const r = Math.min(size - 1, Math.max(0, Math.floor((e.clientY - rect.top) / (cellSize + gap))));
  const c = Math.min(size - 1, Math.max(0, Math.floor((e.clientX - rect.left) / (cellSize + gap))));
  const cells = kpDrag.cells;
  const last = cells[cells.length - 1];
  const dr = r - last.r, dc = c - last.c;
  if (dr === 0 && dc === 0) return;
  if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
  if (cells.length > 1) {
    const prev = cells[cells.length - 2];
    if (r === prev.r && c === prev.c) { cells.pop(); pintarSel(kpDrag.idx); return; }
  }
  if (kpDrag.dir === null) kpDrag.dir = { dr, dc };
  if (cells.some(p => p.r === r && p.c === c)) return;
  if (dr !== kpDrag.dir.dr || dc !== kpDrag.dir.dc) return;
  cells.push({ r, c });
  pintarSel(kpDrag.idx);
  if (window.pjSonido) pjSonido.letra();
}
function kpEnd() {
  if (!kpDrag.on) return;
  const idx = kpDrag.idx;
  const est = kpEstado[idx];
  const s = pantallas[idx];
  const cells = kpDrag.cells;
  kpDrag.on = false;
  if (cells.length < 2) {
    // Toque simple: guardamos como inicio para completar con otro toque
    est.sel = cells;
    est.toqueInicio = cells[0];
    pintarSel(idx);
    if (window.pjSonido) pjSonido.letra();
    return;
  }
  est.sel = cells;
  est.toqueInicio = null;
  const word = cells.map(p => s.grid[p.r][p.c]).join('');
  comprobarSopa(idx, word);
}
function pintarSel(idx) {
  const grid = document.querySelector(`.kp-grid[data-pantalla="${idx}"]`);
  if (!grid) return;
  const est = kpEstado[idx] || {};
  const sel = est.sel || [];
  const found = est.foundCells || [];
  grid.querySelectorAll('.kp-cell').forEach(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    const inSel = sel.some(p => p.r === r && p.c === c);
    const isFound = found.some(f => f.r === r && f.c === c);
    cell.classList.toggle('sel', inSel && !isFound);
  });
}
function screenFinal(s) {
  return `
    <div class="kp-screen">
      <div class="kp-cover cover-${chipColor(s.cat)}">🎉</div>
      <h3 class="kp-title">¡Lo has conseguido!</h3>
      <p class="kp-desc">${esc(s.tit)}</p>
      <div class="kp-score">
        <div class="kp-score-item verdes"><span class="kp-score-num">🟢</span>${kpScore.verdes} <small>puntos verdes</small></div>
        <div class="kp-score-item rojos"><span class="kp-score-num">🔴</span>${kpScore.rojos} <small>puntos rojos</small></div>
      </div>
      <div class="kp-save">
        <h4>💾 Guardar mi progreso</h4>
        <p class="kp-save-sub">Pon tu DIP de Placeta Junior para sumar tus puntos verdes y rojos.</p>
        <div class="kp-save-row">
          <input id="kp-dip" type="text" inputmode="text" autocomplete="off"
            placeholder="Tu DIP (ej: 11111111D)" value="${esc(dipGuardado)}" maxlength="20">
          <button class="kp-btn" onclick="guardarProgreso()" ${guardandoDIP ? 'disabled' : ''}>${guardandoDIP ? 'Guardando…' : '💾 Guardar'}</button>
        </div>
        <div id="kp-msg" class="kp-msg ${msgGuardar.startsWith('✅') ? 'ok' : (msgGuardar ? 'bad' : '')}">${msgGuardar}</div>
      </div>
      <div class="kp-hint">💪 ¡Sigue así, campeón!</div>
    </div>`;
}

// Guardar el progreso (puntos verdes/rojos) con el DIP del junior
async function guardarProgreso() {
  const inp = document.getElementById('kp-dip');
  if (!inp) return;
  const dip = inp.value.trim();
  if (!dip) { msgGuardar = '❌ Escribe tu DIP para guardar.'; renderPantalla(); return; }
  if (!actividadActual || !actividadActual.id) { msgGuardar = '❌ No se puede guardar: actividad sin id.'; renderPantalla(); return; }
  guardandoDIP = true;
  renderPantalla();
  const respuestas = [];
  for (let i = 0; i < kpScore.verdes; i++) respuestas.push({ idx: i, correcta: true });
  for (let i = 0; i < kpScore.rojos; i++) respuestas.push({ idx: kpScore.verdes + i, correcta: false });
  try {
    const res = await fetch(`${API_BASE}/actividades/${actividadActual.id}/realizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dip, respuestas })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      dipGuardado = dip;
      const extra = data.recompensa ? ` · +${data.recompensa} Pz` : '';
      msgGuardar = `✅ ¡Guardado! ${kpScore.verdes} verdes y ${kpScore.rojos} rojos sumados${extra}.`;
    } else {
      msgGuardar = `❌ ${data.error || 'No se pudo guardar. Comprueba tu DIP.'}`;
    }
  } catch (e) {
    msgGuardar = '❌ Error de conexión. Inténtalo otra vez.';
  }
  guardandoDIP = false;
  renderPantalla();
}
function lluviaConfetti() {
  const cont = document.getElementById('confetti');
  if (!cont) return;
  cont.innerHTML = '';
  const colores = ['#FF3333', '#FF6600', '#D6CE52', '#336E45', '#3A00E1', '#4E3B70'];
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('span');
    s.className = 'shape confetti-piece';
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.width = (10 + Math.random() * 16) + 'px';
    s.style.height = (12 + Math.random() * 16) + 'px';
    s.style.color = colores[i % colores.length];
    s.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    s.style.animationDelay = (Math.random() * 0.9) + 's';
    cont.appendChild(s);
  }
  cont.classList.remove('hidden');
  setTimeout(() => { cont.classList.add('hidden'); cont.innerHTML = ''; }, 6500);
}

function screenRelacionar(s, est) {
  const b = bloquesJuego[s.bi];
  const pares = b.pares || [];
  const modo = b.modo || 'emparejar';
  if (modo === 'escribir') return screenRelacionarEscribir(s, est, pares);
  const hechas = est.hechas || {};
  // Columnas barajadas: el orden no coincide para que no estén uno al lado del otro
  const izqOrder = est.ordenIzq && est.ordenIzq.length === pares.length ? est.ordenIzq : pares.map((_, j) => j);
  const derOrder = est.ordenDer && est.ordenDer.length === pares.length ? est.ordenDer : pares.map((_, j) => j);
  const izqCls = (j) => (hechas[j] ? ' ok' : (est.izq === j ? ' sel' : ''));
  const derCls = (j) => (hechas[j] ? ' ok' : '');
  const itemIzq = (j) => pares[j].izq_img
    ? `<div class="kp-pair-img" style="background-image:url('${esc(pares[j].izq_img)}')" title="${esc(pares[j].izq || '')}"></div>`
    : esc(pares[j].izq || '…');
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔗 Relacionar</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-match">
      <div class="kp-col">${izqOrder.map((j) => `<div class="kp-pair${izqCls(j)}" onclick="kpIzq(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${itemIzq(j)}</div>`).join('')}</div>
      <div class="kp-col">${derOrder.map((j) => `<div class="kp-pair alt${derCls(j)}" onclick="kpDer(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${esc(pares[j].der || '…')}</div>`).join('')}</div>
    </div>`;
  if (pares.length > 0 && Object.keys(hechas).length >= pares.length) html += `<div class="kp-msg ok">¡Todo emparejado! 🎉</div>`;
  html += `<div class="kp-hint">👆 Toca una tarjeta de cada lado para emparejar</div></div>`;
  return html;
}

// Modo "escribir la palabra": ve el pictograma y escribe la palabra que corresponde
function screenRelacionarEscribir(s, est, pares) {
  const b = bloquesJuego[s.bi];
  const escrito = est.escrito || {};
  const done = pares.every((_, j) => escrito[j] === 'ok');
  let html = `<div class="kp-screen">
    <div class="kp-qt">✏️ Escribe la palabra</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-esc-list">`;
  pares.forEach((p, j) => {
    const st = escrito[j];
    const pista = (p.izq || '').trim();
    html += `<div class="kp-esc-item">
      <div class="kp-esc-fig">${p.izq_img
        ? `<img src="${esc(p.izq_img)}" alt="${esc(pista || p.der || '')}">`
        : `<span class="kp-esc-texto">${esc(pista || '…')}</span>`}</div>
      <div class="kp-input-row">
        <input id="kp-esc-${pantallaIdx}-${j}" class="kp-input" type="text" placeholder="Escribe la palabra…" ${st === 'ok' ? 'disabled' : ''} value="${st === 'ok' ? esc(p.der) : ''}" />
        ${st === 'ok' ? '<span class="kp-msg ok">¡Correcto! ✅</span>'
          : `<span style="display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;">${st === 'err' ? '<span class="kp-msg bad">Casi… inténtalo otra vez</span>' : ''}<button class="kp-check" onclick="kpEscribir(${pantallaIdx},${j})">Comprobar</button></span>`}
      </div>
    </div>`;
  });
  html += `</div>`;
  if (done && pares.length > 0) html += `<div class="kp-msg ok">¡Todo correcto! 🎉</div>`;
  html += `<div class="kp-hint">✏️ Escribe la palabra que corresponde a cada pictograma</div></div>`;
  return html;
}
function normaliza(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
// Intenta pasar una palabra a singular (perros→perro, flores→flor) para
// tolerar singular/plural en las respuestas.
function singulariza(p) {
  p = normaliza(p);
  if (!p || p.length <= 2) return p;
  if (p.endsWith('es')) { const b = p.slice(0, -2); if (b.length >= 2) return b; }
  else if (p.endsWith('s')) { const b = p.slice(0, -1); if (b.length >= 2) return b; }
  return p;
}
function igualPalabra(a, b) { return normaliza(a) === normaliza(b) || singulariza(a) === singulariza(b); }
function kpEscribir(idx, j) {
  const est = kpEstado[idx];
  const b = bloquesJuego[pantallas[idx].bi];
  const p = b.pares[j];
  const val = (document.getElementById('kp-esc-' + idx + '-' + j)?.value || '');
  const okk = normaliza(val) === normaliza(p.der);
  est.escrito = est.escrito || {};
  est.escrito[j] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}
function kpIzq(idx, j) {
  const est = kpEstado[idx];
  est.izq = (est.izq === j) ? null : j;
  renderPantalla();
}
function kpDer(idx, j) {
  const est = kpEstado[idx];
  if (est.izq === null) return;
  if (est.izq === j) { est.hechas[j] = true; kpScore.verdes++; }
  else kpScore.rojos++;
  est.izq = null;
  renderPantalla();
}

function screenOrdenar(s, est) {
  const b = bloquesJuego[s.bi];
  const n = (b.items || []).length;
  const done = est.orden.slice(0, est.hechas);
  const pend = est.orden.slice(est.hechas);
  let html = `<div class="kp-screen">
    <div class="kp-qt">📌 Ordena los pasos</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-steps">`;
  done.forEach((ix, k) => { html += `<div class="kp-step done"><span class="kp-num">${k + 1}</span>${esc(b.items[ix] || '…')}</div>`; });
  pend.forEach((ix) => { html += `<div class="kp-step" onclick="kpOrden(${pantallaIdx},${ix})"><span class="kp-num">?</span>${esc(b.items[ix] || '…')}</div>`; });
  html += `</div>`;
  if (est.hechas >= n) html += `<div class="kp-msg ok">¡Orden perfecto! 🎉</div>`;
  else if (est.err) html += `<div class="kp-msg bad">👀 Ese no es el siguiente paso</div>`;
  html += `<div class="kp-hint">👆 Pulsa los pasos en el orden correcto</div></div>`;
  return html;
}
function kpOrden(idx, ix) {
  const est = kpEstado[idx];
  if (est.orden[est.hechas] === ix) { est.hechas++; est.err = false; kpScore.verdes++; renderPantalla(); return; }
  kpScore.rojos++;
  est.err = true;
  renderPantalla();
  setTimeout(() => { if (kpEstado[idx]) { est.err = false; renderPantalla(); } }, 900);
}

function screenCompletar(s, est) {
  const b = bloquesJuego[s.bi];
  const estado = est.estado || {};
  const modo = b.modo || 'escribir';
  let html = `<div class="kp-screen">
    <div class="kp-qt">✏️ Completa la frase</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  (b.frases || []).forEach((f, fi) => {
    const st = estado[fi];
    html += `<div class="kp-frase">${esc(f.texto || '').replace('___', '<span class="kp-blank"></span>')}</div>`;
    if (modo === 'opciones') {
      // Opciones barajadas una sola vez por pantalla (en est.opciones)
      if (!est.opciones) est.opciones = {};
      if (!est.opciones[fi]) {
        est.opciones[fi] = [f.respuesta, ...(f.opciones || [])].filter(Boolean).sort(() => Math.random() - 0.5);
      }
      const barajadas = est.opciones[fi];
      html += `<div class="kp-chips">`;
      barajadas.forEach((op, k) => {
        const esCorrecta = st === 'ok' && op === f.respuesta;
        const esFallada = st === 'err' && est.selOpc === fi + ':' + k;
        const cls = (esCorrecta ? ' ok' : '') + (esFallada ? ' bad' : '') + (st === 'ok' && !esCorrecta ? ' muted' : '');
        html += `<button class="kp-chip${cls}" onclick="kpCompletarOpcion(${pantallaIdx},${fi},${k})">${esc(op)}</button>`;
      });
      html += `</div>`;
      if (st === 'ok') html += `<div class="kp-msg ok">¡Correcto! ✅</div>`;
      else if (st === 'err') html += `<div class="kp-msg bad">Casi… elige otra opción</div>`;
    } else {
      html += `<div class="kp-input-row">
        <input id="kp-fill-${pantallaIdx}-${fi}" class="kp-input" type="text" placeholder="Escribe la palabra…" ${st ? 'disabled' : ''} value="${st ? esc(f.respuesta) : ''}" />
        ${st === 'ok' ? '<span class="kp-msg ok">¡Correcto! ✅</span>'
          : st === 'err' ? '<span class="kp-msg bad">Casi… inténtalo otra vez</span>'
          : `<button class="kp-check" onclick="kpComprobar(${pantallaIdx},${fi})">Comprobar</button>`}
      </div>`;
    }
  });
  html += `<div class="kp-hint">${modo === 'opciones' ? '👆 Elige la palabra que falta' : '👆 Escribe la palabra que falta'}</div></div>`;
  return html;
}
function kpComprobar(idx, fi) {
  const est = kpEstado[idx];
  const b = bloquesJuego[pantallas[idx].bi];
  const f = b.frases[fi];
  const val = (document.getElementById('kp-fill-' + idx + '-' + fi)?.value || '');
  const okk = igualPalabra(val, f.respuesta);
  est.estado[fi] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}
function kpCompletarOpcion(idx, fi, k) {
  const est = kpEstado[idx];
  if (est.estado && est.estado[fi] === 'ok') return;
  const b = bloquesJuego[pantallas[idx].bi];
  const f = b.frases[fi];
  const op = (est.opciones && est.opciones[fi] && est.opciones[fi][k]) || '';
  est.selOpc = fi + ':' + k;
  const okk = igualPalabra(op, f.respuesta);
  if (!est.estado) est.estado = {};
  est.estado[fi] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

// ── Mapamundi (Leaflet + world-atlas) ───────────────────────────────
const MAP_STYLE = { color: '#b6c2d9', weight: 0.5, fillColor: '#dbeafe', fillOpacity: 0.85 };
function screenMapa(s, est) {
  const chips = (s.paises || []).map(p => `<span class="kp-chip">${esc(p)}</span>`).join('');
  return `<div class="kp-screen">
    <div class="kp-qt">🌍 Localiza en el mapamundi · ${s.qi + 1} de ${s.n}</div>
    <div class="kp-map-q">${esc(s.pide)}</div>
    <div class="kp-map" id="kp-map-${pantallaIdx}"></div>
    <div class="kp-map-chips">${chips}</div>
    <div class="kp-hint">👆 Pulsa en el mapa el país correcto. Usa la rueda del ratón o pellizca para acercar.</div>
  </div>`;
}
function destruirMapas() {
  const arr = window.__pjMapas || [];
  arr.forEach(m => { try { m.remove(); } catch (e) { /* ok */ } });
  window.__pjMapas = [];
}
function iniciarMapa(idx) {
  const s = pantallas[idx];
  const cont = document.getElementById('kp-map-' + idx);
  if (!cont || !s || s.tipo !== 'mapa') return;
  MAPA_MUNDI.cargarTodo()
    .then(() => MAPA_MUNDI.cargarGeo())
    .then(geo => {
      if (!document.body.contains(cont) || !window.L) return;
      const map = L.map(cont, { minZoom: 2, maxZoom: 6, zoomControl: true, attributionControl: false, scrollWheelZoom: true, maxBounds: [[-85, -180], [85, 180]] });
      map.setView([20, 0], 2);
      (window.__pjMapas = window.__pjMapas || []).push(map);
      const layer = L.geoJSON(geo, {
        style: MAP_STYLE,
        onEachFeature: (feat, lyr) => {
          lyr.on('click', () => kpMapa(idx, (feat.properties && feat.properties.name) || ''));
          lyr.on('mouseover', () => { if (!(kpEstado[idx] && kpEstado[idx].respondida)) lyr.setStyle({ fillColor: '#a5c8f0', color: '#64748b', weight: 1 }); });
          lyr.on('mouseout', () => { if (!(kpEstado[idx] && kpEstado[idx].respondida)) lyr.setStyle(MAP_STYLE); });
        }
      }).addTo(map);
      if (kpEstado[idx] && kpEstado[idx].respondida) {
        layer.eachLayer(ll => {
          const en = ll.feature && ll.feature.properties && ll.feature.properties.name;
          if (en === s.correctaEn) ll.setStyle({ fillColor: '#22a06b', color: '#166534', weight: 1.5, fillOpacity: 0.9 });
          else if (en === kpEstado[idx].sel) ll.setStyle({ fillColor: '#f87171', color: '#991b1b', weight: 1.5, fillOpacity: 0.9 });
        });
      }
      setTimeout(() => { try { map.invalidateSize(); } catch (e) { /* ok */ } }, 60);
    })
    .catch(() => { if (document.body.contains(cont)) cont.innerHTML = '<div class="kp-msg bad">No se pudo cargar el mapa (comprueba la conexión).</div>'; });
}
function kpMapa(idx, en) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (!est || !s || s.tipo !== 'mapa' || est.respondida) return;
  est.respondida = true;
  est.sel = en;
  est.acierto = (en === s.correctaEn);
  if (est.acierto) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  renderPantalla();
  mostrarFeedback(est.acierto, MAPA_MUNDI.esDe(s.correctaEn), function () {
    if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
    renderPantalla();
  });
}

function pantallaNext() { if (pantallaIdx < pantallas.length - 1) { pantallaIdx++; if (window.pjSonido) pjSonido.hoja(); renderPantalla(); } }
function pantallaPrev() { if (pantallaIdx > 0) { pantallaIdx--; if (window.pjSonido) pjSonido.hoja(); renderPantalla(); } }

// Cierra el reproductor pidiendo confirmación si hay partida en curso
function cerrarPlayer() {
  if (window.pjSonido) pjSonido.clic();
  const enCurso = pantallaIdx > 0 && pantallaIdx < pantallas.length - 1;
  const cerrar = () => {
    ocultarFeedback();
    document.body.classList.remove('mostrando-juego');
    if (window.__pjDesdeDetalle && actividadActual && actividadActual.id) {
      // Volvemos a la página de detalle de la que salimos
      document.body.classList.add('mostrando-detalle');
      try { history.replaceState(null, '', '/?id=' + encodeURIComponent(actividadActual.id)); } catch (e) { /* sin historial */ }
    } else {
      try { if (location.search.includes('jugar=')) history.replaceState(null, '', '/'); } catch (e) { /* sin historial */ }
    }
    window.__pjDesdeDetalle = false;
  };
  if (enCurso) {
    juniorConfirmar('¿Seguro que quieres salir? Perderás el progreso de esta partida.', cerrar);
  } else {
    cerrar();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const close = document.getElementById('player-close');
  if (close) close.addEventListener('click', cerrarPlayer);
  document.addEventListener('pointerdown', kpStart);
  document.addEventListener('pointermove', kpMove);
  document.addEventListener('pointerup', kpEnd);
  document.addEventListener('pointercancel', kpEnd);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('player-modal');
      if (modal && !modal.classList.contains('hidden')) cerrarPlayer();
    }
  });
});
