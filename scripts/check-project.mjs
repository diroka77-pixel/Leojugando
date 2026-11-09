import { readFile } from 'node:fs/promises';

const root = await readFile('index.html', 'utf8');
const native = await readFile('www/index.html', 'utf8');
const config = JSON.parse(await readFile('capacitor.config.json', 'utf8'));

if (root !== native) throw new Error('www/index.html no coincide con index.html. Ejecuta npm run prepare:www.');
if (config.appId !== 'com.leojugando.app') throw new Error('appId de Capacitor incorrecto.');
if (!root.includes('assets/fonts/andika-400.woff2')) throw new Error('La fuente Andika local no está configurada.');
if (!root.includes('TextToSpeech')) throw new Error('Falta la integración nativa de texto a voz.');
if (!root.includes('class="welcome"')) throw new Error('Falta la bienvenida infantil de la pantalla principal.');
if (!root.includes('grid-template-columns:repeat(3,minmax(0,1fr))')) throw new Error('La cuadrícula móvil de logros no está protegida contra recortes.');
for (const id of ['playNow','s-tren','s-alimentar','s-atrapar','s-frases','s-trazar','s-habitacion','backupBtn','profileSel']) {
  if (!root.includes(`id="${id}"`)) throw new Error(`Falta la mejora ${id}.`);
}
if (!root.includes('function startGuided()')) throw new Error('Falta la partida guiada.');

console.log('Comprobaciones del proyecto superadas.');
