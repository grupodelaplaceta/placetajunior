# Mapas — «Localiza» sin chivatos · Mundo · España (CCAA y provincias)

## 1. Problema corregido en la Web (ya aplicado)

- ❌ Se ponían **banderas con el nombre encima de cada país**: tapaban la
  geografía, se montaban unas sobre otras y **revelaban la respuesta**.
- ❌ Se mostraba una **lista corta de candidatos** ("chips") con 3-4 países:
  al niño le bastaba descartar, no localizar.
- ❌ Tooltips con el nombre del país al pasar el ratón (chivato).

✅ **Regla de oro:** *Si se pide «Haz clic en España», la interfaz no enseña
dónde está España.* El mapa sale limpio (continentes coloreados y clicables),
sin marcadores, sin chips y sin tooltips antes de responder. Los errores son
rojos (se dice cuál era la respuesta correcta) y no hay reintento infinito.

Cambios ya en `player.js`:

```js
function screenMapa(s, est) {
  // Sin lista de candidatos ni etiquetas: localizar no debe revelar la respuesta.
  return `<div class="kp-screen">
    <div class="kp-qt"><span class="material-symbols-rounded" aria-hidden="true">public</span> Localiza en el mapamundi · ${s.qi + 1} de ${s.n}</div>
    <div class="kp-map-q">${esc(s.pide)}</div>
    <div class="kp-map" id="kp-map-${pantallaIdx}"></div>
    <div class="kp-hint">👆 Toca en el mapa dónde está el lugar que te piden. Acerca con la rueda o con dos dedos para mirar mejor.</div>
  </div>`;
}
```

Se eliminaron: los chips de candidatos y el `bindTooltip` con el nombre.

---

## 2. Nueva capacidad: España por comunidades autónomas y provincias

Para no limitar a "4 países contados" y llevar la localización a casa, se
añade un mapa de **España** a dos escalas:

| Mapa | Áreas | Qué localiza el niño |
|------|-------|----------------------|
| `mundo` (actual) | ~177 países (world-atlas) | Países del mundo |
| `espana-comunidades` | 17 CCAA (+ ciudades autónomas) | Andalucía, Cataluña… |
| `espana-provincias` | 52 (50 provincias + Ceuta/Melilla) | Asturias, Toledo… |

### 2.1 Datos (nuevos ficheros en `/data`)

Formato **TopoJSON** (igual que `countries-110m.json`, se decodifica con
`topojson-client.min.js` ya incluido). Propiedades mínimas por geometría:

```jsonc
{
  "type": "Topology",
  "objects": {
    "espana": {
      "geometries": [
        {
          "type": "Polygon",
          "properties": {
            "name_es": "Asturias",
            "comunidad": "Principado de Asturias",
            "iso_3166_2": "ES-O"
          },
          "arcs": [ /* … */ ]
        }
      ]
    }
  }
}
```

- Ficheros: `public/data/espana-comunidades.json` y
  `public/data/espana-provincias.json`.
- **Origen recomendado:** derivar de datos abiertos del IGN / INSPIRE o de
  fuentes OSM/OpenData con atribución; el `.properties` debe normalizarse a
  nombres oficiales en español (con acentos) en `name_es`.

### 2.2 Bloque JSON (Studio/DevAI/App)

```jsonc
{
  "tipo": "mapa_espana",
  "titulo": "Provincias de España",
  "modo": "provincias",            // o "comunidades"
  "objetivos": ["Asturias", "Toledo", "Málaga"],
  "pide": "Haz clic en {objetivo}", // se rellena por pantalla
  "nivel": 1
}
```

Reglas:

- No hay lista de candidatos en pantalla (no-spoiler).
- Los objetivos pueden ser **muchos** (p. ej. todas las provincias); el motor
  genera una pregunta por objetivo en orden aleatorio.
- Zoom centrado en la Península + Canarias/Baleares accesibles.

### 2.3 Motor (Web)

- `mapa-mundi.js` pasa a un **cargador de conjuntos**: `MAPA_MUNDI.cargar('mundo'|'espana-comunidades'|'espana-provincias')`.
- `iniciarMapa` recibe el dataset de la pantalla:
  - `mundo` → vista `[20,0] zoom 2`.
  - `espana-*` → vista centrada en España `[39.5,-3.7] zoom 6`, con
    `maxBounds` sobre la Península + insets o con Canarias visibles a la
    izquierda (zoom ≤ 6) y Baleares accesibles.
- Colores por defecto suaves; al responder, verde (acierto) / rojo (fallo)
  con borde reforzado.
- Sin tooltips pre-respuesta (no chivato).

### 2.4 PDF

- **Web actual:** lámina "Localiza en el mapamundi" (mundo) ya existe.
- **España:** lámina imprimible con el contorno de España + lista de áreas
  para colorear/numerar ("Pinta Asturias de verde", "Escribe el nombre de la
  provincia señalada"), usando una proyección simplificada (fase posterior se
  puede trazar desde el mismo GeoJSON a `canvas`).

### 2.5 App

- La App reutiliza el mismo JSON (`mapa_espana`) y el mapa interactivo nativo;
  las pantallas de texto/resultado comparten lógica de verdes/rojos y Pz.

---

## 3. Referencia de áreas (para autoría y pruebas)

**Comunidades autónomas (17):** Andalucía, Aragón, Principado de Asturias,
Illes Balears, Canarias, Cantabria, Castilla y León, Castilla-La Mancha,
Cataluña, Comunitat Valenciana, Extremadura, Galicia, Comunidad de Madrid,
Región de Murcia, Comunidad Foral de Navarra, País Vasco, La Rioja.
(+ Ciudades autónomas: Ceuta, Melilla.)

**Provincias (50 + Ceuta/Melilla):** Álava, Albacete, Alicante, Almería,
Asturias, Ávila, Badajoz, Illes Balears, Barcelona, Bizkaia, Burgos,
Cáceres, Cádiz, Cantabria, Castellón, Ciudad Real, Córdoba, A Coruña,
Cuenca, Gipuzkoa, Girona, Granada, Guadalajara, Huelva, Huesca, Jaén,
León, Lleida, Lugo, Madrid, Málaga, Murcia, Navarra, Ourense, Palencia,
Las Palmas, Pontevedra, La Rioja, Salamanca, Santa Cruz de Tenerife,
Segovia, Sevilla, Soria, Tarragona, Teruel, Toledo, Valencia, Valladolid,
Zamora, Zaragoza, Ceuta, Melilla.
