# Pase de interfaz: Placeta Junior Code, Education y Studio

## Qué cambia

**Placeta Junior Code** (`public/code/visual.css`, cargado en `jugar.html` y `preview.html`)
- Bloques de la paleta como piezas 3D de color, con pieza de encaje superior, icono en ficha y estados de pulsado, foco y deshabilitado.
- Bloques del programa como piezas apiladas, con franja lateral y contenedores (SI, BUCLE) diferenciados.
- Zona de soltar más clara y resaltada al arrastrar.
- Tablero con cuadrícula de fondo y esqueleto de carga mientras el motor dibuja el escenario.
- Botón «Ejecutar» destacado y botones de acción con mayor área táctil.
- Sin cortes: texto que envuelve, paleta a dos columnas en móvil.

**Placeta Junior Education** (`public/education/assets/pj-visual-2026.css`, cargado en todas las páginas de `/edu`)
- Portada con héroe más visual y tarjetas de acceso con color propio y animación de entrada.
- Iconos SVG en la portada en lugar de glifos Unicode, que se veían distintos según el dispositivo.
- Centros y administración con el mismo lenguaje visual.
- Sin cortes: nombres de centro, títulos de actividad, usuario y resumen del borrador envuelven en lugar de cortarse con «…». La navegación de la cabecera se parte en varias líneas en móvil, sin deslizar.

**Placeta Junior Studio**
- Banda de bienvenida, pestañas en botones de color, plantillas y paleta más visuales.

## Carga y rendimiento

- **Tipografías:** `edu-ui.css` cargaba Fredoka y Plus Jakarta desde Google con `@import`. La CSP de `/edu` (`style-src 'self'`, `font-src 'self'`) bloqueaba esa petición, así que la portada se veía con tipos del sistema. Ahora las fuentes están autoalojadas (`public/fonts/`) con los mismos nombres de familia.
- `studio.css` tenía un segundo `@import` redundante que bloqueaba el render; se elimina (Material Symbols ya lo carga `index.html`).
- Service worker: caché `placetajunior-assets-v24` y precarga de los dos CSS nuevos.

## Pruebas

- `npm test`: 112 de 113 pasan. El único fallo (`educacion.test.cjs`, «ventanas maximizadas…») ya existía antes de estos cambios y no es de interfaz.
- Se actualizaron las dos pruebas que fijaban la versión `v23` de la caché del service worker.

## Pendiente de comprobar en un navegador real

No se pudo renderizar en este entorno (sin navegador ni red). Antes de publicar, revisar en móvil (360 px y 390 px) y escritorio:
1. La portada `/edu`: fuentes locales, tarjetas y cabecera en varias líneas.
2. Un bloque de Code completo: arrastrar, girar, bucles y SI; el tablero y el botón Ejecutar.
3. Studio: pestañas, plantillas, lienzo y envío.
4. Que ningún título ni nombre de centro quede cortado.

Los estilos usan `color-mix()` con respaldo de color sólido. En navegadores muy antiguos los bloques siguen siendo visibles, pero sin el degradado.

## Fuera de alcance de este pase

- `public/js/player.js` (222 KB) y `public/education/studio/studio.js` (120 KB) siguen siendo monolíticos. Dividirlos o minificarlos reduciría la carga, pero exige pruebas de comportamiento.
- Material Symbols sigue viniendo de Google en Code y Studio.
- `code.html` en la raíz es un prototipo y no se sirve en producción (`vercel.json` sirve `public/`). No se ha tocado.

## Segunda pasada (verificada con capturas)

Verificación: se renderizó el sitio en Chromium con las reglas de `vercel.json` (incluida la CSP) y se midieron cortes con un detector automático en 390, 820 y 1280 px.

**Placeta Junior Code**
- Tablero a la izquierda y paleta/programa a la derecha en escritorio y tableta (desde 760 px); una columna en móvil.
- Paleta en filas de bloques (4 por fila en escritorio, 3 en tableta y móvil) en lugar de columnas largas.
- El objetivo (posición, monedas, pasos) siempre visible; la estrella se dibuja en el tablero.
- Corregido: el contenido de Code se salía por arriba del encabezado en móvil (centrado flex sin scroll) y había un scroll anidado.
- Corregido: píldoras de cabecera con contraste ilegible; etiquetas de bloque que se partían («AVANZA / R»).
- Banderas de idioma servidas desde el propio proyecto (`public/img/flags/`), no desde Wikimedia.

**Placeta Junior Education**
- Alta y administración en dos columnas: propuesta y pasos a la izquierda, formulario a la derecha.
- Portada: el panel del héroe ya no recorta contenido en móvil; el anillo decorativo se oculta en pantallas pequeñas.
- Título duplicado eliminado en administración.

**Placeta Junior Studio**
- Corregido el recorte del banner (regresión de la pasada anterior): ahora tiene padding interior.

**Carga**
- Iconos Material Symbols: no se muestran palabras en bruto mientras la fuente no está lista (`js/pj-icons-ready.js`).

**Limitaciones conocidas**
- Las capturas se hicieron sin conexión: los iconos de Material Symbols no aparecen en ellas (en la web real sí).
- El panel visual de Studio tiene un círculo decorativo recortado a propósito por la tarjeta.
- `npm test`: 112 de 113. El fallo (`educacion.test.cjs`) ya existía antes de estos cambios.

## Tercera pasada: Code plano y compacto

