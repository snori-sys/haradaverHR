# 本番環境用Supabaseプロジェクト作成ガイド

## 📋 プロジェクト作成手順

### ステップ1: Supabaseにアクセス

1. **https://supabase.com/dashboard にアクセス**
2. **アカウントにログイン**
   - まだアカウントがない場合、Sign Upで新規登録

### ステップ2: 新しいプロジェクトを作成

1. **「New Project」ボタンをクリック**

2. **プロジェクト情報を入力**:
   - **Name**: `point-card-pwa-production`（任意、分かりやすい名前）
   - **Database Password**: **強力なパスワードを設定**（12文字以上、大文字・小文字・数字・記号を含む）
     - ⚠️ **重要**: このパスワードは忘れないように保管してください
     - 例: `MySecureP@ssw0rd2024!`
   - **Region**: `Tokyo (North) - Asia Pacific (Northeast 1)` または `Singapore (Southeast Asia)` を推奨
     - 日本のユーザーが多い場合は `Tokyo` を選択
   - **Pricing Plan**: `Free` で開始（後からアップグレード可能）

3. **「Create new project」ボタンをクリック**

4. **プロジェクトの作成が完了するまで待つ**（2-3分かかります）
   - 進行状況が表示されます
   - 「Setting up your project...」と表示されている間は待機

### ステップ3: プロジェクトの準備が完了したら

プロジェクトが作成されると、ダッシュボードが表示されます。

### ステップ4: データベーススキーマの実行

1. **左メニューから「SQL Editor」をクリック**

2. **「New query」をクリック**

3. **スキーマファイルの内容をコピー**
   - `supabase/point-card-schema.sql` の内容をすべてコピー

4. **SQLエディタに貼り付け**

5. **「Run」ボタンをクリック**（または Ctrl/Cmd + Enter）

6. **実行結果を確認**
   - 「Success. No rows returned」と表示されれば成功
   - エラーが表示された場合は、エラーメッセージを確認

### ステップ5: APIキーの取得

1. **左メニューから「Settings」→「API」をクリック**

2. **以下の情報をコピーして保存**:

   #### Project URL
   - **URL**: `https://xxxxx.supabase.co`
   - これを `NEXT_PUBLIC_SUPABASE_URL` として使用

   #### Project API keys
   - **anon public**: `eyJhbGci...`（Legacy API Keysタブから取得）
     - これを `NEXT_PUBLIC_SUPABASE_ANON_KEY` として使用
   - **service_role secret**: `eyJhbGci...`（「Reveal」ボタンをクリックしてからコピー）
     - ⚠️ **機密情報**: 絶対に公開しないでください
     - これを `SUPABASE_SERVICE_ROLE_KEY` として使用

### ステップ6: データベースの確認

1. **左メニューから「Table Editor」をクリック**
2. **以下のテーブルが作成されているか確認**:
   - [ ] `customers`
   - [ ] `casts`
   - [ ] `visits`
   - [ ] `point_transactions`
   - [ ] `settings`
   - [ ] `alerts`
   - [ ] `admin_users`

すべてのテーブルが表示されていれば、データベーススキーマの実行は成功です。

## 📝 取得した情報のメモ

以下の情報をVercelデプロイ時に使用します。安全に保管してください：

```
Project URL: https://xxxxx.supabase.co
anon public key: eyJhbGci...
service_role secret: eyJhbGci...（機密情報）
Database Password: xxxxxx（設定したパスワード）
```

## ⚠️ 重要な注意事項

1. **パスワードの管理**
   - データベースパスワードは忘れないように保管
   - パスワードを忘れた場合、リセットが必要（データは保持されます）

2. **APIキーの管理**
   - `service_role secret` は機密情報です
   - GitHubなどにコミットしないでください
   - Vercelの環境変数として設定します

3. **無料プランの制限**
   - 500MB のデータベース容量
   - 2GB の転送量/月
   - 50,000 の月間アクティブユーザー
   - 本番環境で大量のトラフィックが予想される場合は、プランアップグレードを検討

4. **RLSポリシー**
   - デフォルトでは開発用のRLSポリシーが設定されています
   - 本番環境では、より厳格なRLSポリシーを適用することを推奨
   - `supabase/point-card-schema-production.sql` を実行して更新可能

## 🔄 次のステップ

プロジェクト作成が完了したら：

1. ✅ **APIキーを取得**（上記ステップ5）
2. ✅ **Vercelデプロイを進める**（環境変数にAPIキーを設定）
3. ✅ **初期設定を行う**（管理者アカウントの作成など）

## 🆘 トラブルシューティング

### プロジェクト作成が失敗する

- ブラウザをリロードして再試行
- 別のリージョンを選択して再試行
- Supabaseのステータスページで障害を確認: https://status.supabase.com/

### SQLスキーマの実行でエラーが発生する

- SQLエディタのエラーメッセージを確認
- テーブルが既に存在する場合は、先に削除してから再実行
- エラーメッセージの内容を確認して、該当部分を修正

### APIキーが表示されない

- 「Legacy API Keys」タブを確認
- プロジェクトの作成が完全に完了しているか確認
- ブラウザをリロードして再確認

