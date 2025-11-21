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

    // 顧客情報を取得
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', payload.id)
      .eq('is_active', true)
      .single()

    if (error || !customer) {
      return NextResponse.json(
        { error: '顧客情報の取得に失敗しました' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      customer: {
        id: customer.id,
        phoneNumber: customer.phone_number,
        name: customer.name,
        email: customer.email,
        currentPoints: customer.current_points,
        totalEarnedPoints: customer.total_earned_points,
        totalUsedPoints: customer.total_used_points,
        firstVisitDate: customer.first_visit_date,
        lastVisitDate: customer.last_visit_date,
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

