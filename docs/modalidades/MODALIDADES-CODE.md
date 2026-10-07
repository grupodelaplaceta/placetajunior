# Placeta Junior Code — Diseño de modalidades

Cada ficha define: **concepto · motor (bloque) · JSON · progresión · superficies**.
Todas comparten iconos Material (sin emojis de interfaz), accesibilidad por
voz y progresión por niveles (`contenido.niveles`).

---

## 1. Secuencias — «Aprende a dar instrucciones»

- **Concepto:** un programa es una serie **ordenada** de instrucciones.
- **Motor:** `ordenar_imagenes` (nuevo). El niño ordena tarjetas-imagen
  (avanzar, girar, recoger, volver…) para que Candela cumpla la misión
  (p. ej. *recoger una manzana*).
- **JSON:**
  ```jsonc
  { "tipo":"ordenar_imagenes", "titulo":"Recoge la manzana",
    "objetivo":"Recoger una manzana",
    "items":["avanzar","girar","avanzar","recoger","volver"],
    "distractores":[],              // L3: instrucciones innecesarias
    "imagenes":{ "avanzar":"svg/code/avanzar.svg", … }
  }
  ```
- **Progresión:** L1 3 imágenes · L2 5-6 · L3 con distractores · L4 varias
  soluciones válidas · L5 crear la secuencia entera.
- **Superficies:** Web interactivo (arrastrar) · PDF (numera las imágenes) ·
  App (drag & drop táctil).
- Al terminar se introduce la frase: *Una secuencia es un conjunto de
  instrucciones que se ejecutan en un orden determinado.*

---

## 2. Algoritmos — «Encuentra la mejor manera»

- **Concepto:** elegir y **optimizar** los pasos; puede haber varias
  soluciones, unas mejores que otras.
- **Motor:** `code_retos` (nuevo) sobre el tablero de Candela; valida la
  solución y devuelve 1-3 ⭐ según eficiencia.
- **JSON:**
  ```jsonc
  { "tipo":"code_retos", "titulo":"Atraviesa el bosque",
    "escenario":{"tipo":"cuadricula","ancho":6,"alto":6,"obstaculos":[…]},
    "inicio":{"x":0,"y":0,"direccion":"derecha"},
    "meta":"llegar",
    "estrellas":{"optimo":9,"correcto":15,"valido":20}
  }
  ```
- **Enseña:** pasos ordenados, alternativas, eficiencia, optimización,
  descomposición.
- **Actividad estrella:** *El algoritmo perfecto* — 3⭐ óptimo · 2⭐ correcto ·
  1⭐ válido mejorable.
- **Superficies:** Web y App (interactivo). PDF: lámina de "escribe el camino"
  con rejilla.

---

## 3. Bucles — «No repitas lo mismo 20 veces»

- **Concepto:** repetir sin escribir 20 veces → abstracción/optimización.
- **Motor:** editor `code_blocks` ampliado con bloque `repetir N` y
  `repetir hasta …`.
- **JSON:**
  ```jsonc
  { "tipo":"code_blocks", "titulo":"Salta 8 veces",
    "bloques_permitidos":["saltar","repetir"],
    "ejercicios":[ { "titulo":"Repite 8 saltos",
      "escenario":{…}, "objetivo":{"posicion":{…},"max_pasos":8} } ] }
  ```
- **Progresión:** repetir 2 → 5 → elegir veces → `hasta llegar` → bucles
  anidados.
- **Mecánica estrella:** Programa A `avanzar × 20` vs Programa B
  `repetir 20 → avanzar` → *¿Cuál está mejor programado?* (`test`).

---

## 4. Condicionales — «Los programas deciden»

- **Concepto:** SI ocurre → haz; SI NO → otra cosa; Y/O/NO; anidados.
- **Motor:** `code_blocks` con `si`, `si no`, condiciones; y quiz visual con
  `test`/`lectura_interactiva` para escenarios (lluvia → paraguas…).
