/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Web pública (junior.laplaceta.org)
   Consume la API oficial de admin-placeta (RSP) /api/junior/...
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://admin-placeta.vercel.app/api/junior';

// ── Helpers ──────────────────────────────────────────────────────────
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// Colores por categoría (identidad PJ)
const categoriaColor = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return 'blue';
  if (c.includes('leng') || c.includes('lect')) return 'green';
  if (c.includes('cien') || c.includes('medio')) return 'orange';
  if (c.includes('geo')) return 'red';
  if (c.includes('tecn') || c.includes('inform')) return 'purple';
  return 'purple';
};

const categoriaIcono = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return '🔢';
  if (c.includes('leng') || c.includes('lect')) return '📖';
  if (c.includes('cien')) return '🔬';
  if (c.includes('geo')) return '🌍';
  if (c.includes('tecn') || c.includes('inform')) return '💻';
  if (c.includes('logic')) return '🧠';
  return '🧩';
};

// ── Portada de la actividad ─────────────────────────────────────────
function portadaDe(a) {
  if (a.portada_url) return `background-image:url('${a.portada_url}');`;
  return `background:var(--pj-${categoriaColor(a.categoria)}-light);`;
}

function cardActividad(a) {
  const esPremium = a.precio_licencia > 0 || a.precio_intento > 0;
  const badge = a.es_examen
    ? '<span class="badge-tag badge-examen">🎓 Examen</span>'
    : (esPremium ? '<span class="badge-tag badge-premium">💳 Premium</span>' : '<span class="badge-tag badge-free">🎁 Gratis</span>');
  return `
    <div class="card" onclick="abrirActividad('${a.id}')">
      <div class="card-cover" style="${portadaDe(a)}">
        <span style="font-size:44px;">${categoriaIcono(a.categoria)}</span>
        ${badge}
      </div>
      <h3>${escapeHtml(a.titulo)}</h3>
      <p>${escapeHtml(a.descripcion || '')}</p>
      <div class="meta">
        <span class="chip ${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
        <span class="chip">👧 ${escapeHtml(a.edad_recomendada || '6-12')}</span>
        <span class="chip">⭐ ${escapeHtml(a.dificultad || 'media')}</span>
        <span class="chip">⏱️ ${a.tiempo_estimado || '?'} min</span>
      </div>
      <div class="meta">
        ${esPremium
          ? `<span class="chip orange">🟣 ${a.precio_intento ? a.precio_intento + ' Pz/intento' : ''} ${a.precio_licencia ? a.precio_licencia + ' Pz/licencia' : ''}</span>`
          : '<span class="chip green">🟢 Gratuita (Fondo Público)</span>'}
        ${a.recompensa ? `<span class="chip blue">🏆 +${a.recompensa} Pz</span>` : ''}
        <span class="chip yellow">📊 ${a.estadisticas?.veces_realizada || 0} jugadas</span>
      </div>
    </div>`;
}

let TODAS = []; // todas las actividades públicas

// ═══════════════════════════════════════════════════════════════════
//  CARGA + PESTAÑAS
// ═══════════════════════════════════════════════════════════════════
async function cargarTodo() {
  const banner = document.getElementById('error-banner');
  try {
    const data = await apiGet('/actividades?solo_publicas=1');
    TODAS = data.actividades || [];
  } catch (e) {
    banner.textContent = 'No se pudieron cargar las actividades. Inténtalo de nuevo en unos instantes.';
    banner.classList.remove('hidden');
  }
  renderPopulares();
  renderCategorias();
  renderSubvencionadas();
  renderPago();
}

// ⭐ Populares: las más jugadas
function renderPopulares() {
  const grid = document.getElementById('populares-grid');
  const ordenadas = [...TODAS].sort((a, b) =>
    (b.estadisticas?.veces_realizada || 0) - (a.estadisticas?.veces_realizada || 0)
  ).slice(0, 8);
  grid.innerHTML = ordenadas.length
    ? ordenadas.map(cardActividad).join('')
    : '<div class="empty" style="grid-column:1/-1;">Todavía no hay actividades publicadas. ¡Pronto llegarán! 🚀</div>';
}

// 🗂️ Por categorías
function renderCategorias() {
  const chipsCont = document.getElementById('categorias-chips');
  const grid = document.getElementById('categorias-grid');
  const cats = [...new Set(TODAS.map(a => a.categoria).filter(Boolean))];
  if (cats.length === 0) {
    chipsCont.innerHTML = '';
    grid.innerHTML = '<div class="empty">Sin actividades todavía.</div>';
    return;
  }
  chipsCont.innerHTML = [
    '<button class="chip-cat active" data-cat="*">🌟 Todas</button>',
    ...cats.map(c => `<button class="chip-cat" data-cat="${escapeHtml(c)}">${escapeHtml(c)}</button>`)
  ].join('');
  const pintar = (cat) => {
    const lista = cat === '*' ? TODAS : TODAS.filter(a => a.categoria === cat);
    grid.innerHTML = lista.length
      ? lista.map(cardActividad).join('')
      : '<div class="empty" style="grid-column:1/-1;">Nada por aquí aún.</div>';
  };
  chipsCont.querySelectorAll('.chip-cat').forEach(btn => {
    btn.onclick = () => {
      chipsCont.querySelectorAll('.chip-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      pintar(btn.dataset.cat);
    };
  });
  pintar('*');
}

// 🎁 Subvencionadas (gratis)
function renderSubvencionadas() {
  const grid = document.getElementById('subvencionadas-grid');
  const lista = TODAS.filter(a => !(a.precio_licencia > 0 || a.precio_intento > 0));
  grid.innerHTML = lista.length
    ? lista.map(cardActividad).join('')
    : '<div class="empty" style="grid-column:1/-1;">Pronto habrá actividades gratuitas 🎁</div>';
}

// 💳 De pago
function renderPago() {
  const grid = document.getElementById('pago-grid');
  const lista = TODAS.filter(a => a.precio_licencia > 0 || a.precio_intento > 0);
  grid.innerHTML = lista.length
    ? lista.map(cardActividad).join('')
    : '<div class="empty" style="grid-column:1/-1;">Todavía no hay actividades de pago.</div>';
}

// ── Pestañas ─────────────────────────────────────────────────────────
function initTabs() {
  const tabs = document.getElementById('tabs');
  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab');
    if (!btn) return;
    tabs.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
}

// Modal de actividad (sin necesidad de cuenta, gratis en la web)
function abrirActividad(id) {
  alert(`🎓 Actividad ${id}\n\nEn la web pública las actividades premium seleccionadas son de acceso gratuito gracias al Fondo Público de Acceso de Placeta Junior.\n\n(El reproductor interactivo estará disponible próximamente en la web. Puedes jugarla en la app Placeta Junior.)`);
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  cargarTodo();
});
