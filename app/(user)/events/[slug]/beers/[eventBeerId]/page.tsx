import { notFound } from "next/navigation";

import { PageIntro } from "@/components/shared/page-intro";
import { formatBeerBrandLabel, formatBeerStyleLabel } from "@/lib/beer-display";
import { getReviewPageData } from "@/lib/data/reviews";

import { ReviewForm } from "./review-form";

type ReviewPageProps = {
  params: Promise<{
    slug: string;
    eventBeerId: string;
  }>;
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { slug, eventBeerId } = await params;
  const data = await getReviewPageData(slug, eventBeerId);

  if (!data) {
    notFound();
  }

  return (
    <main className="grain min-h-screen py-8">
      <div className="page-shell px-1">
        <PageIntro
          eyebrow="Beer Review"
          title={data.beerName}
          description={`${formatBeerBrandLabel(data.breweryName)} · ${formatBeerStyleLabel(data.styleName)}`}
        />

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted">
          <span className="rounded-full bg-white/4 px-4 py-2">
            所属活动：{data.eventTitle}
          </span>
          {data.abv ? (
            <span className="rounded-full bg-white/4 px-4 py-2">
              ABV {data.abv}%
            </span>
          ) : null}
          {data.volumeMl ? (
            <span className="rounded-full bg-white/4 px-4 py-2">
              {data.volumeMl}ml
            </span>
          ) : null}
        </div>

        <div className="mt-10">
          <ReviewForm
            eventSlug={data.eventSlug}
            eventBeerId={data.eventBeerId}
            sections={data.sections}
            initialValues={data.initialValues}
            isReadOnly={data.isReadOnly}
            reviewStatusLabel={data.reviewStatusLabel}
          />
        </div>
      </div>
    </main>
  );
}
