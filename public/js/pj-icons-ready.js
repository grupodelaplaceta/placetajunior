/* Iconos Material Symbols: no mostrar nunca las palabras en bruto
   («lightbulb», «extension»…) mientras la fuente no ha cargado.
   Solo marca <html class="icons-ready"> cuando la fuente existe de verdad;
   si no carga, los iconos decorativos quedan ocultos en vez de mostrar texto. */
(function () {
  var root = document.documentElement;
  if (!document.fonts || !document.fonts.load) { root.classList.add('icons-ready'); return; }
  document.fonts.load('24px "Material Symbols Rounded"').then(function (faces) {
    if (faces && faces.length) root.classList.add('icons-ready');
  }).catch(function () {});
})();
