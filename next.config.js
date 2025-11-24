const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発環境ではPWAを無効化
  buildExcludes: [/middleware-manifest\.json$/],
  sw: 'sw.js', // Service Workerファイル名を明示的に指定
  // カスタムService Workerを使用（プッシュ通知機能を含む）
  swSrc: './public/sw.js', // public/sw.jsをソースとして使用
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'supabase-cache',
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopackの設定を追加（Next.js 16対応）
  webpack: (config, { isServer }) => {
    return config
  },
  // Turbopack設定（Next.js 16ではデフォルトで有効）
  turbopack: {},
}

module.exports = withPWA(nextConfig)

