// Service Worker for Push Notifications
// This file is used by next-pwa

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  self.skipWaiting() // Activate immediately
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(self.clients.claim()) // Take control of all pages immediately
})

// Push event - プッシュ通知を受信したとき
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received')
  
  let data = {}
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data = {
        title: 'プッシュ通知',
        body: event.data.text() || '新しい通知があります',
      }
    }
  } else {
    data = {
      title: 'プッシュ通知',
      body: '新しい通知があります',
    }
  }

  const options = {
    body: data.body || '新しい通知があります',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'default',
    data: data.url || '/',
    requireInteraction: false,
    actions: data.actions || [],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'プッシュ通知', options)
  )
})

// Notification click event - 通知をクリックしたとき
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event.notification.data)
  
  event.notification.close()

  const urlToOpen = event.notification.data || '/'
  
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true,
    }).then((clientList) => {
      // 既に開いているウィンドウがある場合は、そこにフォーカス
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i]
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      // 新しいウィンドウを開く
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen)
      }
    })
  )
})

