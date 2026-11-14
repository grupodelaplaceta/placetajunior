/* Placeta Junior Code · página pública /code
   Usa la misma API de actividades que la portada de Placeta Junior y muestra
   solo las misiones de tipo code_blocks. Sin dependencias. */
(function () {
  'use strict';

  var API = window.PJ_API_BASE || (location.hostname === 'junior.laplaceta.org'
    ? '/api/junior'
    : 'https://rsp.laplaceta.org/api/junior');

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

  function retos(x) {
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

  function tarjeta(x) {
    var titulo = x.titulo || (x.contenido && x.contenido.titulo) || 'Misión sin título';
    var n = retos(x);
    var meta = [];
    if (edad(x)) meta.push(edad(x));
    if (n) meta.push(n + ' reto' + (n === 1 ? '' : 's'));
    return '<li class="pjc-mision">' +
      '<h3>' + esc(titulo) + '</h3>' +
      (meta.length ? '<p class="pjc-mision-meta">' + esc(meta.join(' · ')) + '</p>' : '') +
      '<a class="pjc-btn pjc-btn-primario" href="/jugar.html?jugar=' + encodeURIComponent(x.id) + '">Jugar</a>' +
      '</li>';
  }

  function mostrar(misiones) {
    if (!misiones.length) {
      estado.textContent = 'Todavía no hay misiones de Code publicadas. Pronto habrá nuevas.';
      return;
    }
    estado.textContent = '';
    estado.hidden = true;
    lista.innerHTML = misiones.map(tarjeta).join('');
    lista.hidden = false;
    if (primera) {
      primera.href = '/jugar.html?jugar=' + encodeURIComponent(misiones[0].id);
      primera.textContent = 'Jugar la primera';
    }
  }

  function fallo() {
    estado.textContent = 'No hemos podido cargar las misiones. Revisa tu conexión e inténtalo de nuevo más tarde.';
    estado.classList.add('pjc-estado-error');
  }

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
})();
