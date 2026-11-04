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
  },

  // ── España: comunidades autónomas y provincias ─────────────────────
  // Datos propios en /data/espana-*.json (GeoJSON). Cada forma lleva
  // properties { cod, name_es }: cod = código oficial (provincia 01..52,
  // comunidad 01..19). `nombres` son los nombres cortos de uso escolar.
  espana: {
    comunidades: {
      local: 'data/espana-comunidades.json',
      _geo: null,
      nombres: {
        '01': 'Andalucía', '02': 'Aragón', '03': 'Asturias', '04': 'Illes Balears',
        '05': 'Canarias', '06': 'Cantabria', '07': 'Castilla y León',
        '08': 'Castilla-La Mancha', '09': 'Cataluña', '10': 'Comunitat Valenciana',
        '11': 'Extremadura', '12': 'Galicia', '13': 'Madrid', '14': 'Murcia',
        '15': 'Navarra', '16': 'País Vasco', '17': 'La Rioja', '18': 'Ceuta', '19': 'Melilla'
      }
    },
    provincias: {
      local: 'data/espana-provincias.json',
      _geo: null,
      nombres: {
        '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería',
        '05': 'Ávila', '06': 'Badajoz', '07': 'Illes Balears', '08': 'Barcelona',
        '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '12': 'Castellón',
        '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña', '16': 'Cuenca',
        '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Gipuzkoa',
        '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León', '25': 'Lleida',
        '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid', '29': 'Málaga', '30': 'Murcia',
        '31': 'Navarra', '32': 'Ourense', '33': 'Asturias', '34': 'Palencia',
        '35': 'Las Palmas', '36': 'Pontevedra', '37': 'Salamanca',
        '38': 'Santa Cruz de Tenerife', '39': 'Cantabria', '40': 'Segovia',
        '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona', '44': 'Teruel',
        '45': 'Toledo', '46': 'Valencia', '47': 'Valladolid', '48': 'Bizkaia',
        '49': 'Zamora', '50': 'Zaragoza', '51': 'Ceuta', '52': 'Melilla'
      }
    }
  },
  espanaCfg: function (modo) { return this.espana[modo] || this.espana.provincias; },
  // Carga el GeoJSON de España (comunidades o provincias), una sola vez.
  cargarEspana: function (modo) {
    var self = this, cfg = this.espanaCfg(modo);
    if (cfg._geo) return Promise.resolve(cfg._geo);
    return fetch(cfg.local)
      .then(function (r) { if (!r.ok) throw new Error('local'); return r.json(); })
      .then(function (fc) { cfg._geo = fc; return fc; });
  },
  // Código oficial desde un código o desde el nombre (sin acentos/guiones).
  codigoEspana: function (modo, valor) {
    var cfg = this.espanaCfg(modo), v = String(valor || '').trim();
    if (!v) return null;
    if (cfg.nombres[v]) return v;
    var n = v.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-\/]/g, ' ').replace(/\s+/g, ' ').trim();
    for (var cod in cfg.nombres) {
      var nm = String(cfg.nombres[cod]).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[-\/]/g, ' ').replace(/\s+/g, ' ').trim();
      if (nm === n) return cod;
    }
    return null;
  },
  // Nombre corto de un código (para mostrar), o el propio valor si no existe.
  nombreEspana: function (modo, cod) {
    var cfg = this.espanaCfg(modo);
    return (cod != null && cfg.nombres[String(cod)]) || String(cod || '');
  }
};

