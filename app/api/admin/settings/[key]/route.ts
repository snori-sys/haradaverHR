import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { AuthUtils } from '@/lib/auth'
import { z } from 'zod'

// バリデーションスキーマ
const updateSettingSchema = z.object({
  value: z.string().min(1, '値を入力してください'),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
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

    // パラメータを解決
    const { key } = await params

    const body = await request.json()
    
    // バリデーション
    const validatedData = updateSettingSchema.parse(body)

    const supabase = createServiceClient()

    // 設定のバリデーション（値の範囲チェックなど）
    let numericValue: number | null = null
    if (key === 'point_rate') {
      numericValue = parseFloat(validatedData.value)
      if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
        return NextResponse.json(
          { error: 'ポイント還元率は0-100の範囲で入力してください' },
          { status: 400 }
        )
      }
    } else if (key === 'min_points_to_use' || key === 'point_unit') {
      numericValue = parseInt(validatedData.value)
      if (isNaN(numericValue) || numericValue <= 0) {
        return NextResponse.json(
          { error: '正の整数で入力してください' },
          { status: 400 }
        )
      }
    } else if (key === 'alert_days') {
      numericValue = parseInt(validatedData.value)
      if (isNaN(numericValue) || numericValue < 1) {
        return NextResponse.json(
          { error: '1以上の整数で入力してください' },
          { status: 400 }
        )
      }
    } else if (key === 'alert_email') {
      // メールアドレスの形式チェック（空文字は許可）
      if (validatedData.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(validatedData.value)) {
        return NextResponse.json(
          { error: '正しいメールアドレスを入力してください' },
          { status: 400 }
        )
      }
    }

    // 設定を更新
    const { data: setting, error } = await supabase
      .from('settings')
      .update({
        value: validatedData.value,
        updated_by: payload.id,
      })
      .eq('key', key)
      .select()
      .single()

    if (error) {
      console.error('Error updating setting:', error)
      return NextResponse.json(
        { error: '設定の更新に失敗しました' },
        { status: 500 }
      )
    }

    if (!setting) {
      return NextResponse.json(
        { error: '設定が見つかりません' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      setting,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
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

