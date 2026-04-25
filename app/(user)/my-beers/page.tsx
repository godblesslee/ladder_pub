import { MyBeersTable } from "@/components/beers/my-beers-table";
import { PageIntro } from "@/components/shared/page-intro";
import { getMyBeerReviews } from "@/lib/data/reviews";

export default async function MyBeersPage() {
  const reviews = await getMyBeerReviews();

  return (
    <main className="grain min-h-screen py-8">
      <div className="page-shell px-1">
        <PageIntro
          eyebrow="My Beers"
          title="酒款记录"
          description="查看所有测评酒款，并按厂牌、种类、评分和我的最爱筛选。"
        />
        <div className="mt-8">
          {reviews.length === 0 ? (
            <article className="section-card rounded-[28px] p-6 text-sm leading-7 text-muted">
              你还没有已提交的测评记录。先从活动页进入任意一杯酒，保存测评后，这里就会自动出现。
            </article>
          ) : (
            <MyBeersTable reviews={reviews} />
          )}
        </div>
      </div>
    </main>
  );
}
