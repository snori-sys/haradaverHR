'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Login attempt:', { phoneNumber: formData.phoneNumber })
      
      const response = await fetch('/api/customers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      console.log('Response status:', response.status, response.statusText)

      // レスポンスの内容を確認
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        setError('サーバーからの応答が不正です')
        setLoading(false)
        return
      }

      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        setError(data.error || 'ログインに失敗しました')
        setLoading(false)
        return
      }

      // トークンをローカルストレージとクッキーに保存
      if (data.token) {
        // localStorageに保存（クライアント側の認証チェック用）
        localStorage.setItem('token', data.token)
        
        // クッキーに保存（ミドルウェアの認証チェック用）
        document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
        
        console.log('Token saved to localStorage and cookie')
      } else {
        setError('トークンの取得に失敗しました')
        setLoading(false)
        return
      }

      // ダッシュボードにリダイレクト
      console.log('Redirecting to dashboard...')
      router.push('/dashboard')
      router.refresh() // ページを強制的にリフレッシュ
    } catch (error: any) {
      console.error('Login error:', error)
      setError(`エラーが発生しました: ${error.message || 'サーバーエラー'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
          <CardDescription>
            電話番号とパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">電話番号</Label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="09012345678"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'ログイン中...' : 'ログイン'}
            </Button>

            <div className="text-center text-sm">
              <Link href="/register" className="text-primary hover:underline">
                新規登録はこちら
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

