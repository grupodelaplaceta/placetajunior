# Evento de Halloween · Placeta Junior

Evento temporal, aislado del resto de Junior. Todo lo exclusivo está en esta carpeta
(`public/halloween/`) más 5 enganches mínimos y protegidos.

## Catálogo: Infantil y Primaria son juegos separados
- **Infantil** (`#/halloween/infantil`, acceso desde Juegos de Infantil): 6 juegos propios, 2 niveles cada uno, sin vidas (no se puede perder).
- **Primaria** (`#/halloween`, banner de la portada): 10 juegos, 4 niveles cada uno, con vidas.
- Cada uno tiene su propio progreso y precio (`config.js` → `ages` y `games`). Comparten la mecánica, no el contenido.
- Estilo gráfico: ilustraciones SVG con contorno y colores planos; **sin degradados** (ni en SVG ni en CSS).

## Archivos exclusivos
| Archivo | Para qué |
|---|---|
| `config.js` | **Configuración central**: interruptor y fechas, clave de `localStorage`, música, niveles, vidas, recompensas, precios de juegos, cestas y fantasmas. |
| `art.js` | Ilustraciones SVG (calabaza, fantasma, caramelos, cestas…). |
| `core.js` | Activación, guardado local validado, textos es/ca/en, sonidos y música aleatoria. |
| `page.js` | Banner, acceso de Infantil, página `#/halloween`, ventanas de desbloqueo, carcasa de partida y enrutado. |
| `halloween.css` | Estilos (todas las clases empiezan por `hw`). |
| `games/base.js` | Generadores de retos por nivel y componentes comunes. |
| `games/quiz.js` | Truco o trato matemático · La calabaza correcta · Carrera de escobas. |
| `games/arcade.js` | Atrapa los caramelos · Memoria monstruosa · El laberinto embrujado. |
| `games/puzzles.js` | La fábrica de caramelos · El fantasma escondido · Parejas encantadas · El laboratorio de pociones. |
| `musica/` | Canciones, `lista.json`, `actualizar-lista.js` y `LEEME.txt`. |

Los juegos se cargan solo al abrir uno. No son actividades del catálogo ni usan sus componentes.

## Puntos de acceso (los únicos cambios fuera de esta carpeta)
1. `public/index.html`, bloque `<!-- HALLOWEEN:start … HALLOWEEN:end -->`: 4 etiquetas `<script>`.
2. `public/index.html`, función `home()`: `(window.PJHalloween?PJHalloween.banner(li):'')` → banner de la portada.
3. `public/index.html`, función `jocs()`: `(window.PJHalloween?PJHalloween.infantil(li):'')` → acceso en Juegos de Infantil.
4. `public/index.html`, función `route()`: una línea `else if(p[0]==='halloween'&&window.PJHalloween){…}` → ruta `#/halloween`.
5. `public/index.html`, función `musica()`: `if(window.PJHalloween&&PJHalloween.sync())return;` → evita la música de menú dentro del evento.
6. `vercel.json`: una regla `/halloween` → `/#/halloween`.

Todos los enganches comprueban `window.PJHalloween`: si el evento no está, no hacen nada.

## Música
Copia las canciones a `musica/` y ejecuta `node public/halloween/musica/actualizar-lista.js`.
Al entrar a la página y a cada minijuego suena una al azar (y otra al azar al terminar cada una).
Respeta el botón de sonido de Junior; sin canciones, el evento funciona en silencio.

## Guardado
Clave propia `pj-halloween-v1`: saldo, juegos y niveles (estrellas), cestas y fantasmas.
Datos validados al leer. Cada partida reparte caramelos una sola vez. No se toca ninguna otra clave.
La página avisa de que el progreso se pierde si se borran los datos del navegador.

## Fechas y vista previa
`activeFrom` / `activeUntil` en `config.js` (1 oct – 8 nov 2026). Fuera de fechas el evento no aparece.
`?halloween=preview` en la URL lo muestra igualmente.

## Retirada al terminar
- **Desactivar**: `enabled: false` en `config.js` (o dejar que pasen las fechas).
- **Eliminar**: borrar la carpeta `public/halloween/`, el bloque `HALLOWEEN` de `index.html` y la regla de `vercel.json`.
  Los 4 enganches restantes pueden quedarse (no hacen nada sin el evento) o quitarse.
- No hay que borrar `localStorage`: la clave `pj-halloween-v1` es independiente y inofensiva.

Verificado: con la carpeta bloqueada y con `enabled:false`, la portada, Juegos de Infantil y la plataforma funcionan sin errores.

## Pruebas
Con `?hwtest=1` los juegos marcan la respuesta correcta en el DOM (`data-ok`) para pruebas automáticas. No afecta a los usuarios normales.
