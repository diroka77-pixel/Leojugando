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
for (const id of ['playNow','s-tren','s-alimentar','s-atrapar','s-frases','s-trazar','s-cuentos','s-habitacion','backupBtn','profileSel']) {
  if (!root.includes(`id="${id}"`)) throw new Error(`Falta la mejora ${id}.`);
}
if (!root.includes('function startGuided()')) throw new Error('Falta la partida guiada.');
if (!root.includes('function traceSegmentValid(') || !root.includes('function traceCoverage(')) throw new Error('Falta la validación estricta del trazado.');
if (!root.includes('function endTraceStroke(') || !root.includes('traceLast=null')) throw new Error('El trazado debe permitir levantar el dedo y continuar.');
if (!root.includes("c.toDataURL('image/png')") || !root.includes('traceOutsideDistance>32')) throw new Error('La guía visible y la máscara deben coincidir y tolerar movimientos aislados.');
if (!root.includes("catchW.syl[catchIdx]") || !root.includes("feedW.syl[feedIdx]")) throw new Error('Alimentar y Atrapar deben trabajar sílabas en orden.');
if (!root.includes("<span class=\"gap\">?</span>") || !root.includes('function effectiveLevel()')) throw new Error('Faltan las frases incompletas o la dificultad adaptativa.');
if (!root.includes('assets/pics/openmoji/') || !root.includes('leo-mascot.png')) throw new Error('Faltan las ilustraciones infantiles.');
if (!root.includes("bundled('sounds'") || !root.includes('if(await tts(s,.8)) return true')) throw new Error('Las sílabas deben pronunciarse con voz y conservar los sonidos locales.');
if (root.includes("playURL(bundled('syllables'")) throw new Error('Las sílabas no deben reproducir tonos sintetizados.');
if (!root.includes('function newCuento()') || !root.includes('storyRead.size===words.length')) throw new Error('Faltan los cuentos interactivos.');

console.log('Comprobaciones del proyecto superadas.');
