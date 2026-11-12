const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('activities with units send users to the unit chooser instead of starting immediately', () => {
  const app = read('public/js/app.js');
  assert.ok(app.includes("tieneUnidades ? `verInfo('${a.id}')`"));
  assert.match(app, /detail-units-cta/);
  assert.match(app, /chooser: 'Escoger unidad'/);
  assert.match(app, /pjTextoUnidades\('chooser'\)/);
  assert.match(app, /id="detalle-unidades-tab" class="is-active"/);
  assert.match(app, /detail-panel-slides is-active/);
  assert.match(app, /playUnit: 'Jugar unidad \{n\}/);
  assert.match(app, /pjTextoUnidades\('playUnit'/);
});

test('player feedback is localized in Spanish, Catalan, English and Basque', () => {
  const player = read('public/js/player.js');
  for (const language of ['es', 'ca', 'en', 'eu']) {
    assert.match(player, new RegExp(`\\n  ${language}: \\{`));
  }
  assert.match(player, /function pjFeedbackIdioma\(\)/);
  assert.match(player, /t\.streak\.replace/);
  assert.match(player, /t\.answer\.replace/);
});

test('player icons render as inline SVG and the SVG assets are cached offline', () => {
  const icons = read('public/js/player-icons.js');
  assert.match(icons, /createElementNS\('http:\/\/www\.w3\.org\/2000\/svg', 'svg'\)/);
  assert.match(icons, /svg\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(icons, /observer\.observe\(document\.body/);
  assert.match(read('public/sw.js'), /placetajunior-assets-v17/);
});
