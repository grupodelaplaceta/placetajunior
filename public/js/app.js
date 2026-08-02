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

// ── Portada de la actividad (carátula generada automáticamente) ────
function coverHTML(a) {
  const bloqueada = esBloqueada(a);
  const badge = a.es_examen
    ? '<span class="badge-tag badge-examen">🎓 Examen</span>'
    : (bloqueada
        ? '<span class="badge-tag badge-premium">💳 De pago</span>'
        : (esPago(a)
            ? '<span class="badge-tag badge-premium">🎁 Subvencionada</span>'
            : '<span class="badge-tag badge-free">🎁 Gratis</span>'));
  const lock = bloqueada
    ? '<div class="cover-lock"><span class="lock-ico">🔒</span><span class="lock-txt">De pago</span></div>'
    : '';
  // Si hay portada real la usamos; si no, se genera una imagen (miniaturas reales con canvas)
  const estilo = a.portada_url
    ? `style="background-image:url('${a.portada_url}');background-size:cover;background-position:center;"`
    : `data-gen="1" data-cat="${escapeHtml(a.categoria || '')}"`;
  return `
    <div class="card-cover" ${estilo}>
      ${badge}
      ${lock}
    </div>`;
}

// ── Miniaturas reales: genera una imagen PNG con canvas ─────────────
function coloresCaratula(color) {
  const map = {
    blue: ['#3A00E1', '#6a4bff'], green: ['#336E45', '#5aa06f'],
    orange: ['#FF6600', '#ff9a3d'], red: ['#FF3333', '#ff7a5c'],
    purple: ['#4E3B70', '#7a63a8'], yellow: ['#D6CE52', '#efe78a']
  };
  return map[color] || map.purple;
}
function dibujarForma(ctx, x, y, s) {
  ctx.save(); ctx.globalAlpha = 0.18; ctx.translate(x, y); ctx.rotate(-0.22);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0.5 * s, 0); ctx.lineTo(0.96 * s, 0.28 * s); ctx.lineTo(0.92 * s, 0.78 * s);
  ctx.lineTo(0.4 * s, s); ctx.lineTo(0.04 * s, 0.72 * s); ctx.lineTo(0.08 * s, 0.22 * s);
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function generarCaratula(a) {
  return new Promise((resolve) => {
    try {
      const W = 520, H = 380;
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      const [c1, c2] = coloresCaratula(categoriaColor(a.cat));
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      dibujarForma(ctx, W * 0.86, H * 0.10, 92);
      dibujarForma(ctx, W * 0.07, H * 0.88, 60);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '130px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
      ctx.fillText(categoriaIcono(a.cat), W / 2, H / 2 - 38);
      ctx.font = '800 34px "Plus Jakarta Sans","Arial",sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      const t = (a.tit || '').toUpperCase();
      ctx.fillText(t.length > 24 ? t.slice(0, 23) + '…' : t, W / 2, H - 46);
      resolve(cv.toDataURL('image/png'));
    } catch (e) { resolve(''); }
  });
}
function generarCaratulasEn(cont) {
  if (!cont) return;
  cont.querySelectorAll('.card-cover[data-gen="1"]').forEach((el) => {
    const card = el.closest('.card');
    const tit = (card?.querySelector('h3')?.textContent || '').trim();
    const cat = el.dataset.cat || '';
    generarCaratula({ cat, tit }).then((url) => {
      if (url) { el.style.backgroundImage = `url('${url}')`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
    });
  });
}

function cardActividad(a) {
  const bloqueada = esBloqueada(a);
  return `
    <div class="card" onclick="abrirActividad('${a.id}', ${bloqueada})">
      ${coverHTML(a)}
      <h3>${escapeHtml(a.titulo)}</h3>
      <p>${escapeHtml(a.descripcion || '')}</p>
      <div class="meta">
        <span class="chip ${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
        <span class="chip">👧 ${escapeHtml(a.edad_recomendada || '6-12')}</span>
        <span class="chip">⭐ ${escapeHtml(a.dificultad || 'media')}</span>
        <span class="chip">⏱️ ${a.tiempo_estimado || '?'} min</span>
      </div>
      <div class="meta">
        ${a.recompensa ? `<span class="chip blue">🏆 +${a.recompensa} Pz</span>` : ''}
        <span class="chip yellow">📊 ${a.estadisticas?.veces_realizada || 0} jugadas</span>
      </div>
    </div>`;
}

let TODAS = []; // todas las actividades públicas

function esPago(a) { return (a.precio_licencia > 0 || a.precio_intento > 0); }
function esBloqueada(a) { return esPago(a) && !a.subvencionada; }

// ═══════════════════════════════════════════════════════════════════
//  CARGA + FILAS POR CATEGORÍA
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
}

// ⭐ Populares: las más jugadas (fila horizontal)
function renderPopulares() {
  const row = document.getElementById('populares-row');
  const ordenadas = [...TODAS].sort((a, b) =>
    (b.estadisticas?.veces_realizada || 0) - (a.estadisticas?.veces_realizada || 0)
  ).slice(0, 10);
  row.innerHTML = ordenadas.length
    ? ordenadas.map(cardActividad).join('')
    : '<div class="empty">Todavía no hay actividades publicadas. ¡Pronto llegarán! 🚀</div>';
  generarCaratulasEn(row);
}

// 🗂️ Una fila horizontal por categoría (gratis y de pago mezcladas)
function renderCategorias() {
  const cont = document.getElementById('categorias');
  const cats = [...new Set(TODAS.map(a => a.categoria).filter(Boolean))];
  if (cats.length === 0) {
    cont.innerHTML = '';
    return;
  }
  cont.innerHTML = cats.map(cat => {
    const lista = TODAS.filter(a => a.categoria === cat);
    if (lista.length === 0) return '';
    return `
      <div class="cat-section">
        <h3 class="cat-title"><span class="t-ico">${categoriaIcono(cat)}</span> ${escapeHtml(cat)}</h3>
        <div class="h-row">${lista.map(cardActividad).join('')}</div>
      </div>`;
  }).join('');
  cont.querySelectorAll('.cat-section .h-row').forEach(sec => generarCaratulasEn(sec));
}

// Modal de actividad
function abrirActividad(id, bloqueada) {
  if (bloqueada) {
    alert(`🔒 Actividad ${id}\n\nEsta actividad es de pago (no subvencionada).\nPuedes adquirirla en la app Placeta Junior y pagarla con Placetas (su precio incluye IVA).`);
    return;
  }
  alert(`🎓 Actividad ${id}\n\nEn la web pública las actividades son de acceso gratuito gracias al Fondo Público de Acceso de Placeta Junior.\n\n(El reproductor interactivo estará disponible próximamente en la web. Puedes jugarla en la app Placeta Junior.)`);
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  cargarTodo();
});