- **JSON:** bloque `code_blocks` con `bloques_permitidos:["si",…]` y reglas de
  comportamiento de Candela.
- **Progresión:** SI → SI/SI NO → varias condiciones → Y → O → NO → anidados.
- **Juego:** *Candela robot* (moneda → recoger; enemigo → escapar; puerta →
  ¿tiene llave?).

---

## 5. Detectives de errores (debugging)

- **Concepto:** encontrar, explicar y corregir fallos.
- **Motor:** ampliar `cazador_errores` + nuevo `depura` (marca el bloque
  erróneo y luego corrígelo) sobre secuencias de bloques.
- **JSON:**
  ```jsonc
  { "tipo":"depura", "titulo":"Arregla el programa",
    "esperado":["avanzar","girar","avanzar","recoger"],
    "programa":["avanzar","avanzar","girar","recoger"],  // con bug
    "tipo_error":"bloque_incorrecto" }
  ```
- **Tipos de error:** bloque incorrecto / falta / sobrante / orden /
  condición / bucle / variable.
- **Niveles:** detecta → encuentra entre muchos → explica → corrige →
  corrige programas completos.

---

## 6. Pensamiento computacional

- **Concepto (4 pilares) sin teoría aburrida:**
  - **Descomposición:** dividir (construir una casa → terreno, diseño, paredes,
    techo, puertas, ventanas) → motor `ordenar`/`relacionar` (pasos).
  - **Patrones:** `🔴🔵🔴🔵?` → motor `clasificar_palabras`/`completar`
    (series visuales).
  - **Abstracción:** ignorar lo que sobra (bus: línea y dirección, no color del
    asiento ni matrícula) → motor `clasificar_palabras` (qué importa/qué no).
  - **Algoritmos:** ¿qué pasos usarías? → `ordenar`/`code_retos`.

---

## 7. Internet — «¿Qué pasa al entrar en una web?»

- **Aventura:** el mensaje *Hola* viaja
  dispositivo → router → red → servidor → dispositivo; el niño lo acompaña.
- **Conceptos:** Internet, Wi-Fi, router, servidor, cliente, navegador, web,
  URL, DNS, datos.
- **Motor:** `exploracion`/`lectura_interactiva` + `relacionar` (concepto ↔
  definición) + `ordenar` (recorrido del mensaje).
- **Juego:** *Encuentra el servidor* entre servidores de varios países.

---

## 8. Ciberseguridad — «Agencia de detectives digitales»

- **Motor:** `escape_room`/`codigo_secreto` + `test` + `clasificar_palabras`.
- **Misiones:** 🚨 detectar mensajes engañosos (phishing, enlaces
  sospechosos, urgencia, petición de datos) → 🔐 crear contraseña segura →
  🛡️ proteger el dispositivo.
- **Análisis:** remitente · mensaje · enlace · petición · urgencia ·
  contraseña · datos personales.
- **Enfoque:** seguridad digital **sin meter miedo**.

---

## 9. Inteligencia artificial — «Cómo aprende una IA»

- **Motor:** `simulacion`/`interactivos` con datos + `test` de predicción.
- **Misiones:**
  1. **Clasificar** (gatos/perros) → patrones a partir de datos.
  2. **Entrenar** (☀️→verano, ❄️→invierno; ¿🌧️?) → predicción.
  3. **Errores** (datos insuficientes, incorrectos, sesgos).
  4. **IA generativa** (instrucción → respuesta; qué es un *prompt*).
  5. **Misión final:** *Entrena tu propia IA de Candela* (clasificador).

---

## 10. Variables — «Que el programa recuerde cosas»

- **Concepto:** monedas=0; cada moneda monedas=monedas+1.
- **Motor:** `code_blocks` ampliado (variables) + juegos: contador, puntos,
  vidas, tiempo, nivel, energía.
- **JSON (bloque de juego de contador):**
  ```jsonc
  { "tipo":"simulacion", "datos":{
    "variable":"monedas","inicio":0,
    "reglas":[{"si":"recoge moneda","entonces":"monedas=monedas+1"}],
    "objetivo":"llega a 10 monedas"} }
  ```
