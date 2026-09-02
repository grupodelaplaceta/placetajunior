/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Reproductor jugable (web pública)
   Abre una actividad publicada y permite jugarla tal y como la verá el niño.
   ═══════════════════════════════════════════════════════════════════ */

let pantallas = [];
let pantallaIdx = 0;
let kpEstado = [];
let bloquesJuego = [];
function adaptarInteractivo(b) {
  if (b && !b.imagen_url) b.imagen_url = imagenDePJ(b);
  if (!b || b.datos || !['arrastrar','buscar','detective','laboratorio','construccion','presupuesto','dinero_euro','construir_frase','clasificar_palabras','completar_palabra','cazador_errores','lectura_interactiva','exploracion','simulacion','memoria','sonido','codigo_secreto','escape_room'].includes(b.tipo)) return b;
  const d={...b}; if(Array.isArray(d.destinos)&&!d.zonas)d.zonas=d.destinos.map(x=>x.id||x.texto); if(d.instruccion&&!d.instrucciones)d.instrucciones=d.instruccion; if(Array.isArray(d.elementos)&&b.tipo==='buscar')d.objetos=d.elementos.map(x=>`${x.texto||x.nombre||''}|${x.texto||x.nombre||''}|${x.correcto?'1':'0'}`); b.datos=d; return b;
}
let kpScore = { verdes: 0, rojos: 0 };
let kpCelebrado = false;
let actividadActual = null;   // actividad que se está jugando (para guardar progreso)
let dipGuardado = '';
try { dipGuardado = localStorage.getItem('pj-dip') || ''; } catch (e) { /* sin almacenamiento */ }
let msgGuardar = '';
let guardandoDIP = false;

function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
// ── Reparación de URLs de imagen ─────────────────────────────────────
// Algunas actividades (generadas con IA) guardan la URL de la imagen como
// un enlace Markdown partido por el ':' de la propia URL. Ejemplo real:
//   "imagen_url": "[https://…/wiki/Special](https://…/wiki/Special):Redirect/file/X.svg"
// (la URL original era …/wiki/Special:Redirect/file/X.svg). Aquí se
// reconstruye la URL real para que la imagen pueda mostrarse, y se restaura
// el esquema si quedó con un solo "/" (https:/host).
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
function kpImg(url, fuente, alt) {
  return `<div class="kp-img"><img src="${esc(pjUrlImg(url))}" alt="${esc(alt || '')}"><div class="kp-fuente">📸 ${esc(fuente || 'Fuente sin indicar')}</div></div>`;
}
function imagenDePJ(b) { return b && (b.imagen_url || b.imagenUrl || b.imagen || b.image_url || b.imageUrl || ''); }
function shuffleArr(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
  return x;
}
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
  if (c.includes('mate')) return '🔢';
  if (c.includes('leng') || c.includes('lect')) return '📖';
  if (c.includes('cien')) return '🔬';
  if (c.includes('geo')) return '🌍';
  if (c.includes('tecn') || c.includes('inform')) return '💻';
  if (c.includes('logic')) return '🧠';
  return '🧩';
}
function generarSopa(palabras, tamano) {
  const MAX = 16;
  const validas = (palabras || []).filter(Boolean).map(p => String(p).toUpperCase().replace(/[^A-ZÑ]/g, '')).filter(p => p.length >= 2);
  const maxLen = validas.length ? Math.max(...validas.map(p => p.length)) : 3;
  let size = Math.min(MAX, Math.max(Number(tamano) || 10, maxLen + 1, 8));

  const colocar = (grid, palabra) => {
    const L = palabra.length;
    if (L > size) return false;
    // Prueba ambas orientaciones y varios intentos para evitar colisiones
    const dirs = Math.random() < 0.5 ? [0, 1] : [1, 0];
    for (const d of dirs) {
      const rowMax = d === 0 ? size - 1 : size - L;   // fila válida máxima
      const colMax = d === 0 ? size - L : size - 1;   // columna válida máxima
      for (let att = 0; att < 80; att++) {
        const row = Math.floor(Math.random() * (rowMax + 1));
        const col = Math.floor(Math.random() * (colMax + 1));
        let ok = true;
        for (let k = 0; k < L; k++) {
          const c = d === 0 ? grid[row][col + k] : grid[row + k][col];
          if (c && c !== palabra[k]) { ok = false; break; }
        }
        if (ok) {
          for (let k = 0; k < L; k++) { if (d === 0) grid[row][col + k] = palabra[k]; else grid[row + k][col] = palabra[k]; }
          return true;
        }
      }
    }
    return false;
  };

  // Intenta colocar todas; si alguna no cabe, amplía la rejilla (hasta 16) y reintenta
  let grid;
  while (true) {
    grid = Array.from({ length: size }, () => Array(size).fill(''));
    const falladas = [];
    validas.forEach((p) => { if (!colocar(grid, p)) falladas.push(p); });
    if (!falladas.length || size >= MAX) break;
    size = Math.min(size + 1, MAX);
  }
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = abc[Math.floor(Math.random() * 26)];
  return { grid, size };
}

// ── Abrir el juego de una actividad publicada ────────────────────────
function abrirJuego(act) {
  // Reconstruye las URLs de imagen guardadas partidas como enlace Markdown
  // (por el ':' de URLs como …/wiki/Special:Redirect/file/X.svg).
  if (act) pjSaneaImagenes(act);
  actividadActual = act || null;
  if (window.pjSonido) pjSonido.abrir();
  const esCode = act && (String(act.tipo || '').startsWith('code') || (act.contenido && act.contenido.tipo === 'code_blocks'));
  bloquesJuego = (act && act.contenido && act.contenido.bloques) ? act.contenido.bloques : [];
  // RSP puede organizar una actividad en niveles/diapositivas. Se
  // convierten en una secuencia única para reutilizar todos los juegos del
  // reproductor y conservar el avance pantalla a pantalla.
  const contenidoNiveles = act && act.contenido && (act.contenido.niveles || act.contenido.diapositivas);
  const niveles = (act && (act.subapartados || act.niveles || contenidoNiveles)) || [];
  if (!esCode && niveles.length) {
    bloquesJuego = niveles.slice().sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0)).flatMap((n, i) => {
      // Las diapositivas antiguas pueden guardar contenido como JSON string,
      // como objeto con bloques o directamente como un bloque.
      let contenido = n.contenido || n;
      if (typeof contenido === 'string') {
        try { contenido = JSON.parse(contenido); } catch (_) { contenido = { tipo: 'texto', contenido }; }
      }
      if (!contenido || typeof contenido !== 'object') contenido = {};
      const bloques = Array.isArray(contenido.bloques)
        ? contenido.bloques
        : (contenido.tipo ? [contenido] : []);
      // Cada diapositiva comienza con la misma carátula que la actividad,
      // como capítulos de una serie; después llegan sus ejercicios.
      const caratula = { tipo: 'portada', nivelIndex: i, tit: act.titulo || 'Actividad', desc: n.descripcion || '', cat: act.categoria || 'General', edad: act.edad_recomendada || '6-12', dif: act.dificultad || 'media', tiempo: act.tiempo_estimado || 10 };
      const encabezado = { tipo: 'texto', nivelIndex: i, titulo: `Capítulo ${i + 1}: ${n.titulo || 'Siguiente reto'}`, contenido: n.descripcion || `Completa este capítulo para desbloquear el siguiente. Recompensa: ${Number(n.recompensa || 0)} Pz` };
      return [caratula, encabezado, ...bloques.map(b => ({ ...b, nivelIndex: i }))];
    });
  }
  // Cobertura adicional para bloques reconstruidos desde contenido en string.
  if (!esCode) pjSaneaImagenes(bloquesJuego);
  if (!esCode && !bloquesJuego.length) { juniorAviso('Esta actividad aún no tiene contenido jugable.', 'error'); return; }
  pantallas = [];
  kpEstado = [];
  const tit = act.titulo || 'Mi actividad';
  const desc = act.descripcion || '';
  const cat = act.categoria || 'General';
  if (window.PJMusic) window.PJMusic.actividad(cat); // música según la asignatura
  const edad = act.edad_recomendada || '6-12';
  const dif = act.dificultad || 'media';
  const tiempo = act.tiempo_estimado || 10;

  pantallas.push({ tipo: 'portada', tit, desc, cat, edad, dif, tiempo });
  kpEstado.push({});

  // Placeta Junior Code: un reto (pantalla code) por ejercicio, con evolución
  if (esCode) {
    const c = act.contenido || {};
    const ejercicios = (window.PJCode && PJCode.obtenerEjercicios) ? PJCode.obtenerEjercicios(c) : [];
    if (!ejercicios.length) {
      juniorAviso('Esta actividad no tiene ejercicios de código.', 'error');
      return;
    }
    // Pantalla de explicación de la actividad (si la hay)
    if (c.explicacion) {
      pantallas.push({ tipo: 'code_explica', bi: 0, explicacion: c.explicacion });
      kpEstado.push({});
    }
    // Una pantalla por ejercicio (evolución progresiva)
    ejercicios.forEach((ej, i) => {
      pantallas.push({
        tipo: 'code',
        bi: 0,
        ejercicio: i,
        total_ejercicios: ejercicios.length,
        titulo: ej.titulo || ('Ejercicio ' + (i + 1)),
        explicacion: ej.explicacion || '',
        objetivo_texto: ej.objetivo_texto || 'Lleva a Candela hasta la estrella.',
        escenario: ej.escenario || { tipo: 'cuadricula', ancho: 6, alto: 6 },
        inicio: ej.inicio || { x: 0, y: 0, direccion: 'derecha' },
        objetivo: ej.objetivo || {},
        permitidos: PJCode.bloquesPermitidos(act, i),
        max_bloques: ej.max_bloques || null,
        pistas: ej.pistas || []
      });
      kpEstado.push({ programa: [], superado: false, resultado: null });
    });
    // Si hay una partida en curso guardada, se retoma el programa del ejercicio en curso
    const guardada = window.PJPartidas ? PJPartidas.get(act.id) : null;
    if (guardada && guardada.code && kpEstado[pantallaIdx]) {
      kpEstado[pantallaIdx].programa = guardada.code.programa || [];
    }
  } else {
    bloquesJuego.forEach((raw, bi) => { const b=adaptarInteractivo(raw);
      if (b.tipo === 'test') {
        (b.preguntas || []).forEach((p, pi) => {
          pantallas.push({ tipo: 'test', bi, pi, nPreg: b.preguntas.length });
          kpEstado.push({ respondida: false, sel: null, acierto: null });
        });
      } else if (b.tipo === 'texto') {
        pantallas.push({ tipo: 'texto', bi });
        kpEstado.push({});
      } else if (b.tipo === 'esquema') {
        pantallas.push({ tipo: 'esquema', bi });
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
        // Formato retirado temporalmente: no crea pantallas para estos ejercicios.
        return;
      } else if (b.tipo === 'problemas_legacy_disabled') {
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
      } else if (['arrastrar','buscar','detective','laboratorio','construccion','presupuesto','dinero_euro','construir_frase','clasificar_palabras','completar_palabra','cazador_errores','lectura_interactiva','exploracion','simulacion','historia_interactiva','memoria','sonido','codigo_secreto','escape_room'].includes(b.tipo) && (b.datos || b.palabras || b.texto || b.escenas || b.elementos || b.categorias)) {
        pantallas.push({ tipo: 'interactivo', bi, nivelIndex: b.nivelIndex });
        kpEstado.push({ respondida: false, seleccion: [], lanzamientos: [], gastado: 0, clasificarIndice: 0, clasificarRespuestas: {} });
      }
    });
    // Propaga el nivel a todas las pantallas generadas por sus bloques.
    pantallas.forEach((s) => {
      if (s.nivelIndex == null && s.bi != null && bloquesJuego[s.bi]) {
        s.nivelIndex = bloquesJuego[s.bi].nivelIndex;
      }
    });
  }

  pantallas.push({ tipo: 'final', tit, cat });
  kpEstado.push({});
  kpScore = { verdes: 0, rojos: 0 };
  kpCelebrado = false;
  pantallaIdx = 0;
  // Restaurar partida en curso guardada localmente (retomar donde se dejó)
  const clavePartida = act && act._unidadIndex != null ? `${act._actividadId || act.id}::unidad::${act._unidadIndex}` : (act && act.id);
  const partida = (window.PJPartidas && clavePartida) ? PJPartidas.get(clavePartida) : null;
  if (partida && !partida.completada && partida.pantallaIdx) {
    try {
      // Si el índice guardado ya era el resumen, se vuelve a mostrar para
      // consolidar los puntos; en cualquier otro caso se retoma lo guardado.
      const guardadoIdx = Math.max(1, Number(partida.pantallaIdx) || 1);
      const idx = guardadoIdx >= pantallas.length - 1
        ? pantallas.length - 1
        : Math.min(guardadoIdx, Math.max(1, pantallas.length - 2));
      pantallaIdx = idx;
      if (Array.isArray(partida.kpEstado) && partida.kpEstado.length === kpEstado.length) {
        kpEstado = partida.kpEstado;
      }
      kpScore = { verdes: Number(partida.kpScore?.verdes) || 0, rojos: Number(partida.kpScore?.rojos) || 0 };
    } catch (e) { /* si algo falla, se empieza de cero */ }
  }
  // Página completa (no popup): renderiza el juego en su propia página
  const gamePage = document.getElementById('game-page');
  if (gamePage) {
    gamePage.innerHTML = '<div id="player-content"></div>';
    // Si veníamos del detalle, lo cerramos para que el juego abra en su propia página
    window.__pjDesdeDetalle = document.body.classList.contains('mostrando-detalle');
    document.body.classList.remove('mostrando-detalle');
    document.body.classList.add('mostrando-juego');
  }
  asegurarFeedback();
  renderPantalla();
  try { if (act && act.id && !location.search.includes('jugar=')) history.pushState(null, '', '/?jugar=' + encodeURIComponent(act.id)); } catch (e) { /* sin historial */ }
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
// Coloca una suma o resta en vertical, con las llevadas pintadas encima (solo suma)
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

