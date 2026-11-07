import { copyFile, mkdir, rm } from 'node:fs/promises';

const files = [
  'index.html',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'assets/fonts/andika-400.woff2',
  'assets/fonts/andika-700.woff2',
];

await rm('www', { recursive: true, force: true });
await mkdir('www', { recursive: true });

for (const file of files) {
  const parent = file.split('/').slice(0, -1).join('/');
  if (parent) await mkdir(`www/${parent}`, { recursive: true });
  await copyFile(file, `www/${file}`);
}

console.log('Web copiada a www/ sin incluir sw.js.');
