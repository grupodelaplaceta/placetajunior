/* Placeta Junior · Primaria Nueva · tipos A
   geometria · dinero · vertical · abaco · calculo_mental · horas */
(function () {
  'use strict';
  const C = window.PJPNCore; if (!C) return;
  const { t, eur, esc, arr, num, ri, pick, shuf, nivel, cant, pad2, dgs, numOpts, st, cur, ref, resolver, msg, btn, cab, opts } = C.h;

  /* =========================================================
     1 · GEOMETRÍA: identificar, contar lados, clasificar
     ========================================================= */
  const KIND = { triangulo: 3, cuadrado: 4, rectangulo: 4, rombo: 4, circulo: 0, pentagono: 5, hexagono: 6 };
  const KINDS = Object.keys(KIND);
  const PROPS = [
    { id: 'l3', k: 'geo.p.3', sat: ['triangulo'] },
    { id: 'l4', k: 'geo.p.4', sat: ['cuadrado', 'rectangulo', 'rombo'] },
    { id: 'l4i', k: 'geo.p.4eq', sat: ['cuadrado', 'rombo'] },
    { id: 'l5', k: 'geo.p.5', sat: ['pentagono'] },
    { id: 'l6', k: 'geo.p.6', sat: ['hexagono'] },
    { id: 'l0', k: 'geo.p.0', sat: ['circulo'] }
  ];
  const polyN = n => Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return (100 + 80 * Math.cos(a)).toFixed(1) + ',' + (100 + 80 * Math.sin(a)).toFixed(1); }).join(' ');
  const SHAPE_PTS = { triangulo: '100,20 180,170 20,170', cuadrado: '40,40 160,40 160,160 40,160', rectangulo: '15,60 185,60 185,140 15,140', rombo: '100,15 185,100 100,185 15,100', pentagono: polyN(5), hexagono: polyN(6) };
  const shapeSVG = (k, cls) => `<svg class="pn-shape ${cls || ''}" viewBox="0 0 200 200" aria-hidden="true">${k === 'circulo' ? '<circle cx="100" cy="100" r="80"/>' : '<polygon points="' + SHAPE_PTS[k] + '"/>'}</svg>`;

  function crearGeo(d) {
    const MODOS = ['identificar', 'lados', 'clasificar'];
    const pool = arr(d.figuras).filter(k => KIND[k] !== undefined);
    const K = pool.length >= 3 ? pool : KINDS;
    const out = [];
    for (let i = 0; i < cant(d, 5); i++) {
      const m = MODOS.includes(d.modo) ? d.modo : pick(MODOS);
      if (m === 'identificar') {
        const k = pick(K), op = shuf([k].concat(shuf(KINDS.filter(x => x !== k)).slice(0, 3)));
        out.push({ s: { modo: m, kind: k, op, cor: op.indexOf(k), sol: t('k.' + k) } });
      } else if (m === 'lados') {
        const k = pick(K), c = KIND[k], set = new Set([c]);
        while (set.size < 4) set.add(ri(0, 6));
        const op = shuf([...set]);
        out.push({ s: { modo: m, kind: k, op, cor: op.indexOf(c), sol: String(c) } });
      } else {
        const p = pick(PROPS), sat = KINDS.filter(x => p.sat.includes(x)), non = KINDS.filter(x => !p.sat.includes(x));
        const c = pick(sat), op = shuf([c].concat(shuf(non).slice(0, 3)));
        out.push({ s: { modo: m, prop: p.id, op, cor: op.indexOf(c), sol: t('k.' + c) } });
      }
    }
    return out;
  }

  function rGeo(s, e, idx) {
    if (s.modo === 'clasificar') {
      const p = PROPS.find(x => x.id === s.prop);
      return cab('geometria', t('geo.classify', { p: t(p.k) })) + opts(idx, e, s.op, s.cor, 'pn_q', k => shapeSVG(k, 'mini'), true) + msg(e);
    }
    if (s.modo === 'lados') return cab('geometria', t('geo.sides')) + `<div class="pn-stage">${shapeSVG(s.kind, 'big')}</div>` + opts(idx, e, s.op, s.cor, 'pn_q', v => esc(String(v)), false) + msg(e);
    return cab('geometria', t('geo.identify')) + `<div class="pn-stage">${shapeSVG(s.kind, 'big')}</div>` + opts(idx, e, s.op, s.cor, 'pn_q', k => esc(t('k.' + k)), false) + msg(e);
  }

  /* =========================================================
     2 · DINERO (euros): contar, pagar, calcular el cambio
     ========================================================= */
  const MONEY = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000]; // céntimos
  const isBill = v => v >= 500;
  const mlab = v => {
    const en = lang() === 'en';
    if (v < 100) return v + (en ? '¢' : ' c');
    const e = v / 100;
    return en ? '€' + (Number.isInteger(e) ? e : e.toFixed(2)) : (Number.isInteger(e) ? e : e.toFixed(2).replace('.', ',')) + ' €';
  };
  const lang = () => window.PJPNI.lang();
  const mhtml = v => `<span class="pn-${isBill(v) ? 'bill' : 'coin'} v${v}">${esc(mlab(v))}</span>`;
  const DIN_DELTAS = [5, 10, 20, 50, 100, -5, -10, -20, -50, -100, 1, -1];

  function crearDinero(d) {
    const MODOS = ['contar', 'pagar', 'cambio'], out = [], lv = nivel(d);
    for (let i = 0; i < cant(d, 4); i++) {
      const m = MODOS.includes(d.modo) ? d.modo : pick(MODOS);
      if (m === 'contar') {
        const pool = lv === 1 ? MONEY.slice(0, 8) : MONEY, items = [];
        for (let j = 0; j < ri(3, 5); j++) items.push(pick(pool));
        const total = items.reduce((a, b) => a + b, 0), o = numOpts(total, DIN_DELTAS);
        out.push({ s: { modo: m, items, op: o.op, cor: o.cor, sol: eur(total) } });
      } else if (m === 'pagar') {
        const price = lv === 1 ? ri(1, 30) * 5 : lv === 2 ? ri(10, 200) * 5 : ri(40, 400) * 5;
        out.push({ s: { modo: m, price, sol: eur(price) }, e: { pago: [] } });
      } else {
        const price = ri(1, 40) * 25, pays = [500, 1000, 2000].filter(x => x > price), paid = pick(pays.slice(0, 2));
        const change = paid - price, o = numOpts(change, DIN_DELTAS);
        out.push({ s: { modo: m, price, paid, op: o.op, cor: o.cor, sol: eur(change) } });
      }
    }
    return out;
  }

  function rDinero(s, e, idx) {
    if (s.modo === 'contar') {
      return cab('dinero', t('din.count')) +
        `<div class="pn-money big" role="img" aria-label="${esc(eur(s.items.reduce((a, b) => a + b, 0)))}">${s.items.map(mhtml).join('')}</div>` +
        opts(idx, e, s.op, s.cor, 'pn_q', v => esc(eur(v)), false) + msg(e);
    }
    if (s.modo === 'cambio') {
      return cab('dinero', t('din.change', { paid: eur(s.paid), p: eur(s.price) })) +
        `<div class="pn-price">${esc(eur(s.price))}</div>` +
        opts(idx, e, s.op, s.cor, 'pn_q', v => esc(eur(v)), false) + msg(e);
    }
    const suma = arr(e.pago).reduce((a, b) => a + b, 0);
    const bandeja = arr(e.pago).length
      ? arr(e.pago).map((v, j) => `<button type="button" class="pn-coinbtn" data-pn="din_quita" data-i="${idx}" data-v="${j}" aria-label="${esc(t('din.remove'))}">${mhtml(v)}</button>`).join('')
      : '<span class="pn-empty">—</span>';
    return cab('dinero', t('din.pay', { p: eur(s.price) })) +
      `<div class="pn-pago"><div class="pn-lab">${esc(t('din.paying'))}: <strong>${esc(eur(suma))}</strong></div><div class="pn-money pn-tray" aria-live="polite">${bandeja}</div></div>` +
      `<div class="pn-lab">${esc(t('din.wallet'))}</div>` +
      `<div class="pn-money pn-wallet">${MONEY.map((v, j) => `<button type="button" class="pn-coinbtn" data-pn="din_add" data-i="${idx}" data-v="${j}">${mhtml(v)}</button>`).join('')}</div>` +
      `<div class="pn-row">${btn('din_chk', idx, t('check'), 'primary')}${btn('din_clear', idx, t('clear'), 'ghost')}${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  /* =========================================================
     3 · SUMAS Y RESTAS EN VERTICAL (con llevadas)
     Trabajo columna a columna desde las unidades. En cada columna el niño escribe
     el resultado y, si toca, la llevada en la celda de encima de la columna siguiente.
     ========================================================= */
  const hayLlevada = (a, b) => { const A = dgs(a), B = dgs(b); return A.some((x, i) => x + (B[i] || 0) >= 10); };
  const hayPrestamo = (a, b) => { const A = dgs(a), B = dgs(b); return B.some((x, i) => x > (A[i] || 0)); };
  const digitosW = (n, W) => Array.from({ length: W }, (_, p) => dgs(n)[p] || 0);

  // Disposición de la operación. En una resta, los ceros de la izquierda del resultado
  // se esperan en blanco (R[p] = null), como en el cuaderno.
  function layoutV(a, b, op) {
    const r = op === '+' ? a + b : a - b, lenR = String(r).length;
    const W = op === '+' ? lenR : Math.max(String(a).length, String(b).length, lenR);
    const A = digitosW(a, W), B = digitosW(b, W), R = [], CO = [];
    let c = 0;
    for (let p = 0; p < W; p++) {
      if (op === '+') { const x = A[p] + B[p] + c; R.push(x % 10); c = x >= 10 ? 1 : 0; }
      else { const x = A[p] - B[p] - c; if (x < 0) { R.push(x + 10); c = 1; } else { R.push(x); c = 0; } }
      CO.push(c);
    }
    for (let p = lenR; p < W; p++) R[p] = null;
    return { r, W, A, B, R, CO };
  }

  function genV(op, lv) {
    const dg = lv === 1 ? 2 : lv === 2 ? 3 : 4, lo = 10 ** (dg - 1), hi = 10 ** dg - 1;
    for (let k = 0; k < 400; k++) {
      const a = ri(lo, hi);
      let b;
      if (op === '+') { b = ri(lo, hi); if (!hayLlevada(a, b)) continue; }
      else { if (a - lo < 1) continue; b = ri(1, a - lo); if (!hayPrestamo(a, b)) continue; }
      return { a, b };
    }
    return op === '+' ? { a: 47, b: 38 } : { a: 83, b: 27 };
  }

  function crearVertical(d) {
    const out = [], lv = nivel(d), datos = arr(d.ejercicios).filter(x => x && num(x.a, null) != null && num(x.b, null) != null);
    const n = datos.length ? datos.length : cant(d, 4);  // con ejercicios propios, sólo esos
    for (let i = 0; i < n; i++) {
      let a, b, op;
      if (datos.length) {
        const x = datos[i];
        a = Number(x.a); b = Number(x.b); op = x.op === '-' || x.op === '−' ? '-' : '+';
        if (op === '-' && a < b) { const tmp = a; a = b; b = tmp; }
      } else {
        op = d.operacion === '+' || d.operacion === '-' ? d.operacion : (i % 2 ? '-' : '+');
        ({ a, b } = genV(op, lv));
      }
      const L = layoutV(a, b, op);
      out.push({
        s: { op, a, b, r: L.r, W: L.W, A: L.A, B: L.B, R: L.R, CO: L.CO, la: String(a).length, lb: String(b).length, sol: String(L.r) },
        e: { p: 0, res: Array(L.W).fill(''), car: Array(L.W + 1).fill(''), sel: 'r', err: 0 }
      });
    }
    return out;
  }

  const normC = x => (x === '0' || x == null ? '' : String(x));

  function rVert(s, e, idx) {
    const W = s.W, p = Math.min(e.p, W), done = p >= W;
    const sel = e.sel === 'c' && p + 1 < W ? 'c' : 'r';
    const cols = []; for (let j = 0; j < W; j++) cols.push(W - 1 - j); // izquierda → derecha
    const row = (cls, cells) => `<div class="pn-vrow ${cls}">${cells.join('')}</div>`;

    const carry = ['<span></span>'];
    cols.forEach(q => {
      if (q === 0) { carry.push('<span></span>'); return; }
      if (!done && !e.respondida && q - 1 === p) carry.push(`<button type="button" class="pn-vcar${sel === 'c' ? ' sel' : ''}" data-pn="v_sel" data-i="${idx}" data-v="c" aria-label="${esc(t('vert.carry'))}">${esc(normC(e.car[q]))}</button>`);
      else carry.push(`<span class="pn-vcar ro">${esc(normC(e.car[q]))}</span>`);
    });
    const top = ['<span></span>'].concat(cols.map(q => `<span class="pn-vdig">${q < s.la ? s.A[q] : ''}</span>`));
    const bot = [`<span class="pn-vsign">${s.op === '+' ? '+' : '−'}</span>`].concat(cols.map(q => `<span class="pn-vdig">${q < s.lb ? s.B[q] : ''}</span>`));
    const res = ['<span></span>'];
    cols.forEach(q => {
      if (q < p) res.push(`<span class="pn-vres ok">${esc(e.res[q])}</span>`);
      else if (q === p && !done) res.push(`<button type="button" class="pn-vres on${sel === 'r' ? ' sel' : ''}" data-pn="v_sel" data-i="${idx}" data-v="r" aria-label="${esc(t('col.' + q))}">${esc(e.res[q])}</button>`);
      else res.push('<span class="pn-vres ghost"></span>');
    });

    const grid = `<div class="pn-vgrid" data-i="${idx}" style="--w:${W}">${row('c', carry)}${row('t', top)}${row('b', bot)}${row('r', res)}</div>`;
    const teclado = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(v => `<button type="button" class="pn-key" data-pn="v_dig" data-i="${idx}" data-v="${v}">${v}</button>`).join('');
    const pad = (done || e.respondida) ? '' :
      `<p class="pn-hint">${esc(t('vert.now', { col: t('col.' + p) }))}</p>` +
      `<div class="pn-keys">${teclado}<button type="button" class="pn-key alt" data-pn="v_del" data-i="${idx}" aria-label="${esc(t('clear'))}">⌫</button></div>` +
      `<div class="pn-row">${btn('v_chk', idx, t('check'), 'primary')}${btn('v_hint', idx, t('hint'), 'ghost')}${btn('pn_show', idx, t('show'), 'ghost')}</div>`;
    return cab('vertical', t('vert.q')) + grid + pad + msg(e);
  }

  const vCur = idx => ({ s: cur(idx), e: st(idx) });

  const VERT_ACT = {
    v_sel(idx, v) { const { e } = vCur(idx); if (!e || e.respondida) return; e.sel = v; ref(); },
    v_dig(idx, v) {
      const { s, e } = vCur(idx); if (!s || !e || e.respondida || e.p >= s.W) return;
      if (e.sel === 'c' && e.p + 1 < s.W) e.car[e.p + 1] = String(v); else e.res[e.p] = String(v);
      e.msg = null; ref();
    },
    v_del(idx) {
      const { s, e } = vCur(idx); if (!s || !e || e.respondida || e.p >= s.W) return;
      if (e.sel === 'c' && e.p + 1 < s.W) e.car[e.p + 1] = ''; else e.res[e.p] = '';
      e.msg = null; ref();
    },
    v_chk(idx) {
      const { s, e } = vCur(idx); if (!s || !e || e.respondida || e.p >= s.W) return;
      const p = e.p, hasC = p + 1 < s.W;
      const okR = s.R[p] === null ? (e.res[p] === '' || e.res[p] === '0') : e.res[p] === String(s.R[p]);
      const okC = !hasC || (normC(e.car[p + 1]) === (s.CO[p] ? '1' : ''));
      if (okR && okC) {
        e.p = p + 1; e.sel = 'r';
        if (e.p >= s.W) return resolver(idx, e.err === 0, s.sol);
        e.msg = { k: 'vert.ok', ok: true }; return ref();
      }
      e.err++; e.msg = { k: 'vert.err', ok: false }; ref();
    },
    v_hint(idx) {
      const { s, e } = vCur(idx); if (!s || !e || e.respondida || e.p >= s.W) return;
      const p = e.p, cin = p > 0 ? s.CO[p - 1] : 0, co = s.CO[p];
      let txt = s.op === '+'
        ? t('vert.hint.add', { a: s.A[p], b: s.B[p], cin: cin ? ' + 1' : '', s: s.A[p] + s.B[p] + cin, col: t('col.' + p) })
        : t('vert.hint.sub', { top: s.A[p] - cin + (co ? 10 : 0), b: s.B[p], r: s.R[p] === null ? 0 : s.R[p], col: t('col.' + p) });
      txt += ' ' + (s.R[p] === null ? t('vert.blank') : t('vert.write', { r: s.R[p] }));
      if (co) txt += ' ' + t(s.op === '+' ? 'vert.carryhint' : 'vert.borrowhint', { c: 1 });
      e.msg = { txt, ok: null }; ref();
    }
  };

  /* =========================================================
     4 · ÁBACO: poner un número / leer el número del ábaco
     ========================================================= */
  const candNum = (v, cols) => {
    const max = 10 ** cols - 1, c = new Set();
    [v + 1, v - 1, v + 10, v - 10, v + 100, v - 100].forEach(x => { if (x >= 1 && x <= max && x !== v) c.add(x); });
    const others = shuf([...c]).slice(0, 3), op = shuf([v].concat(others));
    return { op, cor: op.indexOf(v) };
  };

  function crearAbaco(d) {
    const out = [], cols = Math.min(4, Math.max(2, num(d.columnas, 3)));
    for (let i = 0; i < cant(d, 4); i++) {
      const modo = d.modo === 'poner' || d.modo === 'leer' ? d.modo : (i % 2 ? 'leer' : 'poner');
      const v = ri(10 ** (cols - 1), 10 ** cols - 1);
      const dg = String(v).padStart(cols, '0').split('').map(Number);
      const o = modo === 'leer' ? candNum(v, cols) : { op: null, cor: -1 };
      out.push({
        s: { modo, cols, n: v, op: o.op, cor: o.cor, sol: String(v) },
        e: { vals: modo === 'leer' ? dg : Array(cols).fill(0) }
      });
    }
    return out;
  }

  function rAbaco(s, e, idx) {
    const puedes = s.modo === 'poner' && !e.respondida;
    const varillas = arr(e.vals).map((val, j) => {
      let cuentas = '';
      for (let k = 0; k < 10; k++) {
        const on = k < val ? ' on' : '';
        cuentas += puedes
          ? `<button type="button" class="pn-bead${on}" data-pn="ab_bead" data-i="${idx}" data-v="${j}:${k}" aria-label="${esc(t('aba.bead'))}"></button>`
          : `<span class="pn-bead${on}"></span>`;
      }
      return `<div class="pn-rod"><div class="pn-beads">${cuentas}</div><span class="pn-rlab">${esc(t('aba.c' + (s.cols - 1 - j)))}</span></div>`;
    }).join('');
    const cuerpo = `<div class="pn-abaco" role="group" aria-label="${esc(t('aba.title'))}">${varillas}</div>`;
    if (s.modo === 'leer') return cab('abaco', t('aba.read')) + cuerpo + opts(idx, e, s.op, s.cor, 'pn_q', v => esc(String(v)), true) + msg(e);
    return cab('abaco', t('aba.set', { n: s.n })) + cuerpo + `<div class="pn-row">${btn('ab_chk', idx, t('check'), 'primary')}${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  const ABACO_ACT = {
    ab_bead(idx, v) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const [j, k] = v.split(':').map(Number);
      e.vals[j] = k < e.vals[j] ? k : k + 1; // tocar una cuenta encendida la apaga (y las de arriba); tocar otra la enciende (y las de abajo)
      e.msg = null; ref();
    },
    ab_chk(idx) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const val = e.vals.reduce((acc, x) => acc * 10 + x, 0);
      if (val === s.n) return resolver(idx, true, s.sol);
      e.msg = { k: 'aba.wrong', ok: false }; ref();
    }
  };

  /* =========================================================
     5 · CÁLCULO MENTAL
     ========================================================= */
  const CM_KINDS = ['suma', 'resta', 'mas10', 'menos10', 'doble', 'mitad', 'compl', 'x10', 'mult'];
  function genCM(kind, lv) {
    const big = lv >= 2;
    switch (kind) {
      case 'resta': { const a = ri(big ? 40 : 15, big ? 300 : 90), b = ri(1, a - 1); return { txt: t('cm.resta', { a, b }), ans: a - b }; }
      case 'mas10': { const a = ri(10, big ? 900 : 90); return { txt: t('cm.mas10', { a }), ans: a + 10 }; }
      case 'menos10': { const a = ri(11, big ? 900 : 90); return { txt: t('cm.menos10', { a }), ans: a - 10 }; }
      case 'doble': { const a = ri(2, big ? 250 : 50); return { txt: t('cm.doble', { a }), ans: 2 * a }; }
      case 'mitad': { const a = 2 * ri(1, big ? 250 : 50); return { txt: t('cm.mitad', { a }), ans: a / 2 }; }
      case 'compl': { const b = lv === 1 ? 10 : 100, a = ri(1, b - 1); return { txt: t('cm.compl', { a, b }), ans: b - a }; }
      case 'x10': { const a = ri(2, big ? 50 : 12); return { txt: t('cm.x10', { a }), ans: a * 10 }; }
      case 'mult': { const a = ri(2, 9), b = ri(2, big ? 12 : 6); return { txt: t('cm.mult', { a, b }), ans: a * b }; }
      default: { const a = ri(big ? 20 : 10, big ? 300 : 60), b = ri(big ? 10 : 2, big ? 200 : 40); return { txt: t('cm.suma', { a, b }), ans: a + b }; }
    }
  }

  function crearCalc(d) {
    const out = [], lv = nivel(d), datos = arr(d.ejercicios).filter(x => x && x.enunciado != null && num(x.respuesta, null) != null);
    if (datos.length) {
      datos.forEach(x => { const o = numOpts(Number(x.respuesta)); out.push({ s: { txt: String(x.enunciado), op: o.op, cor: o.cor, sol: String(x.respuesta) } }); });
      return out;
    }
    const tipos = arr(d.tipos).filter(k => CM_KINDS.includes(k));
    const pool = tipos.length ? tipos : CM_KINDS.filter(k => lv > 1 || k !== 'mult');
    for (let i = 0; i < cant(d, 5); i++) {
      const q = genCM(pick(pool), lv), o = numOpts(q.ans);
      out.push({ s: { txt: q.txt, op: o.op, cor: o.cor, sol: String(q.ans) } });
    }
    return out;
  }

  function rCalc(s, e, idx) {
    return cab('calculo_mental', t('cm.q')) + `<p class="pn-big">${esc(s.txt)}</p>` +
      opts(idx, e, s.op, s.cor, 'pn_q', v => esc(String(v)), true) + msg(e);
  }

  /* =========================================================
     6 · HORAS: leer el reloj, poner el reloj, sumar tiempo, duración
     ========================================================= */
  const fmt24 = m => pad2(Math.floor(m / 60) % 24) + ':' + pad2(m % 60);
  const fmt12 = m => (Math.floor(m / 60) % 12 || 12) + ':' + pad2(m % 60);
  const durFmt = m => { const h = Math.floor(m / 60), mm = m % 60; if (h && mm) return t('hora.dur.hm', { h, m: mm }); if (h) return t('hora.dur.h', { h }); return t('hora.dur.m', { m: mm }); };

  function clockSVG(h12, m) {
    let nums = '', ticks = '';
    for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6; nums += `<text x="${(100 + 72 * Math.sin(a)).toFixed(1)}" y="${(100 - 72 * Math.cos(a) + 8).toFixed(1)}" text-anchor="middle">${i}</text>`; }
    for (let i = 0; i < 60; i++) {
      const a = i * Math.PI / 30, r1 = i % 5 ? 88 : 80;
      ticks += `<line class="${i % 5 ? 'tk' : 'tk5'}" x1="${(100 + r1 * Math.sin(a)).toFixed(1)}" y1="${(100 - r1 * Math.cos(a)).toFixed(1)}" x2="${(100 + 93 * Math.sin(a)).toFixed(1)}" y2="${(100 - 93 * Math.cos(a)).toFixed(1)}"/>`;
    }
    const ha = h12 * 30 + m * 0.5, ma = m * 6;
    return `<svg class="pn-clock" viewBox="0 0 200 200" role="img" aria-label="${esc(t('hora.clock'))}"><circle class="face" cx="100" cy="100" r="96"/>${ticks}${nums}` +
      `<line class="hand h" x1="100" y1="100" x2="100" y2="52" transform="rotate(${ha} 100 100)"/>` +
      `<line class="hand m" x1="100" y1="100" x2="100" y2="24" transform="rotate(${ma} 100 100)"/><circle class="pin" cx="100" cy="100" r="6"/></svg>`;
  }

  function crearHoras(d) {
    const lv = nivel(d), MODS = ['leer', 'poner', 'sumar', 'duracion'], out = [];
    const pasos = lv === 1 ? [0, 30] : lv === 2 ? [0, 15, 30, 45] : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const duraciones = lv === 1 ? [30, 60, 90, 120] : [15, 30, 45, 60, 75, 90, 120, 150];
    for (let i = 0; i < cant(d, 4); i++) {
      const m = MODS.includes(d.modo) ? d.modo : MODS[i % MODS.length];
      if (m === 'leer') {
        const tot = ri(0, 11) * 60 + pick(pasos), set = new Set([tot]);
        shuf([tot + 15, tot - 15, tot + 30, tot - 30, tot + 60, tot - 60]).forEach(x => { if (set.size < 4) set.add(((x % 720) + 720) % 720); });
        const op = shuf([...set]);
        out.push({ s: { modo: m, h: Math.floor(tot / 60), m: tot % 60, op, cor: op.indexOf(tot), sol: fmt12(tot) } });
      } else if (m === 'poner') {
        const tot = ri(0, 11) * 60 + pick(pasos);
        out.push({ s: { modo: m, h: Math.floor(tot / 60), m: tot % 60, label: fmt12(tot), sol: fmt12(tot) }, e: { h: 0, m: 0 } });
      } else if (m === 'sumar') {
        const start = ri(8, 19) * 60 + pick(pasos), dur = pick(duraciones), fin = start + dur, set = new Set([fin]);
        shuf([fin + 15, fin - 15, fin + 30, fin - 30, fin + 60]).forEach(x => { if (set.size < 4 && x > 0) set.add(x); });
        const op = shuf([...set]);
        out.push({ s: { modo: m, start, dur, op, cor: op.indexOf(fin), sol: fmt24(fin) } });
      } else {
        const start = ri(8, 19) * 60 + pick(pasos), dur = pick(duraciones), set = new Set([dur]);
        shuf([dur + 15, dur - 15, dur + 30, dur - 30, dur + 60]).forEach(x => { if (set.size < 4 && x > 0) set.add(x); });
        const op = shuf([...set]);
        out.push({ s: { modo: m, start, end: start + dur, op, cor: op.indexOf(dur), sol: durFmt(dur) } });
      }
    }
    return out;
  }

  function rHoras(s, e, idx) {
    if (s.modo === 'leer') return cab('horas', t('hora.read')) + `<div class="pn-clockwrap">${clockSVG(s.h, s.m)}</div>` + opts(idx, e, s.op, s.cor, 'pn_q', mn => esc(fmt12(mn)), true) + msg(e);
    if (s.modo === 'sumar') return cab('horas', t('hora.end', { a: fmt24(s.start), d: durFmt(s.dur) })) + `<div class="pn-clockwrap">${clockSVG(Math.floor(s.start / 60) % 12, s.start % 60)}</div>` + opts(idx, e, s.op, s.cor, 'pn_q', mn => esc(fmt24(mn)), true) + msg(e);
    if (s.modo === 'duracion') return cab('horas', t('hora.dur', { a: fmt24(s.start), b: fmt24(s.end) })) + opts(idx, e, s.op, s.cor, 'pn_q', dm => esc(durFmt(dm)), true) + msg(e);
    const h12 = e.h || 12;
    return cab('horas', t('hora.set', { h: s.label })) +
      `<div class="pn-clockwrap">${clockSVG(e.h, e.m)}</div>` +
      `<div class="pn-digital" aria-live="polite">${h12}:${pad2(e.m)}</div>` +
      `<div class="pn-tadj">` +
      `<div class="pn-adj"><span>${esc(t('hora.hour'))}</span><button type="button" class="pn-btn sm" data-pn="hr_adj" data-i="${idx}" data-v="h-">−</button><button type="button" class="pn-btn sm" data-pn="hr_adj" data-i="${idx}" data-v="h+">+</button></div>` +
      `<div class="pn-adj"><span>${esc(t('hora.min'))}</span><button type="button" class="pn-btn sm" data-pn="hr_adj" data-i="${idx}" data-v="m-">−5</button><button type="button" class="pn-btn sm" data-pn="hr_adj" data-i="${idx}" data-v="m+">+5</button></div>` +
      `</div>` +
      `<div class="pn-row">${btn('hr_chk', idx, t('check'), 'primary')}${btn('pn_show', idx, t('show'), 'ghost')}</div>` + msg(e);
  }

  const HORAS_ACT = {
    hr_adj(idx, v) {
      const e = st(idx); if (!e || e.respondida) return;
      if (v === 'h+') e.h = (e.h + 1) % 12;
      else if (v === 'h-') e.h = (e.h + 11) % 12;
      else if (v === 'm+') e.m = (e.m + 5) % 60;
      else e.m = (e.m + 55) % 60;
      e.msg = null; ref();
    },
    hr_chk(idx) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      if (e.h === s.h && e.m === s.m) return resolver(idx, true, s.sol);
      e.msg = { k: 'hora.wrong', ok: false }; ref();
    }
  };

  /* ---------- textos para lectura en voz alta ---------- */
  const TXT_A = {
    geometria: s => (s.modo === 'clasificar' ? t('geo.classify', { p: t(PROPS.find(p => p.id === s.prop).k) }) : s.modo === 'lados' ? t('geo.sides') : t('geo.identify')),
    dinero: s => (s.modo === 'pagar' ? t('din.pay', { p: eur(s.price) }) : s.modo === 'cambio' ? t('din.change', { paid: eur(s.paid), p: eur(s.price) }) : t('din.count')),
    vertical: () => t('vert.q'),
    abaco: s => (s.modo === 'leer' ? t('aba.read') : t('aba.set', { n: s.n })),
    calculo_mental: s => s.txt,
    horas: s => (s.modo === 'leer' ? t('hora.read') : s.modo === 'poner' ? t('hora.set', { h: s.label }) : s.modo === 'sumar' ? t('hora.end', { a: fmt24(s.start), d: durFmt(s.dur) }) : t('hora.dur', { a: fmt24(s.start), b: fmt24(s.end) }))
  };

  /* ---------- registro ---------- */
  C.reg('geometria', { crear: crearGeo, render: rGeo, texto: s => TXT_A.geometria(s) });
  C.reg('dinero', { crear: crearDinero, render: rDinero, texto: s => TXT_A.dinero(s), act: {
    din_add(idx, v) { const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return; e.pago = arr(e.pago).concat([MONEY[Number(v)]]); e.msg = null; ref(); },
    din_quita(idx, v) { const e = st(idx); if (!e || e.respondida) return; e.pago = arr(e.pago).filter((_, j) => j !== Number(v)); e.msg = null; ref(); },
    din_clear(idx) { const e = st(idx); if (!e || e.respondida) return; e.pago = []; e.msg = null; ref(); },
    din_chk(idx) {
      const s = cur(idx), e = st(idx); if (!s || !e || e.respondida) return;
      const suma = arr(e.pago).reduce((a, b) => a + b, 0);
      if (suma === s.price) return resolver(idx, true, s.sol);
      e.msg = suma > s.price ? { k: 'din.over', ok: false } : { k: 'din.short', v: { v: eur(s.price - suma) }, ok: false };
      ref();
    }
  } });
  C.reg('vertical', { crear: crearVertical, render: rVert, texto: s => TXT_A.vertical(s), act: VERT_ACT });
  C.reg('abaco', { crear: crearAbaco, render: rAbaco, texto: s => TXT_A.abaco(s), act: ABACO_ACT });
  C.reg('calculo_mental', { crear: crearCalc, render: rCalc, texto: s => TXT_A.calculo_mental(s) });
  C.reg('horas', { crear: crearHoras, render: rHoras, texto: s => TXT_A.horas(s), act: HORAS_ACT });
})();
