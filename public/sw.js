// Service Worker for New Shree Shyam Misthan Bhandhar
const CACHE_NAME = 'shree-shyam-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
});

// Handle incoming push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { 
    title: 'New Order Alert!', 
    body: 'A customer has placed a new order. Check the dashboard to approve it.' 
  };

  const options = {
    body: data.body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: {
      url: '/manage-store-admin'
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
