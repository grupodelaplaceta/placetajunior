/* Retos Code · editor visual de misiones de bloques (tipo Scratch)
   Guarda en la biblioteca de este dispositivo (ver assets/code-tablero.js).
   Sin dependencias; todo el texto de usuario se escapa al pintar. */
(function () {
  'use strict';

  var R = window.PJRetos;
  var MAX_EJ = 12;
  var $ = function (id) { return document.getElementById(id); };
  var esc = R.esc;

  var estado = { conjunto: null, sel: 0, tool: 'inicio', dir: 'derecha', pintando: false, modo: null };

  /* ── Datos ─────────────────────────────────────────────────────── */

  function nuevoEjercicio(n) {
    return {
      identificador: 'RET-' + String(n).padStart(3, '0'),
      etapa: 'Primaria',
      dificultad: 'Inicial',
      titulo: 'Reto ' + n,
      explicacion: '',
      objetivo_texto: '',
      bloques_permitidos: ['avanzar'],
      escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] },
      inicio: { x: 0, y: 0, direccion: 'derecha' },
      objetivo: { posicion: { x: 5, y: 0 } },
      pistas: []
    };
  }

  function nuevoConjunto() {
    return {
      id: 'conj-' + Date.now().toString(36),
      titulo: 'Misiones sin título',
      updatedAt: new Date().toISOString(),
      ejercicios: [nuevoEjercicio(1)]
    };
  }

  function ejercicio() { return estado.conjunto.ejercicios[estado.sel]; }

  function guardarConjunto(mensaje) {
    var l = R.lista().filter(function (c) { return c.id !== estado.conjunto.id; });
    estado.conjunto.updatedAt = new Date().toISOString();
    l.unshift(estado.conjunto);
    try {
      R.guardarLista(l);
      mostrarEstado(mensaje || 'Cambios guardados en este dispositivo.', 'ok');
    } catch (e) {
      mostrarEstado('No se pudo guardar en este navegador. Revisa el espacio disponible.', 'error');
    }
  }

  function cambio(mensaje) {
    guardarConjunto(mensaje);
    renderTablero();
    renderLista();
    renderValidacion();
  }

  function mostrarEstado(texto, tipo) {
    var el = $('reto-estado');
    el.textContent = texto;
    el.className = 'retos-estado' + (tipo ? ' ' + tipo : '');
  }

  /* ── Tablero ───────────────────────────────────────────────────── */

  function hay(lista, x, y) {
    return (lista || []).some(function (p) { return p.x === x && p.y === y; });
  }
  function sinCelda(lista, x, y) {
    return (lista || []).filter(function (p) { return !(p.x === x && p.y === y); });
  }

  // Aplica la herramienta a una casilla. modo: 'alternar' | 'poner' | 'quitar' (para arrastrar)
  function pintar(x, y, modo) {
    var ex = ejercicio();
    var esc_ = ex.escenario;
    var tool = estado.tool;
    if (tool === 'inicio') {
      ex.inicio = { x: x, y: y, direccion: estado.dir };
      esc_.obstaculos = sinCelda(esc_.obstaculos, x, y);
      esc_.monedas = sinCelda(esc_.monedas, x, y);
    } else if (tool === 'meta') {
      ex.objetivo.posicion = { x: x, y: y };
      esc_.obstaculos = sinCelda(esc_.obstaculos, x, y);
    } else if (tool === 'moneda') {
      if (ex.inicio.x === x && ex.inicio.y === y) return mostrarEstado('Esa casilla es de Candela.', 'error');
      var tieneMoneda = hay(esc_.monedas, x, y);
      if ((modo === 'alternar' && tieneMoneda) || modo === 'quitar') esc_.monedas = sinCelda(esc_.monedas, x, y);
      else if (!tieneMoneda) { esc_.monedas.push({ x: x, y: y }); esc_.obstaculos = sinCelda(esc_.obstaculos, x, y); }
    } else if (tool === 'obstaculo') {
      if (ex.inicio.x === x && ex.inicio.y === y) return mostrarEstado('Esa casilla es de Candela. Mueve Candela antes.', 'error');
      if (ex.objetivo.posicion && ex.objetivo.posicion.x === x && ex.objetivo.posicion.y === y) return mostrarEstado('Esa casilla es la meta. Mueve la meta antes.', 'error');
      var tieneRoca = hay(esc_.obstaculos, x, y);
      if ((modo === 'alternar' && tieneRoca) || modo === 'quitar') esc_.obstaculos = sinCelda(esc_.obstaculos, x, y);
      else if (!tieneRoca) { esc_.obstaculos.push({ x: x, y: y }); esc_.monedas = sinCelda(esc_.monedas, x, y); }
    } else if (tool === 'borrar') {
      esc_.obstaculos = sinCelda(esc_.obstaculos, x, y);
      esc_.monedas = sinCelda(esc_.monedas, x, y);
    }
    sincronizarMonedas();
    cambio();
  }

  // Si el objetivo exige monedas, la cuenta sigue al número de monedas pintadas
  function sincronizarMonedas() {
    var ex = ejercicio();
    if (ex.objetivo.monedas !== undefined) ex.objetivo.monedas = ex.escenario.monedas.length;
  }

  function renderTablero() {
    var ex = ejercicio();
    var w = ex.escenario.ancho, h = ex.escenario.alto;
    var tab = $('tablero');
    tab.style.setProperty('--cols', w);
    tab.style.setProperty('--rows', h);
    var html = '';
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var clases = ['retos-celda'];
        var simbolo = '';
        var etiqueta = 'Casilla ' + (x + 1) + ', ' + (y + 1);
        if (hay(ex.escenario.obstaculos, x, y)) { clases.push('roca'); etiqueta += ', roca'; }
        if (hay(ex.escenario.monedas, x, y)) { clases.push('moneda'); etiqueta += ', moneda'; }
        if (ex.objetivo.posicion && ex.objetivo.posicion.x === x && ex.objetivo.posicion.y === y) { clases.push('meta'); etiqueta += ', meta'; }
        if (ex.inicio.x === x && ex.inicio.y === y) {
          clases.push('candela');
          etiqueta += ', Candela mira ' + ex.inicio.direccion;
          simbolo = '<span class="retos-flecha ' + esc(ex.inicio.direccion) + '" aria-hidden="true"></span>';
        }
        html += '<button type="button" class="' + clases.join(' ') + '" data-x="' + x + '" data-y="' + y + '" aria-label="' + esc(etiqueta) + '">' + simbolo + '</button>';
      }
    }
    tab.innerHTML = html;
    $('tam-ancho').textContent = w;
    $('tam-alto').textContent = h;
    document.querySelectorAll('[data-dir]').forEach(function (b) {
      var on = b.dataset.dir === ex.inicio.direccion;
      b.classList.toggle('activa', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-tool]').forEach(function (b) {
      var on = b.dataset.tool === estado.tool;
      b.classList.toggle('activa', on);
      b.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }

  function celdaDesdeEvento(e) {
    var el = document.elementFromPoint(e.clientX, e.clientY);
    var celda = el && el.closest ? el.closest('.retos-celda') : null;
    if (!celda) return null;
    return { x: Number(celda.dataset.x), y: Number(celda.dataset.y) };
  }

  function iniciarPintura(e) {
    var c = celdaDesdeEvento(e);
    if (!c) return;
    estado.pintando = true;
    var ex = ejercicio();
    // En arrastre: el modo se decide por la primera casilla (poner o quitar)
    estado.modo = (estado.tool === 'obstaculo') ? (hay(ex.escenario.obstaculos, c.x, c.y) ? 'quitar' : 'poner')
      : (estado.tool === 'moneda') ? (hay(ex.escenario.monedas, c.x, c.y) ? 'quitar' : 'poner')
      : 'alternar';
    pintar(c.x, c.y, estado.modo);
  }

  function continuarPintura(e) {
    if (!estado.pintando) return;
    if (estado.tool !== 'obstaculo' && estado.tool !== 'moneda' && estado.tool !== 'borrar') return;
    var c = celdaDesdeEvento(e);
    if (c) pintar(c.x, c.y, estado.tool === 'borrar' ? 'quitar' : estado.modo);
  }

  function terminarPintura() { estado.pintando = false; estado.modo = null; }

  function cambiarTamano(eje, delta) {
    var ex = ejercicio();
    var clave = eje === 'ancho' ? 'ancho' : 'alto';
    var nuevo = Math.max(3, Math.min(10, ex.escenario[clave] + delta));
    if (nuevo === ex.escenario[clave]) return;
    ex.escenario[clave] = nuevo;
    // Lo que queda fuera del tablero se recoloca o se quita
    var w = ex.escenario.ancho, h = ex.escenario.alto;
    var dentro = function (p) { return p.x < w && p.y < h; };
    ex.escenario.obstaculos = ex.escenario.obstaculos.filter(dentro);
    ex.escenario.monedas = ex.escenario.monedas.filter(dentro);
    if (ex.inicio.x >= w || ex.inicio.y >= h) ex.inicio = { x: 0, y: 0, direccion: ex.inicio.direccion };
    if (ex.objetivo.posicion && (ex.objetivo.posicion.x >= w || ex.objetivo.posicion.y >= h)) {
      ex.objetivo.posicion = { x: w - 1, y: h - 1 };
    }
    sincronizarMonedas();
    cambio('Tablero de ' + w + ' × ' + h + '.');
  }

  /* ── Lista de retos ────────────────────────────────────────────── */

  function renderLista() {
    var cont = $('lista-retos');
    cont.innerHTML = estado.conjunto.ejercicios.map(function (ex, i) {
      var sel = i === estado.sel;
      var problemas = validarEjercicio(ex).filter(function (p) { return p.nivel === 'error'; }).length;
      return '<li class="retos-item' + (sel ? ' activo' : '') + '">' +
        '<button type="button" class="retos-item-abrir" data-abrir="' + i + '" aria-current="' + (sel ? 'true' : 'false') + '">' +
          '<span class="retos-mini-svg">' + R.miniTablero(ex, { alt: 'Miniatura del reto ' + (i + 1) }) + '</span>' +
          '<span class="retos-item-texto"><strong>' + (i + 1) + '. ' + esc(ex.titulo || 'Reto sin título') + '</strong>' +
          '<small>' + esc(R.resumen(ex)) + '</small>' +
          (problemas ? '<em class="retos-item-aviso">Revisa este reto</em>' : '') + '</span>' +
        '</button>' +
        '<span class="retos-item-acciones">' +
          '<button type="button" class="retos-mini-btn" data-mover="' + i + '" data-dir="-1" aria-label="Subir reto" ' + (i === 0 ? 'disabled' : '') + '>↑</button>' +
          '<button type="button" class="retos-mini-btn" data-mover="' + i + '" data-dir="1" aria-label="Bajar reto" ' + (i === estado.conjunto.ejercicios.length - 1 ? 'disabled' : '') + '>↓</button>' +
          '<button type="button" class="retos-mini-btn" data-duplicar="' + i + '" aria-label="Duplicar reto">⧉</button>' +
          '<button type="button" class="retos-mini-btn peligro" data-quitar="' + i + '" aria-label="Quitar reto">×</button>' +
        '</span>' +
      '</li>';
    }).join('');
    $('reto-add').disabled = estado.conjunto.ejercicios.length >= MAX_EJ;
  }

  /* ── Bloques, objetivo y textos ────────────────────────────────── */

  function iconoBloque(id) {
    var info = R.BLOQUES[id];
    var svg = (typeof CODE_ICONOS_SVG !== 'undefined' && CODE_ICONOS_SVG[info.icono]) ? CODE_ICONOS_SVG[info.icono] : '';
    return '<svg class="retos-blk-icono" viewBox="0 0 16 16" aria-hidden="true">' + svg + '</svg>';
  }

  function renderBloques() {
    var ex = ejercicio();
    var grupos = ['mov', 'ctl', 'snd'];
    $('bloques').innerHTML = grupos.map(function (g) {
      var ids = Object.keys(R.BLOQUES).filter(function (id) { return R.BLOQUES[id].grupo === g; });
      return '<fieldset class="retos-grupo" style="--grupo:' + R.GRUPO[g].color + '">' +
        '<legend>' + esc(R.GRUPO[g].nombre) + '</legend>' +
        '<div class="retos-bloques-lista">' + ids.map(function (id) {
          var on = ex.bloques_permitidos.indexOf(id) !== -1;
          return '<label class="retos-bloque' + (on ? ' on' : '') + '">' +
            '<input type="checkbox" data-bloque="' + id + '"' + (on ? ' checked' : '') + ' />' +
            '<span class="retos-bloque-pieza">' + iconoBloque(id) + '<span>' + esc(R.BLOQUES[id].nombre) + '</span></span>' +
          '</label>';
        }).join('') + '</div></fieldset>';
    }).join('');

    var select = $('obj-usar');
    var permitidos = ex.bloques_permitidos;
    select.innerHTML = '<option value="">Ninguno</option>' + permitidos.map(function (id) {
      return '<option value="' + id + '">' + esc(R.BLOQUES[id].nombre) + '</option>';
    }).join('');
    var usar = (ex.objetivo.debe_usar || [])[0] || '';
    select.value = permitidos.indexOf(usar) !== -1 ? usar : '';

    $('obj-pasos').value = ex.objetivo.max_pasos || 0;
    $('obj-monedas').checked = ex.objetivo.monedas !== undefined;
    $('ex-titulo').value = ex.titulo || '';
    $('ex-mision').value = ex.objetivo_texto || '';
    $('ex-pista').value = ex.explicacion || '';
    $('ex-etapa').value = ex.etapa || 'Primaria';
    $('ex-dificultad').value = ex.dificultad || 'Inicial';
    $('reto-titulo').value = estado.conjunto.titulo || '';
    $('reto-select').value = estado.conjunto.id;
  }

  function cambiarBloque(id, activo) {
    var ex = ejercicio();
    if (activo) {
      if (ex.bloques_permitidos.indexOf(id) === -1) ex.bloques_permitidos.push(id);
    } else {
      if (ex.bloques_permitidos.length <= 1) {
        renderBloques();
        return mostrarEstado('Debe quedar al menos un bloque permitido.', 'error');
      }
      ex.bloques_permitidos = ex.bloques_permitidos.filter(function (b) { return b !== id; });
      if ((ex.objetivo.debe_usar || []).indexOf(id) !== -1) delete ex.objetivo.debe_usar;
    }
    renderBloques();
    cambio();
  }

  function cambiarObjetivo() {
    var ex = ejercicio();
    var pasos = Math.max(0, Math.min(200, parseInt($('obj-pasos').value, 10) || 0));
    if (pasos > 0) ex.objetivo.max_pasos = pasos; else delete ex.objetivo.max_pasos;
    var usar = $('obj-usar').value;
    if (usar) ex.objetivo.debe_usar = [usar]; else delete ex.objetivo.debe_usar;
    ex.objetivo.monedas = $('obj-monedas').checked ? ex.escenario.monedas.length : undefined;
    if (ex.objetivo.monedas === undefined) delete ex.objetivo.monedas;
    cambio('Objetivo actualizado.');
  }

  function cambiarTextos() {
    var ex = ejercicio();
    ex.titulo = $('ex-titulo').value.trim();
    ex.objetivo_texto = $('ex-mision').value.trim();
    ex.explicacion = $('ex-pista').value.trim();
    ex.etapa = $('ex-etapa').value;
    ex.dificultad = $('ex-dificultad').value;
    estado.conjunto.titulo = $('reto-titulo').value.trim() || 'Misiones sin título';
    cambio();
  }

  /* ── Validación ────────────────────────────────────────────────── */

  // Búsqueda de camino libre entre Candela y la meta (4 direcciones, sin obstáculos).
  // Con «avanzar» y giros, cualquier casilla libre alcanzable es válida.
  function hayCamino(ex) {
    var w = ex.escenario.ancho, h = ex.escenario.alto;
    var inicio = ex.inicio, meta = ex.objetivo.posicion;
    if (!meta) return false;
    var seen = {}, cola = [[inicio.x, inicio.y]];
    seen[inicio.x + ',' + inicio.y] = true;
    var deltas = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    while (cola.length) {
      var p = cola.shift();
      if (p[0] === meta.x && p[1] === meta.y) return true;
      deltas.forEach(function (d) {
        var nx = p[0] + d[0], ny = p[1] + d[1];
        var k = nx + ',' + ny;
        if (nx < 0 || ny < 0 || nx >= w || ny >= h || seen[k] || hay(ex.escenario.obstaculos, nx, ny)) return;
        seen[k] = true;
        cola.push([nx, ny]);
      });
    }
    return false;
  }

  function validarEjercicio(ex) {
    var out = [];
    var w = ex.escenario.ancho, h = ex.escenario.alto;
    var meta = ex.objetivo.posicion;
    if (!meta) out.push({ nivel: 'error', texto: 'Falta la meta. Elige la herramienta Meta y toca una casilla.' });
    if (meta && meta.x === ex.inicio.x && meta.y === ex.inicio.y) out.push({ nivel: 'error', texto: 'Candela y la meta están en la misma casilla.' });
    if (meta && hayCamino(ex) === false && ex.bloques_permitidos.indexOf('avanzar') !== -1) {
      out.push({ nivel: 'error', texto: 'No hay camino libre hasta la meta con las rocas que has puesto.' });
    }
    if (ex.bloques_permitidos.length === 0) out.push({ nivel: 'error', texto: 'Elige al menos un bloque.' });
    if (ex.objetivo.debe_usar && ex.bloques_permitidos.indexOf(ex.objetivo.debe_usar[0]) === -1) {
      out.push({ nivel: 'error', texto: 'El bloque obligatorio no está entre los permitidos.' });
    }
    if (ex.objetivo.monedas !== undefined && ex.escenario.monedas.length === 0) {
      out.push({ nivel: 'aviso', texto: 'El objetivo pide monedas, pero no hay ninguna pintada.' });
    }
    if (!ex.objetivo_texto) out.push({ nivel: 'aviso', texto: 'Escribe la misión que verá el alumnado.' });
    if (ex.inicio.x >= w || ex.inicio.y >= h) out.push({ nivel: 'error', texto: 'Candela está fuera del tablero.' });
    return out;
  }

  function renderValidacion() {
    var ex = ejercicio();
    var problemas = validarEjercicio(ex);
    var cont = $('validacion');
    if (!problemas.length) {
      cont.innerHTML = '<p class="retos-val ok">Este reto está listo para jugarse.</p>';
      return;
    }
    cont.innerHTML = '<ul class="retos-val-lista">' + problemas.map(function (p) {
      return '<li class="' + p.nivel + '">' + esc(p.texto) + '</li>';
    }).join('') + '</ul>';
  }

  /* ── Conjuntos (biblioteca) ────────────────────────────────────── */

  function renderSelect() {
    var l = R.lista();
    var opciones = l.map(function (c) {
      return '<option value="' + esc(c.id) + '">' + esc(c.titulo || 'Sin título') + ' · ' + c.ejercicios.length + ' reto(s)</option>';
    });
    if (!l.some(function (c) { return c.id === estado.conjunto.id; })) {
      opciones.unshift('<option value="' + esc(estado.conjunto.id) + '">Conjunto nuevo (sin guardar aún)</option>');
    }
    $('reto-select').innerHTML = opciones.join('');
    $('reto-select').value = estado.conjunto.id;
  }

  function abrirConjunto(id) {
    var l = R.lista();
    var c = l.filter(function (x) { return x.id === id; })[0];
    if (!c) { estado.conjunto = nuevoConjunto(); }
    else { estado.conjunto = JSON.parse(JSON.stringify(c)); }
    estado.sel = 0;
    estado.tool = 'inicio';
    renderTodo();
  }

  function renderTodo() {
    renderSelect();
    renderLista();
    renderTablero();
    renderBloques();
    renderValidacion();
  }

  /* ── Vista previa como alumno (reproductor real) ───────────────── */

  function probar() {
    var ex = ejercicio();
    var problemas = validarEjercicio(ex).filter(function (p) { return p.nivel === 'error'; });
    if (problemas.length) return mostrarEstado('Antes de probar, corrige: ' + problemas[0].texto, 'error');
    var actividad = {
      id: 'prueba-' + estado.conjunto.id,
      titulo: estado.conjunto.titulo || 'Retos Code',
      tipo: 'code_blocks',
      contenido: { tipo: 'code_blocks', ejercicios: JSON.parse(JSON.stringify(estado.conjunto.ejercicios)) }
    };
    try {
      sessionStorage.setItem('pj-preview-activity', JSON.stringify(actividad));
    } catch (e) {
      return mostrarEstado('No se pudo preparar la vista previa en este navegador.', 'error');
    }
    window.open('/preview.html?tipo=code', '_blank', 'noopener');
  }

  /* ── Eventos ───────────────────────────────────────────────────── */

  function eventos() {
    var tab = $('tablero');
    tab.addEventListener('pointerdown', function (e) { e.preventDefault(); iniciarPintura(e); });
    tab.addEventListener('pointermove', continuarPintura);
    document.addEventListener('pointerup', terminarPintura);
    document.addEventListener('pointercancel', terminarPintura);

    // Tecla Enter/espacio sobre una casilla: pinta la casilla enfocada (accesible)
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var celda = e.target.closest('.retos-celda');
      if (!celda) return;
      e.preventDefault();
      pintar(Number(celda.dataset.x), Number(celda.dataset.y), 'alternar');
    });

    document.querySelectorAll('[data-tool]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.tool = b.dataset.tool;
        renderTablero();
      });
    });
    document.querySelectorAll('[data-dir]').forEach(function (b) {
      b.addEventListener('click', function () {
        estado.dir = b.dataset.dir;
        var ex = ejercicio();
        ex.inicio = { x: ex.inicio.x, y: ex.inicio.y, direccion: estado.dir };
        cambio('Dirección de Candela cambiada.');
      });
    });
    document.querySelectorAll('[data-size]').forEach(function (b) {
      b.addEventListener('click', function () { cambiarTamano(b.dataset.size, Number(b.dataset.delta)); });
    });

    $('lista-retos').addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      var c = estado.conjunto;
      if (t.dataset.abrir !== undefined) { estado.sel = Number(t.dataset.abrir); estado.tool = 'inicio'; renderTodo(); return; }
      if (t.dataset.mover !== undefined) {
        var i = Number(t.dataset.mover), j = i + Number(t.dataset.dir);
        if (j < 0 || j >= c.ejercicios.length) return;
        var tmp = c.ejercicios[i]; c.ejercicios[i] = c.ejercicios[j]; c.ejercicios[j] = tmp;
        estado.sel = j;
        return cambio('Orden de los retos actualizado.');
      }
      if (t.dataset.duplicar !== undefined) {
        if (c.ejercicios.length >= MAX_EJ) return mostrarEstado('Un conjunto admite hasta 12 retos.', 'error');
        var copia = JSON.parse(JSON.stringify(c.ejercicios[Number(t.dataset.duplicar)]));
        copia.titulo = (copia.titulo || 'Reto') + ' (copia)';
        c.ejercicios.splice(Number(t.dataset.duplicar) + 1, 0, copia);
        estado.sel = Number(t.dataset.duplicar) + 1;
        return cambio('Reto duplicado.');
      }
      if (t.dataset.quitar !== undefined) {
        if (c.ejercicios.length <= 1) return mostrarEstado('Un conjunto necesita al menos un reto.', 'error');
        if (!window.confirm('¿Quitar este reto del conjunto?')) return;
        c.ejercicios.splice(Number(t.dataset.quitar), 1);
        estado.sel = Math.max(0, Math.min(estado.sel, c.ejercicios.length - 1));
        return cambio('Reto quitado.');
      }
    });

    $('reto-add').addEventListener('click', function () {
      var c = estado.conjunto;
      if (c.ejercicios.length >= MAX_EJ) return mostrarEstado('Un conjunto admite hasta 12 retos.', 'error');
      c.ejercicios.push(nuevoEjercicio(c.ejercicios.length + 1));
      estado.sel = c.ejercicios.length - 1;
      estado.tool = 'inicio';
      cambio('Reto añadido.');
      renderBloques();
    });

    $('bloques').addEventListener('change', function (e) {
      var t = e.target;
      if (t && t.dataset && t.dataset.bloque) cambiarBloque(t.dataset.bloque, t.checked);
    });
    ['obj-pasos', 'obj-usar', 'obj-monedas'].forEach(function (id) { $(id).addEventListener('change', cambiarObjetivo); });
    ['ex-titulo', 'ex-mision', 'ex-pista', 'ex-etapa', 'ex-dificultad', 'reto-titulo'].forEach(function (id) {
      $(id).addEventListener('change', cambiarTextos);
    });

    $('reto-select').addEventListener('change', function () { abrirConjunto($('reto-select').value); });
    $('reto-nuevo').addEventListener('click', function () {
      estado.conjunto = nuevoConjunto();
      estado.sel = 0; estado.tool = 'inicio';
      guardarConjunto('Conjunto nuevo creado.');
      renderTodo();
    });
    $('reto-guardar').addEventListener('click', function () { guardarConjunto('Conjunto guardado.'); renderSelect(); });
    $('reto-borrar').addEventListener('click', function () {
      if (!window.confirm('¿Borrar este conjunto de este dispositivo? No se puede deshacer.')) return;
      var id = estado.conjunto.id;
      R.guardarLista(R.lista().filter(function (c) { return c.id !== id; }));
      var restantes = R.lista();
      if (restantes.length) abrirConjunto(restantes[0].id);
      else { estado.conjunto = nuevoConjunto(); guardarConjunto('Conjunto nuevo creado.'); renderTodo(); }
      mostrarEstado('Conjunto borrado.', 'ok');
    });
    $('reto-probar').addEventListener('click', probar);
  }

  /* ── Arranque ──────────────────────────────────────────────────── */

  function arrancar() {
    var params = new URLSearchParams(window.location.search);
    var l = R.lista();
    var id = params.get('conjunto') || (l[0] && l[0].id);
    if (id && l.some(function (c) { return c.id === id; })) {
      estado.conjunto = JSON.parse(JSON.stringify(l.filter(function (c) { return c.id === id; })[0]));
    } else {
      estado.conjunto = nuevoConjunto();
      guardarConjunto('Conjunto nuevo creado.');
    }
    eventos();
    renderTodo();
    mostrarEstado(estado.conjunto.ejercicios.length ? 'Pinta el tablero y elige los bloques. Se guarda solo.' : '', '');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrancar);
  else arrancar();
})();
