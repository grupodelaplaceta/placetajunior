/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · Il·lustracions SVG pròpies
   Estil: contorn gruixut morat fosc, colors PLANS (cap degradat),
   ombres i llums amb formes planes. Sense dependències ni imatges.
   window.PJHW_ART.svg('pumpkin', '#ff8a00') → <svg …>…</svg>
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var INK = '#2b1250';

  /* Ombra / llum plana a partir d'un color hex (p<0 fosc, p>0 clar) */
  function shade(c, p) {
    var m = /^#([0-9a-f]{6})$/i.exec(c || '');
    if (!m) return c;
    var n = parseInt(m[1], 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    var t = p < 0 ? [26, 11, 58] : [255, 255, 255], q = Math.abs(p);
    function mix(a, z) { return Math.round(a + (z - a) * q); }
    return '#' + [mix(r, t[0]), mix(g, t[1]), mix(b, t[2])].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
  }
  /* Grup amb contorn per defecte; els detalls fins usen stroke="none" */
  function G(inner, w) {
    return '<g stroke="' + INK + '" stroke-width="' + (w || 3.2) + '" stroke-linejoin="round" stroke-linecap="round">' + inner + '</g>';
  }
  var NS = ' stroke="none"';
  function hl(x, y, rx, ry, rot) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".5"' + NS + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + '/>'; }

  var P = {
    pumpkin: function (c) {
      c = c || '#ff8a00';
      var d = shade(c, -0.2), l = shade(c, 0.18), glow = '#ffe27a';
      return G(
        '<path d="M45 26q-2-14 11-19 1 10-2 19z" fill="#4fa83d"/>' +
        '<path d="M56 7q9 0 12 8-8 0-12-3" fill="#6cc24f"/>' +
        '<ellipse cx="25" cy="61" rx="20" ry="27" fill="' + d + '"/><ellipse cx="75" cy="61" rx="20" ry="27" fill="' + d + '"/>' +
        '<ellipse cx="38" cy="60" rx="21" ry="31" fill="' + c + '"/><ellipse cx="62" cy="60" rx="21" ry="31" fill="' + c + '"/>' +
        '<ellipse cx="50" cy="60" rx="14" ry="32" fill="' + l + '"/>' +
        '<path d="M29 56l12-1-6-14z" fill="' + glow + '"/><path d="M59 55l12 1-6-15z" fill="' + glow + '"/>' +
        '<path d="M46 62h8l-4 7z" fill="' + glow + '" stroke-width="2.5"/>' +
        '<path d="M30 71L39 82 45 74 50 83 55 74 61 82 70 71Q50 64 30 71z" fill="' + glow + '"/>' +
        hl(22, 48, 3.5, 9, 18)
      );
    },
    ghost: function (c, acc) {
      c = c || '#ffffff';
      var d = shade(c, -0.12), body = 'M16 92V50a34 34 0 0 1 68 0v42l-11-9-11 9-12-9-12 9-11-9z';
      var a = '';
      if (acc === 'hat') a = '<path d="M50 -4L30 34h40z" fill="#7a2be6"/><path d="M50 -4L60 34h10z" fill="#5b14c8"' + NS + '/><rect x="24" y="31" width="52" height="8" rx="4" fill="#5b14c8"/><rect x="34" y="26" width="32" height="6" fill="#ffb703"' + NS + '/>';
      if (acc === 'crown') a = '<path d="M28 34L24 10l16 12 10-16 10 16 16-12-4 24z" fill="#ffc93c"/><circle cx="50" cy="24" r="3" fill="#ff4d6d"' + NS + '/>';
      if (acc === 'pirate') a = '<path d="M20 38Q50 6 80 38z" fill="#2b2b3a"/><circle cx="50" cy="26" r="3.2" fill="#fff"' + NS + '/><path d="M44 31h12" stroke="#fff" stroke-width="2.2"' + '/>';
      if (acc === 'sleep') a = '<path d="M66 18h12l-12 12h12" stroke="#7a2be6" stroke-width="3.6" fill="none"/>';
      var eyes = acc === 'sleep'
        ? '<path d="M31 52q6 6 12 0M57 52q6 6 12 0" stroke="' + INK + '" stroke-width="3.6" fill="none"/>'
        : '<ellipse cx="38" cy="50" rx="6" ry="8.5" fill="' + INK + '"' + NS + '/><ellipse cx="62" cy="50" rx="6" ry="8.5" fill="' + INK + '"' + NS + '/><circle cx="40" cy="47" r="2.4" fill="#fff"' + NS + '/><circle cx="64" cy="47" r="2.4" fill="#fff"' + NS + '/>';
      return G(
        '<path d="' + body + '" fill="' + c + '"/>' +
        '<path d="M70 22.5a34 34 0 0 1 14 27.5v42l-11-9z" fill="' + d + '"' + NS + '/>' +
        '<path d="' + body + '" fill="none"/>' +
        eyes + '<ellipse cx="50" cy="68" rx="6" ry="7.5" fill="' + INK + '"' + NS + '/><ellipse cx="50" cy="71" rx="3.2" ry="3" fill="#ff7a96"' + NS + '/>' +
        '<ellipse cx="27" cy="62" rx="5" ry="3.4" fill="#ff9ec4"' + NS + '/><ellipse cx="73" cy="62" rx="5" ry="3.4" fill="#ff9ec4"' + NS + '/>' +
        '<path d="M16 62q-10 2-10 12 6 0 10-6M84 62q10 2 10 12-6 0-10-6" fill="' + c + '"/>' +
        hl(30, 30, 4, 9, 30) + a
      );
    },
    candy: function (c) {
      c = c || '#ff4d6d';
      var d = shade(c, -0.22), l = shade(c, 0.4);
      return G(
        '<path d="M28 50L4 28q-3 22 0 44z" fill="' + c + '"/><path d="M72 50L96 28q3 22 0 44z" fill="' + c + '"/>' +
        '<path d="M16 38v24M10 34v32" stroke="' + d + '" stroke-width="2.6" fill="none"/><path d="M84 38v24M90 34v32" stroke="' + d + '" stroke-width="2.6" fill="none"/>' +
        '<circle cx="50" cy="50" r="25" fill="' + c + '"/>' +
        '<path d="M31 36q19 10 38 0M26 50q24 12 48 0M32 64q18 8 36 0" stroke="' + l + '" stroke-width="5.5" fill="none"' + NS.replace('stroke="none"', '') + '/>' +
        '<circle cx="50" cy="50" r="25" fill="none"/>' + hl(40, 38, 7, 4, -25)
      );
    },
    lolli: function (c) {
      c = c || '#9b5de5';
      var l = shade(c, 0.45), d = shade(c, -0.22);
      return G(
        '<rect x="46" y="58" width="8" height="38" rx="4" fill="#f4efff"/>' +
        '<circle cx="50" cy="38" r="31" fill="' + c + '"/>' +
        '<path d="M50 38m-4 0a4 4 0 1 1 8 0a9 9 0 1 1-18 0a14 14 0 1 1 28 0a19 19 0 1 1-38 0a24 24 0 1 1 48 0" fill="none" stroke="' + l + '" stroke-width="4.6"/>' +
        '<circle cx="50" cy="38" r="31" fill="none"/>' + hl(36, 22, 6, 3.4, -35) +
        '<path d="M46 62h8M46 70h8" stroke="' + d + '" stroke-width="2"/>'
      );
    },
    bat: function (c) {
      c = c || '#5b2fb0';
      var d = shade(c, -0.25), l = shade(c, 0.25);
      return G(
        '<path d="M50 44C42 26 22 20 3 32q8 4 8 14 8-8 14-2 4-8 12-6 6-6 13 6z" fill="' + c + '"/>' +
        '<path d="M50 44C58 26 78 20 97 32q-8 4-8 14-8-8-14-2-4-8-12-6-6-6-13 6z" fill="' + c + '"/>' +
        '<path d="M50 44C44 32 30 26 16 30M50 44C46 36 36 34 28 38M50 44C48 40 42 40 36 44" stroke="' + d + '" stroke-width="2.4" fill="none"/>' +
        '<path d="M50 44C56 32 70 26 84 30M50 44C54 36 64 34 72 38M50 44C52 40 58 40 64 44" stroke="' + d + '" stroke-width="2.4" fill="none"/>' +
        '<path d="M40 38l-4-18 12 10zM60 38l4-18-12 10z" fill="' + c + '"/>' +
        '<ellipse cx="50" cy="54" rx="13" ry="17" fill="' + l + '"/>' +
        '<circle cx="44" cy="50" r="4.2" fill="#fff"/><circle cx="56" cy="50" r="4.2" fill="#fff"/><circle cx="45" cy="51" r="2" fill="' + INK + '"' + NS + '/><circle cx="55" cy="51" r="2" fill="' + INK + '"' + NS + '/>' +
        '<path d="M45 60l2.6 5 2.4-4 2.4 4 2.6-5z" fill="#fff" stroke-width="1.8"/>'
      );
    },
    spider: function (c) {
      c = c || '#6247b3';
      var legs = '';
      [-1, 1].forEach(function (s) {
        [0, 1, 2, 3].forEach(function (i) {
          var y = 42 + i * 8;
          legs += '<path d="M' + (50 + s * 12) + ' ' + y + ' q' + (s * 20) + ' ' + (-16 + i * 3) + ' ' + (s * 34) + ' ' + (i * 9 - 4) + '" fill="none" stroke="' + INK + '" stroke-width="7.4"/>';
        });
      });
      var legs2 = legs.replace(/stroke="#2b1250" stroke-width="7.4"/g, 'stroke="' + c + '" stroke-width="3.6"');
      return '<g stroke-linecap="round" stroke-linejoin="round"><path d="M50 -4v40" stroke="#cfc6ee" stroke-width="2.4"/>' + legs + legs2 + '</g>' + G(
        '<ellipse cx="50" cy="68" rx="19" ry="21" fill="' + c + '"/><circle cx="50" cy="44" r="13" fill="' + c + '"/>' +
        '<path d="M44 64l6 8 6-8-6-6z" fill="#ff4d6d"' + NS + '/>' +
        '<circle cx="44" cy="42" r="4.6" fill="#fff"/><circle cx="56" cy="42" r="4.6" fill="#fff"/><circle cx="45" cy="43" r="2.2" fill="' + INK + '"' + NS + '/><circle cx="55" cy="43" r="2.2" fill="' + INK + '"' + NS + '/>' +
        hl(42, 58, 4, 7, 20)
      );
    },
    hat: function (c) {
      c = c || '#6a2cc9';
      var d = shade(c, -0.22);
      return G(
        '<path d="M50 8L27 66h46z" fill="' + c + '"/><path d="M50 8L58 66h15z" fill="' + d + '"' + NS + '/><path d="M50 8L27 66h46z" fill="none"/>' +
        '<path d="M50 8q16-4 20 8-10-4-18 0z" fill="' + c + '"/>' +
        '<rect x="33" y="50" width="34" height="11" fill="#ff8a00"/><rect x="45" y="48" width="10" height="15" rx="2.5" fill="#ffd21f"/><rect x="48.6" y="52.4" width="2.8" height="6.4" fill="' + INK + '"' + NS + '/>' +
        '<ellipse cx="50" cy="67" rx="42" ry="11" fill="' + c + '"/>' +
        hl(40, 34, 3, 12, 14)
      );
    },
    cauldron: function (c) {
      c = c || '#3d2f66';
      var l = shade(c, 0.22);
      return G(
        '<path d="M26 90l-5 9M74 90l5 9" stroke="' + INK + '" stroke-width="8" fill="none"/>' +
        '<path d="M14 42q-4 44 20 50h32q24-6 20-50z" fill="' + c + '"/>' +
        '<path d="M22 50q-2 30 10 38" stroke="' + l + '" stroke-width="5" fill="none"' + NS.replace('stroke="none"', '') + '/>' +
        '<ellipse cx="50" cy="40" rx="39" ry="12" fill="' + shade(c, 0.1) + '"/>' +
        '<ellipse cx="50" cy="40" rx="32" ry="8.5" fill="#6bdc6b"/>' +
        '<circle cx="38" cy="32" r="6" fill="#a6f0a6"/><circle cx="60" cy="28" r="8" fill="#a6f0a6"/><circle cx="72" cy="36" r="4.6" fill="#a6f0a6"/>' +
        '<path d="M10 46q-9 0-9 10M90 46q9 0 9 10" stroke="' + INK + '" stroke-width="3.4" fill="none"/>'
      );
    },
    skull: function (c) {
      c = c || '#f4efff';
      var d = shade(c, -0.14);
      return G(
        '<path d="M50 8C26 8 14 26 16 46c1 10 8 14 12 18v14h44V64c4-4 11-8 12-18C86 26 74 8 50 8z" fill="' + c + '"/>' +
        '<path d="M72 64c4-4 11-8 12-18 1-9-2-18-8-25 4 9 3 20-4 30z" fill="' + d + '"' + NS + '/>' +
        '<ellipse cx="36" cy="46" rx="9.5" ry="10.5" fill="' + INK + '"/><ellipse cx="64" cy="46" rx="9.5" ry="10.5" fill="' + INK + '"/>' +
        '<path d="M50 56l-5 10h10z" fill="' + INK + '"/><path d="M39 78v-8M47 78v-8M55 78v-8M63 78v-8" stroke-width="2.6"/>'
      );
    },
    moon: function () {
      return G(
        '<circle cx="50" cy="50" r="41" fill="#ffe27a"/><path d="M78 24a41 41 0 0 1-30 66 41 41 0 0 0 30-66z" fill="#f2c94c"' + NS + '/><circle cx="50" cy="50" r="41" fill="none"/>' +
        '<circle cx="35" cy="40" r="7.5" fill="#f2c94c" stroke-width="2.4"/><circle cx="62" cy="62" r="9.5" fill="#f2c94c" stroke-width="2.4"/><circle cx="64" cy="31" r="4.6" fill="#f2c94c" stroke-width="2.2"/>'
      );
    },
    cat: function (c) {
      c = c || '#4b3f8a';
      var l = shade(c, 0.2);
      return G(
        '<path d="M68 88c26 4 30-24 14-38l-6 5c8 10 6 22-8 24z" fill="' + c + '"/>' +
        '<ellipse cx="46" cy="76" rx="26" ry="21" fill="' + c + '"/><ellipse cx="46" cy="80" rx="13" ry="15" fill="' + l + '"/>' +
        '<path d="M24 42L21 16l18 11zM68 42l3-26-18 11z" fill="' + c + '"/><path d="M26 36l-1-12 9 6zM66 36l1-12-9 6z" fill="#ff9ec4"' + NS + '/>' +
        '<circle cx="46" cy="48" r="25" fill="' + c + '"/>' +
        '<ellipse cx="36" cy="46" rx="6" ry="7" fill="#ffd21f" stroke-width="2.4"/><ellipse cx="56" cy="46" rx="6" ry="7" fill="#ffd21f" stroke-width="2.4"/>' +
        '<ellipse cx="36" cy="46" rx="1.9" ry="5.4" fill="' + INK + '"' + NS + '/><ellipse cx="56" cy="46" rx="1.9" ry="5.4" fill="' + INK + '"' + NS + '/>' +
        '<path d="M42 57h8l-4 5z" fill="#ff9ec4" stroke-width="2"/><path d="M46 62q-4 5-8 3M46 62q4 5 8 3" fill="none" stroke-width="2"/>' +
        '<path d="M18 54h12M18 61l12-3M74 54H62M74 61l-12-3" stroke="#e9e1ff" stroke-width="1.8"/>'
      );
    },
    broom: function (c) {
      c = c || '#a8672b';
      return '<g transform="rotate(-35 50 50)">' + G(
        '<rect x="4" y="45" width="64" height="10" rx="5" fill="' + c + '"/>' +
        '<path d="M66 38h12l17-8v40l-17-8H66z" fill="#e0a73c"/><path d="M78 40v20M84 36v28M90 32v36" stroke="#a6761f" stroke-width="2.4"/>' +
        '<rect x="62" y="40" width="8" height="20" rx="3" fill="#6a2cc9"/>' +
        '<path d="M10 48h50" stroke="' + shade(c, 0.3) + '" stroke-width="2.6"' + '/>'
      ) + '</g>';
    },
    potion: function (c) {
      c = c || '#7cff6b';
      var d = shade(c, -0.2);
      return G(
        '<rect x="39" y="4" width="22" height="13" rx="4" fill="#a06a35"/>' +
        '<path d="M42 17h16v20l22 40q6 16-12 18H32q-18-2-12-18l22-40z" fill="#e9f6ff"/>' +
        '<path d="M30 68h40l10 11q4 13-10 14H30q-14-1-10-14z" fill="' + c + '"/>' +
        '<path d="M60 68h10l10 11q4 13-10 14h-5q8-12-5-25z" fill="' + d + '"' + NS + '/>' +
        '<circle cx="42" cy="58" r="4.6" fill="' + c + '"/><circle cx="56" cy="48" r="3.2" fill="' + c + '"/><circle cx="48" cy="40" r="2.2" fill="' + c + '"' + NS + '/>' +
        hl(32, 80, 3, 6, 15) + '<path d="M46 24v10" stroke="#fff" stroke-width="2.6" opacity=".7"' + '/>'
      );
    },
    eye: function () {
      return G(
        '<path d="M6 52Q50 8 94 52Q50 96 6 52z" fill="#fff"/><circle cx="50" cy="52" r="21" fill="#7cdc3a"/><circle cx="50" cy="52" r="11" fill="' + INK + '"/>' +
        '<circle cx="44" cy="46" r="4.6" fill="#fff"' + NS + '/><path d="M24 36l6 6M20 52h8M24 68l6-6" stroke="#ff4d6d" stroke-width="2.2" opacity=".6"/>'
      );
    },
    mushroom: function () {
      return G(
        '<path d="M37 56h26l5 36H32z" fill="#f4e7cf"/><path d="M58 56h5l5 36h-9z" fill="#e0cfae"' + NS + '/>' +
        '<path d="M6 60C6 28 26 8 50 8s44 20 44 52z" fill="#ff4d6d"/><path d="M80 18C90 28 94 42 94 60H72C74 44 78 30 80 18z" fill="#d93a58"' + NS + '/>' +
        '<ellipse cx="30" cy="36" rx="8.5" ry="7.5" fill="#fff" stroke-width="2.2"/><ellipse cx="56" cy="24" rx="6.5" ry="5.5" fill="#fff" stroke-width="2.2"/><ellipse cx="68" cy="46" rx="7.5" ry="6.5" fill="#fff" stroke-width="2.2"/><ellipse cx="44" cy="48" rx="4.6" ry="4" fill="#fff" stroke-width="2"/>'
      );
    },
    bone: function () {
      return '<g transform="rotate(-30 50 50)">' + G(
        '<rect x="20" y="42" width="60" height="16" rx="6" fill="#f4efff"/>' +
        '<circle cx="20" cy="40" r="10" fill="#f4efff"/><circle cx="20" cy="60" r="10" fill="#f4efff"/><circle cx="80" cy="40" r="10" fill="#f4efff"/><circle cx="80" cy="60" r="10" fill="#f4efff"/>' +
        '<rect x="26" y="46" width="48" height="5" rx="2.5" fill="#fff"' + NS + '/>'
      ) + '</g>';
    },
    drop: function (c) {
      c = c || '#5ee05e';
      return G(
        '<path d="M50 6S18 44 18 64a32 32 0 0 0 64 0C82 44 50 6 50 6z" fill="' + c + '"/><path d="M62 28C74 44 82 54 82 64a32 32 0 0 1-22 30q14-16 12-36z" fill="' + shade(c, -0.2) + '"' + NS + '/>' +
        '<path d="M50 6S18 44 18 64a32 32 0 0 0 64 0C82 44 50 6 50 6z" fill="none"/>' + hl(36, 62, 6, 11, 20)
      );
    },
    wing: function () {
      return G(
        '<path d="M6 70C4 40 22 18 50 12c-6 10-4 20 2 26 4-10 12-14 22-12-4 8-2 16 4 22 4-4 12-6 16-4C94 62 78 84 50 88 32 90 14 84 6 70z" fill="#6a3fc0"/>' +
        '<path d="M30 70q10-26 30-40M44 78q12-22 36-34" stroke="' + INK + '" stroke-width="3" fill="none"/>'
      );
    },
    tomb: function (c) {
      c = c || '#9aa0b8';
      return G(
        '<path d="M18 94V42a32 32 0 0 1 64 0v52z" fill="' + c + '"/><path d="M68 15.6a32 32 0 0 1 14 26.4v52H70V30z" fill="' + shade(c, -0.18) + '"' + NS + '/>' +
        '<path d="M18 94V42a32 32 0 0 1 64 0v52z" fill="none"/>' +
        '<path d="M50 28v36M37 41h26" stroke="#5c6280" stroke-width="7"/>' +
        '<path d="M6 96h88" stroke="#3f8a4f" stroke-width="9"/><path d="M14 90l3-8 4 8M80 90l4-9 3 9" stroke="#3f8a4f" stroke-width="3" fill="none"/>'
      );
    },
    tree: function (c) {
      c = c || '#3f8a4f';
      return G(
        '<path d="M40 96V56L26 40l8-4 10 12 4-4V28M58 96V48l16-16" stroke="' + INK + '" stroke-width="15" fill="none"/>' +
        '<path d="M40 96V56L26 40l8-4 10 12 4-4V28M58 96V48l16-16" stroke="#6b4426" stroke-width="9" fill="none"' + NS.replace('stroke="none"', '') + '/>' +
        '<circle cx="50" cy="30" r="23" fill="' + c + '"/><circle cx="27" cy="42" r="16" fill="' + c + '"/><circle cx="74" cy="38" r="17" fill="' + c + '"/>' +
        '<circle cx="50" cy="30" r="23" fill="' + shade(c, -0.2) + '"' + NS + ' opacity=".35"/>' +
        '<ellipse cx="49" cy="76" rx="3.6" ry="5" fill="#ffd21f" stroke-width="2"/><ellipse cx="57" cy="76" rx="3.6" ry="5" fill="#ffd21f" stroke-width="2"/>'
      );
    },
    house: function (c) {
      c = c || '#7b4bd6';
      return G(
        '<rect x="68" y="12" width="11" height="28" fill="#4a3490"/>' +
        '<path d="M4 50L50 10l46 40z" fill="#4a3490"/><path d="M50 10l46 40H66z" fill="#3b2a78"' + NS + '/><path d="M4 50L50 10l46 40z" fill="none"/>' +
        '<rect x="14" y="50" width="72" height="44" fill="' + c + '"/><rect x="66" y="50" width="20" height="44" fill="' + shade(c, -0.2) + '"' + NS + '/><rect x="14" y="50" width="72" height="44" fill="none"/>' +
        '<rect x="21" y="58" width="16" height="16" rx="3" fill="#ffd21f" stroke-width="2.6"/><rect x="63" y="58" width="16" height="16" rx="3" fill="#ffd21f" stroke-width="2.6"/>' +
        '<path d="M42 94V77a8 8 0 0 1 16 0v17z" fill="#ff8a00"/>'
      );
    },
    chest: function (c) {
      c = c || '#a8672b';
      return G(
        '<rect x="8" y="50" width="84" height="42" rx="5" fill="' + c + '"/><rect x="62" y="50" width="30" height="42" fill="' + shade(c, -0.2) + '"' + NS + '/>' +
        '<path d="M8 52a42 30 0 0 1 84 0z" fill="' + shade(c, 0.12) + '"/><rect x="8" y="50" width="84" height="42" rx="5" fill="none"/>' +
        '<rect x="22" y="40" width="9" height="52" fill="#6c3f14"/><rect x="69" y="40" width="9" height="52" fill="#6c3f14"/>' +
        '<rect x="42" y="50" width="16" height="20" rx="4" fill="#ffd21f"/><circle cx="50" cy="60" r="3" fill="' + INK + '"' + NS + '/>'
      );
    },
    bush: function (c) {
      c = c || '#2f7a46';
      return G(
        '<circle cx="28" cy="66" r="22" fill="' + c + '"/><circle cx="74" cy="68" r="20" fill="' + shade(c, -0.15) + '"/><circle cx="52" cy="52" r="26" fill="' + c + '"/>' +
        '<rect x="9" y="72" width="82" height="21" rx="9" fill="' + shade(c, -0.1) + '"/>' +
        '<circle cx="40" cy="58" r="4" fill="#ff4d6d" stroke-width="2"/><circle cx="62" cy="46" r="4" fill="#ff4d6d" stroke-width="2"/><circle cx="74" cy="72" r="4" fill="#ff4d6d" stroke-width="2"/><circle cx="26" cy="76" r="4" fill="#ff4d6d" stroke-width="2"/>' +
        hl(40, 40, 6, 3, -30)
      );
    },
    star: function (c) {
      c = c || '#ffc93c';
      return G('<polygon points="50,6 62,38 96,40 70,60 79,94 50,74 21,94 30,60 4,40 38,38" fill="' + c + '"/><polygon points="50,6 62,38 50,50 38,38" fill="' + shade(c, 0.35) + '"' + NS + '/>');
    },
    lock: function () {
      return G(
        '<path d="M30 46V32a20 20 0 0 1 40 0v14" stroke="' + INK + '" stroke-width="15" fill="none"/><path d="M30 46V32a20 20 0 0 1 40 0v14" stroke="#e9e1ff" stroke-width="8" fill="none"' + NS.replace('stroke="none"', '') + '/>' +
        '<rect x="18" y="44" width="64" height="48" rx="11" fill="#ffc93c"/><path d="M58 44h13a11 11 0 0 1 11 11v26a11 11 0 0 1-11 11H58z" fill="#e8a900"' + NS + '/><rect x="18" y="44" width="64" height="48" rx="11" fill="none"/>' +
        '<circle cx="50" cy="65" r="7.5" fill="' + INK + '"' + NS + '/><rect x="47" y="67" width="6" height="14" rx="3" fill="' + INK + '"' + NS + '/>'
      );
    },
    key: function () {
      return G(
        '<path d="M48 50h42M76 50v17M88 50v12" stroke="' + INK + '" stroke-width="16" fill="none"/><circle cx="30" cy="50" r="21" fill="none" stroke="' + INK + '" stroke-width="18"/>' +
        '<path d="M48 50h42M76 50v17M88 50v12" stroke="#ffc93c" stroke-width="9" fill="none"' + NS.replace('stroke="none"', '') + '/><circle cx="30" cy="50" r="21" fill="none" stroke="#ffc93c" stroke-width="10"/>',
        1
      );
    },
    door: function (c) {
      c = c || '#7b4bd6';
      return G(
        '<path d="M14 96V40a36 36 0 0 1 72 0v56z" fill="' + shade(c, -0.3) + '"/>' +
        '<path d="M24 96V42a26 26 0 0 1 52 0v54z" fill="' + c + '"/><path d="M50 16a26 26 0 0 1 26 26v54H62V28z" fill="' + shade(c, -0.18) + '"' + NS + '/><path d="M24 96V42a26 26 0 0 1 52 0v54z" fill="none"/>' +
        '<path d="M50 16v80M24 56h52" stroke="' + shade(c, 0.25) + '" stroke-width="2.4" fill="none"/>' +
        '<circle cx="64" cy="66" r="4.6" fill="#ffd21f"/>'
      );
    },
    web: function () {
      return '<g stroke="#e9e1ff" stroke-width="2.2" fill="none" opacity=".85" stroke-linecap="round"><path d="M4 4l92 92M4 4h92M4 4v92M4 4l92 46M4 4l46 92"/><path d="M24 4q0 20-20 20M46 4q0 42-42 42M70 4q0 66-66 66"/></g>';
    },
    flag: function () {
      return G('<path d="M22 96V8" stroke="' + INK + '" stroke-width="11" fill="none"/><path d="M22 96V8" stroke="#e9e1ff" stroke-width="5" fill="none"' + NS.replace('stroke="none"', '') + '/><path d="M26 10h56l-14 18 14 18H26z" fill="#ff8a00"/>');
    },
    monster: function (c) {
      c = c || '#6bdc6b';
      var d = shade(c, -0.2);
      return G(
        '<path d="M30 24L22 4l18 8zM70 24l8-20-18 8z" fill="#fff3dc"/>' +
        '<path d="M18 92V46a32 32 0 0 1 64 0v46z" fill="' + c + '"/><path d="M68 19.6a32 32 0 0 1 14 26.4v46H68z" fill="' + d + '"' + NS + '/><path d="M18 92V46a32 32 0 0 1 64 0v46z" fill="none"/>' +
        '<circle cx="50" cy="44" r="15" fill="#fff"/><circle cx="50" cy="44" r="7.5" fill="' + INK + '"' + NS + '/><circle cx="47" cy="41" r="2.6" fill="#fff"' + NS + '/>' +
        '<path d="M30 68q20 16 40 0v10q-20 12-40 0z" fill="' + INK + '"/><path d="M38 72v7M46 76v7M54 76v7M62 72v7" stroke="#fff" stroke-width="4.2" stroke-linecap="butt"' + NS.replace('stroke="none"', '') + '/>'
      );
    },
    heart: function (c) {
      c = c || '#ff4d6d';
      return G('<path d="M50 90C12 62 4 30 24 16c12-6 24 0 26 12 2-12 14-18 26-12 20 14 12 46-26 74z" fill="' + c + '"/>' + hl(30, 32, 5, 9, 35));
    },
    arrow: function () {
      return '<path d="M20 50h58M54 24l26 26-26 26" stroke="currentColor" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
    }
  };

  /* Cistelles */
  function basket(id) {
    var cols = {
      clasica: ['#c68642', '#8b5a2b', '#8b5a2b'], bruja: ['#6a2cc9', '#4a1f96', '#ff8a00'], gato: ['#4b3f8a', '#6a5cb0', '#4b3f8a'],
      murcielago: ['#5a3cb0', '#3b2582', '#3b2582'], dorada: ['#ffc93c', '#e8a900', '#e8a900']
    }[id] || ['#c68642', '#8b5a2b', '#8b5a2b'];
    var handle = '<path d="M24 48q26-54 52 0" stroke="' + INK + '" stroke-width="12.5" fill="none"/><path d="M24 48q26-54 52 0" stroke="' + cols[2] + '" stroke-width="6.5" fill="none"' + NS.replace('stroke="none"', '') + '/>';
    var body = '<path d="M10 46h80l-10 46H20z" fill="' + cols[0] + '"/><path d="M62 46h28l-10 46H56z" fill="' + shade(cols[0], -0.18) + '"' + NS + '/><path d="M10 46h80l-10 46H20z" fill="none"/>' +
      '<path d="M15 60h70M18 73h64M20 84h60" stroke="' + cols[1] + '" stroke-width="3" fill="none"/>' +
      '<rect x="6" y="40" width="88" height="10" rx="5" fill="' + cols[1] + '"/>';
    var extra = '';
    if (id === 'bruja') extra = '<path d="M50 6L36 40h28z" fill="#6a2cc9"/><rect x="28" y="36" width="44" height="8" rx="4" fill="#4a1f96"/>';
    if (id === 'gato') extra = '<path d="M26 40l-2-20 14 9zM74 40l2-20-14 9z" fill="#4b3f8a"/><ellipse cx="40" cy="66" rx="5" ry="6" fill="#ffd21f" stroke-width="2"/><ellipse cx="60" cy="66" rx="5" ry="6" fill="#ffd21f" stroke-width="2"/><path d="M47 74h6l-3 4z" fill="#ff9ec4" stroke-width="1.6"/>';
    if (id === 'murcielago') extra = '<path d="M20 58q-16-14-18-6 6 3 4 14zM80 58q16-14 18-6-6 3-4 14z" fill="#3b2582"/><circle cx="42" cy="68" r="3.6" fill="#ffd21f" stroke-width="1.8"/><circle cx="58" cy="68" r="3.6" fill="#ffd21f" stroke-width="1.8"/>';
    if (id === 'dorada') extra = '<path d="M50 56l8 12-8 14-8-14z" fill="#fff" opacity=".8"' + NS + '/>';
    return G(handle + body + extra);
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
    svg: function (name, color, cls) { var f = P[name]; return wrap(f ? f(color) : '', cls); },
    basket: function (id, cls) { return wrap(basket(id), cls); },
    ghost: function (id, cls) { var g = GHOSTS[id] || GHOSTS.boo; return wrap(P.ghost(g[0], g[1]), cls); },
    ghostSilhouette: function (cls) { return wrap('<path d="M16 92V50a34 34 0 0 1 68 0v42l-11-9-11 9-12-9-12 9-11-9z" fill="currentColor" opacity=".35"/><text x="50" y="64" text-anchor="middle" font-size="34" font-weight="700" fill="currentColor">?</text>', cls); },
    shade: shade,
    raw: P
  };
})();
