const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const jsDir = path.join(root, 'public', 'js', 'actividades');
const tipos = [
  'geometria',
  'dinero',
  'vertical',
  'abaco',
  'calculo_mental',
  'horas',
  'dados',
  'tesoro',
  'simetria_dibujo',
  'patron_visual',
  'batalla',
  'tangram'
];

function cargarMotor() {
  const listeners = {};
  const context = {
    console,
    document: {
      addEventListener(nombre, callback) { listeners[nombre] = callback; },
      querySelector() { return null; }
    },
    localStorage: { getItem: () => JSON.stringify({ idioma: 'es' }) },
    pantallaIdx: 0,
    kpScore: { verdes: 0, rojos: 0 }
  };
  context.window = context;
  vm.createContext(context);

  for (const file of ['i18n.js', 'core.js', 'matematicas.js', 'retos.js']) {
    vm.runInContext(fs.readFileSync(path.join(jsDir, file), 'utf8'), context, { filename: file });
  }
  return context;
}

test('Primaria Nueva registra y reproduce todos sus tipos', () => {
  const context = cargarMotor();
  const motor = context.PJPNueva;
  const bloques = [
    { tipo: 'geometria', datos: { modo: 'identificar', cantidad: 2 } },
    { tipo: 'dinero', datos: { modo: 'contar', cantidad: 2 } },
    { tipo: 'vertical', datos: { operacion: '+', cantidad: 2, nivel: 1 } },
    { tipo: 'abaco', datos: { modo: 'poner', columnas: 3, cantidad: 2 } },
    { tipo: 'calculo_mental', datos: { cantidad: 2, nivel: 1 } },
    { tipo: 'horas', datos: { modo: 'leer', cantidad: 2 } },
    { tipo: 'dados', datos: { operacion: 'suma', cantidad: 2 } },
    { tipo: 'tesoro', datos: { modo: 'pista', cantidad: 2 } },
    { tipo: 'simetria_dibujo', datos: { cantidad: 2 } },
    { tipo: 'patron_visual', datos: { cantidad: 2 } },
    { tipo: 'batalla', datos: { nivel: 1 } },
    { tipo: 'tangram', datos: { modo: 'completar', cantidad: 2 } }
  ];

  assert.deepEqual([...motor.TIPOS].sort(), [...tipos].sort());
  for (const bloque of bloques) {
    const pantallas = motor.crear(bloque);
    assert.ok(pantallas.length > 0, `${bloque.tipo} debe crear pantallas`);
    const html = motor.render(pantallas[0].s, pantallas[0].e);
    assert.match(html, /class="kp-screen pn-screen"/, `${bloque.tipo} debe tener una vista`);
    assert.ok(motor.texto(pantallas[0].s), `${bloque.tipo} debe exponer texto accesible`);
  }
});

test('las nuevas actividades adaptan sus componentes a pantallas estrechas', () => {
  const css = fs.readFileSync(path.join(root, 'public', 'css', 'actividades', 'primaria-nueva.css'), 'utf8');
  const jugar = fs.readFileSync(path.join(root, 'public', 'jugar.html'), 'utf8');
  const preview = fs.readFileSync(path.join(root, 'public', 'preview.html'), 'utf8');
  const sw = fs.readFileSync(path.join(root, 'public', 'sw.js'), 'utf8');

  assert.match(css, /@media\s*\(max-width:\s*600px\)/);
  assert.match(css, /\.pn-screen\s*\{[^}]*min-width:\s*0/);
  assert.match(css, /\.pn-screen \.pn-vrow\s*\{[^}]*minmax\(38px,\s*1fr\)/);
  assert.match(css, /\.pn-screen \.pn-clockwrap:has\([^}]*grid-template-columns:\s*minmax\(0,\s*1fr\)/);
  assert.match(css, /\.pn-screen \.pn-keys\s*\{[^}]*minmax\(0,\s*1fr\)/);
  assert.match(jugar, /primaria-nueva\.css\?v=20261028-responsive/);
  assert.match(preview, /primaria-nueva\.css\?v=20261028-responsive/);
  assert.match(sw, /placetajunior-assets-v12/);
});

test('el editor del Studio configura todos los tipos nuevos', () => {
  const studio = fs.readFileSync(path.join(root, 'public', 'studio-creadores.js'), 'utf8');
  for (const tipo of tipos) {
    assert.match(studio, new RegExp(`\\['${tipo}',`), `${tipo} debe estar en la paleta activa`);
    assert.match(studio, new RegExp(`\\b${tipo}: \\{`), `${tipo} debe tener datos iniciales`);
    assert.match(studio, new RegExp(`block\\.tipo === '${tipo}'`), `${tipo} debe tener controles visuales`);
  }
});