- **Progresión:** 1 variable → modificarla → varias → con condiciones →
  pequeño juego.

---

## 11. Lógica — Puzzles y deducciones

- **Motor:** `test` (verdadero/falso), `relacionar` (deducciones),
  `completar`, `clasificar_palabras`, tablas lógicas visuales.
- **Ejemplos:** "Si Candela lleva sombrero está fuera; Candela lleva
  sombrero. ¿Dónde está?" · tablas A/B.
- **Juegos:** contradicciones, verdadero/falso, deducciones, puzzles,
  patrones, clasificación, tablas.

---

## 12. Bloques de programación — «Gran editor»

- **Motor:** `code_blocks` (editor Placeta Junior Code), categorías con color:
  🟦 Movimiento · 🟨 Eventos · 🟩 Control · 🟪 Variables · 🟥 Sonido ·
  🟧 Sensores.
- **Ejemplo visual:**
  ```text
  AL PULSAR INICIAR
    repetir 10 veces
      avanzar 10 pasos
    si toca moneda
      sumar 10 puntos
  ```
- **Interacción:** arrastrar → conectar → ejecutar → ver resultado; si falla,
  "🐛 hay un problema en tu programa".

---

## 13. Primer código real

- **Ruta:** bloques → código visual → JavaScript básico → Python básico.
- **Transición (bloque → código):**
  ```text
  🟦 avanzar      →   avanzar()
  🟦 girar        →   girar()
  ```
- **Motor:** `code_blocks` con modo "ver código" y editor textual supervisado
  (solo bloques permitidos) que genera el equivalente en JS/Python.

---

## 14. Funciones

- **Concepto:** no repetir; `saludar()`, luego `saludar("Mikel")`.
- **Motor:** `code_blocks` ampliado + `ordenar` (ordenar cuerpo de función) y
  `test` (qué devuelve).
- **Progresión:** crear → reutilizar → parámetros → resultados → funciones
  dentro de programas.

---

## 15. Datos — Buscar y ordenar

- **Motor:** `clasificar_palabras`/`relacionar`/`test` + nuevo `datos_tabla`
  (ordenar, buscar, comparar, máximos/mínimos, gráficos).
- **JSON (tabla):**
  ```jsonc
  { "tipo":"datos_tabla", "columnas":["Planeta","Distancia","Tamaño"],
    "filas":[["Mercurio",…],["Venus",…],["Tierra",…]],
    "reto":"ordenar_por_distancia" }
  ```
- **Después:** "¿cómo haría un ordenador para encontrar rápido este dato?"
  → búsqueda y ordenación (secuenciar algoritmo).

---

## 16. Tecnología real — «Detrás de casi todo»

- **Motor:** `simulacion`/`lectura_interactiva` + `code_blocks` con retos:
  - 🚦 Semáforo (verde→amarillo→rojo→verde).
  - 🛗 Ascensor (SI pulsa 3 → subir).
  - 📍 GPS (recibir → calcular → mostrar).
  - 🤖 Robot (sensor → decisión → movimiento).
  - 🚗 Coche (detectar obstáculo → frenar).
  - 🏠 Casa inteligente (movimiento → luz).

---

## 17. Placeta Code Lab (Proyectos)

En vez de ejercicios sueltos, **construye algo**:

| Proyecto | Necesita | Motor |
|----------|----------|-------|
| Construye un semáforo | secuencias + bucles + condiciones | `code_blocks` |
| Programa un robot | sensores + condicionales + algoritmos | `code_blocks` |
| Crea un videojuego | variables + eventos + bucles | `code_blocks` |
| Crea una página web | HTML + CSS + JS (editor guiado) | nuevo editor web |
| Entrena una IA | datos + clasificación + patrones | `simulacion` |

- **JSON de proyecto:** igual que una actividad con varios `niveles`, cada uno
  una pieza del proyecto; al completar todas → 🏆 proyecto terminado.
