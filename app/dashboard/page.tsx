'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { LogOut, Gift } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Customer {
  id: string
  phoneNumber: string
  name: string
  email: string | null
  currentPoints: number
  totalEarnedPoints: number
  totalUsedPoints: number
}

interface Visit {
  id: string
  visit_date: string
  amount: number
  points_earned: number
  points_used: number
  service_type: string
  notes: string | null
  casts: {
    id: string
    name: string
  } | null
}

interface PointTransaction {
  id: string
  transaction_type: string
  points: number
  balance_after: number
  description: string | null
  created_at: string
}

const SERVICE_TYPE_LABELS: Record<string, string> = {
  free: 'フリー',
  net_reservation: 'ネット指名',
  in_store_reservation: '場内指名',
  regular_reservation: '本指名',
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [visits, setVisits] = useState<Visit[]>([])
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [usePointsDialogOpen, setUsePointsDialogOpen] = useState(false)
  const [selectedPoints, setSelectedPoints] = useState<number>(500)
  const [availableUnits, setAvailableUnits] = useState<number[]>([])
  const [settings, setSettings] = useState({ minPoints: 500, pointUnit: 500 })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      // 顧客情報を取得
      const customerRes = await fetch('/api/customers/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!customerRes.ok) {
        localStorage.removeItem('token')
        router.push('/login')
        return
      }

      const customerData = await customerRes.json()
      setCustomer(customerData.customer)

      // 設定を取得（顧客も閲覧可能な設定のみ）
      const settingsRes = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json()
        const minPoints = parseInt(settingsData.settings.find((s: any) => s.key === 'min_points_to_use')?.value || '500')
        const pointUnit = parseInt(settingsData.settings.find((s: any) => s.key === 'point_unit')?.value || '500')
        setSettings({ minPoints, pointUnit })
        
        // 利用可能なポイント単位を計算
        const units: number[] = []
        let unit = minPoints
        while (unit <= customerData.customer.currentPoints) {
          units.push(unit)
          unit += pointUnit
        }
        setAvailableUnits(units)
        if (units.length > 0) {
          setSelectedPoints(units[0])
        }
      }

      // 来店履歴を取得
      const visitsRes = await fetch('/api/visits?limit=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (visitsRes.ok) {
        const visitsData = await visitsRes.json()
        setVisits(visitsData.visits)
      }

      // ポイント取引履歴を取得
      const transactionsRes = await fetch('/api/point-transactions?limit=10', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json()
        setTransactions(transactionsData.transactions)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const handleUsePoints = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const response = await fetch('/api/points/use', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ points: selectedPoints }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'ポイント利用に失敗しました')
        return
      }

      setUsePointsDialogOpen(false)
      loadData() // データを再読み込み
    } catch (error) {
      console.error('Error using points:', error)
      alert('サーバーエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>読み込み中...</div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ポイントカード</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            ログアウト
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ポイント情報カード */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>ポイント残高</CardTitle>
            <CardDescription>{customer.name}さん</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary mb-4">
              {customer.currentPoints.toLocaleString()}pt
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">累計獲得</div>
                <div className="font-semibold">{customer.totalEarnedPoints.toLocaleString()}pt</div>
              </div>
              <div>
                <div className="text-muted-foreground">累計使用</div>
                <div className="font-semibold">{customer.totalUsedPoints.toLocaleString()}pt</div>
              </div>
              <div>
                <div className="text-muted-foreground">次回利用可能</div>
                <div className="font-semibold">
                  {availableUnits.length > 0 ? `${availableUnits[0].toLocaleString()}pt` : '不足'}
                </div>
              </div>
            </div>
            {customer.currentPoints >= settings.minPoints && (
              <Button
                className="mt-4 w-full"
                onClick={() => setUsePointsDialogOpen(true)}
              >
                <Gift className="w-4 h-4 mr-2" />
                ポイントを利用する
              </Button>
            )}
          </CardContent>
        </Card>

        {/* タブ */}
        <Tabs defaultValue="visits" className="space-y-4">
          <TabsList>
            <TabsTrigger value="visits">来店履歴</TabsTrigger>
            <TabsTrigger value="transactions">ポイント取引履歴</TabsTrigger>
          </TabsList>

          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <CardTitle>来店履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {visits.map((visit) => (
                    <div key={visit.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">
                            {format(new Date(visit.visit_date), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {visit.casts?.name || '未設定'}
                          </div>
                        </div>
                        <Badge>{SERVICE_TYPE_LABELS[visit.service_type] || visit.service_type}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm mt-2">
                        <div>
                          <span className="text-muted-foreground">利用金額: </span>
                          <span className="font-semibold">¥{visit.amount.toLocaleString()}</span>
                        </div>
                        {visit.points_earned > 0 && (
                          <div className="text-green-600">
                            +{visit.points_earned}pt 付与
                          </div>
                        )}
                        {visit.points_used > 0 && (
                          <div className="text-red-600">
                            -{visit.points_used}pt 使用
                          </div>
                        )}
                      </div>
                      {visit.notes && (
                        <div className="text-sm text-muted-foreground mt-2">
                          {visit.notes}
                        </div>
                      )}
                    </div>
                  ))}
                  {visits.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      来店履歴がありません
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>ポイント取引履歴</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="border-b pb-4 last:border-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">
                            {transaction.description || 'ポイント取引'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(transaction.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                          </div>
                        </div>
                        <div className={`font-semibold ${transaction.points > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.points > 0 ? '+' : ''}
                          {transaction.points.toLocaleString()}pt
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        残高: {transaction.balance_after.toLocaleString()}pt
                      </div>
                    </div>
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      取引履歴がありません
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ポイント利用ダイアログ */}
      <Dialog open={usePointsDialogOpen} onOpenChange={setUsePointsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ポイントを利用する</DialogTitle>
            <DialogDescription>
              利用するポイント数を選択してください
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">利用ポイント</label>
              <Select value={selectedPoints.toString()} onValueChange={(value) => setSelectedPoints(parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit} value={unit.toString()}>
                      {unit.toLocaleString()}ポイント
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              現在の残高: {customer.currentPoints.toLocaleString()}pt
              <br />
              利用後残高: {(customer.currentPoints - selectedPoints).toLocaleString()}pt
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUsePointsDialogOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleUsePoints}>利用する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

