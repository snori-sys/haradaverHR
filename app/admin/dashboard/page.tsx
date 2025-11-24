'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Calendar, Users, AlertCircle, Settings, Plus } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Input } from '@/components/ui/input'

interface Customer {
  id: string
  name: string
  phoneNumber: string
  email: string | null
  currentPoints: number
  totalEarnedPoints: number
  totalUsedPoints: number
  firstVisitDate: string | null
  lastVisitDate: string | null
  createdAt: string
  isActive: boolean
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    totalCustomers: 0,
    totalAlerts: 0,
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingCustomers, setLoadingCustomers] = useState(true)

  useEffect(() => {
    loadStats()
    loadCustomers()
  }, [])

  useEffect(() => {
    // 検索クエリでフィルタリング
    if (!searchQuery.trim()) {
      setFilteredCustomers(customers)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = customers.filter(
        (customer) =>
          customer.name?.toLowerCase().includes(query) ||
          customer.phoneNumber?.includes(query) ||
          customer.email?.toLowerCase().includes(query)
      )
      setFilteredCustomers(filtered)
    }
  }, [searchQuery, customers])

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
      const customersData = customersRes?.ok ? await customersRes.json() : []
      const alerts = alertsRes?.ok ? await alertsRes.json() : []

      setStats({
        totalVisits: visits?.visits?.length || 0,
        totalCustomers: customersData?.customers?.length || 0,
        totalAlerts: alerts?.alerts?.filter((a: any) => !a.is_resolved).length || 0,
      })
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      const response = await fetch('/api/admin/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('顧客一覧の取得に失敗しました')
      }

      const data = await response.json()
      setCustomers(data.customers || [])
      setFilteredCustomers(data.customers || [])
    } catch (error) {
      console.error('Failed to load customers:', error)
    } finally {
      setLoadingCustomers(false)
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

      {/* 顧客一覧セクション */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            登録者一覧
          </CardTitle>
          <CardDescription>
            登録されている顧客の一覧です。名前、電話番号、メール、ポイントなどを確認できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 検索ボックス */}
          <div className="mb-4">
            <Input
              placeholder="名前、電話番号、メールで検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          {/* 顧客一覧テーブル */}
          {loadingCustomers ? (
            <div className="flex items-center justify-center py-8">
              <div>読み込み中...</div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {searchQuery ? '検索結果が見つかりませんでした' : '登録されている顧客がいません'}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>電話番号</TableHead>
                    <TableHead>メール</TableHead>
                    <TableHead className="text-right">現在のポイント</TableHead>
                    <TableHead className="text-right">獲得ポイント</TableHead>
                    <TableHead className="text-right">使用ポイント</TableHead>
                    <TableHead>初回来店日</TableHead>
                    <TableHead>最終来店日</TableHead>
                    <TableHead>登録日</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-medium">
                        {customer.name || '（未設定）'}
                      </TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>{customer.email || '（未設定）'}</TableCell>
                      <TableCell className="text-right font-medium">
                        {customer.currentPoints.toLocaleString()}pt
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {customer.totalEarnedPoints.toLocaleString()}pt
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {customer.totalUsedPoints.toLocaleString()}pt
                      </TableCell>
                      <TableCell>
                        {customer.firstVisitDate
                          ? format(new Date(customer.firstVisitDate), 'yyyy/MM/dd', { locale: ja })
                          : '（なし）'}
                      </TableCell>
                      <TableCell>
                        {customer.lastVisitDate
                          ? format(new Date(customer.lastVisitDate), 'yyyy/MM/dd', { locale: ja })
                          : '（なし）'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(customer.createdAt), 'yyyy/MM/dd', { locale: ja })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* 統計情報 */}
          {!loadingCustomers && filteredCustomers.length > 0 && (
            <div className="mt-4 text-sm text-muted-foreground">
              表示中: {filteredCustomers.length} / {customers.length} 件
              {searchQuery && `（検索: "${searchQuery}"）`}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

