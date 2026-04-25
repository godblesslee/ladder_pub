import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "小酒馆 Beer Tasting",
  description: "线下啤酒测评活动与品鉴记录应用",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  return (
    <html
      lang="zh-CN"
      className="h-full antialiased"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider initialUser={user}>{children}</AuthProvider>
      </body>
    </html>
  );
}
