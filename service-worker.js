const CACHE = 'bb-offline-v9';
const ASSETS = ['./','./index.html','./app.js','./polish.css','./polish.js','./reliability.js','./shell.js','./shell.css','./manifest.webmanifest','./web-llm.min.js','./games/dino.html','./games/dino3d.html','./games/surf.html','./games/vendor/three.min.js','./icon-192.png','./icon-512.png','./icon-180.png','./icon-152.png','./icon-120.png'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('bb-offline-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.search) return;
  if (!ASSETS.some(asset => new URL(asset, self.registration.scope).href === url.href)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') {
        const cache = await caches.open(CACHE);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request);
      if (cached) return cached;
      throw error;
    }
  })());
});
