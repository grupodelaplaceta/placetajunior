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
  const color = categoriaColor(a.categoria);
  return `
    <div class="card" data-color="${color}" onclick="abrirActividad('${a.id}', ${bloqueada})">
      ${coverHTML(a)}
      <h3>${escapeHtml(a.titulo)}</h3>
      <div class="card-foot">
        <span class="chip" data-color="${color}">${escapeHtml(a.categoria)}</span>
        ${!bloqueada ? `<button type="button" class="cover-play" onclick="event.stopPropagation();abrirActividad('${a.id}', false)" title="Jugar"><span class="material-symbols-rounded">play_arrow</span> Jugar</button>` : ''}
      </div>
    </div>`;
}

// Página de DETALLE de la actividad (a pantalla completa, no popup)
function verInfo(id) {
  const a = TODAS.find(x => x.id === id);
  if (!a) return;
  if (window.pjSonido) pjSonido.abrir();
  const bloqueada = esBloqueada(a);
  const color = categoriaColor(a.categoria);
  const nBloques = (a.contenido && a.contenido.bloques) ? a.contenido.bloques.length : (a.num_fases || 0);
  const nPreg = a.num_preguntas || 0;
  document.getElementById('detail-page').innerHTML = `
    <a class="detail-back" href="javascript:cerrarDetalle()"><span class="material-symbols-rounded">arrow_back</span> Volver a Actividades</a>
    <div class="detail-hero">
      <div class="detail-cover" id="detail-cover"></div>
    </div>
    <div class="detail-head">
      <span class="chip" data-color="${color}">${escapeHtml(a.categoria)}</span>
      <h1>${escapeHtml(a.titulo)}</h1>
    </div>
    <div class="detail-body">
      <div class="detail-stats">
        <div class="dstat"><span class="material-symbols-rounded">child_care</span><span class="dstat-lbl">Edad</span><span class="dstat-val">${escapeHtml(a.edad_recomendada || '6-12')}</span></div>
        <div class="dstat"><span class="material-symbols-rounded">trending_up</span><span class="dstat-lbl">Dificultad</span><span class="dstat-val">${escapeHtml(a.dificultad || 'media')}</span></div>
        <div class="dstat"><span class="material-symbols-rounded">quiz</span><span class="dstat-lbl">Preguntas</span><span class="dstat-val">${nPreg}</span></div>
        <div class="dstat"><span class="material-symbols-rounded">flag</span><span class="dstat-lbl">Fases</span><span class="dstat-val">${nBloques}</span></div>
      </div>
      <div class="detail-card">
        <h2>¿De qué trata esta actividad?</h2>
        <p>${escapeHtml(a.descripcion || '')}</p>
        ${a.recompensa ? `<div class="detail-reward"><span class="material-symbols-rounded">military_tech</span><div><span class="reward-lbl">Recompensa</span><span class="reward-val">+${a.recompensa} Pz</span></div></div>` : ''}
      </div>
      <div class="detail-actions">
        ${bloqueada
          ? '<span class="chip red">🔒 De pago (no subvencionada)</span>'
          : `<button class="btn btn-primary btn-lg" onclick="abrirActividad('${a.id}', false)"><span class="material-symbols-rounded">play_arrow</span> Comenzar</button>`}
        <button class="btn btn-outline btn-lg" onclick="descargarPdf('${a.id}')"><span class="material-symbols-rounded">download</span> Descargar PDF</button>
      </div>
    </div>`;
  document.body.classList.add('mostrando-detalle');
  try { if (!location.search.includes('id=')) history.pushState(null, '', '/?id=' + encodeURIComponent(a.id)); } catch (e) { /* sin historial */ }
  window.scrollTo(0, 0);
  const coverEl = document.getElementById('detail-cover');
  if (a.portada_url) {
    coverEl.style.backgroundImage = `url('${a.portada_url}')`;
  } else {
    generarCaratula({ cat: a.categoria, tit: a.titulo, tipo: a.tipo }).then(url => {
      if (url) coverEl.style.backgroundImage = `url('${url}')`;
    });
  }
}
function cerrarDetalle() {
  document.body.classList.remove('mostrando-detalle');
  try { if (location.search.includes('id=')) history.replaceState(null, '', '/'); } catch (e) { /* sin historial */ }
  window.scrollTo(0, 0);
}

