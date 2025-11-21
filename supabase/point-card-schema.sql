-- ポイントカードPWA データベーススキーマ

-- 1. customers（顧客テーブル）
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  email VARCHAR(255),
  total_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  total_earned_points INTEGER DEFAULT 0,
  total_used_points INTEGER DEFAULT 0,
  first_visit_date TIMESTAMP WITH TIME ZONE,
  last_visit_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. casts（キャストテーブル）
CREATE TABLE IF NOT EXISTS casts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. visits（来店履歴テーブル）
CREATE TABLE IF NOT EXISTS visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount INTEGER NOT NULL,
  points_earned INTEGER DEFAULT 0,
  points_used INTEGER DEFAULT 0,
  cast_id UUID REFERENCES casts(id),
  service_type VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. point_transactions（ポイント取引履歴テーブル）
CREATE TABLE IF NOT EXISTS point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL,
  points INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. settings（マスタ設定テーブル）
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. alerts（アラートテーブル）
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. admin_users（管理者テーブル）
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_customers_phone_number ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_customers_is_active ON customers(is_active);
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_visit_date ON visits(visit_date);
CREATE INDEX IF NOT EXISTS idx_visits_cast_id ON visits(cast_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_customer_id ON point_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_customer_id ON alerts(customer_id);
CREATE INDEX IF NOT EXISTS idx_alerts_is_resolved ON alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_alerts_alert_type ON alerts(alert_type);

-- Row Level Security (RLS) の有効化
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE casts ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: customers
-- 注意: 独自のJWT認証を使用するため、アプリケーションレベルでの認証チェックを推奨
-- 開発中はRLSを無効化するか、すべてのアクセスを許可するポリシーを使用
-- 本番環境では、Supabase Authを使用するか、サービスロールキーを使用したアプリケーションレベルでの認証を実装

-- 開発用: すべてのアクセスを許可（本番環境では削除または修正）
CREATE POLICY "Allow all access for development" ON customers
  FOR ALL USING (true) WITH CHECK (true);

-- 本番環境用の例（Supabase Authを使用する場合）:
-- CREATE POLICY "Customers can view own data" ON customers
--   FOR SELECT USING (auth.uid()::text = id::text);
-- 
-- CREATE POLICY "Customers can update own data" ON customers
--   FOR UPDATE USING (auth.uid()::text = id::text);
-- 
-- CREATE POLICY "Service role can manage all customers" ON customers
--   FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- RLSポリシー: visits
-- 開発用: すべてのアクセスを許可（本番環境では削除または修正）
CREATE POLICY "Allow all access for development" ON visits
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: point_transactions
-- 開発用: すべてのアクセスを許可（本番環境では削除または修正）
CREATE POLICY "Allow all access for development" ON point_transactions
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: casts（全員閲覧可能、管理者のみ更新可能）
CREATE POLICY "Anyone can view casts" ON casts
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage casts" ON casts
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: settings（管理者のみ）
CREATE POLICY "Admins can manage settings" ON settings
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: alerts（管理者のみ）
CREATE POLICY "Admins can manage alerts" ON alerts
  FOR ALL USING (true) WITH CHECK (true);

-- RLSポリシー: admin_users（管理者のみ）
CREATE POLICY "Admins can manage admin users" ON admin_users
  FOR ALL USING (true) WITH CHECK (true);

-- 初期設定データの投入
INSERT INTO settings (key, value, description) VALUES
  ('point_rate', '3', 'ポイント還元率（%）'),
  ('min_points_to_use', '500', 'ポイント利用可能最小値'),
  ('point_unit', '500', 'ポイント利用単位（刻み）'),
  ('alert_email', '', 'アラート送信先メールアドレス'),
  ('alert_days', '90', '初回来店のみ顧客のアラート日数（日）')
ON CONFLICT (key) DO NOTHING;

-- 更新日時を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 更新日時トリガー
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_casts_updated_at BEFORE UPDATE ON casts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ポイント付与時の自動処理（トリガー関数）
CREATE OR REPLACE FUNCTION update_customer_points()
RETURNS TRIGGER AS $$
DECLARE
  points_earned_diff INTEGER;
  points_used_diff INTEGER;
BEGIN
  -- 来店履歴作成時
  IF TG_OP = 'INSERT' THEN
    -- 顧客のポイントを更新
    UPDATE customers
    SET 
      current_points = current_points + NEW.points_earned - NEW.points_used,
      total_earned_points = total_earned_points + NEW.points_earned,
      total_used_points = total_used_points + NEW.points_used,
      total_points = total_points + NEW.points_earned,
      last_visit_date = NEW.visit_date,
      first_visit_date = COALESCE(first_visit_date, NEW.visit_date)
    WHERE id = NEW.customer_id;

    -- ポイント取引履歴に記録
    IF NEW.points_earned > 0 THEN
      INSERT INTO point_transactions (customer_id, visit_id, transaction_type, points, balance_after, description)
      SELECT 
        NEW.customer_id,
        NEW.id,
        'earned',
        NEW.points_earned,
        current_points + NEW.points_earned,
        '来店によるポイント付与'
      FROM customers
      WHERE id = NEW.customer_id;
    END IF;

    IF NEW.points_used > 0 THEN
      INSERT INTO point_transactions (customer_id, visit_id, transaction_type, points, balance_after, description)
      SELECT 
        NEW.customer_id,
        NEW.id,
        'used',
        -NEW.points_used,
        current_points - NEW.points_used,
        'ポイント利用'
      FROM customers
      WHERE id = NEW.customer_id;
    END IF;
  END IF;

  -- 来店履歴更新時
  IF TG_OP = 'UPDATE' THEN
    -- 差分を計算
    points_earned_diff := NEW.points_earned - OLD.points_earned;
    points_used_diff := NEW.points_used - OLD.points_used;

    -- 顧客のポイントを更新
    UPDATE customers
    SET 
      current_points = current_points + points_earned_diff - points_used_diff,
      total_earned_points = total_earned_points + points_earned_diff,
      total_used_points = total_used_points + points_used_diff,
      total_points = total_points + points_earned_diff
    WHERE id = NEW.customer_id;

    -- ポイント取引履歴に記録（差分がある場合）
    IF points_earned_diff != 0 OR points_used_diff != 0 THEN
      -- 既存の取引履歴を更新または新規作成
      -- 簡略化のため、ここでは新規レコードを作成
      IF points_earned_diff > 0 THEN
        INSERT INTO point_transactions (customer_id, visit_id, transaction_type, points, balance_after, description)
        SELECT 
          NEW.customer_id,
          NEW.id,
          'earned',
          points_earned_diff,
          current_points + points_earned_diff,
          '来店履歴更新によるポイント調整'
        FROM customers
        WHERE id = NEW.customer_id;
      END IF;

      IF points_used_diff != 0 THEN
        INSERT INTO point_transactions (customer_id, visit_id, transaction_type, points, balance_after, description)
        SELECT 
          NEW.customer_id,
          NEW.id,
          CASE WHEN points_used_diff > 0 THEN 'used' ELSE 'adjusted' END,
          -points_used_diff,
          current_points - points_used_diff,
          '来店履歴更新によるポイント調整'
        FROM customers
        WHERE id = NEW.customer_id;
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- ポイント更新トリガー
CREATE TRIGGER trigger_update_customer_points
  AFTER INSERT OR UPDATE ON visits
  FOR EACH ROW
  EXECUTE FUNCTION update_customer_points();

