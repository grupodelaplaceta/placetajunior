(() => {
  'use strict';

  // Studio · creación de actividades (versión rehecha).
  // Contratos que se mantienen: claves de sesión y borradores, formato de bloques
  // que lee el reproductor, y el cuerpo de envío a /api/creadores/actividades.
  const SESSION_KEY = 'pj27-sesion';
  const DRAFT_KEY = 'pj-studio-creadores-draft';
  const DRAFTS_KEY = 'pj-studio-creadores-drafts-v1';

const TYPES = [
    ['texto', 'Texto explicativo', '▤', 'Básicos'], ['test', 'Preguntas tipo test', '?', 'Básicos'],
    ['relacionar', 'Relacionar parejas', '↔', 'Básicos'], ['completar', 'Completar frases', '✎', 'Básicos'],
    ['ordenar', 'Ordenar pasos', '≡', 'Básicos'], ['sopa_letras', 'Sopa de letras', '▦', 'Básicos'],
    ['reloj', 'El reloj', 'schedule', 'Matemáticas'], ['recta_numerica', 'Recta numérica', 'straighten', 'Matemáticas'],
    ['grafico', 'Lee el gráfico', 'bar_chart', 'Matemáticas'], ['balanza', 'Balanza', 'balance', 'Matemáticas'],
    ['ahorcado', 'Adivina la palabra', 'text_fields', 'Lengua'], ['anagrama', 'Ordena las letras', 'shuffle', 'Lengua'],
    ['patrones', 'Continúa la serie', 'repeat', 'Lógica y atención'], ['simetria', 'Completa el reflejo', 'flip', 'Lógica y atención'],
    ['silabas', 'Separa en sílabas', 'content_cut', 'Lengua'], ['vf_rapido', 'Verdadero o falso', 'bolt', 'Lógica y atención'],
    ['ruleta_preguntas', 'Ruleta de preguntas', 'casino', 'Lógica y atención'],
    ['code_blocks', 'Placeta Junior Code', 'code', 'Pensamiento computacional'],
    ['geometria', 'Explora las formas', 'category', 'Matemáticas'], ['dinero', 'Monedas y cambio', 'euro', 'Matemáticas'],
    ['vertical', 'Suma y resta en vertical', 'calculate', 'Matemáticas'], ['abaco', 'Ábaco', 'tune', 'Matemáticas'],
    ['calculo_mental', 'Cálculo mental', 'psychology', 'Matemáticas'], ['horas', 'Lee y calcula horas', 'schedule', 'Matemáticas'],
    ['dados', 'Retos con dados', 'casino', 'Matemáticas'],
    ['tesoro', 'Búsqueda del tesoro', 'explore', 'Lógica y atención'], ['simetria_dibujo', 'Dibuja la simetría', 'flip', 'Lógica y atención'],
    ['patron_visual', 'Patrones visuales', 'pattern', 'Lógica y atención'], ['batalla', 'Batalla matemática', 'sailing', 'Matemáticas'],
    ['tangram', 'Tangram', 'extension', 'Matemáticas']
  ];
const CODE_DEFAULT_EXERCISES = [
    { identificador: 'PJC-001', etapa: 'Primaria', dificultad: 'Inicial', titulo: 'Primeros pasos', explicacion: 'Cada bloque AVANZAR mueve a Candela una casilla.', objetivo_texto: 'Programa los pasos para llegar a la estrella.', bloques_permitidos: ['avanzar'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 2, y: 0 }, max_pasos: 4 }, pistas: ['Cuenta las casillas que separan a Candela de la estrella.'] },
    { identificador: 'PJC-002', etapa: 'Primaria', dificultad: 'Inicial', titulo: 'Gira correctamente', explicacion: 'Un giro cambia hacia dónde mira Candela, pero no la mueve.', objetivo_texto: 'Llega a la estrella girando y avanzando.', bloques_permitidos: ['avanzar', 'girar'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 1, y: 1 }, max_pasos: 4 }, pistas: ['Avanza una casilla, gira a la derecha y vuelve a avanzar.'] },
    { identificador: 'PJC-003', etapa: 'Primaria', dificultad: 'Intermedia', titulo: 'El laberinto', explicacion: 'Planifica cómo rodear la roca sin chocar.', objetivo_texto: 'Llega a la estrella usando el camino libre.', bloques_permitidos: ['avanzar', 'girar'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [{ x: 1, y: 0 }], monedas: [] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 1, y: 1 }, max_pasos: 4 }, pistas: ['Gira a la derecha para pasar por debajo de la roca.'] },
    { identificador: 'PJC-004', etapa: 'Primaria', dificultad: 'Intermedia', titulo: 'Recoge la moneda', explicacion: 'Puedes agrupar pasos repetidos en un bucle.', objetivo_texto: 'Recoge la moneda y llega a la estrella usando REPETIR.', bloques_permitidos: ['avanzar', 'repetir'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [{ x: 1, y: 0 }] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 3, y: 0 }, monedas: 1, max_pasos: 4, debe_usar: ['repetir'] }, pistas: ['Repite AVANZAR tres veces. La moneda se recoge al pasar por ella.'] },
    { identificador: 'PJC-005', etapa: 'Primaria', dificultad: 'Avanzada', titulo: 'La puerta secreta', explicacion: 'Un condicional permite decidir según lo que haya delante.', objetivo_texto: 'Si hay un obstáculo delante, gira y avanza.', bloques_permitidos: ['avanzar', 'girar', 'si'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [{ x: 1, y: 0 }], monedas: [] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 0, y: 1 }, max_pasos: 3, debe_usar: ['si'] }, pistas: ['Dentro de SI coloca GIRAR a la derecha y AVANZAR.'] },
    { identificador: 'PJC-006', etapa: 'Secundaria', dificultad: 'Intermedia', titulo: 'El robot perdido', explicacion: 'Los sensores permiten reaccionar a objetos cercanos.', objetivo_texto: 'Usa SI para recoger la moneda que está delante.', bloques_permitidos: ['avanzar', 'si'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [{ x: 1, y: 0 }] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 1, y: 0 }, monedas: 1, max_pasos: 2, debe_usar: ['si'] }, pistas: ['Cambia la condición de SI a moneda e incluye AVANZAR dentro.'] },
    { identificador: 'PJC-007', etapa: 'Secundaria', dificultad: 'Intermedia', titulo: 'Rescate espacial', explicacion: 'GIRAR 180° invierte la dirección en un solo bloque.', objetivo_texto: 'Da media vuelta y vuelve una casilla.', bloques_permitidos: ['avanzar', 'girar_180'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] }, inicio: { x: 2, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 1, y: 0 }, max_pasos: 2, debe_usar: ['girar_180'] }, pistas: ['Primero gira 180 grados y después avanza.'] },
    { identificador: 'PJC-008', etapa: 'Secundaria', dificultad: 'Avanzada', titulo: 'El tesoro escondido', explicacion: 'Resuelve el reto con el menor número de instrucciones.', objetivo_texto: 'Llega a la estrella con un bucle REPETIR.', bloques_permitidos: ['avanzar', 'repetir'], escenario: { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] }, inicio: { x: 0, y: 0, direccion: 'derecha' }, objetivo: { posicion: { x: 5, y: 0 }, max_pasos: 5, debe_usar: ['repetir'] }, pistas: ['Un bucle con cinco AVANZAR dentro reduce bloques duplicados.'] }
  ];