test('el tipo horas respeta las horas y ejercicios que define el docente', () => {
  const motor = cargarMotor().PJPNueva;
  const leer = motor.crear({ tipo: 'horas', datos: { modo: 'leer', ejercicios: [{ hora: '16:30' }] } })[0].s;
  assert.equal(leer.h, 4);
  assert.equal(leer.m, 30);
  assert.equal(leer.sol, '4:30');

  const poner = motor.crear({ tipo: 'horas', datos: { modo: 'poner', ejercicios: [{ hora: '09:15' }] } })[0].s;
  assert.equal(poner.h, 9);
  assert.equal(poner.m, 15);
  assert.equal(poner.sol, '9:15');

  const sumar = motor.crear({ tipo: 'horas', datos: { modo: 'sumar', ejercicios: [{ hora: '16:30', duracion: 30 }] } })[0].s;
  assert.equal(sumar.sol, '17:00');

  const duracion = motor.crear({ tipo: 'horas', datos: { modo: 'duracion', ejercicios: [{ inicio: '23:30', fin: '00:30' }] } })[0].s;
  assert.equal(duracion.start, 1410);
  assert.equal(duracion.end, 1470);
});

test('horas usa el diseño de reloj elegido y mide figuras rectangulares', () => {
  const motor = cargarMotor().PJPNueva;
  for (const reloj of ['analogico', 'digital', 'ambos']) {
    const task = motor.crear({ tipo: 'horas', datos: { modo: 'leer', reloj, ejercicios: [{ hora: '16:30' }] } })[0];
    assert.equal(task.s.reloj, reloj);
    const html = motor.render(task.s, task.e);
    assert.equal(html.includes('class="pn-clock"'), reloj !== 'digital');
    assert.equal(html.includes('pn-digital-clock'), reloj !== 'analogico');
    assert.equal(task.s.sol, reloj === 'analogico' ? '4:30' : '16:30');
  }
  const context = cargarMotor(), digital = context.PJPNueva.crear({ tipo: 'horas', datos: { modo: 'poner', reloj: 'digital', ejercicios: [{ hora: '16:30' }] } })[0];
  context.pantallas = [{ ...digital.s, tipo: 'pn-nueva' }];
  context.kpEstado = [{ ...digital.e }];
  context.renderPantalla = () => {};
  context.mostrarFeedback = () => {};
  for (let i = 0; i < 16; i++) context.PJPNCore.act.hr_adj(0, 'h+');
  for (let i = 0; i < 6; i++) context.PJPNCore.act.hr_adj(0, 'm+');
  context.PJPNCore.act.hr_chk(0);
  assert.equal(context.kpEstado[0].respondida, true);

  const [area, perimeter] = motor.crear({ tipo: 'geometria', datos: { modo: 'medir', ejercicios: [
    { ancho: 5, alto: 3, medida: 'area' },
    { ancho: 5, alto: 3, medida: 'perimetro' }
  ] } });
  assert.equal(area.s.sol, '15');
  assert.equal(perimeter.s.sol, '16');
  assert.match(motor.render(area.s, area.e), /geo/);
});

test('los retos con dados usan operaciones y caras configuradas', () => {
  const motor = cargarMotor().PJPNueva;
  const tasks = motor.crear({ tipo: 'dados', datos: { dados: 3, ejercicios: [
    { caras: [3, 5], operacion: 'suma' },
    { caras: [6, 2], operacion: 'resta' },
    { caras: [4, 3], operacion: 'multiplicacion' }
  ] } });
  assert.deepEqual([...tasks.map(task => task.s.sol)], ['8', '4', '12']);
  assert.match(motor.render(tasks[0].s, tasks[0].e), /pn-die/);
});

test('el mapa del tesoro admite dibujar y ejecutar un recorrido sobre las casillas', () => {
  const context = cargarMotor();
  const task = context.PJPNueva.crear({ tipo: 'tesoro', datos: { modo: 'dibujar', cantidad: 1 } })[0];
  assert.match(context.PJPNueva.render(task.s, task.e), /data-pn="te_drawcell"/);
  context.pantallas = [{ ...task.s, tipo: 'pn-nueva' }];
  context.kpEstado = [{ ...task.e }];
  context.renderPantalla = () => {};
  context.mostrarFeedback = () => {};
  const actions = context.PJPNCore.act;
  let x = task.s.S.x, y = task.s.S.y;
  for (const move of task.s.moves) {
    for (let step = 0; step < move.n; step++) {
      if (move.d === 'e') x++;
      else if (move.d === 'o') x--;
      else if (move.d === 's') y++;
      else y--;
      actions.te_drawcell(0, `${x},${y}`);
    }
  }
  actions.te_run(0);
  assert.equal(context.kpEstado[0].respondida, true);
});

