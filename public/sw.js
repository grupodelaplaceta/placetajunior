/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Service Worker (modo offline, como la app)
   Precarga la app shell (página, estilos, scripts, fuentes, sonidos,
   mapamundi y hojas de estilos de Leaflet) y cachea las actividades de
   la API + sus imágenes para poder jugar sin conexión.
   Solo funciona en https (o localhost); en file:// no se registra.
   ═══════════════════════════════════════════════════════════════════ */
// Versionar la caché fuerza la actualización del reproductor y estilos en
// dispositivos que ya visitaron la web.
const CACHE = 'placetajunior-v5-schema2';

const SHELL = [
  '/',
  '/index.html',
  '/preview.html',
  '/css/styles.css',
  '/css/home.css',
  '/css/leaflet.css',
  '/js/app.js',
  '/js/player.js',
  '/js/sonidos.js',
  '/js/avisos.js',
  '/js/accesibilidad.js',
  '/js/mapa-mundi.js',
  '/js/progreso.js',
  '/js/topojson-client.min.js',
  '/js/leaflet.js',
  '/fonts/handly_casual.ttf',
  '/fonts/plus_jakarta_regular.woff2',
  '/fonts/plus_jakarta_bold.woff2',
  '/data/countries-110m.json',
  '/img/logo.png',
  '/img/forma.svg',
  '/sounds/clic.wav',
  '/sounds/pop.wav',
  '/sounds/abrir.wav',
  '/sounds/exito.wav',
  '/sounds/error.wav',
  '/sounds/victoria.wav',
  '/sounds/letra.wav',
  '/sounds/hoja.wav',
  '/css/images/layers.png',
  '/css/images/layers-2x.png',
  '/css/images/marker-icon.png',
  '/css/images/marker-icon-2x.png',
  '/css/images/marker-shadow.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // API de actividades (admin-placeta): red primero, cache de respaldo → así,
  // si no hay conexión, se juega con las últimas actividades descargadas.
  if (url.hostname.indexOf('admin-placeta') !== -1 || url.pathname.indexOf('/api/') === 0) {
    e.respondWith(
      fetch(req).then(function (res) {
        const copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // Página (navegación): red primero, para ver los despliegues nuevos sin
  // tener que vaciar la caché; si no hay red, se sirve la página cacheada.
  if (url.origin === self.location.origin && req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return caches.match(req); })
    );
    return;
  }

  // Recursos propios: cache primero + revalidación en segundo plano
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        const net = fetch(req).then(function (res) {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        }).catch(function () { return cached; });
        return cached || net;
      })
    );
    return;
  }

  // Imágenes de actividades (picsum / unsplash): cache primero
  if (url.hostname.indexOf('picsum.photos') !== -1 || url.hostname.indexOf('images.unsplash.com') !== -1) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (res) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return cached; });
      })
    );
    return;
  }

  // Google Fonts / CDNs (Leaflet, topojson...): cache si ya está, si no, red
  if (/fonts\.googleapis|fonts\.gstatic|unpkg|jsdelivr/.test(url.hostname)) {
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (res) {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return res;
        }).catch(function () { return cached; });
      })
    );
  }
});
