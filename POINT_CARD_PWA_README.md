# ポイントカードPWA プロジェクト

顧客向けのポイントカードアプリ兼来店履歴を表示するPWAと、その管理画面を構築するプロジェクトです。

## 📋 目次

- [概要](#概要)
- [機能一覧](#機能一覧)
- [技術スタック](#技術スタック)
- [ドキュメント](#ドキュメント)
- [クイックスタート](#クイックスタート)
- [プロジェクト構造](#プロジェクト構造)

## 概要

このプロジェクトは、顧客が来店履歴を確認し、ポイントを管理できるPWAアプリと、店舗スタッフが顧客情報や来店履歴を管理できる管理画面で構成されています。

### 主な特徴

- 📱 PWA対応（オフライン動作、インストール可能）
- 🔐 電話番号とパスワードによる認証
- 💰 利用金額に応じたポイント還元（還元率は設定可能）
- 📊 来店履歴とポイント取引履歴の表示
- 👥 キャスト別稼働実績の管理
- 🔔 初回来店のみ顧客のアラート機能

## 機能一覧

### 顧客向けPWA

#### 認証
- [x] 顧客登録（電話番号、パスワード、名前、メールアドレス）
- [x] ログイン（電話番号、パスワード）
- [x] パスワードリセット（将来実装）

#### ダッシュボード
- [x] 現在のポイント残高表示
- [x] 累計獲得ポイント表示
- [x] 累計使用ポイント表示
- [x] 次回利用可能ポイント表示（500ポイント刻み）

#### 来店履歴
- [x] 来店日時の表示
- [x] 利用金額の表示
- [x] 付与ポイントの表示
- [x] 使用ポイントの表示
- [x] キャスト名の表示
- [x] サービス種別の表示（フリー、ネット指名、場内指名、本指名）

#### ポイント取引履歴
- [x] 取引日時の表示
- [x] 取引種別の表示（付与/消費）
- [x] ポイント数の表示
- [x] 取引後の残高表示
- [x] 説明の表示

#### ポイント利用
- [x] 500ポイント以上で利用可能
- [x] 500ポイント刻みで利用
- [x] 利用可能ポイント数の表示
- [x] 利用確認ダイアログ

### 管理画面

#### 認証
- [x] 管理者ログイン（メールアドレス、パスワード）

#### ダッシュボード
- [x] 本日の来店数
- [x] 本日の売上
- [x] 本日のポイント付与総数
- [x] アクティブ顧客数

#### 顧客管理
- [x] 顧客一覧（検索、フィルタ）
- [x] 顧客詳細（来店履歴、ポイント取引履歴）
- [x] 顧客編集

#### 来店履歴管理
- [x] 来店履歴一覧
- [x] 来店履歴登録
- [x] 来店履歴編集
- [x] 来店履歴詳細
- [x] ポイント自動計算・付与

#### キャスト管理
- [x] キャスト一覧
- [x] キャスト登録・編集
- [x] キャスト別稼働実績
  - [x] 出勤日数
  - [x] 接客本数（フリー、ネット指名、場内指名、本指名）
  - [x] 本指名への転換率（フリー→本指名、ネット指名→本指名、場内指名→本指名）

#### アラート管理
- [x] アラート一覧
- [x] 初回来店のみ顧客のアラート（3か月経過）
- [x] アラート解決機能
- [x] メール通知設定（将来実装）

#### マスタ設定
- [x] ポイント還元率の設定
- [x] ポイント利用最小値・単位の設定
- [x] アラートメールアドレスの設定
- [x] アラート日数の設定

## 技術スタック

### フロントエンド
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod
- **PWA**: next-pwa

### バックエンド
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **API**: Next.js API Routes

### インフラ
- **Hosting**: Vercel
- **Database**: Supabase
- **Storage**: Supabase Storage (将来拡張用)

## ドキュメント

このプロジェクトには以下のドキュメントが含まれています：

1. **POINT_CARD_PWA_DESIGN.md** - 設計ドキュメント
   - データベーススキーマ設計
   - API設計
   - 機能仕様

2. **POINT_CARD_PWA_PROMPT.md** - Cursor用プロンプト集
   - 各機能の実装プロンプト
   - 段階的な実装手順

3. **POINT_CARD_PWA_IMPLEMENTATION_GUIDE.md** - 実装ガイド
   - 詳細な実装手順
   - よくある問題と解決方法
   - セキュリティチェックリスト

4. **POINT_CARD_PWA_QUICK_START.md** - クイックスタートガイド
   - すぐに始められる手順
   - 各ステップのプロンプト

5. **supabase/point-card-schema.sql** - データベーススキーマ
   - テーブル定義
   - インデックス
   - RLSポリシー
   - トリガー

## クイックスタート

### 1. 前提条件

- Node.js 18以上
- Supabaseプロジェクト
- 既存のNext.jsプロジェクト

### 2. インストール

```bash
# 必要なパッケージのインストール
npm install bcryptjs jsonwebtoken next-pwa
npm install --save-dev @types/bcryptjs @types/jsonwebtoken
```

### 3. データベースセットアップ

1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `supabase/point-card-schema.sql`の内容を実行

**重要**: 
- スキーマには開発用のRLSポリシー（すべてのアクセスを許可）が含まれています
- 本番環境では適切な認証方式を選択し、RLSポリシーを更新してください
- 詳細は`POINT_CARD_PWA_IMPLEMENTATION_GUIDE.md`の「よくある問題と解決方法」を参照してください

### 4. 環境変数の設定

`.env.local`ファイルに以下を追加：

```env
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT認証設定（独自のJWT認証を使用する場合）
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

**注意**: 
- `SUPABASE_SERVICE_ROLE_KEY`はサーバー側でのみ使用し、クライアント側に公開しないでください
- `JWT_SECRET`は推測困難なランダムな文字列を使用してください（最低32文字推奨）

### 5. 実装開始

`POINT_CARD_PWA_QUICK_START.md`を参照して、Cursorで段階的に実装してください。

## プロジェクト構造

```
/
├── app/
│   ├── (customer)/              # 顧客向けページ
│   │   ├── register/            # 登録ページ
│   │   ├── login/               # ログインページ
│   │   └── dashboard/           # ダッシュボード
│   ├── admin/                   # 管理画面
│   │   ├── login/               # 管理者ログイン
│   │   ├── customers/           # 顧客管理
│   │   ├── visits/              # 来店履歴管理
│   │   ├── casts/               # キャスト管理
│   │   ├── alerts/              # アラート管理
│   │   └── settings/            # マスタ設定
│   └── api/
│       ├── customers/           # 顧客API
│       ├── admin/               # 管理画面API
│       └── ...
├── components/
│   ├── customer/                # 顧客向けコンポーネント
│   └── admin/                  # 管理画面コンポーネント
├── lib/
│   ├── supabase/               # Supabaseクライアント
│   ├── points.ts               # ポイント計算ロジック
│   ├── alerts.ts               # アラート検出ロジック
│   └── cast-performance.ts    # 稼働実績計算ロジック
├── supabase/
│   └── point-card-schema.sql  # データベーススキーマ
└── public/
    ├── manifest.json           # PWAマニフェスト
    └── icon-*.png             # PWAアイコン
```

## 開発フロー

1. **設計確認**: `POINT_CARD_PWA_DESIGN.md`で全体設計を確認
2. **プロンプト選択**: `POINT_CARD_PWA_PROMPT.md`から必要なプロンプトを選択
3. **実装**: Cursorでプロンプトを実行して実装
4. **テスト**: 各機能をテスト
5. **デプロイ**: Vercelにデプロイ

## セキュリティ

### 認証方式

このプロジェクトでは、独自のJWT認証方式を推奨しています：

- **パスワード**: bcryptjsでハッシュ化（salt rounds: 10以上推奨）
- **認証**: JWTトークンによる認証（jsonwebtokenを使用）
- **データベースアクセス**: サービスロールキーを使用（サーバー側でのみ）
- **認証チェック**: APIレベルで実装
- **RLSポリシー**: 開発環境ではすべて許可、本番環境では適切に設定

### セキュリティ対策

- パスワードはbcryptでハッシュ化
- JWTトークンの有効期限設定（通常1-24時間）
- リフレッシュトークンの実装（推奨）
- HTTPS必須（本番環境）
- 入力値のバリデーション（Zod等を使用）
- SQLインジェクション対策（パラメータ化クエリ）
- XSS対策（Reactの自動エスケープ）
- CSRF対策（SameSite Cookie）
- レート制限の実装（APIエンドポイント）

**重要**: 
- サービスロールキーはサーバー側でのみ使用し、クライアント側に公開しないでください
- 本番環境では適切なRLSポリシーを設定してください
- 詳細は`POINT_CARD_PWA_IMPLEMENTATION_GUIDE.md`のセキュリティチェックリストを参照してください

## ライセンス

このプロジェクトはプライベートプロジェクトです。

## サポート

問題が発生した場合：

1. `POINT_CARD_PWA_IMPLEMENTATION_GUIDE.md`の「よくある問題と解決方法」を確認
2. 各ドキュメントを参照
3. 必要に応じて開発チームに相談

