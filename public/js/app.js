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

// ── Portada de la actividad: imagen o forma geométrica de color ────
function portadaDe(a) {
  // Si la actividad tiene imagen de portada, la usamos como fondo
  if (a.portada_url) return `background-image:url('${a.portada_url}');`;
  // Si no, un degradado con la forma geométrica oficial
  const colorMap = {
    blue: '#3A00E1', green: '#336E45', orange: '#FF6600',
    red: '#FF3333', purple: '#4E3B70'
  };
  const color = colorMap[categoriaColor(a.categoria)] || '#4E3B70';
  return `background:${color};`;
}

// ═══════════════════════════════════════════════════════════════════
//  ACTIVIDADES DESTACADAS — carrusel con portada
// ═══════════════════════════════════════════════════════════════════
async function cargarDestacadas() {
  const track = document.getElementById('destacadas-track');
  if (!track) return;
  try {
    const data = await apiGet('/actividades?solo_publicas=1');
    const actividades = (data.actividades || []).filter(a => a.destacada);
    const lista = actividades.length > 0 ? actividades : (data.actividades || []).slice(0, 6);

    if (lista.length === 0) {
      track.innerHTML = '';
      return;
    }

    track.innerHTML = lista.map(a => `
      <div class="slide" onclick="abrirActividad('${a.id}')">
        <div class="slide-cover" style="${portadaDe(a)}">
          <span class="badge">${a.es_examen ? '🎓 Examen' : (a.precio_licencia > 0 || a.precio_intento > 0 ? '🟣 Premium' : '🟢 Gratis')}</span>
        </div>
        <div class="slide-body">
          <h3>${escapeHtml(a.titulo)}</h3>
          <p>${escapeHtml(a.descripcion || '')}</p>
          <div class="meta" style="margin-top:8px;">
            <span class="chip ${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
            <span class="chip">⭐ ${escapeHtml(a.dificultad || 'media')}</span>
          </div>
        </div>
      </div>`).join('');
  } catch (e) {
    track.innerHTML = '';
  }
}

// ═══════════════════════════════════════════════════════════════════
//  ACTIVIDADES (grid completo)
// ═══════════════════════════════════════════════════════════════════
async function cargarActividades() {
  const grid = document.getElementById('actividades-grid');
  const banner = document.getElementById('error-banner');
  try {
    const data = await apiGet('/actividades?solo_publicas=1');
    const actividades = data.actividades || [];

    if (actividades.length === 0) {
      grid.innerHTML = '<div class="empty" style="grid-column:1/-1;">Todavía no hay actividades publicadas. ¡Pronto llegarán más! 🚀</div>';
      return;
    }

    grid.innerHTML = actividades.map(a => {
      const esExamen = a.es_examen;
      const esPremium = a.precio_licencia > 0 || a.precio_intento > 0;
      return `
        <div class="card" onclick="abrirActividad('${a.id}')">
          <div class="card-cover">${categoriaIcono(a.categoria)}</div>
          <h3>${escapeHtml(a.titulo)}</h3>
          <p>${escapeHtml(a.descripcion)}</p>
          <div class="meta">
            <span class="chip ${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
            <span class="chip">👧 ${escapeHtml(a.edad_recomendada || '6-12')}</span>
            <span class="chip">⭐ ${escapeHtml(a.dificultad || 'media')}</span>
            <span class="chip">⏱️ ${a.tiempo_estimado || '?'} min</span>
          </div>
          <div class="meta">
            ${esExamen ? '<span class="chip red">🎓 Examen (diploma)</span>' : ''}
            ${esPremium
              ? `<span class="chip orange">🟣 ${a.precio_intento ? a.precio_intento + ' Pz/intento' : ''} ${a.precio_licencia ? a.precio_licencia + ' Pz/licencia' : ''}</span>`
              : '<span class="chip green">🟢 Gratuita</span>'}
            ${a.recompensa ? `<span class="chip blue">🏆 +${a.recompensa} Pz</span>` : ''}
          </div>
          <div class="meta" style="justify-content:space-between;align-items:center;">
            <span style="font-size:12px;color:var(--pj-gray-400);">👤 ${escapeHtml(a.autor_nombre || 'Placeta Junior')}</span>
            <span style="font-size:12px;color:var(--pj-gray-400);">📊 ${a.estadisticas?.veces_realizada || 0} jugadas</span>
          </div>
        </div>`;
    }).join('');
  } catch (e) {
    banner.textContent = 'No se pudieron cargar las actividades. Inténtalo de nuevo en unos instantes.';
    banner.classList.remove('hidden');
    grid.innerHTML = '<div class="empty">—</div>';
  }
}

// Modal de actividad (sin necesidad de cuenta, gratis en la web)
function abrirActividad(id) {
  // En la web pública las actividades son de acceso gratuito (Fondo Público de Acceso)
  alert(`🎓 Actividad ${id}\n\nEn la web pública las actividades premium seleccionadas son de acceso gratuito gracias al Fondo Público de Acceso de Placeta Junior.\n\n(El reproductor interactivo estará disponible próximamente en la web. Puedes jugarla en la app Placeta Junior.)`);
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  cargarDestacadas();
  cargarActividades();
});