// Datos esperados de una operación vertical (dígitos por columna)
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
// Operación vertical interactiva: el niño escribe cada dígito del resultado
// y, en las sumas, las llevadas encima de cada columna.
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
// Comprueba todas las operaciones verticales del documento y pinta cada celda.
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
  const progNivel = (window.PJProgreso ? PJProgreso.estado().nivel : 1);
  let cuerpo = '';
  if (s.tipo === 'portada') cuerpo = screenPortada(s);
  else if (s.tipo === 'texto') cuerpo = screenTexto(s, est);
  else if (s.tipo === 'esquema') cuerpo = screenEsquema(s, est);
  else if (s.tipo === 'test') cuerpo = screenTest(s, est);
  else if (s.tipo === 'sopa') cuerpo = screenSopa(s, est);
  else if (s.tipo === 'relacionar') cuerpo = screenRelacionar(s, est);
  else if (s.tipo === 'ordenar') cuerpo = screenOrdenar(s, est);
  else if (s.tipo === 'completar') cuerpo = screenCompletar(s, est);
  else if (s.tipo === 'calculo') cuerpo = screenCalculo(s, est);
  else if (s.tipo === 'problema') cuerpo = screenProblema(s, est);
  else if (s.tipo === 'mapa') cuerpo = screenMapa(s, est);
  else if (s.tipo === 'code') cuerpo = screenCode(s, est);
  else if (s.tipo === 'code_explica') cuerpo = screenCodeExplica(s);
  else if (s.tipo === 'interactivo') cuerpo = screenInteractive(s, est);
  else if (s.tipo === 'final') { cuerpo = screenFinal(s); if (!kpCelebrado) { kpCelebrado = true; if (window.PJProgreso) { PJProgreso.sumar(kpScore.verdes, kpScore.rojos); try { window.dispatchEvent(new CustomEvent('pj:progreso')); } catch (e) { /* ok */ } } lluviaConfetti(); if (window.pjSonido) pjSonido.victoria(); } }
  ocultarFeedback();
  destruirMapas();
  // Guardar la partida localmente (retomar más tarde)
  guardarPartidaLocal();
  const total = pantallas.length;
  const pct = total > 1 ? Math.round((pantallaIdx / (total - 1)) * 100) : 0;
  let etiqueta;
  if (s.tipo === 'test') etiqueta = 'Pregunta ' + (s.pi + 1) + ' de ' + s.nPreg;
  else if (s.tipo === 'calculo') etiqueta = 'Cálculo ' + (s.si + 1) + ' de ' + s.n;
  else if (s.tipo === 'problema') etiqueta = 'Problema ' + (s.pi + 1) + ' de ' + s.n;
  else if (s.tipo === 'code') etiqueta = 'Ejercicio ' + (s.ejercicio + 1) + ' de ' + s.total_ejercicios;
  else if (s.tipo === 'code_explica') etiqueta = '¿Cómo se juega?';
  else if (s.tipo === 'final') etiqueta = '¡Resultado!';
  else if (s.tipo === 'portada') etiqueta = 'Empieza';
  else if (s.nivelIndex != null) etiqueta = `Diapositiva ${s.nivelIndex + 1}`;
  else etiqueta = 'Pantalla ' + (pantallaIdx + 1) + ' de ' + total;
  document.getElementById('player-content').innerHTML = `
    <div class="kp-top">
      <button type="button" class="kp-nav-btn kp-salir" onclick="cerrarPlayer()" title="Salir de la actividad"><span class="material-symbols-rounded">close</span><span class="kp-salir-txt">Salir</span></button>
      <div class="kp-progress" aria-hidden="true">
        <span class="kp-progress-label">${esc(etiqueta)}</span>
        <div class="kp-progress-track"><div class="kp-progress-bar" style="width:${pct}%"></div></div>
      </div>
      <div class="kp-score-chips" aria-label="Resultado">
        <span class="kp-chip-level" title="Tu nivel"><span class="material-symbols-rounded" aria-hidden="true">emoji_events</span> Nv ${progNivel}</span>
        <span class="kp-chip-score ok"><span class="material-symbols-rounded">check_circle</span>${kpScore.verdes}</span>
        <span class="kp-chip-score bad"><span class="material-symbols-rounded">cancel</span>${kpScore.rojos}</span>
      </div>
    </div>
    <div class="kp-nav-row">
      <button type="button" class="kp-nav-btn" onclick="pantallaPrev()" ${(pantallaIdx === 0 || s.tipo === 'final') ? 'disabled' : ''} title="Anterior"><span class="material-symbols-rounded">chevron_left</span></button>
      <span class="kp-dots">${pantallas.map((_, i) => `<span class="kp-dot ${i === pantallaIdx ? 'on' : ''}"></span>`).join('')}</span>
      <button type="button" class="kp-nav-btn" onclick="pantallaNext()" ${pantallaIdx === pantallas.length - 1 ? 'disabled' : ''} title="Siguiente"><span class="material-symbols-rounded">chevron_right</span></button>
    </div>
    <div class="kp-stage" aria-live="polite">${cuerpo}</div>`;
  clearInterval(calcTimer);
  if (s.tipo === 'calculo') iniciarTimerCalculo();
  if (s.tipo === 'mapa') iniciarMapa(pantallaIdx);
  if (s.tipo === 'portada') cargarPortadaImg(pantallaIdx);
  if (s.tipo === 'code') { kpCodeDibujarEscenario(); kpCodePintarPrograma(); }

  // Accesibilidad: exponer el texto de la pantalla para la lectura con audio
  document.dispatchEvent(new CustomEvent('junior:texto', { detail: textoPantallaWeb(s) }));
}

// Overlay de feedback (éxito/error) con ARIA y foco accesible
function asegurarFeedback() {
  if (document.getElementById('kp-feedback')) return;
  const fb = document.createElement('div');
  fb.id = 'kp-feedback';
  fb.className = 'kp-feedback hidden';
  fb.setAttribute('role', 'dialog');
  fb.setAttribute('aria-modal', 'true');
  fb.setAttribute('aria-label', 'Resultado de la respuesta');
  const m = document.getElementById('game-page');
  (m || document.body).appendChild(fb);
}
function mostrarFeedback(acierto, correctaTexto, onNext) {
  const fb = document.getElementById('kp-feedback');
  if (!fb) { if (onNext) onNext(); return; }
  window.__kpNext = function () { ocultarFeedback(); if (window.pjSonido) pjSonido.pop(); if (onNext) onNext(); };
  fb.innerHTML = acierto
    ? `<div class="kp-fb-card kp-fb-ok" role="alert">
        <div class="kp-fb-ico"><span class="material-symbols-rounded">check_circle</span></div>
        <h3 class="kp-fb-title">¡Correcto!</h3>
        <p class="kp-fb-sub">Has sumado +1 punto verde. ¡Sigue así!</p>
        <button type="button" class="kp-btn kp-fb-next" onclick="window.__kpNext()">Siguiente</button>
      </div>`
    : `<div class="kp-fb-card kp-fb-bad" role="alert">
        <div class="kp-fb-ico"><span class="material-symbols-rounded">cancel</span></div>
        <h3 class="kp-fb-title">Casi lo logras</h3>
        <p class="kp-fb-sub">La respuesta correcta era «${esc(correctaTexto)}».</p>
        <button type="button" class="kp-btn kp-fb-next" onclick="window.__kpNext()">Continuar</button>
      </div>`;
  fb.classList.remove('hidden');
  const nb = fb.querySelector('.kp-fb-next');
  if (nb) nb.focus();
}
function ocultarFeedback() {
  const fb = document.getElementById('kp-feedback');
  if (fb) fb.classList.add('hidden');
}

function textoPantallaWeb(s) {
  if (s.tipo === 'portada') return 'Actividad ' + (s.tit || '') + '. ' + (s.desc || '');
  if (s.tipo === 'texto') { const b = bloquesJuego[s.bi]; return 'Explicación. ' + (b.contenido || ''); }
  if (s.tipo === 'esquema') { const b = bloquesJuego[s.bi]; return String(b.aria_label || b.titulo || 'Esquema interactivo'); }
  if (s.tipo === 'test') { const p = bloquesJuego[s.bi].preguntas[s.pi]; return p ? (p.pregunta || '') : ''; }
  if (s.tipo === 'sopa') return 'Encuentra las palabras';
  if (s.tipo === 'relacionar') return 'Relaciona las parejas';
  if (s.tipo === 'ordenar') return 'Ordena los elementos';
  if (s.tipo === 'completar') return 'Completa las frases';
  if (s.tipo === 'calculo') { const b = bloquesJuego[s.bi]; const su = (b.sumas || [])[s.si] || {}; return 'Calcula: ' + (Number(su.a) || 0) + ' ' + opSimbolo(operacionDe(su, b)) + ' ' + (Number(su.b) || 0); }
  if (s.tipo === 'problema') { const b = bloquesJuego[s.bi]; const p = (b.problemas || [])[s.pi] || {}; return 'Problema. ' + (p.enunciado || '') + ' ' + (p.frase || p.pregunta || '¿Cuánto es?'); }
  if (s.tipo === 'mapa') return 'Localiza en el mapamundi: ' + (s.pide || '');
  if (s.tipo === 'code') return 'Placeta Junior Code. Ejercicio ' + ((s.ejercicio || 0) + 1) + '. ' + (s.objetivo_texto || 'Lleva a Candela hasta la estrella.');
  if (s.tipo === 'code_explica') return 'Placeta Junior Code. ' + (s.explicacion || 'Pulsa los bloques para programar a Candela.');
  if (s.tipo === 'final') return '¡Enhorabuena! Actividad completada.';
  return '';
}

