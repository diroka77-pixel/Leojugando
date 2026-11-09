import { copyFile, cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';

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

const walk = async dir => (await Promise.all((await readdir(dir,{withFileTypes:true})).map(async entry => entry.isDirectory()?walk(`${dir}/${entry.name}`):`${dir}/${entry.name}`))).flat();
const offlineAssets=(await Promise.all(['assets/fonts','assets/illustrations','assets/pics/openmoji','assets/audio'].map(walk))).flat().map(p=>'./'+p);
await writeFile('assets/offline-assets.json',JSON.stringify(offlineAssets,null,2)+'\n');

for (const file of files) {
  const parent = file.split('/').slice(0, -1).join('/');
  if (parent) await mkdir(`www/${parent}`, { recursive: true });
  await copyFile(file, `www/${file}`);
}

for (const dir of ['assets/illustrations','assets/pics','assets/audio']) await cp(dir,`www/${dir}`,{recursive:true});
await copyFile('assets/offline-assets.json','www/assets/offline-assets.json');

console.log('Web copiada a www/ sin incluir sw.js.');
