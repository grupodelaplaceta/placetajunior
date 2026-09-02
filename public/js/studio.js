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
  code_blocks:   { ico: 'code', nombre: 'Placeta Junior Code' },
  arrastrar:     { ico: 'open_with', nombre: 'Arrastrar y colocar' },
  buscar:        { ico: 'search', nombre: 'Busca y encuentra' },
  detective:     { ico: 'manage_search', nombre: 'Candela Detective' },
  laboratorio:   { ico: 'science', nombre: 'Laboratorio' },
  construccion:  { ico: 'build', nombre: 'Construye' },
  presupuesto:   { ico: 'shopping_cart', nombre: 'Tienda de Candela' },
  dinero_euro:   { ico: 'euro', nombre: 'Billetes y monedas de euro' },
  construir_frase: { ico: 'format_quote', nombre: 'Constructor de frases' },
  clasificar_palabras: { ico: 'category', nombre: 'Clasificador de palabras' },
  completar_palabra: { ico: 'spellcheck', nombre: 'Completa la palabra' },
  cazador_errores: { ico: 'search_check', nombre: 'Cazador de errores' },
  lectura_interactiva: { ico: 'menu_book', nombre: 'Lectura interactiva' },
  exploracion:   { ico: 'explore', nombre: 'Exploración' },
  simulacion:    { ico: 'casino', nombre: 'Simulador' },
  historia_interactiva: { ico: 'auto_stories', nombre: 'Historia interactiva' }
  ,memoria:       { ico: 'memory', nombre: 'Memoria' }
  ,sonido:        { ico: 'hearing', nombre: 'Sonido' }
  ,codigo_secreto:{ ico: 'lock', nombre: 'Código secreto' }
  ,escape_room:   { ico: 'vpn_key', nombre: 'Escape room' }
};

const BIBLIOTECA_SONIDOS = [
  {id:'acierto',nombre:'Acierto',icono:'✨',descripcion:'Campanillas suaves'}, {id:'error',nombre:'Inténtalo otra vez',icono:'🫧',descripcion:'Aviso amable'},
  {id:'clic',nombre:'Clic',icono:'🖱️',descripcion:'Interacción corta'}, {id:'moneda',nombre:'Moneda',icono:'🪙',descripcion:'Recompensa'},
  {id:'puerta',nombre:'Puerta misteriosa',icono:'🚪',descripcion:'Escape room'}, {id:'explosion',nombre:'Sorpresa',icono:'🎉',descripcion:'Descubrimiento'},
  {id:'naturaleza',nombre:'Naturaleza',icono:'🌿',descripcion:'Ambiente suave'}, {id:'dado',nombre:'Dado',icono:'🎲',descripcion:'Simulación'}
];
let audioContextPJ = null;
function reproducirSonido(id) { try { audioContextPJ ||= new (window.AudioContext||window.webkitAudioContext)(); const c=audioContextPJ,n=c.currentTime,o=c.createOscillator(),g=c.createGain(),p={acierto:[523,659,784],error:[220,180],clic:[440],moneda:[880,1320],puerta:[130,196,260],explosion:[180,420,90],naturaleza:[392,494,587],dado:[260,330,390,520]},ns=p[id]||p.clic;o.type='triangle';g.gain.setValueAtTime(.0001,n);g.gain.exponentialRampToValueAtTime(.16,n+.02);ns.forEach((f,i)=>o.frequency.setValueAtTime(f,n+i*.09));g.gain.exponentialRampToValueAtTime(.0001,n+Math.max(.3,ns.length*.1));o.connect(g).connect(c.destination);o.start(n);o.stop(n+Math.max(.35,ns.length*.1));}catch(e){} }
function abrirBibliotecaSonidos(i) { sonidoTarget=i; const m=$('sound-modal'),c=$('sound-library'); if(!m||!c)return;c.innerHTML=BIBLIOTECA_SONIDOS.map(s=>`<div class="sound-card"><span class="sound-icon">${s.icono}</span><div><strong>${s.nombre}</strong><small>${s.descripcion}</small></div><button class="btn btn-outline sound-play" onclick="reproducirSonido('${s.id}')">▶</button><button class="btn btn-purple" onclick="seleccionarSonido(${i},'${s.id}')">Usar</button></div>`).join('');m.classList.remove('hidden'); }
function seleccionarSonido(i,id) { bloques[i].datos=bloques[i].datos||{};bloques[i].datos.sonido=id;guardarProyecto(proyectoActual);$('sound-modal')?.classList.add('hidden');render(); }
let sonidoTarget = null;
async function buscarFreesound() {
  const token=localStorage.getItem('pj-freesound-token')||$('freesound-token')?.value.trim(), q=$('freesound-query')?.value.trim()||'sound';
  const status=$('freesound-status'); if(!token){if(status)status.textContent='Introduce tu token de Freesound API v2 para buscar.';return;}
  if(status)status.textContent='Buscando sonidos…';
  try { const u=new URL('https://freesound.org/apiv2/search/');u.searchParams.set('query',q);u.searchParams.set('filter','license:"Creative Commons 0"');u.searchParams.set('page_size','24');u.searchParams.set('fields','id,name,username,license,previews,duration,url');const r=await fetch(u,{headers:{Authorization:'Token '+token}});if(!r.ok)throw new Error('Freesound respondió '+r.status);const j=await r.json();const c=$('sound-library');c.innerHTML=(j.results||[]).map(x=>`<div class="sound-card"><span class="sound-icon">🎧</span><div><strong>${esc(x.name)}</strong><small>${esc(x.username||'Autor desconocido')} · ${esc(x.license||'CC0')} · ${Number(x.duration||0).toFixed(1)}s</small><a href="https://freesound.org${x.url||('/sounds/'+x.id+'/')}" target="_blank" rel="noopener">Ver fuente</a></div><audio controls preload="none" src="${esc(x.previews?.['preview-hq-mp3']||x.previews?.['preview-lq-mp3']||'')}"></audio><button class="btn btn-purple" onclick="usarFreesound(${x.id},'${esc(x.previews?.['preview-hq-mp3']||x.previews?.['preview-lq-mp3']||'')}','${esc(x.name)}','${esc(x.username||'')}','${esc(x.license||'Creative Commons 0')}','https://freesound.org${x.url||('/sounds/'+x.id+'/')}')">Usar</button></div>`).join('')||'<p class="form-note">No se encontraron sonidos CC0.</p>';if(status)status.textContent=`${j.count||0} resultados CC0 · uso libre sin atribución.`; } catch(e) {if(status)status.textContent='No se pudo conectar con Freesound. Comprueba el token y la conexión.';}
}
function usarFreesound(id,url,nombre,usuario,licencia,fuente){if(sonidoTarget==null)return;const d=bloques[sonidoTarget].datos=bloques[sonidoTarget].datos||{};Object.assign(d,{audio_url:url,audio_id:id,audio_nombre:nombre,audio_usuario:usuario,audio_licencia:licencia,audio_fuente:fuente});guardarProyecto(proyectoActual);$('sound-modal')?.classList.add('hidden');render();}

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
let unsplashBusqueda = '';
let unsplashCargando = false;

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
  if (q && q !== unsplashBusqueda && !unsplashCargando && localStorage.getItem('pj-unsplash-key')) buscarUnsplash(q);
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

