# Actividades de Primaria

Este directorio contiene los motores de actividad que usa Placeta Junior. No requiere ni carga archivos desde `primaria-nueva`.

| Archivo | Responsabilidad |
|---|---|
| `core.js` | Registro de tipos, renderizado común, respuestas y estado. |
| `i18n.js` | Catálogos de actividades en español, catalán e inglés. |
| `matematicas.js` | Geometría, euros, cálculo vertical y mental, ábaco, horas y dados. |
| `retos.js` | Tesoro, simetría, patrones, batalla y tangram. |
| `primaria-clasica.js` | Modalidades clásicas de Primaria. |

## Añadir un tipo

1. Implementa `crear`, `render` y texto accesible en el motor de su categoría; registra el tipo con `PJPNCore.reg`. Mantén las acciones de interacción en el registro del tipo.
2. Añade el nombre del tipo, icono, valores iniciales, ayuda y controles visuales a `public/studio-creadores.js`. Valida los campos antes de guardarlos.
3. Añade todas las claves del tipo a `es`, `ca` y `en` en `i18n.js`. La prueba de cobertura compara los tres catálogos.
4. Actualiza `public/js/modalidades.js`, las instrucciones y plantillas de `public/devai.html`, el formato imprimible en `public/js/app.js`, y el inventario del service worker en `public/sw.js`.
5. Añade una prueba en `tests/primaria-nueva.test.cjs` para configuración, renderizado, interacción y al menos una solución determinista.

Las pantallas se producen como pares `{s, e}`: `s` es la especificación del ejercicio y `e` su estado inicial. `core.js` agrega el identificador de tipo y los campos de estado compartidos, y el reproductor mantiene ese contrato.

Ejecuta `node --test tests/primaria-nueva.test.cjs tests/studio-creadores.test.cjs tests/devai.test.cjs` para validar las superficies principales de actividades.
