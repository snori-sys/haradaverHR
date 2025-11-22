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
    console.log('Admin registration request received')
    
    const body = await request.json()
    console.log('Request body:', { email: body.email, name: body.name })
    
    // バリデーション
    const validatedData = registerSchema.parse(body)
    console.log('Validation passed:', { email: validatedData.email, name: validatedData.name })

    // 環境変数の確認
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing environment variables:', { 
        hasUrl: !!supabaseUrl, 
        hasKey: !!serviceRoleKey 
      })
      return NextResponse.json(
        { error: 'サーバー設定エラーが発生しました' },
        { status: 500 }
      )
    }

    const supabase = createServiceClient()
    console.log('Supabase client created')

    // 既存のメールアドレスをチェック
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', validatedData.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116は「行が見つからない」エラーで、これは正常（メールアドレスが未登録）
      console.error('Error checking existing admin:', checkError)
      return NextResponse.json(
        { 
          error: 'メールアドレスの確認に失敗しました',
          details: process.env.NODE_ENV === 'development' ? checkError.message : undefined
        },
        { status: 500 }
      )
    }

    if (existingAdmin) {
      console.log('Email already exists:', validatedData.email)
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // パスワードをハッシュ化
    console.log('Hashing password...')
    const passwordHash = await AuthUtils.hashPassword(validatedData.password)
    console.log('Password hashed')

    // 管理者を登録
    console.log('Inserting admin user...')
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
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { 
          error: '管理者登録に失敗しました',
          details: process.env.NODE_ENV === 'development' 
            ? `${error.message}${error.details ? ` (${error.details})` : ''}${error.hint ? ` [${error.hint}]` : ''}` 
            : undefined
        },
        { status: 500 }
      )
    }

    console.log('Admin user created successfully:', { id: admin.id, email: admin.email })

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

