const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('el editor de creación es la única ruta pública de Studio y redirige el acceso antiguo', () => {
  const config = JSON.parse(read('vercel.json'));
  assert.ok(config.routes.some((route) => route.src === '/crear-actividad' && route.dest === '/public/studio-creadores.html'));
  assert.ok(config.routes.some((route) => route.src === '/studio/?$' && route.status === 308 && route.headers.Location === '/crear-actividad'));
  assert.ok(config.routes.some((route) => route.src === '/studio.html' && route.status === 308 && route.headers.Location === '/crear-actividad'));
  assert.match(read('public/centros/panel.html'), /href="\/crear-actividad">Studio<\/a>/);
  assert.match(read('public/centros/panel.html'), /data-nav-add-center hidden/);
});

test('el lienzo y el borrador solo se inicializan tras verificar permisos activos', () => {
  const html = read('public/studio-creadores.html');
  const js = read('public/studio-creadores.js');
  assert.match(html, /id="creator-tools" hidden/);
  assert.match(html, /id="access-gate"/);
  assert.match(js, /data\.docenteAprobado === true/);
  assert.match(js, /org\.estado === 'activo' && String\(org\.rol\)\.toLowerCase\(\) === 'administrador'/);
  assert.ok(js.indexOf('if (!authorized) return;') < js.indexOf('loadDrafts();'));
  const handler = read('lib/centros/handlers.js');
  assert.match(handler, /docenteAprobado, solicitudes/);
  assert.match(handler, /res\.setHeader\('Cache-Control', 'no-store'\);\s+const u = await exigirUsuario\(req\)/);
});

test('el editor incluye cuatro plantillas y editor visual para tipos comunes', () => {
  const html = read('public/studio-creadores.html');
  const js = read('public/studio-creadores.js');
  assert.match(html, /class="studio-visual"/);
  assert.match(html, /data-nav-register/);
  assert.match(html, /data-nav-add-center hidden/);
  assert.match(html, /role="tablist"/);
  for (const view of ['activities', 'create', 'edit', 'guide']) assert.match(html, new RegExp(`data-studio-panel="${view}"`));
  for (const id of ['quiz', 'parejas', 'lectura', 'vocabulario']) assert.ok(js.includes(`id: '${id}'`));
  for (const id of ['texto', 'test', 'relacionar', 'completar', 'ordenar', 'sopa_letras']) assert.ok(js.includes(`['${id}'`));
  assert.match(html, /id="meta-title"/);
  assert.match(html, /id="preview-activity"/);
  assert.match(js, /data-add-row="preguntas"/);
  assert.match(js, /data-add-row="pares"/);
  assert.match(js, /template-art/);
  assert.match(js, /const DRAFTS_KEY = 'pj-studio-creadores-drafts-v1'/);
  assert.match(js, /scope: draftScope\(\)/);
  assert.match(js, /function renderSavedActivities\(\)/);
  assert.match(js, /function setAuthorScope\(value\)/);
  assert.match(js, /function deleteSavedDraft\(id\)/);
  assert.match(js, /function paintInspector\(\)[\s\S]*?inspector-type-card type-/);
});

test('el lienzo permite deshacer, rehacer, duplicar y mover bloques', () => {
  const html = read('public/studio-creadores.html');
  const js = read('public/studio-creadores.js');
  assert.match(html, /id="undo-action"/);
  assert.match(html, /id="redo-action"/);
  assert.match(js, /function restoreHistory\(index\)/);
  assert.match(js, /history\.length > 50/);
  assert.match(js, /function duplicateBlock\(index\)/);
  assert.match(js, /function moveBlock\(index, offset\)/);
  assert.match(js, /data-duplicate="\$\{index\}"/);
});

test('la vista previa se abre integrada y explica el acabado editorial', () => {
  const html = read('public/studio-creadores.html');
  const js = read('public/studio-creadores.js');
  const preview = read('public/preview.html');
  assert.match(html, /<dialog[^>]+id="preview-dialog"/);
  assert.match(html, /id="preview-frame"/);
  assert.match(html, /Placeta Junior se ocupa de la revisión editorial/);
  assert.match(html, /creamos una portada y las traducciones necesarias/);
  assert.match(js, /previewDialog\.showModal\(\)/);
  assert.match(js, /previewDialog\.addEventListener\('close', closePreview\)/);
  assert.doesNotMatch(js, /window\.open\('\/preview\.html'/);
  assert.match(preview, /document\.fonts\.load\('24px "Material Symbols Rounded"', 'home'\)\.then\(useIconFont, useIconFallbacks\)/);
  assert.match(preview, /iconFallbacks\[icon\.textContent\.trim\(\)\]/);
  assert.match(preview, /iconObserver\.observe\(document\.body/);
  assert.match(preview, /chevron_left: '‹', chevron_right: '›'/);
  assert.doesNotMatch(preview, /catch\(e\)\{clearInterval\(t\);d\.classList\.add\('ic-ok'\)\}/);
});

test('el portal educativo ofrece el editor en castellano, catalán e inglés', () => {
  const html = read('public/index.html');
  const pagina = html.slice(html.indexOf('function educacionPage()'), html.indexOf('function home()'));
  assert.match(pagina, /ac\('\/crear-actividad'/);
  assert.match(pagina, /Crear una actividad/);
  assert.match(pagina, /Crear una activitat/);
  assert.match(pagina, /Create an activity/);
  assert.match(pagina, /docentes aprobados y responsables de centros activos/);
});

test('el envío verifica en servidor el docente aprobado o el administrador del centro', () => {
  const handler = read('lib/centros/handlers.js');
  const api = read('api/centros.js');
  const js = read('public/studio-creadores.js');
  assert.match(api, /'crear-actividad': h\.crearActividad/);
  assert.match(handler, /tipo_centro=eq\.docente&estado=eq\.aprobada/);
  assert.match(handler, /centroAdministrador\(req, body\.orgId\)/);
  assert.match(handler, /tipo_titular: 'centro'/);
  assert.match(handler, /tipo_titular: 'profesor'/);
  assert.match(js, /fetch\('\/api\/creadores\/actividades'/);
  assert.match(js, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(js, /API_BASE/);
});