// ── Cálculo mental (reproductor) ──────────────────────────────────────
let calcTimer = null;
let calcAutoTimer = null;
// Avanza solo al siguiente ejercicio del cálculo mental (o al final)
function avanzarCalculo() {
  clearTimeout(calcAutoTimer);
  if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
  renderPantalla();
}
function numTile(n) { return `<span class="kp-numtile">${n}</span>`; }
function screenCalculo(s, est) {
  const b = bloquesJuego[s.bi];
  const suma = (b.sumas || [])[s.si] || { a: 0, b: 0 };
  const a = Number(suma.a) || 0, bb = Number(suma.b) || 0;
  const op = operacionDe(suma, b);
  const totalSeg = Math.max(1, Number(b.segundos) || 10);
  const gridVertical = s.vertical ? verticalOperacionInputHTML(a, bb, op, s.llevadas !== false, 'c' + pantallaIdx) : null;
  const calcCuerpo = gridVertical || `<div class="kp-calc">${numTile(a)} <span class="kp-calc-op">${opSimbolo(op)}</span> ${numTile(bb)} <span class="kp-calc-op">=</span> <span class="kp-calc-q">?</span></div>`;
  let html = `<div class="kp-screen kp-calc-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">calculate</span> Cálculo mental · ${s.si + 1} / ${s.n || 1}</div>
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
  const b = bloquesJuego[s.bi];
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
  if ((bloquesJuego[s.bi] || {}).modo === 'escribir') {
    const v = parseFloat(document.getElementById('kp-calc-input')?.value);
    if (isNaN(v)) return;
    ok = Math.abs(v - est.correcta) < 0.001;
  } else {
    ok = (est.opciones || [])[k] === est.correcta;
  }
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  clearInterval(calcTimer); calcTimer = null;
  renderPantalla();
  mostrarFeedback(ok, 'La respuesta era ' + est.correcta, avanzarCalculo);
  clearTimeout(calcAutoTimer);
  calcAutoTimer = setTimeout(avanzarCalculo, 1400);
}
function kpResponderCalculoVertical(idx) {
  const s = pantallas[idx], est = kpEstado[idx];
  if (!est || est.respondida) return;
  const ok = verificarVerticales(document);
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  clearInterval(calcTimer); calcTimer = null;
  renderPantalla();
  mostrarFeedback(ok, 'La respuesta era ' + est.correcta, avanzarCalculo);
  clearTimeout(calcAutoTimer);
  calcAutoTimer = setTimeout(avanzarCalculo, 1400);
}
function screenProblema(s, est) {
  const b = bloquesJuego[s.bi];
  const p = (b.problemas || [])[s.pi] || {};
  const enunciado = String(p.enunciado || '').trim();
  const frase = String(p.frase || p.pregunta || '').trim();
  const fraseHtml = frase
    ? `<div class="kp-problema-pregunta">${esc(frase).replace(/___/g, '<span class="kp-hueco">___</span>')}</div>`
    : `<div class="kp-problema-pregunta">¿Cuánto es?</div>`;
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">description</span> Problemas · ${s.pi + 1} / ${s.n || 1}</div>
    <div class="kp-problema-card">
      <div class="kp-problema-texto">${esc(enunciado)}</div>
      ${fraseHtml}
    </div>`;
  const ops = (p.operaciones || []).filter(o => o && (o.a != null || o.b != null));
  if (ops.length) {
    const esEscribir = b.modo !== 'opciones';
    html += `<div class="kp-operaciones"><div class="kp-operaciones-titulo">✏️ Resuelve paso a paso</div>
      <div class="kp-hint">Haz cada operación como en papel. Comprueba un paso antes de pasar al siguiente.</div>`;
    ops.forEach((o, oi) => {
      html += `<div class="kp-paso-operacion"><strong>Paso ${oi + 1}</strong>`;
      const v = esEscribir
        ? verticalOperacionInputHTML(o.a, o.b, o.op || 'suma', true, 'p' + pantallaIdx + '-' + oi)
        : verticalOperacionHTML(o.a, o.b, o.op || 'suma', true);
      if (v) html += v;
      html += `</div>`;
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
  if ((bloquesJuego[s.bi] || {}).modo === 'opciones') {
    ok = (est.opciones || [])[k] === est.correcta;
  } else {
    const v = parseFloat(document.getElementById('kp-problema-input')?.value);
    if (isNaN(v)) return;
    const verticalesOk = verificarVerticales(document);
    ok = Math.abs(v - est.correcta) < 0.001 && verticalesOk;
  }
  est.respondida = true; est.acierto = ok;
  if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  renderPantalla();
  mostrarFeedback(ok, 'La respuesta era ' + est.correcta, function () {
    if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
    renderPantalla();
  });
}
function kpTimeoutCalculo(idx) {
  const est = kpEstado[idx];
  if (est && !est.respondida) {
    est.respondida = true; est.acierto = false; kpScore.rojos++;
    if (window.pjSonido) pjSonido.error();
    renderPantalla();
    mostrarFeedback(false, 'La respuesta era ' + est.correcta, avanzarCalculo);
    clearTimeout(calcAutoTimer);
    calcAutoTimer = setTimeout(avanzarCalculo, 1600);
  }
}

// Escena declarativa segura: no acepta HTML/SVG crudo. Solo pinta primitivas
// conocidas y acciones popup declaradas por la plataforma.
function screenEsquema(s, est) {
  const b = bloquesJuego[s.bi] || {};
  const sc = b.esquema || b.escena || b;
  const w = Math.max(100, Math.min(1200, Number(sc.ancho) || 800));
  const h = Math.max(80, Math.min(900, Number(sc.alto) || 450));
  const color = v => /^#[0-9a-f]{6}$/i.test(String(v || '')) ? v : '#ffffff';
  const num = (v, d = 0) => Number.isFinite(Number(v)) ? Number(v) : d;
  let body = '';
  (Array.isArray(sc.elementos) ? sc.elementos : []).forEach((e, i) => {
    const x = num(e.x), y = num(e.y), ew = num(e.ancho, 100), eh = num(e.alto, 50);
    const fill = color(e.color || e.relleno), stroke = color(e.borde || '#000000');
    const label = esc(e.aria_label || e.texto || 'Elemento del esquema');
    if (e.tipo === 'rectangulo') body += `<rect x="${x}" y="${y}" width="${ew}" height="${eh}" rx="${Math.max(0, num(e.radio, 0))}" fill="${fill}" stroke="${stroke}"/>`;
    else if (e.tipo === 'circulo') body += `<circle cx="${x}" cy="${y}" r="${Math.max(1, num(e.radio, 20))}" fill="${fill}" stroke="${stroke}"/>`;
    else if (e.tipo === 'linea') body += `<line x1="${x}" y1="${y}" x2="${num(e.x2)}" y2="${num(e.y2)}" stroke="${stroke}" stroke-width="${Math.max(1, num(e.grosor, 2))}"/>`;
    else if (e.tipo === 'texto') { const fs=Math.max(10,Math.min(64,num(e.tamano,20))), maxChars=Math.max(8,Math.floor(ew/(fs*.55))), words=String(e.texto||'').split(/\s+/), lines=[];let line='';words.forEach(word=>{if((line+' '+word).trim().length>maxChars){if(line)lines.push(line);line=word;}else line=(line+' '+word).trim();});if(line)lines.push(line);body += `<text x="${x}" y="${y+fs}" fill="${color(e.color||'#111111')}" font-family="inherit" font-size="${fs}" font-weight="${e.negrita?'700':'400'}" aria-label="${label}">${lines.slice(0,Math.max(1,Math.floor(eh/(fs*1.25)))).map((l,k)=>`<tspan x="${x}" dy="${k?fs*1.25:0}">${esc(l)}</tspan>`).join('')}</text>`; }
    if (e.accion?.tipo === 'popup') { const hit=e.tipo==='circulo'?`<circle cx="${x}" cy="${y}" r="${Math.max(24,num(e.radio,20)+8)}" fill="transparent"/>`:`<rect x="${x}" y="${y}" width="${Math.max(ew,48)}" height="${Math.max(eh,48)}" fill="transparent"/>`;body += `<g class="pj-schema-action" tabindex="0" role="button" aria-label="${label}" onclick="abrirEsquemaPopup(${s.bi},${i})" onkeydown="if(event.key==='Enter'||event.key===' ')abrirEsquemaPopup(${s.bi},${i})">${hit}</g>`; }
  });
  return `<div class="kp-screen"><div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">extension</span> ${esc(b.titulo || 'Esquema')}</div><div class="pj-esquema" role="group" aria-label="${esc(b.aria_label || b.titulo || 'Esquema visual')}"><svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" focusable="false" xmlns="http://www.w3.org/2000/svg">${body}</svg></div><div class="kp-hint">👆 Pulsa los elementos destacados para ver más información</div><div style="text-align:center;margin-top:14px;"><button class="kp-check" onclick="pantallaNext()">Continuar →</button></div></div>`;
}

function screenInteractive(s, est) {
  const b=bloquesJuego[s.bi], d=b.datos||{}, tipo=b.tipo;
  const opts = tipo==='detective' ? d.opciones||[] : tipo==='laboratorio' ? (d.opciones||[]).map(x=>String(x).split('|')[0]) : tipo==='construccion' ? d.piezas||[] : tipo==='exploracion' ? (d.lugares||[]).map(x=>String(x).split('|')[0]) : tipo==='historia_interactiva' ? ((d.escenas||[])[0]?.opciones||[]) : [];
  let body=`<div class="kp-screen kp-interactive"><div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">${tipo==='arrastrar'?'drag_indicator':tipo==='buscar'?'search':tipo==='detective'?'visibility':tipo==='laboratorio'?'science':tipo==='construccion'?'construction':tipo==='presupuesto'?'shopping_cart':tipo==='exploracion'?'explore':tipo==='simulacion'?'casino':'menu_book'}</span> ${esc(b.titulo||tipo)}</div><p>${esc(b.instrucciones||'Completa este reto.')}</p>`;
  if(tipo==='buscar') body+=`<div class="kp-scene">${(d.objetos||[]).map((x,i)=>{const a=String(x).split('|');return `<button class="kp-scene-object ${est.seleccion?.includes(i)?'selected':''}" onclick="kpBuscarObjeto(${s.bi},${i})">${esc(a[0])}<small>${esc(a[1]||'')}</small></button>`}).join('')}</div>`;
  else if(tipo==='simulacion') body+=`<p>${esc(d.pregunta||'Lanza el dado y observa los resultados.')}</p><button class="kp-btn" onclick="kpLanzarDado(${s.bi})">🎲 LANZAR DADO</button><div class="kp-results">${(est.lanzamientos||[]).join(' · ')}</div>`;
  else if(tipo==='memoria') body+=`<p>Encuentra dos tarjetas iguales:</p><div class="kp-memory">${(d.tarjetas||[]).map((x,i)=>`<button class="kp-memory-card" onclick="kpMemoriaJuego(${s.bi},${i})">${est.reveladas?.includes(i)?esc(x):'?'}</button>`).join('')}</div>`;
  else if(tipo==='sonido') body+=`${d.audio_url?`<audio controls src="${esc(d.audio_url)}"></audio>`:''}<p>Escucha y elige:</p><div class="kp-opts">${(d.opciones||[]).map((o,i)=>`<button class="kp-opt" onclick="kpResponderInteractivo(${s.bi},'${esc(o)}',${i})">${esc(o)}</button>`).join('')}</div>`;
  else if(tipo==='codigo_secreto') body+=`${(d.pistas||[]).map((p,i)=>`<div class="kp-hint">Pista ${i+1}: ${esc(p)}</div>`).join('')}<input id="kp-secret" class="kp-input" placeholder="Contraseña"><button class="kp-btn" onclick="kpSecretoJuego(${s.bi})">Desbloquear</button>`;
  else if(tipo==='escape_room') body+=`${(d.pruebas||[]).map((p,i)=>`<p>${esc(p.pregunta||'')}</p><div class="kp-opts">${(p.opciones||[]).map((o,k)=>`<button class="kp-opt" onclick="kpEscapeJuego(${s.bi},${i},${k})">${esc(o)}</button>`).join('')}</div>`).join('')}`;
  else if(tipo==='presupuesto') body += screenPresupuesto(s, est);
  else if(tipo==='dinero_euro') body += screenDineroEuro(s, est);
  else if(['construir_frase','clasificar_palabras','completar_palabra','cazador_errores','lectura_interactiva'].includes(tipo)) body += screenLengua(s, est);
  else if(tipo==='arrastrar') body+=`<p>Elige una categoría para colocar los elementos:</p><div class="kp-drop-zones">${(d.zonas||[]).map(z=>`<button class="kp-zone" onclick="kpResponderInteractivo(${s.bi},'${esc(z)}')">${esc(z)}</button>`).join('')}</div>`;
  else body+=`${(d.pistas||[]).map((p,i)=>`<div class="kp-hint">Pista ${i+1}: ${esc(p)}</div>`).join('')}<div class="kp-opts">${opts.map((o,i)=>`<button class="kp-opt" onclick="kpResponderInteractivo(${s.bi},'${esc(o)}',${i})">${esc(o)}</button>`).join('')}</div>`;
  return body+((est.respondida)?`<div class="kp-msg ${est.acierto?'ok':'bad'}">${est.acierto?'¡Muy bien! 🎉':'Prueba otra vez 💪'}</div>`:'')+'</div>';
}
function kpResponderInteractivo(bi,val,pos){const e=kpEstado[pantallaIdx],d=bloquesJuego[bi].datos||{};if(e.respondida)return;if(d.solucion){e.seleccion=e.seleccion||[];e.seleccion.push(val);if(e.seleccion.length<d.solucion.length){renderPantalla();return;}}const good=d.correcta!==undefined?(pos!==undefined?Number(pos)===Number(d.correcta):String(val).toLowerCase()===String(d.correcta).toLowerCase()):d.respuesta?String(val).toLowerCase()===String(d.respuesta).toLowerCase():d.respuestas?Object.values(d.respuestas).includes(val):(d.correctas||[]).includes(val)||((d.opciones||[])[pos]||'').split('|')[2]==='1';e.respondida=true;e.acierto=good;if(good)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}
function kpBuscarObjeto(bi,i){const e=kpEstado[pantallaIdx],d=bloquesJuego[bi].datos||{};e.seleccion=e.seleccion||[];if(!e.seleccion.includes(i))e.seleccion.push(i);if(e.seleccion.length>=Number(d.objetivo||1)){e.respondida=true;e.acierto=e.seleccion.filter(k=>String((d.objetos||[])[k]).split('|')[2]==='1').length>=Number(d.objetivo||1);if(e.acierto)kpScore.verdes++;else kpScore.rojos++;}renderPantalla();}
function kpLanzarDado(bi){const e=kpEstado[pantallaIdx];e.lanzamientos.push(1+Math.floor(Math.random()*Number(bloquesJuego[bi].datos?.caras||6)));renderPantalla();}
function screenPresupuesto(s, est) { const d=bloquesJuego[s.bi].datos||{}, max=Number(d.presupuesto||20), productos=d.productos||[], carrito=est.carrito||{}, gastado=Number(est.gastado||0), pct=Math.min(100,Math.round(gastado/max*100)); return `<div class="pj-shop-board"><div class="pj-shop-cart">🛒 <strong>MI CARRITO</strong><span>${Object.values(carrito).reduce((a,n)=>a+Number(n),0)} artículos · ${gastado.toFixed(2)} Pz</span></div><div class="pj-shop-budget"><span>💰 Te quedan <strong>${Math.max(0,max-gastado).toFixed(2)} Pz</strong></span><div><i style="width:${pct}%"></i></div><small>Has gastado el ${pct}% de tu presupuesto</small></div><div class="kp-shop">${productos.map((x,i)=>{const a=String(x).split('|'),p=Number(a[2])||0,q=Number(carrito[i]||0);return `<div class="pj-shop-item ${q?'in-cart':''}"><span class="pj-shop-emoji">${esc(a[0])}</span><span class="pj-shop-name"><strong>${esc(a[1]||'Producto')}</strong><small>${p.toFixed(2)} Pz · ${q?'En carrito: '+q:'Disponible'}</small></span><button class="kp-chip" ${gastado+p>max?'disabled':''} onclick="kpComprarProducto(${s.bi},${p},${i})">＋ Añadir</button></div>`}).join('')}</div><div class="pj-shop-receipt">🧾 ${Object.keys(carrito).length?'Compra en curso · cada producto se mete en tu carrito':'El carrito está vacío'}</div><button class="kp-btn" ${gastado<=0?'disabled':''} onclick="kpTerminarInteractivo()">✅ Terminar compra</button></div>`; }
function kpComprarProducto(bi,n,i){const e=kpEstado[pantallaIdx],max=Number(bloquesJuego[bi].datos?.presupuesto||0);if((e.gastado||0)+n<=max){e.gastado=(e.gastado||0)+n;e.carrito=e.carrito||{};e.carrito[i]=(e.carrito[i]||0)+1;}renderPantalla();}
function screenDineroEuro(s, est) {
  const d = bloquesJuego[s.bi].datos || {}, objetivo = Number(d.objetivo || d.cantidad || 5), elegido = est.euroElegido || [], total = elegido.reduce((a, n) => a + Number(n), 0);
  const monedas = d.monedas || [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 2], billetes = d.billetes || [5, 10, 20];
  const pieza = n => `<button class="pj-money-piece ${Number(n)>=5?'pj-bill':'pj-coin'}" onclick="kpDineroEuro(${s.bi},${Number(n)})"><span>${Number(n)>=5?'💶':'🪙'}</span><strong>${Number(n).toFixed(2)} €</strong></button>`;
  return `<div class="pj-money-board"><div class="pj-money-target">🎯 Forma <strong>${objetivo.toFixed(2)} €</strong></div><div class="pj-money-total">Tu hucha: <strong>${total.toFixed(2)} €</strong><small>${total===objetivo?'¡Exacto! 🎉':total>objetivo?'Te has pasado':'Añade monedas o billetes'}</small></div><h4>🪙 Monedas</h4><div class="pj-money-grid">${monedas.map(pieza).join('')}</div><h4>💶 Billetes</h4><div class="pj-money-grid">${billetes.map(pieza).join('')}</div><div class="pj-money-chosen">${elegido.length?elegido.map(n=>`<span>${Number(n)>=5?'💶':'🪙'} ${Number(n).toFixed(2)} €</span>`).join(''):'Todavía no has elegido nada'}</div><button class="kp-btn" ${total!==objetivo?'disabled':''} onclick="kpTerminarInteractivo()">${total===objetivo?'✅ Comprobar cantidad':'Completa la cantidad exacta'}</button></div>`;
}
function kpDineroEuro(bi, n) { const e=kpEstado[pantallaIdx], d=bloquesJuego[bi].datos||{}, objetivo=Number(d.objetivo||d.cantidad||5), total=(e.euroElegido||[]).reduce((a,v)=>a+Number(v),0); if(total+Number(n)<=objetivo){e.euroElegido=[...(e.euroElegido||[]),Number(n)]; if(window.pjSonido)window.pjSonido.clic?.(); renderPantalla();} }
function datosClasificar(d){
  if(typeof d==='string'){try{d=JSON.parse(d);}catch(_){d={};}}
  if(d&&d.datos&&typeof d.datos==='object')d={...d,...d.datos};
  if(d&&d.contenido&&typeof d.contenido==='object'&&!Array.isArray(d.contenido))d={...d,...d.contenido};
  const respuestas=d&&d.respuestas;
  const mapa=respuestas&&typeof respuestas==='object'&&!Array.isArray(respuestas)?respuestas:{};
  const raw=Array.isArray(d?.elementos)?d.elementos:(Array.isArray(d?.palabras)?d.palabras:(Array.isArray(d?.items)?d.items:(Array.isArray(respuestas)?respuestas:Object.keys(mapa).map(texto=>({texto,categoria:mapa[texto]})))));
  const items=raw.map(x=>{if(typeof x==='string'){const p=x.split('|');return {texto:p[0]||'',categoria:p[1]||p[2]||mapa[p[0]]||''};}const texto=x?.texto??x?.palabra??x?.nombre??x?.enunciado??x?.palabra_texto??'';return {texto,categoria:x?.categoria??x?.categoriaCorrecta??x?.categoria_correcta??x?.categoriaId??x?.categoria_id??x?.respuesta??x?.correcta??x?.tipo??mapa[texto]??''};}).filter(x=>String(x.texto).trim()&&String(x.categoria).trim());
  const cats=(Array.isArray(d?.categorias)?d.categorias:(Array.isArray(d?.categorias_palabras)?d.categorias_palabras:[])).map(x=>typeof x==='string'?x:(x?.nombre??x?.titulo??x?.texto??x?.id??'')).filter(Boolean);
  return {items,cats:[...new Set(cats.length?cats:items.map(x=>x.categoria).filter(Boolean))]};
}
function screenLengua(s,e){const b=bloquesJuego[s.bi],d=b.datos||b,t=s.tipo;if(t==='construir_frase')return `<div class="pj-language-card"><div class="pj-language-goal">🧩 Ordena las palabras</div><p class="pj-spelling">${(d.palabras||[]).map((w,i)=>`<button class="pj-word" onclick="kpLengua(${s.bi},${i})">${esc(w)}</button>`).join(' ')}</p><p>Construcción: ${esc((e.palabras||[]).join(' '))}</p><button class="kp-btn" onclick="kpLenguaCheck(${s.bi})">Comprobar</button></div>`;if(t==='completar_palabra')return `<div class="pj-language-card"><div class="pj-language-goal">✏️ Completa la palabra</div><p class="pj-spelling">${esc((d.ejercicios||[d])[0].texto||'')}</p><div class="pj-word-bank">${((d.ejercicios||[d])[0].opciones||[]).map(o=>`<button class="pj-word" onclick="kpLenguaValue(${s.bi},'${esc(o)}')">${esc(o)}</button>`).join('')}</div></div>`;if(t==='cazador_errores')return `<div class="pj-language-card"><div class="pj-language-goal">🔎 Encuentra el error</div><p class="pj-error-sentence">${String(d.texto||'').split(/(\s+)/).map(x=>/\w/.test(x)?`<button class="pj-error-word" onclick="kpLenguaValue(${s.bi},'${esc(x)}')">${esc(x)}</button>`:x).join('')}</p></div>`;if(t==='lectura_interactiva'){const sc=(d.escenas||[])[e.escena||0]||d;return `<div class="pj-language-card pj-reading"><div class="pj-language-goal">📖 ${esc(sc.titulo||'Historia')}</div><p>${esc(sc.texto||'')}</p><div class="kp-opts">${(sc.opciones||[]).map((o,i)=>`<button class="kp-opt" onclick="kpLectura(${s.bi},${i})">${esc(o.texto||o)}</button>`).join('')}</div></div>`;}if(t==='clasificar_palabras'){const c=datosClasificar(d),i=Math.min(e.clasificarIndice||0,Math.max(0,c.items.length-1)),item=c.items[i];return `<div class="pj-language-card pj-classify"><div class="pj-language-goal">🔤 Clasifica las palabras</div><p>Palabra <strong>${c.items.length?i+1:0}</strong> de ${c.items.length}</p><div class="pj-classify-word">${esc(item?.texto||'No hay palabras configuradas')}</div><p class="pj-classify-label">Elige su categoría:</p><div class="pj-classify-categories">${c.cats.map(x=>`<button class="kp-opt" onclick="kpClasificar(${s.bi},'${esc(x)}')">${esc(x)}</button>`).join('')}</div>${e.error?`<div class="kp-msg bad">${esc(e.error)}</div>`:''}${e.respondida?`<div class="kp-msg ok">¡Has clasificado todas las palabras! 🎉</div>`:''}</div>`;}return `<div class="pj-language-card"><div class="pj-language-goal">🎯 Completa este reto</div></div>`;}
function kpLengua(bi,i){const e=kpEstado[pantallaIdx],d=bloquesJuego[bi].datos||bloquesJuego[bi];e.palabras=e.palabras||[];if(!e.palabras.includes(d.palabras[i]))e.palabras.push(d.palabras[i]);renderPantalla();}function kpLenguaValue(bi,v){const e=kpEstado[pantallaIdx];e.valor=v;renderPantalla();}function kpLenguaCheck(bi){const d=bloquesJuego[bi].datos||bloquesJuego[bi],e=kpEstado[pantallaIdx];e.respondida=true;e.acierto=(e.palabras||[]).join(' ')===d.respuesta;if(e.acierto)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}function kpClasificar(bi,categoria){const d=bloquesJuego[bi].datos||bloquesJuego[bi],e=kpEstado[pantallaIdx],c=datosClasificar(d),i=Number(e.clasificarIndice||0),item=c.items[i];if(e.respondida||!item)return;if(String(item.categoria).trim().toLowerCase()!==String(categoria).trim().toLowerCase()){e.error='Esa no es la categoría. ¡Prueba otra vez!';kpScore.rojos++;renderPantalla();return;}e.error='';e.clasificarRespuestas=e.clasificarRespuestas||{};e.clasificarRespuestas[i]=categoria;kpScore.verdes++;if(i+1>=c.items.length){e.respondida=true;e.acierto=true;}else{e.clasificarIndice=i+1;}renderPantalla();}function kpLectura(bi,i){const d=bloquesJuego[bi].datos||bloquesJuego[bi],e=kpEstado[pantallaIdx],sc=(d.escenas||[])[e.escena||0]||{},o=(sc.opciones||[])[i]||{};if(o.siguiente!=null){e.escena=Number(o.siguiente);renderPantalla();}else{e.respondida=true;e.acierto=true;kpScore.verdes++;renderPantalla();}}
function kpTerminarInteractivo(){const e=kpEstado[pantallaIdx];if(e.respondida||e.autoAvanzando)return;e.respondida=true;e.acierto=true;kpScore.verdes++;const bi=pantallas[pantallaIdx]?.bi;renderPantalla();if(['presupuesto','dinero_euro'].includes(bloquesJuego[bi]?.tipo)){e.autoAvanzando=true;setTimeout(()=>{if(pantallas[pantallaIdx]?.bi===bi)pantallaNext();},900);}}
function kpMemoriaJuego(bi,i){const e=kpEstado[pantallaIdx],cards=bloquesJuego[bi].datos?.tarjetas||[];e.reveladas=e.reveladas||[];if(!e.reveladas.includes(i))e.reveladas.push(i);if(e.reveladas.length>=2){const a=e.reveladas.slice(-2);e.respondida=true;e.acierto=cards[a[0]]===cards[a[1]];if(e.acierto)kpScore.verdes++;else kpScore.rojos++;}renderPantalla();}
function kpSecretoJuego(bi){const e=kpEstado[pantallaIdx],v=document.getElementById('kp-secret')?.value.trim();if(!v)return;e.respondida=true;e.acierto=v.toLowerCase()===String(bloquesJuego[bi].datos?.contraseña||'').toLowerCase();if(e.acierto)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}
function kpEscapeJuego(bi,pi,oi){const e=kpEstado[pantallaIdx],p=(bloquesJuego[bi].datos?.pruebas||[])[pi]||{};e.respondida=true;e.acierto=oi===Number(p.correcta);if(e.acierto)kpScore.verdes++;else kpScore.rojos++;renderPantalla();}

function abrirEsquemaPopup(bi, ei) {
  const b = bloquesJuego[bi] || {}, sc = b.esquema || b.escena || b, e = (sc.elementos || [])[ei];
  const p = e && e.accion && e.accion.tipo === 'popup' ? e.accion : null;
  if (!p) return;
  const old = document.getElementById('pj-schema-popup'); if (old) old.remove();
  const box = document.createElement('div'); box.id = 'pj-schema-popup'; box.className = 'pj-schema-popup'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
  box.innerHTML = `<div class="pj-schema-popup-card"><h3>${esc(p.titulo || 'Información')}</h3><p>${esc(p.contenido || '')}</p><button class="kp-btn" type="button">Cerrar</button></div>`;
  box.querySelector('button').onclick = () => box.remove(); document.body.appendChild(box); box.querySelector('button').focus();
}

function screenTexto(s, est) {
  const b = bloquesJuego[s.bi];
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">menu_book</span> ${esc(b.titulo || 'Aprende')}</div>`;
  if (imagenDePJ(b)) html += kpImg(imagenDePJ(b), b.fuente, b.imagen_alt || b.imagenAlt);
  html += `<div class="kp-explicacion">${formatearTextoJugador(obtenerContenidoTextoPJ(b))}`;
  html += `</div>`;
  html += `<div style="text-align:center;margin-top:14px;"><button class="kp-check" onclick="pantallaNext()">Continuar →</button></div>`;
  html += `<div class="kp-hint">📖 Lee y luego pulsa Continuar para responder</div></div>`;
  return html;
}

function screenPortada(s) {
  // Si hay una partida en curso guardada, ofrecer "Continuar"
  const enCurso = window.PJPartidas && actividadActual && actividadActual.id
    ? PJPartidas.estaEnCurso(actividadActual.id) : false;
  return `
    <div class="kp-screen">
      <div class="kp-cover-img" id="kp-portada-img"><span class="kp-cover-emoji">${emojiCat(s.cat)}</span></div>
      <h3 class="kp-title">${esc(s.tit)}</h3>
      <p class="kp-desc">${esc(s.desc)}</p>
      <div class="kp-chips">
        <span class="kp-chip chip-${chipColor(s.cat)}">${esc(s.cat)}</span>
        <span class="kp-chip">👧 ${esc(s.edad)}</span>
        <span class="kp-chip">⭐ ${esc(s.dif)}</span>
        <span class="kp-chip">⏱️ ${esc(s.tiempo)} min</span>
      </div>
      ${enCurso ? `<div class="kp-msg ok" style="margin-top:10px;">💾 Tienes una partida en curso. ¡Puedes continuar!</div>` : ''}
      <button type="button" class="kp-btn kp-start" onclick="${enCurso ? 'continuarPartida()' : 'pantallaNext()'}">${enCurso ? '▶ Continuar' : '🚀 ¡Empezar!'}</button>
      <div class="kp-hint">${enCurso ? 'Pulsa «Continuar» para seguir donde lo dejaste.' : '👆 Pulsa «¡Empezar!» cuando estés listo.'}</div>
    </div>`;
}

// Continúa la partida guardada (salta a la pantalla donde se quedó)
function continuarPartida() {
  if (window.pjSonido) pjSonido.hoja();
  const s = pantallas[pantallaIdx];
  if (s && s.tipo === 'portada') {
    // Ya está restaurado pantallaIdx al abrir; si está en 0, ir a la guardada
    const partida = (window.PJPartidas && actividadActual && actividadActual.id) ? PJPartidas.get(actividadActual.id) : null;
    if (partida && partida.pantallaIdx && Number(partida.pantallaIdx) > 0) {
      pantallaIdx = Math.min(Number(partida.pantallaIdx), pantallas.length - 1);
    } else {
      pantallaIdx = 1;
    }
  } else {
    pantallaIdx = Math.min(pantallaIdx + 1, pantallas.length - 1);
  }
  renderPantalla();
}

// Carga la portada real (16:9) en la pantalla de inicio, en vez del emoji
function cargarPortadaImg(idx) {
  const el = document.getElementById('kp-portada-img');
  if (!el) return;
  const s = pantallas[idx];
  const a = actividadActual;
  const fill = (u) => {
    if (!u) return;
    el.style.backgroundImage = `url('${u}')`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    const em = el.querySelector('.kp-cover-emoji');
    if (em) em.remove();
  };
  const portada = a && (a.portada_url || a.portadaUrl || a.contenido?.__rspPortadaUrl || a.contenido?.__rsp_portada_url);
  if (portada) fill(portada);
  else if (typeof generarCaratula === 'function') {
    generarCaratula({ cat: s.cat, tit: s.tit, tipo: a ? a.tipo : '' }).then(fill);
  }
}

function screenTest(s, est) {
  const b = bloquesJuego[s.bi];
  const p = b.preguntas[s.pi];
  // Barajar SIEMPRE las opciones (permutación estable por pantalla).
  if (!est.opciones) est.opciones = shuffleArr(p.opciones.map((_, i) => i));
  const orden = est.opciones;
  const correcta = p.correcta;
  let html = `<div class="kp-screen kp-test">
    <div class="kp-qcard">
      <span class="kp-orb" aria-hidden="true"></span>
      <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">quiz</span> Pregunta ${s.pi + 1} de ${s.nPreg}</div>
      <div class="kp-q">${esc(p.pregunta || '…')}</div>`;
  if (p.imagen_url) html += kpImg(p.imagen_url, p.fuente, p.imagen_alt);
  if (p.pictograma) html += kpImg(p.pictograma, p.fuente, p.imagen_alt);
  html += `</div>`;
  html += `<div class="kp-answers">`;
  orden.forEach((k, idx) => {
    const op = p.opciones[k];
    let cls = 'kp-answer';
    if (est.respondida) {
      if (k === correcta) cls += ' ok';
      else if (k === est.sel) cls += ' bad';
      else cls += ' muted';
    }
    // No revelar la respuesta: icono neutro hasta que se responde
    const icono = !est.respondida
      ? 'chevron_right'
      : (k === correcta ? 'check_circle' : (k === est.sel ? 'cancel' : 'radio_button_unchecked'));
    html += `<button type="button" class="${cls}" onclick="kpResponder(${pantallaIdx},${k})" ${est.respondida ? 'disabled' : ''}>
      <span class="kp-letra">${'ABCDEFGH'[idx] || '•'}</span>
      <span class="kp-answer-txt">${esc(op || '…')}</span>
      <span class="kp-answer-ico"><span class="material-symbols-rounded">${icono}</span></span>
    </button>`;
  });
  html += `</div>`;
  return html;
}
function kpResponder(idx, k) {
  const s = pantallas[idx];
  const est = kpEstado[idx];
  if (est.respondida) return;
  est.respondida = true;
  est.sel = k;
  const b = bloquesJuego[s.bi];
  const p = b.preguntas[s.pi];
  est.acierto = (k === p.correcta);
  if (est.acierto) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  renderPantalla();
  mostrarFeedback(est.acierto, p.opciones[p.correcta], function () {
    if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
    renderPantalla();
  });
}

function screenSopa(s, est) {
  const b = bloquesJuego[s.bi];
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
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">abc</span> Sopa de letras</div>
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
  const b = bloquesJuego[s.bi];
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
  // Segundo toque: completar la palabra en línea recta (mucho más fácil en móvil)
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
  const word = cells.map(p => s.grid[p.r][p.c]).join('');
  comprobarSopa(idx, word);
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
function maxPuntosDePartida() {
  return pantallas.reduce((total, x) => {
    if (['portada', 'texto', 'final'].includes(x.tipo)) return total;
    const b = x.bi != null ? bloquesJuego[x.bi] : null;
    if (b?.tipo === 'clasificar_palabras') return total + datosClasificar(b.datos || b).items.length;
    return total + 1;
  }, 0);
}

function screenFinal(s) {
  const maxPuntos = pantallas.reduce((total, x) => {
    if (['portada', 'texto', 'final'].includes(x.tipo)) return total;
    const b = x.bi != null ? bloquesJuego[x.bi] : null;
    if (b?.tipo === 'clasificar_palabras') return total + datosClasificar(b.datos || b).items.length;
    return total + 1;
  }, 0);
  const recompensaMax = Number(actividadActual?.recompensa || actividadActual?.contenido?.recompensa || Math.floor(maxPuntos / 10)) || 0;
  const recompensa = recompensaMax > 0 && maxPuntos > 0
    ? Math.round(recompensaMax * Math.min(1, kpScore.verdes / maxPuntos)) : 0;
  // Si la actividad tiene más diapositivas/unidades por delante, ofrecemos
  // pasar a la siguiente; si no, solo volver al menú.
  const haySiguiente = (typeof window.pjHaySiguienteUnidad === 'function') && !!window.pjHaySiguienteUnidad();
  const acciones = `
      <div class="kp-end-actions">
        ${haySiguiente
          ? `<button type="button" class="kp-btn kp-btn-next" onclick="window.pjIrSiguienteUnidad()"><span class="material-symbols-rounded">arrow_forward</span> Ir a la siguiente unidad</button>`
          : ''}
        <button type="button" class="kp-btn ${haySiguiente ? 'kp-btn-ghost' : ''}" onclick="volverAlMenu()"><span class="material-symbols-rounded">home</span> Volver al menú</button>
      </div>`;
  return `
    <div class="kp-screen">
      <div class="kp-cover cover-${chipColor(s.cat)}">🎉</div>
      <h3 class="kp-title">¡Lo has conseguido!</h3>
      <p class="kp-desc">${esc(s.tit)}</p>
      <div class="kp-score">
        <div class="kp-score-item verdes"><span class="kp-score-num">🟢</span>${kpScore.verdes} <small>puntos verdes</small></div>
        <div class="kp-score-item rojos"><span class="kp-score-num">🔴</span>${kpScore.rojos} <small>puntos rojos</small></div>
      </div>
      <div class="kp-reward"><span class="material-symbols-rounded kp-reward-ico" aria-hidden="true">redeem</span> <strong>${recompensa} Pz</strong> ${recompensaMax > 0 ? `de ${recompensaMax} Pz máximas` : ''}</div>
      <div class="kp-save">
        <h4><span class="material-symbols-rounded" aria-hidden="true">save</span> Guardar mi progreso</h4>
        <p class="kp-save-sub">En la web el progreso es local. Guarda con tu DIP para sumar los puntos y recibir ${recompensa} Pz.</p>
        <div class="kp-save-row">
          <input id="kp-dip" type="text" inputmode="text" autocomplete="off"
            placeholder="Tu DIP (ej: 11111111D)" value="${esc(dipGuardado)}" maxlength="20">
          <button class="kp-btn" onclick="guardarProgreso()" ${guardandoDIP ? 'disabled' : ''}>${guardandoDIP ? 'Guardando…' : '<span class="material-symbols-rounded" aria-hidden="true">save</span> Guardar'}</button>
        </div>
        <div id="kp-msg" class="kp-msg ${msgGuardar.startsWith('✅') ? 'ok' : (msgGuardar ? 'bad' : '')}">${msgGuardar}</div>
      </div>
      ${acciones}
      <div class="kp-hint">💪 ¡Sigue así, campeón!</div>
    </div>`;
}

// Guardar el progreso (puntos verdes/rojos) con el DIP del junior
async function guardarProgreso() {
  const inp = document.getElementById('kp-dip');
  if (!inp) return;
  const dip = inp.value.trim();
  if (!dip) { msgGuardar = '❌ Escribe tu DIP para guardar.'; renderPantalla(); return; }
  if (!actividadActual || !actividadActual.id) { msgGuardar = '❌ No se puede guardar: actividad sin id.'; renderPantalla(); return; }
  guardandoDIP = true;
  renderPantalla();
  const respuestas = [];
  for (let i = 0; i < kpScore.verdes; i++) respuestas.push({ idx: i, correcta: true });
  for (let i = 0; i < kpScore.rojos; i++) respuestas.push({ idx: kpScore.verdes + i, correcta: false });
  try {
    const res = await fetch(`${API_BASE}/actividades/${actividadActual.id}/realizar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dip, respuestas, puntos_verdes: kpScore.verdes, puntos_rojos: kpScore.rojos, resultado_id: `${actividadActual.id}:final${actividadActual._unidadIndex != null ? `:unidad:${actividadActual._unidadIndex}` : ''}`, puntos_maximos: maxPuntosDePartida(), resultado_final: true, unidad: actividadActual._unidadIndex != null ? actividadActual._unidadIndex : undefined, recompensa_unidad: actividadActual._unidadIndex != null ? Number(actividadActual.recompensa || 0) : undefined })
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.success) {
      dipGuardado = dip;
      try { localStorage.setItem('pj-dip', dip); } catch (e) { /* sin almacenamiento */ }
      const extra = data.recompensa !== undefined ? ` · +${data.recompensa} Pz` : '';
      msgGuardar = `✅ ¡Guardado! ${kpScore.verdes} verdes y ${kpScore.rojos} rojos sumados${extra}.`;
    } else {
      msgGuardar = `❌ ${data.error || 'No se pudo guardar. Comprueba tu DIP.'}`;
    }
  } catch (e) {
    msgGuardar = '❌ Error de conexión. Inténtalo otra vez.';
  }
  guardandoDIP = false;
  renderPantalla();
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
  const b = bloquesJuego[s.bi];
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
    ? `<div class="kp-pair-img" style="background-image:url('${esc(pjUrlImg(pares[j].izq_img))}')" role="img" aria-label="${esc(pares[j].izq_alt || pares[j].izq || 'Imagen')}" title="${esc(pares[j].izq || '')}"></div>`
    : esc(pares[j].izq || '…');
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">link</span> Relacionar</div>`;
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
  const b = bloquesJuego[s.bi];
  const escrito = est.escrito || {};
  const done = pares.every((_, j) => escrito[j] === 'ok');
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">edit_note</span> Escribe la palabra</div>`;
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
  const b = bloquesJuego[pantallas[idx].bi];
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
  const b = bloquesJuego[s.bi];
  const n = (b.items || []).length;
  const done = est.orden.slice(0, est.hechas);
  const pend = est.orden.slice(est.hechas);
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">format_list_numbered</span> Ordena los pasos</div>`;
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
  const b = bloquesJuego[s.bi];
  const estado = est.estado || {};
  const modo = b.modo || 'escribir';
  let html = `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">edit_note</span> Completa la frase</div>`;
  if (b.imagen_url) html += kpImg(b.imagen_url, b.fuente, b.imagen_alt);
  (b.frases || []).forEach((f, fi) => {
    const st = estado[fi];
    html += `<div class="kp-frase">${esc(f.texto || '').replace('___', '<span class="kp-blank"></span>')}</div>`;
    if (modo === 'opciones') {
      // Opciones barajadas una sola vez por pantalla (en est.opciones)
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
  const b = bloquesJuego[pantallas[idx].bi];
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
  const b = bloquesJuego[pantallas[idx].bi];
  const f = b.frases[fi];
  const op = (est.opciones && est.opciones[fi] && est.opciones[fi][k]) || '';
  est.selOpc = fi + ':' + k;
  const okk = igualPalabra(op, f.respuesta);
  if (!est.estado) est.estado = {};
  est.estado[fi] = okk ? 'ok' : 'err';
  if (okk) kpScore.verdes++; else kpScore.rojos++;
  renderPantalla();
}

// ── Mapamundi (Leaflet + world-atlas) ───────────────────────────────
const MAP_STYLE = { color: '#b6c2d9', weight: 0.5, fillColor: '#dbeafe', fillOpacity: 0.85 };
function screenMapa(s, est) {
  const chips = (s.paises || []).map(p => `<span class="kp-chip">${esc(p)}</span>`).join('');
  return `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">public</span> Localiza en el mapamundi · ${s.qi + 1} de ${s.n}</div>
    <div class="kp-map-q">${esc(s.pide)}</div>
    <div class="kp-map" id="kp-map-${pantallaIdx}"></div>
    <div class="kp-map-chips">${chips}</div>
    <div class="kp-hint">👆 Pulsa en el mapa el país correcto. Usa la rueda del ratón o pellizca para acercar.</div>
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
  if (est.acierto) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); }
  else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
  renderPantalla();
  mostrarFeedback(est.acierto, MAPA_MUNDI.esDe(s.correctaEn), function () {
    if (pantallaIdx < pantallas.length - 1) pantallaIdx++;
    renderPantalla();
  });
}

// ── Placeta Junior Code: editor de bloques (integrado en el player) ──
// Estética "cute": botones redondeados con iconos SVG descriptivos (no emojis).
// Cada icono es una flecha clara que muestra EXACTAMENTE qué hace Candela.
const CODE_BLOQUES_INFO = {
  avanzar:    { cat: 'mov', nombre: 'AVANZAR', clase: 'b-move', color: '#4c8dff', params: [], desc: 'Avanza 1 casilla', icono: 'flecha-derecha' },
  retroceder: { cat: 'mov', nombre: 'RETROCEDER', clase: 'b-move', color: '#4c8dff', params: [], desc: 'Retrocede 1 casilla', icono: 'flecha-izquierda' },
  girar:      { cat: 'mov', nombre: 'GIRAR', clase: 'b-move', color: '#4c8dff', params: [{ k: 'dir', o: ['derecha', 'izquierda'] }], desc: 'Gira', icono: 'flecha-curva' },
  saltar:     { cat: 'mov', nombre: 'SALTAR', clase: 'b-move', color: '#4c8dff', params: [], desc: 'Salta 2 casillas', icono: 'flecha-salto' },
  repetir:    { cat: 'ctrl', nombre: 'BUCLE', clase: 'b-control', color: '#ff9f1c', params: [{ k: 'veces', n: 1 }], anida: true, desc: 'Bucle: repite los pasos dentro N veces', icono: 'bucle' },
  si:         { cat: 'ctrl', nombre: 'SI', clase: 'b-control', color: '#ff9f1c', params: [{ k: 'condicion', o: ['obstáculo', 'moneda', 'libre'] }], anida: true, desc: 'Si se cumple…', icono: 'diamante' },
  sonido:     { cat: 'efe', nombre: 'SONIDO', clase: 'b-sound', color: '#e8618c', params: [{ k: 'sonido', o: ['pop', 'clic', 'exito', 'moneda', 'aplauso'] }], desc: 'Reproduce un sonido', icono: 'altavoz' },
};

// Iconos SVG 100% descriptivos (16x16, trazo blanco) para los bloques
const CODE_ICONOS_SVG = {
  'flecha-derecha': '<path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'flecha-izquierda': '<path d="M14 8H3M7 4L3 8l4 4" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'flecha-curva': '<path d="M8 2v7a3 3 0 0 0 3 3h3M12 9l2 3-2 3" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'flecha-curva-der': '<path d="M8 2v5a3 3 0 0 0 3 3h3M12 7l2 3-2 3" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'flecha-curva-izq': '<path d="M8 2v5a3 3 0 0 1-3 3H2M4 7L2 10l2 3" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'flecha-salto': '<path d="M3 12c1-4 2-6 5-7M8 2l3 3-3 3M13 13c0-2 0-3-1-5" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'bucle': '<path d="M5 4h6a3 3 0 0 1 0 6H7M7 7l-3 3 3 3" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  'altavoz': '<path d="M2 6v4h3l4 3V3L5 6H2z" fill="currentColor"/><path d="M11 5c1.3 1.3 1.3 4.7 0 6M13.5 3.5c2 2.3 2 6.7 0 9" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
  'diamante': '<path d="M8 2l6 6-6 6-6-6 6-6z" fill="currentColor"/><text x="8" y="10" text-anchor="middle" font-size="9" font-weight="800" fill="#ffffff">?</text>',
};

function codeIconoSVG(icono, extra) {
  const s = extra || '';
  const d = CODE_ICONOS_SVG[icono] || CODE_ICONOS_SVG['flecha-derecha'];
  return `<svg class="blk-icono" width="20" height="20" viewBox="0 0 16 16" aria-hidden="true" ${s}>${d}</svg>`;
}

// Reproduce un sonido elegido en el bloque SONIDO (o al probar el bloque).
function pjSonidoReproducir(nombre) {
  if (!window.pjSonido) return;
  const n = String(nombre || '').toLowerCase();
  try {
    if (n === 'clic') pjSonido.clic();
    else if (n === 'exito') pjSonido.exito();
    else if (n === 'moneda') pjSonido.moneda();
    else if (n === 'aplauso' || n === 'victoria') pjSonido.victoria();
    else pjSonido.pop();
  } catch (e) { /* sin sonido */ }
}

// Pantalla de explicación de la actividad de código (tutorial de uso)
function screenCodeExplica(s) {
  return `
    <div class="kp-screen kp-code">
      <div class="kp-cover cover-purple">💻</div>
      <h3 class="kp-title">¡Vamos a programar!</h3>
      <p class="kp-desc">${esc(s.explicacion)}</p>
      <div class="code-tutorial">
        <div class="code-tut-step"><span class="code-tut-n">1</span><span>Toca las <b>flechas redondas</b> o <b>arrástralas</b> hasta tu programa para añadir pasos.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">2</span><span>El programa se monta en <b>una línea</b> como un código de verdad. Quita pasos con <b>✕</b>.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">3</span><span>Pulsa <b>▶ Ejecutar</b>: verás a Candela 👧 moverse <b>paso a paso</b> con sus sonidos.</span></div>
        <div class="code-tut-step"><span class="code-tut-n">4</span><span>Llega a la <b>estrella ⭐</b> para superar el reto.</span></div>
      </div>
      <button type="button" class="kp-btn kp-start" onclick="pantallaNext()">🚀 ¡A jugar!</button>
      <div class="kp-hint">Cada ejercicio es un poco más difícil. ¡Tú puedes!</div>
    </div>`;
}

function screenCode(s, est) {
  const escen = s.escenario || {};
  const ini = s.inicio || {};
  const obj = s.objetivo || {};
  const pistas = s.pistas || [];
  const total = s.total_ejercicios || 1;
  const actual = (s.ejercicio || 0) + 1;
  return `
    <div class="kp-screen kp-code">
      <div class="code-topline">
        <span class="code-pill code-pill-prog">Ejercicio ${actual} / ${total}</span>
        <span class="code-pill code-pill-tit">${esc(s.titulo || '')}</span>
      </div>
      ${s.explicacion ? `<div class="code-explica">💡 ${esc(s.explicacion)}</div>` : ''}
      <div class="kp-qt" style="margin-bottom:4px;">${esc(s.objetivo_texto)}</div>
      <div class="code-scenario-wrap">
        <svg id="kp-code-escenario" class="code-scenario" viewBox="0 0 600 380"></svg>
      </div>
      <div class="code-chips">
        <span class="kp-chip chip-blue">🎯 ${obj.posicion ? obj.posicion.x + ',' + obj.posicion.y : '—'}</span>
        ${obj.monedas ? `<span class="kp-chip chip-green">🪙 ${obj.monedas}</span>` : ''}
        ${obj.max_pasos ? `<span class="kp-chip chip-orange">⏱ ${obj.max_pasos} pasos</span>` : ''}
      </div>
      <div class="code-palette" id="kp-code-paleta">
        ${s.permitidos.filter(op => op !== 'girar').map(op => { const b = CODE_BLOQUES_INFO[op]; if (!b) return ''; return `<button type="button" class="code-block cute-block" draggable="true" data-op="${op}" style="--blk:${b.color}" onclick="kpCodeAñadir('${op}')" title="${esc(b.desc)}"><span class="blk-emoji">${codeIconoSVG(b.icono)}</span><span class="blk-nombre">${esc(b.nombre)}</span></button>`; }).join('')}
        ${s.permitidos.includes('girar') ? `
          <button type="button" class="code-block cute-block" draggable="true" data-op="girar" data-dir="derecha" style="--blk:#4c8dff" onclick="kpCodeAñadir('girar', {dir:'derecha'})" title="Gira a la derecha"><span class="blk-emoji">${codeIconoSVG('flecha-curva-der')}</span><span class="blk-nombre">GIRAR →</span></button>
          <button type="button" class="code-block cute-block" draggable="true" data-op="girar" data-dir="izquierda" style="--blk:#4c8dff" onclick="kpCodeAñadir('girar', {dir:'izquierda'})" title="Gira a la izquierda"><span class="blk-emoji">${codeIconoSVG('flecha-curva-izq')}</span><span class="blk-nombre">GIRAR ←</span></button>` : ''}
      </div>
      <div class="code-line-wrap">
        <div class="code-line-label">📝 Tu programa</div>
        <div class="code-programa cute-linea" id="kp-code-programa"></div>
      </div>
      <div class="code-acciones">
        <button type="button" class="code-run-btn" id="kp-code-run" onclick="kpCodeEjecutar()">▶ Ejecutar</button>
        <button type="button" class="code-clear-btn" onclick="kpCodeVaciar()">🗑 Vaciar</button>
      </div>
      <div class="code-pistas">
        ${pistas.length ? `<details><summary>💡 Pistas</summary><ul>${pistas.map(p => `<li>${esc(p)}</li>`).join('')}</ul></details>` : ''}
      </div>
      <div class="kp-hint">👆 Pulsa las flechas para montar el programa y luego ▶ Ejecutar. Lleva a Candela 👧 hasta la estrella ⭐.</div>
    </div>`;
}

// Dibuja a Candela (círculo + cara) con un indicador de dirección MUY claro:
// una flecha triangular que sobresale del borde y rota según hacia dónde mira
// (derecha/abajo/izquierda/arriba), para que se entienda perfectamente cuando gira.
function kpCandelaSVG(cxPx, cyPx, cell, dirIdx, fill) {
  const r = cell * 0.34;
  let h = `<circle cx="${cxPx}" cy="${cyPx}" r="${r}" fill="${fill}"/>`;
  h += `<text x="${cxPx}" y="${cyPx + 5}" text-anchor="middle" font-size="14">👧</text>`;
  if (dirIdx != null) {
    const ang = ({ 0: 0, 1: 90, 2: 180, 3: 270 })[dirIdx] ?? 0;
    // Punta de flecha triangular en el borde; con rotate() apunta a la dirección
    h += `<g transform="rotate(${ang} ${cxPx} ${cyPx})">`;
    h += `<path d="M${cxPx + r * 0.85} ${cyPx - 6} L${cxPx + r + 11} ${cyPx} L${cxPx + r * 0.85} ${cyPx + 6} Z" fill="#1a2b6b" stroke="#ffffff" stroke-width="1.6" stroke-linejoin="round"/>`;
    h += `</g>`;
  }
  return h;
}

// Dibuja el escenario de code completo (tablero) con Candela en una posición.
// `cx`/`cy` = posición de Candela; `dirIdx` = índice de dirección (0..3).
// Si `extra` tiene `marcador`, muestra "i/n" en la esquina (reproducción).
function kpCodeTableroHTML(cx, cy, dirIdx, extra) {
  const s = pantallas[pantallaIdx];
  const esc = (s && s.escenario) || {};
  const obj = (s && s.objetivo) || {};
  const W = 600, H = 380;
  const ancho = esc.ancho || 6, alto = esc.alto || 6;
  const cell = Math.min((W - 40) / ancho, (H - 40) / alto);
  const ox = (W - cell * ancho) / 2, oy = (H - cell * alto) / 2;
  let html = `<rect x="0" y="0" width="${W}" height="${H}" fill="#eef0fa" rx="12"/>`;
  for (let r = 0; r < alto; r++) for (let c = 0; c < ancho; c++) {
    html += `<rect x="${ox + c * cell}" y="${oy + r * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#ffffff" stroke="#d6d9ea" stroke-width="1"/>`;
  }
  (esc.obstaculos || []).forEach(o => {
    html += `<rect x="${ox + o.x * cell}" y="${oy + o.y * cell}" width="${cell - 2}" height="${cell - 2}" rx="6" fill="#4a1a1a" stroke="#7a3030"/>`;
    html += `<text x="${ox + o.x * cell + cell / 2}" y="${oy + o.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="18">🚧</text>`;
  });
  (esc.monedas || []).forEach(m => {
    html += `<text x="${ox + m.x * cell + cell / 2}" y="${oy + m.y * cell + cell / 2 + 6}" text-anchor="middle" font-size="16">🪙</text>`;
  });
  if (obj.posicion) {
    const px = obj.posicion.x, py = obj.posicion.y;
    html += `<circle cx="${ox + px * cell + cell / 2}" cy="${oy + py * cell + cell / 2}" r="${cell * 0.42}" fill="#ffd166" opacity="0.35"/>`;
    html += `<text x="${ox + px * cell + cell / 2}" y="${oy + py * cell + cell / 2 + 6}" text-anchor="middle" font-size="22">⭐</text>`;
  }
  // Candela en (cx, cy) con indicador de dirección claro
  // (salvo que extra.sinCandela lo desactive)
  const fill = (extra && extra.fill) || '#3a7dff';
  if (!(extra && extra.sinCandela)) {
    html += kpCandelaSVG(ox + cx * cell + cell / 2, oy + cy * cell + cell / 2, cell, dirIdx, fill);
  }
  // Marcador de paso (reproducción)
  if (extra && extra.marcador) {
    html += `<text x="${W - 16}" y="22" text-anchor="end" font-size="15" font-weight="800" fill="#4E3B70">${extra.marcador}</text>`;
  }
  return html;
}

// Dibuja el escenario de code en el SVG del player (estado actual)
function kpCodeDibujarEscenario() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const esc = s.escenario || {};
  const ini = s.inicio || {};
  const est = kpEstado[pantallaIdx] || {};
  const svg = document.getElementById('kp-code-escenario');
  if (!svg) return;
  // Posición final (resultado) o inicio
  const res = est.resultado;
  const px = res ? res.posicion_final.x : (ini.x ?? 0);
  const py = res ? res.posicion_final.y : (ini.y ?? 0);
  const dirIdx = res
    ? ['derecha', 'abajo', 'izquierda', 'arriba'].indexOf(res.direccion_final)
    : ['derecha', 'abajo', 'izquierda', 'arriba'].indexOf(ini.direccion || 'derecha');
  const fill = res ? (est.superado ? '#2ecc71' : '#ff5a5a') : '#3a7dff';
  // Tras la reproducción no mostramos la flecha si ya hay resultado
  svg.innerHTML = kpCodeTableroHTML(px, py, res ? null : dirIdx, { fill });
}

// Pinta el programa como UNA LÍNEA de código (bloques redondeados en fila)
function kpCodePintarPrograma() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  const cont = document.getElementById('kp-code-programa');
  if (!cont) return;
  const programa = est.programa || [];
  const abierto = est.contenedorAbierto;
  cont.innerHTML = '';
  if (!programa.length) {
    cont.innerHTML = '<div class="code-vacio">👉 Toca las flechas para montar tu programa</div>';
  }
  function dibujarBloque(item, idx, profundidad, esContenedorAbierto, destino, arr) {
    const lista = arr || programa;
    const b = CODE_BLOQUES_INFO[item.op] || { nombre: item.op, clase: 'b-move', color: '#4c8dff', params: [], flecha: '➡️' };
    const color = b.color || '#4c8dff';
    const chip = document.createElement('span');
    chip.className = 'cute-chip' + (esContenedorAbierto ? ' abierto' : '') + (item.bloques !== undefined ? ' contenedor' : '');
    chip.style.setProperty('--blk', color);
    // Icono SVG descriptivo + nombre
    const etiq = document.createElement('span');
    etiq.className = 'cute-chip-etiqueta';
    etiq.innerHTML = codeIconoSVG(b.icono) + ' ' + esc(b.nombre);
    chip.appendChild(etiq);
    // Parámetros: para GIRAR mostramos un botón de dirección (→/←) alternable;
    // para REPETIR/SI, número/condición + etiqueta explicativa.
    if (b.op === 'girar') {
      const dirBtn = document.createElement('button');
      dirBtn.className = 'cute-dir';
      const esIzq = String(item.dir || 'derecha').toLowerCase().startsWith('izq');
      dirBtn.innerHTML = codeIconoSVG(esIzq ? 'flecha-curva-izq' : 'flecha-curva-der', 'class="blk-icono"');
      dirBtn.title = esIzq ? 'Gira a la izquierda' : 'Gira a la derecha';
      dirBtn.onclick = () => {
        item.dir = esIzq ? 'derecha' : 'izquierda';
        if (window.pjSonido) pjSonido.girar();
        kpCodeGuardarPrograma(); kpCodePintarPrograma();
      };
      chip.appendChild(dirBtn);
    } else if (b.op === 'repetir') {
      const veces = document.createElement('input');
      veces.type = 'number'; veces.min = 1; veces.max = 50;
      veces.value = item.veces != null ? item.veces : 1;
      veces.style.width = '42px';
      veces.title = '¿Cuántas veces repetimos el bucle?';
      veces.onchange = () => { item.veces = parseInt(veces.value, 10) || 1; kpCodeGuardarPrograma(); kpCodePintarPrograma(); };
      chip.appendChild(veces);
      const vecesLbl = document.createElement('span');
      vecesLbl.className = 'cute-chip-explica';
      vecesLbl.textContent = 'veces';
      chip.appendChild(vecesLbl);
    } else if (b.op === 'sonido') {
      const sel = document.createElement('select');
      ['pop', 'clic', 'exito', 'moneda', 'aplauso'].forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o === 'aplauso' ? '👏 aplausos' : '🔊 ' + o; sel.appendChild(op); });
      sel.value = item.sonido != null ? item.sonido : 'pop';
      sel.onchange = () => { item.sonido = sel.value; kpCodeGuardarPrograma(); kpCodePintarPrograma(); if (window.pjSonido) pjSonidoReproducir(item.sonido); };
      sel.onclick = () => { if (window.pjSonido) pjSonidoReproducir(item.sonido || sel.value); };
      chip.appendChild(sel);
    } else if (b.op === 'si') {
      const sel = document.createElement('select');
      ['obstáculo', 'moneda', 'libre'].forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o; sel.appendChild(op); });
      sel.value = item.condicion != null ? item.condicion : 'obstáculo';
      sel.onchange = () => { item.condicion = sel.value; kpCodeGuardarPrograma(); kpCodePintarPrograma(); };
      chip.appendChild(sel);
      const condLbl = document.createElement('span');
      condLbl.className = 'cute-chip-explica';
      condLbl.textContent = '¿delante?';
      chip.appendChild(condLbl);
    } else {
      (b.params || []).forEach(p => {
        if (p.o) {
          const sel = document.createElement('select');
          p.o.forEach(o => { const op = document.createElement('option'); op.value = o; op.textContent = o; sel.appendChild(op); });
          sel.value = item[p.k] != null ? item[p.k] : p.o[0];
          sel.onchange = () => { item[p.k] = sel.value; kpCodeGuardarPrograma(); kpCodePintarPrograma(); };
          chip.appendChild(sel);
        } else if (p.n) {
          const inp = document.createElement('input'); inp.type = 'number'; inp.min = 1; inp.max = 50;
          inp.value = item[p.k] != null ? item[p.k] : 1;
          inp.style.width = '42px'; inp.onchange = () => { item[p.k] = parseInt(inp.value, 10) || 1; kpCodeGuardarPrograma(); };
          chip.appendChild(inp);
        }
      });
    }
    // Botón contenedor (solo para repetir/si): + para añadir pasos dentro, ✓ para cerrar
    if (item.bloques !== undefined) {
      const cerrar = document.createElement('button');
      cerrar.className = 'cute-cerrar';
      if (esContenedorAbierto) {
        cerrar.textContent = '✓';
        cerrar.title = 'Cerrar: los siguientes pasos van fuera';
      } else {
        cerrar.textContent = '+';
        cerrar.title = 'Añadir pasos dentro';
      }
      cerrar.onclick = () => {
        est.contenedorAbierto = esContenedorAbierto ? null : idx;
        kpCodePintarPrograma();
      };
      chip.appendChild(cerrar);
    }
    // Etiqueta de ayuda para contenedores con pasos dentro
    if (item.bloques !== undefined && (item.bloques || []).length > 0) {
      const dentro = document.createElement('span');
      dentro.className = 'cute-chip-explica';
      dentro.textContent = '(' + item.bloques.length + ' paso' + (item.bloques.length > 1 ? 's' : '') + ' dentro)';
      chip.appendChild(dentro);
    }
    const del = document.createElement('button');
    del.className = 'cute-del'; del.textContent = '✕';
    del.onclick = () => {
      lista.splice(idx, 1);
      // Solo se reajusta el contenedor abierto si se borró del nivel raíz.
      if (lista === programa) {
        if (est.contenedorAbierto === idx) est.contenedorAbierto = null;
        else if (est.contenedorAbierto !== null && est.contenedorAbierto > idx) est.contenedorAbierto--;
      }
      if (window.pjSonido) pjSonido.quitarBloque();
      kpCodeGuardarPrograma(); kpCodePintarPrograma(); kpCodeDibujarEscenario();
    };
    chip.appendChild(del);
    // Sub-bloques (contenedor REPETIR/SI): se pintan dentro del chip, en línea
    if (item.bloques !== undefined) {
      const sub = document.createElement('span');
      sub.className = 'cute-sub';
      (item.bloques || []).forEach((sb, si) => dibujarBloque(sb, si, profundidad + 1, false, sub, item.bloques));
      chip.appendChild(sub);
    }
    (destino || cont).appendChild(chip);
  }
  programa.forEach((item, idx) => dibujarBloque(item, idx, 0, abierto === idx));
  const run = document.getElementById('kp-code-run');
  if (run) run.disabled = !programa.length;
}

// Añade un bloque al programa; si hay un contenedor (repetir/si) abierto,
// el bloque de movimiento se mete DENTRO de él.
function kpCodeAñadir(op, opts) {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  if (!est.programa) est.programa = [];
  const b = CODE_BLOQUES_INFO[op];
  if (!b || !s.permitidos.includes(op)) return;
  const item = { op };
  if (b.params) b.params.forEach(p => { item[p.k] = (opts && opts[p.k] != null) ? opts[p.k] : (p.n ? 1 : (p.o ? p.o[0] : '')); });
  if (b.anida) item.bloques = [];
  // Si hay un contenedor abierto y este bloque es de movimiento → dentro
  if (est.contenedorAbierto != null) {
    const cont = est.programa[est.contenedorAbierto];
    if (cont && Array.isArray(cont.bloques)) {
      if (op === 'repetir' || op === 'si') {
        // Contenedores no se anidan: se añaden al nivel raíz y se abren
        est.programa.push(item);
        est.contenedorAbierto = est.programa.length - 1;
      } else {
        cont.bloques.push(item);
      }
      if (window.pjSonido) pjSonido.colocarBloque();
      kpCodeGuardarPrograma(); kpCodePintarPrograma();
      return;
    }
  }
  est.programa.push(item);
  if (op === 'repetir' || op === 'si') est.contenedorAbierto = est.programa.length - 1;
  if (window.pjSonido) pjSonido.colocarBloque();
  kpCodeGuardarPrograma();
  kpCodePintarPrograma();
}

function kpCodeGuardarPrograma() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  est.resultado = null; est.superado = false;
  guardarPartidaLocal();
  // Previsualización en vivo: muestra el camino que haría Candela con el
  // programa actual (sin animar, solo orientación mientras programas).
  kpCodePrevisualizar();
}

