# Supabase SQL実行手順

## 📋 実行するSQLファイル

`supabase/push-notifications-schema.sql`

## 🚀 実行手順

### ステップ1: Supabaseダッシュボードにアクセス

1. **Supabaseダッシュボードを開く**
   - https://supabase.com/dashboard/project/hgcmbmcjzdfugbnljkel
   - ログインが必要な場合はログインしてください

### ステップ2: SQL Editorを開く

1. **左サイドバーから「SQL Editor」をクリック**
   - または、上部メニューから「SQL Editor」を選択

2. **「New query」をクリック**
   - 新しいクエリエディタを開く

### ステップ3: SQLを貼り付けて実行

以下のSQLをすべてコピーして、SQL Editorに貼り付けてください：

```sql
-- プッシュ通知機能用のテーブル追加

-- 8. push_subscriptions（プッシュ通知サブスクリプションテーブル）
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  user_agent TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(endpoint)
);

-- 9. push_notifications（プッシュ通知履歴テーブル）
CREATE TABLE IF NOT EXISTS push_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  icon TEXT,
  url TEXT,
  sent_to_customer_ids UUID[],
  sent_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  sent_by UUID REFERENCES admin_users(id),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'pending', -- pending, sending, completed, failed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. push_notification_logs（プッシュ通知送信ログテーブル）
CREATE TABLE IF NOT EXISTS push_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID REFERENCES push_notifications(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES push_subscriptions(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL, -- sent, failed
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_customer_id ON push_subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_is_active ON push_subscriptions(is_active);
CREATE INDEX IF NOT EXISTS idx_push_notifications_status ON push_notifications(status);
CREATE INDEX IF NOT EXISTS idx_push_notifications_sent_at ON push_notifications(sent_at);
CREATE INDEX IF NOT EXISTS idx_push_notification_logs_notification_id ON push_notification_logs(notification_id);
CREATE INDEX IF NOT EXISTS idx_push_notification_logs_customer_id ON push_notification_logs(customer_id);

-- RLSポリシー: push_subscriptions
-- 開発用: すべてのアクセスを許可（本番環境では削除または修正）
CREATE POLICY IF NOT EXISTS "Allow all access for development" ON push_subscriptions
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: push_notifications
CREATE POLICY IF NOT EXISTS "Allow all access for development" ON push_notifications
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: push_notification_logs
CREATE POLICY IF NOT EXISTS "Allow all access for development" ON push_notification_logs
  FOR ALL USING (true) WITH CHECK (true);
```

4. **「Run」ボタンをクリック**
   - または `Ctrl+Enter` (Windows/Linux) / `Cmd+Enter` (Mac) を押す

### ステップ4: 実行結果を確認

1. **エラーメッセージがないことを確認**
   - 「Success. No rows returned」などと表示されれば成功
   - エラーが表示された場合は、エラーメッセージを確認してください

2. **テーブルが作成されたか確認**
   - 左サイドバーから「Table Editor」をクリック
   - 以下のテーブルが表示されることを確認:
     - ✅ `push_subscriptions`
     - ✅ `push_notifications`
     - ✅ `push_notification_logs`

## ✅ 完了

SQLの実行が完了したら、次のステップに進んでください：
1. VAPIDキーを環境変数に設定
2. 実装を続ける

## ⚠️ エラーが発生した場合

### エラー: "policy already exists"
- 既にポリシーが存在する場合のエラー
- 無視して構いません（`CREATE POLICY IF NOT EXISTS` を使用しているため）

### その他のエラー
- エラーメッセージを確認してください
- 必要に応じて、エラーメッセージを共有してください

