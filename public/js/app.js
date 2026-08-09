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
  if (c.includes('leng') || c.includes('lect')) return 'red';
  if (c.includes('natur') || c.includes('cien') || c.includes('bio')) return 'green';
  if (c.includes('geo') || c.includes('hist') || c.includes('social')) return 'orange';
  if (c.includes('arte') || c.includes('mús') || c.includes('mus')) return 'purple';
  return 'purple';
};

// Iconos Material Symbols por categoría (identidad PJ)
const categoriaIcono = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('mate')) return 'calculate';
  if (c.includes('leng') || c.includes('lect')) return 'menu_book';
  if (c.includes('cien') || c.includes('medio')) return 'science';
  if (c.includes('geo')) return 'public';
  if (c.includes('tecn') || c.includes('inform')) return 'computer';
  if (c.includes('logic')) return 'psychology';
  return 'extension';
};

// Color sólido de marca para el icono (según la categoría)
const colorMaterial = (cat = '') => {
  const map = {
    blue: '#3A00E1', green: '#336E45', orange: '#FF6600',
    red: '#FF3333', purple: '#4E3B70', yellow: '#D6CE52'
  };
  return map[categoriaColor(cat)] || map.purple;
};

// ── Portada de la actividad (carátula generada automáticamente) ────
function coverHTML(a) {
  const bloqueada = esBloqueada(a);
  const badge = a.es_examen
    ? '<span class="badge-tag badge-examen"><span class="material-symbols-rounded b-ico">school</span>Examen</span>'
    : (bloqueada
        ? '<span class="badge-tag badge-premium"><span class="material-symbols-rounded b-ico">credit_card</span>De pago</span>'
        : (esPago(a)
            ? '<span class="badge-tag badge-premium"><span class="material-symbols-rounded b-ico">redeem</span>Subvencionada</span>'
            : '<span class="badge-tag badge-free"><span class="material-symbols-rounded b-ico">check_circle</span>Gratis</span>'));
  const lock = bloqueada
    ? '<div class="cover-lock"><span class="material-symbols-rounded lock-ico">lock</span><span class="lock-txt">De pago</span></div>'
    : '';
  // Si hay portada real la usamos; si no, se genera una imagen (miniaturas reales con canvas)
  const estilo = a.portada_url
    ? `style="background-image:url('${a.portada_url}');background-size:cover;background-position:center;"`
    : `data-gen="1" data-cat="${escapeHtml(a.categoria || '')}" data-tipo="${escapeHtml(a.tipo || '')}"`;
  const icono = iconoMaterial(a);
  return `
    <div class="card-cover" ${estilo}>
      ${!a.portada_url && icono ? `<span class="cover-emoji material-symbols-rounded" style="color:${colorMaterial(a.categoria)}">${icono}</span>` : ''}
      ${badge}
      ${lock}
      ${!bloqueada ? '<button class="cover-play" onclick="event.stopPropagation();abrirActividad(\'' + a.id + '\', false)" title="Jugar"><span class="material-symbols-rounded">play_arrow</span> Jugar</button>' : ''}
      <button class="info-btn" onclick="event.stopPropagation();verInfo('${a.id}')" title="Ver información"><span class="material-symbols-rounded">info</span></button>
    </div>`;
}

