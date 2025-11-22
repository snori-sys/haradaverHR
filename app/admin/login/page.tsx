'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      console.log('Login attempt:', { email: formData.email })
      
      const response = await fetch('/api/admin/login', {
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
        localStorage.setItem('admin_token', data.token)
        
        // クッキーに保存（ミドルウェアの認証チェック用）
        document.cookie = `admin_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`
        
        console.log('Token saved to localStorage and cookie')
      } else {
        setError('トークンの取得に失敗しました')
        setLoading(false)
        return
      }

      // 管理画面ダッシュボードにリダイレクト
      console.log('Redirecting to dashboard...')
      router.push('/admin/dashboard')
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
          <CardTitle>管理者ログイン</CardTitle>
          <CardDescription>
            メールアドレスとパスワードを入力してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
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
              <Link href="/admin/register" className="text-primary hover:underline">
                アカウントをお持ちでない方は登録
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

