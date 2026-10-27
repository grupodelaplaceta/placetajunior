/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · MINIJUEGOS DE PUZLES
   4. La fábrica de caramelos   5. El fantasma escondido
   6. Parejas encantadas        9. El laboratorio de pociones
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = window.PJHW;
  if (!H || !H.gl) return;
  var gl = H.gl, R = gl.R, S = gl.S, A = H.art, G = H.games, esc = gl.esc, sp = gl.sp;

  function bar(root) { return root.querySelector('.hw-pbar i'); }
  function btnHtml(label, cls) { return '<button type="button" class="hw-btn ' + (cls || 'hw-primary') + '">' + esc(label) + '</button>'; }

  /* ═════════ 4 · La fábrica de caramelos ═════════ */
  var CC = gl.COL;
  function candyHtml(it, cls) { return sp(it.k, it.c, cls); }

  G.fabrica = {
    start: function (ctx) {
      var L = ctx.level;
      var nItems = [4, 5, 6, 7, 8, 8][L - 1], nPat = [1, 2, 2, 2, 3, 3][L - 1], nOrd = [1, 1, 2, 2, 2, 3][L - 1];
      var T_SORT = S('Clasifica cada caramelo', 'Classifica cada caramel', 'Sort each candy'),
        T_PAT = S('¿Qué caramelo falta?', 'Quin caramel falta?', 'Which candy is missing?'),
        T_ORD = S('Prepara el pedido', 'Prepara la comanda', 'Prepare the order'),
        T_SEND = S('Enviar', 'Enviar', 'Send');
      var tasks = ['sort'], i;
      for (i = 0; i < nPat; i++) tasks.push('pat');
      for (i = 0; i < nOrd; i++) tasks.push('ord');
      ctx.root.innerHTML = '<div class="hwy"><div class="hw-pbar" aria-hidden="true"><i></i></div><h3 class="hwq-title"></h3><div class="hwy-host"></div></div>';
      var host = ctx.root.querySelector('.hwy-host'), title = ctx.root.querySelector('.hwq-title'), pb = bar(ctx.root), step = 0;

      function nextTask() {
        pb.style.width = (step / tasks.length * 100) + '%';
        if (step >= tasks.length) { ctx.finish({ win: true }); return; }
        var t = tasks[step++];
        if (t === 'sort') sortTask(); else if (t === 'pat') patTask(); else ordTask();
      }

      function sortTask() {
        title.textContent = ctx.t(T_SORT);
        var cols = R.sample(CC, L <= 2 ? 2 : L <= 4 ? 3 : 2), bins = [], items = [];
        if (L <= 4) cols.forEach(function (c) { bins.push({ k: 'candy', c: c.c, test: function (it) { return it.c === c.c; } }); });
        else if (L === 5) ['candy', 'lolli'].forEach(function (k) { bins.push({ k: k, c: '#b9a6ee', test: function (it) { return it.k === k; } }); });
        else cols.forEach(function (c) { ['candy', 'lolli'].forEach(function (k) { bins.push({ k: k, c: c.c, test: function (it) { return it.k === k && it.c === c.c; } }); }); });
        for (var n = 0; n < nItems; n++) {
          var b = R.pick(bins);
          items.push({ k: b.k, c: L === 5 ? R.pick(CC).c : b.c });
        }
        var idx = 0;
        host.innerHTML = '<div class="hwy-belt"><span class="hwy-cur"></span></div><div class="hwy-bins">' + bins.map(function (b, j) { return '<button type="button" class="hwy-bin" data-j="' + j + '" aria-label="' + (j + 1) + '">' + sp(b.k, b.c) + '</button>'; }).join('') + '</div>';
        var cur = host.querySelector('.hwy-cur');
        function show() {
          cur.innerHTML = candyHtml(items[idx]); cur.classList.remove('in'); void cur.offsetWidth; cur.classList.add('in');
          if (gl.DEBUG) host.querySelectorAll('.hwy-bin').forEach(function (b, j) { if (bins[j].test(items[idx])) b.dataset.ok = '1'; else delete b.dataset.ok; });
        }
        show();
        host.querySelector('.hwy-bins').addEventListener('click', function (e) {
          var bt = e.target.closest('.hwy-bin'); if (!bt || ctx.over || idx >= items.length) return;
          var j = +bt.getAttribute('data-j');
          if (bins[j].test(items[idx])) {
            ctx.good(1, bt); bt.classList.add('ok'); ctx.after(function () { bt.classList.remove('ok'); }, 300);
            idx++;
            if (idx >= items.length) ctx.after(nextTask, 500); else show();
          } else { bt.classList.add('bad'); ctx.after(function () { bt.classList.remove('bad'); }, 400); ctx.bad(); }
        });
      }

      function patTask() {
        title.textContent = ctx.t(T_PAT);
        var unit = [[0, 1], [0, 0, 1], [0, 1, 2], [0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2, 1]][L - 1];
        var cols = R.sample(CC, 3), kinds = L >= 5 ? R.shuffle(['candy', 'lolli', 'candy']) : ['candy', 'candy', 'candy'];
        var len = unit.length * 2 + (L >= 3 ? R.int(0, 1) : 0), seq = [], k;
        for (k = 0; k < len; k++) seq.push(unit[k % unit.length]);
        var ans = unit[len % unit.length];
        var design = function (x) { return { k: kinds[x], c: cols[x].c }; };
        var opts = R.shuffle([0, 1, 2]);
        host.innerHTML = '<div class="hwy-pat">' + seq.map(function (x) { return candyHtml(design(x), 'hwq-dot'); }).join('') + '<span class="hwq-qm">?</span></div><div class="hwq-opts hwy-opts">' +
          opts.map(function (x) { return '<button type="button" class="hwo hwo-c" data-x="' + x + '"' + (gl.DEBUG && x === ans ? ' data-ok="1"' : '') + '>' + candyHtml(design(x), 'hwo-sp') + '</button>'; }).join('') + '</div>';
        var locked = false;
        host.querySelector('.hwy-opts').addEventListener('click', function (e) {
          var bt = e.target.closest('.hwo'); if (!bt || locked || bt.disabled || ctx.over) return;
          if (+bt.getAttribute('data-x') === ans) { locked = true; bt.classList.add('ok'); ctx.good(1, bt); ctx.after(nextTask, 800); }
          else { bt.disabled = true; bt.classList.add('bad'); ctx.bad(); }
        });
      }

      function ordTask() {
        title.textContent = ctx.t(T_ORD);
        var nt = [1, 2, 2, 2, 3, 3][L - 1], mx = [3, 3, 4, 5, 6, 8][L - 1];
        var cols = R.sample(CC, nt), need = {}, items = [];
        var kd = {};
        cols.forEach(function (c) { kd[c.id] = R.chance(.3) && L >= 4 ? 'lolli' : 'candy'; need[c.id] = R.int(1, mx); items.push({ id: c.id, html: sp(kd[c.id], c.c, 'hwk-sp') }); });
        host.innerHTML = '<div class="hwy-ticket"><b>' + esc(ctx.t(T_ORD)) + '</b>' + cols.map(function (c) { return '<span class="hwy-tk">' + sp(kd[c.id], c.c, 'hwq-dot') + '<b>× ' + need[c.id] + '</b></span>'; }).join('') + '</div>' +
          '<div class="hwy-cnt"></div><div class="hwy-send">' + btnHtml(ctx.t(T_SEND)) + '</div>';
        var cn = gl.counters(host.querySelector('.hwy-cnt'), items, { max: mx + 3 });
        if (gl.DEBUG) host.querySelector('.hwy-cnt').dataset.need = JSON.stringify(need);
        var locked = false;
        host.querySelector('.hwy-send button').addEventListener('click', function () {
          if (locked || ctx.over) return;
          var v = cn.get(), ok = cols.every(function (c) { return v[c.id] === need[c.id]; });
          if (ok) { locked = true; ctx.good(1, host.querySelector('.hwy-send button')); ctx.after(nextTask, 700); }
          else {
            ctx.bad();
            cols.forEach(function (c) { var r = cn.row(c.id); r.classList.toggle('wrong', v[c.id] !== need[c.id]); });
            ctx.after(function () { cols.forEach(function (c) { cn.row(c.id).classList.remove('wrong'); }); }, 900);
          }
        });
      }
      nextTask();
    }
  };

  /* ═════════ 5 · El fantasma escondido ═════════ */
  var SPOT = {
    tomb: { col: 'gray', n: S('la tumba', 'la tomba', 'the tomb'), at: S('en la tumba', 'a la tomba', 'behind the tomb'), de: S('de la tumba', 'de la tomba', 'the tomb') },
    tree: { col: 'green', n: S('el árbol', "l'arbre", 'the tree'), at: S('en el árbol', "a l'arbre", 'behind the tree'), de: S('del árbol', "de l'arbre", 'the tree') },
    pumpkin: { col: 'orange', n: S('la calabaza', 'la carabassa', 'the pumpkin'), at: S('en la calabaza', 'a la carabassa', 'behind the pumpkin'), de: S('de la calabaza', 'de la carabassa', 'the pumpkin') },
    house: { col: 'purple', n: S('la casa', 'la casa', 'the house'), at: S('en la casa', 'a la casa', 'behind the house'), de: S('de la casa', 'de la casa', 'the house') },
    cauldron: { col: 'black', n: S('el caldero', 'el calderó', 'the cauldron'), at: S('en el caldero', 'al calderó', 'behind the cauldron'), de: S('del caldero', 'del calderó', 'the cauldron') },
    chest: { col: 'brown', n: S('el cofre', 'el cofre', 'the chest'), at: S('en el cofre', 'al cofre', 'behind the chest'), de: S('del cofre', 'del cofre', 'the chest') },
    bush: { col: 'green', n: S('el arbusto', "l'arbust", 'the bush'), at: S('en el arbusto', "a l'arbust", 'behind the bush'), de: S('del arbusto', "de l'arbust", 'the bush') }
  };
  var SCOL = { gray: S('gris', 'gris', 'grey'), green: S('verde', 'verd', 'green'), orange: S('naranja', 'taronja', 'orange'), purple: S('morado', 'lila', 'purple'), black: S('negro', 'negre', 'black'), brown: S('marrón', 'marró', 'brown') };
  var SCOLHEX = { gray: '#9aa0b8', green: '#3f8a4f', orange: '#ff8a00', purple: '#7b4bd6', black: '#33284f', brown: '#a8672b' };

  function clueText(c, lang, types) {
    var X = c.x && SPOT[c.x], Y = c.y && SPOT[c.y];
    switch (c.k) {
      case 'is': return ['Se esconde ' + X.at[0] + '.', "S'amaga " + X.at[1] + '.', "It's hiding " + X.at[2] + '.'][lang];
      case 'not': return ['No está ' + X.at[0] + '.', 'No és ' + X.at[1] + '.', "It's not " + X.at[2] + '.'][lang];
      case 'color': return ['Se esconde en algo de color ' + SCOL[c.col][0] + '.', "S'amaga en alguna cosa de color " + SCOL[c.col][1] + '.', 'It hides in something ' + SCOL[c.col][2] + '.'][lang];
      case 'left': return ['Está justo a la izquierda ' + X.de[0] + '.', "Està just a l'esquerra " + X.de[1] + '.', "It's just to the left of " + X.de[2] + '.'][lang];
      case 'right': return ['Está justo a la derecha ' + X.de[0] + '.', 'Està just a la dreta ' + X.de[1] + '.', "It's just to the right of " + X.de[2] + '.'][lang];
      case 'between': return ['Está entre ' + X.n[0] + ' y ' + Y.n[0] + '.', 'Està entre ' + X.n[1] + ' i ' + Y.n[1] + '.', "It's between " + X.n[2] + ' and ' + Y.n[2] + '.'][lang];
      default: return ['Está en el sitio número ' + c.pos + '.', 'Està al lloc número ' + c.pos + '.', "It's in spot number " + c.pos + '.'][lang];
    }
  }
  function clueIcon(c) {
    var ghost = sp('ghost', '', 'hwf-cg');
    switch (c.k) {
      case 'is': return ghost + '<span class="hwf-sym">→</span>' + sp(c.x, '', 'hwf-ci');
      case 'not': return ghost + '<span class="hwf-sym no">✕</span>' + sp(c.x, '', 'hwf-ci');
      case 'color': return ghost + '<span class="hwf-sym">→</span><span class="hwf-sw" style="background:' + SCOLHEX[c.col] + '"></span>';
      case 'left': return ghost + '<span class="hwf-sym">←</span>' + sp(c.x, '', 'hwf-ci');
      case 'right': return ghost + '<span class="hwf-sym">→</span>' + sp(c.x, '', 'hwf-ci');
      case 'between': return sp(c.x, '', 'hwf-ci') + ghost + sp(c.y, '', 'hwf-ci');
      default: return ghost + '<span class="hwf-sym">→</span><b class="hwf-pos">' + c.pos + '</b>';
    }
  }

  function makePuzzle(L, n) {
    var types = R.sample(Object.keys(SPOT), n), target = R.int(0, n - 1), cands = [], i;
    for (i = 0; i < n; i++) cands.push(i);
    var kinds = L === 1 ? ['is'] : L === 2 ? ['is', 'not'] : L === 3 ? ['not', 'color', 'not'] : L === 4 ? ['not', 'color', 'left', 'right'] : L === 5 ? ['not', 'color', 'left', 'right', 'between'] : ['not', 'color', 'left', 'right', 'between', 'pos'];
    var clues = [], tries = 0, maxClues = [1, 2, 2, 3, 3, 4][L - 1];
    function make(k) {
      var tt = types[target], o;
      if (k === 'is') return { k: k, x: tt, test: function (j) { return types[j] === tt; } };
      if (k === 'not') { var o2 = R.pick(types.filter(function (x) { return x !== tt; })); if (!o2) return null; return { k: k, x: o2, test: function (j) { return types[j] !== o2; } }; }
      if (k === 'color') { var col = SPOT[tt].col; return { k: k, col: col, test: function (j) { return SPOT[types[j]].col === col; } }; }
      if (k === 'left') { if (target >= n - 1) return null; o = types[target + 1]; return { k: k, x: o, test: function (j) { return j < n - 1 && types[j + 1] === o; } }; }
      if (k === 'right') { if (target <= 0) return null; o = types[target - 1]; return { k: k, x: o, test: function (j) { return j > 0 && types[j - 1] === o; } }; }
      if (k === 'between') { if (target <= 0 || target >= n - 1) return null; var x = types[target - 1], y = types[target + 1]; return { k: k, x: x, y: y, test: function (j) { return j > 0 && j < n - 1 && types[j - 1] === x && types[j + 1] === y; } }; }
      return { k: 'pos', pos: target + 1, test: function (j) { return j === target; } };
    }
    while (cands.length > 1 && tries++ < 80 && clues.length < maxClues + 1) {
      var c = make(R.pick(kinds));
      if (!c) continue;
      var nc = cands.filter(c.test);
      if (nc.length < cands.length) { clues.push(c); cands = nc; }
    }
    if (cands.length > 1) { var f = make('is'); clues.push(f); cands = cands.filter(f.test); }
    return { types: types, target: target, clues: clues };
  }

  G.fantasma = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, rounds = [3, 4, 4, 5, 5, 6][L - 1], n = [3, 4, 5, 6, 7, 7][L - 1], r = 0;
      ctx.root.innerHTML = '<div class="hwf"><div class="hw-pbar" aria-hidden="true"><i></i></div><div class="hwf-clues"></div><div class="hwf-scene"></div></div>';
      var pb = bar(ctx.root), clues = ctx.root.querySelector('.hwf-clues'), scene = ctx.root.querySelector('.hwf-scene');
      function next() {
        pb.style.width = (r / rounds * 100) + '%';
        if (r >= rounds) { ctx.finish({ win: true }); return; }
        r++;
        var p = makePuzzle(L, n), locked = false;
        clues.innerHTML = p.clues.map(function (c) { return '<div class="hwf-clue"><span class="hwf-ic">' + clueIcon(c) + '</span><span class="hwf-tx">' + esc(clueText(c, ctx.lang)) + '</span></div>'; }).join('');
        scene.innerHTML = p.types.map(function (k, j) { return '<button type="button" class="hwf-spot" data-j="' + j + '"' + (gl.DEBUG && j === p.target ? ' data-ok="1"' : '') + ' aria-label="' + (j + 1) + '"><span class="hwf-gh"></span>' + sp(k) + '</button>'; }).join('');
        scene.onclick = function (e) {
          var b = e.target.closest('.hwf-spot'); if (!b || locked || b.disabled || ctx.over) return;
          if (+b.getAttribute('data-j') === p.target) {
            locked = true; b.classList.add('found'); b.querySelector('.hwf-gh').innerHTML = sp('ghost'); H.sfx('boo');
            ctx.good(1, b); ctx.after(next, 1300);
          } else { b.disabled = true; b.classList.add('no'); ctx.bad(); }
        };
      }
      next();
    }
  };

  /* ═════════ 6 · Parejas encantadas ═════════ */
  function uniqPairs(k, gen) {
    var out = [], seen = {}, tries = 0;
    while (out.length < k && tries++ < 200) { var p = gen(); if (!seen[p.id]) { seen[p.id] = 1; out.push(p); } }
    return out;
  }
  function pairsOf(type, k, lang) {
    var n, a, b, kind;
    if (type === 'sil') return R.sample(gl.KINDS, k).map(function (x) { return { id: x, l: sp(x, x === 'candy' ? '#ff4d6d' : undefined), r: '<span class="hwj-sil">' + sp(x, x === 'candy' ? '#ff4d6d' : undefined) + '</span>' }; });
    if (type === 'qty5' || type === 'qty10') {
      var mx = type === 'qty5' ? 5 : 10; kind = R.pick(['pumpkin', 'candy', 'ghost', 'bat']);
      return R.sample(Array.apply(null, Array(mx)).map(function (_, i) { return i + 1; }), k).map(function (v) { return { id: v, l: gl.group(kind, v, kind === 'candy' ? '#ff8a00' : undefined), r: gl.numSpan(v) }; });
    }
    if (type === 'word10' || type === 'word20') {
      var mw = type === 'word10' ? 10 : 20;
      return R.sample(Array.apply(null, Array(mw)).map(function (_, i) { return i + 1; }), k).map(function (v) { return { id: v, l: gl.numSpan(v), r: '<span class="hwj-w">' + esc(gl.numWord(v, lang)) + '</span>' }; });
    }
    if (type === 'op10') return uniqPairs(k, function () { a = R.int(1, 8); b = R.int(1, 10 - a); return { id: a + b, l: '<span class="hwj-op">' + a + ' + ' + b + '</span>', r: gl.numSpan(a + b) }; });
    if (type === 'op30') return uniqPairs(k, function () {
      if (R.chance(.5)) { a = R.int(5, 20); b = R.int(3, 30 - a); return { id: a + b, l: '<span class="hwj-op">' + a + ' + ' + b + '</span>', r: gl.numSpan(a + b) }; }
      a = R.int(10, 30); b = R.int(2, a - 1); return { id: a - b, l: '<span class="hwj-op">' + a + ' − ' + b + '</span>', r: gl.numSpan(a - b) };
    });
    if (type === 'mul') return uniqPairs(k, function () { a = R.int(2, 9); b = R.int(2, 10); return { id: a * b, l: '<span class="hwj-op">' + a + ' × ' + b + '</span>', r: gl.numSpan(a * b) }; });
    return uniqPairs(k, function () { // equiv: a×b ↔ c+d
      a = R.int(2, 8); b = R.int(2, 8); var v = a * b, c = R.int(Math.max(1, v - 40), v - 1); c = Math.max(1, c);
      return { id: v, l: '<span class="hwj-op">' + a + ' × ' + b + '</span>', r: '<span class="hwj-op">' + c + ' + ' + (v - c) + '</span>' };
    });
  }

  G.parejas = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, kinds = { 1: ['sil', 'sil'], 2: ['qty5', 'qty5'], 3: ['qty10', 'word10'], 4: ['op10', 'word20'], 5: ['op30', 'mul'], 6: ['mul', 'equiv'] }[L];
      var k = [3, 4, 4, 5, 5, 6][L - 1], round = 0;
      ctx.root.innerHTML = '<div class="hwj"><div class="hw-pbar" aria-hidden="true"><i></i></div><div class="hwj-cols"><div class="hwj-col" data-s="l"></div><div class="hwj-col" data-s="r"></div></div></div>';
      var pb = bar(ctx.root), colL = ctx.root.querySelector('[data-s=l]'), colR = ctx.root.querySelector('[data-s=r]');
      function next() {
        pb.style.width = (round / kinds.length * 100) + '%';
        if (round >= kinds.length) { ctx.finish({ win: true }); return; }
        var ps = pairsOf(kinds[round++], k, ctx.lang), sel = null, left = ps.length;
        function cards(list, side) { return R.shuffle(list).map(function (p) { return '<button type="button" class="hwj-card" data-id="' + p.id + '" data-side="' + side + '">' + (side === 'l' ? p.l : p.r) + '</button>'; }).join(''); }
        colL.innerHTML = cards(ps, 'l'); colR.innerHTML = cards(ps, 'r');
        ctx.root.querySelector('.hwj-cols').onclick = function (e) {
          var c = e.target.closest('.hwj-card'); if (!c || c.disabled || ctx.over) return;
          var side = c.getAttribute('data-side');
          if (side === 'l') { colL.querySelectorAll('.sel').forEach(function (x) { x.classList.remove('sel'); }); c.classList.add('sel'); sel = c; H.sfx('tap'); return; }
          if (!sel) { c.classList.add('nudge'); ctx.after(function () { c.classList.remove('nudge'); }, 300); return; }
          if (sel.getAttribute('data-id') === c.getAttribute('data-id')) {
            sel.disabled = true; c.disabled = true; sel.classList.remove('sel'); sel.classList.add('done'); c.classList.add('done');
            ctx.good(1, c); sel = null; left--;
            if (left === 0) ctx.after(next, 800);
          } else {
            var s2 = sel; c.classList.add('bad'); s2.classList.add('bad'); ctx.bad(); sel = null;
            ctx.after(function () { c.classList.remove('bad'); s2.classList.remove('bad', 'sel'); }, 450);
          }
        };
      }
      next();
    }
  };

  /* ═════════ 9 · El laboratorio de pociones ═════════ */
  var ING = [
    { id: 'eye', sp: 'eye', n: S('ojos', 'ulls', 'eyes') }, { id: 'mush', sp: 'mushroom', n: S('setas', 'bolets', 'mushrooms') },
    { id: 'bone', sp: 'bone', n: S('huesos', 'ossos', 'bones') }, { id: 'drop', sp: 'drop', n: S('babas', 'bava', 'slime') },
    { id: 'wing', sp: 'wing', n: S('alas', 'ales', 'wings') }, { id: 'spid', sp: 'spider', n: S('arañas', 'aranyes', 'spiders') }
  ];
  function potionTask(L) {
    var nt = [2, 3, 2, 2, 3, 3][L - 1], ids = R.sample(ING, nt), mode, m = 1, base = {}, need = {}, start = {};
    mode = L <= 2 ? 'plain' : L === 3 ? 'mult' : L === 4 ? 'mult' : L === 5 ? 'have' : (R.chance(.5) ? 'mult' : 'half');
    if (mode === 'mult') m = L === 3 ? 2 : L === 4 ? R.pick([2, 3]) : R.pick([3, 4]);
    var mx = [3, 4, 3, 4, 6, 4][L - 1];
    ids.forEach(function (g) {
      if (mode === 'half') { base[g.id] = R.pick([2, 4, 6, 8]); need[g.id] = base[g.id] / 2; }
      else { base[g.id] = R.int(1, mx); need[g.id] = base[g.id] * m; }
    });
    if (mode === 'have') {
      ids.forEach(function (g) { start[g.id] = R.int(0, Math.max(0, base[g.id] - 1)); });
      if (!ids.some(function (g) { return start[g.id] > 0; })) start[ids[0].id] = Math.max(1, Math.min(base[ids[0].id] - 1, 1));
      if (ids.every(function (g) { return start[g.id] >= base[g.id]; })) start[ids[0].id] = base[ids[0].id] - 1;
    }
    return { ids: ids, mode: mode, m: m, base: base, need: need, start: start };
  }

  G.pociones = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, rounds = [3, 3, 4, 4, 4, 4][L - 1], r = 0;
      var T = {
        recipe: S('Receta', 'Recepta', 'Recipe'), mix: S('¡Mezclar!', 'Barrejar!', 'Mix!'),
        mult: function (m) { return S('Receta para 1 poción. ¡Haz ' + m + ' pociones!', 'Recepta per a 1 poció. Fes ' + m + ' pocions!', 'Recipe for 1 potion. Make ' + m + ' potions!'); },
        half: S('Esta receta es para 2 pociones. ¡Haz solo 1!', 'Aquesta recepta és per a 2 pocions. Fes-ne només 1!', 'This recipe makes 2 potions. Make just 1!'),
        have: S('En el caldero ya hay ingredientes. ¡Completa la receta!', 'Al calderó ja hi ha ingredients. Completa la recepta!', 'There are already ingredients in the cauldron. Complete the recipe!')
      };
      ctx.root.innerHTML = '<div class="hwx"><div class="hw-pbar" aria-hidden="true"><i></i></div><div class="hwx-recipe"></div><div class="hwx-pot">' + A.svg('cauldron', '', 'hwx-caul') + '<span class="hwx-bub"></span></div><div class="hwx-cnt"></div><div class="hwx-send"></div></div>';
      var pb = bar(ctx.root), rec = ctx.root.querySelector('.hwx-recipe'), cnt = ctx.root.querySelector('.hwx-cnt'), send = ctx.root.querySelector('.hwx-send');
      function next() {
        pb.style.width = (r / rounds * 100) + '%';
        if (r >= rounds) { ctx.finish({ win: true }); return; }
        r++;
        var p = potionTask(L), locked = false;
        var line = p.mode === 'mult' ? ctx.t(T.mult(p.m)) : p.mode === 'half' ? ctx.t(T.half) : p.mode === 'have' ? ctx.t(T.have) : '';
        rec.innerHTML = '<h3 class="hwq-title">' + esc(ctx.t(T.recipe)) + '</h3>' + (line ? '<p class="hwx-line">' + esc(line) + '</p>' : '') + '<div class="hwx-rows">' + p.ids.map(function (g) {
          var n = p.base[g.id];
          return '<span class="hwx-rr">' + (L <= 2 ? gl.group(g.sp, n) : sp(g.sp, '', 'hwq-dot') + '<b>× ' + n + '</b>') + '</span>';
        }).join('') + '</div>';
        var mxc = Math.max.apply(null, p.ids.map(function (g) { return p.need[g.id]; })) + 3;
        var cn = gl.counters(cnt, p.ids.map(function (g) { return { id: g.id, html: sp(g.sp, '', 'hwk-sp') + '<small>' + esc(ctx.t(g.n)) + '</small>' }; }), { max: mxc, start: p.start, min: p.start });
        if (gl.DEBUG) cnt.dataset.need = JSON.stringify(p.need);
        send.innerHTML = btnHtml(ctx.t(T.mix));
        send.firstChild.onclick = function () {
          if (locked || ctx.over) return;
          var v = cn.get(), ok = p.ids.every(function (g) { return v[g.id] === p.need[g.id]; });
          if (ok) { locked = true; ctx.good(1, send.firstChild); ctx.root.querySelector('.hwx-pot').classList.add('boil'); ctx.after(function () { ctx.root.querySelector('.hwx-pot').classList.remove('boil'); next(); }, 1000); }
          else {
            ctx.bad();
            p.ids.forEach(function (g) {
              var row = cn.row(g.id), d = v[g.id] - p.need[g.id];
              row.classList.toggle('wrong', d !== 0);
              if (L <= 2) row.setAttribute('data-hint', d < 0 ? '↑' : d > 0 ? '↓' : '');
            });
            ctx.after(function () { p.ids.forEach(function (g) { var row = cn.row(g.id); row.classList.remove('wrong'); row.removeAttribute('data-hint'); }); }, 1200);
          }
        };
      }
      next();
    }
  };

  H.gamesReady = true;
})();
