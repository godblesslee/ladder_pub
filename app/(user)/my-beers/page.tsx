import Link from "next/link";

import { PageIntro } from "@/components/shared/page-intro";
import { getMyBeerReviews } from "@/lib/data/reviews";

export default async function MyBeersPage() {
  const reviews = await getMyBeerReviews();

  return (
    <main className="grain min-h-screen py-8">
      <div className="page-shell px-1">
        <PageIntro
          eyebrow="My Beers"
          title="我测评过的酒"
          description="这里展示你已经提交过的测评记录，再次进入时会以历史记录方式查看。"
        />
        <div className="mt-8 space-y-4">
          {reviews.length === 0 ? (
            <article className="section-card rounded-[28px] p-6 text-sm leading-7 text-muted">
              你还没有已提交的测评记录。先从活动页进入任意一杯酒，保存 demo 测评后，这里就会自动出现。
            </article>
          ) : (
            reviews.map((review) => {
              const content = (
                <article className="section-card rounded-[28px] p-5 transition hover:-translate-y-0.5 hover:border-white/12 hover:bg-[rgba(40,35,31,0.98)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-strong">
                      {review.statusLabel}
                    </span>
                    <span className="text-xs text-muted sm:text-sm">
                      {review.submittedAtLabel}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold">{review.beerName}</h2>
                      <p className="mt-2 text-sm text-muted">
                        {review.breweryName} · {review.styleName}
                      </p>
                      <p className="mt-2 text-sm text-muted">
                        所属活动：{review.eventTitle}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-muted">
                        {review.publicNote || "这条记录还没有填写公开评论。"}
                      </p>
                    </div>

                    <div className="shrink-0 rounded-[22px] bg-accent-soft px-4 py-3 text-center">
                      <p className="text-xs uppercase tracking-[0.2em] text-accent-strong/70">
                        Score
                      </p>
                      <p className="mt-1 text-2xl font-semibold text-accent-strong">
                        {review.totalScore ?? "--"}
                      </p>
                    </div>
                  </div>

                  {review.eventSlug ? (
                    <div className="mt-4 flex items-center justify-between border-t border-border/80 pt-4 text-sm font-semibold text-accent-strong">
                      <span>查看这杯历史记录</span>
                      <span>›</span>
                    </div>
                  ) : null}
                </article>
              );

              if (!review.eventSlug) {
                return <div key={review.id}>{content}</div>;
              }

              return (
                <Link
                  key={review.id}
                  href={`/events/${review.eventSlug}/beers/${review.eventBeerId}`}
                >
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
