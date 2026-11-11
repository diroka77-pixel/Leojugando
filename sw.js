// Leo Jugando: funciona sin internet una vez instalada
const CACHE = 'leo-jugando-v13';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './assets/fonts/andika-400.woff2', './assets/fonts/andika-700.woff2'];
self.addEventListener('install', e => {
  e.waitUntil(fetch('./assets/offline-assets.json').then(r=>r.json()).then(assets=>caches.open(CACHE).then(c=>c.addAll([...FILES,...assets]))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const copy = res.clone();
      if (res.ok || res.type === 'opaque') caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
