/* ═══════════════════════════════════════════════════════════════════
   HALLOWEEN · CONFIGURACIÓN CENTRAL (único sitio donde tocar números)
   Evento temporal exclusivo. Ver LEEME.md para el listado de archivos
   y cómo retirarlo. Nada de este archivo afecta al resto de Junior.
   ═══════════════════════════════════════════════════════════════════ */
window.PJHW_CONFIG = {
  /* ── Interruptor general ─────────────────────────────────────────
     enabled:false  → el evento desaparece (banner, acceso Infantil, página).
     activeFrom/activeUntil: ventana automática (AAAA-MM-DD, hora local).
     Pon null en ambas para no limitar por fechas.
     Para previsualizar fuera de fechas: añade ?halloween=preview a la URL. */
  enabled: true,
  activeFrom: '2026-10-01',
  activeUntil: '2026-11-08',

  /* Clave propia de localStorage (no se toca ninguna otra clave). */
  storageKey: 'pj-halloween-v1',

  /* Música: carpeta con las canciones de Halloween + lista (lista.json).
     Al entrar a la página y al entrar a cada minijuego suena una al azar. */
  music: {
    folder: 'halloween/musica/',
    manifest: 'lista.json',
    volume: 0.35,
    fadeMs: 900,
    exts: ['mp3', 'ogg', 'wav', 'm4a', 'aac', 'webm']
  },

  /* ── Edades: Infantil y Primaria son juegos SEPARADOS ─────────────
     offset : dificultad interna de partida (1-2 Infantil, 3-6 Primaria).
     count  : niveles que ve el niño en cada juego.
     lives  : vidas por nivel (0 = sin límite, no se puede perder). */
  ages: {
    inf: { offset: 0, count: 2, stage: ['inf', 'inf'], lives: [0, 0] },
    pri: { offset: 2, count: 4, stage: ['pri1', 'pri1', 'pri2', 'pri2'], lives: [3, 3, 3, 3] }
  },

  /* ── Recompensas (caramelos) ─────────────────────────────────────
     perCorrect : caramelos por acierto, según la dificultad interna (1-6).
     completion : bonus al superar el nivel.
     stars      : bonus extra por 2 y 3 estrellas.
     replayFactor: multiplicador si el nivel ya estaba superado.
     maxPerRun  : tope por partida (anti-abuso). */
  rewards: {
    perCorrect: [1, 1, 1, 2, 2, 3],
    completion: [5, 7, 10, 14, 18, 24],
    stars: { 2: 2, 3: 5 },
    replayFactor: 0.5,
    maxPerRun: 120
  },

  /* ── Minijuegos y precio de desbloqueo (0 = gratis desde el inicio)
     id: único · game: mecánica (truco, atrapa, memoria, fabrica, fantasma,
     parejas, calabaza, escobas, pociones, laberinto) · age: inf | pri */
  games: [
    { id: 'i-truco',     game: 'truco',     age: 'inf', price: 0 },
    { id: 'i-atrapa',    game: 'atrapa',    age: 'inf', price: 0 },
    { id: 'i-memoria',   game: 'memoria',   age: 'inf', price: 0 },
    { id: 'i-fantasma',  game: 'fantasma',  age: 'inf', price: 30 },
    { id: 'i-parejas',   game: 'parejas',   age: 'inf', price: 40 },
    { id: 'i-laberinto', game: 'laberinto', age: 'inf', price: 60 },

    { id: 'p-truco',     game: 'truco',     age: 'pri', price: 0 },
    { id: 'p-atrapa',    game: 'atrapa',    age: 'pri', price: 0 },
    { id: 'p-memoria',   game: 'memoria',   age: 'pri', price: 0 },
    { id: 'p-fabrica',   game: 'fabrica',   age: 'pri', price: 40 },
    { id: 'p-fantasma',  game: 'fantasma',  age: 'pri', price: 60 },
    { id: 'p-parejas',   game: 'parejas',   age: 'pri', price: 60 },
    { id: 'p-calabaza',  game: 'calabaza',  age: 'pri', price: 80 },
    { id: 'p-escobas',   game: 'escobas',   age: 'pri', price: 100 },
    { id: 'p-pociones',  game: 'pociones',  age: 'pri', price: 120 },
    { id: 'p-laberinto', game: 'laberinto', age: 'pri', price: 150 }
  ],

  /* ── Cestas alternativas (la «clasica» es gratis) ─────────────── */
  baskets: [
    { id: 'clasica',    price: 0 },
    { id: 'bruja',      price: 30 },
    { id: 'gato',       price: 50 },
    { id: 'murcielago', price: 70 },
    { id: 'dorada',     price: 120 }
  ],

  /* ── Colección de fantasmas (se «descubren» pagando) ──────────── */
  ghosts: [
    { id: 'boo',      price: 15 },
    { id: 'rosita',   price: 20 },
    { id: 'azulin',   price: 25 },
    { id: 'verdoso',  price: 30 },
    { id: 'brujo',    price: 40 },
    { id: 'rey',      price: 50 },
    { id: 'pirata',   price: 60 },
    { id: 'dormilon', price: 70 }
  ]
};
