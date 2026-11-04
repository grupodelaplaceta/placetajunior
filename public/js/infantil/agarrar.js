/* Placeta Junior · Infantil · AGARRA Y DESLIZA
   Cortar, pescar, barrer, arrastrar, ordenar, unir con líneas y deslizar piezas. */
(window.PJINF = window.PJINF || []).push(function (api) {
  'use strict';
  const { X, PAL, R, I, rnd, D, S, sp, pt, tick, every, to, win, conf, sfx, tone, cv, dg, cen, say, tr, add, SC, SCN, N } = api;
  const CAT = 9;
  const shuf = a => a.slice().sort(() => Math.random() - .5);
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const ANIM = ['cat', 'dog', 'bunny', 'fish', 'butterfly', 'owl', 'mouse', 'duck', 'sheep', 'monster'];
  const FOOD = { cat: 'fish', dog: 'bone', bunny: 'carrot', mouse: 'cheese', monster: 'candy', duck: 'leaf' };
  const FCOL = { fish: '#4cc9f0', bone: '#fff7e0', carrot: '#ff8a00', cheese: '#ffd23f', candy: '#ff4d6d', leaf: '#4cc760' };
  const shake = el => el.animate([{ transform: 'translateX(-9px)' }, { transform: 'translateX(9px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0)' }], { duration: 320 });

  /* ---------- 1 · Corta la fruta ---------- */
  add(CAT, 'Talla la fruita', 'apple', e => {
    const { A, W, H } = e, x = cv(), F = [], KS = [['apple', '#ff4d6d'], ['orange', '#ff9f1c'], ['strawberry', '#ff4d6d'], ['carrot', '#ff8a00'], ['tomato', '#ef476f']];
    const z = Math.min(112, Math.max(72, W / 6.5)), g = H * .00048, trail = []; let last = null, down = 0;
    function spawn() {
      const [k, c] = rnd(KS), v0 = Math.sqrt(2 * g * H * R(.52, .72)), t = 2 * v0 / g, x0 = R(z, W - z), x1 = Math.max(z, Math.min(W - z, x0 + R(-W * .25, W * .25)));
      const el = sp(k, c, z, 0, 0); el.style.willChange = 'transform';
      F.push({ el, k, c, x: x0, y: H + z * .6, vx: (x1 - x0) / t, vy: -v0, r: R(0, 360), s: R(-4, 4), dead: 0 });
    }
    function burst(f) {
      const half = (clip, dir) => { const d = D(`position:absolute;left:${f.x - z / 2}px;top:${f.y - z / 2}px;width:${z}px;height:${z}px;clip-path:inset(${clip});pointer-events:none;z-index:4;transform:rotate(${f.r}deg)`, S(f.k, f.c)); d.animate([{ transform: `translate(0,0) rotate(${f.r}deg)`, opacity: 1 }, { transform: `translate(${dir * z * .9}px,${z * 1.4}px) rotate(${f.r + dir * 70}deg)`, opacity: 0 }], { duration: 750, easing: 'ease-in' }).onfinish = () => d.remove(); };
      half('0 50% 0 0'); half('0 0 0 50%'); half('0 50% 0 0', -1); // dos mitades
      for (let i = 0; i < 9; i++) { const p = D(`position:absolute;left:${f.x}px;top:${f.y}px;width:${R(6, 12)}px;height:${R(6, 12)}px;border-radius:50%;background:${f.c};pointer-events:none;z-index:3`); p.animate([{ transform: 'translate(0,0)', opacity: 1 }, { transform: `translate(${R(-90, 90)}px,${R(-60, 90)}px)`, opacity: 0 }], { duration: 650 }).onfinish = () => p.remove(); }
    }
    function cut(a, b) {
      F.forEach(f => {
        if (f.dead) return; const ax = b[0] - a[0], ay = b[1] - a[1], l2 = ax * ax + ay * ay || 1;
        let t = ((f.x - a[0]) * ax + (f.y - a[1]) * ay) / l2; t = Math.max(0, Math.min(1, t));
        if (Math.hypot(f.x - (a[0] + ax * t), f.y - (a[1] + ay * t)) < z * .5) { f.dead = 1; f.el.remove(); burst(f); sfx('tap', { r: R(1.1, 1.7), v: .6 }); win(f.x, f.y); }
      });
    }
    A.onpointerdown = ev => { down = 1; last = pt(ev); trail.push({ p: last, t: performance.now() }); };
    A.onpointermove = ev => { if (!down) return; const p = pt(ev); if (last) cut(last, p); last = p; trail.push({ p, t: performance.now() }); };
    A.onpointerup = A.onpointerleave = () => { down = 0; last = null; };
    spawn(); spawn(); every(1000, () => { const n = I(3) + 1; for (let i = 0; i < n; i++) to(spawn, i * 220); });
    tick(() => {
      const now = performance.now();
      F.forEach(f => { f.vy += g; f.x += f.vx; f.y += f.vy; f.r += f.s; f.el.style.transform = `translate(${f.x - z / 2}px,${f.y - z / 2}px) rotate(${f.r}deg)`; if (f.y > H + z && f.vy > 0 && !f.dead) { f.dead = 1; f.el.remove(); } });
      for (let i = F.length - 1; i >= 0; i--) if (F[i].dead) F.splice(i, 1);
      while (trail.length && now - trail[0].t > 260) trail.shift();
      x.clearRect(0, 0, W, H); x.lineCap = 'round';
      for (let i = 1; i < trail.length; i++) { const k = 1 - (now - trail[i].t) / 260; x.strokeStyle = `rgba(255,255,255,${k})`; x.lineWidth = 3 + 11 * k; x.beginPath(); x.moveTo(trail[i - 1].p[0], trail[i - 1].p[1]); x.lineTo(trail[i].p[0], trail[i].p[1]); x.stroke(); }
    });
  }, 'linear-gradient(#ffe7bd,#ffb27a)', 'move');

  /* ---------- 2 · Pesca peces ---------- */
  add(CAT, 'Pesca peixos', 'fish', e => {
    const { A, W, H } = e, top = H * .24, z = Math.min(100, Math.max(64, W / 8)), lines = cv();
    D(`position:absolute;left:0;right:0;top:${top}px;bottom:0;background:linear-gradient(#4cc9f0,#1b7fb8);z-index:0`);
    D(`position:absolute;left:0;right:0;top:${top - 6}px;height:12px;background:#ffffff88;border-radius:6px;z-index:1`);
    D(`position:absolute;left:${W / 2 - 70}px;top:${top - 62}px;width:140px;height:66px;z-index:3`, '<svg viewBox="0 0 140 66"><path d="M4 18h132l-18 40a8 8 0 0 1-7 5H29a8 8 0 0 1-7-5z" fill="#e63946"/><path d="M4 18h132l-5 12H9z" fill="#fff6"/><rect x="66" y="0" width="6" height="22" fill="#8b5a2b"/><path d="M72 2l24 8-24 8z" fill="#ffd23f"/></svg>');
    const hook = D(`position:absolute;width:${z * .5}px;height:${z * .5}px;margin:-${z * .25}px 0 0 -${z * .25}px;z-index:7;pointer-events:none`, '<svg viewBox="0 0 40 40"><path d="M20 2v20a8 8 0 1 1-8-8" stroke="#33334d" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="20" cy="4" r="3.5" fill="#ffd23f" stroke="#33334d" stroke-width="2"/></svg>');
    let hx = W / 2, hy = top + 70, down = 0, held = null; const anchor = [W / 2 + 4, top + 4], fish = [];
    function mk() { const y = R(top + z * .8, H - z), d = I(2) ? 1 : -1, f = { el: sp('fish', rnd(PAL), z, 0, 0), x: d > 0 ? -z : W + z, y, v: d * R(.9, 2.2), by: y, ph: R(0, 6.28), hooked: 0 }; f.el.style.zIndex = 4; fish.push(f); return f; }
    for (let i = 0; i < 5; i++) { const f = mk(); f.x = R(z, W - z); }
    const moveHook = ev => { const p = pt(ev); hx = Math.max(z * .3, Math.min(W - z * .3, p[0])); hy = Math.max(top - 8, Math.min(H - z * .3, p[1])); };
    A.onpointerdown = ev => { down = 1; moveHook(ev); }; A.onpointermove = ev => { if (down) moveHook(ev); };
    A.onpointerup = A.onpointerleave = () => { down = 0; if (held) { held.hooked = 0; held = null; } };
    tick(t => {
      hook.style.left = hx + 'px'; hook.style.top = hy + 'px';
      lines.clearRect(0, 0, W, H); lines.strokeStyle = '#fff'; lines.lineWidth = 3; lines.beginPath(); lines.moveTo(anchor[0], anchor[1]); lines.lineTo(hx, hy - z * .22); lines.stroke();
      fish.forEach(f => {
        if (f.hooked) { f.x += (hx - f.x) * .35; f.y += (hy + z * .3 - f.y) * .35; f.el.style.transform = `translate(${f.x - z / 2}px,${f.y - z / 2}px) rotate(-90deg)`; return; }
        f.x += f.v; f.y = f.by + Math.sin(t / 500 + f.ph) * 10; if (f.x < -z * 1.4 || f.x > W + z * 1.4) { f.v *= -1; }
        f.el.style.transform = `translate(${f.x - z / 2}px,${f.y - z / 2}px) scaleX(${f.v > 0 ? -1 : 1})`;
        if (down && !held && Math.hypot(f.x - hx, f.y - hy) < z * .5) { held = f; f.hooked = 1; sfx('tap', { r: 1.4, v: .5 }); }
      });
      if (held && hy < top + 24) { const f = held; held = null; f.hooked = 0; const i = fish.indexOf(f); fish.splice(i, 1); f.el.remove(); win(hx, top); sfx('good', { v: .4 }); mk(); }
    });
    api.hintPath([[W * .3, H * .6], [W * .3, top + 10]]);
  }, '#d9f3ff', 'drag');

  /* ---------- 3 · Barre las hojas ---------- */
  add(CAT, 'Escombra les fulles', 'tree', e => {
    const { A, W, H } = e, z = Math.min(64, Math.max(44, W / 14)), bz = Math.min(190, W * .26);
    sp('tree', '#4cae4a', Math.min(140, W * .18), 6, 4).style.opacity = .9;
    const bx = W - bz - 6, by = H - bz - 6; sp('basket', '#c68642', bz, bx, by).style.zIndex = 3;
    const COLS = ['#e76f51', '#f4a261', '#e9c46a', '#c1121f', '#d98c4a'], L = []; let lvl = 0, down = 0, last = null, mv = [0, 0]; const rad = Math.max(64, z * 1.4);
    const broom = D(`position:absolute;width:${rad}px;height:${rad}px;margin:-${rad / 2}px 0 0 -${rad / 2}px;border-radius:50%;border:4px dashed #ffffffcc;background:#ffffff33;pointer-events:none;z-index:6;display:none`);
    function fill() { const n = Math.min(18, 7 + lvl * 2); for (let i = 0; i < n; i++) { let px, py; do { px = R(10, W - z - 10); py = R(10, H - z - 10); } while (px > bx - z && py > by - z); const el = sp('leaf', rnd(COLS), z, 0, 0); el.style.willChange = 'transform'; L.push({ el, x: px, y: py, vx: 0, vy: 0, r: R(0, 360) }); } }
    fill();
    A.onpointerdown = ev => { down = 1; last = pt(ev); broom.style.display = 'block'; }; A.onpointermove = ev => { const p = pt(ev); if (down && last) { mv = [p[0] - last[0], p[1] - last[1]]; broom.style.left = p[0] + 'px'; broom.style.top = p[1] + 'px'; push(p, mv); } last = p; };
    A.onpointerup = A.onpointerleave = () => { down = 0; broom.style.display = 'none'; mv = [0, 0]; };
    function push(p, v) { L.forEach(f => { const dx = f.x + z / 2 - p[0], dy = f.y + z / 2 - p[1], d = Math.hypot(dx, dy); if (d < rad) { const k = (1 - d / rad); f.vx += (dx / (d + 1)) * 2.2 * k + v[0] * .28 * k; f.vy += (dy / (d + 1)) * 2.2 * k + v[1] * .28 * k; } }); }
    tick(() => {
      for (let i = L.length - 1; i >= 0; i--) {
        const f = L[i]; f.vx *= .93; f.vy *= .93; f.x += f.vx; f.y += f.vy; f.r += f.vx * 2;
        if (f.x < 0) { f.x = 0; f.vx *= -.5; } if (f.y < 0) { f.y = 0; f.vy *= -.5; } if (f.x > W - z) { f.x = W - z; f.vx *= -.5; } if (f.y > H - z) { f.y = H - z; f.vy *= -.5; }
        f.el.style.transform = `translate(${f.x}px,${f.y}px) rotate(${f.r}deg)`;
        if (f.x + z / 2 > bx + bz * .12 && f.y + z / 2 > by + bz * .12) { L.splice(i, 1); f.el.animate([{ transform: `translate(${f.x}px,${f.y}px) scale(1)` }, { transform: `translate(${f.x}px,${f.y}px) scale(0)` }], { duration: 300 }).onfinish = () => f.el.remove(); win(bx + bz / 2, by + bz / 2); }
      }
      if (!L.length && !L.busy) { L.busy = 1; conf(W / 2, H / 2, 60); sfx('win', { v: .4 }); to(() => { lvl++; L.busy = 0; fill(); }, 1000); }
    });
    api.hintPath([[W * .2, H * .6], [W * .5, H * .62], [bx + bz / 2, by + bz / 2]]);
  }, 'linear-gradient(#b9e87a,#7ccf5a)', 'move');

  /* ---------- 4 · Ovejas al corral ---------- */
  add(CAT, 'Ovelles al corral', 'sheep', e => {
    const { A, W, H } = e, z = Math.min(100, Math.max(62, W / 9)), P = H > W * 1.1, pw = P ? W - 20 : W * .42, ph = P ? H * .36 : H * .5, px = P ? 10 : W - pw - 10, py = H - ph - 10, fw = P ? W : W - pw, fh = P ? py - 8 : H; let lvl = 0, inside = 0, S2 = [], total = 0;
    const pen = D(`position:absolute;left:${px}px;top:${py}px;width:${pw}px;height:${ph}px;border:8px solid #8b5a2b;border-radius:18px;background:#d3f0b0;box-sizing:border-box;z-index:1`);
    const cnt = D(`position:absolute;left:${px + pw - 78}px;top:${py - 34}px;min-width:70px;height:56px;border-radius:28px;background:#fff;box-shadow:0 4px 0 #0003;display:grid;place-items:center;font:900 30px system-ui;color:#33334d;z-index:5`, '0');
    function round() {
      S2.forEach(s => s.el.remove()); S2 = []; inside = 0; total = Math.min(9, 3 + lvl); cnt.textContent = '0/' + total;
      for (let i = 0; i < total; i++) {
        const el = sp('sheep', '#ffffff', z, R(8, fw - z - 20), R(8, fh - z - 10)); el.style.zIndex = 2; el.style.transition = 'transform .2s';
        const s = { el, in: 0, vx: R(-.6, .6), vy: R(-.6, .6), drag: 0, x: 0, y: 0 };
        dg(el, (cx, cy) => {
          s.drag = 0; if (cx > px + 14 && cx < px + pw - 14 && cy > py + 14 && cy < py + ph - 14) {
            s.in = 1; inside++; cnt.textContent = inside + '/' + total; el.style.left = Math.max(px + 10, Math.min(px + pw - z - 10, cx - z / 2)) + 'px'; el.style.top = Math.max(py + 10, Math.min(py + ph - z - 10, cy - z / 2)) + 'px';
            win(cx, cy); say(String(inside));
            if (inside >= total) { sfx('win', { v: .5 }); conf(px + pw / 2, py + ph / 2, 70); to(() => { lvl++; round(); }, 1600); }
          }
        });
        const dn = el.onpointerdown; el.onpointerdown = ev => { s.drag = 1; if (s.in) { s.in = 0; inside = Math.max(0, inside - 1); cnt.textContent = inside + '/' + total; } dn(ev); };
        S2.push(s);
      }
      api.hintPath([[W * .2, H * .5], [px + pw / 2, py + ph / 2]]);
    }
    round();
    tick(() => S2.forEach(s => { if (s.in || s.drag) return; let l = s.el.offsetLeft + s.vx, t = s.el.offsetTop + s.vy; if (Math.random() < .02) { s.vx = R(-.7, .7); s.vy = R(-.7, .7); } if (l < 4 || l > fw - z - 14) s.vx *= -1; if (t < 4 || t > fh - z - 6) s.vy *= -1; l = Math.max(4, Math.min(fw - z - 10, l)); t = Math.max(4, Math.min(fh - z - 6, t)); s.el.style.left = l + 'px'; s.el.style.top = t + 'px'; }));
  }, 'linear-gradient(#c9f2a1,#9bdd73)', 'drag');

  /* ---------- 5 · Da de comer ---------- */
  add(CAT, 'Dóna menjar', 'cat', e => {
    const { A, W, H } = e; let last = '', lvl = 0;
    (function round() {
      A.innerHTML = '';
      let an; do { an = rnd(Object.keys(FOOD)); } while (an === last); last = an; const fd = FOOD[an], az = Math.min(H * .46, W * (H > W * 1.1 ? .6 : .34), 260), z = Math.min(100, Math.max(64, W / 8));
      const a = sp(an, undefined, az, W / 2 - az / 2, H * .06); a.style.transformOrigin = '50% 100%'; a.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.04)' }], { duration: 900, iterations: Infinity, direction: 'alternate' });
      const bub = D(`position:absolute;left:${W / 2 + az * .35}px;top:${H * .04}px;width:${z}px;height:${z}px;border-radius:50%;background:#fff;box-shadow:0 4px 0 #0003;display:grid;place-items:center;font:900 ${z * .6}px system-ui;color:#33334d`, '?');
      const opts = shuf([fd, ...shuf(Object.values(FOOD).filter(f => f !== fd)).slice(0, 2)]); let hintT = null;
      const bank = []; opts.forEach((f, i) => {
        const ox = W / 2 + (i - 1) * Math.min(W * .28, 170) - z / 2, oy = H - z - 22, d = sp(f, FCOL[f], z, ox, oy); d.style.zIndex = 5;
        dg(d, (cx, cy) => {
          const c = cen(a), near = Math.hypot(cx - c[0], cy - c[1]) < az * .5;
          if (near && f === fd) { d.remove(); sfx('good', { v: .5 }); a.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.2,.85)' }, { transform: 'scale(1)' }], { duration: 400 }); win(c[0], c[1]); bub.textContent = '♥'; bub.style.color = '#ff4d6d'; clearTimeout(hintT); to(() => { lvl++; round(); }, 1300); }
          else { if (near) { shake(a); sfx('close', { v: .5 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        }); bank.push([f, d]);
      });
      hintT = setTimeout(() => { const b = bank.find(q => q[0] === fd); if (b) b[1].animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }], { duration: 500, iterations: 8, direction: 'alternate' }); }, 9000);
      api.hintPath([[W / 2, H - z], [W / 2, H * .3]]);
    })();
  }, 'linear-gradient(#fff1d6,#ffe0e0)', 'drag');

  /* ---------- 6 · Sombras ---------- */
  add(CAT, 'Ombres', 'owl', e => {
    const { A, W, H } = e; const POOL = ['cat', 'dog', 'bunny', 'fish', 'butterfly', 'owl', 'mouse', 'duck', 'sheep', 'rocket', 'car', 'house', 'star', 'crown']; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const n = Math.min(4, 3 + (lvl > 3 ? 1 : 0)), set = shuf(POOL).slice(0, n), z = Math.min(130, (W - 40) / n - 20, H * .3); let left = n;
      const tg = set.map((k, i) => { const x = (i + .5) * W / n - z / 2, y = H * .08, d = D(`position:absolute;left:${x}px;top:${y}px;width:${z}px;height:${z}px;filter:brightness(0) opacity(.28)`, S(k, '#444')); return { k, x, y, d }; });
      shuf(set).forEach((k, i) => {
        const ox = (i + .5) * W / n - z / 2, oy = H - z - 26, d = sp(k, undefined, z, ox, oy); d.style.zIndex = 5;
        dg(d, (cx, cy) => {
          const t = tg.find(q => q.k === k);
          if (Math.hypot(cx - (t.x + z / 2), cy - (t.y + z / 2)) < z * .6) { d.style.transition = 'left .2s,top .2s'; d.style.left = t.x + 'px'; d.style.top = t.y + 'px'; d.style.zIndex = 2; d.onpointerdown = null; t.d.remove(); win(t.x + z / 2, t.y + z / 2); if (--left === 0) { sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); to(() => { lvl++; round(); }, 1400); } }
          else { if (tg.some(q => Math.hypot(cx - (q.x + z / 2), cy - (q.y + z / 2)) < z * .6)) { shake(d); sfx('close', { v: .4 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        });
      });
      api.hintPath([[W / 2, H - z], [W / 2, H * .15]]);
    })();
  }, 'linear-gradient(#e8e4ff,#fff0f6)', 'drag');

  /* ---------- 7 · Ordena por tamaño ---------- */
  add(CAT, 'Ordena per mida', 'duck', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const n = 3 + (lvl % 3), hid = lvl >= 2, k = rnd(['cat', 'dog', 'bunny', 'duck', 'mouse', 'sheep', 'apple', 'star']), col = rnd(PAL), zmax = Math.min(150, (W - 40) / n - 10, H * .34), zmin = zmax * .42, sz = i => zmin + i * (zmax - zmin) / (n - 1);
      const sl = []; let left = n;
      for (let i = 0; i < n; i++) { const x = (i + .5) * W / n, y = H * .3, z = hid ? zmax : sz(i); const d = D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border:4px dashed #33334d55;border-radius:22px;background:#ffffff77;box-sizing:border-box`); sl.push({ x, y, z, d }); }
      D(`position:absolute;left:${W * .3}px;right:${W * .3}px;top:${H * .3 + zmax / 2 + 18}px;height:10px;border-radius:5px;background:linear-gradient(90deg,#4cc9f0,#9b5de5);opacity:.7`);
      D(`position:absolute;left:${W * .3 - 4}px;top:${H * .3 + zmax / 2 + 12}px;width:22px;height:22px;border-radius:50%;background:#4cc9f0`); D(`position:absolute;right:${W * .3 - 8}px;top:${H * .3 + zmax / 2 + 2}px;width:42px;height:42px;border-radius:50%;background:#9b5de5`);
      shuf([...Array(n).keys()]).forEach((r, i) => {
        const z = sz(r), ox = (i + .5) * W / n - z / 2, oy = H - zmax - 24 + (zmax - z) / 2, d = sp(k, col, z, ox, oy); d.style.zIndex = 5;
        dg(d, (cx, cy) => {
          const s = sl[r];
          if (Math.hypot(cx - s.x, cy - s.y) < Math.max(s.z, zmax * .6) * .55) { d.style.transition = 'left .2s,top .2s'; d.style.left = s.x - z / 2 + 'px'; d.style.top = s.y - z / 2 + 'px'; d.style.zIndex = 2; d.onpointerdown = null; s.d.style.borderColor = '#06d6a0'; win(s.x, s.y); if (--left === 0) { sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); to(() => { lvl++; round(); }, 1400); } }
          else { if (sl.some(q => Math.hypot(cx - q.x, cy - q.y) < zmax * .4)) { shake(d); sfx('close', { v: .4 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        });
      });
      api.hintPath([[W / 2, H - zmax * .5], [sl[0].x, sl[0].y]]);
    })();
  }, 'linear-gradient(#fff6d6,#ffe3f1)', 'drag');

  /* ---------- 8 · Ordena los números ---------- */
  add(CAT, 'Ordena els números', 'balloon', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const n = Math.min(6, 3 + (lvl >> 1)), qty = lvl % 2 === 1, z = Math.min(110, (W - 30) / n - 12, H * .27); let left = n;
      const sl = []; for (let i = 0; i < n; i++) {
        const x = (i + .5) * W / n, y = H * .3; let h = '';
        if (qty) { const c = i + 1, dz = Math.max(10, z * .17); h = `<div style="display:flex;flex-wrap:wrap;gap:${dz * .35}px;justify-content:center;align-content:center;height:100%;padding:${z * .12}px">${[...Array(c)].map(() => `<i style="width:${dz}px;height:${dz}px;border-radius:50%;background:${PAL[i % PAL.length]};display:block"></i>`).join('')}</div>`; }
        const d = D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border:4px dashed #33334d55;border-radius:22px;background:#ffffffaa;box-sizing:border-box`, h); sl.push({ x, y, d });
      }
      shuf([...Array(n).keys()]).forEach((v, i) => {
        const ox = (i + .5) * W / n - z / 2, oy = H - z - 26, d = D(`position:absolute;left:${ox}px;top:${oy}px;width:${z}px;height:${z}px;border-radius:22px;background:${PAL[v % PAL.length]};box-shadow:0 6px 0 #0003;display:grid;place-items:center;font:900 ${z * .6}px system-ui;color:#fff;z-index:5;user-select:none`, String(v + 1));
        dg(d, (cx, cy) => {
          const s = sl[v];
          if (Math.hypot(cx - s.x, cy - s.y) < z * .6) { d.style.transition = 'left .2s,top .2s'; d.style.left = s.x - z / 2 + 'px'; d.style.top = s.y - z / 2 + 'px'; d.style.zIndex = 2; d.onpointerdown = null; s.d.style.borderColor = '#06d6a0'; say(String(v + 1)); win(s.x, s.y); if (--left === 0) { sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); to(() => { lvl++; round(); }, 1400); } }
          else { if (sl.some(q => Math.hypot(cx - q.x, cy - q.y) < z * .6)) { shake(d); sfx('close', { v: .4 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        });
      });
      api.hintPath([[W / 2, H - z * .5], [sl[0].x, sl[0].y]]);
    })();
  }, 'linear-gradient(#e2fbff,#f4eaff)', 'drag');

  /* ---------- 9 · Une con una línea ---------- */
  add(CAT, 'Uneix amb una línia', 'bunny', e => {
    const { A, W, H } = e; let lvl = 0;
    (function round() {
      A.innerHTML = '';
      const n = Math.min(4, 3 + (lvl > 1 ? 1 : 0)), keys = shuf(Object.keys(FOOD)).slice(0, n), z = Math.min(110, (H - 30) / n - 14, W * .2), rows = H / n;
      const lc = cv(), done = [], pairs = [];
      const right = shuf(keys);
      const L = keys.map((k, i) => { const x = W * .16, y = rows * (i + .5), el = D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border-radius:50%;background:#fff;box-shadow:0 5px 0 #0003;padding:${z * .08}px;box-sizing:border-box`, S(k)); return { k, x, y, el }; });
      const Rr = right.map((k, i) => { const x = W * .84, y = rows * (i + .5), f = FOOD[k], el = D(`position:absolute;left:${x - z / 2}px;top:${y - z / 2}px;width:${z}px;height:${z}px;border-radius:50%;background:#fff;box-shadow:0 5px 0 #0003;padding:${z * .1}px;box-sizing:border-box`, S(f, FCOL[f])); return { k, x, y, el }; });
      let cur = null, p = [0, 0], left = n;
      const redraw = () => { lc.clearRect(0, 0, W, H); lc.lineCap = 'round'; lc.lineWidth = 10; done.forEach(([a, b, c]) => { lc.strokeStyle = c; lc.beginPath(); lc.moveTo(a.x, a.y); lc.lineTo(b.x, b.y); lc.stroke(); }); if (cur) { lc.strokeStyle = '#9b5de5'; lc.beginPath(); lc.moveTo(cur.x, cur.y); lc.lineTo(p[0], p[1]); lc.stroke(); } };
      A.onpointerdown = ev => { const q = pt(ev); p = q; cur = L.find(o => !o.done && dist(q, [o.x, o.y]) < z * .65) || null; redraw(); };
      A.onpointermove = ev => { if (!cur) return; p = pt(ev); redraw(); };
      A.onpointerup = A.onpointerleave = () => {
        if (!cur) return; const t = Rr.find(o => !o.done && dist(p, [o.x, o.y]) < z * .7);
        if (t && t.k === cur.k) { cur.done = t.done = 1; done.push([cur, t, PAL[done.length % PAL.length]]); cur.el.style.boxShadow = t.el.style.boxShadow = '0 0 0 5px #06d6a0'; win((cur.x + t.x) / 2, (cur.y + t.y) / 2); if (--left === 0) { sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); to(() => { lvl++; round(); }, 1500); } }
        else if (t) { shake(t.el); sfx('close', { v: .4 }); }
        cur = null; redraw();
      };
      api.hintPath([[L[0].x, L[0].y], [Rr.find(o => o.k === L[0].k).x, Rr.find(o => o.k === L[0].k).y]]);
    })();
  }, 'linear-gradient(#e6fff4,#fff7dc)', 'drag');

  /* ---------- 10 · Puzle deslizante ---------- */
  add(CAT, 'Puzle lliscant', 'house', e => {
    const { A, W, H } = e; const SCENES = [SCN, SC.jardi, SC.mar, SC.espai, SC.granja, SC.festa, SC.amics], CFG = [[2, 2, 3], [3, 2, 6], [3, 3, 8], [3, 3, 14]]; let lvl = 0, si = 0;
    (function round() {
      A.innerHTML = '';
      const [cols, rows, mixN] = CFG[Math.min(lvl, CFG.length - 1)], sc = SCENES[si % SCENES.length], Fh = Math.min((H - 24) * .96, (W - 20) * .75), Fw = Fh * 4 / 3, pw = Fw / cols, ph = Fh / rows, fx = (W - Fw) / 2, fy = (H - Fh) / 2;
      D(`position:absolute;left:${fx - 6}px;top:${fy - 6}px;width:${Fw + 12}px;height:${Fh + 12}px;border-radius:18px;background:#ffffffaa;border:4px dashed #33334d44`);
      const pos = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) pos.push([c, r]);
      const grid = pos.map((_, i) => i); // grid[cell] = pieza (la última es el hueco)
      const empty = cols * rows - 1; let ec = grid.indexOf(empty);
      const adj = c => { const x = c % cols, y = (c / cols) | 0, o = []; if (x > 0) o.push(c - 1); if (x < cols - 1) o.push(c + 1); if (y > 0) o.push(c - cols); if (y < rows - 1) o.push(c + cols); return o; };
      let prev = -1; for (let i = 0; i < mixN; i++) { const o = adj(ec).filter(c => c !== prev); const m = rnd(o); grid[ec] = grid[m]; grid[m] = empty; prev = ec; ec = m; }
      if (grid.every((v, i) => v === i)) { const m = adj(ec)[0]; grid[ec] = grid[m]; grid[m] = empty; ec = m; }
      const els = [];
      for (let p = 0; p < cols * rows - 1; p++) {
        const [pc, pr] = pos[p], d = D(`position:absolute;width:${pw}px;height:${ph}px;border:3px solid #fff;border-radius:12px;overflow:hidden;box-sizing:border-box;box-shadow:0 4px 0 #0003;transition:left .18s,top .18s;touch-action:none;cursor:pointer;z-index:2`, `<svg viewBox="${pc * 400 / cols} ${pr * 300 / rows} ${400 / cols} ${300 / rows}" preserveAspectRatio="none" style="width:100%;height:100%;display:block;pointer-events:none">${sc}</svg>`);
        els[p] = d;
      }
      const put = () => { grid.forEach((p, c) => { if (p === empty) return; const d = els[p]; d.style.left = fx + (c % cols) * pw + 'px'; d.style.top = fy + ((c / cols) | 0) * ph + 'px'; }); };
      put(); let solved = 0;
      const tryMove = p => {
        if (solved) return; const c = grid.indexOf(p); if (!adj(c).includes(ec)) { shake(els[p]); return; }
        grid[ec] = p; grid[c] = empty; ec = c; put(); sfx('tap', { r: 1 + (p % 5) * .08, v: .45 });
        if (grid.every((v, i) => v === i)) { solved = 1; setTimeout(() => { const [pc, pr] = pos[empty]; const d = D(`position:absolute;left:${fx + pc * pw}px;top:${fy + pr * ph}px;width:${pw}px;height:${ph}px;overflow:hidden;z-index:3;border:3px solid #fff;border-radius:12px;box-sizing:border-box`, `<svg viewBox="${pc * 400 / cols} ${pr * 300 / rows} ${400 / cols} ${300 / rows}" preserveAspectRatio="none" style="width:100%;height:100%">${sc}</svg>`); d.animate([{ transform: 'scale(.2)', opacity: 0 }, { transform: 'scale(1)', opacity: 1 }], { duration: 400 }); els.forEach(q => q.style.borderColor = 'transparent'); sfx('win', { v: .5 }); conf(W / 2, H / 2, 70); win(W / 2, H / 2); to(() => { lvl++; si++; round(); }, 2200); }, 220); }
      };
      els.forEach((d, p) => { let sx = 0, sy = 0; d.onpointerdown = ev => { sx = ev.clientX; sy = ev.clientY; d.setPointerCapture(ev.pointerId); }; d.onpointerup = ev => { tryMove(p); }; });
      const cell = grid.findIndex((v, c) => v !== empty && adj(c).includes(ec)); api.hintPath([[fx + (cell % cols + .5) * pw, fy + (((cell / cols) | 0) + .5) * ph], [fx + (ec % cols + .5) * pw, fy + (((ec / cols) | 0) + .5) * ph]]);
    })();
  }, 'linear-gradient(#ffeef6,#e7f6ff)', 'tap');

  /* ---------- 11 · Completa el tren ---------- */
  add(CAT, 'Completa el tren', 'car', e => {
    const { A, W, H } = e; const PATS = [[0, 1, 0, 1, 0, 1], [0, 0, 1, 0, 0, 1], [0, 1, 2, 0, 1, 2], [0, 1, 1, 0, 1, 1], [0, 0, 1, 1, 0, 0, 1, 1], [0, 1, 2, 2, 0, 1, 2, 2]], COL = ['#ff4d6d', '#4cc9f0', '#ffd23f', '#06d6a0', '#9b5de5']; let lvl = 0;
    const wag = (c, z) => `<svg viewBox="0 0 100 80" style="width:100%;height:100%;pointer-events:none"><rect x="6" y="14" width="88" height="46" rx="10" fill="${c}"/><rect x="6" y="14" width="88" height="14" rx="7" fill="#fff4"/><rect x="6" y="48" width="88" height="12" rx="6" fill="#0002"/><circle cx="50" cy="38" r="9" fill="#fff9"/><circle cx="28" cy="66" r="11" fill="#33334d"/><circle cx="72" cy="66" r="11" fill="#33334d"/><circle cx="28" cy="66" r="4" fill="#ddd"/><circle cx="72" cy="66" r="4" fill="#ddd"/></svg>`;
    (function round() {
      A.innerHTML = '';
      const pat = PATS[lvl % PATS.length], n = pat.length, miss = lvl < 3 ? 1 : 2, cs = shuf(COL).slice(0, 3), rows = (W < 560 && n > 4) ? 2 : 1, per = Math.ceil(n / rows);
      const z = Math.min(110, (W - 20) / (per + 1.4) - 4), step = (W - z * 1.3 - 12) / per, w = step - 4, rowH = w * .8 + 40, y0 = H * (rows > 1 ? .12 : .3), yy = r => y0 + r * rowH;
      for (let r = 0; r < rows; r++) D(`position:absolute;left:0;right:0;top:${yy(r) + w * .62}px;height:8px;background:#33334d55;border-radius:4px`);
      D(`position:absolute;left:4px;top:${yy(0) - z * .1}px;width:${z * 1.1}px;height:${z * .95}px`, `<svg viewBox="0 0 110 90" style="width:100%;height:100%"><rect x="4" y="26" width="64" height="44" rx="8" fill="#e63946"/><rect x="60" y="6" width="44" height="64" rx="8" fill="#c1121f"/><rect x="68" y="14" width="26" height="22" rx="4" fill="#bde9ff"/><rect x="14" y="8" width="16" height="22" rx="3" fill="#33334d"/><circle cx="28" cy="74" r="12" fill="#33334d"/><circle cx="84" cy="74" r="12" fill="#33334d"/></svg>`);
      const missing = pat.map((_, i) => i).slice(n - miss), slots = []; let left = miss;
      pat.forEach((p, i) => { const r = (i / per) | 0, x = z * 1.2 + 8 + (i % per) * step, y = yy(r);
        if (missing.includes(i)) { const d = D(`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .8}px;border:4px dashed #33334d66;border-radius:14px;box-sizing:border-box`); slots.push({ i, x, y, w, d, p }); }
        else D(`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${w * .8}px`, wag(cs[p])); });
      const tray = shuf(cs.map((c, k) => k)), bz = Math.min(120, W / 5);
      tray.forEach((k, j) => {
        const ox = W / 2 + (j - 1) * (bz * 1.4) - bz / 2, oy = H - bz * .8 - 26, d = D(`position:absolute;left:${ox}px;top:${oy}px;width:${bz}px;height:${bz * .8}px;z-index:5`, wag(cs[k]));
        dg(d, (cx, cy) => {
          const s = slots.find(q => !q.done && Math.hypot(cx - (q.x + q.w / 2), cy - (q.y + q.w * .4)) < q.w * .7);
          if (s && s.p === k) { s.done = 1; d.style.left = s.x + 'px'; d.style.top = s.y + 'px'; d.style.width = s.w + 'px'; d.style.height = s.w * .8 + 'px'; d.onpointerdown = null; s.d.remove(); win(s.x + s.w / 2, s.y); if (--left === 0) { sfx('win', { v: .5 }); conf(W / 2, H / 2, 60); to(() => { lvl++; round(); }, 1500); } else { const c = D(`position:absolute;left:${ox}px;top:${oy}px;width:${bz}px;height:${bz * .8}px;z-index:5`, wag(cs[k])); } }
          else { if (s) { shake(d); sfx('close', { v: .4 }); } d.style.transition = 'left .3s,top .3s'; d.style.left = ox + 'px'; d.style.top = oy + 'px'; }
        });
      });
      api.hintPath([[W / 2, H - bz * .6], [slots[0].x + slots[0].w / 2, slots[0].y + slots[0].w * .4]]);
    })();
  }, 'linear-gradient(#d9f2ff,#fff3cf)', 'drag');

  /* ---------- nombres y textos ---------- */
  tr('Talla la fruita', 'Corta la fruta', 'Slice the fruit', 'Passa el dit ràpid per sobre la fruita perquè es talli.', 'Pasa el dedo rápido sobre la fruta para cortarla.', 'Swipe your finger quickly across the fruit to slice it.');
  tr('Pesca peixos', 'Pesca peces', 'Catch fish', 'Arrossega l’ham fins a un peix i puja’l fins a la barca.', 'Arrastra el anzuelo hasta un pez y súbelo hasta la barca.', 'Drag the hook to a fish and lift it up to the boat.');
  tr('Escombra les fulles', 'Barre las hojas', 'Sweep the leaves', 'Passa el dit per empènyer les fulles fins a la cistella.', 'Pasa el dedo para empujar las hojas hasta la cesta.', 'Swipe your finger to push the leaves into the basket.');
  tr('Ovelles al corral', 'Ovejas al corral', 'Sheep in the pen', 'Arrossega cada ovella fins al corral i compta-les.', 'Arrastra cada oveja hasta el corral y cuéntalas.', 'Drag each sheep into the pen and count them.');
  tr('Dóna menjar', 'Da de comer', 'Feed the animal', 'Arrossega el menjar que li agrada a l’animal fins a la seva boca.', 'Arrastra la comida que le gusta al animal hasta su boca.', 'Drag the food the animal likes to its mouth.');
  tr('Ombres', 'Sombras', 'Shadows', 'Arrossega cada dibuix fins a la seva ombra.', 'Arrastra cada dibujo hasta su sombra.', 'Drag each picture to its shadow.');
  tr('Ordena per mida', 'Ordena por tamaño', 'Sort by size', 'Ordena del més petit al més gran.', 'Ordena del más pequeño al más grande.', 'Put them in order from the smallest to the biggest.');
  tr('Ordena els números', 'Ordena los números', 'Order the numbers', 'Arrossega cada número al seu lloc.', 'Arrastra cada número a su sitio.', 'Drag each number to its place.');
  tr('Uneix amb una línia', 'Une con una línea', 'Join with a line', 'Dibuixa una línia des de cada animal fins al seu menjar.', 'Dibuja una línea desde cada animal hasta su comida.', 'Draw a line from each animal to its food.');
  tr('Puzle lliscant', 'Puzle deslizante', 'Sliding puzzle', 'Toca les peces per lliscar-les al forat i recompon el dibuix.', 'Toca las piezas para deslizarlas al hueco y recompón el dibujo.', 'Tap the pieces to slide them into the gap and rebuild the picture.');
  tr('Completa el tren', 'Completa el tren', 'Complete the train', 'Mira els colors dels vagons i arrossega els que falten.', 'Mira los colores de los vagones y arrastra los que faltan.', 'Look at the colours of the wagons and drag the missing ones.');
});
