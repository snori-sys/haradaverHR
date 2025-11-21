import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const loginSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10,11}$/, '電話番号は10桁または11桁の数字で入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validatedData = loginSchema.parse(body)

    const supabase = createServiceClient()

    // 顧客を検索
    const { data: customer, error } = await supabase
      .from('customers')
      .select('*')
      .eq('phone_number', validatedData.phoneNumber)
      .eq('is_active', true)
      .single()

    if (error || !customer) {
      return NextResponse.json(
        { error: '電話番号またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // パスワードを検証
    const isPasswordValid = await AuthUtils.verifyPassword(
      validatedData.password,
      customer.password_hash
    )

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: '電話番号またはパスワードが正しくありません' },
        { status: 401 }
      )
    }

    // JWTトークンを生成
    const token = AuthUtils.generateToken({
      id: customer.id,
      type: 'customer',
      phoneNumber: customer.phone_number,
    })

    return NextResponse.json({
      token,
      customer: {
        id: customer.id,
        phoneNumber: customer.phone_number,
        name: customer.name,
        email: customer.email,
        currentPoints: customer.current_points,
        totalEarnedPoints: customer.total_earned_points,
        totalUsedPoints: customer.total_used_points,
      },
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "バリデーションエラーが発生しました" },
        { status: 400 }
      )
    }

    console.error('Customer login error:', error)
    
    // エラーメッセージを詳細に
    const errorMessage = error?.message || 'サーバーエラーが発生しました'
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

