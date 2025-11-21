# Vercelデプロイ手順

## 📋 デプロイ前の準備

### 1. 本番環境用Supabaseプロジェクトの作成

**重要**: 本番環境では、開発環境とは別のSupabaseプロジェクトを使用することを強く推奨します。

1. **Supabaseダッシュボードにアクセス**
   - https://supabase.com/dashboard
   - 「New Project」をクリック

2. **プロジェクト情報を入力**
   - プロジェクト名: `point-card-pwa-production`（任意）
   - データベースパスワード: 強力なパスワードを設定
   - リージョン: 日本（Tokyo）または適切なリージョンを選択

3. **プロジェクトの作成を完了**（数分かかります）

4. **データベーススキーマの実行**
   - SQL Editorを開く
   - `supabase/point-card-schema.sql` の内容をコピーして実行

5. **本番環境用RLSポリシーの適用（オプション）**
   - `supabase/point-card-schema-production.sql` の内容を実行

### 2. 本番環境のAPIキーを取得

1. **Settings > API** にアクセス

2. **以下の情報を取得**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...`（Copyボタンでコピー）
   - **service_role secret**: `eyJhbGci...`（RevealボタンをクリックしてからCopy）

### 3. JWT_SECRETの生成

```bash
# 強力なランダム文字列を生成（32バイト以上推奨）
openssl rand -base64 32
```

**⚠️ 重要**: この値をコピーしておいてください。後で環境変数として設定します。

## 🚀 Vercelへのデプロイ

### 方法1: Vercel CLIを使用（推奨）

#### ステップ1: Vercel CLIのインストール

```bash
npm install -g vercel
```

#### ステップ2: Vercelにログイン

```bash
vercel login
```

ブラウザが開いて、GitHub/GitLab/Bitbucketアカウントでログインします。

#### ステップ3: プロジェクトの初期化

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

#### ステップ4: 環境変数の設定

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# 本番環境のSupabase Project URLを入力

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 本番環境のanon public keyを入力

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 本番環境のservice_role secretを入力

vercel env add JWT_SECRET production
# 生成したJWT_SECRETを入力

vercel env add JWT_EXPIRES_IN production
# 24h を入力
```

#### ステップ5: デプロイ

```bash
vercel --prod
```

これで本番環境にデプロイされます！

### 方法2: Vercelダッシュボードを使用

#### ステップ1: Vercelアカウントの作成

1. https://vercel.com にアクセス
2. GitHub/GitLab/Bitbucketアカウントでサインアップ

#### ステップ2: プロジェクトのインポート

1. **「New Project」をクリック**
2. **GitHubリポジトリを選択**（または手動でアップロード）
   - リポジトリがGitHubにプッシュされている必要があります
3. **プロジェクトルートを設定**
   - Root Directory: `point-card-pwa`（リポジトリのルートにプロジェクトがある場合）
   - または、フルパス: `/Users/sawashimanoriyuki/point-card-pwa`
4. **Framework Preset**: `Next.js`（自動検出されるはず）
5. **Build Command**: `npm run build`（自動設定されるはず）
6. **Output Directory**: `.next`（自動設定されるはず）

#### ステップ3: 環境変数の設定

1. **「Environment Variables」セクションを開く**

2. **以下の環境変数を追加**:

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | 本番環境のSupabase URL | Production, Preview, Development |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 本番環境のanon key | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | 本番環境のservice_role key | Production, Preview, Development |
   | `JWT_SECRET` | 生成したJWT_SECRET | Production, Preview, Development |
   | `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development |

3. **各環境変数を追加**
   - 「Add」ボタンをクリック
   - 名前と値を入力
   - 環境を選択（Production, Preview, Developmentすべてを選択推奨）
   - 「Save」をクリック

#### ステップ4: デプロイ

1. **「Deploy」ボタンをクリック**
2. ビルドが完了するまで待つ（数分かかります）
3. **デプロイ完了後、提供されたURLを確認**

## ✅ デプロイ後の確認

### 1. デプロイURLにアクセス

Vercelが提供するURL（例: `https://point-card-pwa.vercel.app`）にアクセスします。

### 2. 基本機能の確認

- [ ] ホームページが表示される
- [ ] 顧客登録が動作する
- [ ] 顧客ログインが動作する
- [ ] 顧客ダッシュボードが表示される
- [ ] 管理者登録が動作する
- [ ] 管理者ログインが動作する
- [ ] 管理者ダッシュボードが表示される

### 3. 機能テスト

- [ ] 来店履歴の登録・編集・削除
- [ ] キャスト管理
- [ ] アラート管理
- [ ] 設定の変更

### 4. セキュリティの確認

- [ ] 未認証ユーザーが保護されたページにアクセスできない
- [ ] 顧客は自分のデータのみアクセス可能
- [ ] 管理者は認証された管理者のみアクセス可能

## 🔧 トラブルシューティング

### デプロイエラー

**問題**: ビルドエラーが発生する

**解決方法**:
- ビルドログを確認
- 環境変数が正しく設定されているか確認
- ローカルで `npm run build` が成功するか確認

### 動作エラー

**問題**: デプロイ後、機能が動作しない

**解決方法**:
- ブラウザのコンソールでエラーを確認
- Vercelのログを確認（Deployments → デプロイを選択 → Logs）
- 環境変数が正しく設定されているか確認

### データベース接続エラー

**問題**: Supabaseに接続できない

**解決方法**:
- 環境変数の値が正しいか確認
- Supabaseプロジェクトが正常に動作しているか確認
- Supabaseのダッシュボードでログを確認

## 📝 今後の更新方法

### コードを更新した場合

1. **変更をコミット**
   ```bash
   git add .
   git commit -m "Update: 変更内容"
   git push
   ```

2. **Vercelが自動デプロイ**
   - GitHubと連携している場合、自動的にデプロイされます
   - または、`vercel --prod` で手動デプロイ

### 環境変数を更新した場合

1. **Vercelダッシュボードで更新**
   - Settings → Environment Variables
   - 該当する環境変数を編集
   - 「Save」をクリック

2. **再デプロイ**
   - 手動で再デプロイするか、次のコミットで自動デプロイされます

## 🎉 デプロイ完了！

デプロイが完了したら、提供されたURLを共有して、チームやユーザーがアクセスできるようにしてください。

