# Vercelインポート手順

## 📋 推奨手順

既存の「haradaverHR」リポジトリにコードをプッシュしてから、Vercelでインポートすることを推奨します。

## 🚀 手順

### ステップ1: GitHubリポジトリのURLを確認

1. **GitHubで「haradaverHR」リポジトリにアクセス**
   - https://github.com/snori-sys/haradaverHR
   - または、あなたのユーザー名に合わせてURLを調整

2. **リポジトリのURLを確認**
   - 「Code」ボタンをクリック
   - HTTPSのURLをコピー
   - 例: `https://github.com/snori-sys/haradaverHR.git`

### ステップ2: リモートリポジトリを設定してプッシュ

以下のコマンドを実行してください（リポジトリURLを確認してから）：

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# リモートリポジトリを追加（リポジトリURLを置き換えてください）
git remote add origin https://github.com/snori-sys/haradaverHR.git

# プッシュ
git push -u origin main
```

⚠️ **注意**: リポジトリURLは実際のURLに置き換えてください。

### ステップ3: Vercelでリポジトリをインポート

1. **Vercelダッシュボードで「Import Git Repository」セクションを確認**

2. **「haradaverHR」リポジトリの「Import」ボタンをクリック**

3. **プロジェクト設定を確認**:
   - **Project Name**: `point-card-pwa`（任意）
   - **Framework Preset**: `Next.js`（自動検出されるはず）
   - **Root Directory**: `./`（プロジェクトルートの場合）

4. **環境変数を設定**（重要）:

   **「Environment Variables」セクションを開く**

   以下の5つの環境変数を追加:

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://hgcmbmcjzdfugbnljkel.supabase.co` | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NzY3NTksImV4cCI6MjA3OTI1Mjc1OX0.E_XkUK1Ue6OS6PFEfjmhYqD4p2HSPUXt7j2fx5Bts5c` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhnY21ibWNqemRmdWdibmxqa2VsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzY3Njc1OSwiZXhwIjoyMDc5MjUyNzU5fQ.4wjAxywhvQSSbLZXKbOT4EBlyjghChEyZ3s5QEvpPXQ` | Production, Preview, Development |
   | `JWT_SECRET` | `apRIKYbcsO2ya4V8ZVEMHKJ1Zx4HHUDWwZ/Xt7hLopo=` | Production, Preview, Development |
   | `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development |

   **重要**: 各環境変数で、Production, Preview, Development すべてを選択してください。

5. **「Deploy」ボタンをクリック**

6. **ビルドが完了するまで待つ**（数分かかります）

## ⚠️ 重要な注意事項

### リポジトリに既にコードがある場合

既存のリポジトリにコードがある場合、プッシュ時にコンフリクトが発生する可能性があります。

この場合、以下のいずれかを選択してください：

1. **既存のコードを上書きする場合**:
   ```bash
   git push -u origin main --force
   ```
   ⚠️ **注意**: 既存のコードが削除されます。

2. **既存のコードを保持する場合**:
   - ブランチを作成してプッシュ
   - または、別のリポジトリを作成

### リポジトリが空の場合

リポジトリが空の場合、そのままプッシュできます。

## ✅ 完了確認

1. ✅ **GitHubでリポジトリを確認**
   - すべてのファイルが表示されていることを確認

2. ✅ **Vercelでデプロイ**
   - デプロイが成功することを確認
   - 提供されたURLにアクセスして動作を確認

## 🎉 完了

コードをプッシュして、Vercelでインポートしたら、本番環境へのリリースが完了です！

