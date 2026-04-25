import Link from "next/link";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grain min-h-screen py-10">
      <div className="page-shell space-y-6">
        <div className="section-card rounded-[30px] px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Organizer Console</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                小酒馆后台
              </h1>
              <p className="mt-2 text-sm leading-7 text-muted">
                先把活动、酒款和活动酒单管理链路搭起来，组织者可以直接在这里维护内容。
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm text-muted-strong transition hover:border-white/12 hover:text-foreground"
            >
              返回前台
            </Link>
          </div>

          <AdminTabs />
        </div>

        {children}
      </div>
    </main>
  );
}
