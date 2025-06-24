self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('progress-tracker-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'icon-192.png',
        'icon-512.png',
        'manifest.json'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});