// Dibuja una vista previa del recorrido de Candela con el programa actual.
function kpCodePrevisualizar() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  const svg = document.getElementById('kp-code-escenario');
  if (!svg) return;
  const programa = est.programa || [];
  if (!programa.length || !window.PJCode) {
    kpCodeDibujarEscenario();
    return;
  }
  const resultado = PJCode.ejecutarCode(s.escenario, s.inicio, kpCodeSerializar(programa), { maxPasos: (s.max_bloques || 10) * 20 });
  const trazado = (resultado.trazado || []).filter(t => t.accion !== 'inicio' && t.accion !== 'error' && t.accion !== 'si');
  if (!trazado.length) { kpCodeDibujarEscenario(); return; }
  const esc = s.escenario || {};
  const W = 600, H = 380;
  const ancho = esc.ancho || 6, alto = esc.alto || 6;
  const cell = Math.min((W - 40) / ancho, (H - 40) / alto);
  const ox = (W - cell * ancho) / 2, oy = (H - cell * alto) / 2;
  // Tablero base SIN Candela (para pintar el camino y a Candela al final)
  let html = kpCodeTableroHTML(trazado[0].x, trazado[0].y, trazado[0].dir, { sinCandela: true });
  // Camino punteado por todas las posiciones
  const puntos = trazado.map(t => `${ox + t.x * cell + cell / 2},${oy + t.y * cell + cell / 2}`);
  const ultimo = trazado[trazado.length - 1];
  html += `<polyline points="${puntos.join(' ')}" fill="none" stroke="#4c8dff" stroke-width="3" stroke-dasharray="6 5" opacity="0.6"/>`;
  // Pequeños puntos en cada posición visitada
  trazado.forEach((t, i) => {
    if (i === trazado.length - 1) return;
    html += `<circle cx="${ox + t.x * cell + cell / 2}" cy="${oy + t.y * cell + cell / 2}" r="5" fill="#4c8dff" opacity="0.45"/>`;
  });
  // Candela final con color según si llegaría a la estrella
  const obj = s.objetivo || {};
  const llega = obj.posicion && ultimo.x === Number(obj.posicion.x) && ultimo.y === Number(obj.posicion.y);
  const fillFinal = llega ? '#2ecc71' : '#4c8dff';
  // Candela final con su flecha de dirección (para ver hacia dónde queda mirando)
  html += kpCandelaSVG(ox + ultimo.x * cell + cell / 2, oy + ultimo.y * cell + cell / 2, cell, ultimo.dir, fillFinal);
  // Etiqueta de vista previa
  html += `<text x="${W - 16}" y="22" text-anchor="end" font-size="13" font-weight="800" fill="#8a93b8">👀 prevista</text>`;
  svg.innerHTML = html;
}

