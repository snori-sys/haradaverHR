# Vercel環境変数設定 - 別のアクセス方法

## 🔍 Settingsが見つからない場合

VercelのUIが更新されている場合、Settingsへのアクセス方法が異なることがあります。

## 📋 アクセス方法（複数の方法）

### 方法1: 上部のタブメニューから

1. **プロジェクトページ（Production Deployment）の上部を確認**
   - 「Overview」「Deployments」「Analytics」などのタブがある場合
   - 「Settings」タブをクリック

2. **Settingsタブ内で「Environment Variables」を選択**
   - 左サイドバーまたはメインエリアに「Environment Variables」があるはず

### 方法2: 直接URLでアクセス

以下のURLに直接アクセスしてください：

```
https://vercel.com/cmsbeppin/settings/environment-variables
```

または

```
https://vercel.com/[あなたのアカウント名]/cmsbeppin/settings/environment-variables
```

**プロジェクト名が異なる場合:**
- デプロイURLから推測: `https://cmsbeppin.vercel.app`
- プロジェクト名は通常 `cmsbeppin` です

### 方法3: 検索機能を使用

1. **「F」キーを押す**
   - Quick Navigationが開くはず（画面右下に表示）

2. **「Environment Variables」と検索**
   - または「Settings」と検索

3. **該当項目をクリック**

### 方法4: プロジェクト設定メニューから

1. **プロジェクト名の横にある「...」や設定アイコンを確認**
   - または右上のメニューアイコン

2. **「Settings」または「Project Settings」を選択**

### 方法5: 左サイドバーが折りたたまれている場合

1. **左サイドバーの表示/非表示ボタンを確認**
   - 画面の左端にハンバーガーメニューアイコンがあるかもしれません

2. **クリックしてサイドバーを展開**

## 📋 現在の画面から確認すべきポイント

### 画面の上部を確認

- **タブメニュー**（Overview, Deployments, Analytics, Settings など）
- **設定アイコン**（歯車のアイコン）
- **プロジェクト名の横の「...」メニュー**

### 画面の右上を確認

- **「Deployments」ボタンの近く**
- **アカウントアイコンの近く**
- **その他のメニューアイコン**

### 左サイドバーを確認

- **サイドバーが非表示になっていないか**
- **折りたたまれていないか**

## 🎯 最も簡単な方法

**直接URLでアクセスする方法が最も確実です:**

1. **ブラウザのアドレスバーに以下を入力:**
   ```
   https://vercel.com/cmsbeppin/settings/environment-variables
   ```

2. **Enterキーを押す**

3. **ログインが必要な場合はログイン**

4. **Environment Variablesの設定画面が表示される**

## 📝 それでも見つからない場合

1. **プロジェクト名を確認**
   - デプロイURL: `https://cmsbeppin.vercel.app`
   - プロジェクト名は通常 `cmsbeppin` です
   - 異なる場合は、URLのプロジェクト名部分を変更してください

2. **画面のスクリーンショットを共有**
   - 現在表示されている画面を共有していただければ、より具体的な案内ができます

3. **Vercelのヘルプを確認**
   - https://vercel.com/docs

## ✅ 期待される画面

Environment Variablesの設定画面が表示されると：
- 「Add New」ボタンがある
- 既存の環境変数のリストが表示される（設定済みの場合）
- Key、Value、Environmentの入力欄がある

