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
  initialValues: ReviewFormInitialValues;
  isReadOnly: boolean;
  reviewStatusLabel: string | null;
};

export type ReviewFormInitialValues = {
  totalScore: number | null;
  publicNote: string;
  answers: Record<string, string | string[]>;
};

type SavedDemoReview = ReviewFormInitialValues & {
  isReadOnly: boolean;
  reviewStatusLabel: string | null;
};

export type MyBeerReviewItem = {
  id: string;
  beerName: string;
  breweryName: string;
  styleName: string;
  abv: number | null;
  countryCode: string | null;
  retailPriceRange: string | null;
  eventTitle: string;
  eventSlug: string | null;
  eventBeerId: string;
  totalScore: number | null;
  publicNote: string;
  submittedAtLabel: string;
  statusLabel: string;
};

export type MyEventItem = {
  id: string;
  title: string;
  slug: string | null;
  location: string;
  dateLabel: string;
  progressLabel: string;
  reviewCount: number;
  beerCount: number;
  statusLabel: string;
};

export async function getReviewSectionsForEvent(slug: string, eventBeerId: string) {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        `
          slug,
          template_version:review_template_versions (
            snapshot_json
          ),
          event_beers!inner (
            id
          )
        `,
      )
      .eq("slug", slug)
      .eq("event_beers.id", eventBeerId)
      .single();

    if (error || !data) {
      throw error ?? new Error("Event not found.");
    }

    const templateVersion = Array.isArray(data.template_version)
      ? data.template_version[0]
      : data.template_version;

    return (
      (templateVersion?.snapshot_json
        ? parseReviewTemplateSections(templateVersion.snapshot_json)
        : null) ?? reviewTemplateSections
    );
  } catch {
    const fallbackEvent = getFallbackEventBySlug(slug);
    const fallbackBeer = fallbackEvent?.beers.find((beer) => beer.id === eventBeerId);

    if (!fallbackEvent || !fallbackBeer) {
      return null;
    }

    return reviewTemplateSections;
  }
}

const emptyInitialValues: ReviewFormInitialValues = {
  totalScore: null,
  publicNote: "",
  answers: {},
};

function formatReviewDate(input: string | null | undefined) {
  if (!input) {
    return "刚刚保存";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(input));
}

function mapReviewStatus(status: string | null | undefined) {
  switch (status) {
    case "submitted":
      return "已提交";
    case "locked":
      return "已锁定";
    default:
      return "草稿";
  }
}

async function getSavedDemoReview(eventBeerId: string): Promise<SavedDemoReview> {
  const supabase = createAdminClient();
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, total_score, public_note, status")
    .eq("user_id", DEMO_PROFILE_ID)
    .eq("event_beer_id", eventBeerId)
    .maybeSingle();

  if (reviewError || !review) {
    return {
      ...emptyInitialValues,
      isReadOnly: false,
      reviewStatusLabel: null,
    };
  }

  const { data: answers, error: answersError } = await supabase
    .from("review_answers")
    .select("field_key, value_text, value_json")
    .eq("review_id", review.id);

  if (answersError) {
    return {
      totalScore: review.total_score,
      publicNote: review.public_note ?? "",
      answers: {},
      isReadOnly: review.status === "submitted" || review.status === "locked",
      reviewStatusLabel: mapReviewStatus(review.status),
    };
  }

  const normalizedAnswers: Record<string, string | string[]> = {};

  for (const answer of answers) {
    if (Array.isArray(answer.value_json)) {
      const values = answer.value_json.filter(
        (value): value is string => typeof value === "string",
      );

      if (values.length > 0) {
        normalizedAnswers[answer.field_key] = values;
      }

      continue;
    }

    if (typeof answer.value_text === "string" && answer.value_text.trim().length > 0) {
      normalizedAnswers[answer.field_key] = answer.value_text;
    }
  }

  return {
    totalScore: review.total_score,
    publicNote: review.public_note ?? "",
    answers: normalizedAnswers,
    isReadOnly: review.status === "submitted" || review.status === "locked",
    reviewStatusLabel: mapReviewStatus(review.status),
  };
}

const myBeerReviewSelect = `
  id,
  event_beer_id,
  total_score,
  public_note,
  status,
  submitted_at,
  updated_at,
  events (
    title,
    slug
  ),
  beers (
    brewery_name,
    product_name,
    style_name,
    abv,
    country_code,
    retail_price_range
  )
`;

const myBeerReviewSelectWithoutPriceRange = `
  id,
  event_beer_id,
  total_score,
  public_note,
  status,
  submitted_at,
  updated_at,
  events (
    title,
    slug
  ),
  beers (
    brewery_name,
    product_name,
    style_name,
    abv,
    country_code
  )
`;

type MyBeerReviewRow = {
  id: string;
  event_beer_id: string;
  total_score: number | null;
  public_note: string | null;
  status: string;
  submitted_at: string | null;
  updated_at: string;
  events: { title: string; slug: string | null } | null;
  beers: {
    brewery_name: string;
    product_name: string;
    style_name: string;
    abv: number | null;
    country_code: string | null;
    retail_price_range?: string | null;
  } | null;
};

