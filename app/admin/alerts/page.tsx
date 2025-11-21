'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react'

interface Alert {
  id: string
  alert_type: string
  message: string
  is_resolved: boolean
  created_at: string
  resolved_at: string | null
  customers: {
    id: string
    name: string
    phone_number: string
  }
}

export default function AlertsPage() {
  const router = useRouter()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [resolvedAlerts, setResolvedAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [checking, setChecking] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  useEffect(() => {
    loadAlerts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadAlerts = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      // 未解決のアラート
      const activeRes = await fetch('/api/admin/alerts?isResolved=false&limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // 解決済みのアラート
      const resolvedRes = await fetch('/api/admin/alerts?isResolved=true&limit=50', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (activeRes.ok) {
        const activeData = await activeRes.json()
        setAlerts(activeData.alerts || [])
      }

      if (resolvedRes.ok) {
        const resolvedData = await resolvedRes.json()
        setResolvedAlerts(resolvedData.alerts || [])
      }
    } catch (error) {
      console.error('Error loading alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckAlerts = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setChecking(true)
    try {
      const response = await fetch('/api/admin/alerts/check', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || 'アラート検出に失敗しました')
        return
      }

      alert(`${data.alertsCreated}件のアラートを作成しました`)
      loadAlerts()
    } catch (error) {
      console.error('Error checking alerts:', error)
      alert('サーバーエラーが発生しました')
    } finally {
      setChecking(false)
    }
  }

  const handleResolve = async (alertId: string) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch(`/api/admin/alerts/${alertId}/resolve`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'アラートの解決に失敗しました')
        return
      }

      loadAlerts()
    } catch (error) {
      console.error('Error resolving alert:', error)
      alert('サーバーエラーが発生しました')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">アラート管理</h1>
          <p className="text-muted-foreground mt-1">
            初回来店のみ顧客のアラートを管理します
          </p>
        </div>
        <Button onClick={handleCheckAlerts} disabled={checking}>
          <RefreshCw className={`w-4 h-4 mr-2 ${checking ? 'animate-spin' : ''}`} />
          {checking ? '検出中...' : 'アラートを検出'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            未解決 ({alerts.length})
          </TabsTrigger>
          <TabsTrigger value="resolved">
            解決済み ({resolvedAlerts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>未解決のアラート</CardTitle>
              <CardDescription>
                初回来店のみ顧客のアラート一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              {alerts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  未解決のアラートはありません
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>顧客情報</TableHead>
                      <TableHead>アラート種別</TableHead>
                      <TableHead>メッセージ</TableHead>
                      <TableHead>検出日時</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {alert.customers?.name || '未設定'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {alert.customers?.phone_number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="destructive">
                            {alert.alert_type === 'first_visit_only' ? '初回来店のみ' : alert.alert_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          {format(new Date(alert.created_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResolve(alert.id)}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            解決済みにする
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardHeader>
              <CardTitle>解決済みのアラート</CardTitle>
              <CardDescription>
                過去に解決したアラート一覧
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resolvedAlerts.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  解決済みのアラートはありません
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>顧客情報</TableHead>
                      <TableHead>アラート種別</TableHead>
                      <TableHead>メッセージ</TableHead>
                      <TableHead>解決日時</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {resolvedAlerts.map((alert) => (
                      <TableRow key={alert.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {alert.customers?.name || '未設定'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {alert.customers?.phone_number}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {alert.alert_type === 'first_visit_only' ? '初回来店のみ' : alert.alert_type}
                          </Badge>
                        </TableCell>
                        <TableCell>{alert.message}</TableCell>
                        <TableCell>
                          {alert.resolved_at
                            ? format(new Date(alert.resolved_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

