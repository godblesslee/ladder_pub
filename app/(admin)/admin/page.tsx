import Link from "next/link";

import { AdminOverviewCards } from "@/components/admin/admin-overview-cards";
import { getAdminDashboardData, getAdminEvents } from "@/lib/data/admin";

export default async function AdminPage() {
  const [dashboard, events] = await Promise.all([
    getAdminDashboardData(),
    getAdminEvents(),
  ]);

  return (
    <div className="space-y-6">
      <AdminOverviewCards {...dashboard} />

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">最近活动</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              直接进入编辑页，继续维护时间地点、模板和本场酒款。
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
          >
            新建活动
          </Link>
        </div>

        <div className="mt-6 space-y-3">
          {events.slice(0, 5).map((event) => (
            <Link
              key={event.id}
              href={`/admin/events/${event.id}`}
              className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/12 hover:bg-white/[0.05]"
            >
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-foreground">
                  {event.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {event.startAtLabel} · {event.location ?? "地点待定"} · {event.beerCount} 款酒
                </p>
              </div>
              <span className="rounded-full bg-white/[0.05] px-3 py-2 text-xs text-muted-strong">
                {event.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
