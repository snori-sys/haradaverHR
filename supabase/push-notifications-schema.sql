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
DROP POLICY IF EXISTS "Allow all access for development" ON push_subscriptions;
CREATE POLICY "Allow all access for development" ON push_subscriptions
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: push_notifications
DROP POLICY IF EXISTS "Allow all access for development" ON push_notifications;
CREATE POLICY "Allow all access for development" ON push_notifications
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: push_notification_logs
DROP POLICY IF EXISTS "Allow all access for development" ON push_notification_logs;
CREATE POLICY "Allow all access for development" ON push_notification_logs
  FOR ALL USING (true) WITH CHECK (true);

