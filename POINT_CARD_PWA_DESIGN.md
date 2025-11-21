# ポイントカードPWA 設計ドキュメント

## 概要
顧客向けのポイントカードアプリ兼来店履歴を表示するPWAと、その管理画面を構築します。

## 技術スタック
- **フロントエンド**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **バックエンド**: Supabase (PostgreSQL, Authentication, Storage)
- **PWA**: Service Worker, Web App Manifest
- **UIライブラリ**: Radix UI, shadcn/ui

## データベーススキーマ設計

### 1. customers（顧客テーブル）
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL, -- 電話番号（IDとして使用）
  password_hash TEXT NOT NULL, -- パスワードハッシュ
  name VARCHAR(255),
  email VARCHAR(255),
  total_points INTEGER DEFAULT 0, -- 累計獲得ポイント
  current_points INTEGER DEFAULT 0, -- 現在の残高ポイント
  total_earned_points INTEGER DEFAULT 0, -- 累計付与ポイント
  total_used_points INTEGER DEFAULT 0, -- 累計消費ポイント
  first_visit_date TIMESTAMP WITH TIME ZONE,
  last_visit_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. visits（来店履歴テーブル）
```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_date TIMESTAMP WITH TIME ZONE NOT NULL,
  amount INTEGER NOT NULL, -- 利用金額
  points_earned INTEGER DEFAULT 0, -- 付与ポイント
  points_used INTEGER DEFAULT 0, -- 使用ポイント
  cast_id UUID REFERENCES casts(id),
  service_type VARCHAR(50) NOT NULL, -- 'free', 'net_reservation', 'in_store_reservation', 'regular_reservation'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. casts（キャストテーブル）
```sql
CREATE TABLE casts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. point_transactions（ポイント取引履歴テーブル）
```sql
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  transaction_type VARCHAR(50) NOT NULL, -- 'earned', 'used', 'expired', 'adjusted'
  points INTEGER NOT NULL, -- 正の値が付与、負の値が消費
  balance_after INTEGER NOT NULL, -- 取引後の残高
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. settings（マスタ設定テーブル）
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID, -- 管理者ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 初期設定データ
INSERT INTO settings (key, value, description) VALUES
  ('point_rate', '3', 'ポイント還元率（%）'),
  ('min_points_to_use', '500', 'ポイント利用可能最小値'),
  ('point_unit', '500', 'ポイント利用単位（刻み）'),
  ('alert_email', '', 'アラート送信先メールアドレス'),
  ('alert_days', '90', '初回来店のみ顧客のアラート日数（日）')
ON CONFLICT (key) DO NOTHING;
```

### 6. alerts（アラートテーブル）
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  alert_type VARCHAR(50) NOT NULL, -- 'first_visit_only', 'low_points', etc.
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT false,
  notified_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7. admin_users（管理者テーブル）
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## インデックス
```sql
CREATE INDEX idx_customers_phone_number ON customers(phone_number);
CREATE INDEX idx_visits_customer_id ON visits(customer_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_visits_cast_id ON visits(cast_id);
CREATE INDEX idx_point_transactions_customer_id ON point_transactions(customer_id);
CREATE INDEX idx_point_transactions_created_at ON point_transactions(created_at);
CREATE INDEX idx_alerts_customer_id ON alerts(customer_id);
CREATE INDEX idx_alerts_is_resolved ON alerts(is_resolved);
```

## Row Level Security (RLS) ポリシー

**重要**: 以下のRLSポリシー設計は概念的なものです。実際の実装では、認証方式に応じて適切なポリシーを設定してください。

### 認証方式の選択肢

1. **Supabase Authを使用する場合**
   - Supabaseの認証機能を利用
   - `auth.uid()`を使用してRLSポリシーを設定
   - 顧客と管理者の両方でSupabase Authを使用

2. **独自のJWT認証を使用する場合（推奨）**
   - アプリケーションレベルでJWT認証を実装
   - サービスロールキーでデータベースにアクセス
   - RLSポリシーは開発用（すべて許可）または無効化
   - APIレベルで認証チェックを実装

### customers
- **開発環境**: すべてのアクセスを許可（開発用ポリシー）
- **本番環境**: 
  - 独自のJWT認証を使用する場合: サービスロールキーでアクセス、APIレベルで認証チェック
  - Supabase Authを使用する場合: 顧客は自分のデータのみ閲覧・更新可能、管理者は全データにアクセス可能

### visits
- **開発環境**: すべてのアクセスを許可（開発用ポリシー）
- **本番環境**: 
  - 独自のJWT認証を使用する場合: サービスロールキーでアクセス、APIレベルで認証チェック
  - Supabase Authを使用する場合: 顧客は自分の来店履歴のみ閲覧可能、管理者は全データにアクセス・更新可能

### point_transactions
- **開発環境**: すべてのアクセスを許可（開発用ポリシー）
- **本番環境**: 
  - 独自のJWT認証を使用する場合: サービスロールキーでアクセス、APIレベルで認証チェック
  - Supabase Authを使用する場合: 顧客は自分の取引履歴のみ閲覧可能、管理者は全データにアクセス可能

