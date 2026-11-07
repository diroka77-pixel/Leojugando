import { readFile } from 'node:fs/promises';

const root = await readFile('index.html', 'utf8');
const native = await readFile('www/index.html', 'utf8');
const config = JSON.parse(await readFile('capacitor.config.json', 'utf8'));

if (root !== native) throw new Error('www/index.html no coincide con index.html. Ejecuta npm run prepare:www.');
if (config.appId !== 'com.leojugando.app') throw new Error('appId de Capacitor incorrecto.');
if (!root.includes('assets/fonts/andika-400.woff2')) throw new Error('La fuente Andika local no está configurada.');
if (!root.includes('TextToSpeech')) throw new Error('Falta la integración nativa de texto a voz.');

console.log('Comprobaciones del proyecto superadas.');
