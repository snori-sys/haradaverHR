import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const createCastSchema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  code: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

const updateCastSchema = createCastSchema.partial().extend({
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

    // トークンを検証（管理者または顧客も閲覧可能）
    const payload = AuthUtils.verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: '無効なトークンです' },
        { status: 401 }
      )
    }

    const supabase = createServiceClient()

    // キャスト一覧を取得
    const { data: casts, error } = await supabase
      .from('casts')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching casts:', error)
      return NextResponse.json(
        { error: 'キャスト一覧の取得に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      casts: casts || [],
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
    const validatedData = createCastSchema.parse(body)

    const supabase = createServiceClient()

    // キャストを登録
    const { data: cast, error } = await supabase
      .from('casts')
      .insert({
        name: validatedData.name,
        code: validatedData.code || null,
        is_active: validatedData.isActive,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating cast:', error)
      return NextResponse.json(
        { error: 'キャストの登録に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      cast,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'バリデーションエラーが発生しました' },
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
    const validatedData = updateCastSchema.parse(body)

    const supabase = createServiceClient()

    // 更新データを準備
    const updateData: any = {}
    if (validatedData.name !== undefined) updateData.name = validatedData.name
    if (validatedData.code !== undefined) updateData.code = validatedData.code
    if (validatedData.isActive !== undefined) updateData.is_active = validatedData.isActive

    // キャストを更新
    const { data: cast, error } = await supabase
      .from('casts')
      .update(updateData)
      .eq('id', validatedData.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating cast:', error)
      return NextResponse.json(
        { error: 'キャストの更新に失敗しました' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      cast,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0]
      return NextResponse.json(
        { error: firstError?.message || 'バリデーションエラーが発生しました' },
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

