# ポイントカードPWA プロジェクト

顧客向けのポイントカードアプリ兼来店履歴を表示するPWAと、その管理画面を構築するプロジェクトです。

## 📋 目次

- [概要](#概要)
- [機能一覧](#機能一覧)
- [技術スタック](#技術スタック)
- [セットアップ](#セットアップ)
- [環境変数](#環境変数)
- [データベースセットアップ](#データベースセットアップ)
- [開発サーバーの起動](#開発サーバーの起動)

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

- 顧客登録・ログイン
- ダッシュボード（ポイント残高、来店履歴、取引履歴）
- ポイント利用機能

### 管理画面

- 管理者ログイン
- 来店履歴管理
- キャスト管理
- アラート管理
- マスタ設定

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Supabase** (PostgreSQL)
- **PWA** (next-pwa)

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local`ファイルを作成：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
```

### 3. データベースセットアップ

1. Supabaseダッシュボードにログイン
2. SQL Editorを開く
3. `supabase/point-card-schema.sql`の内容を実行

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` にアクセス

## 詳細ドキュメント

- `POINT_CARD_PWA_README.md` - プロジェクト全体の概要
- `POINT_CARD_PWA_DESIGN.md` - 設計ドキュメント
- `POINT_CARD_PWA_QUICK_START.md` - クイックスタートガイド
- `動作テストガイド.md` - 動作テスト手順
