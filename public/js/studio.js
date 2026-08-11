/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR STUDIO — Editor drag & drop estilo Canva
   Crea actividades con bloques de ejercicios (test, sopa de letras,
   relacionar, ordenar, completar) compatibles en web y app.
   · Imágenes de stock con cita de fuente bajo la imagen.
   · Publica en POST /api/junior/actividades (requiere acuerdo 18+).
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://admin-placeta.vercel.app/api/junior';

const TIPOS = {
  test:          { ico: 'quiz', nombre: 'Test' },
  texto:         { ico: 'menu_book', nombre: 'Texto explicativo' },
  sopa_letras:   { ico: 'text_fields', nombre: 'Sopa de letras' },
  relacionar:    { ico: 'link', nombre: 'Relacionar' },
  ordenar:       { ico: 'format_list_numbered', nombre: 'Ordenar' },
  completar:     { ico: 'edit_note', nombre: 'Completar' },
  calculo_mental: { ico: 'calculate', nombre: 'Cálculo mental' },
  mapa_mundi:    { ico: 'public', nombre: 'Mapamundi' },
  code_blocks:   { ico: 'code', nombre: 'Placeta Junior Code' }
};

// Iconos SVG 100% descriptivos para los bloques del Studio (en vez de emojis)
const STUDIO_ICONOS_SVG = {
  quiz: '<rect x="2" y="3" width="12" height="14" rx="2"/><path d="M5 7h6M5 10h6M5 13h4" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  menu_book: '<path d="M3 4h5a3 3 0 0 1 3 3v9a3 3 0 0 0-3-3H3z"/><path d="M13 4h5a3 3 0 0 1 3 3v9a3 3 0 0 0-3-3h-5z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  text_fields: '<path d="M4 5h8M8 5v11M5 16h6" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  link: '<path d="M6 11l5-5a3.5 3.5 0 0 1 5 5l-2 2M10 13l-5 5a3.5 3.5 0 0 1-5-5l2-2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  format_list_numbered: '<path d="M9 6h7M9 10h7M9 14h5M3 5l1-1v3M3 10h2M4 10v4M3 14h3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  edit_note: '<path d="M3 6h13M3 10h13M3 14h8M13 14l4-4 2 2-4 4h-2z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  calculate: '<path d="M4 3h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M6 6h1M9 6h1M6 9h1M9 9h1M6 12h4M12 13l3-3M12 10l3 3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
  public: '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c-2 2-2 10 0 12M8 2c2 2 2 10 0 12" stroke="currentColor" stroke-width="1.5" fill="none"/>',
  code: '<path d="M6 5L2 8l4 3M10 5l4 3-4 3" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  flecha_derecha: '<path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  flecha_izquierda: '<path d="M14 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  girar_derecha: '<path d="M8 2v5a3 3 0 0 0 3 3h3M12 7l2 3-2 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  girar_izquierda: '<path d="M8 2v5a3 3 0 0 1-3 3H2M4 7L2 10l2 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  saltar: '<path d="M3 12c1-4 2-6 5-7M8 2l3 3-3 3M13 13c0-2 0-3-1-5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  bucle: '<path d="M3 7a5 5 0 0 1 5-4 5 5 0 0 1 5 4M13 9v4M13 9h-4M2 14l3-3 3 3" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  diamante: '<path d="M8 2l6 6-6 6-6-6 6-6zM8 5.5L10.5 8 8 10.5 5.5 8 8 5.5z" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
};

function studioIconoSVG(ico, cls) {
  const d = STUDIO_ICONOS_SVG[ico] || STUDIO_ICONOS_SVG.quiz;
  return `<svg class="blk-icono ${cls || ''}" width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">${d}</svg>`;
}

// ── Galería de imágenes libres ──────────────────────────────────────
// Temas con imágenes por seed en Picsum (fotos reales de Unsplash)
const TEMAS = ['Astronomía','Animales','Naturaleza','Comida','Deportes','Tecnología','Viajes','Arte','Mascotas','Ciencias','Espacio','Ciudad','Plantas','Transporte'];
function picsumDe(tema, i) {
  const seed = 'pj-' + tema.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-') + '-' + i;
  return { url: `https://picsum.photos/seed/${seed}/640/420`, fuente: 'Foto: Unsplash (vía picsum.photos)', prov: 'picsum', tema };
}
const PICS = [];
TEMAS.forEach((t) => { for (let i = 1; i <= 6; i++) PICS.push(picsumDe(t, i)); });

