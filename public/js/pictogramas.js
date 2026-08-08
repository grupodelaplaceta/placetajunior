/* ─────────────────────────────────────────────────────────────
 * Pictogramas ARASAAC — búsqueda de pictogramas por internet
 * API abierta: https://api.arasaac.org
 *   Búsqueda: GET /api/pictograms/es/search/{texto}
 *   Imagen:   https://static.arasaac.org/pictograms/{id}/{id}_300.png
 * CORS: *  (se puede llamar directamente desde el navegador)
 * ───────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  const API_BUSCAR = 'https://api.arasaac.org/api/pictograms/es/search/';
  const API_BEST = 'https://api.arasaac.org/api/pictograms/es/bestsearch/';
  const STATIC = 'https://static.arasaac.org/pictograms/';

  /** Normaliza un resultado de ARASAAC a {id, palabra, url} */
  function normalizar(p) {
    const palabra = (p.keywords && p.keywords[0] && p.keywords[0].keyword)
      || (p.tags && p.tags[0]) || String(p._id);
    return { id: p._id, palabra, url: urlImagen(p._id) };
  }

  /** URL de la imagen de un pictograma (300 o 500 px, PNG) */
  function urlImagen(id, size) {
    size = size || 300;
    return `${STATIC}${id}/${id}_${size}.png`;
  }

  /** Busca pictogramas por palabra. Devuelve [{id, palabra, url}] */
  async function buscar(texto, limite) {
    texto = String(texto || '').trim();
    if (!texto) return [];
    const url = API_BUSCAR + encodeURIComponent(texto);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Error al buscar pictogramas');
    const lista = await res.json();
    let items = (Array.isArray(lista) ? lista : []).map(normalizar);
    if (limite && items.length > limite) items = items.slice(0, limite);
    return items;
  }

  /** Mejor coincidencia (bestsearch). Devuelve {id,palabra,url} o null */
  async function mejor(texto) {
    texto = String(texto || '').trim();
    if (!texto) return null;
    const url = API_BEST + encodeURIComponent(texto);
    const res = await fetch(url);
    if (!res.ok) return null;
    const lista = await res.json();
    if (!Array.isArray(lista) || !lista.length) return null;
    return normalizar(lista[0]);
  }

  /* ── Modal buscador ─────────────────────────────────────── */

  /** Abre el buscador de pictogramas.
   *  onSeleccionar({id, palabra, url})  →  al hacer clic en un picto.
   *  actual: {id|url} opcional para resaltar el ya elegido. */
  function abrirBuscador(opts) {
    opts = opts || {};
    const onSel = opts.onSeleccionar || function () {};
    const actual = opts.actual || null;

    // Modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'picto-modal';
    overlay.style.zIndex = '300';
    overlay.innerHTML = `
      <div class="modal" style="border-top-color:var(--pj-purple);max-width:680px;">
        <h3>🖼️ Buscar pictograma (ARASAAC)</h3>
        <p class="m-sub">Pictogramas libres de ARASAAC (Gobierno de Aragón). Escribe una palabra y elige.</p>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <input id="picto-q" type="search" placeholder="Ej: comer, casa, feliz, escuela…"
                 style="flex:1;" autocomplete="off" />
          <button id="picto-go" class="btn btn-purple" type="button" style="white-space:nowrap;">🔎 Buscar</button>
        </div>
        <div class="galeria" id="picto-grid" style="max-height:360px;">
          <div class="g-empty">Escribe una palabra y pulsa Buscar o Enter.</div>
        </div>
        <div class="m-actions">
          <button id="picto-cancel" class="btn btn-outline" type="button">Cancelar</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    const q = overlay.querySelector('#picto-q');
    const grid = overlay.querySelector('#picto-grid');

    let timer = null;
    function disparar() {
      const texto = q.value.trim();
      if (!texto) {
        grid.innerHTML = '<div class="g-empty">Escribe una palabra y pulsa Buscar o Enter.</div>';
        return;
      }
      grid.innerHTML = '<div class="g-empty">⏳ Buscando…</div>';
      buscar(texto, 60).then(function (items) {
        if (!items.length) {
          grid.innerHTML = '<div class="g-empty">Sin resultados. Prueba con otra palabra.</div>';
          return;
        }
        grid.innerHTML = '';
        items.forEach(function (p) {
          const el = document.createElement('div');
          el.className = 'g-item' + (actual && String(p.id) === String(actual) ? ' active' : '');
          el.style.backgroundImage = 'url("' + p.url + '")';
          el.style.backgroundSize = 'contain';
          el.style.backgroundRepeat = 'no-repeat';
          el.style.backgroundPosition = 'center';
          el.title = p.palabra;
          const tag = document.createElement('div');
          tag.className = 'g-tag';
          tag.textContent = p.palabra;
          el.appendChild(tag);
          el.addEventListener('click', function () {
            onSel(p);
            cerrar();
          });
          grid.appendChild(el);
        });
      }).catch(function () {
        grid.innerHTML = '<div class="g-empty">⚠️ No se pudo conectar con ARASAAC. Comprueba tu conexión.</div>';
      });
    }

    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); disparar(); }
      else {
        clearTimeout(timer);
        timer = setTimeout(disparar, 400);
      }
    });
    overlay.querySelector('#picto-go').addEventListener('click', disparar);
    overlay.querySelector('#picto-cancel').addEventListener('click', cerrar);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) cerrar(); });

    function cerrar() {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', onKey);
    }
    function onKey(e) { if (e.key === 'Escape') cerrar(); }
    document.addEventListener('keydown', onKey);
    q.focus();
  }

  window.Pictogramas = { buscar, mejor, urlImagen, abrirBuscador };
})();
