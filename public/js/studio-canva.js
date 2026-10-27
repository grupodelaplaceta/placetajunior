/* Placeta Junior · Studio estilo Canva
   Capa de interfaz sobre studio.js: paleta, vista previa en vivo, tira de diapositivas,
   panel de propiedades, deshacer/rehacer y atajos. No modifica el modelo de datos. */
(function () {
  'use strict';
  var sel = 0, lastLen = 0, tPrev = 0, tSnap = 0, device = 'movil', hist = [], hpos = -1, restoring = false, lastSnap = '';
  var $ = function (id) { return document.getElementById(id); };
  var TIPOSX = function () { try { return TIPOS; } catch (e) { return {}; } };
  var B = function () { try { return bloques; } catch (e) { return []; } };

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc2(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function aviso2(m, err) { try { aviso(m, !!err); } catch (e) {} }

  /* ── 1. Montaje del layout ── */
  function montar() {
    var studio = document.querySelector('.studio'), pal = document.querySelector('.studio-palette');
    if (!studio || !pal || $('cv')) return false;
    var cv = el('div', 'cv'); cv.id = 'cv';
    cv.innerHTML =
      '<section class="cv-center">' +
        '<div class="cv-stagebar">' +
          '<div class="cv-seg" role="group" aria-label="Dispositivo"><button type="button" data-dev="movil" class="on" title="Móvil">📱 Móvil</button><button type="button" data-dev="tablet" title="Tableta">📟 Tableta</button><button type="button" data-dev="pc" title="Ordenador">💻 PC</button></div>' +
          '<span class="cv-count" id="cv-count"></span>' +
          '<span class="cv-sp"></span>' +
          '<button type="button" class="cv-ico" id="cv-undo" title="Deshacer (Ctrl+Z)" disabled><span class="material-symbols-rounded">undo</span></button>' +
          '<button type="button" class="cv-ico" id="cv-redo" title="Rehacer (Ctrl+Y)" disabled><span class="material-symbols-rounded">redo</span></button>' +
        '</div>' +
        '<div class="cv-stage" id="cv-stage"><div class="cv-device dev-movil" id="cv-device"><iframe id="cv-prev" title="Vista previa en vivo" loading="lazy"></iframe></div><div class="cv-empty" id="cv-empty"></div></div>' +
        '<div class="cv-strip-wrap"><div class="cv-strip" id="cv-strip" aria-label="Diapositivas"></div></div>' +
      '</section>' +
      '<aside class="cv-insp" id="cv-insp" aria-label="Propiedades"><div class="cv-insp-head" id="cv-insp-head"></div><div class="cv-insp-body" id="cv-insp-body"></div></aside>';
    studio.parentNode.insertBefore(cv, studio);
    cv.insertBefore(pal, cv.firstChild);
    studio.classList.add('cv-hidden');
    prepararPaleta(pal);
    cv.querySelector('.cv-seg').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; device = b.dataset.dev;
      cv.querySelectorAll('.cv-seg button').forEach(function (x) { x.classList.toggle('on', x === b); });
      $('cv-device').className = 'cv-device dev-' + device; ajustar();
    });
    $('cv-undo').addEventListener('click', undo); $('cv-redo').addEventListener('click', redo);
    // el panel reacciona a cualquier edición
    $('cv-insp').addEventListener('input', function () { programar(); });
    $('cv-insp').addEventListener('change', function () { programar(); });
    $('cv-insp').addEventListener('click', function () { programar(); });
    // zona de suelta en el escenario y en la tira
    ['cv-stage', 'cv-strip'].forEach(function (id) {
      var z = $(id);
      z.addEventListener('dragover', function (e) { e.preventDefault(); z.classList.add('over'); });
      z.addEventListener('dragleave', function () { z.classList.remove('over'); });
      z.addEventListener('drop', function (e) { z.classList.remove('over'); soltar(e, id === 'cv-strip' ? posDesde(e) : null); });
    });
    // botón de envío
    var pub = $('btn-publicar'); if (pub) pub.innerHTML = '<span class="material-symbols-rounded">rocket_launch</span> Enviar a RSP';
    var vista = $('btn-vista'); if (vista) vista.innerHTML = '<span class="material-symbols-rounded">open_in_new</span> Pantalla completa';
    var act = document.querySelector('.studio-actions');
    if (act && !$('btn-ajustes')) { var aj = el('button', 'btn btn-outline'); aj.id = 'btn-ajustes'; aj.type = 'button'; aj.innerHTML = '<span class="material-symbols-rounded">tune</span> Ajustes'; aj.title = 'Título, categoría, edad, recompensas…'; aj.addEventListener('click', function () { try { abrirMeta(); } catch (e) {} }); act.insertBefore(aj, act.firstChild); }
    return true;
  }

  /* ── 2. Paleta: buscador, categorías y mosaico ── */
  function prepararPaleta(pal) {
    pal.classList.add('cv-palette');
    var cat = 'basico';
    Array.prototype.forEach.call(pal.children, function (c) {
      if (c.classList.contains('palette-divider')) { cat = /modalidades/i.test(c.textContent) ? 'etapas' : 'interactivo'; c.dataset.cat = cat; }
      if (c.classList.contains('block-btn')) c.dataset.cat = cat;
    });
    var head = el('div', 'cv-phead',
      '<div class="cv-search"><span class="material-symbols-rounded">search</span><input id="cv-q" type="search" placeholder="Buscar tipo de actividad…" aria-label="Buscar bloque"></div>' +
      '<div class="cv-chips" id="cv-cats"><button type="button" class="on" data-c="all">Todo</button><button type="button" data-c="basico">Básicos</button><button type="button" data-c="interactivo">Interactivos</button><button type="button" data-c="etapas">Por etapa</button></div>' +
      '<p class="cv-tip">Pulsa o <b>arrastra</b> un bloque a la tira de abajo.</p>');
    pal.insertBefore(head, pal.firstChild);
    function filtrar() {
      var q = ($('cv-q').value || '').toLowerCase().trim(), c = pal.querySelector('#cv-cats .on').dataset.c;
      pal.querySelectorAll('.block-btn').forEach(function (b) {
        var ok = (c === 'all' || b.dataset.cat === c) && (!q || b.textContent.toLowerCase().indexOf(q) > -1);
        b.style.display = ok ? '' : 'none';
      });
    }
    $('cv-q').addEventListener('input', filtrar);
    $('cv-cats').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; $('cv-cats').querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); }); filtrar(); });
    pal.querySelectorAll('.block-btn').forEach(function (b) { b.setAttribute('tabindex', '0'); b.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); b.click(); } }); });
  }

  /* ── 3. Tira de diapositivas ── */
  var COLORES = ['#5B14C8', '#FF8A00', '#16A34A', '#2E8BFF', '#E23B5A', '#0E9AA7'];
  function resumen(b) {
    try {
      if (b.tipo === 'test') return (b.preguntas || []).length + ' pregunta(s)';
      if (b.tipo === 'texto') return String(b.contenido || '').replace(/[#*_>-]/g, '').trim().slice(0, 34) || 'Sin texto';
      if (b.tipo === 'sopa_letras') return (b.palabras || []).filter(Boolean).length + ' palabras';
      if (b.tipo === 'relacionar') return (b.pares || []).length + ' parejas';
      if (b.tipo === 'ordenar') return (b.items || []).filter(Boolean).length + ' pasos';
      if (b.tipo === 'completar') return (b.frases || []).length + ' frase(s)';
      if (b.tipo === 'calculo_mental') return (b.sumas || []).length + ' operaciones';
    } catch (e) {}
    return '';
  }
  function pintarTira() {
    var strip = $('cv-strip'), bl = B(), T = TIPOSX(); if (!strip) return;
    var h = '';
    bl.forEach(function (b, i) {
      if (b.tipo === 'problemas') return;
      var t = T[b.tipo] || { ico: 'extension', nombre: b.tipo };
      var title = esc2(b.titulo || t.nombre);
      h += '<div class="cv-card' + (i === sel ? ' on' : '') + '" draggable="true" data-i="' + i + '" style="--c:' + COLORES[i % COLORES.length] + '" tabindex="0" role="button" aria-label="Diapositiva ' + (i + 1) + ': ' + title + '">' +
        '<span class="cv-n">' + (i + 1) + '</span><span class="cv-ci material-symbols-rounded">' + esc2(t.ico) + '</span>' +
        '<span class="cv-ct">' + title + '</span><span class="cv-cs">' + esc2(resumen(b)) + '</span>' +
        '<span class="cv-acts"><button type="button" data-a="dup" title="Duplicar"><span class="material-symbols-rounded">content_copy</span></button><button type="button" data-a="del" title="Borrar"><span class="material-symbols-rounded">delete</span></button></span></div>';
    });
    h += '<button type="button" class="cv-add" id="cv-add" title="Añadir bloque"><span class="material-symbols-rounded">add</span><span>Añadir</span></button>';
    strip.innerHTML = h;
  }
  function initTira() {
    var strip = $('cv-strip');
    strip.addEventListener('click', function (e) {
      if (e.target.closest('#cv-add')) { var q = $('cv-q'); q.focus(); q.scrollIntoView({ block: 'center', behavior: 'smooth' }); return; }
      var card = e.target.closest('.cv-card'); if (!card) return; var i = +card.dataset.i, a = e.target.closest('[data-a]');
      if (a && a.dataset.a === 'dup') return duplicar(i);
      if (a && a.dataset.a === 'del') return borrar(i);
      seleccionar(i);
    });
    strip.addEventListener('keydown', function (e) { var c = e.target.closest('.cv-card'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); seleccionar(+c.dataset.i); } });
    strip.addEventListener('dragstart', function (e) { var c = e.target.closest('.cv-card'); if (!c) return; e.dataTransfer.setData('text/pj-idx', c.dataset.i); e.dataTransfer.effectAllowed = 'move'; c.classList.add('drag'); });
    strip.addEventListener('dragend', function (e) { var c = e.target.closest('.cv-card'); if (c) c.classList.remove('drag'); });
  }
  function posDesde(e) {
    var cards = Array.prototype.slice.call($('cv-strip').querySelectorAll('.cv-card')), pos = cards.length;
    for (var k = 0; k < cards.length; k++) { var r = cards[k].getBoundingClientRect(); if (e.clientX < r.left + r.width / 2) { pos = +cards[k].dataset.i; break; } }
    return pos;
  }
  function soltar(e, pos) {
    e.preventDefault();
    var from = e.dataTransfer.getData('text/pj-idx');
    if (from !== '' && from != null && pos != null) { reordenar(+from, pos); return; }
    var tipo = e.dataTransfer.getData('text/plain'), bl = B();
    if (tipo && TIPOSX()[tipo]) {
      // studio.js ya añade el bloque al final si se suelta en #canvas; aquí lo gestionamos nosotros
      var nb = nuevoBloque(tipo); var at = pos == null ? bl.length : Math.max(0, Math.min(pos, bl.length));
      bl.splice(at, 0, nb); sel = at; selForced = true; render();
    }
  }
  function reordenar(from, to) {
    var bl = B(); if (from === to || from + 1 === to) return;
    var b = bl.splice(from, 1)[0]; if (to > from) to--; bl.splice(to, 0, b); sel = to; selForced = true; render();
  }
  function duplicar(i) { var bl = B(); if (!bl[i]) return; bl.splice(i + 1, 0, JSON.parse(JSON.stringify(bl[i]))); sel = i + 1; selForced = true; render(); aviso2('Diapositiva duplicada'); }
  function borrar(i) { var bl = B(); if (!bl[i]) return; selForced = true; borrarBloque(i); sel = Math.max(0, Math.min(sel, B().length - 1)); selForced = true; aviso2('Diapositiva borrada · Ctrl+Z para deshacer'); }
  function seleccionar(i) { sel = i; sync(); }

  /* ── 4. Inspector ── */
  function pintarInspector() {
    var head = $('cv-insp-head'), body = $('cv-insp-body'), bl = B(), T = TIPOSX(), b = bl[sel];
    if (!b) { head.innerHTML = '<div class="cv-ih-t"><span class="material-symbols-rounded">palette</span><b>Propiedades</b></div>'; body.innerHTML = '<p class="cv-hint">Elige o añade un bloque para personalizarlo aquí.</p>'; return; }
    var t = T[b.tipo] || { ico: 'extension', nombre: b.tipo };
    head.innerHTML = '<div class="cv-ih-t"><span class="cv-ih-i material-symbols-rounded">' + esc2(t.ico) + '</span><div><b>' + esc2(t.nombre) + '</b><small>Diapositiva ' + (sel + 1) + ' de ' + bl.length + '</small></div></div>' +
      '<div class="cv-ih-a"><button type="button" id="ih-up" title="Mover antes"><span class="material-symbols-rounded">arrow_back</span></button><button type="button" id="ih-dn" title="Mover después"><span class="material-symbols-rounded">arrow_forward</span></button><button type="button" id="ih-dup" title="Duplicar"><span class="material-symbols-rounded">content_copy</span></button><button type="button" id="ih-del" class="danger" title="Borrar"><span class="material-symbols-rounded">delete</span></button></div>';
    $('ih-up').onclick = function () { if (sel > 0) { moverBloque(sel, -1); sel--; } };
    $('ih-dn').onclick = function () { if (sel < B().length - 1) { moverBloque(sel, 1); sel++; } };
    $('ih-dup').onclick = function () { duplicar(sel); };
    $('ih-del').onclick = function () { borrar(sel); };
    var blocks = document.querySelectorAll('#canvas > .block'), blk = blocks[sel], bd = blk && blk.querySelector('.block-body');
    body.innerHTML = '';
    if (bd) body.appendChild(bd); else body.innerHTML = '<p class="cv-hint">Sin opciones para este bloque.</p>';
  }

  /* ── 5. Vista previa en vivo (se renderiza a tamaño real y se escala para caber) ── */
  var DIM = { movil: [390, 780], tablet: [820, 620], pc: [1120, 700] };
  function ajustar() {
    var st = $('cv-stage'), dv = $('cv-device'), f = $('cv-prev'); if (!st || !dv || !f) return;
    var d = DIM[device] || DIM.movil, w = st.clientWidth - 36, h = st.clientHeight - 36;
    var s = Math.max(.2, Math.min(w / d[0], h / d[1], 1.15));
    f.style.width = d[0] + 'px'; f.style.height = d[1] + 'px'; f.style.transform = 'scale(' + s + ')'; f.style.transformOrigin = '0 0';
    dv.style.width = Math.round(d[0] * s) + 'px'; dv.style.height = Math.round(d[1] * s) + 'px';
  }
  function actividad() {
    var g = function (id) { var e = $(id); return e ? (e.value || '').trim() : ''; }, m = (function () { try { return meta; } catch (e) { return {}; } })();
    return { id: 'preview-' + Date.now(), _preview: true, titulo: g('m-titulo') || m.titulo || 'Mi actividad', descripcion: g('m-descripcion') || m.descripcion || '', categoria: g('m-categoria') || m.categoria || 'General', edad_recomendada: g('m-edad') || m.edad || '6-12', dificultad: g('m-dificultad') || m.dificultad || 'media', contenido: { version: 2, bloques: JSON.parse(JSON.stringify(B())) } };
  }
  function programar() { clearTimeout(tPrev); tPrev = setTimeout(function () { pintarPrev(); snap(); }, 650); }
  function pintarPrev() {
    var f = $('cv-prev'), bl = B(), empty = $('cv-empty'), dev = $('cv-device');
    if (!f) return;
    if (!bl.length) { dev.style.display = 'none'; empty.style.display = 'grid'; return; }
    dev.style.display = ''; empty.style.display = 'none'; ajustar();
    try { var j = JSON.stringify(actividad()); sessionStorage.setItem('pj-preview-activity', j); localStorage.setItem('pj-preview-activity', j); } catch (e) {}
    f.src = 'preview.html?embed=1&start=' + sel + '&t=' + Date.now();
    var c = $('cv-count'); if (c) c.textContent = 'Diapositiva ' + (sel + 1) + ' de ' + bl.length;
  }

  /* ── 6. Estado vacío con plantillas ── */
  function pintarVacio() {
    var e = $('cv-empty'); if (!e || e.dataset.ok) return; e.dataset.ok = 1;
    e.innerHTML = '<div class="cv-welcome"><div class="cv-w-emoji">🎨</div><h2>Crea tu actividad</h2><p>Arrastra un bloque desde la izquierda, pulsa uno, o empieza con una plantilla:</p>' +
      '<div class="cv-tpls"><button type="button" data-t="quiz"><b>📝 Quiz rápido</b><small>Texto + test de 3 preguntas</small></button><button type="button" data-t="juego"><b>🧩 Juego variado</b><small>Relacionar, ordenar y completar</small></button><button type="button" data-t="vacio"><b>✨ En blanco</b><small>Empieza por un test</small></button></div></div>';
    e.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-t]'); if (!b) return; var bl = B(), t = b.dataset.t;
      function add(tipo, f) { var x = nuevoBloque(tipo); if (f) f(x); bl.push(x); }
      if (t === 'quiz') { add('texto', function (x) { x.titulo = 'Aprende'; x.contenido = '# Título del tema\nEscribe aquí la explicación para el alumnado.\n- Primer punto\n- Segundo punto'; }); add('test', function (x) { x.preguntas = [1, 2, 3].map(function (n) { return { pregunta: 'Pregunta ' + n, opciones: ['Opción A', 'Opción B', 'Opción C', 'Opción D'], correcta: 0, imagen_url: null, imagen_alt: null, fuente: null }; }); }); }
      else if (t === 'juego') { add('relacionar'); add('ordenar'); add('completar'); }
      else add('test');
      sel = 0; selForced = true; render();
    });
  }

  /* ── 7. Historial (deshacer / rehacer) ── */
  function estado() { try { return JSON.stringify({ b: B(), m: meta }); } catch (e) { return ''; } }
  function snap() {
    if (restoring) return; var s = estado(); if (!s || s === lastSnap) return;
    hist = hist.slice(0, hpos + 1); hist.push(s); if (hist.length > 80) hist.shift(); hpos = hist.length - 1; lastSnap = s; botonesH();
  }
  function aplicar(s) {
    restoring = true;
    try { var o = JSON.parse(s), bl = B(); bl.length = 0; o.b.forEach(function (x) { bl.push(x); }); try { Object.keys(meta).forEach(function (k) { delete meta[k]; }); Object.assign(meta, o.m); } catch (e) {} lastSnap = s; sel = Math.max(0, Math.min(sel, bl.length - 1)); render(); } catch (e) {}
    restoring = false; botonesH();
  }
  function undo() { if (hpos > 0) { hpos--; aplicar(hist[hpos]); } }
  function redo() { if (hpos < hist.length - 1) { hpos++; aplicar(hist[hpos]); } }
  function botonesH() { var u = $('cv-undo'), r = $('cv-redo'); if (u) u.disabled = hpos <= 0; if (r) r.disabled = hpos >= hist.length - 1; }

  /* ── 8. Sincronización tras cada render() de studio.js ── */
  function sync() {
    var bl = B(), n = bl.length;
    if (n > lastLen && !selForced && !restoring) sel = n - 1;
    selForced = false; lastLen = n; sel = Math.max(0, Math.min(sel, n - 1));
    pintarTira(); pintarInspector(); clearTimeout(tPrev); tPrev = setTimeout(function () { pintarPrev(); snap(); }, 120);
    var cv = $('cv'); if (cv) cv.classList.toggle('sin-bloques', !n);
  }
  var selForced = false;

  function atajos() {
    document.addEventListener('keydown', function (e) {
      var t = e.target, enCampo = t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable);
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'z' && !enCampo) { e.preventDefault(); undo(); }
      else if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z')) && !enCampo) { e.preventDefault(); redo(); }
      else if (!enCampo && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') { e.preventDefault(); duplicar(sel); }
      else if (!enCampo && e.key === 'Delete') { borrar(sel); }
      else if (!enCampo && e.key === 'ArrowRight' && sel < B().length - 1) seleccionar(sel + 1);
      else if (!enCampo && e.key === 'ArrowLeft' && sel > 0) seleccionar(sel - 1);
    });
  }

  function iniciar() {
    if (!montar()) return;
    pintarVacio(); initTira(); atajos();
    window.addEventListener('resize', ajustar); try { new ResizeObserver(ajustar).observe($('cv-stage')); } catch (e) {}
    var canvas = $('canvas');
    new MutationObserver(function () { sync(); }).observe(canvas, { childList: true });
    lastLen = B().length; sel = 0; sync(); snap();
    // evita el doble alta de studio.js cuando se suelta sobre el lienzo oculto
    canvas.addEventListener('drop', function (e) { e.stopImmediatePropagation(); }, true);
  }
  window.addEventListener('load', function () { setTimeout(iniciar, 0); });
})();
