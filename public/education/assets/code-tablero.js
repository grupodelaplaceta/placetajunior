/* Placeta Junior Code · módulo compartido de retos
   Biblioteca local de retos (este dispositivo), catálogo de bloques y miniaturas
   del tablero. Lo usan el espacio «Retos Code» y el Studio. Sin dependencias. */
(function () {
  'use strict';

  var KEY = 'pj-code-retos-v1';
  var DIRS = ['derecha', 'abajo', 'izquierda', 'arriba'];
  var DIR_LABEL = { derecha: 'Derecha', abajo: 'Abajo', izquierda: 'Izquierda', arriba: 'Arriba' };

  // Catálogo de bloques del motor (mismos identificadores que code/engine.js)
  var BLOQUES = {
    avanzar: { nombre: 'Avanzar', grupo: 'mov', icono: 'flecha-derecha' },
    retroceder: { nombre: 'Retroceder', grupo: 'mov', icono: 'flecha-izquierda' },
    girar: { nombre: 'Girar', grupo: 'mov', icono: 'flecha-curva' },
    girar_180: { nombre: 'Girar 180°', grupo: 'mov', icono: 'flecha-curva' },
    saltar: { nombre: 'Saltar', grupo: 'mov', icono: 'flecha-salto' },
    repetir: { nombre: 'Repetir', grupo: 'ctl', icono: 'bucle' },
    si: { nombre: 'Si', grupo: 'ctl', icono: 'diamante' },
    sonido: { nombre: 'Sonido', grupo: 'snd', icono: 'altavoz' }
  };
  var GRUPO = {
    mov: { nombre: 'Movimiento', color: '#2457bd' },
    ctl: { nombre: 'Lógica y control', color: '#9a4f00' },
    snd: { nombre: 'Sonidos', color: '#a83358' }
  };

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function lista() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY) || '[]');
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  function guardarLista(l) {
    localStorage.setItem(KEY, JSON.stringify(l));
  }

  // Miniatura del tablero: cuadrícula con obstáculos, monedas, meta y Candela con su dirección.
  function miniTablero(ex, opciones) {
    var o = opciones || {};
    var esc_ = (ex && ex.escenario) || {};
    var w = Math.max(3, Math.min(10, Number(esc_.ancho) || 6));
    var h = Math.max(3, Math.min(10, Number(esc_.alto) || 6));
    var c = 20; // lado de cada casilla
    var pad = 2;
    var W = w * c + pad * 2, H = h * c + pad * 2;
    var obst = esc_.obstaculos || [], monedas = esc_.monedas || [];
    var meta = (ex && ex.objetivo && ex.objetivo.posicion) || null;
    var ini = (ex && ex.inicio) || { x: 0, y: 0, direccion: 'derecha' };
    var parts = ['<rect x="0" y="0" width="' + W + '" height="' + H + '" rx="4" fill="#eef4ff"/>'];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        parts.push('<rect x="' + (pad + x * c + 1) + '" y="' + (pad + y * c + 1) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" rx="3" fill="#ffffff" stroke="#c9d8f5" stroke-width="1"/>');
      }
    }
    obst.forEach(function (p) {
      parts.push('<rect x="' + (pad + p.x * c + 1) + '" y="' + (pad + p.y * c + 1) + '" width="' + (c - 2) + '" height="' + (c - 2) + '" rx="3" fill="#5b5369"/>');
    });
    monedas.forEach(function (p) {
      parts.push('<circle cx="' + (pad + p.x * c + c / 2) + '" cy="' + (pad + p.y * c + c / 2) + '" r="4" fill="#ffd21f" stroke="#b7791f" stroke-width="1.2"/>');
    });
    if (meta) {
      var mx = pad + meta.x * c + c / 2, my = pad + meta.y * c + c / 2;
      parts.push('<polygon points="' + starPoints(mx, my, 7, 3) + '" fill="#ff8a00"/>');
    }
    var ix = pad + (ini.x || 0) * c + c / 2, iy = pad + (ini.y || 0) * c + c / 2;
    parts.push('<circle cx="' + ix + '" cy="' + iy + '" r="7" fill="#2457bd"/>');
    parts.push('<polygon points="' + arrowPoints(ix, iy, ini.direccion || 'derecha') + '" fill="#ffffff"/>');
    var cls = o.clase ? ' class="' + esc(o.clase) + '"' : '';
    return '<svg' + cls + ' viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.alt || 'Tablero del reto') + '">' + parts.join('') + '</svg>';
  }

  function starPoints(cx, cy, R, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var rad = (i % 2 === 0) ? R : r;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      pts.push((cx + rad * Math.cos(a)).toFixed(2) + ',' + (cy + rad * Math.sin(a)).toFixed(2));
    }
    return pts.join(' ');
  }

  function arrowPoints(cx, cy, dir) {
    var a = { derecha: 0, abajo: Math.PI / 2, izquierda: Math.PI, arriba: -Math.PI / 2 }[dir] || 0;
    var tip = [cx + 5 * Math.cos(a), cy + 5 * Math.sin(a)];
    var back = [cx - 3 * Math.cos(a), cy - 3 * Math.sin(a)];
    var side1 = [back[0] + 3.2 * Math.cos(a + Math.PI / 2), back[1] + 3.2 * Math.sin(a + Math.PI / 2)];
    var side2 = [back[0] - 3.2 * Math.cos(a + Math.PI / 2), back[1] - 3.2 * Math.sin(a + Math.PI / 2)];
    return [tip, side1, side2].map(function (p) { return p[0].toFixed(2) + ',' + p[1].toFixed(2); }).join(' ');
  }

  // Resumen legible de un reto para tarjetas
  function resumen(ex) {
    var n = (ex && ex.bloques_permitidos) ? ex.bloques_permitidos.length : 0;
    var monedas = ((ex && ex.escenario && ex.escenario.monedas) || []).length;
    var partes = [];
    partes.push(n + ' bloque' + (n === 1 ? '' : 's'));
    if (monedas) partes.push(monedas + ' moneda' + (monedas === 1 ? '' : 's'));
    return partes.join(' · ');
  }

  window.PJRetos = {
    KEY: KEY,
    DIRS: DIRS,
    DIR_LABEL: DIR_LABEL,
    BLOQUES: BLOQUES,
    GRUPO: GRUPO,
    lista: lista,
    guardarLista: guardarLista,
    miniTablero: miniTablero,
    resumen: resumen,
    esc: esc
  };
})();
