/* Registro compartido de modalidades por etapa educativa. */
(function () {
  'use strict';

  const catalogo = {
    infantil: {
      etiqueta: 'Infantil',
      edades: '3-5',
      tema: 'explora',
      tipos: ['numero_bloques', 'memoria', 'secuencia_visual', 'trazo', 'relacionar']
    },
    primaria: {
      etiqueta: 'Primaria',
      edades: '6-12',
      tema: 'descubre',
      tipos: ['test', 'calculo_mental', 'mapa_mundi', 'mapa_espana', 'code_blocks', 'cazador_errores']
    },
    secundaria: {
      etiqueta: 'Secundaria',
      edades: '12+',
      tema: 'resuelve',
      tipos: ['code_retos', 'escape_room', 'simulacion', 'debate', 'investigacion', 'cazador_errores']
    }
  };

  function etapaDeEdad(edad) {
    const min = Number(String(edad || '').match(/\d+/)?.[0]);
    if (Number.isFinite(min) && min <= 5) return 'infantil';
    if (Number.isFinite(min) && min >= 12) return 'secundaria';
    return 'primaria';
  }

  window.PJModalidades = { catalogo, etapaDeEdad };
})();