function kpCodeVaciar() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  est.programa = []; est.resultado = null; est.superado = false;
  if (window.pjSonido) pjSonido.quitarBloque();
  kpCodePintarPrograma(); kpCodeDibujarEscenario();
  guardarPartidaLocal();
}

function kpCodeSerializar(prog) {
  return (prog || []).map(item => {
    const b = { op: item.op };
    if (item.veces != null) b.veces = item.veces;
    if (item.dir) b.dir = item.dir;
    if (item.condicion) b.condicion = item.condicion;
    if (item.bloques !== undefined) b.bloques = kpCodeSerializar(item.bloques);
    return b;
  });
}

// Ejecuta el programa y REPRODUCE la ejecución paso a paso (animación)
async function kpCodeEjecutar() {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const est = kpEstado[pantallaIdx] || {};
  const programa = est.programa || [];
  if (!programa.length) return;
  const run = document.getElementById('kp-code-run');
  if (run && run.disabled) return; // evita doble ejecución (dobles toques)
  if (run) run.disabled = true;
  const idxInicial = pantallaIdx; // no avanzar si el usuario navegó durante la animación
  if (!window.PJCode) { kpCodeMostrarMsg('El motor de código no está cargado.', false); if (run) run.disabled = false; return; }

  // 1) Evaluación LOCAL (funciona sin red ni DIP)
  const resultado = PJCode.ejecutarCode(s.escenario, s.inicio, kpCodeSerializar(programa), { maxPasos: (s.max_bloques || 10) * 20 });
  const evalRes = PJCode.evaluarCode(s.escenario, s.inicio, s.objetivo, kpCodeSerializar(programa), resultado);
  est.resultado = resultado;
  est.superado = evalRes.superado;

  // 2) Reproducción paso a paso con sonidos distintos
  const trazado = (resultado.trazado || []).filter(t => t.accion !== 'inicio');
  const n = trazado.length;
  let monedasCogidas = 0;
  for (let i = 0; i < n; i++) {
    const t = trazado[i];
    kpCodeDibujarPaso(t, i + 1, n, est.superado);
    if (window.pjSonido) {
      if (t.accion === 'girar') pjSonido.girar();
      else if (t.accion === 'saltar') pjSonido.saltar();
      else if (t.accion === 'error') pjSonido.golpe();
      else if (t.accion === 'sonido') pjSonidoReproducir(t.s || 'pop');
      else if (t.moneda) pjSonido.moneda();
      else pjSonido.paso();
    }
    // Las monedas también suman puntos verdes (mientras se reproducen)
    if (t.moneda) {
      kpScore.verdes++;
      monedasCogidas++;
      if (window.PJProgreso) { PJProgreso.sumar(1, 0); try { window.dispatchEvent(new CustomEvent('pj:progreso')); } catch (e) { /* ok */ } }
    }
    await new Promise(res => setTimeout(res, 360));
  }
  // Estado final
  kpCodeDibujarEscenario();

  if (evalRes.superado) {
    kpScore.verdes++;
    if (window.pjSonido) pjSonido.exito();
    const esUltimo = s.ejercicio >= (s.total_ejercicios || 1) - 1;
    const extraMonedas = monedasCogidas > 0 ? ` +${monedasCogidas} 🪙` : '';
    kpCodeMostrarMsg(esUltimo
      ? '🎉 ¡Actividad completada! +1 punto verde' + extraMonedas
      : `🎉 ¡Ejercicio ${(s.ejercicio || 0) + 1} superado!` + extraMonedas, true);
    // Guarda el progreso (local); solo se marca completada al superar el último
    if (actividadActual && actividadActual.id && window.PJPartidas) {
      if (esUltimo) {
        PJPartidas.completar(actividadActual.id, { verdes: kpScore.verdes, rojos: kpScore.rojos });
      } else {
        guardarPartidaLocal();
      }
    }
    // Guardar también en el servidor si hay DIP (best effort, no bloquea)
    guardarCodeEnServidor(s, programa, evalRes).catch(() => {});
    setTimeout(() => { if (pantallaIdx === idxInicial && pantallaIdx < pantallas.length - 1) { pantallaIdx++; renderPantalla(); } }, 1200);
  } else {
    kpScore.rojos++;
    if (window.pjSonido) pjSonido.error();
    const primerFallo = (evalRes.fallos && evalRes.fallos[0]) || 'No superado. Inténtalo de nuevo.';
    kpCodeMostrarMsg('💪 ' + primerFallo, false);
    guardarPartidaLocal();
  }
  if (run) run.disabled = false;
}

