import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">ポイントカードアプリ</CardTitle>
          <CardDescription className="text-center">
            来店履歴とポイントを管理できます
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Link href="/register" className="block">
            <Button className="w-full" size="lg">
              新規登録
            </Button>
          </Link>
          <Link href="/login" className="block">
            <Button className="w-full" variant="outline" size="lg">
              ログイン
            </Button>
          </Link>
          <div className="text-center text-sm text-muted-foreground pt-4">
            <Link href="/admin/login" className="hover:underline">
              管理者はこちら
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
