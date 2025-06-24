self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('progress-tracker-cache-v1').then((cache) => {
      return cache.addAll([
        '/',
        'index.html',
        'style.css',
        'icon-192.png',
        'icon-512.png',
        'manifest.json',
        'https://cdn.jsdelivr.net/npm/chart.js' // Cache Chart.js
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

// Notification handling in Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'scheduleNotification') {
    const { title, body, delay } = event.data;

    setTimeout(() => {
      self.registration.showNotification(title, {
        body: body,
        icon: 'icon-192.png', // Or a relevant icon
        badge: 'icon-192.png', // For Android badges
        vibrate: [200, 100, 200],
        tag: 'progress-tracker-notification', // Group notifications
        renotify: true // Allows subsequent notifications with the same tag to vibrate again
      });
    }, delay);
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification

  // Open the app when the notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('index.html') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('index.html');
      }
    })
  );
});