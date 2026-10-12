/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · NÚCLEO
   · Activación (enabled + fechas)
   · Guardado local con clave propia (validado, sin duplicar premios)
   · Textos es / ca / en
   · Efectos de sonido y música aleatoria de la carpeta halloween/musica/
   Expone window.PJHW. Si el evento está desactivado no expone nada.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.PJHW_CONFIG;
  if (!C || !C.enabled) return;

  /* ── Ventana de fechas ─────────────────────────────────────────── */
  var preview = /[?&]halloween=preview\b/.test(location.search);
  if (!preview) {
    var now = Date.now();
    if (C.activeFrom && now < new Date(C.activeFrom + 'T00:00:00').getTime()) return;
    if (C.activeUntil && now > new Date(C.activeUntil + 'T23:59:59').getTime()) return;
  }

  var ART = window.PJHW_ART;
  var GAME_IDS = C.games.map(function (g) { return g.id; });
  var BASKET_IDS = C.baskets.map(function (b) { return b.id; });
  var GHOST_IDS = C.ghosts.map(function (g) { return g.id; });
  var NL = C.levels.count;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  /* ── Idioma (usa el que ya tiene Junior: es / ca / en) ─────────── */
  function lang() {
    var l = (typeof window.li === 'number') ? window.li : ({ es: 0, ca: 1, en: 2 }[document.documentElement.lang] || 0);
    return l >= 0 && l <= 2 ? l : 0;
  }

  var TX = {
    bTitle: ['¡Halloween en Placeta Junior!', 'Halloween a Placeta Junior!', 'Halloween at Placeta Junior!'],
    bText: ['10 minijuegos con niveles para todas las edades. ¡Juega, gana caramelos y descubre fantasmas!', '10 minijocs amb nivells per a totes les edats. Juga, guanya caramels i descobreix fantasmes!', '10 mini-games with levels for all ages. Play, win candies and discover ghosts!'],
    bBtn: ['¡A jugar!', 'A jugar!', "Let's play!"],
    infTitle: ['¡Halloween!', 'Halloween!', 'Halloween!'],
    infText: ['Toca aquí y juega con calabazas y fantasmas', 'Toca ací i juga amb carabasses i fantasmes', 'Tap here and play with pumpkins and ghosts'],
    title: ['Halloween', 'Halloween', 'Halloween'],
    sub: ['Minijuegos con niveles para todas las edades. Gana caramelos y desbloquea más cosas.', 'Minijocs amb nivells per a totes les edats. Guanya caramels i desbloqueja més coses.', 'Mini-games with levels for all ages. Win candies and unlock more things.'],
    back: ['Volver', 'Tornar', 'Back'],
    candies: ['Caramelos', 'Caramels', 'Candies'],
    how1: ['Juega', 'Juga', 'Play'], how2: ['Gana caramelos', 'Guanya caramels', 'Win candies'], how3: ['Desbloquea', 'Desbloqueja', 'Unlock'],
    tGames: ['Juegos', 'Jocs', 'Games'], tBaskets: ['Cestas', 'Cistelles', 'Baskets'], tGhosts: ['Fantasmas', 'Fantasmes', 'Ghosts'],
    free: ['Gratis', 'Gratis', 'Free'],
    level: ['Nivel', 'Nivell', 'Level'],
    levels: ['niveles', 'nivells', 'levels'],
    st_inf: ['Infantil · 3-5 años', 'Infantil · 3-5 anys', 'Early years · 3-5'],
    st_pri1: ['Primaria · 6-8 años', 'Primària · 6-8 anys', 'Primary · 6-8'],
    st_pri2: ['Primaria · 9-12 años', 'Primària · 9-12 anys', 'Primary · 9-12'],
    stS_inf: ['Infantil', 'Infantil', 'Early years'],
    stS_pri1: ['Primaria', 'Primària', 'Primary'],
    stS_pri2: ['Primaria +', 'Primària +', 'Primary +'],
    locked: ['Bloqueado', 'Bloquejat', 'Locked'],
    unlock: ['Desbloquear', 'Desbloquejar', 'Unlock'],
    unlockQ: ['¿Desbloquear «{0}» por {1} caramelos?', 'Desbloquejar «{0}» per {1} caramels?', 'Unlock "{0}" for {1} candies?'],
    needMore: ['Te faltan {0} caramelos. ¡Sigue jugando para ganar más!', 'Et falten {0} caramels. Continua jugant per guanyar-ne més!', 'You need {0} more candies. Keep playing to win more!'],
    cancel: ['Cancelar', 'Cancel·lar', 'Cancel'],
    ok: ['Vale', 'Val', 'OK'],
    play: ['Jugar', 'Jugar', 'Play'],
    pickLevel: ['Elige un nivel', 'Tria un nivell', 'Pick a level'],
    levelLocked: ['Supera el nivel anterior para abrir este', 'Supera el nivell anterior per obrir aquest', 'Beat the previous level to open this one'],
    done: ['{0} de {1} niveles', '{0} de {1} nivells', '{0} of {1} levels'],
    inUse: ['En uso', 'En ús', 'In use'],
    use: ['Usar', 'Usar', 'Use'],
    owned: ['Tuya', 'Teva', 'Yours'],
    found: ['¡Descubierto!', 'Descobert!', 'Discovered!'],
    discoverQ: ['¿Descubrir este fantasma por {0} caramelos?', 'Descobrir aquest fantasma per {0} caramels?', 'Discover this ghost for {0} candies?'],
    discover: ['Descubrir', 'Descobrir', 'Discover'],
    ghostsCount: ['{0} de {1} fantasmas descubiertos', '{0} de {1} fantasmes descoberts', '{0} of {1} ghosts discovered'],
    mystery: ['Fantasma misterioso', 'Fantasma misteriós', 'Mystery ghost'],
    note: ['Tu progreso se guarda solo en este navegador. Si borras los datos del navegador, lo perderás.', 'El teu progrés es guarda només en aquest navegador. Si esborres les dades del navegador, el perdràs.', 'Your progress is saved only in this browser. If you clear the browser data, it will be lost.'],
    noStore: ['Este navegador no permite guardar el progreso: se perderá al cerrar.', 'Aquest navegador no permet guardar el progrés: es perdrà en tancar.', "This browser can't save your progress: it will be lost when you close it."],
    ready: ['¿Listo?', 'A punt?', 'Ready?'],
    start: ['¡Empezar!', 'Començar!', 'Start!'],
    listen: ['Escuchar', 'Escoltar', 'Listen'],
    retry: ['Repetir', 'Repetir', 'Retry'],
    next: ['Siguiente nivel', 'Següent nivell', 'Next level'],
    exit: ['Salir', 'Sortir', 'Exit'],
    win: ['¡Lo has conseguido!', "Ho has aconseguit!", 'You did it!'],
    lose: ['¡Casi! Inténtalo otra vez', 'Quasi! Torna-ho a provar', 'So close! Try again'],
    earned: ['+{0} caramelos', '+{0} caramels', '+{0} candies'],
    newLevel: ['¡Nivel {0} desbloqueado!', 'Nivell {0} desbloquejat!', 'Level {0} unlocked!'],
    allDone: ['¡Has superado todos los niveles!', 'Has superat tots els nivells!', 'You beat every level!'],
    musicOn: ['Música', 'Música', 'Music'],
    musicOff: ['Música desactivada', 'Música desactivada', 'Music off'],
    loadErr: ['No se ha podido cargar el juego. Revisa tu conexión e inténtalo de nuevo.', "No s'ha pogut carregar el joc. Revisa la connexió i torna-ho a provar.", "The game couldn't load. Check your connection and try again."],
    lives: ['Vidas', 'Vides', 'Lives'],

    /* Nombres, descripción corta y cómo se juega */
    'g.truco.n': ['Truco o trato matemático', 'Truc o trato matemàtic', 'Maths trick or treat'],
    'g.truco.d': ['Toca la puerta con la respuesta correcta.', 'Toca la porta amb la resposta correcta.', 'Knock on the door with the right answer.'],
    'g.truco.h': ['Resuelve la operación y toca la puerta con la respuesta correcta para ganar caramelos. ¡Cuidado con los trucos!', "Resol l'operació i toca la porta amb la resposta correcta per guanyar caramels. Compte amb els trucs!", 'Solve the sum and tap the door with the right answer to win candies. Watch out for tricks!'],
    'g.atrapa.n': ['Atrapa los caramelos', 'Atrapa els caramels', 'Catch the candies'],
    'g.atrapa.d': ['Mueve la cesta y recoge lo correcto.', 'Mou la cistella i recull el correcte.', 'Move the basket and catch the right things.'],
    'g.atrapa.h': ['Arrastra la cesta con el dedo (o usa las flechas) para atrapar los caramelos correctos y esquivar lo demás.', 'Arrossega la cistella amb el dit (o usa les fletxes) per atrapar els caramels correctes i esquivar la resta.', 'Drag the basket with your finger (or use the arrow keys) to catch the right candies and dodge the rest.'],
    'g.memoria.n': ['Memoria monstruosa', 'Memòria monstruosa', 'Monster memory'],
    'g.memoria.d': ['Encuentra todas las parejas.', 'Troba totes les parelles.', 'Find all the pairs.'],
    'g.memoria.h': ['Da la vuelta a las cartas de dos en dos y encuentra las parejas iguales.', 'Gira les cartes de dues en dues i troba les parelles iguals.', 'Flip the cards two at a time and find the matching pairs.'],
    'g.fabrica.n': ['La fábrica de caramelos', 'La fàbrica de caramels', 'The candy factory'],
    'g.fabrica.d': ['Clasifica, completa patrones y prepara pedidos.', 'Classifica, completa patrons i prepara comandes.', 'Sort, complete patterns and prepare orders.'],
    'g.fabrica.h': ['Ayuda en la fábrica: clasifica los dulces, completa los patrones y prepara los pedidos.', 'Ajuda a la fàbrica: classifica els dolços, completa els patrons i prepara les comandes.', 'Help in the factory: sort the sweets, complete the patterns and prepare the orders.'],
    'g.fantasma.n': ['El fantasma escondido', 'El fantasma amagat', 'The hidden ghost'],
    'g.fantasma.d': ['Sigue las pistas y encuentra al fantasma.', 'Segueix les pistes i troba el fantasma.', 'Follow the clues and find the ghost.'],
    'g.fantasma.h': ['Mira las pistas y toca el sitio donde se esconde el fantasma.', "Mira les pistes i toca el lloc on s'amaga el fantasma.", 'Read the clues and tap the place where the ghost is hiding.'],
    'g.parejas.n': ['Parejas encantadas', 'Parelles encantades', 'Enchanted pairs'],
    'g.parejas.d': ['Une dibujos, números, palabras y operaciones.', 'Uneix dibuixos, números, paraules i operacions.', 'Match pictures, numbers, words and sums.'],
    'g.parejas.h': ['Toca una carta de la izquierda y después la que le corresponde en la derecha.', 'Toca una carta de l\'esquerra i després la que li correspon a la dreta.', 'Tap a card on the left and then the one that matches it on the right.'],
    'g.calabaza.n': ['La calabaza correcta', 'La carabassa correcta', 'The right pumpkin'],
    'g.calabaza.d': ['Pequeños retos: elige la calabaza acertada.', 'Petits reptes: tria la carabassa encertada.', 'Little challenges: pick the right pumpkin.'],
    'g.calabaza.h': ['Mira el reto y toca la calabaza con la respuesta correcta.', 'Mira el repte i toca la carabassa amb la resposta correcta.', 'Look at the challenge and tap the pumpkin with the right answer.'],
    'g.escobas.n': ['Carrera de escobas', 'Cursa d\'escombres', 'Broom race'],
    'g.escobas.d': ['Supera pruebas para avanzar más rápido.', 'Supera proves per avançar més ràpid.', 'Beat the challenges to fly faster.'],
    'g.escobas.h': ['Acierta cada prueba para que tu escoba avance. ¡Llega primero a la meta!', 'Encerta cada prova perquè el teu escombre avance. Arriba primer a la meta!', 'Get each challenge right to make your broom fly. Reach the finish first!'],
    'g.pociones.n': ['El laboratorio de pociones', 'El laboratori de pocions', 'The potion lab'],
    'g.pociones.d': ['Sigue la receta y calcula las cantidades.', 'Segueix la recepta i calcula les quantitats.', 'Follow the recipe and work out the amounts.'],
    'g.pociones.h': ['Mira la receta y echa en el caldero los ingredientes necesarios. Después pulsa «Mezclar».', 'Mira la recepta i tira al calderó els ingredients necessaris. Després prem «Barrejar».', 'Read the recipe and put the right ingredients in the cauldron. Then press "Mix".'],
    'g.laberinto.n': ['El laberinto embrujado', 'El laberint embruixat', 'The haunted maze'],
    'g.laberinto.d': ['Encuentra la salida y supera los retos.', 'Troba la sortida i supera els reptes.', 'Find the exit and beat the challenges.'],
    'g.laberinto.h': ['Mueve al fantasma por el laberinto hasta la salida. Si hay un candado, resuelve el reto para pasar.', 'Mou el fantasma pel laberint fins a la sortida. Si hi ha un cadenat, resol el repte per passar.', 'Move the ghost through the maze to the exit. If there is a padlock, solve the challenge to pass.'],

    /* Cestas y fantasmas */
    'b.clasica': ['Cesta clásica', 'Cistella clàssica', 'Classic basket'],
    'b.bruja': ['Cesta de bruja', 'Cistella de bruixa', 'Witch basket'],
    'b.gato': ['Cesta gatuna', 'Cistella gatuna', 'Cat basket'],
    'b.murcielago': ['Cesta murciélago', 'Cistella ratpenat', 'Bat basket'],
    'b.dorada': ['Cesta dorada', 'Cistella daurada', 'Golden basket'],
    'gh.boo': ['Boo', 'Boo', 'Boo'],
    'gh.rosita': ['Rosita', 'Rosita', 'Rosie'],
    'gh.azulin': ['Azulín', 'Blavet', 'Bluey'],
    'gh.verdoso': ['Verdoso', 'Verdós', 'Greenie'],
    'gh.brujo': ['Fantasma brujo', 'Fantasma bruixot', 'Wizard ghost'],
    'gh.rey': ['Rey Fantasma', 'Rei Fantasma', 'Ghost King'],
    'gh.pirata': ['Fantasma pirata', 'Fantasma pirata', 'Pirate ghost'],
    'gh.dormilon': ['Dormilón', 'Dormilón', 'Sleepyhead']
  };

  function t(k) {
    var v = TX[k];
    var s = v ? (v[lang()] || v[0]) : k;
    for (var i = 1; i < arguments.length; i++) s = s.replace('{' + (i - 1) + '}', arguments[i]);
    return s;
  }

  /* ═════════ Guardado local (clave propia, validado) ═════════ */
  var storageOk = true;
  function defaults() {
    return { v: 1, candies: 0, games: {}, levels: {}, baskets: ['clasica'], basket: 'clasica', ghosts: [] };
  }
  function clampInt(n, lo, hi) { n = Math.floor(Number(n)); if (!isFinite(n)) return lo; return Math.max(lo, Math.min(hi, n)); }
  function sanitize(r) {
    var d = defaults();
    if (!r || typeof r !== 'object') return d;
    d.candies = clampInt(r.candies, 0, 999999);
    if (r.games && typeof r.games === 'object') GAME_IDS.forEach(function (id) { if (r.games[id] === true) d.games[id] = true; });
    if (r.levels && typeof r.levels === 'object') {
      GAME_IDS.forEach(function (id) {
        var lv = r.levels[id];
        if (!lv || typeof lv !== 'object') return;
        var o = {};
        for (var n = 1; n <= NL; n++) { var s = clampInt(lv[n], 0, 3); if (s > 0) o[n] = s; }
        if (Object.keys(o).length) d.levels[id] = o;
      });
    }
    if (Array.isArray(r.baskets)) r.baskets.forEach(function (b) { if (BASKET_IDS.indexOf(b) > -1 && d.baskets.indexOf(b) < 0) d.baskets.push(b); });
    if (d.baskets.indexOf(r.basket) > -1) d.basket = r.basket;
    if (Array.isArray(r.ghosts)) r.ghosts.forEach(function (g) { if (GHOST_IDS.indexOf(g) > -1 && d.ghosts.indexOf(g) < 0) d.ghosts.push(g); });
    return d;
  }
  function load() {
    try {
      var raw = localStorage.getItem(C.storageKey);
      storageOk = true;
      return sanitize(raw ? JSON.parse(raw) : null);
    } catch (e) { storageOk = false; return sanitize(null); }
  }
  var data = load();
  function save() { try { localStorage.setItem(C.storageKey, JSON.stringify(data)); } catch (e) { storageOk = false; } }
  /* Cada cambio relee el disco primero (por si hay otra pestaña abierta). */
  function mutate(fn) {
    var disk = load();
    if (storageOk) data = disk;
    var r = fn(data);
    save();
    return r;
  }
  function find(list, id) { for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }

  var store = {
    data: function () { return data; },
    ok: function () { return storageOk; },
    candies: function () { return data.candies; },
    price: function (kind, id) { var it = find(kind === 'game' ? C.games : kind === 'basket' ? C.baskets : C.ghosts, id); return it ? it.price : 0; },
    gameUnlocked: function (id) { return store.price('game', id) === 0 || !!data.games[id]; },
    stars: function (id, n) { return (data.levels[id] && data.levels[id][n]) || 0; },
    levelOpen: function (id, n) { return n === 1 || store.stars(id, n - 1) > 0; },
    levelsDone: function (id) { var c = 0; for (var n = 1; n <= NL; n++) if (store.stars(id, n) > 0) c++; return c; },
    /* Compra atómica: comprueba saldo y que no esté ya adquirido. */
    buy: function (kind, id) {
      return mutate(function (d) {
        var owned = kind === 'game' ? (store.price('game', id) === 0 || d.games[id]) : kind === 'basket' ? d.baskets.indexOf(id) > -1 : d.ghosts.indexOf(id) > -1;
        if (owned) return 'owned';
        var p = store.price(kind, id);
        if (!find(kind === 'game' ? C.games : kind === 'basket' ? C.baskets : C.ghosts, id)) return 'invalid';
        if (d.candies < p) return 'poor';
        d.candies -= p;
        if (kind === 'game') d.games[id] = true; else if (kind === 'basket') d.baskets.push(id); else d.ghosts.push(id);
        return 'ok';
      });
    },
    equip: function (id) { mutate(function (d) { if (d.baskets.indexOf(id) > -1) d.basket = id; }); },
    /* Cierra una partida UNA sola vez: reparte caramelos y guarda estrellas. */
    settle: function (run, res) {
      if (!run || run.closed) return null;
      run.closed = true;
      var R = C.rewards, L = run.level - 1;
      return mutate(function (d) {
        var prev = (d.levels[run.game] && d.levels[run.game][run.level]) || 0;
        var f = prev > 0 ? R.replayFactor : 1;
        var n = run.correct * R.perCorrect[L];
        var stars = res.win ? clampInt(res.stars, 1, 3) : 0;
        if (res.win) n += R.completion[L] + (R.stars[stars] || 0);
        n = Math.floor(n * f);
        if (n === 0 && (run.correct > 0 || res.win)) n = 1;
        n = Math.min(n, R.maxPerRun);
        d.candies = clampInt(d.candies + n, 0, 999999);
        var firstWin = res.win && prev === 0;
        if (stars > prev) { d.levels[run.game] = d.levels[run.game] || {}; d.levels[run.game][run.level] = stars; }
        return { earned: n, stars: stars, firstWin: firstWin, best: Math.max(prev, stars) };
      });
    },
    /* Caramelos que se muestran durante la partida (misma fórmula). */
    live: function (run) {
      var prev = store.stars(run.game, run.level);
      var n = Math.floor(run.correct * C.rewards.perCorrect[run.level - 1] * (prev > 0 ? C.rewards.replayFactor : 1));
      return (n === 0 && run.correct > 0) ? 1 : n;
    }
  };

  /* ═════════ Sonido (respeta el silencio global de Junior) ═════════ */
  var state = { userMuted: false };
  function globalOn() { try { return !(window.S && window.S.s === 0); } catch (e) { return true; } }
  function soundOn() { return globalOn() && !state.userMuted; }

  var ac = null;
  function actx() {
    try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { ac = null; }
    return ac;
  }
  function tone(f, d, type, v, f2, at) {
    var c = actx(); if (!c) return;
    try {
      var t0 = c.currentTime + (at || 0), o = c.createOscillator(), g = c.createGain();
      o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + d);
      g.gain.setValueAtTime(v || .12, t0); g.gain.exponentialRampToValueAtTime(.001, t0 + d);
      o.connect(g); g.connect(c.destination); o.start(t0); o.stop(t0 + d + .02);
    } catch (e) { /* sin audio */ }
  }
  var SFX = {
    tap: function () { tone(520, .07, 'sine', .12, 330); },
    good: function () { [660, 880, 1100].forEach(function (f, i) { tone(f, .14, 'triangle', .11, 0, i * .07); }); },
    candy: function () { tone(880, .08, 'triangle', .1, 1320); },
    bad: function () { tone(220, .3, 'sawtooth', .08, 110); },
    flip: function () { tone(400, .06, 'square', .05, 600); },
    win: function () { [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, .26, 'triangle', .13, 0, i * .1); }); },
    lose: function () { [392, 330, 262].forEach(function (f, i) { tone(f, .3, 'sawtooth', .07, 0, i * .15); }); },
    boo: function () { tone(180, .5, 'sine', .12, 90); tone(240, .5, 'triangle', .06, 120, .05); }
  };
  function sfx(name) { if (!soundOn()) return; try { (SFX[name] || SFX.tap)(); } catch (e) { /* ok */ } }

  /* ═════════ Música aleatoria de la carpeta ═════════ */
  var M = C.music, music = (function () {
    var list = null, loading = null, audio = null, last = null, mode = null, want = false, retryHook = false;

    function extOk(n) { var m = /\.([a-z0-9]+)(?:[?#].*)?$/i.exec(n); return !!m && M.exts.indexOf(m[1].toLowerCase()) > -1; }
    function urlFor(n) { return /^(https?:)?\/\//.test(n) || n.charAt(0) === '/' ? n : M.folder + n.split('/').map(encodeURIComponent).join('/'); }

    function loadList() {
      if (list) return Promise.resolve(list);
      if (loading) return loading;
      loading = fetch(M.folder + M.manifest, { cache: 'no-store' })
        .then(function (r) { if (!r.ok) throw 0; return r.json(); })
        .then(function (j) { var a = Array.isArray(j) ? j : (j && j.files) || []; return a.filter(function (n) { return typeof n === 'string' && extOk(n); }); })
        .catch(function () { return []; })
        .then(function (a) {
          if (a.length) return a;
          /* Alternativa: índice de directorio del servidor (útil en local). */
          return fetch(M.folder, { cache: 'no-store' }).then(function (r) { return r.ok ? r.text() : ''; }).then(function (h) {
            var out = [], re = /href="([^"?#]+)"/g, m;
            while ((m = re.exec(h))) { var n = decodeURIComponent(m[1]).replace(/^.*\//, ''); if (extOk(n) && out.indexOf(n) < 0) out.push(n); }
            return out;
          }).catch(function () { return []; });
        })
        .then(function (a) { list = a; return a; });
      return loading;
    }

    function fadeOut(a) {
      if (!a) return;
      var step = 40, vol = a.volume, dec = vol / Math.max(1, M.fadeMs / step);
      var i = setInterval(function () {
        vol -= dec;
        if (vol <= 0.01) { clearInterval(i); try { a.pause(); a.removeAttribute('src'); a.load(); } catch (e) { /* ok */ } } else { try { a.volume = Math.max(0, vol); } catch (e) { clearInterval(i); } }
      }, step);
    }
    function fadeIn(a) {
      var step = 40, vol = 0, inc = M.volume / Math.max(1, M.fadeMs / step);
      var i = setInterval(function () {
        if (a !== audio) { clearInterval(i); return; }
        vol += inc;
        if (vol >= M.volume) { vol = M.volume; clearInterval(i); }
        try { a.volume = vol; } catch (e) { clearInterval(i); }
      }, step);
    }
    function armRetry() {
      if (retryHook) return; retryHook = true;
      var go = function () {
        document.removeEventListener('pointerdown', go, true); document.removeEventListener('keydown', go, true); retryHook = false;
        if (want && soundOn() && audio) { audio.play().then(function () { fadeIn(audio); }).catch(function () { armRetry(); }); }
      };
      document.addEventListener('pointerdown', go, true); document.addEventListener('keydown', go, true);
    }

    function playRandom() {
      return loadList().then(function (a) {
        if (!want || !a.length) return;
        var pool = a.length > 1 ? a.filter(function (n) { return n !== last; }) : a;
        var pick = pool[Math.floor(Math.random() * pool.length)];
        last = pick;
        var old = audio;
        var n = new Audio(urlFor(pick));
        n.preload = 'auto'; n.volume = 0; n.loop = false;
        audio = n;
        n.addEventListener('ended', function () { if (audio === n && want) playRandom(); });
        n.addEventListener('error', function () {
          if (audio !== n) return;
          list = list.filter(function (x) { return x !== pick; });
          if (want && list.length) playRandom();
        });
        fadeOut(old);
        if (!soundOn()) return;
        n.play().then(function () { fadeIn(n); }).catch(function () { armRetry(); });
      });
    }

    return {
      /* mode: 'page' | 'game' | null. Cambia de pista al cambiar de modo. */
      sync: function (m) {
        if (m === null) { mode = null; want = false; var o = audio; audio = null; fadeOut(o); return; }
        want = true;
        if (m !== mode) { mode = m; playRandom(); }
        else if (audio) {
          if (soundOn()) { if (audio.paused) audio.play().then(function () { fadeIn(audio); }).catch(function () { armRetry(); }); }
          else if (!audio.paused) audio.pause();
        }
      },
      refresh: function () { // cambió el silencio (global o del propio juego)
        if (!want) return;
        if (!soundOn()) { if (audio && !audio.paused) audio.pause(); }
        else if (audio) { if (audio.paused) audio.play().then(function () { fadeIn(audio); }).catch(function () { armRetry(); }); }
        else playRandom();
      },
      pause: function () { try { if (audio) audio.pause(); } catch (e) { /* ok */ } },
      resume: function () { if (want && soundOn() && audio && audio.paused) audio.play().catch(function () { armRetry(); }); },
      count: function () { return list ? list.length : 0; }
    };
  })();

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') music.pause(); else music.resume();
  });
  window.addEventListener('pagehide', function () { music.pause(); });

  /* ── Estilos propios (solo se carga si el evento está activo) ───── */
  (function () {
    if (document.getElementById('hw-css')) return;
    var l = document.createElement('link');
    l.id = 'hw-css'; l.rel = 'stylesheet'; l.href = C.folderCss || 'halloween/halloween.css';
    document.head.appendChild(l);
  })();

  window.PJHW = { C: C, t: t, lang: lang, esc: esc, art: ART, store: store, sfx: sfx, music: music, state: state, soundOn: soundOn, globalOn: globalOn, NL: NL, find: find };
})();
