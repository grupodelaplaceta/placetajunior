/* Placeta Junior · Infantil · TRAZOS Y LETRAS
   Motor de trazado (sigue el orden y la dirección de cada trazo, como en grafomotricidad real)
   + juegos: camino, ondas y zigzags, vocales, abecedario, números, minúsculas, unir puntos, laberinto. */
(window.PJINF = window.PJINF || []).push(function (api) {
  'use strict';
  const { X, PAL, R, I, rnd, D, S, sp, pt, to, win, conf, sfx, tone, cv, say, tr, add, hintPath, N } = api;
  const CAT = 8;
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

  /* ---------- utilidades geométricas ---------- */
  function resample(pts, step) {
    const o = [pts[0].slice()]; let acc = 0;
    for (let i = 1; i < pts.length; i++) {
      let a = pts[i - 1], b = pts[i], d = dist(a, b);
      while (acc + d >= step && d > 0) {
        const t = (step - acc) / d;
        a = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
        o.push(a); d = dist(a, b); acc = 0;
      }
      acc += d;
    }
    const l = pts[pts.length - 1];
    if (dist(o[o.length - 1], l) > 1) o.push(l.slice());
    return o;
  }
  const ar = (cx, cy, rx, ry, a0, a1) => {
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / 10)), o = [];
    for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; o.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
    return o;
  };
  const sub = (p, n = 14) => { const o = []; for (let i = 0; i < n; i++) o.push(p[Math.min(p.length - 1, Math.round(i * (p.length - 1) / (n - 1)))].slice()); return o; };
  const pathOn = (x, p, n) => { x.beginPath(); for (let i = 0; i < (n == null ? p.length : n); i++) i ? x.lineTo(p[i][0], p[i][1]) : x.moveTo(p[i][0], p[i][1]); };

  /* ---------- tipografía de trazos (caja 60 x 100) ---------- */
  const F = {
    A: [[[5, 95], [30, 5], [55, 95]], [[14, 66], [46, 66]]],
    B: [[[10, 5], [10, 95]], [[10, 5], [33, 5], ...ar(33, 27, 20, 22, -90, 90), [10, 49]], [[10, 49], [36, 49], ...ar(36, 72, 20, 23, -90, 90), [10, 95]]],
    C: [ar(32, 50, 26, 45, -35, -325)],
    D: [[[10, 5], [10, 95]], [[10, 5], [26, 5], ...ar(26, 50, 26, 45, -90, 90), [10, 95]]],
    E: [[[50, 5], [10, 5], [10, 95], [50, 95]], [[10, 50], [42, 50]]],
    F: [[[50, 5], [10, 5], [10, 95]], [[10, 48], [40, 48]]],
    G: [[...ar(32, 50, 26, 45, -35, -360), [36, 52]]],
    H: [[[10, 5], [10, 95]], [[50, 5], [50, 95]], [[10, 50], [50, 50]]],
    I: [[[30, 5], [30, 95]]],
    J: [[[42, 5], [42, 68], ...ar(26, 68, 16, 27, 0, 180)]],
    K: [[[10, 5], [10, 95]], [[50, 5], [10, 52]], [[24, 40], [52, 95]]],
    L: [[[10, 5], [10, 95], [50, 95]]],
    M: [[[8, 95], [8, 5], [30, 62], [52, 5], [52, 95]]],
    N: [[[8, 95], [8, 5], [52, 95], [52, 5]]],
    O: [ar(30, 50, 26, 45, -90, -450)],
    P: [[[10, 95], [10, 5]], [[10, 5], [30, 5], ...ar(30, 26, 22, 21, -90, 90), [10, 47]]],
    Q: [ar(30, 50, 26, 45, -90, -450), [[34, 70], [54, 98]]],
    R: [[[10, 95], [10, 5]], [[10, 5], [30, 5], ...ar(30, 26, 22, 21, -90, 90), [10, 47]], [[28, 47], [52, 95]]],
    S: [[...ar(30, 27, 22, 22, -35, -270), ...ar(30, 73, 24, 22, -90, 145)]],
    T: [[[8, 5], [52, 5]], [[30, 5], [30, 95]]],
    U: [[[10, 5], [10, 62], ...ar(30, 62, 20, 33, 180, 0), [50, 5]]],
    V: [[[6, 5], [30, 95], [54, 5]]],
    W: [[[3, 5], [17, 95], [30, 36], [43, 95], [57, 5]]],
    X: [[[8, 5], [52, 95]], [[52, 5], [8, 95]]],
    Y: [[[8, 5], [30, 50]], [[52, 5], [30, 50], [30, 95]]],
    Z: [[[8, 5], [52, 5], [8, 95], [52, 95]]],
    0: [ar(30, 50, 24, 45, -90, -450)],
    1: [[[16, 26], [32, 5], [32, 95]]],
    2: [[...ar(30, 28, 22, 22, -190, 20), [8, 95], [54, 95]]],
    3: [[...ar(28, 27, 22, 22, -150, 90), ...ar(28, 72, 24, 23, -90, 150)]],
    4: [[[38, 5], [6, 66], [56, 66]], [[38, 5], [38, 95]]],
    5: [[[48, 5], [14, 5], [12, 47], ...ar(27, 70, 25, 25, -125, 140)]],
    6: [[[44, 6], [18, 36], [9, 66], ...ar(30, 72, 22, 23, -170, -530)]],
    7: [[[8, 5], [52, 5], [24, 95]]],
    8: [[...ar(30, 27, 20, 22, 90, -270), ...ar(30, 72, 24, 23, -90, 270)]],
    9: [[...ar(30, 28, 22, 23, -10, -370), [52, 30], [46, 70], [26, 95]]],
    a: [ar(28, 52, 20, 20, -45, -405), [[48, 32], [48, 72]]],
    e: [[[8, 52], [48, 52], ...ar(28, 52, 20, 20, 0, -315)]],
    i: [[[30, 32], [30, 72]], [[30, 12], [30, 17]]],
    o: [ar(30, 52, 22, 20, -90, -450)],
    u: [[[10, 32], [10, 54], ...ar(26, 54, 16, 18, 180, 0), [42, 32]], [[42, 32], [42, 72]]],
    c: [ar(30, 52, 22, 20, -40, -320)],
    l: [[[30, 2], [30, 72]]],
    m: [[[8, 32], [8, 72]], [[8, 50], ...ar(19, 46, 11, 14, 180, 360), [30, 72]], [[30, 50], ...ar(41, 46, 11, 14, 180, 360), [52, 72]]],
    n: [[[10, 32], [10, 72]], [[10, 52], ...ar(26, 46, 16, 14, 180, 360), [42, 72]]],
    s: [[...ar(28, 42, 14, 10, -30, -270), ...ar(28, 62, 16, 10, -90, 150)]]
  };

  /* ---------- motor de trazado ---------- */
  function tracer(cfg) {
    const e = api.env(), W = e.W, H = e.H, A = e.A;
    const g = cv(), ink = cv();
    const tol = cfg.tol, look = Math.ceil(tol * 4 / 5) + 6;
    const wd = cfg.road ? tol * 2.2 : tol * 1.5;
    const P = cfg.strokes.map(s => resample(s, 5));
    let si = 0, pr = 0, down = 0, done = 0, ticks = 0;
    const col = cfg.color || (k => `hsl(${(k * 57 + 330) % 360},85%,52%)`);
    const mk = D(`position:absolute;left:0;top:0;width:${Math.max(40, tol * 1.7)}px;height:${Math.max(40, tol * 1.7)}px;margin:-${Math.max(40, tol * 1.7) / 2}px 0 0 -${Math.max(40, tol * 1.7) / 2}px;border-radius:50%;background:#06d6a0;border:4px solid #fff;box-shadow:0 4px 0 #0003;display:grid;place-items:center;font:900 ${Math.max(16, tol * .8)}px system-ui;color:#fff;pointer-events:none;z-index:5`);
    mk.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }], { duration: 650, iterations: Infinity, direction: 'alternate' });
    const fol = cfg.follow ? D(`position:absolute;left:0;top:0;width:${cfg.follow.z}px;height:${cfg.follow.z}px;pointer-events:none;z-index:6;filter:drop-shadow(0 4px 0 #0003)`, cfg.follow.html) : null;

    function draw() {
      g.clearRect(0, 0, W, H); ink.clearRect(0, 0, W, H);
      P.forEach((p, k) => {
        if (k < si) return;
        g.save(); g.globalAlpha = cfg.alpha == null ? 1 : cfg.alpha; g.lineCap = g.lineJoin = 'round';
        pathOn(g, p); g.strokeStyle = 'rgba(60,60,100,.17)'; g.lineWidth = wd; g.stroke();
        g.setLineDash([1, 15]); g.strokeStyle = '#fff'; g.lineWidth = 5; pathOn(g, p); g.stroke(); g.setLineDash([]);
        if (k === si && cfg.alpha !== 0) {
          const a = p[0], b = p[Math.min(5, p.length - 1)], ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
          g.translate(a[0], a[1]); g.rotate(ang); g.fillStyle = '#33334d'; g.beginPath(); g.moveTo(tol * 1.25 + 14, 0); g.lineTo(tol * 1.25, -9); g.lineTo(tol * 1.25, 9); g.fill();
        }
        g.restore();
      });
      ink.lineCap = ink.lineJoin = 'round';
      P.forEach((p, k) => {
        if (k > si) return; const n = k < si ? p.length : pr + 1; if (n < 2) return;
        ink.strokeStyle = col(k); ink.lineWidth = wd * .7; pathOn(ink, p, n); ink.stroke();
      });
      if (!done) {
        const h = P[si][pr];
        mk.style.transform = ''; mk.style.left = h[0] + 'px'; mk.style.top = h[1] + 'px';
        mk.textContent = cfg.nums && P.length > 1 ? si + 1 : '';
        mk.style.opacity = down ? .45 : 1;
        if (fol) { fol.style.left = h[0] - cfg.follow.z / 2 + 'px'; fol.style.top = h[1] - cfg.follow.z / 2 + 'px'; }
      }
    }
    function finishStroke() {
      si++; pr = 0;
      if (si >= P.length) {
        done = 1; down = 0; mk.remove(); draw();
        const c = P[P.length - 1][P[P.length - 1].length - 1];
        sfx('win', { v: .5 }); conf(c[0], c[1], 40); win(c[0], c[1]);
        if (cfg.onDone) to(cfg.onDone, cfg.delay || 1500);
      } else {
        sfx('good', { v: .5 }); hintPath(sub(P[si])); draw();
      }
    }
    A.onpointerdown = ev => {
      if (done) return;
      const q = pt(ev), h = P[si][pr];
      if (dist(q, h) < Math.max(tol * 2.4, 46)) { down = 1; sfx('tap', { v: .3, r: 1.2 }); draw(); }
    };
    A.onpointermove = ev => {
      if (!down || done) return;
      const q = pt(ev), p = P[si], hi = Math.min(p.length - 1, pr + look);
      let best = -1, bd = 1e9;
      for (let j = pr; j <= hi; j++) { const d = dist(q, p[j]); if (d < bd) { bd = d; best = j; } }
      if (bd < tol * 1.15 && best > pr) {
        pr = best;
        if (((pr / 9) | 0) !== ticks) { ticks = (pr / 9) | 0; tone(N[ticks % N.length], .22, 'triangle', .07); }
        if (pr >= p.length - 3) { pr = p.length - 1; finishStroke(); return; }
        draw();
      }
    };
    A.onpointerup = A.onpointerleave = () => { down = 0; if (!done) draw(); };
    hintPath(sub(P[0]));
    draw();
    return { destroy() { done = 1; } };
  }

  /* ---------- 1 · Sigue el camino ---------- */
  const ANIM = ['cat', 'dog', 'bunny', 'fish', 'owl', 'mouse', 'duck', 'sheep'], META = ['house', 'flower', 'star', 'crown', 'heart', 'cheese'];
  function roadPts(kind, W, H) {
    const m = Math.max(52, Math.min(W, H) * .12), w = W - 2 * m, h = H - 2 * m, cx = W / 2, cy = H / 2, o = [];
    if (kind === 'ona') for (let i = 0; i <= 120; i++) { const t = i / 120; o.push([m + w * t, cy + Math.sin(t * Math.PI * 4) * h * .34]); }
    else if (kind === 'zigzag') { const n = 6; for (let i = 0; i <= n; i++) o.push([m + w * i / n, i % 2 ? m + h * .06 : H - m - h * .06]); }
    else if (kind === 'S') for (let i = 0; i <= 120; i++) { const t = i / 120; o.push([cx + Math.sin(t * Math.PI * 2) * w * .3, m + h * t]); }
    else if (kind === 'espiral') { const r0 = Math.min(w, h) / 2; for (let i = 0; i <= 170; i++) { const t = i / 170, a = t * 2.3 * 2 * Math.PI - Math.PI / 2, r = r0 * (1 - t * .88); o.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); } }
    else if (kind === 'rulo') { const L = 3, tm = L * 2 * Math.PI, b = Math.min(h * .4, w / (tm + 3) * 1.6), a = (w - 2 * b) / tm; for (let i = 0; i <= 220; i++) { const th = i / 220 * tm; o.push([m + b + a * th - b * Math.sin(th), cy - b * Math.cos(th)]); } }
    else if (kind === 'muntanya') for (let i = 0; i <= 120; i++) { const t = i / 120; o.push([m + w * t, H - m - Math.abs(Math.sin(t * Math.PI * 3)) * h * .8]); }
    else { const n = 5; for (let i = 0; i <= n; i++) { o.push([m + w * i / n, H - m - h * i / n]); o.push([m + w * (i + 1) / n, H - m - h * i / n]); } o.pop(); }
    if (Math.random() < .5 && kind !== 'espiral') o.reverse();
    if (Math.random() < .5 && ['ona', 'zigzag', 'rulo', 'muntanya'].includes(kind)) o.forEach(p => p[1] = H - p[1]);
    return o;
  }
  add(CAT, 'Segueix el camí', 'cat', e => {
    const { A, W, H } = e; const kinds = ['ona', 'zigzag', 'S', 'espiral', 'rulo', 'muntanya', 'escala'], tols = [34, 30, 27, 24, 21, 18];
    let lvl = 0, last = '';
    (function round() {
      A.innerHTML = '';
      let k; do { k = rnd(kinds); } while (k === last && kinds.length > 1); last = k;
      const vert = H > W * 1.1 && k !== 'S' && k !== 'espiral', p = vert ? roadPts(k, H, W).map(q => [q[1], q[0]]) : roadPts(k, W, H), z = Math.min(86, Math.max(60, W / 9)), an = rnd(ANIM), me = rnd(META);
      const tol = tols[Math.min(lvl, tols.length - 1)] * Math.min(1, Math.max(.7, Math.min(W, H) / 420));
      const end = p[p.length - 1];
      sp(me, rnd(PAL), z, end[0] - z / 2, end[1] - z / 2).style.zIndex = 2;
      tracer({ strokes: [p], tol, road: true, nums: false, alpha: 1, color: () => `hsl(${(lvl * 47 + 130) % 360},75%,58%)`, follow: { z, html: S(an) }, onDone() { lvl++; round(); }, delay: 1400 });
    })();
  }, 'linear-gradient(#c8f0ff,#e4ffd6)', 'trace');

  /* ---------- 2 · Ondas y zigzags (pregrafismo) ---------- */
  function rowPts(kind, x0, x1, y, amp) {
    const o = [], n = 90;
    if (kind === 'zigzag') { const c = 7; for (let i = 0; i <= c; i++) o.push([x0 + (x1 - x0) * i / c, y + (i % 2 ? amp : -amp)]); }
    else if (kind === 'ones') for (let i = 0; i <= n; i++) { const t = i / n; o.push([x0 + (x1 - x0) * t, y + Math.sin(t * Math.PI * 2 * 4) * amp]); }
    else if (kind === 'arcs') for (let i = 0; i <= n; i++) { const t = i / n; o.push([x0 + (x1 - x0) * t, y + amp - Math.abs(Math.sin(t * Math.PI * 5)) * amp * 2]); }
    else if (kind === 'quadrats') { const c = 5, w = (x1 - x0) / (c * 2); let x = x0; o.push([x, y + amp]); for (let i = 0; i < c; i++) { o.push([x, y - amp]); x += w; o.push([x, y - amp]); o.push([x, y + amp]); x += w; o.push([x, y + amp]); } }
    else { const L = 4, tm = L * 2 * Math.PI, b = amp * .9, a = ((x1 - x0) - 2 * b) / tm; for (let i = 0; i <= 160; i++) { const th = i / 160 * tm; o.push([x0 + b + a * th - b * Math.sin(th), y - b * Math.cos(th)]); } }
    return o;
  }
  add(CAT, 'Ones i zigzags', 'pencil', e => {
    const { A, W, H } = e; const kinds = ['zigzag', 'ones', 'arcs', 'quadrats', 'rulos'];
    let ki = 0, lvl = 0;
    (function round() {
      A.innerHTML = '';
      const kind = kinds[ki % kinds.length], rows = Math.max(1, Math.min(3, Math.floor(H / 150))), m = Math.max(56, W * .09);
      const tol = [30, 26, 22, 19][Math.min(3, lvl)] * Math.min(1, Math.max(.72, Math.min(W, H) / 420));
      const amp = Math.min(54, H / (rows * 3.3)), strokes = [];
      for (let r = 0; r < rows; r++) strokes.push(rowPts(kind, m, W - m, H * (r + .5) / rows, amp));
      const z = Math.min(74, W / 9);
      tracer({ strokes, tol, nums: true, alpha: lvl > 4 ? .5 : 1, follow: { z, html: S('pencil', '#ffb703') }, onDone() { ki++; if (ki % kinds.length === 0) lvl++; round(); }, delay: 1400 });
    })();
  }, 'linear-gradient(#fff7d6,#ffe9f1)', 'trace');

  /* ---------- 3-6 · Letras y números ---------- */
  function glyphStrokes(ch, W, H) {
    const s = Math.min(W * .66 / 60, (H - 70) / 100), ox = (W - 60 * s) / 2, oy = (H - 100 * s) / 2 - 8;
    return F[ch].map(st => st.map(p => [ox + p[0] * s, oy + p[1] * s]));
  }
  function letterGame(chars, bg, icn) {
    return e => {
      const { A, W, H } = e; let idx = 0, pass = 0;
      (function round() {
        A.innerHTML = '';
        const ch = chars[idx], tol = [26, 21, 17][Math.min(2, pass)] * Math.min(1, Math.max(.75, Math.min(W, H) / 430)), alpha = [1, .55, .2][Math.min(2, pass)];
        // barra de progreso inferior
        const bar = D('position:absolute;left:0;right:0;bottom:8px;display:flex;justify-content:center;gap:5px;flex-wrap:wrap;pointer-events:none;padding:0 8px');
        chars.forEach((c, i) => D(`min-width:${Math.min(30, (W - 30) / chars.length)}px;height:${Math.min(30, (W - 30) / chars.length)}px;border-radius:9px;display:grid;place-items:center;font:800 ${Math.min(16, (W - 30) / chars.length * .6)}px system-ui;background:${i < idx ? '#06d6a0' : i === idx ? '#ffb703' : '#ffffffaa'};color:${i <= idx ? '#fff' : '#33334d99'};box-shadow:0 2px 0 #0002`, c, bar));
        say(ch);
        tracer({ strokes: glyphStrokes(ch, W, H), tol, nums: true, alpha, onDone() { idx++; if (idx >= chars.length) { idx = 0; pass++; conf(W / 2, H / 2, 90); } round(); }, delay: 1300 });
      })();
    };
  }
  add(CAT, 'Traça les vocals', 'owl', letterGame(['A', 'E', 'I', 'O', 'U']), 'linear-gradient(#fff3c4,#ffe0ef)', 'trace');
  add(CAT, "Traça l'abecedari", 'crown', letterGame('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')), 'linear-gradient(#e0f4ff,#f0e6ff)', 'trace');
  add(CAT, 'Traça els números', 'balloon', letterGame('0123456789'.split('')), 'linear-gradient(#e2ffe9,#fff7d6)', 'trace');
  add(CAT, 'Traça les minúscules', 'butterfly', letterGame(['o', 'i', 'l', 'c', 'e', 'a', 'u', 'n', 'm', 's']), 'linear-gradient(#ffe9f1,#e6f7ff)', 'trace');

  /* ---------- 7 · Une los puntos ---------- */
  const heart = (() => { const o = []; for (let i = 0; i < 15; i++) { const t = i / 15 * Math.PI * 2; o.push([.5 + 16 * Math.pow(Math.sin(t), 3) / 38, .45 - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 38]); } return o; })();
  const starPts = (() => { const o = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? .2 : .46, a = i * Math.PI / 5 - Math.PI / 2; o.push([.5 + r * Math.cos(a), .52 + r * Math.sin(a)]); } return o; })();
  const SHAPES = [
    { n: 'casa', c: '#ffb703', p: [[.1, .55], [.5, .15], [.9, .55], [.8, .55], [.8, .9], [.2, .9], [.2, .55]], k: 'house' },
    { n: 'vaixell', c: '#4cc9f0', p: [[.1, .62], [.45, .62], [.45, .1], [.82, .55], [.55, .55], [.55, .62], [.9, .62], [.75, .88], [.25, .88]], k: 'fish' },
    { n: 'coet', c: '#ff4d6d', p: [[.5, .05], [.65, .25], [.65, .7], [.82, .9], [.6, .82], [.4, .82], [.18, .9], [.35, .7], [.35, .25]], k: 'rocket' },
    { n: 'peix', c: '#06d6a0', p: [[.08, .5], [.28, .3], [.55, .26], [.76, .4], [.9, .27], [.95, .5], [.9, .73], [.76, .6], [.55, .74], [.28, .7]], k: 'fish' },
    { n: 'estrella', c: '#ffd23f', p: starPts, k: 'star' },
    { n: 'arbre', c: '#3fbf55', p: [[.5, .06], [.76, .36], [.64, .36], [.86, .62], [.58, .62], [.58, .92], [.42, .92], [.42, .62], [.14, .62], [.36, .36], [.24, .36]], k: 'tree' },
    { n: 'cor', c: '#ff4d6d', p: heart, k: 'heart' }
  ];
  add(CAT, 'Uneix els punts', 'star', e => {
    const { A, W, H } = e; let si = 0;
    (function round() {
      A.innerHTML = '';
      const sh = SHAPES[si % SHAPES.length], s = Math.min(W * .86, (H - 20) * .94), ox = (W - s) / 2, oy = (H - s) / 2;
      const pts = sh.p.map(q => [ox + q[0] * s, oy + q[1] * s]), z = Math.max(30, Math.min(46, s / 10));
      const x = cv(); let nx = 1, down = 0;
      const dots = pts.map((p, i) => D(`position:absolute;left:${p[0] - z / 2}px;top:${p[1] - z / 2}px;width:${z}px;height:${z}px;border-radius:50%;background:#fff;border:4px solid #33334d;display:grid;place-items:center;font:900 ${z * .5}px system-ui;color:#33334d;box-shadow:0 3px 0 #0003;pointer-events:none;z-index:3`, String(i + 1)));
      const pulse = i => { dots.forEach(d => d.getAnimations().forEach(a => a.cancel())); if (dots[i]) { dots[i].style.borderColor = '#06d6a0'; dots[i].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }], { duration: 600, iterations: Infinity, direction: 'alternate' }); } };
      pulse(1); dots[0].style.background = '#ffd23f';
      api.hintPath([pts[0], pts[1]]);
      function link() {
        if (nx >= pts.length) return;
        const a = pts[nx - 1], b = pts[nx];
        x.strokeStyle = sh.c; x.lineWidth = 9; x.lineCap = 'round'; x.beginPath(); x.moveTo(a[0], a[1]); x.lineTo(b[0], b[1]); x.stroke();
        dots[nx].style.background = '#06d6a0'; dots[nx].style.color = '#fff'; dots[nx].style.borderColor = '#fff';
        tone(N[nx % N.length], .25, 'triangle', .1); nx++;
        if (nx < pts.length) { pulse(nx); api.hintPath([pts[nx - 1], pts[nx]]); }
        else {
          dots.forEach(d => d.getAnimations().forEach(a => a.cancel()));
          x.beginPath(); pts.forEach((p, i) => i ? x.lineTo(p[0], p[1]) : x.moveTo(p[0], p[1])); x.closePath(); x.globalAlpha = .55; x.fillStyle = sh.c; x.fill(); x.globalAlpha = 1; x.stroke();
          const bs = s * .42, r = sp(sh.k, sh.c, bs, W / 2 - bs / 2, H / 2 - bs / 2); r.style.zIndex = 4; r.animate([{ transform: 'scale(0) rotate(-40deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 520, easing: 'cubic-bezier(.3,1.8,.5,1)' });
          sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); win(W / 2, H / 2);
          to(() => { si++; round(); }, 2200);
        }
      }
      const hit = ev => { if (nx >= pts.length) return; const q = pt(ev); if (dist(q, pts[nx]) < z * .95) link(); };
      A.onpointerdown = ev => { down = 1; hit(ev); }; A.onpointermove = ev => { if (down) hit(ev); }; A.onpointerup = A.onpointerleave = () => { down = 0; };
    })();
  }, 'linear-gradient(#fff9e0,#e8f7ff)', 'drag');

  /* ---------- 8 · Laberinto ---------- */
  function mkMaze(c, r) {
    const cell = () => ({ u: 1, r: 1, d: 1, l: 1, v: 0 }), g = Array.from({ length: r }, () => Array.from({ length: c }, cell));
    const st = [[0, 0]]; g[0][0].v = 1;
    while (st.length) {
      const [x, y] = st[st.length - 1], nb = [];
      if (y > 0 && !g[y - 1][x].v) nb.push([x, y - 1, 'u', 'd']); if (x < c - 1 && !g[y][x + 1].v) nb.push([x + 1, y, 'r', 'l']);
      if (y < r - 1 && !g[y + 1][x].v) nb.push([x, y + 1, 'd', 'u']); if (x > 0 && !g[y][x - 1].v) nb.push([x - 1, y, 'l', 'r']);
      if (!nb.length) { st.pop(); continue; }
      const [nx, ny, a, b] = rnd(nb); g[y][x][a] = 0; g[ny][nx][b] = 0; g[ny][nx].v = 1; st.push([nx, ny]);
    }
    // abre algún pasillo extra para que no sea un camino único (más fácil para los pequeños)
    for (let k = 0; k < Math.floor(c * r / 6); k++) { const x = I(c - 1), y = I(r); g[y][x].r = 0; g[y][x + 1].l = 0; }
    return g;
  }
  add(CAT, 'Laberint', 'mouse', e => {
    const { A, W, H } = e; const sizes = [[3, 2], [4, 3], [5, 3], [5, 4], [6, 4], [7, 5], [8, 5]]; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      let [c, r] = sizes[Math.min(lvl, sizes.length - 1)];
      while (c > 2 && (W - 30) / c < 50) c--; while (r > 2 && (H - 30) / r < 50) r--;
      const g = mkMaze(c, r), z = Math.min((W - 30) / c, (H - 30) / r), ox = (W - z * c) / 2, oy = (H - z * r) / 2;
      const x = cv(), fl = cv();
      x.strokeStyle = '#4a3f7a'; x.lineWidth = Math.max(5, z * .09); x.lineCap = 'round';
      x.beginPath();
      for (let j = 0; j < r; j++) for (let i = 0; i < c; i++) {
        const X0 = ox + i * z, Y0 = oy + j * z, k = g[j][i];
        if (k.u) { x.moveTo(X0, Y0); x.lineTo(X0 + z, Y0); } if (k.l) { x.moveTo(X0, Y0); x.lineTo(X0, Y0 + z); }
        if (j === r - 1 && k.d) { x.moveTo(X0, Y0 + z); x.lineTo(X0 + z, Y0 + z); } if (i === c - 1 && k.r) { x.moveTo(X0 + z, Y0); x.lineTo(X0 + z, Y0 + z); }
      }
      x.stroke();
      const cc = (i, j) => [ox + (i + .5) * z, oy + (j + .5) * z], pz = z * .72;
      const goal = sp(rnd(['cheese', 'house', 'flower', 'star']), rnd(PAL), pz, 0, 0); const gp = cc(c - 1, r - 1); goal.style.left = gp[0] - pz / 2 + 'px'; goal.style.top = gp[1] - pz / 2 + 'px';
      const me = sp(rnd(['mouse', 'cat', 'bunny', 'dog', 'duck']), undefined, pz, 0, 0); me.style.zIndex = 5; me.style.transition = 'left .12s,top .12s';
      let cx = 0, cy = 0, down = 0, finished = 0;
      const place = () => { const p = cc(cx, cy); me.style.left = p[0] - pz / 2 + 'px'; me.style.top = p[1] - pz / 2 + 'px'; }; place();
      api.hintPath([cc(0, 0), cc(Math.min(1, c - 1), 0), cc(Math.min(1, c - 1), Math.min(1, r - 1))]);
      const neigh = (i, j) => { const k = g[j][i], o = []; if (!k.u) o.push([i, j - 1]); if (!k.r) o.push([i + 1, j]); if (!k.d) o.push([i, j + 1]); if (!k.l) o.push([i - 1, j]); return o; };
      function bfs(tx, ty) {
        const q = [[cx, cy]], pv = { [cx + ',' + cy]: null };
        while (q.length) { const [i, j] = q.shift(); if (i === tx && j === ty) break; neigh(i, j).forEach(([a, b]) => { const kk = a + ',' + b; if (!(kk in pv)) { pv[kk] = [i, j]; q.push([a, b]); } }); }
        const path = []; let cur = [tx, ty]; if (!((tx + ',' + ty) in pv)) return []; while (cur && !(cur[0] === cx && cur[1] === cy)) { path.unshift(cur); cur = pv[cur[0] + ',' + cur[1]]; } return path;
      }
      function goTo(ev) {
        if (finished) return; const q = pt(ev), tx = Math.floor((q[0] - ox) / z), ty = Math.floor((q[1] - oy) / z);
        if (tx < 0 || ty < 0 || tx >= c || ty >= r || (tx === cx && ty === cy)) return;
        const path = bfs(tx, ty); if (!path.length || path.length > 3) return;
        path.forEach(([i, j]) => { const a = cc(cx, cy), b = cc(i, j); fl.strokeStyle = '#ffb70388'; fl.lineWidth = z * .26; fl.lineCap = 'round'; fl.beginPath(); fl.moveTo(a[0], a[1]); fl.lineTo(b[0], b[1]); fl.stroke(); cx = i; cy = j; });
        place(); tone(N[(cx + cy) % N.length], .18, 'triangle', .07);
        if (cx === c - 1 && cy === r - 1) { finished = 1; const p = cc(cx, cy); sfx('win', { v: .5 }); conf(p[0], p[1], 50); win(p[0], p[1]); to(() => { lvl++; round(); }, 1500); }
      }
      A.onpointerdown = ev => { down = 1; goTo(ev); }; A.onpointermove = ev => { if (down) goTo(ev); }; A.onpointerup = A.onpointerleave = () => { down = 0; };
    })();
  }, 'linear-gradient(#e6f7ff,#f3ffe6)', 'move');

  /* ---------- nombres y textos ---------- */
  tr('Segueix el camí', 'Sigue el camino', 'Follow the path', "Posa el dit sobre l'animal i segueix el camí fins al final.", 'Pon el dedo sobre el animal y sigue el camino hasta el final.', 'Put your finger on the animal and follow the road to the end.');
  tr('Ones i zigzags', 'Ondas y zigzags', 'Waves and zigzags', 'Posa el dit al cercle verd i dibuixa la línia sense sortir-te del camí.', 'Pon el dedo en el círculo verde y dibuja la línea sin salirte del camino.', 'Put your finger on the green circle and draw the line without leaving the path.');
  tr('Traça les vocals', 'Traza las vocales', 'Trace the vowels', 'Comença pel cercle verd i segueix la lletra. Fes-ho en ordre!', 'Empieza por el círculo verde y sigue la letra. ¡Hazlo en orden!', 'Start at the green circle and follow the letter. Do it in order!');
  tr("Traça l'abecedari", 'Traza el abecedario', 'Trace the alphabet', "Comença pel cercle verd i segueix la lletra. Quan en facis una, passes a la següent.", 'Empieza por el círculo verde y sigue la letra. Al terminar pasas a la siguiente.', 'Start at the green circle and follow the letter. When you finish, you move on to the next.');
  tr('Traça els números', 'Traza los números', 'Trace the numbers', 'Comença pel cercle verd i segueix el número, del 0 al 9.', 'Empieza por el círculo verde y sigue el número, del 0 al 9.', 'Start at the green circle and follow the number, from 0 to 9.');
  tr('Traça les minúscules', 'Traza las minúsculas', 'Trace lowercase letters', 'Comença pel cercle verd i segueix la lletra minúscula.', 'Empieza por el círculo verde y sigue la letra minúscula.', 'Start at the green circle and follow the lowercase letter.');
  tr('Uneix els punts', 'Une los puntos', 'Connect the dots', 'Toca els punts en ordre, de l’1 fins al final, per dibuixar la figura.', 'Toca los puntos en orden, del 1 hasta el final, para dibujar la figura.', 'Touch the dots in order, from 1 to the end, to draw the picture.');
  tr('Laberint', 'Laberinto', 'Maze', 'Arrossega el dit per ajudar l’animal a arribar a la sortida.', 'Arrastra el dedo para ayudar al animal a llegar a la salida.', 'Drag your finger to help the animal reach the exit.');
});