// ── Reparación de URLs de imagen ─────────────────────────────────────
// Algunas actividades (generadas con IA) guardan la URL de la imagen como
// un enlace Markdown partido por el ':' de la propia URL (p. ej. el ':' de
// "…/wiki/Special:Redirect/file/X.svg"). Ejemplo real guardado:
//   "imagen_url": "[https://…/wiki/Special](https://…/wiki/Special):Redirect/file/X.svg"
// Aquí se reconstruye la URL real para que la imagen pueda mostrarse.
function pjUrlImg(u) {
  u = String(u ?? '').trim();
  if (!u) return u;
  const ini = u.indexOf('](');
  if (ini > -1) {
    const fin = u.indexOf(')', ini + 2);
    if (fin > -1) {
      const etiqueta = u.slice(0, ini).replace(/^\[\s*/, '').trim();
      const href = u.slice(ini + 2, fin).trim();
      const resto = u.slice(fin + 1).trim();
      for (const c of [href + resto, href, etiqueta]) {
        const limpia = pjUrlEsquema(c);
        if (/^https?:\/\//i.test(limpia)) return limpia;
      }
    }
  }
  return pjUrlEsquema(u);
}
function pjUrlEsquema(u) {
  return String(u ?? '').trim().replace(/^([a-z][a-z0-9+.\-]*):\/([^/])/i, '$1://$2');
}
function pjEsCampoImagen(k) {
  return k === 'imagen_url' || k === 'imagenUrl' || k === 'image_url' || k === 'imageUrl' || k === 'imagen' || k === 'izq_img' || k === 'izq_imagen_url' || k === 'izqImg' || k === 'portada_url' || k === 'portadaUrl';
}
function pjSaneaImagenes(raiz) {
  if (!raiz) return 0;
  let cambios = 0;
  if (Array.isArray(raiz)) { for (const x of raiz) cambios += pjSaneaImagenes(x); return cambios; }
  if (raiz && typeof raiz === 'object') {
    for (const k of Object.keys(raiz)) {
      const v = raiz[k];
      if (typeof v === 'string') {
        if (pjEsCampoImagen(k)) { const c = pjUrlImg(v); if (c !== v) { raiz[k] = c; cambios++; } }
      } else if (v && typeof v === 'object') { cambios += pjSaneaImagenes(v); }
    }
  }
  return cambios;
}

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
  pjSaneaImagenes(bloques);
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
  if (tipo === 'calculo_mental') { b.sumas = [{ a: '', b: '', op: 'suma' }]; b.operacion = 'suma'; b.segundos = 10; b.modo = 'opciones'; b.vertical = false; b.llevadas = true; }
  if (tipo === 'problemas') { b.problemas = [{ enunciado: '', frase: 'Al final tiene ___', respuesta: '', operaciones: [] }]; b.modo = 'escribir'; }
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
  if (['arrastrar','buscar','detective','laboratorio','construccion','presupuesto','dinero_euro','construir_frase','clasificar_palabras','completar_palabra','cazador_errores','lectura_interactiva','exploracion','simulacion','historia_interactiva','memoria','sonido','codigo_secreto','escape_room'].includes(tipo)) {
    b.instrucciones = tipo === 'arrastrar' ? 'Coloca cada elemento en su lugar.' : '¡Completa este reto!';
    b.datos = tipo === 'arrastrar'
      ? { elementos: ['🍌|Cáscara de plátano|orgánico','📰|Periódico|papel','🍾|Botella|vidrio'], zonas: ['orgánico','papel','vidrio'], respuestas: { 'Cáscara de plátano':'orgánico','Periódico':'papel','Botella':'vidrio' } }
      : tipo === 'buscar' ? { objetos: ['💡|Lámpara|1','📱|Móvil|1','🪑|Silla|0'], objetivo: 2 }
      : tipo === 'detective' ? { pistas: ['Estuvo en la cocina.','Tenía las manos llenas de harina.','Hay migas cerca del horno.'], opciones: ['Candela','El gato','La abuela'], correcta: 0 }
      : tipo === 'laboratorio' ? { opciones: ['☀️|Luz|1','💧|Agua|1','❄️|Hielo|0','🍬|Azúcar|0'], resultado: 'La planta crece fuerte.' }
      : tipo === 'construccion' ? { piezas: ['🔋 Batería','💡 Bombilla','🔌 Cables','⏻ Interruptor'], solucion: ['Batería','Cables','Interruptor','Bombilla'] }
      : tipo === 'presupuesto' ? { presupuesto: 20, productos: ['🍎|Manzana|2','🥛|Leche|1.5','🍞|Pan|1.2','🍝|Pasta|2.3'] }
      : tipo === 'dinero_euro' ? { objetivo: 7.35, monedas: [0.01,0.02,0.05,0.10,0.20,0.50,1,2], billetes: [5,10,20] }
      : tipo === 'construir_frase' ? { palabras: ['El','gato','come','pescado'], respuesta: 'El gato come pescado' }
      : tipo === 'clasificar_palabras' ? { categorias: ['Sustantivo','Verbo','Adjetivo'], elementos: [{texto:'perro',categoria:'Sustantivo'},{texto:'correr',categoria:'Verbo'},{texto:'azul',categoria:'Adjetivo'}] }
      : tipo === 'completar_palabra' ? { modo:'opciones', ejercicios:[{texto:'El ca__o corre por el parque.',respuesta:'rr',opciones:['r','rr','rrr']}] }
      : tipo === 'cazador_errores' ? { texto:'Ayer fuimos al parque y vimos un pajaro.', errores:[{incorrecto:'pajaro',correcto:'pájaro'}] }
      : tipo === 'lectura_interactiva' ? { escenas:[{texto:'Candela encuentra una caja misteriosa.',opciones:[{texto:'Abrir la caja',siguiente:1},{texto:'Buscar ayuda',siguiente:1}]},{texto:'¡Dentro hay una sorpresa! Fin.',opciones:[]}] }
      : tipo === 'exploracion' ? { lugares: ['📍 Tarragona|Capital romana|tarragona','📍 Barcelona|Ciudad modernista|barcelona','📍 Madrid|Capital de España|madrid'], pregunta: '¿Qué ciudad quieres visitar primero?', correcta: 'barcelona' }
      : tipo === 'simulacion' ? { caras: 6, pregunta: 'Lanza el dado y observa los resultados.' }
      : tipo === 'memoria' ? { tarjetas: ['☀️','🌙','🌈','⭐','☀️','🌙','🌈','⭐'] }
      : tipo === 'sonido' ? { audio_url: '', respuesta: 'perro', opciones: ['perro','gato','pájaro'] }
      : tipo === 'codigo_secreto' ? { pistas: ['La primera cifra es 4.','La segunda es el doble de 3.'], contraseña: '46', intentos: 3 }
      : tipo === 'escape_room' ? { pruebas: [{ pregunta: '¿Cuánto es 2 + 2?', opciones: ['3','4','5'], correcta: 1 }], contraseña: 'SALIDA' }
      : { escenas: [{ texto: 'Candela encuentra una puerta misteriosa.', opciones: ['Abrirla','Buscar una llave','Pedir ayuda'], siguiente: [1,2,2] }, { texto: 'Dentro hay una sorpresa.', opciones: [], siguiente: [] }] };
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
  pjSaneaImagenes(bloques);
  const canvas = $('canvas');
  if (bloques.length === 0) {
    canvas.innerHTML = '<div id="canvas-empty" class="canvas-empty">Arrastra bloques aquí 👇</div>';
  } else {
    canvas.innerHTML = bloques.filter(b => b.tipo !== 'problemas').map((b, i) => renderBloque(b, i)).join('');
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
  else if (b.tipo === 'problemas') cuerpo = renderProblemas(b, i);
  else if (b.tipo === 'mapa_mundi') cuerpo = renderMapa(b, i);
  else if (b.tipo === 'code_blocks') cuerpo = renderCode(b, i);
  else if (TIPOS[b.tipo] && b.datos) cuerpo = renderInteractivo(b, i);

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

async function buscarUnsplash(q) {
  const key=localStorage.getItem('pj-unsplash-key'); if(!key)return; unsplashCargando=true;unsplashBusqueda=q;
  const status=$('unsplash-status');if(status)status.textContent='Buscando imágenes en Unsplash…';
  try { const u=new URL('https://api.unsplash.com/search/photos');u.searchParams.set('query',q);u.searchParams.set('per_page','30');u.searchParams.set('content_filter','high');const r=await fetch(u,{headers:{Authorization:'Client-ID '+key}});if(!r.ok)throw new Error();const j=await r.json();const api=(j.results||[]).map(x=>({url:x.urls?.regular||x.urls?.small,thumb:x.urls?.small,fuente:`Foto: Unsplash · ${x.user?.name||x.user?.username||'autor'} · https://unsplash.com/@${x.user?.username||''}`,prov:'unsplash-api',tema:q,autor:x.user?.name||x.user?.username||''}));const existentes=new Set(GALERIA.map(x=>x.url));galeriaArasaac=[];galeriaActual=[...api.filter(x=>x.url&&!existentes.has(x.url)),...galeriaActual].slice(0,120);const c=$('stock-thumbs');if(c)c.innerHTML=galeriaActual.map((g,idx)=>`<div class="g-item" style="background-image:url('${esc(g.thumb||g.url)}')" data-i="${idx}" onclick="elegirGaleria(${idx})"><span class="g-tag">${esc(g.autor||g.tema||g.prov)}</span></div>`).join('');if(status)status.innerHTML='Resultados de Unsplash. La atribución del fotógrafo se guardará con la imagen.';}catch(e){if(status)status.textContent='No se pudo conectar con Unsplash. Comprueba tu Access Key.';}finally{unsplashCargando=false;}
}

function renderInteractivo(b, i) {
  const tipo=b.tipo,d=b.datos||{};
  const field=(key,label,ph='')=>`<label>${label}<input value="${esc(d[key]??'')}" placeholder="${esc(ph)}" oninput="setDatoCampo(${i},'${key}',this.value)"></label>`;
  const list=(key,label,ph)=>`<label>${label}<span class="field-help">Una línea por elemento · emoji|texto|correcto (1/0) cuando aplique</span><textarea rows="4" placeholder="${esc(ph)}" oninput="setDatoLista(${i},'${key}',this.value)">${esc((d[key]||[]).join('\n'))}</textarea></label>`;
  const json=(label, value)=>`<label>${label}<span class="field-help">Formato JSON del ejercicio</span><textarea rows="6" class="json-editor" oninput="setDatosJSON(${i},this.value)">${esc(JSON.stringify(value,null,2))}</textarea></label>`;
  let specific='';
  if(tipo==='arrastrar') specific=list('zonas','Contenedores / categorías','orgánico\npapel\nvidrio')+list('elementos','Elementos arrastrables','🍌|Cáscara|orgánico\n📰|Periódico|papel');
  else if(tipo==='buscar') specific=field('objetivo','Número de objetos correctos','8')+list('objetos','Objetos de la escena','💡|Lámpara|1\n🪑|Silla|0');
  else if(tipo==='detective') specific=list('pistas','Pistas','Estuvo en la cocina.')+list('opciones','Sospechosos / respuestas','Candela\nEl gato')+field('correcta','Índice de la respuesta correcta','0');
  else if(tipo==='laboratorio') specific=field('resultado','Consecuencia al experimentar','La planta crece fuerte.')+list('opciones','Elementos para probar','☀️|Luz|1\n❄️|Hielo|0');
  else if(tipo==='construccion') specific=list('piezas','Piezas disponibles','🔋 Batería\n🔌 Cables\n💡 Bombilla')+list('solucion','Orden / solución','Batería\nCables\nBombilla');
  else if(tipo==='presupuesto') specific=field('presupuesto','Presupuesto (Pz)','20')+list('productos','Productos','🍎|Manzana|2\n🥛|Leche|1.5');
  else if(tipo==='dinero_euro') specific=field('objetivo','Cantidad objetivo (€)','7.35')+list('monedas','Monedas (€)','0.01\n0.10\n0.50\n1\n2')+list('billetes','Billetes (€)','5\n10\n20');
  else if(tipo==='construir_frase') specific=json('Frase y palabras',{palabras:d.palabras||['El','gato','come','pescado'],respuesta:d.respuesta||'El gato come pescado'});
  else if(tipo==='clasificar_palabras') specific=json('Categorías y palabras',{categorias:d.categorias||['Sustantivo','Verbo','Adjetivo'],elementos:d.elementos||[]});
  else if(tipo==='completar_palabra') specific=json('Ejercicios de ortografía',{modo:'opciones',ejercicios:d.ejercicios||[]});
  else if(tipo==='cazador_errores') specific=json('Frase y errores',{texto:d.texto||'',errores:d.errores||[]});
  else if(tipo==='lectura_interactiva') specific=json('Escenas y decisiones',{escenas:d.escenas||[]});
  else if(tipo==='exploracion') specific=field('pregunta','Pregunta del mapa','¿Qué lugar quieres visitar?')+list('lugares','Lugares / paradas','📍 Tarragona|Ciudad romana|tarragona');
  else if(tipo==='simulacion') specific=field('caras','Caras / resultados posibles','6')+field('pregunta','Pregunta para reflexionar','¿Qué número ha salido más veces?');
  else if(tipo==='memoria') specific=list('tarjetas','Tarjetas (cada pareja debe repetirse)','☀️\n🌙\n☀️\n🌙');
  else if(tipo==='sonido') specific=field('audio_url','URL de audio','https://…')+list('opciones','Respuestas posibles','perro\ngato\npájaro')+field('respuesta','Respuesta correcta','perro');
  else if(tipo==='codigo_secreto') specific=list('pistas','Pistas','La primera cifra es 4.')+field('contraseña','Contraseña de salida','46');
  else if(tipo==='escape_room') specific=field('contraseña','Contraseña final','SALIDA')+list('pruebas','Pruebas · pregunta|opciones separadas por /|índice correcto','¿Cuánto es 2+2?|3/4/5|1');
  return `<div class="interactive-editor"><div class="interactive-callout"><strong>${esc(TIPOS[tipo].nombre)}</strong><br><span>Diseña una experiencia en 3 capas: objetivo → acción → feedback.</span></div>${field('instrucciones','Instrucciones para el niño','Haz algo y descubre qué ocurre…')}${specific}<div class="sound-choice"><span>🔊 Sonido: <strong>${esc(d.sonido||'ninguno')}</strong></span><button class="btn btn-outline" onclick="abrirBibliotecaSonidos(${i})">Biblioteca libre</button></div><details class="advanced-json"><summary>Opciones avanzadas · importar/exportar</summary><textarea rows="8" class="json-editor" oninput="setDatosJSON(${i},this.value)">${esc(JSON.stringify(d,null,2))}</textarea></details></div>`;
}
function setDatosJSON(i, value) { try { bloques[i].datos = JSON.parse(value); } catch (e) {} }
function setDatoCampo(i,k,v){bloques[i].datos=bloques[i].datos||{};bloques[i].datos[k]=(['objetivo','caras','correcta'].includes(k)?(Number(v)||0):v);guardarProyecto(proyectoActual);}
function setDatoLista(i,k,v){bloques[i].datos=bloques[i].datos||{};bloques[i].datos[k]=v.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);guardarProyecto(proyectoActual);}

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
function insertarFormatoTexto(i, prefijo, sufijo) {
  const area = document.getElementById(`texto-${i}`); if (!area) return;
  const inicio = area.selectionStart, fin = area.selectionEnd, valor = area.value;
  area.value = valor.slice(0, inicio) + prefijo + valor.slice(inicio, fin) + sufijo + valor.slice(fin);
  setCampo(i, 'contenido', area.value); area.focus();
  area.setSelectionRange(inicio + prefijo.length, fin + prefijo.length);
}
function formatearTextoPJ(texto) { return String(texto || '').split(/\r?\n/).map(linea => { const t=esc(linea.trim()); if(!t)return ''; if(/^### /.test(t))return `<h5>${formatoInlinePJ(t.slice(4))}</h5>`; if(/^## /.test(t))return `<h4>${formatoInlinePJ(t.slice(3))}</h4>`; if(/^# /.test(t))return `<h3>${formatoInlinePJ(t.slice(2))}</h3>`; if(/^> /.test(t))return `<blockquote>${formatoInlinePJ(t.slice(2))}</blockquote>`; if(/^(?:- |• )/.test(t))return `<div class="pj-formatted-list">• ${formatoInlinePJ(t.slice(2))}</div>`; return `<p>${formatoInlinePJ(t)}</p>`; }).join(''); }
function formatoInlinePJ(t) { return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code>$1</code>'); }
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
      <div class="pj-text-toolbar" role="toolbar" aria-label="Formato del texto"><button type="button" onclick="insertarFormatoTexto(${i},'**','**')"><strong>N</strong></button><button type="button" onclick="insertarFormatoTexto(${i},'*','*')"><em>C</em></button><button type="button" onclick="insertarFormatoTexto(${i},'# ','')">Título</button><button type="button" onclick="insertarFormatoTexto(${i},'- ','')">Lista</button><button type="button" onclick="insertarFormatoTexto(${i},'> ','')">Cita</button><button type="button" onclick="insertarFormatoTexto(${i},'&#96;','&#96;')">Código</button></div>
      <textarea id="texto-${i}" rows="8" placeholder="# Título\nEscribe **negrita**, *cursiva* o una lista:\n- Primer punto\n- Segundo punto" style="width:100%;margin-top:8px;" oninput="setCampo(${i},'contenido',this.value)">${esc(b.contenido || '')}</textarea>
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">lightbulb</span> Formato: # títulos · **negrita** · *cursiva* · - listas · &gt; citas. Las interacciones se configuran como popups.</p>
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
  const opcionesOp = ['suma', 'resta', 'multiplicacion', 'division'];
  const nombreOp = { suma: 'Suma (+)', resta: 'Resta (−)', multiplicacion: 'Multiplicación (×)', division: 'División (÷)' };
  const filas = (b.sumas || []).map((s, j) => {
    const op = s.op || b.operacion || 'suma';
    return `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Operación ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'sumas',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <div class="row2">
        <input type="number" inputmode="numeric" placeholder="Número A" value="${esc(s.a)}" oninput="setSuma(${i},${j},'a',this.value)" />
        <input type="number" inputmode="numeric" placeholder="Número B" value="${esc(s.b)}" oninput="setSuma(${i},${j},'b',this.value)" />
      </div>
      <select style="margin-top:6px;" onchange="setSuma(${i},${j},'op',this.value)">
        ${opcionesOp.map(o => `<option value="${o}" ${op === o ? 'selected' : ''}>${nombreOp[o]}</option>`).join('')}
      </select>
      <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">calculate</span> ${(Number(s.a) || 0)} ${opSimbolo(op)} ${(Number(s.b) || 0)} = ${calcularResultado(Number(s.a) || 0, Number(s.b) || 0, op)}</p>
    </div>`;
  }).join('');
  return `
    <div class="row2">
      <div><label><span class="material-symbols-rounded q-ico">timer</span> Segundos por operación</label><input type="number" min="3" max="60" value="${b.segundos || 10}" oninput="setCampo(${i},'segundos',this.value)" /></div>
      <div><label>Cómo responden</label>
        <select onchange="setCampo(${i},'modo',this.value)">
          <option value="opciones" ${b.modo !== 'escribir' ? 'selected' : ''}>3 opciones</option>
          <option value="escribir" ${b.modo === 'escribir' ? 'selected' : ''}>Escriben la respuesta</option>
        </select>
      </div>
    </div>
    <div class="row2" style="margin-top:8px;">
      <div><label>Operación por defecto</label>
        <select onchange="setCampo(${i},'operacion',this.value)">
          ${opcionesOp.map(o => `<option value="${o}" ${(b.operacion || 'suma') === o ? 'selected' : ''}>${nombreOp[o]}</option>`).join('')}
        </select>
      </div>
      <div><label>Formato</label>
        <div class="seg">
          <button type="button" class="chip-cat ${!b.vertical ? 'active' : ''}" onclick="setCampo(${i},'vertical',false);render();">Horizontal</button>
          <button type="button" class="chip-cat ${b.vertical ? 'active' : ''}" onclick="setCampo(${i},'vertical',true);render();">Vertical</button>
        </div>
      </div>
    </div>
    ${b.vertical ? `<div class="row2" style="margin-top:8px;"><label class="check" style="display:flex;align-items:center;gap:6px;"><input type="checkbox" ${b.llevadas !== false ? 'checked' : ''} onchange="setCampo(${i},'llevadas',this.checked)" /> ✏️ Mostrar llevadas (sumas en vertical)</label></div>` : ''}
    ${filas}
    <button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirSuma(${i})"><span class="material-symbols-rounded seg-ico">add</span> Añadir operación</button>
    <p class="form-note" style="margin-top:6px;"><span class="material-symbols-rounded q-ico">lightbulb</span> En vertical, las sumas muestran las llevadas encima de cada columna.</p>`;
}

function setSuma(i, j, lado, valor) { bloques[i].sumas[j][lado] = valor; }
function anadirSuma(i) { bloques[i].sumas.push({ a: '', b: '', op: bloques[i].operacion || 'suma' }); render(); }

// ── Problemas matemáticos ──────────────────────────────────────────
function renderProblemas(b, i) {
  const modo = b.modo || 'escribir';
  const togg = `
    <div class="row2" style="margin-bottom:14px;">
      <div>
        <label>Cómo responden</label>
        <div class="seg">
          <button type="button" class="chip-cat ${modo === 'escribir' ? 'active' : ''}" onclick="setModoProblemas(${i},'escribir')"><span class="material-symbols-rounded seg-ico">edit_note</span> Escriben el resultado</button>
          <button type="button" class="chip-cat ${modo === 'opciones' ? 'active' : ''}" onclick="setModoProblemas(${i},'opciones')"><span class="material-symbols-rounded seg-ico">radio_button_checked</span> Elegir opción</button>
        </div>
      </div>
      <p class="form-note" style="align-self:center;margin:0;">El niño lee el problema (puede tener varias operaciones) y completa la frase final con el resultado.</p>
    </div>`;
  const filas = (b.problemas || []).map((p, j) => {
    const operaciones = (p.operaciones || []).map((o, oi) => `
      <div class="row2" style="margin-top:6px;align-items:center;">
        <input type="number" inputmode="numeric" placeholder="A" value="${esc(o.a)}" style="max-width:96px;" oninput="setOperacion(${i},${j},${oi},'a',this.value)" />
        <select style="max-width:130px;" onchange="setOperacion(${i},${j},${oi},'op',this.value)">
          <option value="suma" ${(o.op || 'suma') === 'suma' ? 'selected' : ''}>+ suma</option>
          <option value="resta" ${(o.op || 'suma') === 'resta' ? 'selected' : ''}>− resta</option>
          <option value="multiplicacion" ${(o.op || 'suma') === 'multiplicacion' ? 'selected' : ''}>× multiplicación</option>
          <option value="division" ${(o.op || 'suma') === 'division' ? 'selected' : ''}>÷ división</option>
        </select>
        <input type="number" inputmode="numeric" placeholder="B" value="${esc(o.b)}" style="max-width:96px;" oninput="setOperacion(${i},${j},${oi},'b',this.value)" />
        <button class="b-btn del" type="button" onclick="borrarOperacion(${i},${j},${oi})"><span class="material-symbols-rounded">delete</span></button>
      </div>`).join('');
    return `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Problema ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'problemas',${j})"><span class="material-symbols-rounded">delete</span></button></div>
      </div>
      <label>Enunciado (historia, puede incluir varias operaciones)</label>
      <textarea rows="3" placeholder="Ej: María tiene 5 manzanas, compra 3 más y regala 2." oninput="setProblema(${i},${j},'enunciado',this.value)">${esc(p.enunciado || '')}</textarea>
      <label style="margin-top:8px;">Frase a completar (usa ___)</label>
      <input placeholder="Ej: Al final le quedan ___ manzanas." value="${esc(p.frase || '')}" oninput="setProblema(${i},${j},'frase',this.value)" />
      <label style="margin-top:8px;">Resultado correcto</label>
      <input type="number" inputmode="numeric" placeholder="Ej: 6" value="${esc(p.respuesta)}" oninput="setProblema(${i},${j},'respuesta',this.value)" />
      <label style="margin-top:8px;">Operaciones en vertical (opcional)</label>
      ${operaciones}
      <button class="btn btn-outline" type="button" style="margin-top:8px;" onclick="anadirOperacion(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Añadir operación</button>
    </div>`;
  }).join('');
  return togg + filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirProblema(${i})"><span class="material-symbols-rounded seg-ico">add</span> Añadir problema</button>`;
}
function setProblema(i, j, campo, valor) { bloques[i].problemas[j][campo] = valor; }
function anadirProblema(i) { bloques[i].problemas.push({ enunciado: '', frase: 'Al final tiene ___', respuesta: '', operaciones: [] }); render(); }
function setModoProblemas(i, modo) { bloques[i].modo = modo; render(); }
function setOperacion(i, j, oi, campo, valor) { bloques[i].problemas[j].operaciones[oi][campo] = valor; }
function anadirOperacion(i, j) { const p = bloques[i].problemas[j]; if (!p.operaciones) p.operaciones = []; p.operaciones.push({ a: '', b: '', op: 'suma' }); render(); }
function borrarOperacion(i, j, oi) { bloques[i].problemas[j].operaciones.splice(oi, 1); render(); }

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
  const pistas = (ej.pistas || []).map((p, k) =>
    `<div class="row2" style="align-items:center;gap:8px;">
      <input placeholder="Pista ${k + 1}" value="${esc(p)}" style="flex:1;" oninput="setPista(${i},${j},${k},this.value)" />
      <button class="b-btn del" type="button" onclick="borrarPista(${i},${j},${k})"><span class="material-symbols-rounded">delete</span></button>
    </div>`).join('');
  return `
  <div class="q-item code-ejercicio" style="border-left:4px solid var(--pj-purple,#4E3B70);">
    <div class="q-head">
      <span class="q-num"><span class="material-symbols-rounded q-ico">code</span> Ejercicio ${j + 1}</span>
      <div class="q-tools">
        <button class="b-btn up"   onclick="moverEjercicio(${i},${j},-1)" title="Subir ejercicio"><span class="material-symbols-rounded">arrow_upward</span></button>
        <button class="b-btn down" onclick="moverEjercicio(${i},${j}, 1)" title="Bajar ejercicio"><span class="material-symbols-rounded">arrow_downward</span></button>
        <button class="b-btn del"  onclick="borrarEjercicio(${i},${j})" title="Eliminar ejercicio"><span class="material-symbols-rounded">delete</span></button>
      </div>
    </div>
    <input placeholder="Título del ejercicio (ej: Avanza 1 casilla)" value="${esc(ej.titulo || '')}" oninput="setEjercicio(${i},${j},'titulo',this.value)" />
    <input placeholder="Objetivo para el niño (ej: Lleva a Candela hasta la estrella)" value="${esc(ej.objetivo_texto || '')}" style="margin-top:6px;" oninput="setEjercicio(${i},${j},'objetivo_texto',this.value)" />
    <textarea rows="2" placeholder="Explicación extra del ejercicio (opcional)" style="width:100%;margin-top:6px;" oninput="setEjercicio(${i},${j},'explicacion',this.value)">${esc(ej.explicacion || '')}</textarea>

    ${renderCodeTablero(b, i, ej, j)}

    <div class="row2" style="grid-template-columns:1fr 1fr 1fr;gap:8px;margin-top:8px;">
      <div><label>Columnas</label><input type="number" min="3" max="12" value="${escen.ancho || 6}" oninput="setEscenario(${i},${j},'ancho',this.value)" /></div>
      <div><label>Filas</label><input type="number" min="3" max="12" value="${escen.alto || 6}" oninput="setEscenario(${i},${j},'alto',this.value)" /></div>
      <div><label>Máx. pasos</label><input type="number" min="1" max="40" value="${ej.objetivo ? (ej.objetivo.max_pasos || 5) : 5}" oninput="setObjetivo(${i},${j},'max_pasos',this.value)" /></div>
    </div>

    <div style="margin-top:8px;">
      <label>Bloques que puede usar el niño</label>
      <div class="seg" style="flex-wrap:wrap;gap:6px;">
        ${CODE_BLOQUES_EDITOR.map(cb => `
          <button type="button" class="chip-cat ${permitidos.includes(cb.op === 'girar_izq' ? 'girar' : cb.op) ? 'active' : ''}"
            onclick="togglePermitido(${i},${j},'${cb.op}')">
            ${studioIconoSVG(cb.icono)} ${esc(cb.nombre)}
          </button>`).join('')}
      </div>
      <p class="form-note" style="margin:4px 0 0;"><span class="material-symbols-rounded q-ico">lightbulb</span> Solo aparecerán en el juego los bloques que marques aquí.</p>
    </div>

    <details class="code-avanzado" style="margin-top:10px;">
      <summary><span class="material-symbols-rounded q-ico">tune</span> Opciones avanzadas (pistas y solución PDF)</summary>
      <div style="margin-top:8px;">
        <label>Pistas 💡 (opcional)</label>
        ${pistas || ''}
        <button class="b-btn" type="button" onclick="anadirPista(${i},${j})"><span class="material-symbols-rounded seg-ico">add</span> Pista</button>
      </div>
      <div style="margin-top:10px;">
        <label>Programa solución (opcional) — se imprime en la ficha PDF</label>
        <input placeholder="Ej: avanzar, avanzar, girar izquierda, avanzar" value="${esc(ej.programa_solucion_texto || '')}" style="width:100%;margin-top:4px;" oninput="setProgramaSolucion(${i},${j},this.value)" />
        <p class="form-note" style="margin:2px 0;">Bloques separados por comas (avanzar, retroceder, girar derecha/izquierda, saltar). Si lo dejas vacío, la ficha PDF lo calcula solo.</p>
      </div>
    </details>
  </div>`;
}

// ── Editor visual del tablero (tocar casillas, sin coordenadas) ──────
function renderCodeTablero(b, i, ej, j) {
  const escen = ej.escenario || {};
  const ancho = Math.max(3, Math.min(12, Number(escen.ancho) || 6));
  const alto = Math.max(3, Math.min(12, Number(escen.alto) || 6));
  const ini = ej.inicio || { x: 0, y: 0 };
  const obj = (ej.objetivo && ej.objetivo.posicion) || { x: 1, y: 0 };
  const herr = ej.herramienta || 'inicio';
  const herrInfo = {
    inicio: '👧 Inicio', estrella: '⭐ Estrella',
    obstaculo: '🚧 Obstáculo', moneda: '🪙 Moneda', borrar: '🧹 Quitar'
  };
  let celdas = '';
  for (let y = 0; y < alto; y++) {
    for (let x = 0; x < ancho; x++) {
      let cls = 'code-cell', emoji = '';
      if (Number(ini.x) === x && Number(ini.y) === y) { cls += ' code-cell-inicio'; emoji = '👧'; }
      else if (Number(obj.x) === x && Number(obj.y) === y) { cls += ' code-cell-estrella'; emoji = '⭐'; }
      else if (codeEn(escen.obstaculos, x, y)) { cls += ' code-cell-obst'; emoji = '🚧'; }
      else if (codeEn(escen.monedas, x, y)) { cls += ' code-cell-moned'; emoji = '🪙'; }
      else if (herr === 'borrar') { cls += ' code-cell-borrar'; }
      else { cls += ' code-cell-ghost'; emoji = { inicio: '👧', estrella: '⭐', obstaculo: '🚧', moneda: '🪙' }[herr] || ''; }
      celdas += `<button type="button" class="${cls}" data-x="${x}" data-y="${y}" onclick="codeCelda(${i},${j},${x},${y})">${emoji}</button>`;
    }
  }
  const toolsHtml = Object.keys(herrInfo).map(t =>
    `<button type="button" class="code-tool ${herr === t ? 'active' : ''}" onclick="codeHerramienta(${i},${j},'${t}')">${herrInfo[t]}</button>`).join('');
  const nObs = (escen.obstaculos || []).length;
  const nMon = (escen.monedas || []).length;
  return `
    <div style="margin-top:10px;">
      <label>Dibuja el tablero</label>
      <p class="form-note" style="margin:2px 0 6px;"><span class="material-symbols-rounded q-ico">edit</span> Elige una herramienta y toca las casillas para colocar cada cosa.</p>
      <div class="code-tools">${toolsHtml}</div>
      <div class="code-grid" style="grid-template-columns:repeat(${ancho}, 1fr);">${celdas}</div>
      <div class="code-grid-info">
        <span>👧 ${ini.x},${ini.y}</span><span>⭐ ${obj.x},${obj.y}</span><span>🚧 ${nObs}</span><span>🪙 ${nMon}</span>
        <button type="button" class="b-btn" onclick="codeLimpiar(${i},${j})"><span class="material-symbols-rounded seg-ico">delete_sweep</span> Quitar todo</button>
      </div>
    </div>`;
}
function codeEn(lista, x, y) { return (lista || []).some(e => Number(e.x) === x && Number(e.y) === y); }
function codeHerramienta(i, j, herr) { bloques[i].ejercicios[j].herramienta = herr; render(); }
function codeCelda(i, j, x, y) {
  const ej = bloques[i].ejercicios[j];
  const herr = ej.herramienta || 'inicio';
  const escen = ej.escenario = ej.escenario || {};
  escen.obstaculos = escen.obstaculos || [];
  escen.monedas = escen.monedas || [];
  const quita = (lista) => { for (let k = lista.length - 1; k >= 0; k--) if (Number(lista[k].x) === x && Number(lista[k].y) === y) lista.splice(k, 1); };
  const ini = ej.inicio = ej.inicio || { x: 0, y: 0 };
  if (herr === 'inicio') { ini.x = x; ini.y = y; quita(escen.obstaculos); quita(escen.monedas); }
  else if (herr === 'estrella') {
    ej.objetivo = ej.objetivo || {};
    ej.objetivo.posicion = ej.objetivo.posicion || {};
    ej.objetivo.posicion.x = x; ej.objetivo.posicion.y = y;
    quita(escen.obstaculos); quita(escen.monedas);
    // Autoajustar pasos máximos a la distancia (con margen)
    const dist = Math.abs(x - ini.x) + Math.abs(y - ini.y);
    const actual = Number(ej.objetivo.max_pasos) || 5;
    if (dist >= actual) ej.objetivo.max_pasos = dist + 2;
  }
  else if (herr === 'obstaculo') {
    if (codeEn(escen.obstaculos, x, y)) quita(escen.obstaculos);
    else { quita(escen.monedas); escen.obstaculos.push({ x, y }); }
  }
  else if (herr === 'moneda') {
    if (codeEn(escen.monedas, x, y)) quita(escen.monedas);
    else { quita(escen.obstaculos); escen.monedas.push({ x, y }); }
  }
  else if (herr === 'borrar') { quita(escen.obstaculos); quita(escen.monedas); }
  render();
}
function codeLimpiar(i, j) {
  const ej = bloques[i].ejercicios[j];
  ej.escenario = ej.escenario || {};
  ej.escenario.obstaculos = []; ej.escenario.monedas = [];
  render();
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
function borrarBloque(i) {
  if (i < 0 || i >= bloques.length) return;
  bloques.splice(i, 1);
  render();
}

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
  // Preview real: abre el mismo motor público, con el borrador actual.
  return verPreviewMotor();
  /* Legacy preview kept below for reference during migration.
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
        const op = operacionDe(s, b);
        const correcta = calcularResultado(a, bb, op);
        const opciones = b.modo === 'opciones' ? generarOpcionesCalculo(correcta) : [];
        pantallas.push({ tipo: 'calculo', bi, si, n: (b.sumas || []).length, op, vertical: !!b.vertical, llevadas: b.llevadas !== false });
        kpEstado.push({ respondida: false, sel: null, acierto: null, opciones, correcta });
      });
    } else if (b.tipo === 'problemas') {
      const probs = (b.problemas || []).filter(p => String(p.enunciado || '').trim() || String(p.frase || '').trim());
      probs.forEach((p, pi) => {
        const correcta = Number(p.respuesta) || 0;
        const opciones = b.modo === 'opciones' ? generarOpcionesCalculo(correcta) : [];
        pantallas.push({ tipo: 'problema', bi, pi, n: probs.length });
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
    } else if (b.datos && TIPOS[b.tipo]) {
      pantallas.push({ tipo: 'interactivo', bi });
      kpEstado.push({ respondida: false, seleccion: [], lanzamientos: [] });
    }
  });

  pantallas.push({ tipo: 'final', tit, cat });
  kpEstado.push({});
  kpScore = { verdes: 0, rojos: 0 };
  kpCelebrado = false;
  pantallaIdx = 0;
  renderPantalla();
  $('preview-modal').classList.remove('hidden'); */
}

function verPreviewMotor() {
  if (!bloques.length) { aviso('Añade al menos un bloque para ver la vista previa.', true); return; }
  const activity = { id: 'preview-' + Date.now(), _preview: true, titulo: ($('m-titulo')?.value || meta.titulo || 'Mi actividad').trim(), descripcion: ($('m-descripcion')?.value || meta.descripcion || '').trim(), categoria: $('m-categoria')?.value || meta.categoria || 'General', edad_recomendada: $('m-edad')?.value || meta.edad || '6-12', dificultad: $('m-dificultad')?.value || meta.dificultad || 'media', contenido: { version: 2, bloques: JSON.parse(JSON.stringify(bloques)) } };
  const previewJson = JSON.stringify(activity);
  sessionStorage.setItem('pj-preview-activity', previewJson);
  localStorage.setItem('pj-preview-activity', previewJson);
  window.open('/preview.html', '_blank', 'noopener');
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

// ── Operaciones matemáticas (suma, resta, multiplicación, división) ─
function opSimbolo(op) { return ({ suma: '+', resta: '−', multiplicacion: '×', division: '÷' })[op] || '+'; }
function operacionDe(s, b) { return (s && s.op) || (b && b.operacion) || 'suma'; }
function calcularResultado(a, b, op) {
  a = Number(a) || 0; b = Number(b) || 0;
  if (op === 'resta') return a - b;
  if (op === 'multiplicacion') return a * b;
  if (op === 'division') return b === 0 ? 0 : a / b;
  return a + b;
}
function verticalOperacionHTML(a, b, op, conLlevadas) {
  const nA = Number(a), nB = Number(b);
  if (isNaN(nA) || isNaN(nB) || nA < 0 || nB < 0 || !Number.isInteger(nA) || !Number.isInteger(nB)) return null;
  const signo = opSimbolo(op);
  const A = String(nA).split(''), B = String(nB).split('');
  const maxLen = Math.max(A.length, B.length);
  const total = maxLen + 1;
  const pad = (arr) => { const out = []; for (let i = 0; i < total - arr.length; i++) out.push(''); return out.concat(arr); };
  const cA = pad(A);
  const cB = pad(B);
  cB[total - 1 - B.length] = signo;
  const cCarry = new Array(total).fill('');
  if (op === 'suma' && conLlevadas) {
    let carry = 0;
    for (let k = 0; k < maxLen; k++) {
      const ia = A.length - 1 - k, ib = B.length - 1 - k;
      const va = ia >= 0 ? Number(A[ia]) : 0, vb = ib >= 0 ? Number(B[ib]) : 0;
      const sum = va + vb + carry;
      carry = Math.floor(sum / 10);
      if (carry > 0 && k + 1 < maxLen) cCarry[total - 2 - k] = String(carry);
    }
  }
  const fila = (cells, cls) => `<div class="kp-vrow ${cls || ''}">${cells.map(c => `<span class="kp-vcell ${cls || ''}">${c === '' ? '' : c}</span>`).join('')}</div>`;
  let html = '<div class="kp-vertical">';
  if (cCarry.some(c => c !== '')) html += fila(cCarry, 'kp-vcarry');
  html += fila(cA, '');
  html += fila(cB, '');
  let line = '<div class="kp-vrow">';
  for (let i = 0; i < total; i++) line += `<span class="kp-vcell ${i === 0 ? 'kp-vblank' : 'kp-vline'}"></span>`;
  line += '</div>';
  html += line + '</div>';
  return html;
}

function verticalDatosEsperados(a, b, op, llevadas) {
  const nA = Number(a) || 0, nB = Number(b) || 0;
  const resultado = Math.abs(calcularResultado(nA, nB, op));
  const A = String(nA).split(''), B = String(nB).split('');
  const maxLen = Math.max(A.length, B.length);
  const resLen = Math.max(maxLen, String(resultado).length);
  const total = resLen + 1;
  const res = new Array(total).fill('');
  const resDig = String(resultado).split('');
  for (let k = 0; k < resDig.length; k++) res[total - 1 - k] = resDig[resDig.length - 1 - k];
  const carries = new Array(total).fill('');
  if (op === 'suma' && llevadas) {
    let carry = 0;
    for (let k = 0; k < resLen; k++) {
      const ia = A.length - 1 - k, ib = B.length - 1 - k;
      const va = ia >= 0 ? Number(A[ia]) : 0, vb = ib >= 0 ? Number(B[ib]) : 0;
      const sum = va + vb + carry;
      carry = Math.floor(sum / 10);
      const col = total - 2 - k;
      if (col >= 1) carries[col] = carry > 0 ? String(carry) : '';
    }
  }
  return { carries, res, total };
}
function verticalOperacionInputHTML(a, b, op, conLlevadas, prefix) {
  const nA = Number(a), nB = Number(b);
  if (isNaN(nA) || isNaN(nB) || nA < 0 || nB < 0 || !Number.isInteger(nA) || !Number.isInteger(nB)) return null;
  if (!Number.isInteger(calcularResultado(nA, nB, op))) return null;
  if (op === 'resta' && nA < nB) return null;
  const signo = opSimbolo(op);
  const datos = verticalDatosEsperados(nA, nB, op, conLlevadas);
  const total = datos.total;
  const A = String(nA).split(''), B = String(nB).split('');
  const pad = (arr) => { const out = []; for (let i = 0; i < total - arr.length; i++) out.push(''); return out.concat(arr); };
  const cA = pad(A);
  const cB = pad(B);
  cB[total - 1 - B.length] = signo;
  const cell = (c) => `<span class="kp-vcell">${c === '' ? '' : c}</span>`;
  const inp = (kind, col) => `<input class="kp-vinput-cell kp-vinput-${kind}" data-kind="${kind}" data-col="${col}" data-prefix="${prefix}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" aria-label="${kind === 'carry' ? 'Llevada' : 'Dígito del resultado'} ${col}" />`;
  let html = `<div class="kp-vertical kp-vertical-input" data-a="${nA}" data-b="${nB}" data-op="${op}" data-llevadas="${conLlevadas ? '1' : '0'}">`;
  if (op === 'suma' && conLlevadas) {
    html += '<div class="kp-vrow">';
    for (let i = 0; i < total; i++) {
      if (i === 0 || i === total - 1) html += '<span class="kp-vcell kp-vblank"></span>';
      else html += inp('carry', i);
    }
    html += '</div>';
  }
  html += `<div class="kp-vrow">${cA.map(cell).join('')}</div>`;
  html += `<div class="kp-vrow">${cB.map(cell).join('')}</div>`;
  html += '<div class="kp-vrow">';
  for (let i = 0; i < total; i++) html += `<span class="kp-vcell ${i === 0 ? 'kp-vblank' : 'kp-vline'}"></span>`;
  html += '</div>';
  html += '<div class="kp-vrow">';
  for (let i = 0; i < total; i++) {
    if (i === 0) html += '<span class="kp-vcell kp-vblank"></span>';
    else html += inp('res', i);
  }
  html += '</div>';
  html += '</div>';
  return html;
}
function verificarVerticales(root) {
  const grids = (root || document).querySelectorAll('.kp-vertical-input');
  let allOk = true;
  grids.forEach(g => {
    const datos = verticalDatosEsperados(Number(g.dataset.a), Number(g.dataset.b), g.dataset.op || 'suma', g.dataset.llevadas === '1');
    g.querySelectorAll('.kp-vinput-cell').forEach(inp => {
      const kind = inp.dataset.kind, col = Number(inp.dataset.col);
      const val = inp.value.trim();
      const expected = kind === 'carry' ? datos.carries[col] : datos.res[col];
      const ok = (expected === '') ? (val === '' || val === '0') : (val === expected);
      inp.classList.toggle('ok', ok);
      inp.classList.toggle('bad', !ok);
      if (!ok) allOk = false;
    });
  });
  return allOk;
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
  else if (s.tipo === 'problema') cuerpo = screenProblema(s, est);
  else if (s.tipo === 'mapa') cuerpo = screenMapa(s, est);
  else if (s.tipo === 'code') cuerpo = screenCodePreview(s, est);
  else if (s.tipo === 'code_explica') cuerpo = screenCodeExplicaPreview(s);
  else if (s.tipo === 'interactivo') cuerpo = screenInteractivo(s, est);
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

function screenInteractivo(s, est) {
  const b = bloques[s.bi], d = b.datos || {}, tipo = b.tipo;
  if (tipo === 'arrastrar') {
    const els = d.elementos || [], zonas = d.zonas || [];
    return `<div class="kp-screen kp-interactive"><div class="kp-qt">🧲 ${esc(b.titulo)}</div><p>${esc(b.instrucciones || '')}</p><div class="kp-interactive-items">${els.map((x,i)=>{const a=String(x).split('|');return `<div class="kp-chip" draggable="true" ondragstart="kpDragItem='${esc(a[1]||a[0])}'">${esc(a[0])} ${esc(a[1])}</div>`}).join('')}</div><div class="kp-drop-zones">${zonas.map(z=>`<button class="kp-zone" ondragover="event.preventDefault()" ondrop="kpDropItem(${s.bi},'${esc(z)}')">${esc(z)}</button>`).join('')}</div>${feedbackInteractivo(est)}</div>`;
  }
  if (tipo === 'buscar') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🔎 ${esc(b.titulo)}</div><p>${esc(b.instrucciones || 'Encuentra los objetos.')}</p><div class="kp-scene">${(d.objetos||[]).map((x,i)=>{const a=String(x).split('|');return `<button class="kp-scene-object ${est.seleccion?.includes(i)?'selected':''}" onclick="kpBuscar(${s.bi},${i})">${esc(a[0])}<small>${esc(a[1])}</small></button>`}).join('')}</div>${feedbackInteractivo(est)}</div>`;
  if (tipo === 'simulacion') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🎲 ${esc(b.titulo)}</div><p>${esc(d.pregunta || b.instrucciones || '')}</p><button class="kp-btn" onclick="kpLanzar(${s.bi})">Lanzar dado</button><div class="kp-results">${(est.lanzamientos||[]).map((n,i)=>`<span>${i+1}: ${n}</span>`).join(' ')}</div></div>`;
  if (tipo === 'memoria') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🧠 ${esc(b.titulo)}</div><p>Memoriza las parejas y encuentra dos iguales.</p><div class="kp-memory">${(d.tarjetas||[]).map((x,i)=>`<button class="kp-memory-card" onclick="kpMemoria(${s.bi},${i})">${est.reveladas?.includes(i)?esc(x):'?'}</button>`).join('')}</div>${feedbackInteractivo(est)}</div>`;
  if (tipo === 'sonido') return `<div class="kp-screen kp-interactive"><div class="kp-qt">👂 ${esc(b.titulo)}</div>${d.audio_url?`<audio controls src="${esc(d.audio_url)}"></audio>`:''}<p>Escucha y elige la respuesta:</p><div class="kp-opts">${(d.opciones||[]).map((x,i)=>`<button class="kp-opt" onclick="kpInteractivo(${pantallaIdx},'${esc(x)}',${i})">${esc(x)}</button>`).join('')}</div>${feedbackInteractivo(est)}</div>`;
  if (tipo === 'codigo_secreto') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🔐 ${esc(b.titulo)}</div>${(d.pistas||[]).map((p,i)=>`<div class="kp-hint">Pista ${i+1}: ${esc(p)}</div>`).join('')}<input id="kp-secret" class="kp-input" placeholder="Contraseña"/><button class="kp-btn" onclick="kpSecreto(${s.bi})">Desbloquear</button>${feedbackInteractivo(est)}</div>`;
  if (tipo === 'escape_room') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🚪 ${esc(b.titulo)}</div>${(d.pruebas||[]).map((p,i)=>`<p>${esc(p.pregunta||'')}</p><div class="kp-opts">${(p.opciones||[]).map((o,k)=>`<button class="kp-opt" onclick="kpEscape(${s.bi},${i},${k})">${esc(o)}</button>`).join('')}</div>`).join('')}${feedbackInteractivo(est)}</div>`;
  if (tipo === 'presupuesto') return `<div class="kp-screen kp-interactive"><div class="kp-qt">🛒 ${esc(b.titulo)}</div><p>Presupuesto: <strong>${Number(d.presupuesto||0).toFixed(2)} Pz</strong></p><div class="kp-shop">${(d.productos||[]).map((x,i)=>{const a=String(x).split('|');return `<button class="kp-chip" onclick="kpComprar(${s.bi},${Number(a[2])||0})">${esc(a[0])} ${esc(a[1])} · ${Number(a[2]||0).toFixed(2)} Pz</button>`}).join('')}</div><p class="kp-msg ok">Gastado: ${(est.gastado||0).toFixed(2)} Pz · Te quedan: ${(Number(d.presupuesto||0)-(est.gastado||0)).toFixed(2)} Pz</p></div>`;
  const opciones = d.opciones || d.piezas || (d.lugares || []).map(x=>String(x).split('|')[0]);
  return `<div class="kp-screen kp-interactive"><div class="kp-qt">${tipo==='detective'?'🕵️':tipo==='laboratorio'?'🧪':tipo==='construccion'?'🏗️':tipo==='exploracion'?'🗺️':'📖'} ${esc(b.titulo)}</div><p>${esc(b.instrucciones || d.pregunta || '')}</p>${(d.pistas||[]).map((p,i)=>`<div class="kp-hint">Pista ${i+1}: ${esc(p)}</div>`).join('')}<div class="kp-opts">${opciones.map((x,i)=>{const a=String(x).split('|');return `<button class="kp-opt" onclick="kpInteractivo(${pantallaIdx},'${esc(a[2]||a[1]||a[0])}',${i})">${esc(a[0])} ${esc(a[1]||'')}</button>`}).join('')}</div>${d.resultado?`<p class="kp-hint">${esc(d.resultado)}</p>`:''}${feedbackInteractivo(est)}</div>`;
}
function feedbackInteractivo(est) { return est.respondida ? `<div class="kp-msg ${est.acierto?'ok':'bad'}">${est.acierto?'¡Muy bien! 🎉':'Prueba otra vez 💪'}</div>` : ''; }
function kpInteractivo(idx, valor, pos) { const s=pantallas[idx], b=bloques[s.bi], d=b.datos||{}, e=kpEstado[idx]; if(e.respondida)return; if(d.solucion){e.seleccion=e.seleccion||[];e.seleccion.push(valor);if(e.seleccion.length<d.solucion.length){renderPantalla();return;}} const good=d.correcta!==undefined ? (pos!==undefined ? Number(pos)===Number(d.correcta) : String(valor).toLowerCase()===String(d.correcta).toLowerCase()) : d.respuesta ? String(valor).toLowerCase()===String(d.respuesta).toLowerCase() : d.respuestas ? Object.values(d.respuestas).includes(valor) : (d.correctas||[]).includes(valor) || (d.solucion||[]).join('|') === (e.seleccion||[]).join('|'); e.respondida=true;e.acierto=good; if(good)kpScore.verdes++;else kpScore.rojos++;renderPantalla(); }
let kpDragItem='';
function kpDropItem(bi,zona){const e=kpEstado[pantallaIdx],d=bloques[bi].datos||{};if(!kpDragItem||e.respondida)return;e.colocadas=e.colocadas||{};e.colocadas[kpDragItem]=zona;const total=(d.elementos||[]).length;if(Object.keys(e.colocadas).length>=total){e.respondida=true;e.acierto=Object.keys(e.colocadas).every(k=>String(d.respuestas?.[k]||'').toLowerCase()===String(e.colocadas[k]).toLowerCase());if(e.acierto)kpScore.verdes++;else kpScore.rojos;}kpDragItem='';renderPantalla();}
function kpBuscar(bi,i){const e=kpEstado[pantallaIdx], d=bloques[bi].datos||{}, x=String((d.objetos||[])[i]||'').split('|');if(!e.seleccion)e.seleccion=[];if(!e.seleccion.includes(i))e.seleccion.push(i);if(e.seleccion.length >= Number(d.objetivo||1)){e.respondida=true;e.acierto=e.seleccion.filter(k=>String((d.objetos||[])[k]||'').split('|')[2]==='1').length>=Number(d.objetivo||1);if(e.acierto)kpScore.verdes++;else kpScore.rojos++;}renderPantalla();}
function kpLanzar(bi){const e=kpEstado[pantallaIdx];e.lanzamientos.push(1+Math.floor(Math.random()*Number(bloques[bi].datos?.caras||6)));renderPantalla();}
function kpComprar(bi,n){const e=kpEstado[pantallaIdx];const max=Number(bloques[bi].datos?.presupuesto||0);if((e.gastado||0)+n<=max)e.gastado=(e.gastado||0)+n;renderPantalla();}
function kpMemoria(bi,i){const e=kpEstado[pantallaIdx], cards=bloques[bi].datos?.tarjetas||[];e.reveladas=e.reveladas||[];if(!e.reveladas.includes(i))e.reveladas.push(i);if(e.reveladas.length>=2){const a=e.reveladas.slice(-2);e.respondida=true;e.acierto=cards[a[0]]===cards[a[1]];if(e.acierto)kpScore.verdes++;else kpScore.rojos++;}renderPantalla();}
function kpSecreto(bi){const e=kpEstado[pantallaIdx], v=document.getElementById('kp-secret')?.value.trim();if(!v)return;e.respondida=true;e.acierto=v.toLowerCase()===String(bloques[bi].datos?.contraseña||'').toLowerCase();if(e.acierto)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}
function kpEscape(bi,pi,oi){const e=kpEstado[pantallaIdx], p=(bloques[bi].datos?.pruebas||[])[pi]||{};e.respondida=true;e.acierto=oi===Number(p.correcta);if(e.acierto)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}

// ── Cálculo mental (vista previa) ─────────────────────────────────────
let calcTimer = null;
function numTile(n) { return `<span class="kp-numtile">${n}</span>`; }
function screenCalculo(s, est) {
  const b = bloques[s.bi];
  const suma = (b.sumas || [])[s.si] || { a: 0, b: 0 };
  const a = Number(suma.a) || 0, bb = Number(suma.b) || 0;
  const op = operacionDe(suma, b);
  const totalSeg = Math.max(1, Number(b.segundos) || 10);
  const gridVertical = s.vertical ? verticalOperacionInputHTML(a, bb, op, s.llevadas !== false, 'c' + pantallaIdx) : null;
  const calcCuerpo = gridVertical || `<div class="kp-calc">${numTile(a)} <span class="kp-calc-op">${opSimbolo(op)}</span> ${numTile(bb)} <span class="kp-calc-op">=</span> <span class="kp-calc-q">?</span></div>`;
  let html = `<div class="kp-screen kp-calc-screen">
    <div class="kp-qt">🧮 Cálculo mental · ${s.si + 1} / ${s.n || 1}</div>
    <div class="kp-calc-timer"><span class="kp-timer" data-timer="${totalSeg}">⏱️ ${totalSeg}s</span>
      <div class="kp-timer-track"><div class="kp-timer-bar" style="width:100%"></div></div></div>
    ${calcCuerpo}`;
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : 'La respuesta era: ' + est.correcta + ' 💪'}</div>`;
  } else if (gridVertical) {
    html += `<div class="kp-input-row">
      <button class="kp-btn" onclick="kpResponderCalculoVertical(${pantallaIdx})">Comprobar</button>
    </div>`;
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
  html += `<div class="kp-hint">${gridVertical ? '✍️ Escribe cada dígito en su casilla y, si hay llevada, escríbela encima.' : '⚡ Responde antes de que acabe el tiempo.'}</div></div>`;
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
function kpResponderCalculoVertical(idx) {
  const est = kpEstado[idx];
  if (!est || est.respondida) return;
  const ok = verificarVerticales(document);
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
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
function screenProblema(s, est) {
  const b = bloques[s.bi];
  const p = (b.problemas || [])[s.pi] || {};
  const enunciado = String(p.enunciado || '').trim();
  const frase = String(p.frase || p.pregunta || '').trim();
  const fraseHtml = frase
    ? `<div class="kp-problema-pregunta">${esc(frase).replace(/___/g, '<span class="kp-hueco">___</span>')}</div>`
    : `<div class="kp-problema-pregunta">¿Cuánto es?</div>`;
  let html = `<div class="kp-screen">
    <div class="kp-qt">📝 Problemas · ${s.pi + 1} / ${s.n || 1}</div>
    <div class="kp-problema-card">
      <div class="kp-problema-texto">${esc(enunciado)}</div>
      ${fraseHtml}
    </div>`;
  const ops = (p.operaciones || []).filter(o => o && (o.a != null || o.b != null));
  if (ops.length) {
    const esEscribir = b.modo !== 'opciones';
    html += `<div class="kp-operaciones"><div class="kp-operaciones-titulo">✏️ Resuelve en vertical</div>`;
    ops.forEach((o, oi) => {
      const v = esEscribir
        ? verticalOperacionInputHTML(o.a, o.b, o.op || 'suma', true, 'p' + pantallaIdx + '-' + oi)
        : verticalOperacionHTML(o.a, o.b, o.op || 'suma', true);
      if (v) html += v;
    });
    html += `</div>`;
  }
  if (est.respondida) {
    html += `<div class="kp-msg ${est.acierto ? 'ok' : 'bad'}">${est.acierto ? '¡Muy bien! 🎉' : 'La respuesta era: ' + est.correcta + ' 💪'}</div>`;
  } else if (b.modo === 'opciones') {
    html += `<div class="kp-opts">${(est.opciones || []).map((o, k) => `
      <div class="kp-opt" onclick="kpResponderProblema(${pantallaIdx},${k})"><span class="kp-letra">${'ABC'[k]}</span>${o}</div>`).join('')}</div>`;
  } else {
    html += `<div class="kp-input-row">
      <input id="kp-problema-input" type="number" inputmode="numeric" placeholder="Tu respuesta"
        onkeydown="if(event.key==='Enter')kpResponderProblema(${pantallaIdx})" />
      <button class="kp-btn" onclick="kpResponderProblema(${pantallaIdx})">Comprobar</button>
    </div>`;
  }
  html += `<div class="kp-hint">📖 Lee con calma, calcula y completa la frase con el resultado.</div></div>`;
  return html;
}
function kpResponderProblema(idx, k) {
  const s = pantallas[idx], est = kpEstado[idx];
  if (!est || est.respondida) return;
  let ok;
  if ((bloques[s.bi] || {}).modo === 'opciones') {
    ok = (est.opciones || [])[k] === est.correcta;
  } else {
    const v = parseFloat(document.getElementById('kp-problema-input')?.value);
    if (isNaN(v)) return;
    const verticalesOk = verificarVerticales(document);
    ok = Math.abs(v - est.correcta) < 0.001 && verticalesOk;
  }
  est.respondida = true; est.acierto = ok;
  if (ok) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

function screenTexto(s, est) {
  const b = bloques[s.bi];
  const parrafos = (b.contenido || '').split(/\n+/).map(t => t.trim()).filter(Boolean);
  let html = `<div class="kp-screen">
    <div class="kp-qt">📖 ${esc(b.titulo || 'Aprende')}</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  html += `<div class="kp-explicacion">`;
  html += formatearTextoPJ(b.contenido || '');
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
          const en = (feat.properties && feat.properties.name) || '';
          lyr.bindTooltip(MAPA_MUNDI.esDe(en), { sticky: true, direction: 'top', opacity: 0.92 });
          lyr.on('click', () => kpMapa(idx, en));
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
    else if (b.tipo === 'problemas') n += (b.problemas || []).filter(p => p.enunciado && p.respuesta !== '' && p.respuesta != null).length;
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
  const es_reto_semanal = !!($('m-reto-semanal')?.checked);
  const fecha_fin_reto = ($('m-fecha-fin-reto')?.value || '').trim();
  const video_url_horizontal = ($('m-video-horizontal')?.value || '').trim();
  const video_url_vertical = ($('m-video-vertical')?.value || '').trim();
  const video_popup_activo = !!($('m-video-activo')?.checked);

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

  meta = { titulo, descripcion, categoria, tipo, edad: edad_recomendada, dificultad, tiempo: tiempo_estimado, titular, dip, eip, entidad, autor, pictograma, precio_licencia, precio_intento, recompensa, subvencionada, destacada, es_reto_semanal, fecha_fin_reto, video_url_horizontal, video_url_vertical, video_popup_activo };
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
    contenido = { version: 2, bloques, ...(pictograma ? { pictograma } : {}), es_reto_semanal, fecha_fin_reto, video_url_horizontal, video_url_vertical, video_popup_activo };
  }

  const body = {
    tipo_titular: titular, dip: dip || null, eip: eip || null, nombre_entidad: entidad || null, nombre_autor: autor || null,
    titulo, descripcion, categoria, tipo: tipoReal,
    edad_recomendada, dificultad, tiempo_estimado,
    num_preguntas,
    num_fases: bloques.length,
    precio_licencia, precio_intento, recompensa, subvencionada, destacada,
    es_reto_semanal, fecha_fin_reto, video_url_horizontal, video_url_vertical, video_popup_activo,
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
  $('sound-close')?.addEventListener('click', () => $('sound-modal').classList.add('hidden'));
  $('unsplash-key')?.setAttribute('value', localStorage.getItem('pj-unsplash-key') || '');
  $('unsplash-key-save')?.addEventListener('click', () => { const v=$('unsplash-key').value.trim(); if(v)localStorage.setItem('pj-unsplash-key',v); $('unsplash-status').textContent='Access Key guardada solo en este navegador.'; if($('img-search').value.trim()) { unsplashBusqueda=''; renderGaleria(); } });
  $('freesound-token')?.setAttribute('value', localStorage.getItem('pj-freesound-token') || '');
  $('freesound-token-save')?.addEventListener('click', () => { const v=$('freesound-token').value.trim(); if(v)localStorage.setItem('pj-freesound-token',v); $('freesound-status').textContent='Token guardado solo en este navegador.'; });
  $('freesound-search')?.addEventListener('click', buscarFreesound);
  $('freesound-query')?.addEventListener('keydown', e => { if(e.key==='Enter')buscarFreesound(); });
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
