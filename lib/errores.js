'use strict';
function httpError(status, codigo, extra = {}) {
  const e = new Error(codigo);
  e.status = status;
  e.codigo = codigo;
  Object.assign(e, extra);
  return e;
}

// Envuelve un manejador: convierte errores en respuestas JSON sin detalles internos
function envolver(fn) {
  return async (req, res) => {
    try {
      await fn(req, res);
    } catch (e) {
      const status = e.status || 500;
      if (status >= 500) console.error('[pj27]', e.codigo || e.message, e.bdStatus || '', e.bdCode || '');
      res.status(status).json({ error: e.codigo || 'error_interno', ...(e.campo ? { campo: e.campo } : {}) });
    }
  };
}

function metodoNoPermitido(res, permitidos) {
  res.setHeader('Allow', permitidos);
  return res.status(405).json({ error: 'metodo_no_permitido' });
}

module.exports = { httpError, envolver, metodoNoPermitido };
