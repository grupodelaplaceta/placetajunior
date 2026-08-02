/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR STUDIO — Editor drag & drop estilo Canva
   Crea actividades con bloques de ejercicios (test, sopa de letras,
   relacionar, ordenar, completar) compatibles en web y app.
   · Imágenes de stock con cita de fuente bajo la imagen.
   · Publica en POST /api/junior/actividades (requiere acuerdo 18+).
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://admin-placeta.vercel.app/api/junior';

const TIPOS = {
  test:        { ico: '📝', nombre: 'Test' },
  sopa_letras: { ico: '🔤', nombre: 'Sopa de letras' },
  relacionar:  { ico: '🔗', nombre: 'Relacionar' },
  ordenar:     { ico: '📌', nombre: 'Ordenar' },
  completar:   { ico: '✏️', nombre: 'Completar' }
};

// Banco de imágenes de stock (fotografías libres) con su fuente
const STOCK = [
  { url: 'https://picsum.photos/id/237/640/420', fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/1025/640/420', fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/1043/640/420', fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/1060/640/420', fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/1084/640/420', fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/110/640/420',  fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/119/640/420',  fuente: 'Foto: Unsplash (vía picsum.photos)' },
  { url: 'https://picsum.photos/id/870/640/420',  fuente: 'Foto: Unsplash (vía picsum.photos)' }
];

let bloques = [];
let meta = { titulo: '', descripcion: '', categoria: 'Matemáticas', tipo: 'test', edad: '6-12', dificultad: 'media', tiempo: 10, dip: '' };
let imgTarget = null; // dónde se aplicará la imagen del modal

function $(id) { return document.getElementById(id); }
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// ── Estado ───────────────────────────────────────────────────────────
function nuevoBloque(tipo) {
  const b = { tipo, titulo: TIPOS[tipo].nombre, imagen_url: null, fuente: null };
  if (tipo === 'test') b.preguntas = [{ pregunta: '', opciones: ['', '', '', ''], correcta: 0, imagen_url: null, fuente: null }];
  if (tipo === 'sopa_letras') { b.palabras = ['', '']; b.pistas = ['', '']; b.tamano = 10; }
  if (tipo === 'relacionar') b.pares = [{ izq: '', der: '' }];
  if (tipo === 'ordenar') b.items = ['', '', ''];
  if (tipo === 'completar') b.frases = [{ texto: '', respuesta: '' }];
  return b;
}

function guardar() {
  try { localStorage.setItem('pj-studio', JSON.stringify({ bloques, meta })); } catch (e) {}
}
function cargar() {
  try {
    const d = JSON.parse(localStorage.getItem('pj-studio') || 'null');
    if (d) { bloques = d.bloques || []; meta = Object.assign(meta, d.meta || {}); }
  } catch (e) {}
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
  else if (b.tipo === 'sopa_letras') cuerpo = renderSopa(b, i);
  else if (b.tipo === 'relacionar') cuerpo = renderRelacionar(b, i);
  else if (b.tipo === 'ordenar') cuerpo = renderOrdenar(b, i);
  else if (b.tipo === 'completar') cuerpo = renderCompletar(b, i);

  return `
  <div class="block" id="bloque-${i}">
    <div class="block-header">
      <span class="b-ico">${TIPOS[b.tipo].ico}</span>
      <span class="b-name">${esc(b.titulo || TIPOS[b.tipo].nombre)}</span>
      <div class="b-tools">
        <button class="b-btn up"   onclick="moverBloque(${i},-1)" title="Subir">↑</button>
        <button class="b-btn down" onclick="moverBloque(${i}, 1)" title="Bajar">↓</button>
        <button class="b-btn del"  onclick="borrarBloque(${i})" title="Eliminar">🗑️</button>
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
    ? `<div class="img-preview"><img src="${esc(b.imagen_url)}"><div class="img-fuente">📸 ${esc(b.fuente || 'Fuente sin indicar')}</div>
       <button class="img-remove" onclick="quitarImagenBloque(${i})">✕</button></div>`
    : '';
  return `
    <label>Imagen del bloque (opcional)</label>
    <div class="img-pick">
      <button class="b-btn" type="button" onclick="abrirImagen('bloque',${i})">🖼️ Imagen de stock</button>
    </div>
    ${prev}`;
}

// ── Test ─────────────────────────────────────────────────────────────
function renderTest(b, i) {
  return b.preguntas.map((p, j) => `
    <div class="q-item ${p.correcta >= 0 && p.opciones[p.correcta] ? '' : ''}" id="q-${i}-${j}">
      <div class="q-head">
        <span class="q-num">Pregunta ${j + 1}</span>
        <div class="q-tools">
          <button class="b-btn" type="button" onclick="imagenPregunta(${i},${j})">🖼️ Imagen</button>
          <button class="b-btn del" type="button" onclick="borrarPregunta(${i},${j})">🗑️</button>
        </div>
      </div>
      <input placeholder="Escribe la pregunta" value="${esc(p.pregunta)}" oninput="setPregunta(${i},${j},'pregunta',this.value)" />
      ${p.imagen_url ? `
        <div class="img-preview">
          <img src="${esc(p.imagen_url)}">
          <div class="img-fuente">📸 ${esc(p.fuente || 'Fuente sin indicar')}</div>
          <button class="img-remove" onclick="quitarImagenPregunta(${i},${j})">✕</button>
        </div>` : ''}
      ${p.opciones.map((op, k) => `
        <div class="opt ${k === p.correcta ? 'correct' : ''}">
          <button class="b-btn" type="button" title="Marcar como correcta"
            onclick="marcarCorrecta(${i},${j},${k})">${k === p.correcta ? '✅' : '○'}</button>
          <input placeholder="Opción ${k + 1}" value="${esc(op)}" oninput="setPregunta(${i},${j},'opciones',this.value,${k})" />
          ${p.opciones.length > 2 ? `<button class="b-btn del" type="button" onclick="borrarOpcion(${i},${j},${k})">✕</button>` : ''}
        </div>`).join('')}
      <button class="b-btn" type="button" style="margin-top:8px;" onclick="anadirOpcion(${i},${j})">➕ Opción</button>
    </div>`).join('') +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirPregunta(${i})">➕ Añadir pregunta</button>`;
}

