/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Reproductor jugable (web pública)
   Abre una actividad publicada y permite jugarla tal y como la verá el niño.
   ═══════════════════════════════════════════════════════════════════ */

let pantallas = [];
let pantallaIdx = 0;
let kpEstado = [];
let bloquesJuego = [];

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
  const validas = (palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const maxLen = validas.length ? Math.max(...validas.map(p => p.length)) : 3;
  const size = Math.max(Number(tamano) || 10, maxLen + 1, 8);
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const colocar = (palabra) => {
    const L = palabra.length;
    if (Math.random() < 0.6) {
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * (size - L + 1));
      let ok = true;
      for (let k = 0; k < L; k++) { const c = grid[row][col + k]; if (c && c !== palabra[k]) ok = false; }
      if (ok) for (let k = 0; k < L; k++) grid[row][col + k] = palabra[k];
      return ok;
    } else {
      const col = Math.floor(Math.random() * size);
      const row = Math.floor(Math.random() * (size - L + 1));
      let ok = true;
      for (let k = 0; k < L; k++) { const c = grid[row + k][col]; if (c && c !== palabra[k]) ok = false; }
      if (ok) for (let k = 0; k < L; k++) grid[row + k][col] = palabra[k];
      return ok;
    }
  };
  validas.forEach((p) => { for (let t = 0; t < 30 && !colocar(p); t++) { /* reintentar */ } });
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = abc[Math.floor(Math.random() * 26)];
  return { grid, size };
}

// ── Abrir el juego de una actividad publicada ────────────────────────
function abrirJuego(act) {
  bloquesJuego = (act && act.contenido && act.contenido.bloques) ? act.contenido.bloques : [];
  if (!bloquesJuego.length) { alert('Esta actividad aún no tiene contenido jugable.'); return; }
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
    } else if (b.tipo === 'sopa_letras') {
      const { grid, size } = generarSopa(b.palabras, b.tamano);
      pantallas.push({ tipo: 'sopa', bi, grid, size });
      kpEstado.push({ encontradas: {} });
    } else if (b.tipo === 'relacionar') {
      pantallas.push({ tipo: 'relacionar', bi });
      kpEstado.push({ izq: null, hechas: {} });
    } else if (b.tipo === 'ordenar') {
      pantallas.push({ tipo: 'ordenar', bi });
      kpEstado.push({ orden: shuffleArr((b.items || []).map((_, k) => k)), hechas: 0 });
    } else if (b.tipo === 'completar') {
      pantallas.push({ tipo: 'completar', bi });
      kpEstado.push({ estado: {} });
    }
  });

  pantallaIdx = 0;
  renderPantalla();
  const m = document.getElementById('player-modal');
  if (m) m.classList.remove('hidden');
}

function renderPantalla() {
  const s = pantallas[pantallaIdx];
  const est = kpEstado[pantallaIdx] || {};
  let cuerpo = '';
  if (s.tipo === 'portada') cuerpo = screenPortada(s);
  else if (s.tipo === 'test') cuerpo = screenTest(s, est);
  else if (s.tipo === 'sopa') cuerpo = screenSopa(s, est);
  else if (s.tipo === 'relacionar') cuerpo = screenRelacionar(s, est);
  else if (s.tipo === 'ordenar') cuerpo = screenOrdenar(s, est);
  else if (s.tipo === 'completar') cuerpo = screenCompletar(s, est);
  document.getElementById('player-content').innerHTML = `
    <div class="kp-nav">
      <button class="kp-nav-btn" onclick="pantallaPrev()" ${pantallaIdx === 0 ? 'disabled' : ''}>←</button>
      <span class="kp-dots">${pantallas.map((_, i) => `<span class="kp-dot ${i === pantallaIdx ? 'on' : ''}"></span>`).join('')}</span>
      <button class="kp-nav-btn" onclick="pantallaNext()" ${pantallaIdx === pantallas.length - 1 ? 'disabled' : ''}>→</button>
    </div>
    <div class="kp-stage">${cuerpo}</div>`;
}

function screenPortada(s) {
  return `
    <div class="kp-screen">
      <div class="kp-cover cover-${chipColor(s.cat)}">${emojiCat(s.cat)}</div>
      <h3 class="kp-title">${esc(s.tit)}</h3>
      <p class="kp-desc">${esc(s.desc)}</p>
      <div class="kp-chips">
        <span class="kp-chip chip-${chipColor(s.cat)}">${esc(s.cat)}</span>
        <span class="kp-chip">👧 ${esc(s.edad)}</span>
        <span class="kp-chip">⭐ ${esc(s.dif)}</span>
        <span class="kp-chip">⏱️ ${esc(s.tiempo)} min</span>
      </div>
      <div class="kp-hint">👆 ¡Pulsa los botones para responder!</div>
    </div>`;
}

