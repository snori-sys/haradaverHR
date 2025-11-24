# Vercel環境変数設定手順

## 🔗 VercelダッシュボードのURL

### メインダッシュボード
```
https://vercel.com/dashboard
```

### プロジェクト設定（環境変数）
1. **メインダッシュボードにアクセス**
   - https://vercel.com/dashboard

2. **プロジェクトを選択**
   - プロジェクト名「`cmsbeppin`」をクリック
   - または、デプロイURLから推測: https://cmsbeppin.vercel.app

3. **Settings → Environment Variablesを開く**
   - 左サイドバーから「Settings」をクリック
   - 「Environment Variables」タブをクリック

## 📋 設定する環境変数

以下の3つの環境変数を追加してください：

### 1. VAPID_PUBLIC_KEY

**キー名**: `VAPID_PUBLIC_KEY`

**値**:
```
BBUKrYxJ-USIbUWVeH9bBW67b-a3o0_Sc0MOpVONQ9iy__l5py6HDORYHYlgjV5VxLHAIkbo8KwUHpVi4XmOEj0
```

**Environment**: `Production`, `Preview`, `Development` すべてにチェック（または「All Environments」を選択）

### 2. VAPID_PRIVATE_KEY

**キー名**: `VAPID_PRIVATE_KEY`

**値**:
```
uhvF8h2djTyKfCh0Hm8XrvGbhMCmimImg-paf44D_Ec
```

**Environment**: `Production`, `Preview`, `Development` すべてにチェック（または「All Environments」を選択）

⚠️ **重要**: このキーは秘密情報です。絶対に公開しないでください。

### 3. VAPID_MAILTO

**キー名**: `VAPID_MAILTO`

**値**:
```
admin@example.com
```
※ 適切なメールアドレスに変更してください（例: `your-email@example.com`）

**Environment**: `Production`, `Preview`, `Development` すべてにチェック（または「All Environments」を選択）

## 🚀 設定手順

### ステップ1: Vercelダッシュボードにアクセス

1. **Vercelにログイン**
   - https://vercel.com/dashboard にアクセス
   - ログインが必要な場合はログイン

### ステップ2: プロジェクトを選択

1. **プロジェクト一覧から選択**
   - プロジェクト名「`cmsbeppin`」をクリック
   - 見つからない場合は、検索ボックスで「cmsbeppin」と検索

### ステップ3: Environment Variablesを開く

1. **Settingsに移動**
   - 左サイドバーから「Settings」をクリック

2. **Environment Variablesタブを開く**
   - 「Environment Variables」タブをクリック

### ステップ4: 環境変数を追加

各環境変数を追加します：

1. **「Add New」ボタンをクリック**

2. **キーと値を入力**
   - Key: `VAPID_PUBLIC_KEY`
   - Value: `BBUKrYxJ-USIbUWVeH9bBW67b-a3o0_Sc0MOpVONQ9iy__l5py6HDORYHYlgjV5VxLHAIkbo8KwUHpVi4XmOEj0`
   - Environment: すべての環境にチェック（Production, Preview, Development）

3. **「Save」をクリック**

4. **残り2つの環境変数も同様に追加**
   - `VAPID_PRIVATE_KEY`
   - `VAPID_MAILTO`

### ステップ5: 確認

1. **追加された環境変数を確認**
   - 3つの環境変数が表示されていることを確認

2. **デプロイをトリガー（必要に応じて）**
   - 環境変数を追加すると、自動的に再デプロイがトリガーされる場合があります
   - または、「Deployments」タブから手動で再デプロイを実行

## ✅ 設定完了

環境変数の設定が完了したら、実装を続けることができます。

## 📝 確認チェックリスト

- [ ] VAPID_PUBLIC_KEY が設定されている
- [ ] VAPID_PRIVATE_KEY が設定されている
- [ ] VAPID_MAILTO が設定されている（適切なメールアドレスに変更済み）
- [ ] すべての環境変数で「All Environments」が選択されている
- [ ] 設定が保存されている

## ⚠️ 注意事項

- Private Keyは絶対に公開しないでください
- VAPID_MAILTOは適切なメールアドレスに変更してください
- 環境変数を変更した後、再デプロイが必要な場合があります

