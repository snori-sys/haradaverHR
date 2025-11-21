'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon, Save, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const SERVICE_TYPES = [
  { value: 'free', label: 'フリー' },
  { value: 'net_reservation', label: 'ネット指名' },
  { value: 'in_store_reservation', label: '場内指名' },
  { value: 'regular_reservation', label: '本指名' },
]

interface Customer {
  id: string
  name: string
  phone_number: string
}

interface Cast {
  id: string
  name: string
}

export default function NewVisitPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    customerId: '',
    visitDate: new Date(),
    amount: '',
    castId: '',
    serviceType: 'free',
    notes: '',
  })
  const [customers, setCustomers] = useState<Customer[]>([])
  const [casts, setCasts] = useState<Cast[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCasts()
  }, [])

  useEffect(() => {
    if (customerSearch.length >= 3) {
      searchCustomers()
    } else {
      setCustomers([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSearch])

  const loadCasts = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/casts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCasts(data.casts || [])
      }
    } catch (error) {
      console.error('Error loading casts:', error)
    }
  }

  const searchCustomers = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch(
        `/api/admin/customers?search=${encodeURIComponent(customerSearch)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error searching customers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/admin/visits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerId: formData.customerId,
          visitDate: formData.visitDate.toISOString(),
          amount: parseInt(formData.amount),
          castId: formData.castId || null,
          serviceType: formData.serviceType,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || '来店履歴の登録に失敗しました')
        setLoading(false)
        return
      }

      // 来店履歴一覧にリダイレクト
      router.push('/admin/visits')
    } catch (error) {
      console.error('Error creating visit:', error)
      setError('サーバーエラーが発生しました')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/visits">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">来店履歴を登録</h1>
          <p className="text-muted-foreground mt-1">
            新しい来店履歴を登録します
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>来店履歴情報</CardTitle>
          <CardDescription>来店履歴の詳細を入力してください</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer">顧客 *</Label>
              <div className="space-y-2">
                <Input
                  id="customer"
                  type="text"
                  placeholder="電話番号で検索..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                />
                {customers.length > 0 && (
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customerId: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="顧客を選択" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.phone_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
              {formData.customerId && (
                <p className="text-sm text-muted-foreground">
                  選択された顧客: {customers.find((c) => c.id === formData.customerId)?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>来店日時 *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !formData.visitDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.visitDate ? (
                      format(formData.visitDate, 'yyyy年MM月dd日 HH:mm', { locale: ja })
                    ) : (
                      <span>日付を選択</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.visitDate}
                    onSelect={(date) => date && setFormData({ ...formData, visitDate: date })}
                    locale={ja}
                  />
                </PopoverContent>
              </Popover>
              <Input
                type="time"
                value={format(formData.visitDate, 'HH:mm')}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':')
                  const newDate = new Date(formData.visitDate)
                  newDate.setHours(parseInt(hours || '0'), parseInt(minutes || '0'))
                  setFormData({ ...formData, visitDate: newDate })
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">利用金額 *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cast">キャスト</Label>
              <Select
                value={formData.castId}
                onValueChange={(value) =>
                  setFormData({ ...formData, castId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="キャストを選択" />
                </SelectTrigger>
                <SelectContent>
                  {casts.map((cast) => (
                    <SelectItem key={cast.id} value={cast.id}>
                      {cast.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serviceType">サービス種別 *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, serviceType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">メモ</Label>
              <Textarea
                id="notes"
                placeholder="メモを入力..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-4">
              <Link href="/admin/visits">
                <Button type="button" variant="outline">
                  キャンセル
                </Button>
              </Link>
              <Button type="submit" disabled={loading}>
                <Save className="w-4 h-4 mr-2" />
                {loading ? '登録中...' : '登録'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

