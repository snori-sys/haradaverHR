import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const usePointsSchema = z.object({
  points: z.number().int().positive('利用ポイントは1以上の整数で入力してください'),
})

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

    // トークンを検証
    const payload = AuthUtils.verifyToken(token)

    if (!payload || payload.type !== 'customer') {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // バリデーション
    const validatedData = usePointsSchema.parse(body)

    const supabase = createServiceClient()

    // 設定を取得
    const { data: settings } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['min_points_to_use', 'point_unit'])

    const minPoints = parseInt(
      settings?.find(s => s.key === 'min_points_to_use')?.value || '500'
    )
    const pointUnit = parseInt(
      settings?.find(s => s.key === 'point_unit')?.value || '500'
    )

    // 顧客情報を取得
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('current_points')
      .eq('id', payload.id)
      .single()

    if (customerError || !customer) {
      return NextResponse.json(
        { error: '顧客情報の取得に失敗しました' },
        { status: 404 }
      )
    }

    // バリデーション
    if (customer.current_points < minPoints) {
      return NextResponse.json(
        { error: `利用可能なポイントが不足しています（最小: ${minPoints}ポイント）` },
        { status: 400 }
      )
    }

    if (validatedData.points > customer.current_points) {
      return NextResponse.json(
        { error: '利用ポイントが残高を超えています' },
        { status: 400 }
      )
    }

    if (validatedData.points < minPoints) {
      return NextResponse.json(
        { error: `利用ポイントは${minPoints}ポイント以上で入力してください` },
        { status: 400 }
      )
    }

    if (validatedData.points % pointUnit !== 0) {
      return NextResponse.json(
        { error: `利用ポイントは${pointUnit}ポイント刻みで入力してください` },
        { status: 400 }
      )
    }

    // ポイントを使用
    const newBalance = customer.current_points - validatedData.points

    // 顧客のポイントを更新
    const { error: updateError } = await supabase
      .from('customers')
      .update({
        current_points: newBalance,
        total_used_points: customer.current_points - newBalance + (customer.current_points - newBalance),
      })
      .eq('id', payload.id)

    if (updateError) {
      console.error('Error updating customer points:', updateError)
      return NextResponse.json(
        { error: 'ポイント利用に失敗しました' },
        { status: 500 }
      )
    }

    // ポイント取引履歴に記録
    const { error: transactionError } = await supabase
      .from('point_transactions')
      .insert({
        customer_id: payload.id,
        transaction_type: 'used',
        points: -validatedData.points,
        balance_after: newBalance,
        description: 'ポイント利用',
      })

    if (transactionError) {
      console.error('Error creating point transaction:', transactionError)
      // ロールバックは簡略化のため省略（実際の実装ではトランザクションを使用）
    }

    return NextResponse.json({
      success: true,
      pointsUsed: validatedData.points,
      newBalance,
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

