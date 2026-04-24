import { createAdminClient } from "@/lib/supabase/admin";
import { getFallbackEventBySlug } from "@/lib/data/fallback-events";
import {
  parseReviewTemplateSections,
  reviewTemplateSections,
  type ReviewSection,
} from "@/lib/review-template";

const DEMO_PROFILE_ID = "77777777-7777-7777-7777-777777777777";

export type ReviewPageData = {
  eventTitle: string;
  eventSlug: string;
  eventBeerId: string;
  beerName: string;
  breweryName: string;
  styleName: string;
  abv: number | null;
  volumeMl: number | null;
  sections: ReviewSection[];
};

export async function getReviewPageData(slug: string, eventBeerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
        title,
        slug,
        template_version:review_template_versions (
          snapshot_json
        ),
        event_beers!inner (
          id,
          beers (
            brewery_name,
            product_name,
            style_name,
            abv,
            volume_ml
          )
        )
      `,
    )
    .eq("slug", slug)
    .eq("event_beers.id", eventBeerId)
    .single();

  if (error || !data) {
    const fallbackEvent = getFallbackEventBySlug(slug);
    const fallbackBeer = fallbackEvent?.beers.find((beer) => beer.id === eventBeerId);

    if (!fallbackEvent || !fallbackBeer) {
      return null;
    }

    return {
      eventTitle: fallbackEvent.title,
      eventSlug: fallbackEvent.slug,
      eventBeerId,
      beerName: fallbackBeer.productName,
      breweryName: fallbackBeer.breweryName,
      styleName: fallbackBeer.styleName,
      abv: fallbackBeer.abv,
      volumeMl: fallbackBeer.volumeMl,
      sections: reviewTemplateSections,
    } satisfies ReviewPageData;
  }

  const eventBeer = Array.isArray(data.event_beers)
    ? data.event_beers[0]
    : data.event_beers;
  const beer = Array.isArray(eventBeer?.beers) ? eventBeer.beers[0] : eventBeer?.beers;
  const templateVersion = Array.isArray(data.template_version)
    ? data.template_version[0]
    : data.template_version;
  const sections =
    (templateVersion?.snapshot_json
      ? parseReviewTemplateSections(templateVersion.snapshot_json)
      : null) ?? reviewTemplateSections;

  return {
    eventTitle: data.title,
    eventSlug: data.slug,
    eventBeerId,
    beerName: beer?.product_name ?? "未知酒款",
    breweryName: beer?.brewery_name ?? "未知厂牌",
    styleName: beer?.style_name ?? "风格待定",
    abv: beer?.abv ?? null,
    volumeMl: beer?.volume_ml ?? null,
    sections,
  } satisfies ReviewPageData;
}

export async function saveDemoReview(input: {
  eventSlug: string;
  eventBeerId: string;
  totalScore: number | null;
  publicNote: string;
  answers: Record<string, string | string[]>;
}) {
  const supabase = createAdminClient();

  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("id, template_version_id, event_beers!inner(id, beer_id)")
    .eq("slug", input.eventSlug)
    .eq("event_beers.id", input.eventBeerId)
    .single();

  if (eventError || !eventData) {
    throw new Error("Event not found.");
  }

  const eventBeer = Array.isArray(eventData.event_beers)
    ? eventData.event_beers[0]
    : eventData.event_beers;

  await supabase.from("profiles").upsert({
    id: DEMO_PROFILE_ID,
    nickname: "Demo Taster",
    role: "user",
  });

  await supabase.from("event_participants").upsert({
    event_id: eventData.id,
    user_id: DEMO_PROFILE_ID,
    participation_status: "joined",
  });

  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .upsert(
      {
        user_id: DEMO_PROFILE_ID,
        event_id: eventData.id,
        event_beer_id: input.eventBeerId,
        beer_id: eventBeer.beer_id,
        template_version_id: eventData.template_version_id!,
        total_score: input.totalScore,
        public_note: input.publicNote || null,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,event_id,event_beer_id",
      },
    )
    .select("id")
    .single();

  if (reviewError || !review) {
    throw new Error("Failed to save review.");
  }

  await supabase.from("review_answers").delete().eq("review_id", review.id);

  const payload = Object.entries(input.answers)
    .filter(([, value]) =>
      Array.isArray(value) ? value.length > 0 : value.trim().length > 0,
    )
    .map(([fieldKey, value]) => ({
      review_id: review.id,
      field_key: fieldKey,
      value_text: Array.isArray(value) ? null : value,
      value_json: Array.isArray(value) ? value : null,
    }));

  if (payload.length > 0) {
    const { error: answersError } = await supabase
      .from("review_answers")
      .insert(payload);

    if (answersError) {
      throw new Error("Failed to save review answers.");
    }
  }

  return review.id;
}
