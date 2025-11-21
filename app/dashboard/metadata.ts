import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ダッシュボード - ポイントカード",
  description: "あなたのポイント残高と来店履歴を確認できます",
  manifest: "/manifest.json",
  themeColor: "#000000",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ポイントカード",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