// Dibuja a Candela en el paso indicado del trazado (animación por pasos).
// Dibuja SIEMPRE el tablero completo (cuadrícula, obstáculos, monedas, estrella).
function kpCodeDibujarPaso(t, i, n, superado) {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  const svg = document.getElementById('kp-code-escenario');
  if (!svg) return;
  const fill = t.accion === 'error' ? '#ff5a5a' : (superado ? '#2ecc71' : '#4c8dff');
  svg.innerHTML = kpCodeTableroHTML(t.x, t.y, t.dir, { fill, marcador: i + '/' + n });
}

// Muestra un mensaje en la pantalla de code
function kpCodeMostrarMsg(texto, ok) {
  const s = pantallas[pantallaIdx];
  if (!s || s.tipo !== 'code') return;
  let msg = document.getElementById('kp-code-msg');
  if (!msg) {
    msg = document.createElement('div');
    msg.id = 'kp-code-msg';
    msg.className = 'kp-msg';
    const acciones = document.querySelector('.code-acciones');
    if (acciones) acciones.after(msg);
  }
  msg.className = 'kp-msg ' + (ok ? 'ok' : 'bad');
  msg.textContent = texto;
}

// Envía el resultado al servidor con el DIP si está disponible (opcional)
async function guardarCodeEnServidor(s, programa, evalRes) {
  try {
    let dip = '';
    try { dip = localStorage.getItem('pj-dip') || ''; } catch (e) { /* ok */ }
    if (!dip || !actividadActual || !actividadActual.id) return;
    // Los ejercicios forman una única actividad: se registra todo junto al
    // terminar el último, evitando pagar una fracción por cada diapositiva.
    if ((s.ejercicio || 0) < (s.total_ejercicios || 1) - 1) return;
    const respuestas = [];
    for (let i = 0; i < kpScore.verdes; i++) respuestas.push({ idx: i, correcta: true });
    for (let i = 0; i < kpScore.rojos; i++) respuestas.push({ idx: kpScore.verdes + i, correcta: false });
    // El endpoint de código desapareció del BFF. Usa el mismo endpoint de
    // resultados que el resto de actividades para que también abone los Pz.
    const r = await fetch(`${API_BASE}/actividades/${actividadActual.id}/realizar`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dip,
        resultado_id: `${actividadActual._unidadIndex != null ? actividadActual._actividadId || actividadActual.id : actividadActual.id}:code:final`,
        puntos_maximos: s.total_ejercicios || 1,
        resultado_final: true,
        puntos_verdes: kpScore.verdes,
        puntos_rojos: kpScore.rojos,
        respuestas,
        unidad: actividadActual._unidadIndex != null ? actividadActual._unidadIndex : undefined,
        recompensa_unidad: actividadActual._unidadIndex != null ? Number(actividadActual.recompensa || 0) : undefined
      })
    }).then(r2 => r2.json()).catch(() => null);
    if (r && r.success) {
      // Si el servidor otorgó recompensa, lo reflejamos en el mensaje
      if (r.recompensa > 0) {
        kpCodeMostrarMsg(`🎉 ¡Actividad completada! +${r.recompensa} Pz`, true);
      }
    }
  } catch (e) { /* silencioso: el progreso ya quedó en local */ }
}

