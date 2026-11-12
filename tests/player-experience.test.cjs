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
  assert.match(read('public/sw.js'), /placetajunior-assets-v22/);
});

test('code blocks have an organized workbench and accessible edit controls', () => {
  const player = read('public/js/player.js');
  const styles = read('public/css/styles.css');
  assert.match(player, /code-palette-group/);
  assert.match(player, /kpCodeDeshacer/);
  assert.match(player, /className = 'cute-order'/);
  assert.match(player, /setAttribute\('aria-live', 'polite'\)/);
  assert.match(player, /if \(item\.op === 'girar'\)/);
  assert.match(player, /if \(item\.op === 'repetir'\)/);
  assert.match(styles, /\.code-workbench/);
  assert.match(styles, /@media \(max-width: 620px\)/);
  assert.match(styles, /prefers-reduced-motion: reduce/);
  const responsive = read('public/css/code-responsive.css');
  assert.match(responsive, /grid-template-areas:[\s\S]*?"scene workbench"/);
  assert.match(responsive, /@media \(min-width: 621px\) and \(max-width: 1079px\)/);
  assert.match(responsive, /@media \(max-width: 360px\)/);
  assert.match(read('public/jugar.html'), /player\.js\?v=touch-code-worksheets-1/);
  assert.match(read('public/preview.html'), /player\.js\?v=touch-code-worksheets-1/);
  assert.match(read('public/jugar.html'), /code-responsive\.css\?v=touch-code-worksheets-1/);
  assert.match(read('public/jugar.html'), /css\/code-responsive\.css/);
  assert.match(read('public/preview.html'), /css\/code-responsive\.css/);
});

test('Code supports touch and pen dragging blocks into the program without duplicate taps', () => {
  const player = read('public/js/player.js');
  assert.match(player, /\['touch', 'pen'\]\.includes\(event\.pointerType\)/);
  assert.match(player, /codeTouchDrag\.dragging = true/);
  assert.match(player, /elementFromPoint\(event\.clientX, event\.clientY\)\?\.closest\('#kp-code-programa'\)/);
  assert.match(player, /suppressCodeTouchClickUntil = Date\.now\(\) \+ 700/);
  assert.match(player, /stopImmediatePropagation\(\)/);
});
