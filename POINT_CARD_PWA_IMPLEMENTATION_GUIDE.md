# ポイントカードPWA実装ガイド

このガイドは、ポイントカードPWAアプリを段階的に実装するための手順書です。

## 前提条件

- Node.js 18以上がインストールされていること
- Supabaseプロジェクトが作成されていること
- 既存のNext.jsプロジェクトが動作していること

## 実装手順

### ステップ1: データベーススキーマの作成

1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `supabase/point-card-schema.sql`の内容を実行
4. テーブル、インデックス、RLSポリシーが正しく作成されたか確認

**注意**: 
- スキーマには開発用のRLSポリシー（すべてのアクセスを許可）が含まれています
- 本番環境では適切な認証方式を選択し、RLSポリシーを更新してください
- 独自のJWT認証を使用する場合、アプリケーションレベルで認証チェックを行い、サービスロールキーでデータベースにアクセスすることを推奨します

### ステップ2: 型定義の更新

1. `lib/supabase/types.ts`を更新
2. 新しいテーブルの型定義を追加
3. `npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts`で自動生成も可能

### ステップ3: 顧客認証機能の実装

1. 認証APIの作成
   - `app/api/customers/register/route.ts`
   - `app/api/customers/login/route.ts`
   - `app/api/customers/me/route.ts`

2. 認証ページの作成
   - `app/register/page.tsx`
   - `app/login/page.tsx`

3. 認証ミドルウェアの作成
   - `middleware.ts`

### ステップ4: 顧客向けダッシュボードの実装

1. ダッシュボードページ
   - `app/dashboard/page.tsx`

2. コンポーネント作成
   - `components/customer/point-card.tsx`
   - `components/customer/visit-history.tsx`
   - `components/customer/point-transactions.tsx`
   - `components/customer/use-points-dialog.tsx`

3. API作成
   - `app/api/visits/route.ts`
   - `app/api/point-transactions/route.ts`
   - `app/api/points/use/route.ts`

### ステップ5: 管理画面の実装

1. 管理者認証
   - `app/admin/login/page.tsx`
   - `app/api/admin/login/route.ts`

2. レイアウト
   - `app/admin/layout.tsx`

3. 各管理ページ
   - `app/admin/customers/page.tsx`
   - `app/admin/visits/page.tsx`
   - `app/admin/casts/page.tsx`
   - `app/admin/alerts/page.tsx`
   - `app/admin/settings/page.tsx`

### ステップ6: ポイント計算ロジックの実装

1. ユーティリティ関数
   - `lib/points.ts`
   - ポイント計算関数
   - ポイント利用可能チェック関数

2. 来店履歴登録時のポイント付与
   - `app/api/admin/visits/route.ts`内で実装

### ステップ7: アラート機能の実装

1. アラート検出ロジック
   - `lib/alerts.ts`
   - 初回来店のみ顧客の検出

2. アラートAPI
   - `app/api/admin/alerts/route.ts`
   - `app/api/admin/alerts/check/route.ts`
   - `app/api/admin/alerts/[id]/resolve/route.ts`

3. メール通知機能
   - 外部メールサービス（SendGrid、Resend等）の統合
   - またはSupabase Edge Functionsを使用

### ステップ8: キャスト別稼働実績の実装

1. データ取得ロジック
   - `lib/cast-performance.ts`
   - 出勤日数計算
   - 接客本数集計
   - 転換率計算

2. API
   - `app/api/admin/casts/[id]/performance/route.ts`

3. 表示コンポーネント
   - `components/admin/cast-performance.tsx`
   - グラフ表示（recharts使用）

### ステップ9: PWA設定

1. `next-pwa`パッケージのインストール
   ```bash
   npm install next-pwa
   ```

2. `next.config.js`の更新
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });

   module.exports = withPWA({
     // 既存の設定
   });
   ```

3. `public/manifest.json`の作成

4. アイコンの準備
   - `public/icon-192.png`
   - `public/icon-512.png`

5. Service Workerの設定確認

### ステップ10: テストとデバッグ

1. 単体テスト
   - ポイント計算ロジック
   - アラート検出ロジック

2. 統合テスト
   - 認証フロー
   - ポイント付与・利用フロー
   - アラート通知フロー

3. E2Eテスト
   - 顧客の登録からポイント利用まで
   - 管理者の来店履歴登録からアラート確認まで

## よくある問題と解決方法

### 問題1: RLSポリシーでアクセスできない

**解決方法:**
- SupabaseダッシュボードでRLSポリシーを確認
- テスト用に一時的にRLSを無効化して動作確認
- ポリシーを段階的に追加

**注意:**
- `point-card-schema.sql`には開発用のRLSポリシー（すべてのアクセスを許可）が設定されています
- 本番環境では、以下のいずれかの方法で認証を実装してください：
  1. **Supabase Authを使用**: Supabaseの認証機能を使用し、RLSポリシーを適切に設定
  2. **サービスロールキーを使用**: アプリケーションレベルで認証チェックを行い、サービスロールキーでデータベースにアクセス
  3. **独自のJWT認証**: アプリケーションレベルでJWT認証を実装し、サービスロールキーでデータベースにアクセス

**重要**: 開発用のRLSポリシーは本番環境では削除または適切に変更してください。

### 問題2: ポイント計算が正しくない

**解決方法:**
- 小数点処理を確認（Math.floor使用）
- トランザクション処理を確認
- ログを追加してデバッグ

### 問題3: PWAがインストールできない

**解決方法:**
- manifest.jsonの構文を確認
- Service Workerが正しく登録されているか確認
- HTTPSでアクセスしているか確認（localhostは除く）

### 問題4: アラートが検出されない

**解決方法:**
- 日付計算ロジックを確認
- タイムゾーンを確認
- データベースの日付形式を確認

## デプロイ

1. Vercelにデプロイ
   - GitHubリポジトリと連携
   - 環境変数を設定
   - SupabaseのURLとキーを設定

2. Supabaseの設定
   - RLSポリシーを本番環境用に調整
   - 初期管理者アカウントを作成

3. PWAの確認
   - 実機でインストールテスト
   - オフライン動作確認

## セキュリティチェックリスト

- [ ] パスワードはbcryptでハッシュ化
- [ ] JWTトークンの有効期限設定
- [ ] RLSポリシーが適切に設定されている
- [ ] 入力値のバリデーション
- [ ] SQLインジェクション対策
- [ ] XSS対策
- [ ] CSRF対策
- [ ] レート制限の実装

## パフォーマンス最適化

- [ ] データベースクエリの最適化
- [ ] インデックスの確認
- [ ] 画像の最適化
- [ ] コード分割
- [ ] キャッシュ戦略の最適化

## 今後の拡張機能

- プッシュ通知
- クーポン機能
- 会員ランク機能
- 紹介プログラム
- 分析ダッシュボードの拡張

