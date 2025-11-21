import { NextRequest, NextResponse } from 'next/server'
import { AuthUtils } from '@/lib/auth'
import { checkFirstVisitOnlyAlerts } from '@/lib/alerts'

export async function POST(request: NextRequest) {
  try {
    // トークンを取得
    const token = AuthUtils.getTokenFromRequest(request)

    if (!token) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // トークンを検証（管理者のみ）
    const payload = AuthUtils.verifyToken(token)

    if (!payload || payload.type !== 'admin') {
      return NextResponse.json(
        { error: '管理者権限が必要です' },
        { status: 403 }
      )
    }

    // アラート検出を実行
    const result = await checkFirstVisitOnlyAlerts()

    if (!result.success) {
      return NextResponse.json(
        { error: 'アラート検出に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      alertsCreated: result.alertsCreated || 0,
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