// Worksheet imprimible en PDF A4 (ventana de impresión del navegador)
async function descargarPdf(id) {
  const a = TODAS.find(x => x.id === id) || null;
  if (!a) return;
  if (window.pjSonido) pjSonido.clic();
  const bloques = (a.contenido && a.contenido.bloques) || [];
  const wsImg = (url, fuente) => url
    ? `<div class="ws-img"><img src="${esc(url)}" alt=""><span class="ws-fuente">${esc(fuente || 'Imagen')}</span></div>`
    : '';
  let cuerpo = '';
  bloques.forEach((b) => {
    if (b.tipo === 'test' && b.preguntas && b.preguntas.length) {
      cuerpo += '<div class="ws-sec ws-test"><h4>Preguntas</h4>';
      b.preguntas.forEach((p, k) => {
        const opts = (p.opciones || []).map((o, oi) => '<span class="ws-opt">' + ('ABCDEFGH'[oi] || '') + ') ' + esc(o) + '</span>').join(' ');
        cuerpo += '<div class="ws-q"><span class="ws-n">' + (k + 1) + '.</span> ' + esc(p.pregunta || '') + wsImg(p.imagen_url || p.pictograma, p.fuente) + '<div class="ws-opts">' + opts + '</div></div>';
      });
      cuerpo += '</div>';
    } else if (b.tipo === 'texto' && (((b.contenido || '').trim()) || b.imagen_url)) {
      cuerpo += '<div class="ws-sec"><h4>' + esc(b.titulo || 'Aprende') + '</h4>' + wsImg(b.imagen_url, b.fuente) + '<p>' + esc((b.contenido || '').replace(/\s*\n+\s*/g, ' ')) + '</p></div>';
    } else if (b.tipo === 'sopa_letras' && b.palabras && b.palabras.length) {
      let gridHtml = '';
      if (typeof generarSopa === 'function') {
        const sopa = generarSopa(b.palabras, b.tamano);
        const size = sopa.size;
        const cellMm = Math.max(5, Math.min(10, Math.floor(168 / size)));
        const fs = Math.max(3.5, cellMm - 4);
        gridHtml = '<table class="ws-grid" style="border-collapse:collapse;margin:6px auto 2px;">';
        for (let r = 0; r < size; r++) {
          gridHtml += '<tr>';
          for (let c = 0; c < size; c++) {
            gridHtml += '<td style="width:' + cellMm + 'mm;height:' + cellMm + 'mm;text-align:center;vertical-align:middle;border:1px solid #8a91a0;font-size:' + fs + 'mm;font-weight:700;font-family:\'Plus Jakarta Sans\',sans-serif;">' + (sopa.grid[r][c] || '') + '</td>';
          }
          gridHtml += '</tr>';
        }
        gridHtml += '</table>';
      }
      cuerpo += '<div class="ws-sec ws-sopa"><h4>Sopa de letras</h4>' + wsImg(b.imagen_url, b.fuente) + '<p class="ws-words">' + b.palabras.map(esc).join(' · ') + '</p>' + gridHtml + '<p class="ws-hint">Busca y rodea las palabras.</p></div>';
    } else if (b.tipo === 'relacionar' && b.pares && b.pares.length) {
      const modo = b.modo || 'emparejar';
      const der = (typeof shuffleArr === 'function' ? shuffleArr(b.pares.map((p) => p.der || '')) : b.pares.map((p) => p.der || ''));
      const izqHtml = b.pares.map((p) => {
        const img = (modo === 'escribir' && p.izq_img) ? `<div class="ws-item-img"><img src="${esc(p.izq_img)}" alt=""></div>` : '';
        return '<div class="ws-item">' + img + esc(p.izq || '') + '</div>';
      }).join('');
      cuerpo += '<div class="ws-sec ws-rel"><h4>Relaciona cada pareja (dibuja una línea)</h4>' + wsImg(b.imagen_url, b.fuente) + '<div class="ws-cols"><div class="ws-col">' + izqHtml + '</div><div class="ws-col">' + der.map((t) => '<div class="ws-item">' + esc(t) + '</div>').join('') + '</div></div></div>';
    } else if (b.tipo === 'ordenar' && b.items && b.items.length) {
      cuerpo += '<div class="ws-sec"><h4>Ordena los pasos (numéralos del 1 al N)</h4>' + wsImg(b.imagen_url, b.fuente);
      b.items.forEach((it, k) => { cuerpo += '<div class="ws-line"><span class="ws-n">' + (k + 1) + '.</span> ____ ' + esc(it) + '</div>'; });
      cuerpo += '</div>';
    } else if (b.tipo === 'completar' && b.frases && b.frases.length) {
      cuerpo += '<div class="ws-sec"><h4>Completa las frases</h4>' + wsImg(b.imagen_url, b.fuente);
      b.frases.forEach((f, k) => { cuerpo += '<div class="ws-line"><span class="ws-n">' + (k + 1) + '.</span> ' + esc((f.texto || '').replace(/___/g, '______')) + '</div>'; });
      cuerpo += '</div>';
    } else if (b.tipo === 'calculo_mental' && b.sumas && b.sumas.length) {
      cuerpo += '<div class="ws-sec"><h4>Cálculo mental</h4>' + wsImg(b.imagen_url, b.fuente);
      b.sumas.forEach((s2, k) => { cuerpo += '<div class="ws-line"><span class="ws-n">' + (k + 1) + '.</span> ' + (Number(s2.a) || 0) + ' + ' + (Number(s2.b) || 0) + ' = ______</div>'; });
      cuerpo += '</div>';
    } else if (b.tipo === 'mapa_mundi' && b.paises && b.paises.length) {
      const recon = (b.paises || []).map(p => String(p).trim()).filter(Boolean).filter(p => window.MAPA_MUNDI && MAPA_MUNDI.paises[p]);
      cuerpo += '<div class="ws-sec ws-mapa"><h4>Localiza en el mapamundi</h4>' + wsImg(b.imagen_url, b.fuente) + '<div class="ws-map-wrap" data-mapa="1" data-paises="' + esc(JSON.stringify(recon)) + '"></div><p class="ws-words">' + recon.map(esc).join(' · ') + '</p><p class="ws-hint">Colorea o señala cada país en el mapamundi.</p></div>';
    }
  });
  // Portada de la actividad (16:9) en el worksheet
  let portada = '';
  if (a.portada_url) portada = `<div class="ws-cover"><img src="${esc(a.portada_url)}" alt="${esc(a.titulo)}"></div>`;
  else {
    const url = await generarCaratula({ cat: a.categoria, tit: a.titulo, tipo: a.tipo });
    if (url) portada = `<div class="ws-cover"><img src="${url}" alt="${esc(a.titulo)}"></div>`;
  }
  const ws = document.getElementById('print-worksheet');
  ws.innerHTML = `
    <div class="ws-head">
      <div class="ws-brand"><img class="ws-logo" src="img/logo.png" alt="Placeta Junior" /><span class="ws-brand-name">Placeta Junior</span></div>
      <h1>${esc(a.titulo)}</h1>
      <p>${esc(a.categoria)} · Edad ${esc(a.edad_recomendada || '6-12')} · Dificultad ${esc(a.dificultad || 'media')}</p>
    </div>
    ${portada}
    <div class="ws-meta">Nombre: _______________&nbsp;&nbsp; Fecha: _______________&nbsp;&nbsp; Puntos: ________</div>
    ${cuerpo}
    <div class="ws-foot">Generado por Placeta Junior · junta@laplaceta.org</div>`;
  // Dibuja el mapamundi (world-atlas) en los bloques de mapa_mundi
  const mapaEls = ws.querySelectorAll('[data-mapa="1"]');
  for (const el of mapaEls) {
    let paises = [];
    try { paises = JSON.parse(el.dataset.paises || '[]'); } catch (e) { /* ok */ }
    const url = await generarMapaPdf(paises, 800);
    if (url) el.innerHTML = '<img src="' + url + '" alt="Mapamundi">';
  }
  window.print();
}

