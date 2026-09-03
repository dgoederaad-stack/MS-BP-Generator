// Root service-worker kill switch voor oude v0.1 cache.
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => caches.delete(k)));
      await self.clients.claim();
      await self.registration.unregister();
      const clients = await self.clients.matchAll({type: 'window'});
      for (const client of clients) {
        client.navigate(client.url);
      }
    })()
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request, {cache: 'no-store'}));
});
