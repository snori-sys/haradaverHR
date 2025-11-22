# ポイントカードPWAをデプロイする方法

## ⚠️ 現在の状況

デプロイURL（https://cmsbeppin.vercel.app）にアクセスすると、求人管理システムが表示されています。

これは、既存の「haradaverHR」リポジトリのコードがデプロイされているためです。

ポイントカードPWAを表示するには、ポイントカードPWAのコードをGitHubリポジトリにプッシュする必要があります。

## 🚀 解決方法

### 方法1: 既存のコードを上書きしてプッシュ（推奨・簡単）

既存のコードを上書きして、ポイントカードPWAのコードをプッシュします。

⚠️ **注意**: 既存の求人管理システムのコードが削除されます。

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# 既存のコードを上書きしてプッシュ
git push -u origin main --force
```

### 方法2: 既存のコードをマージしてプッシュ

既存のコードとポイントカードPWAのコードをマージします。

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# 既存のコードを取得
git pull origin main --allow-unrelated-histories

# コンフリクトがあれば解決
# （コンフリクトが発生した場合、手動で解決する必要があります）

# 再度プッシュ
git push -u origin main
```

### 方法3: 新しいブランチを作成してプッシュ

既存のコードを保持して、新しいブランチを作成します。

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# 新しいブランチを作成
git checkout -b point-card-pwa

# プッシュ
git push -u origin point-card-pwa
```

その後、Vercelでブランチを切り替えてデプロイします。

## 📋 推奨手順（方法1）

### ステップ1: コードを上書きしてプッシュ

```bash
cd /Users/sawashimanoriyuki/point-card-pwa

# 既存のコードを上書きしてプッシュ
git push -u origin main --force
```

### ステップ2: Vercelが自動的に再デプロイ

GitHubにプッシュすると、Vercelが自動的に再デプロイします。

### ステップ3: デプロイ完了を待つ

Vercelダッシュボードでデプロイの進行状況を確認してください。

- Deployments → 最新のデプロイ → ステータスを確認
- Statusが「Ready」（緑の点）になるまで待つ

### ステップ4: デプロイURLにアクセスして確認

デプロイが完了したら、デプロイURLにアクセスして確認してください：

- https://cmsbeppin.vercel.app

ポイントカードPWAが表示されるはずです。

## ✅ 動作確認

デプロイが完了したら、以下を確認してください：

- [ ] ホームページがポイントカードPWAであること
- [ ] 顧客登録が動作する（`/register`）
- [ ] 顧客ログインが動作する（`/login`）
- [ ] 顧客ダッシュボードが表示される（`/dashboard`）
- [ ] 管理者登録が動作する（`/admin/register`）
- [ ] 管理者ログインが動作する（`/admin/login`）
- [ ] 管理者ダッシュボードが表示される（`/admin/dashboard`）

## 🆘 トラブルシューティング

### プッシュが拒否される場合

**問題**: プッシュが拒否される

**対処法**:
- `--force` フラグを使用してプッシュ
- または、既存のコードをマージしてからプッシュ

### デプロイが失敗する場合

**問題**: Vercelでのデプロイが失敗する

**対処法**:
- Vercelダッシュボードのログを確認
- 環境変数が正しく設定されているか確認
- ビルドエラーがないか確認

### まだ求人管理システムが表示される場合

**問題**: デプロイ後も求人管理システムが表示される

**対処法**:
- ブラウザのキャッシュをクリア（Ctrl/Cmd + Shift + R）
- 新しいブラウザウィンドウでアクセス
- Vercelダッシュボードでデプロイのステータスを確認

## 🎉 完了

ポイントカードPWAのコードをプッシュして、Vercelが再デプロイしたら、ポイントカードPWAが表示されるはずです！

