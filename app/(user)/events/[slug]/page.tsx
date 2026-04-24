import Link from "next/link";
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

        {event.theme || event.audience || event.schedule || event.sourceNote ? (
          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            {event.theme ? (
              <article className="section-card rounded-[24px] p-5">
                <p className="text-sm font-semibold text-accent">活动主题</p>
                <p className="mt-2 text-sm leading-7 text-muted">{event.theme}</p>
              </article>
            ) : null}
            {event.audience ? (
              <article className="section-card rounded-[24px] p-5">
                <p className="text-sm font-semibold text-accent">适合谁来</p>
                <p className="mt-2 text-sm leading-7 text-muted">{event.audience}</p>
              </article>
            ) : null}
            {event.schedule ? (
              <article className="section-card rounded-[24px] p-5">
                <p className="text-sm font-semibold text-accent">现场节奏</p>
                <p className="mt-2 text-sm leading-7 text-muted">{event.schedule}</p>
              </article>
            ) : null}
            {event.sourceNote ? (
              <article className="section-card rounded-[24px] p-5">
                <p className="text-sm font-semibold text-accent">资料备注</p>
                <p className="mt-2 text-sm leading-7 text-muted">{event.sourceNote}</p>
              </article>
            ) : null}
          </section>
        ) : null}

        <section className="mt-10 section-card rounded-[24px] p-5 sm:rounded-[30px] sm:p-7">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">本场酒款</h2>
              <p className="mt-2 text-sm text-muted">
                移动端先按出杯顺序浏览，再逐杯进入评测。
              </p>
            </div>
            <div className="rounded-2xl bg-surface-strong px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-muted">
                Flight
              </p>
              <p className="mt-1 text-xl font-semibold text-accent">
                {event.beers.length} 杯
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {event.beers.map((beer) => (
              <Link
                key={beer.id}
                href={`/events/${event.slug}/beers/${beer.id}`}
                className="block rounded-[22px] border border-border bg-white/70 p-4 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(94,67,39,0.1)] sm:rounded-[24px] sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-accent">
                      第 {beer.servingOrder ?? "-"} 杯
                    </p>
                    <h3 className="mt-2 text-lg font-semibold sm:text-xl">
                      {beer.productName}
                    </h3>
                    <p className="mt-2 text-sm text-muted">
                      {beer.breweryName} · {beer.styleName}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted sm:block">
                    {beer.abv ? <p>ABV {beer.abv}%</p> : null}
                    {beer.volumeMl ? <p>{beer.volumeMl}ml</p> : null}
                  </div>
                </div>
                {beer.notes ? (
                  <p className="mt-4 text-sm leading-7 text-muted">{beer.notes}</p>
                ) : null}
                <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-4 text-sm font-semibold text-accent">
                  <span>进入这杯的评测</span>
                  <span>开始</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
