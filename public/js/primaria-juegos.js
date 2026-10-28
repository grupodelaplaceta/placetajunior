/* Placeta Junior · PRIMARIA · tipos de actividad nuevos para el reproductor (player.js)
   reloj · recta_numerica · grafico · balanza · ahorcado · anagrama · patrones · simetria · silabas · vf_rapido · ruleta_preguntas
   Contrato (docs/modalidades/MODALIDADES-ETAPAS.md):
   1) contenido 100 % JSON declarativo  2) pantalla táctil y accesible  3) estado en kpEstado + puntos en kpScore
   4) fallback seguro si faltan datos   5) no rompe actividades antiguas.
   Depende de player.js (kpEstado, kpScore, pantallaIdx, renderPantalla, pantallaNext, mostrarFeedback). */
(function () {
  'use strict';
  const TIPOS = new Set(['reloj', 'recta_numerica', 'grafico', 'balanza', 'ahorcado', 'anagrama', 'patrones', 'simetria', 'silabas', 'vf_rapido', 'ruleta_preguntas']);
  const ICO = { reloj: 'schedule', recta_numerica: 'straighten', grafico: 'bar_chart', balanza: 'balance', ahorcado: 'abc', anagrama: 'shuffle', patrones: 'pattern', simetria: 'flip', silabas: 'content_cut', vf_rapido: 'bolt', ruleta_preguntas: 'casino' };
  const TIT = { reloj: 'El reloj', recta_numerica: 'La recta numérica', grafico: 'Lee el gráfico', balanza: 'Equilibra la balanza', ahorcado: 'Adivina la palabra', anagrama: 'Ordena las letras', patrones: 'Continúa la serie', simetria: 'Completa el reflejo', silabas: 'Separa en sílabas', vf_rapido: 'Verdadero o falso', ruleta_preguntas: 'Ruleta de preguntas' };
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuf = a => a.slice().sort(() => Math.random() - .5);
  const num = (v, d) => (v !== '' && v != null && Number.isFinite(Number(v))) ? Number(v) : d;
  const arr = v => Array.isArray(v) ? v : [];
  const norm = s => String(s || '').toUpperCase().replace(/Ñ/g, '\u0001').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\u0001/g, 'Ñ');
  const D = b => (b && b.datos && typeof b.datos === 'object') ? Object.assign({}, b, b.datos) : (b || {});
  const COL = ['#e11d48', '#2563eb', '#16a34a', '#f59e0b', '#7c3aed', '#0891b2', '#db2777', '#65a30d'];

  /* ---------- estilos ---------- */
  function css() {
    if (document.getElementById('pp-css')) return;
    const st = document.createElement('style'); st.id = 'pp-css';
    st.textContent = `
.pp-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;margin:6px 0 12px}
.pp-row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;align-items:center}
.pp-btn{font:800 17px/1 inherit;border:0;border-radius:16px;padding:12px 18px;cursor:pointer;background:#fff;color:#3f00d8;box-shadow:0 0 0 3px #d9ccff,0 4px 0 #d9ccff;min-width:48px;min-height:48px}
.pp-btn[aria-pressed=true]{background:#3f00d8;color:#fff;box-shadow:0 4px 0 #24008a}
.pp-btn:disabled{opacity:.45;cursor:default}
.pp-chip{display:inline-grid;place-items:center;min-width:52px;height:52px;padding:0 10px;border-radius:14px;font:900 24px system-ui;color:#fff;box-shadow:0 4px 0 #0003;border:0;cursor:pointer}
.pp-chip.sm{min-width:38px;height:38px;font-size:18px;border-radius:10px;cursor:default}
.pp-tile{display:inline-grid;place-items:center;min-width:54px;height:60px;padding:0 8px;border-radius:14px;background:#fff;box-shadow:0 0 0 3px #d9ccff,0 4px 0 #d9ccff;font:900 28px system-ui;color:#33334d;cursor:pointer;border:0}
.pp-tile.slot{background:#f4f0ff;box-shadow:inset 0 0 0 3px #c9b8ff;color:#3f00d8}
.pp-tile.ok{background:#c9f7df;box-shadow:0 0 0 3px #06d6a0}
.pp-tile.bad{background:#ffe0e6;box-shadow:0 0 0 3px #ff4d6d}
.pp-tile:disabled{opacity:.4;cursor:default}
.pp-hint{font:700 16px system-ui;color:#6b5aa6;text-align:center}
.pp-msg{min-height:24px;font:800 16px system-ui;text-align:center}
.pp-hearts{display:flex;gap:4px;font-size:26px;color:#e11d48}
.pp-kb{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;max-width:620px}
.pp-kb .pp-tile{min-width:42px;height:46px;font-size:20px}
.pp-svg{max-width:100%;height:auto}
.pp-bar{width:min(520px,92%);height:12px;border-radius:8px;background:#e9e2ff;overflow:hidden}
.pp-bar>i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#06d6a0,#ffb703,#ff4d6d);transform-origin:left}
.pp-vf{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;width:100%}
.pp-vf button{flex:1 1 180px;max-width:300px;min-height:96px;border:0;border-radius:24px;font:900 26px system-ui;color:#fff;cursor:pointer;box-shadow:0 7px 0 #0003}
.pp-grid{display:grid;gap:3px;touch-action:manipulation}
.pp-cell{border-radius:6px;background:#fff;box-shadow:inset 0 0 0 2px #d9ccff;border:0;padding:0;cursor:pointer}
.pp-cell.fx{background:#3f00d8;box-shadow:none;cursor:default}
.pp-cell.on{background:#ff9f1c;box-shadow:none}
.pp-cell.ref{box-shadow:inset 0 0 0 2px #06d6a0}
.pp-cell.miss{background:#ffe0e6;box-shadow:inset 0 0 0 2px #ff4d6d}
.pp-gap{width:18px;height:54px;border:0;background:transparent;cursor:pointer;position:relative;padding:0}
.pp-gap::after{content:"";position:absolute;left:8px;top:2px;bottom:2px;width:2px;background:#d9ccff;border-radius:2px}
.pp-gap.cut::after{width:6px;left:6px;background:#e11d48;border-radius:3px}
.pp-wheel{transition:transform 3.2s cubic-bezier(.12,.7,.1,1);transform-origin:50% 50%}
.pp-series{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
@keyframes pp-sh{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}
.pp-shake{animation:pp-sh .35s}
@keyframes pp-in{from{opacity:0;transform:translateY(14px) scale(.97)}to{opacity:1;transform:none}}
@keyframes pp-pop{0%{transform:scale(.6)}60%{transform:scale(1.18)}100%{transform:scale(1)}}
@keyframes pp-beat{0%,100%{transform:scale(1)}50%{transform:scale(1.18)}}
@keyframes pp-lost{0%{transform:scale(1.5) rotate(-12deg);opacity:1}100%{transform:scale(.8);opacity:.2}}
.pp-wrap{animation:pp-in .45s cubic-bezier(.2,.9,.3,1.2) both}
.pp-hearts span{display:inline-block;animation:pp-beat 1.6s ease-in-out infinite}
.pp-hearts span.pp-lost{animation:pp-lost .6s ease-out both}
.pp-tile,.pp-chip,.pp-btn,.pp-cell,.pp-vf button{transition:transform .12s,box-shadow .12s,background .15s}
.pp-tile:not(:disabled):not(.slot):hover,.pp-chip:hover,.pp-btn:not(:disabled):hover{transform:translateY(-3px)}
.pp-tile:not(:disabled):active,.pp-chip:active,.pp-btn:not(:disabled):active,.pp-vf button:active{transform:scale(.93)}
.pp-tile.ok,.pp-tile.slot.ok{animation:pp-pop .4s both}
.pp-cell.on{animation:pp-pop .25s both}
.pp-vf button:not(:disabled):hover{transform:translateY(-4px) rotate(-.6deg)}
@media (prefers-reduced-motion:reduce){.pp-wheel{transition:none}.pp-shake,.pp-wrap,.pp-hearts span,.pp-tile.ok,.pp-cell.on{animation:none}}`;
    document.head.appendChild(st);
  }

  /* ---------- cabecera común y resolución ---------- */
  function head(k, q, extra) {
    return `<div class="kp-qcard"><span class="kp-orb" aria-hidden="true"></span><div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">${ICO[k]}</span> ${esc(extra || TIT[k])}</div><div class="kp-q">${esc(q)}</div></div>`;
  }
  function resolver(idx, ok, correcta, quedarse) {
    const est = kpEstado[idx]; if (!est || est.respondida) return;
    est.respondida = true; est.acierto = !!ok;
    if (ok) { kpScore.verdes++; if (window.pjSonido) pjSonido.exito(); } else { kpScore.rojos++; if (window.pjSonido) pjSonido.error(); }
    renderPantalla();
    mostrarFeedback(!!ok, correcta, function () { pantallaNext(); });
  }
  const sh = id => { const e = document.getElementById(id); if (e) { e.classList.remove('pp-shake'); void e.offsetWidth; e.classList.add('pp-shake'); } };
  const msg = (t, c) => { const m = document.getElementById('pp-msg'); if (m) { m.textContent = t || ''; m.style.color = c || '#6b5aa6'; } };

  /* ---------- creación de pantallas ---------- */
  function crear(b) {
    css();
    const d = D(b), k = b.tipo, out = [], P = (qi, n, e, extra) => out.push({ s: Object.assign({ k, qi, n }, extra || {}), e });
    if (k === 'reloj') {
      let ej = arr(d.ejercicios).length ? d.ejercicios : arr(d.horas).map(h => ({ hora: h }));
      if (!ej.length) ej = [{ hora: '03:00' }, { hora: '06:30' }, { hora: '09:15' }];
      ej.forEach((x, i) => {
        const m = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(String(x.hora || '03:00')) || ['', '3', '0'], h = (+m[1]) % 12, mi = +m[2], modo = (x.modo || d.modo) === 'leer' ? 'leer' : 'poner';
        const lab = (hh, mm) => ((hh % 12) || 12) + ':' + String(mm).padStart(2, '0'), cor = lab(h, mi), set = new Set([cor]);
        const alts = [lab(h, (mi + 30) % 60), lab(h + 1, mi), lab(h + 11, mi), lab(h, (mi + 15) % 60), lab(h + 6, mi)];
        for (const a of alts) { if (set.size >= 3) break; set.add(a); }
        P(i, ej.length, { hBase: 0, mDeg: 0, activa: 'min', respondida: false, acierto: null }, { modo, h, mi, op: shuf([...set]), cor, snap: (mi % 5 === 0) ? 5 : 1 });
      });
    } else if (k === 'recta_numerica') {
      const mn = num(d.min, 0), mx = Math.max(mn + 1, num(d.max, 10)), paso = Math.max(.001, num(d.paso, 1));
      let ps = arr(d.preguntas).length ? d.preguntas : arr(d.valores).map(v => ({ valor: v }));
      if (!ps.length) ps = [{ valor: Math.round((mn + mx) / 2) }];
      ps.forEach((p, i) => P(i, ps.length, { sel: null, respondida: false, acierto: null }, { mn, mx, paso, valor: num(p.valor, mn), txt: p.pregunta || '' }));
    } else if (k === 'grafico') {
      const dt = arr(d.datos).filter(x => x && x.etiqueta != null).map((x, i) => ({ etiqueta: String(x.etiqueta), valor: Math.max(0, num(x.valor, 0)), color: x.color || COL[i % COL.length] }));
      if (dt.length < 2) return out;
      let ps = arr(d.preguntas).filter(p => p && p.pregunta && arr(p.opciones).length >= 2);
      if (!ps.length) {
        const mx = dt.reduce((a, x) => x.valor > a.valor ? x : a), mn = dt.reduce((a, x) => x.valor < a.valor ? x : a), nm = dt.map(x => x.etiqueta);
        const vals = [...new Set([mx.valor - mn.valor, mx.valor - mn.valor + 1, Math.max(0, mx.valor - mn.valor - 1), mx.valor + 2])].slice(0, 3).map(String);
        ps = [{ pregunta: '¿Cuál tiene el valor más alto?', opciones: nm, correcta: nm.indexOf(mx.etiqueta) }, { pregunta: '¿Cuál tiene el valor más bajo?', opciones: nm, correcta: nm.indexOf(mn.etiqueta) }, { pregunta: '¿Cuánto más es «' + mx.etiqueta + '» que «' + mn.etiqueta + '»?', opciones: vals, correcta: 0 }];
        ps[0].opciones = nm.slice(0, 5); ps[1].opciones = nm.slice(0, 5); if (ps[0].correcta > 4 || ps[1].correcta > 4) ps.splice(0, 2);
      }
      ps.forEach((p, i) => P(i, ps.length, { sel: null, respondida: false, acierto: null, orden: shuf(p.opciones.map((_, j) => j)) }, { dt, p, tg: d.tipo_grafico === 'pictograma' ? 'pictograma' : 'barras', unidad: d.unidad || '', gt: d.titulo_grafico || '' }));
    } else if (k === 'balanza') {
      let ej = arr(d.ejercicios);
      if (!ej.length) ej = [{ izq: [5, 3], der: [2], pesas: [1, 2, 3, 5] }, { izq: [10], der: [4], pesas: [1, 2, 3, 6] }];
      ej.forEach((x, i) => {
        const izq = arr(x.izq).length ? arr(x.izq).map(Number) : [num(x.objetivo, 8)], der = arr(x.der).map(Number), pesas = arr(x.pesas).length ? arr(x.pesas).map(Number) : [1, 2, 3, 5];
        P(i, ej.length, { add: [], respondida: false, acierto: null }, { izq, der, pesas, eq: x.ecuacion || '' });
      });
    } else if (k === 'ahorcado' || k === 'anagrama') {
      const ps = arr(d.palabras).map(p => typeof p === 'string' ? { palabra: p } : p).filter(p => p && String(p.palabra || '').trim());
      const base = ps.length ? ps : [{ palabra: 'ESCUELA', pista: 'Es el lugar donde aprendes.' }, { palabra: 'ELEFANTE', pista: 'Animal muy grande con trompa.' }];
      base.forEach((p, i) => {
        const w = String(p.palabra).trim().toUpperCase();
        if (k === 'ahorcado') P(i, base.length, { usadas: [], fallos: 0, respondida: false, acierto: null }, { w, pista: p.pista || '', vidas: Math.max(3, Math.min(10, num(d.intentos, 6))) });
        else {
          const L = [...w.replace(/\s/g, '')]; let o; let t = 0; do { o = shuf(L.map((_, j) => j)); t++; } while (t < 20 && L.length > 1 && o.every((v, j) => L[v] === L[j]));
          P(i, base.length, { puestas: [], fallos: 0, respondida: false, acierto: null }, { w, L, orden: o, pista: p.pista || '' });
        }
      });
    } else if (k === 'patrones') {
      let ps = arr(d.secuencias).filter(s => arr(s.serie).length >= 3 && arr(s.opciones).length >= 2);
      if (!ps.length) ps = [{ serie: ['2', '4', '6', '?', '10'], opciones: ['7', '8', '9'], correcta: 1 }, { serie: ['🔴', '🔵', '🔴', '🔵', '?'], opciones: ['🔵', '🔴', '🟢'], correcta: 1 }];
      ps.forEach((p, i) => P(i, ps.length, { sel: null, respondida: false, acierto: null, orden: shuf(p.opciones.map((_, j) => j)) }, { p }));
    } else if (k === 'simetria') {
      let ej = arr(d.ejercicios);
      if (!ej.length) ej = [{ ancho: 3, alto: 4, celdas: [[0, 0], [1, 1], [2, 2], [2, 3], [0, 3]] }, { ancho: 4, alto: 5, celdas: [[3, 0], [2, 1], [1, 2], [0, 3], [3, 4], [2, 4]] }];
      ej.forEach((x, i) => { const w = Math.max(2, Math.min(6, num(x.ancho, 3))), h = Math.max(2, Math.min(9, num(x.alto, 4))), cs = arr(x.celdas).filter(c => Array.isArray(c) && c[0] >= 0 && c[0] < w && c[1] >= 0 && c[1] < h); P(i, ej.length, { on: [], respondida: false, acierto: null, mostrar: false }, { w, h, cs: cs.length ? cs : [[0, 0]] }); });
    } else if (k === 'silabas') {
      const ps = arr(d.palabras).filter(p => p && arr(p.silabas).length >= 2);
      const base = ps.length ? ps : [{ palabra: 'MARIPOSA', silabas: ['MA', 'RI', 'PO', 'SA'] }, { palabra: 'ESCUELA', silabas: ['ES', 'CUE', 'LA'] }];
      base.forEach((p, i) => { const sil = p.silabas.map(s => String(s).toUpperCase()), w = sil.join(''); P(i, base.length, { cortes: [], respondida: false, acierto: null }, { w, sil }); });
    } else if (k === 'vf_rapido') {
      let af = arr(d.afirmaciones).filter(a => a && a.texto);
      if (!af.length) af = [{ texto: 'El Sol es una estrella.', verdadero: true }, { texto: 'Un triángulo tiene cuatro lados.', verdadero: false }];
      af.forEach((a, i) => P(i, af.length, { respondida: false, acierto: null }, { a, seg: Math.max(4, Math.min(60, num(d.segundos, 12))) }));
    } else if (k === 'ruleta_preguntas') {
      let ps = arr(d.preguntas).filter(p => p && p.pregunta && arr(p.opciones).length >= 2);
      if (!ps.length) ps = [{ categoria: 'Ciencias', pregunta: '¿Cuántos planetas tiene el sistema solar?', opciones: ['7', '8', '9'], correcta: 1 }, { categoria: 'Lengua', pregunta: '¿Cuál es un verbo?', opciones: ['correr', 'mesa', 'azul'], correcta: 0 }];
      const cats = [...new Set(ps.map(p => String(p.categoria || 'Pregunta')))];
      ps.forEach((p, i) => P(i, ps.length, { fase: 'girar', sel: null, respondida: false, acierto: null, orden: shuf(p.opciones.map((_, j) => j)) }, { p, cats, cat: String(p.categoria || 'Pregunta') }));
    }
    return out;
  }

  /* ---------- RELOJ ---------- */
  function clockSVG(hd, md, id) {
    let t = ''; for (let i = 1; i <= 12; i++) { const a = i * 30 * Math.PI / 180; t += `<text x="${100 + 76 * Math.sin(a)}" y="${100 - 76 * Math.cos(a) + 7}" text-anchor="middle" font-size="20" font-weight="800" fill="#33334d">${i}</text>`; }
    for (let i = 0; i < 60; i++) { const a = i * 6 * Math.PI / 180, l = i % 5 ? 3 : 7; t += `<line x1="${100 + 94 * Math.sin(a)}" y1="${100 - 94 * Math.cos(a)}" x2="${100 + (94 - l) * Math.sin(a)}" y2="${100 - (94 - l) * Math.cos(a)}" stroke="#33334d" stroke-width="${i % 5 ? 1 : 2.4}"/>`; }
    return `<svg id="${id}" class="pp-svg" viewBox="0 0 200 200" width="300" height="300" role="img" aria-label="Reloj analógico" style="touch-action:none"><circle cx="100" cy="100" r="98" fill="#fff" stroke="#3f00d8" stroke-width="5"/>${t}<g transform="rotate(${hd} 100 100)"><line x1="100" y1="108" x2="100" y2="52" stroke="#33334d" stroke-width="9" stroke-linecap="round"/></g><g transform="rotate(${md} 100 100)"><line x1="100" y1="110" x2="100" y2="26" stroke="#3f00d8" stroke-width="5" stroke-linecap="round"/></g><circle cx="100" cy="100" r="7" fill="#ff9f1c"/></svg>`;
  }
  const hhmm = (hb, md) => { const m = Math.round(md / 6) % 60, h = Math.round(hb / 30) % 12; return ((h || 12) + ':' + String(m).padStart(2, '0')); };
  function rReloj(s, est) {
    if (s.modo === 'leer') {
      const hd = (s.h % 12) * 30 + s.mi * .5, md = s.mi * 6;
      return `<div class="kp-screen">${head('reloj', '¿Qué hora marca el reloj?', 'Reloj ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap">${clockSVG(hd, md, 'pp-clock')}</div><div class="kp-answers">${s.op.map((o, i) => `<button type="button" class="kp-answer${est.respondida ? (o === s.cor ? ' ok' : (est.sel === o ? ' bad' : ' muted')) : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.relojLeer(${pantallaIdx},${i})"><span class="kp-letra">${'ABC'[i]}</span><span class="kp-answer-txt">${esc(o)}</span></button>`).join('')}</div></div>`;
    }
    const hd = est.hBase + (est.mDeg / 6) * .5;
    return `<div class="kp-screen">${head('reloj', 'Pon el reloj a las ' + ((s.h || 12) + ':' + String(s.mi).padStart(2, '0')), 'Reloj ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-row" role="group" aria-label="Elige la aguja"><button type="button" class="pp-btn" id="pp-b-h" aria-pressed="${est.activa === 'h'}" onclick="PJP.relojAguja(${pantallaIdx},'h')">Aguja de las horas</button><button type="button" class="pp-btn" id="pp-b-m" aria-pressed="${est.activa === 'min'}" onclick="PJP.relojAguja(${pantallaIdx},'min')">Aguja de los minutos</button></div>${clockSVG(hd, est.mDeg, 'pp-clock')}<div class="pp-hint" id="pp-dig" aria-live="polite">${hhmm(est.hBase, est.mDeg)}</div><button type="button" class="kp-btn" ${est.respondida ? 'disabled' : ''} onclick="PJP.relojOk(${pantallaIdx})">Comprobar</button></div></div>`;
  }
  function iReloj(s, idx, est) {
    if (s.modo === 'leer') return;
    const svg = document.getElementById('pp-clock'); if (!svg) return; let down = false;
    const upd = () => { const hd = est.hBase + (est.mDeg / 6) * .5; const cur = document.getElementById('pp-clock'); if (!cur) return; cur.outerHTML = clockSVG(hd, est.mDeg, 'pp-clock'); bind(); const dg = document.getElementById('pp-dig'); if (dg) dg.textContent = hhmm(est.hBase, est.mDeg); };
    function ang(e) { const r = document.getElementById('pp-clock').getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360; }
    function set(e) { if (est.respondida) return; const a = ang(e); if (est.activa === 'min') { const st = s.snap * 6; est.mDeg = (Math.round(a / st) * st) % 360; } else { est.hBase = (Math.round(a / 30) * 30) % 360; } upd(); }
    function bind() { const sv = document.getElementById('pp-clock'); if (!sv) return; sv.onpointerdown = e => { down = true; try { sv.setPointerCapture(e.pointerId); } catch (x) { /* ok */ } set(e); }; sv.onpointermove = e => { if (down) set(e); }; sv.onpointerup = sv.onpointercancel = () => { down = false; }; }
    bind();
  }
  /* ---------- RECTA NUMÉRICA ---------- */
  function rRecta(s, est) {
    const W = Math.max(300, Math.min(640, (window.innerWidth || 640) - 44)), n = Math.round((s.mx - s.mn) / s.paso), x0 = 28, x1 = W - 28, cada = Math.max(1, Math.ceil(n / Math.max(2, Math.floor((W - 56) / 44)))), fmt = v => String(Math.round(v * 1000) / 1000).replace('.', ',');
    const X = i => x0 + (x1 - x0) * i / n, ti = Math.round((s.valor - s.mn) / s.paso);
    let g = `<line x1="${x0 - 10}" y1="70" x2="${x1 + 10}" y2="70" stroke="#33334d" stroke-width="4" stroke-linecap="round"/>`;
    for (let i = 0; i <= n; i++) {
      const v = s.mn + i * s.paso, big = i % cada === 0 || i === 0 || i === n, sel = est.sel != null && Math.abs(est.sel - v) < 1e-9;
      g += `<line x1="${X(i)}" y1="${big ? 56 : 62}" x2="${X(i)}" y2="${big ? 84 : 78}" stroke="#33334d" stroke-width="${big ? 3 : 2}"/>`;
      if (big && i !== ti) g += `<text x="${X(i)}" y="108" text-anchor="middle" font-size="${W < 500 ? 15 : 18}" font-weight="800" fill="#33334d">${fmt(v)}</text>`;
      if (sel) g += `<g><path d="M${X(i)} 66 l-11 -26 h22z" fill="#e11d48"/><circle cx="${X(i)}" cy="70" r="8" fill="#e11d48"/></g>`;
      g += `<rect x="${X(i) - Math.max(8, (x1 - x0) / n / 2)}" y="20" width="${Math.max(16, (x1 - x0) / n)}" height="90" fill="transparent" style="cursor:pointer" ${est.respondida ? '' : `onclick="PJP.rectaSel(${pantallaIdx},${i})"`} role="button" aria-label="${fmt(v)}"/>`;
    }
    const q = s.txt || ('Toca en la recta dónde está el ' + fmt(s.valor));
    return `<div class="kp-screen">${head('recta_numerica', q, 'Recta ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><svg class="pp-svg" viewBox="0 0 ${W} 130" width="${W}" role="img" aria-label="Recta numérica de ${fmt(s.mn)} a ${fmt(s.mx)}" style="width:100%;max-width:${W}px">${g}</svg><button type="button" class="kp-btn" ${est.sel == null || est.respondida ? 'disabled' : ''} onclick="PJP.rectaOk(${pantallaIdx})">Comprobar</button></div></div>`;
  }
  /* ---------- GRÁFICO ---------- */
  function chartSVG(s) {
    const dt = s.dt, mx = Math.max(1, ...dt.map(x => x.valor)), W = 440, H = 230, bw = Math.min(64, (W - 60) / dt.length - 10), gap = (W - 50) / dt.length;
    let g = `<line x1="40" y1="${H - 36}" x2="${W - 6}" y2="${H - 36}" stroke="#33334d" stroke-width="3"/><line x1="40" y1="14" x2="40" y2="${H - 36}" stroke="#33334d" stroke-width="3"/>`;
    const top = Math.ceil(mx / 5) * 5 || 5, st = top > 10 ? top / 5 : 1;
    for (let v = 0; v <= top; v += st) { const y = (H - 36) - (H - 56) * v / top; g += `<line x1="36" y1="${y}" x2="${W - 6}" y2="${y}" stroke="#d9ccff" stroke-width="1"/><text x="32" y="${y + 5}" text-anchor="end" font-size="13" fill="#6b5aa6">${v}</text>`; }
    dt.forEach((x, i) => {
      const cx = 50 + gap * i + gap / 2;
      if (s.tg === 'pictograma') { const n = Math.round(x.valor), cols = 1; for (let j = 0; j < n; j++) g += `<circle cx="${cx}" cy="${H - 48 - j * 14}" r="6" fill="${x.color}"/>`; g += `<text x="${cx}" y="${H - 52 - n * 14}" text-anchor="middle" font-size="14" font-weight="800" fill="#33334d">${x.valor}</text>`; }
      else { const h = (H - 56) * x.valor / top; g += `<rect x="${cx - bw / 2}" y="${H - 36 - h}" width="${bw}" height="${h}" rx="6" fill="${x.color}"/><text x="${cx}" y="${H - 40 - h}" text-anchor="middle" font-size="14" font-weight="800" fill="#33334d">${x.valor}</text>`; }
      g += `<text x="${cx}" y="${H - 14}" text-anchor="middle" font-size="13" font-weight="700" fill="#33334d">${esc(x.etiqueta.slice(0, 11))}</text>`;
    });
    const desc = s.dt.map(x => x.etiqueta + ': ' + x.valor).join('. ');
    return `<svg class="pp-svg" viewBox="0 0 ${W} ${H}" width="${W}" style="width:100%;max-width:${W}px" role="img" aria-label="Gráfico ${esc(s.gt)}. ${esc(desc)}">${g}</svg>`;
  }
  function rGrafico(s, est) {
    const p = s.p, ok = Number(p.correcta);
    return `<div class="kp-screen">${head('grafico', p.pregunta, 'Gráfico ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap">${s.gt ? `<div class="pp-hint">${esc(s.gt)}${s.unidad ? ' (' + esc(s.unidad) + ')' : ''}</div>` : ''}${chartSVG(s)}</div><div class="kp-answers">${est.orden.map((k, i) => `<button type="button" class="kp-answer${est.respondida ? (k === ok ? ' ok' : (k === est.sel ? ' bad' : ' muted')) : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.opcion(${pantallaIdx},${k})"><span class="kp-letra">${'ABCDEFGH'[i] || '•'}</span><span class="kp-answer-txt">${esc(p.opciones[k])}</span></button>`).join('')}</div></div>`;
  }
  /* ---------- BALANZA ---------- */
  const sum = a => a.reduce((x, y) => x + y, 0);
  function scaleSVG(s, est, idx) {
    const L = sum(s.izq), Rr = sum(s.der) + sum(est.add), ang = Math.max(-14, Math.min(14, (Rr - L) * 3)), a = Math.abs(ang) * Math.PI / 180, len = 130, cx = 200, cy = 70;
    const d = len * Math.sin(a), dx = len * Math.cos(a), lyy = cy + (ang > 0 ? -d : d), ryy = cy + (ang > 0 ? d : -d);
    const chips = (vals, rem) => vals.map((v, i) => { const x = -70 + (i % 5) * 28.5, y = -30 - Math.floor(i / 5) * 30; return `<g ${rem && rem[i] ? `onclick="PJP.balQuitar(${idx},${rem[i] - 1})" style="cursor:pointer" role="button" aria-label="Quitar ${v}"` : ''}><rect x="${x}" y="${y}" width="27" height="27" rx="7" fill="${COL[(v + 7) % 8]}"/><text x="${x + 13.5}" y="${y + 19}" text-anchor="middle" font-size="16" font-weight="900" fill="#fff">${v}</text></g>`; }).join('');
    const rem = s.der.map(() => 0).concat(est.add.map((_, i) => i + 1));
    const pan = '<line x1="0" y1="-42" x2="-62" y2="0" stroke="#6b5aa6" stroke-width="3"/><line x1="0" y1="-42" x2="62" y2="0" stroke="#6b5aa6" stroke-width="3"/><path d="M-70 0h140q-10 22-35 22h-70q-25 0-35-22z" fill="#c9b8ff"/>';
    return `<svg id="pp-scale" class="pp-svg" viewBox="0 0 400 270" width="400" style="width:100%;max-width:440px" role="img" aria-label="Balanza. Izquierda ${L}. Derecha ${Rr}.">
<path d="M165 262h70l-10-26h-50z" fill="#a78bfa"/><rect x="196" y="${cy}" width="8" height="170" rx="4" fill="#a78bfa"/>
<line x1="${cx - dx}" y1="${lyy}" x2="${cx + dx}" y2="${ryy}" stroke="#3f00d8" stroke-width="9" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="9" fill="#ff9f1c"/>
<g transform="translate(${cx - dx},${lyy + 44})">${pan}${chips(s.izq)}</g>
<g transform="translate(${cx + dx},${ryy + 44})">${pan}${chips(s.der.concat(est.add), rem)}</g>
<text x="${cx - 120}" y="26" text-anchor="middle" font-size="22" font-weight="900" fill="#33334d">${L}</text><text x="${cx + 120}" y="26" text-anchor="middle" font-size="22" font-weight="900" fill="#33334d">${Rr}</text></svg>`;
  }
  function rBalanza(s, est) {
    const idx = pantallaIdx;
    return `<div class="kp-screen">${head('balanza', 'Añade pesas al plato derecho hasta que la balanza quede equilibrada.', 'Balanza ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap">${s.eq ? `<div class="pp-hint">${esc(s.eq)}</div>` : ''}<div id="pp-scalebox">${scaleSVG(s, est, idx)}</div><div class="pp-row" role="group" aria-label="Pesas disponibles">${s.pesas.map(v => `<button type="button" class="pp-chip" style="background:${COL[(v - 1 + 8) % 8]}" ${est.respondida ? 'disabled' : ''} onclick="PJP.balAdd(${idx},${v})" aria-label="Añadir pesa de ${v}">${v}</button>`).join('')}<button type="button" class="pp-btn" ${est.respondida ? 'disabled' : ''} onclick="PJP.balVaciar(${idx})">Vaciar</button></div></div></div>`;
  }
  function balUpd(idx) { const s = pantallas[idx], est = kpEstado[idx], b = document.getElementById('pp-scalebox'); if (b) b.innerHTML = scaleSVG(s, est, idx); }
    /* ---------- AHORCADO ---------- */
  const ABC = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
  function rAhorcado(s, est) {
    const letras = [...s.w], ok = c => c === ' ' || c === '-' || est.usadas.includes(norm(c));
    const show = est.respondida && !est.acierto ? letras.map(c => c) : letras.map(c => ok(c) ? c : '');
    return `<div class="kp-screen">${head('ahorcado', s.pista || 'Adivina la palabra letra a letra.', 'Palabra ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-hearts" role="img" aria-label="Te quedan ${s.vidas - est.fallos} vidas">${[...Array(s.vidas)].map((_, i) => `<span class="${i === s.vidas - est.fallos && est.fallos ? 'pp-lost' : ''}" style="opacity:${i < s.vidas - est.fallos ? 1 : .2}">❤</span>`).join('')}</div><div class="pp-row" aria-label="Palabra secreta de ${letras.length} letras">${show.map(c => c === ' ' ? '<span style="width:20px"></span>' : `<span class="pp-tile slot" style="cursor:default;${c && est.respondida && !est.acierto && !est.usadas.includes(norm(c)) ? 'color:#e11d48' : ''}">${esc(c)}</span>`).join('')}</div><div class="pp-kb">${ABC.map(l => { const u = est.usadas.includes(l), bad = u && !norm(s.w).includes(l); return `<button type="button" class="pp-tile${u ? (bad ? ' bad' : ' ok') : ''}" ${u || est.respondida ? 'disabled' : ''} onclick="PJP.ahLetra(${pantallaIdx},'${l}')">${l}</button>`; }).join('')}</div></div></div>`;
  }
  /* ---------- ANAGRAMA ---------- */
  function rAnagrama(s, est) {
    const n = s.L.length;
    return `<div class="kp-screen">${head('anagrama', s.pista || 'Toca las letras para formar la palabra.', 'Palabra ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-row" id="pp-slots" aria-label="Palabra de ${n} letras">${[...Array(n)].map((_, i) => { const p = est.puestas[i]; return `<button type="button" class="pp-tile slot${est.respondida ? (est.acierto ? ' ok' : ' bad') : ''}" ${p == null || est.respondida ? 'disabled' : ''} onclick="PJP.anQuitar(${pantallaIdx},${i})" aria-label="${p == null ? 'Hueco vacío' : 'Quitar ' + esc(s.L[p])}">${p == null ? '' : esc(s.L[p])}</button>`; }).join('')}</div><div class="pp-msg" id="pp-msg" aria-live="polite"></div><div class="pp-row">${s.orden.map(j => `<button type="button" class="pp-tile" ${est.puestas.includes(j) || est.respondida ? 'disabled' : ''} onclick="PJP.anPon(${pantallaIdx},${j})">${esc(s.L[j])}</button>`).join('')}</div></div></div>`;
  }
  /* ---------- PATRONES / opciones genéricas ---------- */
  function rPatrones(s, est) {
    const p = s.p, ok = Number(p.correcta), ser = p.serie.map(String), mi = ser.findIndex(x => x === '?' || x === '_' || x === '__');
    return `<div class="kp-screen">${head('patrones', p.pregunta || '¿Qué viene después? Completa la serie.', 'Serie ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-series" role="img" aria-label="Serie: ${esc(ser.map((x, i) => i === mi ? 'hueco' : x).join(', '))}">${ser.map((x, i) => i === mi ? `<span class="pp-tile slot" style="cursor:default">${est.respondida ? esc(p.opciones[ok]) : '?'}</span>` : `<span class="pp-tile" style="cursor:default">${esc(x)}</span>`).join('')}</div></div><div class="kp-answers">${est.orden.map((k, i) => `<button type="button" class="kp-answer${est.respondida ? (k === ok ? ' ok' : (k === est.sel ? ' bad' : ' muted')) : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.opcion(${pantallaIdx},${k})"><span class="kp-letra">${'ABCDEFGH'[i] || '•'}</span><span class="kp-answer-txt">${esc(p.opciones[k])}</span></button>`).join('')}</div></div>`;
  }
  /* ---------- SIMETRÍA ---------- */
  function rSimetria(s, est) {
    const z = Math.max(22, Math.min(52, Math.floor((Math.min(560, (window.innerWidth || 560) - 60) - 6 - 3 * (s.w * 2 - 1)) / (s.w * 2))));
    const fx = new Set(s.cs.map(c => c[0] + ',' + c[1])), exp = new Set(s.cs.map(c => (2 * s.w - 1 - c[0]) + ',' + c[1])), on = new Set(est.on);
    let h = '';
    for (let y = 0; y < s.h; y++) for (let x = 0; x < s.w * 2; x++) {
      const key = x + ',' + y;
      if (x < s.w) h += `<div class="pp-cell${fx.has(key) ? ' fx' : ''}" style="width:${z}px;height:${z}px" aria-label="${fx.has(key) ? 'pintada' : 'vacía'}"></div>`;
      else { let c = 'pp-cell' + (on.has(key) ? ' on' : ''); if (est.respondida) c += exp.has(key) ? (on.has(key) ? ' on' : ' miss') : (on.has(key) ? ' miss' : ''); h += `<button type="button" class="${c}" style="width:${z}px;height:${z}px${x === s.w ? ';margin-left:6px' : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.simTog(${pantallaIdx},${x},${y})" aria-label="Columna ${x + 1} fila ${y + 1} ${on.has(key) ? 'pintada' : 'vacía'}" aria-pressed="${on.has(key)}"></button>`; }
    }
    return `<div class="kp-screen">${head('simetria', 'Pinta en el lado derecho el reflejo de la figura, como en un espejo.', 'Reflejo ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-grid" id="pp-simgrid" style="grid-template-columns:repeat(${s.w * 2},${z}px)">${h}</div><button type="button" class="kp-btn" ${est.respondida ? 'disabled' : ''} onclick="PJP.simOk(${pantallaIdx})">Comprobar</button></div></div>`;
  }
  /* ---------- SÍLABAS ---------- */
  function rSilabas(s, est) {
    const L = [...s.w];
    let h = ''; L.forEach((c, i) => { h += `<span class="pp-tile" style="cursor:default;min-width:44px">${esc(c)}</span>`; if (i < L.length - 1) h += `<button type="button" class="pp-gap${est.cortes.includes(i + 1) ? ' cut' : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.silCorta(${pantallaIdx},${i + 1})" aria-label="Cortar entre ${esc(c)} y ${esc(L[i + 1])}" aria-pressed="${est.cortes.includes(i + 1)}"></button>`; });
    return `<div class="kp-screen">${head('silabas', 'Toca entre las letras para cortar la palabra en sílabas.', 'Palabra ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-row" style="gap:0;flex-wrap:nowrap;overflow-x:auto;max-width:100%">${h}</div><button type="button" class="kp-btn" ${est.respondida ? 'disabled' : ''} onclick="PJP.silOk(${pantallaIdx})">Comprobar</button></div></div>`;
  }
  /* ---------- VERDADERO / FALSO ---------- */
  function rVF(s, est) {
    return `<div class="kp-screen">${head('vf_rapido', s.a.texto, 'Afirmación ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><div class="pp-bar" role="timer" aria-label="Tiempo restante"><i id="pp-vf-bar"></i></div><div class="pp-vf"><button type="button" style="background:#16a34a${est.respondida ? ';opacity:.5' : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.vf(${pantallaIdx},true)">✔ Verdadero</button><button type="button" style="background:#e11d48${est.respondida ? ';opacity:.5' : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.vf(${pantallaIdx},false)">✘ Falso</button></div></div></div>`;
  }
  let vfT = null;
  function iVF(s, idx, est) {
    clearInterval(vfT); if (est.respondida) return; const bar = document.getElementById('pp-vf-bar'), t0 = Date.now(), ms = s.seg * 1000;
    vfT = setInterval(() => { if (kpEstado[idx] !== est || est.respondida || pantallaIdx !== idx || !document.getElementById('pp-vf-bar')) { clearInterval(vfT); return; } const k = Math.max(0, 1 - (Date.now() - t0) / ms); bar.style.transform = `scaleX(${k})`; if (k <= 0) { clearInterval(vfT); PJP.vf(idx, null); } }, 100);
  }
  /* ---------- RULETA ---------- */
  function rRuleta(s, est) {
    const n = s.cats.length, seg = 360 / n, R0 = 100;
    if (est.fase === 'girar') {
      let g = ''; s.cats.forEach((c, i) => { const a0 = (i * seg - 90) * Math.PI / 180, a1 = ((i + 1) * seg - 90) * Math.PI / 180, m = ((i + .5) * seg - 90) * Math.PI / 180; g += n === 1 ? `<circle cx="100" cy="100" r="${R0}" fill="${COL[0]}"/>` : `<path d="M100 100 L${100 + R0 * Math.cos(a0)} ${100 + R0 * Math.sin(a0)} A${R0} ${R0} 0 ${seg > 180 ? 1 : 0} 1 ${100 + R0 * Math.cos(a1)} ${100 + R0 * Math.sin(a1)}z" fill="${COL[i % COL.length]}" stroke="#fff" stroke-width="2"/>`; g += `<text x="${100 + 62 * Math.cos(m)}" y="${100 + 62 * Math.sin(m) + 4}" text-anchor="middle" font-size="${n > 5 ? 9 : 12}" font-weight="900" fill="#fff" transform="rotate(${(i + .5) * seg} ${100 + 62 * Math.cos(m)} ${100 + 62 * Math.sin(m)})">${esc(c.slice(0, 11))}</text>`; });
      return `<div class="kp-screen">${head('ruleta_preguntas', 'Gira la ruleta para descubrir la categoría de tu pregunta.', 'Pregunta ' + (s.qi + 1) + ' de ' + s.n)}<div class="pp-wrap"><svg class="pp-svg" viewBox="0 0 200 215" width="320" role="img" aria-label="Ruleta con las categorías ${esc(s.cats.join(', '))}"><g id="pp-wheel" class="pp-wheel">${g}<circle cx="100" cy="100" r="9" fill="#fff"/></g><path d="M100 18 l-9 -16 h18z" fill="#33334d" transform="translate(0,-2)"/></svg><button type="button" class="kp-btn" id="pp-spin" onclick="PJP.ruGira(${pantallaIdx})">¡Girar!</button></div></div>`;
    }
    const p = s.p, ok = Number(p.correcta), ci = s.cats.indexOf(s.cat);
    return `<div class="kp-screen"><div class="kp-qcard"><span class="kp-orb" aria-hidden="true"></span><div class="kp-qt" style="background:${COL[ci % COL.length]};color:#fff"><span class="material-symbols-rounded" aria-hidden="true">casino</span> ${esc(s.cat)}</div><div class="kp-q">${esc(p.pregunta)}</div></div><div class="kp-answers">${est.orden.map((k, i) => `<button type="button" class="kp-answer${est.respondida ? (k === ok ? ' ok' : (k === est.sel ? ' bad' : ' muted')) : ''}" ${est.respondida ? 'disabled' : ''} onclick="PJP.opcion(${pantallaIdx},${k})"><span class="kp-letra">${'ABCDEFGH'[i] || '•'}</span><span class="kp-answer-txt">${esc(p.opciones[k])}</span></button>`).join('')}</div></div>`;
  }

  /* ---------- API pública ---------- */
  const RND = { reloj: rReloj, recta_numerica: rRecta, grafico: rGrafico, balanza: rBalanza, ahorcado: rAhorcado, anagrama: rAnagrama, patrones: rPatrones, simetria: rSimetria, silabas: rSilabas, vf_rapido: rVF, ruleta_preguntas: rRuleta };
  const INI = { reloj: iReloj, vf_rapido: iVF };
  const cur = idx => pantallas[idx];
  window.PJP = {
    opcion(idx, k) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; est.sel = k; const p = s.p; resolver(idx, k === Number(p.correcta), p.opciones[Number(p.correcta)]); },
    relojLeer(idx, i) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; est.sel = s.op[i]; resolver(idx, s.op[i] === s.cor, s.cor); },
    relojAguja(idx, a) { const est = kpEstado[idx]; est.activa = a; ['h', 'min'].forEach(x => { const b = document.getElementById(x === 'h' ? 'pp-b-h' : 'pp-b-m'); if (b) b.setAttribute('aria-pressed', String(est.activa === x)); }); },
    relojOk(idx) {
      const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return;
      const m = Math.round(est.mDeg / 6) % 60, h = Math.round(est.hBase / 30) % 12, dm = Math.min(Math.abs(m - s.mi), 60 - Math.abs(m - s.mi));
      resolver(idx, dm <= (s.snap === 5 ? 2 : 1) && h === s.h % 12, (s.h || 12) + ':' + String(s.mi).padStart(2, '0'));
    },
    rectaSel(idx, i) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; est.sel = s.mn + i * s.paso; renderPantalla(); },
    rectaOk(idx) { const s = cur(idx), est = kpEstado[idx]; if (est.sel == null) return; resolver(idx, Math.abs(est.sel - s.valor) < s.paso / 2, String(s.valor).replace('.', ',')); },
    balAdd(idx, v) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; est.add.push(v); balUpd(idx); if (sum(s.der) + sum(est.add) === sum(s.izq)) setTimeout(() => resolver(idx, true, ''), 500); else if (est.add.length > 14) { est.add = []; balUpd(idx); } },
    balQuitar(idx, i) { const est = kpEstado[idx]; if (est.respondida) return; est.add.splice(i, 1); balUpd(idx); },
    balVaciar(idx) { const est = kpEstado[idx]; if (est.respondida) return; est.add = []; balUpd(idx); },
    ahLetra(idx, l) {
      const s = cur(idx), est = kpEstado[idx]; if (est.respondida || est.usadas.includes(l)) return; est.usadas.push(l);
      const w = norm(s.w); if (!w.includes(l)) est.fallos++;
      const gana = [...w].every(c => c === ' ' || c === '-' || est.usadas.includes(c));
      if (gana) resolver(idx, true, s.w); else if (est.fallos >= s.vidas) resolver(idx, false, s.w); else renderPantalla();
    },
    anPon(idx, j) {
      const s = cur(idx), est = kpEstado[idx]; if (est.respondida || est.puestas.includes(j)) return; est.puestas.push(j);
      if (est.puestas.length === s.L.length) {
        const w = est.puestas.map(p => s.L[p]).join('');
        if (norm(w) === norm(s.w.replace(/\s/g, ''))) { resolver(idx, true, s.w); return; }
        est.fallos++; if (est.fallos >= 3) { resolver(idx, false, s.w); return; }
        est.puestas = []; renderPantalla(); sh('pp-slots'); msg('Casi… ¡inténtalo otra vez!', '#e11d48'); return;
      }
      renderPantalla();
    },
    anQuitar(idx, i) { const est = kpEstado[idx]; if (est.respondida) return; est.puestas.splice(i, 1); renderPantalla(); },
    simTog(idx, x, y) { const est = kpEstado[idx]; if (est.respondida) return; const k = x + ',' + y, i = est.on.indexOf(k); if (i >= 0) est.on.splice(i, 1); else est.on.push(k); renderPantalla(); },
    simOk(idx) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; const exp = s.cs.map(c => (2 * s.w - 1 - c[0]) + ',' + c[1]).sort().join('|'); resolver(idx, est.on.slice().sort().join('|') === exp, 'el reflejo'); },
    silCorta(idx, p) { const est = kpEstado[idx]; if (est.respondida) return; const i = est.cortes.indexOf(p); if (i >= 0) est.cortes.splice(i, 1); else est.cortes.push(p); renderPantalla(); },
    silOk(idx) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; let a = 0; const exp = s.sil.slice(0, -1).map(x => (a += [...x].length)); resolver(idx, est.cortes.slice().sort((x, y) => x - y).join() === exp.join(), s.sil.join(' - ')); },
    vf(idx, v) { const s = cur(idx), est = kpEstado[idx]; if (est.respondida) return; clearInterval(vfT); const real = s.a.verdadero === true || s.a.verdadero === 'true'; resolver(idx, v === real, (real ? 'Verdadero' : 'Falso') + (s.a.explicacion ? '. ' + s.a.explicacion : '')); },
    ruGira(idx) {
      const s = cur(idx), est = kpEstado[idx], w = document.getElementById('pp-wheel'), b = document.getElementById('pp-spin'); if (!w || est.girando) return; est.girando = true; if (b) b.disabled = true;
      const n = s.cats.length, seg = 360 / n, i = s.cats.indexOf(s.cat), rot = 360 * 5 - (i + .5) * seg + (Math.random() - .5) * seg * .6;
      w.style.transform = `rotate(${rot}deg)`; if (window.pjSonido) try { pjSonido.hoja(); } catch (e) { /* ok */ }
      setTimeout(() => { est.girando = false; est.fase = 'pregunta'; if (kpEstado[idx] === est && pantallaIdx === idx) renderPantalla(); }, matchMedia('(prefers-reduced-motion:reduce)').matches ? 50 : 3300);
    }
  };

  window.PJPrimaria = {
    TIPOS, crear,
    render(s, est) { const f = RND[s.k]; return f ? f(s, est) : '<div class="kp-screen"><p>Este reto no está disponible.</p></div>'; },
    init(s, idx) { const f = INI[s.k]; if (f) f(s, idx, kpEstado[idx]); },
    texto(s) {
      const t = { reloj: s.modo === 'leer' ? 'Reloj analógico: ¿qué hora marca?' : 'Pon el reloj a las ' + ((s.h || 12) + ':' + String(s.mi).padStart(2, '0')), recta_numerica: 'Recta numérica: coloca el ' + s.valor, grafico: s.p ? s.p.pregunta : 'Gráfico', balanza: 'Equilibra la balanza con pesas', ahorcado: 'Adivina la palabra letra a letra. ' + (s.pista || ''), anagrama: 'Ordena las letras. ' + (s.pista || ''), patrones: 'Completa la serie', simetria: 'Pinta el reflejo de la figura', silabas: 'Separa la palabra en sílabas', vf_rapido: s.a ? s.a.texto : 'Verdadero o falso', ruleta_preguntas: s.p ? 'Ruleta de preguntas. Categoría ' + s.cat : 'Ruleta' };
      return t[s.k] || '';
    }
  };
})();
