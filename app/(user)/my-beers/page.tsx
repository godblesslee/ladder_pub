import { PageIntro } from "@/components/shared/page-intro";

const reviewedBeers = [
  { name: "West Coast IPA", brewery: "Misty Range", score: 9.2, note: "松针、树脂、收口干净" },
  { name: "Dubbel", brewery: "Abbey House", score: 8.7, note: "黑糖、无花果、酒精融合度好" },
  { name: "Pils", brewery: "North Ferry", score: 8.1, note: "清爽，苦度克制，适合回杯" },
];

export default function MyBeersPage() {
  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="My Beers"
          title="我测评过的酒"
          description="最终这里会支持按总评分排序、按酒款聚合和按测评记录切换查看。"
        />
        <div className="mt-8 space-y-4">
          {reviewedBeers.map((beer) => (
            <article
              key={beer.name}
              className="section-card rounded-[24px] p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{beer.name}</h2>
                  <p className="mt-2 text-sm text-muted">{beer.brewery}</p>
                  <p className="mt-3 text-sm leading-7 text-muted">{beer.note}</p>
                </div>
                <div className="rounded-2xl bg-accent px-4 py-3 text-center text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/75">
                    Score
                  </p>
                  <p className="mt-1 text-2xl font-semibold">{beer.score}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
