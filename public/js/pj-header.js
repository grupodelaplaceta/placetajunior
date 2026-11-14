/* Placeta Junior · cabecera y pie compartidos.
   Es el mismo componente de Inicio (textos, iconos, banderas, menús y estados).
   Uso en cualquier página:  <header class="education-topbar" data-pj-header data-active="code"></header>
                             <footer class="pj-foot" data-pj-footer></footer>
   y cargar css/pj-header.css + js/pj-header.js. En Inicio lo usa PJHeader.header/footer. */
(function () {
  'use strict';
  var DATA = {"n1": ["Inicio", "Inici", "Home"], "n2": ["Actividades", "Activitats", "Activities"], "n3": ["Juegos", "Jocs", "Games"], "n4": ["Familias", "Famílies", "Families"], "n5": ["Información", "Informació", "Information"], "pjcodeNav": ["Code", "Code", "Code"], "ednav": ["Para educación", "Per a educació", "For education"], "code": ["Tengo un código", "Tinc un codi", "I have a code"], "uc": ["MAYÚSCULAS", "MAJÚSCULES", "UPPERCASE"], "lc": ["minúsculas", "minúscules", "lowercase"], "wl": ["Idioma", "Idioma", "Language"], "snd": ["Sonido", "So", "Sound"], "lgA": ["Aviso legal", "Avís legal", "Legal notice"], "lgP": ["Privacidad", "Privadesa", "Privacy"], "lgT": ["Términos", "Termes", "Terms"], "lgC": ["Cookies", "Cookies", "Cookies"]};
  var FLAGS = {es:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#C60B1E"/><rect y="5" width="30" height="10" fill="#FFC400"/></svg>',
ca:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#FCDD09"/><path fill="#DA121A" d="M0 2.2h30v2.2H0zM0 6.7h30v2.2H0zM0 11.1h30v2.2H0zM0 15.6h30v2.2H0z"/></svg>',
en:'<svg class="flag" viewBox="0 0 30 20" aria-hidden="true"><defs><clipPath id="u"><rect width="30" height="20" rx="3"/></clipPath></defs><g clip-path="url(#u)"><rect width="30" height="20" fill="#012169"/><path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4"/><path d="M0 0l30 20M30 0L0 20" stroke="#C8102E" stroke-width="1.6"/><path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6"/><path d="M15 0v20M0 10h30" stroke="#C8102E" stroke-width="3.6"/></g></svg>'};
  var LANG_NAMES = {es:'Castellano',ca:'Català',en:'English'};
  var ICONS = {"home": "<path d=\"M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z\"/>", "play": "<path d=\"M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5z\" fill=\"currentColor\"/>", "joy": "<rect x=\"3\" y=\"7\" width=\"18\" height=\"11\" rx=\"5.5\"/><path d=\"M8 10.5v4M6 12.5h4M16 11.5h.01M18 13.5h.01\"/>", "star": "<path d=\"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z\"/>", "users": "<circle cx=\"9\" cy=\"8\" r=\"3.2\"/><path d=\"M3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M16 5.2a3 3 0 0 1 0 5.6M18 14.5c2 .8 3 2.8 3 5.5\"/>", "key": "<circle cx=\"8\" cy=\"15\" r=\"4\"/><path d=\"M11 12l9-9M16 7l3 3M14 9l2 2\"/>", "vol": "<path d=\"M3 10v4h4l5 4V6L7 10z\" fill=\"currentColor\" fill-opacity=\".2\"/><path d=\"M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11\"/>", "mutei": "<path d=\"M3 10v4h4l5 4V6L7 10z\" fill=\"currentColor\" fill-opacity=\".2\"/><path d=\"M16 9.5l5 5M21 9.5l-5 5\"/>"};
  var LANGS = ['es', 'ca', 'en'];
  var LOGO = '/img/PJ-BLANCO-LOGO.png';

  function t(k, l) {
    var v = DATA[k]; if (!v) return k;
    var i = LANGS.indexOf(l); return v[i < 0 ? 0 : i];
  }
  function ic(n) {
    var rell = (n === 'vol' || n === 'mutei');
    return '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="' +
      (rell ? 'currentColor" fill-opacity=".16' : 'none') + '" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">' + ICONS[n] + '</svg>';
  }
  function estado() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem('pj2') || '{}') || {}; } catch (e) {}
    return { l: LANGS.indexOf(p.l) >= 0 ? p.l : 'es', c: p.c === 'lc' ? 'lc' : 'uc', s: p.s === 0 ? 0 : 1 };
  }
  function guardar(cambios) {
    var p = {};
    try { p = JSON.parse(localStorage.getItem('pj2') || '{}') || {}; } catch (e) {}
    Object.keys(cambios).forEach(function (k) { p[k] = cambios[k]; });
    try { localStorage.setItem('pj2', JSON.stringify(p)); } catch (e) {}
    var ac = {};
    try { ac = JSON.parse(localStorage.getItem('junior_acc_web') || '{}') || {}; } catch (e) {}
    ac.idioma = p.l || 'es'; ac.mayus = (p.c || 'uc') === 'uc'; ac.sonido = p.s !== 0;
    try { localStorage.setItem('junior_acc_web', JSON.stringify(ac)); } catch (e) {}
  }

  var NAV = [
    { k: 'inicio', icono: 'home', n: 'n1' },
    { k: 'actividades', icono: 'play', n: 'n2' },
    { k: 'juegos', icono: 'joy', n: 'n3' },
    { k: 'code', icono: 'star', n: 'pjcodeNav' },
    { k: 'edu', icono: 'users', n: 'ednav' }
  ];
  function enlace(k, host) {
    var dentro = host === 'inicio';
    switch (k) {
      case 'inicio': return dentro ? '#/' : '/';
      case 'actividades': return dentro ? '#/actividades' : '/#/actividades';
      case 'juegos': return dentro ? '#/juegos' : '/#/juegos';
      case 'code': return '/code';
      case 'edu': return '/edu';
    }
    return '/';
  }

  function cabecera(o) {
    var lang = o.lang, uc = !!o.uc, snd = !!o.snd, host = o.host || 'pagina';
    var links = NAV.map(function (x) {
      var cur = x.k === o.active ? ' aria-current="page"' : '';
      return '<a href="' + enlace(x.k, host) + '"' + cur + '>' + ic(x.icono) + '<span>' + t(x.n, lang) + '</span></a>';
    }).join('');
    var idiomas = LANGS.map(function (l) {
      return '<button data-a="lang" data-v="' + l + '" aria-pressed="' + (l === lang) + '">' + FLAGS[l] + LANG_NAMES[l] + '</button>';
    }).join('');
    return '<div class="wrap bar">' +
      '<a class="logo" href="' + (host === 'inicio' ? '#/' : '/') + '" aria-label="Placeta Junior"><img src="' + LOGO + '" alt="Placeta Junior" width="120" height="52" /></a>' +
      '<nav class="mn" aria-label="Menú principal">' + links + '</nav>' +
      '<div class="lang"><button class="rb" data-a="menu" aria-haspopup="true" aria-expanded="false" aria-label="' + t('wl', lang) + '">' + FLAGS[lang] + lang.toUpperCase() + '</button>' +
      '<div class="menu" id="lm">' + idiomas + '<hr>' +
      '<button data-a="case" data-v="uc" aria-pressed="' + uc + '">' + t('uc', lang) + '</button>' +
      '<button data-a="case" data-v="lc" aria-pressed="' + (!uc) + '">' + t('lc', lang) + '</button></div></div>' +
      '<button class="rb sndb" data-a="snd" aria-pressed="' + snd + '" aria-label="' + t('snd', lang) + '">' + ic(snd ? 'vol' : 'mutei') + '</button>' +
      '<button class="btn b-wh" data-a="code" aria-label="' + t('code', lang) + '">' + ic('key') + '<span>' + t('code', lang) + '</span></button>' +
      '</div>';
  }

  function pie(o) {
    var lang = o.lang, host = o.host || 'pagina';
    var pre = host === 'inicio' ? '#/' : '/#/';
    return '<div class="wrap"><img class="fl" src="' + LOGO + '" alt="Placeta Junior" width="150" height="66" />' +
      '<nav aria-label="Pie de página">' +
      '<a href="' + pre + 'actividades">' + t('n2', lang) + '</a>' +
      '<a href="' + pre + 'juegos">' + t('n3', lang) + '</a>' +
      '<a href="/edu">' + t('ednav', lang) + '</a>' +
      '<a href="' + pre + 'familias">' + t('n4', lang) + '</a>' +
      '<a href="' + pre + 'info">' + t('n5', lang) + '</a>' +
      '<a href="https://laplaceta.org">laplaceta.org</a></nav>' +
      '<nav class="lgl" aria-label="Legal"><a href="/aviso-legal.html">' + t('lgA', lang) + '</a><a href="/privacidad.html">' + t('lgP', lang) + '</a><a href="/terminos.html">' + t('lgT', lang) + '</a><a href="/cookies.html">' + t('lgC', lang) + '</a></nav>' +
      '<p>© 2026 Placeta Junior · Grupo de La Placeta · NIF G27566900 · <a href="mailto:junta@laplaceta.org">junta@laplaceta.org</a></p></div>';
  }

  function pintar() {
    var e = estado();
    if (!window.PJ_INICIO) document.documentElement.classList.toggle('uc', e.c === 'uc');
    document.querySelectorAll('[data-pj-header]').forEach(function (el) {
      el.innerHTML = cabecera({ host: 'pagina', active: el.getAttribute('data-active') || '', lang: e.l, uc: e.c === 'uc', snd: e.s !== 0 });
    });
    document.querySelectorAll('[data-pj-footer]').forEach(function (el) {
      el.innerHTML = pie({ host: 'pagina', lang: e.l });
    });
  }

  // Acciones (en Inicio las gestiona su propio script)
  document.addEventListener('click', function (ev) {
    if (window.PJ_INICIO) return;
    var b = ev.target.closest('[data-a]');
    var menu = document.getElementById('lm');
    if (!b) { if (menu && !ev.target.closest('.lang')) menu.classList.remove('open'); return; }
    var a = b.getAttribute('data-a'), v = b.getAttribute('data-v');
    if (a === 'menu' && menu) { var abierto = menu.classList.toggle('open'); b.setAttribute('aria-expanded', abierto); }
    else if (a === 'lang') { guardar({ l: v }); location.reload(); }
    else if (a === 'case') { guardar({ c: v }); location.reload(); }
    else if (a === 'snd') { guardar({ s: estado().s === 0 ? 1 : 0 }); pintar(); }
    else if (a === 'code') { location.href = '/?codigo=1'; }
  });

  window.PJHeader = {
    header: cabecera,
    footer: pie
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pintar);
  else pintar();
})();
