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

// --- NEW: Push Notification Listener ---
// NOTE: For this to work, you need a server to send the push message.
// This listener shows how the Service Worker would handle a received push event.
// Without a push server, this code will not be executed.
self.addEventListener('push', event => {
  const data = event.data.json(); // Assuming the server sends a JSON payload
  console.log('New push notification received', data);

  const options = {
    body: data.body,
    icon: 'icon-192.png',
    badge: 'icon-192.png' // Icon for Android notification bar
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});