import Link from "next/link";

import { EventCard } from "@/components/events/event-card";
import { SourceBadge } from "@/components/shared/source-badge";
import { getPublishedEvents } from "@/lib/data/events";
import { getMyBeerReviews, getMyEvents } from "@/lib/data/reviews";

export default async function Home() {
  const { events, source } = await getPublishedEvents();
  const myEvents = await getMyEvents();
  const myBeers = await getMyBeerReviews();
  const featuredEvent = events[0] ?? null;
  const latestReview = myBeers[0] ?? null;

  return (
    <main className="grain min-h-screen">
      <section className="page-shell px-1 pb-8 pt-8">
        <div className="rounded-[34px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(215,163,61,0.18),transparent_42%),linear-gradient(180deg,rgba(56,48,38,0.98),rgba(40,34,29,0.98))] px-6 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] text-lg font-semibold text-accent-strong">
              <div className="absolute inset-1 rounded-full bg-[linear-gradient(180deg,#3f372f,#27221d)]" />
              <span className="relative text-xl">E</span>
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.18em] text-accent-strong/90">
                HELLO, ERIC
              </p>
              <h1 className="mt-2 text-[2rem] font-semibold leading-tight text-foreground">
                啤酒测评
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-xl text-lg leading-9 text-[rgba(245,239,230,0.86)]">
            在这里发布酒款、收集评分，并查看最新测评结果。
          </p>

          <div className="mt-7 flex items-center gap-3 rounded-[22px] border border-white/6 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-base text-muted">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-muted">
              <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
              <path
                d="M16 16L20 20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <span>搜索活动、酒款或历史记录</span>
          </div>
        </div>

        <div className="mt-5">
          <SourceBadge
            source={source}
            fallbackLabel="当前部分内容仍可能来自本地示例数据，但用户操作链路已经可以直接测试。"
          />
        </div>
      </section>

      <section className="page-shell px-1">
        <div className="grid grid-cols-2 gap-4">
          <article className="section-card rounded-[28px] px-5 py-6">
            <p className="text-sm text-muted">我参加的活动</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold">{myEvents.length}</p>
              <Link href="/my-events" className="text-sm font-semibold text-accent-strong">
                查看
              </Link>
            </div>
          </article>
          <article className="section-card rounded-[28px] px-5 py-6">
            <p className="text-sm text-muted">我评测过的酒</p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold">{myBeers.length}</p>
              <Link href="/my-beers" className="text-sm font-semibold text-accent-strong">
                查看
              </Link>
            </div>
          </article>
        </div>
      </section>

      {featuredEvent ? (
        <section className="page-shell px-1 py-6">
          <div className="section-card rounded-[30px] p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="eyebrow">Featured Event</p>
                <h2 className="mt-3 text-2xl font-semibold">{featuredEvent.title}</h2>
              </div>
              <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                {featuredEvent.status}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">{featuredEvent.description}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm text-muted">
              <span className="rounded-full bg-white/4 px-3 py-2">
                {featuredEvent.date}
              </span>
              <span className="rounded-full bg-white/4 px-3 py-2">
                {featuredEvent.location}
              </span>
              <span className="rounded-full bg-white/4 px-3 py-2">
                {featuredEvent.beerCount} 杯
              </span>
            </div>
            {featuredEvent.slug ? (
              <div className="mt-5">
                <Link
                  href={`/events/${featuredEvent.slug}`}
                  className="inline-flex items-center rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-5 py-3 text-sm font-semibold text-[#2b2114] shadow-[0_12px_30px_rgba(215,163,61,0.28)]"
                >
                  进入当前主活动
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {latestReview ? (
        <section className="page-shell px-1 pb-6">
          <div className="section-card rounded-[30px] p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Latest Review</p>
                <h2 className="mt-3 text-2xl font-semibold">{latestReview.beerName}</h2>
                <p className="mt-2 text-sm text-muted">
                  {latestReview.breweryName} · {latestReview.eventTitle}
                </p>
              </div>
              <div className="rounded-[20px] bg-accent-soft px-4 py-3 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-strong/70">
                  Score
                </p>
                <p className="mt-1 text-2xl font-semibold text-accent-strong">
                  {latestReview.totalScore ?? "--"}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              {latestReview.publicNote || "这条记录还没有填写公开评论。"}
            </p>
            {latestReview.eventSlug ? (
              <div className="mt-4">
                <Link
                  href={`/events/${latestReview.eventSlug}/beers/${latestReview.eventBeerId}`}
                  className="inline-flex items-center rounded-full border border-white/10 bg-white/4 px-5 py-3 text-sm font-semibold text-foreground"
                >
                  查看历史记录
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="page-shell px-1 pb-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Open Tasting</p>
            <h2 className="mt-2 text-2xl font-semibold">当前开放酒款</h2>
          </div>
          <Link href="/events" className="text-sm font-semibold text-accent-strong">
            全部活动
          </Link>
        </div>
        <div className="mt-5 grid gap-4">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
}
