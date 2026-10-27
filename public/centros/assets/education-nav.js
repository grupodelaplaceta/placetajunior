(() => {
  'use strict';

  const SESSION_KEY = 'pj27-sesion';
  const token = sessionStorage.getItem(SESSION_KEY);
  const registerLink = document.querySelector('[data-nav-register]');
  const addCenterLink = document.querySelector('[data-nav-add-center]');
  const signOutButton = document.querySelector('[data-nav-signout]');
  document.querySelectorAll('[data-requiere-sesion]').forEach((link) => { link.hidden = !token; });

  if (signOutButton && token) {
    signOutButton.hidden = false;
    if (!document.body.dataset.pagina) signOutButton.addEventListener('click', () => {
      sessionStorage.removeItem(SESSION_KEY);
      if (window.google?.accounts?.id) window.google.accounts.id.disableAutoSelect();
      location.href = '/centros';
    });
  }

  if (!token || !registerLink || !addCenterLink) return;
  registerLink.hidden = true;

  fetch('/api/centros/mi', {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    cache: 'no-store'
  }).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
    if (!Array.isArray(data.organizaciones)) throw new Error('Respuesta de centros no válida');
    if (data.organizaciones.length) {
      addCenterLink.hidden = false;
    } else {
      registerLink.hidden = false;
    }
  }).catch((error) => {
    registerLink.hidden = false;
    console.error('No se pudo actualizar la navegación de centros.', error);
  });
})();