function nivelCompletado(nivel) {
  const indices = pantallas.map((s, i) => s.nivelIndex === nivel ? i : -1).filter(i => i >= 0);
  return indices.length === 0 || indices.every((i) => {
    const s = pantallas[i], e = kpEstado[i] || {};
    if (s.tipo === 'texto' || s.tipo === 'portada') return true;
    if (s.tipo === 'code') return e.superado === true;
    if (s.tipo === 'test' || s.tipo === 'calculo' || s.tipo === 'problema') return e.respondida === true;
    if (s.tipo === 'relacionar') return Object.keys(e.hechas || {}).length >= (bloquesJuego[s.bi]?.pares || []).length;
    if (s.tipo === 'ordenar') return Number(e.hechas || 0) > 0;
    return e.completado === true || e.respondida === true;
  });
}

async function canjearPuntos(tipo) {
  const dip = document.getElementById('kp-dip')?.value.trim() || dipGuardado;
  const puntos = tipo === 'rojos' ? kpScore.rojos : kpScore.verdes;
  const msg = document.getElementById('kp-redeem-msg');
  if (!msg) return;
  if (!dip) { msg.className = 'kp-msg bad'; msg.textContent = 'Guarda primero tu progreso con tu DIP.'; return; }
  if (puntos < 10) { msg.className = 'kp-msg bad'; msg.textContent = `Necesitas 10 puntos ${tipo}.`; return; }
  const canje = Math.floor(puntos / 10) * 10;
  msg.className = 'kp-msg'; msg.textContent = 'Procesando canje…';
  try {
    const res = await fetch(`${API_BASE}/puntos/canjear`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dip, tipo, [tipo === 'rojos' ? 'puntos_rojos' : 'puntos_verdes']: canje })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error || 'No se pudo completar el canje');
    msg.className = 'kp-msg ok';
    msg.textContent = `✅ Canje completado: +${data.placetas_obtenidas} Placetas.`;
  } catch (e) { msg.className = 'kp-msg bad'; msg.textContent = `❌ ${e.message || 'Error de conexión'}`; }
}

