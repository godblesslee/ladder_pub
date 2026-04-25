import { EventCard } from "@/components/events/event-card";
import { PageIntro } from "@/components/shared/page-intro";
import { getPublishedEvents } from "@/lib/data/events";

export default async function EventsPage() {
  const { events } = await getPublishedEvents();

  return (
    <main className="grain min-h-screen py-8">
      <div className="page-shell px-1">
        <PageIntro
          eyebrow="Events"
          title="活动列表"
          description="查看当前可参与的场次，按活动进入具体酒单和测评入口。"
        />
        <div className="mt-8 grid gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </main>
  );
}
