import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'

// 管理者がプッシュ通知サブスクリプション一覧を取得するAPI
export async function GET(request: NextRequest) {
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

    const supabase = createServiceClient()

    // サブスクリプション一覧を取得（顧客情報も含める）
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select(`
        id,
        customer_id,
        endpoint,
        is_active,
        created_at,
        updated_at,
        customers (
          id,
          name,
          phone_number,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json(
        { error: 'サブスクリプション一覧の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      subscriptions: (subscriptions || []).map((sub: any) => ({
        id: sub.id,
        customerId: sub.customer_id,
        customerName: sub.customers?.name || '（未設定）',
        customerPhone: sub.customers?.phone_number || '',
        customerEmail: sub.customers?.email || null,
        isActive: sub.is_active,
        createdAt: sub.created_at,
        updatedAt: sub.updated_at,
      })),
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

