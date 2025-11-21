# ポイントカードPWA構築プロンプト

このドキュメントは、CursorでポイントカードPWAアプリを構築するためのプロンプト集です。

## プロンプト1: データベーススキーマ作成

```
Supabaseデータベースに以下のスキーマを作成してください：

1. customers（顧客テーブル）
   - id: UUID (主キー)
   - phone_number: VARCHAR(20) UNIQUE NOT NULL（電話番号、IDとして使用）
   - password_hash: TEXT NOT NULL（パスワードハッシュ）
   - name: VARCHAR(255)
   - email: VARCHAR(255)
   - total_points: INTEGER DEFAULT 0（累計獲得ポイント）
   - current_points: INTEGER DEFAULT 0（現在の残高ポイント）
   - total_earned_points: INTEGER DEFAULT 0（累計付与ポイント）
   - total_used_points: INTEGER DEFAULT 0（累計消費ポイント）
   - first_visit_date: TIMESTAMP WITH TIME ZONE
   - last_visit_date: TIMESTAMP WITH TIME ZONE
   - is_active: BOOLEAN DEFAULT true
   - created_at, updated_at: TIMESTAMP

2. casts（キャストテーブル）
   - id: UUID (主キー)
   - name: VARCHAR(255) NOT NULL
   - code: VARCHAR(50) UNIQUE
   - is_active: BOOLEAN DEFAULT true
   - created_at, updated_at: TIMESTAMP

3. visits（来店履歴テーブル）
   - id: UUID (主キー)
   - customer_id: UUID REFERENCES customers(id)
   - visit_date: TIMESTAMP WITH TIME ZONE NOT NULL
   - amount: INTEGER NOT NULL（利用金額）
   - points_earned: INTEGER DEFAULT 0（付与ポイント）
   - points_used: INTEGER DEFAULT 0（使用ポイント）
   - cast_id: UUID REFERENCES casts(id)
   - service_type: VARCHAR(50) NOT NULL（'free', 'net_reservation', 'in_store_reservation', 'regular_reservation'）
   - notes: TEXT
   - created_at, updated_at: TIMESTAMP

4. point_transactions（ポイント取引履歴テーブル）
   - id: UUID (主キー)
   - customer_id: UUID REFERENCES customers(id)
   - visit_id: UUID REFERENCES visits(id)
   - transaction_type: VARCHAR(50) NOT NULL（'earned', 'used', 'expired', 'adjusted'）
   - points: INTEGER NOT NULL（正の値が付与、負の値が消費）
   - balance_after: INTEGER NOT NULL（取引後の残高）
   - description: TEXT
   - created_at: TIMESTAMP

5. settings（マスタ設定テーブル）
   - id: UUID (主キー)
   - key: VARCHAR(100) UNIQUE NOT NULL
   - value: TEXT NOT NULL
   - description: TEXT
   - updated_by: UUID（管理者ID）
   - created_at, updated_at: TIMESTAMP

6. alerts（アラートテーブル）
   - id: UUID (主キー)
   - customer_id: UUID REFERENCES customers(id)
   - alert_type: VARCHAR(50) NOT NULL
   - message: TEXT NOT NULL
   - is_resolved: BOOLEAN DEFAULT false
   - notified_at: TIMESTAMP WITH TIME ZONE
   - resolved_at: TIMESTAMP WITH TIME ZONE
   - created_at: TIMESTAMP

7. admin_users（管理者テーブル）
   - id: UUID (主キー)
   - email: VARCHAR(255) UNIQUE NOT NULL
   - password_hash: TEXT NOT NULL
   - name: VARCHAR(255)
   - role: VARCHAR(50) DEFAULT 'admin'
   - is_active: BOOLEAN DEFAULT true
   - created_at, updated_at: TIMESTAMP

必要なインデックスとRLSポリシーも作成してください。
初期設定データ（settingsテーブル）も投入してください：
- point_rate: 3（ポイント還元率%）
- min_points_to_use: 500（ポイント利用可能最小値）
- point_unit: 500（ポイント利用単位）
- alert_email: （空文字）
- alert_days: 90（初回来店のみ顧客のアラート日数）
```

## プロンプト2: 顧客認証機能

