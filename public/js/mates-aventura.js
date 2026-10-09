const MATES_AVENTURA_JUEGOS = {
  mates_pixel: 'Pixel matemático',
  mates_balanza: 'La balanza',
  mates_arcade: 'Arcade de operaciones',
  mates_rio: 'Cruza el río',
  mates_monstruo: 'Monstruo numérico',
  mates_fracciones: 'Fracciones musicales',
  mates_estimacion: 'Estimación',
  mates_ninja: 'Ninja de fracciones',
  mates_robots: 'Robots matemáticos',
  mates_slime: 'Slime de capacidad',
  mates_templo: 'Templo de espejos',
  mates_topo: 'Topo en la cuadrícula'
};

const MATES_AVENTURA_TEXTS = {
  'Pixel matemático': ['Píxel matemàtic', 'Matematikako pixela', 'Math pixel'],
  'La balanza': ['La balança', 'Balantza', 'The balance'],
  'Arcade de operaciones': ['Arcade d’operacions', 'Eragiketen arcadea', 'Operations arcade'],
  'Cruza el río': ['Travessa el riu', 'Ibaia zeharkatu', 'Cross the river'],
  'Monstruo numérico': ['Monstre numèric', 'Zenbaki-munstroa', 'Number monster'],
  'Fracciones musicales': ['Fraccions musicals', 'Zatikien musika', 'Musical fractions'],
  Estimación: ['Estimació', 'Estimazioa', 'Estimation'],
  'Ninja de fracciones': ['Ninja de fraccions', 'Zatikien ninja', 'Fraction ninja'],
  'Robots matemáticos': ['Robots matemàtics', 'Matematikako robotak', 'Math robots'],
  'Slime de capacidad': ['Slime de capacitat', 'Slimearen edukiera', 'Slime capacity'],
  'Templo de espejos': ['Temple de miralls', 'Ispiluen tenplua', 'Mirror temple'],
  'Topo en la cuadrícula': ['Talp a la quadrícula', 'Satorra sareta batean', 'Mole on the grid'],
  'Resuelve las operaciones para descubrir el dibujo.': ['Resol les operacions per descobrir el dibuix.', 'Ebatzi eragiketak marrazkia aurkitzeko.', 'Solve the sums to reveal the picture.'],
  'Equilibra la balanza colocando las pesas adecuadas.': ['Equilibra la balança amb les peses correctes.', 'Oreka ezazu balantza pisu egokiak erabiliz.', 'Balance the scale with the right weights.'],
  'Resuelve cada operación y elige el globo con la respuesta correcta.': ['Resol l’operació i tria el globus amb la resposta correcta.', 'Ebatzi eragiketa eta aukeratu erantzun zuzena duen globoa.', 'Solve the problem and choose the balloon with the right answer.'],
  'Ayuda a la rana a cruzar el río siguiendo la serie numérica.': ['Ajuda la granota a travessar el riu seguint els nombres.', 'Lagundu igelari ibaia zeharkatzen, zenbakiak jarraituz.', 'Help the frog cross the river by following the numbers.'],
  'Alimenta al monstruo con la cantidad exacta.': ['Dona al monstre la quantitat exacta.', 'Eman munstroari kopuru zehatza.', 'Feed the monster the right amount.'],
  'Completa el compás con las fracciones que forman el objetivo.': ['Completa el compàs amb les fraccions indicades.', 'Osatu konpasa adierazitako zatikiekin.', 'Complete the measure with the given fractions.'],
  'Calcula una estimación y dispara a la respuesta más cercana.': ['Calcula aproximadament i dispara al resultat més pròxim.', 'Kalkulatu gutxi gorabehera eta jaurti emaitza hurbilenera.', 'Estimate the answer and shoot the closest target.'],
  'Corta la figura para obtener la fracción indicada.': ['Talla la figura per obtindre la fracció indicada.', 'Ebaki irudia eskatutako zatikia lortzeko.', 'Cut the shape to make the given fraction.'],
  'Elige los chips que transforman la entrada en la salida.': ['Tria els xips per transformar l’entrada en l’eixida.', 'Aukeratu sarrera irteera bihurtzeko txipak.', 'Choose the chips that change the input into the output.'],
  'Llena el recipiente hasta alcanzar la capacidad objetivo.': ['Ompli el recipient fins a la marca.', 'Bete ontzia markaraino.', 'Fill the container to the line.'],
  'Gira el espejo hasta dirigir la luz hacia la salida.': ['Gira l’espill i porta la llum fins a l’eixida.', 'Biratu ispilua argia irteerara eramateko.', 'Turn the mirror to guide the light to the exit.'],
  'Encuentra el tesoro siguiendo las coordenadas.': ['Troba el tresor amb les coordenades.', 'Aurkitu altxorra amb les coordenades.', 'Find the treasure using coordinates.'],
  '¡Actividad completada!': ['Activitat completada!', 'Jarduera osatuta!', 'Activity complete!'],
  Continuar: ['Continua', 'Jarraitu', 'Continue'],
  'Mates Aventura': ['Mates Aventura', 'Matematika Abentura', 'Math Adventure'],
  Sonido: ['So', 'Soinua', 'Sound'],
  activado: ['activat', 'aktibatuta', 'on'],
  silenciado: ['silenciat', 'isilduta', 'off'],
  Inicio: ['Inici', 'Hasiera', 'Start'],
  agudo: ['agut', 'zorrotza', 'acute'],
  recto: ['recte', 'zuzena', 'right'],
  obtuso: ['obtús', 'kamutsa', 'obtuse'],
  'No se pudo configurar esta actividad': ['No s’ha pogut configurar aquesta activitat', 'Ezin izan da jarduera hau konfiguratu', 'This activity could not be configured'],
  'Tipo de actividad de Mates Aventura no reconocido.': ['Tipus d’activitat de Mates Aventura desconegut.', 'Mates Abenturako jarduera mota ezezaguna.', 'Unknown Mates Aventura activity type.'],
  'Los datos de la actividad de Mates Aventura no son válidos.': ['Les dades de l’activitat de Mates Aventura no són vàlides.', 'Mates Abenturako jardueraren datuak ez dira baliozkoak.', 'The Mates Aventura activity data is invalid.'],
  'Sonido activado': ['So activat', 'Soinua aktibatuta', 'Sound on'],
  'Sonido silenciado': ['So silenciat', 'Soinua isilduta', 'Sound off'],
  'Toca la casilla exacta': [
    'Busca la casella amb les coordenades indicades.',
    'Bilatu emandako koordenatuetako laukia.',
    'Find the square at the given coordinates.'
  ],
  'Celdas pintadas: {0} de 64': ['Caselles pintades: {0} de 64', 'Margotutako laukiak: {0}/64', 'Squares painted: {0} of 64'],
  'Arrastra las cajas hasta la boca del monstruo (o simplemente tócalas). Cada decena mide 10 veces una unidad y cada centena 10 veces la decena.': [
    'Arrossega les caixes fins a la boca del monstre (o toca-les). Cada desena són 10 unitats i cada centena són 10 desenes.',
    'Arrastatu kaxak munstroaren ahora (edo ukitu). Hamarren bakoitza 10 unitate da, eta ehuneko bakoitza 10 hamarreko.',
    'Drag the boxes to the monster’s mouth (or tap them). Each ten is 10 ones, and each hundred is 10 tens.'
  ],
  'Completa el compás con fracciones. Toca una nota puesta para quitarla. Si suma justo, suena genial y desbloqueas instrumentos.': [
    'Completa el compàs amb fraccions. Toca una nota per llevar-la. Si la suma és exacta, sona genial i desbloqueges instruments.',
    'Osatu konpasa zatikiekin. Ukitu jarritako nota kentzeko. Batura zehatza bada, primeran joko du eta tresnak desblokeatuko dituzu.',
    'Fill the measure with fractions. Tap a note to remove it. Make the exact sum to play a perfect tune and unlock instruments.'
  ],
  'Gira el espejo arrastrando por el aro graduado (o con los botones). El ángulo se mide desde la horizontal.': [
    'Gira l’espill arrossegant-lo pel cercle graduat (o amb els botons). L’angle es mesura des de l’horitzontal.',
    'Biratu ispilua graduatutako eraztunean arrastatuz (edo botoiak erabiliz). Angelua horizontaletik neurtzen da.',
    'Rotate the mirror by dragging it around the marked dial (or use the buttons). Angles are measured from the horizontal.'
  ],
  'Pasa el dedo (o el ratón) de lado a lado de la figura. Un buen corte deja un trozo del tamaño pedido.': [
    'Passa el dit (o el ratolí) d’un costat a l’altre de la figura. El tall correcte deixa la fracció indicada.',
    'Pasatu hatza (edo sagua) irudiaren alde batetik bestera. Ebaki on batek eskatutako zatia uzten du.',
    'Swipe (or drag) from one side of the shape to the other. Make a clean cut that leaves the requested fraction.'
  ],
  'Toca las pesas para ponerlas a la derecha; toca una puesta para quitarla.': [
    'Toca les peses per posar-les a la dreta; torna a tocar-ne una per llevar-la.',
    'Ukitu pisuak eskuinean jartzeko; ukitu jarritako bat kentzeko.',
    'Tap weights to place them on the right; tap a placed weight to remove it.'
  ],
  'Toca las pesas para ponerlas en la balanza; vuelve a tocarlas para quitarlas.': [
    'Toca les peses per posar-les a la balança; torna a tocar-les per llevar-les.',
    'Ukitu pisuak balantzan jartzeko; ukitu berriro kentzeko.',
    'Tap the weights to place them on the scale; tap them again to remove them.'
  ],
  'Toca el globo con el resultado antes de que se escape. Fallar cuesta un corazón.': [
    'Toca el globus amb el resultat correcte abans que s’escapi. Si falles, perds un cor.',
    'Ukitu emaitza duen globoa ihes egin aurretik. Huts eginez gero, bihotz bat galduko duzu.',
    'Pop the balloon with the correct answer before it escapes. A wrong answer costs one heart.'
  ],
  '¿Qué chip falta? Arrástralo a la máquina (o tócalo) y pulsa Probar.': [
    'Quin xip falta? Arrossega’l fins a la màquina (o toca’l) i prem «Prova».',
    'Zein txip falta da? Arrastatu makinara (edo ukitu) eta sakatu «Probatu».',
    'Which chip is missing? Drag it to the machine (or tap it), then choose Test.'
  ],
  'Toca el número más cercano a la marca. Después verás cuánto te has acercado.': [
    'Toca el número més pròxim a la marca. Després veuràs quant t’hi has acostat.',
    'Ukitu markatik gertuen dagoen zenbakia. Gero, zenbat hurbildu zaren ikusiko duzu.',
    'Choose the number closest to the mark to see how close your estimate was.'
  ],
  'Primero pon un chip en la máquina': ['Primer posa un xip a la màquina', 'Lehenik, jarri txip bat makinan', 'Place a chip in the machine first'],
  'Llena el matraz hasta la línea dorada': ['Ompli el matràs fins a la línia daurada', 'Bete matrazea urrezko marraraino', 'Fill the flask to the golden line'],
  'Matraz vacío': ['Matràs buit', 'Matrazea hutsik dago', 'The flask is empty'],
  'Toca las notas para completar la fracción objetivo.': ['Toca les notes per completar la fracció objectiu.', 'Ukitu notak helburuko zatikia osatzeko.', 'Tap notes to make the target fraction.'],
  '¿Qué lado pesa más?': ['Quin costat pesa més?', 'Zein alde da astunagoa?', 'Which side is heavier?'],
  '¿Qué porcentaje del depósito está lleno?': ['Quin percentatge del depòsit està ple?', 'Deposituaren zer ehuneko dago beteta?', 'What percentage of the tank is full?'],
  'Coloca el número {0} en la línea': ['Col·loca el número {0} a la recta', 'Kokatu {0} zenbakia zuzen zenbakidunean', 'Place {0} on the number line'],
  'Pon el espejo a {0}° (ángulo {1}) y emite la luz': ['Posa l’espill a {0}° (angle {1}) i envia el raig de llum.', 'Jarri ispilua {0}°-tan (angelu {1}) eta bidali argi-izpia.', 'Set the mirror to {0}° ({1} angle), then send the light beam.'],
  'Corta un trozo que sea {0} de {1}': ['Talla una peça que siga {0} de {1}', 'Ebaki {1} irudiaren {0} den zati bat', 'Cut a piece that is {0} of the {1}'],
  'Corta la figura para obtener la fracción indicada.': ['Talla la figura per obtindre la fracció indicada.', 'Ebaki irudia emandako zatikia lortzeko.', 'Cut the shape to get the requested fraction.'],
  'El corte tiene que atravesar la figura': ['El tall ha de travessar tota la figura', 'Ebakiak irudia alde batetik bestera zeharkatu behar du', 'The cut must go all the way across the shape'],
  'El tesoro está en el punto ({0}, {1}). Primero x (columna), luego y (fila contando desde abajo)': [
    'El tresor és al punt ({0}, {1}). Primer x (columna) i després y (fila, comptant des de baix).',
    'Altxorra ({0}, {1}) puntuan dago. Lehenik x (zutabea), gero y (errenkada, behetik zenbatuta).',
    'The treasure is at ({0}, {1}). Enter x (column) first, then y (row, counting from the bottom).'
  ],
  'El tesoro está en la columna {0}, fila {1}': ['El tresor és a la columna {0}, fila {1}', 'Altxorra {0}. zutabean eta {1}. errenkadan dago', 'The treasure is in column {0}, row {1}'],
  '¿Qué chip hace que el {0} salga como {1}?': ['Quin xip transforma {0} en {1}?', 'Zein txipek bihurtzen du {0} {1}?', 'Which chip changes {0} into {1}?'],
  'Llevas {0}': ['En portes {0}', '{0} daramatzazu', 'You have {0}'],
  '¡Delicioso! Exactamente {0}': ['Deliciós! Exactament {0}', 'Goxoa! Zehazki {0}', 'Delicious! Exactly {0}'],
  '¡Fin! {0} aciertos': ['Fi! {0} encerts', 'Amaitu da! {0} asmatze', 'Time! {0} correct'],
  '¡Funciona! {0} = {1}': ['Funciona! {0} = {1}', 'Funtzionatzen du! {0} = {1}', 'It works! {0} = {1}'],
  '¡Splat! Te pasaste {0} L': ['Splat! T’has passat {0} L', 'Splat! {0} L gehiegi bota dituzu', 'Splat! You added {0} L too much'],
  '¡A destiempo! Faltan {0} octavo(s)': ['Fora de temps! Falten {0} huitens', 'Desegokia! {0} zortziren falta dira', 'Out of tune! {0} eighth(s) still needed'],
  '¡Desafinado! Te pasas {0} octavo(s)': ['Desafinat! T’has passat {0} huitens', 'Desafinatuta! {0} zortziren gehiegi daude', 'Out of tune! You added {0} eighth(s) too many'],
  '¡Sí! {0} {1} {2}': ['Sí! {0} {1} {2}', 'Bai! {0} {1} {2}', 'Yes! {0} {1} {2}'],
  '¡BUUURP! Te pasaste ({0}). ¡Otra vez!': ['BURP! T’has passat ({0}). Torna-ho a provar!', 'BUUURP! Gehiegi ({0}). Saiatu berriro!', 'BUUURP! Too much ({0}). Try again!'],
  'Ups, es {0} {1} {2}. Siguiente reto': ['Ui! És {0} {1} {2}. Següent repte', 'Kontuz! {0} {1} {2} da. Hurrengo erronka', 'Oops, it is {0} {1} {2}. Next challenge'],
  'La máquina tose: {0} = {1}, y se pedía {2}': ['La màquina estossega: {0} = {1}, però es demanava {2}', 'Makinak eztul egin du: {0} = {1}, baina {2} behar zen', 'The machine coughs: {0} = {1}, but the target was {2}'],
  '¡Plof! Llegaste a {0} saltos. Nuevo reto': ['Plof! Has fet {0} salts. Nou repte', 'Plof! {0} salto egin dituzu. Erronka berria', 'Plop! You made {0} jumps. New challenge'],
  '¡Plof! La correcta es la que brilla. Siguiente reto': ['Plof! La correcta és la que brilla. Següent repte', 'Plof! Distira egiten duen erantzuna da zuzena. Hurrengo erronka', 'Plop! The glowing one is correct. Next challenge'],
  'Casi, estabas a {0} de distancia. Siguiente reto': ['Quasi! T’has quedat a {0}. Següent repte', 'Gertu! {0} unitatera geratu zara. Hurrengo erronka', 'Almost! You were {0} away. Next challenge'],
  'Casi, estabas a {0} de distancia. Era el {1} %. Siguiente reto': ['Quasi! T’has quedat a {0}. Era el {1}%. Següent repte', 'Gertu! {0} unitatera geratu zara. Helburua %{1} zen. Hurrengo erronka', 'Almost! You were {0} away. The target was {1}%. Next challenge'],
  'Boing. Ese trozo es el {0}% y se pedía {1}%': ['Boing! El tros és del {0}% i en calia un {1}%.', 'Boing! Zati hori %{0} da, eta %{1} eskatu da.', 'Boing! That piece is {0}%; the target was {1}%.'],
  'El monstruo es muy pequeño, se encoge de hombros y pide más': ['El monstre és massa menut: s’arronsa de muscles i en demana més.', 'Munstroa txikiegia da: sorbaldak jaso eta gehiago eskatu du.', 'The monster is too small, shrugs, and asks for more.'],
  'El rayo rebotó mal y chocó con la pared. ¡Pobre murciélago! (espejo a {0}°)': ['El raig ha rebotat malament i ha topat amb la paret. Pobre ratpenat! (espill a {0}°)', 'Izpiak gaizki egin du errebot eta horma jo du. Saguzar gizajoa! (ispilua {0}°-tan)', 'The beam bounced the wrong way and hit the wall. Poor bat! (mirror at {0}°)'],
  'Salta solo por las piedras con número par': ['Salta només per les pedres amb nombre parell', 'Salto egin zenbaki bikoitidun harrietatik bakarrik', 'Jump only on stones with even numbers'],
  '¡Salta sumando de {0} en {0}. Si te caes, empieza otro reto.': ['Salta sumant de {0} en {0}. Si caus, comença un altre repte.', 'Egin salto {0}naka zenbatuz. Eroriz gero, hasi beste erronka bat.', 'Jump by {0}s. If you fall, start a new challenge.'],
  'Objetivo superado. Saltos: {0} | Aciertos: {1} | Caídas: {2}': ['Objectiu superat. Salts: {0} | Encerts: {1} | Caigudes: {2}', 'Helburua gaindituta. Jauziak: {0} | Asmatutakoak: {1} | Erorketak: {2}', 'Goal reached. Jumps: {0} | Correct: {1} | Falls: {2}'],
  'Saltos: {0} de {1} | Aciertos: {2} | Caídas: {3}': ['Salts: {0} de {1} | Encerts: {2} | Caigudes: {3}', 'Jauziak: {0}/{1} | Asmatutakoak: {2} | Erorketak: {3}', 'Jumps: {0} of {1} | Correct: {2} | Falls: {3}'],
  'Casi… ¡prueba otra vez!': ['Gairebé… torna-ho a provar!', 'Gertu… saiatu berriro!', 'Almost… try again!'],
  '¡Correcto!': ['Correcte!', 'Zuzena!', 'Correct!'],
  '¡Dibujo completo! ¡Eres genial!': ['Dibuix complet! Ho has fet molt bé!', 'Marrazkia osatuta! Primeran egin duzu!', 'Picture complete! Great work!'],
  '¡Equilibrio perfecto!': ['Equilibri perfecte!', 'Oreka perfektua!', 'Perfect balance!'],
  'Aún falta peso a la derecha': ['Encara falta pes a la dreta', 'Oraindik pisu gehiago behar da eskuinean', 'Add more weight to the right side'],
  'Te pasaste: pesa más la derecha': ['T’has passat: pesa més la dreta', 'Gehiegi: eskuina astunagoa da', 'Too much: the right side is heavier'],
  'Si fallas, la balanza te lo enseña y pasas al siguiente reto.': [
    'Si t’equivoques, la balança t’ajuda a veure-ho i després continues amb el repte següent.',
    'Oker eginez gero, balantzak erakutsiko dizu, eta hurrengo erronkara pasatuko zara.',
    'If you get it wrong, the scale shows you why, then you move on to the next challenge.'
  ],
  '¡Swish! Corte limpio': ['Swish! Tall net', 'Swish! Ebaki garbia', 'Swish! Clean cut'],
  '¡Salto perfecto!': ['Salt perfecte!', 'Salto perfektua!', 'Perfect jump!'],
  '¡Objetivo conseguido! Sigue tan lejos como quieras': ['Objectiu aconseguit! Continua tan lluny com vulgues.', 'Helburua lortu duzu! Jarraitu nahi duzun arte.', 'Goal reached! Keep going as far as you like.'],
  '¡El monstruo de slime ha cobrado vida!': ['El monstre de slime ha cobrat vida!', 'Slime-munstroa bizirik dago!', 'The slime monster has come to life!'],
  '¡La joya brilla y se abre la puerta!': ['La joia brilla i la porta s’obri!', 'Harria distiratsu dago eta atea ireki da!', 'The jewel shines and the door opens!'],
  '¡Tesoro encontrado!': ['Tresor trobat!', 'Altxorra aurkitu duzu!', 'Treasure found!'],
  'Casi. Mira la flecha: el tesoro estaba hacia allí': ['Gairebé! Mira la fletxa: el tresor era cap a eixa direcció.', 'Gertu! Begiratu geziari: altxorra norabide horretan zegoen.', 'Almost! Follow the arrow: the treasure was in that direction.'],
  '¡Todos los robots están despiertos!': ['Tots els robots estan desperts!', 'Robot guztiak esna daude!', 'All the robots are awake!'],
  '¡Armonía perfecta!': ['Harmonia perfecta!', 'Harmonia perfektua!', 'Perfect harmony!'],
  'Primero echa un poco de slime': ['Primer posa una miqueta de slime', 'Lehenik, bota slime pixka bat', 'Add a little slime first'],
  Borrar: ['Esborra', 'Ezabatu', 'Clear'],
  Cohete: ['Coet', 'Suziria', 'Rocket'],
  'Columna y fila': ['Columna i fila', 'Zutabea eta errenkada', 'Column and row'],
  Comprobar: ['Comprova', 'Egiaztatu', 'Check'],
  'Compás de': ['Compàs de', 'Konpasa:', 'Measure of'],
  'Coordenadas (x, y)': ['Coordenades (x, y)', 'Koordenatuak (x, y)', 'Coordinates (x, y)'],
  'DEBE SALIR': ['HA DE SORTIR', 'IRTEERA', 'OUTPUT'],
  'De 10 en 10': ['De 10 en 10', '10naka', 'By 10s'],
  'De 2 en 2': ['De 2 en 2', '2naka', 'By 2s'],
  'De 3 en 3': ['De 3 en 3', '3naka', 'By 3s'],
  'De 5 en 5': ['De 5 en 5', '5naka', 'By 5s'],
  'Depósito %': ['Dipòsit %', 'Gordailua %', 'Tank %'],
  Dibujo: ['Dibuix', 'Marrazkia', 'Picture'],
  Dino: ['Dino', 'Dino', 'Dino'],
  Disparar: ['Llança el raig', 'Tiro egin', 'Fire'],
  ENTRA: ['ENTRADA', 'SARRERA', 'INPUT'],
  'Emitir luz': ['Emet llum', 'Argia igorri', 'Send light'],
  Hasta: ['Fins a', 'Noiz arte', 'To'],
  Hecho: ['Fet', 'Eginda', 'Done'],
  Jugar: ['Juga', 'Jolastu', 'Play'],
  'Línea 0 a 10': ['Recta del 0 al 10', '0tik 10era arteko zuzena', 'Line from 0 to 10'],
  'Línea 0 a 100': ['Recta del 0 al 100', '0tik 100era arteko zuzena', 'Line from 0 to 100'],
  'Línea 0 a 1000': ['Recta del 0 al 1000', '0tik 1000era arteko zuzena', 'Line from 0 to 1000'],
  'Margen: ±5%': ['Marge: ±5%', 'Tartea: ±%5', 'Margin: ±5%'],
  Meta: ['Objectiu', 'Helburua', 'Goal'],
  Mezcla: ['Barreja', 'Nahastu', 'Mixed'],
  'Mitad / doble': ['Meitat / doble', 'Erdiak / bikoitza', 'Half / double'],
  Modo: ['Mode', 'Modua', 'Mode'],
  Nivel: ['Nivell', 'Maila', 'Level'],
  'Objetivo mínimo': ['Objectiu mínim', 'Gutxieneko helburua', 'Minimum goal'],
  'Objetivo:': ['Objectiu:', 'Helburua:', 'Target:'],
  Operaciones: ['Operacions', 'Eragiketak', 'Operations'],
  'Otra vez': ['Una altra vegada', 'Berriro', 'Again'],
  Probar: ['Prova', 'Probatu', 'Test'],
  'Pulsa Jugar': ['Prem Juga', 'Sakatu Jolastu', 'Press Play'],
  Regla: ['Regla', 'Araua', 'Rule'],
  Reiniciar: ['Reinicia', 'Berrabiarazi', 'Restart'],
  Restas: ['Restes', 'Kenketak', 'Subtraction'],
  Reto: ['Repte', 'Erronka', 'Challenge'],
  'Solo pares': ['Només parells', 'Bikoitiak bakarrik', 'Even numbers only'],
  Sumas: ['Sumes', 'Batuketak', 'Addition'],
  'Sumas y restas': ['Sumes i restes', 'Batuketak eta kenketak', 'Addition and subtraction'],
  Tablas: ['Taules', 'Biderketa-taulak', 'Times tables'],
  'Terminar este reto': ['Acaba aquest repte', 'Amaitu erronka hau', 'Finish this challenge'],
  Tipo: ['Tipus', 'Mota', 'Type'],
  Tocar: ['Toca', 'Ukitu', 'Tap'],
  Vaciar: ['Buida', 'Hustu', 'Empty'],
  'Ver contador': ['Mostra el comptador', 'Erakutsi kontagailua', 'Show counter'],
  Violín: ['Violí', 'Biolina', 'Violin'],
  '¡Más, por favor!': ['Més, per favor!', 'Gehiago, mesedez!', 'More, please!'],
  '¡Tengo hambre de…!': ['Tinc fam de…!', '… gose naiz!', 'I’m hungry for…!'],
  '¡Objetivo superado! Saltos: {0} de {1} | Aciertos: {2} | Caídas: {3}': ['Objectiu superat! Salts: {0} de {1} | Encerts: {2} | Caigudes: {3}', 'Helburua gaindituta! Jauziak: {0}/{1} | Asmatutakoak: {2} | Erorketak: {3}', 'Goal reached! Jumps: {0} of {1} | Correct: {2} | Falls: {3}'],
  'Completa las sumas para pintar el dibujo.': ['Resol les operacions per a pintar el dibuix.', 'Ebatzi batuketak marrazkia margotzeko.', 'Solve the sums to colour the picture.'],
  'Completa las operaciones para pintar el dibujo.': ['Resol les operacions per a pintar el dibuix.', 'Ebatzi eragiketak marrazkia margotzeko.', 'Solve the operations to colour the picture.']
};

