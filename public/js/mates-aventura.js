const MATES_AVENTURA_JUEGOS = {
  mates_pixel: 'Pixel matemático',
  mates_balanza: 'La balanza',
  mates_arcade: 'Arcade de operaciones',
  mates_rio: 'Cruza el río',
  mates_monstruo: 'Monstruo numérico',
  mates_fracciones: 'Fracciones musicales',
  mates_estimacion: 'Estimación',
  mates_ninja: 'Ninja de fracciones',
  mates_robots: 'Robots matemáticos',
  mates_slime: 'Slime de capacidad',
  mates_templo: 'Templo de espejos',
  mates_topo: 'Topo en la cuadrícula'
};

function matesAventuraEscape(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function matesAventuraRender(block, index, state) {
  const title = block.titulo || MATES_AVENTURA_JUEGOS[block.tipo];
  if (!title) return '<p class="pj-error">Tipo de actividad de Mates Aventura no reconocido.</p>';
  if (state.completado) {
    return `<section class="pj-ma-card pj-ma-finished">
      <div class="pj-ma-heading"><span class="pj-ma-mark">★</span><div><h3>${matesAventuraEscape(title)}</h3><p>¡Actividad completada!</p></div></div>
      <button class="pj-btn-primary" onclick="pantallaNext()">Continuar</button>
    </section>`;
  }

  const config = matesAventuraEscape(JSON.stringify({
    tipo: block.tipo,
    titulo: title,
    datos: block.datos && typeof block.datos === 'object' ? block.datos : {}
  }));
  return `<section class="pj-ma-card pj-ma-native"><h2 class="pj-ma-native-title">${matesAventuraEscape(title)}</h2><pj-mates-aventura data-config="${config}"></pj-mates-aventura></section>`;
}

function matesAventuraCreateState() {
  return { completado: false };
}

document.addEventListener('pj-mates-complete', event => {
  if (!(event.target instanceof HTMLElement) || event.target.localName !== 'pj-mates-aventura') return;
  const screen = pantallas[pantallaIdx];
  const activity = screen?.tipo === 'mates_aventura' ? bloquesJuego[screen.bi] : null;
  const state = kpEstado[pantallaIdx];
  if (!activity || !state || state.completado || activity.tipo !== event.detail?.activityType) return;

  state.completado = true;
  kpScore.verdes++;
  renderPantalla();
});

window.MATES_AVENTURA = {
  tipos: Object.keys(MATES_AVENTURA_JUEGOS),
  juegos: MATES_AVENTURA_JUEGOS,
  render: matesAventuraRender,
  createState: matesAventuraCreateState,
  esTipo: tipo => Object.prototype.hasOwnProperty.call(MATES_AVENTURA_JUEGOS, tipo)
};
