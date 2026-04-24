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
          description="移动端优先展示最近可参与的场次，当前主推 5 月 1 日啤酒入门评测活动。"
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
