import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "小酒馆 Beer Tasting",
  description: "线下啤酒测评活动与品鉴记录应用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
