/* ═══════════════════════════════════════════════════════════════════
   PLACETA JUNIOR — Mapamundi interactivo (bloque mapa_mundi)
   Usa Leaflet (librería de mapas libre y sin claves) + los polígonos
   reales de los países de world-atlas (GeoJSON/TopoJSON de dominio
   público). Cada país es una forma clicable: sin cálculos manuales.
   Leaflet y los datos se cargan bajo demanda (solo cuando hay un
   bloque de mapamundi en pantalla).
   ═══════════════════════════════════════════════════════════════════ */
window.MAPA_MUNDI = {
  cdn: {
    leafletCss: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    leafletJs: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    topojson: 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js',
    mundo: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
  },
  // País en español → nombre en world-atlas (properties.name)
  paises: {
    'España': 'Spain', 'Portugal': 'Portugal', 'Francia': 'France', 'Italia': 'Italy',
    'Alemania': 'Germany', 'Reino Unido': 'United Kingdom', 'Irlanda': 'Ireland',
    'Países Bajos': 'Netherlands', 'Bélgica': 'Belgium', 'Suiza': 'Switzerland',
    'Austria': 'Austria', 'Suecia': 'Sweden', 'Noruega': 'Norway', 'Dinamarca': 'Denmark',
    'Polonia': 'Poland', 'Grecia': 'Greece', 'Ucrania': 'Ukraine', 'Rumanía': 'Romania',
    'Finlandia': 'Finland', 'Islandia': 'Iceland', 'Rusia': 'Russia', 'Turquía': 'Turkey',
    'Egipto': 'Egypt', 'Marruecos': 'Morocco', 'Argelia': 'Algeria', 'Túnez': 'Tunisia',
    'Libia': 'Libya', 'Nigeria': 'Nigeria', 'Sudáfrica': 'South Africa', 'Kenia': 'Kenya',
    'Etiopía': 'Ethiopia', 'Senegal': 'Senegal', 'Ghana': 'Ghana', 'Tanzania': 'Tanzania',
    'Madagascar': 'Madagascar',
    'Estados Unidos': 'United States of America', 'Canadá': 'Canada', 'México': 'Mexico',
    'Brasil': 'Brazil', 'Argentina': 'Argentina', 'Chile': 'Chile', 'Perú': 'Peru',
    'Colombia': 'Colombia', 'Venezuela': 'Venezuela', 'Bolivia': 'Bolivia',
    'Paraguay': 'Paraguay', 'Uruguay': 'Uruguay', 'Ecuador': 'Ecuador', 'Cuba': 'Cuba',
    'Guatemala': 'Guatemala',
    'China': 'China', 'India': 'India', 'Japón': 'Japan', 'Corea del Sur': 'South Korea',
    'Indonesia': 'Indonesia', 'Tailandia': 'Thailand', 'Vietnam': 'Vietnam',
    'Filipinas': 'Philippines', 'Pakistán': 'Pakistan', 'Irán': 'Iran', 'Irak': 'Iraq',
    'Arabia Saudita': 'Saudi Arabia', 'Israel': 'Israel', 'Mongolia': 'Mongolia',
    'Kazajistán': 'Kazakhstan', 'Nepal': 'Nepal',
    'Australia': 'Australia', 'Nueva Zelanda': 'New Zealand'
  },

  _geo: null,
  _rev: null,

  // Nombre en español → nombre en world-atlas
  enDe: function (es) { return this.paises[es] || es; },
  // Nombre en world-atlas → nombre en español (para mostrar)
  esDe: function (en) {
    if (!this._rev) {
      this._rev = {};
      for (var k in this.paises) this._rev[this.paises[k]] = k;
    }
    return this._rev[en] || en;
  },

  // Carga el GeoJSON de los países (una sola vez)
  cargarGeo: function () {
    var self = this;
    if (this._geo) return Promise.resolve(this._geo);
    return fetch(this.cdn.mundo)
      .then(function (r) { return r.json(); })
      .then(function (topo) {
        self._geo = window.topojson.feature(topo, topo.objects.countries);
        return self._geo;
      });
  },

  // Carga bajo demanda Leaflet + topojson-client (devuelve una promesa)
  cargarTodo: function () {
    function loadScript(src) {
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = src; s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    var p = [];
    if (!window.L) p.push(loadScript(this.cdn.leafletJs));
    if (!window.topojson) p.push(loadScript(this.cdn.topojson));
    if (!document.querySelector('link[data-pj-leaflet]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = this.cdn.leafletCss; l.setAttribute('data-pj-leaflet', '1');
      document.head.appendChild(l);
    }
    return Promise.all(p);
  }
};

