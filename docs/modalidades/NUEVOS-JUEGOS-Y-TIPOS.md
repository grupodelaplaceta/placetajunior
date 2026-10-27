# Nuevos juegos de Infantil y nuevos tipos de Primaria

## 1. Infantil (3-5 años) — `public/js/infantil/`

Los juegos nuevos viven en módulos propios y se registran en el motor de `index.html` mediante `window.PJINF`
(cada módulo es `function (api) {…}`; `api` expone los helpers del motor: `add`, `tr`, `D`, `S`, `sp`, `cv`, `dg`, `win`, `conf`, `sfx`, `tone`, `say`, `hintPath`, `env()` …).
Añadir un juego = una llamada a `add(categoria, 'Nom en català', 'sprite', e => {…}, fondoCSS, gesto)` y otra a `tr(...)` con las traducciones ES/EN y las instrucciones.

| Módulo | Categoría | Juegos |
|---|---|---|
| `trazos.js` | 8 · Traza y escribe | Segueix el camí · Ones i zigzags · Traça les vocals · Traça l'abecedari · Traça els números · Traça les minúscules · Uneix els punts · Laberint |
| `agarrar.js` | 9 · Agarra y desliza | Talla la fruita · Pesca peixos · Escombra les fulles · Ovelles al corral · Dóna menjar · Ombres · Ordena per mida · Ordena els números · Uneix amb una línia · Puzle lliscant · Completa el tren |
| `pensar.js` | 5 · Piensa y juega | Quina lletra comença? · El número que falta · Més o menys · Escolta i toca · Quin és diferent? |
| `pensar.js` | 6 · Más diversión | Munta el robot · Cuina la pizza |
| `sprites.js` | — | 14 sprites nuevos (fruta, comida, oveja, ratón, pato, robot, lápiz…) |

**Motor de trazado** (`trazos.js › tracer`): cada trazo debe empezar en su punto y seguirse **en orden y dirección** (como en grafomotricidad real),
con tolerancia que se estrecha y guía que se desvanece en las pasadas siguientes. La tipografía de trazos (`F`) cubre A-Z, 0-9 y las minúsculas más comunes; para añadir un carácter basta definir sus polilíneas en una caja 60×100.

**Pista animada** nueva (`gesto = 'trace'`): la manita recorre el trazo actual cuando el niño se para.

### Miniaturas
`public/img/juegos/*.webp` (480×270, capturas reales de cada juego) + `public/js/juegos-miniaturas.js` (`window.PJ_GIMG`, clave = nombre catalán; `col` y `puz` para los grupos).
Para regenerarlas tras cambiar un juego: `python3 tools/generar-miniaturas.py "Nom del joc"` (o sin argumentos para todas).

## 2. Primaria (6-12 años) — `public/js/primaria-juegos.js`

Once tipos de bloque nuevos, 100 % declarativos (JSON dentro de `datos`, también aceptados en el nivel superior del bloque). Cada reto es una pantalla con su estado en `kpEstado`, suma `kpScore.verdes/rojos` y usa el mismo `mostrarFeedback` que el test. Si faltan datos hay un ejemplo por defecto (nunca se rompe la actividad).

| `tipo` | Qué trabaja | `datos` |
|---|---|---|
| `reloj` | Hora analógica | `modo:"poner"\|"leer"`, `ejercicios:[{hora:"HH:MM", modo?}]` |
| `recta_numerica` | Ubicar números | `min`, `max`, `paso`, `valores:[…]` |
| `grafico` | Lectura de datos | `datos:[{etiqueta,valor,color?}]`, `tipo_grafico:"barras"\|"pictograma"`, `preguntas?:[{pregunta,opciones,correcta}]` (si faltan, se generan) |
| `balanza` | Igualdad / álgebra | `ejercicios:[{izq:[…], der:[…], pesas:[…], ecuacion?}]` |
| `ahorcado` | Vocabulario, ortografía | `intentos`, `palabras:[{palabra,pista}]` |
| `anagrama` | Ortografía | `palabras:[{palabra,pista}]` |
| `patrones` | Series y lógica | `secuencias:[{serie:[… "?" …], opciones, correcta}]` |
| `simetria` | Geometría | `ejercicios:[{ancho(2-6), alto(2-9), celdas:[[x,y]]}]` (mitad izquierda) |
| `silabas` | Lengua | `palabras:[{palabra, silabas:[…]}]` |
| `vf_rapido` | Cualquier materia | `segundos`, `afirmaciones:[{texto, verdadero, explicacion?}]` |
| `ruleta_preguntas` | Cualquier materia | `preguntas:[{categoria, pregunta, opciones, correcta}]` |

Integración:
- **Reproductor** (`player.js`): rama en `abrirJuego`, `renderPantalla`, etiqueta y texto accesible. Script cargado en `jugar.html` y `preview.html`.
- **DevAI** (`devai.html`): ejemplos y reglas en el prompt + sección «Retos de Primaria» con plantillas que abren el reproductor real.
- **Studio** (`studio.js`/`studio.html`): botones de paleta, datos por defecto (`PRIM_DEFAULTS`) y editor JSON con la ayuda de cada formato (`PRIM_AYUDA`).
- **PDF/fichas** (`app.js › fichaPrimariaPdf`): versión imprimible de cada tipo.
- **Modalidades** (`modalidades.js`): añadidos a la lista de la etapa `primaria`.

Para añadir un tipo nuevo: nombre en `TIPOS` + creador en `crear()` + función `r<Tipo>` en `RND` + (opcional) `INI` para eventos + handler en `window.PJP`; después, `PRIM_DEFAULTS`/`PRIM_AYUDA` (Studio), ejemplo (DevAI) y rama en `fichaPrimariaPdf`.
