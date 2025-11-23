import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'
import webpush from 'web-push'

// 通知送信スキーマ
const sendNotificationSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  body: z.string().min(1, '本文を入力してください'),
  url: z.string().optional().or(z.literal('')),
  customerIds: z.array(z.string().uuid()).optional(),
})

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const token = AuthUtils.getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    const payload = AuthUtils.verifyToken(token)
    if (!payload || payload.type !== 'admin') {
      return NextResponse.json(
        { error: '管理者認証が必要です' },
        { status: 403 }
      )
    }

    // VAPIDキーの確認
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidMailto = process.env.VAPID_MAILTO

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys not found:', {
        hasPublicKey: !!vapidPublicKey,
        hasPrivateKey: !!vapidPrivateKey,
        hasMailto: !!vapidMailto,
      })
      return NextResponse.json(
        { 
          error: 'VAPIDキーが設定されていません',
          details: process.env.NODE_ENV === 'development' 
            ? 'VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_MAILTO が環境変数に設定されているか確認してください' 
            : undefined
        },
        { status: 500 }
      )
    }

    // VAPIDキーを検証・トリム（先頭・末尾の空白を削除）
    const trimmedPublicKey = vapidPublicKey.trim()
    const trimmedPrivateKey = vapidPrivateKey.trim()
    
    // VAPID_MAILTOにmailto:プレフィックスがない場合は追加
    let trimmedMailto = (vapidMailto || 'mailto:admin@example.com').trim()
    if (trimmedMailto && !trimmedMailto.startsWith('mailto:')) {
      trimmedMailto = `mailto:${trimmedMailto}`
    }

    // VAPIDキーの形式を簡易チェック
    if (!trimmedPublicKey || trimmedPublicKey.length < 20) {
      console.error('Invalid VAPID public key format:', trimmedPublicKey?.length)
      return NextResponse.json(
        { 
          error: 'VAPID公開キーの形式が正しくありません',
          details: 'VAPID_PUBLIC_KEYが正しく設定されているか確認してください'
        },
        { status: 500 }
      )
    }

    if (!trimmedPrivateKey || trimmedPrivateKey.length < 20) {
      console.error('Invalid VAPID private key format:', trimmedPrivateKey?.length)
      return NextResponse.json(
        { 
          error: 'VAPID秘密キーの形式が正しくありません',
          details: 'VAPID_PRIVATE_KEYが正しく設定されているか確認してください'
        },
        { status: 500 }
      )
    }

    // VAPIDキーを設定
    try {
      console.log('Setting VAPID details:', {
        mailto: trimmedMailto,
        publicKeyLength: trimmedPublicKey.length,
        privateKeyLength: trimmedPrivateKey.length,
        publicKeyPrefix: trimmedPublicKey.substring(0, 10),
      })
      
      webpush.setVapidDetails(
        trimmedMailto,
        trimmedPublicKey,
        trimmedPrivateKey
      )
      
      console.log('VAPID details set successfully')
    } catch (error) {
      console.error('Error setting VAPID details:', error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      
      // エラーの詳細をログに出力
      console.error('VAPID key details:', {
        mailto: trimmedMailto,
        publicKeyLength: trimmedPublicKey.length,
        privateKeyLength: trimmedPrivateKey.length,
        hasPublicKey: !!trimmedPublicKey,
        hasPrivateKey: !!trimmedPrivateKey,
      })
      
      return NextResponse.json(
        { 
          error: 'VAPIDキーの設定に失敗しました',
          details: process.env.NODE_ENV === 'development' 
            ? `${errorMessage}${errorStack ? `\n${errorStack}` : ''}`
            : `エラー: ${errorMessage}。VAPIDキーの形式を確認してください。`
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const validatedData = sendNotificationSchema.parse(body)

    const supabase = createServiceClient()

    // 通知レコードを作成
    const { data: notification, error: notificationError } = await supabase
      .from('push_notifications')
      .insert({
        title: validatedData.title,
        body: validatedData.body,
        url: validatedData.url || null,
        sent_to_customer_ids: validatedData.customerIds || null,
        sent_by: payload.id,
        status: 'sending',
      })
      .select()
      .single()

    if (notificationError) {
      console.error('Error creating notification:', notificationError)
      return NextResponse.json(
        { error: '通知レコードの作成に失敗しました' },
        { status: 500 }
      )
    }

    // 送信先のサブスクリプションを取得
    let query = supabase
      .from('push_subscriptions')
      .select('id, customer_id, endpoint, p256dh, auth')
      .eq('is_active', true)

    if (validatedData.customerIds && validatedData.customerIds.length > 0) {
      // 指定された顧客のみ
      query = query.in('customer_id', validatedData.customerIds)
    }

    const { data: subscriptions, error: subscriptionsError } = await query

    if (subscriptionsError) {
      console.error('Error fetching subscriptions:', subscriptionsError)
      // 通知レコードを失敗状態に更新
      await supabase
        .from('push_notifications')
        .update({ status: 'failed', failed_count: 0 })
        .eq('id', notification.id)

      return NextResponse.json(
        { error: 'サブスクリプションの取得に失敗しました' },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      // 通知レコードを完了状態に更新
      await supabase
        .from('push_notifications')
        .update({
          status: 'completed',
          sent_count: 0,
          failed_count: 0,
          sent_at: new Date().toISOString(),
        })
        .eq('id', notification.id)

      return NextResponse.json({
        message: '送信先のサブスクリプションが見つかりませんでした',
        sentCount: 0,
        failedCount: 0,
      })
    }

    // 各サブスクリプションに通知を送信
    let sentCount = 0
    let failedCount = 0
    const notificationPayload = JSON.stringify({
      title: validatedData.title,
      body: validatedData.body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      data: {
        url: validatedData.url || '/',
      },
    })

    const sendPromises = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          notificationPayload
        )

        // 送信ログを作成
        await supabase.from('push_notification_logs').insert({
          notification_id: notification.id,
          customer_id: subscription.customer_id,
          subscription_id: subscription.id,
          status: 'sent',
        })

        sentCount++
        return { success: true, subscriptionId: subscription.id }
      } catch (error: any) {
        console.error('Error sending notification:', error)

        // 送信ログを作成（失敗）
        await supabase.from('push_notification_logs').insert({
          notification_id: notification.id,
          customer_id: subscription.customer_id,
          subscription_id: subscription.id,
          status: 'failed',
          error_message: error.message || '送信に失敗しました',
        })

        // 無効なサブスクリプションは無効化
        if (error.statusCode === 410 || error.statusCode === 404) {
          await supabase
            .from('push_subscriptions')
            .update({ is_active: false })
            .eq('id', subscription.id)
        }

        failedCount++
        return { success: false, subscriptionId: subscription.id }
      }
    })

    await Promise.all(sendPromises)

    // 通知レコードを更新
    await supabase
      .from('push_notifications')
      .update({
        status: 'completed',
        sent_count: sentCount,
        failed_count: failedCount,
        sent_at: new Date().toISOString(),
      })
      .eq('id', notification.id)

    return NextResponse.json({
      message: '通知を送信しました',
      sentCount,
      failedCount,
      notificationId: notification.id,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "バリデーションエラーが発生しました" },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', error)
    const errorMessage = error instanceof Error ? error.message : 'サーバーエラーが発生しました'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // 開発環境では詳細なエラー情報を返す
    return NextResponse.json(
      { 
        error: 'サーバーエラーが発生しました',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined,
      },
      { status: 500 }
    )
  }
}

