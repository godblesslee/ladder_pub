import Link from "next/link";

import { WalletStack } from "@/components/home/wallet-stack";
import { formatBeerMetaLine } from "@/lib/beer-display";
import { getPublishedEvents } from "@/lib/data/events";
import { getMyBeerReviews, getMyEvents } from "@/lib/data/reviews";
import { getUser } from "@/lib/supabase/server";

function getEventWalletStyle(index: number) {
  const styles = [
    "bg-[radial-gradient(circle_at_top_left,rgba(241,193,75,0.24),transparent_38%),linear-gradient(180deg,rgba(71,56,41,0.98),rgba(40,31,25,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(203,145,92,0.2),transparent_40%),linear-gradient(180deg,rgba(64,48,40,0.98),rgba(35,28,24,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(181,124,84,0.18),transparent_40%),linear-gradient(180deg,rgba(56,43,37,0.98),rgba(31,25,22,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(165,116,84,0.16),transparent_40%),linear-gradient(180deg,rgba(50,40,35,0.98),rgba(29,24,21,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(148,104,77,0.14),transparent_42%),linear-gradient(180deg,rgba(47,38,34,0.98),rgba(27,23,20,0.98))]",
  ];

  return styles[index % styles.length];
}

function getBeerWalletStyle(index: number) {
  const styles = [
    "bg-[radial-gradient(circle_at_top_left,rgba(241,193,75,0.18),transparent_38%),linear-gradient(180deg,rgba(49,40,35,0.98),rgba(28,23,20,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(214,160,106,0.16),transparent_40%),linear-gradient(180deg,rgba(45,37,33,0.98),rgba(26,22,19,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(192,131,93,0.14),transparent_42%),linear-gradient(180deg,rgba(42,35,31,0.98),rgba(24,21,18,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(172,118,88,0.14),transparent_42%),linear-gradient(180deg,rgba(39,33,30,0.98),rgba(24,20,18,0.98))]",
    "bg-[radial-gradient(circle_at_top_left,rgba(155,107,81,0.12),transparent_42%),linear-gradient(180deg,rgba(37,31,28,0.98),rgba(22,19,17,0.98))]",
  ];

  return styles[index % styles.length];
}
export default async function Home() {
  const user = await getUser();
  const { events } = await getPublishedEvents();
  const myEvents = await getMyEvents(user?.id);
  const myBeers = await getMyBeerReviews(user?.id);
  const upcomingEvents = [...events]
    .sort((a, b) => {
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : 0;
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : 0;

      return bTime - aTime;
    })
    .slice(0, 5);
  const topBeers = [...myBeers]
    .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
    .slice(0, 5);
  const eventCards = upcomingEvents.map((event, index) => ({
    id: event.id,
    href: event.slug ? `/events/${event.slug}` : "/events",
    title: event.title,
    metaAccent: event.date,
    meta: event.location,
    detail: `${event.beerCount} 杯 · ${event.description}`,
    badgeLabel: "Flight",
    badgeValue: `${event.beerCount}杯`,
    ctaLabel: "查看 ›",
    themeClassName: getEventWalletStyle(index),
  }));
  const beerCards = topBeers.map((beer, index) => ({
    id: beer.id,
    href: beer.eventSlug
      ? `/events/${beer.eventSlug}/beers/${beer.eventBeerId}`
      : "/my-beers",
    title: beer.beerName,
    meta: formatBeerMetaLine(beer),
    detail: beer.publicNote || "这一杯已经被你留在高分收藏里。",
    scoreLabel: beer.totalScore ? `${beer.totalScore}/10` : "--/10",
    ctaLabel: "查看 ›",
    themeClassName: getBeerWalletStyle(index),
  }));

  return (
    <main className="grain min-h-screen">
      <section className="page-shell px-1 pb-8 pt-8">
        <div className="rounded-[34px] border border-white/6 bg-[radial-gradient(circle_at_top,rgba(215,163,61,0.18),transparent_42%),linear-gradient(180deg,rgba(56,48,38,0.98),rgba(40,34,29,0.98))] px-6 py-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] text-lg font-semibold text-accent-strong">
                <div className="absolute inset-1 rounded-full bg-[linear-gradient(180deg,#3f372f,#27221d)]" />
                <span className="relative text-xl">E</span>
              </div>
              <div>
                <h1 className="mt-2 text-[2rem] font-semibold leading-tight text-foreground">
                  今晚喝过什么，
                  <br />
                  之后都能说清楚
                </h1>
              </div>
            </div>
            <Link
              href="/admin"
              className="rounded-full border border-[rgba(215,163,61,0.14)] bg-[rgba(255,255,255,0.05)] px-3.5 py-2 text-xs font-medium text-accent-strong transition hover:border-[rgba(215,163,61,0.22)] hover:bg-[rgba(255,255,255,0.08)]"
            >
              进入后台
            </Link>
          </div>

          <p className="mt-6 max-w-xl text-lg leading-9 text-[rgba(245,239,230,0.86)]">
            从活动酒单到逐杯打分，把当下的感受、风味判断和个人偏好整理成一份持续积累的品鉴记录。
          </p>
        </div>

      </section>

      <section className="page-shell px-1">
        <div className="grid grid-cols-2 gap-4">
          <article className="section-card rounded-[28px] px-5 py-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
              参与活动
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold">{myEvents.length}</p>
              <Link href="/my-events" className="text-sm font-semibold text-accent-strong">
                查看
              </Link>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">已参加的品鉴场次</p>
          </article>
          <article className="section-card rounded-[28px] px-5 py-6">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
              品鉴记录
            </p>
            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-4xl font-semibold">{myBeers.length}</p>
              <Link href="/my-beers" className="text-sm font-semibold text-accent-strong">
                查看
              </Link>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted">已完成的测评条目</p>
          </article>
        </div>
      </section>

      {upcomingEvents.length > 0 ? (
        <section className="page-shell px-1 py-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 rounded-full bg-[linear-gradient(90deg,rgba(241,193,75,0.95),rgba(241,193,75,0.18))]" />
                <p className="eyebrow">Recent Events</p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">最近活动</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-accent-strong">
              全部活动
            </Link>
          </div>
          <WalletStack cards={eventCards} revealPx={96} cardHeight={236} />
        </section>
      ) : null}

      {topBeers.length > 0 ? (
        <section className="page-shell px-1 pb-8 pt-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 rounded-full bg-[linear-gradient(90deg,rgba(215,163,61,0.9),rgba(191,125,95,0.22))]" />
                <p className="eyebrow">Top Rated</p>
              </div>
              <h2 className="mt-3 text-2xl font-semibold">我的最爱</h2>
            </div>
            <Link href="/my-beers" className="text-sm font-semibold text-accent-strong">
              全部记录
            </Link>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            你给过最高分的 5 款酒，会一直留在这里。
          </p>
          <WalletStack cards={beerCards} revealPx={92} cardHeight={236} />
        </section>
      ) : null}
    </main>
  );
}
