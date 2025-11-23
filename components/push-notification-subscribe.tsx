'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Bell, BellOff } from 'lucide-react'

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export function PushNotificationSubscribe() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    // ブラウザがプッシュ通知をサポートしているか確認
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      
      // 少し遅延させてから初期化（Service Workerの準備を待つ）
      const timer = setTimeout(async () => {
        const hasSubscription = await checkSubscription()
        // サブスクリプションがない場合、自動的に有効化を試みる
        if (!hasSubscription && !isLoading) {
          console.log('No subscription found, attempting auto-subscribe...')
          await autoSubscribe()
        }
      }, 1000) // 1秒待つ
      
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkSubscription = async () => {
    try {
      // Service Workerの準備を待つ（タイムアウト付き）
      // next-pwaが自動的にService Workerを登録するので、readyを待つ
      let registration: ServiceWorkerRegistration
      
      try {
        // next-pwaが自動登録するService Workerを待つ
        console.log('Waiting for Service Worker to be ready...')
        registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<ServiceWorkerRegistration>((_, reject) => 
            setTimeout(() => reject(new Error('Service Worker timeout')), 20000)
          )
        ])
        console.log('Service Worker ready')
      } catch (error) {
        console.error('Service Worker not ready:', error)
        // Service Workerが見つからない場合は、エラーをスローせず、falseを返す
        // next-pwaが自動的に登録するまで待つ
        return false
      }
      
      const sub = await registration.pushManager.getSubscription()
      if (sub) {
        setSubscription({
          endpoint: sub.endpoint,
          keys: {
            p256dh: arrayBufferToBase64(sub.getKey('p256dh')!),
            auth: arrayBufferToBase64(sub.getKey('auth')!),
          },
        })
        setIsSubscribed(true)
        return true
      } else {
        setIsSubscribed(false)
        return false
      }
    } catch (error) {
      console.error('Error checking subscription:', error)
      return false
    }
  }

  const autoSubscribe = async () => {
    // 既にローディング中またはサブスクリプション済みの場合はスキップ
    if (isLoading) {
      console.log('Skipping auto-subscribe: already loading')
      return
    }

    // 再チェック（状態が更新されている可能性があるため）
    const hasSubscription = await checkSubscription()
    if (hasSubscription) {
      console.log('Skipping auto-subscribe: already subscribed')
      return
    }

    try {
      console.log('Starting auto-subscribe...')
      
      // Service Workerが利用可能か確認
      if (!('serviceWorker' in navigator)) {
        console.log('Service Worker not supported')
        return
      }

      // 通知許可の状態を確認
      if ('Notification' in window && 'permission' in Notification) {
        const permission = Notification.permission
        console.log('Notification permission:', permission)
        
        // 許可が既に与えられている場合、自動的に有効化
        if (permission === 'granted') {
          console.log('Notification permission already granted, auto-subscribing...')
          try {
            await performSubscribe()
            setMessage({ type: 'success', text: 'プッシュ通知を自動的に有効にしました！' })
            setTimeout(() => setMessage(null), 5000)
          } catch (error: any) {
            console.error('Auto-subscribe failed:', error)
            // エラーはperformSubscribe内で既に処理されている
          }
        } else if (permission === 'default') {
          // まだ許可を求めていない場合、自動的に許可を求める
          console.log('Requesting notification permission...')
          try {
            const result = await Notification.requestPermission()
            console.log('Permission result:', result)
            if (result === 'granted') {
              await performSubscribe()
              setMessage({ type: 'success', text: 'プッシュ通知を自動的に有効にしました！' })
              setTimeout(() => setMessage(null), 5000)
            } else {
              console.log('Permission denied or dismissed')
              // 許可が拒否された場合でも、エラーメッセージは表示しない（ユーザーが手動で有効化できるため）
            }
          } catch (error: any) {
            console.error('Permission request failed:', error)
          }
        } else {
          console.log('Permission denied, skipping auto-subscribe')
        }
      }
    } catch (error) {
      console.error('Error in auto-subscribe:', error)
      // エラーが発生しても、ユーザーが手動で有効化できるようにする
    }
  }

  const performSubscribe = async () => {
    setIsLoading(true)
    try {
      console.log('Starting subscription process...')
      
      // Service Workerの準備を待つ（タイムアウト付き）
      // next-pwaが自動的にService Workerを登録するので、readyを待つ
      let registration: ServiceWorkerRegistration
      
      try {
        // next-pwaが自動登録するService Workerを待つ
        console.log('Waiting for Service Worker to be ready...')
        registration = await Promise.race([
          navigator.serviceWorker.ready,
          new Promise<ServiceWorkerRegistration>((_, reject) => 
            setTimeout(() => reject(new Error('Service Worker timeout')), 20000)
          )
        ])
        console.log('Service Worker ready for subscription')
      } catch (error) {
        console.error('Service Worker not available:', error)
        throw new Error('Service Workerが見つかりませんでした。ページを再読み込みしてください。')
      }
      
      // VAPID公開キーを取得
      console.log('Fetching VAPID public key...')
      const response = await fetch('/api/push/public-key')
      if (!response.ok) {
        throw new Error(`VAPID公開キーの取得に失敗しました（${response.status}）`)
      }
      const data = await response.json()
      const publicKey = data.publicKey

      if (!publicKey) {
        throw new Error('VAPID公開キーが取得できませんでした')
      }
      console.log('VAPID public key received')

      // プッシュ通知の許可を求める
      console.log('Subscribing to push notifications...')
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
      })
      console.log('Push subscription created')

      const pushSubscription: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      }

      setSubscription(pushSubscription)
      setIsSubscribed(true)

      // サーバーにサブスクリプションを送信
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('ログインが必要です')
      }

      console.log('Saving subscription to server...')
      const saveResponse = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subscription: pushSubscription,
          userAgent: navigator.userAgent,
        }),
      })

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'サブスクリプションの保存に失敗しました')
      }

      console.log('Push notification subscribed successfully')
    } catch (error: any) {
      console.error('Error in performSubscribe:', error)
      // エラーメッセージを表示
      setMessage({ 
        type: 'error', 
        text: error.message || 'プッシュ通知の登録に失敗しました。もう一度お試しください。' 
      })
      setTimeout(() => setMessage(null), 10000)
      throw error // エラーを再スローして、呼び出し元でも処理できるようにする
    } finally {
      setIsLoading(false)
    }
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  const subscribe = async () => {
    setIsLoading(true)
    try {
      await performSubscribe()
      setMessage({ type: 'success', text: 'プッシュ通知を有効にしました。オトクな情報をお届けします！' })
      setTimeout(() => setMessage(null), 5000)
    } catch (error: any) {
      console.error('Error subscribing:', error)
      setMessage({ type: 'error', text: error.message || 'プッシュ通知の登録に失敗しました' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const unsubscribe = async () => {
    setIsLoading(true)
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      
      if (sub) {
        await sub.unsubscribe()

        // サーバーからサブスクリプションを削除
        const token = localStorage.getItem('token')
        if (token) {
          await fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              endpoint: sub.endpoint,
            }),
          })
        }

        setSubscription(null)
        setIsSubscribed(false)

        setMessage({ type: 'success', text: 'プッシュ通知を無効にしました。通知を停止しました。' })
        setTimeout(() => setMessage(null), 5000)
      }
    } catch (error: any) {
      console.error('Error unsubscribing:', error)
      setMessage({ type: 'error', text: error.message || 'プッシュ通知の解除に失敗しました' })
      setTimeout(() => setMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>プッシュ通知</CardTitle>
          <CardDescription>
            このブラウザはプッシュ通知をサポートしていません
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {isSubscribed ? (
            <>
              <Bell className="w-5 h-5 text-green-600" />
              プッシュ通知が有効です
            </>
          ) : (
            <>
              <BellOff className="w-5 h-5 text-gray-400" />
              プッシュ通知が無効です
            </>
          )}
        </CardTitle>
        <CardDescription>
          オトクな情報やお知らせをプッシュ通知でお届けします
        </CardDescription>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="push-notification">プッシュ通知を有効にする</Label>
            <p className="text-sm text-muted-foreground">
              {isSubscribed
                ? '通知を受け取ることができます'
                : '通知を受け取るには、有効にしてください'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Button
                variant="outline"
                onClick={unsubscribe}
                disabled={isLoading}
              >
                {isLoading ? '処理中...' : '無効にする'}
              </Button>
            ) : (
              <Button
                onClick={subscribe}
                disabled={isLoading}
              >
                {isLoading ? '処理中...' : '有効にする'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