- **Colores planos**: ningún degradado en las pantallas de Code (verificado por código: 0 imágenes de fondo en 91–109 elementos, móvil y escritorio). `visual.css` se reescribió; anula los degradados heredados de `styles.css` y `player-skin.css`.
- **Orden de lectura**: ejercicio → enunciado (bloque violeta) → pista (caja amarilla debajo) → chips del objetivo → tablero y bloques → acciones → pistas.
- **Compacto**: la cabecera muestra solo «Ejercicio X / Y» y el título; los datos de docente (identificador, etapa, dificultad) quedan ocultos en la vista del alumno.
- **Bloques y programa**: colores sólidos del bloque, borde inferior sólido, controles de cada pieza claros.
- Escritorio y tableta: dos columnas. Móvil: una columna con el mismo orden de lectura.

## Cuarta pasada: Placeta Junior Code como producto propio

**Acceso público**
- `/code` (y `junior.laplaceta.org/code` si el dominio apunta a este proyecto): página de Placeta Junior Code con qué es, cómo se juega, las misiones publicadas y accesos para docentes (Studio y Retos Code) y desarrolladores (DevAI).
- Las misiones se cargan de la misma API de actividades que la portada (`/actividades?solo_publicas=1`), filtradas por `code_blocks`. Estados de carga, vacío y error cubiertos.
- Portada de Junior (SPA): nueva entrada «Code» en la navegación y botón «Placeta Junior Code» en el héroe.

**Espacio «Retos Code» (`/edu/code`)**
- Editor visual de misiones: pintar el tablero (Candela y su dirección, meta, monedas, rocas) arrastrando, tamaño 3–10, bloques permitidos con los colores del motor, objetivo (pasos máximos, monedas, bloque obligatorio) y textos para el alumnado.
- Validación: falta de meta, Candela sobre la meta, bloques vacíos, y **camino libre hasta la meta** con las rocas puestas.
- Guardado automático en la biblioteca del dispositivo; hasta 12 retos por conjunto; duplicar, reordenar y borrar.
- «Probar como alumno» abre el reproductor real con el conjunto.

**Studio · bloques de Code**
- Vista compacta: miniaturas de cada reto, enlace al editor visual, e importación de un conjunto (reemplazar o añadir al final).
- Los ajustes detallados de cada reto quedan plegados en «Ajustes de cada reto (avanzado)».

**Limitaciones conocidas**
- La biblioteca de Retos Code es local al navegador (como los borradores de Studio). Para compartir conjuntos entre dispositivos hace falta un endpoint en la API.
- DevAI no se ha modificado: solo hay un enlace desde la página de Code.
- `npm test`: 112 de 113. El fallo (`educacion.test.cjs`) ya existía.

## Quinta pasada: Studio rehecho desde cero

**Lo que se mantiene (contratos)**
- Puerta de permisos: se comprueba la cuenta antes de cargar borradores o editor (`/api/centros/mi`).
- Borradores en `pj-studio-creadores-drafts-v1`, por ámbito (docente o centro). Los borradores de la versión anterior se leen sin cambios.
- Envío a `/api/creadores/actividades` con el mismo cuerpo (`contenido.version: 2`, bloques, `num_preguntas`, `recompensa`) y la misma cabecera de autorización.
- Los 26 tipos de actividad, con sus datos iniciales, y las cuatro plantillas.
- Deshacer y rehacer (50 pasos), duplicar, mover y quitar bloques, salto de unidad.
- Vista previa con el reproductor real, en diálogo, con móvil, tableta y escritorio.
- Bloque de Placeta Junior Code con miniaturas e importación desde Retos Code.

**Lo que cambia**
- Editor por esquema: los campos se generan a partir de la forma de los datos de cada tipo (textos, números, casillas, listas repetibles, coordenadas y la respuesta correcta como selección). No hay formularios a mano por tipo ni editor JSON.
- Tres partes claras: Bloques · Actividad · Editar bloque. En pantallas medianas y pequeñas se ve una cada vez.
- Vista previa en diálogo con el reproductor real (antes, un panel aparte).
- Interfaz plana, sin degradados, con el mismo lenguaje que Retos Code.

**Pruebas modificadas a propósito** (comprobaban nombres de implementación del editor antiguo, no requisitos de producto)
- `studio-creadores.test.cjs`:
  - «editor incluye plantillas y editor visual»: en vez del literal `data-add-row="preguntas"`, comprueba que las listas repetibles existen y que preguntas y parejas tienen su elemento nuevo definido.
  - «controles de reloj, medida, dados…»: en vez de nombres de control, comprueba el generador de campos por esquema, las opciones con respuesta correcta y la ausencia de editor JSON.
  - «los retos de Code se diseñan…»: el tablero vive ahora en `/edu/code`; el test comprueba ese espacio y el importador de Studio.
- `primaria-nueva.test.cjs`: ya no exige una rama `block.tipo === '…'` por tipo; comprueba que los datos de cada tipo se editan con el generador por esquema.

**Verificación**
- Prueba de extremo a extremo en navegador: plantilla → editar pregunta y respuesta correcta → añadir bloque de parejas → deshacer → vista previa → envío. El cuerpo enviado coincide con el contrato y el borrador se elimina tras enviar.
- Importación de retos de Code en un bloque de Studio, con confirmación.
- Pestañas móviles: una parte visible cada vez.
- Detector de cortes sobre el editor con sesión: sin cortes en móvil; en escritorio solo la etiqueta de accesibilidad recortada a propósito.
- `npm test`: 112 de 113. El fallo (`educacion.test.cjs`) ya existía.

**Limitaciones**
- El editor por esquema es genérico: los campos se llaman como sus claves, traducidas al castellano en un mapa (`ETIQUETAS`). Un tipo nuevo con claves desconocidas se verá con la clave tal cual hasta que se añada su etiqueta.
- Los campos de los 19 tipos de datos primarios no tienen ayudas específicas por tipo: la ayuda corta viene de `PRIMARY_HELP`.
