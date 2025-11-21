# Supabaseプロジェクト確認チェックリスト

## 📋 確認項目

プロジェクトURL: `https://supabase.com/dashboard/project/hgcmbmcjzdfugbnljkel`

### ✅ ステップ1: プロジェクト情報の確認

プロジェクトダッシュボードで以下を確認：

- [ ] **プロジェクト名**: 本番環境用であることが分かる名前（例: `point-card-pwa-production`）
- [ ] **リージョン**: 適切なリージョン（例: `Tokyo (North)`）
- [ ] **プラン**: 適切なプラン（FreeまたはPro）
- [ ] **ステータス**: 「Active」であること

### ✅ ステップ2: データベーススキーマの確認

#### 2-1. Table Editorでテーブルを確認

1. **左メニューから「Table Editor」をクリック**

2. **以下のテーブルがすべて存在することを確認**:
   - [ ] `customers`（顧客テーブル）
   - [ ] `casts`（キャストテーブル）
   - [ ] `visits`（来店履歴テーブル）
   - [ ] `point_transactions`（ポイント取引履歴テーブル）
   - [ ] `settings`（マスタ設定テーブル）
   - [ ] `alerts`（アラートテーブル）
   - [ ] `admin_users`（管理者テーブル）

**注意**: テーブルが存在しない場合、データベーススキーマを実行する必要があります。

#### 2-2. データベーススキーマが未実行の場合

もしテーブルが存在しない場合、以下を実行：

1. **左メニューから「SQL Editor」をクリック**
2. **「New query」をクリック**
3. **`supabase/point-card-schema.sql` の内容をコピーして貼り付け**
4. **「Run」ボタンをクリック**
5. **「Success. No rows returned」と表示されることを確認**

### ✅ ステップ3: APIキーの確認

1. **左メニューから「Settings」→「API」をクリック**

2. **以下の情報を取得**:

   #### Project URL
   - [ ] **URL**: `https://xxxxx.supabase.co`
   - この値を `NEXT_PUBLIC_SUPABASE_URL` として使用

   #### Project API keys
   - [ ] **anon public key**: `eyJhbGci...`
     - **Legacy API Keys** タブから取得
     - この値を `NEXT_PUBLIC_SUPABASE_ANON_KEY` として使用

   - [ ] **service_role secret**: `eyJhbGci...`
     - **Reveal** ボタンをクリックしてからコピー
     - ⚠️ **機密情報**: 絶対に公開しないでください
     - この値を `SUPABASE_SERVICE_ROLE_KEY` として使用

### ✅ ステップ4: 初期設定データの確認

1. **左メニューから「Table Editor」をクリック**
2. **`settings` テーブルをクリック**
3. **以下の設定値が存在することを確認**:
   - [ ] `point_rate`: `3`（ポイント還元率）
   - [ ] `min_points_to_use`: `500`（ポイント利用可能最小値）
   - [ ] `point_unit`: `500`（ポイント利用単位）
   - [ ] `alert_email`: （アラート送信先メールアドレス、空でもOK）
   - [ ] `alert_days`: `90`（初回来店のみ顧客のアラート日数）

**注意**: 設定値が存在しない場合、データベーススキーマを再実行してください。

## ✅ 確認完了後

すべての項目がチェックできたら、以下の情報をVercelデプロイ時に使用します：

```
✅ Project URL: https://xxxxx.supabase.co
✅ anon public key: eyJhbGci...
✅ service_role secret: eyJhbGci...（機密情報）
```

## 🔄 次のステップ

確認が完了したら：

1. ✅ **取得したAPIキーをメモ**
   - 安全な場所に保管してください
   - テキストファイルに保存することを推奨

2. ✅ **Vercelデプロイを進める**
   - 取得したAPIキーをVercelの環境変数に設定
   - 詳細は `Vercelデプロイ_クイックスタート.md` を参照

## ⚠️ 重要な注意事項

### 本番環境と開発環境の分離

- **開発環境**: 既存のSupabaseプロジェクト（`.env.local`で使用）
- **本番環境**: このプロジェクト（`hgcmbmcjzdfugbnljkel`）

**重要**: 本番環境と開発環境で異なるSupabaseプロジェクトを使用してください。

### APIキーの管理

- `service_role secret` は機密情報です
- GitHubなどにコミットしないでください
- Vercelの環境変数として設定します

### データベースパスワード

- プロジェクト作成時に設定したパスワードを忘れないように保管してください
- パスワードを忘れた場合、リセットが必要です（データは保持されます）

## 🆘 トラブルシューティング

### テーブルが存在しない

**原因**: データベーススキーマが実行されていない

**解決**:
1. SQL Editorを開く
2. `supabase/point-card-schema.sql` の内容をコピーして実行

### APIキーが表示されない

**原因**: プロジェクトの作成が完全に完了していない可能性

**解決**:
1. プロジェクトのステータスを確認
2. 数分待ってから再確認
3. 「Legacy API Keys」タブを確認

### エラーメッセージが表示される

**原因**: SQLの実行エラー

**解決**:
1. エラーメッセージを確認
2. エラーの内容をメモ
3. 必要に応じて、エラーメッセージを共有してください

## 📝 確認結果の記録

確認が完了したら、以下の情報を記録してください：

```
プロジェクトID: hgcmbmcjzdfugbnljkel
Project URL: https://xxxxx.supabase.co
作成日: YYYY-MM-DD
リージョン: Tokyo (North)
```

これで本番環境用Supabaseプロジェクトの確認が完了です！

