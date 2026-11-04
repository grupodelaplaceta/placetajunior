const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'public', 'js', 'visitas-juegos.js'), 'utf8');

function createCounter() {
  const data = new Map();
  const requests = [];
  const cardNodes = [{ textContent: '' }];
  const localStorage = {
    getItem(key) { return data.get(key) || null; },
    setItem(key, value) { data.set(key, value); }
  };
  const window = { PJ_API_BASE: 'https://stats.example/api/junior' };
  const document = { querySelectorAll: (selector) => { cardNodes[0].selector = selector; return cardNodes; } };
  const context = {
    window,
    document,
    localStorage,
    location: { hostname: 'junior.laplaceta.org' },
    fetch: async (url, options) => {
      requests.push({ url, options });
      return { ok: url.endsWith('/visitas'), status: url.endsWith('/visitas') ? 200 : 404 };
    }
  };
  vm.runInNewContext(source, context, { filename: 'visitas-juegos.js' });
  return { visits: window.PJGameVisits, data, requests, cardNodes };
}

test('registra visitas locales por juego y sincroniza un payload separado de actividades', async () => {
  const counter = createCounter();
  assert.equal(counter.visits.count(68), 0);
  assert.equal(counter.visits.register(68, 'Talla la fruta'), 1);
  assert.equal(counter.visits.register(68, 'Talla la fruta'), 2);
  await new Promise((resolve) => setImmediate(resolve));

  assert.deepEqual(JSON.parse(counter.data.get('pj-visitas-juego')), { 68: 2 });
  assert.equal(counter.cardNodes[0].textContent, '2');
  assert.equal(counter.cardNodes[0].selector, '[data-game-visits="68"]');
  const sync = counter.requests.find(({ url }) => url.endsWith('/visitas'));
  assert.ok(sync);
  const payload = JSON.parse(sync.options.body);
  assert.equal(payload.id, 'juego-68');
  assert.equal(payload.juego_id, 68);
  assert.equal(payload.tipo, 'juego');
  assert.equal(payload.nombre, 'Talla la fruta');
});

test('la galería registra al abrir y muestra el contador en la tarjeta', () => {
  const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
  assert.match(html, /open\(i\)\{if\(window\.PJGameVisits\)PJGameVisits\.register\(i,G\[i\]&&G\[i\]\[1\]\)/);
  assert.match(html, /PJGameVisits\?PJGameVisits\.count\(g\.i\):0/);
  assert.match(html, /data-game-visits=/);
  assert.match(html, /js\/visitas-juegos\.js/);
});