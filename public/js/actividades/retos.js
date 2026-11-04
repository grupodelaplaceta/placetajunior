/* Placeta Junior · Primaria Nueva · tipos B
   tesoro (orientación) · simetria_dibujo · patron_visual · batalla · tangram */
(function () {
  'use strict';
  const C = window.PJPNCore; if (!C) return;
  const { t, eur, esc, arr, num, ri, pick, shuf, nivel, cant, numOpts, st, cur, ref, resolver, msg, btn, cab, opts } = C.h;

  /* =========================================================
     7 · MAPA DEL TESORO (orientación: norte, sur, este, oeste)
     Modo "pista": se lee la pista y se marca la casilla del tesoro.
     Modo "programar": se escriben flechas o se traza una ruta por las casillas.
     El tesoro no se muestra nunca en el mapa (sin chivatos).
     ========================================================= */
  const DIR = { n: [0, -1], s: [0, 1], e: [1, 0], o: [-1, 0] };
  const ARROW = { n: '↑', s: '↓', e: '→', o: '←' };
  const LM = [['palmera', 'palm_tree'], ['roca', 'landscape'], ['barco', 'sailing'], ['faro', 'light']];

  function genMapa(lv) {
    const W = lv === 3 ? 7 : 6, H = lv === 1 ? 4 : 5;
    for (let k = 0; k < 600; k++) {
      const usado = new Set(), lms = [];
      while (lms.length < 4) {
        const x = ri(0, W - 1), y = ri(0, H - 1), key = x + ',' + y;
        if (usado.has(key)) continue;
        usado.add(key); lms.push({ x, y, id: LM[lms.length][0], e: LM[lms.length][1] });
      }
      const S = pick(lms), dx = ri(-3, 3), dy = ri(-2, 2);
      if ((dx === 0 && dy === 0) || Math.abs(dx) + Math.abs(dy) < 2) continue;
      const Tx = S.x + dx, Ty = S.y + dy;
      if (Tx < 0 || Tx >= W || Ty < 0 || Ty >= H || usado.has(Tx + ',' + Ty)) continue;
      const moves = [];
      if (dx) moves.push({ d: dx > 0 ? 'e' : 'o', n: Math.abs(dx) });
      if (dy) moves.push({ d: dy > 0 ? 's' : 'n', n: Math.abs(dy) });
      return { W, H, lms, S: { x: S.x, y: S.y, id: S.id }, T: { x: Tx, y: Ty }, moves };
    }
    return { W: 6, H: 5, lms: [{ x: 0, y: 0, id: 'palmera', e: 'palm_tree' }, { x: 4, y: 0, id: 'roca', e: 'landscape' }, { x: 0, y: 4, id: 'barco', e: 'sailing' }, { x: 4, y: 4, id: 'faro', e: 'light' }], S: { x: 0, y: 0, id: 'palmera' }, T: { x: 2, y: 2 }, moves: [{ d: 'e', n: 2 }, { d: 's', n: 2 }] };
  }

  const clausula = mv => mv.n + ' ' + t(mv.n === 1 ? 'tes.cas1' : 'tes.casn') + ' ' + t('dir.' + mv.d);
  const textoPista = s => t('tes.clue', { s: t('lm.' + s.S.id), m: s.moves.map(clausula).join(t('tes.and')) });

  function crearTesoro(d) {
    const MODOS = ['pista', 'programar', 'dibujar'], out = [], lv = nivel(d);
    for (let i = 0; i < cant(d, 3); i++) {
      const modo = MODOS.includes(d.modo) ? d.modo : MODOS[i % 2];
      const m = genMapa(lv);
      out.push({ s: Object.assign({ modo, sol: '' }, m), e: { malas: [], prog: [], trazo: [], fallos: 0 } });
    }
    out.forEach(x => { x.s.sol = textoPista(x.s); });
    return out;
  }

  // Recorre el mapa con las flechas. Devuelve la casilla final y el camino (sólo casillas dentro del mapa).
  function recorrer(s, prog) {
    let x = s.S.x, y = s.S.y; const camino = []; let fuera = false;
    for (const d of prog) {
      x += DIR[d][0]; y += DIR[d][1];
      if (x < 0 || y < 0 || x >= s.W || y >= s.H) { fuera = true; break; }
      camino.push(x + ',' + y);
    }
    return { x, y, camino, fuera };
  }

  function rTesoro(s, e, idx) {
    const camino = s.modo === 'dibujar' ? arr(e.trazo) : s.modo === 'programar' ? recorrer(s, arr(e.prog)).camino : [];
    const puedes = !e.respondida;
    let mapa = `<div class="pn-tgrid${s.modo === 'dibujar' ? ' pn-draw-grid' : ''}" style="grid-template-columns:repeat(${s.W},1fr)">`;
    for (let y = 0; y < s.H; y++) for (let x = 0; x < s.W; x++) {
      const key = x + ',' + y, lm = s.lms.find(q => q.x === x && q.y === y);
      const esS = s.S.x === x && s.S.y === y, malo = arr(e.malas).includes(key), paso = camino.indexOf(key);
      let cls = 'pn-tcell';
      if (lm) cls += ' lm'; if (esS) cls += ' start'; if (malo) cls += ' miss'; if (paso >= 0) cls += ' path';
      const dentro = lm ? `<span class="material-symbols-rounded" aria-hidden="true">${lm.e}</span>` : paso >= 0 ? `<b>${paso + 1}</b>` : '';
      const etiqueta = lm ? t('lm.' + lm.id) : (x + 1) + ', ' + (y + 1);
      if (s.modo === 'pista' && puedes && !lm && !malo) mapa += `<button type="button" class="${cls}" data-pn="te_cell" data-i="${idx}" data-v="${key}" aria-label="${esc(etiqueta)}">${dentro}</button>`;
      else if (s.modo === 'dibujar' && puedes) mapa += `<button type="button" class="${cls}" data-pn="te_drawcell" data-i="${idx}" data-v="${key}" aria-label="${esc(etiqueta)}">${dentro}</button>`;
      else mapa += `<span class="${cls}" aria-label="${esc(etiqueta)}">${dentro}</span>`;
    }
    mapa += '</div>';
    const pista = `<p class="pn-clue">${esc(textoPista(s))}</p>`;
    const brujula = `<div class="pn-compass" aria-hidden="true">${[['n', '↑'], ['s', '↓'], ['e', '→'], ['o', '←']].map(([d, a]) => `<span>${esc(t('dir.' + d + 'b'))} ${a}</span>`).join('')}</div>`;
    if (s.modo === 'pista') return cab('tesoro', t('tes.clue_q')) + pista + brujula + mapa + `<div class="pn-row">${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
    const flechas = s.modo === 'programar' ? ['n', 's', 'e', 'o'].map(d => `<button type="button" class="pn-arrow" data-pn="te_add" data-i="${idx}" data-v="${d}" aria-label="${esc(t('dir.' + d + 'b'))}"${puedes ? '' : ' disabled'}>${ARROW[d]}</button>`).join('') : '';
    const route = s.modo === 'dibujar' ? arr(e.trazo).map((cell, j) => `<span class="pn-chip">${j + 1}</span>`) : arr(e.prog).map(d => `<span class="pn-chip">${ARROW[d]}</span>`);
    const ruta = route.join('') || '<span class="pn-empty">—</span>';
    return cab('tesoro', t(s.modo === 'dibujar' ? 'tes.draw_q' : 'tes.prog_q')) + pista + brujula + mapa +
      (flechas ? `<div class="pn-arrows" role="group">${flechas}</div>` : `<p class="pn-hint">${esc(t('tes.draw_hint'))}</p>`) +
      `<div class="pn-seq" aria-label="${esc(t('tes.route'))}">${ruta}</div>` +
      `<div class="pn-row">${btn('te_del', idx, t('tes.undo'), 'ghost')}${btn('te_run', idx, t('tes.run'), 'primary')}${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  function drawStep(s, e, key) {
    const [x, y] = key.split(',').map(Number), route = arr(e.trazo), last = route.length ? route[route.length - 1].split(',').map(Number) : [s.S.x, s.S.y];
    if (route.length && key === route[route.length - 1]) return;
    if (route.length && key === (route.length > 1 ? route[route.length - 2] : s.S.x + ',' + s.S.y)) {
      e.trazo = route.slice(0, -1); e.msg = null; return true;
    }
    if (Math.abs(x - last[0]) + Math.abs(y - last[1]) !== 1 || route.includes(key) || route.length >= 24) return;
    e.trazo = route.concat([key]); e.msg = null; return true;
  }

  function trazoDirections(s, route) {
    let from = s.S;
    return arr(route).map(key => {
      const [x, y] = key.split(',').map(Number), direction = x > from.x ? 'e' : x < from.x ? 'o' : y > from.y ? 's' : 'n';
      from = { x, y };
      return direction;
    });
  }

  const TESORO_ACT = {
    te_cell(idx, v) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      if (v === s.T.x + ',' + s.T.y) return resolver(idx, !(e.fallos > 0), s.sol);
      e.malas = arr(e.malas).concat([v]); e.fallos = (e.fallos || 0) + 1;
      e.msg = { k: 'tes.miss', ok: false }; ref();
    },
    te_drawcell(idx, v) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      if (drawStep(s, e, v)) ref();
    },
    te_add(idx, v) { const e = st(idx); if (!e || e.respondida || arr(e.prog).length >= 12) return; e.prog = arr(e.prog).concat([v]); e.msg = null; ref(); },
    te_del(idx) { const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return; if (s.modo === 'dibujar') e.trazo = arr(e.trazo).slice(0, -1); else e.prog = arr(e.prog).slice(0, -1); e.msg = null; ref(); },
    te_run(idx) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const w = recorrer(s, s.modo === 'dibujar' ? trazoDirections(s, e.trazo) : arr(e.prog));
      if (w.fuera) { e.fallos = (e.fallos || 0) + 1; e.msg = { k: 'tes.off', ok: false }; return ref(); }
      if (w.x === s.T.x && w.y === s.T.y) return resolver(idx, !(e.fallos > 0), s.sol);
      e.fallos = (e.fallos || 0) + 1; e.msg = { k: 'tes.no', ok: false }; ref();
    }
  };

  let drawingIndex = null;
  document.addEventListener('pointerdown', event => {
    const cell = event.target.closest && event.target.closest('[data-pn="te_drawcell"]');
    if (!cell) return;
    const idx = Number(cell.dataset.i), s = cur(idx), e = st(idx);
    if (!s || !e || e.respondida || s.modo !== 'dibujar') return;
    e.drawing = true; drawingIndex = idx;
    drawStep(s, e, cell.dataset.v);
    cell.classList.toggle('path', arr(e.trazo).includes(cell.dataset.v));
  });
  document.addEventListener('pointerover', event => {
    const cell = event.target.closest && event.target.closest('[data-pn="te_drawcell"]');
    if (!cell) return;
    const idx = Number(cell.dataset.i), s = cur(idx), e = st(idx);
    if (!s || !e || !e.drawing || e.respondida || s.modo !== 'dibujar') return;
    drawStep(s, e, cell.dataset.v);
    cell.classList.toggle('path', arr(e.trazo).includes(cell.dataset.v));
  });
  const finishDrawing = () => {
    if (drawingIndex === null) return;
    const e = st(drawingIndex);
    if (e) { e.drawing = false; ref(); }
    drawingIndex = null;
  };
  document.addEventListener('pointerup', finishDrawing);
  document.addEventListener('pointercancel', finishDrawing);

  /* =========================================================
     8 · SIMETRÍA CON DIBUJO: completar el reflejo (eje vertical u horizontal)
     ========================================================= */
  const mirrorK = (s, x, y) => (s.eje === 'v' ? (s.W - 1 - x) + ',' + y : x + ',' + (s.H - 1 - y));
  const esDestino = (s, x, y) => (s.eje === 'v' ? x >= s.W / 2 : y >= s.H / 2);

  function crearSimetria(d) {
    const out = [], lv = nivel(d), mitad = lv === 1 ? 3 : lv === 2 ? 4 : 5, H = lv === 1 ? 4 : 6;
    for (let i = 0; i < cant(d, 3); i++) {
      const eje = d.eje === 'h' || d.eje === 'v' ? d.eje : (i % 2 ? 'h' : 'v');
      const W = eje === 'v' ? mitad * 2 : mitad * 2, Hh = eje === 'v' ? H : H;
      const probe = { eje, W, H: Hh };
      let fill = [];
      for (let k = 0; k < 60; k++) {
        fill = [];
        for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
          if (esDestino(probe, x, y)) continue;
          if (Math.random() < 0.45) fill.push(x + ',' + y);
        }
        if (fill.length >= 3) break;
      }
      out.push({ s: { eje, W, H: Hh, fill, sol: t('sim.sol') }, e: { pint: [], bad: [], fallos: 0 } });
    }
    return out;
  }

  function rSimetria(s, e, idx) {
    const fill = new Set(s.fill), bad = new Set(arr(e.bad)), pint = new Set(arr(e.pint));
    let g = `<div class="pn-sgrid ${s.eje === 'v' ? 'ax-v' : 'ax-h'}" style="grid-template-columns:repeat(${s.W},1fr)" role="grid" aria-label="${esc(t('sim.axis', { a: t(s.eje === 'v' ? 'sim.axv' : 'sim.axh') }))}">`;
    for (let y = 0; y < s.H; y++) for (let x = 0; x < s.W; x++) {
      const k = x + ',' + y, borde = (s.eje === 'v' && x === s.W / 2 - 1) ? ' edge-v' : (s.eje === 'h' && y === s.H / 2 - 1) ? ' edge-h' : '';
      if (esDestino(s, x, y)) {
        const on = pint.has(k) ? ' on' : '', mal = bad.has(k) ? ' bad' : '';
        const label = t('sim.cell', { x: x + 1, y: y + 1 });
        g += e.respondida ? `<span class="pn-scell tgt${on}${mal}${borde}" aria-label="${esc(label)}"></span>` : `<button type="button" class="pn-scell tgt${on}${mal}${borde}" data-pn="si_cell" data-i="${idx}" data-v="${k}" aria-label="${esc(label)}" aria-pressed="${pint.has(k)}"></button>`;
      } else {
        g += `<span class="pn-scell src${fill.has(k) ? ' on' : ''}${borde}"></span>`;
      }
    }
    g += '</div>';
    const eje = t('sim.axis', { a: t(s.eje === 'v' ? 'sim.axv' : 'sim.axh') });
    return cab('simetria_dibujo', t('sim.q')) + `<p class="pn-hint">${esc(eje)}</p>` + g +
      `<div class="pn-row">${btn('si_chk', idx, t('check'), 'primary')}${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  const SIM_ACT = {
    si_cell(idx, v) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const [x, y] = v.split(',').map(Number); if (!esDestino(s, x, y)) return;
      const lista = arr(e.pint);
      e.pint = lista.includes(v) ? lista.filter(q => q !== v) : lista.concat([v]);
      e.bad = []; e.msg = null; ref();
    },
    si_chk(idx) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const fill = new Set(s.fill), pint = new Set(arr(e.pint)), mal = [];
      for (let y = 0; y < s.H; y++) for (let x = 0; x < s.W; x++) {
        if (!esDestino(s, x, y)) continue;
        const k = x + ',' + y;
        if (fill.has(mirrorK(s, x, y)) !== pint.has(k)) mal.push(k);
      }
      if (!mal.length) return resolver(idx, !(e.fallos > 0), s.sol);
      e.bad = mal; e.fallos = (e.fallos || 0) + 1; e.msg = { k: 'sim.bad', ok: false }; ref();
    }
  };

  /* =========================================================
     9 · PATRONES VISUALES: formas que se repiten y series numéricas
     ========================================================= */
  const FORMAS = ['circle', 'square', 'triangle', 'star'];
  const COLORES = ['#ef4444', '#3b82f6', '#22c55e', '#facc15'];
  const COLOR_KEY = { '#ef4444': 'color.red', '#3b82f6': 'color.blue', '#22c55e': 'color.green', '#facc15': 'color.yellow' };
  const nombreFicha = v => t('f.' + v.f) + ', ' + t(COLOR_KEY[v.c]);
  const starPts = (() => { const p = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 18 : 44, a = -Math.PI / 2 + i * Math.PI / 5; p.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (52 + r * Math.sin(a)).toFixed(1)); } return p.join(' '); })();
  const FIG = {
    circle: c => `<circle cx="50" cy="50" r="38" fill="${c}"/>`,
    square: c => `<rect x="14" y="14" width="72" height="72" rx="8" fill="${c}"/>`,
    triangle: c => `<polygon points="50,10 92,86 8,86" fill="${c}"/>`,
    star: c => `<polygon points="${starPts}" fill="${c}"/>`
  };
  const tileSVG = (f, c) => `<svg class="pn-tile-svg" viewBox="0 0 100 100" aria-hidden="true">${FIG[f](c)}</svg>`;

  function crearPatron(d) {
    const out = [], lv = nivel(d);
    for (let i = 0; i < cant(d, 4); i++) {
      const modo = d.modo === 'formas' || d.modo === 'num' ? d.modo : (i % 2 ? 'num' : 'formas');
      if (modo === 'formas') {
        const Lu = lv === 1 ? 2 : 3, unidad = [];
        while (unidad.length < Lu) { const c = { f: pick(FORMAS), c: pick(COLORES) }; if (!unidad.some(u => u.f === c.f && u.c === c.c)) unidad.push(c); }
        const seq = Array.from({ length: 7 }, (_, j) => unidad[j % Lu]), q = ri(3, 6), ans = seq[q];
        const otras = [];
        for (const f of FORMAS) for (const c of COLORES) {
          if (f !== ans.f || c !== ans.c) otras.push({ f, c });
        }
        const op = shuf([ans].concat(shuf(otras).slice(0, 3)));
        out.push({ s: { modo, seq: seq.slice(0, 7), q, op, cor: op.indexOf(ans), sol: '' } });
      } else {
        const paso = lv === 1 ? ri(1, 3) : ri(2, 5), a0 = ri(1, 9), seq = Array.from({ length: 6 }, (_, j) => a0 + paso * j), q = ri(2, 5), ans = seq[q];
        const set = new Set([ans]);
        [ans + paso, ans - paso, ans + 1, ans - 1, ans + 2 * paso].forEach(x => { if (set.size < 4 && x >= 1) set.add(x); });
        const op = shuf([...set]);
        out.push({ s: { modo, seq, q, op, cor: op.indexOf(ans), sol: String(ans) } });
      }
    }
    return out;
  }

  function rPatron(s, e, idx) {
    const fichas = s.seq.map((v, j) => {
      if (j === s.q) return '<span class="pn-tile ask" role="img" aria-label="?">?</span>';
      return s.modo === 'num' ? `<span class="pn-tile num">${v}</span>` : `<span class="pn-tile" role="img" aria-label="${esc(nombreFicha(v))}">${tileSVG(v.f, v.c)}</span>`;
    }).join('');
    const etiqueta = s.modo === 'num' ? (v => esc(String(v))) : (v => `<span role="img" aria-label="${esc(nombreFicha(v))}">${tileSVG(v.f, v.c)}</span>`);
    return cab('patron_visual', s.modo === 'num' ? t('pat.num') : t('pat.shape')) +
      `<div class="pn-seq-tiles">${fichas}</div>` + opts(idx, e, s.op, s.cor, 'pn_q', etiqueta, true) + msg(e);
  }

  /* =========================================================
     10 · HUNDIR LA FLOTA (matemáticas): cada operación da la casilla donde se dispara
     ========================================================= */
  const preguntaBat = c => {
    if (c >= 2 && Math.random() < 0.6) { const a = ri(1, c - 1); return t('bat.add', { a, b: c - a }); }
    const b = ri(1, 9); return t('bat.sub', { a: c + b, b });
  };

  function crearBatalla(d) {
    const lv = nivel(d), N = lv === 1 ? 4 : lv === 2 ? 5 : 6;
    const BARCOS = N === 4 ? [3, 2] : N === 5 ? [3, 2, 2] : [4, 3, 2];
    let barcos = null;
    for (let k = 0; k < 400 && !barcos; k++) {
      const ocupadas = new Set(), tmp = []; let ok = true;
      for (const len of BARCOS) {
        let puesto = false;
        for (let tr = 0; tr < 80 && !puesto; tr++) {
          const hz = Math.random() < 0.5, x = ri(0, hz ? N - len : N - 1), y = ri(0, hz ? N - 1 : N - len), celdas = [];
          for (let j = 0; j < len; j++) celdas.push((hz ? y * N + x + j : (y + j) * N + x) + 1);
          if (celdas.some(c => ocupadas.has(c))) continue;
          celdas.forEach(c => ocupadas.add(c)); tmp.push(celdas); puesto = true;
        }
        if (!puesto) { ok = false; break; }
      }
      if (ok) barcos = tmp;
    }
    if (!barcos) barcos = BARCOS.map((len, i) => Array.from({ length: len }, (_, j) => i * N + j + 1));
    const todas = Array.from({ length: N * N }, (_, i) => i + 1), flota = barcos.flat();
    const agua = shuf(todas.filter(c => !flota.includes(c))).slice(0, lv === 1 ? 3 : 4);
    return shuf(flota.concat(agua)).map(c => {
      const o = numOpts(c);
      return { s: { txt: preguntaBat(c), op: o.op, cor: o.cor, c, sol: String(c), ships: barcos, N, reintentar: true }, e: { malas: [], disparo: null } };
    });
  }

  function rBatalla(s, e, idx) {
    // Disparos de esta partida: pantallas anteriores de la misma batalla (y la actual si ya está resuelta)
    const tiros = {};
    for (let j = idx - s.qi; j <= idx; j++) { const x = st(j); if (x && x.disparo != null) tiros[x.disparo] = true; }
    const flota = new Set(s.ships.flat());
    const hundidos = s.ships.filter(sh => sh.every(c => tiros[c])).length;
    let tablero = `<div class="pn-board" style="grid-template-columns:repeat(${s.N},1fr)">`;
    for (let c = 1; c <= s.N * s.N; c++) {
      const disparado = !!tiros[c], cls = disparado ? (flota.has(c) ? 'hit' : 'miss') : '';
      tablero += `<span class="pn-bcell ${cls}" aria-label="${esc(t('bat.cell', { n: c }))}"><b>${disparado ? '' : c}</b></span>`;
    }
    tablero += '</div>';
    return cab('batalla', t('bat.q')) + `<p class="pn-big">${esc(s.txt)}</p>` + tablero +
      `<p class="pn-stat">${esc(t('bat.stat', { a: hundidos, b: s.ships.length }))}</p>` +
      opts(idx, e, s.op, s.cor, 'pn_q', v => esc(String(v)), true) +
      `<div class="pn-row">${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  /* =========================================================
     11 · TANGRAM: completar la figura, contar piezas, reconocer formas
     Siete piezas de un cuadrado de 200×200 (coordenadas de 0 a 200).
     ========================================================= */
  const TPIECES = [
    { id: 'L1', k: 'big', pts: [[0, 0], [200, 0], [100, 100]] },
    { id: 'L2', k: 'big', pts: [[0, 0], [100, 100], [0, 200]] },
    { id: 'SQ', k: 'sq', pts: [[100, 100], [150, 50], [200, 100], [150, 150]] },
    { id: 'S1', k: 'small', pts: [[200, 0], [150, 50], [200, 100]] },
    { id: 'S2', k: 'small', pts: [[200, 100], [200, 200], [150, 150]] },
    { id: 'M1', k: 'mid', pts: [[0, 200], [100, 100], [150, 150]] },
    { id: 'M2', k: 'mid', pts: [[0, 200], [150, 150], [200, 200]] }
  ];
  const TPAL = {
    clasico: ['#e11d48', '#f97316', '#facc15', '#22c55e', '#06b6d4', '#2563eb', '#a855f7'],
    pastel: ['#fda4af', '#fdba74', '#fde68a', '#bbf7d0', '#a5f3fc', '#bfdbfe', '#ddd6fe'],
    neon: ['#ff2d95', '#ff9100', '#fff200', '#00e676', '#00e5ff', '#2979ff', '#d500f9'],
    madera: ['#7c4a22', '#a86b34', '#d9b382', '#5c3d1e', '#b98b54', '#8f6336', '#c79a68'],
    silueta: ['#111827', '#1f2937', '#374151', '#111827', '#1f2937', '#374151', '#4b5563']
  };
  const PALS = ['clasico', 'pastel', 'neon', 'madera', 'silueta'];
  const pieza = id => TPIECES.find(p => p.id === id);
  const ptsStr = p => p.pts.map(q => q[0] + ',' + q[1]).join(' ');
  // Huella de forma: longitudes de los lados. Dos piezas con la misma huella son iguales (congruentes).
  const huella = p => p.pts.map((a, i) => { const b = p.pts[(i + 1) % p.pts.length]; return Math.hypot(b[0] - a[0], b[1] - a[1]).toFixed(0); }).sort().join('-');

  function thumbSVG(p, fill) {
    const xs = p.pts.map(q => q[0]), ys = p.pts.map(q => q[1]), x0 = Math.min(...xs) - 12, y0 = Math.min(...ys) - 12;
    const w = Math.max(...xs) - x0 + 12, h = Math.max(...ys) - y0 + 12;
    return `<svg class="pn-thumb" viewBox="${x0} ${y0} ${w} ${h}" aria-hidden="true"><polygon points="${ptsStr(p)}" fill="${fill}" stroke="#ffffff" stroke-width="6" stroke-linejoin="round"/></svg>`;
  }
  const polyEl = (p, fill, cls) => `<polygon points="${ptsStr(p)}" fill="${fill}" class="pn-pz${cls ? ' ' + cls : ''}" stroke="#ffffff" stroke-width="3" stroke-linejoin="round"/>`;

  function crearTangram(d) {
    const MODOS = ['completar', 'contar', 'identificar'], out = [], pal = PALS.includes(d.estilo) ? d.estilo : 'clasico';
    for (let i = 0; i < cant(d, 4); i++) {
      const modo = MODOS.includes(d.modo) ? d.modo : MODOS[i % MODOS.length];
      if (modo === 'completar') {
        const falta = pick(TPIECES);
        const otras = TPIECES.filter(p => huella(p) !== huella(falta));
        const op = shuf([falta.id].concat(shuf(otras).slice(0, 3).map(p => p.id)));
        out.push({ s: { modo, miss: falta.id, op, cor: op.indexOf(falta.id), sol: t('tan.' + falta.k) }, e: { pal } });
      } else if (modo === 'contar') {
        const q = pick(['tri', 'sq', 'all']), ans = q === 'tri' ? 6 : q === 'sq' ? 1 : 7, o = numOpts(ans);
        out.push({ s: { modo, q, op: o.op, cor: o.cor, sol: String(ans) }, e: { pal } });
      } else {
        const id = pick(TPIECES.map(p => p.id)), k = pieza(id).k;
        const kinds = ['big', 'mid', 'small', 'sq'], op = shuf(kinds);
        out.push({ s: { modo, piece: id, op, cor: op.indexOf(k), sol: t('tan.' + k) }, e: { pal } });
      }
    }
    return out;
  }

  function rTangram(s, e, idx) {
    const pal = PALS.includes(e.pal) ? e.pal : 'clasico';
    const color = id => TPAL[pal][TPIECES.findIndex(p => p.id === id)];
    const botones = PALS.map(k => `<button type="button" class="pn-btn sm${pal === k ? ' on' : ''}" data-pn="tg_pal" data-i="${idx}" data-v="${k}" aria-pressed="${pal === k}">${esc(t('tan.pal.' + k))}</button>`).join('');
    let figura;
    if (s.modo === 'completar') {
      figura = TPIECES.filter(p => p.id !== s.miss).map(p => polyEl(p, color(p.id))).join('') + polyEl(pieza(s.miss), '#f5f3ff', 'hole');
    } else {
      figura = TPIECES.map(p => polyEl(p, color(p.id), s.modo === 'identificar' && p.id === s.piece ? 'hl' : '')).join('');
    }
    const svg = `<svg class="pn-tan" viewBox="-6 -6 212 212" role="img" aria-label="${esc(t('tan.title'))}">${figura}</svg>`;
    let cuerpo, pregunta;
    if (s.modo === 'completar') {
      pregunta = t('tan.complete');
      cuerpo = svg + opts(idx, e, s.op, s.cor, 'pn_q', id => `<span role="img" aria-label="${esc(t('tan.' + pieza(id).k))}">${thumbSVG(pieza(id), color(id))}</span>`, true);
    } else if (s.modo === 'contar') {
      pregunta = t(s.q === 'tri' ? 'tan.count_tri' : s.q === 'sq' ? 'tan.count_sq' : 'tan.count_all');
      cuerpo = svg + opts(idx, e, s.op, s.cor, 'pn_q', v => esc(String(v)), true);
    } else {
      pregunta = t('tan.identify');
      cuerpo = svg + opts(idx, e, s.op, s.cor, 'pn_q', k => esc(t('tan.' + k)), true);
    }
    return cab('tangram', pregunta) + `<div class="pn-tanbar" role="group" aria-label="${esc(t('tan.pal'))}">${botones}</div>` + cuerpo + msg(e);
  }

  /* ---------- acciones ---------- */
  const PN_EXTRA = {
    tg_pal(idx, v) { const e = st(idx); if (!e || e.respondida) return; e.pal = v; ref(); }
  };

  /* ---------- textos para lectura en voz alta ---------- */
  const TXT_B = {
    tesoro: s => (s.modo === 'programar' ? t('tes.prog_q') : t('tes.clue_q')),
    simetria_dibujo: () => t('sim.q'),
    patron_visual: s => (s.modo === 'num' ? t('pat.num') : t('pat.shape')),
    batalla: s => t('bat.q') + '. ' + s.txt,
    tangram: s => (s.modo === 'completar' ? t('tan.complete') : s.modo === 'contar' ? t(s.q === 'tri' ? 'tan.count_tri' : s.q === 'sq' ? 'tan.count_sq' : 'tan.count_all') : t('tan.identify'))
  };

  /* ---------- registro ---------- */
  C.reg('tesoro', { crear: crearTesoro, render: rTesoro, texto: s => TXT_B.tesoro(s), act: TESORO_ACT });
  C.reg('simetria_dibujo', { crear: crearSimetria, render: rSimetria, texto: s => TXT_B.simetria_dibujo(s), act: SIM_ACT });
  C.reg('patron_visual', { crear: crearPatron, render: rPatron, texto: s => TXT_B.patron_visual(s) });
  C.reg('batalla', { crear: crearBatalla, render: rBatalla, texto: s => TXT_B.batalla(s) });
  C.reg('tangram', { crear: crearTangram, render: rTangram, texto: s => TXT_B.tangram(s), act: PN_EXTRA });
})();
