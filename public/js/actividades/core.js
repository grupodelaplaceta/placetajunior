/* Placeta Junior · Primaria Nueva · núcleo (v1.0.0)
   Contrato compartido por los motores de actividades de Primaria:
     crear(bloque) → [{s, e}]   ·   render(s, e) → HTML   ·   init()   ·   texto(s)
   Usa los globales del reproductor: kpEstado, kpScore, pantallas, pantallaIdx,
   renderPantalla(), mostrarFeedback(ok, texto, siguiente), pantallaNext().
   Regla: en las especificaciones nunca usar la clave "tipo" (la usa el motor). Se usa "k" y "modo". */
(function () {
  'use strict';
  if (window.PJPNueva) return;

  const t = (k, v) => window.PJPNI.t(k, v);
  const eur = c => window.PJPNI.eur(c);
  const lang = () => window.PJPNI.lang();

  /* ---------- utilidades ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const arr = v => (Array.isArray(v) ? v : []);
  const num = (v, d) => (v !== '' && v != null && Number.isFinite(Number(v)) ? Number(v) : d);
  const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuf = a => { const x = a.slice(); for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; } return x; };
  const D = b => (b && b.datos && typeof b.datos === 'object' ? Object.assign({}, b, b.datos) : (b || {}));
  const nivel = d => Math.floor(Math.min(3, Math.max(1, num(d.nivel, 1))));
  const cant = (d, def) => Math.floor(Math.min(12, Math.max(1, num(d.cantidad, def))));
  const pad2 = n => String(n).padStart(2, '0');
  const dgs = n => String(n).split('').reverse().map(Number);

  // Opciones numéricas: la correcta + 3 señuelos cercanos, en orden aleatorio.
  function numOpts(ans, deltas) {
    const c = new Set();
    (deltas || [1, -1, 2, -2, 5, -5, 10, -10]).forEach(d => { const x = ans + d; if (x >= 1 && x !== ans) c.add(x); });
    const others = shuf([...c]).slice(0, 3), op = shuf([ans].concat(others));
    return { op, cor: op.indexOf(ans) };
  }

  /* ---------- estado y pantalla ---------- */
  const st = idx => (typeof kpEstado !== 'undefined' ? kpEstado[idx] : undefined);
  const cur = idx => (typeof pantallas !== 'undefined' ? pantallas[idx] : undefined);
  const ref = () => { if (typeof renderPantalla === 'function') renderPantalla(); };

  // Resuelve una pantalla: suma verdes/rojos y muestra el feedback del motor.
  function resolver(idx, ok, correcta) {
    const e = st(idx);
    if (!e || e.respondida) return;
    e.respondida = true; e.acierto = !!ok;
    if (ok) { kpScore.verdes++; if (window.pjSonido) window.pjSonido.exito(); }
    else { kpScore.rojos++; if (window.pjSonido) window.pjSonido.error(); }
    renderPantalla();
    mostrarFeedback(!!ok, correcta, () => pantallaNext());
  }

  /* ---------- piezas de interfaz ---------- */
  const ICONO = { geometria: 'category', dinero: 'euro', vertical: 'calculate', abaco: 'tune', calculo_mental: 'psychology', horas: 'schedule', dados: 'casino', tesoro: 'explore', simetria_dibujo: 'flip', patron_visual: 'pattern', batalla: 'sailing', tangram: 'extension' };
  const TITULO = { geometria: 'geo.title', dinero: 'din.title', vertical: 'vert.title', abaco: 'aba.title', calculo_mental: 'cm.title', horas: 'hora.title', dados: 'dice.title', tesoro: 'tes.title', simetria_dibujo: 'sim.title', patron_visual: 'pat.title', batalla: 'bat.title', tangram: 'tan.title' };

  const cab = (k, pregunta) => `<div class="kp-qcard pn-cab"><span class="kp-orb" aria-hidden="true"></span><div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">${ICONO[k]}</span> ${esc(t(TITULO[k]))}</div><div class="kp-q">${esc(pregunta)}</div></div>`;

  const btn = (act, idx, label, cls) => `<button type="button" class="pn-btn${cls ? ' ' + cls : ''}" data-pn="${act}" data-i="${idx}">${esc(label)}</button>`;

  const tooltips = {
    hr_adj: { 'h+': 'hint.clock.hourUp', 'h-': 'hint.clock.hourDown', 'm+': 'hint.clock.minuteUp', 'm-': 'hint.clock.minuteDown' },
    hr_chk: 'hint.clock.check',
    pn_q: 'hint.answer',
    pn_show: 'hint.solution',
    v_dig: 'hint.number',
    v_del: 'hint.delete',
    v_chk: 'hint.check',
    te_run: 'hint.run',
    te_del: 'hint.undo',
    din_add: 'hint.money.add',
    din_quita: 'hint.money.remove',
    ab_bead: 'hint.abacus',
    si_cell: 'hint.symmetry'
  };
  let hintBubble = null, hintTarget = null, hintPending = null, hintTimer = 0;

  function hintFor(el) {
    const action = el.dataset.pn, value = el.dataset.v;
    if (action === 'te_add') {
      const direction = { n: 'dir.nb', s: 'dir.sb', e: 'dir.eb', o: 'dir.ob' }[value];
      return direction ? t('hint.arrow', { direction: t(direction) }) : '';
    }
    const key = tooltips[action];
    return typeof key === 'string' ? t(key) : (key && key[value] ? t(key[value]) : '');
  }

  function hideHint() {
    window.clearTimeout(hintTimer);
    hintPending = null;
    if (hintTarget) {
      const previous = hintTarget.dataset.pnHintDescription;
      if (previous) hintTarget.setAttribute('aria-describedby', previous);
      else hintTarget.removeAttribute('aria-describedby');
      delete hintTarget.dataset.pnHintDescription;
    }
    hintBubble?.remove();
    hintBubble = null;
    hintTarget = null;
  }

  function showHint(el) {
    const text = hintFor(el);
    if (!text || el.disabled || hintTarget === el) return;
    hideHint();
    hintTarget = el;
    hintBubble = document.createElement('div');
    hintBubble.className = 'pn-tooltip';
    hintBubble.id = 'pn-tooltip';
    hintBubble.setAttribute('role', 'tooltip');
    hintBubble.innerHTML = esc(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    const describedBy = el.getAttribute('aria-describedby') || '';
    el.dataset.pnHintDescription = describedBy;
    el.setAttribute('aria-describedby', `${describedBy} pn-tooltip`.trim());
    document.body.appendChild(hintBubble);
    requestAnimationFrame(() => {
      if (!hintTarget || !hintBubble) return;
      const rect = el.getBoundingClientRect(), bubble = hintBubble.getBoundingClientRect();
      const left = Math.max(12, Math.min(window.innerWidth - bubble.width - 12, rect.left + rect.width / 2 - bubble.width / 2));
      const top = rect.top >= bubble.height + 16 ? rect.top - bubble.height - 10 : Math.min(window.innerHeight - bubble.height - 12, rect.bottom + 10);
      hintBubble.style.left = `${left}px`;
      hintBubble.style.top = `${Math.max(12, top)}px`;
      hintBubble.classList.add('is-visible');
    });
  }

  document.addEventListener('pointerover', ev => {
    if (ev.pointerType === 'touch' || !matchMedia('(hover: hover)').matches) return;
    const el = ev.target?.closest?.('[data-pn]');
    if (!el || (ev.relatedTarget && el.contains(ev.relatedTarget))) return;
    window.clearTimeout(hintTimer);
    hintPending = el;
    hintTimer = window.setTimeout(() => {
      if (hintPending === el) {
        hintPending = null;
        showHint(el);
      }
    }, 240);
  });
  document.addEventListener('pointerout', ev => {
    const el = ev.target?.closest?.('[data-pn]');
    if (el && !el.contains(ev.relatedTarget)) {
      if (hintPending === el) {
        window.clearTimeout(hintTimer);
        hintPending = null;
      }
      if (hintTarget === el) hideHint();
    }
  });
  document.addEventListener('focusin', ev => {
    const el = ev.target?.closest?.('[data-pn]');
    if (el) showHint(el);
  });
  document.addEventListener('focusout', ev => {
    const el = ev.target?.closest?.('[data-pn]');
    if (el && hintTarget === el) hideHint();
  });

  // Mensaje de estado (texto traducido o texto libre en e.msg.txt)
  function msg(e) {
    const m = e && e.msg;
    if (!m) return '<p class="pn-msg" role="status" aria-live="polite"></p>';
    const c = m.ok === true ? 'ok' : m.ok === false ? 'bad' : 'info';
    const txt = m.txt != null ? m.txt : t(m.k, m.v);
    return `<p class="pn-msg ${c}" role="status" aria-live="polite">${esc(txt)}</p>`;
  }

  // Opciones tipo test. Si e.malas tiene índices, esas opciones quedan descartadas (reintento).
  function opts(idx, e, items, cor, act, label, big) {
    const malas = arr(e.malas);
    return `<div class="pn-opts${big ? ' big' : ''}" role="group" aria-label="${esc(t('options.label'))}">${items.map((it, j) => {
      let c = 'pn-opt';
      if (e.respondida) { if (j === cor) c += ' ok'; else if (e.sel === j) c += ' bad'; }
      else if (malas.includes(j)) c += ' bad';
      const dis = e.respondida || malas.includes(j);
      return `<button type="button" class="${c}" data-pn="${act}" data-i="${idx}" data-v="${j}"${dis ? ' disabled' : ''}>${label(it)}</button>`;
    }).join('')}</div>`;
  }

  /* ---------- registro de tipos ---------- */
  const REG = {};   // tipo → { crear, render, texto }
  const ACT = {};   // acción (data-pn) → función(idx, valor, elemento)

  /* ---------- acciones genéricas ---------- */
  // Respuesta de test. Si la pantalla es de reintento, una respuesta errónea no cierra la pantalla.
  ACT.pn_q = (idx, v) => {
    const s = cur(idx), e = st(idx);
    if (!s || !e || e.respondida) return;
    const j = Number(v);
    if (s.reintentar && j !== s.cor) { e.malas = arr(e.malas).concat([j]); e.sel = j; e.msg = { k: 'tryagain', ok: false }; return ref(); }
    e.sel = j;
    if (s.c != null) e.disparo = s.c;
    const ok = j === s.cor && (!s.reintentar || arr(e.malas).length === 0);
    resolver(idx, ok, s.sol);
  };
  ACT.pn_show = idx => {
    const s = cur(idx), e = st(idx);
    if (!s || !e || e.respondida) return;
    resolver(idx, false, s.sol);
  };

  /* ---------- delegación de eventos (una sola vez) ---------- */
  document.addEventListener('click', ev => {
    const el = ev.target && ev.target.closest ? ev.target.closest('[data-pn]') : null;
    if (!el || el.disabled) return;
    hideHint();
    const fn = ACT[el.getAttribute('data-pn')];
    if (!fn) return;
    ev.preventDefault();
    fn(Number(el.getAttribute('data-i')), el.getAttribute('data-v'), el);
    const restoreFocus = () => {
      if (document.activeElement !== document.body || document.querySelector('.kp-fb-card, dialog[open]')) return;
      const stage = document.querySelector('.kp-stage') || document.querySelector('.pn-screen');
      if (!stage) return;
      const sameAction = Array.from(stage.querySelectorAll('[data-pn]')).find(candidate =>
        candidate.dataset.pn === el.dataset.pn && candidate.dataset.i === el.dataset.i && candidate.dataset.v === el.dataset.v && !candidate.disabled
      );
      const target = sameAction || stage.querySelector('.pn-msg');
      if (target) {
        if (!target.hasAttribute('tabindex') && target.classList.contains('pn-msg')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    };
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(restoreFocus);
  });

  // Teclado físico para la operación vertical
  document.addEventListener('keydown', ev => {
    if (ev.target && ev.target.closest && ev.target.closest('input, textarea, select, [contenteditable="true"]')) return;
    const g = document.querySelector('.pn-vgrid');
    if (!g) return;
    const idx = Number(g.getAttribute('data-i')), e = st(idx);
    if (!e || e.respondida) return;
    if (/^[0-9]$/.test(ev.key)) { ev.preventDefault(); ACT.v_dig(idx, ev.key); }
    else if (ev.key === 'Backspace') { ev.preventDefault(); ACT.v_del(idx); }
    else if (ev.key === 'Enter') { ev.preventDefault(); ACT.v_chk(idx); }
  });

  /* ---------- API pública ---------- */
  const TIPOS = new Set();

  window.PJPNueva = {
    version: '1.0.0',
    TIPOS,

    // Convierte un bloque JSON en pantallas. Cada pantalla: { s (especificación), e (estado inicial) }.
    crear(b) {
      const k = b && b.tipo;
      if (!REG[k]) return [];
      const specs = REG[k].crear(D(b));
      return specs.map((x, i) => ({
        s: Object.assign({ k, qi: i, n: specs.length }, x.s),
        e: Object.assign({ respondida: false, acierto: null, sel: null, msg: null, malas: [] }, x.e || {})
      }));
    },

    render(s, e) {
      const def = REG[s.k];
      const idx = typeof pantallaIdx !== 'undefined' ? pantallaIdx : 0;
      return `<div class="kp-screen pn-screen" data-pn-type="${esc(s.k)}">${def ? def.render(s, e || {}, idx) : ''}</div>`;
    },

    init() { /* sin efectos al entrar: todo es interacción táctil */ },

    texto(s) {
      const def = REG[s.k];
      return t(TITULO[s.k] || 'geo.title') + '. ' + (def && def.texto ? def.texto(s) : '');
    }
  };

  // Lo usan los motores de matemáticas y retos.
  window.PJPNCore = {
    h: { t, eur, lang, esc, arr, num, ri, pick, shuf, D, nivel, cant, pad2, dgs, numOpts, st, cur, ref, resolver, msg, btn, cab, opts },
    reg(tipo, def) {
      REG[tipo] = def;
      TIPOS.add(tipo);
      Object.keys(def.act || {}).forEach(a => { ACT[a] = def.act[a]; });
    },
    act: ACT
  };
})();
