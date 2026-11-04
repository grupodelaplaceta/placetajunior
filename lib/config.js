'use strict';
// Configuración del entorno (variables de Vercel). Nunca se envían secretos al navegador.
function errorConfiguracion() {
  const e = new Error('configuracion_incompleta');
  e.status = 500;
  e.codigo = 'configuracion_incompleta';
  return e;
}

// Base de datos: Supabase, usado solo desde el servidor
function leerSupabase() {
  const url = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const secretKey = process.env.SUPABASE_SECRET_KEY || '';
  if (!url || !secretKey) throw errorConfiguracion();
  return { url, secretKey };
}

// Identidad de centros: el identificador de cliente de Google es público (no es un secreto)
function leerGoogleClientId() {
  const id = (process.env.GOOGLE_CLIENT_ID || '').trim();
  if (!id) throw errorConfiguracion();
  return id;
}

function configPublica() {
  return { googleClientId: leerGoogleClientId() };
}

module.exports = { leerSupabase, leerGoogleClientId, configPublica, errorConfiguracion };
