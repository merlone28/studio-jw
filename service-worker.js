// Cache solo dei file dell'app. Cambia VERSIONE quando modifichi un file, così i telefoni si aggiornano.
const VERSIONE = 'studio-jw-v3';
const FILE = ['./', 'index.html', 'style.css', 'scritture.js', 'app.js', 'manifest.json', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(chiavi => Promise.all(chiavi.filter(k => k !== VERSIONE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// cache prima, rete come ripiego; le richieste verso altri domini (jw.org, wol.jw.org) non vengono toccate
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r)));
});
