/* Placeta Junior Code · página pública /code
   Usa la misma API de actividades que la portada y muestra solo las misiones
   de tipo code_blocks. Sin dependencias. */
(function () {
  'use strict';

  var API = window.PJ_API_BASE || (location.hostname === 'junior.laplaceta.org'
    ? '/api/junior'
    : 'https://rsp.laplaceta.org/api/junior');

  var COLORES = ['#5B14C8', '#FF8A00', '#16A34A', '#2457BD', '#E23B5A', '#9A4F00'];
  var ICONO_PLAY = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10-6.5a1 1 0 0 0 0-1.8l-10-6.5A1 1 0 0 0 8 5.5z" fill="currentColor"/></svg>';
  var ICONO_ESTRELLA = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linejoin="round"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/></svg>';

  var estado = document.getElementById('misiones-estado');
  var lista = document.getElementById('misiones-lista');
  var primera = document.getElementById('jugar-primera');

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function esCode(x) {
    var c = x && x.contenido ? x.contenido : {};
    return x.tipo === 'code_blocks' || c.tipo === 'code_blocks';
  }

  function numRetos(x) {
    var c = x.contenido || {};
    if (Array.isArray(c.ejercicios)) return c.ejercicios.length;
    var bloque = (c.bloques || []).filter(function (b) { return b && b.tipo === 'code_blocks'; })[0];
    return bloque && Array.isArray(bloque.ejercicios) ? bloque.ejercicios.length : 0;
  }

  function edad(x) {
    var m = String(x.edad_recomendada || '').match(/\d+/g);
    if (!m) return '';
    return m.length > 1 ? m[0] + '–' + m[1] + ' años' : m[0] + ' años';
  }

  function tarjeta(x, i) {
    var titulo = x.titulo || (x.contenido && x.contenido.titulo) || 'Misión sin título';
    var n = numRetos(x);
    var meta = [];
    if (edad(x)) meta.push(edad(x));
    if (n) meta.push(n + ' reto' + (n === 1 ? '' : 's'));
    var color = COLORES[i % COLORES.length];
    return '<li class="pjc-mision" style="--c:' + color + '">' +
      '<span class="ib" style="--c:' + color + '">' + ICONO_ESTRELLA + '</span>' +
      '<h3>' + esc(titulo) + '</h3>' +
      (meta.length ? '<p class="pjc-meta">' + esc(meta.join(' · ')) + '</p>' : '') +
      '<a class="btn b-or" href="/jugar.html?jugar=' + encodeURIComponent(x.id) + '">' + ICONO_PLAY + 'Jugar</a>' +
      '</li>';
  }

  function mostrar(misiones) {
    if (!misiones.length) {
      estado.className = 'estado';
      estado.textContent = 'Todavía no hay misiones de Code publicadas. Pronto habrá nuevas.';
      return;
    }
    estado.hidden = true;
    lista.innerHTML = misiones.map(tarjeta).join('');
    lista.hidden = false;
    if (primera) {
      primera.href = '/jugar.html?jugar=' + encodeURIComponent(misiones[0].id);
    }
  }

  function fallo() {
    estado.className = 'estado err';
    estado.innerHTML = 'No hemos podido cargar las misiones. Revisa tu conexión.' +
      '<div class="pjc-reintentar"><button type="button" class="btn b-pu" id="pjc-reintentar">Reintentar</button></div>';
    var btn = document.getElementById('pjc-reintentar');
    if (btn) btn.addEventListener('click', cargar);
  }

  function cargar() {
    estado.hidden = false;
    estado.className = 'estado';
    estado.textContent = 'Cargando misiones…';
    lista.hidden = true;
    fetch(API + '/actividades?solo_publicas=1', { cache: 'no-store', headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (d) {
        var todas = (d && Array.isArray(d.actividades)) ? d.actividades : [];
        mostrar(todas.filter(esCode));
      })
      .catch(fallo);
  }

  cargar();
})();