// Unsplash: fotos libres conocidas, con tema y autor en la fuente
const UNSPLASH = [
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&q=80', fuente: 'Foto: Unsplash · planetas', prov: 'unsplash', tema: 'Espacio' },
  { url: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=640&q=80', fuente: 'Foto: Unsplash · astronauta', prov: 'unsplash', tema: 'Espacio' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&q=80', fuente: 'Foto: Unsplash · montaña', prov: 'unsplash', tema: 'Naturaleza' },
  { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=80', fuente: 'Foto: Unsplash · playa', prov: 'unsplash', tema: 'Viajes' },
  { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=640&q=80', fuente: 'Foto: Unsplash · bosque', prov: 'unsplash', tema: 'Naturaleza' },
  { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=640&q=80', fuente: 'Foto: Unsplash · perro', prov: 'unsplash', tema: 'Mascotas' },
  { url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=640&q=80', fuente: 'Foto: Unsplash · gato', prov: 'unsplash', tema: 'Mascotas' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640&q=80', fuente: 'Foto: Unsplash · pizza', prov: 'unsplash', tema: 'Comida' },
  { url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=640&q=80', fuente: 'Foto: Unsplash · ciudad', prov: 'unsplash', tema: 'Ciudad' },
  { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=640&q=80', fuente: 'Foto: Unsplash · tecnología', prov: 'unsplash', tema: 'Tecnología' },
  { url: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=640&q=80', fuente: 'Foto: Unsplash · deporte', prov: 'unsplash', tema: 'Deportes' },
  { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&q=80', fuente: 'Foto: Unsplash · equipo', prov: 'unsplash', tema: 'Tecnología' },
  { url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&q=80', fuente: 'Foto: Unsplash · naturaleza', prov: 'unsplash', tema: 'Naturaleza' },
  { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=640&q=80', fuente: 'Foto: Unsplash · paisaje', prov: 'unsplash', tema: 'Naturaleza' }
];
const GALERIA = [...PICS, ...UNSPLASH];

let galeriaProv = 'todos';
let galeriaBusqueda = '';
let galeriaActual = [];
let galeriaArasaac = [];          // resultados ARASAAC del último término
let galeriaArasaacQ = '';
let galeriaArasaacCargando = false;

function renderGaleria() {
  const q = galeriaBusqueda.trim().toLowerCase();
  let lista = GALERIA;
  if (galeriaProv !== 'todos') lista = lista.filter(g => g.prov === galeriaProv);
  if (q) lista = lista.filter(g => (g.tema || '').toLowerCase().includes(q) || (g.fuente || '').toLowerCase().includes(q));
  // Con búsqueda, añade más imágenes de Picsum generadas a partir del término
  if (q && (galeriaProv === 'todos' || galeriaProv === 'picsum')) {
    const seed = q.replace(/[^a-z0-9]+/gi, '-').slice(0, 30) || 'pj';
    const ya = new Set(lista.map(g => g.url));
    for (let i = 1; i <= 8; i++) {
      const u = `https://picsum.photos/seed/${seed}-${i}/640/420`;
      if (!ya.has(u)) lista.push({ url: u, fuente: `Foto: Unsplash (vía picsum.photos) · ${q}`, prov: 'picsum', tema: q });
    }
  }
  // Pictogramas ARASAAC por internet (solo cuando hay búsqueda)
  if (q && (galeriaProv === 'todos' || galeriaProv === 'arasaac')) {
    const qo = galeriaBusqueda.trim();
    if (galeriaArasaacQ === qo && galeriaArasaac.length) {
      lista = lista.concat(galeriaArasaac);
    } else if (!galeriaArasaacCargando) {
      galeriaArasaacCargando = true;
      if (window.Pictogramas) {
        window.Pictogramas.buscar(qo, 40).then(items => {
          galeriaArasaac = items.map(p => ({
            url: window.Pictogramas.urlImagen(p.id, 500),
            thumb: p.url,
            fuente: `Pictograma: ARASAAC (arasaac.org) · ${p.palabra}`,
            prov: 'arasaac', tema: p.palabra
          }));
          galeriaArasaacQ = qo;
          galeriaArasaacCargando = false;
          if (galeriaBusqueda.trim() === qo) renderGaleria();
        }).catch(() => { galeriaArasaacCargando = false; });
      } else {
        galeriaArasaacCargando = false;
      }
      lista.push({ url: '', thumb: '', fuente: '', prov: 'arasaac', tema: '⏳ Buscando pictos…', cargando: true });
    } else {
      lista.push({ url: '', thumb: '', fuente: '', prov: 'arasaac', tema: '⏳ Buscando pictos…', cargando: true });
    }
  }
  galeriaActual = lista.slice(0, 120);
  const cont = $('stock-thumbs');
  if (galeriaActual.length === 0) {
    cont.innerHTML = '<div class="g-empty">Sin resultados. Prueba otra búsqueda o pega tu propia URL.</div>';
    return;
  }
  cont.innerHTML = galeriaActual.map((g, idx) =>
    `<div class="g-item" style="background-image:url('${g.thumb || g.url}')" data-i="${idx}" onclick="elegirGaleria(${idx})"><span class="g-tag">${esc(g.tema || g.prov)}</span></div>`
  ).join('');
}

function elegirGaleria(i) {
  const g = galeriaActual[i];
  if (!g || g.cargando) return;
  $('img-url').value = g.url;
  $('img-fuente').value = g.fuente;
  document.querySelectorAll('#stock-thumbs .g-item').forEach((t, idx) => t.classList.toggle('active', idx === i));
}

let bloques = [];
let meta = { titulo: '', descripcion: '', categoria: 'Matemáticas', tipo: 'test', edad: '6-12', dificultad: 'media', tiempo: 10, dip: '' };
let proyectoActual = 'Mi actividad';
let imgTarget = null; // dónde se aplicará la imagen del modal

function $(id) { return document.getElementById(id); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ── Multi-proyecto ───────────────────────────────────────────────────
// Todos los proyectos se guardan en localStorage bajo 'pj-studio-proyectos'
// (un objeto { id: { nombre, bloques, meta, actualizado } }). El activo se
// recuerda en 'pj-studio-activo'. Compatible con el antiguo 'pj-studio'.
const STORE_KEY = 'pj-studio-proyectos';
const ACTIVE_KEY = 'pj-studio-activo';

function listarProyectos() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return d || {};
  } catch (e) { return {}; }
}
function guardarProyecto(nombre) {
  const clave = (nombre || '').trim() || 'Mi actividad';
  const d = listarProyectos();
  if (!d[clave]) d[clave] = { nombre: clave };
  d[clave].bloques = bloques;
  d[clave].meta = meta;
  d[clave].actualizado = Date.now();
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {}
  proyectoActual = clave;
  try { localStorage.setItem(ACTIVE_KEY, clave); } catch (e) {}
  renderProyectos();
}
function cargarProyecto(clave) {
  const d = listarProyectos();
  const p = d[clave];
  if (!p) return false;
  bloques = p.bloques || [];
  meta = Object.assign(meta, p.meta || {});
  proyectoActual = clave;
  try { localStorage.setItem(ACTIVE_KEY, clave); } catch (e) {}
  render();
  renderProyectos();
  return true;
}
function nuevoProyecto(nombre) {
  const clave = (nombre || '').trim() || ('Mi actividad ' + (Object.keys(listarProyectos()).length + 1));
  bloques = [];
  meta = { titulo: '', descripcion: '', categoria: 'Matemáticas', tipo: 'test', edad: '6-12', dificultad: 'media', tiempo: 10, dip: '' };
  proyectoActual = clave;
  guardarProyecto(clave);
  render();
}
function duplicarProyecto(clave) {
  const d = listarProyectos();
  const p = d[clave];
  if (!p) return;
  const nueva = clave + ' (copia)';
  let n = 1;
  let nombreFinal = nueva;
  while (d[nombreFinal]) { nombreFinal = nueva + ' ' + (++n); }
  d[nombreFinal] = { nombre: nombreFinal, bloques: JSON.parse(JSON.stringify(p.bloques || [])), meta: JSON.parse(JSON.stringify(p.meta || {})), actualizado: Date.now() };
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {}
  cargarProyecto(nombreFinal);
}
function borrarProyecto(clave) {
  const d = listarProyectos();
  if (!d[clave]) return;
  delete d[clave];
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {}
  if (proyectoActual === clave) {
    const restantes = Object.keys(d);
    if (restantes.length) cargarProyecto(restantes[0]);
    else { bloques = []; meta = { titulo: '', descripcion: '', categoria: 'Matemáticas', tipo: 'test', edad: '6-12', dificultad: 'media', tiempo: 10, dip: '' }; proyectoActual = 'Mi actividad'; render(); }
  }
  renderProyectos();
}
function renderProyectos() {
  const sel = $('proyecto-select');
  if (!sel) return;
  const d = listarProyectos();
  const claves = Object.keys(d).sort((a, b) => (d[b].actualizado || 0) - (d[a].actualizado || 0));
  sel.innerHTML = claves.map(c => `<option value="${esc(c)}" ${c === proyectoActual ? 'selected' : ''}>${esc(c)}</option>`).join('') || '<option value="Mi actividad">Mi actividad</option>';
  const name = $('proyecto-nombre');
  if (name) name.value = proyectoActual;
}

function renombrarProyecto(nombre) {
  const nuevo = (nombre || '').trim();
  if (!nuevo) { renderProyectos(); return; }
  const d = listarProyectos();
  if (d[nuevo] && nuevo !== proyectoActual) {
    aviso('Ya existe un proyecto con ese nombre.', true);
    renderProyectos();
    return;
  }
  if (nuevo === proyectoActual) { renderProyectos(); return; }
  // Renombra (cambia la clave)
  d[nuevo] = { nombre: nuevo, bloques: bloques, meta: meta, actualizado: Date.now() };
  if (d[proyectoActual] && proyectoActual !== nuevo) delete d[proyectoActual];
  try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) {}
  proyectoActual = nuevo;
  try { localStorage.setItem(ACTIVE_KEY, nuevo); } catch (e) {}
  renderProyectos();
}
function nuevoProyectoPrompt() {
  const nombre = prompt('Nombre del nuevo proyecto:', '');
  if (nombre === null) return;
  nuevoProyecto(nombre);
}
function borrarProyectoPrompt() {
  if (!confirm(`¿Borrar el proyecto "${proyectoActual}"? Esta acción no se puede deshacer.`)) return;
  borrarProyecto(proyectoActual);
}

// ── Estado ───────────────────────────────────────────────────────────
function nuevoBloque(tipo) {
  const b = { tipo, titulo: TIPOS[tipo].nombre, imagen_url: null, imagen_alt: null, fuente: null };
  if (tipo === 'test') b.preguntas = [{ pregunta: '', opciones: ['', '', '', ''], correcta: 0, imagen_url: null, imagen_alt: null, fuente: null }];
  if (tipo === 'texto') b.contenido = '';
  if (tipo === 'sopa_letras') { b.palabras = ['', '']; b.pistas = ['', '']; b.tamano = 10; }
  if (tipo === 'relacionar') b.pares = [{ izq: '', der: '', izq_img: null, izq_alt: null, izq_fuente: null }];
  if (tipo === 'ordenar') b.items = ['', '', ''];
  if (tipo === 'completar') b.frases = [{ texto: '', respuesta: '', opciones: ['', ''] }];
  if (tipo === 'calculo_mental') { b.sumas = [{ a: '', b: '' }]; b.segundos = 10; b.modo = 'opciones'; }
  if (tipo === 'mapa_mundi') { b.paises = ['España', 'Francia']; b.preguntas = []; }
  if (tipo === 'code_blocks') {
    b.explicacion = '';
    b.ejercicios = [{
      titulo: 'Ejercicio 1',
      explicacion: '',
      objetivo_texto: 'Lleva a Candela hasta la estrella.',
      escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] },
      inicio: { x: 0, y: 0, direccion: 'derecha' },
      objetivo: { posicion: { x: 1, y: 0 }, max_pasos: 5 },
      permitidos: ['avanzar', 'retroceder', 'girar', 'saltar'],
      max_bloques: 5,
      pistas: []
    }];
  }
  return b;
}

function guardar() {
  try { guardarProyecto(proyectoActual); } catch (e) {}
}
function cargar() {
  try {
    // 1) Proyecto activo (multi-proyecto)
    const activo = localStorage.getItem(ACTIVE_KEY);
    if (activo && cargarProyecto(activo)) return;
    // 2) Compatibilidad: antigua clave única 'pj-studio'
    const d = JSON.parse(localStorage.getItem('pj-studio') || 'null');
    if (d) {
      bloques = d.bloques || [];
      meta = Object.assign(meta, d.meta || {});
      proyectoActual = d.meta?.titulo || 'Mi actividad';
      guardarProyecto(proyectoActual);
      renderProyectos();
      return;
    }
    // 3) Sin nada: asegurar que existe al menos un proyecto por defecto
    if (!Object.keys(listarProyectos()).length) guardarProyecto('Mi actividad');
    renderProyectos();
  } catch (e) { /* sin almacenamiento */ }
}

// ── Render ───────────────────────────────────────────────────────────
function render() {
  const canvas = $('canvas');
  if (bloques.length === 0) {
    canvas.innerHTML = '<div id="canvas-empty" class="canvas-empty">Arrastra bloques aquí 👇</div>';
  } else {
    canvas.innerHTML = bloques.map((b, i) => renderBloque(b, i)).join('');
  }
  guardar();
}

function renderBloque(b, i) {
  let cuerpo = '';
  if (b.tipo === 'test') cuerpo = renderTest(b, i);
  else if (b.tipo === 'texto') cuerpo = renderTexto(b, i);
  else if (b.tipo === 'sopa_letras') cuerpo = renderSopa(b, i);
  else if (b.tipo === 'relacionar') cuerpo = renderRelacionar(b, i);
  else if (b.tipo === 'ordenar') cuerpo = renderOrdenar(b, i);
  else if (b.tipo === 'completar') cuerpo = renderCompletar(b, i);
  else if (b.tipo === 'calculo_mental') cuerpo = renderCalculo(b, i);
  else if (b.tipo === 'mapa_mundi') cuerpo = renderMapa(b, i);
  else if (b.tipo === 'code_blocks') cuerpo = renderCode(b, i);

  return `
  <div class="block" id="bloque-${i}">
    <div class="block-header">
      <span class="b-ico material-symbols-rounded">${TIPOS[b.tipo].ico}</span>
      <span class="b-name">${esc(b.titulo || TIPOS[b.tipo].nombre)}</span>
      <div class="b-tools">
        <button class="b-btn up"   onclick="moverBloque(${i},-1)" title="Subir"><span class="material-symbols-rounded">arrow_upward</span></button>
        <button class="b-btn down" onclick="moverBloque(${i}, 1)" title="Bajar"><span class="material-symbols-rounded">arrow_downward</span></button>
        <button class="b-btn del"  onclick="borrarBloque(${i})" title="Eliminar"><span class="material-symbols-rounded">delete</span></button>
      </div>
    </div>
    <div class="block-body">
      <label>Nombre del bloque</label>
      <input value="${esc(b.titulo)}" oninput="setCampo(${i},'titulo',this.value)" />
      ${cuerpo}
      ${renderImagenBloque(b, i)}
    </div>
  </div>`;
}

function renderImagenBloque(b, i) {
  const prev = b.imagen_url
    ? `<div class="img-preview"><img src="${esc(b.imagen_url)}" alt="${esc(b.imagen_alt || '')}"><div class="img-fuente"><span class="material-symbols-rounded q-ico">photo_camera</span> ${esc(b.fuente || 'Fuente sin indicar')}</div>
       ${b.imagen_alt ? `<div class="img-alt-txt">♿ ${esc(b.imagen_alt)}</div>` : ''}
       <button class="img-remove" onclick="quitarImagenBloque(${i})">✕</button></div>`
    : '';
  return `
    <label>Imagen del bloque (opcional)</label>
    <div class="img-pick">
      <button class="b-btn" type="button" onclick="abrirImagen('bloque',${i})"><span class="material-symbols-rounded">image</span> Imagen de stock</button>
    </div>
    ${prev}`;
}

// ── Texto explicativo ────────────────────────────────────────────────
function renderTexto(b, i) {
  return `
    <div class="q-item">
      <div class="q-head"><span class="q-num"><span class="material-symbols-rounded q-ico">menu_book</span> Explicación</span>
        <div class="q-tools"><button class="b-btn" type="button" title="Poner imagen" onclick="abrirImagen('bloque',${i})"><span class="material-symbols-rounded">image</span></button></div>
      </div>
      ${b.imagen_url ? `
      <div class="img-preview">
        <img src="${esc(b.imagen_url)}" alt="${esc(b.imagen_alt || '')}">
        <div class="img-fuente"><span class="material-symbols-rounded q-ico">photo_camera</span> ${esc(b.fuente || 'Fuente sin indicar')}</div>
        ${b.imagen_alt ? `<div class="img-alt-txt">♿ ${esc(b.imagen_alt)}</div>` : ''}
        <button class="img-remove" onclick="quitarImagenBloque(${i})">✕</button>
      </div>` : ''}
      <textarea rows="5" placeholder="Explica el contenido antes de preguntar. Puedes usar saltos de línea y listas." style="width:100%;margin-top:8px;" oninput="setCampo(${i},'contenido',this.value)">${esc(b.contenido || '')}</textarea>
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">lightbulb</span> Este bloque enseña: se muestra al niño y pulsa "Continuar" para pasar a las preguntas.</p>
    </div>`;
}

// ── Test ─────────────────────────────────────────────────────────────
function renderTest(b, i) {
  return b.preguntas.map((p, j) => `
    <div class="q-item ${p.correcta >= 0 && p.opciones[p.correcta] ? '' : ''}" id="q-${i}-${j}">
      <div class="q-head">
        <span class="q-num">Pregunta ${j + 1}</span>
        <div class="q-tools">
          <button class="b-btn" type="button" onclick="imagenPregunta(${i},${j})"><span class="material-symbols-rounded">image</span> Imagen</button>
          <button class="b-btn del" type="button" onclick="borrarPregunta(${i},${j})"><span class="material-symbols-rounded">delete</span></button>
        </div>
      </div>
      <input placeholder="Escribe la pregunta" value="${esc(p.pregunta)}" oninput="setPregunta(${i},${j},'pregunta',this.value)" />
      ${p.imagen_url ? `
        <div class="img-preview">
          <img src="${esc(p.imagen_url)}" alt="${esc(p.imagen_alt || '')}">
          <div class="img-fuente"><span class="material-symbols-rounded q-ico">photo_camera</span> ${esc(p.fuente || 'Fuente sin indicar')}</div>
          ${p.imagen_alt ? `<div class="img-alt-txt">♿ ${esc(p.imagen_alt)}</div>` : ''}
          <button class="img-remove" onclick="quitarImagenPregunta(${i},${j})">✕</button>
        </div>` : ''}
      ${p.opciones.map((op, k) => `
        <div class="opt ${k === p.correcta ? 'correct' : ''}">
          <button class="b-btn" type="button" title="Marcar como correcta"
            onclick="marcarCorrecta(${i},${j},${k})">${k === p.correcta ? '✅' : '○'}</button>
          <input placeholder="Opción ${k + 1}" value="${esc(op)}" oninput="setPregunta(${i},${j},'opciones',this.value,${k})" />
          ${p.opciones.length > 2 ? `<button class="b-btn del" type="button" onclick="borrarOpcion(${i},${j},${k})">✕</button>` : ''}
        </div>`).join('')}
      <button class="b-btn" type="button" style="margin-top:8px;" onclick="anadirOpcion(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Opción</button>
    </div>`).join('') +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirPregunta(${i})"><span class="material-symbols-rounded seg-ico">add</span> Añadir pregunta</button>`;
}

// ── Sopa de letras ───────────────────────────────────────────────────
function renderSopa(b, i) {
  const filas = b.palabras.map((p, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Palabra ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'palabras',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <input placeholder="Palabra" value="${esc(p)}" oninput="setItem(${i},'palabras',${j},this.value)" />
      <input placeholder="Pista (opcional)" value="${esc(b.pistas[j] || '')}" style="margin-top:6px;" oninput="setItem(${i},'pistas',${j},this.value)" />
    </div>`).join('');
  return `<div class="row2">
      <div><label>Tamaño del cuadro</label><input type="number" min="8" max="16" value="${b.tamano}" oninput="setCampo(${i},'tamano',this.value)" /></div>
    </div>${filas}
    <button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'palabras','pistas')"><span class="material-symbols-rounded seg-ico">add</span> Añadir palabra</button>`;
}

// ── Relacionar ───────────────────────────────────────────────────────
function renderRelacionar(b, i) {
  const modo = b.modo || 'emparejar';
  const togg = `
    <div class="row2" style="margin-bottom:14px;">
      <div>
        <label>Modo de juego</label>
        <div class="seg">
          <button type="button" class="chip-cat ${modo === 'emparejar' ? 'active' : ''}" onclick="setModoRelacionar(${i},'emparejar')"><span class="material-symbols-rounded seg-ico">track_changes</span> Emparejar</button>
          <button type="button" class="chip-cat ${modo === 'escribir' ? 'active' : ''}" onclick="setModoRelacionar(${i},'escribir')"><span class="material-symbols-rounded seg-ico">edit_note</span> Escribir la palabra</button>
        </div>
      </div>
      <p class="form-note" style="align-self:center;margin:0;">${modo === 'escribir'
        ? 'El niño ve el pictograma y escribe la palabra que corresponde.'
        : 'El niño toca un elemento de cada lado para emparejarlo.'}</p>
    </div>`;
  const filas = b.pares.map((p, j) => {
    const esEscribir = modo === 'escribir';
    return `
    <div class="q-item">
      <div class="q-head">
        <span class="q-num">${esEscribir ? 'Palabra' : 'Pareja'} ${j + 1}</span>
        <div class="q-tools">
          <button class="b-btn" type="button" title="Poner pictograma ARASAAC" onclick="imagenPareja(${i},${j})"><span class="material-symbols-rounded">image</span></button>
          <button class="b-btn del" type="button" onclick="borrarItem(${i},'pares',${j})"><span class="material-symbols-rounded">delete</span></button>
        </div>
      </div>
      ${p.izq_img ? `
      <div class="img-preview">
        <img src="${esc(p.izq_img)}" alt="${esc(p.izq_alt || '')}">
        <div class="img-fuente"><span class="material-symbols-rounded q-ico">photo_camera</span> ${esc(p.izq_fuente || 'Fuente sin indicar')}</div>
        ${p.izq_alt ? `<div class="img-alt-txt">♿ ${esc(p.izq_alt)}</div>` : ''}
        <button class="img-remove" onclick="quitarImagenPareja(${i},${j})">✕</button>
      </div>` : ''}
      <div class="row2">
        <input placeholder="${esEscribir ? 'Pista / etiqueta (opcional)' : 'Izquierda (ej: Sol)'}" value="${esc(p.izq)}" oninput="setPareja(${i},${j},'izq',this.value)" />
        <input placeholder="${esEscribir ? 'Palabra correcta' : 'Derecha (ej: Estrella)'}" value="${esc(p.der)}" oninput="setPareja(${i},${j},'der',this.value)" />
      </div>
      ${esEscribir && !p.izq_img
        ? '<p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">lightbulb</span> Pulsa <span class="material-symbols-rounded q-ico">image</span> para poner el pictograma que debe escribir el niño. Sin pictograma se mostrará la pista en grande.</p>'
        : ''}
    </div>`;
  }).join('');
  return togg + filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'pares')"><span class="material-symbols-rounded seg-ico">add</span> Añadir ${modo === 'escribir' ? 'palabra' : 'pareja'}</button>`;
}

// ── Mapamundi ────────────────────────────────────────────────────────
function renderMapa(b, i) {
  const filas = (b.paises || []).map((p, j) => {
    const ok = window.MAPA_MUNDI && MAPA_MUNDI.paises[p];
    return `
    <div class="q-item">
      <div class="q-head"><span class="q-num">País ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'paises',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <input placeholder="Nombre del país (ej: España)" value="${esc(p)}" oninput="setItem(${i},'paises',${j},this.value)" list="mapa-paises" />
      ${ok ? '<p class="form-note ok" style="margin:4px 0 0;color:var(--pj-green,#22a06b);"><span class="material-symbols-rounded q-ico">check_circle</span> País disponible en el mapamundi</p>'
           : '<p class="form-note err" style="margin:4px 0 0;color:#dc2626;"><span class="material-symbols-rounded q-ico">error</span> No está en el mapamundi (revisa el nombre)</p>'}
    </div>`;
  }).join('');
  const lista = window.MAPA_MUNDI ? Object.keys(MAPA_MUNDI.paises).map(p => `<option value="${esc(p)}">`).join('') : '';
  return `
    <datalist id="mapa-paises">${lista}</datalist>
    <p class="form-note"><span class="material-symbols-rounded q-ico">public</span> El niño pulsa el país en un mapamundi real (Leaflet). Se le pregunta por cada país añadido.</p>
    ${filas}
    <button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'paises')"><span class="material-symbols-rounded seg-ico">add</span> Añadir país</button>`;
}

// ── Ordenar ──────────────────────────────────────────────────────────
function renderOrdenar(b, i) {
  const filas = b.items.map((it, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Paso ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'items',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <input placeholder="Elemento en orden correcto" value="${esc(it)}" oninput="setItem(${i},'items',${j},this.value)" />
    </div>`).join('');
  return filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'items')"><span class="material-symbols-rounded seg-ico">add</span> Añadir paso</button>`;
}

// ── Completar ────────────────────────────────────────────────────────
function renderCompletar(b, i) {
  const modo = b.modo || 'escribir';
  const togg = `
    <div class="row2" style="margin-bottom:14px;">
      <div>
        <label>Modo de juego</label>
        <div class="seg">
          <button type="button" class="chip-cat ${modo === 'escribir' ? 'active' : ''}" onclick="setModoCompletar(${i},'escribir')"><span class="material-symbols-rounded seg-ico">edit_note</span> Escribir la palabra</button>
          <button type="button" class="chip-cat ${modo === 'opciones' ? 'active' : ''}" onclick="setModoCompletar(${i},'opciones')"><span class="material-symbols-rounded seg-ico">radio_button_checked</span> Elegir opción</button>
        </div>
      </div>
      <p class="form-note" style="align-self:center;margin:0;">${modo === 'opciones'
        ? 'El niño elige la palabra que rellena el hueco entre varias opciones.'
        : 'El niño escribe la palabra que falta en el hueco.'}</p>
    </div>`;
  const filas = b.frases.map((f, j) => {
    const opciones = f.opciones || ['', ''];
    return `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Frase ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'frases',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <input placeholder="Frase con hueco (usa ___)" value="${esc(f.texto)}" oninput="setFrase(${i},${j},'texto',this.value)" />
      <input placeholder="Respuesta que rellena el hueco" value="${esc(f.respuesta)}" style="margin-top:6px;" oninput="setFrase(${i},${j},'respuesta',this.value)" />
      ${modo === 'opciones' ? `
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">radio_button_checked</span> Opciones falsas (distractores)</p>
      <div class="row2">
        <input placeholder="Opción falsa 1 (ej: gato)" value="${esc(opciones[0])}" oninput="setFraseOpcion(${i},${j},0,this.value)" />
        <input placeholder="Opción falsa 2 (ej: pájaro)" value="${esc(opciones[1])}" oninput="setFraseOpcion(${i},${j},1,this.value)" />
      </div>` : ''}
    </div>`;
  }).join('');
  return togg + filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'frases')"><span class="material-symbols-rounded seg-ico">add</span> Añadir frase</button>`;
}

// ── Cálculo mental ─────────────────────────────────────────────────
function renderCalculo(b, i) {
  const filas = (b.sumas || []).map((s, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Suma ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'sumas',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <div class="row2">
        <input type="number" inputmode="numeric" placeholder="Número A" value="${esc(s.a)}" oninput="setSuma(${i},${j},'a',this.value)" />
        <input type="number" inputmode="numeric" placeholder="Número B" value="${esc(s.b)}" oninput="setSuma(${i},${j},'b',this.value)" />
      </div>
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">calculate</span> ${(Number(s.a) || 0)} + ${(Number(s.b) || 0)} = ${(Number(s.a) || 0) + (Number(s.b) || 0)}</p>
    </div>`).join('');
  return `
    <div class="row2">
      <div><label><span class="material-symbols-rounded q-ico">timer</span> Segundos por suma</label><input type="number" min="3" max="60" value="${b.segundos || 10}" oninput="setCampo(${i},'segundos',this.value)" /></div>
      <div><label>Cómo responden</label>
        <select onchange="setCampo(${i},'modo',this.value)">
          <option value="opciones" ${b.modo !== 'escribir' ? 'selected' : ''}>3 opciones</option>
          <option value="escribir" ${b.modo === 'escribir' ? 'selected' : ''}>Escriben la respuesta</option>
        </select>
      </div>
    </div>
    ${filas}
    <button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirSuma(${i})"><span class="material-symbols-rounded seg-ico">add</span> Añadir suma</button>`;
}

function setSuma(i, j, lado, valor) { bloques[i].sumas[j][lado] = valor; }
function anadirSuma(i) { bloques[i].sumas.push({ a: '', b: '' }); render(); }

// ── Placeta Junior Code ─────────────────────────────────────────────
const CODE_BLOQUES_EDITOR = [
  { op: 'avanzar',    nombre: 'AVANZAR',    icono: 'flecha_derecha' },
  { op: 'retroceder', nombre: 'RETROCEDER', icono: 'flecha_izquierda' },
  { op: 'girar',      nombre: 'GIRAR →',    icono: 'girar_derecha' },
  { op: 'girar_izq',  nombre: 'GIRAR ←',    icono: 'girar_izquierda' },
  { op: 'saltar',     nombre: 'SALTAR',     icono: 'saltar' },
  { op: 'repetir',    nombre: 'REPETIR',    icono: 'bucle' },
  { op: 'si',         nombre: 'SI',         icono: 'diamante' },
];

function renderCode(b, i) {
  const ejercicios = b.ejercicios || [];
  const explicacion = `
    <div class="q-item">
      <div class="q-head"><span class="q-num"><span class="material-symbols-rounded q-ico">code</span> Explicación de la actividad</span></div>
      <textarea rows="3" placeholder="Explica qué va a aprender el niño (se muestra antes de jugar)…" style="width:100%;margin-top:8px;" oninput="setCampo(${i},'explicacion',this.value)">${esc(b.explicacion || '')}</textarea>
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">lightbulb</span> El niño programa a Candela 👧 con bloques y la lleva hasta la estrella ⭐. Cada ejercicio es un poco más difícil.</p>
    </div>`;
  const lista = ejercicios.map((ej, j) => renderCodeEjercicio(b, i, ej, j)).join('');
  return explicacion + lista +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirEjercicio(${i})"><span class="material-symbols-rounded seg-ico">add</span> Añadir ejercicio</button>
     <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">flag</span> Con 2 o más ejercicios se crea una <b>evolución progresiva</b>: el niño los supera uno a uno.</p>`;
}

function renderCodeEjercicio(b, i, ej, j) {
  const permitidos = ej.permitidos || [];
  const escen = ej.escenario || {};
  const obst = (escen.obstaculos || []).map((o, k) =>
    `<div class="row2" style="align-items:center;gap:8px;">
      <input type="number" min="0" placeholder="X" value="${o.x}" style="flex:1;" oninput="setObstaculo(${i},${j},${k},'x',this.value)" />
      <input type="number" min="0" placeholder="Y" value="${o.y}" style="flex:1;" oninput="setObstaculo(${i},${j},${k},'y',this.value)" />
      <button class="b-btn del" type="button" onclick="borrarObstaculo(${i},${j},${k})"><span class="material-symbols-rounded">delete</span></button>
    </div>`).join('');
  const monedas = (escen.monedas || []).map((m, k) =>
    `<div class="row2" style="align-items:center;gap:8px;">
      <input type="number" min="0" placeholder="X" value="${m.x}" style="flex:1;" oninput="setMoneda(${i},${j},${k},'x',this.value)" />
      <input type="number" min="0" placeholder="Y" value="${m.y}" style="flex:1;" oninput="setMoneda(${i},${j},${k},'y',this.value)" />
      <button class="b-btn del" type="button" onclick="borrarMoneda(${i},${j},${k})"><span class="material-symbols-rounded">delete</span></button>
    </div>`).join('');
  const pistas = (ej.pistas || []).map((p, k) =>
    `<div class="row2" style="align-items:center;gap:8px;">
      <input placeholder="Pista ${k + 1}" value="${esc(p)}" style="flex:1;" oninput="setPista(${i},${j},${k},this.value)" />
      <button class="b-btn del" type="button" onclick="borrarPista(${i},${j},${k})"><span class="material-symbols-rounded">delete</span></button>
    </div>`).join('');
  return `
  <div class="q-item" style="border-left:4px solid var(--pj-purple,#4E3B70);">
    <div class="q-head">
      <span class="q-num"><span class="material-symbols-rounded q-ico">code</span> Ejercicio ${j + 1}</span>
      <div class="q-tools">
        <button class="b-btn up"   onclick="moverEjercicio(${i},${j},-1)" title="Subir ejercicio"><span class="material-symbols-rounded">arrow_upward</span></button>
        <button class="b-btn down" onclick="moverEjercicio(${i},${j}, 1)" title="Bajar ejercicio"><span class="material-symbols-rounded">arrow_downward</span></button>
        <button class="b-btn del"  onclick="borrarEjercicio(${i},${j})" title="Eliminar ejercicio"><span class="material-symbols-rounded">delete</span></button>
      </div>
    </div>
    <input placeholder="Título del ejercicio (ej: Avanza 1 casilla)" value="${esc(ej.titulo || '')}" oninput="setEjercicio(${i},${j},'titulo',this.value)" />
    <input placeholder="Objetivo para el niño (ej: Lleva a Candela a la estrella (1,0))" value="${esc(ej.objetivo_texto || '')}" style="margin-top:6px;" oninput="setEjercicio(${i},${j},'objetivo_texto',this.value)" />
    <textarea rows="2" placeholder="Explicación extra del ejercicio (opcional)" style="width:100%;margin-top:6px;" oninput="setEjercicio(${i},${j},'explicacion',this.value)">${esc(ej.explicacion || '')}</textarea>
    <div class="row2" style="grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px;">
      <div><label>Ancho (columnas)</label><input type="number" min="3" max="12" value="${escen.ancho || 6}" oninput="setEscenario(${i},${j},'ancho',this.value)" /></div>
      <div><label>Alto (filas)</label><input type="number" min="3" max="12" value="${escen.alto || 6}" oninput="setEscenario(${i},${j},'alto',this.value)" /></div>
      <div><label>Máx. pasos</label><input type="number" min="1" max="40" value="${ej.objetivo ? (ej.objetivo.max_pasos || 5) : 5}" oninput="setObjetivo(${i},${j},'max_pasos',this.value)" /></div>
    </div>
    <div class="row2" style="grid-template-columns:1fr 1fr;gap:8px;margin-top:8px;">
      <div>
        <label>Inicio de Candela (x,y)</label>
        <div class="row2" style="gap:8px;">
          <input type="number" min="0" placeholder="X" value="${ej.inicio ? ej.inicio.x : 0}" oninput="setInicio(${i},${j},'x',this.value)" />
          <input type="number" min="0" placeholder="Y" value="${ej.inicio ? ej.inicio.y : 0}" oninput="setInicio(${i},${j},'y',this.value)" />
        </div>
      </div>
      <div>
        <label>Estrella (x,y)</label>
        <div class="row2" style="gap:8px;">
          <input type="number" min="0" placeholder="X" value="${ej.objetivo && ej.objetivo.posicion ? ej.objetivo.posicion.x : 0}" oninput="setObjetivoPos(${i},${j},'x',this.value)" />
          <input type="number" min="0" placeholder="Y" value="${ej.objetivo && ej.objetivo.posicion ? ej.objetivo.posicion.y : 0}" oninput="setObjetivoPos(${i},${j},'y',this.value)" />
        </div>
      </div>
    </div>
    <div style="margin-top:8px;">
      <label>Bloques permitidos</label>
      <div class="seg" style="flex-wrap:wrap;gap:6px;">
        ${CODE_BLOQUES_EDITOR.map(cb => `
          <button type="button" class="chip-cat ${permitidos.includes(cb.op === 'girar_izq' ? 'girar' : cb.op) ? 'active' : ''}"
            onclick="togglePermitido(${i},${j},'${cb.op}')">
            ${studioIconoSVG(cb.icono)} ${esc(cb.nombre)}
          </button>`).join('')}
      </div>
    </div>
    <div style="margin-top:10px;">
      <label>Obstáculos 🚧 (x,y)</label>
      ${obst || '<p class="form-note" style="margin:2px 0;">Sin obstáculos.</p>'}
      <button class="b-btn" type="button" onclick="anadirObstaculo(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Obstáculo</button>
    </div>
    <div style="margin-top:10px;">
      <label>Monedas 🪙 (x,y) — dan puntos verdes</label>
      ${monedas || '<p class="form-note" style="margin:2px 0;">Sin monedas.</p>'}
      <button class="b-btn" type="button" onclick="anadirMoneda(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Moneda</button>
    </div>
    <div style="margin-top:10px;">
      <label>Pistas 💡 (opcional)</label>
      ${pistas || ''}
      <button class="b-btn" type="button" onclick="anadirPista(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Pista</button>
    </div>
    <div style="margin-top:10px;">
      <label>Programa solución (opcional) — se imprime en la ficha PDF</label>
      <input placeholder="Ej: avanzar, avanzar, girar izquierda, avanzar" value="${esc(ej.programa_solucion_texto || '')}" style="width:100%;margin-top:4px;" oninput="setProgramaSolucion(${i},${j},this.value)" />
      <p class="form-note" style="margin:2px 0;">Escribe los bloques separados por comas (avanzar, retroceder, girar derecha/izquierda, saltar). Si lo dejas vacío, la ficha PDF lo calcula solo.</p>
    </div>
  </div>`;
}

// Mutaciones de code_blocks (globales para los onclick)
function anadirEjercicio(i) {
  bloques[i].ejercicios = bloques[i].ejercicios || [];
  bloques[i].ejercicios.push({
    titulo: 'Ejercicio ' + (bloques[i].ejercicios.length + 1),
    explicacion: '', objetivo_texto: 'Lleva a Candela hasta la estrella.',
    escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] },
    inicio: { x: 0, y: 0, direccion: 'derecha' },
    objetivo: { posicion: { x: 1, y: 0 }, max_pasos: 5 },
    permitidos: ['avanzar', 'retroceder', 'girar', 'saltar'],
    max_bloques: 5, pistas: []
  });
  render();
}
function borrarEjercicio(i, j) { bloques[i].ejercicios.splice(j, 1); render(); }
function moverEjercicio(i, j, dir) {
  const k = j + dir;
  if (k < 0 || k >= bloques[i].ejercicios.length) return;
  [bloques[i].ejercicios[j], bloques[i].ejercicios[k]] = [bloques[i].ejercicios[k], bloques[i].ejercicios[j]];
  render();
}
function setEjercicio(i, j, campo, valor) { bloques[i].ejercicios[j][campo] = valor; }
function setEscenario(i, j, campo, valor) {
  bloques[i].ejercicios[j].escenario[campo] = parseInt(valor, 10) || (campo === 'ancho' || campo === 'alto' ? 6 : 0);
}
function setInicio(i, j, campo, valor) {
  bloques[i].ejercicios[j].inicio[campo] = parseInt(valor, 10) || 0;
}
function setObjetivo(i, j, campo, valor) {
  bloques[i].ejercicios[j].objetivo[campo] = parseInt(valor, 10) || 0;
}
function setObjetivoPos(i, j, campo, valor) {
  bloques[i].ejercicios[j].objetivo.posicion[campo] = parseInt(valor, 10) || 0;
}
function togglePermitido(i, j, op) {
  const ej = bloques[i].ejercicios[j];
  if (!ej.permitidos) ej.permitidos = [];
  const real = op === 'girar_izq' ? 'girar' : op;
  if (ej.permitidos.includes(real)) ej.permitidos = ej.permitidos.filter(p => p !== real);
  else ej.permitidos.push(real);
  render();
}
function anadirObstaculo(i, j) { bloques[i].ejercicios[j].escenario.obstaculos.push({ x: 2, y: 2 }); render(); }
function setObstaculo(i, j, k, campo, valor) { bloques[i].ejercicios[j].escenario.obstaculos[k][campo] = parseInt(valor, 10) || 0; }
function borrarObstaculo(i, j, k) { bloques[i].ejercicios[j].escenario.obstaculos.splice(k, 1); render(); }
function anadirMoneda(i, j) { bloques[i].ejercicios[j].escenario.monedas.push({ x: 1, y: 0 }); render(); }
function setMoneda(i, j, k, campo, valor) { bloques[i].ejercicios[j].escenario.monedas[k][campo] = parseInt(valor, 10) || 0; }
function borrarMoneda(i, j, k) { bloques[i].ejercicios[j].escenario.monedas.splice(k, 1); render(); }
function anadirPista(i, j) { bloques[i].ejercicios[j].pistas.push(''); render(); }
function setPista(i, j, k, valor) { bloques[i].ejercicios[j].pistas[k] = valor; }
function borrarPista(i, j, k) { bloques[i].ejercicios[j].pistas.splice(k, 1); render(); }

// Programa solución del ejercicio (opcional): se guarda como lista de bloques
// y se imprime en la ficha PDF. Texto: "avanzar, girar izquierda, ...".
function setProgramaSolucion(i, j, valor) {
  const ej = bloques[i].ejercicios[j];
  ej.programa_solucion_texto = valor;
  const ops = String(valor || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
  ej.programa_solucion = ops.map(op => {
    if (op.startsWith('girar')) {
      const dir = (op.includes('izq') || op.includes('-') || op.includes('←')) ? 'izquierda' : 'derecha';
      return { op: 'girar', dir };
    }
    if (['avanzar', 'retroceder', 'saltar'].includes(op)) return { op };
    return null;
  }).filter(Boolean);
}

// ── Mutaciones (globales para los onclick) ───────────────────────────
function setCampo(i, ruta, valor) { bloques[i][ruta] = valor; }
function setItem(i, campo, idx, valor) { bloques[i][campo][idx] = valor; }
function setPareja(i, idx, lado, valor) { bloques[i].pares[idx][lado] = valor; }
function setModoRelacionar(i, modo) { bloques[i].modo = modo; render(); }
function setModoCompletar(i, modo) { bloques[i].modo = modo; render(); }
function setFrase(i, idx, campo, valor) { bloques[i].frases[idx][campo] = valor; }
function setFraseOpcion(i, idx, k, valor) {
  const f = bloques[i].frases[idx];
  if (!f.opciones) f.opciones = ['', ''];
  f.opciones[k] = valor;
}
function setPregunta(i, j, campo, valor, k) {
  if (campo === 'opciones') bloques[i].preguntas[j].opciones[k] = valor;
  else bloques[i].preguntas[j][campo] = valor;
}
function anadirPregunta(i) {
  bloques[i].preguntas.push({ pregunta: '', opciones: ['', '', '', ''], correcta: 0, imagen_url: null, imagen_alt: null, fuente: null });
  render();
}
function borrarPregunta(i, j) { bloques[i].preguntas.splice(j, 1); render(); }
function anadirOpcion(i, j) { bloques[i].preguntas[j].opciones.push(''); render(); }
function borrarOpcion(i, j, k) {
  const p = bloques[i].preguntas[j];
  p.opciones.splice(k, 1);
  if (p.correcta >= p.opciones.length) p.correcta = 0;
  render();
}
function marcarCorrecta(i, j, k) { bloques[i].preguntas[j].correcta = k; render(); }
function anadirItem(i, campo, campo2) {
  if (campo === 'pares') bloques[i].pares.push({ izq: '', der: '', izq_img: null, izq_alt: null, izq_fuente: null });
  else if (campo === 'frases') bloques[i].frases.push({ texto: '', respuesta: '', opciones: ['', ''] });
  else bloques[i][campo].push('');
  if (campo2) bloques[i][campo2].push('');
  render();
}
function borrarItem(i, campo, idx) { bloques[i][campo].splice(idx, 1); render(); }
function moverBloque(i, dir) {
  const j = i + dir;
  if (j < 0 || j >= bloques.length) return;
  [bloques[i], bloques[j]] = [bloques[j], bloques[i]];
  render();
}
function borrarBloque(i) { bloques.splice(i, 1); render(); }

// ── Imágenes ─────────────────────────────────────────────────────────
function abrirImagen(donde, i, j) {
  imgTarget = { donde, i, j };
  $('img-url').value = '';
  $('img-fuente').value = '';
  $('img-alt').value = '';
  // Precarga el alt existente si la imagen ya estaba puesta
  try {
    const b = bloques[i];
    if (donde === 'bloque') $('img-alt').value = b.imagen_alt || '';
    else if (donde === 'pregunta') $('img-alt').value = (b.preguntas[j] && b.preguntas[j].imagen_alt) || '';
    else if (donde === 'pareja') $('img-alt').value = (b.pares[j] && b.pares[j].izq_alt) || '';
  } catch (e) { /* sin bloque no hay nada que precargar */ }
  renderGaleria();
  $('img-modal').classList.remove('hidden');
}
function imagenPregunta(i, j) { abrirImagen('pregunta', i, j); }
function imagenPareja(i, j) { abrirImagen('pareja', i, j); }
function aplicarImagen() {
  const url = $('img-url').value.trim();
  const fuente = $('img-fuente').value.trim() || 'Fuente sin indicar';
  const alt = $('img-alt').value.trim();
  if (!url) { juniorAviso('Elige o pega una URL de imagen.', 'error'); return; }
  const t = imgTarget;
  if (t.donde === 'bloque') { bloques[t.i].imagen_url = url; bloques[t.i].fuente = fuente; bloques[t.i].imagen_alt = alt; }
  else if (t.donde === 'pregunta') {
    bloques[t.i].preguntas[t.j].imagen_url = url;
    bloques[t.i].preguntas[t.j].fuente = fuente;
    bloques[t.i].preguntas[t.j].imagen_alt = alt;
  } else if (t.donde === 'pareja') {
    bloques[t.i].pares[t.j].izq_img = url;
    bloques[t.i].pares[t.j].izq_fuente = fuente;
    bloques[t.i].pares[t.j].izq_alt = alt;
  }
  $('img-modal').classList.add('hidden');
  render();
}
function quitarImagenBloque(i) { bloques[i].imagen_url = null; bloques[i].fuente = null; bloques[i].imagen_alt = null; render(); }
function quitarImagenPregunta(i, j) { bloques[i].preguntas[j].imagen_url = null; bloques[i].preguntas[j].fuente = null; bloques[i].preguntas[j].imagen_alt = null; render(); }
function quitarImagenPareja(i, j) { bloques[i].pares[j].izq_img = null; bloques[i].pares[j].izq_fuente = null; bloques[i].pares[j].izq_alt = null; render(); }

// ── Vista previa JUGABLE: cómo lo verán los niños ────────────────────
let pantallas = [];
let pantallaIdx = 0;
let kpEstado = [];
let kpScore = { verdes: 0, rojos: 0 };
let kpCelebrado = false;

function chipColor(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return 'blue';
  if (c.includes('leng') || c.includes('lect')) return 'green';
  if (c.includes('cien') || c.includes('medio')) return 'orange';
  if (c.includes('geo')) return 'red';
  return 'purple';
}
function emojiCat(cat = '') {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return 'calculate';
  if (c.includes('leng') || c.includes('lect')) return 'menu_book';
  if (c.includes('cien')) return 'science';
  if (c.includes('geo')) return 'public';
  if (c.includes('tecn') || c.includes('inform')) return 'computer';
  if (c.includes('logic')) return 'psychology';
  return 'extension';
}
function kpImg(url, fuente, alt) {
  return `<div class="kp-img"><img src="${esc(url)}" alt="${esc(alt || '')}"><div class="kp-fuente"><span class="material-symbols-rounded q-ico">photo_camera</span> ${esc(fuente || 'Fuente sin indicar')}</div></div>`;
}
function shuffleArr(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}

// Genera una sopa de letras (las palabras se colocan enteras, en horizontal o vertical)
function generarSopa(palabras, tamano) {
  const validas = (palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const maxLen = validas.length ? Math.max(...validas.map(p => p.length)) : 3;
  const size = Math.max(Number(tamano) || 10, maxLen + 1, 8);
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const colocar = (palabra) => {
    const L = palabra.length;
    if (Math.random() < 0.6) { // horizontal
      const row = Math.floor(Math.random() * size);
      const col = Math.floor(Math.random() * (size - L + 1));
      let ok = true;
      for (let k = 0; k < L; k++) { const c = grid[row][col + k]; if (c && c !== palabra[k]) ok = false; }
      if (ok) for (let k = 0; k < L; k++) grid[row][col + k] = palabra[k];
      return ok;
    } else { // vertical
      const col = Math.floor(Math.random() * size);
      const row = Math.floor(Math.random() * (size - L + 1));
      let ok = true;
      for (let k = 0; k < L; k++) { const c = grid[row + k][col]; if (c && c !== palabra[k]) ok = false; }
      if (ok) for (let k = 0; k < L; k++) grid[row + k][col] = palabra[k];
      return ok;
    }
  };
  validas.forEach((p) => { for (let t = 0; t < 30 && !colocar(p); t++) { /* reintentar */ } });
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = abc[Math.floor(Math.random() * 26)];
  return { grid, size };
}

function verPreview() {
  if (bloques.length === 0) { aviso('Añade al menos un bloque para ver la vista previa.', true); return; }
  pantallas = [];
  kpEstado = [];
  const tit = ($('m-titulo')?.value || meta.titulo || 'Mi actividad').trim();
  const desc = ($('m-descripcion')?.value || meta.descripcion || '').trim();
  const cat = $('m-categoria')?.value || meta.categoria || 'General';
  const edad = $('m-edad')?.value || meta.edad || '6-12';
  const dif = $('m-dificultad')?.value || meta.dificultad || 'media';
  const tiempo = $('m-tiempo')?.value || meta.tiempo || 10;

  // Pantalla 0: portada
  pantallas.push({ tipo: 'portada', tit, desc, cat, edad, dif, tiempo });
  kpEstado.push({});

  bloques.forEach((b, bi) => {
    if (b.tipo === 'test') {
      b.preguntas.forEach((p, pi) => {
        pantallas.push({ tipo: 'test', bi, pi, nPreg: b.preguntas.length });
        kpEstado.push({ respondida: false, sel: null, acierto: null });
      });
    } else if (b.tipo === 'texto') {
      pantallas.push({ tipo: 'texto', bi });
      kpEstado.push({});
    } else if (b.tipo === 'sopa_letras') {
      const { grid, size } = generarSopa(b.palabras, b.tamano);
      pantallas.push({ tipo: 'sopa', bi, grid, size });
      kpEstado.push({ encontradas: {}, sel: [], foundCells: [], error: false, toqueInicio: null });
    } else if (b.tipo === 'relacionar') {
      const n = (b.pares || []).length;
      const indices = Array.from({ length: n }, (_, k) => k);
      pantallas.push({ tipo: 'relacionar', bi });
      kpEstado.push({ izq: null, hechas: {}, escrito: {}, ordenIzq: shuffleArr(indices), ordenDer: shuffleArr(indices) });
    } else if (b.tipo === 'ordenar') {
      pantallas.push({ tipo: 'ordenar', bi });
      kpEstado.push({ orden: shuffleArr((b.items || []).map((_, k) => k)), hechas: 0 });
    } else if (b.tipo === 'completar') {
      pantallas.push({ tipo: 'completar', bi });
      kpEstado.push({ estado: {} });
    } else if (b.tipo === 'calculo_mental') {
      (b.sumas || []).forEach((s, si) => {
        const a = Number(s.a) || 0, bb = Number(s.b) || 0;
        const correcta = a + bb;
        const opciones = b.modo === 'opciones' ? generarOpcionesCalculo(correcta) : [];
        pantallas.push({ tipo: 'calculo', bi, si, n: (b.sumas || []).length });
        kpEstado.push({ respondida: false, sel: null, acierto: null, opciones, correcta });
      });
    } else if (b.tipo === 'mapa_mundi') {
      const paises = (b.paises || []).map(p => String(p).trim()).filter(Boolean).filter(p => window.MAPA_MUNDI && MAPA_MUNDI.paises[p]);
      const preg = (b.preguntas && b.preguntas.length) ? b.preguntas : paises.map(p => ({ pide: 'Haz clic en ' + p, correcta: p }));
      (preg || []).forEach((q, qi) => {
        const corr = String(q.correcta || '').trim();
        if (!window.MAPA_MUNDI || !MAPA_MUNDI.paises[corr]) return;
        pantallas.push({ tipo: 'mapa', bi, qi, n: (preg || []).length, paises, pide: q.pide || ('Haz clic en ' + corr), correcta: corr, correctaEn: MAPA_MUNDI.paises[corr] });
        kpEstado.push({ respondida: false, acierto: null, sel: null });
      });
    } else if (b.tipo === 'code_blocks') {
      const ejercicios = (b.ejercicios || []).filter(e => e.objetivo && e.objetivo.posicion);
      if (!ejercicios.length) return;
      if (b.explicacion) {
        pantallas.push({ tipo: 'code_explica', bi, explicacion: b.explicacion });
        kpEstado.push({});
      }
      ejercicios.forEach((ej, ei) => {
        const permitidos = (ej.permitidos && ej.permitidos.length) ? ej.permitidos : ['avanzar', 'retroceder', 'girar', 'saltar', 'repetir', 'si'];
        pantallas.push({
          tipo: 'code', bi, ejercicio: ei, total_ejercicios: ejercicios.length,
          titulo: ej.titulo || ('Ejercicio ' + (ei + 1)),
          explicacion: ej.explicacion || '',
          objetivo_texto: ej.objetivo_texto || 'Lleva a Candela hasta la estrella.',
          escenario: ej.escenario || { tipo: 'cuadricula', ancho: 6, alto: 6 },
          inicio: ej.inicio || { x: 0, y: 0, direccion: 'derecha' },
          objetivo: ej.objetivo || {},
          permitidos,
          max_bloques: ej.max_bloques || null,
          pistas: ej.pistas || []
        });
        kpEstado.push({ programa: [], superado: false, resultado: null, contenedorAbierto: null });
      });
    }
  });

  pantallas.push({ tipo: 'final', tit, cat });
  kpEstado.push({});
  kpScore = { verdes: 0, rojos: 0 };
  kpCelebrado = false;
  pantallaIdx = 0;
  renderPantalla();
  $('preview-modal').classList.remove('hidden');
}

function generarOpcionesCalculo(correcta) {
  const opts = new Set([correcta]);
  let tries = 0;
  while (opts.size < 3 && tries < 120) {
    const d = Math.max(2, Math.round(Math.abs(correcta) * 0.2) + 1);
    const cand = Math.max(0, correcta + (Math.random() < 0.5 ? -1 : 1) * (Math.floor(Math.random() * d) + 1));
    opts.add(cand);
    tries++;
  }
  const arr = [...opts];
  while (arr.length < 3) arr.push(Math.max(0, correcta + arr.length));
  return shuffleArr(arr);
}

function renderPantalla() {
  const s = pantallas[pantallaIdx];
  const est = kpEstado[pantallaIdx] || {};
  let cuerpo = '';
  if (s.tipo === 'portada') cuerpo = screenPortada(s);
  else if (s.tipo === 'texto') cuerpo = screenTexto(s, est);
  else if (s.tipo === 'test') cuerpo = screenTest(s, est);
  else if (s.tipo === 'sopa') cuerpo = screenSopa(s, est);
  else if (s.tipo === 'relacionar') cuerpo = screenRelacionar(s, est);
  else if (s.tipo === 'ordenar') cuerpo = screenOrdenar(s, est);
  else if (s.tipo === 'completar') cuerpo = screenCompletar(s, est);
  else if (s.tipo === 'calculo') cuerpo = screenCalculo(s, est);
  else if (s.tipo === 'mapa') cuerpo = screenMapa(s, est);
  else if (s.tipo === 'code') cuerpo = screenCodePreview(s, est);
  else if (s.tipo === 'code_explica') cuerpo = screenCodeExplicaPreview(s);
  else if (s.tipo === 'final') { cuerpo = screenFinal(s); if (!kpCelebrado) { kpCelebrado = true; lluviaConfetti(); } }
  destruirMapas();
  $('preview-content').innerHTML = `
    <div class="kp-nav">
      <button class="kp-nav-btn" onclick="pantallaPrev()" ${pantallaIdx === 0 ? 'disabled' : ''}>←</button>
      <span class="kp-dots">${pantallas.map((_, i) => `<span class="kp-dot ${i === pantallaIdx ? 'on' : ''}"></span>`).join('')}</span>
      <button class="kp-nav-btn" onclick="pantallaNext()" ${pantallaIdx === pantallas.length - 1 ? 'disabled' : ''}>→</button>
    </div>
    <div class="kp-stage">${cuerpo}</div>`;
  clearInterval(calcTimer);
  if (s.tipo === 'calculo') iniciarTimerCalculo();
  if (s.tipo === 'mapa') iniciarMapa(pantallaIdx);
  if (s.tipo === 'code') { kpPrevPintar(); kpPrevDibujar(); }
}

// ── Cálculo mental (vista previa) ─────────────────────────────────────
let calcTimer = null;
function numTile(n) { return `<span class="kp-numtile">${n}</span>`; }
function screenCalculo(s, est) {
  const b = bloques[s.bi];
  const suma = (b.sumas || [])[s.si] || { a: 0, b: 0 };
  const a = Number(suma.a) || 0, bb = Number(suma.b) || 0;
  const totalSeg = Math.max(1, Number(b.segundos) || 10);
  let html = `<div class="kp-screen kp-calc-screen">
    <div class="kp-qt">🧮 Cálculo mental · ${s.si + 1} / ${s.n || 1}</div>
    <div class="kp-calc-timer"><span class="kp-timer" data-timer="${totalSeg}">⏱️ ${totalSeg}s</span>
      <div class="kp-timer-track"><div class="kp-timer-bar" style="width:100%"></div></div></div>
    <div class="kp-calc">${numTile(a)} <span class="kp-calc-op">+</span> ${numTile(bb)} <span class="kp-calc-op">=</span> <span class="kp-calc-q">?</span></div>`;
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : 'La respuesta era: ' + est.correcta + ' 💪'}</div>`;
  } else if (b.modo === 'escribir') {
    html += `<div class="kp-input-row">
      <input id="kp-calc-input" type="number" inputmode="numeric" placeholder="Tu respuesta"
        onkeydown="if(event.key==='Enter')kpResponderCalculo(${pantallaIdx})" />
      <button class="kp-btn" onclick="kpResponderCalculo(${pantallaIdx})">Comprobar</button>
    </div>`;
  } else {
    html += `<div class="kp-opts">${(est.opciones || []).map((o, k) => `
      <div class="kp-opt" onclick="kpResponderCalculo(${pantallaIdx},${k})"><span class="kp-letra">${'ABC'[k]}</span>${o}</div>`).join('')}</div>`;
  }
  html += `<div class="kp-hint">⚡ Responde antes de que acabe el tiempo.</div></div>`;
  return html;
}
function iniciarTimerCalculo() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'calculo') return;
  const b = bloques[s.bi];
  const total = Math.max(1, Number(b.segundos) || 10);
  let seg = total;
  const el = document.querySelector('[data-timer]');
  if (el) { el.textContent = '⏱️ ' + seg + 's'; el.classList.remove('warn'); }
  const bar = document.querySelector('.kp-timer-bar');
  if (bar) bar.style.width = '100%';
  calcTimer = setInterval(() => {
    seg--;
    const el2 = document.querySelector('[data-timer]');
    if (el2) { el2.textContent = '⏱️ ' + seg + 's'; el2.classList.toggle('warn', seg <= 3); }
    const bar2 = document.querySelector('.kp-timer-bar');
    if (bar2) { bar2.style.width = Math.max(0, (seg / total) * 100) + '%'; bar2.classList.toggle('warn', seg <= 3); }
    if (seg <= 0) { clearInterval(calcTimer); calcTimer = null; kpTimeoutCalculo(pantallaIdx); }
  }, 1000);
}
function kpResponderCalculo(idx, k) {
  const s = pantallas[idx], est = kpEstado[idx];
  if (!est || est.respondida) return;
  let ok;
  if ((bloques[s.bi] || {}).modo === 'escribir') {
    const v = parseInt(document.getElementById('kp-calc-input')?.value, 10);
    if (isNaN(v)) return;
    ok = v === est.correcta;
  } else {
    ok = (est.opciones || [])[k] === est.correcta;
  }
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  clearInterval(calcTimer); calcTimer = null;
  renderPantalla();
}
function kpTimeoutCalculo(idx) {
  const est = kpEstado[idx];
  if (est && !est.respondida) {
    est.respondida = true; est.acierto = false; kpScore.rojos++;
    if (window.pjSonido) pjSonido.error();
    renderPantalla();
  }
}

function screenTexto(s, est) {
  const b = bloques[s.bi];
  const parrafos = (b.contenido || '').split(/\n+/).map(t => t.trim()).filter(Boolean);
  let html = `<div class="kp-screen">
    <div class="kp-qt">📖 ${esc(b.titulo || 'Aprende')}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-explicacion">`;
  parrafos.forEach(p => {
    if (p.startsWith('- ') || p.startsWith('• ')) html += `<div class="kp-expl-item">• ${esc(p.slice(2))}</div>`;
    else html += `<p>${esc(p)}</p>`;
  });
  html += `</div>`;
  html += `<div style="text-align:center;margin-top:14px;"><button class="kp-check" onclick="pantallaNext()">Continuar →</button></div>`;
  html += `<div class="kp-hint">📖 Lee y luego pulsa Continuar para responder</div></div>`;
  return html;
}

function screenPortada(s) {
  return `
    <div class="kp-screen">
      <div class="kp-cover cover-${chipColor(s.cat)}"><span class="material-symbols-rounded kp-cover-ico">${emojiCat(s.cat)}</span></div>
      <h3 class="kp-title">${esc(s.tit)}</h3>
      <p class="kp-desc">${esc(s.desc)}</p>
      <div class="kp-chips">
        <span class="kp-chip chip-${chipColor(s.cat)}">${esc(s.cat)}</span>
        <span class="kp-chip">👧 ${esc(s.edad)}</span>
        <span class="kp-chip">⭐ ${esc(s.dif)}</span>
        <span class="kp-chip">⏱️ ${esc(s.tiempo)} min</span>
      </div>
      <div class="kp-hint">👆 ¡Pulsa los botones para responder!</div>
    </div>`;
}

// ── Vista previa: Placeta Junior Code (como lo verá el niño) ────────
const CODE_BLOQUES_PREV = {
  avanzar:    { nombre: 'AVANZAR', color: '#4c8dff', icono: 'flecha_derecha' },
  retroceder: { nombre: 'RETROCEDER', color: '#4c8dff', icono: 'flecha_izquierda' },
  girar:      { nombre: 'GIRAR', color: '#4c8dff', icono: 'girar_derecha' },
  saltar:     { nombre: 'SALTAR', color: '#4c8dff', icono: 'saltar' },
  repetir:    { nombre: 'REPETIR', color: '#ff9f1c', icono: 'bucle' },
  si:         { nombre: 'SI', color: '#ff9f1c', icono: 'diamante' },
};

function screenCodeExplicaPreview(s) {
  return `
    <div class="kp-screen kp-code">
      <div class="kp-cover cover-purple">💻</div>
      <h3 class="kp-title">¡Vamos a programar!</h3>
      <p class="kp-desc">${esc(s.explicacion)}</p>
      <div class="code-tutorial">
        <div class="code-tut-step"><span class="code-tut-n">1</span><span>Toca las <b>flechas redondas</b> o <b>arrástralas</b> hasta tu programa.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">2</span><span>El programa se monta en <b>una línea</b>. Quita pasos con <b>✕</b>.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">3</span><span>Pulsa <b>▶ Ejecutar</b>: verás a Candela 👧 moverse <b>paso a paso</b>.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">4</span><span>Llega a la <b>estrella ⭐</b> para superar el reto.</span></div>
      </div>
      <button type="button" class="kp-btn kp-start" onclick="pantallaNext()">🚀 ¡A jugar!</button>
      <div class="kp-hint">Cada ejercicio es un poco más difícil. ¡Tú puedes!</div>
    </div>`;
}

function screenCodePreview(s, est) {
  const total = s.total_ejercicios || 1;
  const actual = (s.ejercicio || 0) + 1;
  const bInfo = CODE_BLOQUES_PREV;
  return `
    <div class="kp-screen kp-code">
      <div class="code-topline">
        <span class="code-pill code-pill-prog">Ejercicio ${actual} / ${total}</span>
        <span class="code-pill code-pill-tit">${esc(s.titulo || '')}</span>
      </div>
      ${s.explicacion ? `<div class="code-explica">💡 ${esc(s.explicacion)}</div>` : ''}
      <div class="kp-qt" style="margin-bottom:4px;">${esc(s.objetivo_texto)}</div>
      <div class="code-scenario-wrap">
        <svg id="kp-code-escenario-prev" class="code-scenario" viewBox="0 0 600 380"></svg>
      </div>
      <div class="code-chips">
        ${s.objetivo && s.objetivo.posicion ? `<span class="kp-chip chip-blue">🎯 ${s.objetivo.posicion.x},${s.objetivo.posicion.y}</span>` : ''}
        ${s.objetivo && s.objetivo.max_pasos ? `<span class="kp-chip chip-orange">⏱ ${s.objetivo.max_pasos} pasos</span>` : ''}
      </div>
      <div class="code-palette">
        ${(s.permitidos || []).map(op => {
          const b = bInfo[op];
          if (!b) return '';
          return `<button type="button" class="code-block cute-block" style="--blk:${b.color}" onclick="kpPrevAñadir('${op}')" title="Añadir ${b.nombre}"><span class="blk-emoji">${studioIconoSVG(b.icono)}</span><span class="blk-nombre">${b.nombre}</span></button>`;
        }).join('')}
        ${(s.permitidos || []).includes('girar') ? `
          <button type="button" class="code-block cute-block" style="--blk:#4c8dff" onclick="kpPrevAñadir('girar',{dir:'derecha'})" title="Girar a la derecha"><span class="blk-emoji">${studioIconoSVG('girar_derecha')}</span><span class="blk-nombre">GIRAR →</span></button>
          <button type="button" class="code-block cute-block" style="--blk:#4c8dff" onclick="kpPrevAñadir('girar',{dir:'izquierda'})" title="Girar a la izquierda"><span class="blk-emoji">${studioIconoSVG('girar_izquierda')}</span><span class="blk-nombre">GIRAR ←</span></button>` : ''}
      </div>
      <div class="code-line-wrap">
        <div class="code-line-label">📝 Tu programa</div>
        <div class="code-programa cute-linea" id="kp-code-programa-prev"></div>
      </div>
      <div class="code-acciones">
        <button type="button" class="code-run-btn" id="kp-code-run-prev" onclick="kpPrevEjecutar()">▶ Ejecutar</button>
        <button type="button" class="code-clear-btn" onclick="kpPrevVaciar()">🗑 Vaciar</button>
      </div>
      <div class="kp-hint">👆 Pulsa las flechas para montar el programa y luego ▶ Ejecutar.</div>
    </div>`;
}

// Estado local de la vista previa de code en el Studio
let kpPrev = { programa: [], resultado: null, superado: false };

function kpPrevAñadir(op, opts) {
  kpPrev.programa.push({ op, ...(opts || {}) });
  kpPrev.resultado = null; kpPrev.superado = false;
  kpPrevPintar();
  kpPrevDibujar();
}

function kpPrevVaciar() {
  kpPrev = { programa: [], resultado: null, superado: false };
  kpPrevPintar();
  kpPrevDibujar();
}

function kpPrevSerializar() {
  return kpPrev.programa.map(i => ({ op: i.op, dir: i.dir, veces: i.veces, condicion: i.condicion, bloques: i.bloques || [] }));
}

function kpPrevPintar() {
  const cont = document.getElementById('kp-code-programa-prev');
  const run = document.getElementById('kp-code-run-prev');
  if (!cont) return;
  cont.innerHTML = '';
  if (!kpPrev.programa.length) {
    cont.innerHTML = '<div class="code-vacio">👉 Toca las flechas para montar tu programa</div>';
  } else {
    kpPrev.programa.forEach((item, i) => {
      const b = CODE_BLOQUES_PREV[item.op] || { nombre: item.op, color: '#4c8dff', icono: 'flecha_derecha' };
      const chip = document.createElement('span');
      chip.className = 'cute-chip';
      chip.style.setProperty('--blk', b.color);
      chip.innerHTML = `<span class="cute-chip-etiqueta">${studioIconoSVG(b.icono)} ${esc(b.nombre)}</span>
        ${item.op === 'girar' ? `<button class="cute-dir" onclick="kpPrevGirar(${i})" title="Cambiar dirección">${studioIconoSVG(item.dir === 'izquierda' ? 'girar_izquierda' : 'girar_derecha')}</button>` : ''}
        ${item.op === 'repetir' ? `<input type="number" min="1" max="20" value="${item.veces || 1}" style="width:42px;" onchange="kpPrevVeces(${i},this.value)"><span class="cute-chip-explica">veces</span>` : ''}
        <button class="cute-del" onclick="kpPrevBorrar(${i})">✕</button>`;
      cont.appendChild(chip);
    });
  }
  if (run) run.disabled = !kpPrev.programa.length;
}
function kpPrevBorrar(i) { kpPrev.programa.splice(i, 1); kpPrev.resultado = null; kpPrevPintar(); kpPrevDibujar(); }
function kpPrevGirar(i) { kpPrev.programa[i].dir = kpPrev.programa[i].dir === 'izquierda' ? 'derecha' : 'izquierda'; kpPrevPintar(); kpPrevDibujar(); }
function kpPrevVeces(i, v) { kpPrev.programa[i].veces = parseInt(v, 10) || 1; kpPrevDibujar(); }

// Dibuja el escenario de la vista previa de code
function kpPrevDibujar() {
  const s = pantallas[pantallaIdx];
  const svg = document.getElementById('kp-code-escenario-prev');
  if (!s || s.tipo !== 'code' || !svg) return;
  const esc = s.escenario || {};
  const ini = s.inicio || {};
  const obj = s.objetivo || {};
  const W = 600, H = 380;
  const ancho = esc.ancho || 6, alto = esc.alto || 6;
  const cell = Math.min((W - 40) / ancho, (H - 40) / alto);
  const ox = (W - cell * ancho) / 2, oy = (H - cell * alto) / 2;
  // Resultado o posición inicial
  let px = ini.x ?? 0, py = ini.y ?? 0, dirIdx = ['derecha', 'abajo', 'izquierda', 'arriba'].indexOf(ini.direccion || 'derecha');
  let fill = '#3a7dff';
  let html = `<rect x="0" y="0" width="${W}" height="${H}" fill="#eef0fa" rx="12"/>`;
  for (let r = 0; r < alto; r++) for (let c = 0; c < ancho; c++) {
    html += `<rect x="${ox + c * cell}" y="${oy + r * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#fff" stroke="#d6d9ea" stroke-width="1"/>`;
  }
  (esc.obstaculos || []).forEach(o => {
    html += `<rect x="${ox + o.x * cell}" y="${oy + o.y * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#4a1a1a"/><text x="${ox + o.x * cell + cell / 2}" y="${oy + o.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="18">🚧</text>`;
  });
  (esc.monedas || []).forEach(m => {
    html += `<text x="${ox + m.x * cell + cell / 2}" y="${oy + m.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="16">🪙</text>`;
  });
  if (obj.posicion) {
    html += `<circle cx="${ox + obj.posicion.x * cell + cell / 2}" cy="${oy + obj.posicion.y * cell + cell / 2}" r="${cell * 0.42}" fill="#ffd166" opacity="0.35"/><text x="${ox + obj.posicion.x * cell + cell / 2}" y="${oy + obj.posicion.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="22">⭐</text>`;
  }
  // Si hay programa, previsualizar el camino
  if (kpPrev.programa.length && window.PJCode) {
    try {
      const r = PJCode.ejecutarCode(s.escenario, s.inicio, kpPrevSerializar(), { maxPasos: (s.max_bloques || 10) * 20 });
      const trazado = (r.trazado || []).filter(t => t.accion !== 'inicio' && t.accion !== 'si');
      if (trazado.length) {
        const ultimo = trazado[trazado.length - 1];
        px = ultimo.x; py = ultimo.y; dirIdx = ultimo.dir;
        const llega = obj.posicion && ultimo.x === Number(obj.posicion.x) && ultimo.y === Number(obj.posicion.y);
        fill = llega ? '#2ecc71' : '#4c8dff';
        const puntos = trazado.map(t => `${ox + t.x * cell + cell / 2},${oy + t.y * cell + cell / 2}`);
        html += `<polyline points="${puntos.join(' ')}" fill="none" stroke="#4c8dff" stroke-width="3" stroke-dasharray="6 5" opacity="0.6"/>`;
        html += `<text x="${W - 16}" y="22" text-anchor="end" font-size="13" font-weight="800" fill="#8a93b8">👀 prevista</text>`;
      }
    } catch (e) { /* sin motor */ }
  }
  html += `<circle cx="${ox + px * cell + cell / 2}" cy="${oy + py * cell + cell / 2}" r="${cell * 0.34}" fill="${fill}"/><text x="${ox + px * cell + cell / 2}" y="${oy + py * cell + cell / 2 + 5}" text-anchor="middle" font-size="14">👧</text>`;
  if (dirIdx >= 0) {
    const angs = { 0: 0, 1: 90, 2: 180, 3: 270 };
    html += `<g transform="translate(${ox + px * cell + cell / 2}, ${oy + py * cell + cell / 2 + 12}) rotate(${angs[dirIdx]})"><path d="M-6,0 L6,0 M2,-4 L6,0 L2,4" stroke="#1a2b6b" stroke-width="2" fill="none"/></g>`;
  }
  svg.innerHTML = html;
}

async function kpPrevEjecutar() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code' || !kpPrev.programa.length || !window.PJCode) return;
  const run = document.getElementById('kp-code-run-prev');
  if (run) run.disabled = true;
  const r = PJCode.ejecutarCode(s.escenario, s.inicio, kpPrevSerializar(), { maxPasos: (s.max_bloques || 10) * 20 });
  const evalRes = PJCode.evaluarCode(s.escenario, s.inicio, s.objetivo, kpPrevSerializar(), r);
  kpPrev.resultado = r; kpPrev.superado = evalRes.superado;
  const trazado = (r.trazado || []).filter(t => t.accion !== 'inicio');
  const svg = document.getElementById('kp-code-escenario-prev');
  const esc = s.escenario || {}, ini = s.inicio || {}, obj = s.objetivo || {};
  const W = 600, H = 380;
  const ancho = esc.ancho || 6, alto = esc.alto || 6;
  const cell = Math.min((W - 40) / ancho, (H - 40) / alto);
  const ox = (W - cell * ancho) / 2, oy = (H - cell * alto) / 2;
  // Reproducción paso a paso
  const n = trazado.length;
  for (let i = 0; i < n; i++) {
    const t = trazado[i];
    const fill = t.accion === 'error' ? '#ff5a5a' : (kpPrev.superado ? '#2ecc71' : '#4c8dff');
    let html = `<rect x="0" y="0" width="${W}" height="${H}" fill="#eef0fa" rx="12"/>`;
    for (let r = 0; r < alto; r++) for (let c = 0; c < ancho; c++) html += `<rect x="${ox + c * cell}" y="${oy + r * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#fff" stroke="#d6d9ea" stroke-width="1"/>`;
    (esc.obstaculos || []).forEach(o => html += `<rect x="${ox + o.x * cell}" y="${oy + o.y * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#4a1a1a"/><text x="${ox + o.x * cell + cell / 2}" y="${oy + o.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="18">🚧</text>`);
    (esc.monedas || []).forEach(m => html += `<text x="${ox + m.x * cell + cell / 2}" y="${oy + m.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="16">🪙</text>`);
    if (obj.posicion) html += `<circle cx="${ox + obj.posicion.x * cell + cell / 2}" cy="${oy + obj.posicion.y * cell + cell / 2}" r="${cell * 0.42}" fill="#ffd166" opacity="0.35"/><text x="${ox + obj.posicion.x * cell + cell / 2}" y="${oy + obj.posicion.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="22">⭐</text>`;
    html += `<circle cx="${ox + t.x * cell + cell / 2}" cy="${oy + t.y * cell + cell / 2}" r="${cell * 0.34}" fill="${fill}"/><text x="${ox + t.x * cell + cell / 2}" y="${oy + t.y * cell + cell / 2 + 5}" text-anchor="middle" font-size="14">👧</text>`;
    html += `<text x="${W - 16}" y="22" text-anchor="end" font-size="15" font-weight="800" fill="#4E3B70">${i + 1}/${n}</text>`;
    if (svg) svg.innerHTML = html;
    await new Promise(res => setTimeout(res, 320));
  }
  // Estado final
  kpPrevDibujar();
  let msg = document.getElementById('kp-prev-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'kp-prev-msg';
    msg.className = 'kp-msg';
    const acc = document.querySelector('.code-acciones');
    if (acc) acc.after(msg);
  }
  msg.className = 'kp-msg ' + (kpPrev.superado ? 'ok' : 'bad');
  msg.textContent = kpPrev.superado ? '🎉 ¡Superado!' : '💪 Inténtalo de nuevo.';
  if (run) run.disabled = false;
}

function screenTest(s, est) {
  const b = bloques[s.bi];
  const p = b.preguntas[s.pi];
  // Barajar SIEMPRE las opciones (permutación estable por pantalla).
  if (!est.opciones) est.opciones = shuffleArr(p.opciones.map((_, i) => i));
  const orden = est.opciones;
  let html = `<div class="kp-screen">
    <div class="kp-qt">📝 Pregunta ${s.pi + 1} de ${s.nPreg}</div>
    <div class="kp-q">${esc(p.pregunta || '…')}</div>`;
  if (p.imagen_url) html += kpImg(p.imagen_url, p.fuente, p.imagen_alt);
  html += `<div class="kp-opts">`;
  orden.forEach((k) => {
    const op = p.opciones[k];
    let cls = 'kp-opt';
    if (est.respondida) {
      if (k === p.correcta) cls += ' ok';
      else if (k === est.sel) cls += ' bad';
      else cls += ' muted';
    }
    html += `<div class="${cls}" onclick="kpResponder(${pantallaIdx},${k})">${est.respondida && k === p.correcta ? '✅ ' : ''}${esc(op || '…')}</div>`;
  });
  html += `</div>`;
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : '¡Casi! La correcta es: ' + esc(p.opciones[p.correcta]) + ' 💪'}</div>`;
  }
  html += `</div>`;
  return html;
}
function kpResponder(idx, k) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (est.respondida) return;
  est.respondida = true;
  est.sel = k;
  est.acierto = (k === bloques[s.bi].preguntas[s.pi].correcta);
  if (est.acierto) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

function screenSopa(s, est) {
  const b = bloques[s.bi];
  const enc = est.encontradas || {};
  const foundCells = est.foundCells || [];
  const sel = est.sel || [];
  const validas = (b.palabras || []).filter(Boolean);
  const chips = validas.map((p, j) => {
    const en = !!enc[j];
    return `<span class="kp-chip ${en ? 'ok' : ''}">${en ? '✅ ' : ''}${esc(String(p).toUpperCase())}</span>`;
  }).join('');
  const total = validas.length;
  const hechas = Object.keys(enc).length;
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔤 Sopa de letras</div>
    <div class="kp-wordchips">${chips}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-grid" data-pantalla="${pantallaIdx}" data-size="${s.size}" style="grid-template-columns:repeat(${s.size},1fr);">`;
  s.grid.forEach((row, r) => row.forEach((c, cc) => {
    let cls = 'kp-cell';
    if (foundCells.some(f => f.r === r && f.c === cc)) cls += ' found';
    else if (sel.some(p => p.r === r && p.c === cc)) cls += ' sel';
    html += `<span class="${cls}" data-r="${r}" data-c="${cc}">${esc(c)}</span>`;
  }));
  html += `</div>`;
  if (est.error) html += `<div class="kp-msg bad">👀 Esa letra no sigue ninguna palabra…</div>`;
  else if (hechas >= total && total > 0) html += `<div class="kp-msg ok">¡Has encontrado todas! 🎉</div>`;
  else if (total > 0) html += `<div class="kp-msg">🔤 ${hechas} / ${total}</div>`;
  html += `<div class="kp-hint">👆 Toca la primera y la última letra, o desliza para formar la palabra</div></div>`;
  return html;
}
// ── Sopa: arrastrar / deslizar para formar las palabras ──────────────
let kpDrag = { on: false, idx: -1, dir: null, cells: [] };
// Celdas en línea recta entre dos puntos (para completar con dos toques)
function lineaEntre(a, b) {
  const dr = Math.sign(b.r - a.r), dc = Math.sign(b.c - a.c);
  const n = Math.max(Math.abs(b.r - a.r), Math.abs(b.c - a.c)) + 1;
  const out = [];
  for (let i = 0; i < n; i++) out.push({ r: a.r + dr * i, c: a.c + dc * i });
  return out;
}
// Comprueba una palabra marcada (arrastrada o completada con dos toques)
function comprobarSopa(idx, word) {
  const est = kpEstado[idx];
  const s = pantallas[idx];
  const rev = word.split('').reverse().join('');
  const b = bloques[s.bi];
  const validas = (b.palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const wi = validas.findIndex((w, i) => !est.encontradas[i] && (w === word || w === rev));
  if (wi >= 0) {
    est.encontradas[wi] = true;
    est.foundCells = [...(est.foundCells || []), ...(est.sel || [])];
    kpScore.verdes++;
    if (window.pjSonido) pjSonido.exito();
  } else {
    kpScore.rojos++;
    est.error = true;
    if (window.pjSonido) pjSonido.error();
    setTimeout(() => { if (kpEstado[idx]) { kpEstado[idx].error = false; renderPantalla(); } }, 700);
  }
  renderPantalla();
}
function kpStart(e) {
  const cell = e.target && e.target.closest ? e.target.closest('.kp-cell') : null;
  if (!cell) return;
  const grid = cell.closest('.kp-grid');
  if (!grid) return;
  const idx = +grid.dataset.pantalla;
  const s = pantallas[idx];
  if (!s || s.tipo !== 'sopa') return;
  const est = kpEstado[idx];
  const p = { r: +cell.dataset.r, c: +cell.dataset.c };
  const prev = est.toqueInicio;
  // Segundo toque: completar la palabra en línea recta (más fácil en móvil)
  if (prev && (prev.r !== p.r || prev.c !== p.c) && (prev.r === p.r || prev.c === p.c || Math.abs(prev.r - p.r) === Math.abs(prev.c - p.c))) {
    est.toqueInicio = null;
    est.sel = lineaEntre(prev, p);
    comprobarSopa(idx, est.sel.map(q => s.grid[q.r][q.c]).join(''));
    return;
  }
  est.toqueInicio = null;
  kpDrag = { on: true, idx, dir: null, cells: [p] };
  est.sel = kpDrag.cells;
  pintarSel(idx);
  if (window.pjSonido) pjSonido.letra();
}
function kpMove(e) {
  if (!kpDrag.on) return;
  const grid = document.querySelector(`.kp-grid[data-pantalla="${kpDrag.idx}"]`);
  if (!grid) return;
  const rect = grid.getBoundingClientRect();
  const size = Number(grid.dataset.size) || 10;
  const gap = parseFloat(getComputedStyle(grid).columnGap) || 3;
  const cellSize = (rect.width - (size - 1) * gap) / size;
  const r = Math.min(size - 1, Math.max(0, Math.floor((e.clientY - rect.top) / (cellSize + gap))));
  const c = Math.min(size - 1, Math.max(0, Math.floor((e.clientX - rect.left) / (cellSize + gap))));
  const cells = kpDrag.cells;
  const last = cells[cells.length - 1];
  const dr = r - last.r, dc = c - last.c;
  if (dr === 0 && dc === 0) return;
  if (Math.abs(dr) > 1 || Math.abs(dc) > 1) return;
  if (cells.length > 1) {
    const prev = cells[cells.length - 2];
    if (r === prev.r && c === prev.c) { cells.pop(); pintarSel(kpDrag.idx); return; }
  }
  if (kpDrag.dir === null) kpDrag.dir = { dr, dc };
  if (cells.some(p => p.r === r && p.c === c)) return;
  if (dr !== kpDrag.dir.dr || dc !== kpDrag.dir.dc) return;
  cells.push({ r, c });
  pintarSel(kpDrag.idx);
  if (window.pjSonido) pjSonido.letra();
}
function kpEnd() {
  if (!kpDrag.on) return;
  const idx = kpDrag.idx;
  const est = kpEstado[idx];
  const s = pantallas[idx];
  const cells = kpDrag.cells;
  kpDrag.on = false;
  if (cells.length < 2) {
    // Toque simple: guardamos como inicio para completar con otro toque
    est.sel = cells;
    est.toqueInicio = cells[0];
    pintarSel(idx);
    if (window.pjSonido) pjSonido.letra();
    return;
  }
  est.sel = cells;
  est.toqueInicio = null;
  comprobarSopa(idx, cells.map(p => s.grid[p.r][p.c]).join(''));
}
function pintarSel(idx) {
  const grid = document.querySelector(`.kp-grid[data-pantalla="${idx}"]`);
  if (!grid) return;
  const est = kpEstado[idx] || {};
  const sel = est.sel || [];
  const found = est.foundCells || [];
  grid.querySelectorAll('.kp-cell').forEach(cell => {
    const r = +cell.dataset.r, c = +cell.dataset.c;
    const inSel = sel.some(p => p.r === r && p.c === c);
    const isFound = found.some(f => f.r === r && f.c === c);
    cell.classList.toggle('sel', inSel && !isFound);
  });
}
function screenFinal(s) {
  return `
    <div class="kp-screen">
      <div class="kp-cover cover-${chipColor(s.cat)}">🎉</div>
      <h3 class="kp-title">¡Lo has conseguido!</h3>
      <p class="kp-desc">${esc(s.tit)}</p>
      <div class="kp-score">
        <div class="kp-score-item verdes"><span class="kp-score-num">🟢</span>${kpScore.verdes} <small>puntos verdes</small></div>
        <div class="kp-score-item rojos"><span class="kp-score-num">🔴</span>${kpScore.rojos} <small>puntos rojos</small></div>
      </div>
      <div class="kp-hint">💪 ¡Sigue así, campeón!</div>
    </div>`;
}
function lluviaConfetti() {
  const cont = document.getElementById('confetti');
  if (!cont) return;
  cont.innerHTML = '';
  const colores = ['#FF3333', '#FF6600', '#D6CE52', '#336E45', '#3A00E1', '#4E3B70'];
  for (let i = 0; i < 42; i++) {
    const s = document.createElement('span');
    s.className = 'shape confetti-piece';
    s.style.left = (Math.random() * 100) + 'vw';
    s.style.width = (10 + Math.random() * 16) + 'px';
    s.style.height = (12 + Math.random() * 16) + 'px';
    s.style.color = colores[i % colores.length];
    s.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
    s.style.animationDelay = (Math.random() * 0.9) + 's';
    cont.appendChild(s);
  }
  cont.classList.remove('hidden');
  setTimeout(() => { cont.classList.add('hidden'); cont.innerHTML = ''; }, 6500);
}

function screenRelacionar(s, est) {
  const b = bloques[s.bi];
  const pares = b.pares || [];
  const modo = b.modo || 'emparejar';
  if (modo === 'escribir') return screenRelacionarEscribir(s, est, pares);
  const hechas = est.hechas || {};
  // Columnas barajadas: el orden no coincide para que no estén uno al lado del otro
  const izqOrder = est.ordenIzq && est.ordenIzq.length === pares.length ? est.ordenIzq : pares.map((_, j) => j);
  const derOrder = est.ordenDer && est.ordenDer.length === pares.length ? est.ordenDer : pares.map((_, j) => j);
  const izqCls = (j) => (hechas[j] ? ' ok' : (est.izq === j ? ' sel' : ''));
  const derCls = (j) => (hechas[j] ? ' ok' : '');
  const itemIzq = (j) => pares[j].izq_img
    ? `<div class="kp-pair-img" style="background-image:url('${esc(pares[j].izq_img)}')" role="img" aria-label="${esc(pares[j].izq_alt || pares[j].izq || 'Imagen')}" title="${esc(pares[j].izq || '')}"></div>`
    : esc(pares[j].izq || '…');
  let html = `<div class="kp-screen">
    <div class="kp-qt">🔗 Relacionar</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-match">
      <div class="kp-col">${izqOrder.map((j) => `<div class="kp-pair${izqCls(j)}" onclick="kpIzq(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${itemIzq(j)}</div>`).join('')}</div>
      <div class="kp-col">${derOrder.map((j) => `<div class="kp-pair alt${derCls(j)}" onclick="kpDer(${pantallaIdx},${j})">${hechas[j] ? '✅ ' : ''}${esc(pares[j].der || '…')}</div>`).join('')}</div>
    </div>`;
  if (pares.length > 0 && Object.keys(hechas).length >= pares.length) html += `<div class="kp-msg ok">¡Todo emparejado! 🎉</div>`;
  html += `<div class="kp-hint">👆 Toca una tarjeta de cada lado para emparejar</div></div>`;
  return html;
}

// Modo "escribir la palabra": ve el pictograma y escribe la palabra que corresponde
function screenRelacionarEscribir(s, est, pares) {
  const b = bloques[s.bi];
  const escrito = est.escrito || {};
  const done = pares.every((_, j) => escrito[j] === 'ok');
  let html = `<div class="kp-screen">
    <div class="kp-qt">✏️ Escribe la palabra</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-esc-list">`;
  pares.forEach((p, j) => {
    const st = escrito[j];
    const pista = (p.izq || '').trim();
    html += `<div class="kp-esc-item">
      <div class="kp-esc-fig">${p.izq_img
        ? `<img src="${esc(p.izq_img)}" alt="${esc(p.izq_alt || pista || p.der || '')}">`
        : `<span class="kp-esc-texto">${esc(pista || '…')}</span>`}</div>
      <div class="kp-input-row">
        <input id="kp-esc-${pantallaIdx}-${j}" class="kp-input" type="text" placeholder="Escribe la palabra…" ${st === 'ok' ? 'disabled' : ''} value="${st === 'ok' ? esc(p.der) : ''}" />
        ${st === 'ok' ? '<span class="kp-msg ok">¡Correcto! ✅</span>'
          : `<span style="display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center;">${st === 'err' ? '<span class="kp-msg bad">Casi… inténtalo otra vez</span>' : ''}<button class="kp-check" onclick="kpEscribir(${pantallaIdx},${j})">Comprobar</button></span>`}
      </div>
    </div>`;
  });
  html += `</div>`;
  if (done && pares.length > 0) html += `<div class="kp-msg ok">¡Todo correcto! 🎉</div>`;
  html += `<div class="kp-hint">✏️ Escribe la palabra que corresponde a cada pictograma</div></div>`;
  return html;
}
function normaliza(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }
// Intenta pasar una palabra a singular (perros→perro, flores→flor) para
// tolerar singular/plural en las respuestas.
function singulariza(p) {
  p = normaliza(p);
  if (!p || p.length <= 2) return p;
  if (p.endsWith('es')) { const b = p.slice(0, -2); if (b.length >= 2) return b; }
  else if (p.endsWith('s')) { const b = p.slice(0, -1); if (b.length >= 2) return b; }
  return p;
}
function igualPalabra(a, b) { return normaliza(a) === normaliza(b) || singulariza(a) === singulariza(b); }
function kpEscribir(idx, j) {
  const est = kpEstado[idx];
  const b = bloques[pantallas[idx].bi];
  const p = b.pares[j];
  const val = (document.getElementById('kp-esc-' + idx + '-' + j)?.value || '');
  const okk = normaliza(val) === normaliza(p.der);
  est.escrito = est.escrito || {};
  est.escrito[j] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}
function kpIzq(idx, j) {
  const est = kpEstado[idx];
  est.izq = (est.izq === j) ? null : j;
  renderPantalla();
}
function kpDer(idx, j) {
  const est = kpEstado[idx];
  if (est.izq === null) return;
  if (est.izq === j) { est.hechas[j] = true; kpScore.verdes++; }
  else kpScore.rojos++;
  est.izq = null;
  renderPantalla();
}

function screenOrdenar(s, est) {
  const b = bloques[s.bi];
  const n = (b.items || []).length;
  const done = est.orden.slice(0, est.hechas);
  const pend = est.orden.slice(est.hechas);
  let html = `<div class="kp-screen">
    <div class="kp-qt">📌 Ordena los pasos</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-steps">`;
  done.forEach((ix, k) => { html += `<div class="kp-step done"><span class="kp-num">${k + 1}</span>${esc(b.items[ix] || '…')}</div>`; });
  pend.forEach((ix) => { html += `<div class="kp-step" onclick="kpOrden(${pantallaIdx},${ix})"><span class="kp-num">?</span>${esc(b.items[ix] || '…')}</div>`; });
  html += `</div>`;
  if (est.hechas >= n) html += `<div class="kp-msg ok">¡Orden perfecto! 🎉</div>`;
  else if (est.err) html += `<div class="kp-msg bad">👀 Ese no es el siguiente paso</div>`;
  html += `<div class="kp-hint">👆 Pulsa los pasos en el orden correcto</div></div>`;
  return html;
}
function kpOrden(idx, ix) {
  const est = kpEstado[idx];
  if (est.orden[est.hechas] === ix) { est.hechas++; est.err = false; kpScore.verdes++; renderPantalla(); return; }
  kpScore.rojos++;
  est.err = true;
  renderPantalla();
  setTimeout(() => { if (kpEstado[idx]) { est.err = false; renderPantalla(); } }, 900);
}

function screenCompletar(s, est) {
  const b = bloques[s.bi];
  const estado = est.estado || {};
  const modo = b.modo || 'escribir';
  let html = `<div class="kp-screen">
    <div class="kp-qt">✏️ Completa la frase</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  (b.frases || []).forEach((f, fi) => {
    const st = estado[fi];
    html += `<div class="kp-frase">${esc(f.texto || '').replace('___', '<span class="kp-blank"></span>')}</div>`;
    if (modo === 'opciones') {
      if (!est.opciones) est.opciones = {};
      if (!est.opciones[fi]) {
        est.opciones[fi] = [f.respuesta, ...(f.opciones || [])].filter(Boolean).sort(() => Math.random() - 0.5);
      }
      const barajadas = est.opciones[fi];
      html += `<div class="kp-chips">`;
      barajadas.forEach((op, k) => {
        const esCorrecta = st === 'ok' && op === f.respuesta;
        const esFallada = st === 'err' && est.selOpc === fi + ':' + k;
        const cls = (esCorrecta ? ' ok' : '') + (esFallada ? ' bad' : '') + (st === 'ok' && !esCorrecta ? ' muted' : '');
        html += `<button class="kp-chip${cls}" onclick="kpCompletarOpcion(${pantallaIdx},${fi},${k})">${esc(op)}</button>`;
      });
      html += `</div>`;
      if (st === 'ok') html += `<div class="kp-msg ok">¡Correcto! ✅</div>`;
      else if (st === 'err') html += `<div class="kp-msg bad">Casi… elige otra opción</div>`;
    } else {
      html += `<div class="kp-input-row">
        <input id="kp-fill-${pantallaIdx}-${fi}" class="kp-input" type="text" placeholder="Escribe la palabra…" ${st ? 'disabled' : ''} value="${st ? esc(f.respuesta) : ''}" />
        ${st === 'ok' ? '<span class="kp-msg ok">¡Correcto! ✅</span>'
          : st === 'err' ? '<span class="kp-msg bad">Casi… inténtalo otra vez</span>'
          : `<button class="kp-check" onclick="kpComprobar(${pantallaIdx},${fi})">Comprobar</button>`}
      </div>`;
    }
  });
  html += `<div class="kp-hint">${modo === 'opciones' ? '👆 Elige la palabra que falta' : '👆 Escribe la palabra que falta'}</div></div>`;
  return html;
}
function kpComprobar(idx, fi) {
  const est = kpEstado[idx];
  const b = bloques[pantallas[idx].bi];
  const f = b.frases[fi];
  const val = (document.getElementById('kp-fill-' + idx + '-' + fi)?.value || '');
  const okk = igualPalabra(val, f.respuesta);
  est.estado[fi] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}
function kpCompletarOpcion(idx, fi, k) {
  const est = kpEstado[idx];
  if (est.estado && est.estado[fi] === 'ok') return;
  const b = bloques[pantallas[idx].bi];
  const f = b.frases[fi];
  const op = (est.opciones && est.opciones[fi] && est.opciones[fi][k]) || '';
  est.selOpc = fi + ':' + k;
  const okk = igualPalabra(op, f.respuesta);
  if (!est.estado) est.estado = {};
  est.estado[fi] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

// ── Mapamundi (vista previa, Leaflet) ───────────────────────────────
const MAP_STYLE = { color: '#b6c2d9', weight: 0.5, fillColor: '#dbeafe', fillOpacity: 0.85 };
function screenMapa(s, est) {
  const chips = (s.paises || []).map(p => `<span class="kp-chip">${esc(p)}</span>`).join('');
  return `<div class="kp-screen">
    <div class="kp-qt">🌍 Localiza en el mapamundi · ${s.qi + 1} de ${s.n}</div>
    <div class="kp-map-q">${esc(s.pide)}</div>
    <div class="kp-map" id="kp-map-${pantallaIdx}"></div>
    <div class="kp-map-chips">${chips}</div>
    <div class="kp-hint">👆 Pulsa en el mapa el país correcto.</div>
  </div>`;
}
function destruirMapas() {
  const arr = window.__pjMapas || [];
  arr.forEach(m => { try { m.remove(); } catch (e) { /* ok */ } });
  window.__pjMapas = [];
}
function iniciarMapa(idx) {
  const s = pantallas[idx];
  const cont = document.getElementById('kp-map-' + idx);
  if (!cont || !s || s.tipo !== 'mapa') return;
  MAPA_MUNDI.cargarTodo()
    .then(() => MAPA_MUNDI.cargarGeo())
    .then(geo => {
      if (!document.body.contains(cont)) return;
      if (!window.L) { cont.innerHTML = '<div class="kp-msg bad">No se pudo cargar el mapa (comprueba la conexión).</div>'; return; }
      const map = L.map(cont, { minZoom: 2, maxZoom: 6, zoomControl: true, attributionControl: false, scrollWheelZoom: true, maxBounds: [[-85, -180], [85, 180]] });
      map.setView([20, 0], 2);
      (window.__pjMapas = window.__pjMapas || []).push(map);
      const layer = L.geoJSON(geo, {
        style: MAP_STYLE,
        onEachFeature: (feat, lyr) => {
          lyr.on('click', () => kpMapa(idx, (feat.properties && feat.properties.name) || ''));
          lyr.on('mouseover', () => { if (!(kpEstado[idx] && kpEstado[idx].respondida)) lyr.setStyle({ fillColor: '#a5c8f0', color: '#64748b', weight: 1 }); });
          lyr.on('mouseout', () => { if (!(kpEstado[idx] && kpEstado[idx].respondida)) lyr.setStyle(MAP_STYLE); });
        }
      }).addTo(map);
      if (kpEstado[idx] && kpEstado[idx].respondida) {
        layer.eachLayer(ll => {
          const en = ll.feature && ll.feature.properties && ll.feature.properties.name;
          if (en === s.correctaEn) ll.setStyle({ fillColor: '#22a06b', color: '#166534', weight: 1.5, fillOpacity: 0.9 });
          else if (en === kpEstado[idx].sel) ll.setStyle({ fillColor: '#f87171', color: '#991b1b', weight: 1.5, fillOpacity: 0.9 });
        });
      }
      setTimeout(() => { try { map.invalidateSize(); } catch (e) { /* ok */ } }, 60);
    })
    .catch(() => { if (document.body.contains(cont)) cont.innerHTML = '<div class="kp-msg bad">No se pudo cargar el mapa (comprueba la conexión).</div>'; });
}
function kpMapa(idx, en) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (!est || !s || s.tipo !== 'mapa' || est.respondida) return;
  est.respondida = true;
  est.sel = en;
  est.acierto = (en === s.correctaEn);
  if (est.acierto) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

function pantallaNext() { if (pantallaIdx < pantallas.length - 1) { pantallaIdx++; if (window.pjSonido) pjSonido.hoja(); kpPrev = { programa: [], resultado: null, superado: false }; renderPantalla(); } }
function pantallaPrev() { if (pantallaIdx > 0) { pantallaIdx--; if (window.pjSonido) pjSonido.hoja(); kpPrev = { programa: [], resultado: null, superado: false }; renderPantalla(); } }

// ── Drag & drop ──────────────────────────────────────────────────────
function initDrag() {
  const canvas = $('canvas');
  document.querySelectorAll('.block-btn').forEach(btn => {
    btn.addEventListener('dragstart', (e) => { dragTipo = btn.dataset.tipo; e.dataTransfer.setData('text/plain', btn.dataset.tipo); });
    btn.addEventListener('click', () => { bloques.push(nuevoBloque(btn.dataset.tipo)); render(); });
  });
  canvas.addEventListener('dragover', (e) => { e.preventDefault(); canvas.classList.add('drag-over'); });
  canvas.addEventListener('dragleave', () => canvas.classList.remove('drag-over'));
  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    const tipo = e.dataTransfer.getData('text/plain') || dragTipo;
    if (tipo && TIPOS[tipo]) { bloques.push(nuevoBloque(tipo)); render(); }
    dragTipo = null;
  });
}

// ── Publicar ─────────────────────────────────────────────────────────
function abrirMeta() {
  $('m-titulo').value = meta.titulo;
  $('m-descripcion').value = meta.descripcion;
  if ($('m-pictograma')) $('m-pictograma').value = meta.pictograma || '';
  actualizarVistaPictograma();
  $('m-categoria').value = meta.categoria;
  $('m-tipo').value = meta.tipo;
  const estimada = estimarEdad();
  $('m-edad').value = estimada;
  const notaEdad = $('m-edad-note');
  if (notaEdad) notaEdad.textContent = `🪄 Edad estimada automáticamente según la longitud y el tamaño de las sopas y actividades: ${estimada}. Puedes cambiarla si quieres.`;
  $('m-dificultad').value = meta.dificultad;
  $('m-tiempo').value = meta.tiempo;
  $('m-titular').value = meta.titular || 'interno';
  if ($('m-precio-licencia')) $('m-precio-licencia').value = meta.precio_licencia || 0;
  if ($('m-precio-intento')) $('m-precio-intento').value = meta.precio_intento || 0;
  if ($('m-recompensa')) $('m-recompensa').value = meta.recompensa || 0;
  if ($('m-subvencionada')) $('m-subvencionada').checked = !!meta.subvencionada;
  if ($('m-destacada')) $('m-destacada').checked = !!meta.destacada;
  actualizarIdentidad();
  if (meta.eip) $('m-eip').value = meta.eip;
  if (meta.entidad) $('m-entidad').value = meta.entidad;
  if (meta.autor) $('m-autor').value = meta.autor;
  $('meta-modal').classList.remove('hidden');
}

// Muestra / oculta la vista previa del pictograma elegido
function actualizarVistaPictograma() {
  const campo = $('m-pictograma');
  const prev = $('m-pictograma-preview');
  if (!campo || !prev) return;
  const url = (campo.value || '').trim();
  if (url) {
    prev.style.display = 'block';
    prev.querySelector('img').src = url;
  } else {
    prev.style.display = 'none';
    prev.querySelector('img').removeAttribute('src');
  }
}

// Muestra los campos según quién publica (anónimo / EIP / profesor)
function actualizarIdentidad() {
  const t = $('m-titular').value;
  const cont = $('m-identidad');
  if (t === 'entidad_eip') {
    cont.innerHTML = `
      <label>Código EIP *</label>
      <input id="m-eip" type="text" placeholder="EIP-…" />
      <label>Nombre de la entidad (opcional)</label>
      <input id="m-entidad" type="text" placeholder="Ej: Colegio La Placeta" />`;
  } else if (t === 'profesor') {
    cont.innerHTML = `
      <label>Tu nombre (opcional, para la autoría)</label>
      <input id="m-autor" type="text" placeholder="Tu nombre de profesor" />
      <p class="form-note" style="margin-top:10px;">👨‍🏫 Los profesores se registran con <strong>Google u otro proveedor</strong> (sin DIP).</p>`;
  } else {
    cont.innerHTML = '';
  }
}

function contarPreguntas() {
  let n = 0;
  for (const b of bloques) {
    if (b.tipo === 'test') n += b.preguntas.length;
    else if (b.tipo === 'sopa_letras') n += b.palabras.filter(Boolean).length;
    else if (b.tipo === 'relacionar') n += b.pares.filter(p => p.izq && p.der).length;
    else if (b.tipo === 'ordenar') n += b.items.filter(Boolean).length;
    else if (b.tipo === 'completar') n += b.frases.filter(f => f.texto && f.respuesta).length;
    else if (b.tipo === 'calculo_mental') n += b.sumas.filter(s => s.a !== '' && s.b !== '').length;
    else if (b.tipo === 'mapa_mundi') n += (b.paises || []).filter(p => p && window.MAPA_MUNDI && MAPA_MUNDI.paises[p]).length;
    else if (b.tipo === 'code_blocks') n += (b.ejercicios || []).filter(e => e.objetivo && e.objetivo.posicion).length;
  }
  return n;
}

// Estima la edad recomendada según la longitud y el tamaño de las sopas y actividades
function estimarEdad() {
  let total = 0, n = 0;
  for (const b of bloques) {
    if (b.tipo === 'sopa_letras') {
      const words = (b.palabras || []).filter(Boolean);
      const maxLen = words.length ? Math.max(...words.map(w => String(w).length)) : 0;
      const size = Number(b.tamano) || 10;
      let e = 6;
      if (words.length >= 6) e = 9;
      else if (words.length >= 4) e = 8;
      else if (words.length >= 3) e = 7;
      if (maxLen >= 8 || size >= 12) e += 1;
      if (maxLen >= 5 && size >= 10) e += 1;
      total += e; n++;
    } else if (b.tipo === 'test') {
      const np = (b.preguntas || []).length;
      total += (np >= 10 ? 9 : (np >= 6 ? 8 : 6)); n++;
    } else if (b.tipo === 'code_blocks') {
      const ne = (b.ejercicios || []).length;
      total += (ne >= 4 ? 9 : (ne >= 2 ? 7 : 6)); n++;
    }
  }
  if (!n) return '6-12';
  const e = Math.round(total / n);
  return `${Math.max(5, e)}-${Math.min(14, e + 2)}`;
}

async function publicar() {
  const titulo = $('m-titulo').value.trim();
  const descripcion = $('m-descripcion').value.trim();
  const pictograma = ($('m-pictograma')?.value || '').trim();
  const categoria = $('m-categoria').value;
  const tipo = $('m-tipo').value;
  const edad_recomendada = $('m-edad').value.trim();
  const dificultad = $('m-dificultad').value;
  const tiempo_estimado = parseInt($('m-tiempo').value, 10) || 10;
  const titular = $('m-titular').value;
  const precio_licencia = parseInt($('m-precio-licencia')?.value, 10) || 0;
  const precio_intento = parseInt($('m-precio-intento')?.value, 10) || 0;
  const recompensa = parseInt($('m-recompensa')?.value, 10) || 0;
  const subvencionada = !!($('m-subvencionada')?.checked);
  const destacada = !!($('m-destacada')?.checked);

  let dip = '';
  let eip = '';
  let entidad = '';
  let autor = '';
  if (titular === 'profesor') autor = ($('m-autor')?.value || '').trim();
  else if (titular === 'entidad_eip') {
    eip = ($('m-eip')?.value || '').trim();
    entidad = ($('m-entidad')?.value || '').trim();
  }

  if (bloques.length === 0) { aviso('Añade al menos un bloque al lienzo.', true); $('meta-modal').classList.add('hidden'); return; }
  if (!titulo || !descripcion) { aviso('Completa título y descripción.', true); return; }
  if (titular === 'entidad_eip' && !eip) { aviso('Indica el código EIP de la entidad.', true); return; }
  const num_preguntas = contarPreguntas();
  if (num_preguntas === 0) { aviso('Añade contenido real en los bloques (preguntas, palabras, parejas…).', true); return; }

  meta = { titulo, descripcion, categoria, tipo, edad: edad_recomendada, dificultad, tiempo: tiempo_estimado, titular, dip, eip, entidad, autor, pictograma, precio_licencia, precio_intento, recompensa, subvencionada, destacada };
  guardar();

  // Construye el contenido según los tipos de bloque presentes.
  const bloquesCode = bloques.filter(b => b.tipo === 'code_blocks');
  const bloquesNormales = bloques.filter(b => b.tipo !== 'code_blocks');
  let contenido;
  const tipoReal = bloquesCode.length ? 'code_blocks' : tipo;
  if (bloquesCode.length) {
    // Combina todos los ejercicios de todos los bloques code en una evolución progresiva.
    const ejercicios = [];
    for (const bc of bloquesCode) {
      for (const ej of (bc.ejercicios || [])) {
        if (!ej.objetivo || !ej.objetivo.posicion) continue;
        ejercicios.push({
          titulo: ej.titulo || `Ejercicio ${ejercicios.length + 1}`,
          explicacion: ej.explicacion || '',
          objetivo_texto: ej.objetivo_texto || 'Lleva a Candela hasta la estrella.',
          escenario: ej.escenario || { tipo: 'cuadricula', ancho: 6, alto: 6 },
          inicio: ej.inicio || { x: 0, y: 0, direccion: 'derecha' },
          objetivo: ej.objetivo || {},
          bloques_permitidos: (ej.permitidos && ej.permitidos.length) ? ej.permitidos : null,
          max_bloques: ej.max_bloques || null,
          pistas: ej.pistas || [],
          programa_solucion: (ej.programa_solucion && ej.programa_solucion.length) ? ej.programa_solucion : null
        });
      }
    }
    contenido = { version: 2, bloques: bloquesNormales, ejercicios,
      explicacion: (bloquesCode[0].explicacion || 'Programa a Candela 👧 para que llegue a la estrella ⭐. Cada ejercicio es un poco más difícil.'),
      ...(pictograma ? { pictograma } : {}) };
  } else {
    contenido = { version: 2, bloques, ...(pictograma ? { pictograma } : {}) };
  }

  const body = {
    tipo_titular: titular, dip: dip || null, eip: eip || null, nombre_entidad: entidad || null, nombre_autor: autor || null,
    titulo, descripcion, categoria, tipo: tipoReal,
    edad_recomendada, dificultad, tiempo_estimado,
    num_preguntas,
    num_fases: bloques.length,
    precio_licencia, precio_intento, recompensa, subvencionada, destacada,
    contenido
  };

  const btn = $('meta-ok');
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = '⏳ Enviando…';
  try {
    const res = await fetch(`${API_BASE}/actividades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      if (data.necesita_acuerdo) {
        aviso(`❌ ${data.error || 'Debes firmar el Acuerdo de Colaborador.'}\n\nPara publicar como profesor necesitas ser mayor de 18 años y firmar el acuerdo vía PlacetaID. O publica como anónimo / EIP sin DIP. Escribe a junior@laplaceta.org.`, true);
      } else {
        aviso(`❌ ${data.error || `Error (HTTP ${res.status})`}`, true);
      }
      $('meta-modal').classList.add('hidden');
      return;
    }
    aviso(`✅ ${data.mensaje || 'Actividad enviada a revisión.'}`, false);
    $('meta-modal').classList.add('hidden');
    bloques = []; render();
  } catch (err) {
    aviso(`❌ Error de conexión: ${err.message}`, true);
    $('meta-modal').classList.add('hidden');
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
}

function aviso(msg, esError) {
  const err = $('form-error');
  const ok = $('form-success');
  err.textContent = ''; ok.textContent = '';
  err.classList.add('hidden'); ok.classList.remove('hidden');
  if (esError) { err.textContent = msg; err.classList.remove('hidden'); ok.classList.add('hidden'); }
  else ok.textContent = msg;
  setTimeout(() => { err.textContent = ''; ok.textContent = ''; err.classList.add('hidden'); ok.classList.add('hidden'); }, 8000);
}

// ── Init ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  cargar();
  initDrag();
  render();
  renderProyectos();

  $('btn-guardar').addEventListener('click', () => { guardar(); aviso('💾 Borrador guardado en este navegador.', false); });
  $('btn-publicar').addEventListener('click', abrirMeta);
  $('btn-vista').addEventListener('click', verPreview);
  if ($('btn-nuevo')) $('btn-nuevo').addEventListener('click', nuevoProyectoPrompt);
  if ($('btn-duplicar')) $('btn-duplicar').addEventListener('click', () => duplicarProyecto(proyectoActual));
  if ($('btn-borrar')) $('btn-borrar').addEventListener('click', borrarProyectoPrompt);

  $('img-ok').addEventListener('click', aplicarImagen);
  $('img-cancel').addEventListener('click', () => $('img-modal').classList.add('hidden'));
  $('meta-ok').addEventListener('click', publicar);
  $('meta-cancel').addEventListener('click', () => $('meta-modal').classList.add('hidden'));
  $('preview-close').addEventListener('click', cerrarPreview);
  $('m-titular').addEventListener('change', actualizarIdentidad);
  let galeriaTimer = null;
  $('img-search').addEventListener('input', () => {
    galeriaBusqueda = $('img-search').value;
    clearTimeout(galeriaTimer);
    galeriaTimer = setTimeout(renderGaleria, 300);
  });

  // Buscador de pictogramas ARASAAC
  $('m-pictograma-buscar').addEventListener('click', () => {
    if (!window.Pictogramas) { aviso('El buscador de pictogramas no está disponible.', true); return; }
    window.Pictogramas.abrirBuscador({
      actual: ($('m-pictograma').value || '').trim().split('/').pop().split('_')[0],
      onSeleccionar: (p) => {
        $('m-pictograma').value = p.url;
        actualizarVistaPictograma();
        aviso('🖼️ Pictograma elegido: ' + p.palabra, false);
      }
    });
  });
  $('m-pictograma-quitar').addEventListener('click', () => {
    $('m-pictograma').value = '';
    actualizarVistaPictograma();
  });
  $('m-pictograma').addEventListener('input', actualizarVistaPictograma);
  document.querySelectorAll('#img-prov .chip-cat').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#img-prov .chip-cat').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      galeriaProv = b.dataset.prov;
      renderGaleria();
    });
  });

  // Sopa: arrastrar / deslizar para formar las palabras
  document.addEventListener('pointerdown', kpStart);
  document.addEventListener('pointermove', kpMove);
  document.addEventListener('pointerup', kpEnd);
  document.addEventListener('pointercancel', kpEnd);

  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('img-modal').classList.add('hidden');
      $('meta-modal').classList.add('hidden');
      if (!$('preview-modal').classList.contains('hidden')) cerrarPreview();
    }
  });
});

// Cerrar la vista previa pidiendo confirmación si hay partida en curso
function cerrarPreview() {
  const enCurso = pantallaIdx > 0 && pantallaIdx < pantallas.length - 1;
  const cerrar = () => $('preview-modal').classList.add('hidden');
  if (enCurso) {
    juniorConfirmar('¿Seguro que quieres salir? Perderás el progreso de esta vista previa.', cerrar);
  } else {
    cerrar();
  }
}
