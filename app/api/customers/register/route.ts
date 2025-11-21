import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const registerSchema = z.object({
  phoneNumber: z.string().regex(/^\d{10,11}$/, '電話番号は10桁または11桁の数字で入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください').optional().or(z.literal('')),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // バリデーション
    const validatedData = registerSchema.parse(body)

    const supabase = createServiceClient()

    // 既存の電話番号をチェック
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('phone_number', validatedData.phoneNumber)
      .single()

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'この電話番号は既に登録されています' },
        { status: 400 }
      )
    }

    // パスワードをハッシュ化
    const passwordHash = await AuthUtils.hashPassword(validatedData.password)

    // 顧客を登録
    const { data: customer, error } = await supabase
      .from('customers')
      .insert({
        phone_number: validatedData.phoneNumber,
        password_hash: passwordHash,
        name: validatedData.name,
        email: validatedData.email || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Customer registration error:', error)
      return NextResponse.json(
        { error: '顧客登録に失敗しました' },
        { status: 500 }
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
      },
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

