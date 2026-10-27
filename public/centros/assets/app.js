/* Páginas de Placeta Junior Centros. La identidad la gestiona Google (Google Identity Services);
   el servidor verifica cada token (lib/google.js). No se usa Supabase Auth. */
(function () {
  'use strict';
  const CLAVE = 'pj27-sesion';
  const CLAVE_TIPO_ALTA = 'pj27-tipo-alta';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let cfg = null;

  const token = () => sessionStorage.getItem(CLAVE);
  document.querySelectorAll('[data-requiere-sesion]').forEach((el) => {
    el.hidden = !token();
  });
  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE);
    if (window.google && google.accounts && google.accounts.id) google.accounts.id.disableAutoSelect();
    location.href = '/centros';
  }

  async function config() {
    if (!cfg) {
      const r = await fetch('/api/config');
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        const e = new Error(d.error || 'configuracion_incompleta');
        e.codigo = d.error || 'configuracion_incompleta';
        throw e;
      }
      cfg = d;
    }
    return cfg;
  }

  async function api(ruta, opciones = {}) {
    const r = await fetch(ruta, {
      method: opciones.metodo || 'GET',
      headers: { 'Content-Type': 'application/json', ...(token() ? { Authorization: 'Bearer ' + token() } : {}) },
      body: opciones.cuerpo ? JSON.stringify(opciones.cuerpo) : undefined
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 && token()) { cerrarSesion(); throw new Error('Tu sesión ha caducado. Entra de nuevo.'); }
    if (!r.ok) {
      const e = new Error(d.error || 'error');
      e.codigo = d.error || (r.status === 502 ? 'bd_error' : 'error');
      e.campo = d.campo;
      throw e;
    }
    return d;
  }

  const MENSAJES = {
    campo_invalido: 'Revisa el campo indicado: parece incorrecto.',
    version_documentos_actualizada: 'Los documentos han cambiado. Recarga la página y vuelve a leerlos.',
    solicitud_pendiente: 'Ya tienes una solicitud pendiente de revisión.',
    no_autenticado: 'Necesitas iniciar sesión con Google.',
    no_autorizado: 'No tienes permiso para esta página.',
    bd_error: 'No se ha podido conectar con la base de datos del centro. Revisa en Vercel las variables SUPABASE_URL y SUPABASE_SECRET_KEY, y confirma que la migración 0001_pj27_centros.sql se ejecutó en Supabase.',
    configuracion_incompleta: 'Falta GOOGLE_CLIENT_ID en las variables de entorno de Vercel. Añádela en Settings → Environment Variables y vuelve a desplegar.',
    bd_error: 'Supabase rechazó la consulta. Revisa los logs de funciones de Vercel para ver el código de error de Supabase.',
    bd_credenciales_invalidas: 'Supabase rechazó las credenciales. Revisa SUPABASE_URL y SUPABASE_SECRET_KEY en las variables de Production de Vercel.',
    bd_tabla_no_encontrada: 'Falta el esquema de Centros en Supabase. Ejecuta la migración 0001_pj27_centros.sql antes de volver a probar.',
    bd_no_disponible: 'No se pudo conectar con Supabase. Comprueba el estado del proyecto y SUPABASE_URL en Vercel.'
  };
  const mensaje = (e) => MENSAJES[e.codigo] || 'Ha ocurrido un error. Inténtalo de nuevo.';

  // Google devuelve un token de identidad firmado por Google. Se guarda y se envía en cada petición;
  // el servidor lo comprueba. Caduca al cabo de una hora: entonces hay que volver a entrar.
  function recibirCredencial(respuesta) {
    if (!respuesta || !respuesta.credential) return;
    sessionStorage.setItem(CLAVE, respuesta.credential);
    location.reload();
  }

  // Dibuja el botón oficial de Google cuando la librería ya está cargada
  function montarBotonGoogle(clientId) {
    return new Promise((resolver, rechazar) => {
      if (!clientId) return rechazar(new Error('configuracion_incompleta'));
      const inicio = Date.now();
      (function intentar() {
        const gid = window.google && google.accounts && google.accounts.id;
        if (gid) {
          gid.initialize({ client_id: clientId, callback: recibirCredencial, auto_select: false });
          gid.renderButton($('#boton-google'), { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', width: 300 });
          return resolver();
        }
        if (Date.now() - inicio > 10000) return rechazar(new Error('google_no_disponible'));
        setTimeout(intentar, 150);
      })();
    });
  }

  // ── Alta de centro ────────────────────────────────────────────────
  function tipoAltaActual() {
    const query = new URLSearchParams(location.search).get('tipo');
    const guardado = sessionStorage.getItem(CLAVE_TIPO_ALTA);
    const tipo = query || guardado;
    return tipo === 'docente' ? 'docente' : tipo === 'centro' ? 'centro' : null;
  }

  function actualizarTipoFormulario(tipo) {
    const esDocente = tipo === 'docente';
    $('#titulo-login').textContent = esDocente ? 'Alta de docente individual' : 'Alta de centro';
    $('#texto-login').textContent = esDocente
      ? 'Inicia sesión con tu cuenta de Google. Después completarás tus datos como docente.'
      : 'Inicia sesión con tu cuenta de Google. Después rellenarás los datos del centro. Placeta Junior revisará la solicitud antes de activarla.';
    $('#titulo-formulario').textContent = esDocente ? 'Datos del docente' : 'Datos del centro';
    $('#texto-formulario').textContent = esDocente
      ? 'Completa tus datos de contacto y acepta las condiciones para usar Placeta Junior IO.'
      : 'Todos los campos son obligatorios salvo el código oficial del centro. Revisa los datos antes de enviar.';
    $('#leyenda-centro').textContent = esDocente ? 'El docente' : 'El centro';
    $('#etiqueta-nombre').firstChild.textContent = esDocente ? 'Nombre del docente ' : 'Nombre del centro ';
    $('#tipo-centro-campo').hidden = esDocente;
    const selectorCentro = document.querySelector('select[name="tipoCentro"]');
    selectorCentro.value = esDocente ? 'docente' : '';
    selectorCentro.required = !esDocente;
    const codigo = document.querySelector('input[name="codigoCentroOficial"]');
    codigo.closest('label').hidden = esDocente;
    $('#leyenda-responsable').textContent = esDocente ? 'Datos de contacto' : 'Persona responsable';
  }

  function elegirTipoAlta(tipo) {
    if (tipo !== 'centro' && tipo !== 'docente') return;
    sessionStorage.setItem(CLAVE_TIPO_ALTA, tipo);
    const url = new URL(location.href);
    url.searchParams.set('tipo', tipo);
    history.replaceState(null, '', url);
    $('#eleccion-alta').hidden = true;
    iniciarAlta(tipo);
  }

  function mostrarCarga() {
    $('#titulo-cargando').textContent = 'Preparando el alta…';
    $('#mensaje-cargando').className = 'nota';
    $('#mensaje-cargando').textContent = 'Estamos comprobando la configuración.';
    $('#acciones-error-carga').hidden = true;
    $('#cargando').hidden = false;
  }

  function mostrarErrorCarga(e) {
    $('#titulo-cargando').textContent = 'No se pudo continuar';
    $('#mensaje-cargando').className = 'error';
    $('#mensaje-cargando').textContent = e.codigo
      ? mensaje(e)
      : 'No se ha podido conectar. Revisa tu conexión y vuelve a intentarlo.';
    $('#acciones-error-carga').hidden = false;
    $('#cargando').hidden = false;
  }

  function ocultarCarga() {
    $('#cargando').hidden = true;
  }

  function iniciarAlta(tipo) {
    mostrarCarga();
    continuarAlta(tipo).catch(mostrarErrorCarga);
  }

  function volverAEleccion() {
    sessionStorage.removeItem(CLAVE_TIPO_ALTA);
    const url = new URL(location.href);
    url.searchParams.delete('tipo');
    history.replaceState(null, '', url);
    $('#entrar').hidden = true;
    $('#formulario').hidden = true;
    $('#estado').hidden = true;
    ocultarCarga();
    $('#eleccion-alta').hidden = false;
  }

  async function continuarAlta(tipo) {
    const c = await config();
    actualizarTipoFormulario(tipo);
    document.querySelectorAll('[data-version]').forEach((el) => {
      el.textContent = el.dataset.version === 'condiciones' ? '2026-06-01' : '2026-06-01';
    });
    if (!token()) {
      $('#entrar').hidden = false;
      ocultarCarga();
      montarBotonGoogle(c.googleClientId).catch(() => {
        $('#error-google').textContent = 'No se ha podido cargar el inicio de sesión con Google. Revisa tu conexión y recarga la página.';
      });
      return;
    }
    $('#cerrar').hidden = false;
    $('#cerrar').onclick = cerrarSesion;
    const datos = await api('/api/centros/mi');
    // Si ya tiene un centro aprobado, va a su panel
    if (datos.organizaciones.length) {
      $('#estado').hidden = false;
      $('#enlaces-centro').innerHTML = datos.organizaciones.map((o) => `
        <article class="centro-card">
          <div class="centro-card-main"><span class="centro-mark" aria-hidden="true">${esc(String(o.nombre || 'C').slice(0, 1).toUpperCase())}</span>
            <div><p class="centro-eyebrow">${esc(o.rol === 'administrador' ? 'ADMINISTRADOR' : 'MIEMBRO')}</p><h2>${esc(o.nombre)}</h2><p class="centro-card-meta">Código <span class="codigo">${esc(o.codigoCentro)}</span></p></div>
          </div>
          <div class="centro-card-side"><span class="estado-centro ${o.estado === 'activo' ? 'is-active' : ''}">${esc(o.estado)}</span><a class="btn centro-card-action" href="/centros/panel?org=${encodeURIComponent(o.id)}">Abrir dashboard <span aria-hidden="true">→</span></a></div>
        </article>`).join('');
    } else {
      $('#enlaces-centro').innerHTML = '';
    }
    const pendiente = datos.solicitudes.some((s) => s.estado === 'pendiente');
    if (!pendiente) {
      $('#formulario').hidden = false;
      $('#form-solicitud').onsubmit = enviarSolicitud;
    }
    $('#estado').hidden = false;
    $('#lista-solicitudes').innerHTML = datos.solicitudes.length
      ? `<div class="solicitudes-lista">${datos.solicitudes.map((s) => `<article class="solicitud-card">
          <div class="solicitud-card-top"><div><p class="centro-eyebrow">SOLICITUD DE CENTRO</p><h3>${esc(s.nombreCentro)}</h3></div>
            <span class="insignia ${s.estado === 'aprobada' ? 'ok' : s.estado === 'rechazada' ? 'mal' : ''}">${esc({ pendiente: 'En revisión', aprobada: 'Aprobada', rechazada: 'Rechazada' }[s.estado] || s.estado)}</span></div>
          <p class="centro-card-meta">Enviada ${s.creadaEn ? esc(new Date(s.creadaEn).toLocaleDateString()) : ''}</p>
          ${s.estado === 'rechazada' ? `<p class="error">Motivo: ${esc(s.motivoRechazo)}</p>` : ''}</article>`).join('')}</div>`
      : '<p class="empty-state">Aún no tienes solicitudes.</p>';
    ocultarCarga();
  }

  async function paginaRegistro() {
    document.querySelectorAll('[data-tipo-alta]').forEach((b) => b.addEventListener('click', () => elegirTipoAlta(b.dataset.tipoAlta)));
    $('#volver-eleccion-login').addEventListener('click', volverAEleccion);
    $('#volver-eleccion-formulario').addEventListener('click', volverAEleccion);
    $('#volver-carga').addEventListener('click', volverAEleccion);
    $('#reintentar-carga').addEventListener('click', () => {
      const tipo = tipoAltaActual();
      if (tipo) iniciarAlta(tipo);
    });
    const tipo = tipoAltaActual();
    const tipoSolicitado = new URLSearchParams(location.search).get('tipo');
    if (token() && tipoSolicitado !== 'centro' && tipoSolicitado !== 'docente') {
      const datos = await api('/api/centros/mi');
      if (datos.organizaciones.length) {
        location.replace('/centros/panel');
        return;
      }
    }
    if (!tipo) {
      ocultarCarga();
      $('#eleccion-alta').hidden = false;
      return;
    }
    sessionStorage.setItem(CLAVE_TIPO_ALTA, tipo);
    $('#eleccion-alta').hidden = true;
    iniciarAlta(tipo);
  }

  async function enviarSolicitud(ev) {
    ev.preventDefault();
    const f = ev.target;
    const aviso = $('#aviso');
    aviso.textContent = '';
    if (!f.checkValidity()) { f.reportValidity(); aviso.textContent = 'Faltan datos o hay campos incorrectos. Revísalos.'; return; }
    const v = Object.fromEntries(new FormData(f).entries());
    const cuerpo = {
      nombreCentro: v.nombreCentro, tipoCentro: v.tipoCentro, ciudad: v.ciudad,
      codigoCentroOficial: v.codigoCentroOficial || '', responsableNombre: v.responsableNombre,
      responsableCargo: v.responsableCargo, telefono: v.telefono, emailContacto: v.emailContacto,
      aceptaciones: { condiciones: '2026-06-01', privacidad: '2026-06-01' },
      declaraVeracidad: !!v.declaraVeracidad
    };
    if (!v.aceptaCondiciones || !v.aceptaPrivacidad) { aviso.textContent = 'Debes aceptar las condiciones y leer la información de privacidad.'; return; }
    const boton = f.querySelector('button[type=submit]');
    boton.disabled = true;
    try {
      await api('/api/centros/solicitud', { metodo: 'POST', cuerpo });
      aviso.textContent = 'Solicitud enviada. Placeta Junior la revisará y te avisaremos.';
      f.hidden = true;
      setTimeout(() => location.reload(), 1200);
    } catch (e) {
      aviso.innerHTML = `<span class="error">${esc(mensaje(e))}</span>`;
      boton.disabled = false;
    }
  }

  // ── Panel del centro ──────────────────────────────────────────────
  async function paginaPanel() {
    $('#cargando').hidden = true;
    if (!token()) { location.href = '/centros'; return; }
    $('#cerrar').hidden = false;
    $('#cerrar').onclick = cerrarSesion;
    const id = new URLSearchParams(location.search).get('org');
    const contenido = $('#contenido');
    contenido.hidden = false;
    try {
      const datos = id ? await api(`/api/centros/${encodeURIComponent(id)}`) : null;
      if (!datos) {
        const mi = await api('/api/centros/mi');
        contenido.innerHTML = mi.organizaciones.length
          ? '<div class="centros-list-heading"><div><h1>Tus centros</h1><p class="nota">Abre un centro para consultar su actividad y configuración.</p></div><a class="add-center-card" href="/centros?tipo=centro" aria-label="Añadir otro centro"><span aria-hidden="true">+</span><strong>Añadir otro centro</strong></a></div><div class="centros-list-grid">' + mi.organizaciones.map((o) => `<a class="center-list-card" href="/centros/panel?org=${encodeURIComponent(o.id)}"><span class="center-list-mark" aria-hidden="true">${esc(String(o.nombre || 'C').slice(0, 1).toUpperCase())}</span><span><strong>${esc(o.nombre)}</strong><small>${esc(o.rol === 'administrador' ? 'Administrador' : 'Miembro')} · ${esc(o.estado)}</small></span><span class="center-list-arrow" aria-hidden="true">→</span></a>`).join('') + '</div>'
          : '<h1>Panel del centro</h1><p>Todavía no tienes ningún centro activo. Cuando se apruebe tu solicitud, aparecerá aquí.</p>';
        return;
      }
      const o = datos.organizacion;
      contenido.innerHTML = `
        <div class="dashboard-head">
          <div><p class="centro-eyebrow">DASHBOARD DEL CENTRO</p><h1>${esc(o.nombre)}</h1><p class="dashboard-subtitle">Gestiona equipos, consulta su actividad reciente y ajusta la configuración del centro.</p></div>
          <div class="dashboard-code"><span>CÓDIGO DEL CENTRO</span><strong>${esc(o.codigoCentro)}</strong><button type="button" class="btn-copy" id="copiar-codigo" aria-label="Copiar código del centro" title="Copiar código">Copiar</button></div>
        </div>
        <div id="resumen-dispositivos" class="dashboard-kpis"><div class="kpi-skeleton"></div><div class="kpi-skeleton"></div><div class="kpi-skeleton"></div></div>
        <nav class="dashboard-tabs" aria-label="Vistas del centro">
          <button type="button" class="activa" data-centro-vista="dispositivos">Dispositivos</button>
          <button type="button" data-centro-vista="estadisticas">Estadísticas</button>
          <button type="button" data-centro-vista="configuracion">Configuración</button>
          <button type="button" data-centro-vista="acceso">Accesos</button>
        </nav>
        <section class="dashboard-view" data-centro-panel="dispositivos">
          <div class="view-heading"><div><h2>Equipos del centro</h2><p class="nota">Estado de vinculación y último contacto de cada dispositivo.</p></div><span class="codigo">${esc(o.codigoCentro)}</span></div>
          <p id="aviso-dispositivos" class="aviso" role="status"></p>
          <p id="ayuda-actualizaciones" class="nota">No existe una API autorizada para consultar ni lanzar actualizaciones desde este panel. Windows requiere su instalador oficial firmado; Chromebook se actualiza desde Google Play solo si se instaló desde Play Store.</p>
          <div id="lista-dispositivos"><p class="nota">Cargando equipos…</p></div>
        </section>
        <section class="dashboard-view" data-centro-panel="estadisticas" hidden><div id="estadisticas-centro"></div></section>
        <section class="dashboard-view" data-centro-panel="configuracion" hidden><div id="config-dispositivos"></div></section>
        <section class="dashboard-view" data-centro-panel="acceso" hidden>
          <div class="view-heading"><div><h2>Personas con acceso</h2><p class="nota">Cuentas asociadas a este centro.</p></div></div>
          <div class="tabla"><table><thead><tr><th>Correo</th><th>Rol</th></tr></thead><tbody>
          ${datos.miembros.map((m) => `<tr><td>${esc(m.email)}</td><td>${esc(m.rol)}</td></tr>`).join('')}</tbody></table></div>
        </section>`;
      contenido.querySelectorAll('[data-centro-vista]').forEach((boton) => boton.addEventListener('click', () => {
        contenido.querySelectorAll('[data-centro-vista]').forEach((x) => x.classList.toggle('activa', x === boton));
        contenido.querySelectorAll('[data-centro-panel]').forEach((panel) => { panel.hidden = panel.dataset.centroPanel !== boton.dataset.centroVista; });
      }));
      $('#copiar-codigo').addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(o.codigoCentro);
          $('#copiar-codigo').textContent = 'Copiado';
          setTimeout(() => { const btn = $('#copiar-codigo'); if (btn) btn.textContent = 'Copiar'; }, 1600);
        } catch { $('#aviso-dispositivos').textContent = 'No se pudo copiar el código. Selecciónalo para copiarlo manualmente.'; }
      });
      if (datos.tuRol === 'administrador') await cargarGestionDispositivos(o.id);
      else $('#aviso-dispositivos').textContent = 'Solo las personas administradoras del centro pueden gestionar los dispositivos.';
    } catch (e) {
      contenido.innerHTML = `<p class="error">${esc(mensaje(e))}</p>`;
    }
  }

  async function cargarGestionDispositivos(orgId) {
    const aviso = $('#aviso-dispositivos');
    try {
      const ruta = `/api/centros/${encodeURIComponent(orgId)}/dispositivos`;
      const datos = await api(ruta);
      renderResumen(datos.dispositivos);
      renderEstadisticas(datos.dispositivos);
      $('#lista-dispositivos').innerHTML = datos.dispositivos.length
        ? `<div class="device-list">${datos.dispositivos.map((d) => `<article class="device-row">
          <span class="device-glyph" aria-hidden="true">${d.estado === 'activo' ? '●' : '○'}</span>
          <div class="device-main"><strong>${esc(d.nombre)}</strong><span>${esc(etiquetaPlataforma(d.plataforma))}</span><span>${esc(d.appVersion ? `Placeta Junior IO ${d.appVersion}` : 'Versión no informada')}</span></div>
          <span class="insignia ${d.estado === 'activo' ? 'ok' : 'mal'}">${esc(d.estado === 'activo' ? 'Conectado' : 'Desvinculado')}</span>
          <div class="device-seen"><small>ÚLTIMO CONTACTO</small><span>${formatFecha(d.ultimoContacto)}</span></div>
          <div class="device-actions">
            ${d.estado === 'activo' ? `<button type="button" class="device-action" data-desvincular="${esc(d.id)}" title="Desvincular dispositivo" aria-label="Desvincular ${esc(d.nombre)}">Desvincular</button>` : ''}
            <button type="button" class="device-action device-update-action" disabled aria-describedby="ayuda-actualizaciones">Actualizar</button>
          </div>
        </article>`).join('')}</div>`
        : '<p class="empty-state">Aún no hay equipos vinculados. Cuando un dispositivo se vincule con el código del centro aparecerá aquí.</p>';
      dibujarConfigDispositivos(orgId, datos.config);
    } catch (e) {
      aviso.textContent = mensaje(e);
    }
  }

  function formatFecha(valor) {
    if (!valor) return 'Sin actividad registrada';
    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return 'Sin actividad registrada';
    return new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(fecha);
  }

  function etiquetaPlataforma(plataforma) {
    return ({
      windows: 'Windows · aplicación de escritorio (.exe)',
      chromebook: 'ChromeOS · Google Play (si se instaló desde Play Store)'
    })[plataforma] || 'Plataforma sin identificar';
  }

  function renderResumen(dispositivos) {
    const ahora = Date.now();
    const activos = dispositivos.filter((d) => d.estado === 'activo');
    const recientes = activos.filter((d) => d.ultimoContacto && ahora - new Date(d.ultimoContacto).getTime() <= 7 * 86400000);
    const ultimo = dispositivos.map((d) => d.ultimoContacto).filter(Boolean).sort().at(-1);
    $('#resumen-dispositivos').innerHTML = [
      ['Equipos vinculados', dispositivos.length, 'En este centro'],
      ['Activos', activos.length, `${dispositivos.length - activos.length} desvinculados`],
      ['Activos últimos 7 días', recientes.length, ultimo ? `Último contacto: ${formatFecha(ultimo)}` : 'Todavía sin contactos']
    ].map(([titulo, valor, detalle]) => `<article class="dashboard-kpi"><span>${esc(titulo)}</span><strong>${esc(valor)}</strong><small>${esc(detalle)}</small></article>`).join('');
  }

  function renderEstadisticas(dispositivos) {
    const ahora = Date.now();
    const activos = dispositivos.filter((d) => d.estado === 'activo');
    const recientes = activos.filter((d) => d.ultimoContacto && ahora - new Date(d.ultimoContacto).getTime() <= 7 * 86400000);
    const versionMap = new Map();
    for (const dispositivo of activos) {
      const version = dispositivo.appVersion || 'No informada';
      versionMap.set(version, (versionMap.get(version) || 0) + 1);
    }
    const ordenados = [...dispositivos].sort((a, b) => (b.ultimoContacto || '').localeCompare(a.ultimoContacto || ''));
    $('#estadisticas-centro').innerHTML = `
      <div class="view-heading"><div><h2>Estadísticas del centro</h2><p class="nota">Resumen operativo calculado a partir de los contactos de los dispositivos.</p></div><span class="stat-period">Últimos 7 días</span></div>
      <div class="stats-grid">
        <article class="stat-panel"><span class="stat-label">Actividad reciente</span><strong class="stat-value">${recientes.length}<small> / ${activos.length} activos</small></strong><p class="nota">Equipos que han consultado su política en los últimos siete días.</p></article>
        <article class="stat-panel"><span class="stat-label">Dispositivos vinculados</span><strong class="stat-value">${dispositivos.length}</strong><p class="nota">${activos.length} conectados · ${dispositivos.length - activos.length} desvinculados.</p></article>
      </div>
      <div class="stats-lower">
        <section class="stats-section"><h3>Versiones instaladas</h3>${versionMap.size ? `<ul class="stats-versions">${[...versionMap.entries()].sort((a, b) => b[1] - a[1]).map(([version, total]) => `<li><span>${esc(version)}</span><strong>${total}</strong></li>`).join('')}</ul>` : '<p class="empty-state">Todavía no hay versiones registradas.</p>'}</section>
        <section class="stats-section"><h3>Último contacto por equipo</h3>${ordenados.length ? `<ul class="stats-activity">${ordenados.map((d) => `<li><span class="activity-dot ${d.estado === 'activo' ? 'is-active' : ''}"></span><span><strong>${esc(d.nombre)}</strong><small>${formatFecha(d.ultimoContacto)}</small></span></li>`).join('')}</ul>` : '<p class="empty-state">Sin datos de dispositivos.</p>'}</section>
      </div>
      <p class="stats-disclaimer">Estas estadísticas reflejan conexión y versión de los equipos. Aún no hay analítica de actividades, juegos ni respuestas.</p>`;
  }

  function dibujarConfigDispositivos(orgId, config) {
    const c = config;
    $('#config-dispositivos').innerHTML = `
      <h2>Configuración común</h2>
      <p class="nota">Se aplica a los equipos de este centro al actualizar su política.</p>
      <form id="form-config-centro">
        <fieldset><legend>Herramientas</legend>
          ${['actividades', 'juegos', 'biblioteca', 'ajustes'].map((k) => `<label class="check"><input type="checkbox" name="herramienta_${k}" ${c.herramientas[k] ? 'checked' : ''}> ${k}</label>`).join('')}
        </fieldset>
        <fieldset><legend>Etapas</legend>
          ${['infantil', 'primaria'].map((k) => `<label class="check"><input type="checkbox" name="etapa_${k}" ${c.contenido.etapas.includes(k) ? 'checked' : ''}> ${k}</label>`).join('')}
        </fieldset>
        <fieldset><legend>Uso e interfaz</legend>
          <label>Máximo de minutos por sesión (vacío = sin límite)<input type="number" name="tiempoMaxMinutos" min="5" max="240" value="${c.restricciones.tiempoMaxMinutos ?? ''}"></label>
          <label class="check"><input type="checkbox" name="permitirGuardarBiblioteca" ${c.restricciones.permitirGuardarBiblioteca ? 'checked' : ''}> Permitir guardar en la biblioteca</label>
          <label>Idioma por defecto<select name="idioma"><option value="es" ${c.interfaz.idioma === 'es' ? 'selected' : ''}>Español</option><option value="ca" ${c.interfaz.idioma === 'ca' ? 'selected' : ''}>Català</option><option value="en" ${c.interfaz.idioma === 'en' ? 'selected' : ''}>English</option></select></label>
          <label>Progreso<select name="progreso"><option value="local" ${c.progreso === 'local' ? 'selected' : ''}>Local</option><option value="centro" ${c.progreso === 'centro' ? 'selected' : ''}>Del centro</option><option value="ninguno" ${c.progreso === 'ninguno' ? 'selected' : ''}>No guardar</option></select></label>
          <label>Identificación<select name="identificacion"><option value="anonimo" ${c.identificacion === 'anonimo' ? 'selected' : ''}>Anónima</option><option value="alias" ${c.identificacion === 'alias' ? 'selected' : ''}>Alias</option><option value="nominal" ${c.identificacion === 'nominal' ? 'selected' : ''}>Nominal</option></select></label>
        </fieldset>
        <fieldset><legend>PIN de salida</legend>
          <p class="nota">${c.seguridad.pinDefinido ? `PIN ${esc(c.seguridad.tipoPin)} configurado. Deja vacío para conservarlo.` : 'No hay PIN configurado.'}</p>
          <label>Nuevo PIN (4 a 12 letras o números)<input name="pinNuevo" type="password" minlength="4" maxlength="12" autocomplete="new-password"></label>
          ${c.seguridad.pinDefinido ? '<label class="check"><input type="checkbox" name="quitarPin"> Quitar el PIN actual</label>' : ''}
        </fieldset>
        <button type="submit">Guardar configuración</button>
      </form>`;
    $('#form-config-centro').addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const f = ev.target;
      const aviso = $('#aviso-dispositivos');
      const entero = f.tiempoMaxMinutos.value === '' ? null : Number(f.tiempoMaxMinutos.value);
      if (entero !== null && (!Number.isInteger(entero) || entero < 5 || entero > 240)) {
        aviso.textContent = 'El máximo debe estar entre 5 y 240 minutos.';
        return;
      }
      const configNueva = {
        herramientas: Object.fromEntries(['actividades', 'juegos', 'biblioteca', 'ajustes'].map((k) => [k, f[`herramienta_${k}`].checked])),
        contenido: { etapas: ['infantil', 'primaria'].filter((k) => f[`etapa_${k}`].checked) },
        restricciones: { tiempoMaxMinutos: entero, permitirGuardarBiblioteca: f.permitirGuardarBiblioteca.checked },
        interfaz: { ...c.interfaz, idioma: f.idioma.value },
        progreso: f.progreso.value,
        identificacion: f.identificacion.value,
        seguridad: { pinNuevo: f.pinNuevo.value, quitarPin: !!f.quitarPin?.checked }
      };
      if (!configNueva.contenido.etapas.length) { aviso.textContent = 'Selecciona al menos una etapa.'; return; }
      try {
        const r = await api(`/api/centros/${encodeURIComponent(orgId)}/dispositivos/configuracion/guardar`, { metodo: 'PUT', cuerpo: { config: configNueva } });
        aviso.textContent = r.sinCambios ? 'La configuración ya estaba actualizada.' : `Configuración guardada (${r.tipoCambio}).`;
        await cargarGestionDispositivos(orgId);
      } catch (e) { aviso.textContent = mensaje(e); }
    });
  }

  document.addEventListener('click', async (e) => {
    const boton = e.target.closest('[data-desvincular]');
    if (!boton) return;
    if (!confirm('¿Desvincular este dispositivo? Dejará de recibir la configuración del centro.')) return;
    const orgId = new URLSearchParams(location.search).get('org');
    try {
      await api(`/api/centros/${encodeURIComponent(orgId)}/dispositivos/${encodeURIComponent(boton.dataset.desvincular)}/desvincular`, { metodo: 'POST', cuerpo: {} });
      await cargarGestionDispositivos(orgId);
    } catch (e2) { $('#aviso-dispositivos').textContent = mensaje(e2); }
  });

  const pagina = document.body.dataset.pagina;
  const inicio = { registro: paginaRegistro, panel: paginaPanel }[pagina];
  if (inicio) inicio().catch((e) => { $('#cargando').textContent = mensaje(e); });
})();
