-- ポイントカードPWA 本番環境用RLSポリシー
-- カスタムJWT認証を使用しているため、サービスロールキーによるアプリケーションレベルでの認証に依存します

-- 既存の開発用ポリシーを削除（実行前に確認）
-- DROP POLICY IF EXISTS "Allow all access for development" ON customers;
-- DROP POLICY IF EXISTS "Allow all access for development" ON visits;
-- DROP POLICY IF EXISTS "Allow all access for development" ON point_transactions;

-- ============================================
-- RLSポリシー: customers（顧客テーブル）
-- ============================================

-- 開発用ポリシーを削除
DROP POLICY IF EXISTS "Allow all access for development" ON customers;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
-- アプリケーションレベルでJWT認証を行い、顧客IDを検証してからアクセス
-- サービスロールキーはRLSをバイパスするため、実質的にアプリケーション経由のみアクセス可能
CREATE POLICY "Service role only for customers" ON customers
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: visits（来店履歴テーブル）
-- ============================================

-- 開発用ポリシーを削除
DROP POLICY IF EXISTS "Allow all access for development" ON visits;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for visits" ON visits
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: point_transactions（ポイント取引履歴テーブル）
-- ============================================

-- 開発用ポリシーを削除
DROP POLICY IF EXISTS "Allow all access for development" ON point_transactions;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for point_transactions" ON point_transactions
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: casts（キャストテーブル）
-- ============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Anyone can view casts" ON casts;
DROP POLICY IF EXISTS "Admins can manage casts" ON casts;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for casts" ON casts
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: settings（設定テーブル）
-- ============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Admins can manage settings" ON settings;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for settings" ON settings
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: alerts（アラートテーブル）
-- ============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Admins can manage alerts" ON alerts;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for alerts" ON alerts
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- RLSポリシー: admin_users（管理者テーブル）
-- ============================================

-- 既存のポリシーを削除
DROP POLICY IF EXISTS "Admins can manage admin users" ON admin_users;

-- 本番環境用ポリシー: サービスロールキーのみアクセス可能
CREATE POLICY "Service role only for admin_users" ON admin_users
  FOR ALL 
  USING (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  )
  WITH CHECK (
    current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
  );

-- ============================================
-- 重要: セキュリティの原則
-- ============================================
-- 1. サービスロールキーはサーバー側（APIルート）でのみ使用
-- 2. クライアント側（ブラウザ）には公開しない
-- 3. アプリケーションレベルでJWTトークンを検証
-- 4. 顧客は自分のデータのみアクセス可能（APIルートで制御）
-- 5. 管理者は認証された管理者のみアクセス可能（APIルートで制御）
-- 
-- 注意: サービスロールキーはRLSをバイパスするため、
-- これらのポリシーは実際には機能しませんが、
-- アプリケーションの設計意図を示すために残しています。
-- 
-- 実際のセキュリティは、以下で確保されます:
-- - APIルートでのJWT認証（lib/auth.ts）
-- - 顧客ID/管理者IDの検証（各APIルート）
-- - 環境変数の適切な管理

