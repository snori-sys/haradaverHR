# VAPIDキー情報

## 🔑 生成されたVAPIDキー

**⚠️ 重要: これらのキーは秘密情報です。GitHubに公開しないでください！**

### Public Key（公開キー）
```
BBUKrYxJ-USIbUWVeH9bBW67b-a3o0_Sc0MOpVONQ9iy__l5py6HDORYHYlgjV5VxLHAIkbo8KwUHpVi4XmOEj0
```

### Private Key（秘密キー）
```
uhvF8h2djTyKfCh0Hm8XrvGbhMCmimImg-paf44D_Ec
```

### Mailto（連絡先メールアドレス）
```
admin@example.com
```
※ 適切なメールアドレスに変更してください

## 📋 環境変数の設定

以下の環境変数をVercelで設定してください：

1. **Vercelダッシュボードにアクセス**
   - https://vercel.com/dashboard
   - `cmsbeppin` プロジェクトを選択

2. **Settings → Environment Variablesを開く**

3. **以下の環境変数を追加**:
   - `VAPID_PUBLIC_KEY` = `BBUKrYxJ-USIbUWVeH9bBW67b-a3o0_Sc0MOpVONQ9iy__l5py6HDORYHYlgjV5VxLHAIkbo8KwUHpVi4XmOEj0`
   - `VAPID_PRIVATE_KEY` = `uhvF8h2djTyKfCh0Hm8XrvGbhMCmimImg-paf44D_Ec`
   - `VAPID_MAILTO` = `admin@example.com`（適切なメールアドレスに変更）

4. **すべての環境変数で「All Environments」を選択**

5. **設定を保存**

## ⚠️ 注意事項

- Private Keyは絶対に公開しないでください
- これらのキーは`.gitignore`に含まれています（`.env.local`に保存）
- 本番環境では、Vercelの環境変数として設定してください

