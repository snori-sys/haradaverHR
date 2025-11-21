import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'
import { calculatePoints } from '@/lib/points'

// バリデーションスキーマ
const createVisitSchema = z.object({
  customerId: z.string().uuid('顧客IDが正しくありません'),
  visitDate: z.string().datetime('来店日時が正しくありません'),
  amount: z.number().int().positive('利用金額は正の整数で入力してください'),
  castId: z.string().uuid().optional().nullable(),
  serviceType: z.enum(['free', 'net_reservation', 'in_store_reservation', 'regular_reservation'], {
    message: 'サービス種別が正しくありません',
  }),
  notes: z.string().optional().nullable(),
})

const updateVisitSchema = createVisitSchema.partial().extend({
  id: z.string().uuid('IDが正しくありません'),
})

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
    const customerId = searchParams.get('customerId')
    const offset = (page - 1) * limit

    // 来店履歴を取得
    let query = supabase
      .from('visits')
      .select(`
        *,
        customers (
          id,
          name,
          phone_number
        ),
        casts (
          id,
          name
        )
      `)
      .order('visit_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (customerId) {
      query = query.eq('customer_id', customerId)
    }

    const { data: visits, error } = await query

    if (error) {
      console.error('Error fetching visits:', error)
      return NextResponse.json(
        { error: '来店履歴の取得に失敗しました' },
        { status: 500 }
      )
    }

    // 総件数を取得
    let countQuery = supabase
      .from('visits')
      .select('*', { count: 'exact', head: true })

    if (customerId) {
      countQuery = countQuery.eq('customer_id', customerId)
    }

    const { count } = await countQuery

    return NextResponse.json({
      visits: visits || [],
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

    const body = await request.json()
    
    // バリデーション
    const validatedData = createVisitSchema.parse(body)

    const supabase = createServiceClient()

    // 設定を取得（ポイント還元率）
    const { data: settings } = await supabase
      .from('settings')
      .select('key, value')
      .eq('key', 'point_rate')
      .single()

    const pointRate = parseInt(settings?.value || '3')
    const pointsEarned = calculatePoints(validatedData.amount, pointRate)

    // 顧客情報を取得（初回来店日を更新するため）
    const { data: customer } = await supabase
      .from('customers')
      .select('first_visit_date, current_points')
      .eq('id', validatedData.customerId)
      .single()

    // 来店履歴を登録
    const { data: visit, error } = await supabase
      .from('visits')
      .insert({
        customer_id: validatedData.customerId,
        visit_date: validatedData.visitDate,
        amount: validatedData.amount,
        points_earned: pointsEarned,
        points_used: 0,
        cast_id: validatedData.castId || null,
        service_type: validatedData.serviceType,
        notes: validatedData.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating visit:', error)
      return NextResponse.json(
        { error: '来店履歴の登録に失敗しました' },
        { status: 500 }
      )
    }

    // ポイントはトリガーで自動更新されるため、ここでは返すだけ

    return NextResponse.json({
      visit,
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

export async function PUT(request: NextRequest) {
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

    const body = await request.json()
    
    // バリデーション
    const validatedData = updateVisitSchema.parse(body)

    const supabase = createServiceClient()

    // 既存の来店履歴を取得
    const { data: existingVisit, error: fetchError } = await supabase
      .from('visits')
      .select('*')
      .eq('id', validatedData.id)
      .single()

    if (fetchError || !existingVisit) {
      return NextResponse.json(
        { error: '来店履歴が見つかりません' },
        { status: 404 }
      )
    }

    // 更新データを準備
    const updateData: any = {}
    if (validatedData.visitDate) updateData.visit_date = validatedData.visitDate
    if (validatedData.amount !== undefined) {
      updateData.amount = validatedData.amount
      // ポイント還元率を取得
      const { data: settings } = await supabase
        .from('settings')
        .select('key, value')
        .eq('key', 'point_rate')
        .single()
      const pointRate = parseInt(settings?.value || '3')
      updateData.points_earned = calculatePoints(validatedData.amount, pointRate)
    }
    if (validatedData.castId !== undefined) updateData.cast_id = validatedData.castId
    if (validatedData.serviceType) updateData.service_type = validatedData.serviceType
    if (validatedData.notes !== undefined) updateData.notes = validatedData.notes

    // 来店履歴を更新
    const { data: visit, error } = await supabase
      .from('visits')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating visit:', error)
      return NextResponse.json(
        { error: '来店履歴の更新に失敗しました' },
        { status: 500 }
      )
    }

    // ポイントはトリガーで自動更新されるため、ここでは返すだけ

    return NextResponse.json({
      visit,
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

