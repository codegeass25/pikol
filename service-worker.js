const CACHE = 'pikol-booking-shell-8-opdata-v1';
const SHELL = [
  './index.html','./styles.css','./cards.js','./config.js','./qr-lite.js','./manifest.json',
  './icons/icon-192.png','./icons/icon-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE && k.startsWith('pikol-booking-shell-')).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (/\/(?:admin\.html|admin-manifest\.json|admin-service-worker\.js)$/.test(url.pathname)) return;
  event.respondWith(caches.match(event.request).then(hit => hit || fetch(event.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy)).catch(()=>{});
    return res;
  }).catch(() => caches.match('./index.html'))));
});
