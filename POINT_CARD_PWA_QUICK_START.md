# ポイントカードPWA クイックスタートガイド

このガイドでは、Cursorを使用してポイントカードPWAアプリを構築するための具体的な手順を説明します。

## 準備

1. 既存のNext.jsプロジェクトを確認
2. Supabaseプロジェクトの準備
3. 必要なパッケージのインストール

```bash
npm install bcryptjs jsonwebtoken next-pwa
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

## ステップ1: データベーススキーマの作成

Cursorに以下のプロンプトを入力：

```
supabase/point-card-schema.sqlファイルの内容をSupabaseのSQL Editorで実行してください。
すべてのテーブル、インデックス、RLSポリシー、トリガーが正しく作成されたか確認してください。
```

または、Supabaseダッシュボードで直接`supabase/point-card-schema.sql`の内容を実行してください。

## ステップ2: 型定義の更新

Cursorに以下のプロンプトを入力：

```
lib/supabase/types.tsを更新して、新しいテーブル（customers, casts, visits, point_transactions, settings, alerts, admin_users）の型定義を追加してください。
Supabaseの型生成コマンドを使用するか、手動で型定義を追加してください。
```

## ステップ3: 顧客認証機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト2: 顧客認証機能」の内容に従って、顧客向けの認証機能を実装してください。

実装内容：
1. app/api/customers/register/route.ts - 顧客登録API
2. app/api/customers/login/route.ts - ログインAPI
3. app/api/customers/me/route.ts - 現在の顧客情報取得API
4. app/register/page.tsx - 登録ページ
5. app/login/page.tsx - ログインページ
6. middleware.ts - 認証ミドルウェア（顧客認証が必要なページを保護）

パスワードはbcryptjsでハッシュ化し、JWTトークンで認証を行ってください。
既存のSupabaseクライアント設定（lib/supabase/client.ts, lib/supabase/server.ts）を使用してください。
```

## ステップ4: 顧客向けダッシュボードの実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト3: 顧客向けダッシュボード」の内容に従って、顧客向けダッシュボードを実装してください。

実装内容：
1. app/dashboard/page.tsx - ダッシュボードページ
2. components/customer/point-card.tsx - ポイント情報カード
3. components/customer/visit-history.tsx - 来店履歴コンポーネント
4. components/customer/point-transactions.tsx - ポイント取引履歴コンポーネント
5. components/customer/use-points-dialog.tsx - ポイント利用ダイアログ
6. app/api/visits/route.ts - 来店履歴取得API
7. app/api/point-transactions/route.ts - ポイント取引履歴取得API
8. app/api/points/use/route.ts - ポイント利用API

レスポンシブデザインで、shadcn/uiコンポーネントを使用してください。
```

## ステップ5: 管理者認証機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト9: 管理者認証機能」の内容に従って、管理画面の認証機能を実装してください。

実装内容：
1. app/admin/login/page.tsx - 管理者ログインページ
2. app/api/admin/login/route.ts - 管理者ログインAPI
3. app/api/admin/me/route.ts - 現在の管理者情報取得API
4. app/admin/layout.tsx - 管理画面レイアウト（認証チェック含む）

既存のSupabaseクライアント設定を使用してください。
```

## ステップ6: 来店履歴管理機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト4: 来店履歴登録機能（管理画面）」の内容に従って、来店履歴管理機能を実装してください。

実装内容：
1. app/admin/visits/page.tsx - 来店履歴一覧ページ
2. app/admin/visits/new/page.tsx - 来店履歴登録ページ
3. app/admin/visits/[id]/edit/page.tsx - 来店履歴編集ページ
4. app/api/admin/visits/route.ts - 来店履歴CRUD API
5. lib/points.ts - ポイント計算ロジック

ポイント計算ロジック：
- 利用金額 × 還元率（settingsテーブルから取得）で付与ポイントを計算
- 小数点以下は切り捨て（Math.floor）
- 顧客のポイント残高を更新
- point_transactionsテーブルに記録

