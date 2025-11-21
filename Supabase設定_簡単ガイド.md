# Supabase設定 - 簡単ガイド

## 🎯 目標

Supabaseの認証情報を取得して、`.env.local`ファイルに設定します。

## 📋 手順（5分で完了）

### ステップ1: Supabaseにアクセス

1. **ブラウザで以下にアクセス**
   ```
   https://supabase.com/dashboard
   ```

2. **ログイン**
   - GitHubアカウントでサインアップ/ログイン（推奨）
   - またはメールアドレスでアカウント作成

### ステップ2: プロジェクトを作成

#### 既にSupabaseアカウントがある場合

1. ダッシュボードで **「New Project」** をクリック

2. 以下の情報を入力：
   - **Name**: `point-card-pwa` （任意の名前）
   - **Database Password**: 強力なパスワード（**必ずメモしてください**）
   - **Region**: `Northeast Asia (Tokyo)` または最寄りのリージョン
   - **Pricing Plan**: Free プランでOK

3. **「Create new project」** をクリック

4. **プロジェクト作成完了を待つ**（2-3分かかります）

### ステップ3: 認証情報を取得

プロジェクトが作成されたら：

1. **左側のメニューから「Settings」（⚙️アイコン）をクリック**

2. **「API」タブをクリック**

3. **以下の3つの値をコピー**してください：

   #### ① Project URL
   ```
   「Configuration」セクションの「Project URL」
   
   例: https://abcdefghijklmnop.supabase.co
   ```
   → この値をコピー

   #### ② anon public
   ```
   「Project API keys」セクションの「anon public」
   
   「Reveal」ボタンをクリックして表示
   （長い文字列です）
   ```
   → この値をコピー

   #### ③ service_role secret ⚠️ 重要
   ```
   「Project API keys」セクションの「service_role」
   
   「Reveal」ボタンをクリックして表示
   （長い文字列です）
   
   ⚠️ このキーは絶対に公開しないでください
   ```
   → この値をコピー

### ステップ4: 環境変数ファイルに設定

1. **Cursorで以下のファイルを開く**
   ```
   /Users/sawashimanoriyuki/point-card-pwa/.env.local
   ```

2. **以下のように記入**（コピーした値を貼り付け）

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon publicキーを貼り付け
SUPABASE_SERVICE_ROLE_KEY=ここにservice_roleキーを貼り付け

# JWT認証設定
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=
JWT_EXPIRES_IN=24h
```

3. **ファイルを保存**（`Cmd + S` または `Ctrl + S`）

### ステップ5: データベーススキーマを実行

1. **Supabaseダッシュボードの左メニューから「SQL Editor」をクリック**

2. **「New query」をクリック**

3. **以下のファイルを開く**
   - Cursorで `/Users/sawashimanoriyuki/point-card-pwa/supabase/point-card-schema.sql` を開く

4. **SQLファイルの内容をすべてコピー**（`Cmd + A` → `Cmd + C`）

5. **SupabaseのSQL Editorに貼り付け**（`Cmd + V`）

6. **「Run」ボタンをクリック**（または `Cmd + Enter`）

7. **「Success. No rows returned」というメッセージが表示されれば成功**

### ステップ6: 確認

1. **Supabaseダッシュボードの左メニューから「Table Editor」をクリック**

2. **以下のテーブルが表示されることを確認**：
   - ✅ customers
   - ✅ casts
   - ✅ visits
   - ✅ point_transactions
   - ✅ settings
   - ✅ alerts
   - ✅ admin_users

## ✅ 完了

これで設定は完了です！

## 🚀 次のステップ

1. **開発サーバーを起動**
   ```bash
   cd /Users/sawashimanoriyuki/point-card-pwa
   npm run dev
   ```

2. **ブラウザでアクセス**
   - `http://localhost:3000` を開く

3. **初期管理者アカウントを作成**
   - `動作テストガイド.md` を参照

## 🆘 困ったときは

### Supabaseにアクセスできない
- https://supabase.com/dashboard が開けるか確認
- アカウントにログインできているか確認

### APIキーが表示されない
- 「Reveal」ボタンをクリックしているか確認
- プロジェクトが作成完了しているか確認

### SQLの実行でエラーが出る
- SQLファイルの内容をすべてコピーしているか確認
- エラーメッセージを確認して、どのテーブルでエラーが出ているか確認

## 📸 スクリーンショット参考

### Settings > API の場所
```
Supabaseダッシュボード
├── 左メニュー
│   ├── Home
│   ├── Table Editor
│   ├── SQL Editor
│   ├── Settings ⚙️  ← ここをクリック
│   │   └── API タブ ← ここをクリック
│   └── ...
```

### コピーする値の場所
```
Configuration セクション
└── Project URL: https://xxx.supabase.co  ← これをコピー

Project API keys セクション
├── anon public: eyJhbG...  [Reveal]  ← Revealをクリックしてコピー
└── service_role: eyJhbG...  [Reveal]  ← Revealをクリックしてコピー
```

作業を進められます。分からない点があれば知らせてください。

