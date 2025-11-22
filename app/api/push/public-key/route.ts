import { NextResponse } from 'next/server'

// VAPID公開キーを返すAPI
export async function GET() {
  const publicKey = process.env.VAPID_PUBLIC_KEY

  if (!publicKey) {
    return NextResponse.json(
      { error: 'VAPID公開キーが設定されていません' },
      { status: 500 }
    )
  }

  return NextResponse.json({ publicKey })
}