const MATES_AVENTURA_TEXTS_ES = {
  'Toca la casilla exacta': 'Busca la casilla que corresponde a las coordenadas indicadas.',
  'Celdas pintadas: {0} de 64': 'Dibujo: {0} de 64 casillas completadas',
  'Coloca el número {0} en la línea': 'Sitúa el número {0} en el lugar que le corresponde en la recta numérica.',
  'Pon el espejo a {0}° (ángulo {1}) y emite la luz': 'Gira el espejo hasta {0}° (ángulo {1}) y pulsa para lanzar el rayo de luz.',
  'Corta un trozo que sea {0} de {1}': 'Corta la figura para que uno de los trozos represente {0} de {1}.',
  '¡Salta sumando de {0} en {0}. Si te caes, empieza otro reto.': 'Avanza sumando de {0} en {0}. Si eliges una piedra incorrecta, empieza un reto nuevo.',
  'El tesoro está en el punto ({0}, {1}). Primero x (columna), luego y (fila contando desde abajo)': 'Encuentra el tesoro en ({0}, {1}): indica primero x (columna) y después y (fila, desde abajo).',
  'El tesoro está en la columna {0}, fila {1}': 'Busca el tesoro en la columna {0} y la fila {1}.',
  '¿Qué chip hace que el {0} salga como {1}?': 'Elige el chip que transforma la entrada {0} en la salida {1}.',
  '¿Qué porcentaje del depósito está lleno?': 'Estima qué porcentaje de capacidad ocupa el líquido y elige la respuesta.',
  '¿Qué lado pesa más?': 'Compara los dos lados de la balanza y elige el signo correcto.',
  'Toca el globo con el resultado antes de que se escape. Fallar cuesta un corazón.': 'Resuelve la operación y toca el globo con la respuesta antes de que escape. Cada error resta un corazón.',
  'Toca las notas para completar la fracción objetivo.': 'Elige las notas cuya suma forme exactamente la fracción indicada.',
  '¿Qué chip falta? Arrástralo a la máquina (o tócalo) y pulsa Probar.': 'Completa la máquina: elige el chip que transforma la entrada en la salida.',
  'Si fallas, la balanza te lo enseña y pasas al siguiente reto.': 'Si no aciertas, observa hacia qué lado se inclina la balanza y prueba el reto siguiente.'
};

