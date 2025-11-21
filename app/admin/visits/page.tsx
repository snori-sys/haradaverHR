'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Plus } from 'lucide-react'
import Link from 'next/link'

const SERVICE_TYPE_LABELS: Record<string, string> = {
  free: 'フリー',
  net_reservation: 'ネット指名',
  in_store_reservation: '場内指名',
  regular_reservation: '本指名',
}

interface Visit {
  id: string
  visit_date: string
  amount: number
  points_earned: number
  points_used: number
  service_type: string
  notes: string | null
  customers: {
    id: string
    name: string
    phone_number: string
  }
  casts: {
    id: string
    name: string
  } | null
}

export default function VisitsPage() {
  const router = useRouter()
  const [visits, setVisits] = useState<Visit[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    loadVisits()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  const loadVisits = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch(`/api/admin/visits?page=${page}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('admin_token')
          router.push('/admin/login')
          return
        }
        throw new Error('来店履歴の取得に失敗しました')
      }

      const data = await response.json()
      setVisits(data.visits)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      console.error('Error loading visits:', error)
    } finally {
      setLoading(false)
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
          <h1 className="text-3xl font-bold">来店履歴管理</h1>
          <p className="text-muted-foreground mt-1">
            顧客の来店履歴を管理します
          </p>
        </div>
        <Link href="/admin/visits/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            来店履歴を登録
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>来店履歴一覧</CardTitle>
          <CardDescription>
            {page} / {totalPages} ページ
          </CardDescription>
        </CardHeader>
        <CardContent>
          {visits.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              来店履歴がありません
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>来店日時</TableHead>
                    <TableHead>顧客名</TableHead>
                    <TableHead>利用金額</TableHead>
                    <TableHead>付与ポイント</TableHead>
                    <TableHead>使用ポイント</TableHead>
                    <TableHead>キャスト</TableHead>
                    <TableHead>サービス種別</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit) => (
                    <TableRow key={visit.id}>
                      <TableCell>
                        {format(new Date(visit.visit_date), 'yyyy年MM月dd日 HH:mm', { locale: ja })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{visit.customers.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {visit.customers.phone_number}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>¥{visit.amount.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">
                        +{visit.points_earned}pt
                      </TableCell>
                      <TableCell className="text-red-600">
                        {visit.points_used > 0 ? `-${visit.points_used}pt` : '-'}
                      </TableCell>
                      <TableCell>{visit.casts?.name || '-'}</TableCell>
                      <TableCell>
                        <Badge>{SERVICE_TYPE_LABELS[visit.service_type] || visit.service_type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/visits/${visit.id}/edit`}>
                          <Button variant="outline" size="sm">
                            編集
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                  >
                    前へ
                  </Button>
                  <span className="flex items-center px-4">
                    {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                  >
                    次へ
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

