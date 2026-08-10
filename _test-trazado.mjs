// Prueba del motor con trazado paso a paso + girar derecha/izquierda
import { readFileSync } from 'fs';
global.window = {};
eval(readFileSync('c:/Users/mikel/Documents/banco/junior.laplaceta.org/public/js/code-engine.js', 'utf8'));
const PJ = window.PJCode;

// Caso: girar a la derecha 2 veces desde derecha → debería acabar mirando a la izquierda (2 giros horario)
const esc = { tipo: 'cuadricula', ancho: 6, alto: 6, obstaculos: [], monedas: [] };
const inicio = { x: 0, y: 0, direccion: 'derecha' };
const objetivo = { posicion: { x: 1, y: 0 }, max_pasos: 10 };

// Programa: girar derecha, girar derecha, avanzar → desde (0,0) derecha:
// girar der = abajo, girar der = izquierda, avanzar = (-1,0) → fuera
const prog = [{ op: 'girar', dir: 'derecha' }, { op: 'girar', dir: 'derecha' }, { op: 'avanzar' }];
const r = PJ.ejecutarCode(esc, inicio, prog, { maxPasos: 200 });
console.log('GIRAR DER: pos:', JSON.stringify(r.posicion_final), 'dir:', r.direccion_final, 'error:', r.error ? r.error.tipo : 'none');
console.log('TRAZADO:');
r.trazado.forEach((t, i) => console.log('  ', i, t.accion, `(${t.x},${t.y})`, 'dir=' + t.dir, t.moneda ? '🪙' : '', t.a ? '->' + t.a : ''));
const e = PJ.evaluarCode(esc, inicio, objetivo, prog, r);
console.log('superado:', e.superado, JSON.stringify(e.fallos));

// Caso bueno: avanzar 1 a (1,0) → superado
const prog2 = [{ op: 'avanzar' }];
const r2 = PJ.ejecutarCode(esc, inicio, prog2, { maxPasos: 200 });
console.log('\nAVANZAR 1: pos:', JSON.stringify(r2.posicion_final), 'superado:', PJ.evaluarCode(esc, inicio, objetivo, prog2, r2).superado);
console.log('trazado pasos:', r2.trazado.map(t => t.accion).join('->'));
