import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// サブスクリプション登録スキーマ
const subscribeSchema = z.object({
  subscription: z.object({
    endpoint: z.string(),
    keys: z.object({
      p256dh: z.string(),
      auth: z.string(),
    }),
  }),
  userAgent: z.string().optional(),
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
    if (!payload || payload.type !== 'customer') {
      return NextResponse.json(
        { error: '顧客認証が必要です' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = subscribeSchema.parse(body)

    const supabase = createServiceClient()

    // 既存のサブスクリプションをチェック
    const { data: existingSubscription } = await supabase
      .from('push_subscriptions')
      .select('id')
      .eq('endpoint', validatedData.subscription.endpoint)
      .single()

    if (existingSubscription) {
      // 既存のサブスクリプションを更新
      const { error } = await supabase
        .from('push_subscriptions')
        .update({
          p256dh: validatedData.subscription.keys.p256dh,
          auth: validatedData.subscription.keys.auth,
          user_agent: validatedData.userAgent || null,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq('endpoint', validatedData.subscription.endpoint)

      if (error) {
        console.error('Error updating subscription:', error)
        return NextResponse.json(
          { error: 'サブスクリプションの更新に失敗しました' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: 'サブスクリプションを更新しました',
      })
    }

    // 新しいサブスクリプションを登録
    const { error } = await supabase
      .from('push_subscriptions')
      .insert({
        customer_id: payload.id,
        endpoint: validatedData.subscription.endpoint,
        p256dh: validatedData.subscription.keys.p256dh,
        auth: validatedData.subscription.keys.auth,
        user_agent: validatedData.userAgent || null,
        is_active: true,
      })

    if (error) {
      console.error('Error saving subscription:', error)
      return NextResponse.json(
        { error: 'サブスクリプションの登録に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'プッシュ通知を有効にしました',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "バリデーションエラーが発生しました" },
        { status: 400 }
      )
    }

    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

