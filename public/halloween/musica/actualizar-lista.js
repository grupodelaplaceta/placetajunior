#!/usr/bin/env node
/* Regenera lista.json con TODAS las canciones de esta carpeta.
   Uso (desde la raíz del proyecto):  node public/halloween/musica/actualizar-lista.js
   Formatos: mp3, ogg, wav, m4a, aac, webm. No necesita instalar nada. */
const fs = require('fs'), path = require('path');
const dir = __dirname, ext = /\.(mp3|ogg|wav|m4a|aac|webm)$/i;
const files = fs.readdirSync(dir).filter(f => ext.test(f)).sort();
fs.writeFileSync(path.join(dir, 'lista.json'), JSON.stringify(files, null, 2) + '\n');
console.log(files.length + ' canción(es) en lista.json' + (files.length ? ':\n - ' + files.join('\n - ') : ''));
