import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

export default function usePushNotification() {
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !('serviceWorker' in navigator) || !('PushManager' in window)) return

    async function subscribe() {
      try {
        const reg = await navigator.serviceWorker.ready
        const existing = await reg.pushManager.getSubscription()
        if (existing) return

        const res = await fetch('/api/push/vapid-public-key')
        const { publicKey } = await res.json()

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })

        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription, user_id: user.id }),
        })
      } catch (err) {
        console.error('Push subscription failed:', err)
      }
    }

    if (Notification.permission === 'granted') {
      subscribe()
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then(p => { if (p === 'granted') subscribe() })
    }
  }, [user])
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}