```
顧客向けの認証機能を実装してください：

1. 登録ページ（/register）
   - 電話番号入力（バリデーション：10-11桁の数字）
   - パスワード入力（8文字以上）
   - 名前入力
   - メールアドレス入力（任意）
   - 登録ボタン
   - 既存の電話番号の場合はエラーメッセージ表示

2. ログインページ（/login）
   - 電話番号入力
   - パスワード入力
   - ログインボタン
   - エラーメッセージ表示

3. 認証API
   - POST /api/customers/register: 顧客登録（パスワードはbcryptでハッシュ化）
   - POST /api/customers/login: ログイン（JWTトークン発行）
   - GET /api/customers/me: 現在の顧客情報取得

4. 認証ミドルウェア
   - 顧客認証が必要なページの保護
   - トークン検証

認証方式の実装:
- パスワードはbcryptjsでハッシュ化（salt rounds: 10）
- JWTトークンによる認証（jsonwebtokenを使用）
- サービスロールキーでSupabaseにアクセス（環境変数: SUPABASE_SERVICE_ROLE_KEY）
- APIレベルで認証チェックを実装

注意:
- 既存のSupabaseクライアント設定（lib/supabase/client.ts, lib/supabase/server.ts）を使用してください
- サービスロールキーを使用する場合、クライアント側から直接アクセスしないでください（セキュリティ上の問題）
- 認証が必要なAPIエンドポイントでは、JWTトークンを検証してからデータベースにアクセスしてください
```

## プロンプト3: 顧客向けダッシュボード

```
顧客向けのダッシュボードページ（/dashboard）を作成してください：

1. ポイント情報カード
   - 現在のポイント残高（大きく表示、目立つデザイン）
   - 累計獲得ポイント
   - 累計使用ポイント
   - 次回利用可能ポイント（500ポイント刻みで表示、例：500pt, 1000pt, 1500pt...）

2. 来店履歴セクション
   - 来店日時
   - 利用金額
   - 付与ポイント
   - 使用ポイント
   - キャスト名
   - サービス種別（フリー、ネット指名、場内指名、本指名）
   - 日付降順で表示
   - ページネーション

3. ポイント取引履歴セクション
   - 取引日時
   - 取引種別（付与/消費）
   - ポイント数（付与は+、消費は-で表示）
   - 取引後の残高
   - 説明
   - 日付降順で表示
   - ページネーション

4. ポイント利用ボタン
   - 500ポイント以上の場合のみ表示
   - クリックで利用可能ポイント数を表示
   - 500ポイント刻みで選択可能
   - 確認ダイアログ

レスポンシブデザインで、モバイルファーストで実装してください。
shadcn/uiコンポーネントを使用してください。
```

## プロンプト4: 来店履歴登録機能（管理画面）

```
管理画面に来店履歴登録機能を実装してください：

1. 来店履歴登録ページ（/admin/visits/new）
   - 顧客選択（電話番号で検索）
   - 来店日時選択
   - 利用金額入力
   - キャスト選択
   - サービス種別選択（フリー、ネット指名、場内指名、本指名）
   - メモ入力（任意）
   - 登録ボタン

2. ポイント計算ロジック
   - 利用金額 × 還元率（settingsテーブルから取得）で付与ポイントを計算
   - 小数点以下は切り捨て
   - 顧客のポイント残高を更新
   - point_transactionsテーブルに記録

3. 来店履歴更新機能
   - 来店履歴編集ページ（/admin/visits/[id]/edit）
   - 既存データの編集
   - ポイント再計算（変更時）

4. API
   - POST /api/admin/visits: 来店履歴登録
   - PUT /api/admin/visits/[id]: 来店履歴更新
   - GET /api/admin/visits: 来店履歴一覧取得

既存の管理画面デザインに合わせて実装してください。
```

## プロンプト5: キャスト別稼働実績

```
管理画面にキャスト別稼働実績機能を実装してください：

1. キャスト別稼働実績ページ（/admin/casts/[id]/performance）
   - 期間選択（開始日、終了日）
   - 出勤日数（来店履歴がある日数）
   - 接客本数
     - フリー
     - ネット指名
     - 場内指名
     - 本指名
   - 本指名への転換率
     - フリー → 本指名（数と率）
     - ネット指名 → 本指名（数と率）
     - 場内指名 → 本指名（数と率）

2. 転換率計算ロジック
   - 同じ顧客が、フリー/ネット指名/場内指名で接客された後、次回来店時に本指名になった場合をカウント
   - 期間内のデータで計算

3. API
   - GET /api/admin/casts/[id]/performance: 稼働実績データ取得

4. チャート表示
   - 接客本数の円グラフ
   - 転換率の棒グラフ

rechartsを使用してグラフを表示してください。
```

## プロンプト6: アラート機能

