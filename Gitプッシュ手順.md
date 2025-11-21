# Gitプッシュ手順

## 📋 手順

### ステップ1: 現在の状態を確認

まず、Gitリポジトリの状態を確認します。

### ステップ2: すべてのファイルを追加

変更されたファイルをすべて追加します。

### ステップ3: コミット

変更をコミットします。

### ステップ4: リモートリポジトリを確認

リモートリポジトリが設定されているか確認します。

### ステップ5: プッシュ

コードをリモートリポジトリにプッシュします。

## 🚀 実行手順

以下のコマンドを順番に実行します：

```bash
# 1. プロジェクトディレクトリに移動
cd /Users/sawashimanoriyuki/point-card-pwa

# 2. 現在の状態を確認
git status

# 3. すべてのファイルを追加
git add .

# 4. コミット
git commit -m "Initial commit for production"

# 5. リモートリポジトリを確認
git remote -v

# 6. プッシュ（既存のリモートがある場合）
git push
```

## ⚠️ リモートリポジトリが設定されていない場合

リモートリポジトリが設定されていない場合、以下の手順で設定します：

### ステップ1: GitHubでリポジトリを作成

1. **GitHubにアクセス**: https://github.com/new
2. **Repository name**: `point-card-pwa`（任意）
3. **Public または Private** を選択
4. **「Create repository」をクリック**

### ステップ2: リモートリポジトリを追加

```bash
# GitHubリポジトリのURLを使用（リポジトリURLを置き換えてください）
git remote add origin https://github.com/your-username/point-card-pwa.git

# または、SSHを使用する場合
git remote add origin git@github.com:your-username/point-card-pwa.git
```

### ステップ3: プッシュ

```bash
# メインブランチにプッシュ
git push -u origin main

# または、masterブランチの場合
git push -u origin master
```

## 📋 実行後の確認

プッシュが成功したら：

1. ✅ **GitHubでリポジトリを確認**
   - https://github.com/your-username/point-card-pwa
   - すべてのファイルが表示されていることを確認

2. ✅ **Vercelでリポジトリをインポート**
   - https://vercel.com/new
   - 「Import Git Repository」セクションでリポジトリを選択
   - 「Import」ボタンをクリック

3. ✅ **環境変数を設定**
   - 5つの環境変数を追加

4. ✅ **デプロイ**
   - 「Deploy」ボタンをクリック

## 🎉 完了

コードをプッシュしたら、Vercelでリポジトリをインポートしてデプロイできます！

