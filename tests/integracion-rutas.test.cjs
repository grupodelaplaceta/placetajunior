const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.join(__dirname, '..');
const vercel = JSON.parse(fs.readFileSync(path.join(raiz, 'vercel.json'), 'utf8'));

test('el proyecto tiene como mucho 12 funciones de Vercel', () => {
  const funciones = fs.readdirSync(path.join(raiz, 'api')).filter((f) => f.endsWith('.js'));
  assert.ok(funciones.length <= 12, `${funciones.length} funciones`);
  assert.deepEqual(funciones.sort(), ['centros.js', 'educacion.js']);
});

test('cada destino de /api apunta a una función existente', () => {
  for (const r of vercel.routes) {
    const m = /^\/api\/(centros|educacion)\.js\?/.exec(r.dest || '');
    if (m) assert.ok(fs.existsSync(path.join(raiz, 'api', `${m[1]}.js`)), r.dest);
  }
});

test('las rutas API apuntan a los archivos de función generados por Vercel', () => {
  for (const r of vercel.routes.filter((ruta) => ruta.src.startsWith('/api/') && ruta.src !== '/api/junior/(.*)')) {
    assert.match(r.dest || '', /^\/api\/(centros|educacion)\.js\?/ , r.src);
  }
  const config = vercel.routes.find((r) => r.src === '/api/config');
  assert.equal(config.dest, '/api/centros.js?ruta=config');
  assert.ok(vercel.routes.findIndex((r) => r.src === '/api/config') < vercel.routes.findIndex((r) => r.src === '/(.*)'), 'el fallback estático no debe capturar la API');
});

test('rutas de dispositivos del centro preceden a la ruta genérica y usan la función protegida de centros', () => {
  const rutas = vercel.routes.filter((r) => r.src.includes('/dispositivos'));
  assert.deepEqual(rutas.map((r) => r.src), [
    '/api/centros/([^/]+)/dispositivos/configuracion',
    '/api/centros/([^/]+)/dispositivos/configuracion/guardar',
    '/api/centros/([^/]+)/dispositivos/([^/]+)/desvincular',
    '/api/centros/([^/]+)/dispositivos'
  ]);
  assert.ok(rutas.every((r) => r.dest.startsWith('/api/centros.js?ruta=')));
  assert.ok(vercel.routes.findIndex((r) => r.src.includes('/dispositivos/configuracion/guardar')) < vercel.routes.findIndex((r) => r.src === '/api/centros/([^/]+)'));
});

test('el alta permite elegir centro o docente antes de Google y el panel incluye gestión sin login separado', () => {
  const html = fs.readFileSync(path.join(raiz, 'public/centros/index.html'), 'utf8');
  const app = fs.readFileSync(path.join(raiz, 'public/centros/assets/app.js'), 'utf8');
  assert.match(html, /id="eleccion-alta"/);
  assert.match(html, /data-tipo-alta="centro"/);
  assert.match(html, /data-tipo-alta="docente"/);
  assert.match(app, /sessionStorage\.setItem\(CLAVE_TIPO_ALTA, tipo\)/);
  assert.match(app, /history\.replaceState\(null, '', url\)/);
  assert.match(app, /cargarGestionDispositivos\(o\.id\)/);
  assert.match(app, /\/dispositivos\/configuracion\/guardar/);
  assert.match(app, /\/desvincular/);
});

test('el alta muestra el estado de carga y permite recuperarse de errores al iniciar', () => {
  const html = fs.readFileSync(path.join(raiz, 'public/centros/index.html'), 'utf8');
  const app = fs.readFileSync(path.join(raiz, 'public/centros/assets/app.js'), 'utf8');
  assert.match(html, /id="cargando"[^>]*role="status"/);
  assert.match(html, /id="reintentar-carga"/);
  assert.match(html, /id="volver-carga"/);
  assert.match(app, /function iniciarAlta\(tipo\)/);
  assert.match(app, /continuarAlta\(tipo\)\.catch\(mostrarErrorCarga\)/);
  assert.match(app, /const tipo = tipoAltaActual\(\);\s*if \(tipo\) iniciarAlta\(tipo\)/);
});

test('el panel identifica plataformas declaradas y no ofrece actualizaciones sin API autorizada', () => {
  const app = fs.readFileSync(path.join(raiz, 'public/centros/assets/app.js'), 'utf8');
  const handlers = fs.readFileSync(path.join(raiz, 'lib/centros/handlers.js'), 'utf8');
  const rutas = fs.readFileSync(path.join(raiz, 'lib/educacion/rutas.js'), 'utf8');
  assert.match(rutas, /PLATAFORMAS_DISPOSITIVO = \['windows', 'chromebook'\]/);
  assert.match(rutas, /plataforma: PLATAFORMAS_DISPOSITIVO\.includes\(body\.plataforma\) \? body\.plataforma : null/);
  assert.match(rutas, /deviceId: disp\.id/);
  assert.match(handlers, /plataforma: x\.plataforma \|\| null/);
  assert.match(app, /Windows · aplicación de escritorio \(\.exe\)/);
  assert.match(app, /ChromeOS · Google Play/);
  assert.match(app, /Plataforma sin identificar/);
  assert.doesNotMatch(app, /Android · APK/);
  assert.match(app, /disabled aria-describedby="ayuda-actualizaciones"/);
  assert.match(app, /No existe una API autorizada para consultar ni lanzar actualizaciones desde este panel/);
});