// ── Miniaturas reales: genera una imagen PNG con canvas ─────────────
function coloresCaratula(color) {
  const map = {
    blue: ['#3A00E1', '#6a4bff'], green: ['#336E45', '#5aa06f'],
    orange: ['#FF6600', '#ff9a3d'], red: ['#FF3333', '#ff7a5c'],
    purple: ['#4E3B70', '#7a63a8'], yellow: ['#D6CE52', '#efe78a'],
    pink: ['#E6007E', '#ff66b3']
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
function tipoIcono(tipo = '') {
  if (tipo === 'sopa_letras') return 'text_fields';
  if (tipo === 'relacionar_conceptos' || tipo === 'relacionar_imagenes') return 'link';
  if (tipo === 'ordenar_elementos') return 'format_list_numbered';
  if (tipo === 'completar_frases') return 'edit_note';
  if (tipo === 'verdadero_falso') return 'balance';
  if (tipo === 'logica' || tipo === 'retos_interactivos') return 'psychology';
  return '';
}
function iconoMaterial(a) {
  return tipoIcono(a.tipo || '') || categoriaIcono(a.cat || '');
}
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function generarCaratula(a) {
  return new Promise((resolve) => {
    try {
      const W = 640, H = 360; // 16:9
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');
      const [c1, c2] = coloresCaratula(categoriaColor(a.cat));

      // Fondo: degradado diagonal
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, c1); g.addColorStop(1, c2);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // Patrón de formas oficiales dispersas
      ctx.globalAlpha = 0.13;
      for (let i = 0; i < 9; i++) {
        const x = 24 + ((i * 73) % (W - 70));
        const y = 18 + ((i * 97) % (H - 40));
        dibujarForma(ctx, x, y, 24 + (i % 4) * 12);
      }
      ctx.globalAlpha = 0.10;
      dibujarForma(ctx, W - 130, H - 130, 210);
      ctx.globalAlpha = 1;

      // Puntos decorativos
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      for (let i = 0; i < 26; i++) {
        ctx.beginPath();
        ctx.arc(14 + ((i * 53) % (W - 28)), 12 + ((i * 71) % (H - 24)), 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Medallón redondeado (el icono Material se superpone por HTML encima)
      const mx = W / 2, my = 128, r = 74;
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.28)'; ctx.shadowBlur = 26; ctx.shadowOffsetY = 8;
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      roundRectPath(ctx, mx - r, my - r, r * 2, r * 2, 30);
      ctx.fill();
      ctx.restore();
      ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 3;
      roundRectPath(ctx, mx - r + 7, my - r + 7, r * 2 - 14, r * 2 - 14, 24);
      ctx.stroke();

      // Degradado inferior para contraste
      const fade = ctx.createLinearGradient(0, H - 130, 0, H);
      fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, 'rgba(0,0,0,0.38)');
      ctx.fillStyle = fade; ctx.fillRect(0, H - 130, W, 130);

      // Título compacto con sombra
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.4)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 3;
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px "Plus Jakarta Sans","Arial",sans-serif';
      const t = (a.tit || '').toUpperCase();
      ctx.fillText(t.length > 22 ? t.slice(0, 21) + '…' : t, W / 2, 244);
      ctx.restore();

      // Pill de categoría
      const catLabel = (a.cat || 'GENERAL').toUpperCase();
      ctx.font = '800 17px "Plus Jakarta Sans","Arial",sans-serif';
      const catW = ctx.measureText(catLabel).width + 34;
      ctx.fillStyle = 'rgba(20,20,40,0.6)';
      roundRectPath(ctx, (W - catW) / 2, 288, catW, 32, 16);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(catLabel, W / 2, 304);

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
    const tipo = el.dataset.tipo || '';
    generarCaratula({ cat, tit, tipo }).then((url) => {
      if (url) { el.style.backgroundImage = `url('${url}')`; el.style.backgroundSize = 'cover'; el.style.backgroundPosition = 'center'; }
    });
  });
}

function cardActividad(a) {
  const bloqueada = esBloqueada(a);
  return `
    <div class="card" data-color="${categoriaColor(a.categoria)}" onclick="abrirActividad('${a.id}', ${bloqueada})">
      ${coverHTML(a)}
      <h3>${escapeHtml(a.titulo)}</h3>
      <div class="meta">
        <span class="chip" data-color="${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
      </div>
    </div>`;
}

// Muestra la información de la actividad en un modal (icono ℹ️)
function verInfo(id) {
  const a = TODAS.find(x => x.id === id);
  if (!a) return;
  const bloqueada = esBloqueada(a);
  document.getElementById('info-content').innerHTML = `
    <div class="info-cover" id="info-cover"></div>
    <h3 class="info-title">${escapeHtml(a.titulo)}</h3>
    <p class="info-desc">${escapeHtml(a.descripcion || '')}</p>
    <div class="meta" style="margin-bottom:14px;">
      <span class="chip ${categoriaColor(a.categoria)}">${escapeHtml(a.categoria)}</span>
      <span class="chip">👧 ${escapeHtml(a.edad_recomendada || '6-12')}</span>
      <span class="chip">⭐ ${escapeHtml(a.dificultad || 'media')}</span>
      <span class="chip">⏱️ ${a.tiempo_estimado || '?'} min</span>
      ${a.recompensa ? `<span class="chip blue">🏆 +${a.recompensa} Pz</span>` : ''}
      <span class="chip yellow">📊 ${a.estadisticas?.veces_realizada || 0} jugadas</span>
    </div>
    <div class="m-actions">
      ${bloqueada
        ? '<span class="chip red" style="font-size:13px;">🔒 De pago (no subvencionada)</span>'
        : `<button class="btn btn-green" onclick="document.getElementById('info-modal').classList.add('hidden');abrirActividad('${a.id}', false)">🎮 Jugar</button>`}
      <button class="btn btn-outline" onclick="document.getElementById('info-modal').classList.add('hidden')">Cerrar</button>
    </div>`;
  const coverEl = document.getElementById('info-cover');
  if (a.portada_url) {
    coverEl.style.backgroundImage = `url('${a.portada_url}')`;
  } else {
    generarCaratula({ cat: a.categoria, tit: a.titulo, tipo: a.tipo }).then(url => {
      if (url) coverEl.style.backgroundImage = `url('${url}')`;
    });
  }
  document.getElementById('info-modal').classList.remove('hidden');
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
        <h3 class="cat-title"><span class="t-ico material-symbols-rounded">${categoriaIcono(cat)}</span> ${escapeHtml(cat)}</h3>
        <div class="h-row">${lista.map(cardActividad).join('')}</div>
      </div>`;
  }).join('');
  cont.querySelectorAll('.cat-section .h-row').forEach(sec => generarCaratulasEn(sec));
}

// Abrir y JUGAR la actividad publicada (reproductor de la web)
async function abrirActividad(id, bloqueada) {
  if (bloqueada) {
    juniorAviso('🔒 Esta actividad es de pago (no subvencionada). Puedes adquirirla en la app Placeta Junior y pagarla con Placetas.', 'error');
    return;
  }
  try {
    const data = await apiGet(`/actividades/${id}`);
    if (data.actividad) {
      if (typeof abrirJuego === 'function') abrirJuego(data.actividad);
      else juniorAviso('No se pudo iniciar el juego.', 'error');
    } else {
      juniorAviso('No se encontró la actividad.', 'error');
    }
  } catch (e) {
    juniorAviso('No se pudo cargar la actividad. Inténtalo de nuevo.', 'error');
  }
}

// ═══════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  cargarTodo();
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('info-modal')?.classList.add('hidden');
  });
});
