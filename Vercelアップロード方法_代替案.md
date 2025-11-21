# Vercelアップロード方法 - 代替案

## 🔍 Uploadタブが見つからない場合

Vercelの新しいUIでは、ZIPファイルのアップロードオプションが目立たない場所にある場合があります。

## 🚀 方法1: ドラッグ&ドロップでアップロード

### ステップ1: ZIPファイルを準備

ZIPファイルの場所を確認：
- ファイル名: `point-card-pwa.zip`
- 場所: `/Users/sawashimanoriyuki/point-card-pwa/point-card-pwa.zip`

### ステップ2: Vercelダッシュボードでドラッグ&ドロップ

1. **ブラウザで https://vercel.com/new にアクセス**

2. **Gitリポジトリのインポートセクションの下を探す**
   - 画面を下にスクロール
   - または、Gitリポジトリの検索バーの下を見る

3. **「Upload」または「Deploy」ボタンを探す**
   - 画面の右上にある「Deploy」ボタンの近く
   - または、画面の下部に「Upload」リンクがあるかもしれません

4. **ZIPファイルをドラッグ&ドロップ**
   - ZIPファイルをブラウザにドラッグ&ドロップ
   - または、「Browse」ボタンをクリックしてファイルを選択

## 🚀 方法2: Gitリポジトリとしてアップロード（推奨）

ZIPアップロードが見つからない場合、Gitリポジトリとしてアップロードする方が簡単です。

### ステップ1: GitHubリポジトリを作成（推奨）

1. **GitHubにアクセス**:
   - https://github.com/new

2. **新しいリポジトリを作成**:
   - Repository name: `point-card-pwa`
   - Public または Private を選択
   - 「Create repository」をクリック

3. **ローカルプロジェクトをGitHubにプッシュ**:

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# Gitリポジトリが既に初期化されているか確認
git status

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubリポジトリを追加（リポジトリURLを置き換えてください）
git remote add origin https://github.com/your-username/point-card-pwa.git

# プッシュ
git push -u origin main
```

### ステップ2: VercelでGitリポジトリをインポート

1. **Vercelダッシュボードで「Import Git Repository」セクションを確認**

2. **作成したリポジトリを選択**
   - `point-card-pwa` または `haradaverHR` リポジトリを探す
   - 「Import」ボタンをクリック

3. **プロジェクト設定を確認**
   - Project Name: `point-card-pwa`
   - Framework Preset: `Next.js`（自動検出されるはず）

4. **環境変数を設定**
   - 「Environment Variables」セクションを開く
   - 以下の5つの環境変数を追加:

| 名前 | 値 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hgcmbmcjzdfugbnljkel.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ` |
| `JWT_SECRET` | `apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=` |
| `JWT_EXPIRES_IN` | `24h` |

5. **「Deploy」ボタンをクリック**

## 🚀 方法3: Vercel CLIを使用（再試行）

Vercel CLIを使ってコマンドラインから直接デプロイすることもできます。

### ステップ1: Vercel CLIの確認

```bash
cd /Users/sawashimanoriyuki/point-card-pwa
vercel --version
```

### ステップ2: 環境変数を設定ファイルとして作成

`.env.production` ファイルを作成：

```bash
cat > .env.production << EOF
NEXT_PUBLIC_SUPABASE_URL=https://hgcmbmcjzdfugbnljkel.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ
JWT_SECRET=apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=
JWT_EXPIRES_IN=24h
EOF
```

⚠️ **注意**: `.env.production` は `.gitignore` に追加してください（すでに含まれているはずです）

### ステップ3: Vercel CLIでデプロイ

```bash
vercel --prod
```

## 📋 推奨方法

**方法2（Gitリポジトリとしてアップロード）** を推奨します：

1. ✅ GitHubリポジトリを作成
2. ✅ コードをプッシュ
3. ✅ Vercelでリポジトリをインポート
4. ✅ 環境変数を設定
5. ✅ デプロイ

これにより、今後のコード更新も自動的にデプロイされます。

## 🆘 まだ見つからない場合

Uploadオプションがまだ見つからない場合：

1. **画面を下にスクロール**して、追加のオプションを確認
2. **右上の「Deploy」ボタン**をクリックして、アップロードオプションがあるか確認
3. **Gitリポジトリとしてアップロード**（方法2）を試す
4. **Vercel CLIを使用**（方法3）を試す

どれか1つの方法でデプロイできるはずです！

