import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'

// 管理者が顧客一覧を取得するAPI
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

    // 顧客一覧を取得（アクティブな顧客のみ）
    const { data: customers, error } = await supabase
      .from('customers')
      .select('id, name, phone_number, email, current_points, total_earned_points, total_used_points, first_visit_date, last_visit_date, created_at, is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json(
        { error: '顧客一覧の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      customers: (customers || []).map((customer) => ({
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phone_number,
        email: customer.email,
        currentPoints: customer.current_points || 0,
        totalEarnedPoints: customer.total_earned_points || 0,
        totalUsedPoints: customer.total_used_points || 0,
        firstVisitDate: customer.first_visit_date,
        lastVisitDate: customer.last_visit_date,
        createdAt: customer.created_at,
        isActive: customer.is_active,
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