test('las sumas y restas de varias cifras se resuelven columna a columna', () => {
  const context = cargarMotor();
  const motor = context.PJPNueva;
  const exercises = [
    { a: 12345, b: 6789, op: '+' },
    { a: 70002, b: 39875, op: '-' },
    { a: 100000, b: 1, op: '-' },
    { a: 99999, b: 99999, op: '+' }
  ];

  for (const exercise of exercises) {
    const spec = motor.crear({ tipo: 'vertical', datos: { ejercicios: [exercise] } })[0];
    context.pantallas = [{ ...spec.s, tipo: 'pn-nueva' }];
    context.kpEstado = [{ ...spec.e }];
    context.renderPantalla = () => {};
    context.mostrarFeedback = () => {};
    const state = context.kpEstado[0];
    const actions = context.PJPNCore.act;
    for (let column = 0; column < spec.s.W; column++) {
      if (spec.s.CO[column] && column + 1 < spec.s.W) {
        actions.v_sel(0, 'c');
        actions.v_dig(0, 1);
      }
      actions.v_sel(0, 'r');
      if (spec.s.R[column] !== null) actions.v_dig(0, spec.s.R[column]);
      actions.v_chk(0);
    }
    assert.equal(state.respondida, true, `${exercise.a} ${exercise.op} ${exercise.b} should be solvable`);
    assert.equal(spec.s.sol, String(exercise.op === '+' ? exercise.a + exercise.b : exercise.a - exercise.b));
  }
});

test('las claves traducibles de actividades existen en español, catalán e inglés', () => {
  const context = cargarMotor();
  const translations = context.PJPNI.T;
  const expected = Object.keys(translations.es).sort();
  assert.deepEqual(Object.keys(translations.ca).sort(), expected);
  assert.deepEqual(Object.keys(translations.en).sort(), expected);
});

test('las modalidades de Primaria generan fichas imprimibles específicas', () => {
  const app = fs.readFileSync(path.join(root, 'public', 'js', 'app.js'), 'utf8');
  const start = app.indexOf('function fichaPrimariaPdf(b, h) {');
  const end = app.indexOf('\n}\n\nfunction mostrarSelectorPdf', start);
  assert.ok(start >= 0 && end > start, 'debe encontrar el generador de fichas');
  const source = app.slice(start, end + 2) + '\nthis.renderPdf = fichaPrimariaPdf;';
  const context = {
    esc(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
  };
  vm.runInNewContext(source, context);
  const render = context.renderPdf;
  const helpers = { wsImg: () => '', textoPdf: value => String(value) };
  const types = ['horas', 'geometria', 'dados', 'dinero', 'vertical', 'abaco', 'calculo_mental', 'tesoro', 'simetria_dibujo', 'patron_visual', 'batalla', 'tangram'];
  for (const tipo of types) assert.match(render({ tipo }, helpers), /class="ws-sec"/, `${tipo} debe imprimir contenido propio`);
  assert.match(render({ tipo: 'horas', reloj: 'digital', modo: 'leer', ejercicios: [{ hora: '16:30' }] }, helpers), /16:30/);
  assert.match(render({ tipo: 'geometria', modo: 'medir', ejercicios: [{ ancho: 5, alto: 3, medida: 'area' }] }, helpers), /cm²/);
  assert.match(render({ tipo: 'dados', ejercicios: [{ caras: [3, 5], operacion: 'suma' }] }, helpers), / = __________/);
});

test('las modalidades nuevas están declaradas en Primaria y en el Studio', () => {
  const context = {};
  context.window = context;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'public', 'js', 'modalidades.js'), 'utf8'), context);
  const catalogo = context.PJModalidades.catalogo.primaria.tipos;

  for (const tipo of tipos) {
    assert.ok(catalogo.includes(tipo), `${tipo} debe estar en el catálogo`);
  }
});

test('el reloj clásico convierte una hora de 24 horas a su esfera analógica', () => {
  const window = {};
  const document = { getElementById: () => null, createElement: () => ({}), head: { appendChild() {} } };
  const context = { window, document, console, Math, Set, Array, Object, String, Number, JSON, Date, setTimeout, clearTimeout, setInterval, clearInterval };
  vm.runInNewContext(fs.readFileSync(path.join(jsDir, 'primaria-clasica.js'), 'utf8'), context);
  const reloj = window.PJPrimaria.crear({ tipo: 'reloj', datos: { ejercicios: [{ hora: '16:30' }] } })[0].s;
  assert.equal(reloj.h, 4);
  assert.equal(reloj.mi, 30);
  assert.equal(reloj.cor, '4:30');
});

test('el cálculo mental antiguo conserva prioridad cuando tiene sumas explícitas', () => {
  const player = fs.readFileSync(path.join(root, 'public', 'js', 'player.js'), 'utf8');
  assert.match(player, /PJPNueva\.TIPOS\.has\(b\.tipo\).*?!\(b\.tipo === 'calculo_mental' && Array\.isArray\(b\.sumas\) && b\.sumas\.length\)/);
});
