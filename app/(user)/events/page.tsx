import { EventCard } from "@/components/events/event-card";
import { PageIntro } from "@/components/shared/page-intro";
import { SourceBadge } from "@/components/shared/source-badge";
import { getPublishedEvents } from "@/lib/data/events";

export default async function EventsPage() {
  const { events, source } = await getPublishedEvents();

  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="Events"
          title="活动列表"
          description="这里将承接已上线活动、未来活动和活动详情入口。当前先用静态内容占位，后续接数据库。"
        />
        <div className="mt-8">
          <SourceBadge source={source} />
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
