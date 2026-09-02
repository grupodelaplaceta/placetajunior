# Placeta Junior — Diseño de modalidades de actividad

> Documento de diseño funcional: cómo convertir el catálogo de ideas
> (Placeta Junior Code · Caligrafía · Mapas) en **actividades reales** que
> se juegan igual en **Web**, se imprimen en **PDF** y se reproducen en la
> **App**, manteniendo la identidad visual y los principios de accesibilidad.

---

## 1. Principios de diseño

1. **Una mecánica por modalidad, muchos niveles.**
   Cada modalidad tiene un motor único de interacción y crece en dificultad
   mediante *niveles* (bloques `niveles`/`diapositivas` ya existentes).

2. **El contenido es 100 % JSON.**
   Una actividad es un JSON (esquema `contenido.version` 2+). Web, PDF y App
   leen el mismo JSON: si el motor existe en las tres superficies, la misma
   actividad funciona en todas. Studio y DevAI generan/editan ese JSON.

3. **Nada de chivatos en "localizar".**
   En actividades de mapa o búsqueda la respuesta **no se revela** (sin
   banderas encima, sin lista corta de candidatos, sin tooltips con el nombre
   antes de responder). La pista va en el enunciado, no en la interfaz.

4. **Iconos vectoriales, no emojis.** Toda la interfaz usa el sistema de
   iconos Material/SVG; los emojis quedan solo como *contenido* ilustrativo.

5. **Accesibilidad por diseño.** Cada pantalla expone un texto para lectura
   (`junior:texto`), hay texto alternativo en toda imagen, foco correcto y
   alto contraste sin depender del color.

6. **Gamificación constante y no punitiva.** Verdes/rojos, Pz y estrellas
   (⭐⭐⭐) según eficiencia. Errores como parte del aprendizaje (debugging).

---

## 2. Estructura de una actividad

```jsonc
{
  "titulo": "…", "descripcion": "…",
  "categoria": "Tecnología|Lengua|…",
  "edad_recomendada": "6-12", "dificultad": "facil|media|dificil",
  "tiempo_estimado": 10,
  "contenido": {
    "version": 2,
    "niveles": [                       // opcional: 2-6 diapositivas
      { "orden": 1, "titulo": "…", "descripcion": "…", "recompensa": 0,
        "bloques": [ /* bloques */ ] }
    ],
    "bloques": [ /* bloques de una sola tanda */ ]
  }
}
```

### Ficha de bloque mínima (todas las modalidades)

```jsonc
{
  "tipo": "<motor>",                 // ver tabla §3
  "titulo": "Nombre de la pantalla", // se muestra como etiqueta (icono Material)
  "instrucciones": "Frase clara de qué hacer",
  "pistas": ["…"],                   // opcional
  "nivel": 1,                        // opcional: dificultad interna
  "recompensa": 0
}
```

---

## 3. Motor ↔ Modalidad (mapa rápido)

| Motor (tipo de bloque) | Uso / modalidades                          | Superficie |
|------------------------|--------------------------------------------|------------|
| `texto` / `esquema`    | Enseñar conceptos (algoritmo, bucles…)     | Web · PDF · App |
| `test`                 | Quiz, verdadero/falso, deducciones         | Web · PDF · App |
| `relacionar`           | Emparejar, clasificar, "pista = palabra"   | Web · PDF · App |
| `ordenar`              | Secuencias, pasos de un algoritmo, frases  | Web · PDF · App |
| `ordenar_imagenes`     | **Nuevo** Secuencias visuales (Code §1)    | Web · PDF · App |
| `completar`            | Frases, código con huecos                  | Web · PDF · App |
| `clasificar_palabras`  | Patrones, categorías                       | Web · PDF · App |
| `cazador_errores`      | Debugging (Code §5)                        | Web · PDF · App |
| `code_blocks`          | Editor de bloques (mov/giro…)              | Web (motor App) |
| `code_retos`           | **Nuevo** Programas A vs B, eficiencia      | Web · App |
| `laberinto` / `trazo`  | **Nuevo** Caligrafía: grafomotricidad       | Web (canvas) · PDF |
| `mapa_mundi`           | Localiza países (sin pistas)               | Web · PDF |
| `mapa_espana`          | **Nuevo** CCAA y provincias                | Web · PDF |
| `simulacion` / `interactivos` | IA, Internet, ciberseguridad (aventuras) | Web · App |
| `escape_room` / `codigo_secreto` | Proyectos y misiones                | Web · App |
| `memoria`              | Patrones y conceptos                       | Web · App |

> Los motores **nuevos** se documentan en cada ficha. Todos siguen la misma
> regla: **bloque JSON → pantalla Web → sección imprimible PDF → estado App**.

---

## 4. Cómo se materializa en cada superficie

### Web (reproductor `player.js`)
- Cada bloque se convierte en 1..N pantallas interactivas con verdes/rojos,
  confeti, y navegación ("Volver al menú" / "Ir a la siguiente unidad").
- Canvas/SVG para trazos, laberintos y mapas de España.
- Iconos Material (no emojis) y lectura por voz (`junior:texto`).

### PDF (ficha imprimible `app.js → descargarPdf`)
- El mismo JSON genera una **ficha A4** estática: enunciados, sopas,
  relacionar, completar, y **láminas** para trazos/dibujo/mapas de España.
- Texto siempre legible (Fredoka/Outfit), con espacios para escribir.
- Cualquier imagen remota se espera antes de imprimir.

### App
- La App consume el mismo JSON publicado por la API (`admin-placeta`/RSP).
- Los motores interactivos (canvas, bloques, IA) se replican en el motor de
  la App; las pantallas de texto/quiz se comparten.
- El progreso (verdes/rojos/Pz/estrellas) se sincroniza por DIP/resultado.

---

## 5. Roadmap por fases

1. **Fase 0 — Cimientos.** Mapas de España (comunidades y provincias) con
   datos propios + `mapa_espana` en Web y PDF. *(diseño en `mapas.md`)*
2. **Fase 1 — Code núcleo.** `secuencias`, `algoritmos` (eficiencia ⭐⭐⭐),
   `bucles`, `condicionales`, `depuración` (cazador_errores ampliado).
3. **Fase 2 — Caligrafía.** Trazos → letras → palabras → frases (canvas y PDF).
4. **Fase 3 — Pensamiento computacional + talleres.** Patrones, lógica,
   internet, ciberseguridad, IA (clasificadores) y **Code Lab** (proyectos).
5. **Fase 4 — Variables, datos, funciones y código real** (transición a
   JavaScript/Python supervisado).

---

Documentos por familia:

- [Mapas (mundo sin pistas + España CCAA/provincias)](MAPAS.md)
- [Placeta Junior Code — modalidades](MODALIDADES-CODE.md)
- [Caligrafía — modalidades](MODALIDADES-CALIGRAFIA.md)
