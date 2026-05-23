const CACHE = 'crm-alkautsar-v1'

self.addEventListener('install', e => { self.skipWaiting() })
self.addEventListener('activate', e => { e.waitUntil(clients.claim()) })

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)))
})

self.addEventListener('push', e => {
  const data = e.data?.json() ?? { title: 'CRM Al-Kautsar', body: 'Ada notifikasi baru' }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/pwa-any-192.png',
      badge: '/pwa-any-192.png',
      vibrate: [200, 100, 200],
      data: { url: '/' },
    })
  )
})

self.addEventListener('notificationclick', e => {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data?.url ?? '/'))
})
