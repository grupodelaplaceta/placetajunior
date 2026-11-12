const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const engineSource = fs.readFileSync(path.join(root, 'public/code/engine.js'), 'utf8');

function loadEngine() {
  const window = {};
  vm.runInNewContext(engineSource, { window });
  return window.PJCode;
}

test('Placeta Junior Code executes a 180-degree turn and exposes the block', () => {
  const code = loadEngine();
  const result = code.ejecutarCode(
    { ancho: 4, alto: 4 },
    { x: 2, y: 1, direccion: 'derecha' },
    [{ op: 'girar_180' }, { op: 'avanzar' }]
  );

  assert.equal(result.posicion_final.x, 1);
  assert.equal(result.posicion_final.y, 1);
  assert.equal(result.direccion_final, 'izquierda');
  assert.equal(result.pasos, 2);
  assert.ok(code.bloquesPermitidos({}, 0).includes('girar_180'));
});

test('SI NO executes the alternative branch when its condition is false', () => {
  const code = loadEngine();
  const result = code.ejecutarCode(
    { ancho: 4, alto: 4, obstaculos: [] },
    { x: 0, y: 0, direccion: 'derecha' },
    [{ op: 'si', condicion: 'obstaculo', bloques: [{ op: 'girar' }], bloques_no: [{ op: 'avanzar' }] }]
  );

  assert.equal(result.posicion_final.x, 1);
  assert.equal(result.posicion_final.y, 0);
  assert.equal(result.pasos, 1);
});

test('repeat collects a coin, reaches the goal and satisfies required-block goals', () => {
  const code = loadEngine();
  const scenario = { ancho: 6, alto: 2, monedas: [{ x: 1, y: 0 }] };
  const start = { x: 0, y: 0, direccion: 'derecha' };
  const objective = { posicion: { x: 3, y: 0 }, monedas: 1, max_pasos: 3, debe_usar: ['repetir'] };
  const program = [{ op: 'repetir', veces: 3, bloques: [{ op: 'avanzar' }] }];
  const result = code.ejecutarCode(scenario, start, program);

  assert.equal(result.posicion_final.x, 3);
  assert.equal(result.monedas_recogidas.length, 1);
  assert.equal(code.evaluarCode(scenario, start, objective, program, result).superado, true);
});

test('exercise normalization preserves challenge IDs and supplies stable fallbacks', () => {
  const code = loadEngine();
  const exercises = code.obtenerEjercicios({
    ejercicios: [{ identificador: 'PJC-042' }, {}],
  });

  assert.equal(exercises[0].identificador, 'PJC-042');
  assert.equal(exercises[1].identificador, 'PJC-002');
});

test('the Studio starter curriculum contains eight identified challenges', () => {
  const studio = fs.readFileSync(path.join(root, 'public/education/studio/studio.js'), 'utf8');
  for (let i = 1; i <= 8; i++) {
    assert.ok(studio.includes(`identificador: 'PJC-${String(i).padStart(3, '0')}'`));
  }
});
