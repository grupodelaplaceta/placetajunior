# Placeta Junior — Web pública oficial (junior.laplaceta.org)

Web pública de la **Academia Placeta Junior**: el espacio educativo interactivo de La Placeta.
Misma identidad visual que la app móvil, con actividades educativas gratuitas, Retos de Candela
y acceso a la Academia.

## Stack
- Web estática (HTML/CSS/JS) — sin framework
- `public/index.html`: interfaz completa (inicio, actividades, juegos de Infantil, familias, info). Los juegos de Infantil viven dentro del propio HTML (sin servidor).
- `public/jugar.html`: aloja el reproductor original de actividades del servidor (se abre en un iframe desde `#/a/<id>`).
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

## Backend en Vercel (centros y educación)
Todo el backend vive en este mismo proyecto. Dos funciones de Vercel (`api/centros.js` y `api/educacion.js`); el enrutado de `vercel.json` reparte cada ruta a su función.

Subrutas:
- `/centros`: alta de centro con cuenta de Google. `/centros/panel`: panel del centro. La revisión de solicitudes se hace en el panel externo RSP de La Placeta (no está en esta web).
- `/educacion/`: portal de administración de Placeta Junior Education. Lo usa la app de escritorio Placeta Junior IO (`/api/dispositivo/*`).

Variables de entorno (Vercel → Settings → Environment Variables, Production y Preview):
- `GOOGLE_CLIENT_ID`: ID de cliente de Google (Google Auth Platform → Clientes). No es secreto. No hace falta secreto de cliente.
- `SUPABASE_URL` y `SUPABASE_SECRET_KEY`: base de datos. Solo servidor.
- `PJ27_CLAVE_CIFRADO`: 32 bytes en base64 (`node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`). Cifra los secretos de los dispositivos y firma la sesión de administración. Si cambia, los dispositivos vinculados dejan de funcionar: guárdala en un gestor seguro.
- `PJ_ADMIN_USUARIO` (opcional, por defecto `admin`) y `PJ_ADMIN_CLAVE`: la clave inicial del administrador. Se usa solo la primera vez, cuando la base de datos todavía no tiene administrador; después se guarda cifrada con scrypt. Cambiar la clave después requiere actualizar la fila `PJ27_estado` (campo `admin`).

Base de datos (Supabase → SQL Editor, en orden):
1. Ejecuta `supabase/setup_backend_completo.sql`: crea las tablas de Centros y Education, RLS, permisos y la RPC de aprobación. Incluye la tabla `PJ27_estado` de la migración 0002.
2. Sustituye el correo de ejemplo de la última instrucción comentada del SQL por el correo autorizado del primer revisor y ejecútala.

Pruebas: `npm test` (lógica de validación, políticas, cifrado, firma, sesiones, verificación de tokens de Google, despacho de las dos funciones).

Límites conocidos:
- El estado de educación es un único documento. Vale para el volumen actual; si crece mucho (miles de dispositivos con historial de aceptaciones), conviene pasar cada colección a su propia tabla.
- El inicio de sesión real con Google y el flujo completo contra Supabase deben comprobarse en el despliegue: en este entorno no hay acceso a Google ni a la base de datos.
