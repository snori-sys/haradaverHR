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

    // トークンを検証
    const payload = AuthUtils.verifyToken(token)

    if (!payload || payload.type !== 'customer') {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

    const supabase = createServiceClient()

    // クエリパラメータを取得
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // ポイント取引履歴を取得
    const { data: transactions, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('customer_id', payload.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching point transactions:', error)
      return NextResponse.json(
        { error: 'ポイント取引履歴の取得に失敗しました' },
        { status: 500 }
      )
    }

    // 総件数を取得
    const { count } = await supabase
      .from('point_transactions')
      .select('*', { count: 'exact', head: true })
      .eq('customer_id', payload.id)

    return NextResponse.json({
      transactions: transactions || [],
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

