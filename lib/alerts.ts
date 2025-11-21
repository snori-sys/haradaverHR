/**
 * アラート検出ロジック
 */

import { createServiceClient } from '@/lib/supabase/service'

/**
 * 初回来店のみの顧客を検出してアラートを作成
 */
export async function checkFirstVisitOnlyAlerts() {
  const supabase = createServiceClient()

  try {
    // 設定を取得
    const { data: settings } = await supabase
      .from('settings')
      .select('key, value')
      .in('key', ['alert_days'])

    const alertDays = parseInt(
      settings?.find((s) => s.key === 'alert_days')?.value || '90'
    )

    // 初回来店のみの顧客を検出
    // 1. 初回来店日が設定されている
    // 2. 来店履歴が1件のみ
    // 3. 初回来店日からalertDays日以上経過している
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - alertDays)

    // 初回来店のみの顧客を取得
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('id, name, phone_number, first_visit_date')
      .not('first_visit_date', 'is', null)
      .lte('first_visit_date', cutoffDate.toISOString())

    if (customersError) {
      console.error('Error fetching customers:', customersError)
      return { success: false, error: customersError }
    }

    if (!customers || customers.length === 0) {
      return { success: true, alertsCreated: 0 }
    }

    // 各顧客の来店履歴数を確認
    let alertsCreated = 0
    for (const customer of customers) {
      const { data: visits, error: visitsError } = await supabase
        .from('visits')
        .select('id')
        .eq('customer_id', customer.id)

      if (visitsError) {
        console.error(`Error fetching visits for customer ${customer.id}:`, visitsError)
        continue
      }

      // 来店履歴が1件のみの場合
      if (visits && visits.length === 1) {
        // 既存のアラートをチェック
        const { data: existingAlert } = await supabase
          .from('alerts')
          .select('id')
          .eq('customer_id', customer.id)
          .eq('alert_type', 'first_visit_only')
          .eq('is_resolved', false)
          .single()

        if (!existingAlert) {
          // アラートを作成
          const { error: alertError } = await supabase
            .from('alerts')
            .insert({
              customer_id: customer.id,
              alert_type: 'first_visit_only',
              message: `${customer.name || customer.phone_number}さんは初回来店から${alertDays}日以上経過しています`,
              is_resolved: false,
            })

          if (!alertError) {
            alertsCreated++
          } else {
            console.error(`Error creating alert for customer ${customer.id}:`, alertError)
          }
        }
      }
    }

    return { success: true, alertsCreated }
  } catch (error) {
    console.error('Unexpected error in checkFirstVisitOnlyAlerts:', error)
    return { success: false, error }
  }
}

