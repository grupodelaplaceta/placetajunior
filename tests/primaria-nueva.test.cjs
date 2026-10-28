const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const jsDir = path.join(root, 'public', 'js');
const tipos = [
  'geometria',
  'dinero',
  'vertical',
  'abaco',
  'calculo_mental',
  'horas',
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

  for (const file of ['pn-i18n.js', 'pn-core.js', 'pn-tipos-a.js', 'pn-tipos-b.js']) {
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

test('el editor del Studio configura los once tipos nuevos', () => {
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
  vm.runInNewContext(fs.readFileSync(path.join(jsDir, 'primaria-juegos.js'), 'utf8'), context);
  const reloj = window.PJPrimaria.crear({ tipo: 'reloj', datos: { ejercicios: [{ hora: '16:30' }] } })[0].s;
  assert.equal(reloj.h, 4);
  assert.equal(reloj.mi, 30);
  assert.equal(reloj.cor, '4:30');
});

test('el cálculo mental antiguo conserva prioridad cuando tiene sumas explícitas', () => {
  const player = fs.readFileSync(path.join(root, 'public', 'js', 'player.js'), 'utf8');
  assert.match(player, /PJPNueva\.TIPOS\.has\(b\.tipo\).*?!\(b\.tipo === 'calculo_mental' && Array\.isArray\(b\.sumas\) && b\.sumas\.length\)/);
});
