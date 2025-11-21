# Vercelデプロイ クイックスタート

## 🎯 デプロイに必要な情報

デプロイ前に、以下の情報を準備してください：

### 1. 本番環境用Supabaseプロジェクト

**まだ作成していない場合**:
1. https://supabase.com/dashboard にアクセス
2. 「New Project」をクリック
3. プロジェクト名、パスワード、リージョンを設定
4. プロジェクトを作成（数分かかります）
5. SQL Editorで `supabase/point-card-schema.sql` を実行

**すでに作成済みの場合**:
- そのまま次のステップに進んでください

### 2. 本番環境のAPIキー

Supabaseダッシュボードから取得：

1. **Settings > API** にアクセス
2. **Project URL** をコピー: `https://xxxxx.supabase.co`
3. **anon public key** をコピー: `eyJhbGci...`（Legacy API Keysタブから）
4. **service_role secret** をコピー: `eyJhbGci...`（Revealボタンをクリック）

### 3. JWT_SECRETの生成

ターミナルで以下を実行：

```bash
openssl rand -base64 32
```

出力された値をコピーしておいてください。

## 🚀 Vercelデプロイ手順

### ステップ1: Vercelにログイン

#### 方法A: Vercelダッシュボード（推奨・簡単）

1. **https://vercel.com にアクセス**
2. **「Sign Up」または「Log In」をクリック**
3. **GitHub/GitLab/Bitbucketアカウントでサインアップ/ログイン**

#### 方法B: Vercel CLI

```bash
vercel login
```

ブラウザが開くので、そこでログインしてください。

### ステップ2: プロジェクトの作成

#### 方法A: Vercelダッシュボード（推奨）

1. **「Add New...」→「Project」をクリック**

2. **リポジトリをインポート**
   - **GitHubリポジトリから**: リポジトリを選択
   - **または、手動でアップロード**: 「Upload」をクリック
   - **または、GitリポジトリのURL**: Git URLを入力

3. **プロジェクト設定**
   - **Project Name**: `point-card-pwa`（任意）
   - **Framework Preset**: `Next.js`（自動検出）
   - **Root Directory**: `./`（プロジェクトルートの場合）
   - **Build Command**: `npm run build`（自動設定）
   - **Output Directory**: `.next`（自動設定）
   - **Install Command**: `npm install`（自動設定）

#### 方法B: Vercel CLI

```bash
cd /Users/sawashimanoriyuki/point-card-pwa
vercel
```

以下の質問に答えます：
- Set up and deploy? → `Y`
- Which scope? → あなたのアカウントを選択
- Link to existing project? → `N`（新規の場合）
- What's your project's name? → `point-card-pwa`
- In which directory is your code located? → `./`（Enter）

### ステップ3: 環境変数の設定

**⚠️ 重要**: 本番環境用のSupabase APIキーを使用してください。

#### 方法A: Vercelダッシュボード

1. **プロジェクト作成画面で「Environment Variables」セクションを開く**

2. **以下の環境変数を追加**:

   | 名前 | 値 | 環境 |
   |------|-----|------|
   | `NEXT_PUBLIC_SUPABASE_URL` | 本番環境のSupabase URL | Production, Preview, Development すべて ✅ |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 本番環境のanon key | Production, Preview, Development すべて ✅ |
   | `SUPABASE_SERVICE_ROLE_KEY` | 本番環境のservice_role key | Production, Preview, Development すべて ✅ |
   | `JWT_SECRET` | 生成したJWT_SECRET | Production, Preview, Development すべて ✅ |
   | `JWT_EXPIRES_IN` | `24h` | Production, Preview, Development すべて ✅ |

3. **各環境変数を追加**
   - 「Add」をクリック
   - 名前を入力
   - 値を入力
   - 環境を選択（Production, Preview, Developmentすべてを選択）
   - 「Save」をクリック

#### 方法B: Vercel CLI

```bash
# 本番環境用の環境変数を設定
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# プロンプトが表示されたら、本番環境のSupabase URLを入力

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# 本番環境のanon keyを入力

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# 本番環境のservice_role keyを入力

vercel env add JWT_SECRET production
# 生成したJWT_SECRETを入力

vercel env add JWT_EXPIRES_IN production
# 24h を入力
```

### ステップ4: デプロイ実行

#### 方法A: Vercelダッシュボード

1. **「Deploy」ボタンをクリック**
2. **ビルドが完了するまで待つ**（数分かかります）
3. **デプロイ完了後、提供されたURLを確認**

#### 方法B: Vercel CLI

```bash
vercel --prod
```

### ステップ5: デプロイ後の確認

デプロイが完了したら、提供されたURL（例: `https://point-card-pwa.vercel.app`）にアクセスして、以下を確認：

- [ ] ホームページが表示される
- [ ] 顧客登録が動作する
- [ ] 顧客ログインが動作する
- [ ] 管理者登録が動作する
- [ ] 管理者ログインが動作する

## 📝 環境変数のテンプレート

デプロイ時に使用する環境変数のテンプレート：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...（本番環境のanon key）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...（本番環境のservice_role key）
JWT_SECRET=ここに生成したJWT_SECRETを入力（32文字以上）
JWT_EXPIRES_IN=24h
```

## ⚠️ 重要な注意事項

1. **本番環境と開発環境で異なるSupabaseプロジェクトを使用**
   - 開発環境のデータを本番環境で使用しない
   - 本番環境専用のSupabaseプロジェクトを作成

2. **JWT_SECRETは強力な値を使用**
   - 最低32文字のランダム文字列
   - 開発環境とは異なる値を使用

3. **環境変数の管理**
   - `.env.local` はGitリポジトリに含まれない（`.gitignore`に追加済み）
   - Vercelの環境変数として管理

## 🆘 トラブルシューティング

### デプロイエラー

- ビルドログを確認（Vercelダッシュボード → Deployments → デプロイを選択 → Logs）
- 環境変数が正しく設定されているか確認
- ローカルで `npm run build` が成功するか確認

### 動作エラー

- ブラウザのコンソール（F12）でエラーを確認
- Vercelのログを確認
- Supabaseの接続を確認

### データベース接続エラー

- 環境変数の値が正しいか確認
- Supabaseプロジェクトが正常に動作しているか確認
- SupabaseのダッシュボードでAPIキーを再確認

## 🎉 デプロイ完了後

デプロイが完了したら：

1. **提供されたURLを確認**
2. **すべての機能をテスト**
3. **本番環境のURLを保存**
4. **チームやユーザーにURLを共有**

これで本番環境へのリリースが完了です！

