/* Muestra la ruta solicitada en la 404 (texto seguro, sin HTML). */
(function () {
  'use strict';
  var el = document.getElementById('e404-ruta');
  if (!el) return;
  var ruta = location.pathname + (location.search || '') + (location.hash || '');
  if (ruta.length > 200) ruta = ruta.slice(0, 200) + '…';
  el.textContent = ruta && ruta !== '/' ? ruta : 'esta dirección';
})();
