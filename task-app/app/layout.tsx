import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "タスク管理アプリ",
  description: "SupabaseとNext.jsで作られたタスク管理アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
