const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('el editor de creación es la única ruta pública de Studio y redirige el acceso antiguo', () => {
  const config = JSON.parse(read('vercel.json'));
  assert.ok(config.routes.some((route) => route.src === '/crear-actividad' && route.dest === '/public/education/studio/index.html'));
  assert.ok(config.routes.some((route) => route.src === '/studio/?$' && route.status === 308 && route.headers.Location === '/edu/studio'));
  assert.ok(config.routes.some((route) => route.src === '/studio.html' && route.status === 308 && route.headers.Location === '/edu/studio'));
  assert.match(read('public/education/centers/panel.html'), /href="\/edu\/studio">Studio<\/a>/);
  assert.match(read('public/education/centers/panel.html'), /data-nav-add-center hidden/);
});

test('el lienzo y el borrador solo se inicializan tras verificar permisos activos', () => {
  const html = read('public/education/studio/index.html');
  const js = read('public/education/studio/studio.js');
  assert.match(html, /id="creator-tools" hidden/);
  assert.match(html, /id="access-gate"/);
  assert.match(js, /data\.docenteAprobado === true/);
  assert.match(js, /org\.estado === 'activo' && String\(org\.rol\)\.toLowerCase\(\) === 'administrador'/);
  assert.ok(js.indexOf('if (!authorized) return;') < js.indexOf('loadDrafts();'));
  const handler = read('lib/education/centers/handlers.js');
  assert.match(handler, /docenteAprobado, solicitudes/);
  assert.match(handler, /res\.setHeader\('Cache-Control', 'no-store'\);\s+const u = await exigirUsuario\(req\)/);
});

