import type { EventListItem } from "@/lib/data/events";

type EventCardProps = {
  event: EventListItem;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="section-card rounded-[28px] p-6">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-accent">
          {event.status}
        </span>
        <span className="text-sm text-muted">{event.date}</span>
      </div>
      <h2 className="mt-5 text-2xl font-semibold text-foreground">
        {event.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-muted">{event.description}</p>
      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <span>{event.location}</span>
        <span>{event.beerCount} 款酒</span>
      </div>
    </article>
  );
}
