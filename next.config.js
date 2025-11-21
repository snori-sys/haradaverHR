const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // 開発環境ではPWAを無効化
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

