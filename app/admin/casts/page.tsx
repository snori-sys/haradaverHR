'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface Cast {
  id: string
  name: string
  code: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function CastsPage() {
  const router = useRouter()
  const [casts, setCasts] = useState<Cast[]>([])
  const [newCastName, setNewCastName] = useState('')
  const [newCastCode, setNewCastCode] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editCode, setEditCode] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCasts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadCasts = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/admin/casts', {
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
        throw new Error('キャスト一覧の取得に失敗しました')
      }

      const data = await response.json()
      setCasts(data.casts || [])
    } catch (error) {
      console.error('Error loading casts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newCastName.trim()) return

    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/casts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCastName,
          code: newCastCode || null,
          isActive: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '追加に失敗しました')
        return
      }

      setNewCastName('')
      setNewCastCode('')
      loadCasts()
    } catch (error) {
      console.error('Error adding cast:', error)
      alert('追加に失敗しました')
    }
  }

  const handleEdit = (id: string) => {
    const cast = casts.find((c) => c.id === id)
    if (cast) {
      setEditingId(id)
      setEditName(cast.name)
      setEditCode(cast.code || '')
    }
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editName.trim()) return

    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/casts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingId,
          name: editName,
          code: editCode || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '更新に失敗しました')
        return
      }

      setEditingId(null)
      setEditName('')
      setEditCode('')
      loadCasts()
    } catch (error) {
      console.error('Error updating cast:', error)
      alert('更新に失敗しました')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditName('')
    setEditCode('')
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    try {
      const response = await fetch('/api/admin/casts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          isActive: !currentActive,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.error || '更新に失敗しました')
        return
      }

      loadCasts()
    } catch (error) {
      console.error('Error toggling cast:', error)
      alert('更新に失敗しました')
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
      <div>
        <h1 className="text-3xl font-bold">キャスト管理</h1>
        <p className="text-muted-foreground mt-1">
          キャスト情報を管理します
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>キャスト一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 追加フォーム */}
            <div className="flex gap-2 pb-4 border-b">
              <Input
                placeholder="キャスト名 *"
                value={newCastName}
                onChange={(e) => setNewCastName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="コード（任意）"
                value={newCastCode}
                onChange={(e) => setNewCastCode(e.target.value)}
                className="w-32"
              />
              <Button onClick={handleAdd}>
                <Plus className="w-4 h-4 mr-2" />
                追加
              </Button>
            </div>

            {/* キャスト一覧 */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>名前</TableHead>
                  <TableHead>コード</TableHead>
                  <TableHead>状態</TableHead>
                  <TableHead>稼働実績</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {casts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      キャストが登録されていません
                    </TableCell>
                  </TableRow>
                ) : (
                  casts.map((cast) => (
                    <TableRow key={cast.id}>
                      <TableCell>
                        {editingId === cast.id ? (
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-48"
                          />
                        ) : (
                          <div className="font-medium">{cast.name}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === cast.id ? (
                          <Input
                            value={editCode}
                            onChange={(e) => setEditCode(e.target.value)}
                            className="w-32"
                          />
                        ) : (
                          <span className="text-muted-foreground">{cast.code || '-'}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={cast.is_active ? 'default' : 'secondary'}>
                          {cast.is_active ? '有効' : '無効'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/casts/${cast.id}/performance`}>
                          <Button variant="outline" size="sm">
                            実績を見る
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        {editingId === cast.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(cast.id)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Switch
                              checked={cast.is_active}
                              onCheckedChange={() => handleToggleActive(cast.id, cast.is_active)}
                            />
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