既存の管理画面デザインに合わせて実装してください。
```

## ステップ7: キャスト管理機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
キャスト管理機能を実装してください。

実装内容：
1. app/admin/casts/page.tsx - キャスト一覧ページ
2. app/admin/casts/new/page.tsx - キャスト登録ページ
3. app/admin/casts/[id]/edit/page.tsx - キャスト編集ページ
4. app/api/admin/casts/route.ts - キャストCRUD API

既存のmasterページ（components/master/interviewer-master.tsx）を参考にしてください。
```

## ステップ8: キャスト別稼働実績の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト5: キャスト別稼働実績」の内容に従って、キャスト別稼働実績機能を実装してください。

実装内容：
1. app/admin/casts/[id]/performance/page.tsx - 稼働実績ページ
2. components/admin/cast-performance.tsx - 稼働実績コンポーネント
3. app/api/admin/casts/[id]/performance/route.ts - 稼働実績データ取得API
4. lib/cast-performance.ts - 稼働実績計算ロジック

計算内容：
- 出勤日数（来店履歴がある日数）
- 接客本数（フリー、ネット指名、場内指名、本指名）
- 本指名への転換率（フリー→本指名、ネット指名→本指名、場内指名→本指名）

rechartsを使用してグラフを表示してください。
```

## ステップ9: アラート機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト6: アラート機能」の内容に従って、アラート機能を実装してください。

実装内容：
1. app/admin/alerts/page.tsx - アラート一覧ページ
2. app/api/admin/alerts/route.ts - アラート一覧取得API
3. app/api/admin/alerts/check/route.ts - アラート検出実行API
4. app/api/admin/alerts/[id]/resolve/route.ts - アラート解決API
5. lib/alerts.ts - アラート検出ロジック

アラート検出ロジック：
- 初回来店のみの顧客を検出
- 初回来店から3か月（settingsテーブルのalert_days）経過した顧客を検出
- alertsテーブルに記録

メール通知機能は後で実装するか、APIエンドポイントとして準備してください。
```

## ステップ10: マスタ設定機能の実装

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト7: マスタ設定機能」の内容に従って、マスタ設定機能を実装してください。

実装内容：
1. app/admin/settings/page.tsx - 設定ページ
2. app/api/admin/settings/route.ts - 設定取得API
3. app/api/admin/settings/[key]/route.ts - 設定更新API

設定項目：
- ポイント還元率（%）
- ポイント利用可能最小値
- ポイント利用単位
- アラートメールアドレス
- アラート日数（初回来店のみ顧客の検出日数）

バリデーションを実装してください。
```

## ステップ11: PWA設定

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト8: PWA設定」の内容に従って、PWAとして動作するように設定してください。

実装内容：
1. next.config.jsの更新（next-pwaの設定）
2. public/manifest.jsonの作成
3. アイコンの準備（public/icon-192.png, public/icon-512.png）
4. Service Workerの設定確認

next-pwaパッケージを使用してください。
```

## ステップ12: UI/UX改善

Cursorに以下のプロンプトをコピー＆ペースト：

```
POINT_CARD_PWA_PROMPT.mdの「プロンプト10: レスポンシブデザインとUI改善」の内容に従って、UI/UXを改善してください。

改善内容：
1. モバイルファーストデザイン
2. ダークモード対応（オプション）
3. ローディング状態の改善
4. エラーハンドリングの改善
5. オフライン対応

既存のshadcn/uiコンポーネントとTailwind CSSを使用してください。
```

## テスト

各機能を実装した後、以下をテストしてください：

1. 顧客登録・ログイン
2. ダッシュボード表示
3. 来店履歴登録（管理画面）
4. ポイント付与・利用
5. キャスト別稼働実績表示
6. アラート検出
7. PWAインストール

## トラブルシューティング

問題が発生した場合、`POINT_CARD_PWA_IMPLEMENTATION_GUIDE.md`の「よくある問題と解決方法」セクションを参照してください。

## 次のステップ

実装が完了したら：

1. セキュリティチェックリストを確認
2. パフォーマンス最適化
3. デプロイ準備
4. 本番環境でのテスト

