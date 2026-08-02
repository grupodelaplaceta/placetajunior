/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR STUDIO — Crea actividades desde la web
   Envía la actividad a la API oficial de admin-placeta:
   POST /api/junior/actividades (requiere Acuerdo de Colaborador 18+)
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'https://admin-placeta.vercel.app/api/junior';

function $(id) { return document.getElementById(id); }

// ── Parsear preguntas del textarea ─────────────────────────────────
function parsearPreguntas(texto) {
  const lineas = texto.split('\n').map(l => l.trim()).filter(l => l);
  const preguntas = [];
  for (const linea of lineas) {
    const partes = linea.split('|').map(p => p.trim());
    if (partes.length < 3) continue;
    const pregunta = partes[0];
    const opciones = partes.slice(1, -1);
    const correcta = parseInt(partes[partes.length - 1], 10);
    if (!pregunta || opciones.length === 0) continue;
    preguntas.push({
      pregunta,
      opciones,
      correcta: correcta - 1 // la API espera índice 0-based (opción - 1)
    });
  }
  return preguntas;
}

// ── Enviar actividad ───────────────────────────────────────────────
async function enviarActividad(e) {
  e.preventDefault();
  const bannerErr = $('form-error');
  const bannerOk = $('form-success');
  bannerErr.classList.add('hidden');
  bannerOk.classList.add('hidden');

  const dip = $('f-dip').value.trim();
  const titulo = $('f-titulo').value.trim();
  const descripcion = $('f-descripcion').value.trim();
  const categoria = $('f-categoria').value;
  const tipo = $('f-tipo').value;
  const edad_recomendada = $('f-edad').value.trim();
  const dificultad = $('f-dificultad').value;
  const tiempo_estimado = parseInt($('f-tiempo').value, 10) || 10;
  const num_preguntas = parseInt($('f-preguntas').value, 10) || 0;
  const num_fases = parseInt($('f-fases').value, 10) || 1;
  const tipo_titular = $('f-titular').value;
  const eip = $('f-eip').value.trim() || null;
  const portada_url = $('f-portada').value.trim() || null;

  if (!dip || !titulo || !descripcion || !categoria || !tipo) {
    mostrarError('Completa todos los campos obligatorios.');
    return false;
  }

  // Parsear preguntas
  const preguntas = parsearPreguntas($('f-contenido').value);
  const contenido = {
    preguntas,
    num_preguntas_real: preguntas.length
  };

  const body = {
    dip, titulo, descripcion, categoria, tipo,
    edad_recomendada, dificultad, tiempo_estimado,
    num_preguntas, num_fases, tipo_titular, eip, portada_url,
    contenido
  };

  // Deshabilitar botón mientras se envía
  const btn = document.querySelector('#studio-form .btn');
  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = '⏳ Enviando…';

  try {
    const res = await fetch(`${API_BASE}/actividades`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.success) {
      // Si pide el acuerdo de colaborador, avisar
      if (data.necesita_acuerdo) {
        mostrarError(`❌ ${data.error || 'Debes firmar el Acuerdo de Colaborador.'}\n\nPara publicar necesitas ser mayor de 18 años y firmar el acuerdo vía PlacetaID. Escribe a junior@laplaceta.org para iniciar el proceso.`);
      } else {
        mostrarError(`❌ ${data.error || `Error (HTTP ${res.status})`}`);
      }
      return false;
    }

    bannerOk.textContent = `✅ ${data.mensaje || 'Actividad enviada a revisión.'} ${data.actividad?.es_examen ? 'Se tratará como EXAMEN (genera diploma).' : ''}`;
    bannerOk.classList.remove('hidden');
    document.querySelector('#studio-form').reset();
    return false;
  } catch (err) {
    mostrarError(`❌ Error de conexión: ${err.message}`);
    return false;
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

function mostrarError(msg) {
  const banner = $('form-error');
  banner.textContent = msg;
  banner.classList.remove('hidden');
}
