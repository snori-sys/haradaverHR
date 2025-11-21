# Supabase設定手順ガイド

## 🎯 目的

ポイントカードPWAアプリ用のSupabaseプロジェクトを作成（または既存のプロジェクトを使用）し、必要な認証情報を取得します。

## 📝 ステップバイステップ手順

### ステップ1: Supabaseアカウントの確認

1. **Supabaseにアクセス**
   - https://supabase.com にアクセス

2. **ログイン**
   - 既存のアカウントでログイン
   - まだアカウントがない場合は「Sign Up」で新規登録

### ステップ2: プロジェクトの作成（新規の場合）

1. **ダッシュボードで「New Project」をクリック**

2. **プロジェクト情報を入力**
   - **Name**: `point-card-pwa` または任意の名前
   - **Database Password**: 強力なパスワードを設定（保存しておく）
   - **Region**: 最寄りのリージョンを選択（例: Northeast Asia (Tokyo)）
   - **Pricing Plan**: Free プランで開始可能

3. **「Create new project」をクリック**
   - プロジェクトの作成に数分かかります

### ステップ3: 認証情報の取得

プロジェクトが作成されたら：

1. **左メニューから「Settings」をクリック**

2. **「API」タブをクリック**

3. **以下の3つの値をコピー**

   #### ① Project URL
   ```
   「Project URL」セクションから以下をコピー
   例: https://abcdefghijklmnop.supabase.co
   
   これを .env.local の NEXT_PUBLIC_SUPABASE_URL に設定
   ```

   #### ② anon public key
   ```
   「Project API keys」セクションの「anon public」の値をコピー
   （「Reveal」ボタンをクリックして表示）
   
   これを .env.local の NEXT_PUBLIC_SUPABASE_ANON_KEY に設定
   ```

   #### ③ service_role secret
   ```
   「Project API keys」セクションの「service_role」の値をコピー
   （「Reveal」ボタンをクリックして表示）
   
   ⚠️ 重要: このキーは絶対に公開しないでください
   これを .env.local の SUPABASE_SERVICE_ROLE_KEY に設定
   ```

### ステップ4: データベーススキーマの実行

1. **左メニューから「SQL Editor」をクリック**

2. **「New query」をクリック**

3. **SQLファイルを開く**
   - `/Users/sawashimanoriyuki/point-card-pwa/supabase/point-card-schema.sql` を開く

4. **SQLファイルの内容をすべてコピー**

5. **SQL Editorに貼り付け**

6. **「Run」ボタンをクリック**（または `Ctrl/Cmd + Enter`）

7. **成功メッセージを確認**
   - すべてのテーブル、インデックス、トリガーが作成される

### ステップ5: 環境変数ファイルの更新

1. **Cursorで `.env.local` ファイルを開く**
   - `/Users/sawashimanoriyuki/point-card-pwa/.env.local`

2. **取得した値を貼り付け**

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=ここにProject URLを貼り付け
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon publicキーを貼り付け
SUPABASE_SERVICE_ROLE_KEY=ここにservice_roleキーを貼り付け

# JWT認証設定
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=
JWT_EXPIRES_IN=24h
```

3. **ファイルを保存**

## ✅ 設定確認

### データベーステーブルの確認

Supabaseダッシュボードで以下を確認：

1. **左メニューから「Table Editor」をクリック**
2. 以下のテーブルが表示されることを確認：
   - ✅ customers
   - ✅ casts
   - ✅ visits
   - ✅ point_transactions
   - ✅ settings
   - ✅ alerts
   - ✅ admin_users

### 初期設定データの確認

1. **Table Editorで「settings」テーブルを開く**
2. 以下の設定が自動的に作成されていることを確認：
   - point_rate: 3
   - min_points_to_use: 500
   - point_unit: 500
   - alert_email: （空）
   - alert_days: 90

## 🎯 次のステップ

環境変数の設定とデータベーススキーマの実行が完了したら：

1. ✅ 初期管理者アカウントを作成
2. ✅ 開発サーバーを起動（`npm run dev`）
3. ✅ 動作確認

詳細は `次のステップ.md` を参照してください。

