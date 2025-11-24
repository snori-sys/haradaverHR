'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Send, History, Users, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Customer {
  id: string
  name: string
  phoneNumber: string
}

interface Notification {
  id: string
  title: string
  body: string
  sent_count: number
  failed_count: number
  status: string
  created_at: string
  sent_at: string | null
}

interface Subscription {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function PushNotificationsPage() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [url, setUrl] = useState('')
  const [sendType, setSendType] = useState<'all' | 'selected'>('all')
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadCustomers()
    loadNotifications()
    loadSubscriptions()
  }, [])

  const loadCustomers = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/customers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error loading customers:', error)
    }
  }

  const loadNotifications = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/push-notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications || [])
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const loadSubscriptions = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/push/subscriptions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setSubscriptions(data.subscriptions || [])
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error)
    }
  }

  const handleSend = async () => {
    if (!title || !body) {
      alert('タイトルと本文を入力してください')
      return
    }

    if (sendType === 'selected' && selectedCustomers.length === 0) {
      alert('送信先の顧客を選択してください')
      return
    }

    setSending(true)

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        alert('ログインが必要です')
        return
      }

      const response = await fetch('/api/admin/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
          url: url || undefined,
          customerIds: sendType === 'selected' ? selectedCustomers : undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '通知の送信に失敗しました')
        return
      }

      // 成功メッセージ
      alert(`通知を送信しました（成功: ${data.sentCount}件、失敗: ${data.failedCount}件）`)

      // フォームをリセット
      setTitle('')
      setBody('')
      setUrl('')
      setSendType('all')
      setSelectedCustomers([])

      // 通知履歴を再読み込み
      loadNotifications()
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('サーバーエラーが発生しました')
    } finally {
      setSending(false)
    }
  }

  const toggleCustomer = (customerId: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">プッシュ通知送信</h1>
        <p className="text-muted-foreground">顧客にプッシュ通知を送信できます</p>
      </div>

      <Tabs defaultValue="send" className="space-y-4">
        <TabsList>
          <TabsTrigger value="send">
            <Send className="w-4 h-4 mr-2" />
            通知送信
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="w-4 h-4 mr-2" />
            送信履歴
          </TabsTrigger>
          <TabsTrigger value="subscriptions">
            <Users className="w-4 h-4 mr-2" />
            サブスクリプション状態
          </TabsTrigger>
        </TabsList>

        <TabsContent value="send">
          <Card>
            <CardHeader>
              <CardTitle>プッシュ通知を作成</CardTitle>
              <CardDescription>
                タイトルと本文を入力して、顧客にプッシュ通知を送信します
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">タイトル *</Label>
                <Input
                  id="title"
                  placeholder="例: 期間限定キャンペーン実施中！"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="body">本文 *</Label>
                <Textarea
                  id="body"
                  placeholder="例: 今月限定でポイント2倍キャンペーンを実施しています。お見逃しなく！"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">リンクURL（オプション）</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com/campaign"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  通知をクリックしたときに開くURL（省略可能）
                </p>
              </div>

              <div className="space-y-4">
                <Label>送信先</Label>
                <Select value={sendType} onValueChange={(value: 'all' | 'selected') => setSendType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全顧客に送信（{customers.length}人）</SelectItem>
                    <SelectItem value="selected">選択した顧客に送信</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {sendType === 'selected' && (
                <div className="space-y-2">
                  <Label>送信先を選択</Label>
                  <div className="border rounded-md p-4 max-h-60 overflow-y-auto space-y-2">
                    {customers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">顧客が見つかりません</p>
                    ) : (
                      customers.map((customer) => (
                        <div
                          key={customer.id}
                          className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                          onClick={() => toggleCustomer(customer.id)}
                        >
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => toggleCustomer(customer.id)}
                            className="w-4 h-4"
                          />
                          <div>
                            <div className="font-medium">{customer.name || '名前未設定'}</div>
                            <div className="text-sm text-muted-foreground">{customer.phoneNumber}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {selectedCustomers.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {selectedCustomers.length}人の顧客を選択中
                    </p>
                  )}
                </div>
              )}

              <Button
                onClick={handleSend}
                disabled={sending || !title || !body}
                className="w-full"
                size="lg"
              >
                {sending ? (
                  <>
                    <Send className="w-4 h-4 mr-2 animate-spin" />
                    送信中...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    プッシュ通知を送信
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>送信履歴</CardTitle>
              <CardDescription>
                過去に送信したプッシュ通知の履歴を確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
                      </div>
                      <Badge
                        variant={
                          notification.status === 'completed'
                            ? 'default'
                            : notification.status === 'failed'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {notification.status === 'completed' && '送信完了'}
                        {notification.status === 'failed' && '送信失敗'}
                        {notification.status === 'sending' && '送信中'}
                        {notification.status === 'pending' && '待機中'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>成功: {notification.sent_count}件</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span>失敗: {notification.failed_count}件</span>
                      </div>
                      {notification.sent_at && (
                        <span>
                          {format(new Date(notification.sent_at), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    送信履歴がありません
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>プッシュ通知サブスクリプション状態</CardTitle>
              <CardDescription>
                顧客がプッシュ通知を有効にしているかどうかを確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  <strong>重要:</strong> プッシュ通知を送信するには、顧客がダッシュボードでプッシュ通知を有効にする必要があります。
                  現在、{subscriptions.filter((s) => s.isActive).length}人の顧客がプッシュ通知を有効にしています。
                </p>
              </div>
              <div className="space-y-4">
                {subscriptions.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    サブスクリプションがありません。顧客がプッシュ通知を有効にする必要があります。
                  </div>
                ) : (
                  <div className="space-y-2">
                    {subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="border rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-semibold">{subscription.customerName}</div>
                          <div className="text-sm text-muted-foreground">
                            {subscription.customerPhone}
                            {subscription.customerEmail && ` / ${subscription.customerEmail}`}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            登録日: {format(new Date(subscription.createdAt), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                          </div>
                        </div>
                        <Badge variant={subscription.isActive ? 'default' : 'secondary'}>
                          {subscription.isActive ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              有効
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 mr-1" />
                              無効
                            </>
                          )}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

