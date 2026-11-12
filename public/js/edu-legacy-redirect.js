(() => {
  'use strict';

  const path = location.pathname.replace(/\/+$/, '') || '/';
  const directRoutes = {
    '/crear-actividad': '/edu/studio',
    '/centros': '/edu/alta',
    '/centros/panel': '/edu/centros',
    '/educacion': '/edu/centros',
    '/educacion/administracion': '/edu/administracion'
  };
  const target = directRoutes[path] || (path.startsWith('/centros/docs/')
    ? path.replace('/centros/docs/', '/edu/documentos/')
    : '');

  if (target) location.replace(target + location.search + location.hash);
})();