```
アラート機能を実装してください：

1. アラート検出ロジック
   - 初回来店のみの顧客を検出
   - 初回来店から3か月（settingsテーブルのalert_days）経過した顧客を検出
   - alertsテーブルに記録

2. アラート一覧ページ（/admin/alerts）
   - アラート一覧表示
   - アラート種別
   - 顧客情報
   - 検出日時
   - 解決状態
   - 解決ボタン

3. メール通知機能
   - settingsテーブルのalert_emailにメール送信
   - 初回来店のみ顧客のリストを送信
   - 定期的に実行（cron jobまたはAPIエンドポイント）

4. API
   - GET /api/admin/alerts: アラート一覧取得
   - POST /api/admin/alerts/check: アラート検出実行
   - POST /api/admin/alerts/[id]/resolve: アラート解決

5. バッチ処理
   - APIエンドポイント: POST /api/admin/alerts/check
   - 定期的に実行する場合はVercel Cron Jobsを使用

Supabaseのメール機能または外部メールサービス（SendGrid等）を使用してください。
```

## プロンプト7: マスタ設定機能

```
管理画面にマスタ設定機能を実装してください：

1. 設定ページ（/admin/settings）
   - ポイント還元率（%）
   - ポイント利用可能最小値
   - ポイント利用単位
   - アラートメールアドレス
   - アラート日数（初回来店のみ顧客の検出日数）

2. 設定更新機能
   - 各設定項目の編集
   - 保存ボタン
   - バリデーション（還元率は0-100、最小値・単位は正の整数など）

3. API
   - GET /api/admin/settings: 設定一覧取得
   - PUT /api/admin/settings/[key]: 設定更新

既存の管理画面デザインに合わせて実装してください。
```

## プロンプト8: PWA設定

```
PWAとして動作するように設定してください：

1. manifest.json
   - アプリ名、説明
   - アイコン（192x192, 512x512）
   - スタンドアロンモード
   - テーマカラー

2. Service Worker
   - オフライン対応
   - キャッシュ戦略（Network First）
   - インストール可能にする

3. next.config.js
   - PWAプラグインの設定
   - アイコンの生成

4. インストールプロンプト
   - インストールボタンの表示
   - インストール可能時の通知

next-pwaパッケージを使用してください。
```

## プロンプト9: 管理者認証機能

```
管理画面の認証機能を実装してください：

1. 管理者ログインページ（/admin/login）
   - メールアドレス入力
   - パスワード入力
   - ログインボタン

2. 認証API
   - POST /api/admin/login: 管理者ログイン（JWTトークン発行）
   - GET /api/admin/me: 現在の管理者情報取得

3. 認証ミドルウェア
   - 管理画面の全ページを保護
   - 未認証時は/admin/loginにリダイレクト

4. 管理者登録機能（初期セットアップ用）
   - POST /api/admin/register: 管理者登録（開発環境のみ、または特別な認証が必要）

認証方式の実装:
- パスワードはbcryptjsでハッシュ化（salt rounds: 10）
- JWTトークンによる認証（jsonwebtokenを使用）
- サービスロールキーでSupabaseにアクセス（環境変数: SUPABASE_SERVICE_ROLE_KEY）
- APIレベルで認証チェックを実装

注意:
- 既存のSupabaseクライアント設定（lib/supabase/client.ts, lib/supabase/server.ts）を使用してください
- サービスロールキーを使用する場合、クライアント側から直接アクセスしないでください（セキュリティ上の問題）
- 認証が必要なAPIエンドポイントでは、JWTトークンを検証してからデータベースにアクセスしてください
```

## プロンプト10: レスポンシブデザインとUI改善

```
顧客向けPWAのUI/UXを改善してください：

1. モバイルファーストデザイン
   - タッチ操作に最適化
   - 大きなボタン
   - 読みやすいフォントサイズ

2. ダークモード対応
   - システム設定に応じた自動切り替え
   - 手動切り替えオプション

3. ローディング状態
   - スケルトンローディング
   - プログレスインジケーター

4. エラーハンドリング
   - ユーザーフレンドリーなエラーメッセージ
   - リトライ機能

5. オフライン対応
   - オフライン時のメッセージ表示
   - キャッシュされたデータの表示

既存のshadcn/uiコンポーネントとTailwind CSSを使用してください。
```

## 実装チェックリスト

### データベース
- [ ] スキーマ作成
- [ ] インデックス作成
- [ ] RLSポリシー設定
- [ ] 初期データ投入

### 顧客向けPWA
- [ ] 認証機能（登録・ログイン）
- [ ] ダッシュボード
- [ ] 来店履歴表示
- [ ] ポイント取引履歴表示
- [ ] ポイント利用機能
- [ ] PWA設定

### 管理画面
- [ ] 管理者認証
- [ ] 顧客管理
- [ ] 来店履歴管理
- [ ] キャスト管理
- [ ] キャスト別稼働実績
- [ ] アラート管理
- [ ] マスタ設定

### 共通
- [ ] API実装
- [ ] エラーハンドリング
- [ ] バリデーション
- [ ] セキュリティ対策
- [ ] テスト

