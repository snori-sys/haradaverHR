# APIキー設定方法（現在の画面から）

## ✅ 必要な情報がすべて表示されています

現在の画面「Legacy API Keys」タブに、必要な2つのキーが表示されています。

## 📝 設定手順

### 1. anon public key（公開キー）をコピー

**現在の画面で：**
1. **「anon public」**セクションを見つける
2. 長い文字列の右側にある **「Copy」ボタン**をクリック
   - または、文字列を選択してコピー（`Cmd + C`）
3. コピー完了！

### 2. service_role secret（秘密キー）をコピー

**現在の画面で：**
1. **「service_role secret」**セクションを見つける
2. マスクされているキー（`**** **** **** ****`）の右側にある **「Reveal」ボタン**をクリック
3. キーが表示されるので、**「Copy」ボタン**をクリック
   - または、文字列を選択してコピー（`Cmd + C`）
4. コピー完了！

⚠️ **重要**: service_role secretは一度表示されると、次回は再度Revealボタンをクリックする必要があります。

### 3. `.env.local`ファイルに貼り付け

1. **Cursorで `.env.local` ファイルを開く**
   ```
   /Users/sawashimanoriyuki/point-card-pwa/.env.local
   ```

2. **以下のように値を貼り付け**：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://fstduijfmltcppkxdvsp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ここにanon publicキーを貼り付け（Copyボタンでコピーした値）
SUPABASE_SERVICE_ROLE_KEY=ここにservice_role secretを貼り付け（Reveal→Copyでコピーした値）

# JWT認証設定
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=
JWT_EXPIRES_IN=24h
```

3. **ファイルを保存**（`Cmd + S`）

## ✅ 設定完了の確認

すべての値が設定されると、`.env.local`は以下のようになります：

```env
NEXT_PUBLIC_SUPABASE_URL=https://fstduijfmltcppkxdvsp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...（長い文字列）
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...（長い文字列）
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=
JWT_EXPIRES_IN=24h
```

## 🚀 次のステップ

環境変数の設定が完了したら：

1. **データベーススキーマを実行**
   - Supabaseダッシュボード > SQL Editor
   - `supabase/point-card-schema.sql` の内容を実行

2. **開発サーバーを起動**
   ```bash
   cd /Users/sawashimanoriyuki/point-card-pwa
   npm run dev
   ```

