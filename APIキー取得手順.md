# APIキー取得手順（現在の画面から）

## ✅ Project URL - 完了
Project URLは既に取得できました：
```
https://fstduijfmltcppkxdvsp.supabase.co
```

このURLは既に `.env.local` に設定済みです。

## 📝 次に必要な情報

### 1. anon public key（公開キー）

**取得場所：**
1. 左メニューで「**API Keys**」をクリック
2. 「**Publishable key**」セクションで値をコピー
   - または、テーブルの「web」「mobile」のAPI KEYをコピー
3. `.env.local` の `NEXT_PUBLIC_SUPABASE_ANON_KEY=` の後に貼り付け

### 2. service_role secret（秘密キー）

**取得場所：**
1. 左メニューで「**API Keys**」をクリック
2. 「**Secret keys**」セクションを確認
3. 既にSecret keyがある場合：
   - テーブルに表示されているSecret keyをコピー
   - 「Copy」アイコンをクリック
4. Secret keyがない場合：
   - 「**+ New secret key**」ボタンをクリック
   - 名前を入力（例: `service_role`）
   - 作成されたSecret keyをコピー（一度しか表示されないので注意）
5. `.env.local` の `SUPABASE_SERVICE_ROLE_KEY=` の後に貼り付け

## 📍 設定場所

**ファイル：**
```
/Users/sawashimanoriyuki/point-card-pwa/.env.local
```

**現在の設定：**
```env
NEXT_PUBLIC_SUPABASE_URL=https://fstduijfmltcppkxdvsp.supabase.co  ← 既に設定済み ✅
NEXT_PUBLIC_SUPABASE_ANON_KEY=                                     ← ここに貼り付け
SUPABASE_SERVICE_ROLE_KEY=                                         ← ここに貼り付け
JWT_SECRET=NLhwuZ9qPrHQLxRTmFQbWL0eDYuZJq0YhXjFw4GdBG0=            ← 既に設定済み ✅
JWT_EXPIRES_IN=24h                                                  ← 既に設定済み ✅
```

## 🎯 次のステップ

1. 左メニューで「**API Keys**」をクリック
2. Publishable keyとSecret keyを取得
3. `.env.local`ファイルに貼り付け
4. ファイルを保存

完了したら知らせてください！

