import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const registerSchema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z.string().min(8, 'パスワードは8文字以上で入力してください'),
  name: z.string().min(1, '名前を入力してください'),
})

export async function POST(request: NextRequest) {
  try {
    // 開発環境のみ許可（本番環境では削除または適切な認証を実装）
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: '本番環境では管理者登録は無効です' },
        { status: 403 }
      )
    }

    const body = await request.json()
    
    // バリデーション
    const validatedData = registerSchema.parse(body)

    const supabase = createServiceClient()

    // 既存のメールアドレスをチェック
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // パスワードをハッシュ化
    const passwordHash = await AuthUtils.hashPassword(validatedData.password)

    // 管理者を登録
    const { data: admin, error } = await supabase
      .from('admin_users')
      .insert({
        email: validatedData.email,
        password_hash: passwordHash,
        name: validatedData.name,
        role: 'admin',
      })
      .select()
      .single()

    if (error) {
      console.error('Admin registration error:', error)
      return NextResponse.json(
        { error: '管理者登録に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
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

