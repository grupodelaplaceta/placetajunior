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

// ═══════════════════════════════════════════════════════════════════
//  RETO DE CANDELA
// ═══════════════════════════════════════════════════════════════════
async function cargarReto() {
  const cont = document.getElementById('reto-container');
  try {
    const data = await apiGet('/retos');
    const reto = data.reto_activo;
    if (!reto) {
      cont.innerHTML = '<div class="empty">No hay reto activo esta semana. ¡Vuelve pronto! 🌟</div>';
      return;
    }
    const juegos = (reto.juegos || []).map(j =>
      `<span class="chip purple">${j.titulo}</span>`
    ).join('');

    cont.innerHTML = `
      <div class="reto-card">
        <div class="reto-icon">${escapeHtml(reto.icono || '🌟')}</div>
        <div style="flex:1;min-width:240px;">
          <h3>${escapeHtml(reto.titulo)}</h3>
          <p>${escapeHtml(reto.descripcion)}</p>
          <div class="meta">
            <span class="chip" style="background:rgba(255,255,255,0.25);color:white;">Semana ${reto.semana}</span>
            <span class="chip" style="background:rgba(255,255,255,0.25);color:white;">📅 ${reto.fechaInicio} → ${reto.fechaFin}</span>
            <span class="chip" style="background:rgba(255,255,255,0.25);color:white;">🆓 Gratuito</span>
            <span class="chip" style="background:rgba(255,255,255,0.25);color:white;">🏆 Con diploma</span>
          </div>
          <div style="margin-top:10px;">${juegos}</div>
          <a class="btn" href="/studio" style="margin-top:14px;display:inline-flex;">🎮 Jugar el reto</a>
        </div>
      </div>`;
  } catch (e) {
    cont.innerHTML = '<div class="empty">No se pudo cargar el reto de la semana.</div>';
  }
}

// ═══════════════════════════════════════════════════════════════════
//  ACTIVIDADES
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
//  TABLA DE PRECIOS (con IVA incluido)
// ═══════════════════════════════════════════════════════════════════
async function cargarPrecios() {
  const cont = document.getElementById('precios-table');
  try {
    const data = await apiGet('/academy/precios');
    const tabla = data.tabla_precios || [];
    const filas = tabla.map(t => `
      <tr>
        <td><strong>${escapeHtml(t.complejidad)}</strong></td>
        <td>${escapeHtml(t.preguntas)}</td>
        <td>${escapeHtml(t.fases)}</td>
        <td>${t.precio_licencia} Pz</td>
        <td>${t.precio_intento} Pz</td>
        <td>🏆 ${t.recompensa} Pz</td>
      </tr>`).join('');

    cont.innerHTML = `
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Complejidad</th>
              <th>Preguntas</th>
              <th>Fases</th>
              <th>Precio licencia</th>
              <th>Precio intento</th>
              <th>Recompensa</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>
      <div class="iva-note">
        💡 <strong>Todos los precios incluyen IVA (${data.iva_porcentaje || 12}%)</strong>.
        El IVA lo abona Capitalia (Placeta Junior) a Tributos. El precio mostrado es el total.
      </div>
      <div style="margin-top:14px;">
        <strong>🟢 Canje de Puntos Verdes → Placetas:</strong>
        ${(data.canje_puntos_verdes || []).map(c =>
          `<span class="chip green" style="margin:2px;">${c.puntos_verdes} PV = ${c.placetas} Pz</span>`
        ).join('')}
      </div>`;
  } catch (e) {
    cont.innerHTML = '<div class="empty">No se pudo cargar la tabla de precios.</div>';
  }
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  cargarReto();
  cargarActividades();
  cargarPrecios();
});
