'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Users, AlertCircle, Settings, Plus } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalCustomers: 0,
    totalAlerts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      // 統計情報を取得（簡易版）
      const [visitsRes, customersRes, alertsRes] = await Promise.all([
        fetch('/api/admin/visits', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => null),
        fetch('/api/admin/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => null),
        fetch('/api/admin/alerts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => null),
      ])

      const visits = visitsRes?.ok ? await visitsRes.json() : []
      const customers = customersRes?.ok ? await customersRes.json() : []
      const alerts = alertsRes?.ok ? await alertsRes.json() : []

      setStats({
        totalVisits: visits?.visits?.length || 0,
        totalCustomers: customers?.customers?.length || 0,
        totalAlerts: alerts?.alerts?.filter((a: any) => !a.is_resolved).length || 0,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div>読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">管理ダッシュボード</h1>
        <p className="text-muted-foreground">システム全体の概要を確認できます</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">来店履歴</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <p className="text-xs text-muted-foreground">総来店数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">顧客数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground">登録顧客数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">未解決アラート</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            <p className="text-xs text-muted-foreground">要対応</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>来店履歴管理</CardTitle>
            <CardDescription>来店履歴の登録・確認・編集</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/visits">
              <Button variant="outline" className="w-full">
                来店履歴を見る
              </Button>
            </Link>
            <Link href="/admin/visits/new">
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                新規登録
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>キャスト管理</CardTitle>
            <CardDescription>キャスト情報の管理</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/casts">
              <Button variant="outline" className="w-full">
                キャスト一覧
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アラート管理</CardTitle>
            <CardDescription>顧客アラートの確認と対応</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/alerts">
              <Button variant="outline" className="w-full">
                アラートを確認
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>設定</CardTitle>
            <CardDescription>システム設定の変更</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/settings">
              <Button variant="outline" className="w-full">
                <Settings className="mr-2 h-4 w-4" />
                設定を開く
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