function matesAventuraLocale() {
  const supported = ['es', 'ca', 'eu', 'en', 'val'];
  if (supported.includes(window.__juniorLocale)) return window.__juniorLocale;
  try {
    const preferences = JSON.parse(window.localStorage.getItem('junior_acc_web') || '{}');
    if (supported.includes(preferences.idioma)) return preferences.idioma;
  } catch (_) { /* Use the document language if preferences are unavailable. */ }
  return supported.includes(document.documentElement?.lang) ? document.documentElement.lang : 'es';
}

function matesAventuraTranslate(text, language = matesAventuraLocale()) {
  const value = String(text);
  const key = value.trim().replace(/\s+/g, ' ');
  const match = key.match(/^(Celdas pintadas: )(\d+)( de 64)$/);
  const param = match && `Celdas pintadas: {0} de 64`;
  const translated = param && MATES_AVENTURA_TEXTS[param];
  if (match && translated) return (language === 'es'
    ? MATES_AVENTURA_TEXTS_ES[param]
    : translated[language === 'en' ? 2 : language === 'eu' ? 1 : 0]).replace('{0}', match[2]);
  const dynamic = [
    [/^Coloca el número (.+) en la línea$/, 'Coloca el número {0} en la línea'],
    [/^Pon el espejo a (.+)° \(ángulo (agudo|recto|obtuso)\) y emite la luz$/, 'Pon el espejo a {0}° (ángulo {1}) y emite la luz'],
    [/^Corta un trozo que sea (.+) de (.+)$/, 'Corta un trozo que sea {0} de {1}'],
    [/^El tesoro está en el punto \((.+), (.+)\)\. Primero x \(columna\), luego y \(fila contando desde abajo\)$/, 'El tesoro está en el punto ({0}, {1}). Primero x (columna), luego y (fila contando desde abajo)'],
    [/^El tesoro está en la columna (.+), fila (.+)$/, 'El tesoro está en la columna {0}, fila {1}'],
    [/^¿Qué chip hace que el (.+) salga como (.+)\?$/, '¿Qué chip hace que el {0} salga como {1}?'],
    [/^Llevas (.+)$/, 'Llevas {0}'],
    [/^¡BUUURP! Te pasaste \((.+)\). ¡Otra vez!$/, '¡BUUURP! Te pasaste ({0}). ¡Otra vez!'],
    [/^¡Delicioso! Exactamente (.+)$/, '¡Delicioso! Exactamente {0}'],
    [/^¡Fin! (.+) aciertos$/, '¡Fin! {0} aciertos'],
    [/^¡Funciona! (.+) = (.+)$/, '¡Funciona! {0} = {1}'],
    [/^¡Splat! Te pasaste (.+) L$/, '¡Splat! Te pasaste {0} L'],
    [/^¡A destiempo! Faltan (.+) octavo\(s\)$/, '¡A destiempo! Faltan {0} octavo(s)'],
    [/^¡Desafinado! Te pasas (.+) octavo\(s\)$/, '¡Desafinado! Te pasas {0} octavo(s)'],
    [/^¡Sí! (.+) (.+) (.+)$/, '¡Sí! {0} {1} {2}'],
    [/^Ups, es (.+) (.+) (.+)\. Siguiente reto$/, 'Ups, es {0} {1} {2}. Siguiente reto'],
    [/^La máquina tose: (.+) = (.+), y se pedía (.+)$/, 'La máquina tose: {0} = {1}, y se pedía {2}'],
    [/^¡Plof! Llegaste a (.+) saltos\. Nuevo reto$/, '¡Plof! Llegaste a {0} saltos. Nuevo reto'],
    [/^¡Plof! La correcta es la que brilla\. Siguiente reto$/, '¡Plof! La correcta es la que brilla. Siguiente reto'],
    [/^Objetivo superado\. Saltos: (.+) \| Aciertos: (.+) \| Caídas: (.+)$/, 'Objetivo superado. Saltos: {0} | Aciertos: {1} | Caídas: {2}'],
    [/^Saltos: (.+) de (.+) \| Aciertos: (.+) \| Caídas: (.+)$/, 'Saltos: {0} de {1} | Aciertos: {2} | Caídas: {3}'],
    [/^Casi, estabas a (.+) de distancia(?:\. Era (?:el )?(.+?) %)?\. Siguiente reto$/, key.includes('Era') ? 'Casi, estabas a {0} de distancia. Era el {1} %. Siguiente reto' : 'Casi, estabas a {0} de distancia. Siguiente reto'],
    [/^Boing\. Ese trozo es el (.+)% y se pedía (.+)%$/, 'Boing. Ese trozo es el {0}% y se pedía {1}%'],
    [/^El rayo rebotó mal y chocó con la pared\. ¡Pobre murciélago! \(espejo a (.+)°\)$/, 'El rayo rebotó mal y chocó con la pared. ¡Pobre murciélago! (espejo a {0}°)'],
    [/^Salta sumando de (.+) en (.+)\. Si te caes, empieza otro reto\.$/, '¡Salta sumando de {0} en {0}. Si te caes, empieza otro reto.']
  ];
  for (const [pattern, template] of dynamic) {
    const values = key.match(pattern);
    if (!values) continue;
    if (!template) continue;
    const source = MATES_AVENTURA_TEXTS[template] ? template : null;
    if (!source) continue;
    const translatedTemplate = language === 'es'
      ? MATES_AVENTURA_TEXTS_ES[source] || source
      : MATES_AVENTURA_TEXTS[source][language === 'en' ? 2 : language === 'eu' ? 1 : 0];
    return translatedTemplate.replace(/\{(\d+)\}/g, (_, index) => matesAventuraTranslate(values[Number(index) + 1], language));
  }
  const entry = MATES_AVENTURA_TEXTS[key];
  if (!entry) return value;
  if (language === 'es') return MATES_AVENTURA_TEXTS_ES[key] || key;
  return entry[language === 'en' ? 2 : language === 'eu' ? 1 : 0];
}

