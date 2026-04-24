import Link from "next/link";

import { PageIntro } from "@/components/shared/page-intro";
import { getMyEvents } from "@/lib/data/reviews";

export default async function MyEventsPage() {
  const events = await getMyEvents();

  return (
    <main className="grain min-h-screen py-8">
      <div className="page-shell px-1">
        <PageIntro
          eyebrow="My Events"
          title="我参与的活动"
          description="这里展示你已经加入的活动，以及每场活动当前完成到哪一步。"
        />
        <div className="mt-8 space-y-4">
          {events.length === 0 ? (
            <article className="section-card rounded-[28px] p-6 text-sm leading-7 text-muted">
              你还没有加入任何活动。先在首页或活动列表进入一场活动并提交测评，这里就会自动出现参与记录。
            </article>
          ) : (
            events.map((event) => {
              const content = (
                <article className="section-card rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:border-white/12 hover:bg-[rgba(40,35,31,0.98)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                      {event.statusLabel}
                    </span>
                    <span className="text-xs text-muted sm:text-sm">
                      {event.dateLabel}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">{event.title}</h2>
                      <p className="mt-2 text-sm text-muted">{event.location}</p>
                    </div>
                    <span className="rounded-full bg-white/4 px-3 py-2 text-sm font-medium text-muted-strong">
                      {event.progressLabel}
                    </span>
                  </div>
                </article>
              );

              if (!event.slug) {
                return <div key={event.id}>{content}</div>;
              }

              return (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  {content}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