function obtenerContenidoTextoPJ(b) {
  if (!b) return '';
  if (typeof b.contenido === 'string') return b.contenido;
  if (b.contenido && typeof b.contenido === 'object') return b.contenido.html || b.contenido.markdown || b.contenido.texto || b.contenido.contenido || '';
  return b.html || b.markdown || b.texto || '';
}

// Markdown sencillo y seguro para los textos creados en Studio.
function formatearTextoJugador(texto) {
  if (/<(?:p|br|strong|b|em|i|h[1-6]|ul|ol|li|blockquote|code|mark|img)\b/i.test(String(texto || ''))) return sanearRichTextJugador(texto);
  return String(texto || '').split(/\r?\n/).map(linea => {
    const t = esc(linea.trim()); if (!t) return '';
    if (/^### /.test(t)) return `<h5>${formatoInlineJugador(t.slice(4))}</h5>`;
    if (/^## /.test(t)) return `<h4>${formatoInlineJugador(t.slice(3))}</h4>`;
    if (/^# /.test(t)) return `<h3>${formatoInlineJugador(t.slice(2))}</h3>`;
    if (/^> /.test(t)) return `<blockquote>${formatoInlineJugador(t.slice(2))}</blockquote>`;
    if (/^(?:- |• )/.test(t)) return `<div class="pj-formatted-list">• ${formatoInlineJugador(t.slice(2))}</div>`;
    return `<p>${formatoInlineJugador(t)}</p>`;
  }).join('');
}
function formatoInlineJugador(t) { return t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/__([^_]+)__/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>').replace(/`([^`]+)`/g, '<code>$1</code>'); }
function sanearRichTextJugador(html) {
  const plantilla = document.createElement('template'); plantilla.innerHTML = String(html || '');
  const permitidas = new Set(['P','BR','STRONG','B','EM','I','H1','H2','H3','H4','H5','H6','UL','OL','LI','BLOCKQUOTE','CODE','MARK','SPAN','DIV','IMG']);
  const limpiar = nodo => Array.from(nodo.childNodes).forEach(hijo => {
    if (hijo.nodeType !== 1) return;
    if (!permitidas.has(hijo.tagName)) { const texto = document.createTextNode(hijo.textContent || ''); hijo.replaceWith(texto); return; }
    Array.from(hijo.attributes).forEach(a => { if (!['class','title','aria-label','data-popup','src','alt','width','height'].includes(a.name.toLowerCase())) hijo.removeAttribute(a.name); });
    if (hijo.tagName === 'IMG') { const src = hijo.getAttribute('src') || ''; if (!/^https?:\/\//i.test(src)) hijo.remove(); else { hijo.setAttribute('loading','lazy'); hijo.setAttribute('referrerpolicy','no-referrer'); } }
    limpiar(hijo);
  });
  limpiar(plantilla.content); return plantilla.innerHTML;
}
function pantallaNext() {
  if (pantallaIdx >= pantallas.length - 1) return;
  const actual = pantallas[pantallaIdx], siguiente = pantallas[pantallaIdx + 1];
  if (!actividadActual?._preview && actual.nivelIndex != null && siguiente.nivelIndex !== actual.nivelIndex && !nivelCompletado(actual.nivelIndex)) {
    juniorAviso('🔒 Completa este nivel para desbloquear el siguiente.', 'error'); return;
  }
  pantallaIdx++; if (window.pjSonido) pjSonido.hoja(); renderPantalla();
}
function pantallaPrev() { if (pantallaIdx > 0 && pantallas[pantallaIdx]?.tipo !== 'final') { pantallaIdx--; if (window.pjSonido) pjSonido.hoja(); renderPantalla(); } }

// Guarda la partida actual en localStorage (para retomarla después)
function guardarPartidaLocal() {
  try {
    if (!window.PJPartidas || !actividadActual || !actividadActual.id) return;
    const clave = actividadActual._unidadIndex != null ? `${actividadActual._actividadId || actividadActual.id}::unidad::${actividadActual._unidadIndex}` : actividadActual.id;
    const s = pantallas[pantallaIdx];
    // En la pantalla final, la actividad se considera completada
    if (s && s.tipo === 'final') {
      PJPartidas.completar(clave, { verdes: kpScore.verdes, rojos: kpScore.rojos });
      return;
    }
    // En la portada no hay progreso real todavía
    if (s && s.tipo === 'portada') return;
    // Serializa el programa de code si la pantalla actual lo tiene
    let code = null;
    if (s && s.tipo === 'code') {
      const est = kpEstado[pantallaIdx] || {};
      code = { programa: est.programa || [] };
    }
    PJPartidas.set(clave, {
      pantallaIdx,
      kpEstado: JSON.parse(JSON.stringify(kpEstado)),
      kpScore: { ...kpScore },
      code
    });
    try { window.dispatchEvent(new CustomEvent('pj:partida')); } catch (e) { /* ok */ }
  } catch (e) { /* sin almacenamiento */ }
}

// Cierra el reproductor (el progreso se guarda localmente, se puede retomar)
function salirPlayer(sinConfirmar) {
  if (window.pjSonido) pjSonido.clic();
  if (window.PJMusic) window.PJMusic.menu(); // volver a la música del menú (día/noche)
  const cerrar = () => {
    ocultarFeedback();
    document.body.classList.remove('mostrando-juego');
    if (window.__pjDesdeDetalle && actividadActual && actividadActual.id) {
      // Volvemos a la página de detalle de la que salimos
      document.body.classList.add('mostrando-detalle');
      try { history.replaceState(null, '', '/?id=' + encodeURIComponent(actividadActual.id)); } catch (e) { /* sin historial */ }
    } else {
      try { if (location.search.includes('jugar=')) history.replaceState(null, '', '/'); } catch (e) { /* sin historial */ }
    }
    window.__pjDesdeDetalle = false;
    window.__pjUnidadContext = null;
  };
  // El progreso ya se guardó en cada pantalla: se puede retomar más tarde
  guardarPartidaLocal();
  if (sinConfirmar) { cerrar(); }
  else juniorConfirmar('¿Quieres salir? Tu progreso se guarda en este dispositivo y puedes continuar cuando quieras.', cerrar);
}
function cerrarPlayer() { salirPlayer(false); }
// Botón de la pantalla final: salir directamente (la actividad ya está completada).
function volverAlMenu() { salirPlayer(true); }

document.addEventListener('DOMContentLoaded', () => {
  const close = document.getElementById('player-close');
  if (close) close.addEventListener('click', cerrarPlayer);
  document.addEventListener('pointerdown', kpStart);
  document.addEventListener('pointermove', kpMove);
  document.addEventListener('pointerup', kpEnd);
  document.addEventListener('pointercancel', kpEnd);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = document.getElementById('player-modal');
      if (modal && !modal.classList.contains('hidden')) cerrarPlayer();
    }
  });

  // Drag & drop: arrastrar bloques de la paleta al área de programa
  document.addEventListener('dragstart', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('.cute-block[data-op]') : null;
    if (btn) {
      const dir = btn.dataset.dir || '';
      e.dataTransfer.setData('text/plain', btn.dataset.op);
      e.dataTransfer.setData('text/dir', dir);
      if (e.dataTransfer.setDragImage) {
        try { e.dataTransfer.setDragImage(btn, 20, 20); } catch (err) { /* ok */ }
      }
    }
  });
  document.addEventListener('dragover', (e) => {
    const prog = e.target && e.target.closest ? e.target.closest('#kp-code-programa') : null;
    if (prog) {
      e.preventDefault();
      prog.classList.add('drag-over');
    }
  });
  document.addEventListener('dragleave', (e) => {
    const prog = e.target && e.target.closest ? e.target.closest('#kp-code-programa') : null;
    if (prog) prog.classList.remove('drag-over');
  });
  document.addEventListener('drop', (e) => {
    const prog = e.target && e.target.closest ? e.target.closest('#kp-code-programa') : null;
    if (!prog) return;
    e.preventDefault();
    prog.classList.remove('drag-over');
    const op = e.dataTransfer.getData('text/plain');
    const dir = e.dataTransfer.getData('text/dir');
    if (op && typeof kpCodeAñadir === 'function') {
      if (op === 'girar' && dir) kpCodeAñadir('girar', { dir });
      else kpCodeAñadir(op);
      if (window.pjSonido) pjSonido.soltar();
    }
  });
});
