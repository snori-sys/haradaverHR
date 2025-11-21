# Vercelアップロード手順

## 🚀 方法1: Vercel CLIを使用（推奨・簡単）

Vercel CLIを使用すると、ローカルから直接デプロイできます。

### ステップ1: Vercel CLIの確認

```bash
cd /Users/sawashimanoriyuki/point-card-pwa
vercel --version
```

Vercel CLIがインストールされていることを確認します。

### ステップ2: Vercelにログイン

```bash
vercel login
```

ブラウザが開いて、GitHub/GitLab/Bitbucketアカウントでログインします。

### ステップ3: プロジェクトのデプロイ

```bash
cd /Users/sawashimanoriyuki/point-card-pwa
vercel
```

初回は以下の質問が表示されます：

1. **Set up and deploy?** → `Y`
2. **Which scope?** → あなたのアカウントを選択
3. **Link to existing project?** → `N`（新規プロジェクトの場合）
4. **What's your project's name?** → `point-card-pwa`（任意）
5. **In which directory is your code located?** → `./`（そのままEnter）

### ステップ4: 環境変数を設定

デプロイ後、環境変数を設定します：

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# プロンプトが表示されたら、以下を入力:
# https://hgcmbmcjzdfugbnljkel.supabase.co

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 以下を入力:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 以下を入力:
# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ

vercel env add JWT_SECRET production
# 以下を入力:
# apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=

vercel env add JWT_EXPIRES_IN production
# 以下を入力:
# 24h
```

### ステップ5: 本番環境にデプロイ

```bash
vercel --prod
```

これで本番環境にデプロイされます！

## 📦 方法2: ZIPファイルとしてアップロード

Vercel CLIが使えない場合、ZIPファイルとしてアップロードできます。

### ステップ1: プロジェクトをZIP圧縮

```bash
cd /Users/sawashimanoriyuki/point-card-pwa
zip -r point-card-pwa.zip . -x "node_modules/*" ".next/*" ".git/*" ".env*.local" "*.log"
```

### ステップ2: Vercelダッシュボードでアップロード

1. **https://vercel.com にアクセス**
2. **ログイン**
3. **「Add New...」→「Project」をクリック**
4. **「Upload」タブをクリック**（または「Browse」ボタンをクリック）
5. **作成した`point-card-pwa.zip`ファイルを選択**
6. **プロジェクト名を入力**: `point-card-pwa`
7. **「Deploy」ボタンをクリック**

### ステップ3: 環境変数を設定

1. **デプロイ後、プロジェクトの設定画面を開く**
2. **Settings → Environment Variables をクリック**
3. **以下の環境変数を追加**:

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://hgcmbmcjzdfugbnljkel.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ` | Production, Preview, Development |
   | `JWT_SECRET` | `apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=` | Production, Preview, Development |
   | `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development |

4. **各環境変数を追加**:
   - 「Add」をクリック
   - 名前と値を入力
   - 環境を選択（Production, Preview, Developmentすべてを選択）
   - 「Save」をクリック

5. **再デプロイ**:
   - 環境変数を設定した後、再デプロイが必要な場合があります
   - Deployments → 最新のデプロイを選択 → 「Redeploy」をクリック

## ⚠️ 重要な注意事項

1. **node_modulesを含めない**
   - ZIPファイルに`node_modules`を含めないでください
   - Vercelが自動的に依存関係をインストールします

2. **環境変数の設定**
   - ZIPアップロードの場合、環境変数をデプロイ後に設定する必要があります
   - 環境変数を設定した後、再デプロイが必要な場合があります

3. **.env.local を含めない**
   - `.env.local`ファイルはZIPファイルに含めないでください
   - 環境変数はVercelの設定画面で設定します

## 🎉 デプロイ完了

デプロイが完了したら、提供されたURLにアクセスして、機能が正常に動作することを確認してください。

## 🔄 今後の更新

### Vercel CLIを使用する場合

コードを更新したら：

```bash
vercel --prod
```

### ZIPアップロードの場合

コードを更新したら：

1. 新しいZIPファイルを作成
2. Vercelダッシュボードから再アップロード
3. または、GitHubリポジトリに接続することを推奨（自動デプロイ）

## 📝 推奨事項

将来的には、**GitHubリポジトリに接続することを強く推奨**します：

1. コードをGitHubにプッシュ
2. VercelでGitHubリポジトリを選択
3. 自動デプロイが有効になる
4. コードをプッシュするたびに自動的にデプロイされる

これで、手動でのアップロードが不要になります。

