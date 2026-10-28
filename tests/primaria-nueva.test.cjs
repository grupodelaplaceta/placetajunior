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

test('las modalidades nuevas están declaradas en Primaria y en el Studio', () => {
  const context = {};
  context.window = context;
  vm.runInNewContext(fs.readFileSync(path.join(root, 'public', 'js', 'modalidades.js'), 'utf8'), context);
  const catalogo = context.PJModalidades.catalogo.primaria.tipos;
  const studio = fs.readFileSync(path.join(root, 'public', 'js', 'studio.js'), 'utf8');
  const html = fs.readFileSync(path.join(root, 'public', 'studio.html'), 'utf8');

  for (const tipo of tipos) {
    assert.ok(catalogo.includes(tipo), `${tipo} debe estar en el catálogo`);
    assert.match(html, new RegExp(`data-tipo="${tipo}"`), `${tipo} debe estar en la paleta del Studio`);
    if (tipo !== 'calculo_mental') {
      assert.match(studio, new RegExp(`\\b${tipo}: \\{`), `${tipo} debe tener configuración de Studio`);
    }
  }
});

test('el cálculo mental antiguo conserva prioridad cuando tiene sumas explícitas', () => {
  const player = fs.readFileSync(path.join(root, 'public', 'js', 'player.js'), 'utf8');
  assert.match(player, /PJPNueva\.TIPOS\.has\(b\.tipo\).*?!\(b\.tipo === 'calculo_mental' && Array\.isArray\(b\.sumas\) && b\.sumas\.length\)/);
});
