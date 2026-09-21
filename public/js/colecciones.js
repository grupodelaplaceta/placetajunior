(function () {
  'use strict';

  const page = document.querySelector('[data-collection]');
  if (!page) return;
  const stage = page.dataset.collection;
  const ranges = {
    infantil: { min: 3, max: 5 },
    primaria: { min: 6, max: 12 },
    secundaria: { min: 12, max: 99 }
  };
  const ageOptions = {
    infantil: [{ value: 'peques', label: '3-4 años' }, { value: 'mayores', label: '5 años' }],
    primaria: [{ value: 'peques', label: '6-8 años' }, { value: 'mayores', label: '9-12 años' }],
    secundaria: [{ value: 'peques', label: '12-14 años' }, { value: 'mayores', label: '15+ años' }]
  };
  const range = ranges[stage] || ranges.primaria;
  const stageAgeOptions = ageOptions[stage] || ageOptions.primaria;
  const ageMatches = (age, filter) => {
    if (filter === 'todas') return true;
    if (stage === 'infantil') return filter === 'peques' ? age <= 4 : age >= 5;
    if (stage === 'secundaria') return filter === 'peques' ? age >= 12 && age <= 14 : age >= 15;
    return filter === 'peques' ? age >= 6 && age <= 8 : age >= 9 && age <= 12;
  };
  const API_BASE = window.location.hostname === 'junior.laplaceta.org' ? 'https://rsp.laplaceta.org/api/junior' : '/api/junior';
  const state = { activities: [], subject: 'Todas', age: 'todas' };
  const grid = document.getElementById('collection-grid');
  const status = document.getElementById('collection-status');
  const count = document.getElementById('collection-count');
  const subjectFilters = document.getElementById('subject-filters');
  const ageFilters = document.getElementById('age-filters');

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const colorFor = (category) => {
    const value = String(category || '').toLowerCase();
    if (value.includes('mate')) return 'blue';
    if (value.includes('cien')) return 'green';
    if (value.includes('geo')) return 'orange';
    if (value.includes('leng')) return 'red';
    return 'purple';
  };
  const minAge = (activity) => {
    const match = String(activity.edad_recomendada || '').match(/\d+/);
    return match ? Number(match[0]) : null;
  };
  const inStage = (activity) => {
    const age = minAge(activity);
    return age !== null && age >= range.min && age <= range.max;
  };
  const subjectList = () => [...new Set(state.activities.map((activity) => activity.categoria).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'));
  const renderFilter = (root, values, selected, onSelect, allLabel) => {
    root.innerHTML = [allLabel, ...values].map((value) => `<button class="collection-filter${value === selected ? ' is-active' : ''}" type="button" data-value="${escapeHtml(value)}">${escapeHtml(value)}</button>`).join('');
    root.querySelectorAll('button').forEach((button) => button.addEventListener('click', () => onSelect(button.dataset.value)));
  };
  const render = () => {
    const activities = state.activities.filter((activity) => {
      const matchesSubject = state.subject === 'Todas' || activity.categoria === state.subject;
      const age = minAge(activity);
      const matchesAge = age !== null && ageMatches(age, state.age);
      return matchesSubject && matchesAge;
    });
    count.textContent = `${activities.length} ${activities.length === 1 ? 'actividad disponible' : 'actividades disponibles'}`;
    if (!activities.length) {
      grid.innerHTML = '<p class="collection-status">No hay actividades con estos filtros todavía. Prueba otra combinación.</p>';
      return;
    }
    grid.innerHTML = activities.map((activity) => `<a class="collection-card" data-color="${colorFor(activity.categoria)}" href="/?id=${encodeURIComponent(activity.id)}" aria-label="Ver ${escapeHtml(activity.titulo)}">
      <span class="collection-chip">${escapeHtml(activity.categoria || 'General')}</span>
      <h3>${escapeHtml(activity.titulo || 'Actividad educativa')}</h3>
      <p>${escapeHtml(activity.descripcion || 'Aprende jugando con Placeta Junior.')}</p>
      <div class="collection-card-meta"><span>${escapeHtml(activity.edad_recomendada || 'Edad recomendada')}</span><span>Ver actividad →</span></div>
    </a>`).join('');
  };
  const updateSubject = (value) => { state.subject = value; renderFilter(subjectFilters, subjectList(), value, updateSubject, 'Todas'); render(); };
  const renderAgeFilter = () => {
    renderFilter(ageFilters, stageAgeOptions.map((option) => option.value), state.age, updateAge, 'todas');
    const allButton = ageFilters.querySelector('[data-value="todas"]');
    if (allButton) allButton.textContent = 'Todas las edades';
    ageFilters.querySelectorAll('[data-value]').forEach((button) => {
      const option = stageAgeOptions.find((item) => item.value === button.dataset.value);
      if (option) button.textContent = option.label;
    });
  };
  const updateAge = (value) => { state.age = value; renderAgeFilter(); render(); };

  async function load() {
    try {
      const response = await fetch(`${API_BASE}/actividades?solo_publicas=1`, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error('catalog');
      const data = await response.json();
      state.activities = (data.actividades || []).filter(inStage);
      renderFilter(subjectFilters, subjectList(), state.subject, updateSubject, 'Todas');
      renderAgeFilter();
      render();
      status.hidden = true;
    } catch (error) {
      status.hidden = false;
      status.textContent = 'No se pudieron cargar las actividades. Puedes volver a intentarlo en unos instantes.';
      grid.innerHTML = '';
    }
  }

  load();
})();