function screenTest(s, est) {
  const b = bloquesJuego[s.bi];
  const p = b.preguntas[s.pi];
  let html = `<div class="kp-screen">
    <div class="kp-qt">📝 Pregunta ${s.pi + 1} de ${s.nPreg}</div>
    <div class="kp-q">${esc(p.pregunta || '…')}</div>`;
  if (p.imagen_url) html += kpImg(p.imagen_url, p.fuente);
  html += `<div class="kp-opts">`;
  p.opciones.forEach((op, k) => {
    let cls = 'kp-opt';
    if (est.respondida) {
      if (k === p.correcta) cls += ' ok';
      else if (k === est.sel) cls += ' bad';
      else cls += ' muted';
    }
    html += `<div class="${cls}" onclick="kpResponder(${pantallaIdx},${k})">${est.respondida && k === p.correcta ? '✅ ' : ''}${esc(op || '…')}</div>`;
  });
  html += `</div>`;
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : '¡Casi! La correcta es: ' + esc(p.opciones[p.correcta]) + ' 💪'}</div>`;
  }
  html += `</div>`;
  return html;
}
function kpResponder(idx, k) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (est.respondida) return;
  est.respondida = true;
  est.sel = k;
  est.acierto = (k === bloquesJuego[s.bi].preguntas[s.pi].correcta);
  renderPantalla();
}

function screenSopa(s, est) {
  const b = bloquesJuego[s.bi];
  const enc = est.encontradas || {};
  const validas = (b.palabras || []).filter(Boolean);
  const chips = validas.map((p, j) => {
    const encontrada = !!enc[j];
    return `<span class="kp-chip ${encontrada ? 'ok' : ''}" onclick="kpPalabra(${pantallaIdx},${j})">${encontrada ? '✅ ' : ''}${esc(String(p).toUpperCase())}</span>`;
  }).join('');
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔤 Sopa de letras</div>
    <div class="kp-wordchips">${chips}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-grid" style="grid-template-columns:repeat(${s.size},1fr);">${s.grid.flat().map(c => `<span class="kp-cell">${esc(c)}</span>`).join('')}</div>`;
  if (validas.length > 0 && Object.keys(enc).length >= validas.length) html += `<div class="kp-msg ok">¡Has encontrado todas! 🎉</div>`;
  html += `<div class="kp-hint">👆 Toca cada palabra cuando la encuentres</div></div>`;
  return html;
}
function kpPalabra(idx, j) {
  const est = kpEstado[idx];
  if (est.encontradas[j]) delete est.encontradas[j];
  else est.encontradas[j] = true;
  renderPantalla();
}

function screenRelacionar(s, est) {
  const b = bloquesJuego[s.bi];
  const hechas = est.hechas || {};
  const izqCls = (j) => (hechas[j] ? ' ok' : (est.izq === j ? ' sel' : ''));
  const derCls = (j) => (hechas[j] ? ' ok' : '');
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔗 Relacionar</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  html += `<div class="kp-match">
      <div class="kp-col">${(b.pares || []).map((p, j) => `<div class="kp-pair${izqCls(j)}" onclick="kpIzq(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${esc(p.izq || '…')}</div>`).join('')}</div>
      <div class="kp-col">${(b.pares || []).map((p, j) => `<div class="kp-pair alt${derCls(j)}" onclick="kpDer(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${esc(p.der || '…')}</div>`).join('')}</div>
    </div>`;
  if ((b.pares || []).length > 0 && Object.keys(hechas).length >= b.pares.length) html += `<div class="kp-msg ok">¡Todo emparejado! 🎉</div>`;
  html += `<div class="kp-hint">👆 Toca una tarjeta de cada lado para emparejar</div></div>`;
  return html;
}
function kpIzq(idx, j) {
  const est = kpEstado[idx];
  est.izq = (est.izq === j) ? null : j;
  renderPantalla();
}
function kpDer(idx, j) {
  const est = kpEstado[idx];
  if (est.izq === null) return;
  if (est.izq === j) est.hechas[j] = true;
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
  if (est.orden[est.hechas] === ix) { est.hechas++; est.err = false; renderPantalla(); return; }
  est.err = true;
  renderPantalla();
  setTimeout(() => { if (kpEstado[idx]) { est.err = false; renderPantalla(); } }, 900);
}

function screenCompletar(s, est) {
  const b = bloquesJuego[s.bi];
  const estado = est.estado || {};
  let html = `<div class="kp-screen">
    <div class="kp-qt">✏️ Completa la frase</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente);
  (b.frases || []).forEach((f, fi) => {
    const st = estado[fi];
    html += `<div class="kp-frase">${esc(f.texto || '').replace('___', '<span class="kp-blank"></span>')}</div>`;
    html += `<div class="kp-input-row">
      <input id="kp-fill-${pantallaIdx}-${fi}" class="kp-input" type="text" placeholder="Escribe la palabra…" ${st ? 'disabled' : ''} value="${st ? esc(f.respuesta) : ''}" />
      ${st === 'ok' ? '<span class="kp-msg ok">¡Correcto! ✅</span>'
        : st === 'err' ? '<span class="kp-msg bad">Casi… inténtalo otra vez</span>'
        : `<button class="kp-check" onclick="kpComprobar(${pantallaIdx},${fi})">Comprobar</button>`}
    </div>`;
  });
  html += `<div class="kp-hint">👆 Escribe la palabra que falta</div></div>`;
  return html;
}
function kpComprobar(idx, fi) {
  const est = kpEstado[idx];
  const b = bloquesJuego[pantallas[idx].bi];
  const f = b.frases[fi];
  const val = (document.getElementById('kp-fill-' + idx + '-' + fi)?.value || '').trim().toLowerCase();
  est.estado[fi] = (val === (f.respuesta || '').trim().toLowerCase()) ? 'ok' : 'err';
  renderPantalla();
}

function pantallaNext() { if (pantallaIdx < pantallas.length - 1) { pantallaIdx++; renderPantalla(); } }
function pantallaPrev() { if (pantallaIdx > 0) { pantallaIdx--; renderPantalla(); } }

document.addEventListener('DOMContentLoaded', () => {
  const close = document.getElementById('player-close');
  if (close) close.addEventListener('click', () => document.getElementById('player-modal')?.classList.add('hidden'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('player-modal')?.classList.add('hidden');
  });
});
