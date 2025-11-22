import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'

// 通知履歴を取得するAPI
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

    // 通知履歴を取得（最新順）
    const { data: notifications, error } = await supabase
      .from('push_notifications')
      .select('id, title, body, sent_count, failed_count, status, created_at, sent_at')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching notifications:', error)
      return NextResponse.json(
        { error: '通知履歴の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      notifications: notifications || [],
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

