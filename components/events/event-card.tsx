import Link from "next/link";

import type { EventListItem } from "@/lib/data/events";

type EventCardProps = {
  event: EventListItem;
};

export function EventCard({ event }: EventCardProps) {
  const content = (
    <article className="section-card rounded-[24px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(94,67,39,0.12)] sm:rounded-[28px] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-accent">
          {event.status}
        </span>
        <span className="text-xs text-muted sm:text-sm">{event.date}</span>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-foreground sm:mt-5 sm:text-2xl">
        {event.title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted sm:leading-7">
        {event.description}
      </p>
      <div className="mt-5 flex items-center justify-between text-sm text-muted sm:mt-6">
        <span className="truncate pr-4">{event.location}</span>
        <span className="shrink-0">{event.beerCount} 款酒</span>
      </div>
      {event.slug ? (
        <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-4 text-sm font-semibold text-accent">
          <span>移动端活动入口</span>
          <span>进入</span>
        </div>
      ) : null}
    </article>
  );

  if (!event.slug) {
    return content;
  }

  return <Link href={`/events/${event.slug}`}>{content}</Link>;
}
