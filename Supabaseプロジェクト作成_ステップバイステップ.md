# 本番環境用Supabaseプロジェクト作成 - ステップバイステップ

## 🎯 目標

本番環境用のSupabaseプロジェクトを作成し、データベーススキーマをセットアップします。

## 📋 手順

### ステップ1: Supabaseにログイン

1. **ブラウザで https://supabase.com/dashboard にアクセス**

2. **ログイン方法を選択**:
   - **GitHubアカウントでログイン**（推奨）: 「Continue with GitHub」をクリック
   - **または、メールアドレスでログイン**: メールアドレスとパスワードを入力

3. **初めての場合は「Sign Up Now」をクリックして新規登録**

### ステップ2: 組織の作成（初回のみ）

ログイン後、組織の選択画面が表示されます：

1. **「New organization」をクリック**
2. **組織名を入力**（例: `My Organization`）
3. **「Create organization」をクリック**

### ステップ3: 新しいプロジェクトを作成

1. **「New Project」ボタンをクリック**
   - または、ダッシュボードの右上にある「New Project」ボタン

2. **プロジェクト情報を入力**:

   #### プロジェクト名
   - **Name**: `point-card-pwa-production`
     - または、分かりやすい名前（例: `point-card-production`）

   #### データベースパスワード
   - **Database Password**: **強力なパスワードを設定**
     - ⚠️ **重要**: 12文字以上、大文字・小文字・数字・記号を含む
     - 例: `MySecureP@ssw0rd2024!`
     - **このパスワードは忘れないように保管してください**
     - パスワードマネージャーに保存することを推奨

   #### リージョン
   - **Region**: `Tokyo (North) - Asia Pacific (Northeast 1)` を推奨
     - 日本のユーザーが多い場合
     - または `Singapore (Southeast Asia)` でもOK

   #### プラン
   - **Pricing Plan**: `Free` を選択
     - 後からアップグレード可能
     - 無料プランで十分な機能を提供

3. **「Create new project」ボタンをクリック**

4. **プロジェクトの作成が完了するまで待つ**（2-3分）
   - 「Setting up your project...」と表示されている間は待機
   - 進行状況が表示されます

### ステップ4: データベーススキーマの実行

プロジェクトが作成されると、ダッシュボードが表示されます。

1. **左メニューから「SQL Editor」をクリック**

2. **「New query」ボタンをクリック**
   - または、既存のクエリを削除して新規作成

3. **スキーマファイルの内容をコピー**:
   - ファイル: `supabase/point-card-schema.sql`
   - ファイルの内容をすべてコピー（Ctrl/Cmd + A で全選択 → Ctrl/Cmd + C でコピー）

4. **SQLエディタに貼り付け**:
   - SQLエディタをクリック
   - 貼り付け（Ctrl/Cmd + V）

5. **「Run」ボタンをクリック**
   - または、Ctrl/Cmd + Enter

6. **実行結果を確認**:
   - **成功の場合**: 「Success. No rows returned」と表示
   - **エラーの場合**: エラーメッセージを確認

### ステップ5: テーブルの確認

スキーマの実行が成功したら、テーブルが作成されているか確認します：

1. **左メニューから「Table Editor」をクリック**

2. **以下のテーブルが表示されているか確認**:
   - ✅ `customers`
   - ✅ `casts`
   - ✅ `visits`
   - ✅ `point_transactions`
   - ✅ `settings`
   - ✅ `alerts`
   - ✅ `admin_users`

すべてのテーブルが表示されていれば、データベーススキーマの実行は成功です！

### ステップ6: APIキーの取得

Vercelデプロイ時に必要なAPIキーを取得します：

1. **左メニューから「Settings」→「API」をクリック**

2. **Project URL** をコピー:
   - **URL**: `https://xxxxx.supabase.co`
   - これを `NEXT_PUBLIC_SUPABASE_URL` として使用

3. **Project API keys** セクションで:

   #### anon public key
   - **Legacy API Keys** タブをクリック（表示されている場合）
   - **anon public**: `eyJhbGci...` をコピー
   - これを `NEXT_PUBLIC_SUPABASE_ANON_KEY` として使用

   #### service_role secret
   - **service_role secret** の横にある「Reveal」ボタンをクリック
   - **secret**: `eyJhbGci...` をコピー
   - ⚠️ **機密情報**: 絶対に公開しないでください
   - これを `SUPABASE_SERVICE_ROLE_KEY` として使用

### ステップ7: 取得した情報のメモ

以下の情報をVercelデプロイ時に使用します。安全に保管してください：

```
✅ Project URL: https://xxxxx.supabase.co
✅ anon public key: eyJhbGci...
✅ service_role secret: eyJhbGci...（機密情報）
✅ Database Password: xxxxxx（設定したパスワード）
```

**推奨**: この情報をテキストファイルに保存して、安全な場所に保管してください。

## ✅ 完了確認

以下が完了していれば、本番環境用Supabaseプロジェクトの作成は完了です：

- [x] プロジェクトが作成されている
- [x] データベーススキーマが実行されている
- [x] すべてのテーブルが作成されている
- [x] APIキーを取得している

## 🔄 次のステップ

プロジェクト作成が完了したら：

1. ✅ **Vercelデプロイを進める**
   - 取得したAPIキーをVercelの環境変数に設定
   - 詳細は `Vercelデプロイ_クイックスタート.md` を参照

2. ✅ **初期設定を行う**
   - 管理者アカウントの作成
   - 設定値の確認

## 🆘 トラブルシューティング

### プロジェクト作成が失敗する

- ブラウザをリロードして再試行
- 別のリージョンを選択して再試行
- Supabaseのステータスページで障害を確認: https://status.supabase.com/

### SQLスキーマの実行でエラーが発生する

**エラー例1**: `relation "customers" already exists`
- **原因**: テーブルが既に存在する
- **解決**: テーブルを削除してから再実行、または `CREATE TABLE IF NOT EXISTS` を使用（既に含まれています）

**エラー例2**: `permission denied`
- **原因**: 権限の問題
- **解決**: SQLエディタで実行していることを確認（管理者権限で実行されます）

**エラー例3**: `syntax error`
- **原因**: SQLの構文エラー
- **解決**: エラーメッセージの行番号を確認して修正

### APIキーが表示されない

- **Legacy API Keys** タブを確認
- プロジェクトの作成が完全に完了しているか確認（数分待つ）
- ブラウザをリロードして再確認

## 📝 補足情報

### 無料プランの制限

- **データベース容量**: 500MB
- **転送量**: 2GB/月
- **月間アクティブユーザー**: 50,000人
- **プロジェクト数**: 2プロジェクト

本番環境で大量のトラフィックが予想される場合は、プランアップグレードを検討してください。

### セキュリティの注意事項

1. **データベースパスワード**
   - 強力なパスワードを使用
   - パスワードマネージャーに保存

2. **APIキー**
   - `service_role secret` は機密情報
   - GitHubなどにコミットしない
   - Vercelの環境変数として設定

3. **RLSポリシー**
   - デフォルトでは開発用のRLSポリシーが設定されています
   - 本番環境では、より厳格なRLSポリシーを適用することを推奨
   - `supabase/point-card-schema-production.sql` を実行して更新可能

