'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'devai.html'), 'utf8');

test('DevAI instruye a generar traducciones completas en el mismo JSON', () => {
  assert.match(html, /TRADUCCIONES:[\s\S]*`traducciones` en la raíz del JSON/);
  assert.match(html, /`ca` \(catalán\), `val` \(valenciano\) y `en` \(inglés\)/);
  assert.match(html, /misma estructura completa que la actividad original/);
});

test('DevAI conserva todas las traducciones raíz o anidadas al publicar', () => {
  assert.match(html, /const traducciones = \{\s*\.\.\.\(contenido\.traducciones \|\| \{\}\),\s*\.\.\.\(obj\.traducciones \|\| \{\}\)\s*\}/);
  assert.match(html, /if \(hayTraducciones\) contenido\.traducciones = traducciones/);
  assert.match(html, /\.\.\.\(hayTraducciones \? \{ traducciones \} : \{\}\)/);
  assert.match(html, /Puedes incluir `traducciones` \(ca, val y en\) en el mismo objeto/);
});

test('DevAI incluye Pensamiento computacional y sus nombres regionales en traducciones', () => {
  assert.match(html, /"categoria": "[^"]*Pensamiento computacional/);
  assert.match(html, /categoría `Pensamiento computacional`[\s\S]*`BOTXIFRA` en `ca`[\s\S]*`Pensament computacional` en `val`[\s\S]*`STEM` en `en`/);
  assert.match(html, /actividad educativa de Primaria que combina matemáticas, pensamiento lógico, informática y robótica/);
  assert.match(html, /<option>Pensamiento computacional<\/option>/);
});

test('DevAI ofrece una plantilla ejecutable de Placeta Junior Code para Primaria y Secundaria', () => {
  const start = html.indexOf('    function plantillaCode() {');
  const end = html.indexOf('    function plantillaPrim(tipo) {', start);
  assert.ok(start >= 0 && end > start, 'debe estar definida la plantilla antes de las plantillas de Primaria');
  assert.match(html, /onclick="plantillaCode\(\)">Placeta Junior Code · 8 retos/);
  assert.match(html, /href="\/edu\/studio">Abrir en Studio/);
  assert.match(html, /CODE_BLOCKS \(Placeta Junior Code\)[\s\S]*`bloques_no` \(rama SI NO\)/);

  const fields = Object.fromEntries(['codigo', 'titulo', 'descripcion', 'categoria', 'edad', 'dificultad', 'tiempo']
    .map((id) => [id, { value: '', focus() {} }]));
  const context = { $, detectarCampos() {} };
  function $(id) { return fields[id]; }
  vm.runInNewContext(`${html.slice(start, end)}; plantillaCode();`, context);

  const activity = JSON.parse(fields.codigo.value);
  const block = activity.contenido.bloques[0];
  assert.equal(block.tipo, 'code_blocks');
  assert.equal(block.lenguaje, 'placeta_blocks');
  assert.equal(block.ejercicios.length, 8);
  assert.deepEqual(block.ejercicios.map((exercise) => exercise.identificador), [
    'PJC-001', 'PJC-002', 'PJC-003', 'PJC-004',
    'PJC-005', 'PJC-006', 'PJC-007', 'PJC-008'
  ]);
  assert.ok(block.ejercicios.some((exercise) => exercise.etapa === 'Primaria'));
  assert.ok(block.ejercicios.some((exercise) => exercise.etapa === 'Secundaria'));
  assert.ok(block.ejercicios[6].bloques_permitidos.includes('girar_180'));
  assert.equal(fields.categoria.value, 'Pensamiento computacional');

  const engineWindow = {};
  const engineSource = fs.readFileSync(path.join(__dirname, '..', 'public', 'code', 'engine.js'), 'utf8');
  vm.runInNewContext(engineSource, { window: engineWindow });
  const solutions = [
    [{ op: 'avanzar' }, { op: 'avanzar' }],
    [{ op: 'avanzar' }, { op: 'girar', dir: 'derecha' }, { op: 'avanzar' }],
    [{ op: 'girar', dir: 'derecha' }, { op: 'avanzar' }, { op: 'girar', dir: 'izquierda' }, { op: 'avanzar' }],
    [{ op: 'repetir', veces: 3, bloques: [{ op: 'avanzar' }] }],
    [{ op: 'si', condicion: 'obstaculo', bloques: [{ op: 'girar', dir: 'derecha' }, { op: 'avanzar' }] }],
    [{ op: 'si', condicion: 'moneda', bloques: [{ op: 'avanzar' }] }],
    [{ op: 'girar_180' }, { op: 'avanzar' }],
    [{ op: 'repetir', veces: 5, bloques: [{ op: 'avanzar' }] }]
  ];
  block.ejercicios.forEach((exercise, index) => {
    const result = engineWindow.PJCode.ejecutarCode(exercise.escenario, exercise.inicio, solutions[index]);
    const evaluation = engineWindow.PJCode.evaluarCode(exercise.escenario, exercise.inicio, exercise.objetivo, solutions[index], result);
    assert.equal(evaluation.superado, true, `${exercise.identificador}: ${evaluation.fallos.join('; ')}`);
  });
});

test('DevAI ofrece plantillas para las actividades matemáticas nuevas', () => {
  for (const tipo of ['geometria', 'dinero', 'vertical', 'abaco', 'calculo_mental', 'horas', 'dados', 'tesoro', 'simetria_dibujo', 'patron_visual', 'batalla', 'tangram']) {
    assert.match(html, new RegExp(`plantillaPrim\\('${tipo}'\\)`), `${tipo} debe tener una plantilla`);
  }
  assert.match(html, /preferencia de reloj "analogico", "digital" o "ambos"/);
  assert.match(html, /"dibujar"/);
});

test('los botones de DevAI no usan emojis como iconos', () => {
  const buttons = [...html.matchAll(/<button\b[^>]*>([\s\S]*?)<\/button>/g)].map(([, label]) => label);
  assert.ok(buttons.length > 0);
  for (const label of buttons) assert.doesNotMatch(label, /\p{Extended_Pictographic}/u);
});

test('los scripts en línea de DevAI tienen sintaxis válida', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0);
  for (const [, script] of scripts) assert.doesNotThrow(() => new Function(script));
});
