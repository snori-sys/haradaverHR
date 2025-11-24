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
      
      // 即座に通知許可をリクエスト（デフォルトで有効化）
      const requestPermissionImmediately = async () => {
        // 通知許可の状態を確認
        if ('Notification' in window && 'permission' in Notification) {
          const permission = Notification.permission
          console.log('Current notification permission:', permission)
          
          // まだ許可を求めていない場合、即座に許可をリクエスト
          if (permission === 'default') {
            console.log('Requesting notification permission immediately...')
            try {
              const result = await Notification.requestPermission()
              console.log('Permission request result:', result)
              
              if (result === 'granted') {
                console.log('Permission granted! Will subscribe after Service Worker is ready...')
                // 許可が得られたら、Service Workerの準備を待ってからサブスクリプションを登録
                setTimeout(async () => {
                  await autoSubscribe()
                }, 3000) // 3秒待つ（Service Workerの準備時間）
              } else {
                console.log('Permission denied or dismissed:', result)
              }
            } catch (error) {
              console.error('Error requesting permission:', error)
            }
          } else if (permission === 'granted') {
            // 既に許可されている場合、自動的に有効化を試みる
            console.log('Permission already granted, checking subscription...')
            const hasSubscription = await checkSubscription()
            if (!hasSubscription) {
              console.log('No subscription found, attempting auto-subscribe...')
              setTimeout(async () => {
                await autoSubscribe()
              }, 2000)
            }
          } else {
            console.log('Permission denied, user must enable manually')
          }
        }
      }
      
      // 即座に実行（Service Workerの準備を待たない）
      requestPermissionImmediately()
      
      // さらに、定期的にチェックして、まだ有効化されていない場合は再試行
      const retryInterval = setInterval(async () => {
        const hasSubscription = await checkSubscription()
        if (!hasSubscription && !isLoading && Notification.permission === 'granted') {
          console.log('Retrying auto-subscribe (permission granted but not subscribed)...')
          await autoSubscribe()
        } else if (hasSubscription) {
          // サブスクリプションが有効になったら、再試行を停止
          clearInterval(retryInterval)
        }
      }, 5000) // 5秒ごとにチェック
      
      return () => clearInterval(retryInterval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkSubscription = async () => {
    try {
      // Service Workerの準備を待つ（タイムアウト付き）
      // next-pwaが自動的にService Workerを登録するので、readyを待つ
      let registration: ServiceWorkerRegistration | null = null
      
      try {
        // まず、既存のService Workerの登録を確認
        registration = await navigator.serviceWorker.getRegistration() || null
        
        if (!registration) {
          // 既存の登録がない場合、next-pwaが自動登録するまで待つ
          console.log('Waiting for Service Worker to be ready...')
          try {
            registration = await Promise.race([
              navigator.serviceWorker.ready,
              new Promise<ServiceWorkerRegistration>((_, reject) => 
                setTimeout(() => reject(new Error('Service Worker timeout')), 30000)
              )
            ])
            console.log('Service Worker ready')
          } catch (timeoutError) {
            console.error('Service Worker timeout:', timeoutError)
            // タイムアウトした場合でも、既存の登録を再確認
            registration = await navigator.serviceWorker.getRegistration() || null
            if (!registration) {
              console.log('Service Worker not found after timeout')
              return false
            }
          }
        } else {
          console.log('Using existing Service Worker registration')
        }
      } catch (error) {
        console.error('Service Worker not ready:', error)
        // Service Workerが見つからない場合は、エラーをスローせず、falseを返す
        return false
      }
      
      if (!registration) {
        console.log('Service Worker registration not found')
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
      console.log('Starting auto-subscribe (default enabled)...')
      
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
          // まだ許可を求めていない場合、自動的に許可を求める（デフォルトで有効化）
          console.log('Requesting notification permission automatically (default enabled)...')
          try {
            const result = await Notification.requestPermission()
            console.log('Permission result:', result)
            if (result === 'granted') {
              // 許可が得られたら、少し待ってからサブスクリプションを登録（Service Workerの準備を待つ）
              setTimeout(async () => {
                try {
                  await performSubscribe()
                  setMessage({ type: 'success', text: 'プッシュ通知を自動的に有効にしました！' })
                  setTimeout(() => setMessage(null), 5000)
                } catch (error: any) {
                  console.error('Auto-subscribe after permission grant failed:', error)
                }
              }, 1000)
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
      
      // Service Workerの準備を待つ（より柔軟なアプローチ）
      let registration: ServiceWorkerRegistration | null = null
      
      // まず、既存の登録を確認
      registration = await navigator.serviceWorker.getRegistration() || null
      
      if (!registration) {
        console.log('No existing Service Worker registration found, attempting to register manually...')
        
        // next-pwaが自動登録しない場合、手動で登録を試みる
        try {
          // next-pwaが生成するService Workerファイルを探す
          const swPaths = [
            '/sw.js',
            '/sw.js.map',
            '/_next/static/chunks/sw.js',
            '/workbox-*.js',
          ]
          
          // まず、readyを短時間待つ
          try {
            registration = await Promise.race([
              navigator.serviceWorker.ready,
              new Promise<ServiceWorkerRegistration>((_, reject) => 
                setTimeout(() => reject(new Error('Service Worker ready timeout')), 3000)
              )
            ])
            console.log('Service Worker ready')
          } catch (readyError) {
            console.log('Service Worker ready timeout, trying manual registration...')
            
            // 手動でService Workerを登録（複数のパスを試行）
            const swPaths = [
              '/sw.js',
              '/_next/static/chunks/sw.js',
              '/workbox-*.js',
            ]
            
            let registered = false
            for (const swPath of swPaths) {
              try {
                // まず、ファイルが存在するか確認
                const response = await fetch(swPath, { method: 'HEAD' })
                if (response.ok) {
                  registration = await navigator.serviceWorker.register(swPath, {
                    scope: '/',
                  })
                  console.log(`Service Worker registered manually via ${swPath}:`, registration)
                  registered = true
                  // 登録後、少し待つ
                  await new Promise(resolve => setTimeout(resolve, 1000))
                  break
                }
              } catch (pathError) {
                console.log(`Failed to register via ${swPath}, trying next path...`)
                continue
              }
            }
            
            if (!registered) {
              console.error('All Service Worker registration paths failed')
              // 最後の試行: next-pwaが生成する可能性のあるパスを試行
              try {
                // next-pwaは通常、ビルド時にpublic/sw.jsを生成する
                // しかし、Vercelでは別のパスにある可能性がある
                registration = await navigator.serviceWorker.register('/sw.js', {
                  scope: '/',
                })
                console.log('Service Worker registered via /sw.js (final attempt)')
              } catch (finalError) {
                console.error('Final Service Worker registration attempt failed:', finalError)
              }
            }
          }
        } catch (error) {
          console.error('Service Worker registration error:', error)
        }
      }
      
      // まだ登録されていない場合、ポーリングで待つ（最大30秒）
      if (!registration) {
        console.log('Polling for Service Worker registration...')
        const maxAttempts = 15 // 15回試行
        const pollInterval = 2000 // 2秒ごと
        
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          registration = await navigator.serviceWorker.getRegistration() || null
          
          if (registration) {
            console.log(`Service Worker found on attempt ${attempt + 1}`)
            break
          }
          
          if (attempt < maxAttempts - 1) {
            await new Promise(resolve => setTimeout(resolve, pollInterval))
          }
        }
      }
      
      // 最終確認
      if (!registration) {
        registration = await navigator.serviceWorker.getRegistration() || null
      }
      
      if (!registration) {
        throw new Error('Service Workerが見つかりませんでした。ページを再読み込みしてください。')
      }
      
      console.log('Service Worker registration confirmed')
      
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
      // まず、通知許可を確認・リクエスト
      if ('Notification' in window && 'permission' in Notification) {
        const permission = Notification.permission
        
        if (permission === 'default') {
          console.log('Requesting notification permission from button click...')
          const result = await Notification.requestPermission()
          console.log('Permission result:', result)
          
          if (result !== 'granted') {
            setMessage({ type: 'error', text: '通知許可が必要です。ブラウザの設定で通知を許可してください。' })
            setTimeout(() => setMessage(null), 5000)
            setIsLoading(false)
            return
          }
        } else if (permission === 'denied') {
          setMessage({ type: 'error', text: '通知が拒否されています。ブラウザの設定で通知を許可してください。' })
          setTimeout(() => setMessage(null), 5000)
          setIsLoading(false)
          return
        }
      }
      
      // 許可が得られたら、サブスクリプションを登録
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