const PRIMARY_DEFAULTS = {
    reloj: { modo: 'poner', ejercicios: [{ hora: '03:30' }, { hora: '09:00' }] },
    recta_numerica: { min: 0, max: 20, paso: 1, valores: [13, 4] },
    grafico: { titulo_grafico: 'Mascotas de la clase', unidad: 'niños', tipo_grafico: 'barras', datos: [{ etiqueta: 'Perro', valor: 8 }, { etiqueta: 'Gato', valor: 5 }, { etiqueta: 'Pez', valor: 3 }], preguntas: [{ pregunta: '¿Qué mascota es la más frecuente?', opciones: ['Perro', 'Gato', 'Pez'], correcta: 0 }] },
    balanza: { ejercicios: [{ izq: [5, 3], der: [2], pesas: [1, 2, 3, 5], ecuacion: '2 + ? = 8' }] },
    ahorcado: { intentos: 6, palabras: [{ palabra: 'MARIPOSA', pista: 'Insecto con alas de colores' }] },
    anagrama: { palabras: [{ palabra: 'ESCUELA', pista: 'Donde aprendes' }] },
    patrones: { secuencias: [{ serie: ['2', '4', '6', '?', '10'], opciones: ['7', '8', '9'], correcta: 1 }] },
    simetria: { ejercicios: [{ ancho: 3, alto: 4, celdas: [[0, 0], [1, 1], [2, 2], [2, 3]] }] },
    silabas: { palabras: [{ palabra: 'MARIPOSA', silabas: ['MA', 'RI', 'PO', 'SA'] }] },
    vf_rapido: { segundos: 12, afirmaciones: [{ texto: 'El Sol es una estrella.', verdadero: true, explicacion: 'Es la estrella más cercana a la Tierra.' }] },
    ruleta_preguntas: { preguntas: [{ categoria: 'Ciencias', pregunta: '¿Cuántos planetas tiene el sistema solar?', opciones: ['7', '8', '9'], correcta: 1 }, { categoria: 'Lengua', pregunta: '¿Cuál es un verbo?', opciones: ['correr', 'mesa', 'azul'], correcta: 0 }] },
    geometria: { modo: 'identificar', medida: 'mixto', cantidad: 5, nivel: 1 },
    dinero: { modo: 'contar', cantidad: 4, nivel: 1 },
    vertical: { operacion: '+', cantidad: 4, nivel: 1, ejercicios: [] },
    abaco: { modo: 'poner', cantidad: 4, columnas: 3 },
    calculo_mental: { cantidad: 5, nivel: 1, ejercicios: [] },
    horas: { modo: 'leer', reloj: 'analogico', cantidad: 4, nivel: 1, ejercicios: [] },
    dados: { operacion: 'suma', dados: 2, cantidad: 5, ejercicios: [] },
    tesoro: { modo: 'pista', cantidad: 3, nivel: 1 },
    simetria_dibujo: { eje: 'v', cantidad: 3, nivel: 1 },
    patron_visual: { modo: 'formas', cantidad: 4, nivel: 1 },
    batalla: { nivel: 1 },
    tangram: { modo: 'completar', estilo: 'clasico', cantidad: 4 }
  };
const PRIMARY_HELP = {
    reloj: 'Cambia la hora o el modo. Usa HH:MM en formato de 24 horas; 16:30 se representa como 4:30 en el reloj analógico.',
    recta_numerica: 'Ajusta los límites, el salto y los números que el alumnado colocará.',
    grafico: 'Añade los datos y las preguntas del gráfico con los controles de cada reto.',
    balanza: 'Ajusta los pesos de ambos platos y las pesas disponibles en cada reto.',
    ahorcado: 'Escribe las palabras y una pista para cada una. Ajusta el número de intentos.',
    anagrama: 'Añade palabras y pistas. El alumnado tendrá que ordenar sus letras.',
    patrones: 'Cada serie contiene los elementos en orden; usa ? en el lugar que se debe descubrir.',
    simetria: 'Cada ejercicio define la cuadrícula y las celdas que forman el dibujo.',
    silabas: 'Cada palabra contiene una lista de sílabas en el orden correcto.',
    vf_rapido: 'Escribe afirmaciones y marca en cada una si es verdadera; añade una explicación.',
    ruleta_preguntas: 'Añade categoría, pregunta, opciones y el índice de la respuesta correcta (empieza en 0).',
    geometria: 'Elige identificar, clasificar, contar lados o medir el área y el perímetro. También puedes definir las dimensiones.',
    dinero: 'Selecciona si practicar monedas, pagos o el cálculo del cambio, y ajusta la dificultad.',
    vertical: 'Elige la operación y la dificultad. En las opciones avanzadas puedes definir cada operación.',
    abaco: 'Elige si el alumnado representa o lee el número y cuántas columnas tendrá el ábaco.',
    calculo_mental: 'Ajusta el número de preguntas y el nivel. Puedes escribir ejercicios propios en las opciones avanzadas.',
    horas: 'Cada hora introducida genera un reto. Usa HH:MM de 00:00 a 23:59 y elige reloj analógico, digital o ambos.',
    dados: 'Elige suma, resta o multiplicación y el número de dados. Puedes definir las caras y la operación de cada reto.',
    tesoro: 'Elige si el alumnado sigue una pista, programa con flechas o dibuja el recorrido por casillas.',
    simetria_dibujo: 'Elige el eje de simetría y cuántos dibujos crear.',
    patron_visual: 'Elige practicar patrones con figuras o con números.',
    batalla: 'Ajusta la dificultad de las operaciones y del tablero.',
    tangram: 'Elige el reto y la paleta de color de las piezas.'
  };
