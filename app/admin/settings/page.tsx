'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Save } from 'lucide-react'

interface Setting {
  id: string
  key: string
  value: string
  description: string | null
}

export default function SettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Setting[]>([])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSettings = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const response = await fetch('/api/admin/settings', {
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
        throw new Error('設定の取得に失敗しました')
      }

      const data = await response.json()
      setSettings(data.settings || [])
      
      // フォームデータを初期化
      const initialFormData: Record<string, string> = {}
      data.settings.forEach((setting: Setting) => {
        initialFormData[setting.key] = setting.value
      })
      setFormData(initialFormData)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (key: string) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setSaving((prev) => ({ ...prev, [key]: true }))
    setErrors((prev) => ({ ...prev, [key]: '' }))

    try {
      const response = await fetch(`/api/admin/settings/${key}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          value: formData[key],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, [key]: data.error || '更新に失敗しました' }))
        return
      }

      // 成功メッセージ（簡略化のためalertを使用）
      alert('設定を更新しました')
      loadSettings() // 最新の設定を再読み込み
    } catch (error) {
      console.error('Error saving setting:', error)
      setErrors((prev) => ({ ...prev, [key]: 'サーバーエラーが発生しました' }))
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>読み込み中...</div>
      </div>
    )
  }

  const settingConfigs: Record<string, { label: string; type: string; unit?: string }> = {
    point_rate: { label: 'ポイント還元率', type: 'number', unit: '%' },
    min_points_to_use: { label: 'ポイント利用可能最小値', type: 'number', unit: 'pt' },
    point_unit: { label: 'ポイント利用単位', type: 'number', unit: 'pt' },
    alert_email: { label: 'アラート送信先メールアドレス', type: 'email' },
    alert_days: { label: '初回来店のみ顧客のアラート日数', type: 'number', unit: '日' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">マスタ設定</h1>
        <p className="text-muted-foreground mt-1">
          システムの基本設定を管理します
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>システム設定</CardTitle>
          <CardDescription>
            ポイントカードシステムの各種設定
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {settings.map((setting) => {
              const config = settingConfigs[setting.key]
              if (!config) return null

              return (
                <div key={setting.id} className="space-y-2 border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={setting.key} className="text-base font-medium">
                        {config.label}
                      </Label>
                      {setting.description && (
                        <p className="text-sm text-muted-foreground">
                          {setting.description}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Input
                          id={setting.key}
                          type={config.type}
                          value={formData[setting.key] || ''}
                          onChange={(e) =>
                            setFormData((prev) => ({ ...prev, [setting.key]: e.target.value }))
                          }
                          className="max-w-xs"
                          placeholder={setting.value}
                        />
                        {config.unit && (
                          <span className="flex items-center text-sm text-muted-foreground">
                            {config.unit}
                          </span>
                        )}
                      </div>
                      {errors[setting.key] && (
                        <p className="text-sm text-red-600">{errors[setting.key]}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => handleSave(setting.key)}
                      disabled={saving[setting.key]}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {saving[setting.key] ? '保存中...' : '保存'}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

