# Placeta Junior — Caligrafía · Diseño de modalidades

Objetivo: aprender a escribir **jugando con misiones** (Candela) y no con
repeticiones vacías. Misma regla: contenido JSON → Web (canvas) · PDF (lámina
imprimible) · App (táctil).

**Motor transversal propuesto: `trazo`** (nuevo, canvas/SVG):

```jsonc
{ "tipo":"trazo", "titulo":"Llega a la casa",
  "forma":"linea|curva|zigzag|espiral|letra",
  "grabado":"ruta-guía (punteada, ancha→fina→sin guía)",
  "mision":"Ayuda a Candela a llegar a la casa",
  "dificultad":{"anchura":0.9,"curvas":0,"tamano":1,"longitud":1} }
```

---

## 1. Trazos (Infantil)

- **Qué:** líneas horizontales/verticales, diagonales, zigzag, ondas,
  espirales, bucles, círculos, semicírculos, cruces.
- **Cómo:** misiones del tipo *"lleva a Candela siguiendo el camino"*, con
  guía que va de **muy ancha → media → fina → sin guía**.
- **Motor:** `trazo`.

---

## 2. Grafomotricidad

- **Qué:** precisión y coordinación.
  - Seguir recorridos sin salirse.
  - Repasar punteado.
  - Unir puntos (formas, dibujos, luego letras).
  - Laberintos crecientes.
  - Simetrías (completar la otra mitad).
- **Dificultad:** anchura del camino, curvas, tamaño, longitud, obstáculos.
- **Motor:** `trazo` + `laberinto`.

---

## 3. Letras (proceso por letra)

Pasos para la **a**:

1. Ver la letra.
2. Candela enseña el trazo (empieza aquí → gira → sube → cierra).
3. Repasar la letra.
4. Escribirla con puntos de inicio.
5. Escribirla sin puntos.
6. Escribirla en una palabra.

- **Motor:** `trazo` con `grabado:"letra"` + guion animado de trazos
  (dirección y punto de inicio).

---

## 4. Mayúsculas

- **Qué:** ABC…; trabajar dirección, inicio, altura, proporción, separación.
- **No todo es escribir:** *"Encuentra la A bien escrita"* (reconocer una
  escritura correcta) → motor `test`/`clasificar_palabras` con muestras.

---

## 5. Minúsculas

- **Niveles por dificultad visual:**
  - Fácil: `i l t o c`
  - Medio: `a e m n u`
  - Avanzado: `b d p q f g` (confusiones visuales b/d, p/q).
- **Motor:** `trazo` + tarjetas de confusión (elegir la correcta).

---

## 6. Sílabas

- **Qué:** MA ME MI MO MU; luego CA-SA; luego palabras.
- **Secuencia:** repasa → copia → completa → escribe.
- **Motor:** `trazo` + `completar`/`test` (¿qué sílaba forma `🐱`?).

---

## 7. Palabras

- **Temáticas:** animales, naturaleza, espacio, escuela, comida, familia,
  tecnología.
- **Ejemplo CANDela:** repasa `C A N D E L A` → copia → `_ A N D E L A` →
  escribe sin ayuda.
- **Motor:** `trazo` + `completar` (palabra con huecos) + escritura libre
  validada (mayúsculas/minúsculas según nivel).

---

## 8. Frases

- **Niveles:** repasar → copiar → completar (`Candela juega en el ____.`) →
  ordenar palabras (`parque/juega/Candela/en/el`) → escribir una frase.
- **Motor:** `trazo` + `ordenar` + `completar`; mezcla caligrafía y lengua.

---

## 9. Caligrafía creativa

- **Misiones de comunicación real:** nombre de tu personaje, matrícula,
  postal, cartel de tienda, tarjeta de cumpleaños, carta a Candela.
- **Frase guía:** *"Escribir sirve para comunicarnos."*
- **Motor:** `trazo`/escritura libre sobre plantillas + PDF para decorar.

---

## Superficies

| Superficie | Cómo se materializa |
|------------|---------------------|
| **Web** | Canvas táctil/ratón con detección de "salirse del camino"; guarda intentos como verdes/rojos. |
| **PDF** | Láminas A4: caminos punteados, letras con flechas de dirección, pauta para escribir (pauta Montessori/3 líneas opcional). |
| **App** | Canvas táctil nativo con lápiz; misma lógica de validación que la Web. |
