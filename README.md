# Placeta Junior — Web pública oficial (junior.laplaceta.org)

Web pública de la **Academia Placeta Junior**: el espacio educativo interactivo de La Placeta.
Misma identidad visual que la app móvil, con actividades educativas gratuitas, Retos de Candela
y acceso a la Academia.

## Stack
- Web estática (HTML/CSS/JS) — sin framework
- Consume la **API oficial** de admin-placeta (RSP): `https://admin-placeta.vercel.app/api/junior/...`
- Desplegada en Vercel → `junior.laplaceta.org`

## Endpoints usados
- `GET /api/junior/retos` — Retos de Candela (semanales)
- `GET /api/junior/actividades` — Actividades aprobadas (públicas)
- `GET /api/junior/academy/precios` — Catálogo de precios con IVA (Capitalia lo abona)
- `GET /api/junior/puntos/canje` — Tabla de canje de Puntos Verdes
- `POST /api/junior/academy/evaluar` — Evaluar respuestas (puntos verdes/rojos + placetas)

## Despliegue
El proyecto está conectado al repo `grupodelaplaceta/placetajunior`. En Vercel:
- Framework: `Other` / `Static`
- Build: ninguno
- Output: `/`

## Identidad visual

## Estadísticas de la plataforma

Placeta Junior usa métricas internas de primera parte para mejorar el servicio y
acompañar el aprendizaje. Se analizan, cuando están disponibles, las actividades
consultadas o iniciadas, finalización, respuestas correctas e incorrectas,
puntos verdes y rojos, etapa educativa, tiempo aproximado de sesión y errores
técnicos. Los resultados identificados por DIP se usan además para progreso,
recompensas y diplomas.

No se usan redes publicitarias, perfiles para publicidad, venta de datos ni
analítica de terceros. La política de privacidad explica las finalidades, la
conservación y los derechos aplicables.
Colores oficiales PJ (P-J-U-N-I-O-R):
- P negro `#000000`, J rojo `#FF3333`, U naranja `#FF6600`, N amarillo `#D6CE52`,
  I verde `#336E45`, O azul `#3A00E1`, R púrpura `#4E3B70`
- Tipografías: Handly Casual (títulos) + Outfit (texto)