test('los accesos de centro usan Google y el dashboard expone estadísticas operativas', () => {
  const inicio = fs.readFileSync(path.join(raiz, 'public/index.html'), 'utf8');
  assert.match(inicio, /ac\('\/centros\/panel','flask',[^\n]*'Gestionar mis dispositivos'/);
  assert.doesNotMatch(inicio, /ac\('\/educacion\/','flask'/);
  const educacion = fs.readFileSync(path.join(raiz, 'public/educacion/index.html'), 'utf8');
  assert.match(educacion, /href="\/centros\/panel">Entrar con Google/);
  assert.doesNotMatch(educacion, /name="usuario"|name="clave"|Plataforma interna/);
  const app = fs.readFileSync(path.join(raiz, 'public/centros/assets/app.js'), 'utf8');
  assert.match(app, /data-centro-vista="estadisticas"/);
  assert.match(app, /stats-disclaimer/);
  assert.match(app, /Versiones instaladas/);
  const dispositivo = fs.readFileSync(path.join(raiz, 'lib/educacion/rutas.js'), 'utf8');
  assert.match(dispositivo, /dispT\.ultimoContacto = ahora\(\)/);
});

test('las subrutas de centros y educación están en el enrutado', () => {
  const dests = vercel.routes.map((r) => r.dest || '');
  assert.ok(dests.includes('/public/centros/index.html'));
  assert.ok(dests.includes('/public/centros/panel.html'));
  assert.ok(!dests.includes('/public/centros/rsp.html'), 'RSP es un panel externo');
  assert.ok(dests.includes('/public/educacion/index.html'));
});

test('el SQL completo incluye el esquema usado por Centros y Education y devuelve el contrato del RPC', () => {
  const sql = fs.readFileSync(path.join(raiz, 'supabase/setup_backend_completo.sql'), 'utf8');
  for (const tabla of ['PJ27_solicitudes', 'PJ27_aceptaciones_documentos', 'PJ27_organizaciones', 'PJ27_miembros', 'PJ27_rsp_usuarios', 'PJ27_auditoria', 'PJ27_estado']) {
    assert.ok(sql.includes(`public."${tabla}"`), `falta tabla ${tabla}`);
  }
  assert.match(sql, /create or replace function public\."PJ27_aprobar_solicitud"/);
  assert.match(sql, /returns jsonb/);
  assert.match(sql, /'organizacion_id', v_organizacion_id, 'codigo_centro', v_codigo/);
  assert.match(sql, /enable row level security/);
});

test('las páginas de centros y educación existen en el sitio', () => {
  for (const f of ['centros/index.html', 'centros/panel.html', 'centros/assets/app.js', 'css/pj-admin.css', 'educacion/index.html', 'educacion/portal.js']) {
    assert.ok(fs.existsSync(path.join(raiz, 'public', f)), f);
  }
});

test('el panel de centro solo se ofrece con sesión y CSP permite el estilo de Google', () => {
  const politica = vercel.routes.find((r) => r.src === '/centros(.*)').headers['Content-Security-Policy'];
  assert.match(politica, /'unsafe-hashes' 'sha256-RU4sU0AaS8IBGZx8XrGt\/pa9A5SLA3dQszGeqT5L3Kw='/);
  for (const f of ['centros/index.html', 'centros/panel.html']) {
    const texto = fs.readFileSync(path.join(raiz, 'public', f), 'utf8');
    assert.match(texto, /href="\/centros\/panel" data-requiere-sesion/);
  }
  const app = fs.readFileSync(path.join(raiz, 'public', 'centros/assets/app.js'), 'utf8');
  assert.match(app, /el\.hidden = !token\(\)/);
  const inicio = fs.readFileSync(path.join(raiz, 'public', 'index.html'), 'utf8');
  assert.match(inicio, /sessionStorage\.getItem\('pj27-sesion'\)\?ac\('\/centros\/panel'/);
});

test('ninguna página de centros ni de educación usa atributos en línea (compatible con la política de contenido)', () => {
  const paginas = ['centros/index.html', 'centros/panel.html', 'centros/assets/app.js', 'educacion/index.html', 'educacion/portal.js'];
  for (const p of paginas) {
    const txt = fs.readFileSync(path.join(raiz, 'public', p), 'utf8');
    assert.ok(!/\son(click|submit|load|change)=/.test(txt), p);
    assert.ok(!/<script>/.test(txt), p);
  }
});
