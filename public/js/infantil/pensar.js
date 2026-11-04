/* Placeta Junior · Infantil · PIENSA Y JUEGA + MÁS DIVERSIÓN
   Letras iniciales, números, cantidades, escucha, observación, construcción y cocina con cuentas. */
(window.PJINF = window.PJINF || []).push(function (api) {
  'use strict';
  const { X, PAL, R, I, rnd, D, S, sp, pt, to, win, conf, sfx, tone, dg, cen, say, tr, add } = api;
  const shuf = a => a.slice().sort(() => Math.random() - .5);
  const shake = el => el.animate([{ transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0)' }], { duration: 320 });
  const li = () => ({ ca: 0, es: 1, en: 2 }[api.lang()] || 1);
  const T3 = (a, b, c) => [a, b, c][li()];
  const WORDS = { cat: ['GAT', 'GATO', 'CAT'], dog: ['GOS', 'PERRO', 'DOG'], bunny: ['CONILL', 'CONEJO', 'RABBIT'], fish: ['PEIX', 'PEZ', 'FISH'], butterfly: ['PAPALLONA', 'MARIPOSA', 'BUTTERFLY'], owl: ['MUSSOL', 'BÚHO', 'OWL'], rocket: ['COET', 'COHETE', 'ROCKET'], monster: ['MONSTRE', 'MONSTRUO', 'MONSTER'], car: ['COTXE', 'COCHE', 'CAR'], sun: ['SOL', 'SOL', 'SUN'], moon: ['LLUNA', 'LUNA', 'MOON'], house: ['CASA', 'CASA', 'HOUSE'], star: ['ESTEL', 'ESTRELLA', 'STAR'], flower: ['FLOR', 'FLOR', 'FLOWER'], balloon: ['GLOBUS', 'GLOBO', 'BALLOON'], apple: ['POMA', 'MANZANA', 'APPLE'], carrot: ['PASTANAGA', 'ZANAHORIA', 'CARROT'], cheese: ['FORMATGE', 'QUESO', 'CHEESE'], sheep: ['OVELLA', 'OVEJA', 'SHEEP'], duck: ['ÀNEC', 'PATO', 'DUCK'], mouse: ['RATOLÍ', 'RATÓN', 'MOUSE'], tree: ['ARBRE', 'ÁRBOL', 'TREE'], heart: ['COR', 'CORAZÓN', 'HEART'], crown: ['CORONA', 'CORONA', 'CROWN'], strawberry: ['FRAGA', 'FRESA', 'STRAWBERRY'], orange: ['TARONJA', 'NARANJA', 'ORANGE'], cloud: ['NÚVOL', 'NUBE', 'CLOUD'] };
  const word = k => WORDS[k][li()], first = w => w.normalize('NFD')[0];
  const btn = (txt, z, c, x, y, extra = '') => D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border-radius:24px;background:${c};box-shadow:0 7px 0 #0003;display:grid;place-items:center;font:900 ${z * .55}px system-ui;color:#fff;cursor:pointer;user-select:none;${extra}`, txt);
  const next = (A, f, ms = 1500) => to(f, ms);

  /* ---------- ¿Con qué letra empieza? ---------- */
  add(5, 'Quina lletra comença?', 'owl', e => {
    const { A, W, H } = e; let last = '';
    (function round() {
      A.innerHTML = '';
      let k; do { k = rnd(Object.keys(WORDS)); } while (k === last); last = k;
      const w = word(k), L = first(w), pool = 'ABCDEFGHIJLMNOPRSTUV'.split('').filter(c => c !== L), opts = shuf([L, ...shuf(pool).slice(0, 2)]);
      const z = Math.min(H * .42, W * .36, 230); sp(k, undefined, z, W / 2 - z / 2, H * .05);
      const lab = D(`position:absolute;left:0;right:0;top:${H * .05 + z + 6}px;text-align:center;font:900 ${Math.min(46, W / 12)}px system-ui;color:#33334d;letter-spacing:4px;height:56px`, '');
      const bz = Math.min(120, W / 5); let done = 0;
      opts.forEach((c, i) => { const b = btn(c, bz, PAL[(i * 2 + 1) % PAL.length], W / 2 + (i - 1) * bz * 1.4, H - bz * .75 - 20);
        b.onpointerdown = () => { if (done) return; if (c === L) { done = 1; b.style.outline = '6px solid #06d6a0'; lab.textContent = w; say(w); sfx('good', { v: .5 }); win(W / 2, H * .3); next(A, round); } else { shake(b); sfx('close', { v: .4 }); } }; });
      api.hintPath([[W / 2, H * .3], [W / 2, H - bz]]);
    })();
  }, 'linear-gradient(#fff6c9,#ffe3ee)', 'tap');

  /* ---------- Número que falta ---------- */
  add(5, 'El número que falta', 'balloon', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const step = lvl < 4 ? 1 : lvl < 7 ? 2 : lvl < 10 ? 5 : 10, max = lvl < 2 ? 6 : lvl < 4 ? 12 : 20, start = (I(Math.max(1, max - 4)) + 1) * (step === 1 ? 1 : 1), seq = [...Array(5)].map((_, i) => (step === 1 ? start : step * (1 + I(4))) + i * step), m = 1 + I(3);
      const z = Math.min(110, (W - 40) / 5 - 12), y = H * .3, tiles = [];
      seq.forEach((n, i) => { const x = (i + .5) * W / 5, t = D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border-radius:22px;background:${i === m ? '#ffffffcc' : PAL[i % PAL.length]};${i === m ? 'border:5px dashed #33334d66;' : 'box-shadow:0 6px 0 #0003;'}display:grid;place-items:center;font:900 ${z * .55}px system-ui;color:${i === m ? '#33334d55' : '#fff'};box-sizing:border-box`, i === m ? '?' : String(n)); tiles.push(t); });
      const ans = seq[m], set = new Set([ans]); while (set.size < 3) { const c = ans + (I(2) ? 1 : -1) * step * (1 + I(2)); if (c > 0) set.add(c); }
      let done = 0;
      shuf([...set]).forEach((v, i) => { const b = btn(String(v), z, PAL[(i * 2 + 2) % PAL.length], W / 2 + (i - 1) * z * 1.4, H - z * .7 - 20);
        b.onpointerdown = () => { if (done) return; if (v === ans) { done = 1; tiles[m].textContent = String(ans); tiles[m].style.cssText = tiles[m].style.cssText.replace(/border:[^;]+;/, '') + ';background:#06d6a0;color:#fff;box-shadow:0 6px 0 #0003'; say(String(ans)); sfx('good', { v: .5 }); win(W / 2, y); next(A, () => { lvl++; round(); }); } else { shake(b); sfx('close', { v: .4 }); } }; });
      api.hintPath([[W / 2, H - z], [(m + .5) * W / 5, y]]);
    })();
  }, 'linear-gradient(#e2fbff,#f6ecff)', 'tap');

  /* ---------- Más o menos ---------- */
  add(5, 'Més o menys', 'bunny', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const more = lvl % 2 === 0, k = rnd(['apple', 'star', 'duck', 'balloon', 'heart', 'fish', 'flower']), col = rnd(PAL), mx = Math.min(9, 4 + lvl);
      let a = 1 + I(mx), b; do { b = 1 + I(mx); } while (b === a);
      const label = D(`position:absolute;left:0;right:0;top:8px;text-align:center;font:900 ${Math.min(44, W / 12)}px system-ui;color:${more ? '#06a077' : '#e0457b'}`, more ? T3('MÉS', 'MÁS', 'MORE') : T3('MENYS', 'MENOS', 'FEWER'));
      say(more ? T3('Toca el grup amb més', 'Toca el grupo con más', 'Tap the group with more') : T3('Toca el grup amb menys', 'Toca el grupo con menos', 'Tap the group with fewer'));
      const P = H > W * 1.1, pw = P ? W - 20 : W * .44, ph = P ? (H - 96) / 2 : H - 90, panels = []; let done = 0;
      [a, b].forEach((n, i) => {
        const p = D(`position:absolute;left:${P ? 10 : (i ? W * .52 : W * .04)}px;top:${P ? 70 + i * (ph + 12) : 70}px;width:${pw}px;height:${ph}px;border-radius:26px;background:#ffffffcc;box-shadow:0 7px 0 #0002;display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-content:center;padding:14px;box-sizing:border-box;cursor:pointer`);
        const z = Math.min(P ? 120 : 86, pw / 3 - 10, ph / 3 - 10); for (let j = 0; j < n; j++) D(`width:${z}px;height:${z}px`, S(k, col), p);
        p.onpointerdown = () => { if (done) return; const ok = more ? n > (i ? a : b) : n < (i ? a : b); if (ok) { done = 1; p.style.outline = '7px solid #06d6a0'; sfx('good', { v: .5 }); win(W / 2, H / 2); next(A, () => { lvl++; round(); }); } else { shake(p); sfx('close', { v: .4 }); } };
        panels.push(p);
      });
      api.hintPath([[W / 2, H * .9], [W * .26, H * .5]]);
    })();
  }, 'linear-gradient(#e7fff1,#fffbe0)', 'tap');

  /* ---------- Escucha y toca ---------- */
  add(5, 'Escolta i toca', 'mouse', e => {
    const { A, W, H } = e; let last = '';
    (function round() {
      A.innerHTML = '';
      const keys = Object.keys(WORDS); let k; do { k = rnd(keys); } while (k === last); last = k;
      const set = shuf([k, ...shuf(keys.filter(x => x !== k)).slice(0, 2)]), w = word(k), z = Math.min(160, (W - 40) / 3 - 14, H * .4); let done = 0;
      const sp0 = D(`position:absolute;left:${W / 2 - 52}px;top:${H * .08}px;width:104px;height:104px;border-radius:50%;background:#9b5de5;box-shadow:0 7px 0 #0003;display:grid;place-items:center;cursor:pointer`, '<svg viewBox="0 0 24 24" width="58" height="58"><path d="M3 9v6h4l5 4V5L7 9z" fill="#fff"/><path d="M15 8q3 4 0 8M18 5q6 7 0 14" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>');
      sp0.onpointerdown = () => { say(w); sp0.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }], { duration: 350 }); };
      const lab = D(`position:absolute;left:0;right:0;top:${H * .08 + 116}px;text-align:center;font:900 ${Math.min(40, W / 14)}px system-ui;color:#33334d99;letter-spacing:3px`, w);
      to(() => say(w), 350);
      set.forEach((c, i) => { const card = D(`position:absolute;left:${W / 2 + (i - 1) * (z + 22) - z / 2}px;top:${H - z - 34}px;width:${z}px;height:${z}px;border-radius:30px;background:#fff;box-shadow:0 7px 0 #0003;padding:${z * .08}px;box-sizing:border-box;cursor:pointer`, S(c));
        card.onpointerdown = () => { if (done) return; if (c === k) { done = 1; card.style.outline = '7px solid #06d6a0'; lab.style.color = '#06a077'; sfx('good', { v: .5 }); win(W / 2, H * .6); next(A, round); } else { shake(card); sfx('close', { v: .4 }); } }; });
      api.hintPath([[W / 2, H * .2], [W / 2, H - z]]);
    })();
  }, 'linear-gradient(#f0e7ff,#e2f6ff)', 'tap');

  /* ---------- ¿Cuál es diferente? ---------- */
  add(5, 'Quin és diferent?', 'butterfly', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const n = Math.min(9, 4 + (lvl >> 1)), cols = n <= 4 ? 2 : n <= 6 ? 3 : 3, rows = Math.ceil(n / cols), mode = lvl % 3, ks = ['cat', 'dog', 'bunny', 'owl', 'duck', 'mouse', 'sheep', 'fish', 'butterfly'], k = rnd(ks), k2 = rnd(ks.filter(x => x !== k)), c1 = rnd(PAL);
      let c2 = c1; if (mode === 1) { do { c2 = rnd(PAL); } while (c2 === c1); }
      const odd = I(n), z = Math.min(150, (W - 40) / cols - 16, (H - 30) / rows - 16); let done = 0;
      for (let i = 0; i < n; i++) {
        const x = W / 2 + ((i % cols) - (cols - 1) / 2) * (z + 16) - z / 2, y = H / 2 + (((i / cols) | 0) - (rows - 1) / 2) * (z + 16) - z / 2, isOdd = i === odd;
        const kk = isOdd && mode === 0 ? k2 : k, cc = isOdd && mode === 1 ? c2 : c1, d = D(`position:absolute;left:${x}px;top:${y}px;width:${z}px;height:${z}px;border-radius:26px;background:#ffffffcc;box-shadow:0 6px 0 #0002;padding:${z * .08}px;box-sizing:border-box;cursor:pointer`, `<div style="width:100%;height:100%;${isOdd && mode === 2 ? 'transform:scaleX(-1)' : ''}">${S(kk, cc)}</div>`);
        d.onpointerdown = () => { if (done) return; if (isOdd) { done = 1; d.style.outline = '7px solid #06d6a0'; sfx('good', { v: .5 }); win(x + z / 2, y + z / 2); next(A, () => { lvl++; round(); }); } else { shake(d); sfx('close', { v: .4 }); } };
      }
      api.hintPath([[W * .8, H * .8], [W / 2, H / 2]]);
    })();
  }, 'linear-gradient(#fff4d6,#ffe6f2)', 'tap');

  /* ---------- Monta el robot ---------- */
  const PART = {
    head: (c, w, h) => `<svg viewBox="0 0 40 28" width="${w}" height="${h}" preserveAspectRatio="none"><rect x="19" y="0" width="2" height="5" fill="#8e9bb0"/><circle cx="20" cy="2.2" r="2.4" fill="#ff4d6d"/><rect x="2" y="4" width="36" height="22" rx="7" fill="${c}"/><rect x="7" y="9" width="26" height="12" rx="5" fill="#22304a"/><circle cx="15" cy="15" r="3" fill="#7df9ff"/><circle cx="25" cy="15" r="3" fill="#7df9ff"/></svg>`,
    torso: (c, w, h) => `<svg viewBox="0 0 44 38" width="${w}" height="${h}" preserveAspectRatio="none"><rect x="1" y="1" width="42" height="36" rx="7" fill="${c}"/><rect x="1" y="26" width="42" height="11" rx="6" fill="#0002"/><circle cx="22" cy="15" r="6" fill="#ffd23f"/><circle cx="20" cy="13" r="2" fill="#fff9"/></svg>`,
    arm: (c, w, h) => `<svg viewBox="0 0 16 32" width="${w}" height="${h}" preserveAspectRatio="none"><rect x="2" y="1" width="12" height="24" rx="6" fill="#8e9bb0"/><circle cx="8" cy="26" r="5.5" fill="${c}"/></svg>`,
    leg: (c, w, h) => `<svg viewBox="0 0 16 26" width="${w}" height="${h}" preserveAspectRatio="none"><rect x="3" y="0" width="10" height="17" rx="4" fill="#8e9bb0"/><rect x="0" y="16" width="16" height="9" rx="4.5" fill="${c}"/></svg>`
  };
  add(6, 'Munta el robot', 'robot', e => {
    const { A, W, H } = e; let lvl = 0; const COL = ['#4cc9f0', '#ff4d6d', '#06d6a0', '#9b5de5', '#ffb703'];
    (function round() {
      A.innerHTML = '';
      const c = COL[lvl % COL.length], P = H > W * 1.1, s = P ? Math.min(W * .8, H * .5) : Math.min(H * .86, W * .46), bx = P ? (W - s) / 2 : W * .05, by = P ? H * .03 : (H - s) / 2;
      const defs = [['head', 30, 2, 40, 28], ['torso', 28, 32, 44, 38], ['arm', 8, 34, 16, 32], ['arm', 76, 34, 16, 32], ['leg', 32, 72, 16, 26], ['leg', 52, 72, 16, 26]], parts = []; let left = defs.length;
      const sc = s / 100;
      defs.forEach(([t, x, y, w, h], i) => {
        const tx = bx + x * sc, ty = by + y * sc, pw = w * sc, ph = h * sc;
        D(`position:absolute;left:${tx}px;top:${ty}px;width:${pw}px;height:${ph}px;opacity:.22;filter:brightness(0)`, PART[t]('#000', pw, ph));
        const ox = P ? R(10, W - pw - 10) : R(W * .55, W - pw - 20), oy = P ? R(by + s + 8, Math.max(by + s + 9, H - ph - 10)) : R(20, H - ph - 20), d = D(`position:absolute;left:${ox}px;top:${oy}px;width:${pw}px;height:${ph}px;z-index:5`, PART[t](c, pw, ph));
        dg(d, (cx, cy) => {
          if (Math.hypot(cx - (tx + pw / 2), cy - (ty + ph / 2)) < s * .2) { d.style.transition = 'left .2s,top .2s'; d.style.left = tx + 'px'; d.style.top = ty + 'px'; d.style.zIndex = 3; d.onpointerdown = null; d.style.cursor = 'default'; sfx('tap', { r: 1 + i * .08, v: .5 }); win(tx + pw / 2, ty + ph / 2); parts.push(d); if (--left === 0) { parts.forEach((q, j) => q.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-6deg) translateY(-8px)' }, { transform: 'rotate(6deg)' }, { transform: 'rotate(0)' }], { duration: 700, iterations: 3, delay: j * 40 })); sfx('win', { v: .5 }); conf(bx + s / 2, H / 2, 70); to(() => { lvl++; round(); }, 2600); } }
          else { if (defs.some((q, j) => j !== i && Math.hypot(cx - (bx + (q[1] + q[3] / 2) * sc), cy - (by + (q[2] + q[4] / 2) * sc)) < s * .2)) { shake(d); sfx('close', { v: .4 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        });
      });
      api.hintPath([[W * .75, H * .5], [bx + s / 2, by + s * .15]]);
    })();
  }, 'linear-gradient(#dff6ff,#fdeaff)', 'drag');

  /* ---------- Cocina la pizza ---------- */
  add(6, 'Cuina la pizza', 'tomato', e => {
    const { A, W, H } = e; let lvl = 0;
    const OLIVE = '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#2b2b3a"/><circle cx="50" cy="50" r="15" fill="#f6dba8"/><ellipse cx="34" cy="32" rx="8" ry="4" fill="#fff4" transform="rotate(-35 34 32)"/></svg>';
    const TOP = [['tomato', '#ef476f'], ['mushroom', '#e8845a'], ['olive']];
    (function round() {
      A.innerHTML = '';
      const need = Math.min(5, 1 + (lvl >> 1) + I(2) + (lvl > 0 ? 1 : 0)), ti = I(3), PT = H > W * 1.1, pz = Math.min(H * (PT ? .5 : .6), W * (PT ? .82 : .46)), px = W / 2 - pz / 2, py = H * (PT ? .15 : .08), tz = Math.min(76, pz / 4), placed = [];
      D(`position:absolute;left:${px}px;top:${py}px;width:${pz}px;height:${pz}px;border-radius:50%;background:#e0a458;box-shadow:0 8px 0 #0003`);
      D(`position:absolute;left:${px + pz * .06}px;top:${py + pz * .06}px;width:${pz * .88}px;height:${pz * .88}px;border-radius:50%;background:radial-gradient(#ffe27a,#ffcf4a)`);
      const sauce = D(`position:absolute;left:${px + pz * .1}px;top:${py + pz * .1}px;width:${pz * .8}px;height:${pz * .8}px;border-radius:50%;border:5px dotted #f4a261aa;box-sizing:border-box`);
      const srcHTML = i => TOP[i][0] === 'olive' ? OLIVE : S(TOP[i][0], TOP[i][1]);
      const card = D(`position:absolute;left:12px;top:12px;display:flex;align-items:center;gap:8px;padding:8px 16px;border-radius:30px;background:#fff;box-shadow:0 5px 0 #0003;font:900 ${Math.min(50, W / 12)}px system-ui;color:#33334d`, `<div style="width:${tz * .9}px;height:${tz * .9}px">${srcHTML(ti)}</div>× ${need}`);
      say(String(need));
      const count = () => placed.filter(q => q.i === ti).length; let done = 0;
      const check = () => { if (done) return; const n = count(); if (n === need && placed.length === need) { done = 1; sfx('win', { v: .5 }); conf(W / 2, py + pz / 2, 70); win(W / 2, py + pz / 2); card.style.background = '#c9f7df'; to(() => { lvl++; round(); }, 1800); } else if (n > need) { const q = placed.filter(q2 => q2.i === ti).pop(); drop(q); shake(card); sfx('close', { v: .4 }); } };
      const drop = q => { placed.splice(placed.indexOf(q), 1); q.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200 }).onfinish = () => q.el.remove(); };
      TOP.forEach((t, i) => {
        const x = W / 2 + (i - 1) * Math.min(W * .26, 190) - tz / 2, y = H - tz - 22;
        D(`position:absolute;left:${x - 10}px;top:${y - 10}px;width:${tz + 20}px;height:${tz + 20}px;border-radius:50%;background:#ffffffaa;box-shadow:0 5px 0 #0002`);
        const src = D(`position:absolute;left:${x}px;top:${y}px;width:${tz}px;height:${tz}px;cursor:grab;touch-action:none;z-index:6`, srcHTML(i));
        src.onpointerdown = ev => {
          const a = A.getBoundingClientRect(), el = D(`position:absolute;left:${ev.clientX - a.left - tz / 2}px;top:${ev.clientY - a.top - tz / 2}px;width:${tz}px;height:${tz}px;z-index:20;touch-action:none`, srcHTML(i)); el.setPointerCapture(ev.pointerId); sfx('tap', { v: .4 });
          el.onpointermove = m => { el.style.left = m.clientX - a.left - tz / 2 + 'px'; el.style.top = m.clientY - a.top - tz / 2 + 'px'; };
          el.onpointerup = m => {
            const cx = m.clientX - a.left, cy = m.clientY - a.top; el.onpointermove = el.onpointerup = null;
            if (Math.hypot(cx - (px + pz / 2), cy - (py + pz / 2)) < pz * .43) { const q = { el, i }; placed.push(q); el.style.zIndex = 4; el.style.cursor = 'pointer'; el.onpointerdown = () => { if (!done) { drop(q); sfx('close', { v: .3 }); } }; sfx('tap', { r: 1.3, v: .5 }); if (i !== ti) { shake(card); sfx('close', { v: .4 }); to(() => drop(q), 350); } else check(); }
            else el.remove();
          };
        };
      });
      api.hintPath([[W / 2 + (ti - 1) * Math.min(W * .26, 190), H - tz], [W / 2, py + pz / 2]]);
    })();
  }, 'linear-gradient(#fff0d6,#ffe0cf)', 'drag');

  /* ---------- nombres y textos ---------- */
  tr('Quina lletra comença?', '¿Con qué letra empieza?', 'Which letter does it start with?', 'Mira el dibuix i toca la lletra amb què comença el seu nom.', 'Mira el dibujo y toca la letra con la que empieza su nombre.', 'Look at the picture and tap the letter its name starts with.');
  tr('El número que falta', 'El número que falta', 'The missing number', 'Mira els números i toca el que falta.', 'Mira los números y toca el que falta.', 'Look at the numbers and tap the missing one.');
  tr('Més o menys', 'Más o menos', 'More or fewer', 'Compta els dibuixos i toca el grup que et demanen: amb més o amb menys.', 'Cuenta los dibujos y toca el grupo que te piden: con más o con menos.', 'Count the pictures and tap the group you are asked for: more or fewer.');
  tr('Escolta i toca', 'Escucha y toca', 'Listen and tap', 'Escolta la paraula i toca el dibuix que li correspon.', 'Escucha la palabra y toca el dibujo que le corresponde.', 'Listen to the word and tap the matching picture.');
  tr('Quin és diferent?', '¿Cuál es diferente?', 'Which one is different?', 'Busca el dibuix que no és igual que els altres i toca’l.', 'Busca el dibujo que no es igual que los demás y tócalo.', 'Find the picture that is not like the others and tap it.');
  tr('Munta el robot', 'Monta el robot', 'Build the robot', 'Arrossega cada peça al seu lloc per muntar el robot.', 'Arrastra cada pieza a su sitio para montar el robot.', 'Drag each piece to its place to build the robot.');
  tr('Cuina la pizza', 'Cocina la pizza', 'Cook the pizza', 'Arrossega els ingredients a la pizza. Posa-n’hi tants com et demanen.', 'Arrastra los ingredientes a la pizza. Pon tantos como te piden.', 'Drag the toppings onto the pizza. Put on as many as you are asked for.');
});
