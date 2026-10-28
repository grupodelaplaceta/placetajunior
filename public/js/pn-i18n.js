/* Placeta Junior · Primaria Nueva · traducciones (es · ca · en)
   Idioma: el mismo de la web (localStorage 'junior_acc_web' → idioma). 'val' se trata como 'ca'.
   Para añadir euskera (eu): copiar el bloque 'es' y traducir. Si falta una clave, t() cae en español. */
(function () {
  'use strict';
  const T = {
    es: {
      'vert.blank': 'En esta columna no hace falta escribir nada.', 
      back: 'Volver', prev: 'Anterior', catalog: 'Actividades de Primaria', play: 'Jugar', start: 'Empezar', done: 'Actividad terminada', again: 'Repetir',
      check: 'Comprobar', clear: 'Borrar', hint: 'Pista', show: 'Ver la solución', tryagain: 'Inténtalo otra vez',
      ok: '¡Muy bien!', bad: '¡Casi!', next: 'Siguiente', answerWas: 'La respuesta era «{v}».',
      'geo.title': 'Geometría', 'geo.identify': '¿Qué figura es?', 'geo.sides': '¿Cuántos lados tiene?',
      'geo.classify': 'Busca la figura que {p}', 'geo.p.3': 'tiene 3 lados', 'geo.p.4': 'tiene 4 lados',
      'geo.p.4eq': 'tiene 4 lados iguales', 'geo.p.5': 'tiene 5 lados', 'geo.p.6': 'tiene 6 lados', 'geo.p.0': 'no tiene esquinas',
      'k.triangulo': 'Triángulo', 'k.cuadrado': 'Cuadrado', 'k.rectangulo': 'Rectángulo', 'k.rombo': 'Rombo',
      'k.circulo': 'Círculo', 'k.pentagono': 'Pentágono', 'k.hexagono': 'Hexágono',
      'din.title': 'Euros', 'din.count': '¿Cuánto dinero hay?', 'din.pay': 'Paga {p} con monedas y billetes',
      'din.change': 'Pagas con {paid} y cuesta {p}. ¿Cuánto cambio te dan?', 'din.paying': 'Tu pago',
      'din.wallet': 'Tu monedero', 'din.remove': 'Quitar', 'din.over': 'Te has pasado. Quita alguna moneda.', 'din.short': 'Te faltan {v}.',
      'vert.title': 'Sumas y restas', 'vert.q': 'Empieza por las unidades y sigue hacia la izquierda.', 'vert.carry': 'Me llevo',
      'vert.now': 'Ahora: {col}', 'vert.write': 'Escribe {r}.', 'vert.carryhint': 'Me llevo {c} a la columna de la izquierda.',
      'vert.borrowhint': 'No llega, así que pido 10 a la columna de la izquierda.',
      'vert.hint.add': '{a} + {b}{cin} = {s} en las {col}.', 'vert.hint.sub': '{top} − {b} = {r} en las {col}.',
      'vert.ok': '¡Columna correcta!', 'vert.err': 'Revisa esta columna. Mira el resultado y la llevada.',
      'col.0': 'unidades', 'col.1': 'decenas', 'col.2': 'centenas', 'col.3': 'unidades de millar', 'col.4': 'decenas de millar',
      'aba.title': 'Ábaco', 'aba.set': 'Pon el número {n} en el ábaco', 'aba.read': '¿Qué número marca el ábaco?',
      'aba.bead': 'Cuenta', 'aba.c0': 'U', 'aba.c1': 'D', 'aba.c2': 'C', 'aba.c3': 'UM', 'aba.wrong': 'Todavía no es ese número. Revisa las columnas.',
      'cm.title': 'Cálculo mental', 'cm.q': 'Calcula de cabeza y elige la respuesta', 'cm.suma': '{a} + {b}', 'cm.resta': '{a} − {b}',
      'cm.mas10': '¿Cuánto es 10 más que {a}?', 'cm.menos10': '¿Cuánto es 10 menos que {a}?', 'cm.doble': '¿Cuánto es el doble de {a}?',
      'cm.mitad': '¿Cuánto es la mitad de {a}?', 'cm.compl': '¿Cuánto le falta a {a} para {b}?', 'cm.x10': '{a} × 10', 'cm.mult': '{a} × {b}',
      'hora.title': 'Las horas', 'hora.read': '¿Qué hora marca el reloj?', 'hora.set': 'Pon el reloj a las {h}',
      'hora.dur': '¿Cuánto dura desde las {a} hasta las {b}?', 'hora.end': 'Empieza a las {a} y dura {d}. ¿A qué hora termina?',
      'hora.hour': 'Horas', 'hora.min': 'Minutos', 'hora.clock': 'Reloj analógico', 'hora.dur.hm': '{h} h {m} min',
      'hora.dur.h': '{h} h', 'hora.dur.m': '{m} min', 'hora.wrong': 'Todavía no. Ajusta las agujas.',
      'tes.title': 'Mapa del tesoro', 'tes.clue_q': 'Sigue la pista del pirata y marca dónde está el tesoro',
      'tes.prog_q': 'Programa el camino hasta el tesoro con flechas', 'tes.clue': 'Desde {s}, ve {m}.', 'tes.and': ' y luego ',
      'tes.cas1': 'casilla', 'tes.casn': 'casillas', 'tes.miss': 'Ahí no está. Vuelve a mirar la pista.', 'tes.off': 'Te sales del mapa.',
      'tes.no': 'Todavía no llegas al tesoro.', 'tes.run': 'Ejecutar', 'tes.undo': 'Quitar la última', 'tes.route': 'Tu ruta',
      'dir.n': 'hacia el norte', 'dir.s': 'hacia el sur', 'dir.e': 'hacia el este', 'dir.o': 'hacia el oeste',
      'dir.nb': 'Norte', 'dir.sb': 'Sur', 'dir.eb': 'Este', 'dir.ob': 'Oeste',
      'lm.palmera': 'la palmera', 'lm.roca': 'la roca', 'lm.barco': 'el barco', 'lm.faro': 'el faro',
      'sim.title': 'Simetría', 'sim.q': 'Dibuja el reflejo de la figura al otro lado del eje',
      'sim.bad': 'Hay casillas que no están bien reflejadas. Mira las marcadas.', 'sim.axv': 'vertical', 'sim.axh': 'horizontal',
      'sim.axis': 'Eje {a}', 'sim.sol': 'Mira la parte izquierda: cada casilla se refleja a la misma distancia del eje.',
      'pat.title': 'Patrones', 'pat.shape': '¿Qué pieza continúa el patrón?', 'pat.num': '¿Qué número sigue?',
      'f.circle': 'círculo', 'f.square': 'cuadrado', 'f.triangle': 'triángulo', 'f.star': 'estrella',
      'bat.title': 'Hundir la flota', 'bat.q': 'Resuelve y dispara a la casilla que sale', 'bat.add': '{a} + {b}', 'bat.sub': '{a} − {b}',
      'bat.wrong': 'Ese no es el resultado. Prueba otra.', 'bat.stat': 'Barcos hundidos: {a} de {b}', 'bat.cell': 'Casilla {n}',
      'bat.hit': 'Tocado', 'bat.water': 'Agua',
      'tan.title': 'Tangram', 'tan.complete': '¿Qué pieza falta para completar la figura?', 'tan.count_tri': '¿Cuántos triángulos tiene el tangram?',
      'tan.count_sq': '¿Cuántos cuadrados tiene?', 'tan.count_all': '¿Cuántas piezas tiene el tangram?',
      'tan.identify': '¿Qué forma tiene la pieza marcada?', 'tan.big': 'Triángulo grande', 'tan.mid': 'Triángulo mediano',
      'tan.small': 'Triángulo pequeño', 'tan.sq': 'Cuadrado', 'tan.pal': 'Estilo', 'tan.pal.clasico': 'Clásico', 'tan.pal.pastel': 'Pastel',
      'tan.pal.neon': 'Neón', 'tan.pal.madera': 'Madera', 'tan.pal.silueta': 'Silueta'
    },
    ca: {
      'vert.blank': 'En aquesta columna no cal escriure res.', 
      back: 'Tornar', prev: 'Anterior', catalog: 'Activitats de Primària', play: 'Jugar', start: 'Començar', done: 'Activitat acabada', again: 'Repetir',
      check: 'Comprova', clear: 'Esborra', hint: 'Pista', show: 'Veure la solució', tryagain: 'Torna-ho a provar',
      ok: 'Molt bé!', bad: 'Gairebé!', next: 'Següent', answerWas: 'La resposta era «{v}».',
      'geo.title': 'Geometria', 'geo.identify': 'Quina figura és?', 'geo.sides': 'Quants costats té?',
      'geo.classify': 'Busca la figura que {p}', 'geo.p.3': 'té 3 costats', 'geo.p.4': 'té 4 costats',
      'geo.p.4eq': 'té 4 costats iguals', 'geo.p.5': 'té 5 costats', 'geo.p.6': 'té 6 costats', 'geo.p.0': 'no té cantonades',
      'k.triangulo': 'Triangle', 'k.cuadrado': 'Quadrat', 'k.rectangulo': 'Rectangle', 'k.rombo': 'Rombe',
      'k.circulo': 'Cercle', 'k.pentagono': 'Pentàgon', 'k.hexagono': 'Hexàgon',
      'din.title': 'Euros', 'din.count': 'Quants diners hi ha?', 'din.pay': 'Paga {p} amb monedes i bitllets',
      'din.change': 'Pagues amb {paid} i costa {p}. Quant canvi et donen?', 'din.paying': 'El teu pagament',
      'din.wallet': 'El teu moneder', 'din.remove': 'Treure', 'din.over': 'T’has passat. Treu alguna moneda.', 'din.short': 'Et falten {v}.',
      'vert.title': 'Sumes i restes', 'vert.q': 'Comença per les unitats i segueix cap a l’esquerra.', 'vert.carry': 'M’emporto',
      'vert.now': 'Ara: {col}', 'vert.write': 'Escriu {r}.', 'vert.carryhint': 'M’emporto {c} a la columna de l’esquerra.',
      'vert.borrowhint': 'No arriba, així que demano 10 a la columna de l’esquerra.',
      'vert.hint.add': '{a} + {b}{cin} = {s} a les {col}.', 'vert.hint.sub': '{top} − {b} = {r} a les {col}.',
      'vert.ok': 'Columna correcta!', 'vert.err': 'Revisa aquesta columna. Mira el resultat i l’emportada.',
      'col.0': 'unitats', 'col.1': 'desenes', 'col.2': 'centenes', 'col.3': 'unitats de milers', 'col.4': 'desenes de milers',
      'aba.title': 'Àbac', 'aba.set': 'Posa el número {n} a l’àbac', 'aba.read': 'Quin número marca l’àbac?',
      'aba.bead': 'Conta', 'aba.c0': 'U', 'aba.c1': 'D', 'aba.c2': 'C', 'aba.c3': 'UM', 'aba.wrong': 'Encara no és aquest número. Revisa les columnes.',
      'cm.title': 'Càlcul mental', 'cm.q': 'Calcula de cap i tria la resposta', 'cm.suma': '{a} + {b}', 'cm.resta': '{a} − {b}',
      'cm.mas10': 'Quant és 10 més que {a}?', 'cm.menos10': 'Quant és 10 menys que {a}?', 'cm.doble': 'Quant és el doble de {a}?',
      'cm.mitad': 'Quant és la meitat de {a}?', 'cm.compl': 'Quant li falta a {a} per arribar a {b}?', 'cm.x10': '{a} × 10', 'cm.mult': '{a} × {b}',
      'hora.title': 'Les hores', 'hora.read': 'Quina hora marca el rellotge?', 'hora.set': 'Posa el rellotge a les {h}',
      'hora.dur': 'Quant dura des de les {a} fins a les {b}?', 'hora.end': 'Comença a les {a} i dura {d}. A quina hora acaba?',
      'hora.hour': 'Hores', 'hora.min': 'Minuts', 'hora.clock': 'Rellotge analògic', 'hora.dur.hm': '{h} h {m} min',
      'hora.dur.h': '{h} h', 'hora.dur.m': '{m} min', 'hora.wrong': 'Encara no. Ajusta les busquetes.',
      'tes.title': 'Mapa del tresor', 'tes.clue_q': 'Segueix la pista del pirata i marca on és el tresor',
      'tes.prog_q': 'Programa el camí fins al tresor amb fletxes', 'tes.clue': 'Des de {s}, ves {m}.', 'tes.and': ' i després ',
      'tes.cas1': 'casella', 'tes.casn': 'caselles', 'tes.miss': 'Aquí no és. Torna a mirar la pista.', 'tes.off': 'Surts del mapa.',
      'tes.no': 'Encara no arribes al tresor.', 'tes.run': 'Executa', 'tes.undo': 'Treu l’última', 'tes.route': 'La teva ruta',
      'dir.n': 'cap al nord', 'dir.s': 'cap al sud', 'dir.e': 'cap a l’est', 'dir.o': 'cap a l’oest',
      'dir.nb': 'Nord', 'dir.sb': 'Sud', 'dir.eb': 'Est', 'dir.ob': 'Oest',
      'lm.palmera': 'la palmera', 'lm.roca': 'la roca', 'lm.barco': 'el vaixell', 'lm.faro': 'el far',
      'sim.title': 'Simetria', 'sim.q': 'Dibuixa el reflex de la figura a l’altre costat de l’eix',
      'sim.bad': 'Hi ha caselles que no estan ben reflectides. Mira les marcades.', 'sim.axv': 'vertical', 'sim.axh': 'horitzontal',
      'sim.axis': 'Eix {a}', 'sim.sol': 'Mira la part esquerra: cada casella es reflecteix a la mateixa distància de l’eix.',
      'pat.title': 'Patrons', 'pat.shape': 'Quina peça continua el patró?', 'pat.num': 'Quin número segueix?',
      'f.circle': 'cercle', 'f.square': 'quadrat', 'f.triangle': 'triangle', 'f.star': 'estrella',
      'bat.title': 'Enfonsar vaixells', 'bat.q': 'Resol i dispara a la casella que surt', 'bat.add': '{a} + {b}', 'bat.sub': '{a} − {b}',
      'bat.wrong': 'Aquest no és el resultat. Prova-ho de nou.', 'bat.stat': 'Vaixells enfonsats: {a} de {b}', 'bat.cell': 'Casella {n}',
      'bat.hit': 'Tocat', 'bat.water': 'Aigua',
      'tan.title': 'Tangram', 'tan.complete': 'Quina peça falta per completar la figura?', 'tan.count_tri': 'Quants triangles té el tangram?',
      'tan.count_sq': 'Quants quadrats té?', 'tan.count_all': 'Quantes peces té el tangram?',
      'tan.identify': 'Quina forma té la peça marcada?', 'tan.big': 'Triangle gran', 'tan.mid': 'Triangle mitjà',
      'tan.small': 'Triangle petit', 'tan.sq': 'Quadrat', 'tan.pal': 'Estil', 'tan.pal.clasico': 'Clàssic', 'tan.pal.pastel': 'Pastel',
      'tan.pal.neon': 'Neó', 'tan.pal.madera': 'Fusta', 'tan.pal.silueta': 'Silueta'
    },
    en: {
      'vert.blank': 'Nothing needs to be written in this column.', 
      back: 'Back', prev: 'Previous', catalog: 'Primary school activities', play: 'Play', start: 'Start', done: 'Activity finished', again: 'Play again',
      check: 'Check', clear: 'Clear', hint: 'Hint', show: 'Show answer', tryagain: 'Try again',
      ok: 'Well done!', bad: 'Almost!', next: 'Next', answerWas: 'The answer was “{v}”.',
      'geo.title': 'Geometry', 'geo.identify': 'Which shape is it?', 'geo.sides': 'How many sides does it have?',
      'geo.classify': 'Find the shape that {p}', 'geo.p.3': 'has 3 sides', 'geo.p.4': 'has 4 sides',
      'geo.p.4eq': 'has 4 equal sides', 'geo.p.5': 'has 5 sides', 'geo.p.6': 'has 6 sides', 'geo.p.0': 'has no corners',
      'k.triangulo': 'Triangle', 'k.cuadrado': 'Square', 'k.rectangulo': 'Rectangle', 'k.rombo': 'Rhombus',
      'k.circulo': 'Circle', 'k.pentagono': 'Pentagon', 'k.hexagono': 'Hexagon',
      'din.title': 'Money', 'din.count': 'How much money is there?', 'din.pay': 'Pay {p} with coins and bills',
      'din.change': 'You pay with {paid} and it costs {p}. How much change do you get?', 'din.paying': 'Your payment',
      'din.wallet': 'Your wallet', 'din.remove': 'Remove', 'din.over': 'You paid too much. Remove a coin.', 'din.short': 'You still need {v}.',
      'vert.title': 'Addition and subtraction', 'vert.q': 'Start with the ones and move left.', 'vert.carry': 'Carry',
      'vert.now': 'Now: {col}', 'vert.write': 'Write {r}.', 'vert.carryhint': 'Carry {c} to the column on the left.',
      'vert.borrowhint': 'Not enough, so borrow 10 from the column on the left.',
      'vert.hint.add': '{a} + {b}{cin} = {s} in the {col}.', 'vert.hint.sub': '{top} − {b} = {r} in the {col}.',
      'vert.ok': 'Column correct!', 'vert.err': 'Check this column. Look at the result and the carry.',
      'col.0': 'ones', 'col.1': 'tens', 'col.2': 'hundreds', 'col.3': 'thousands', 'col.4': 'ten thousands',
      'aba.title': 'Abacus', 'aba.set': 'Set the number {n} on the abacus', 'aba.read': 'What number does the abacus show?',
      'aba.bead': 'Bead', 'aba.c0': 'Ones', 'aba.c1': 'Tens', 'aba.c2': 'Hundreds', 'aba.c3': 'Thousands', 'aba.wrong': 'Not that number yet. Check the rods.',
      'cm.title': 'Mental maths', 'cm.q': 'Solve in your head and pick the answer', 'cm.suma': '{a} + {b}', 'cm.resta': '{a} − {b}',
      'cm.mas10': 'What is 10 more than {a}?', 'cm.menos10': 'What is 10 less than {a}?', 'cm.doble': 'What is double {a}?',
      'cm.mitad': 'What is half of {a}?', 'cm.compl': 'How much is missing from {a} to reach {b}?', 'cm.x10': '{a} × 10', 'cm.mult': '{a} × {b}',
      'hora.title': 'Time', 'hora.read': 'What time does the clock show?', 'hora.set': 'Set the clock to {h}',
      'hora.dur': 'How long is it from {a} to {b}?', 'hora.end': 'It starts at {a} and lasts {d}. What time does it end?',
      'hora.hour': 'Hours', 'hora.min': 'Minutes', 'hora.clock': 'Analog clock', 'hora.dur.hm': '{h} h {m} min',
      'hora.dur.h': '{h} h', 'hora.dur.m': '{m} min', 'hora.wrong': 'Not yet. Adjust the hands.',
      'tes.title': 'Treasure map', 'tes.clue_q': 'Follow the pirate’s clue and mark where the treasure is',
      'tes.prog_q': 'Program the path to the treasure with arrows', 'tes.clue': 'From {s}, go {m}.', 'tes.and': ' and then ',
      'tes.cas1': 'square', 'tes.casn': 'squares', 'tes.miss': 'It’s not there. Check the clue again.', 'tes.off': 'You go off the map.',
      'tes.no': 'You haven’t reached the treasure yet.', 'tes.run': 'Run', 'tes.undo': 'Remove last', 'tes.route': 'Your route',
      'dir.n': 'north', 'dir.s': 'south', 'dir.e': 'east', 'dir.o': 'west',
      'dir.nb': 'North', 'dir.sb': 'South', 'dir.eb': 'East', 'dir.ob': 'West',
      'lm.palmera': 'the palm tree', 'lm.roca': 'the rock', 'lm.barco': 'the ship', 'lm.faro': 'the lighthouse',
      'sim.title': 'Symmetry', 'sim.q': 'Draw the mirror image of the shape on the other side of the line',
      'sim.bad': 'Some squares are not mirrored correctly. Check the marked ones.', 'sim.axv': 'vertical', 'sim.axh': 'horizontal',
      'sim.axis': 'Axis: {a}', 'sim.sol': 'Look at the left side: each square mirrors to the same distance from the axis.',
      'pat.title': 'Patterns', 'pat.shape': 'Which piece continues the pattern?', 'pat.num': 'Which number comes next?',
      'f.circle': 'circle', 'f.square': 'square', 'f.triangle': 'triangle', 'f.star': 'star',
      'bat.title': 'Battleship', 'bat.q': 'Solve it and fire at the square it gives', 'bat.add': '{a} + {b}', 'bat.sub': '{a} − {b}',
      'bat.wrong': 'That is not the result. Try another one.', 'bat.stat': 'Ships sunk: {a} of {b}', 'bat.cell': 'Square {n}',
      'bat.hit': 'Hit', 'bat.water': 'Water',
      'tan.title': 'Tangram', 'tan.complete': 'Which piece is missing to complete the shape?', 'tan.count_tri': 'How many triangles does the tangram have?',
      'tan.count_sq': 'How many squares does it have?', 'tan.count_all': 'How many pieces does the tangram have?',
      'tan.identify': 'What shape is the highlighted piece?', 'tan.big': 'Large triangle', 'tan.mid': 'Medium triangle',
      'tan.small': 'Small triangle', 'tan.sq': 'Square', 'tan.pal': 'Style', 'tan.pal.clasico': 'Classic', 'tan.pal.pastel': 'Pastel',
      'tan.pal.neon': 'Neon', 'tan.pal.madera': 'Wood', 'tan.pal.silueta': 'Silhouette'
    }
  };

  function lang() {
    try {
      const v = String(JSON.parse(localStorage.getItem('junior_acc_web') || '{}').idioma || 'es').toLowerCase();
      return v === 'ca' || v === 'val' ? 'ca' : v === 'en' ? 'en' : 'es';
    } catch (e) { return 'es'; }
  }

  function t(k, v) {
    const dict = T[lang()] || T.es;
    let s = dict[k] != null ? dict[k] : (T.es[k] != null ? T.es[k] : k);
    if (v) s = s.replace(/\{(\w+)\}/g, (m, x) => (v[x] != null ? v[x] : m));
    return s;
  }

  // Importe en céntimos → "3,40 €" (es/ca) o "€3.40" (en)
  function eur(c) {
    const a = Math.abs(Math.round(c)), neg = c < 0 ? '-' : '', e = Math.floor(a / 100), ct = String(a % 100).padStart(2, '0');
    return lang() === 'en' ? neg + '€' + e + '.' + ct : neg + e + ',' + ct + ' €';
  }

  window.PJPNI = { T, t, lang, eur };
})();
