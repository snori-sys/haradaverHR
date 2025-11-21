import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'

export async function GET(request: NextRequest) {
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

    const supabase = createServiceClient()

    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const isResolved = searchParams.get('isResolved')
    const offset = (page - 1) * limit

    // アラート一覧を取得
    let query = supabase
      .from('alerts')
      .select(`
        *,
        customers (
          id,
          name,
          phone_number
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (isResolved !== null) {
      query = query.eq('is_resolved', isResolved === 'true')
    }

    const { data: alerts, error } = await query

    if (error) {
      console.error('Error fetching alerts:', error)
      return NextResponse.json(
        { error: 'アラート一覧の取得に失敗しました' },
        { status: 500 }
      )
    }

    // 総件数を取得
    let countQuery = supabase
      .from('alerts')
      .select('*', { count: 'exact', head: true })

    if (isResolved !== null) {
      countQuery = countQuery.eq('is_resolved', isResolved === 'true')
    }

    const { count } = await countQuery

    return NextResponse.json({
      alerts: alerts || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

