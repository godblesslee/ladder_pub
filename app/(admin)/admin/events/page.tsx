import Link from "next/link";

import { getAdminEvents } from "@/lib/data/admin";

export default async function AdminEventsPage() {
  const events = await getAdminEvents();

  return (
    <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">活动管理</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            在这里创建、编辑活动，并配置每场活动所使用的酒款与测评模板。
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
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/events/${event.id}`}
            className="grid gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/12 hover:bg-white/[0.05] md:grid-cols-[minmax(0,2fr)_1.1fr_140px]"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-foreground">
                {event.title}
              </p>
              <p className="mt-1 text-sm text-muted">
                {event.startAtLabel} · {event.location ?? "地点待定"}
              </p>
            </div>
            <div className="text-sm text-muted">{event.templateLabel}</div>
            <div className="flex items-center justify-between gap-3 text-sm md:justify-end">
              <span className="whitespace-nowrap text-muted">{event.beerCount} 款</span>
              <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-muted-strong">
                {event.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
