(() => {
  'use strict';

  const SESSION_KEY = 'pj27-sesion';
  const DRAFT_KEY = 'pj-studio-creadores-draft';
  const DRAFTS_KEY = 'pj-studio-creadores-drafts-v1';
  const TYPES = [
    ['texto', 'Texto explicativo', '▤', 'Básicos'], ['test', 'Preguntas tipo test', '?', 'Básicos'],
    ['relacionar', 'Relacionar parejas', '↔', 'Básicos'], ['completar', 'Completar frases', '✎', 'Básicos'],
    ['ordenar', 'Ordenar pasos', '≡', 'Básicos'], ['sopa_letras', 'Sopa de letras', '▦', 'Básicos'],
    ['reloj', 'El reloj', '🕒', 'Matemáticas'], ['recta_numerica', 'Recta numérica', '📏', 'Matemáticas'],
    ['grafico', 'Lee el gráfico', '📊', 'Matemáticas'], ['balanza', 'Balanza', '⚖️', 'Matemáticas'],
    ['ahorcado', 'Adivina la palabra', '🔤', 'Lengua'], ['anagrama', 'Ordena las letras', '🔀', 'Lengua'],
    ['patrones', 'Continúa la serie', '🔁', 'Lógica y atención'], ['simetria', 'Completa el reflejo', '🪞', 'Lógica y atención'],
    ['silabas', 'Separa en sílabas', '✂️', 'Lengua'], ['vf_rapido', 'Verdadero o falso', '⚡', 'Lógica y atención'],
    ['ruleta_preguntas', 'Ruleta de preguntas', '🎡', 'Lógica y atención']
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
    ruleta_preguntas: { preguntas: [{ categoria: 'Ciencias', pregunta: '¿Cuántos planetas tiene el sistema solar?', opciones: ['7', '8', '9'], correcta: 1 }, { categoria: 'Lengua', pregunta: '¿Cuál es un verbo?', opciones: ['correr', 'mesa', 'azul'], correcta: 0 }] }
  };
  const PRIMARY_HELP = {
    reloj: 'Cambia la hora o el modo. Usa horas en formato HH:MM.',
    recta_numerica: 'Ajusta los límites, el salto y los números que el alumnado colocará.',
    grafico: 'Edita los datos y las preguntas en formato JSON. Cada dato lleva etiqueta y valor.',
    balanza: 'Edita los ejercicios en JSON. Cada ejercicio incluye los pesos de ambos platos y las pesas disponibles.',
    ahorcado: 'Escribe las palabras y una pista para cada una. Ajusta el número de intentos.',
    anagrama: 'Añade palabras y pistas. El alumnado tendrá que ordenar sus letras.',
    patrones: 'Cada serie contiene los elementos en orden; usa ? en el lugar que se debe descubrir.',
    simetria: 'Cada ejercicio define la cuadrícula y las celdas que forman el dibujo.',
    silabas: 'Cada palabra contiene una lista de sílabas en el orden correcto.',
    vf_rapido: 'Escribe afirmaciones y marca en cada una si es verdadera; añade una explicación.',
    ruleta_preguntas: 'Añade categoría, pregunta, opciones y el índice de la respuesta correcta (empieza en 0).'
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
  const DEFAULTS = {
    texto: () => ({ tipo: 'texto', titulo: 'Nuevo texto', contenido: '' }),
    test: () => ({ tipo: 'test', titulo: 'Nuevas preguntas', preguntas: [{ pregunta: '', opciones: ['', '', ''], correcta: 0 }] }),
    relacionar: () => ({ tipo: 'relacionar', titulo: 'Relaciona', modo: 'emparejar', pares: [{ izq: '', der: '' }] }),
    completar: () => ({ tipo: 'completar', titulo: 'Completa', modo: 'escribir', frases: [{ texto: 'Escribe una frase con ___', respuesta: '' }] }),
    ordenar: () => ({ tipo: 'ordenar', titulo: 'Ordena los pasos', items: ['Primer paso', 'Segundo paso', 'Tercer paso'] }),
    sopa_letras: () => ({ tipo: 'sopa_letras', titulo: 'Sopa de letras', palabras: ['SOL', 'LUNA'], pistas: [] }),
    ...Object.fromEntries(Object.entries(PRIMARY_DEFAULTS).map(([type, data]) => [type, () => ({ tipo: type, titulo: TYPES.find(([id]) => id === type)?.[1] || type, datos: structuredClone(data) })]))
  };
  const state = { title: '', description: '', category: 'General', age: '6-12', difficulty: 'media', blocks: [], selected: -1, templates: [], identity: null, identityKind: 'docente', authorName: '', center: null, centers: [], docenteAprobado: false, drafts: [], currentDraftId: null };
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const history = [];
  let historyIndex = -1;
  let historyTimer;

  function historyState() {
    return { title: state.title, description: state.description, category: state.category, age: state.age, difficulty: state.difficulty, blocks: state.blocks };
  }

  function updateHistoryButtons() {
    const hasUnrecordedChanges = historyIndex >= 0 && history[historyIndex] !== JSON.stringify(historyState());
    $('undo-action').disabled = historyIndex <= 0 && !hasUnrecordedChanges;
    $('redo-action').disabled = hasUnrecordedChanges || historyIndex < 0 || historyIndex >= history.length - 1;
  }

  function recordHistory() {
    clearTimeout(historyTimer);
    const snapshot = JSON.stringify(historyState());
    if (historyIndex >= 0 && history[historyIndex] === snapshot) return;
    history.splice(historyIndex + 1);
    history.push(snapshot);
    if (history.length > 50) history.shift();
    historyIndex = history.length - 1;
    updateHistoryButtons();
  }

  function resetHistory() {
    clearTimeout(historyTimer);
    history.length = 0;
    historyIndex = -1;
    recordHistory();
  }

  function restoreHistory(index) {
    clearTimeout(historyTimer);
    historyIndex = index;
    Object.assign(state, JSON.parse(history[historyIndex]));
    state.selected = state.blocks.length ? Math.max(0, Math.min(state.selected, state.blocks.length - 1)) : -1;
    paintCanvas();
    updateHistoryButtons();
  }

  function scheduleHistory() {
    clearTimeout(historyTimer);
    historyTimer = setTimeout(recordHistory, 500);
  }

  function notice(text, kind) {
    const node = $('notice');
    node.textContent = text;
    node.className = `notice ${kind || ''}`;
  }

  function draftScope() {
    return state.identityKind === 'centro' && state.center
      ? `centro:${state.center.id}`
      : `docente:${String(state.identity?.email || '').trim().toLowerCase()}`;
  }

  function createDraftId() {
    return globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function hasDraftContent() {
    return Boolean(state.title.trim() || state.description.trim() || state.blocks.length);
  }

  function currentDraftData() {
    return {
      id: state.currentDraftId,
      scope: draftScope(),
      title: state.title,
      description: state.description,
      category: state.category,
      age: state.age,
      difficulty: state.difficulty,
      blocks: state.blocks,
      updatedAt: new Date().toISOString()
    };
  }

  function saveDraft() {
    if (!state.currentDraftId && !hasDraftContent()) return;
    if (!state.currentDraftId) state.currentDraftId = createDraftId();
    const saved = currentDraftData();
    const index = state.drafts.findIndex((draft) => draft.id === saved.id);
    if (index >= 0) state.drafts[index] = saved;
    else state.drafts.unshift(saved);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
      localStorage.removeItem(DRAFT_KEY);
      renderSavedActivities();
    } catch (error) {
      notice('No se pudo guardar la actividad en este dispositivo. Comprueba el espacio disponible.', 'error');
    }
  }

  function restoreDraft(draft) {
    const saved = draft || {};
    Object.assign(state, {
      title: saved.title || '',
      description: saved.description || '',
      category: saved.category || 'General',
      age: saved.age || '6-12',
      difficulty: saved.difficulty || 'media',
      blocks: Array.isArray(saved.blocks) ? saved.blocks : [],
      currentDraftId: saved.id || null,
      selected: Array.isArray(saved.blocks) && saved.blocks.length ? 0 : -1
    });
    resetHistory();
    paintCanvas();
    renderSavedActivities();
  }

  function loadDrafts() {
    try {
      const saved = JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]');
      if (!Array.isArray(saved)) throw new Error('La lista de actividades guardadas no es válida.');
      state.drafts = saved.filter((draft) => draft && typeof draft.id === 'string' && typeof draft.scope === 'string' && Array.isArray(draft.blocks));
      const legacy = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
      if (legacy && Array.isArray(legacy.blocks)) {
        state.drafts.unshift({ ...legacy, id: createDraftId(), scope: draftScope(), updatedAt: new Date().toISOString() });
        localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
        localStorage.removeItem(DRAFT_KEY);
      }
    } catch (error) {
      notice('No se pudieron leer las actividades guardadas de este dispositivo.', 'error');
      state.drafts = [];
    }
  }

  function renderSavedActivities() {
    const root = $('saved-activities');
    if (!root) return;
    const scope = $('managed-center')?.value || draftScope();
    const drafts = state.drafts.filter((draft) => draft.scope === scope).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')));
    $('saved-count').textContent = `${drafts.length} ${drafts.length === 1 ? 'actividad guardada' : 'actividades guardadas'}`;
    root.innerHTML = drafts.length ? drafts.map((draft) => {
      const title = draft.title?.trim() || 'Actividad sin título';
      const updated = draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString('es-ES') : '';
      return `<article class="saved-activity${draft.id === state.currentDraftId ? ' is-current' : ''}"><span class="saved-activity-art" aria-hidden="true">✦</span><div class="saved-activity-copy"><strong>${esc(title)}</strong><small>${esc(draft.category || 'General')} · ${draft.blocks.length} bloques${updated ? ` · Guardada ${esc(updated)}` : ''}</small></div><button type="button" class="saved-open" data-open-draft="${esc(draft.id)}">Abrir</button><button type="button" class="saved-delete" data-delete-draft="${esc(draft.id)}" aria-label="Eliminar ${esc(title)}">×</button></article>`;
    }).join('') : '<div class="saved-empty"><span aria-hidden="true">🪁</span><strong>Tu espacio está listo</strong><p>Aquí aparecerán las actividades que guardes para este centro.</p><button type="button" class="new-activity-button" data-create-first>＋ Crear mi primera actividad</button></div>';
  }

  function setupManagedCenters() {
    const select = $('managed-center');
    const choices = [
      ...(state.docenteAprobado ? [{ value: 'docente', label: 'Mi espacio docente' }] : []),
      ...state.centers.map((center) => ({ value: `centro:${center.id}`, label: center.nombre }))
    ];
    select.innerHTML = choices.map((choice) => `<option value="${esc(choice.value)}">${esc(choice.label)}</option>`).join('');
    select.value = draftScope();
  }

  function setAuthorScope(value) {
    saveDraft();
    if (value === 'docente') {
      state.identityKind = 'docente';
      state.center = null;
    } else {
      state.identityKind = 'centro';
      state.center = state.centers.find((center) => `centro:${center.id}` === value) || null;
      if (!state.center) return;
    }
    const latest = state.drafts.filter((draft) => draft.scope === draftScope()).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
    restoreDraft(latest);
    $('managed-center').value = draftScope();
    paintIdentity(state.identity?.email || '');
    showStudioView('activities');
  }

  function startNewActivity() {
    saveDraft();
    restoreDraft(null);
    paintTemplates('');
    showStudioView('create');
    $('meta-title').focus();
  }

  function openSavedDraft(id) {
    const draft = state.drafts.find((item) => item.id === id && item.scope === draftScope());
    if (!draft) return;
    restoreDraft(draft);
    paintTemplates('');
    showStudioView('edit');
  }

  function deleteSavedDraft(id) {
    const draft = state.drafts.find((item) => item.id === id && item.scope === draftScope());
    if (!draft || !window.confirm(`¿Eliminar «${draft.title?.trim() || 'Actividad sin título'}» de este dispositivo?`)) return;
    state.drafts = state.drafts.filter((item) => item.id !== id);
    try {
      localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts));
      if (state.currentDraftId === id) restoreDraft(null);
      renderSavedActivities();
    } catch (error) {
      notice('No se pudo eliminar la actividad guardada. Inténtalo de nuevo.', 'error');
    }
  }

  function removeCurrentDraft() {
    state.drafts = state.drafts.filter((draft) => draft.id !== state.currentDraftId);
    state.currentDraftId = null;
    try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(state.drafts)); localStorage.removeItem(DRAFT_KEY); }
    catch (error) { notice('La actividad se envió, pero no se pudo actualizar la lista de borradores.', 'error'); }
  }

  function showStudioView(name) {
    document.querySelectorAll('[data-studio-panel]').forEach((panel) => { panel.hidden = panel.dataset.studioPanel !== name; });
    document.querySelectorAll('[data-studio-view]').forEach((button) => {
      const active = button.dataset.studioView === name;
      button.setAttribute('aria-selected', String(active));
      button.tabIndex = active ? 0 : -1;
    });
    $('submit-bar').hidden = name !== 'edit';
    if (name === 'edit') $('activity-title').textContent = state.title || 'Actividad sin título';
  }

  function blockName(type) { return TYPES.find(([id]) => id === type)?.[1] || type; }
  function blockSummary(block) {
    if (block.tipo === 'texto') return (block.contenido || '').replace(/\s+/g, ' ').slice(0, 72) || 'Añade una explicación';
    if (block.tipo === 'test') return `${(block.preguntas || []).length} pregunta(s)`;
    if (block.tipo === 'relacionar') return `${(block.pares || []).length} pareja(s)`;
    if (block.tipo === 'completar') return `${(block.frases || []).length} frase(s)`;
    if (block.tipo === 'ordenar') return `${(block.items || []).length} paso(s)`;
    if (block.tipo === 'sopa_letras') return `${(block.palabras || []).length} palabra(s)`;
    const data = block.datos || block;
    if (block.tipo === 'reloj') return `${(data.ejercicios || []).length} hora(s)`;
    if (block.tipo === 'recta_numerica') return `${(data.valores || []).length} número(s)`;
    if (block.tipo === 'grafico') return `${(data.datos || []).length} dato(s)`;
    if (block.tipo === 'balanza' || block.tipo === 'simetria') return `${(data.ejercicios || []).length} reto(s)`;
    if (block.tipo === 'ahorcado' || block.tipo === 'anagrama' || block.tipo === 'silabas') return `${(data.palabras || []).length} palabra(s)`;
    if (block.tipo === 'patrones') return `${(data.secuencias || []).length} serie(s)`;
    if (block.tipo === 'vf_rapido') return `${(data.afirmaciones || []).length} afirmación(es)`;
    if (block.tipo === 'ruleta_preguntas') return `${(data.preguntas || []).length} pregunta(s)`;
    return '';
  }

  function paintTemplates(active) {
    const visuals = { quiz: ['🎯', 'template-quiz'], parejas: ['🧩', 'template-pairs'], lectura: ['📚', 'template-reading'], vocabulario: ['🌿', 'template-vocabulary'] };
    $('templates').innerHTML = TEMPLATES.map((item, index) => {
      const [icon, style] = visuals[item.id];
      return `<button type="button" class="template ${style}" data-template="${item.id}" aria-pressed="${active === item.id}"><span class="template-art" aria-hidden="true">${icon}</span><span class="template-copy"><span class="template-index">PLANTILLA 0${index + 1}</span><strong>${esc(item.title)}</strong><small>${esc(item.description)}</small></span><span class="template-arrow" aria-hidden="true">→</span></button>`;
    }).join('');
  }

  function paintPalette() {
    const categories = [...new Set(TYPES.map(([, , , category]) => category))];
    $('palette').innerHTML = `<div class="palette-filters"><label class="palette-search"><span aria-hidden="true">⌕</span><input id="palette-search" type="search" placeholder="Busca un tipo…" aria-label="Buscar tipos de actividad"></label><label class="palette-category-label" for="palette-category">Materia</label><select id="palette-category" aria-label="Filtrar por materia"><option value="all">Todas</option>${categories.map((category) => `<option value="${esc(category)}">${esc(category)}</option>`).join('')}</select><p id="palette-count" class="palette-count" aria-live="polite"></p></div><div class="palette-items">${TYPES.map(([type, name, icon, category]) => `<button type="button" draggable="true" class="palette-item type-${type}" data-type="${type}" data-category="${esc(category)}"><span class="palette-icon" aria-hidden="true">${icon}</span><span class="palette-item-copy"><strong>${esc(name)}</strong><small>${esc(category)}</small></span><span class="palette-add" aria-hidden="true">＋</span></button>`).join('')}</div>`;
    const filterPalette = () => {
      const query = $('palette-search').value.trim().toLocaleLowerCase();
      const category = $('palette-category').value;
      let visible = 0;
      $('palette').querySelectorAll('[data-type]').forEach((button) => {
        const matches = (category === 'all' || button.dataset.category === category)
          && (!query || button.textContent.toLocaleLowerCase().includes(query));
        button.hidden = !matches;
        if (matches) visible += 1;
      });
      $('palette-count').textContent = `${visible} ${visible === 1 ? 'tipo disponible' : 'tipos disponibles'}`;
    };
    $('palette-search').addEventListener('input', filterPalette);
    $('palette-category').addEventListener('change', filterPalette);
    filterPalette();
  }

  function paintCanvas() {
    const canvas = $('canvas');
    canvas.classList.toggle('empty', !state.blocks.length);
    $('activity-title').textContent = state.title || 'Actividad sin título';
    $('draft-title').textContent = state.title || 'Actividad nueva';
    $('draft-summary').textContent = `${state.blocks.length} bloque(s) · borrador guardado en este dispositivo`;
    $('meta-title').value = state.title;
    $('meta-description').value = state.description;
    $('meta-category').value = state.category;
    $('meta-age').value = state.age;
    $('meta-difficulty').value = state.difficulty;
    canvas.innerHTML = state.blocks.length ? state.blocks.map((block, index) => `<article class="block-card${index === state.selected ? ' selected' : ''}" data-index="${index}" draggable="true"><span class="block-number">${String(index + 1).padStart(2, '0')}</span><button class="block-select block-copy" type="button" aria-label="Editar ${esc(blockName(block.tipo))}, bloque ${index + 1}"><strong>${esc(block.titulo || blockName(block.tipo))}</strong><small>${esc(blockName(block.tipo))} · ${esc(blockSummary(block))}</small></button><span class="block-actions"><button class="block-action" data-move="-1" data-index="${index}" type="button" aria-label="Mover bloque ${index + 1} antes" ${index === 0 ? 'disabled' : ''}>↑</button><button class="block-action" data-move="1" data-index="${index}" type="button" aria-label="Mover bloque ${index + 1} después" ${index === state.blocks.length - 1 ? 'disabled' : ''}>↓</button><button class="block-action" data-duplicate="${index}" type="button" aria-label="Duplicar bloque ${index + 1}">⧉</button><button class="remove-block" data-remove="${index}" type="button" aria-label="Eliminar bloque ${index + 1}">×</button></span></article>`).join('') : '<div class="empty-state"><strong>El lienzo está listo</strong>Elige una plantilla o añade bloques desde la izquierda. Arrastra para cambiar el orden.</div>';
    paintInspector();
    saveDraft();
    updateHistoryButtons();
  }

  function editorField(label, key, value, mode = 'text', rows = 3) {
    const textarea = mode === 'multiline' || mode === 'json' || mode === 'lines';
    const shown = mode === 'json' ? JSON.stringify(value ?? [], null, 2) : mode === 'lines' ? (Array.isArray(value) ? value.join('\n') : '') : value ?? '';
    return `<div class="field"><label for="field-${key}">${esc(label)}</label>${textarea ? `<textarea id="field-${key}" data-key="${key}" data-mode="${mode}" rows="${rows}"${mode === 'json' ? ' class="json-field" spellcheck="false"' : ''}>${esc(shown)}</textarea>` : `<input id="field-${key}" data-key="${key}" value="${esc(shown)}" />`}</div>`;
  }

  function primaryField(label, key, value, mode = 'text', hint = '') {
    const textarea = ['lines', 'json', 'times', 'wordHints', 'syllables', 'truth', 'chartData'].includes(mode);
    let shown = value ?? '';
    if (mode === 'json') shown = JSON.stringify(value ?? [], null, 2);
    else if (mode === 'lines') shown = Array.isArray(value) ? value.join('\n') : '';
    else if (mode === 'times') shown = Array.isArray(value) ? value.map((item) => item.hora || '').join('\n') : '';
    else if (mode === 'wordHints') shown = Array.isArray(value) ? value.map((item) => `${item.palabra || ''}|${item.pista || ''}`).join('\n') : '';
    else if (mode === 'syllables') shown = Array.isArray(value) ? value.map((item) => `${item.palabra || ''}|${(item.silabas || []).join('-')}`).join('\n') : '';
    else if (mode === 'truth') shown = Array.isArray(value) ? value.map((item) => `${item.texto || ''}|${item.verdadero ? 'verdadero' : 'falso'}|${item.explicacion || ''}`).join('\n') : '';
    else if (mode === 'chartData') shown = Array.isArray(value) ? value.map((item) => `${item.etiqueta || ''}|${item.valor ?? ''}`).join('\n') : '';
    const id = `primary-${key.replace(/[^a-z0-9]/gi, '-')}`;
    let control;
    if (textarea) control = `<textarea id="${id}" data-primary-data="${key}" data-mode="${mode}" rows="${mode === 'json' ? 9 : 4}"${mode === 'json' ? ' spellcheck="false"' : ''}>${esc(shown)}</textarea>`;
    else if (mode === 'select') {
      const options = key === 'modo' ? [['poner', 'Poner la hora'], ['leer', 'Leer la hora']] : [['barras', 'Barras'], ['pictograma', 'Pictograma']];
      control = `<select id="${id}" data-primary-data="${key}" data-mode="${mode}">${options.map(([option, title]) => `<option value="${option}" ${shown === option ? 'selected' : ''}>${title}</option>`).join('')}</select>`;
    } else control = `<input id="${id}" data-primary-data="${key}" data-mode="${mode}" ${mode === 'number' ? 'type="number"' : ''} value="${esc(shown)}" />`;
    return `<label class="field primary-field" for="${id}"><span>${esc(label)}</span>${control}${hint ? `<small>${esc(hint)}</small>` : ''}</label>`;
  }

  function primaryEditorFields(block) {
    const data = block.datos || PRIMARY_DEFAULTS[block.tipo];
    if (block.tipo === 'reloj') return primaryField('Modo', 'modo', data.modo || 'poner', 'select', 'Elige si mostrar una hora para ajustar o para leer.') +
      primaryField('Horas (una por línea)', 'ejercicios', data.ejercicios, 'times', 'Ejemplo: 03:30. Se creará un reto por hora.');
    if (block.tipo === 'recta_numerica') return primaryField('Número mínimo', 'min', data.min, 'number') +
      primaryField('Número máximo', 'max', data.max, 'number') +
      primaryField('Salto entre marcas', 'paso', data.paso, 'number') +
      primaryField('Números para colocar (uno por línea)', 'valores', data.valores, 'lines');
    if (block.tipo === 'grafico') return primaryField('Título del gráfico', 'titulo_grafico', data.titulo_grafico) +
      primaryField('Unidad', 'unidad', data.unidad, 'text', 'Ejemplo: niños, libros, puntos.') +
      primaryField('Tipo de gráfico', 'tipo_grafico', data.tipo_grafico || 'barras', 'select') +
      primaryField('Datos (etiqueta|valor, una línea por dato)', 'datos', data.datos, 'chartData', 'Ejemplo: Perro|8');
    if (block.tipo === 'balanza') return primaryField('Ejercicios de balanza (JSON)', 'ejercicios', data.ejercicios, 'json', 'Cada ejercicio define izq, der y pesas. Mantén los nombres tal como aparecen.');
    if (block.tipo === 'ahorcado') return primaryField('Intentos disponibles', 'intentos', data.intentos, 'number') +
      primaryField('Palabras y pistas (palabra|pista)', 'palabras', data.palabras, 'wordHints', 'Ejemplo: MARIPOSA|Insecto con alas de colores.');
    if (block.tipo === 'anagrama') return primaryField('Palabras y pistas (palabra|pista)', 'palabras', data.palabras, 'wordHints', 'Ejemplo: ESCUELA|Donde aprendes.');
    if (block.tipo === 'patrones') return primaryField('Series (JSON)', 'secuencias', data.secuencias, 'json', 'Cada serie contiene serie, opciones y correcta (índice desde 0). Usa ? para el hueco.');
    if (block.tipo === 'simetria') return primaryField('Dibujos de la cuadrícula (JSON)', 'ejercicios', data.ejercicios, 'json', 'Cada dibujo contiene ancho, alto y celdas [x, y] de la mitad izquierda.');
    if (block.tipo === 'silabas') return primaryField('Palabras separadas en sílabas (palabra|sílabas)', 'palabras', data.palabras, 'syllables', 'Ejemplo: MARIPOSA|MA-RI-PO-SA.');
    if (block.tipo === 'vf_rapido') return primaryField('Duración en segundos', 'segundos', data.segundos, 'number') +
      primaryField('Afirmaciones (texto|verdadero/falso|explicación)', 'afirmaciones', data.afirmaciones, 'truth', 'Ejemplo: El Sol es una estrella.|verdadero|Es la estrella más cercana a la Tierra.');
    if (block.tipo === 'ruleta_preguntas') return primaryField('Preguntas de la ruleta (JSON)', 'preguntas', data.preguntas, 'json', 'Cada pregunta tiene categoria, pregunta, opciones y correcta (índice desde 0).');
    return '';
  }

  function updatePrimaryField(target) {
    const block = state.blocks[state.selected];
    if (!block || !PRIMARY_DEFAULTS[block.tipo]) return;
    const data = block.datos || (block.datos = structuredClone(PRIMARY_DEFAULTS[block.tipo]));
    const key = target.dataset.primaryData;
    const mode = target.dataset.mode;
    const raw = target.value;
    let value = raw;
    if (mode === 'number') {
      if (raw.trim() === '' || !Number.isFinite(Number(raw))) { $('field-error').textContent = 'Escribe un número válido.'; return; }
      value = Number(raw);
    }
    else if (mode === 'lines') {
      const entries = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (entries.some((entry) => !Number.isFinite(Number(entry)))) { $('field-error').textContent = 'Escribe solo números, uno por línea.'; return; }
      value = entries.map(Number);
    }
    else if (mode === 'times') {
      const hours = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (hours.some((hora) => !/^([01]\d|2[0-3]):[0-5]\d$/.test(hora))) { $('field-error').textContent = 'Escribe cada hora en formato HH:MM.'; return; }
      value = hours.map((hora) => ({ hora }));
    }
    else if (mode === 'wordHints') value = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [palabra = '', pista = ''] = line.split('|');
      return { palabra: palabra.trim(), pista: pista.trim() };
    });
    else if (mode === 'syllables') value = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [palabra = '', silabas = ''] = line.split('|');
      return { palabra: palabra.trim(), silabas: silabas.split('-').map((item) => item.trim()).filter(Boolean) };
    });
    else if (mode === 'truth') value = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      const [texto = '', verdadero = '', explicacion = ''] = line.split('|');
      return { texto: texto.trim(), verdadero: verdadero.trim().toLocaleLowerCase() === 'verdadero', explicacion: explicacion.trim() };
    });
    else if (mode === 'chartData') {
      const entries = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const parsed = entries.map((line) => {
        const [etiqueta = '', valor = ''] = line.split('|');
        return { etiqueta: etiqueta.trim(), rawValue: valor.trim(), valor: Number(valor) };
      });
      if (parsed.length < 2) { $('field-error').textContent = 'Añade al menos dos datos al gráfico.'; return; }
      if (parsed.some((item) => !item.etiqueta || !item.rawValue || !Number.isFinite(item.valor) || item.valor < 0)) { $('field-error').textContent = 'Usa etiqueta|valor en cada línea. El valor debe ser un número igual o mayor que 0.'; return; }
      value = parsed.map(({ etiqueta, valor }) => ({ etiqueta, valor }));
    }
    else if (mode === 'json') {
      try { value = JSON.parse(raw); }
      catch (_) { $('field-error').textContent = 'Revisa el JSON: todavía no es válido y se conserva la última versión correcta.'; return; }
    }
    data[key] = value;
    $('field-error').textContent = '';
    scheduleHistory();
    const card = $('canvas').querySelector(`[data-index="${state.selected}"]`);
    if (card) card.querySelector('.block-copy small').textContent = `${blockName(block.tipo)} · ${blockSummary(block)}`;
    saveDraft();
  }

  function paintInspector() {
    const root = $('inspector-content');
    const block = state.blocks[state.selected];
    if (!block) { root.innerHTML = '<p class="inspector-empty">Selecciona un bloque para editarlo. El título y la descripción se completan al enviar.</p>'; return; }
    const typeArt = {
      texto: ['▤', 'Lectura y explicación', 'Presenta el tema con tus propias palabras.'],
      test: ['?', 'Pregunta y descubre', 'Escribe opciones breves y marca la respuesta correcta.'],
      relacionar: ['↔', 'Conecta las ideas', 'Cada pareja une un concepto con su respuesta.'],
      completar: ['✎', 'Completa el hueco', 'La respuesta debe encajar en el espacio de la frase.'],
      ordenar: ['≡', 'Pasos en orden', 'Coloca cada paso en una línea, en el orden esperado.'],
      sopa_letras: ['▦', 'Busca las palabras', 'Añade vocabulario y, si quieres, una pista para cada palabra.'],
      reloj: ['🕒', 'El reloj', PRIMARY_HELP.reloj],
      recta_numerica: ['📏', 'Recta numérica', PRIMARY_HELP.recta_numerica],
      grafico: ['📊', 'Lee el gráfico', PRIMARY_HELP.grafico],
      balanza: ['⚖️', 'Balanza', PRIMARY_HELP.balanza],
      ahorcado: ['🔤', 'Adivina la palabra', PRIMARY_HELP.ahorcado],
      anagrama: ['🔀', 'Ordena las letras', PRIMARY_HELP.anagrama],
      patrones: ['🔁', 'Continúa la serie', PRIMARY_HELP.patrones],
      simetria: ['🪞', 'Completa el reflejo', PRIMARY_HELP.simetria],
      silabas: ['✂️', 'Separa en sílabas', PRIMARY_HELP.silabas],
      vf_rapido: ['⚡', 'Verdadero o falso', PRIMARY_HELP.vf_rapido],
      ruleta_preguntas: ['🎡', 'Ruleta de preguntas', PRIMARY_HELP.ruleta_preguntas]
    };
    const art = typeArt[block.tipo] || ['✦', blockName(block.tipo), 'Personaliza este contenido.'];
    let fields = editorField('Título del bloque', 'titulo', block.titulo || '');
    if (block.tipo === 'texto') fields += editorField('Contenido', 'contenido', block.contenido, 'multiline', 8);
    else if (block.tipo === 'test') fields += `<div class="repeat-list">${(block.preguntas || []).map((item, index) => `<fieldset class="repeat-item"><legend>Pregunta ${index + 1}</legend>${fieldMarkup('Enunciado', 'preguntas', index, 'pregunta', item.pregunta)}<label class="field"><span>Opciones, una por línea</span><textarea data-collection="preguntas" data-index="${index}" data-key="opciones" data-mode="lines" rows="4">${esc((item.opciones || []).join('\n'))}</textarea></label><label class="field"><span>Índice correcto (empieza en 0)</span><input type="number" min="0" max="${Math.max(0, (item.opciones || []).length - 1)}" data-collection="preguntas" data-index="${index}" data-key="correcta" value="${Number(item.correcta) || 0}" /></label><button type="button" class="quiet-button" data-delete-row="preguntas" data-index="${index}">Eliminar pregunta</button></fieldset>`).join('')}</div><button type="button" class="add-row" data-add-row="preguntas">＋ Añadir pregunta</button>`;
    else if (block.tipo === 'relacionar') fields += `<div class="repeat-list">${(block.pares || []).map((item, index) => `<fieldset class="repeat-item"><legend>Pareja ${index + 1}</legend>${fieldMarkup('Concepto', 'pares', index, 'izq', item.izq)}${fieldMarkup('Respuesta', 'pares', index, 'der', item.der)}<button type="button" class="quiet-button" data-delete-row="pares" data-index="${index}">Eliminar pareja</button></fieldset>`).join('')}</div><button type="button" class="add-row" data-add-row="pares">＋ Añadir pareja</button>`;
    else if (block.tipo === 'completar') fields += `<div class="repeat-list">${(block.frases || []).map((item, index) => `<fieldset class="repeat-item"><legend>Frase ${index + 1}</legend>${fieldMarkup('Frase con hueco ___', 'frases', index, 'texto', item.texto)}${fieldMarkup('Respuesta', 'frases', index, 'respuesta', item.respuesta)}<button type="button" class="quiet-button" data-delete-row="frases" data-index="${index}">Eliminar frase</button></fieldset>`).join('')}</div><button type="button" class="add-row" data-add-row="frases">＋ Añadir frase</button>`;
    else if (block.tipo === 'ordenar') fields += editorField('Pasos (uno por línea)', 'items', block.items, 'lines', 6);
    else if (block.tipo === 'sopa_letras') {
      fields += editorField('Palabras (una por línea)', 'palabras', block.palabras, 'lines', 5);
      fields += editorField('Pistas (una por línea, opcional)', 'pistas', block.pistas, 'lines', 4);
    }
    if (PRIMARY_DEFAULTS[block.tipo]) fields += `<details class="activity-data-editor" open><summary>Configurar contenido del reto</summary><p>${esc(PRIMARY_HELP[block.tipo])}</p>${primaryEditorFields(block)}</details><details class="activity-data-editor"><summary>Opciones avanzadas (JSON)</summary>${editorField('Datos completos del reto', 'datos', block.datos || PRIMARY_DEFAULTS[block.tipo], 'json', 12)}</details>`;
    root.innerHTML = `<div class="inspector-type-card type-${esc(block.tipo)}"><span aria-hidden="true">${art[0]}</span><div><strong>${art[1]}</strong><small>${art[2]}</small></div></div>${fields}<p class="validation" id="field-error" aria-live="polite"></p>`;
  }

  function fieldMarkup(label, collection, index, key, value) {
    return `<label class="field"><span>${esc(label)}</span><input data-collection="${collection}" data-index="${index}" data-key="${key}" value="${esc(value || '')}" /></label>`;
  }

  function useTemplate(id) {
    const template = TEMPLATES.find((item) => item.id === id);
    if (!template) return;
    recordHistory();
    state.blocks = structuredClone(template.blocks);
    state.title = template.title;
    state.description = template.description;
    state.selected = 0;
    paintTemplates(id);
    paintCanvas();
    recordHistory();
    notice('', '');
  }

  function addBlock(type, before = state.blocks.length) {
    if (!DEFAULTS[type]) return;
    recordHistory();
    state.blocks.splice(before, 0, DEFAULTS[type]());
    state.selected = before;
    paintTemplates('');
    paintCanvas();
    recordHistory();
  }

  function updateField(target) {
    const block = state.blocks[state.selected];
    if (!block) return;
    const { key, mode } = target.dataset;
    let value = target.value;
    const error = $('field-error');
    if (mode === 'json') {
      try { value = JSON.parse(value); error.textContent = ''; }
      catch (_) { error.textContent = 'El JSON aún no es válido; se conserva el último valor correcto.'; return; }
    } else if (mode === 'lines') value = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    block[key] = value;
    scheduleHistory();
    const card = $('canvas').querySelector(`[data-index="${state.selected}"]`);
    if (card) {
      card.querySelector('.block-copy strong').textContent = block.titulo || blockName(block.tipo);
      card.querySelector('.block-copy small').textContent = `${blockName(block.tipo)} · ${blockSummary(block)}`;
    }
    $('activity-title').textContent = state.title || 'Actividad sin título';
    saveDraft();
  }

  function updateCollectionField(target) {
    const block = state.blocks[state.selected];
    if (!block) return;
    const collection = block[target.dataset.collection];
    const item = collection && collection[Number(target.dataset.index)];
    if (!item) return;
    let value = target.value;
    if (target.dataset.key === 'opciones' && target.dataset.mode === 'lines') value = value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (target.dataset.key === 'correcta') value = Number(value) || 0;
    item[target.dataset.key] = value;
    scheduleHistory();
    const card = $('canvas').querySelector(`[data-index="${state.selected}"]`);
    if (card) card.querySelector('.block-copy small').textContent = `${blockName(block.tipo)} · ${blockSummary(block)}`;
    saveDraft();
  }

  function changeCollection(collection, index) {
    const block = state.blocks[state.selected];
    if (!block || !Array.isArray(block[collection])) return;
    recordHistory();
    if (index === null) {
      const newRow = { preguntas: { pregunta: '', opciones: ['', '', ''], correcta: 0 }, pares: { izq: '', der: '' }, frases: { texto: '', respuesta: '' } }[collection];
      block[collection].push(newRow);
    } else block[collection].splice(index, 1);
    paintCanvas();
    recordHistory();
  }

  function duplicateBlock(index) {
    const block = state.blocks[index];
    if (!block) return;
    recordHistory();
    state.blocks.splice(index + 1, 0, structuredClone(block));
    state.selected = index + 1;
    paintCanvas();
    recordHistory();
  }

  function moveBlock(index, offset) {
    const target = index + offset;
    if (target < 0 || target >= state.blocks.length) return;
    recordHistory();
    [state.blocks[index], state.blocks[target]] = [state.blocks[target], state.blocks[index]];
    state.selected = target;
    paintCanvas();
    recordHistory();
  }

  function showGate(title, message) {
    $('access-title').textContent = title;
    $('access-message').textContent = message;
    $('access-gate').hidden = false;
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
        showGate(
          pendiente ? 'Tu solicitud está pendiente de revisión' : 'Tu cuenta aún no tiene permisos de creación',
          'El Studio se habilitará cuando Placeta Junior apruebe tu alta docente o active el centro y confirme tus permisos.'
        );
        return false;
      }
      if (centers.length) {
        state.identityKind = 'centro';
        state.center = centers[0];
      } else {
        state.identityKind = 'docente';
      }
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
    const root = $('identity');
    const authorName = state.identityKind === 'centro' ? state.center?.nombre : (state.authorName || email || 'Docente');
    const choices = [
      ...(state.docenteAprobado ? [`<option value="docente" ${state.identityKind === 'docente' ? 'selected' : ''}>Docente · ${esc(state.authorName || email || 'cuenta Google')}</option>`] : []),
      ...state.centers.map((center) => `<option value="centro:${esc(center.id)}" ${state.identityKind === 'centro' && state.center?.id === center.id ? 'selected' : ''}>Centro · ${esc(center.nombre)}</option>`)
    ];
    root.innerHTML = `<span class="status-dot"></span><span id="identity-status">Autoría: ${esc(authorName)}</span>${state.centers.length ? `<label class="identity-select-label" for="identity-select">Publicar como</label><select id="identity-select" aria-label="Publicar como">${choices.join('')}</select>` : ''}`;
    const managerSelect = $('managed-center');
    if (managerSelect && [...managerSelect.options].some((option) => option.value === draftScope())) managerSelect.value = draftScope();
  }

  function countItems() {
    return state.blocks.reduce((total, block) => total + ({
      test: (block.preguntas || []).length,
      relacionar: (block.pares || []).filter((pair) => pair.izq && pair.der).length,
      completar: (block.frases || []).filter((phrase) => phrase.texto && phrase.respuesta).length,
      ordenar: (block.items || []).filter(Boolean).length,
      sopa_letras: (block.palabras || []).filter(Boolean).length,
      reloj: ((block.datos || {}).ejercicios || []).length,
      recta_numerica: ((block.datos || {}).valores || []).length,
      grafico: ((block.datos || {}).datos || []).length,
      balanza: ((block.datos || {}).ejercicios || []).length,
      ahorcado: ((block.datos || {}).palabras || []).length,
      anagrama: ((block.datos || {}).palabras || []).length,
      patrones: ((block.datos || {}).secuencias || []).length,
      simetria: ((block.datos || {}).ejercicios || []).length,
      silabas: ((block.datos || {}).palabras || []).length,
      vf_rapido: ((block.datos || {}).afirmaciones || []).length,
      ruleta_preguntas: ((block.datos || {}).preguntas || []).length
    }[block.tipo] || 0), 0);
  }

  async function submit() {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token || !state.identity) { notice('Inicia sesión con Google antes de enviar a revisión.', 'error'); return; }
    if (!state.title.trim() || state.title.trim().length < 3 || !state.description.trim() || state.description.trim().length < 10) {
      notice('Completa un título (mínimo 3 caracteres) y una descripción (mínimo 10).', 'error');
      $('meta-title').focus();
      return;
    }
    if (!state.blocks.length || !countItems()) { notice('Añade bloques con contenido antes de enviar.', 'error'); return; }
    const authorName = state.identityKind === 'centro' ? state.center?.nombre : state.authorName;
    if (!authorName) { notice('No se encontró el nombre de autoría de esta cuenta.', 'error'); return; }
    const button = $('submit-activity');
    button.disabled = true;
    notice('Enviando a revisión editorial…', '');
    const body = {
      tipoAutor: state.identityKind,
      orgId: state.identityKind === 'centro' ? state.center?.id : null,
      titulo: state.title.trim(), descripcion: state.description.trim(), categoria: state.category,
      edad_recomendada: state.age, dificultad: state.difficulty, tiempo_estimado: 10,
      num_preguntas: countItems(),
      contenido: { version: 2, bloques: state.blocks }
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
      notice(`Actividad enviada a revisión editorial como ${authorName}. ${data.mensaje || ''}`.trim(), 'success');
      removeCurrentDraft();
      state.title = '';
      state.description = '';
      state.category = 'General';
      state.age = '6-12';
      state.difficulty = 'media';
      state.blocks = [];
      state.selected = -1;
      paintCanvas();
      resetHistory();
      showStudioView('activities');
    } catch (error) { notice(error.message || 'No se pudo enviar la actividad.', 'error'); }
    finally { button.disabled = false; }
  }

  function initialize() {
    loadIdentity().then((authorized) => {
      if (!authorized) return;
    loadDrafts();
    setupManagedCenters();
    const latestDraft = state.drafts.filter((draft) => draft.scope === draftScope()).sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))[0];
    restoreDraft(latestDraft);
    paintTemplates('');
    paintPalette();
    paintCanvas();
    recordHistory();
    renderSavedActivities();
    document.querySelectorAll('[data-studio-view]').forEach((button) => button.addEventListener('click', () => showStudioView(button.dataset.studioView)));
    $('studio-menu').addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      const tabs = [...document.querySelectorAll('[data-studio-view]')];
      const current = tabs.indexOf(event.target.closest('[data-studio-view]'));
      if (current < 0) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0
        : event.key === 'End' ? tabs.length - 1
          : (current + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      showStudioView(tabs[next].dataset.studioView);
      tabs[next].focus();
    });
    $('managed-center').addEventListener('change', (event) => setAuthorScope(event.target.value));
    $('identity').addEventListener('change', (event) => {
      if (event.target.id === 'identity-select') setAuthorScope(event.target.value);
    });
    $('new-activity').addEventListener('click', startNewActivity);
    $('saved-activities').addEventListener('click', (event) => {
      const open = event.target.closest('[data-open-draft]');
      const remove = event.target.closest('[data-delete-draft]');
      if (open) openSavedDraft(open.dataset.openDraft);
      if (remove) deleteSavedDraft(remove.dataset.deleteDraft);
      if (event.target.closest('[data-create-first]')) startNewActivity();
    });
    $('continue-to-edit').addEventListener('click', () => showStudioView('edit'));
    $('templates').addEventListener('click', (event) => { const button = event.target.closest('[data-template]'); if (button) useTemplate(button.dataset.template); });
    $('blank-template').addEventListener('click', () => { recordHistory(); state.blocks = []; state.selected = -1; state.title = ''; state.description = ''; paintTemplates(''); paintCanvas(); recordHistory(); });
    $('undo-action').addEventListener('click', () => { recordHistory(); if (historyIndex > 0) restoreHistory(historyIndex - 1); });
    $('redo-action').addEventListener('click', () => { recordHistory(); if (historyIndex < history.length - 1) restoreHistory(historyIndex + 1); });
    $('palette').addEventListener('click', (event) => { const button = event.target.closest('[data-type]'); if (button) addBlock(button.dataset.type); });
    $('palette').addEventListener('dragstart', (event) => { const button = event.target.closest('[data-type]'); if (button) event.dataTransfer.setData('text/pj-block-type', button.dataset.type); });
    $('canvas').addEventListener('dragover', (event) => { event.preventDefault(); });
    $('canvas').addEventListener('drop', (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('text/pj-block-type');
      const card = event.target.closest('[data-index]');
      const target = card ? Number(card.dataset.index) : state.blocks.length;
      if (type) addBlock(type, target);
      else {
        const from = Number(event.dataTransfer.getData('text/pj-block-index'));
        if (Number.isInteger(from) && from >= 0 && from < state.blocks.length && from !== target) {
          recordHistory();
          const [item] = state.blocks.splice(from, 1);
          state.blocks.splice(Math.min(target, state.blocks.length), 0, item);
          state.selected = Math.min(target, state.blocks.length - 1);
          paintCanvas();
          recordHistory();
        }
      }
    });
    $('canvas').addEventListener('dragstart', (event) => { const card = event.target.closest('[data-index]'); if (card && !event.target.closest('.block-actions')) event.dataTransfer.setData('text/pj-block-index', card.dataset.index); });
    $('canvas').addEventListener('click', (event) => {
      const duplicate = event.target.closest('[data-duplicate]');
      if (duplicate) { duplicateBlock(Number(duplicate.dataset.duplicate)); return; }
      const move = event.target.closest('[data-move]');
      if (move) { moveBlock(Number(move.dataset.index), Number(move.dataset.move)); return; }
      const remove = event.target.closest('[data-remove]');
      if (remove) { recordHistory(); state.blocks.splice(Number(remove.dataset.remove), 1); state.selected = state.blocks.length ? Math.min(Number(remove.dataset.remove), state.blocks.length - 1) : -1; paintCanvas(); recordHistory(); return; }
      const select = event.target.closest('.block-select');
      const card = select?.closest('[data-index]');
      if (card) { state.selected = Number(card.dataset.index); paintCanvas(); }
    });
    const previewDialog = $('preview-dialog');
    const previewFrame = $('preview-frame');
    function closePreview() {
      previewFrame.src = 'about:blank';
      sessionStorage.removeItem('pj-preview-activity');
    }
    $('preview-activity').addEventListener('click', () => {
      if (!state.blocks.length) { notice('Añade un bloque o elige una plantilla para previsualizar.', 'error'); return; }
      const activity = { id: 'preview-' + Date.now(), _preview: true, titulo: state.title || 'Mi actividad', descripcion: state.description || '', categoria: state.category, edad_recomendada: state.age, dificultad: state.difficulty, contenido: { version: 2, bloques: state.blocks } };
      sessionStorage.setItem('pj-preview-activity', JSON.stringify(activity));
      previewFrame.src = `/preview.html?embed=1&start=0&t=${Date.now()}`;
      if (!previewDialog.open) previewDialog.showModal();
    });
    $('close-preview').addEventListener('click', () => previewDialog.close());
    previewDialog.addEventListener('close', closePreview);
    $('inspector-content').addEventListener('input', (event) => { if (event.target.dataset.key && !event.target.dataset.collection) updateField(event.target); });
    $('inspector-content').addEventListener('input', (event) => { if (event.target.dataset.collection) updateCollectionField(event.target); });
    $('inspector-content').addEventListener('input', (event) => { if (event.target.dataset.primaryData) updatePrimaryField(event.target); });
    $('inspector-content').addEventListener('change', (event) => { if (event.target.dataset.primaryData) updatePrimaryField(event.target); });
    $('inspector-content').addEventListener('click', (event) => {
      const add = event.target.closest('[data-add-row]');
      const remove = event.target.closest('[data-delete-row]');
      if (add) changeCollection(add.dataset.addRow, null);
      if (remove) changeCollection(remove.dataset.deleteRow, Number(remove.dataset.index));
    });
    ['title', 'description', 'category', 'age', 'difficulty'].forEach((key) => {
      const input = $(`meta-${key}`);
      input.addEventListener('input', () => {
        const stateKey = { title: 'title', description: 'description', category: 'category', age: 'age', difficulty: 'difficulty' }[key];
        state[stateKey] = input.value;
        scheduleHistory();
        $('activity-title').textContent = state.title || 'Actividad sin título';
        $('draft-title').textContent = state.title || 'Actividad nueva';
        saveDraft();
        saveDraft();
      });
    });
    $('clear-draft').addEventListener('click', () => { if (!window.confirm('¿Vaciar el lienzo actual?')) return; recordHistory(); state.blocks = []; state.selected = -1; paintCanvas(); recordHistory(); });
    $('submit-activity').addEventListener('click', submit);
      $('access-gate').hidden = true;
      $('creator-tools').hidden = false;
    });
  }

  initialize();
})();