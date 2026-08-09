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
    // Copias locales para no depender del CDN: clave para que el mapamundi
    // salga SIEMPRE en el PDF y en el juego aunque falle la red/CDN.
    leafletCssLocal: 'css/leaflet.css',
    leafletCss: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    leafletJsLocal: 'js/leaflet.js',
    leafletJs: 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    topojsonLocal: 'js/topojson-client.min.js',
    topojson: 'https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js',
    mundoLocal: 'data/countries-110m.json',
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

  // Carga el GeoJSON de los países (una sola vez): archivo LOCAL primero, CDN como respaldo
  cargarGeo: function () {
    var self = this;
    if (this._geo) return Promise.resolve(this._geo);
    return fetch(this.cdn.mundoLocal)
      .then(function (r) { if (!r.ok) throw new Error('local'); return r.json(); })
      .catch(function () { return fetch(self.cdn.mundo).then(function (r) { return r.json(); }); })
      .then(function (topo) {
        if (!window.topojson) throw new Error('topojson no cargado');
        self._geo = window.topojson.feature(topo, topo.objects.countries);
        return self._geo;
      });
  },

  // Carga bajo demanda Leaflet + topojson-client (devuelve una promesa).
  // Todo se carga desde copia LOCAL (siempre disponible) con CDN de respaldo,
  // para que el mapa funcione (PDF y juego) aunque falle la red/CDN.
  cargarTodo: function () {
    function loadScript(src, fb) {
      return new Promise(function (res) {
        var s = document.createElement('script');
        s.src = src;
        s.onload = res;
        s.onerror = function () {
          if (fb) {
            var s2 = document.createElement('script');
            s2.src = fb; s2.onload = res; s2.onerror = res;
            document.head.appendChild(s2);
          } else { res(); }
        };
        document.head.appendChild(s);
      });
    }
    var p = [];
    if (!window.L) p.push(loadScript(this.cdn.leafletJsLocal, this.cdn.leafletJs));
    if (!window.topojson) p.push(loadScript(this.cdn.topojsonLocal, this.cdn.topojson));
    if (!document.querySelector('link[data-pj-leaflet]')) {
      var l = document.createElement('link');
      l.rel = 'stylesheet'; l.href = this.cdn.leafletCssLocal; l.setAttribute('data-pj-leaflet', '1');
      document.head.appendChild(l);
    }
    return Promise.all(p);
  }
};

