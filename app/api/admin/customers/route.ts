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
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    // 顧客一覧を取得
    let query = supabase
      .from('customers')
      .select('id, name, phone_number, email, current_points, is_active, created_at')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 検索機能
    if (search) {
      query = query.or(`phone_number.ilike.%${search}%,name.ilike.%${search}%`)
    }

    const { data: customers, error } = await query

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json(
        { error: '顧客一覧の取得に失敗しました' },
        { status: 500 }
      )
    }

    // 総件数を取得
    let countQuery = supabase
      .from('customers')
      .select('*', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.or(`phone_number.ilike.%${search}%,name.ilike.%${search}%`)
    }

    const { count } = await countQuery

    return NextResponse.json({
      customers: customers || [],
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

