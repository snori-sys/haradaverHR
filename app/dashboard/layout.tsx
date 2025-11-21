import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "ダッシュボード - ポイントカード",
  description: "あなたのポイント残高と来店履歴を確認できます",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

