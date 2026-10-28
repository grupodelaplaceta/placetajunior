'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'devai.html'), 'utf8');

test('DevAI instruye a generar traducciones completas en el mismo JSON', () => {
  assert.match(html, /TRADUCCIONES:[\s\S]*`traducciones` en la raíz del JSON/);
  assert.match(html, /`ca` \(catalán\), `val` \(valenciano\) y `en` \(inglés\)/);
  assert.match(html, /misma estructura completa que la actividad original/);
});

test('DevAI conserva las traducciones raíz o anidadas al publicar', () => {
  assert.match(html, /const traducciones = obj\.traducciones \?\? contenido\.traducciones/);
  assert.match(html, /\.\.\.\(traducciones \? \{ traducciones \} : \{\}\)/);
  assert.match(html, /Puedes incluir `traducciones` \(ca, val y en\) en el mismo objeto/);
});

test('los scripts en línea de DevAI tienen sintaxis válida', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.ok(scripts.length > 0);
  for (const [, script] of scripts) assert.doesNotThrow(() => new Function(script));
});
