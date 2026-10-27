/* Portal de administración de Placeta Junior Education. */
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const TRADUCCIONES = {
    'Placeta Junior Education · Portal de administración': ['Placeta Junior Education · Portal d’administració', 'Placeta Junior Education · Administration portal'],
    'Para educación': ['Per a educació', 'For education'], 'Alta de centro': ['Alta de centre', 'School registration'],
    'Mi centro': ['El meu centre', 'My school'], Administración: ['Administració', 'Administration'],
    'Cerrar sesión': ['Tanca la sessió', 'Sign out'], 'Administración de dispositivos': ['Administració de dispositius', 'Device administration'],
    'Acceso para el personal autorizado de Placeta Junior Education.': ['Accés per al personal autoritzat de Placeta Junior Education.', 'Access for authorised Placeta Junior Education staff.'],
    Usuario: ['Usuari', 'Username'], Clave: ['Contrasenya', 'Password'], Entrar: ['Entra', 'Sign in'],
    Organizaciones: ['Organitzacions', 'Organisations'], 'Normativas y documentos': ['Normatives i documents', 'Policies and documents'],
    'Nuevo centro': ['Centre nou', 'New school'], 'Nombre del centro u organización': ['Nom del centre o organització', 'School or organisation name'],
    'Registrar y generar código': ['Registra i genera el codi', 'Register and generate code'],
    Nombre: ['Nom', 'Name'], 'Código de centro': ['Codi de centre', 'School code'], Dispositivos: ['Dispositius', 'Devices'],
    'Último cambio': ['Últim canvi', 'Last change'],
    'Publicar documento o nueva versión': ['Publica un document o una versió nova', 'Publish a document or new version'],
    Tipo: ['Tipus', 'Type'], Título: ['Títol', 'Title'], 'Tipo de cambio': ['Tipus de canvi', 'Change type'],
    'Condiciones de uso': ['Condicions d’ús', 'Terms of use'], 'Política de privacidad': ['Política de privadesa', 'Privacy policy'],
    Información: ['Informació', 'Information'], 'Técnico (sin aceptación)': ['Tècnic (sense acceptació)', 'Technical (no acceptance required)'],
    'Organizativo (solo información)': ['Organitzatiu (només informació)', 'Organisational (information only)'],
    'Normativo (requiere aceptación)': ['Normatiu (requereix acceptació)', 'Regulatory (acceptance required)'],
    'Requiere confirmación de lectura': ['Requereix confirmació de lectura', 'Read confirmation required'],
    'Requiere aceptación': ['Requereix acceptació', 'Acceptance required'], Texto: ['Text', 'Text'], Publicar: ['Publica', 'Publish'],
    'Documentos publicados': ['Documents publicats', 'Published documents'], Privacidad: ['Privadesa', 'Privacy'],
    'Aviso legal': ['Avís legal', 'Legal notice'],
    'Usuario o clave incorrectos.': ['Usuari o contrasenya incorrectes.', 'Incorrect username or password.'],
    'El nombre debe tener entre 2 y 120 caracteres.': ['El nom ha de tenir entre 2 i 120 caràcters.', 'Name must be between 2 and 120 characters.'],
    'El texto del documento es demasiado corto.': ['El text del document és massa curt.', 'Document text is too short.'],
    'El texto no ha cambiado respecto a la versión anterior.': ['El text no ha canviat respecte de la versió anterior.', 'The text has not changed from the previous version.'],
    'El tiempo máximo debe estar entre 5 y 240 minutos, o vacío.': ['El temps màxim ha d’estar entre 5 i 240 minuts, o buit.', 'Maximum time must be between 5 and 240 minutes, or blank.'],
    'La conservación debe estar entre 1 y 3650 días.': ['La conservació ha d’estar entre 1 i 3650 dies.', 'Retention must be between 1 and 3650 days.'],
    'Selecciona al menos una etapa.': ['Selecciona almenys una etapa.', 'Select at least one stage.'],
    'No se ha podido cargar la configuración.': ['No s’ha pogut carregar la configuració.', 'Could not load the configuration.'],
    'Todavía no hay organizaciones. Registra la primera arriba.': ['Encara no hi ha organitzacions. Registra la primera més amunt.', 'There are no organisations yet. Register the first one above.'],
    'No hay documentos publicados.': ['No hi ha documents publicats.', 'There are no published documents.'],
    'Gestionar': ['Gestiona', 'Manage'], 'Publicar nueva versión': ['Publica una versió nova', 'Publish new version'],
    'Sesión: ': ['Sessió: ', 'Signed in: '], 'Organización creada. Código de centro: ': ['Organització creada. Codi de centre: ', 'Organisation created. School code: '],
    '. Introdúcelo en Placeta Junior IO para vincular cada equipo.': ['. Introdueix-lo a Placeta Junior IO per a vincular cada equip.', '. Enter it in Placeta Junior IO to link each device.'],
    'No había cambios.': ['No hi havia canvis.', 'There were no changes.'], 'Guardado (': ['Desat (', 'Saved ('],
    '). Las familias deberán volver a aceptar las condiciones.': ['). Les famílies hauran de tornar a acceptar les condicions.', '). Families will need to accept the terms again.'],
    'Publicado (versión ': ['Publicat (versió ', 'Published (version '],
    'Todavía no tienes ningún centro activo. Cuando se apruebe tu solicitud, aparecerá aquí.': ['Encara no tens cap centre actiu. Quan s’aprove la sol·licitud, apareixerà ací.', 'You do not have an active school yet. It will appear here once your request is approved.'],
    'Cerrar sesión': ['Tanca la sessió', 'Sign out'], 'Sesión caducada. Entra de nuevo.': ['La sessió ha caducat. Torna a entrar.', 'Your session expired. Sign in again.'],
    '¿Desvincular este equipo? Dejará de recibir configuración y deberá vincularse de nuevo con el código del centro.': ['Vols desvincular aquest equip? Deixarà de rebre la configuració i s’haurà de tornar a vincular amb el codi del centre.', 'Unlink this device? It will stop receiving settings and must be linked again with the school code.'],
    'Texto de la nueva versión (mínimo 20 caracteres):': ['Text de la versió nova (mínim 20 caràcters):', 'New version text (at least 20 characters):'],
    'Tipo de cambio: tecnico, organizativo o normativo': ['Tipus de canvi: tecnico, organizativo o normativo', 'Change type: technical, organisational or regulatory'],
    'Los documentos han cambiado. Recarga la página y vuelve a leerlos.': ['Els documents han canviat. Torna a carregar la pàgina i llegeix-los de nou.', 'Documents have changed. Reload the page and read them again.']
  };
  let idioma = 'es';
  try {
    const preferencias = JSON.parse(localStorage.getItem('pj2') || '{}');
    idioma = ({ es: 'es', ca: 'ca', en: 'en' })[preferencias.l] || 'es';
  } catch {}
  const indiceIdioma = idioma === 'ca' ? 0 : idioma === 'en' ? 1 : -1;
  function traducirNodo(nodo) {
    if (nodo.nodeType === Node.TEXT_NODE) {
      const texto = nodo.nodeValue;
      const limpio = texto.trim();
      const traduccion = TRADUCCIONES[limpio];
      if (indiceIdioma >= 0 && Array.isArray(traduccion)) {
        nodo.nodeValue = texto.replace(limpio, traduccion[indiceIdioma]);
      } else if (indiceIdioma >= 0) {
        for (const [original, opciones] of Object.entries(TRADUCCIONES)) {
          if (Array.isArray(opciones) && (original.startsWith(' ') || original.endsWith(' ')) && texto.includes(original)) {
            nodo.nodeValue = nodo.nodeValue.replace(original, opciones[indiceIdioma]);
          }
        }
      }
      return;
    }
    if (nodo.nodeType !== Node.ELEMENT_NODE) return;
    for (const atributo of ['placeholder', 'title', 'aria-label']) {
      const valor = nodo.getAttribute(atributo);
      if (valor && indiceIdioma >= 0 && TRADUCCIONES[valor]) nodo.setAttribute(atributo, TRADUCCIONES[valor][indiceIdioma]);
    }
    const recorrido = document.createTreeWalker(nodo, NodeFilter.SHOW_TEXT);
    while (recorrido.nextNode()) traducirNodo(recorrido.currentNode);
  }
  document.documentElement.lang = idioma;
  if (indiceIdioma >= 0) {
    traducirNodo(document.body);
    new MutationObserver((cambios) => cambios.forEach((cambio) => cambio.addedNodes.forEach(traducirNodo)))
      .observe(document.body, { childList: true, subtree: true });
  }
  const TIPOS_CAMBIO = {
    tecnico: 'Técnico', organizativo: 'Organizativo', normativo: 'Normativo (requiere aceptación de las familias)'
  };
  let token = sessionStorage.getItem('pj-edu-token');
  let orgActual = null;
  document.querySelectorAll('[data-requiere-sesion]').forEach((el) => {
    el.hidden = !sessionStorage.getItem('pj27-sesion');
  });

  async function api(metodo, ruta, cuerpo) {
    const r = await fetch(ruta, {
      method: metodo,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
      body: cuerpo ? JSON.stringify(cuerpo) : undefined
    });
    const d = await r.json().catch(() => ({}));
    if (r.status === 401 && token) { cerrarSesion(); throw new Error('Sesión caducada. Entra de nuevo.'); }
    if (!r.ok) throw new Error(traducirError(d.error));
    return d;
  }

  const ERRORES = {
    credenciales_no_validas: 'Usuario o clave incorrectos.',
    nombre_no_valido: 'El nombre debe tener entre 2 y 120 caracteres.',
    texto_demasiado_corto: 'El texto del documento es demasiado corto.',
    sin_cambios_en_el_texto: 'El texto no ha cambiado respecto a la versión anterior.',
    tiempo_maximo_invalido: 'El tiempo máximo debe estar entre 5 y 240 minutos, o vacío.',
    conservacion_invalida: 'La conservación debe estar entre 1 y 3650 días.',
    etapas_invalidas: 'Selecciona al menos una etapa.'
  };
  function traducirError(c) { return traducirTexto(ERRORES[c] || c || 'Error inesperado'); }
  function traducirTexto(texto) { return indiceIdioma >= 0 && TRADUCCIONES[texto] ? TRADUCCIONES[texto][indiceIdioma] : texto; }

  function mostrarLogin() {
    $('#login').hidden = false; $('#panel').hidden = true; $('#salir').hidden = true; $('#usuario').textContent = '';
  }
  function mostrarPanel(usuario) {
    $('#login').hidden = true; $('#panel').hidden = false; $('#salir').hidden = false; $('#usuario').textContent = 'Sesión: ' + usuario;
  }
  function cerrarSesion() {
    token = null; sessionStorage.removeItem('pj-edu-token'); mostrarLogin();
  }

  $('#form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    $('#error-login').textContent = '';
    try {
      const d = await api('POST', '/api/admin/sesion', { usuario: f.usuario.value, clave: f.clave.value });
      token = d.token; sessionStorage.setItem('pj-edu-token', token);
      f.clave.value = '';
      await arrancar();
    } catch (err) { $('#error-login').textContent = err.message; }
  });

  $('#salir').addEventListener('click', cerrarSesion);

  document.querySelectorAll('.pestanas button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.pestanas button').forEach((x) => x.classList.toggle('activa', x === b));
    $('#vista-organizaciones').hidden = b.dataset.vista !== 'organizaciones';
    $('#vista-documentos').hidden = b.dataset.vista !== 'documentos';
    if (b.dataset.vista === 'documentos') cargarDocs();
  }));

  // ── Organizaciones ────────────────────────────────────────────────
  async function cargarOrgs() {
    const orgs = await api('GET', '/api/admin/organizaciones');
    $('#tabla-orgs').innerHTML = orgs.length ? orgs.map((o) => `<tr>
        <td>${esc(o.nombre)}</td>
        <td class="codigo">${esc(o.codigoCentro)}</td>
        <td>${o.dispositivos}</td>
        <td>${esc(TIPOS_CAMBIO[o.ultimoCambio.tipo] || o.ultimoCambio.tipo)}<br><span class="nota">${new Date(o.ultimoCambio.fecha).toLocaleString('es-ES')}</span></td>
        <td><button class="plana" data-abrir="${esc(o.id)}">Gestionar</button></td></tr>`).join('')
      : '<tr><td colspan="5">Todavía no hay organizaciones. Registra la primera arriba.</td></tr>';
  }

  $('#form-nueva-org').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = e.target.nombre.value;
    try {
      const o = await api('POST', '/api/admin/organizaciones', { nombre });
      $('#aviso-org').innerHTML = `Organización creada. Código de centro: <span class="codigo">${esc(o.codigoCentro)}</span>. Introdúcelo en Placeta Junior IO para vincular cada equipo.`;
      e.target.reset();
      await cargarOrgs();
    } catch (err) { $('#aviso-org').textContent = err.message; }
  });

  $('#tabla-orgs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-abrir]');
    if (b) abrirDetalle(b.dataset.abrir);
  });

  async function abrirDetalle(id) {
    const o = await api('GET', `/api/admin/organizaciones/${encodeURIComponent(id)}`);
    const disp = await api('GET', `/api/admin/organizaciones/${encodeURIComponent(id)}/dispositivos`);
    const acc = await api('GET', `/api/admin/organizaciones/${encodeURIComponent(id)}/aceptaciones`);
    orgActual = o;
    const c = o.config;
    const estados = Object.entries(c.juegos.estados).map(([k, v]) => `${k}: ${v}`).join('\n');
    const el = $('#detalle');
    el.hidden = false;
    el.innerHTML = `
      <h2>${esc(o.nombre)} · <span class="codigo">${esc(o.codigoCentro)}</span></h2>
      <p class="nota">Revisión ${o.revision}. Los cambios se aplican en los equipos al abrir la app o al recargarla.</p>
      <form id="form-config">
        <div class="bloque">
          <fieldset><legend>Herramientas disponibles</legend>
            ${['actividades', 'juegos', 'biblioteca', 'ajustes'].map((k) => `<label class="check"><input type="checkbox" name="h_${k}" ${c.herramientas[k] ? 'checked' : ''}/> ${k}</label>`).join('')}
          </fieldset>
          <fieldset><legend>Contenido por etapa</legend>
            ${['infantil', 'primaria'].map((k) => `<label class="check"><input type="checkbox" name="etapa_${k}" ${c.contenido.etapas.includes(k) ? 'checked' : ''}/> ${k}</label>`).join('')}
          </fieldset>
          <fieldset><legend>Restricciones de uso</legend>
            <label>Tiempo máximo por sesión (minutos, vacío = sin límite)
              <input name="tiempoMaxMinutos" type="number" min="5" max="240" value="${c.restricciones.tiempoMaxMinutos ?? ''}" /></label>
            <label class="check"><input type="checkbox" name="permitirGuardarBiblioteca" ${c.restricciones.permitirGuardarBiblioteca ? 'checked' : ''}/> Permitir guardar en la biblioteca</label>
          </fieldset>
          <fieldset><legend>Juegos</legend>
            <label>Estado por defecto
              <select name="juegoDefecto">${['visible', 'oculto', 'desactivado'].map((v) => `<option ${c.juegos.defecto === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
            <label>Excepciones (una por línea: <em>id: estado</em>)
              <textarea name="juegosEstados" rows="3">${esc(estados)}</textarea></label>
          </fieldset>
          <fieldset><legend>Actividades ocultas</legend>
            <label>Identificadores, uno por línea
              <textarea name="ocultas" rows="3">${esc(c.actividades.ocultas.join('\n'))}</textarea></label>
          </fieldset>
          <fieldset><legend>Identificación y progreso</legend>
            <label>Identificación
              <select name="identificacion">${['anonimo', 'alias', 'nominal'].map((v) => `<option ${c.identificacion === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
            <label>Progreso del alumnado
              <select name="progreso">${['local', 'centro', 'ninguno'].map((v) => `<option ${c.progreso === v ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
          </fieldset>
          <fieldset><legend>Interfaz de los equipos</legend>
            <label>Ventanas
              <select name="ventanas">${[['maximizadas', 'Siempre maximizadas'], ['libres', 'Se pueden mover y reducir']].map(([v, t]) => `<option value="${v}" ${c.interfaz.ventanas === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            <label>Letras en la interfaz
              <select name="mayusculas">${[['mixtas', 'Mixtas (como se escriben)'], ['mayusculas', 'MAYÚSCULAS'], ['minusculas', 'minúsculas']].map(([v, t]) => `<option value="${v}" ${c.interfaz.mayusculas === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            <label>Idioma por defecto (los perfiles pueden elegir otro)
              <select name="idioma">${[['es', 'Español'], ['ca', 'Català'], ['en', 'English']].map(([v, t]) => `<option value="${v}" ${c.interfaz.idioma === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label>
            <label>Nombre del navegador de IO (vacío = Google)
              <input name="nombreNavegador" maxlength="32" value="${esc(c.interfaz.nombreNavegador || 'Google')}" /></label>
            <label>Idioma del contenido
              <select name="politicaContenido">
                ${[['disponible', 'Idioma elegido cuando exista; si no, español'], ['excepciones', 'Solo el idioma elegido, con excepciones'], ['estricto', 'Solo contenido traducido al idioma elegido']].map(([v, t]) => `<option value="${v}" ${(c.interfaz.politicaContenido || 'disponible') === v ? 'selected' : ''}>${t}</option>`).join('')}
              </select></label>
            <label>Excepciones de idioma (un ID de actividad por línea; se usan en el modo con excepciones)
              <textarea name="excepcionesIdioma" rows="3">${esc((c.interfaz.excepcionesIdioma || []).join('\n'))}</textarea></label>
            <p class="nota">Por ejemplo, añade aquí actividades de Inglés que deban seguir apareciendo aunque el equipo esté configurado en catalán.</p>
          </fieldset>
          <fieldset><legend>PIN para apagar, cerrar sesión y salir</legend>
            <p class="nota">${c.seguridad.pinDefinido ? 'Hay un PIN definido. Apagar, cerrar sesión y salir lo piden.' : 'Sin PIN: apagar, cerrar sesión y salir no piden clave.'}</p>
            <label>Nuevo PIN (de 4 a 12 letras o números; vacío = no cambiar)
              <input name="pinNuevo" type="password" autocomplete="new-password" minlength="4" maxlength="12" pattern="[A-Za-z0-9]{4,12}" /></label>
            <label class="check"><input type="checkbox" name="quitarPin" /> Quitar el PIN</label>
          </fieldset>
          <fieldset><legend>Privacidad y almacenamiento</legend>
            <label class="check"><input type="checkbox" name="almacenamientoLocal" ${c.privacidad.almacenamientoLocal ? 'checked' : ''}/> Almacenamiento local en el equipo</label>
            <label class="check"><input type="checkbox" name="transmisionCentral" ${c.privacidad.transmisionCentral ? 'checked' : ''}/> Transmitir datos al servicio central</label>
            <label>Conservación (días)<input name="conservacionDias" type="number" min="1" max="3650" value="${c.privacidad.conservacionDias}"/></label>
          </fieldset>
        </div>
        <p><button type="submit">Guardar configuración</button> <span id="aviso-config" class="aviso"></span></p>
      </form>
      <h2>Dispositivos vinculados</h2>
      <div class="tabla"><table><thead><tr><th>Equipo</th><th>Versión</th><th>Último contacto</th><th>Estado</th><th></th></tr></thead><tbody>
        ${disp.length ? disp.map((d) => `<tr><td>${esc(d.nombre)}</td><td>${esc(d.appVersion)}</td>
          <td>${new Date(d.ultimoContacto).toLocaleString('es-ES')}</td><td><span class="insignia ${d.estado === 'activo' ? 'ok' : 'mal'}">${esc(d.estado)}</span></td>
          <td>${d.estado === 'activo' ? `<button class="peligro" data-desvincular="${esc(d.id)}">Desvincular</button>` : ''}</td></tr>`).join('')
          : '<tr><td colspan="5">Ningún equipo vinculado todavía.</td></tr>'}
      </tbody></table></div>
      <h2>Aceptaciones registradas</h2>
      <div class="tabla"><table><thead><tr><th>Documento</th><th>Versión</th><th>Tipo</th><th>Fecha</th><th>Tutor confirmado</th></tr></thead><tbody>
        ${acc.length ? acc.map((a) => `<tr><td>${esc(a.documentoId)}</td><td>${a.version}</td><td>${esc(a.tipo)}</td>
          <td>${new Date(a.fecha).toLocaleString('es-ES')}</td><td>${a.tutorConfirmado ? 'Sí' : 'No'}</td></tr>`).join('')
          : '<tr><td colspan="5">No hay aceptaciones registradas.</td></tr>'}
      </tbody></table></div>`;
    el.scrollIntoView({ behavior: 'smooth' });
  }

  function leerConfig(f) {
    const estados = {};
    for (const linea of f.juegosEstados.value.split('\n')) {
      const m = linea.match(/^\s*([^:]+?)\s*:\s*(visible|oculto|desactivado)\s*$/);
      if (m) estados[m[1]] = m[2];
    }
    const etapas = ['infantil', 'primaria'].filter((k) => f[`etapa_${k}`].checked);
    const tiempo = f.tiempoMaxMinutos.value === '' ? null : Number(f.tiempoMaxMinutos.value);
    return {
      herramientas: Object.fromEntries(['actividades', 'juegos', 'biblioteca', 'ajustes'].map((k) => [k, f[`h_${k}`].checked])),
      contenido: { etapas },
      restricciones: { tiempoMaxMinutos: tiempo, permitirGuardarBiblioteca: f.permitirGuardarBiblioteca.checked },
      juegos: { defecto: f.juegoDefecto.value, estados },
      actividades: { ocultas: f.ocultas.value.split('\n').map((x) => x.trim()).filter(Boolean) },
      interfaz: { ventanas: f.ventanas.value, mayusculas: f.mayusculas.value, idioma: f.idioma.value, politicaContenido: f.politicaContenido.value, excepcionesIdioma: f.excepcionesIdioma.value.split('\n').map((x) => x.trim()).filter(Boolean), nombreNavegador: f.nombreNavegador.value.trim() || 'Google' },
      seguridad: { pinNuevo: f.pinNuevo.value || undefined, quitarPin: f.quitarPin.checked },
      identificacion: f.identificacion.value,
      progreso: f.progreso.value,
      privacidad: {
        almacenamientoLocal: f.almacenamientoLocal.checked,
        transmisionCentral: f.transmisionCentral.checked,
        conservacionDias: Number(f.conservacionDias.value)
      }
    };
  }

  $('#detalle').addEventListener('submit', async (e) => {
    if (e.target.id !== 'form-config') return;
    e.preventDefault();
    const aviso = $('#aviso-config');
    try {
      const d = await api('PUT', `/api/admin/organizaciones/${encodeURIComponent(orgActual.id)}/configuracion`, { config: leerConfig(e.target) });
      aviso.textContent = d.sinCambios ? 'No había cambios.'
        : `Guardado (${TIPOS_CAMBIO[d.tipoCambio]}). Revisión ${d.revision}.`
          + (d.tipoCambio === 'normativo' ? ' Las familias deberán volver a aceptar las condiciones.' : '');
      await abrirDetalle(orgActual.id);
    } catch (err) { aviso.textContent = err.message; }
  });

  $('#detalle').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-desvincular]');
    if (!b) return;
    if (!confirm('¿Desvincular este equipo? Dejará de recibir configuración y deberá vincularse de nuevo con el código del centro.')) return;
    await api('POST', `/api/admin/dispositivos/${encodeURIComponent(b.dataset.desvincular)}/desvincular`, {});
    await abrirDetalle(orgActual.id);
  });

  // ── Documentos ────────────────────────────────────────────────────
  async function cargarDocs() {
    const docs = await api('GET', '/api/admin/documentos');
    $('#lista-docs').innerHTML = docs.length ? docs.map((d) => {
      const ultima = d.versiones[d.versiones.length - 1];
      return `<div class="fila-doc"><strong>${esc(d.titulo)}</strong> <span class="nota">${esc(d.tipo)} · versión ${ultima.version} · ${esc(TIPOS_CAMBIO[ultima.tipoCambio])}</span>
        ${ultima.requiereAceptacion ? '<span class="nota">· requiere aceptación</span>' : ''}
        ${ultima.requiereLectura ? '<span class="nota">· requiere lectura</span>' : ''}
        <div class="nota">Huella ${esc(ultima.hash.slice(0, 16))}… · ${new Date(ultima.creadaEn).toLocaleString('es-ES')}</div>
        <button class="plana" data-nueva="${esc(d.id)}">Publicar nueva versión</button></div>`;
    }).join('') : '<p class="nota">No hay documentos publicados.</p>';
  }

  $('#form-doc').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    const aviso = $('#aviso-doc');
    try {
      const d = await api('POST', '/api/admin/documentos', {
        tipo: f.tipo.value, titulo: f.titulo.value, texto: f.texto.value, tipoCambio: f.tipoCambio.value,
        requiereAceptacion: f.requiereAceptacion.checked, requiereLectura: f.requiereLectura.checked
      });
      aviso.textContent = `Publicado (versión ${d.version}).`;
      f.reset();
      await cargarDocs();
    } catch (err) { aviso.textContent = err.message; }
  });

  $('#lista-docs').addEventListener('click', async (e) => {
    const b = e.target.closest('[data-nueva]');
    if (!b) return;
    const texto = prompt('Texto de la nueva versión (mínimo 20 caracteres):');
    if (!texto) return;
    const tipoCambio = prompt('Tipo de cambio: tecnico, organizativo o normativo', 'organizativo');
    try {
      await api('POST', `/api/admin/documentos/${encodeURIComponent(b.dataset.nueva)}/versiones`, {
        texto, tipoCambio, requiereAceptacion: tipoCambio === 'normativo', requiereLectura: tipoCambio !== 'tecnico'
      });
      await cargarDocs();
    } catch (err) { alert(err.message); }
  });

  async function arrancar() {
    try {
      const r = await api('GET', '/api/admin/resumen');
      mostrarPanel(r.usuario);
      $('#cifras').innerHTML = [['Organizaciones', r.organizaciones], ['Equipos activos', r.dispositivosActivos], ['Documentos', r.documentos], ['Aceptaciones vigentes', r.aceptaciones]].map(([t, n]) => `<div class="cifra"><b>${n}</b><span>${t}</span></div>`).join('');
      await cargarOrgs();
    } catch (err) {
      cerrarSesion();
    }
  }

  if (token) arrancar(); else mostrarLogin();
})();
