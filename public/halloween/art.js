/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · Ilustraciones SVG propias (sin dependencias ni imágenes)
   window.PJHW_ART.svg('pumpkin', '#ff8a00') → <svg …>…</svg>
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var INK = '#2b1250';

  var P = {
    pumpkin: function (c) {
      c = c || '#ff8a00';
      return '<ellipse cx="29" cy="58" rx="24" ry="30" fill="' + c + '"/><ellipse cx="71" cy="58" rx="24" ry="30" fill="' + c + '"/>' +
        '<ellipse cx="50" cy="58" rx="21" ry="33" fill="' + c + '"/><ellipse cx="50" cy="58" rx="21" ry="33" fill="#fff" opacity=".16"/>' +
        '<path d="M45 27q0-12 10-14 0 8 2 14z" fill="#3a8a3a"/>' +
        '<path d="M31 53h12l-6-12zM57 53h12l-6-12z" fill="' + INK + '"/>' +
        '<path d="M31 68L40 79 46 71 50 79 54 71 60 79 69 68Q50 92 31 68Z" fill="' + INK + '"/>';
    },
    ghost: function (c, acc) {
      c = c || '#ffffff';
      var a = '';
      if (acc === 'hat') a = '<path d="M30 28L50 -2l20 30z" fill="#7a2be6" transform="translate(0 6)"/><rect x="26" y="30" width="48" height="7" rx="3" fill="#5b14c8"/>';
      if (acc === 'crown') a = '<path d="M30 30L28 10l12 10 10-14 10 14 12-10-2 20z" fill="#ffc93c" stroke="#e8a900" stroke-width="2"/>';
      if (acc === 'pirate') a = '<path d="M22 34Q50 10 78 34Z" fill="#222"/><circle cx="50" cy="26" r="3" fill="#fff"/>';
      if (acc === 'sleep') a = '<path d="M64 20h10l-10 10h10" stroke="#7a2be6" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      var eyes = acc === 'sleep'
        ? '<path d="M33 52q5 5 10 0M57 52q5 5 10 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
        : '<ellipse cx="38" cy="52" rx="5.5" ry="7" fill="' + INK + '"/><ellipse cx="62" cy="52" rx="5.5" ry="7" fill="' + INK + '"/><circle cx="40" cy="49" r="2" fill="#fff"/><circle cx="64" cy="49" r="2" fill="#fff"/>';
      return '<path d="M16 92V50a34 34 0 0 1 68 0v42l-11-9-11 9-12-9-12 9-11-9z" fill="' + c + '" stroke="#b9a6ee" stroke-width="2.5" stroke-linejoin="round"/>' +
        eyes + '<ellipse cx="50" cy="68" rx="6" ry="7" fill="' + INK + '"/>' +
        '<circle cx="28" cy="62" r="4" fill="#ff9ec4" opacity=".6"/><circle cx="72" cy="62" r="4" fill="#ff9ec4" opacity=".6"/>' + a;
    },
    candy: function (c) {
      c = c || '#ff4d6d';
      return '<polygon points="27,50 3,30 3,70" fill="' + c + '"/><polygon points="73,50 97,30 97,70" fill="' + c + '"/>' +
        '<circle cx="50" cy="50" r="25" fill="' + c + '"/><circle cx="50" cy="50" r="25" fill="#fff" opacity=".18"/>' +
        '<path d="M32 38q18 8 36 0M30 52q20 10 40 0M34 64q16 7 32 0" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>';
    },
    lolli: function (c) {
      c = c || '#9b5de5';
      return '<rect x="47" y="58" width="6" height="38" rx="3" fill="#e9e1ff"/><circle cx="50" cy="38" r="30" fill="' + c + '"/>' +
        '<path d="M50 38m0 0a4 4 0 1 1 6 3a10 10 0 1 1-12-8a17 17 0 1 1 18 22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>';
    },
    bat: function (c) {
      c = c || '#4b2a8a';
      return '<path d="M50 40C42 26 24 20 4 30c8 4 10 12 8 22 8-6 14-4 18 6 4-8 12-6 20 0z" fill="' + c + '"/>' +
        '<path d="M50 40C58 26 76 20 96 30c-8 4-10 12-8 22-8-6-14-4-18 6-4-8-12-6-20 0z" fill="' + c + '"/>' +
        '<ellipse cx="50" cy="54" rx="11" ry="15" fill="' + c + '"/><path d="M41 42l-3-14 10 8zM59 42l3-14-10 8z" fill="' + c + '"/>' +
        '<circle cx="46" cy="50" r="2.6" fill="#ffd21f"/><circle cx="54" cy="50" r="2.6" fill="#ffd21f"/><path d="M47 58l3 4 3-4z" fill="#fff"/>';
    },
    spider: function (c) {
      c = c || '#2b2250';
      var legs = '';
      [-1, 1].forEach(function (s) {
        [0, 1, 2, 3].forEach(function (i) {
          var y = 40 + i * 9;
          legs += '<path d="M' + (50 + s * 12) + ' ' + y + ' q' + (s * 22) + ' ' + (-14 + i * 3) + ' ' + (s * 36) + ' ' + (i * 8 - 6) + '" stroke="' + c + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
        });
      });
      return '<path d="M50 0v36" stroke="#cfc6ee" stroke-width="2"/>' + legs +
        '<ellipse cx="50" cy="66" rx="18" ry="20" fill="' + c + '"/><circle cx="50" cy="44" r="12" fill="' + c + '"/>' +
        '<circle cx="45" cy="42" r="3.6" fill="#ff4d6d"/><circle cx="55" cy="42" r="3.6" fill="#ff4d6d"/><circle cx="45" cy="42" r="1.3" fill="#fff"/><circle cx="55" cy="42" r="1.3" fill="#fff"/>';
    },
    hat: function (c) {
      c = c || '#6a2cc9';
      return '<path d="M50 6L30 62h40z" fill="' + c + '"/><path d="M50 6L62 62h8z" fill="#000" opacity=".12"/>' +
        '<ellipse cx="50" cy="66" rx="40" ry="10" fill="' + c + '"/><rect x="33" y="50" width="34" height="9" fill="#ff8a00"/><rect x="45" y="48" width="10" height="13" rx="2" fill="none" stroke="#ffd21f" stroke-width="3"/>';
    },
    cauldron: function (c) {
      c = c || '#33284f';
      return '<ellipse cx="50" cy="38" rx="36" ry="9" fill="#6bdc6b"/><circle cx="38" cy="32" r="5" fill="#a6f0a6"/><circle cx="58" cy="30" r="7" fill="#a6f0a6"/><circle cx="68" cy="38" r="4" fill="#a6f0a6"/>' +
        '<path d="M14 40q-2 40 18 48h36q20-8 18-48q-36 12-72 0z" fill="' + c + '"/><path d="M12 38q0-6 6-6h64q6 0 6 6q-38 12-76 0z" fill="#4a3a73"/>' +
        '<path d="M28 94l-4 6M72 94l4 6" stroke="' + c + '" stroke-width="6" stroke-linecap="round"/>';
    },
    skull: function (c) {
      c = c || '#f4efff';
      return '<path d="M50 8C26 8 14 26 16 46c1 10 8 14 12 18v14h44V64c4-4 11-8 12-18C86 26 74 8 50 8z" fill="' + c + '" stroke="#b9a6ee" stroke-width="2"/>' +
        '<circle cx="36" cy="46" r="9" fill="' + INK + '"/><circle cx="64" cy="46" r="9" fill="' + INK + '"/><path d="M50 56l-4 9h8z" fill="' + INK + '"/><path d="M38 78v-8M46 78v-8M54 78v-8M62 78v-8" stroke="' + INK + '" stroke-width="3"/>';
    },
    moon: function () {
      return '<circle cx="50" cy="50" r="40" fill="#ffe27a"/><circle cx="36" cy="40" r="7" fill="#f5cf55"/><circle cx="62" cy="62" r="9" fill="#f5cf55"/><circle cx="64" cy="32" r="4" fill="#f5cf55"/>';
    },
    cat: function (c) {
      c = c || '#241a3d';
      return '<path d="M70 86c24 4 28-22 14-36l-6 4c8 10 6 22-8 24z" fill="' + c + '"/><ellipse cx="46" cy="76" rx="26" ry="20" fill="' + c + '"/>' +
        '<path d="M26 40l-2-22 16 10zM66 40l2-22-16 10z" fill="' + c + '"/><circle cx="46" cy="48" r="24" fill="' + c + '"/>' +
        '<ellipse cx="37" cy="46" rx="5" ry="6.5" fill="#ffd21f"/><ellipse cx="55" cy="46" rx="5" ry="6.5" fill="#ffd21f"/><ellipse cx="37" cy="46" rx="1.8" ry="5" fill="' + INK + '"/><ellipse cx="55" cy="46" rx="1.8" ry="5" fill="' + INK + '"/>' +
        '<path d="M43 56h6l-3 4z" fill="#ff9ec4"/><path d="M20 56h12M20 62l12-3M72 56H60M72 62l-12-3" stroke="#e9e1ff" stroke-width="1.6"/>';
    },
    broom: function (c) {
      c = c || '#9b5d2a';
      return '<g transform="rotate(-35 50 50)"><rect x="6" y="46" width="62" height="8" rx="4" fill="' + c + '"/>' +
        '<path d="M66 40h12l16-6v32l-16-6H66z" fill="#e0a73c"/><path d="M78 40v20M84 38v26M90 36v30" stroke="#a6761f" stroke-width="2"/><rect x="63" y="42" width="6" height="16" rx="2" fill="#6a2cc9"/></g>';
    },
    potion: function (c) {
      c = c || '#7cff6b';
      return '<rect x="40" y="6" width="20" height="10" rx="3" fill="#a06a35"/><path d="M42 16h16v20l22 40q6 16-12 18H32q-18-2-12-18l22-40z" fill="#e9f6ff" opacity=".55" stroke="#b9a6ee" stroke-width="2.5"/>' +
        '<path d="M30 70h40l8 8q4 12-10 14H32q-14-2-10-14z" fill="' + c + '"/><circle cx="42" cy="60" r="4" fill="' + c + '" opacity=".8"/><circle cx="56" cy="52" r="3" fill="' + c + '" opacity=".8"/>';
    },
    eye: function () {
      return '<ellipse cx="50" cy="52" rx="40" ry="32" fill="#fff" stroke="#cdbdf5" stroke-width="3"/><circle cx="50" cy="52" r="19" fill="#7cdc3a"/><circle cx="50" cy="52" r="9" fill="' + INK + '"/><circle cx="45" cy="47" r="4" fill="#fff"/>' +
        '<path d="M30 32l4 8M50 24v9M70 32l-4 8" stroke="#ff4d6d" stroke-width="2" opacity=".55"/>';
    },
    mushroom: function () {
      return '<path d="M38 56h24l4 34H34z" fill="#f4e7cf"/><path d="M8 58C8 28 28 10 50 10s42 18 42 48z" fill="#ff4d6d"/><circle cx="30" cy="36" r="8" fill="#fff"/><circle cx="58" cy="26" r="6" fill="#fff"/><circle cx="72" cy="44" r="7" fill="#fff"/><circle cx="46" cy="46" r="4.5" fill="#fff"/>';
    },
    bone: function () {
      return '<g transform="rotate(-30 50 50)"><rect x="22" y="43" width="56" height="14" rx="5" fill="#f4efff" stroke="#c9bde8" stroke-width="2"/><circle cx="20" cy="40" r="9" fill="#f4efff" stroke="#c9bde8" stroke-width="2"/><circle cx="20" cy="60" r="9" fill="#f4efff" stroke="#c9bde8" stroke-width="2"/><circle cx="80" cy="40" r="9" fill="#f4efff" stroke="#c9bde8" stroke-width="2"/><circle cx="80" cy="60" r="9" fill="#f4efff" stroke="#c9bde8" stroke-width="2"/></g>';
    },
    drop: function (c) {
      c = c || '#5ee05e';
      return '<path d="M50 6S18 44 18 64a32 32 0 0 0 64 0C82 44 50 6 50 6z" fill="' + c + '"/><ellipse cx="36" cy="62" rx="6" ry="10" fill="#fff" opacity=".4" transform="rotate(20 36 62)"/>';
    },
    wing: function () {
      return '<path d="M8 70C6 40 22 18 50 14c-6 10-4 20 2 26 4-10 12-14 22-12-4 8-2 16 4 22 4-4 10-6 14-4C94 62 78 82 50 86 34 88 16 82 8 70z" fill="#5a3a9a"/><path d="M30 70q10-26 30-40M44 76q12-22 36-34" stroke="#2b1250" stroke-width="2.5" fill="none"/>';
    },
    tomb: function (c) {
      c = c || '#9aa0b8';
      return '<path d="M20 94V40a30 30 0 0 1 60 0v54z" fill="' + c + '"/><path d="M20 94V40a30 30 0 0 1 60 0v54z" fill="#000" opacity=".08"/><path d="M50 28v34M38 40h24" stroke="#5c6280" stroke-width="6" stroke-linecap="round"/><path d="M10 96h80" stroke="#4a8a4a" stroke-width="7" stroke-linecap="round"/>';
    },
    tree: function (c) {
      c = c || '#3f8a4f';
      return '<path d="M44 94V54l-14-14M56 94V46l16-14M50 64l-10-8" stroke="#5a3a22" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="50" cy="30" r="22" fill="' + c + '"/><circle cx="28" cy="40" r="15" fill="' + c + '"/><circle cx="72" cy="38" r="16" fill="' + c + '"/><circle cx="50" cy="30" r="22" fill="#000" opacity=".08"/>';
    },
    house: function (c) {
      c = c || '#7b4bd6';
      return '<rect x="68" y="14" width="10" height="26" fill="#3b2a66"/><path d="M6 48L50 12l44 36z" fill="#3b2a66"/><rect x="14" y="48" width="72" height="46" fill="' + c + '"/>' +
        '<rect x="22" y="56" width="16" height="16" rx="3" fill="#ffd21f"/><rect x="62" y="56" width="16" height="16" rx="3" fill="#ffd21f"/><path d="M42 94V76a8 8 0 0 1 16 0v18z" fill="#2b1250"/>';
    },
    chest: function (c) {
      c = c || '#a8672b';
      return '<path d="M10 52a40 28 0 0 1 80 0z" fill="' + c + '"/><rect x="10" y="52" width="80" height="38" rx="4" fill="' + c + '"/><rect x="10" y="52" width="80" height="38" rx="4" fill="#000" opacity=".12"/><rect x="10" y="48" width="80" height="8" fill="#6c3f14"/><rect x="42" y="50" width="16" height="20" rx="3" fill="#ffd21f"/><circle cx="50" cy="60" r="3" fill="#2b1250"/>';
    },
    bush: function (c) {
      c = c || '#2f7a46';
      return '<circle cx="28" cy="64" r="22" fill="' + c + '"/><circle cx="52" cy="52" r="26" fill="' + c + '"/><circle cx="74" cy="66" r="20" fill="' + c + '"/><rect x="10" y="70" width="80" height="22" rx="8" fill="' + c + '"/><circle cx="40" cy="60" r="3" fill="#ff4d6d"/><circle cx="62" cy="48" r="3" fill="#ff4d6d"/><circle cx="72" cy="70" r="3" fill="#ff4d6d"/>';
    },
    star: function (c) {
      c = c || '#ffc93c';
      return '<polygon points="50,6 62,38 96,40 70,60 79,94 50,74 21,94 30,60 4,40 38,38" fill="' + c + '" stroke="#e8a900" stroke-width="3" stroke-linejoin="round"/>';
    },
    lock: function () {
      return '<path d="M30 46V32a20 20 0 0 1 40 0v14" stroke="#e9e1ff" stroke-width="9" fill="none" stroke-linecap="round"/><rect x="18" y="44" width="64" height="48" rx="10" fill="#ffc93c"/><circle cx="50" cy="66" r="7" fill="#2b1250"/><rect x="47" y="68" width="6" height="14" rx="3" fill="#2b1250"/>';
    },
    key: function () {
      return '<circle cx="30" cy="50" r="20" fill="none" stroke="#ffc93c" stroke-width="10"/><path d="M48 50h44M76 50v16M88 50v12" stroke="#ffc93c" stroke-width="10" stroke-linecap="round"/>';
    },
    door: function (c) {
      c = c || '#7b4bd6';
      return '<path d="M16 96V38a34 34 0 0 1 68 0v58z" fill="' + c + '"/><path d="M16 96V38a34 34 0 0 1 68 0v58z" fill="#000" opacity=".14"/><path d="M26 96V40a24 24 0 0 1 48 0v56z" fill="' + c + '"/><circle cx="64" cy="64" r="4.5" fill="#ffd21f"/><path d="M50 22v16M36 30l6 10M64 30l-6 10" stroke="#fff" stroke-width="0" />';
    },
    web: function () {
      return '<g stroke="#e9e1ff" stroke-width="2" fill="none" opacity=".8"><path d="M4 4l92 92M4 4h92M4 4v92M4 4l92 46M4 4l46 92"/><path d="M24 4q0 20-20 20M46 4q0 42-42 42M70 4q0 66-66 66"/></g>';
    },
    flag: function () {
      return '<path d="M22 94V8" stroke="#e9e1ff" stroke-width="7" stroke-linecap="round"/><path d="M26 10h56l-14 18 14 18H26z" fill="#ff8a00"/>';
    },
    monster: function (c) {
      c = c || '#6bdc6b';
      return '<path d="M20 90V46a30 30 0 0 1 60 0v44z" fill="' + c + '"/><circle cx="50" cy="44" r="14" fill="#fff"/><circle cx="50" cy="44" r="7" fill="' + INK + '"/><path d="M30 20L24 6l14 8zM70 20l6-14-14 8z" fill="' + c + '"/><path d="M32 70q18 14 36 0v8q-18 10-36 0z" fill="' + INK + '"/><path d="M38 72v6M46 76v6M54 76v6M62 72v6" stroke="#fff" stroke-width="4"/>';
    },
    heart: function (c) {
      return '<path d="M50 90C12 62 4 30 24 16c12-6 24 0 26 12 2-12 14-18 26-12 20 14 12 46-26 74z" fill="' + (c || '#ff4d6d') + '"/>';
    },
    arrow: function () {
      return '<path d="M20 50h58M54 24l26 26-26 26" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  };

  /* Cestas: id → cuerpo */
  function basket(id) {
    var wick = '<path d="M12 46h76l-10 44H22z" fill="%1"/><path d="M16 58h68M19 70h62M21 80h58" stroke="%2" stroke-width="3"/><path d="M26 46L32 90M42 46l2 44M58 46l-2 44M74 46l-6 44" stroke="%2" stroke-width="2.5" opacity=".6"/>';
    var handle = '<path d="M24 46q26-52 52 0" stroke="%3" stroke-width="7" fill="none" stroke-linecap="round"/>';
    var cols = {
      clasica: ['#c68642', '#8b5a2b', '#8b5a2b'],
      bruja: ['#6a2cc9', '#4a1f96', '#ff8a00'],
      gato: ['#2b2250', '#4a3d7a', '#2b2250'],
      murcielago: ['#3b2a66', '#241a45', '#241a45'],
      dorada: ['#ffc93c', '#e8a900', '#e8a900']
    }[id] || ['#c68642', '#8b5a2b', '#8b5a2b'];
    var s = (handle + wick).replace(/%1/g, cols[0]).replace(/%2/g, cols[1]).replace(/%3/g, cols[2]);
    if (id === 'bruja') s += '<path d="M50 8L36 40h28z" fill="#6a2cc9"/><rect x="30" y="38" width="40" height="7" rx="3" fill="#4a1f96"/>';
    if (id === 'gato') s += '<path d="M30 40l-2-18 12 8zM70 40l2-18-12 8z" fill="#2b2250"/><ellipse cx="40" cy="62" rx="4" ry="5" fill="#ffd21f"/><ellipse cx="60" cy="62" rx="4" ry="5" fill="#ffd21f"/>';
    if (id === 'murcielago') s += '<path d="M30 52q-14-14-24-8 6 4 4 14zM70 52q14-14 24-8-6 4-4 14z" fill="#241a45"/><circle cx="42" cy="68" r="3" fill="#ffd21f"/><circle cx="58" cy="68" r="3" fill="#ffd21f"/>';
    if (id === 'dorada') s += '<path d="M40 70l10-12 10 12-10 12z" fill="#fff" opacity=".7"/>';
    return s;
  }

  var GHOSTS = {
    boo: ['#ffffff', ''], rosita: ['#ffd1e6', ''], azulin: ['#cde7ff', ''], verdoso: ['#d4f7c9', ''],
    brujo: ['#e6d9ff', 'hat'], rey: ['#fff2c7', 'crown'], pirata: ['#f1f1f1', 'pirate'], dormilon: ['#d9d3ff', 'sleep']
  };

  function wrap(inner, cls, label) {
    return '<svg class="hw-art' + (cls ? ' ' + cls : '') + '" viewBox="0 0 100 100" ' + (label ? 'role="img" aria-label="' + label + '"' : 'aria-hidden="true"') + ' focusable="false">' + inner + '</svg>';
  }

  window.PJHW_ART = {
    names: Object.keys(P),
    svg: function (name, color, cls) {
      var f = P[name];
      return wrap(f ? f(color) : '', cls);
    },
    basket: function (id, cls) { return wrap(basket(id), cls); },
    ghost: function (id, cls) { var g = GHOSTS[id] || GHOSTS.boo; return wrap(P.ghost(g[0], g[1]), cls); },
    ghostSilhouette: function (cls) { return wrap('<path d="M16 92V50a34 34 0 0 1 68 0v42l-11-9-11 9-12-9-12 9-11-9z" fill="currentColor" opacity=".35"/><text x="50" y="64" text-anchor="middle" font-size="34" font-weight="700" fill="currentColor">?</text>', cls); },
    raw: P
  };
})();
