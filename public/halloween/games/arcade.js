/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · MINIJUEGOS DE ACCIÓN Y MEMORIA
   2. Atrapa los caramelos   3. Memoria monstruosa   10. El laberinto embrujado
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = window.PJHW;
  if (!H || !H.gl) return;
  var gl = H.gl, R = gl.R, S = gl.S, A = H.art, G = H.games, esc = gl.esc;

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ═════════ 2 · Atrapa los caramelos ═════════ */
  var NUMRULES = [
    { id: 'even', t: S('Solo números pares', 'Només nombres parells', 'Even numbers only'), f: function (v) { return v % 2 === 0; } },
    { id: 'odd', t: S('Solo números impares', 'Només nombres imparells', 'Odd numbers only'), f: function (v) { return v % 2 === 1; } },
    { id: 'm3', t: S('Múltiplos de 3', 'Múltiples de 3', 'Multiples of 3'), f: function (v) { return v % 3 === 0; } },
    { id: 'm5', t: S('Múltiplos de 5', 'Múltiples de 5', 'Multiples of 5'), f: function (v) { return v % 5 === 0; } },
    { id: 'gt12', t: S('Mayores que 12', 'Més grans que 12', 'Greater than 12'), f: function (v) { return v > 12; } },
    { id: 'lt8', t: S('Menores que 8', 'Més petits que 8', 'Less than 8'), f: function (v) { return v < 8; } }
  ];

  G.atrapa = {
    start: function (ctx) {
      var L = ctx.level;
      var goal = [6, 8, 8, 10, 10, 12][L - 1], timeMax = [0, 0, 80, 75, 70, 70][L - 1];
      var spawnEvery = [1.3, 1.1, 1.0, 0.85, 0.75, 0.65][L - 1], speedK = [0.30, 0.34, 0.38, 0.44, 0.5, 0.58][L - 1];
      var pBad = [0, 0.25, 0, 0.18, 0.18, 0.22][L - 1];
      var skin = H.store.data().basket;

      ctx.root.innerHTML = '<div class="hwc"><div class="hwc-top"><div class="hw-pbar" aria-hidden="true"><i></i></div>' +
        '<div class="hwc-rule" aria-live="polite"></div><div class="hwc-time"></div></div>' +
        '<div class="hwc-stage" tabindex="0"><div class="hwc-basket">' + A.basket(skin) + '</div></div></div>';
      var stage = ctx.root.querySelector('.hwc-stage'), basket = ctx.root.querySelector('.hwc-basket'),
        bar = ctx.root.querySelector('.hw-pbar i'), ruleEl = ctx.root.querySelector('.hwc-rule'), timeEl = ctx.root.querySelector('.hwc-time');

      var W = 0, Hh = 0, bw = 80, sz = 44, bx = 0, caught = 0, items = [], acc = 0, tLeft = timeMax, keys = { l: 0, r: 0 };
      function measure() {
        W = stage.clientWidth; Hh = stage.clientHeight;
        bw = clamp(W * 0.2, 66, 112); sz = W < 420 ? 40 : 48;
        basket.style.width = bw + 'px'; basket.style.height = bw + 'px';
        bx = clamp(bx || W / 2, bw / 2, W - bw / 2);
      }
      measure();
      ctx.listen(window, 'resize', measure);

      /* Regla activa */
      var rule = { kind: 'any' }, ruleCatches = 0;
      function setRule() {
        if (L <= 2) {
          rule = { kind: 'any' };
          ruleEl.innerHTML = '<span>' + esc(ctx.t(L === 1 ? S('Atrapa los caramelos', 'Atrapa els caramels', 'Catch the candies') : S('Atrapa los caramelos y esquiva las arañas', 'Atrapa els caramels i esquiva les aranyes', 'Catch the candies and dodge the spiders'))) + '</span>' + A.svg('candy', '#ff4d6d', 'hwc-ri') + (L === 2 ? A.svg('spider', '', 'hwc-ri') : '');
        } else if (L <= 4) {
          var prev = rule.color, c; do { c = R.pick(gl.COL); } while (c.c === prev);
          rule = { kind: 'color', color: c.c };
          ruleEl.innerHTML = '<span>' + esc(ctx.t(S('Atrapa solo este color', 'Atrapa només aquest color', 'Catch only this colour'))) + '</span>' + A.svg('candy', c.c, 'hwc-ri');
        } else {
          var cand = L === 5 ? NUMRULES.slice(0, 2) : NUMRULES, r;
          do { r = R.pick(cand); } while (rule.id === r.id && cand.length > 1);
          rule = { kind: 'num', id: r.id, f: r.f };
          ruleEl.innerHTML = '<span>' + esc(ctx.t(r.t)) + '</span>' + A.svg('candy', '#ffc93c', 'hwc-ri');
        }
        ruleCatches = 0;
      }
      setRule();
      sfxLater();
      function sfxLater() { /* hueco para futuros avisos */ }

      function okItem(it) {
        if (it.bad) return false;
        if (rule.kind === 'any') return true;
        if (rule.kind === 'color') return it.color === rule.color;
        return rule.f(it.val);
      }

      function spawn() {
        var el = document.createElement('div'), it = { bad: false, y: -sz, x: R.int(sz / 2, Math.max(sz / 2 + 1, W - sz / 2)), el: el, color: '#ff4d6d', val: 0 };
        el.className = 'hwc-item'; el.style.width = sz + 'px'; el.style.height = sz + 'px';
        if (R.chance(pBad)) { it.bad = true; el.innerHTML = A.svg('spider'); }
        else if (rule.kind === 'num') {
          var want = R.chance(0.5), v, tries = 0;
          do { v = R.int(1, 20); tries++; } while (rule.f(v) !== want && tries < 40);
          it.val = v; it.color = R.pick(gl.COL).c;
          el.innerHTML = A.svg('candy', it.color) + '<b class="hwc-num">' + v + '</b>';
        } else {
          if (rule.kind === 'color') it.color = R.chance(0.5) ? rule.color : R.pick(gl.COL.filter(function (c) { return c.c !== rule.color; })).c;
          else it.color = R.pick(gl.COL).c;
          el.innerHTML = A.svg(R.chance(0.2) ? 'lolli' : 'candy', it.color);
        }
        if (gl.DEBUG && okItem(it)) el.dataset.ok = '1';
        stage.appendChild(el);
        items.push(it);
      }

      function setBar() { bar.style.width = (caught / goal * 100) + '%'; }
      function setTime() { if (timeMax) timeEl.textContent = '⏱ ' + Math.ceil(tLeft) + 's'; }
      setTime(); setBar();

      /* Controles: dedo/ratón y teclado */
      function moveTo(e) { var r = stage.getBoundingClientRect(); bx = clamp(e.clientX - r.left, bw / 2, W - bw / 2); }
      ctx.listen(stage, 'pointermove', moveTo);
      ctx.listen(stage, 'pointerdown', function (e) { moveTo(e); try { stage.setPointerCapture(e.pointerId); } catch (er) { /* ok */ } });
      ctx.listen(document, 'keydown', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') { keys.l = 1; e.preventDefault(); }
        if (e.key === 'ArrowRight' || e.key === 'd') { keys.r = 1; e.preventDefault(); }
      });
      ctx.listen(document, 'keyup', function (e) {
        if (e.key === 'ArrowLeft' || e.key === 'a') keys.l = 0;
        if (e.key === 'ArrowRight' || e.key === 'd') keys.r = 0;
      });

      var lastSecond = -1;
      ctx.raf(function (dt) {
        if (keys.l || keys.r) bx = clamp(bx + (keys.r - keys.l) * W * 0.9 * dt, bw / 2, W - bw / 2);
        basket.style.transform = 'translateX(' + (bx - bw / 2) + 'px)';
        acc += dt;
        if (acc >= spawnEvery) { acc = 0; spawn(); }
        if (timeMax) {
          tLeft -= dt;
          var s = Math.ceil(tLeft);
          if (s !== lastSecond) { lastSecond = s; setTime(); }
          if (tLeft <= 0) { ctx.finish({ win: false }); return; }
        }
        var top = Hh - bw * 0.78, bot = Hh - bw * 0.15;
        for (var i = items.length - 1; i >= 0; i--) {
          var it = items[i];
          it.y += Hh * speedK * dt;
          it.el.style.transform = 'translate(' + (it.x - sz / 2) + 'px,' + it.y + 'px)';
          if (it.y + sz >= top && it.y <= bot && Math.abs(it.x - bx) < bw * 0.46) {
            items.splice(i, 1); it.el.remove();
            if (okItem(it)) {
              caught++; setBar(); ctx.good(1, basket);
              if (rule.kind === 'color' && L === 4 && ++ruleCatches >= 3) setRule();
              if (rule.kind === 'num' && ++ruleCatches >= (L === 5 ? 5 : 4)) setRule();
              if (caught >= goal) { ctx.finish({ win: true }); return; }
            } else {
              basket.classList.remove('hit'); void basket.offsetWidth; basket.classList.add('hit');
              if (ctx.bad() === 0) return;
            }
          } else if (it.y > Hh) { items.splice(i, 1); it.el.remove(); }
        }
      });
    }
  };

  /* ═════════ 3 · Memoria monstruosa ═════════ */
  G.memoria = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, pairs = [2, 3, 4, 6, 8, 10][L - 1], cols = [2, 3, 4, 4, 4, 5][L - 1];
      var delay = [1300, 1200, 1000, 900, 800, 700][L - 1];
      var kinds = R.sample(gl.KINDS, pairs), deck = R.shuffle(kinds.concat(kinds));
      var T_TRY = S('Intentos', 'Intents', 'Tries');
      ctx.root.innerHTML = '<div class="hwm"><div class="hw-pbar" aria-hidden="true"><i></i></div><p class="hwm-try"></p><div class="hwm-grid" style="--cols:' + cols + '">' +
        deck.map(function (k, i) {
          return '<button type="button" class="hwm-card" data-i="' + i + '"' + (gl.DEBUG ? ' data-k="' + k + '"' : '') + ' aria-label="?"><span class="hwm-in"><span class="hwm-f">' + A.svg('web') + A.svg('moon', '', 'hwm-fm') + '</span><span class="hwm-b">' + A.svg(k, k === 'candy' ? '#ff4d6d' : undefined) + '</span></span></button>';
        }).join('') + '</div></div>';
      var grid = ctx.root.querySelector('.hwm-grid'), bar = ctx.root.querySelector('.hw-pbar i'), tryEl = ctx.root.querySelector('.hwm-try');
      var first = null, busy = false, fails = 0, matched = 0, tries = 0;
      function say() { tryEl.textContent = ctx.t(T_TRY) + ': ' + tries; }
      say();
      grid.addEventListener('click', function (e) {
        var c = e.target.closest('.hwm-card');
        if (!c || busy || ctx.over || c.classList.contains('on') || c.classList.contains('done')) return;
        c.classList.add('on'); H.sfx('flip');
        var i = +c.getAttribute('data-i');
        if (!first) { first = { c: c, i: i }; return; }
        var a = first; first = null; tries++; say();
        if (deck[a.i] === deck[i]) {
          a.c.classList.add('done'); c.classList.add('done'); matched++;
          bar.style.width = (matched / pairs * 100) + '%';
          ctx.good(1, c);
          if (matched === pairs) {
            var ratio = fails / pairs;
            ctx.after(function () { ctx.finish({ win: true, stars: ratio <= 0.5 ? 3 : ratio <= 1.2 ? 2 : 1 }); }, 600);
          }
        } else {
          fails++; busy = true; H.sfx('bad');
          ctx.after(function () { a.c.classList.remove('on'); c.classList.remove('on'); busy = false; }, delay);
        }
      });
    }
  };

  /* ═════════ 10 · El laberinto embrujado ═════════ */
  var DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]], OPP = [2, 3, 0, 1];

  function makeMaze(rows, cols, extraOpen) {
    var w = [], seen = [], r, c;
    for (r = 0; r < rows; r++) { w.push([]); seen.push([]); for (c = 0; c < cols; c++) { w[r].push([1, 1, 1, 1]); seen[r].push(0); } }
    var stack = [[0, 0]]; seen[0][0] = 1;
    while (stack.length) {
      var cur = stack[stack.length - 1], nb = [];
      DIRS.forEach(function (d, i) {
        var nr = cur[0] + d[0], nc = cur[1] + d[1];
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !seen[nr][nc]) nb.push([i, nr, nc]);
      });
      if (!nb.length) { stack.pop(); continue; }
      var p = R.pick(nb);
      w[cur[0]][cur[1]][p[0]] = 0; w[p[1]][p[2]][OPP[p[0]]] = 0; seen[p[1]][p[2]] = 1; stack.push([p[1], p[2]]);
    }
    for (var k = 0; k < extraOpen; k++) { // atajos para niveles de Infantil
      r = R.int(0, rows - 1); c = R.int(0, cols - 1);
      var d = R.int(1, 2), nr2 = r + DIRS[d][0], nc2 = c + DIRS[d][1];
      if (nr2 < rows && nc2 < cols) { w[r][c][d] = 0; w[nr2][nc2][OPP[d]] = 0; }
    }
    return w;
  }
  function bfsPath(w, rows, cols, from, to) {
    var prev = {}, q = [from], key = function (p) { return p[0] + ',' + p[1]; };
    prev[key(from)] = null;
    while (q.length) {
      var cur = q.shift();
      if (cur[0] === to[0] && cur[1] === to[1]) break;
      for (var i = 0; i < 4; i++) {
        if (w[cur[0]][cur[1]][i]) continue;
        var n = [cur[0] + DIRS[i][0], cur[1] + DIRS[i][1]];
        if (prev[key(n)] === undefined) { prev[key(n)] = cur; q.push(n); }
      }
    }
    var path = [], at = to;
    while (at) { path.unshift(at); at = prev[key(at)]; }
    return path;
  }

  G.laberinto = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, n = [4, 5, 6, 7, 8, 9][L - 1], rows = n, cols = n;
      var w = makeMaze(rows, cols, [2, 2, 1, 0, 0, 0][L - 1]);
      var exit = [rows - 1, cols - 1], path = bfsPath(w, rows, cols, [0, 0], exit), opt = path.length - 1;
      var nGates = [0, 0, 1, 2, 2, 3][L - 1], needKey = L >= 5, gates = {}, i, pk = {};
      path.forEach(function (p) { pk[p[0] + ',' + p[1]] = 1; });
      for (i = 0; i < nGates; i++) {
        var gi = clamp(Math.round((i + 1) * path.length / (nGates + 1)), 1, path.length - 2), gp = path[gi];
        gates[gp[0] + ',' + gp[1]] = { done: false, cell: gp };
      }
      var keyCell = null;
      if (needKey) {
        var dead = [], offp = [];
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          if (pk[r + ',' + c]) continue;
          offp.push([r, c]);
          if (w[r][c][0] + w[r][c][1] + w[r][c][2] + w[r][c][3] >= 3) dead.push([r, c]);
        }
        keyCell = dead.length ? R.pick(dead) : (offp.length ? R.pick(offp) : path[Math.floor(path.length / 2)]);
      }
      var hasKey = false, pos = [0, 0], moves = 0, busy = false;

      /* Dibujo */
      var U = 40, lines = '', r2, c2;
      for (r2 = 0; r2 < rows; r2++) for (c2 = 0; c2 < cols; c2++) {
        var x = c2 * U, y = r2 * U, cw = w[r2][c2];
        if (cw[0]) lines += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + U) + '" y2="' + y + '"/>';
        if (cw[1]) lines += '<line x1="' + (x + U) + '" y1="' + y + '" x2="' + (x + U) + '" y2="' + (y + U) + '"/>';
        if (r2 === rows - 1 && cw[2]) lines += '<line x1="' + x + '" y1="' + (y + U) + '" x2="' + (x + U) + '" y2="' + (y + U) + '"/>';
        if (c2 === 0 && cw[3]) lines += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + U) + '"/>';
      }
      function ent(cls, cell, svg, id) {
        return '<span class="hwl-ent ' + cls + '"' + (id ? ' id="' + id + '"' : '') + ' style="left:' + (cell[1] / cols * 100) + '%;top:' + (cell[0] / rows * 100) + '%;width:' + (100 / cols) + '%;height:' + (100 / rows) + '%">' + svg + '</span>';
      }
      var ents = ent('hwl-exit', exit, A.svg('door', '#ff8a00'));
      Object.keys(gates).forEach(function (k) { ents += ent('hwl-gate', gates[k].cell, A.svg('lock'), 'g' + k.replace(',', '_')); });
      if (keyCell) ents += ent('hwl-key', keyCell, A.svg('key'), 'hwl-keyent');

      var T_KEY = S('Necesitas la llave', 'Necessites la clau', 'You need the key'), T_GATE = S('¡Un candado! Resuelve el reto', 'Un cadenat! Resol el repte', 'A padlock! Solve the challenge');
      ctx.root.innerHTML = '<div class="hwl"><div class="hwl-hud"><span class="hwl-msg" aria-live="polite"></span>' + (needKey ? '<span class="hwl-keyhud">' + A.svg('key', '#6b5a9a') + '</span>' : '') + '</div>' +
        '<div class="hwl-maze" style="--ar:' + cols + '/' + rows + '"><svg class="hwl-svg" viewBox="-3 -3 ' + (cols * U + 6) + ' ' + (rows * U + 6) + '" preserveAspectRatio="none" aria-hidden="true"><g stroke="#cdbdf5" stroke-width="5" stroke-linecap="round">' + lines + '</g></svg>' + ents +
        ent('hwl-player', pos, A.svg('ghost'), 'hwl-pl') + '<div class="hwl-chal" hidden></div></div>' +
        '<div class="hwl-dpad"><button type="button" data-d="0" aria-label="↑">' + A.svg('arrow') + '</button><button type="button" data-d="3" aria-label="←">' + A.svg('arrow') + '</button><button type="button" data-d="2" aria-label="↓">' + A.svg('arrow') + '</button><button type="button" data-d="1" aria-label="→">' + A.svg('arrow') + '</button></div></div>';
      var maze = ctx.root.querySelector('.hwl-maze'), pl = ctx.root.querySelector('#hwl-pl'), chal = ctx.root.querySelector('.hwl-chal'), msg = ctx.root.querySelector('.hwl-msg'), keyHud = ctx.root.querySelector('.hwl-keyhud');
      function say(t) { msg.textContent = t ? ctx.t(t) : ''; }
      function place() { pl.style.left = (pos[1] / cols * 100) + '%'; pl.style.top = (pos[0] / rows * 100) + '%'; }

      function arrive() {
        var k = pos[0] + ',' + pos[1], g = gates[k];
        if (keyCell && !hasKey && pos[0] === keyCell[0] && pos[1] === keyCell[1]) {
          hasKey = true; ctx.good(2, pl);
          var ke = ctx.root.querySelector('#hwl-keyent'); if (ke) ke.remove();
          if (keyHud) keyHud.innerHTML = A.svg('key', '#ffc93c');
          say(null);
        }
        if (g && !g.done) {
          busy = true; say(T_GATE); H.sfx('boo');
          chal.hidden = false;
          var q = L >= 5 ? gl.anyQ(L - 2) : gl.anyQ(Math.max(1, L - 2));
          gl.askQ(ctx, chal, q, function (ok, b) {
            if (!ok) { ctx.bad(); return; }
            g.done = true; ctx.good(1, b);
            var ge = ctx.root.querySelector('#g' + k.replace(',', '_')); if (ge) ge.remove();
            ctx.after(function () { chal.hidden = true; chal.innerHTML = ''; busy = false; say(null); }, 700);
          });
          return;
        }
        if (pos[0] === exit[0] && pos[1] === exit[1]) {
          if (needKey && !hasKey) { say(T_KEY); H.sfx('bad'); return; }
          busy = true;
          var ratio = moves / Math.max(1, opt), st = ratio <= 1.5 ? 3 : ratio <= 2.4 ? 2 : 1;
          if (ctx.mistakes() >= 3) st = Math.min(st, 2);
          ctx.after(function () { ctx.finish({ win: true, stars: st }); }, 350);
        }
      }
      function go(d) {
        if (busy || ctx.over) return;
        if (w[pos[0]][pos[1]][d]) { H.sfx('flip'); pl.classList.remove('bump'); void pl.offsetWidth; pl.classList.add('bump'); return; }
        pos = [pos[0] + DIRS[d][0], pos[1] + DIRS[d][1]]; moves++;
        place(); H.sfx('tap'); say(null);
        arrive();
      }

      /* Controles: cruceta (con repetición), flechas/WASD y gesto de deslizar */
      var hold = null;
      function stopHold() { if (hold) { clearInterval(hold.i); clearTimeout(hold.t); hold = null; } }
      ctx.root.querySelector('.hwl-dpad').addEventListener('pointerdown', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        e.preventDefault(); stopHold();
        var d = +b.getAttribute('data-d'); go(d);
        hold = { t: setTimeout(function () { hold.i = ctx.every(function () { go(d); }, 140); }, 340) };
      });
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) { ctx.root.querySelector('.hwl-dpad').addEventListener(ev, stopHold); });
      ctx.listen(document, 'pointerup', stopHold);
      ctx.listen(document, 'keydown', function (e) {
        var m = { ArrowUp: 0, ArrowRight: 1, ArrowDown: 2, ArrowLeft: 3, w: 0, d: 1, s: 2, a: 3 }[e.key];
        if (m !== undefined) { e.preventDefault(); go(m); }
      });
      var sx = 0, sy = 0, sd = false;
      ctx.listen(maze, 'pointerdown', function (e) { sx = e.clientX; sy = e.clientY; sd = true; });
      ctx.listen(maze, 'pointerup', function (e) {
        if (!sd) return; sd = false;
        var dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 22) return;
        go(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
      });
      if (gl.DEBUG) window.__hwMaze = { w: w, rows: rows, cols: cols, exit: exit, keyCell: keyCell, gates: gates };
      place();
    }
  };
})();
