# PWA設定完了ガイド

## 完了した設定

1. **next-pwaの設定**
   - `next.config.js`にnext-pwaを統合
   - 開発環境ではPWAを無効化（本番環境のみ有効）

2. **manifest.jsonの作成**
   - `public/manifest.json`を作成
   - アプリ名、アイコン、テーマカラーを設定

3. **メタデータの設定**
   - `app/layout.tsx`と`app/dashboard/layout.tsx`にPWAメタデータを追加
   - テーマカラー、Apple Web App設定を追加

## 必要なアイコンファイル

以下のアイコンファイルを`public/`ディレクトリに配置してください：

- `icon-192.png` - 192x192ピクセルのアイコン
- `icon-512.png` - 512x512ピクセルのアイコン

### アイコンの作成方法

1. オンラインツールを使用
   - https://www.favicon-generator.org/
   - https://realfavicongenerator.net/

2. 画像編集ソフトを使用
   - Photoshop、GIMP、Figma等で正方形の画像を作成
   - 192x192と512x512の2つのサイズで保存

## 動作確認

### 開発環境

1. 開発サーバーを起動
   ```bash
   npm run dev
   ```

2. ブラウザでアクセス
   - `http://localhost:3000`
   - Chrome DevToolsのApplicationタブでmanifestを確認

### 本番環境

1. ビルド
   ```bash
   npm run build
   ```

2. Service Workerが生成されることを確認
   - `public/sw.js`が生成される
   - `public/workbox-*.js`が生成される

3. HTTPSでアクセス
   - PWAのインストールにはHTTPSが必要（localhost除く）
   - Vercelなどのホスティングサービスを使用

## PWAのインストール

### Chrome/Edge (デスクトップ)
1. アドレスバーに「インストール」アイコンが表示される
2. クリックしてインストール

### Chrome/Edge (モバイル)
1. メニューから「ホーム画面に追加」を選択

### Safari (iOS)
1. 共有ボタン → 「ホーム画面に追加」

### Firefox
1. アドレスバーのアイコンから「インストール」

## トラブルシューティング

### Service Workerが登録されない
- `next.config.js`でPWAが有効になっているか確認
- 本番環境では`disable: false`に設定
- ブラウザのコンソールでエラーを確認

### アイコンが表示されない
- `public/manifest.json`のパスが正しいか確認
- アイコンファイルが`public/`ディレクトリに存在するか確認
- ファイルの形式がPNGで、サイズが正しいか確認

### オフラインで動作しない
- Service Workerが正しく登録されているか確認
- Networkタブでリソースのキャッシュを確認
- next-pwaの設定を確認

## 参考資料

- [next-pwa公式ドキュメント](https://github.com/shadowwalker/next-pwa)
- [Web App Manifest](https://developer.mozilla.org/ja/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/ja/docs/Web/API/Service_Worker_API)

