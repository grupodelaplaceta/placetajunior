/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · MINIJUEGOS DE PREGUNTAS
   1. Truco o trato matemático   7. La calabaza correcta   8. Carrera de escobas
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = window.PJHW;
  if (!H || !H.gl) return;
  var gl = H.gl, R = gl.R, A = H.art, G = H.games;

  function doorOpt(label) {
    return '<span class="hwo-door">' + A.svg('door', '#7b4bd6') + '<b class="hwo-dn">' + label + '</b></span><span class="hwo-res"></span>';
  }

  /* Pregunta + tres opciones (puertas o calabazas). Reutilizada por 1 y 7. */
  function quiz(ctx, o) {
    var root = ctx.root;
    root.innerHTML = '<div class="hwq hwq-' + o.mode + '"><div class="hw-pbar" aria-hidden="true"><i></i></div>' +
      '<div class="hwq-card"><h3 class="hwq-title"></h3><div class="hwq-prompt"></div></div><div class="hwq-opts"></div></div>';
    var bar = root.querySelector('.hw-pbar i'), title = root.querySelector('.hwq-title'), prompt = root.querySelector('.hwq-prompt'), opts = root.querySelector('.hwq-opts');
    var i = 0, locked = false;

    function next() {
      if (i >= o.rounds) { ctx.finish({ win: true }); return; }
      locked = false;
      var q = o.gen(i);
      title.textContent = q.title ? ctx.t(q.title) : '';
      title.hidden = !q.title;
      prompt.innerHTML = q.html;
      opts.innerHTML = '';
      q.opts.forEach(function (op) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'hwo ' + (o.mode === 'doors' ? 'hwo-d' : 'hwo-p');
        b.innerHTML = o.mode === 'doors' ? doorOpt(op.html) : gl.pumpkinOpt(op.html);
        if (gl.DEBUG && op.ok) b.dataset.ok = '1';
        b.addEventListener('click', function () {
          if (locked || b.disabled || ctx.over) return;
          var res = b.querySelector('.hwo-res');
          if (op.ok) {
            locked = true; b.classList.add('ok');
            if (res) res.innerHTML = A.svg('candy', gl.COL[i % gl.COL.length].c);
            ctx.good(1, b); i++;
            bar.style.width = (i / o.rounds * 100) + '%';
            ctx.after(next, 900);
          } else {
            b.disabled = true; b.classList.add('bad');
            if (res) res.innerHTML = A.svg('spider');
            ctx.bad();
          }
        });
        opts.appendChild(b);
      });
    }
    next();
  }

  /* 1 · Truco o trato matemático */
  G.truco = {
    start: function (ctx) {
      var L = ctx.level;
      quiz(ctx, { mode: 'doors', rounds: [5, 6, 7, 8, 9, 10][L - 1], gen: function () { return gl.mathQ(L); } });
    }
  };

  /* 7 · La calabaza correcta */
  G.calabaza = {
    start: function (ctx) {
      var L = ctx.level;
      quiz(ctx, { mode: 'pumpkins', rounds: [6, 7, 8, 8, 9, 10][L - 1], gen: function () { return gl.logicQ(L); } });
    }
  };

  /* 8 · Carrera de escobas: aciertas → avanzas; fallas → avanza el rival */
  G.escobas = {
    noLives: true,
    start: function (ctx) {
      var L = ctx.level, len = 8 + L, me = 0, rival = 0;
      var pRival = [0.15, 0.25, 0.35, 0.42, 0.5, 0.55][L - 1];
      var rivalCap = L <= 2 ? len - 2 : len; // en Infantil el rival no puede ganar
      var T_ME = gl.S('Tú', 'Tu', 'You'), T_RV = gl.S('Rival', 'Rival', 'Rival');
      ctx.root.innerHTML = '<div class="hwr"><div class="hwr-track" aria-hidden="true">' +
        '<div class="hwr-lane"><span class="hwr-flag">' + A.svg('flag') + '</span><span class="hwr-who hwr-me" style="left:0%">' + A.svg('broom') + A.svg('hat', '#6a2cc9', 'hwr-hat') + '</span></div>' +
        '<div class="hwr-lane hwr-lane2"><span class="hwr-flag">' + A.svg('flag') + '</span><span class="hwr-who hwr-rv" style="left:0%">' + A.svg('bat') + '</span></div></div>' +
        '<div class="hwr-pos" aria-live="polite"></div><div class="hwr-q"></div></div>';
      var meEl = ctx.root.querySelector('.hwr-me'), rvEl = ctx.root.querySelector('.hwr-rv'), host = ctx.root.querySelector('.hwr-q'), pos = ctx.root.querySelector('.hwr-pos');
      function place() {
        meEl.style.left = (me / len * 86) + '%'; rvEl.style.left = (rival / len * 86) + '%';
        pos.textContent = ctx.t(T_ME) + ' ' + me + '/' + len + '  ·  ' + ctx.t(T_RV) + ' ' + rival + '/' + len;
      }
      function moveRival(n) { rival = Math.min(rivalCap, rival + n); }
      function check() {
        place();
        if (me >= len) { ctx.after(function () { ctx.finish({ win: true }); }, 400); return true; }
        if (rival >= len) { ctx.after(function () { ctx.finish({ win: false }); }, 400); return true; }
        return false;
      }
      function ask() {
        var q = gl.anyQ(L), done = false;
        gl.askQ(ctx, host, q, function (ok, b) {
          if (done) return;
          done = true;
          host.querySelectorAll('.hwo').forEach(function (x) { x.disabled = true; });
          if (ok) {
            ctx.good(1, b); me++;
            if (R.chance(pRival)) moveRival(1);
          } else {
            ctx.bad(); moveRival(1);
            if (R.chance(pRival)) moveRival(1);
          }
          if (check()) return;
          if (ok) ctx.after(ask, 800);
          else ctx.after(ask, 900);
        });
      }
      place(); ask();
    }
  };
})();
