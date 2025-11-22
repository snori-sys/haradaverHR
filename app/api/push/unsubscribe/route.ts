import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// サブスクリプション解除スキーマ
const unsubscribeSchema = z.object({
  endpoint: z.string(),
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
    const validatedData = unsubscribeSchema.parse(body)

    const supabase = createServiceClient()

    // サブスクリプションを無効化
    const { error } = await supabase
      .from('push_subscriptions')
      .update({
        is_active: false,
        updated_at: new Date().toISOString(),
      })
      .eq('endpoint', validatedData.endpoint)
      .eq('customer_id', payload.id)

    if (error) {
      console.error('Error unsubscribing:', error)
      return NextResponse.json(
        { error: 'サブスクリプションの解除に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'プッシュ通知を無効にしました',
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

