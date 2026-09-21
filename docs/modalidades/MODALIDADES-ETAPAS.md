# Modalidades por etapa

Placeta Junior usa el mismo JSON en Studio, web, PDF y app. La etapa orienta el diseño, pero no bloquea el contenido: una actividad puede combinar bloques si la edad y las instrucciones son adecuadas.

## Infantil · 3-5 años

Objetivo: manipulación simple, reconocimiento, lenguaje inicial y coordinación.

- `numero_bloques`: contar, sumar con piezas y construir cantidades pequeñas.
- `memoria`: parejas visuales y sonidos.
- `secuencia_visual`: ordenar escenas, rutinas o pasos.
- `trazo`: practicar letras, formas y caminos con el dedo.
- `relacionar`: imagen con palabra, color, forma o sonido.

Reglas de UI: una acción principal por pantalla, botones grandes, poco texto, feedback visual y audio opcional.

Ejemplo de secuencia:

```json
{
  "tipo": "secuencia_visual",
  "titulo": "Ordena la rutina",
  "instrucciones": "Pulsa las tarjetas desde el primer paso hasta el último.",
  "datos": {
    "items": [
      { "texto": "Lavarse las manos", "orden": 0 },
      { "texto": "Comer", "orden": 1 },
      { "texto": "Recoger", "orden": 2 }
    ]
  }
}
```

## Primaria · 6-12 años

Objetivo: practicar contenidos escolares y pensamiento computacional progresivo.

- `test`, `calculo_mental`, `mapa_mundi` y `mapa_espana`.
- `code_blocks` con retos progresivos.
- `cazador_errores`, `clasificar_palabras`, `completar_palabra`.
- `simulacion`, `laboratorio` y `escape_room` sencillos.

La actividad debe empezar con una explicación breve y avanzar desde ejemplos guiados hacia práctica autónoma.

## Secundaria · 12+ años

Objetivo: aplicar conceptos, argumentar, depurar y comparar soluciones.

- `code_retos`: comparar programas por pasos, claridad y eficiencia.
- `cazador_errores`: detectar errores de lógica y justificar la corrección.
- `simulacion`: observar datos, formular hipótesis y sacar conclusiones.
- `escape_room`, `codigo_secreto`, `investigacion` y futuros debates.

## Contrato técnico

Los motores nuevos deben:

1. Guardar el contenido en JSON declarativo.
2. Tener pantalla web accesible y compatible con táctil.
3. Añadir estado en `kpEstado` y puntos en `kpScore`.
4. Tener fallback seguro cuando falten datos.
5. Mantener el formato antiguo de actividades sin migración obligatoria.