## 顧客向けPWA機能

### 1. 認証機能
- **登録画面**: 電話番号、パスワード、名前、メールアドレス（任意）
- **ログイン画面**: 電話番号、パスワード
- **パスワードリセット**: 電話番号認証によるリセット

### 2. ダッシュボード
- 現在のポイント残高（大きく表示）
- 累計獲得ポイント
- 累計使用ポイント
- 次回利用可能ポイント（500ポイント刻みで表示）

### 3. 来店履歴
- 来店日時
- 利用金額
- 付与ポイント
- 使用ポイント
- キャスト名
- サービス種別（フリー、ネット指名、場内指名、本指名）

### 4. ポイント取引履歴
- 取引日時
- 取引種別（付与/消費）
- ポイント数
- 取引後の残高
- 説明

### 5. ポイント利用機能
- 500ポイント以上で利用可能
- 500ポイント刻みで利用
- 利用可能ポイント数の表示
- 利用確認ダイアログ

## 管理画面機能

### 1. ダッシュボード
- 本日の来店数
- 本日の売上
- 本日のポイント付与総数
- アクティブ顧客数

### 2. 顧客管理
- 顧客一覧（検索、フィルタ）
- 顧客詳細（来店履歴、ポイント取引履歴）
- 顧客編集

### 3. 来店履歴管理
- 来店履歴一覧
- 来店履歴登録・編集
- 来店履歴詳細

### 4. キャスト管理
- キャスト一覧
- キャスト登録・編集
- キャスト別稼働実績
  - 出勤日数
  - 接客本数（フリー、ネット指名、場内指名、本指名）
  - 本指名への転換率（フリー→本指名、ネット指名→本指名、場内指名→本指名）

### 5. アラート管理
- アラート一覧
- 初回来店のみ顧客のアラート（3か月経過）
- アラート解決機能
- メール通知設定

### 6. マスタ設定
- ポイント還元率の設定
- ポイント利用最小値・単位の設定
- アラートメールアドレスの設定
- アラート日数の設定

## PWA設定

### manifest.json
```json
{
  "name": "ポイントカードアプリ",
  "short_name": "ポイントカード",
  "description": "来店履歴とポイント管理アプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker
- オフライン対応
- キャッシュ戦略
- プッシュ通知（将来拡張用）

## API設計

### 顧客向けAPI
- `POST /api/customers/register` - 顧客登録
- `POST /api/customers/login` - ログイン
- `GET /api/customers/me` - 自分の情報取得
- `GET /api/visits` - 来店履歴取得
- `GET /api/point-transactions` - ポイント取引履歴取得
- `POST /api/points/use` - ポイント利用

### 管理画面API
- `POST /api/admin/login` - 管理者ログイン
- `GET /api/admin/customers` - 顧客一覧取得
- `GET /api/admin/customers/:id` - 顧客詳細取得
- `GET /api/admin/visits` - 来店履歴一覧取得
- `POST /api/admin/visits` - 来店履歴登録
- `PUT /api/admin/visits/:id` - 来店履歴更新
- `GET /api/admin/casts` - キャスト一覧取得
- `GET /api/admin/casts/:id/performance` - キャスト別稼働実績取得
- `GET /api/admin/alerts` - アラート一覧取得
- `POST /api/admin/alerts/:id/resolve` - アラート解決
- `GET /api/admin/settings` - 設定取得
- `PUT /api/admin/settings/:key` - 設定更新

## セキュリティ

### 認証方式

**推奨**: 独自のJWT認証方式
- パスワードはbcryptでハッシュ化
- JWTトークンによる認証
- サービスロールキーでデータベースにアクセス
- APIレベルで認証チェックを実装
- RLSポリシーは開発用（すべて許可）または無効化

**代替案**: Supabase Auth方式
- Supabaseの認証機能を利用
- RLSポリシーによるデータアクセス制御
- `auth.uid()`を使用してユーザー識別

### セキュリティ対策
- パスワードはbcryptでハッシュ化（salt rounds: 10以上推奨）
- JWTトークンの有効期限設定（通常1-24時間）
- リフレッシュトークンの実装（推奨）
- HTTPS必須（本番環境）
- CORS設定
- 入力値のバリデーション（Zod等を使用）
- SQLインジェクション対策（パラメータ化クエリ）
- XSS対策（Reactの自動エスケープ、CSPヘッダー）
- CSRF対策（SameSite Cookie、CSRFトークン）
- レート制限の実装（APIエンドポイント）

## 実装順序
1. データベーススキーマ作成
2. 認証機能（顧客・管理者）
3. 顧客向けPWA基本機能
4. 管理画面基本機能
5. ポイント計算ロジック
6. アラート機能
7. キャスト別稼働実績
8. PWA設定
9. テスト・デバッグ

