# データベース確認用SQL

## ✅ SQLスキーマの実行が完了しました

「Success. No rows returned」は正常な結果です。これはテーブルやトリガーが作成されたことを意味します。

## 📋 テーブル作成確認用SQL

以下のSQLをSupabase SQL Editorで実行して、テーブルが正しく作成されているか確認してください：

```sql
-- すべてのテーブル一覧を確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

## 🎯 作成されるべきテーブル一覧

1. ✅ `customers` - 顧客テーブル
2. ✅ `casts` - キャストテーブル
3. ✅ `visits` - 来店履歴テーブル
4. ✅ `point_transactions` - ポイント取引履歴テーブル
5. ✅ `settings` - マスタ設定テーブル
6. ✅ `alerts` - アラートテーブル
7. ✅ `admin_users` - 管理者テーブル

## 📊 初期設定データの確認

以下のSQLで初期設定データが投入されているか確認できます：

```sql
-- settingsテーブルの初期データ確認
SELECT * FROM settings;
```

以下のレコードが存在するはずです：
- `point_rate`: 3
- `min_points_to_use`: 500
- `point_unit`: 500
- `alert_email`: (空)
- `alert_days`: 90

## 🔍 より詳細な確認

テーブルの構造を確認する場合：

```sql
-- customersテーブルの構造確認
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'customers'
ORDER BY ordinal_position;
```

## ✅ 次のステップ

テーブルが正しく作成されていることを確認したら：

1. **開発サーバーを起動**
   ```bash
   cd /Users/sawashimanoriyuki/point-card-pwa
   npm run dev
   ```

2. **テスト用の管理者アカウントを作成**
   - `/admin/register` にアクセス（作成が必要な場合）
   - または、Supabaseで直接 `admin_users` テーブルにデータを挿入

3. **テスト用の顧客アカウントを作成**
   - `/register` にアクセス