function matesAventuraEscape(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function matesAventuraRender(block, index, state) {
  const originalTitle = block.titulo || MATES_AVENTURA_JUEGOS[block.tipo];
  const title = originalTitle && matesAventuraTranslate(originalTitle);
  const defaultInstructions = {
    mates_pixel: 'Resuelve las operaciones para descubrir el dibujo.',
    mates_balanza: 'Equilibra la balanza colocando las pesas adecuadas.',
    mates_arcade: 'Resuelve cada operación y elige el globo con la respuesta correcta.',
    mates_rio: 'Ayuda a la rana a cruzar el río siguiendo la serie numérica.',
    mates_monstruo: 'Alimenta al monstruo con la cantidad exacta.',
    mates_fracciones: 'Completa el compás con las fracciones que forman el objetivo.',
    mates_estimacion: 'Calcula una estimación y dispara a la respuesta más cercana.',
    mates_ninja: 'Corta la figura para obtener la fracción indicada.',
    mates_robots: 'Elige los chips que transforman la entrada en la salida.',
    mates_slime: 'Llena el recipiente hasta alcanzar la capacidad objetivo.',
    mates_templo: 'Gira el espejo hasta dirigir la luz hacia la salida.',
    mates_topo: 'Encuentra el tesoro siguiendo las coordenadas.'
  };
  const locale = matesAventuraLocale();
  const prompt = block.instrucciones || block.instruccion || block.enunciado ||
    defaultInstructions[block.tipo];
  const instructions = prompt && typeof prompt === 'object' && !Array.isArray(prompt)
    ? prompt[locale] || prompt[locale === 'val' ? 'ca' : locale === 'ca' ? 'val' : 'es'] || prompt.es || Object.values(prompt).find(value => typeof value === 'string')
    : matesAventuraTranslate(prompt);
  if (!title) return `<p class="pj-error">${matesAventuraEscape(matesAventuraTranslate('Tipo de actividad de Mates Aventura no reconocido.'))}</p>`;
  if (state.completado) {
    return `<section class="pj-ma-card pj-ma-finished">
      <div class="pj-ma-heading"><span class="pj-ma-mark">★</span><div><h3>${matesAventuraEscape(title)}</h3><p>${matesAventuraEscape(matesAventuraTranslate('¡Actividad completada!'))}</p></div></div>
      <button class="pj-btn-primary" onclick="pantallaNext()">${matesAventuraEscape(matesAventuraTranslate('Continuar'))}</button>
    </section>`;
  }

  const config = matesAventuraEscape(JSON.stringify({
    tipo: block.tipo,
    titulo: title,
    enunciado: instructions,
    datos: block.datos && typeof block.datos === 'object' ? block.datos : {}
  }));
  return `<section class="pj-ma-card pj-ma-native"><pj-mates-aventura data-config="${config}"></pj-mates-aventura></section>`;
}

function matesAventuraCreateState() {
  return { completado: false };
}

document.addEventListener('pj-mates-complete', event => {
  if (!(event.target instanceof HTMLElement) || event.target.localName !== 'pj-mates-aventura') return;
  const screen = pantallas[pantallaIdx];
  const activity = screen?.tipo === 'mates_aventura' ? bloquesJuego[screen.bi] : null;
  const state = kpEstado[pantallaIdx];
  if (!activity || !state || state.completado || activity.tipo !== event.detail?.activityType) return;

  state.completado = true;
  if (window.pjSonido) pjSonido.victoria();
  if (typeof lluviaConfetti === 'function') lluviaConfetti();
  if (pantallas[pantallaIdx + 1]?.tipo === 'final') kpCelebrado = true;
  if (pantallaIdx < pantallas.length - 1) pantallaNext();
  else renderPantalla();
});

window.MATES_AVENTURA = {
  tipos: Object.keys(MATES_AVENTURA_JUEGOS),
  juegos: MATES_AVENTURA_JUEGOS,
  render: matesAventuraRender,
  createState: matesAventuraCreateState,
  translate: matesAventuraTranslate,
  locale: matesAventuraLocale,
  esTipo: tipo => Object.prototype.hasOwnProperty.call(MATES_AVENTURA_JUEGOS, tipo)
};
