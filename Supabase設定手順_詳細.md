# Supabase設定手順（詳細版）

## 🎯 まず最初に

以下の2つの選択肢があります：

### 選択肢1: 既存のSupabaseプロジェクトを使用
- 既存の求人管理システムと同じSupabaseプロジェクトを使う
- メリット: 簡単、すぐに始められる
- デメリット: データベースが混在する

### 選択肢2: 新しいSupabaseプロジェクトを作成（推奨）
- ポイントカードPWA専用の新しいプロジェクトを作成
- メリット: データベースが分離される、管理がしやすい
- デメリット: 新規プロジェクト作成に数分かかる

## 📝 新しいプロジェクトを作成する場合（推奨）

### 手順1: Supabaseダッシュボードにアクセス

1. **ブラウザで以下を開く**
   ```
   https://supabase.com/dashboard
   ```

2. **ログイン**
   - 既存のアカウントでログイン
   - まだアカウントがない場合は「Sign Up」から作成

### 手順2: プロジェクトを作成

1. **ダッシュボードで「New Project」ボタンをクリック**

2. **以下の情報を入力**：

   | 項目 | 値 |
   |------|-----|
   | **Name** | `point-card-pwa` または任意の名前 |
   | **Database Password** | 強力なパスワード（**必ずメモしてください**） |
   | **Region** | `Northeast Asia (Tokyo)` または最寄り |
   | **Pricing Plan** | `Free` プランでOK |

3. **「Create new project」をクリック**

4. **プロジェクト作成完了を待つ**（2-3分）

### 手順3: APIキーを取得

プロジェクトが作成されたら：

#### ① Settingsにアクセス
- 左側のメニューから **「Settings」**（⚙️アイコン）をクリック

#### ② APIタブを開く
- **「API」タブ**をクリック

#### ③ 3つの値をコピー

**1. Project URL**
```
「Configuration」セクション → 「Project URL」
例: https://abcdefghijklmnop.supabase.co

これをコピーして .env.local の NEXT_PUBLIC_SUPABASE_URL に貼り付け
```

**2. anon public key**
```
「Project API keys」セクション → 「anon public」
[Reveal] ボタンをクリックして表示
（eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... のような長い文字列）

これをコピーして .env.local の NEXT_PUBLIC_SUPABASE_ANON_KEY に貼り付け
```

**3. service_role secret** ⚠️ 重要
```
「Project API keys」セクション → 「service_role」
[Reveal] ボタンをクリックして表示
（eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... のような長い文字列）

⚠️ このキーは絶対に公開しないでください！
これをコピーして .env.local の SUPABASE_SERVICE_ROLE_KEY に貼り付け
```

### 手順4: 環境変数ファイルを編集

1. **Cursorでファイルを開く**
   ```
   /Users/sawashimanoriyuki/point-card-pwa/.env.local
   ```

2. **値を記入**（コピーした値を貼り付け）

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://あなたのプロジェクトID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=コピーしたanon_publicキーを貼り付け
SUPABASE_SERVICE_ROLE_KEY=コピーしたservice_roleキーを貼り付け

# JWT認証設定
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=
JWT_EXPIRES_IN=24h
```

3. **保存**（`Cmd + S`）

### 手順5: データベーススキーマを実行

1. **Supabaseダッシュボードの左メニューから「SQL Editor」をクリック**

2. **「New query」ボタンをクリック**

3. **SQLファイルを開く**
   - Cursorで `/Users/sawashimanoriyuki/point-card-pwa/supabase/point-card-schema.sql` を開く

4. **内容をコピー**
   - ファイル内のすべてのSQLを選択（`Cmd + A`）
   - コピー（`Cmd + C`）

5. **SupabaseのSQL Editorに貼り付け**
   - SQL Editorに貼り付け（`Cmd + V`）

6. **実行**
   - 「Run」ボタンをクリック（または `Cmd + Enter`）

7. **成功確認**
   - 「Success. No rows returned」というメッセージが表示されれば成功

8. **テーブルを確認**
   - 左メニューから「Table Editor」をクリック
   - 以下のテーブルが表示されることを確認：
     - customers
     - casts
     - visits
     - point_transactions
     - settings
     - alerts
     - admin_users

## ✅ 設定完了の確認

### 1. 環境変数の確認
```bash
cd /Users/sawashimanoriyuki/point-card-pwa
cat .env.local | grep -v "^#" | grep "="
```

すべての値が設定されていることを確認してください。

### 2. データベースの確認
- Supabaseダッシュボード > Table Editor でテーブルが表示されることを確認

## 🚀 次のステップ

設定が完了したら：

1. **開発サーバーを起動**
   ```bash
   cd /Users/sawashimanoriyuki/point-card-pwa
   npm run dev
   ```

2. **ブラウザで確認**
   - `http://localhost:3000` にアクセス

3. **初期管理者アカウントを作成**
   - `動作テストガイド.md` を参照

## 🆘 よくある質問

### Q: 既存のSupabaseプロジェクトを使いたい
A: 既存プロジェクトのSettings > APIから値をコピーして、`.env.local`に設定できます。
ただし、データベースが混在するため、新しいプロジェクトを作成することを推奨します。

### Q: Project URLが見つからない
A: Settings > API > Configurationセクションの上部に「Project URL」があります。

### Q: Revealボタンが表示されない
A: ブラウザを更新（F5）してみてください。または、別のブラウザで試してください。

### Q: SQLの実行でエラーが出る
A: 
- SQLファイルの内容をすべてコピーしているか確認
- エラーメッセージを確認して、どの部分でエラーが出ているか確認
- テーブルが既に存在する場合は、`CREATE TABLE IF NOT EXISTS`を使っているので問題ありません

## 📞 サポート

問題が解決しない場合は：
1. エラーメッセージを確認
2. `動作テストガイド.md` のトラブルシューティングを参照
3. Supabaseの公式ドキュメントを確認: https://supabase.com/docs