// Dibuja el mapamundi (world-atlas) en un canvas para la ficha PDF
// Dibuja un mapamundi en BLANCO (solo contornos, sin colores) para colorear/señalar en el PDF
async function generarMapaPdf(paises, W) {
  try {
    if (!window.MAPA_MUNDI) return '';
    await MAPA_MUNDI.cargarTodo(); // asegura que topojson esté cargado
    const geo = await MAPA_MUNDI.cargarGeo();
    if (!geo || !geo.features) return '';
    W = W || 900;
    const H = Math.round(W / 2);
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d');
    const px = (lon) => ((lon + 180) / 360) * W;
    const py = (lat) => ((90 - lat) / 180) * H;
    // Fondo blanco
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    const dibujar = (coords) => {
      ctx.beginPath();
      coords.forEach((ring) => {
        ring.forEach(([lon, lat], k) => {
          const x = px(lon), y = py(lat);
          if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
      });
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.strokeStyle = '#94a3b8'; ctx.lineWidth = 1; ctx.stroke();
    };
    geo.features.forEach((f) => {
      if (f.geometry.type === 'Polygon') dibujar([f.geometry.coordinates]);
      else if (f.geometry.type === 'MultiPolygon') f.geometry.coordinates.forEach(p => dibujar(p));
    });
    return cv.toDataURL('image/png');
  } catch (e) { return ''; }
}

let TODAS = []; // todas las actividades públicas

// ── Clasificar / filtrar por edad ──────────────────────────────────
let filtroEdad = 'todas'; // 'todas' | '0-5' | '6-8' | '9-12' | '13+'
function edadMinima(a) {
  const m = String(a.edad_recomendada || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}
function edadCumple(a, banda) {
  const e = edadMinima(a);
  if (banda === 'todas') return true;
  if (e === null) return false;
  if (banda === '0-5') return e <= 5;
  if (banda === '6-8') return e >= 6 && e <= 8;
  if (banda === '9-12') return e >= 9 && e <= 12;
  if (banda === '13+') return e >= 13;
  return true;
}
function setFiltroEdad(val, el) {
  filtroEdad = val;
  document.querySelectorAll('.ef-btn').forEach(b => b.classList.toggle('active', b === el));
  renderPopulares();
  renderCategorias();
  actualizarContadorEdad();
}
function actualizarContadorEdad() {
  const c = document.getElementById('edad-count');
  if (!c) return;
  const n = TODAS.filter(a => edadCumple(a, filtroEdad)).length;
  c.textContent = n + (n === 1 ? ' actividad' : ' actividades');
}

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
  actualizarContadorEdad();
}

// ⭐ Populares: las más jugadas (fila horizontal)
function renderPopulares() {
  const row = document.getElementById('populares-row');
  const ordenadas = [...TODAS].filter(a => edadCumple(a, filtroEdad)).sort((a, b) =>
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
  const filtradas = TODAS.filter(a => edadCumple(a, filtroEdad));
  const cats = [...new Set(filtradas.map(a => a.categoria).filter(Boolean))];
  if (cats.length === 0) {
    cont.innerHTML = '';
    return;
  }
  cont.innerHTML = cats.map(cat => {
    const lista = filtradas.filter(a => a.categoria === cat);
    if (lista.length === 0) return '';
    return `
      <div class="cat-section">
        <h3 class="cat-title" data-color="${categoriaColor(cat)}"><span class="t-ico material-symbols-rounded">${categoriaIcono(cat)}</span> ${escapeHtml(cat)}</h3>
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
//  INIT (incluye rutas propias: /?id= detalle y /?jugar= juego)
// ═══════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  // Barra superior: efecto al hacer scroll (menos transparencia + sombra)
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
  cargarTodo().then(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('jugar')) abrirActividad(p.get('jugar'), false);
    else if (p.get('id')) verInfo(p.get('id'));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cerrarDetalle();
  });
  window.addEventListener('popstate', () => {
    const p = new URLSearchParams(location.search);
    if (!p.get('id') && !p.get('jugar')) {
      cerrarDetalle();
      document.body.classList.remove('mostrando-juego');
    } else if (p.get('id')) {
      document.body.classList.remove('mostrando-juego');
      verInfo(p.get('id'));
    } else if (p.get('jugar')) {
      document.body.classList.remove('mostrando-detalle');
      abrirActividad(p.get('jugar'), false);
    }
  });
});
