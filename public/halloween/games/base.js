/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · MINIJUEGOS · Biblioteca común (azar, retos, componentes)
   Se carga solo cuando se abre un minijuego. Expone window.PJHW.gl.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = window.PJHW;
  if (!H) return;
  var A = H.art;

  var DEBUG = /[?&]hwtest=1\b/.test(location.search); // solo para pruebas automáticas
  var R = {
    int: function (a, b) { return a + Math.floor(Math.random() * (b - a + 1)); },
    pick: function (a) { return a[Math.floor(Math.random() * a.length)]; },
    chance: function (p) { return Math.random() < p; },
    shuffle: function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; },
    sample: function (a, n) { return R.shuffle(a).slice(0, n); }
  };
  function S(es, ca, en) { return [es, ca, en]; }
  function esc(s) { return H.esc(s); }

  var COL = [
    { id: 'red', c: '#ff4d6d' }, { id: 'orange', c: '#ff8a00' }, { id: 'yellow', c: '#ffc93c' },
    { id: 'green', c: '#2fd06b' }, { id: 'blue', c: '#38b6ff' }, { id: 'purple', c: '#9b5de5' }
  ];
  /* Sprites «normales» con los que se hacen cuentas, patrones y diferencias */
  var KINDS = ['pumpkin', 'ghost', 'bat', 'spider', 'hat', 'cauldron', 'skull', 'cat', 'moon', 'potion', 'monster', 'candy'];

  var W = {
    es: ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve', 'veinte'],
    ca: ['zero', 'un', 'dos', 'tres', 'quatre', 'cinc', 'sis', 'set', 'vuit', 'nou', 'deu', 'onze', 'dotze', 'tretze', 'catorze', 'quinze', 'setze', 'disset', 'divuit', 'dinou', 'vint'],
    en: ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
  };
  function numWord(n, lang) { return W[['es', 'ca', 'en'][lang]][n]; }

  function sp(name, color, cls) { return A.svg(name, color, cls); }
  function group(name, n, color) { var s = ''; for (var i = 0; i < n; i++) s += sp(name, color, 'hwq-dot'); return '<span class="hwq-group">' + s + '</span>'; }
  function numSpan(v) { return '<span class="hwo-num">' + v + '</span>'; }

  /* Opciones numéricas con distractores verosímiles (sin repetir, ≥ 0) */
  function numOpts(ans, n, lo, hi) {
    var set = [ans], tries = 0, span = ans > 20 ? [1, 2, 10, 5, 3] : [1, 2, 3];
    while (set.length < n && tries++ < 80) {
      var d = R.pick(span) * (R.chance(.5) ? 1 : -1), v = ans + d;
      if (lo != null && v < lo) continue;
      if (hi != null && v > hi) continue;
      if (v < 0 || set.indexOf(v) > -1) continue;
      set.push(v);
    }
    for (var k = 1; set.length < n; k++) if (set.indexOf(ans + k) < 0) set.push(ans + k);
    return R.shuffle(set);
  }
  function numQ(title, html, ans, n, lo, hi) {
    return { title: title, html: html, opts: numOpts(ans, n || 3, lo, hi).map(function (v) { return { html: numSpan(v), ok: v === ans }; }) };
  }
  function eq(a, op, b, missing) {
    var left = missing === 'a' ? '?' : a, right = missing === 'b' ? '?' : b;
    return '<span class="hwq-eq">' + left + ' ' + op + ' ' + right + ' = ' + (missing ? missing === 'r' ? '?' : '' : '?') + '</span>';
  }

  /* ───────── Cuentas por nivel (1 Infantil … 6 Primaria superior) ───────── */
  var T_HOW = S('¿Cuántos hay?', 'Quants n\'hi ha?', 'How many are there?');
  var T_SOLVE = S('Resuelve', 'Resol', 'Solve it');
  function mathQ(L) {
    var a, b, r = Math.random(), k;
    if (L === 1) {
      k = R.pick(['pumpkin', 'ghost', 'candy', 'bat']); a = R.int(1, 4);
      return numQ(T_HOW, group(k, a, k === 'candy' ? R.pick(COL).c : undefined), a, 3, 1, 5);
    }
    if (L === 2) {
      if (r < .45) { k = R.pick(['pumpkin', 'ghost', 'candy', 'spider']); a = R.int(2, 7); return numQ(T_HOW, group(k, a), a, 3, 1, 9); }
      k = R.pick(['pumpkin', 'ghost', 'bat']); a = R.int(1, 3); b = R.int(1, 3);
      return numQ(T_SOLVE, '<span class="hwq-sum">' + group(k, a) + '<b>+</b>' + group(k, b) + '<b>=</b><b>?</b></span>', a + b, 3, 1, 8);
    }
    if (L === 3) {
      if (r < .55) { a = R.int(1, 9); b = R.int(1, 10 - a); return numQ(T_SOLVE, eq(a, '+', b), a + b, 3, 0, 12); }
      if (r < .9) { a = R.int(3, 10); b = R.int(1, a - 1); return numQ(T_SOLVE, eq(a, '−', b), a - b, 3, 0, 12); }
      a = R.int(5, 12); b = R.int(3, 8); return numQ(T_SOLVE, eq(a, '+', b), a + b, 3, 0, 22);
    }
    if (L === 4) {
      if (r < .3) { a = R.int(8, 20); b = R.int(3, 30 - a); return numQ(T_SOLVE, eq(a, '+', b), a + b, 3); }
      if (r < .55) { a = R.int(12, 30); b = R.int(3, a - 2); return numQ(T_SOLVE, eq(a, '−', b), a - b, 3); }
      a = R.pick([2, 5, 10]); b = R.int(1, 6); return numQ(T_SOLVE, eq(a, '×', b), a * b, 3);
    }
    if (L === 5) {
      if (r < .4) { a = R.int(2, 9); b = R.int(2, 10); return numQ(T_SOLVE, eq(a, '×', b), a * b, 3); }
      if (r < .7) { a = R.int(21, 58); b = R.int(11, 40); return numQ(T_SOLVE, eq(a, '+', b), a + b, 3); }
      if (r < .9) { a = R.int(40, 99); b = R.int(11, 39); return numQ(T_SOLVE, eq(a, '−', b), a - b, 3); }
      b = R.pick([2, 5, 10, 3]); k = R.int(2, 9); return numQ(T_SOLVE, eq(b * k, '÷', b), k, 3);
    }
    /* L6 */
    if (r < .3) { a = R.int(4, 12); b = R.int(4, 12); return numQ(T_SOLVE, eq(a, '×', b), a * b, 3); }
    if (r < .5) { b = R.int(3, 9); k = R.int(3, 12); return numQ(T_SOLVE, eq(b * k, '÷', b), k, 3); }
    if (r < .75) { a = R.int(18, 75); b = R.int(15, 80 - 1); var t1 = a + b; return numQ(T_SOLVE, '<span class="hwq-eq">? + ' + b + ' = ' + t1 + '</span>', a, 3); }
    if (r < .9) { a = R.int(3, 9); b = R.int(4, 12); return numQ(T_SOLVE, '<span class="hwq-eq">' + a + ' × ? = ' + (a * b) + '</span>', b, 3); }
    a = R.int(45, 99); b = R.int(19, 44); return numQ(T_SOLVE, eq(a, '+', b), a + b, 3);
  }

  /* ───────── Retos de lógica por nivel ───────── */
  var T_ODD = S('¿Cuál es diferente?', 'Quin és diferent?', 'Which one is different?');
  var T_NEXT = S('¿Qué viene después?', 'Què ve després?', 'What comes next?');
  var T_BIG = S('Toca el más grande', 'Toca el més gran', 'Tap the biggest one');
  var T_SMALL = S('Toca el más pequeño', 'Toca el més petit', 'Tap the smallest one');
  var T_MORE = S('¿Cuál tiene más?', 'Quin en té més?', 'Which has more?');
  var T_GT = S('Toca el mayor', 'Toca el major', 'Tap the greatest');
  var T_LT = S('Toca el menor', 'Toca el menor', 'Tap the smallest');
  var T_DOUBLE = function (n) { return S('El doble de ' + n, 'El doble de ' + n, 'Double ' + n); };
  var T_HALF = function (n) { return S('La mitad de ' + n, 'La meitat de ' + n, 'Half of ' + n); };
  var TYPES = {
    1: ['count', 'size', 'odd', 'seqShape'],
    2: ['count', 'size', 'odd', 'seqShape', 'compare'],
    3: ['odd', 'seqShape', 'seqNum', 'compare', 'double'],
    4: ['odd', 'seqShape', 'seqNum', 'compare', 'double'],
    5: ['odd', 'seqNum', 'compare', 'double'],
    6: ['odd', 'seqNum', 'compare', 'double']
  };
  var lastType = '';
  function spOpt(k, c) { return { html: sp(k, c, 'hwo-sp') }; }

  function logicQ(L) {
    var types = TYPES[L], type;
    do { type = R.pick(types); } while (type === lastType && types.length > 1);
    lastType = type;
    var k, a, b, i, q, kinds, ans;

    if (type === 'count') {
      k = R.pick(['pumpkin', 'ghost', 'bat', 'candy', 'skull']); a = L === 1 ? R.int(1, 4) : R.int(3, 8);
      return numQ(T_HOW, group(k, a), a, 3, 1, 9);
    }
    if (type === 'size') {
      k = R.pick(KINDS); var big = R.chance(.5), sizes = R.shuffle([46, 68, 92]);
      var target = big ? 92 : 46;
      return {
        title: big ? T_BIG : T_SMALL, html: '',
        opts: sizes.map(function (s) { return { html: '<span class="hwo-size" style="width:' + s + 'px;height:' + s + 'px">' + sp(k) + '</span>', ok: s === target }; })
      };
    }
    if (type === 'odd') {
      if (L <= 2) {
        kinds = R.sample(KINDS, 2); i = R.int(0, 3);
        var o = []; for (var n = 0; n < 4; n++) o.push({ html: sp(n === i ? kinds[1] : kinds[0], null, 'hwo-sp'), ok: n === i });
        return { title: T_ODD, html: '', opts: o };
      }
      var vals = [], oddOne, rule;
      if (L <= 4) {
        var even = R.chance(.5);
        vals = R.sample([2, 4, 6, 8, 10, 12, 14, 16, 18, 20].map(function (x) { return even ? x : x + 1; }), 3);
        oddOne = R.pick([2, 4, 6, 8, 10, 12, 14, 16, 18].map(function (x) { return even ? x + 1 : x; }));
      } else {
        var m = R.pick([3, 4, 5, 6, 7]);
        vals = R.sample([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (x) { return x * m; }), 3);
        do { oddOne = R.int(5, 70); } while (oddOne % m === 0);
      }
      var all = R.shuffle(vals.concat([oddOne]));
      return { title: T_ODD, html: '', opts: all.map(function (v) { return { html: numSpan(v), ok: v === oddOne }; }) };
    }
    if (type === 'seqShape') {
      kinds = R.sample(KINDS, 3);
      var unit;
      if (L === 1) unit = [0, 1];
      else if (L === 2) unit = R.pick([[0, 0, 1], [0, 1, 2]]);
      else if (L === 3) unit = R.pick([[0, 1, 1], [0, 1, 2], [0, 0, 1, 1]]);
      else unit = R.pick([[0, 1, 1, 2], [0, 0, 1, 2], [0, 1, 2, 1]]);
      var len = unit.length * 2 + R.int(0, 1) + (L === 1 ? 1 : 0), seq = [];
      for (i = 0; i < len; i++) seq.push(unit[i % unit.length]);
      ans = unit[len % unit.length];
      var show = seq.map(function (x) { return sp(kinds[x], null, 'hwq-dot'); }).join('') + '<span class="hwq-qm">?</span>';
      var pool = R.shuffle([0, 1, 2].filter(function (x) { return x < Math.max(2, Math.max.apply(null, unit) + 1) || x === ans; }));
      if (pool.indexOf(ans) < 0) pool.push(ans);
      while (pool.length < 3) { var extra = R.pick([0, 1, 2]); if (pool.indexOf(extra) < 0) pool.push(extra); }
      return { title: T_NEXT, html: '<span class="hwq-group hwq-seq">' + show + '</span>', opts: R.shuffle(pool.slice(0, 3)).map(function (x) { return { html: sp(kinds[x], null, 'hwo-sp'), ok: x === ans }; }) };
    }
    if (type === 'seqNum') {
      var terms = [], d;
      if (L === 3) { d = R.pick([2, 5, 10]); a = R.int(1, 8); for (i = 0; i < 4; i++) terms.push(a + d * i); ans = a + d * 4; }
      else if (L === 4) {
        if (R.chance(.5)) { d = R.pick([2, 3, 5]); a = R.int(30, 50); for (i = 0; i < 4; i++) terms.push(a - d * i); ans = a - d * 4; }
        else { a = R.int(1, 4); for (i = 0; i < 4; i++) terms.push(a * Math.pow(2, i)); ans = a * 16; }
      } else if (L === 5) {
        if (R.chance(.5)) { a = R.int(1, 6); d = 1; for (i = 0; i < 4; i++) { terms.push(a); a += d; d++; } ans = a; }
        else { d = R.pick([4, 6, 7, 9]); a = R.int(2, 20); for (i = 0; i < 4; i++) terms.push(a + d * i); ans = a + d * 4; }
      } else {
        var m6 = R.int(0, 2);
        if (m6 === 0) { a = R.int(1, 3); for (i = 0; i < 4; i++) terms.push(a * Math.pow(3, i)); ans = a * 81; }
        else if (m6 === 1) { for (i = 1; i <= 4; i++) terms.push(i * i); ans = 25; }
        else { a = R.int(1, 5); b = R.int(1, 5); terms = [a, b, a + b, b + (a + b)]; ans = (a + b) + (b + a + b); }
      }
      var html = '<span class="hwq-group hwq-seq">' + terms.map(function (v) { return '<b class="hwq-n">' + v + '</b>'; }).join('') + '<span class="hwq-qm">?</span></span>';
      return numQ(T_NEXT, html, ans, 3, 0);
    }
    if (type === 'compare') {
      var more = R.chance(.5);
      if (L <= 2) {
        k = R.pick(['pumpkin', 'candy', 'ghost', 'bat']); a = R.int(1, 6); do { b = R.int(1, 6); } while (b === a);
        var tg = more ? Math.max(a, b) : Math.min(a, b);
        return { title: more ? T_MORE : S('¿Cuál tiene menos?', 'Quin en té menys?', 'Which has fewer?'), html: '', opts: [a, b].map(function (v) { return { html: '<span class="hwo-grp">' + group(k, v) + '</span>', ok: v === tg }; }) };
      }
      var items = [];
      if (L <= 4) {
        var hi = L === 3 ? 30 : 99;
        while (items.length < 3) { var v = R.int(1, hi); if (items.indexOf(v) < 0) items.push(v); }
        var best = more ? Math.max.apply(null, items) : Math.min.apply(null, items);
        return { title: more ? T_GT : T_LT, html: '', opts: items.map(function (v) { return { html: numSpan(v), ok: v === best }; }) };
      }
      var ex = [], vals2 = [];
      while (ex.length < 3) {
        var x, e;
        var kind = R.int(0, 2);
        if (kind === 0) { a = R.int(10, 60); b = R.int(10, 40); x = a + b; e = a + ' + ' + b; }
        else if (kind === 1) { a = R.int(3, 12); b = R.int(3, 12); x = a * b; e = a + ' × ' + b; }
        else { a = R.int(40, 99); b = R.int(10, 39); x = a - b; e = a + ' − ' + b; }
        if (vals2.indexOf(x) < 0) { vals2.push(x); ex.push({ e: e, v: x }); }
      }
      var bv = more ? Math.max.apply(null, vals2) : Math.min.apply(null, vals2);
      return { title: more ? T_GT : T_LT, html: '', opts: ex.map(function (o2) { return { html: '<span class="hwo-num hwo-ex">' + o2.e + '</span>', ok: o2.v === bv }; }) };
    }
    /* double / mitad */
    if (L <= 4 || R.chance(.5)) {
      a = L === 3 ? R.int(2, 10) : R.int(6, 25);
      return numQ(T_DOUBLE(a), '<span class="hwq-eq">× 2</span>', a * 2, 3);
    }
    a = R.int(3, 25) * 2;
    return numQ(T_HALF(a), '<span class="hwq-eq">÷ 2</span>', a / 2, 3);
  }

  /* Reto mezclado (carrera de escobas / candados del laberinto) */
  function anyQ(L) { return R.chance(.5) ? mathQ(L) : logicQ(L); }

  /* ───────── Componentes ───────── */
  function pumpkinOpt(html) { return '<span class="hwo-pk">' + A.svg('pumpkin', '', 'hwo-pks') + '<span class="hwo-pkc">' + html + '</span></span>'; }

  /* Pregunta autónoma con calabazas. cb(true|false) en cada pulsación. */
  function askQ(ctx, host, q, cb) {
    host.innerHTML = '<div class="hwq-card">' + (q.title ? '<h3 class="hwq-title">' + esc(ctx.t(q.title)) + '</h3>' : '') + '<div class="hwq-prompt">' + q.html + '</div></div><div class="hwq-opts"></div>';
    var opts = host.querySelector('.hwq-opts'), locked = false;
    q.opts.forEach(function (op) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'hwo hwo-p'; b.innerHTML = pumpkinOpt(op.html);
      if (DEBUG && op.ok) b.dataset.ok = '1';
      b.addEventListener('click', function () {
        if (locked || b.disabled || ctx.over) return;
        if (op.ok) { locked = true; b.classList.add('ok'); cb(true, b); }
        else { b.disabled = true; b.classList.add('bad'); cb(false, b); }
      });
      opts.appendChild(b);
    });
  }

  /* Filas con contador − n + (fábrica de caramelos y pociones) */
  function counters(host, items, o) {
    o = o || {};
    host.innerHTML = items.map(function (it) {
      return '<div class="hwk" data-id="' + it.id + '"><div class="hwk-i">' + it.html + '</div><div class="hwk-c"><button type="button" class="hwk-b" data-d="-1" aria-label="−">−</button><b class="hwk-n">0</b><button type="button" class="hwk-b" data-d="1" aria-label="+">+</button></div></div>';
    }).join('');
    var v = {};
    items.forEach(function (it) { v[it.id] = (o.start && o.start[it.id]) || 0; });
    function paint() {
      items.forEach(function (it) { var row = host.querySelector('[data-id="' + it.id + '"]'); row.querySelector('.hwk-n').textContent = v[it.id]; });
    }
    host.onclick = function (e) { // onclick (no addEventListener): la fila se reutiliza entre rondas
      var b = e.target.closest('.hwk-b'); if (!b) return;
      var id = b.closest('.hwk').getAttribute('data-id'), d = parseInt(b.getAttribute('data-d'), 10);
      var min = (o.min && o.min[id]) || 0, nv = Math.max(min, Math.min(o.max || 12, v[id] + d));
      if (nv !== v[id]) { v[id] = nv; paint(); H.sfx('tap'); if (o.onChange) o.onChange(v); }
    };
    paint();
    return { get: function () { return v; }, row: function (id) { return host.querySelector('[data-id="' + id + '"]'); }, paint: paint };
  }

  H.gl = { R: R, S: S, DEBUG: DEBUG, COL: COL, KINDS: KINDS, sp: sp, group: group, numWord: numWord, numSpan: numSpan, mathQ: mathQ, logicQ: logicQ, anyQ: anyQ, askQ: askQ, pumpkinOpt: pumpkinOpt, counters: counters, esc: esc, numOpts: numOpts };
  H.games = H.games || {};
})();