const TEMPLATES = [
    { id: 'quiz', title: 'Quiz rápido', description: 'Una explicación breve y preguntas para comprobar lo aprendido.', blocks: [
      { tipo: 'texto', titulo: 'Aprende', contenido: 'Escribe aquí la explicación del tema.' },
      { tipo: 'test', titulo: 'Comprueba lo aprendido', preguntas: [{ pregunta: '¿Qué idea es la más importante?', opciones: ['Respuesta correcta', 'Otra opción', 'Una tercera opción'], correcta: 0 }] }
    ] },
    { id: 'parejas', title: 'Une conceptos', description: 'Presenta vocabulario y pide conectar cada concepto.', blocks: [
      { tipo: 'texto', titulo: 'Antes de empezar', contenido: 'Lee cada concepto con atención.' },
      { tipo: 'relacionar', titulo: 'Relaciona', modo: 'emparejar', pares: [{ izq: 'Concepto A', der: 'Definición A' }, { izq: 'Concepto B', der: 'Definición B' }] }
    ] },
    { id: 'lectura', title: 'Lectura comprensiva', description: 'Un texto inicial seguido de preguntas de comprensión.', blocks: [
      { tipo: 'texto', titulo: 'La historia', contenido: 'Escribe una lectura breve y adecuada a la edad del grupo.' },
      { tipo: 'test', titulo: 'Comprensión lectora', preguntas: [{ pregunta: '¿Quién aparece en la historia?', opciones: ['Personaje principal', 'Otro personaje', 'Un lugar'], correcta: 0 }] }
    ] },
    { id: 'vocabulario', title: 'Vocabulario', description: 'Practica palabras nuevas con pistas y una sopa de letras.', blocks: [
      { tipo: 'texto', titulo: 'Palabras clave', contenido: 'Añade aquí una explicación sencilla del vocabulario.' },
      { tipo: 'sopa_letras', titulo: 'Encuentra las palabras', palabras: ['PLANETA', 'ESTRELLA'], pistas: ['Cuerpo que gira alrededor de una estrella', 'Astro con luz propia'] }
    ] }
  ];

  // ── Estado ────────────────────────────────────────────────────────
  const CATEGORIAS = ['General', 'Matemáticas', 'Lengua', 'Ciencias', 'Geografía', 'Tecnología', 'Lógica', 'Pensamiento computacional', 'Cultura'];
  const COLOR_CATEGORIA = {
    'Básicos': '#5b14c8',
    'Matemáticas': '#1d6fe0',
    'Lengua': '#c2410c',
    'Lógica y atención': '#be185d',
    'Pensamiento computacional': '#15803d'
  };
  const ETIQUETAS = {
    pregunta: 'Pregunta', opciones: 'Opciones', correcta: 'Respuesta correcta', explicacion: 'Explicación',
    contenido: 'Texto', enunciado: 'Enunciado', texto: 'Frase', izq: 'Lado izquierdo', der: 'Lado derecho',
    concepto: 'Concepto', definicion: 'Definición', respuesta: 'Respuesta', pista: 'Pista', palabra: 'Palabra',
    palabras: 'Palabras', silabas: 'Sílabas', items: 'Pasos (en orden)', frases: 'Frases', pares: 'Parejas',
    preguntas: 'Preguntas', afirmaciones: 'Afirmaciones', verdadero: 'Es verdadera', categoria: 'Categoría',
    etiqueta: 'Etiqueta', valor: 'Valor', datos: 'Datos', titulo_grafico: 'Título del gráfico', unidad: 'Unidad',
    tipo_grafico: 'Tipo de gráfico', hora: 'Hora', ejercicios: 'Ejercicios', valores: 'Valores', min: 'Mínimo',
    max: 'Máximo', paso: 'Paso', pesas: 'Pesas disponibles', ecuacion: 'Ecuación', serie: 'Serie', ancho: 'Ancho',
    alto: 'Alto', celdas: 'Casillas del dibujo', intentos: 'Intentos', segundos: 'Segundos', descripcion: 'Descripción',
    recompensa: 'Recompensa (Pz)', cantidad: 'Cantidad', nivel: 'Nivel', operacion: 'Operación', dados: 'Dados',
    columnas: 'Columnas', eje: 'Eje', estilo: 'Estilo', reloj: 'Tipo de reloj', objetivo_texto: 'Misión'
  };
  // Claves que se guardan tal cual pero no se editan a mano
  const OCULTAS = new Set(['tipo', 'id', 'modo', 'lenguaje', 'version']);
  // Campos de texto largo (textarea)
  const LARGO = new Set(['contenido', 'explicacion', 'descripcion', 'objetivo_texto', 'enunciado', 'pregunta']);
  // Plantilla de un elemento nuevo para listas concretas cuando no hay ejemplo
  const ELEMENTO = {
    preguntas: () => ({ pregunta: '', opciones: ['', '', ''], correcta: 0 }),
    pares: () => ({ izq: '', der: '' }),
    frases: () => ({ texto: '', respuesta: '' }),
    afirmaciones: () => ({ texto: '', verdadero: true, explicacion: '' }),
    palabras: () => ({ palabra: '', pista: '' })
  };

  const DEFAULTS = {
    texto: () => ({ tipo: 'texto', titulo: 'Nuevo texto', contenido: '' }),
    test: () => ({ tipo: 'test', titulo: 'Nuevas preguntas', preguntas: [{ pregunta: '', opciones: ['', '', ''], correcta: 0 }] }),
    relacionar: () => ({ tipo: 'relacionar', titulo: 'Relaciona', modo: 'emparejar', pares: [{ izq: '', der: '' }] }),
    completar: () => ({ tipo: 'completar', titulo: 'Completa', modo: 'escribir', frases: [{ texto: 'Escribe una frase con ___', respuesta: '' }] }),
    ordenar: () => ({ tipo: 'ordenar', titulo: 'Ordena los pasos', items: ['Primer paso', 'Segundo paso', 'Tercer paso'] }),
    sopa_letras: () => ({ tipo: 'sopa_letras', titulo: 'Sopa de letras', palabras: ['SOL', 'LUNA'], pistas: [] }),
    ...Object.fromEntries(Object.entries(PRIMARY_DEFAULTS).map(([type, data]) => [type, () => ({ tipo: type, titulo: TYPES.find(([id]) => id === type)?.[1] || type, datos: structuredClone(data) })])),
    salto_unidad: () => ({ tipo: 'salto_unidad', titulo: 'Unidad nueva', descripcion: '', recompensa: 0 }),
    code_blocks: () => ({ tipo: 'code_blocks', titulo: 'Placeta Junior Code', lenguaje: 'placeta_blocks', objetivo_texto: 'Programa a Candela para completar la misión.', ejercicios: structuredClone(CODE_DEFAULT_EXERCISES) })
  };

  const state = {
    title: '', description: '', category: 'General', age: '6-12', difficulty: 'media', reward: 0,
    blocks: [], selected: -1, pane: 'canvas', view: 'activities',
    identity: null, identityKind: 'docente', authorName: '', center: null, centers: [], docenteAprobado: false,
    drafts: [], currentDraftId: null, history: [], historyIndex: -1, previewDevice: 'movil'
  };

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const etiqueta = (clave) => ETIQUETAS[clave] || clave.replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
  const nombreTipo = (tipo) => (TYPES.find(([id]) => id === tipo) || [, tipo])[1];
  const iconoTipo = (tipo) => {
    const t = TYPES.find(([id]) => id === tipo);
    return t && t[2].length === 1 ? t[2] : (nombreTipo(tipo) || '?').charAt(0).toUpperCase();
  };
  const colorTipo = (tipo) => COLOR_CATEGORIA[(TYPES.find(([id]) => id === tipo) || [, , , 'Básicos'])[3]] || '#5b14c8';
  const clonar = (valor) => JSON.parse(JSON.stringify(valor));

  function notice(texto, tipo) {
    const el = $('studio-notice');
    el.textContent = texto;
    el.className = 'st-aviso' + (tipo ? ' ' + tipo : '');
  }

  /* ── Identidad y permisos ──────────────────────────────────────── */

  function showGate(titulo, texto) {
    $('access-gate').hidden = false;
    $('studio-menu').hidden = true;
    $('access-gate').innerHTML = `<div class="st-gate-card"><h2>${esc(titulo)}</h2><p>${esc(texto)}</p>
      <div class="st-gate-acciones"><a class="st-btn st-btn-primario" href="/edu/alta">Acceso docente</a><a class="st-btn" href="/edu/centros">Acceso de centro</a></div></div>`;
    $('creator-tools').hidden = true;
  }

  async function loadIdentity() {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) {
      $('identity-status').textContent = 'Acceso reservado a cuentas registradas y aprobadas';
      $('identity').classList.add('needs-login');
      showGate('Inicia sesión para acceder al Studio', 'Solo pueden crear actividades los docentes con alta aprobada y las personas autorizadas de centros activos.');
      return false;
    }
    try {
      const response = await fetch('/api/centros/mi', { headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }, cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'sesion_no_valida');
      state.identity = data;
      state.authorName = data.nombre || '';
      const centers = (data.organizaciones || []).filter((org) => org.estado === 'activo' && String(org.rol).toLowerCase() === 'administrador');
      state.centers = centers;
      state.docenteAprobado = data.docenteAprobado === true;
      if (!centers.length && !state.docenteAprobado) {
        const pendiente = (data.solicitudes || []).some((solicitud) => solicitud.estado === 'pendiente');
        $('identity-status').textContent = 'Cuenta verificada; falta autorización';
        $('identity').classList.add('needs-login');
        showGate(pendiente ? 'Tu solicitud está pendiente de revisión' : 'Tu cuenta aún no tiene permisos de creación',
          'El Studio se habilitará cuando Placeta Junior apruebe tu alta docente o active el centro y confirme tus permisos.');
        return false;
      }
      if (centers.length) { state.identityKind = 'centro'; state.center = centers[0]; }
      else { state.identityKind = 'docente'; state.center = null; }
      $('access-gate').hidden = true;
      $('studio-menu').hidden = false;
      $('creator-tools').hidden = false;
      paintIdentity(data.email);
      $('identity').classList.add('verified');
      return true;
    } catch (error) {
      if (error.message === 'sesion_no_valida' || error.message === 'no_autenticado') sessionStorage.removeItem(SESSION_KEY);
      $('identity-status').textContent = 'No se pudo verificar la sesión';
      $('identity').classList.add('needs-login');
      showGate('No se pudieron comprobar tus permisos', 'Comprueba tu conexión e inténtalo de nuevo. Si la sesión ha caducado, vuelve a iniciar sesión.');
      return false;
    }
  }

  function paintIdentity(email = '') {
    const nombre = state.identityKind === 'centro' ? state.center?.nombre : (state.authorName || email || 'Docente');
    $('identity-status').textContent = `Autoría: ${nombre}`;
    const opciones = [
      ...(state.docenteAprobado ? [`<option value="docente" ${state.identityKind === 'docente' ? 'selected' : ''}>Docente · ${esc(state.authorName || email || 'mi cuenta')}</option>`] : []),
      ...state.centers.map((centro) => `<option value="centro:${esc(centro.id)}" ${state.identityKind === 'centro' && state.center?.id === centro.id ? 'selected' : ''}>Centro · ${esc(centro.nombre)}</option>`)
    ].join('');
    $('author-scope').innerHTML = opciones;
    $('author-scope').disabled = !opciones;
    $('author-field').hidden = !opciones || (!state.centers.length && state.docenteAprobado);
  }

  // Cambia quién firma la actividad (docente o un centro del que es administrador)
  function setAuthorScope(value) {
    if (value === 'docente') { state.identityKind = 'docente'; state.center = null; }
    else if (value && value.startsWith('centro:')) {
      const id = value.slice(7);
      const centro = state.centers.find((c) => String(c.id) === id);
      if (centro) { state.identityKind = 'centro'; state.center = centro; }
    }
    paintIdentity(state.identity?.email || '');
    touch();
  }

  function draftScope() {
    return state.identityKind === 'centro' && state.center
      ? `centro:${state.center.id}`
      : `docente:${String(state.identity?.email || '').trim().toLowerCase()}`;
  }

  /* ── Borradores (mismo formato que la versión anterior) ────────── */

  function createDraftId() {
    return globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadDrafts() {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
      state.drafts = Array.isArray(saved) ? saved : [];
    } catch (error) { state.drafts = []; }
    // Migra un borrador suelto de la versión antigua, si existe
    try {
      const legacy = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (legacy && Array.isArray(legacy.blocks) && !state.drafts.some((d) => d.id === legacy.id)) {
        state.drafts.unshift({ ...legacy, id: legacy.id || createDraftId(), scope: legacy.scope || draftScope(), updatedAt: legacy.updatedAt || new Date().toISOString() });
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (error) { /* sin borrador antiguo */ }
  }

  function hasContent() {
    return Boolean(state.title.trim() || state.description.trim() || state.blocks.length);
  }

  function snapshot() {
    return {
      id: state.currentDraftId,
      scope: draftScope(),
      title: state.title,
      description: state.description,
      category: state.category,
      age: state.age,
      difficulty: state.difficulty,
      reward: state.reward,
      blocks: state.blocks,
      updatedAt: new Date().toISOString()
    };
  }

  function saveDraft() {
    if (!state.currentDraftId && !hasContent()) return;
    if (!state.currentDraftId) state.currentDraftId = createDraftId();
    const actual = snapshot();
    state.drafts = [actual, ...state.drafts.filter((d) => d.id !== actual.id)];
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
      $('save-state').textContent = `Guardado en este dispositivo · ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`;
    } catch (error) {
      $('save-state').textContent = 'No se pudo guardar el borrador en este navegador';
    }
  }

  function restoreDraft(draft) {
    if (!draft) {
      state.currentDraftId = null;
      Object.assign(state, { title: '', description: '', category: 'General', age: '6-12', difficulty: 'media', reward: 0, blocks: [], selected: -1 });
    } else {
      state.currentDraftId = draft.id;
      Object.assign(state, {
        title: draft.title || '', description: draft.description || '', category: draft.category || 'General',
        age: draft.age || '6-12', difficulty: draft.difficulty || 'media', reward: Number(draft.reward) || 0,
        blocks: clonar(draft.blocks || []), selected: draft.blocks?.length ? 0 : -1
      });
    }
    resetHistory();
    paintAll();
  }

  function renderSavedActivities() {
    const lista = $('saved-list');
    const ambito = draftScope();
    const borradores = state.drafts.filter((d) => d.scope === ambito)
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    $('saved-count').textContent = borradores.length ? `${borradores.length} ${borradores.length === 1 ? 'actividad guardada' : 'actividades guardadas'} en este dispositivo` : '';
    if (!borradores.length) {
      lista.innerHTML = `<li class="st-vacio"><p>Todavía no tienes actividades guardadas.</p><button type="button" class="st-btn st-btn-primario" data-view-go="create">Crear mi primera actividad</button></li>`;
      return;
    }
    lista.innerHTML = borradores.map((d) => `<li class="st-borrador">
        <div class="st-borrador-texto">
          <strong>${esc(d.title?.trim() || 'Actividad sin título')}</strong>
          <small>${(d.blocks || []).length} bloque(s) · ${esc(d.category || 'General')} · actualizada ${esc(new Date(d.updatedAt || Date.now()).toLocaleDateString('es-ES'))}</small>
        </div>
        <div class="st-borrador-acciones">
          <button type="button" class="st-btn st-btn-primario" data-open-draft="${esc(d.id)}">Seguir</button>
          <button type="button" class="st-btn st-btn-peligro" data-delete-draft="${esc(d.id)}">Eliminar</button>
        </div>
      </li>`).join('');
  }

  function openSavedDraft(id) {
    const draft = state.drafts.find((d) => d.id === id && d.scope === draftScope());
    if (!draft) return;
    restoreDraft(draft);
    showStudioView('edit');
  }

  function deleteSavedDraft(id) {
    const draft = state.drafts.find((d) => d.id === id && d.scope === draftScope());
    if (!draft || !window.confirm(`¿Eliminar «${draft.title?.trim() || 'Actividad sin título'}» de este dispositivo?`)) return;
    state.drafts = state.drafts.filter((d) => d.id !== id);
    try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts)); } catch (error) { /* ignorar */ }
    if (state.currentDraftId === id) restoreDraft(null);
    renderSavedActivities();
    notice('Actividad eliminada de este dispositivo.', 'ok');
  }

  function newActivity(templateId) {
    const plantilla = templateId ? TEMPLATES.find((t) => t.id === templateId) : null;
    restoreDraft(null);
    if (plantilla) {
      state.title = plantilla.title;
      state.description = plantilla.description;
      state.blocks = clonar(plantilla.blocks);
      state.selected = 0;
      resetHistory();
    }
    saveDraft();
    paintAll();
    showStudioView('edit');
    showEditorPane('canvas');
  }

  /* ── Vistas ────────────────────────────────────────────────────── */

  function showStudioView(name) {
    state.view = name;
    document.querySelectorAll('[data-studio-panel]').forEach((panel) => { panel.hidden = panel.dataset.studioPanel !== name; });
    document.querySelectorAll('[data-studio-view]').forEach((tab) => {
      const on = tab.dataset.studioView === name;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
    });
    if (name === 'create') paintTemplates();
    if (name === 'activities') renderSavedActivities();
  }

  function showEditorPane(name) {
    state.pane = name;
    document.querySelectorAll('[data-editor-view]').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.editorView === name)));
    document.querySelectorAll('[data-editor-pane]').forEach((pane) => pane.classList.toggle('active', pane.dataset.editorPane === name));
  }

  /* ── Plantillas ────────────────────────────────────────────────── */

  function paintTemplates() {
    $('templates').innerHTML = TEMPLATES.map((t) => `<button type="button" class="template-art st-plantilla" data-template="${esc(t.id)}">
        <span class="st-plantilla-num">${esc(t.title.split(' ')[0])}</span>
        <strong>${esc(t.title)}</strong>
        <small>${esc(t.description)}</small>
        <span class="st-plantilla-bloques">${t.blocks.map((b) => `<span style="--c:${colorTipo(b.tipo)}">${esc(nombreTipo(b.tipo))}</span>`).join('')}</span>
      </button>`).join('');
  }

  /* ── Paleta de tipos ───────────────────────────────────────────── */

  function paintPalette() {
    const categorias = [...new Set(TYPES.map((t) => t[3]))];
    $('palette').innerHTML = `<div class="st-pal-tools">
        <label class="st-pal-buscar"><span class="visually-hidden">Buscar tipo</span><input id="palette-search" type="search" placeholder="Busca un tipo…" autocomplete="off" /></label>
        <select id="palette-category" aria-label="Filtrar por categoría"><option value="all">Todas las categorías</option>${categorias.map((c) => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}</select>
      </div>
      <p class="st-pal-cuenta" id="palette-count" aria-live="polite"></p>
      <div class="st-pal-lista" id="palette-items"></div>`;
    filterPalette();
  }

  function filterPalette() {
    const texto = ($('palette-search')?.value || '').trim().toLowerCase();
    const cat = $('palette-category')?.value || 'all';
    const visibles = TYPES.filter(([id, nombre, , category]) => (cat === 'all' || category === cat) && (!texto || nombre.toLowerCase().includes(texto) || id.includes(texto)));
    $('palette-items').innerHTML = visibles.map(([id, nombre, , category]) => `<button type="button" class="st-pal-item" draggable="true" data-type="${esc(id)}" data-category="${esc(category)}">
        <span class="st-pal-icono" style="background:${colorTipo(id)}">${esc(iconoTipo(id))}</span>
        <span class="st-pal-texto"><strong>${esc(nombre)}</strong><small>${esc(category)}</small></span>
        <span class="st-pal-mas" aria-hidden="true">+</span>
      </button>`).join('');
    $('palette-count').textContent = `${visibles.length} tipo(s)`;
  }

  /* ── Lienzo: bloques de la actividad ───────────────────────────── */

  function resumenBloque(block) {
    if (block.tipo === 'code_blocks') return `${(block.ejercicios || []).length} reto(s) de programación`;
    if (block.tipo === 'texto') return block.contenido ? 'Texto escrito' : 'Texto vacío';
    if (block.tipo === 'salto_unidad') return `Recompensa: ${Number(block.recompensa) || 0} Pz`;
    const n = contarItems(block);
    return n ? `${n} ${n === 1 ? 'elemento' : 'elementos'}` : 'Sin contenido todavía';
  }

  function contarItems(block) {
    switch (block.tipo) {
      case 'test': return (block.preguntas || []).length;
      case 'relacionar': return (block.pares || []).filter((p) => p.izq && p.der).length;
      case 'completar': return (block.frases || []).filter((f) => f.texto && f.respuesta).length;
      case 'ordenar': return (block.items || []).filter(Boolean).length;
      case 'sopa_letras': return (block.palabras || []).filter(Boolean).length;
      case 'code_blocks': return (block.ejercicios || []).length;
      case 'texto': case 'salto_unidad': return 0;
      default: {
        const datos = block.datos || {};
        const primera = Object.values(datos).find(Array.isArray);
        return primera ? primera.length : 0;
      }
    }
  }

  function tarjetaBloque(block, index) {
    const seleccionado = index === state.selected;
    return `<article class="st-card${seleccionado ? ' selected' : ''}${block.tipo === 'salto_unidad' ? ' unit-break' : ''}" data-index="${index}" draggable="true" style="--c:${colorTipo(block.tipo)}">
      <button type="button" class="st-card-main" data-select="${index}" aria-pressed="${seleccionado}">
        <span class="st-card-num">${index + 1}</span>
        <span class="st-card-icono">${esc(iconoTipo(block.tipo))}</span>
        <span class="st-card-texto"><strong>${esc(block.titulo || nombreTipo(block.tipo))}</strong><small>${esc(nombreTipo(block.tipo))} · ${esc(resumenBloque(block))}</small></span>
      </button>
      <div class="st-card-acciones">
        <button type="button" class="st-mini" data-move="${index}" data-offset="-1" aria-label="Subir bloque" ${index === 0 ? 'disabled' : ''}>↑</button>
        <button type="button" class="st-mini" data-move="${index}" data-offset="1" aria-label="Bajar bloque" ${index === state.blocks.length - 1 ? 'disabled' : ''}>↓</button>
        <button type="button" class="st-mini" data-duplicate="${index}" aria-label="Duplicar bloque">⧉</button>
        <button type="button" class="st-mini peligro" data-remove="${index}" aria-label="Quitar bloque">×</button>
      </div>
    </article>`;
  }

  function paintCanvas() {
    const lienzo = $('canvas');
    lienzo.innerHTML = state.blocks.map(tarjetaBloque).join('');
    $('canvas-empty').hidden = state.blocks.length > 0;
    const total = state.blocks.reduce((sum, b) => sum + contarItems(b), 0);
    $('canvas-summary').textContent = state.blocks.length
      ? `${state.blocks.length} bloque(s) · ${total} elemento(s) · recompensa ${state.reward} Pz`
      : 'Aún no hay bloques';
    $('undo-action').disabled = state.historyIndex <= 0;
    $('redo-action').disabled = state.historyIndex >= state.history.length - 1;
  }

  /* ── Operaciones sobre bloques ─────────────────────────────────── */

  function resetHistory() {
    state.history = [];
    state.historyIndex = -1;
    recordHistory();
  }

  function recordHistory() {
    const foto = clonar({ blocks: state.blocks, selected: state.selected, title: state.title, description: state.description, reward: state.reward });
    state.history = state.history.slice(0, state.historyIndex + 1);
    state.history.push(foto);
    if (state.history.length > 50) state.history.shift();
    state.historyIndex = state.history.length - 1;
  }

  function restoreHistory(index) {
    if (index < 0 || index >= state.history.length) return;
    state.historyIndex = index;
    const foto = clonar(state.history[index]);
    Object.assign(state, { blocks: foto.blocks, selected: foto.selected, title: foto.title, description: foto.description, reward: foto.reward });
    paintAll();
    saveDraft();
  }

  // Cambio estructural: guarda en el historial, borrador y repinta
  function touch() {
    recordHistory();
    saveDraft();
    paintAll();
  }

  function addBlock(tipo, indice = state.blocks.length) {
    if (!DEFAULTS[tipo]) return;
    state.blocks.splice(indice, 0, DEFAULTS[tipo]());
    state.selected = indice;
    showEditorPane('inspector');
    touch();
    notice(`Añadido: ${nombreTipo(tipo)}.`, 'ok');
  }

  function duplicateBlock(index) {
    if (!state.blocks[index]) return;
    state.blocks.splice(index + 1, 0, clonar(state.blocks[index]));
    state.selected = index + 1;
    touch();
  }

  function moveBlock(index, offset) {
    const destino = index + offset;
    if (destino < 0 || destino >= state.blocks.length) return;
    [state.blocks[index], state.blocks[destino]] = [state.blocks[destino], state.blocks[index]];
    state.selected = destino;
    touch();
  }

  function removeBlock(index) {
    state.blocks.splice(index, 1);
    state.selected = state.blocks.length ? Math.min(index, state.blocks.length - 1) : -1;
    touch();
  }

  function addUnitBreak() {
    const numero = state.blocks.filter((b) => b.tipo === 'salto_unidad').length + 2;
    const indice = state.selected >= 0 ? state.selected + 1 : state.blocks.length;
    state.blocks.splice(indice, 0, { tipo: 'salto_unidad', titulo: `Unidad ${numero}`, descripcion: '', recompensa: 0 });
    state.selected = indice;
    touch();
  }

  /* ── Editor por esquema: campos a partir de la forma de los datos ─ */

  function camino(raiz, ruta) {
    return ruta.split('.').reduce((obj, parte) => (obj == null ? undefined : obj[parte]), raiz);
  }

  function escribirCamino(raiz, ruta, valor) {
    const partes = ruta.split('.');
    let obj = raiz;
    partes.slice(0, -1).forEach((parte, i) => {
      if (obj[parte] == null) obj[parte] = /^\d+$/.test(partes[i + 1]) ? [] : {};
      obj = obj[parte];
    });
    obj[partes[partes.length - 1]] = valor;
  }

  function vacioComo(valor) {
    if (typeof valor === 'string') return '';
    if (typeof valor === 'number') return 0;
    if (typeof valor === 'boolean') return false;
    if (Array.isArray(valor)) return [];
    if (valor && typeof valor === 'object') return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, vacioComo(v)]));
    return '';
  }

  // Elemento nuevo para una lista: ejemplo del mismo tipo de bloque, o una plantilla conocida
  function elementoNuevo(bloque, ruta) {
    const clave = ruta.split('.').pop();
    if (ELEMENTO[clave]) return ELEMENTO[clave]();
    const ejemplo = DEFAULTS[bloque.tipo] ? camino(DEFAULTS[bloque.tipo](), ruta.replace(/\.\d+/g, '.0')) : undefined;
    if (Array.isArray(ejemplo) && ejemplo.length) return vacioComo(ejemplo[0]);
    if (ejemplo && typeof ejemplo === 'object') return vacioComo(ejemplo);
    return '';
  }

  function campoEscalar(valor, ruta, clave) {
    const etq = etiqueta(clave);
    if (typeof valor === 'boolean') {
      return `<label class="st-check"><input type="checkbox" data-path="${esc(ruta)}" data-kind="bool" ${valor ? 'checked' : ''} /><span>${esc(etq)}</span></label>`;
    }
    if (typeof valor === 'number') {
      return `<label class="st-campo"><span>${esc(etq)}</span><input type="number" step="any" data-path="${esc(ruta)}" data-kind="number" value="${esc(valor)}" /></label>`;
    }
    const texto = String(valor ?? '');
    if (LARGO.has(clave) || texto.length > 70) {
      return `<label class="st-campo"><span>${esc(etq)}</span><textarea rows="3" data-path="${esc(ruta)}" data-kind="text">${esc(texto)}</textarea></label>`;
    }
    return `<label class="st-campo"><span>${esc(etq)}</span><input type="text" data-path="${esc(ruta)}" data-kind="text" value="${esc(texto)}" /></label>`;
  }

  function listaEscalar(lista, ruta, clave) {
    const numeros = lista.every((v) => typeof v === 'number');
    const filas = lista.map((v, i) => `<div class="st-fila">
        <input type="${numeros ? 'number' : 'text'}" data-path="${esc(ruta)}.${i}" data-kind="${numeros ? 'number' : 'text'}" value="${esc(v)}" aria-label="${esc(etiqueta(clave))} ${i + 1}" />
        <button type="button" class="st-mini peligro" data-remove-row="${esc(ruta)}" data-index="${i}" aria-label="Quitar">×</button>
      </div>`).join('');
    return `<fieldset class="st-grupo"><legend>${esc(etiqueta(clave))}</legend>${filas || '<p class="st-ayuda">Sin elementos todavía.</p>'}
      <button type="button" class="st-btn st-btn-suave" data-add-row="${esc(ruta)}" data-kind="${numeros ? 'number' : 'text'}">+ Añadir</button></fieldset>`;
  }

  function listaCoordenadas(lista, ruta, clave) {
    const filas = lista.map((p, i) => `<div class="st-fila st-fila-par">
        <label><span>x</span><input type="number" data-path="${esc(ruta)}.${i}.0" data-kind="number" value="${esc(p[0])}" /></label>
        <label><span>y</span><input type="number" data-path="${esc(ruta)}.${i}.1" data-kind="number" value="${esc(p[1])}" /></label>
        <button type="button" class="st-mini peligro" data-remove-row="${esc(ruta)}" data-index="${i}" aria-label="Quitar casilla">×</button>
      </div>`).join('');
    return `<fieldset class="st-grupo"><legend>${esc(etiqueta(clave))}</legend>${filas}
      <button type="button" class="st-btn st-btn-suave" data-add-row="${esc(ruta)}" data-kind="pair">+ Añadir casilla</button></fieldset>`;
  }

  function listaObjetos(lista, ruta, clave) {
    const singular = etiqueta(clave).replace(/s$/, '');
    const tarjetas = lista.map((item, i) => `<fieldset class="st-item">
        <legend>${esc(singular)} ${i + 1}</legend>
        ${camposDe(item, `${ruta}.${i}`)}
        <button type="button" class="st-btn st-btn-peligro st-btn-pequeno" data-remove-row="${esc(ruta)}" data-index="${i}">Quitar</button>
      </fieldset>`).join('');
    return `<div class="st-repetir">${tarjetas}
      <button type="button" class="st-btn st-btn-suave" data-add-row="${esc(ruta)}" data-kind="object">+ Añadir ${esc(singular.toLowerCase())}</button></div>`;
  }

  function listaOpciones(item, ruta) {
    // Pregunta de test: opciones con la correcta marcada por radio
    const filas = item.opciones.map((texto, i) => `<div class="st-fila">
        <label class="st-correcta"><input type="radio" name="correcta-${esc(ruta)}" data-option-correct="${i}" data-path="${esc(ruta)}.correcta" data-kind="radio" value="${i}" ${Number(item.correcta) === i ? 'checked' : ''} aria-label="Marcar como correcta la opción ${i + 1}" /><span class="st-correcta-marca" aria-hidden="true"></span></label>
        <input type="text" data-path="${esc(ruta)}.opciones.${i}" data-kind="text" value="${esc(texto)}" aria-label="Opción ${i + 1}" />
        <button type="button" class="st-mini peligro" data-option-delete="${esc(ruta)}" data-index="${i}" aria-label="Quitar opción">×</button>
      </div>`).join('');
    return `<fieldset class="st-grupo st-opciones"><legend>Opciones · marca la correcta</legend>${filas}
      <button type="button" class="st-btn st-btn-suave" data-option-add="${esc(ruta)}">+ Añadir opción</button></fieldset>`;
  }

  // Campos de un objeto (sin claves ocultas), según su forma
  function camposDe(obj, ruta) {
    const salida = [];
    const tieneOpciones = Array.isArray(obj.opciones) && typeof obj.correcta === 'number';
    Object.keys(obj).forEach((clave) => {
      if (OCULTAS.has(clave)) return;
      if (!ruta && clave === 'titulo') return;
      if (tieneOpciones && (clave === 'opciones' || clave === 'correcta')) return;
      const valor = obj[clave];
      const rutaClave = ruta ? `${ruta}.${clave}` : clave;
      if (Array.isArray(valor)) {
        if (valor.every((v) => typeof v === 'string' || typeof v === 'number')) salida.push(listaEscalar(valor, rutaClave, clave));
        else if (valor.every((v) => Array.isArray(v) && v.length === 2 && v.every((n) => typeof n === 'number'))) salida.push(listaCoordenadas(valor, rutaClave, clave));
        else if (valor.every((v) => v && typeof v === 'object' && !Array.isArray(v))) salida.push(listaObjetos(valor, rutaClave, clave));
        else salida.push(campoEscalar(JSON.stringify(valor), rutaClave, clave));
      } else if (valor && typeof valor === 'object') {
        salida.push(`<fieldset class="st-grupo"><legend>${esc(etiqueta(clave))}</legend>${camposDe(valor, rutaClave)}</fieldset>`);
      } else {
        salida.push(campoEscalar(valor, rutaClave, clave));
      }
    });
    if (tieneOpciones) salida.unshift(listaOpciones(obj, ruta));
    return salida.join('');
  }

  function codigoPanel(block, index) {
    const ejercicios = block.ejercicios || [];
    const lib = window.PJRetos ? window.PJRetos.lista() : [];
    const miniaturas = ejercicios.map((ex, i) => `<li class="st-mini-reto">
        <span class="st-mini-svg">${window.PJRetos ? window.PJRetos.miniTablero(ex, { alt: `Tablero del reto ${i + 1}` }) : ''}</span>
        <span><strong>${i + 1}. ${esc(ex.titulo || 'Reto sin título')}</strong><small>${esc(window.PJRetos ? window.PJRetos.resumen(ex) : '')}</small></span>
      </li>`).join('');
    const opciones = lib.length
      ? lib.map((set) => `<option value="${esc(set.id)}">${esc(set.titulo || 'Sin título')} · ${set.ejercicios.length} reto(s)</option>`).join('')
      : '<option value="">Aún no tienes conjuntos guardados</option>';
    return `<section class="st-codigo">
      <p class="st-ayuda">Cada reto es un tablero con bloques. Los alumnos los juegan en orden.</p>
      <ol class="st-mini-lista">${miniaturas}</ol>
      <a class="st-btn st-btn-primario" href="/edu/code" target="_blank" rel="noopener">Abrir editor visual de retos</a>
      <div class="st-importar">
        <label class="st-campo"><span>Traer un conjunto de Retos Code</span>
          <select id="code-import-select"${lib.length ? '' : ' disabled'}>${opciones}</select></label>
        <div class="st-acciones-fila">
          <button type="button" class="st-btn" data-code-import="replace"${lib.length ? '' : ' disabled'}>Reemplazar retos</button>
          <button type="button" class="st-btn" data-code-import="append"${lib.length ? '' : ' disabled'}>Añadir al final</button>
        </div>
      </div>
      <details class="st-avanzado"><summary>Ajustes de cada reto (avanzado)</summary>
        ${camposDe({ ejercicios: ejercicios.map((ex) => ({ titulo: ex.titulo, objetivo_texto: ex.objetivo_texto, explicacion: ex.explicacion })) }, '')}
        <p class="st-ayuda">Los tableros se diseñan en el editor visual de retos.</p>
      </details>
    </section>`;
  }

  function paintInspector() {
    const contenedor = $('inspector-content');
    const block = state.blocks[state.selected];
    if (!block) {
      contenedor.innerHTML = `<div class="st-vacio-editor"><p><strong>Selecciona un bloque</strong></p><p>Toca un bloque de la actividad para editar su contenido aquí.</p></div>`;
      return;
    }
    const cabecera = `<header class="inspector-type-card type-${esc(block.tipo)} st-tipo" style="--c:${colorTipo(block.tipo)}">
        <span class="st-card-icono">${esc(iconoTipo(block.tipo))}</span>
        <div><strong>${esc(nombreTipo(block.tipo))}</strong><small>${esc(ayudaTipo(block.tipo))}</small></div>
      </header>`;
    const titulo = `<label class="st-campo"><span>Título del bloque</span><input type="text" data-path="titulo" data-kind="text" value="${esc(block.titulo || '')}" /></label>`;
    let cuerpo;
    if (block.tipo === 'code_blocks') cuerpo = codigoPanel(block, state.selected);
    else if (block.tipo === 'texto') cuerpo = campoEscalar(block.contenido || '', 'contenido', 'contenido');
    else if (block.tipo === 'salto_unidad') cuerpo = campoEscalar(block.descripcion || '', 'descripcion', 'descripcion') + campoEscalar(block.recompensa || 0, 'recompensa', 'recompensa');
    else cuerpo = camposDe(block, '');
    contenedor.innerHTML = `${cabecera}${titulo}${cuerpo}`;
  }

  function ayudaTipo(tipo) {
    if (tipo === 'code_blocks') return 'Retos con bloques tipo Scratch: avanzar, girar, repetir y decidir.';
    if (tipo === 'texto') return 'Explica una idea antes de la actividad.';
    if (tipo === 'test') return 'Una pregunta con varias opciones. Marca la correcta.';
    if (tipo === 'salto_unidad') return 'Separa la actividad en partes con su propia recompensa.';
    if (PRIMARY_HELP[tipo]) return PRIMARY_HELP[tipo];
    return 'Completa los datos del bloque.';
  }

  // Cambio de un campo de texto o número: no añade historial por cada tecla
  function actualizarCampo(elemento) {
    const block = state.blocks[state.selected];
    if (!block) return;
    const ruta = elemento.dataset.path;
    if (!ruta) return;
    let valor;
    if (elemento.dataset.kind === 'bool') valor = elemento.checked;
    else if (elemento.dataset.kind === 'number') valor = elemento.value === '' ? 0 : Number(elemento.value);
    else if (elemento.dataset.kind === 'radio') valor = Number(elemento.value);
    else valor = elemento.value;
    escribirCamino(block, ruta, valor);
    if (ruta === 'titulo') { paintCanvas(); }
    saveDraft();
  }

  function cambioCampo(elemento) {
    actualizarCampo(elemento);
    if (elemento.dataset.kind === 'radio' || elemento.type === 'checkbox') paintInspector();
    recordHistory();
    paintCanvas();
  }

  function anadirFila(ruta, tipo) {
    const block = state.blocks[state.selected];
    if (!block) return;
    const lista = camino(block, ruta) || [];
    let nuevo;
    if (tipo === 'pair') nuevo = [0, 0];
    else if (tipo === 'number') nuevo = 0;
    else if (tipo === 'text') nuevo = '';
    else nuevo = elementoNuevo(block, ruta);
    if (!Array.isArray(camino(block, ruta))) escribirCamino(block, ruta, lista);
    camino(block, ruta).push(nuevo);
    touch();
  }

  function quitarFila(ruta, indice) {
    const block = state.blocks[state.selected];
    const lista = block && camino(block, ruta);
    if (!Array.isArray(lista)) return;
    lista.splice(Number(indice), 1);
    touch();
  }

  function anadirOpcion(ruta) {
    const block = state.blocks[state.selected];
    const pregunta = block && camino(block, ruta);
    if (!pregunta || !Array.isArray(pregunta.opciones)) return;
    pregunta.opciones.push('');
    touch();
  }

  function quitarOpcion(ruta, indice) {
    const block = state.blocks[state.selected];
    const pregunta = block && camino(block, ruta);
    if (!pregunta || !Array.isArray(pregunta.opciones) || pregunta.opciones.length <= 2) {
      notice('Una pregunta necesita al menos dos opciones.', 'error');
      return;
    }
    pregunta.opciones.splice(Number(indice), 1);
    if (pregunta.correcta >= pregunta.opciones.length) pregunta.correcta = 0;
    touch();
  }

  /* ── Importar retos de Code desde la biblioteca de Retos ───────── */

  function importarRetos(modo) {
    const block = state.blocks[state.selected];
    if (!block || block.tipo !== 'code_blocks') return;
    const id = $('code-import-select') ? $('code-import-select').value : '';
    const conjunto = window.PJRetos ? window.PJRetos.lista().find((c) => c.id === id) : null;
    if (!conjunto || !Array.isArray(conjunto.ejercicios) || !conjunto.ejercicios.length) {
      notice('Elige un conjunto de Retos Code para importar.', 'error');
      return;
    }
    const copias = clonar(conjunto.ejercicios).slice(0, 12);
    if (modo === 'replace') {
      if (!window.confirm(`¿Reemplazar los retos actuales por «${conjunto.titulo || 'Sin título'}»?`)) return;
      block.ejercicios = copias;
    } else {
      const hueco = 12 - (block.ejercicios || []).length;
      if (hueco <= 0) { notice('Este bloque ya tiene 12 retos.', 'error'); return; }
      block.ejercicios = (block.ejercicios || []).concat(copias.slice(0, hueco));
    }
    notice(`Retos importados desde «${conjunto.titulo || 'Sin título'}».`, 'ok');
    touch();
  }

  function paintAll() {
    $('meta-title').value = state.title;
    $('meta-description').value = state.description;
    $('meta-category').value = state.category;
    $('meta-age').value = state.age;
    $('meta-difficulty').value = state.difficulty;
    $('meta-reward').value = state.reward;
    paintCanvas();
    paintInspector();
  }

  /* ── Vista previa en diálogo con el reproductor real ───────────── */

  function contenidoActividad() {
    return { version: 2, bloques: clonar(state.blocks.filter((b) => b.tipo !== 'salto_unidad')) };
  }

  function abrirVistaPrevia() {
    if (!state.blocks.some(tieneContenido)) {
      notice('Añade al menos un bloque con contenido para ver la vista previa.', 'error');
      return;
    }
    try {
      sessionStorage.setItem('pj-preview-activity', JSON.stringify({
        id: 'vista-previa-studio',
        titulo: state.title.trim() || 'Actividad sin título',
        descripcion: state.description.trim(),
        tipo: state.blocks[0].tipo,
        contenido: contenidoActividad()
      }));
    } catch (error) {
      notice('No se pudo preparar la vista previa en este navegador.', 'error');
      return;
    }
    const previewDialog = $('preview-dialog');
    $('preview-frame').src = `/preview.html?vista=${Date.now()}`;
    previewDialog.showModal();
  }

  function closePreview() {
    $('preview-frame').src = 'about:blank';
  }

  function cambiarDispositivo(dispositivo) {
    state.previewDevice = dispositivo;
    const anchos = { movil: '390px', tableta: '820px', escritorio: '100%' };
    $('preview-stage').style.setProperty('--ancho', anchos[dispositivo] || '100%');
    document.querySelectorAll('[data-device]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.device === dispositivo)));
  }

  /* ── Envío a revisión (mismo contrato de API) ──────────────────── */

  function tieneContenido(block) {
    if (block.tipo === 'texto') return Boolean(String(block.contenido || '').trim());
    if (block.tipo === 'code_blocks') return (block.ejercicios || []).length > 0;
    return contarItems(block) > 0;
  }

  function contarTodo() {
    return state.blocks.reduce((total, block) => total + contarItems(block), 0);
  }

  function errorDeValidacion() {
    if (!state.title.trim() || state.title.trim().length < 3 || !state.description.trim() || state.description.trim().length < 10) {
      return 'Completa un título (mínimo 3 caracteres) y una descripción (mínimo 10).';
    }
    if (!state.blocks.length || !contarTodo()) return 'Añade bloques con contenido antes de enviar.';
    const sinContenido = state.blocks.find((b) => b.tipo !== 'salto_unidad' && contarItems(b) === 0 && b.tipo !== 'texto' && b.tipo !== 'code_blocks');
    if (sinContenido) return `El bloque «${sinContenido.titulo || nombreTipo(sinContenido.tipo)}» no tiene contenido todavía.`;
    const reparto = state.blocks.filter((b) => b.tipo === 'salto_unidad').reduce((s, b) => s + (Number(b.recompensa) || 0), 0);
    if (reparto > state.reward) return 'Las recompensas de las unidades superan el presupuesto total de Pz.';
    return '';
  }

  async function enviarActividad() {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token || !state.identity) { notice('Inicia sesión con Google antes de enviar a revisión.', 'error'); return; }
    const error = errorDeValidacion();
    if (error) {
      notice(error, 'error');
      if (!state.title.trim()) $('meta-title').focus();
      return;
    }
    const autor = state.identityKind === 'centro' ? state.center?.nombre : state.authorName;
    if (!autor) { notice('No se encontró el nombre de autoría de esta cuenta.', 'error'); return; }
    const boton = $('submit-activity');
    boton.disabled = true;
    notice('Enviando a revisión editorial…', '');
    const body = {
      tipoAutor: state.identityKind,
      orgId: state.identityKind === 'centro' ? state.center?.id : null,
      titulo: state.title.trim(),
      descripcion: state.description.trim(),
      categoria: state.category,
      edad_recomendada: state.age,
      dificultad: state.difficulty,
      tiempo_estimado: 10,
      num_preguntas: contarTodo(),
      recompensa: state.reward,
      contenido: contenidoActividad()
    };
    try {
      const response = await fetch('/api/creadores/actividades', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.success) {
        if (data.necesita_acuerdo) throw new Error(data.error || 'Para publicar como docente hay que completar el Acuerdo de Colaborador.');
        if (data.error === 'docente_no_aprobado') throw new Error('Placeta Junior debe aprobar primero tu alta como docente individual.');
        if (data.error === 'no_autorizado' || data.error === 'centro_no_activo') throw new Error('Tu cuenta no tiene permisos de publicación para ese centro.');
        throw new Error(data.error || data.mensaje || `Error HTTP ${response.status}`);
      }
      notice(`Actividad enviada a revisión editorial como ${autor}. ${data.mensaje || ''}`.trim(), 'ok');
      if (state.currentDraftId) {
        state.drafts = state.drafts.filter((d) => d.id !== state.currentDraftId);
        try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts)); } catch (e) { /* ignorar */ }
      }
      restoreDraft(null);
      showStudioView('activities');
    } catch (err) {
      notice(err.message || 'No se pudo enviar la actividad.', 'error');
    } finally {
      boton.disabled = false;
    }
  }

  /* ── Eventos ───────────────────────────────────────────────────── */

  function vincularEventos() {
    document.querySelectorAll('[data-studio-view]').forEach((tab) => tab.addEventListener('click', () => showStudioView(tab.dataset.studioView)));
    document.querySelectorAll('[data-editor-view]').forEach((tab) => tab.addEventListener('click', () => showEditorPane(tab.dataset.editorView)));
    $('studio-menu').addEventListener('keydown', (event) => {
      const tabs = [...document.querySelectorAll('[data-studio-view]')];
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const teclas = { ArrowRight: 1, ArrowLeft: -1 };
      if (event.key === 'Home') { tabs[0].focus(); showStudioView(tabs[0].dataset.studioView); event.preventDefault(); }
      else if (event.key === 'End') { tabs[tabs.length - 1].focus(); showStudioView(tabs[tabs.length - 1].dataset.studioView); event.preventDefault(); }
      else if (teclas[event.key]) {
        const siguiente = tabs[(i + teclas[event.key] + tabs.length) % tabs.length];
        siguiente.focus(); showStudioView(siguiente.dataset.studioView); event.preventDefault();
      }
    });

    $('new-activity').addEventListener('click', () => newActivity(null));
    $('new-blank').addEventListener('click', () => newActivity(null));
    $('templates').addEventListener('click', (e) => { const t = e.target.closest('[data-template]'); if (t) newActivity(t.dataset.template); });
    $('saved-list').addEventListener('click', (e) => {
      const abrir = e.target.closest('[data-open-draft]');
      const borrar = e.target.closest('[data-delete-draft]');
      const ir = e.target.closest('[data-view-go]');
      if (abrir) openSavedDraft(abrir.dataset.openDraft);
      if (borrar) deleteSavedDraft(borrar.dataset.deleteDraft);
      if (ir) showStudioView(ir.dataset.viewGo);
    });

    $('palette').addEventListener('input', (e) => { if (e.target.id === 'palette-search') filterPalette(); });
    $('palette').addEventListener('change', (e) => { if (e.target.id === 'palette-category') filterPalette(); });
    $('palette').addEventListener('click', (e) => { const b = e.target.closest('[data-type]'); if (b) addBlock(b.dataset.type); });
    $('palette').addEventListener('dragstart', (e) => {
      const b = e.target.closest('[data-type]');
      if (b) e.dataTransfer.setData('text/pj-block-type', b.dataset.type);
    });

    $('canvas').addEventListener('click', (e) => {
      const sel = e.target.closest('[data-select]');
      const mueve = e.target.closest('[data-move]');
      const dup = e.target.closest('[data-duplicate]');
      const quita = e.target.closest('[data-remove]');
      if (mueve) return moveBlock(Number(mueve.dataset.move), Number(mueve.dataset.offset));
      if (dup) return duplicateBlock(Number(dup.dataset.duplicate));
      if (quita) return removeBlock(Number(quita.dataset.remove));
      if (sel) {
        state.selected = Number(sel.dataset.select);
        paintCanvas();
        paintInspector();
        showEditorPane('inspector');
      }
    });
    const lienzo = $('canvas');
    lienzo.addEventListener('dragover', (e) => { e.preventDefault(); });
    lienzo.addEventListener('drop', (e) => {
      const tipo = e.dataTransfer.getData('text/pj-block-type');
      if (!tipo) return;
      e.preventDefault();
      const tarjeta = e.target.closest('.st-card');
      addBlock(tipo, tarjeta ? Number(tarjeta.dataset.index) : state.blocks.length);
    });

    $('add-unit-break').addEventListener('click', addUnitBreak);
    $('undo-action').addEventListener('click', () => restoreHistory(state.historyIndex - 1));
    $('redo-action').addEventListener('click', () => restoreHistory(state.historyIndex + 1));
    $('clear-draft').addEventListener('click', () => {
      if (!state.blocks.length || !window.confirm('¿Vaciar la actividad? Puedes deshacerlo con «Deshacer».')) return;
      state.blocks = [];
      state.selected = -1;
      touch();
    });

    $('inspector-content').addEventListener('input', (e) => {
      const el = e.target;
      if (el.dataset && el.dataset.path && el.dataset.kind !== 'bool' && el.type !== 'radio') actualizarCampo(el);
    });
    $('inspector-content').addEventListener('change', (e) => {
      const el = e.target;
      if (el.dataset && el.dataset.path) cambioCampo(el);
    });
    $('inspector-content').addEventListener('click', (e) => {
      const add = e.target.closest('[data-add-row]');
      const rem = e.target.closest('[data-remove-row]');
      const optAdd = e.target.closest('[data-option-add]');
      const optDel = e.target.closest('[data-option-delete]');
      const importa = e.target.closest('[data-code-import]');
      if (add) anadirFila(add.dataset.addRow, add.dataset.kind);
      if (rem) quitarFila(rem.dataset.removeRow, rem.dataset.index);
      if (optAdd) anadirOpcion(optAdd.dataset.optionAdd);
      if (optDel) quitarOpcion(optDel.dataset.optionDelete, optDel.dataset.index);
      if (importa) importarRetos(importa.dataset.codeImport);
    });

    $('meta-title').addEventListener('input', (e) => { state.title = e.target.value; saveDraft(); });
    $('meta-description').addEventListener('input', (e) => { state.description = e.target.value; saveDraft(); });
    $('meta-category').addEventListener('change', (e) => { state.category = e.target.value; touch(); });
    $('meta-age').addEventListener('change', (e) => { state.age = e.target.value; touch(); });
    $('meta-difficulty').addEventListener('change', (e) => { state.difficulty = e.target.value; touch(); });
    $('meta-reward').addEventListener('change', (e) => { state.reward = Math.max(0, Math.min(10000, Number(e.target.value) || 0)); touch(); });
    $('author-scope').addEventListener('change', (e) => setAuthorScope(e.target.value));

    $('preview-activity').addEventListener('click', abrirVistaPrevia);
    $('preview-device-options').addEventListener('click', (e) => { const b = e.target.closest('[data-device]'); if (b) cambiarDispositivo(b.dataset.device); });
    const previewDialog = $('preview-dialog');
    previewDialog.addEventListener('close', closePreview);
    $('preview-close').addEventListener('click', () => previewDialog.close());
    $('submit-activity').addEventListener('click', enviarActividad);
    document.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) { e.preventDefault(); restoreHistory(state.historyIndex - 1); }
      if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') { e.preventDefault(); restoreHistory(state.historyIndex + 1); }
    });
  }

  function ayudaPantalla() {
    return ['Elige la tarea en «Crear actividad».', 'Añade bloques desde la paleta y edítalos a la derecha.', 'Revisa la vista previa y envía a revisión.'];
  }

  /* ── Arranque ──────────────────────────────────────────────────── */

  function initialize() {
    vincularEventos();
    paintPalette();
    loadIdentity().then((authorized) => {
      if (!authorized) return;
      loadDrafts();
      const ultimo = state.drafts.filter((d) => d.scope === draftScope())
        .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
      restoreDraft(ultimo || null);
      paintPalette();
      paintTemplates();
      renderSavedActivities();
      cambiarDispositivo('movil');
      showStudioView(ultimo ? 'edit' : 'activities');
      showEditorPane('canvas');
      $('studio-guide-steps').innerHTML = ayudaPantalla().map((t, i) => `<li><span class="st-num">${i + 1}</span><span>${esc(t)}</span></li>`).join('');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize);
  else initialize();
})();