test('la barra de dispositivos de la vista previa tiene el id que enlaza Studio', () => {
  const html = read('public/education/studio/index.html');
  const js = read('public/education/studio/studio.js');
  assert.match(html, /class="preview-device-options" id="preview-device-options"/);
  assert.match(js, /\$\('preview-device-options'\)\.addEventListener\('click'/);
});

test('el editor incluye cuatro plantillas y editor visual para tipos comunes', () => {
  const html = read('public/education/studio/index.html');
  const js = read('public/education/studio/studio.js');
  assert.match(html, /class="studio-visual"/);
  assert.match(html, /data-nav-register/);
  assert.match(html, /data-nav-add-center hidden/);
  assert.match(html, /role="tablist"/);
  for (const view of ['activities', 'create', 'edit', 'guide']) assert.match(html, new RegExp(`data-studio-panel="${view}"`));
  for (const id of ['quiz', 'parejas', 'lectura', 'vocabulario']) assert.ok(js.includes(`id: '${id}'`));
  for (const id of ['texto', 'test', 'relacionar', 'completar', 'ordenar', 'sopa_letras']) assert.ok(js.includes(`['${id}'`));
  for (const id of ['reloj', 'recta_numerica', 'grafico', 'balanza', 'ahorcado', 'anagrama', 'patrones', 'simetria', 'silabas', 'vf_rapido', 'ruleta_preguntas']) {
    assert.ok(js.includes(`${id}: {`), `Studio incluye ${id}`);
  }
  assert.match(js, /function paintPalette\(\)[\s\S]*?palette-search/);
  assert.match(js, /data-category="\$\{esc\(category\)\}"/);
  assert.match(read('public/js/player.js'), /window\.PJPrimaria && PJPrimaria\.TIPOS\.has\(b\.tipo\)/);
  assert.match(read('public/js/actividades/primaria-clasica.js'), /const TIPOS = new Set\(\['reloj', 'recta_numerica', 'grafico', 'balanza', 'ahorcado', 'anagrama', 'patrones', 'simetria', 'silabas', 'vf_rapido', 'ruleta_preguntas'\]\)/);
  assert.match(html, /id="meta-title"/);
  assert.match(html, /id="preview-activity"/);
  // Listas repetibles: el editor por esquema añade filas a partir de la ruta de cada lista
  assert.match(js, /data-add-row="\$\{esc\(ruta\)\}"/);
  assert.match(js, /preguntas: \(\) => \(\{ pregunta: ''/);
  assert.match(js, /pares: \(\) => \(\{ izq: ''/);
  assert.match(js, /template-art/);
  assert.match(js, /const DRAFTS_KEY = 'pj-studio-creadores-drafts-v1'/);
  assert.match(js, /scope: draftScope\(\)/);
  assert.match(js, /function renderSavedActivities\(\)/);
  assert.match(js, /function setAuthorScope\(value\)/);
  assert.match(js, /function deleteSavedDraft\(id\)/);
  assert.match(js, /function paintInspector\(\)[\s\S]*?inspector-type-card type-/);
});

test('los once tipos nuevos generan pantallas con el reproductor existente', () => {
  const window = {};
  const document = { getElementById: () => null, createElement: () => ({}), head: { appendChild() {} } };
  const context = { window, document, console, Math, Set, Array, Object, String, Number, JSON, Date, setTimeout, clearTimeout, setInterval, clearInterval };
  vm.runInNewContext(read('public/js/actividades/primaria-clasica.js'), context);
  const examples = {
    reloj: { ejercicios: [{ hora: '03:30' }] },
    recta_numerica: { min: 0, max: 20, paso: 1, valores: [13, 4] },
    grafico: { datos: [{ etiqueta: 'Perro', valor: 8 }, { etiqueta: 'Gato', valor: 5 }] },
    balanza: { ejercicios: [{ izq: [5, 3], der: [2], pesas: [1, 2, 3, 5] }] },
    ahorcado: { palabras: [{ palabra: 'MARIPOSA', pista: 'Insecto' }] },
    anagrama: { palabras: [{ palabra: 'ESCUELA', pista: 'Aprendes' }] },
    patrones: { secuencias: [{ serie: ['2', '4', '6', '?'], opciones: ['7', '8', '9'], correcta: 1 }] },
    simetria: { ejercicios: [{ ancho: 3, alto: 4, celdas: [[0, 0], [1, 1]] }] },
    silabas: { palabras: [{ palabra: 'MARIPOSA', silabas: ['MA', 'RI', 'PO', 'SA'] }] },
    vf_rapido: { afirmaciones: [{ texto: 'El Sol es una estrella.', verdadero: true }] },
    ruleta_preguntas: { preguntas: [{ categoria: 'Ciencias', pregunta: '¿Cuántos planetas?', opciones: ['7', '8', '9'], correcta: 1 }] }
  };
  for (const [tipo, datos] of Object.entries(examples)) {
    assert.ok(window.PJPrimaria.TIPOS.has(tipo), `el reproductor reconoce ${tipo}`);
    assert.ok(window.PJPrimaria.crear({ tipo, datos }).length, `${tipo} genera al menos una pantalla`);
  }
});

test('el Studio usa un editor por esquema: listas, opciones y casillas sin editor JSON', () => {
  const studio = read('public/education/studio/studio.js');
  const html = read('public/education/studio/index.html');
  // Un único generador de campos a partir de la forma de los datos cubre los 26 tipos
  for (const fn of ['camposDe(', 'listaEscalar(', 'listaObjetos(', 'listaOpciones(', 'listaCoordenadas(']) {
    assert.ok(studio.includes(fn), `Debe generar campos con ${fn}`);
  }
  for (const step of ['palette', 'canvas', 'inspector']) assert.match(html, new RegExp(`data-editor-view="${step}"`));
  assert.match(studio, /data-option-correct=/);
  assert.match(studio, /data-option-add=/);
  assert.match(studio, /data-option-delete=/);
  assert.doesNotMatch(studio, /formato JSON|en JSON|data-mode="json"|json-field/i);
  assert.doesNotMatch(studio, /Opciones avanzadas \(JSON\)/);
});

test('los retos de Code se diseñan en el espacio Retos Code con un tablero de cuadrícula accesible', () => {
  const studio = read('public/education/studio/studio.js');
  const retos = read('public/education/code/index.html');
  const css = read('public/education/code/retos.css');
  // Studio solo muestra miniaturas, importa conjuntos y enlaza al editor visual
  assert.match(studio, /Abrir editor visual de retos/);
  assert.match(studio, /function importarRetos\(modo\)/);
  // El tablero se pinta en /edu/code con herramientas accesibles y arrastre
  assert.match(retos, /role="radiogroup" aria-label="Herramienta de pintura"/);
  assert.match(retos, /data-tool="meta"/);
  assert.match(retos, /id="tablero"/);
  assert.match(css, /\.retos-tablero\s*\{[^}]*touch-action:\s*none/);
});

test('el lienzo permite deshacer, rehacer, duplicar y mover bloques', () => {
  const html = read('public/education/studio/index.html');
  const js = read('public/education/studio/studio.js');
  assert.match(html, /id="undo-action"/);
  assert.match(html, /id="redo-action"/);
  assert.match(js, /function restoreHistory\(index\)/);
  assert.match(js, /history\.length > 50/);
  assert.match(js, /function duplicateBlock\(index\)/);
  assert.match(js, /function moveBlock\(index, offset\)/);
  assert.match(js, /data-duplicate="\$\{index\}"/);
});

test('la vista previa se abre integrada y explica el acabado editorial', () => {
  const html = read('public/education/studio/index.html');
  const js = read('public/education/studio/studio.js');
  const preview = read('public/preview.html');
  const playerIcons = read('public/js/player-icons.js');
  const gamePage = read('public/jugar.html');
  assert.match(html, /<dialog[^>]+id="preview-dialog"/);
  assert.match(html, /id="preview-frame"/);
  assert.match(html, /Placeta Junior se ocupa de la revisión editorial/);
  assert.match(html, /creamos una portada y las traducciones necesarias/);
  assert.match(js, /previewDialog\.showModal\(\)/);
  assert.match(js, /previewDialog\.addEventListener\('close', closePreview\)/);
  assert.doesNotMatch(js, /window\.open\('\/preview\.html'/);
  assert.match(preview, /src="js\/player-icons\.js"/);
  assert.match(gamePage, /src="js\/player-icons\.js"/);
  assert.match(playerIcons, /createElementNS\('http:\/\/www\.w3\.org\/2000\/svg', 'svg'\)/);
  assert.match(playerIcons, /paths\[name\]/);
  assert.match(playerIcons, /pj-svg-icon/);
  assert.match(playerIcons, /observer\.observe\(document\.body/);
  assert.match(playerIcons, /check_circle:/);
  assert.doesNotMatch(playerIcons, /document\.fonts\.load/);
  assert.doesNotMatch(gamePage, /if \(n > 40\) clearInterval\(t\)/);
  assert.match(read('public/sw.js'), /'\/js\/player-icons\.js'/);
});

test('el portal educativo ofrece el editor en castellano, catalán e inglés', () => {
  const html = read('public/index.html');
  const pagina = html.slice(html.indexOf('function educacionPage()'), html.indexOf('function home()'));
  assert.match(pagina, /ac\('\/edu\/studio'/);
  assert.match(pagina, /Crear una actividad/);
  assert.match(pagina, /Crear una activitat/);
  assert.match(pagina, /Create an activity/);
  assert.match(pagina, /docentes aprobados y responsables de centros activos/);
});

test('el envío verifica en servidor el docente aprobado o el administrador del centro', () => {
  const handler = read('lib/education/centers/handlers.js');
  const api = read('api/centros.js');
  const js = read('public/education/studio/studio.js');
  assert.match(api, /lib\/education\/centers\/handler\.js/);
  assert.match(read('lib/education/centers/handler.js'), /'crear-actividad': h\.crearActividad/);
  assert.match(handler, /tipo_centro=eq\.docente&estado=eq\.aprobada/);
  assert.match(handler, /centroAdministrador\(req, body\.orgId\)/);
  assert.match(handler, /tipo_titular: 'centro'/);
  assert.match(handler, /tipo_titular: 'profesor'/);
  assert.match(js, /fetch\('\/api\/creadores\/actividades'/);
  assert.match(js, /Authorization: `Bearer \$\{token\}`/);
  assert.doesNotMatch(js, /API_BASE/);
});