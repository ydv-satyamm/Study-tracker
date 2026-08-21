// sw.js - Service Worker with Morning Alarm & Festival Alerts
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'TRIGGER_SESSION_NOTIFICATION') {
    const { title, body } = event.data;
    self.registration.showNotification(title, {
      body: body,
      icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      badge: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
      vibrate: [500, 250, 500, 250, 500],
      tag: 'study-timer-complete',
      renotify: true,
      requireInteraction: true
    });
  }

  if (event.data && event.data.type === 'SCHEDULE_MORNING_ALARM') {
    // Background persistent check for 6:00 AM daily
    setupDailyAlarmCron();
  }
});

function setupDailyAlarmCron() {
  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 6 && now.getMinutes() === 0) {
      self.registration.showNotification("🌅 Good Morning! Uth jaiye!", {
        body: "Subah ke 6 baj gaye hain! Aaj ka naya study target poora karne ke liye taiyar ho jaiye! 🚀",
        icon: 'https://cdn-icons-png.flaticon.com/512/3281/3281329.png',
        vibrate: [800, 400, 800, 400, 800],
        tag: 'good-morning-alarm',
        renotify: true,
        requireInteraction: true // Jab tak close na karo tab tak screen par tiki rahegi
      });
    }
  }, 60000); // Check every minute
}

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('/');
    })
  );
});
