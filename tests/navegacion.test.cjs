const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const raiz = path.join(__dirname, '..');
const leer = (f) => fs.readFileSync(path.join(raiz, f), 'utf8');
const vercel = JSON.parse(leer('vercel.json'));
const destinos = new Set(vercel.routes.map((r) => r.dest).filter(Boolean));

test('la barra tiene "Para educación" en lugar de "Para docentes" y "Altas y admin"', () => {
  const html = leer('public/index.html');
  const nav = html.slice(html.indexOf('function nav(r){'), html.indexOf('function header(r){'));
  for (const ruta of ["'#/'", "'#/actividades'", "'#/juegos'", "['#/educacion','ednav','users']"]) assert.ok(nav.includes(ruta), ruta);
  assert.ok(!nav.includes('docnav') && !nav.includes('altanav'));
  assert.ok(html.includes('ednav:["Para educación"'));
});

test('las rutas del SPA siguen y las antiguas (#/docentes, #/alta) llevan a educación', () => {
  const html = leer('public/index.html');
  for (const r of ["p[0]==='juegos'", "p[0]==='actividades'", "p[0]==='j'", "p[0]==='a'", "['educacion','docentes','alta']"]) assert.ok(html.includes(r), r);
});

test('la página Para educación enlaza solo a rutas que existen y no expone RSP', () => {
  const html = leer('public/index.html');
  const pagina = html.slice(html.indexOf('function educacionPage()'), html.indexOf('function home()'));
  const enlaces = [...pagina.matchAll(/ac\('([^']+)'/g)].map((m) => m[1]);
  assert.equal(enlaces.length, 5);
  for (const e of enlaces) {
    const base = e.split('?')[0];
    const ok = base === '/centros' ? '/public/centros/index.html'
      : base === '/centros/panel' ? '/public/centros/panel.html'
      : base === '/crear-actividad' ? '/public/studio-creadores.html'
      : base === '/educacion/' ? '/public/educacion/index.html' : null;
    assert.ok(ok && destinos.has(ok), e);
  }
  assert.ok(!/rsp/i.test(pagina));
});

test('el alta de docente individual se elige antes del formulario y conserva la compatibilidad de URL', () => {
  const html = leer('public/centros/index.html');
  assert.ok(html.includes('data-tipo-alta="docente"'));
  assert.ok(html.includes('<option value="docente" hidden>'));
  const app = leer('public/centros/assets/app.js');
  assert.ok(app.includes("get('tipo')"));
  assert.ok(app.includes("tipo === 'docente' ? 'docente'"));
  const { TIPOS_CENTRO } = require('../lib/centros/validacion.js');
  assert.ok(TIPOS_CENTRO.includes('docente'));
  assert.ok(TIPOS_CENTRO.includes('primaria'), 'los tipos de centro siguen');
});

test('Studio, alta y mis centros comparten navegación y el alta de un segundo centro se inicia desde el botón +', () => {
  const studio = leer('public/studio-creadores.html');
  const registro = leer('public/centros/index.html');
  const panel = leer('public/centros/panel.html');
  const nav = leer('public/centros/assets/education-nav.js');
  for (const html of [studio, registro, panel]) {
    assert.ok(html.includes('class="education-topbar"'));
    assert.match(html, /href="\/crear-actividad"[^>]*>Studio<\/a>/);
    assert.ok(html.includes('href="/centros/panel" data-requiere-sesion'));
    assert.ok(html.includes('href="/centros?tipo=centro" data-nav-add-center hidden'));
    assert.ok(html.includes('/centros/assets/education-nav.js'));
  }
  assert.match(nav, /fetch\('\/api\/centros\/mi'/);
  assert.match(nav, /data\.organizaciones\.length/);
  assert.match(nav, /registerLink\.hidden = true/);
  assert.match(nav, /addCenterLink\.hidden = false/);
});

test('las cuentas con centros vuelven al panel; el botón + abre el alta independiente', () => {
  const app = leer('public/centros/assets/app.js');
  assert.match(app, /async function paginaRegistro\(\)/);
  assert.match(app, /tipoSolicitado !== 'centro' && tipoSolicitado !== 'docente'[\s\S]*?datos\.organizaciones\.length[\s\S]*?location\.replace\('\/centros\/panel'\)/);
  assert.match(app, /href="\/centros\?tipo=centro" aria-label="Añadir otro centro"/);
  assert.match(app, /href="\/centros\/panel\?org=/);
});

test('el script de la página principal es JavaScript válido', () => {
  const html = leer('public/index.html');
  const bloques = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.ok(bloques.length >= 1);
  for (const b of bloques) assert.doesNotThrow(() => new Function(b));
});

test('la categoría Pensamiento computacional muestra su traducción en el catálogo', () => {
  const app = leer('public/js/app.js');
  assert.match(app, /TODAS\.map\(pjAplicarTraduccionActividad\)/);
  assert.match(app, /resultado\[campo\] = traduccion\[campo\]/);
  assert.match(app, /c\.includes\('computacional'\).*c\.includes\('botxifra'\).*c\.includes\('stem'\)/);
  assert.match(leer('public/studio-creadores.html'), /<option>Pensamiento computacional<\/option>/);
});

test('las tarjetas usan portada traducida y solo muestran la insignia del idioma activo', () => {
  const html = leer('public/index.html');
  assert.match(html, /var portadaTraducida=\[tx\.miniaturaUrl,tx\.miniatura_url,tx\.portadaUrl,tx\.portada_url/);
  assert.match(html, /traducida:!!clave&&loc!=='es',idioma:clave&&loc!=='es'\?loc:''/);
  assert.match(html, /ribbon=meta\.traducida&&lang===activeLang/);
  assert.match(html, /ca:'Català'/);
});

test('las asignaturas comunes se muestran en el idioma seleccionado', () => {
  const context = { window: {}, localStorage: { getItem: () => '{"idioma":"ca"}' } };
  vm.runInNewContext(leer('public/js/subjects-i18n.js'), context);
  const translate = context.window.PJTranslateSubject;
  assert.equal(translate('Matemáticas', 'ca'), 'Matemàtiques');
  assert.equal(translate('Ciencias', 'en'), 'Science');
  assert.equal(translate('Geografía e historia', 'en'), 'Geography & history');
  assert.equal(translate('Ciencias sociales', 'en'), 'Social studies');
  assert.equal(translate('Pensamiento computacional', 'ca'), 'BOTXIFRA');
  assert.equal(translate('Materia personalizada', 'en'), 'Materia personalizada');

  const home = leer('public/index.html');
  const collections = leer('public/js/colecciones.js');
  assert.match(home, /SUBJECTS=\{mates:\['Matemáticas','Matemàtiques','Mathematics'\][\s\S]*computacional:\['Pensamiento computacional','BOTXIFRA','STEM'\]/);
  assert.match(collections, /window\.PJTranslateSubject/);
  assert.match(collections, /translateSubject\(activity\.categoria/);
});

test('la barra y el selector de idioma mantienen contraste en modo oscuro', () => {
  const html = leer('public/index.html');
  assert.match(html, /:root\[data-theme="dark"\] \.mn a\[aria-current="page"\],[\s\S]*?color:#1d1744/);
  assert.match(html, /:root:not\(\[data-theme="light"\]\) \.mn a\[aria-current="page"\],[\s\S]*?color:#1d1744/);
  assert.match(html, /\.menu button\[aria-pressed="true"\]\{background:var\(--bg\);color:var\(--purple\)\}/);
});

test('todas las páginas HTML cargan el botón global de accesibilidad y sus estilos', () => {
  const walk = (directory) => fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(file) : entry.name.endsWith('.html') ? [file] : [];
  });
  const pages = walk(path.join(raiz, 'public'));
  assert.ok(pages.length > 0);
  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    assert.match(html, /accesibilidad\.css/, `${path.relative(raiz, page)} debe cargar los estilos`);
    assert.match(html, /accesibilidad\.js/, `${path.relative(raiz, page)} debe cargar el panel`);
  }
  const accessibility = leer('public/js/accesibilidad.js');
  assert.match(accessibility, /TEXTOS/);
  assert.match(accessibility, /junior:idioma/);
});