// ── Sopa de letras ───────────────────────────────────────────────────
function renderSopa(b, i) {
  const filas = b.palabras.map((p, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Palabra ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'palabras',${j})">🗑️</button></div>
      </div>
      <input placeholder="Palabra" value="${esc(p)}" oninput="setItem(${i},'palabras',${j},this.value)" />
      <input placeholder="Pista (opcional)" value="${esc(b.pistas[j] || '')}" style="margin-top:6px;" oninput="setItem(${i},'pistas',${j},this.value)" />
    </div>`).join('');
  return `<div class="row2">
      <div><label>Tamaño del cuadro</label><input type="number" min="8" max="16" value="${b.tamano}" oninput="setCampo(${i},'tamano',this.value)" /></div>
    </div>${filas}
    <button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'palabras','pistas')">➕ Añadir palabra</button>`;
}

// ── Relacionar ───────────────────────────────────────────────────────
function renderRelacionar(b, i) {
  const filas = b.pares.map((p, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Pareja ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'pares',${j})">🗑️</button></div>
      </div>
      <div class="row2">
        <input placeholder="Izquierda (ej: Sol)" value="${esc(p.izq)}" oninput="setPareja(${i},${j},'izq',this.value)" />
        <input placeholder="Derecha (ej: Estrella)" value="${esc(p.der)}" oninput="setPareja(${i},${j},'der',this.value)" />
      </div>
    </div>`).join('');
  return filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'pares')">➕ Añadir pareja</button>`;
}

// ── Ordenar ──────────────────────────────────────────────────────────
function renderOrdenar(b, i) {
  const filas = b.items.map((it, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Paso ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'items',${j})">🗑️</button></div>
      </div>
      <input placeholder="Elemento en orden correcto" value="${esc(it)}" oninput="setItem(${i},'items',${j},this.value)" />
    </div>`).join('');
  return filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'items')">➕ Añadir paso</button>`;
}

// ── Completar ────────────────────────────────────────────────────────
function renderCompletar(b, i) {
  const filas = b.frases.map((f, j) => `
    <div class="q-item">
      <div class="q-head"><span class="q-num">Frase ${j + 1}</span>
        <div class="q-tools"><button class="b-btn del" onclick="borrarItem(${i},'frases',${j})">🗑️</button></div>
      </div>
      <input placeholder="Frase con hueco (usa ___)" value="${esc(f.texto)}" oninput="setFrase(${i},${j},'texto',this.value)" />
      <input placeholder="Respuesta que rellena el hueco" value="${esc(f.respuesta)}" style="margin-top:6px;" oninput="setFrase(${i},${j},'respuesta',this.value)" />
    </div>`).join('');
  return filas +
    `<button class="btn btn-outline" type="button" style="margin-top:12px;" onclick="anadirItem(${i},'frases')">➕ Añadir frase</button>`;
}

// ── Mutaciones (globales para los onclick) ───────────────────────────
function setCampo(i, ruta, valor) { bloques[i][ruta] = valor; }
function setItem(i, campo, idx, valor) { bloques[i][campo][idx] = valor; }
function setPareja(i, idx, lado, valor) { bloques[i].pares[idx][lado] = valor; }
function setFrase(i, idx, campo, valor) { bloques[i].frases[idx][campo] = valor; }
function setPregunta(i, j, campo, valor, k) {
  if (campo === 'opciones') bloques[i].preguntas[j].opciones[k] = valor;
  else bloques[i].preguntas[j][campo] = valor;
}
function anadirPregunta(i) {
  bloques[i].preguntas.push({ pregunta: '', opciones: ['', '', '', ''], correcta: 0, imagen_url: null, fuente: null });
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
  if (campo === 'pares') bloques[i].pares.push({ izq: '', der: '' });
  else if (campo === 'frases') bloques[i].frases.push({ texto: '', respuesta: '' });
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
  $('stock-thumbs').innerHTML = STOCK.map((s, k) =>
    `<div class="img-thumb" style="background-image:url('${s.url}')" onclick="elegirStock(${k})"></div>`
  ).join('');
  $('img-modal').classList.remove('hidden');
}
function imagenPregunta(i, j) { abrirImagen('pregunta', i, j); }
function elegirStock(k) {
  $('img-url').value = STOCK[k].url;
  $('img-fuente').value = STOCK[k].fuente;
  document.querySelectorAll('#stock-thumbs .img-thumb').forEach((t, idx) => t.classList.toggle('active', idx === k));
}
function aplicarImagen() {
  const url = $('img-url').value.trim();
  const fuente = $('img-fuente').value.trim() || 'Fuente sin indicar';
  if (!url) { alert('Elige o pega una URL de imagen.'); return; }
  const t = imgTarget;
  if (t.donde === 'bloque') { bloques[t.i].imagen_url = url; bloques[t.i].fuente = fuente; }
  else if (t.donde === 'pregunta') {
    bloques[t.i].preguntas[t.j].imagen_url = url;
    bloques[t.i].preguntas[t.j].fuente = fuente;
  }
  $('img-modal').classList.add('hidden');
  render();
}
function quitarImagenBloque(i) { bloques[i].imagen_url = null; bloques[i].fuente = null; render(); }
function quitarImagenPregunta(i, j) { bloques[i].preguntas[j].imagen_url = null; bloques[i].preguntas[j].fuente = null; render(); }

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
  $('m-categoria').value = meta.categoria;
  $('m-tipo').value = meta.tipo;
  $('m-edad').value = meta.edad;
  $('m-dificultad').value = meta.dificultad;
  $('m-tiempo').value = meta.tiempo;
  $('m-titular').value = meta.titular || 'interno';
  actualizarIdentidad();
  if (meta.eip) $('m-eip').value = meta.eip;
  if (meta.entidad) $('m-entidad').value = meta.entidad;
  if (meta.dip) $('m-dip').value = meta.dip;
  $('meta-modal').classList.remove('hidden');
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
      <label>Tu DIP * (mayor de 18, con acuerdo firmado)</label>
      <input id="m-dip" type="text" placeholder="Tu DIP" />`;
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
  }
  return n;
}

async function publicar() {
  const titulo = $('m-titulo').value.trim();
  const descripcion = $('m-descripcion').value.trim();
  const categoria = $('m-categoria').value;
  const tipo = $('m-tipo').value;
  const edad_recomendada = $('m-edad').value.trim();
  const dificultad = $('m-dificultad').value;
  const tiempo_estimado = parseInt($('m-tiempo').value, 10) || 10;
  const titular = $('m-titular').value;

  let dip = '';
  let eip = '';
  let entidad = '';
  if (titular === 'profesor') dip = ($('m-dip')?.value || '').trim();
  else if (titular === 'entidad_eip') {
    eip = ($('m-eip')?.value || '').trim();
    entidad = ($('m-entidad')?.value || '').trim();
  }

  if (bloques.length === 0) { aviso('Añade al menos un bloque al lienzo.', true); $('meta-modal').classList.add('hidden'); return; }
  if (!titulo || !descripcion) { aviso('Completa título y descripción.', true); return; }
  if (titular === 'profesor' && !dip) { aviso('Indica tu DIP (profesor colaborador).', true); return; }
  if (titular === 'entidad_eip' && !eip) { aviso('Indica el código EIP de la entidad.', true); return; }
  const num_preguntas = contarPreguntas();
  if (num_preguntas === 0) { aviso('Añade contenido real en los bloques (preguntas, palabras, parejas…).', true); return; }

  meta = { titulo, descripcion, categoria, tipo, edad: edad_recomendada, dificultad, tiempo: tiempo_estimado, titular, dip, eip, entidad };
  guardar();

  const body = {
    tipo_titular: titular, dip: dip || null, eip: eip || null, nombre_entidad: entidad || null,
    titulo, descripcion, categoria, tipo,
    edad_recomendada, dificultad, tiempo_estimado,
    num_preguntas,
    num_fases: bloques.length,
    contenido: { version: 2, bloques }
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

  $('btn-guardar').addEventListener('click', () => { guardar(); aviso('💾 Borrador guardado en este navegador.', false); });
  $('btn-publicar').addEventListener('click', abrirMeta);

  $('img-ok').addEventListener('click', aplicarImagen);
  $('img-cancel').addEventListener('click', () => $('img-modal').classList.add('hidden'));
  $('meta-ok').addEventListener('click', publicar);
  $('meta-cancel').addEventListener('click', () => $('meta-modal').classList.add('hidden'));
  $('m-titular').addEventListener('change', actualizarIdentidad);

  // Cerrar modales con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('img-modal').classList.add('hidden');
      $('meta-modal').classList.add('hidden');
    }
  });
});