function mapMyBeerReviews(data: MyBeerReviewRow[]): MyBeerReviewItem[] {
  return data.map((review) => {
    const event = Array.isArray(review.events) ? review.events[0] : review.events;
    const beer = Array.isArray(review.beers) ? review.beers[0] : review.beers;

    return {
      id: review.id,
      beerName: beer?.product_name ?? "未知酒款",
      breweryName: beer?.brewery_name ?? "未知厂牌",
      styleName: beer?.style_name ?? "风格待定",
      abv: beer?.abv ?? null,
      countryCode: beer?.country_code ?? null,
      retailPriceRange: beer?.retail_price_range ?? null,
      eventTitle: event?.title ?? "未命名活动",
      eventSlug: event?.slug ?? null,
      eventBeerId: review.event_beer_id,
      totalScore: review.total_score,
      publicNote: review.public_note ?? "",
      submittedAtLabel: formatReviewDate(review.submitted_at ?? review.updated_at),
      statusLabel: mapReviewStatus(review.status),
    } satisfies MyBeerReviewItem;
  });
}

export async function getMyBeerReviews(): Promise<MyBeerReviewItem[]> {
  try {
    const supabase = createAdminClient();
    const query = () =>
      supabase
        .from("reviews")
        .select(myBeerReviewSelect)
        .eq("user_id", DEMO_PROFILE_ID)
        .order("updated_at", { ascending: false });

    const fallbackQuery = () =>
      supabase
        .from("reviews")
        .select(myBeerReviewSelectWithoutPriceRange)
        .eq("user_id", DEMO_PROFILE_ID)
        .order("updated_at", { ascending: false });

    const { data, error } = await query();

    if (!error && data) {
      return mapMyBeerReviews(data);
    }

    const fallback = await fallbackQuery();

    if (fallback.error || !fallback.data) {
      return [];
    }

    return mapMyBeerReviews(fallback.data);
  } catch {
    return [];
  }
}

export async function getMyEvents(): Promise<MyEventItem[]> {
  try {
    const supabase = createAdminClient();
    const { data: participants, error: participantsError } = await supabase
      .from("event_participants")
      .select(
        `
          event_id,
          events (
            id,
            title,
            slug,
            location,
            start_at,
            status,
            event_beers ( id )
          )
        `,
      )
      .eq("user_id", DEMO_PROFILE_ID)
      .eq("participation_status", "joined");

    if (participantsError || !participants) {
      return [];
    }

    const { data: reviews, error: reviewsError } = await supabase
      .from("reviews")
      .select("event_id")
      .eq("user_id", DEMO_PROFILE_ID);

    const reviewCounts = new Map<string, number>();

    if (!reviewsError && reviews) {
      for (const review of reviews) {
        reviewCounts.set(review.event_id, (reviewCounts.get(review.event_id) ?? 0) + 1);
      }
    }

    return participants
      .map((participant) => {
        const event = Array.isArray(participant.events)
          ? participant.events[0]
          : participant.events;

        if (!event) {
          return null;
        }

        const beerCount = event.event_beers?.length ?? 0;
        const reviewCount = reviewCounts.get(event.id) ?? 0;

        return {
          id: event.id,
          title: event.title,
          slug: event.slug,
          location: event.location ?? "地点待定",
          dateLabel: formatReviewDate(event.start_at),
          progressLabel:
            beerCount > 0 ? `已完成 ${reviewCount} / ${beerCount}` : "等待酒单",
          reviewCount,
          beerCount,
          statusLabel: mapReviewStatus(event.status === "ended" ? "locked" : "submitted"),
        } satisfies MyEventItem;
      })
      .filter((event): event is MyEventItem => event !== null);
  } catch {
    return [];
  }
}

export async function getReviewPageData(slug: string, eventBeerId: string) {
  try {
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
      throw error ?? new Error("Event not found.");
    }

    const eventBeer = Array.isArray(data.event_beers)
      ? data.event_beers[0]
      : data.event_beers;
    const beer = Array.isArray(eventBeer?.beers) ? eventBeer.beers[0] : eventBeer?.beers;
    const sections = await getReviewSectionsForEvent(slug, eventBeerId);
    const savedReview = await getSavedDemoReview(eventBeerId);

    if (!sections) {
      return null;
    }

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
      initialValues: {
        totalScore: savedReview.totalScore,
        publicNote: savedReview.publicNote,
        answers: savedReview.answers,
      },
      isReadOnly: savedReview.isReadOnly,
      reviewStatusLabel: savedReview.reviewStatusLabel,
    } satisfies ReviewPageData;
  } catch {
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
      initialValues: emptyInitialValues,
      isReadOnly: false,
      reviewStatusLabel: null,
    } satisfies ReviewPageData;
  }
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
        updated_at: new Date().toISOString(),
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
