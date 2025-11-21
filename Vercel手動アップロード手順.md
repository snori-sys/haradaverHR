# Vercel手動アップロード手順

## 📦 ZIPファイルとしてアップロード（推奨）

Vercel CLIが使えない場合、ZIPファイルとしてアップロードできます。

## 🚀 アップロード手順

### ステップ1: ZIPファイルの作成

ZIPファイルは既に作成されています：`point-card-pwa.zip`

### ステップ2: Vercelダッシュボードでアップロード

1. **ブラウザで https://vercel.com にアクセス**

2. **ログイン**
   - GitHub/GitLab/Bitbucketアカウントでログイン
   - または、Emailでサインアップ/ログイン

3. **プロジェクトを作成**
   - **「Add New...」→「Project」をクリック**
   - または、ダッシュボードの **「Add New...」** ボタンをクリック

4. **ZIPファイルをアップロード**
   - **「Upload」タブをクリック**（表示されている場合）
   - または、**「Browse」ボタンをクリック**
   - 作成した `point-card-pwa.zip` ファイルを選択

5. **プロジェクト情報を入力**
   - **Project Name**: `point-card-pwa`（任意）
   - **Framework Preset**: `Next.js`（自動検出されるはず）

6. **環境変数を設定（重要）**
   
   **⚠️ 重要**: デプロイ前に環境変数を設定してください。
   
   **「Environment Variables」セクションを開く**（デプロイボタンの前にある場合）
   
   または、**デプロイ後**に以下を設定：
   - Settings → Environment Variables

   **以下の5つの環境変数を追加**:

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://hgcmbmcjzdfugbnljkel.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ` | Production, Preview, Development |
   | `JWT_SECRET` | `apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=` | Production, Preview, Development |
   | `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development |

7. **「Deploy」ボタンをクリック**

8. **ビルドが完了するまで待つ**（数分かかります）
   - 進行状況が表示されます
   - ビルドログを確認できます

### ステップ3: デプロイ後の環境変数設定（デプロイ前に設定しなかった場合）

デプロイ後に環境変数を設定する場合：

1. **デプロイが完了したら、プロジェクトの設定画面を開く**
   - プロジェクト名をクリック
   - または、Settings → Environment Variables

2. **「Environment Variables」セクションを開く**

3. **上記の5つの環境変数を追加**

4. **各環境変数を追加**:
   - 「Add」をクリック
   - 名前を入力
   - 値を入力
   - 環境を選択（**Production, Preview, Development すべてを選択**）
   - 「Save」をクリック

5. **再デプロイ**:
   - 環境変数を設定した後、再デプロイが必要な場合があります
   - Deployments → 最新のデプロイを選択 → 「Redeploy」をクリック
   - または、Settings → Environment Variables → 「Redeploy」ボタンがある場合

## ✅ デプロイ完了後の確認

デプロイが完了したら、提供されたURL（例: `https://point-card-pwa.vercel.app`）にアクセスして、以下を確認：

- [ ] ホームページが表示される
- [ ] 顧客登録が動作する
- [ ] 顧客ログインが動作する
- [ ] 顧客ダッシュボードが表示される
- [ ] 管理者登録が動作する（`/admin/register`）
- [ ] 管理者ログインが動作する
- [ ] 管理者ダッシュボードが表示される

## 📋 チェックリスト

デプロイ前：
- [ ] ZIPファイルを作成
- [ ] Vercelにログイン
- [ ] プロジェクトを作成
- [ ] 環境変数を設定（または、デプロイ後に設定）

デプロイ後：
- [ ] デプロイが成功する
- [ ] 環境変数が正しく設定されている（デプロイ後に設定した場合、再デプロイ）
- [ ] すべての機能が正常に動作する

## 🆘 トラブルシューティング

### ZIPファイルが大きすぎる

**問題**: ZIPファイルが大きすぎてアップロードできない

**解決方法**:
- `node_modules` が含まれていないことを確認
- `.next` フォルダが含まれていないことを確認
- 不要なファイルを削除してから再作成

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
- 環境変数を設定した後、再デプロイが必要な場合があります

## 🎉 デプロイ完了

デプロイが完了したら、提供されたURLを共有して、チームやユーザーがアクセスできるようにしてください。

これで本番環境へのリリースが完了です！

