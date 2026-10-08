(function () {
  'use strict';

  const tipos = {
    mates_pixel: ['Pixel matemático', 'grid_view'],
    mates_balanza: ['Balanza', 'balance'],
    mates_arcade: ['Arcade de globos', 'sports_esports'],
    mates_rio: ['Salto del río', 'waves'],
    mates_monstruo: ['Monstruo glotón', 'sentiment_very_satisfied'],
    mates_fracciones: ['Ritmo de fracciones', 'music_note'],
    mates_estimacion: ['Estimación', 'my_location'],
    mates_ninja: ['Corte ninja', 'content_cut'],
    mates_robots: ['Robots matemáticos', 'smart_toy'],
    mates_slime: ['Matraz de slime', 'science'],
    mates_templo: ['Espejo del templo', 'flare'],
    mates_topo: ['Mapa del tesoro', 'explore']
  };
  const paleta = { r: '#e5484d', y: '#ffd23f', b: '#42a5f5', g: '#4caf50', o: '#ff8a3d', p: '#8f7bff', w: '#e8eef5', '.': 'transparent' };
  const artePixel = ['...rr...', '..rwwr..', '..rwwr..', '..wbbw..', '..wwww..', '.rwwwwr.', 'rr.yy.rr', '...oo...'];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const datos = block => block.datos && typeof block.datos === 'object' ? { ...block, ...block.datos } : block;
  const num = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const round1 = value => Math.round(value * 10) / 10;
  const resultadoOperacion = item => {
    const a = num(item.a, 0), b = num(item.b, 0), op = String(item.op || item.operacion || '+').toLowerCase();
    if (item.respuesta != null) return Number(item.respuesta);
    if (item.resultado != null) return Number(item.resultado);
    if (op === '×' || op === '*' || op.includes('multip')) return a * b;
    if (op === '÷' || op === '/' || op.includes('divi')) return b ? a / b : 0;
    if (op === '−' || op === '-' || op.includes('rest')) return a - b;
    return a + b;
  };
  const textoOperacion = item => `${item.a} ${item.op || item.operacion || '+'} ${item.b}`;
  const preguntaBase = (count, d) => Array.from({ length: count }, (_, index) => {
    const a = 2 + ((index * 3 + 2) % 9), b = 2 + ((index * 5 + 1) % 8), op = index % 2 ? '×' : '+';
    return { a, b, op, correcta: op === '×' ? a * b : a + b, texto: `${a} ${op} ${b}` };
  });
  function crearEstado(block) {
    const d = datos(block), type = block.tipo;
    const state = { tipo: type, indice: 0, done: false, ganado: false, error: '', seleccion: [], actual: 0 };
    if (type === 'mates_pixel') state.operaciones = Array.isArray(d.operaciones) && d.operaciones.length ? d.operaciones : preguntaBase(8, d);
    if (type === 'mates_arcade') state.preguntas = Array.isArray(d.preguntas) && d.preguntas.length ? d.preguntas : preguntaBase(Math.max(1, Math.min(20, num(d.preguntasTotal, 8))), d);
    if (type === 'mates_rio') { state.inicio = num(d.inicio, 0); state.salto = Math.max(1, num(d.salto ?? d.regla, 5)); state.total = Math.max(1, Math.min(20, num(d.saltos, 8))); }
    if (type === 'mates_monstruo') state.objetivo = Math.max(1, num(d.objetivo, 47));
    if (type === 'mates_fracciones') { state.objetivo = `${num(d.numerador, 1)}/${Math.max(1, num(d.denominador, 1))}`; state.seleccion = []; }
    if (type === 'mates_estimacion') { state.objetivo = num(d.objetivo, 68); state.maximo = Math.max(1, num(d.maximo, 100)); state.margen = Math.max(0, num(d.margen, state.maximo * .05)); }
    if (type === 'mates_ninja') { state.objetivo = num(d.numerador, 1) / Math.max(1, num(d.denominador, 2)); state.margen = Math.max(1, num(d.margenPorcentaje, 5)); state.actual = 50; }
    if (type === 'mates_robots') { state.entrada = num(d.entrada, 7); state.salida = num(d.salida, 21); }
    if (type === 'mates_slime') { state.objetivo = round1(num(d.objetivoLitros ?? d.objetivo, 1.5)); state.actual = 0; }
    if (type === 'mates_templo') { state.objetivo = num(d.anguloObjetivo ?? d.objetivo, 45); state.actual = 0; }
    if (type === 'mates_topo') { state.columnas = Math.max(2, Math.min(10, num(d.columnas, 6))); state.filas = Math.max(2, Math.min(10, num(d.filas, 6))); state.columna = Math.max(1, Math.min(state.columnas, num(d.columna, 4))); state.fila = Math.max(1, Math.min(state.filas, num(d.fila, 3))); }
    return state;
  }
  function opcionesPregunta(question) {
    const answer = num(question.correcta, resultadoOperacion(question));
    return Array.isArray(question.opciones) && question.opciones.length ? question.opciones : [answer, answer + 1, Math.max(0, answer - 2)];
  }
  function opcionesNumeros(correct, list) {
    return Array.isArray(list) && list.length ? list : [correct, correct + 1, Math.max(0, correct - 2)];
  }
  function botonOpciones(blockIndex, values, action, selected) {
    return `<div class="pj-ma-options">${values.map((value, index) => `<button type="button" class="kp-opt${selected === index ? ' is-selected' : ''}" onclick="pjMatesResponder(${blockIndex},'${action}',${index})">${esc(value)}</button>`).join('')}</div>`;
  }
  function render(block, blockIndex, state) {
    const d = datos(block), type = block.tipo, meta = tipos[type];
    if (!meta) return '';
    let body = '';
    if (type === 'mates_pixel') {
      const task = state.operaciones[state.indice] || state.operaciones[state.operaciones.length - 1] || { a: 2, b: 2, op: '+', correcta: 4 };
      const solved = state.indice;
      const cells = artePixel.join('').split('').map((color, index) => `<span class="pj-ma-pixel${Math.floor(index / 8) < solved * 8 / state.operaciones.length ? ' is-lit' : ''}" style="--pixel:${paleta[color] || paleta['.']}"></span>`).join('');
      body = `<div class="pj-ma-pixel-grid" aria-label="Dibujo pixelado">${cells}</div><p>Resuelve para iluminar una fila · ${Math.min(state.indice, state.operaciones.length)} / ${state.operaciones.length}</p><div class="pj-ma-question">${esc(textoOperacion(task))} = ?</div>${botonOpciones(blockIndex, opcionesNumeros(resultadoOperacion(task), task.opciones), 'pixel', state.seleccion[0])}`;
    } else if (type === 'mates_balanza') {
      const left = Array.isArray(d.pesosIzquierda) ? d.pesosIzquierda : [3, 4];
      const total = left.reduce((sum, value) => sum + Number(value || 0), 0);
      body = `<div class="pj-ma-balance"><div>${left.map(value => `<span>${esc(value)}</span>`).join(' + ')} = ?</div><strong>⚖️</strong><p>Elige el peso que equilibra la balanza</p></div>${botonOpciones(blockIndex, opcionesNumeros(total, d.opciones), 'balance', state.seleccion[0])}`;
    } else if (type === 'mates_arcade') {
      const q = state.preguntas[state.indice] || state.preguntas[state.preguntas.length - 1];
      body = `<div class="pj-ma-hearts">❤️ ${Math.max(0, num(d.vidas, 3) - (state.fallos || 0))} <span>Ronda ${Math.min(state.indice + 1, state.preguntas.length)} / ${state.preguntas.length}</span></div><div class="pj-ma-balloon">${esc(q.texto || textoOperacion(q))}</div>${botonOpciones(blockIndex, opcionesPregunta(q), 'arcade', state.seleccion[0])}`;
    } else if (type === 'mates_rio') {
      const next = state.inicio + state.salto * (state.indice + 1);
      const values = [next, next + state.salto, Math.max(0, next - state.salto * 2), next + 1];
      body = `<p>Salta de ${state.salto} en ${state.salto}. ¿Qué piedra sigue?</p><div class="pj-ma-river">${Array.from({ length: 4 }, (_, index) => `<span>${index < 3 ? state.inicio + state.salto * Math.max(0, state.indice + index - 2) : '?'}</span>`).join('')}</div>${botonOpciones(blockIndex, [...new Set(values)], 'river', state.seleccion[0])}`;
    } else if (type === 'mates_monstruo') {
      const amount = state.actual;
      body = `<div class="pj-ma-monster">👾<strong>¡Tengo hambre de ${state.objetivo}!</strong><span>Le has dado ${amount}</span></div><div class="pj-ma-options">${[[100, 'Centena'], [10, 'Decena'], [1, 'Unidad']].map(([value, label]) => `<button type="button" class="kp-opt" onclick="pjMatesResponder(${blockIndex},'feed',${value})">${label} +${value}</button>`).join('')}</div><button type="button" class="kp-btn" onclick="pjMatesResponder(${blockIndex},'check')">Comprobar cantidad</button>`;
    } else if (type === 'mates_fracciones') {
      const units = Array.isArray(d.piezas) && d.piezas.length ? d.piezas : [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 1, d: 8 }];
      body = `<p>Completa ${state.objetivo} del compás. Puedes combinar piezas.</p><div class="pj-ma-fractions">${units.map((unit, index) => `<button type="button" class="pj-ma-fraction${state.seleccion.includes(index) ? ' is-selected' : ''}" onclick="pjMatesResponder(${blockIndex},'fraction',${index})"><span>${esc(unit.n)}/${esc(unit.d)}</span></button>`).join('')}</div><p>Piezas elegidas: ${state.seleccion.map(index => `${units[index].n}/${units[index].d}`).join(' + ') || 'ninguna'}</p><button class="kp-btn" type="button" onclick="pjMatesResponder(${blockIndex},'check')">Tocar compás</button>`;
    } else if (type === 'mates_estimacion') {
      body = `<p>Coloca el número ${state.objetivo} en la línea de 0 a ${state.maximo} (margen ±${state.margen}).</p><div class="pj-ma-ruler"><span>0</span><input data-pj-ma-value="${blockIndex}" type="range" min="0" max="${state.maximo}" value="${state.maximo / 2}" aria-label="Estimación"><span>${state.maximo}</span></div><button class="kp-btn" type="button" onclick="pjMatesResponder(${blockIndex},'estimate')">Lanzar</button>`;
    } else if (type === 'mates_ninja') {
      const percent = Math.max(10, Math.min(90, state.actual));
      body = `<p>Corta una parte que mida ${Math.round(state.objetivo * 100)}% de la figura.</p><div class="pj-ma-cut" style="--cut:${percent}%"><span></span><i></i></div><label>Parte que te llevas <input data-pj-ma-value="${blockIndex}" type="range" min="10" max="90" step="5" value="${percent}" aria-label="Tamaño de la parte cortada"></label><button class="kp-btn" type="button" onclick="pjMatesResponder(${blockIndex},'cut')">Cortar</button>`;
    } else if (type === 'mates_robots') {
      const chips = Array.isArray(d.chips) && d.chips.length ? d.chips : [{ label: '+14', op: '+', n: 14 }, { label: '×2', op: '×', n: 2 }, { label: '−3', op: '−', n: 3 }];
      body = `<div class="pj-ma-robot">${state.entrada}<span>→</span>${state.salida}</div><p>Elige el chip que hace llegar el número a la salida.</p><div class="pj-ma-options">${chips.map((chip, index) => `<button class="kp-opt" type="button" onclick="pjMatesResponder(${blockIndex},'robot',${index})">⚙️ ${esc(chip.label || `${chip.op}${chip.n}`)}</button>`).join('')}</div>`;
    } else if (type === 'mates_slime') {
      const percent = Math.min(100, state.actual / state.objetivo * 100);
      body = `<p>Llena el matraz hasta ${state.objetivo.toFixed(1)} L.</p><div class="pj-ma-flask"><span style="height:${percent}%"></span><strong>${state.actual.toFixed(1)} L</strong></div><div class="pj-ma-options">${[[0.1, '＋ 0,1 L'], [0.5, '＋ 0,5 L'], [1, '＋ 1 L']].map(([value, label]) => `<button class="kp-opt" type="button" onclick="pjMatesResponder(${blockIndex},'pour',${value})">${label}</button>`).join('')}</div><button class="kp-btn" type="button" onclick="pjMatesResponder(${blockIndex},'check')">Comprobar nivel</button>`;
    } else if (type === 'mates_templo') {
      const angles = Array.isArray(d.angulos) && d.angulos.length ? d.angulos : [0, 30, 45, 60, 90, 120, 135, 150];
      body = `<div class="pj-ma-mirror">🔦 <span>◈</span> 💎</div><p>Orienta el espejo al ángulo ${state.objetivo}° para que el rayo llegue a la joya.</p><div class="pj-ma-options">${angles.map((angle, index) => `<button class="kp-opt${state.seleccion[0] === index ? ' is-selected' : ''}" type="button" onclick="pjMatesResponder(${blockIndex},'angle',${index})">${esc(angle)}°</button>`).join('')}</div><button class="kp-btn" type="button" onclick="pjMatesResponder(${blockIndex},'temple')">Emitir luz</button>`;
    } else if (type === 'mates_topo') {
      const targetRow = state.filas - state.fila + 1;
      body = `<p>Encuentra el tesoro en columna ${state.columna}, fila ${state.fila}.</p><div class="pj-ma-map" style="--map-cols:${state.columnas}">${Array.from({ length: state.columnas * state.filas }, (_, index) => `<button type="button" aria-label="Columna ${index % state.columnas + 1}, fila ${state.filas - Math.floor(index / state.columnas)}" onclick="pjMatesResponder(${blockIndex},'map',${index})">${index % state.columnas + 1},${state.filas - Math.floor(index / state.columnas)}</button>`).join('')}</div>`;
    }
    const result = state.done ? `<div class="pj-ma-result ${state.ganado ? 'is-win' : 'is-loss'}"><strong>${state.ganado ? '¡Reto superado!' : 'Reto terminado'}</strong><span>${esc(state.error || (state.ganado ? 'Respuesta correcta.' : 'Prueba otra vez.'))}</span><button type="button" class="kp-btn" onclick="${state.ganado ? 'pantallaNext()' : `pjMatesReintentar(${blockIndex})`}">${state.ganado ? 'Continuar' : 'Intentarlo de nuevo'}</button></div>` : (state.error ? `<p class="pj-ma-error" role="status">${esc(state.error)}</p>` : '');
    return `<div class="kp-screen pj-ma-game"><div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">${meta[1]}</span> ${esc(block.titulo || meta[0])}</div>${body}${result}</div>`;
  }
  function responder(block, state, action, value) {
    if (!block || !state || state.done) return null;
    const d = datos(block), type = block.tipo;
    let correct = null;
    if (type === 'mates_pixel') {
      const q = state.operaciones[state.indice];
      correct = !!q && Number(opcionesNumeros(resultadoOperacion(q), q.opciones)[Number(value)]) === resultadoOperacion(q);
      if (correct && ++state.indice >= state.operaciones.length) complete(state, true);
    } else if (type === 'mates_balanza') {
      const target = (Array.isArray(d.pesosIzquierda) ? d.pesosIzquierda : [3, 4]).reduce((sum, item) => sum + Number(item || 0), 0);
      correct = Number(opcionesNumeros(target, d.opciones)[Number(value)]) === target;
      complete(state, correct);
    } else if (type === 'mates_arcade') {
      const q = state.preguntas[state.indice], options = opcionesPregunta(q);
      correct = Number(options[Number(value)]) === num(q.correcta, resultadoOperacion(q));
      if (correct) { state.indice++; if (state.indice >= state.preguntas.length) complete(state, true); }
      else { state.fallos = (state.fallos || 0) + 1; state.error = 'Ese globo no tiene el resultado. Prueba otro.'; if (state.fallos >= Math.max(1, num(d.vidas, 3))) complete(state, false, 'Se escaparon los globos.'); }
    } else if (type === 'mates_rio') {
      const expected = state.inicio + state.salto * (state.indice + 1), values = [...new Set([expected, expected + state.salto, Math.max(0, expected - state.salto * 2), expected + 1])];
      correct = Number(values[Number(value)]) === expected;
      if (correct) { state.indice++; if (state.indice >= state.total) complete(state, true); }
      else state.error = 'Plof. Esa piedra no sigue la regla; vuelve a intentarlo.';
    } else if (type === 'mates_monstruo') {
      if (action === 'feed') {
        state.actual += Number(value);
        if (state.actual > state.objetivo) { state.actual = 0; state.error = '¡Te pasaste! El monstruo vuelve a tener hambre.'; correct = false; }
        else if (state.actual === state.objetivo) { state.error = '¡Delicioso! Cantidad exacta.'; complete(state, true); correct = true; }
      } else { correct = state.actual === state.objetivo; if (correct) complete(state, true); else state.error = 'Aún no es la cantidad exacta.'; }
    } else if (type === 'mates_fracciones') {
      const parts = Array.isArray(d.piezas) && d.piezas.length ? d.piezas : [{ n: 1, d: 2 }, { n: 1, d: 4 }, { n: 1, d: 8 }];
      if (action === 'fraction') state.seleccion = state.seleccion.includes(Number(value)) ? state.seleccion.filter(index => index !== Number(value)) : [...state.seleccion, Number(value)];
      else {
        const target = num(d.numerador, 1) / Math.max(1, num(d.denominador, 2));
        const amount = state.seleccion.reduce((sum, index) => sum + num(parts[index]?.n, 0) / Math.max(1, num(parts[index]?.d, 1)), 0);
        correct = Math.abs(amount - target) < .001;
        if (correct) complete(state, true); else state.error = 'El compás aún no suma la fracción pedida.';
      }
    } else if (type === 'mates_estimacion') {
      const guess = Number(value);
      if (action !== 'estimate' || !Number.isFinite(guess)) return null;
      correct = Math.abs(guess - state.objetivo) <= state.margen;
      if (correct) complete(state, true); else state.error = `Te has quedado a ${Math.abs(guess - state.objetivo)} unidades.`;
    } else if (type === 'mates_ninja') {
      const guess = Number(value);
      if (action !== 'cut' || !Number.isFinite(guess)) return null;
      state.actual = guess;
      correct = Math.abs(guess / 100 - state.objetivo) <= state.margen / 100;
      if (correct) complete(state, true); else state.error = `El trozo mide ${guess}%; se pedía ${Math.round(state.objetivo * 100)}%.`;
    } else if (type === 'mates_robots') {
      const chips = Array.isArray(d.chips) && d.chips.length ? d.chips : [{ label: '+14', op: '+', n: 14 }, { label: '×2', op: '×', n: 2 }, { label: '−3', op: '−', n: 3 }], chip = chips[Number(value)];
      if (!chip) return null;
      const op = String(chip.op || '+'), n = Number(chip.n || chip.valor || 0);
      const result = op === '×' || op === '*' ? state.entrada * n : op === '−' || op === '-' ? state.entrada - n : op === '÷' || op === '/' ? state.entrada / n : state.entrada + n;
      correct = Math.abs(result - state.salida) < .001;
      if (correct) complete(state, true); else state.error = `Ese chip deja el resultado ${result}, no ${state.salida}.`;
    } else if (type === 'mates_slime') {
      if (action === 'pour') {
        state.actual = round1(state.actual + Number(value));
        if (state.actual > state.objetivo) { state.actual = 0; state.error = '¡Splat! Te pasaste y el matraz se vació.'; correct = false; }
      } else if (action === 'check') {
        correct = Math.abs(state.actual - state.objetivo) < .05;
        if (correct) complete(state, true); else state.error = state.actual < state.objetivo ? 'El slime pide más.' : 'Te has pasado.';
      }
    } else if (type === 'mates_templo') {
      if (action === 'angle') state.seleccion = [Number(value)];
      else if (action === 'temple') {
        const angles = Array.isArray(d.angulos) && d.angulos.length ? d.angulos : [0, 30, 45, 60, 90, 120, 135, 150];
        correct = Number(angles[state.seleccion[0]]) === state.objetivo;
        if (correct) complete(state, true); else state.error = 'El rayo rebota hacia otra pared. Ajusta el espejo.';
      }
    } else if (type === 'mates_topo') {
      const column = Number(value) % state.columnas + 1, row = state.filas - Math.floor(Number(value) / state.columnas);
      correct = column === state.columna && row === state.fila;
      if (correct) complete(state, true); else state.error = 'Casi. Busca otra casilla del mapa.';
    }
    if (correct === false) state.seleccion = [];
    return correct;
  }
  function complete(state, won, message) {
    state.done = true;
    state.ganado = !!won;
    state.error = message || (won ? '¡Reto superado!' : 'Inténtalo de nuevo.');
  }

  window.PJMatesAventura = { tipos, crearEstado, render, responder };
})();