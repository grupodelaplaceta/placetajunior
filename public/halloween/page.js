/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · PÁGINA, ACCESOS Y CARCASA DE PARTIDA
   Expone window.PJHalloween con los únicos puntos que usa Junior:
     · banner(li)     → banner de la portada
     · infantil(li)   → acceso en Juegos de Infantil
     · page()         → HTML de la página #/halloween
     · sync()         → se llama en cada cambio de ruta (música, partida)
   Los minijuegos (games.js) se cargan solo al abrir uno.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var H = window.PJHW;
  if (!H) return;
  var C = H.C, t = H.t, esc = H.esc, A = H.art, store = H.store, sfx = H.sfx, music = H.music;

  var tab = 'pri', ov = null, sheetEl = null, gamesLoading = null;

  var CARD = {
    truco:     { c: '#ff8a00', art: function () { return A.svg('door', '#7b4bd6') + A.svg('pumpkin', '', 'hw-s2'); } },
    atrapa:    { c: '#8d4bff', art: function () { return A.svg('candy', '#ff4d6d', 'hw-s2') + A.basket('clasica'); } },
    memoria:   { c: '#ff5fa2', art: function () { return A.svg('monster') + A.svg('ghost', '', 'hw-s2'); } },
    fabrica:   { c: '#ff4d6d', art: function () { return A.svg('candy', '#ffb703') + A.svg('lolli', '#9b5de5', 'hw-s2'); } },
    fantasma:  { c: '#5b8cff', art: function () { return A.svg('tomb') + A.svg('ghost', '', 'hw-s2'); } },
    parejas:   { c: '#18b58a', art: function () { return A.svg('hat') + A.svg('cauldron', '', 'hw-s2'); } },
    calabaza:  { c: '#ff8a00', art: function () { return A.svg('pumpkin') + A.svg('star', '', 'hw-s2'); } },
    escobas:   { c: '#6a2cc9', art: function () { return A.svg('moon', '', 'hw-s2') + A.svg('broom'); } },
    pociones:  { c: '#2fa84f', art: function () { return A.svg('potion') + A.svg('eye', '', 'hw-s2'); } },
    laberinto: { c: '#3b2a8a', art: function () { return A.svg('house') + A.svg('ghost', '', 'hw-s2'); } }
  };

  var ICON_BACK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_PLAY = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>';
  var ICON_VOL = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 10v4h4l5 4V6L7 10z" fill="currentColor"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ICON_MUTE = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M3 10v4h4l5 4V6L7 10z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  function E(id) { return H.ent(id); }
  function gk(id) { var e = E(id); return e ? e.game : id; }
  function stageOf(id, n) { return E(id).stage[n - 1]; }
  function stars(n, max) {
    var s = ''; for (var i = 1; i <= (max || 3); i++) s += A.svg('star', i <= n ? '#ffc93c' : '#4b3b86', 'hw-star' + (i <= n ? ' on' : ''));
    return s;
  }

  /* ═════════ Accesos desde Junior ═════════ */
  function banner() {
    return '<section class="sec hw-bsec"><div class="wrap"><a class="hw-banner" href="#/halloween">' +
      '<span class="hw-b-art" aria-hidden="true">' + A.svg('ghost', '', 'hw-b1') + A.svg('pumpkin', '', 'hw-b2') + A.svg('bat', '', 'hw-b3') + '</span>' +
      '<span class="hw-b-txt"><b class="hw-b-t">' + esc(t('bTitle')) + '</b><span class="hw-b-s">' + esc(t('bText')) + '</span></span>' +
      '<span class="hw-b-btn">' + esc(t('bBtn')) + ICON_PLAY + '</span></a></div></section>';
  }
  function infantil() {
    return '<a class="hw-inf" href="#/halloween/infantil"><span class="hw-i-art" aria-hidden="true">' + A.svg('pumpkin', '', 'hw-i1') + A.svg('ghost', '', 'hw-i2') + A.svg('bat', '', 'hw-i3') + '</span>' +
      '<span class="hw-i-txt"><b>' + esc(t('infTitle')) + '</b><small>' + esc(t('infText')) + '</small></span>' +
      '<span class="hw-i-go" aria-hidden="true">' + ICON_PLAY + '</span></a>';
  }

  /* ═════════ Página ═════════ */
  function gameCard(g) {
    var id = g.id, k = g.game, open = store.gameUnlocked(id), done = store.levelsDone(id), dots = '';
    for (var n = 1; n <= E(id).count; n++) dots += '<i class="' + (store.stars(id, n) > 0 ? 'on' : '') + '"></i>';
    return '<button type="button" class="hw-gc' + (open ? '' : ' is-lock') + '" data-hw="game" data-id="' + id + '" style="--gc:' + CARD[k].c + '" aria-label="' + esc(t('g.' + k + '.n')) + (open ? '' : ' · ' + esc(t('locked'))) + '">' +
      '<span class="hw-gc-art">' + CARD[k].art() + (open ? '' : '<span class="hw-lockb">' + A.svg('lock') + '</span>') + '</span>' +
      '<span class="hw-gc-t">' + esc(t('g.' + k + '.n')) + '</span>' +
      '<span class="hw-gc-d">' + esc(t('g.' + k + '.d')) + '</span>' +
      '<span class="hw-gc-f">' + (open
        ? '<span class="hw-dots" aria-hidden="true">' + dots + '</span><span class="hw-prog">' + esc(t('done', done, E(id).count)) + '</span>'
        : '<span class="hw-price">' + A.svg('candy', '#ff4d6d') + '<b>' + g.price + '</b></span><span class="hw-prog">' + esc(t('unlock')) + '</span>') +
      '</span></button>';
  }
  function basketCard(b) {
    var d = store.data(), own = d.baskets.indexOf(b.id) > -1, on = d.basket === b.id;
    return '<button type="button" class="hw-gc hw-sm' + (own ? '' : ' is-lock') + (on ? ' is-on' : '') + '" data-hw="basket" data-id="' + b.id + '" style="--gc:#ff8a00">' +
      '<span class="hw-gc-art">' + A.basket(b.id) + '</span><span class="hw-gc-t">' + esc(t('b.' + b.id)) + '</span>' +
      '<span class="hw-gc-f">' + (on ? '<span class="hw-prog hw-ok">' + esc(t('inUse')) + '</span>' : own ? '<span class="hw-prog">' + esc(t('use')) + '</span>'
        : '<span class="hw-price">' + A.svg('candy', '#ff4d6d') + '<b>' + b.price + '</b></span>') + '</span></button>';
  }
  function ghostCard(g) {
    var own = store.data().ghosts.indexOf(g.id) > -1;
    return '<button type="button" class="hw-gc hw-sm' + (own ? ' is-found' : ' is-lock') + '" data-hw="ghost" data-id="' + g.id + '" style="--gc:#8d4bff">' +
      '<span class="hw-gc-art">' + (own ? A.ghost(g.id) : A.ghostSilhouette('hw-sil')) + '</span><span class="hw-gc-t">' + esc(own ? t('gh.' + g.id) : t('mystery')) + '</span>' +
      '<span class="hw-gc-f">' + (own ? '<span class="hw-prog hw-ok">' + esc(t('found')) + '</span>' : '<span class="hw-price">' + A.svg('candy', '#ff4d6d') + '<b>' + g.price + '</b></span>') + '</span></button>';
  }
  function panel() {
    if (tab === 'baskets') return '<div class="hw-grid hw-grid-sm">' + C.baskets.map(basketCard).join('') + '</div>';
    if (tab === 'ghosts') {
      return '<p class="hw-count">' + esc(t('ghostsCount', store.data().ghosts.length, C.ghosts.length)) + '</p><div class="hw-grid hw-grid-sm">' + C.ghosts.map(ghostCard).join('') + '</div>';
    }
    var age = tab === 'inf' ? 'inf' : 'pri';
    return '<p class="hw-count">' + esc(t(age === 'inf' ? 'secInf' : 'secPri')) + '</p><div class="hw-grid">' + C.games.filter(function (g) { return g.age === age; }).map(gameCard).join('') + '</div>';
  }
  function pageInner() {
    var d = store.data();
    var tabs = [['inf', 'tInf'], ['pri', 'tPri'], ['baskets', 'tBaskets'], ['ghosts', 'tGhosts']].map(function (x) {
      return '<button type="button" role="tab" class="hw-tab" data-hw="tab" data-v="' + x[0] + '" aria-selected="' + (tab === x[0]) + '">' + esc(t(x[1])) + '</button>';
    }).join('');
    return '<div class="hw-hero"><span class="hw-stars" aria-hidden="true"></span><div class="wrap hw-hero-in">' +
      '<a class="hw-back" href="#/">' + ICON_BACK + esc(t('back')) + '</a>' +
      '<div class="hw-hero-row"><div class="hw-hero-txt"><h1>' + esc(t('title')) + '</h1><p>' + esc(t('sub')) + '</p>' +
      '<ul class="hw-how"><li>' + A.svg('pumpkin') + esc(t('how1')) + '</li><li>' + A.svg('candy', '#ff4d6d') + esc(t('how2')) + '</li><li>' + A.svg('lock') + esc(t('how3')) + '</li></ul></div>' +
      '<div class="hw-hero-art" aria-hidden="true">' + A.svg('moon', '', 'hw-h0') + A.svg('ghost', '', 'hw-h1') + A.svg('pumpkin', '', 'hw-h2') + A.svg('bat', '', 'hw-h3') + '</div></div>' +
      '<div class="hw-wallet"><span class="hw-w-c">' + A.svg('candy', '#ff4d6d') + '<b id="hw-bal">' + d.candies + '</b><small>' + esc(t('candies')) + '</small></span>' +
      '<span class="hw-w-b" aria-hidden="true">' + A.basket(d.basket) + '</span></div></div></div>' +
      '<div class="wrap hw-main"><div class="hw-tabs" role="tablist">' + tabs + '</div>' + panel() +
      '<p class="hw-note">' + esc(t(store.ok() ? 'note' : 'noStore')) + '</p></div>';
  }
  function page() {
    var p = (location.hash.replace(/^#/, '')).split('/').filter(Boolean);
    if (p[1] === 'infantil') tab = 'inf';
    return '<section class="hw" id="hw-page">' + pageInner() + '</section>';
  }
  function refresh() { var el = document.getElementById('hw-page'); if (el) { var y = window.scrollY; el.innerHTML = pageInner(); window.scrollTo(0, y); } }

  /* ═════════ Hojas modales (confirmaciones y selector de nivel) ═════════ */
  function closeSheet() { if (sheetEl) { sheetEl.remove(); sheetEl = null; } }
  function showSheet(o) {
    closeSheet();
    var el = document.createElement('div');
    el.className = 'hw-sheet';
    el.innerHTML = '<div class="hw-sheet-box" role="dialog" aria-modal="true" aria-labelledby="hw-st">' + (o.art ? '<div class="hw-sheet-art">' + o.art + '</div>' : '') +
      '<h2 id="hw-st">' + esc(o.title) + '</h2><div class="hw-sheet-body">' + (o.body || '') + '</div><div class="hw-sheet-btns">' + (o.buttons || '') + '</div></div>';
    document.body.appendChild(el);
    sheetEl = el;
    var f = el.querySelector('button:not([disabled])'); if (f) f.focus();
  }
  function btn(label, attrs, cls) { return '<button type="button" class="hw-btn ' + (cls || '') + '" ' + attrs + '>' + esc(label) + '</button>'; }

  function levelSheet(id) {
    var groups = {}, order = [];
    for (var n = 1; n <= E(id).count; n++) { var s = stageOf(id, n); if (!groups[s]) { groups[s] = []; order.push(s); } groups[s].push(n); }
    var body = order.map(function (s) {
      return '<div class="hw-lvg hw-st-' + s + '"><h3>' + esc(t('st_' + s)) + '</h3><div class="hw-lvrow">' + groups[s].map(function (n) {
        var open = store.levelOpen(id, n);
        return '<button type="button" class="hw-lv' + (open ? '' : ' is-lock') + '" data-hw="lvl" data-id="' + id + '" data-n="' + n + '"' + (open ? '' : ' disabled aria-label="' + esc(t('level') + ' ' + n + ' · ' + t('levelLocked')) + '"') + '>' +
          '<span class="hw-lv-n">' + (open ? n : A.svg('lock')) + '</span><span class="hw-lv-s">' + stars(store.stars(id, n)) + '</span></button>';
      }).join('') + '</div></div>';
    }).join('');
    showSheet({ title: t('g.' + gk(id) + '.n'), art: CARD[gk(id)].art(), body: '<p class="hw-sub">' + esc(t('pickLevel')) + '</p>' + body, buttons: btn(t('cancel'), 'data-hw="sheet-close"', 'hw-ghost') });
  }

  function buyConfirm(kind, id) {
    var price = store.price(kind, id), d = store.data();
    var name = kind === 'game' ? t('g.' + gk(id) + '.n') : kind === 'basket' ? t('b.' + id) : t('gh.' + id);
    var art = kind === 'game' ? CARD[gk(id)].art() : kind === 'basket' ? A.basket(id) : A.ghostSilhouette('hw-sil');
    if (d.candies < price) {
      showSheet({ title: name, art: art, body: '<p>' + esc(t('needMore', price - d.candies)) + '</p>', buttons: btn(t('ok'), 'data-hw="sheet-close"') });
      sfx('bad'); return;
    }
    showSheet({
      title: name, art: art,
      body: '<p>' + esc(kind === 'ghost' ? t('discoverQ', price) : t('unlockQ', name, price)) + '</p>',
      buttons: btn(t(kind === 'ghost' ? 'discover' : 'unlock'), 'data-hw="buy" data-kind="' + kind + '" data-id="' + id + '"') + btn(t('cancel'), 'data-hw="sheet-close"', 'hw-ghost')
    });
  }
  function doBuy(kind, id) {
    var r = store.buy(kind, id);
    closeSheet();
    if (r === 'ok') {
      sfx('win'); refresh();
      if (kind === 'ghost') showSheet({ title: t('gh.' + id), art: A.ghost(id), body: '<p class="hw-ok">' + esc(t('found')) + '</p>', buttons: btn(t('ok'), 'data-hw="sheet-close"') });
      else if (kind === 'game') levelSheet(id);
    } else if (r === 'poor') { sfx('bad'); refresh(); }
    else refresh();
  }

  /* ═════════ Carga perezosa de los minijuegos ═════════ */
  var GAME_FILES = ['base', 'quiz', 'arcade', 'puzzles'];
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = src; s.onload = res; s.onerror = function () { rej(); };
      document.head.appendChild(s);
    });
  }
  function ensureGames() {
    if (H.gamesReady) return Promise.resolve();
    if (gamesLoading) return gamesLoading;
    gamesLoading = GAME_FILES.reduce(function (p, f) { return p.then(function () { return loadScript('halloween/games/' + f + '.js'); }); }, Promise.resolve())
      .then(function () { if (!H.gamesReady) throw 0; })
      .catch(function (e) { gamesLoading = null; throw e; });
    return gamesLoading;
  }

  /* ═════════ Carcasa de partida (pantalla completa) ═════════ */
  function speak(txt) {
    try {
      if (!window.speechSynthesis || !H.globalOn()) return;
      speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(txt);
      u.lang = ['es-ES', 'ca-ES', 'en-GB'][H.lang()]; u.rate = 0.9;
      speechSynthesis.speak(u);
    } catch (e) { /* ok */ }
  }
  function stopSpeak() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) { /* ok */ } }

  function bodyEl() { return ov && ov.el.querySelector('#hwp-body'); }
  function updateBar() {
    if (!ov) return;
    ov.el.querySelector('.hwp-sub').textContent = t('level') + ' ' + ov.n + ' · ' + t('stS_' + stageOf(ov.id, ov.n));
    ov.el.querySelector('#hwp-mute').innerHTML = (H.soundOn() ? ICON_VOL : ICON_MUTE);
    ov.el.querySelector('#hwp-mute').setAttribute('aria-label', t(H.soundOn() ? 'musicOn' : 'musicOff'));
  }
  function updateHud(bump) {
    if (!ov) return;
    var n = ov.el.querySelector('#hwp-n');
    n.textContent = ov.run ? store.live(ov.run) : 0;
    if (bump) { n.parentNode.classList.remove('bump'); void n.parentNode.offsetWidth; n.parentNode.classList.add('bump'); }
  }
  function updateHearts() {
    if (!ov) return;
    var el = ov.el.querySelector('#hwp-hearts'), run = ov.run, max = run ? run.maxLives : 0, h = '';
    if (!max || !run) { el.innerHTML = ''; return; }
    for (var i = 1; i <= max; i++) h += A.svg('heart', i <= run.lives ? '#ff4d6d' : '#4b3b86', 'hw-heart' + (i <= run.lives ? '' : ' off'));
    el.setAttribute('aria-label', t('lives') + ': ' + run.lives);
    el.innerHTML = h;
  }

  function openOverlay(id, n) {
    closeOverlay();
    var el = document.createElement('div');
    el.id = 'hw-play'; el.className = 'hwp'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', t('g.' + gk(id) + '.n'));
    el.innerHTML = '<div class="hwp-bar"><button type="button" class="hwp-b" data-hw="exit" aria-label="' + esc(t('exit')) + '">' + ICON_BACK + '</button>' +
      '<div class="hwp-title"><b>' + esc(t('g.' + gk(id) + '.n')) + '</b><small class="hwp-sub"></small></div>' +
      '<div class="hwp-hearts" id="hwp-hearts" role="img"></div>' +
      '<div class="hwp-cd" aria-live="off">' + A.svg('candy', '#ff4d6d') + '<b id="hwp-n">0</b></div>' +
      '<button type="button" class="hwp-b" id="hwp-mute" data-hw="mute"></button></div>' +
      '<div class="hwp-body" id="hwp-body"><div class="hwp-load">' + A.svg('pumpkin', '', 'hw-spin') + '</div></div>';
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    ov = { el: el, id: id, n: n, key: id + '/' + n, run: null, ctx: null };
    updateBar();
    var mine = ov;
    ensureGames().then(function () { if (ov === mine) showIntro(); }).catch(function () {
      if (ov !== mine) return;
      bodyEl().innerHTML = '<div class="hwp-intro"><p>' + esc(t('loadErr')) + '</p>' + btn(t('exit'), 'data-hw="exit"') + '</div>';
    });
    var b = el.querySelector('[data-hw=exit]'); if (b) b.focus();
  }

  function teardownCtx() { if (ov && ov.ctx) { ov.ctx.destroy(); ov.ctx = null; } }
  function closeOverlay() {
    if (!ov) return;
    var o = ov;
    if (o.run && !o.run.closed) { try { store.settle(o.run, { win: false, stars: 0 }); } catch (e) { /* ok */ } }
    teardownCtx(); stopSpeak();
    o.el.remove();
    document.body.style.overflow = '';
    ov = null;
  }

  function showIntro() {
    if (!ov) return;
    teardownCtx(); stopSpeak();
    ov.run = null; updateHud(); updateHearts(); updateBar();
    var how = t('g.' + gk(ov.id) + '.h');
    bodyEl().innerHTML = '<div class="hwp-intro"><div class="hwp-intro-art">' + CARD[gk(ov.id)].art() + '</div><h2>' + esc(t('g.' + gk(ov.id) + '.n')) + '</h2>' +
      '<p class="hwp-lvl hw-st-' + stageOf(ov.id, ov.n) + '">' + esc(t('level')) + ' ' + ov.n + ' · ' + esc(t('st_' + stageOf(ov.id, ov.n))) + '</p>' +
      '<p class="hwp-how">' + esc(how) + '</p><div class="hwp-intro-btns">' +
      (window.speechSynthesis ? '<button type="button" class="hw-btn hw-ghost" data-hw="listen">' + ICON_VOL + esc(t('listen')) + '</button>' : '') +
      '<button type="button" class="hw-btn hw-primary hw-big" data-hw="start">' + ICON_PLAY + esc(t('start')) + '</button></div></div>';
    var s = bodyEl().querySelector('[data-hw=start]'); if (s) s.focus();
  }

  function makeCtx(run, root) {
    var timers = [], intervals = [], rafs = [], listeners = [];
    var ctx = {
      level: run.level, lang: H.lang(), root: root, over: false, maxLives: run.maxLives,
      art: A, store: store,
      t: function (a) { return a[ctx.lang] || a[0]; },
      lives: function () { return run.lives; },
      mistakes: function () { return run.mistakes; },
      after: function (fn, ms) { var id = setTimeout(function () { if (!ctx.over) fn(); }, ms); timers.push(id); return id; },
      every: function (fn, ms) { var id = setInterval(function () { if (!ctx.over) fn(); }, ms); intervals.push(id); return id; },
      raf: function (fn) {
        var on = true, id = 0, last = 0;
        (function loop(ts) { if (!on || ctx.over) return; var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts; fn(dt, ts); id = requestAnimationFrame(loop); rafs.push(id); })(0);
        return function () { on = false; };
      },
      listen: function (target, type, fn, opts) { target.addEventListener(type, fn, opts); listeners.push([target, type, fn, opts]); },
      sfx: sfx,
      good: function (n, anchor) {
        if (ctx.over || run.closed) return;
        run.correct += (n || 1); sfx('candy'); updateHud(true);
        if (anchor && anchor.getBoundingClientRect) {
          var r = anchor.getBoundingClientRect(), p = document.createElement('span');
          p.className = 'hw-plus'; p.textContent = '+' + (C.rewards.perCorrect[run.level - 1] * (n || 1));
          p.style.left = (r.left + r.width / 2) + 'px'; p.style.top = (r.top + r.height / 3) + 'px';
          ov.el.appendChild(p); setTimeout(function () { p.remove(); }, 900);
        }
      },
      /* Devuelve las vidas que quedan (Infinity si no hay límite). */
      bad: function () {
        if (ctx.over) return run.lives || Infinity;
        run.mistakes++; sfx('bad');
        if (run.lives > 0) {
          run.lives--; updateHearts();
          if (run.lives <= 0) { ctx.finish({ win: false }); return 0; }
          return run.lives;
        }
        return Infinity;
      },
      finish: function (res) {
        if (ctx.over) return;
        ctx.over = true;
        timers.forEach(clearTimeout); intervals.forEach(clearInterval); rafs.forEach(cancelAnimationFrame);
        res = res || {};
        var win = !!res.win;
        var st = 0;
        if (win) st = res.stars ? Math.max(1, Math.min(3, res.stars)) : (run.mistakes === 0 ? 3 : run.mistakes <= 2 ? 2 : 1);
        var out = store.settle(run, { win: win, stars: st });
        sfx(win ? 'win' : 'lose');
        var mine = ov;
        setTimeout(function () { if (ov === mine && ov.run === run) showResult(out, win, st); }, win ? 650 : 500);
      },
      destroy: function () {
        ctx.over = true;
        timers.forEach(clearTimeout); intervals.forEach(clearInterval); rafs.forEach(cancelAnimationFrame);
        listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); });
        timers = []; intervals = []; rafs = []; listeners = [];
      }
    };
    return ctx;
  }

  function startRun() {
    if (!ov) return;
    teardownCtx(); stopSpeak();
    var en = E(ov.id), G = H.games[en.game], lv = G.noLives ? 0 : en.lives[ov.n - 1];
    ov.run = { game: ov.id, n: ov.n, level: en.offset + ov.n, correct: 0, mistakes: 0, closed: false, lives: lv, maxLives: lv };
    bodyEl().innerHTML = '<div class="hwg" id="hwg"></div>';
    ov.ctx = makeCtx(ov.run, bodyEl().querySelector('#hwg'));
    updateHud(); updateHearts(); updateBar();
    try { G.start(ov.ctx); }
    catch (e) { if (window.console) console.error('[Halloween]', e); bodyEl().innerHTML = '<div class="hwp-intro"><p>' + esc(t('loadErr')) + '</p>' + btn(t('exit'), 'data-hw="exit"') + '</div>'; }
  }

  function showResult(out, win, st) {
    if (!ov) return;
    teardownCtx();
    var d = store.data(), n = ov.n, NLc = E(ov.id).count, next = win && n < NLc;
    var msg = win ? (n >= NLc && out && out.firstWin ? t('allDone') : t('win')) : t('lose');
    bodyEl().innerHTML = '<div class="hwp-res' + (win ? ' is-win' : '') + '">' +
      '<div class="hwp-res-art">' + A.svg(win ? 'pumpkin' : 'ghost') + '</div>' +
      '<h2>' + esc(msg) + '</h2>' +
      (win ? '<div class="hwp-stars" aria-label="' + st + '/3">' + stars(st) + '</div>' : '') +
      '<div class="hwp-gain">' + A.svg('candy', '#ff4d6d') + '<b>' + esc(t('earned', out ? out.earned : 0)) + '</b></div>' +
      '<p class="hwp-bal">' + esc(t('candies')) + ': <b>' + d.candies + '</b></p>' +
      (win && out && out.firstWin && n < NLc ? '<p class="hw-ok">' + esc(t('newLevel', n + 1)) + '</p>' : '') +
      '<div class="hwp-res-btns">' + (next ? btn(t('next'), 'data-hw="next"', 'hw-primary hw-big') : '') +
      btn(t('retry'), 'data-hw="retry"', next ? 'hw-ghost' : 'hw-primary hw-big') + btn(t('exit'), 'data-hw="exit"', 'hw-ghost') + '</div></div>';
    var f = bodyEl().querySelector('.hw-btn'); if (f) f.focus();
  }

  function leave() {
    if (window.stack && window.stack.length > 1) history.back();
    else location.hash = '#/halloween';
  }

  /* ═════════ Enrutado (lo llama Junior en cada cambio de ruta) ═════════ */
  /* Devuelve true si estamos en la ruta de Halloween (Junior entonces no
     pone su música de menú). Fuera de Halloween limpia todo y devuelve false. */
  function sync() {
    var p = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    if (p[0] !== 'halloween') {
      closeSheet(); closeOverlay(); music.sync(null);
      return false;
    }
    try { if (window.PJMusic) window.PJMusic.setSonido(false); } catch (e) { /* ok */ }
    var mode = 'page';
    if (p[1] === 'g') {
      var id = p[2], n = parseInt(p[3], 10);
      var valid = H.find(C.games, id) && n >= 1 && n <= H.count(id) && store.gameUnlocked(id) && store.levelOpen(id, n);
      if (valid) {
        mode = 'game';
        if (!ov || ov.key !== id + '/' + n) { closeSheet(); openOverlay(id, n); }
      } else {
        try { history.replaceState(null, '', '#/halloween'); } catch (e) { /* ok */ }
        closeOverlay();
      }
    } else { closeOverlay(); }
    music.sync(mode);
    return true;
  }

  /* ═════════ Eventos (delegados, solo atributos data-hw) ═════════ */
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('.hw-banner,.hw-inf');
    if (link) sfx('tap');
    var b = e.target.closest && e.target.closest('[data-hw]');
    if (b) {
      var a = b.getAttribute('data-hw'), id = b.getAttribute('data-id');
      if (a !== 'start' && a !== 'listen') sfx('tap');
      if (a === 'tab') { tab = b.getAttribute('data-v'); refresh(); }
      else if (a === 'game') { store.gameUnlocked(id) ? levelSheet(id) : buyConfirm('game', id); }
      else if (a === 'basket') {
        if (store.data().baskets.indexOf(id) > -1) { store.equip(id); refresh(); } else buyConfirm('basket', id);
      }
      else if (a === 'ghost') { if (store.data().ghosts.indexOf(id) < 0) buyConfirm('ghost', id); }
      else if (a === 'lvl') {
        var n = parseInt(b.getAttribute('data-n'), 10);
        if (store.levelOpen(id, n)) { closeSheet(); location.hash = '#/halloween/g/' + id + '/' + n; }
      }
      else if (a === 'buy') { doBuy(b.getAttribute('data-kind'), id); }
      else if (a === 'sheet-close') { closeSheet(); }
      else if (a === 'exit') { if (ov && ov.run && !ov.run.closed) { try { store.settle(ov.run, { win: false, stars: 0 }); } catch (er) { /* ok */ } } leave(); }
      else if (a === 'mute') { H.state.userMuted = !H.state.userMuted; music.refresh(); updateBar(); }
      else if (a === 'listen') { speak(t('g.' + gk(ov.id) + '.h')); }
      else if (a === 'start' || a === 'retry') { stopSpeak(); H.state.started = true; startRun(); }
      else if (a === 'next') { if (ov && ov.n < E(ov.id).count) { ov.n++; ov.key = ov.id + '/' + ov.n; try { history.replaceState(null, '', '#/halloween/g/' + ov.id + '/' + ov.n); } catch (er) { /* ok */ } startRun(); } }
      return;
    }
    if (sheetEl && e.target === sheetEl) closeSheet();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (sheetEl) { closeSheet(); e.stopPropagation(); }
    else if (ov) { var b = ov.el.querySelector('[data-hw=exit]'); if (b) b.click(); e.stopPropagation(); }
  }, true);

  /* El silencio general de Junior (botón del menú) también afecta a la música. */
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-a=snd]')) setTimeout(function () { music.refresh(); updateBar(); }, 60);
  });

  window.PJHalloween = { banner: banner, infantil: infantil, page: page, sync: sync };
})();
