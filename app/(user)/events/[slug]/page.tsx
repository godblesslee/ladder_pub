import { notFound } from "next/navigation";

import { PageIntro } from "@/components/shared/page-intro";
import { SourceBadge } from "@/components/shared/source-badge";
import { getEventBySlug } from "@/lib/data/events";

type EventDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;
  const { event, source } = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="Event Detail"
          title={event.title}
          description={event.description}
        />

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
          <span className="rounded-full bg-white/80 px-4 py-2">{event.date}</span>
          <span className="rounded-full bg-white/80 px-4 py-2">
            {event.location}
          </span>
          <span className="rounded-full bg-surface-strong px-4 py-2 text-accent">
            {event.status}
          </span>
        </div>

        <div className="mt-8">
          <SourceBadge
            source={source}
            fallbackLabel="当前活动详情使用本地示例数据；远程表有完整数据后会自动切换。"
          />
        </div>

        <section className="mt-10 section-card rounded-[30px] p-7">
          <h2 className="text-2xl font-semibold">本场酒款</h2>
          <div className="mt-6 space-y-4">
            {event.beers.map((beer) => (
              <article
                key={beer.id}
                className="rounded-[24px] border border-border bg-white/70 p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent">
                      第 {beer.servingOrder ?? "-"} 杯
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">
                      {beer.productName}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {beer.breweryName} · {beer.styleName}
                    </p>
                  </div>
                  <div className="text-sm text-muted">
                    {beer.abv ? <p>ABV {beer.abv}%</p> : null}
                    {beer.volumeMl ? <p>{beer.volumeMl}ml</p> : null}
                  </div>
                </div>
                {beer.notes ? (
                  <p className="mt-4 text-sm leading-7 text-muted">{beer.notes}</p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
