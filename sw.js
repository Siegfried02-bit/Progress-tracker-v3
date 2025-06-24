const CACHE_NAME = 'progress-tracker-cache-v3'; // Incrémentez la version du cache à chaque modification des fichiers à cacher
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'icon-192.png',
  'icon-512.png',
  'manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js' // Cache Chart.js
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Écoute des événements de clic sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Ferme la notification

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus(); // Ouvre l'application si elle est déjà ouverte
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('./index.html'); // Ouvre une nouvelle fenêtre si l'application n'est pas ouverte
      }
    })
  );
});

// Écoute des événements push (pour des notifications serveur, non utilisées ici mais bonne pratique)
// self.addEventListener('push', (event) => {
//   const data = event.data.json();
//   const title = data.title || 'Notification';
//   const options = {
//     body: data.body || 'Vous avez une nouvelle notification.',
//     icon: 'icon-192.png',
//     badge: 'icon-192.png',
//     vibrate: [200, 100, 200]
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });