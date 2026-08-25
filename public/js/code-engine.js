/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR CODE — Motor de bloques en el cliente
   Réplica exacta del motor del backend (admin-placeta/src/config/junior-code.js)
   para que las actividades code_blocks se jueguen igual que las demás:
   evaluación local instantánea, sin depender de red ni de DIP.
   Si hay DIP, además se puede guardar el resultado en el servidor.
   ═══════════════════════════════════════════════════════════════════ */

window.PJCode = (function () {
  'use strict';

  const BLOQUES_CODE = {
    avanzar:    { cat: 'movimiento', nombre: 'AVANZAR', params: [], desc: 'Avanza una casilla' },
    retroceder: { cat: 'movimiento', nombre: 'RETROCEDER', params: [], desc: 'Retrocede una casilla' },
    girar:      { cat: 'movimiento', nombre: 'GIRAR', params: ['dir'], desc: 'Gira a la derecha o izquierda' },
    saltar:     { cat: 'movimiento', nombre: 'SALTAR', params: [], desc: 'Salta a la siguiente casilla' },
    repetir:    { cat: 'control', nombre: 'BUCLE', params: ['veces'], bloques: true, desc: 'Bucle: repite los pasos dentro N veces' },
    si:         { cat: 'control', nombre: 'SI', params: ['condicion', 'hacia', 'negado'], bloques: true, desc: 'Si la condición se cumple, ejecuta (admite "si no" y negación)' },
    sonido:     { cat: 'efectos', nombre: 'SONIDO', params: ['sonido'], desc: 'Reproduce un sonido divertido' },
  };

  // Direcciones: 0=derecha, 1=abajo, 2=izquierda, 3=arriba (sentido horario)
  const DELTAS = [
    { x: 1, y: 0 },   // derecha
    { x: 0, y: 1 },   // abajo
    { x: -1, y: 0 },  // izquierda
    { x: 0, y: -1 },  // arriba
  ];

  function normalizarPrograma(programa) {
    if (!Array.isArray(programa)) return [];
    return programa.map(b => {
      if (typeof b === 'string') {
        const [op, ...rest] = b.split(/\s+/);
        const p = {};
        if (op === 'repetir' && rest[0]) p.veces = parseInt(rest[0], 10) || 1;
        if (op === 'si' && rest[0]) p.condicion = rest[0];
        if (op === 'girar' && rest[0]) p.dir = rest[0].toLowerCase();
        return { op, ...p, bloques: [] };
      }
      if (b && typeof b === 'object') {
        return {
          op: b.op || b.tipo || 'avanzar',
          veces: b.veces != null ? Number(b.veces) : 1,
          dir: b.dir || b.direccion || 'derecha',
          condicion: b.condicion || b.si || 'obstaculo',
          hacia: b.hacia || 'delante',
          negado: !!b.negado,
          bloques: normalizarPrograma(b.bloques || b.bloques_ok || []),
          bloques_no: normalizarPrograma(b.bloques_no || b.bloques_else || b.sino || []),
        };
      }
      return { op: 'avanzar', bloques: [] };
    });
  }

  function ejecutarCode(escenario, inicio, programa, opts) {
    const { maxPasos = 200 } = opts || {};
    const ancho = escenario?.ancho || 6;
    const alto = escenario?.alto || 6;
    let x = inicio?.x ?? 0;
    let y = inicio?.y ?? 0;
    let dir = ['derecha', 'abajo', 'izquierda', 'arriba'].indexOf(inicio?.direccion || 'derecha');
    if (dir < 0) dir = 0;

    const obstaculos = new Set((escenario?.obstaculos || []).map(o => `${o.x},${o.y}`));
    const monedas = new Set((escenario?.monedas || []).map(o => `${o.x},${o.y}`));
    const monedasRecogidas = [];
    const meta = new Set();
    const metaObj = escenario?.meta || escenario?.estrella || escenario?.objetivo?.posicion;
    if (metaObj) meta.add(`${metaObj.x},${metaObj.y}`);

    const visitadas = new Set([`${x},${y}`]);
    let pasos = 0;
    let fin = false;
    const error = { tipo: null, mensaje: '' };
    let posicionFinal = { x, y };
    let maxBloquesUsados = 0;
    // Trazado paso a paso: permite animar la ejecución (reproducción)
    const trazado = [{ accion: 'inicio', x, y, dir, moneda: false }];

    const dentro = (cx, cy) => cx >= 0 && cx < ancho && cy >= 0 && cy < alto;
    const hayObstaculo = (cx, cy) => obstaculos.has(`${cx},${cy}`);

    const celdaHacia = (hacia) => {
      const map = { derecha: 1, der: 1, izquierda: 3, izq: 3, detras: 2, atras: 2, 'detrás': 2, 'atrás': 2 };
      const off = map[String(hacia || 'delante').toLowerCase()] ?? 0;
      const d = (dir + off) % 4;
      return { x: x + DELTAS[d].x, y: y + DELTAS[d].y };
    };
    const adyacentes = () => [
      { x: x + DELTAS[dir].x, y: y + DELTAS[dir].y },
      { x: x + DELTAS[(dir + 1) % 4].x, y: y + DELTAS[(dir + 1) % 4].y },
      { x: x + DELTAS[(dir + 3) % 4].x, y: y + DELTAS[(dir + 3) % 4].y },
    ];
    function evaluarCondicion(condRaw, negado, hacia) {
      const c = String(condRaw || 'obstaculo').toLowerCase();
      const neg = !!negado || /^(no_|sin_)/.test(c);
      const base = c.replace(/^(no_|sin_)/, '');
      const p = celdaHacia(hacia);
      const dentroC = dentro(p.x, p.y);
      let cumple = false;
      if (/obstac|bloqueo/.test(base)) cumple = !dentroC || hayObstaculo(p.x, p.y);
      else if (/borde|limite|fuera/.test(base)) cumple = !dentroC;
      else if (/meta|estrella|objetivo|llegada/.test(base)) {
        cumple = base.includes('cerca') ? adyacentes().some(c => meta.has(`${c.x},${c.y}`)) : meta.has(`${p.x},${p.y}`);
      } else if (base.includes('moneda')) {
        cumple = base.includes('cerca') ? adyacentes().some(c => monedas.has(`${c.x},${c.y}`)) : monedas.has(`${p.x},${p.y}`);
      } else if (/libre|vacio|despej/.test(base)) cumple = dentroC && !hayObstaculo(p.x, p.y);
      else cumple = !dentroC || hayObstaculo(p.x, p.y); // defecto: obstáculo
      return neg ? !cumple : cumple;
    }

    function registrar(accion, extra) {
      trazado.push({ accion, x, y, dir, ...(extra || {}) });
    }

    function ejecutarBloque(b, profundidad) {
      if (fin || pasos >= maxPasos) return;
      if (profundidad > 4) { fin = true; error.tipo = 'profundidad'; error.mensaje = 'Demasiados bloques anidados.'; return; }
      maxBloquesUsados = Math.max(maxBloquesUsados, profundidad);

      switch (b.op) {
        case 'avanzar': {
          pasos++;
          const nx = x + DELTAS[dir].x;
          const ny = y + DELTAS[dir].y;
          if (!dentro(nx, ny)) { fin = true; error.tipo = 'fuera'; error.mensaje = 'Candela se salió del tablero.'; registrar('error', { tipo: 'fuera' }); return; }
          if (hayObstaculo(nx, ny)) { fin = true; error.tipo = 'obstaculo'; error.mensaje = 'Candela chocó con un obstáculo.'; registrar('error', { tipo: 'obstaculo' }); return; }
          x = nx; y = ny;
          visitadas.add(`${x},${y}`);
          posicionFinal = { x, y };
          const coge = monedas.has(`${x},${y}`) && !monedasRecogidas.includes(`${x},${y}`);
          if (coge) monedasRecogidas.push(`${x},${y}`);
          registrar('avanzar', { moneda: coge });
          break;
        }
        case 'retroceder': {
          pasos++;
          const nx = x - DELTAS[dir].x;
          const ny = y - DELTAS[dir].y;
          if (!dentro(nx, ny)) { fin = true; error.tipo = 'fuera'; error.mensaje = 'Candela se salió del tablero.'; registrar('error', { tipo: 'fuera' }); return; }
          if (hayObstaculo(nx, ny)) { fin = true; error.tipo = 'obstaculo'; error.mensaje = 'Candela chocó con un obstáculo.'; registrar('error', { tipo: 'obstaculo' }); return; }
          x = nx; y = ny;
          visitadas.add(`${x},${y}`);
          posicionFinal = { x, y };
          registrar('retroceder');
          break;
        }
        case 'saltar': {
          pasos++;
          const nx = x + DELTAS[dir].x * 2;
          const ny = y + DELTAS[dir].y * 2;
          if (!dentro(nx, ny)) { fin = true; error.tipo = 'fuera'; error.mensaje = 'Candela saltó fuera del tablero.'; registrar('error', { tipo: 'fuera' }); return; }
          x = nx; y = ny;
          visitadas.add(`${x},${y}`);
          posicionFinal = { x, y };
          registrar('saltar');
          break;
        }
        case 'girar': {
          pasos++;
          const d = String(b.dir || 'derecha').toLowerCase();
          if (d === 'izquierda' || d === 'izq' || d === '-') dir = (dir + 3) % 4;
          else dir = (dir + 1) % 4;
          registrar('girar', { a: d });
          break;
        }
        case 'repetir': {
          const veces = Math.min(Math.max(Number(b.veces) || 0, 0), 50);
          for (let i = 0; i < veces; i++) {
            for (const sub of (b.bloques || [])) ejecutarBloque(sub, profundidad + 1);
            if (fin) return;
          }
          break;
        }
        case 'si': {
          const cumple = evaluarCondicion(b.condicion || 'obstaculo', !!b.negado, b.hacia || 'delante');
          if (cumple) for (const sub of (b.bloques || [])) ejecutarBloque(sub, profundidad + 1);
          else for (const sub of (b.bloques_no || [])) ejecutarBloque(sub, profundidad + 1);
          break;
        }
        case 'sonido': {
          registrar('sonido', { s: String(b.sonido || 'pop') });
          break;
        }
        default: break;
      }
    }

    const prog = normalizarPrograma(programa);
    for (const b of prog) { ejecutarBloque(b, 0); if (fin) break; }

    return {
      posicion_final: posicionFinal,
      direccion_final: ['derecha', 'abajo', 'izquierda', 'arriba'][dir],
      visitadas: [...visitadas],
      monedas_recogidas: monedasRecogidas,
      pasos,
      max_pasos: maxPasos,
      error: error.tipo ? error : null,
      finalizado: !error.tipo,
      trazado,
    };
  }

  function evaluarCode(escenario, inicio, objetivo, programa, resultado) {
    const objetivos = objetivo || {};
    const fallos = [];

    if (objetivos.posicion) {
      const pf = resultado.posicion_final;
      const ok = pf && pf.x === Number(objetivos.posicion.x) && pf.y === Number(objetivos.posicion.y);
      if (!ok) fallos.push(`La posición final (${pf?.x},${pf?.y}) no es la objetivo (${objetivos.posicion.x},${objetivos.posicion.y}).`);
    }

    if (objetivos.monedas) {
      const recogidas = resultado.monedas_recogidas?.length || 0;
      if (recogidas < Number(objetivos.monedas)) fallos.push(`Faltan monedas: ${recogidas}/${objetivos.monedas}.`);
    }

    if (objetivos.max_pasos) {
      if ((resultado.pasos || 0) > Number(objetivos.max_pasos)) fallos.push(`Demasiados pasos: ${resultado.pasos} (máx ${objetivos.max_pasos}).`);
    }

    if (objetivos.debe_usar && Array.isArray(objetivos.debe_usar)) {
      const usados = new Set();
      (function recorrer(prog) {
        (prog || []).forEach(b => { usados.add(b.op); if (b.bloques) recorrer(b.bloques); if (b.bloques_no) recorrer(b.bloques_no); });
      })(normalizarPrograma(programa));
      for (const op of objetivos.debe_usar) {
        if (!usados.has(op)) fallos.push(`Debes usar el bloque ${BLOQUES_CODE[op]?.nombre || op}.`);
      }
    }

    if (resultado.error) fallos.push(resultado.error.mensaje);

    const superado = fallos.length === 0;
    return { superado, fallos, aciertos: superado ? 1 : 0, errores: superado ? 0 : Math.max(1, fallos.length) };
  }

  function bloquesPermitidos(actividad, ejercicioIdx) {
    const contenido = (actividad && actividad.contenido) || {};
    const ejercicios = obtenerEjercicios(contenido);
    const ej = ejercicios[Number(ejercicioIdx) || 0] || {};
    const permitidos = ej.bloques_permitidos || contenido.bloques_permitidos;
    if (Array.isArray(permitidos) && permitidos.length) return permitidos;
    return Object.keys(BLOQUES_CODE);
  }

  /**
   * Normaliza el contenido a una lista de ejercicios.
   * Formato A: contenido.ejercicios = [ {titulo, explicacion, objetivo_texto,
   *   escenario, inicio, objetivo, bloques_permitidos?, max_bloques?, pistas} ]
   * Formato B (antiguo): escenario/inicio/objetivo directos → un solo ejercicio.
   */
  function obtenerEjercicios(contenido) {
    const c = contenido || {};
    if (Array.isArray(c.ejercicios) && c.ejercicios.length) {
      return c.ejercicios.map((ej, i) => ({
        titulo: ej.titulo || 'Ejercicio ' + (i + 1),
        explicacion: ej.explicacion || '',
        objetivo_texto: ej.objetivo_texto || 'Lleva a Candela hasta la estrella.',
        escenario: ej.escenario || c.escenario || { tipo: 'cuadricula', ancho: 6, alto: 6 },
        inicio: ej.inicio || c.inicio || { x: 0, y: 0, direccion: 'derecha' },
        objetivo: ej.objetivo || {},
        bloques_permitidos: ej.bloques_permitidos || c.bloques_permitidos || null,
        max_bloques: ej.max_bloques || c.max_bloques || null,
        pistas: ej.pistas || c.pistas || [],
      }));
    }
    return [{
      titulo: c.titulo || 'Ejercicio 1',
      explicacion: c.explicacion || '',
      objetivo_texto: c.objetivo_texto || 'Lleva a Candela hasta la estrella.',
      escenario: c.escenario || { tipo: 'cuadricula', ancho: 6, alto: 6 },
      inicio: c.inicio || { x: 0, y: 0, direccion: 'derecha' },
      objetivo: c.objetivo || {},
      bloques_permitidos: c.bloques_permitidos || null,
      max_bloques: c.max_bloques || null,
      pistas: c.pistas || [],
    }];
  }

  return { BLOQUES_CODE, ejecutarCode, evaluarCode, bloquesPermitidos, obtenerEjercicios };
})();
