(function () {
  'use strict';

  const STORAGE_KEY = 'pj-visitas-juego';
  const apiBase = (window.PJ_API_BASE || (location.hostname === 'junior.laplaceta.org'
    ? '/api/junior'
    : 'https://rsp.laplaceta.org/api/junior')).replace(/\/$/, '');

  function readVisits() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
    } catch (error) {
      return {};
    }
  }

  function count(id) {
    const value = Number(readVisits()[String(id)] || 0);
    return Number.isSafeInteger(value) && value > 0 ? value : 0;
  }

  async function synchronize(id, name) {
    const payload = {
      id: `juego-${id}`,
      juego_id: Number(id),
      tipo: 'juego',
      nombre: String(name || '').slice(0, 160),
      ts: Date.now(),
      origen: 'web'
    };
    const endpoints = ['/visitas/juego', '/juegos/visita', '/visitas/actividad', '/visitas'];
    for (const route of endpoints) {
      try {
        const response = await fetch(`${apiBase}${route}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(payload)
        });
        if (response.ok) return;
        if (response.status === 404 || response.status === 405) continue;
        return;
      } catch (error) {
        // El contador local sigue disponible cuando el endpoint no responde.
      }
    }
  }

  function register(id, name) {
    const key = String(id ?? '');
    if (!/^\d+$/.test(key)) return 0;
    const visits = readVisits();
    visits[key] = Math.max(0, Number(visits[key]) || 0) + 1;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(visits)); } catch (error) { /* almacenamiento opcional */ }
    document.querySelectorAll(`[data-game-visits="${key}"]`).forEach((node) => {
      node.textContent = visits[key].toLocaleString();
    });
    synchronize(key, name);
    return visits[key];
  }

  window.PJGameVisits = { count, register };
})();