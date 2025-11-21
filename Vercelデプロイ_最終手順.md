# Vercelデプロイ 最終手順

## ✅ 準備完了

すべてのAPIキーが揃いました。Vercelデプロイに進みます。

## 🚀 Vercelデプロイ手順

### ステップ1: Vercelにログイン

1. **ブラウザで以下にアクセス**:
   - https://vercel.com

2. **GitHub/GitLab/Bitbucketアカウントでログイン**

### ステップ2: プロジェクトを作成

1. **「Add New...」→「Project」をクリック**

2. **リポジトリをインポート**:
   - **GitHubリポジトリから**: リポジトリを選択
   - **または、手動でアップロード**: 「Upload」をクリック
   - **または、GitリポジトリのURL**: Git URLを入力

3. **プロジェクト設定**:
   - **Project Name**: `point-card-pwa`（任意）
   - **Framework Preset**: `Next.js`（自動検出）
   - **Root Directory**: `./`（プロジェクトルートの場合）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）
   - **Install Command**: `npm install`（自動設定）

### ステップ3: 環境変数を設定

1. **「Environment Variables」セクションを開く**

2. **以下の環境変数を追加**（各環境変数を1つずつ追加）:

   #### 環境変数1: NEXT_PUBLIC_SUPABASE_URL
   - **名前**: `NEXT_PUBLIC_SUPABASE_URL`
   - **値**: `https://hgcmbmcjzdfugbnljkel.supabase.co`
   - **環境**: Production, Preview, Development すべて ✅

   #### 環境変数2: NEXT_PUBLIC_SUPABASE_ANON_KEY
   - **名前**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **値**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c`
   - **環境**: Production, Preview, Development すべて ✅

   #### 環境変数3: SUPABASE_SERVICE_ROLE_KEY
   - **名前**: `SUPABASE_SERVICE_ROLE_KEY`
   - **値**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ`
   - **環境**: Production, Preview, Development すべて ✅
   - ⚠️ **機密情報**: 絶対に公開しないでください

   #### 環境変数4: JWT_SECRET
   - **名前**: `JWT_SECRET`
   - **値**: `apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=`
   - **環境**: Production, Preview, Development すべて ✅

   #### 環境変数5: JWT_EXPIRES_IN
   - **名前**: `JWT_EXPIRES_IN`
   - **値**: `24h`
   - **環境**: Production, Preview, Development すべて ✅

3. **各環境変数を追加**:
   - 「Add」をクリック
   - 名前を入力
   - 値を入力
   - 環境を選択（Production, Preview, Developmentすべてを選択推奨）
   - 「Save」をクリック
   - 次の環境変数を追加...（5つすべて追加するまで繰り返し）

### ステップ4: デプロイ実行

1. **すべての環境変数を設定したことを確認**

2. **「Deploy」ボタンをクリック**

3. **ビルドが完了するまで待つ**（数分かかります）
   - 進行状況が表示されます
   - ビルドログを確認できます

4. **デプロイ完了後、提供されたURLを確認**
   - 例: `https://point-card-pwa.vercel.app`
   - または: `https://point-card-pwa-xxxxx.vercel.app`

### ステップ5: デプロイ後の確認

デプロイが完了したら、提供されたURLにアクセスして、以下を確認：

- [ ] ホームページが表示される
- [ ] 顧客登録が動作する
- [ ] 顧客ログインが動作する
- [ ] 顧客ダッシュボードが表示される
- [ ] 管理者登録が動作する（`/admin/register`）
- [ ] 管理者ログインが動作する
- [ ] 管理者ダッシュボードが表示される

## 📋 環境変数設定チェックリスト

デプロイ前に、以下を確認してください：

- [ ] `NEXT_PUBLIC_SUPABASE_URL` を設定
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` を設定
- [ ] `SUPABASE_SERVICE_ROLE_KEY` を設定
- [ ] `JWT_SECRET` を設定
- [ ] `JWT_EXPIRES_IN` を設定
- [ ] すべての環境変数で、Production, Preview, Development すべてを選択

## 🆘 トラブルシューティング

### デプロイエラー

**問題**: ビルドエラーが発生する

**解決方法**:
- ビルドログを確認（Deployments → デプロイを選択 → Logs）
- 環境変数が正しく設定されているか確認
- すべての環境変数で、Production, Preview, Development すべてを選択しているか確認

### 動作エラー

**問題**: デプロイ後、機能が動作しない

**解決方法**:
- ブラウザのコンソール（F12）でエラーを確認
- Vercelのログを確認
- 環境変数が正しく設定されているか確認
- Supabaseの接続を確認

### データベース接続エラー

**問題**: Supabaseに接続できない

**解決方法**:
- 環境変数の値が正しいか確認
- Project URLが正しいか確認
- anon public keyが正しいか確認
- service_role secretが正しいか確認

## 🎉 デプロイ完了

デプロイが完了したら、提供されたURLを共有して、チームやユーザーがアクセスできるようにしてください。

これで本番環境へのリリースが完了です！

