import { fallbackEvents, getFallbackEventBySlug } from "@/lib/data/fallback-events";
import { createAdminClient } from "@/lib/supabase/admin";

export type EventListItem = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  date: string;
  location: string;
  beerCount: number;
  status: string;
};

export type EventBeerListItem = {
  id: string;
  servingOrder: number | null;
  notes: string | null;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  volumeMl: number | null;
};

export type EventDetail = {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  location: string;
  status: string;
  theme: string | null;
  audience: string | null;
  schedule: string | null;
  sourceNote: string | null;
  beers: EventBeerListItem[];
};

function mapStatus(status: string | null | undefined) {
  switch (status) {
    case "ongoing":
      return "进行中";
    case "ended":
      return "已结束";
    case "published":
      return "已上线";
    default:
      return "筹备中";
  }
}

function formatDate(input: string | null | undefined) {
  if (!input) {
    return "待定";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(input));
}

export async function getPublishedEvents(): Promise<{
  events: EventListItem[];
  source: "database" | "fallback";
}> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        `
        id,
          slug,
          title,
          description,
          location,
          start_at,
          status,
          event_beers ( id )
        `,
      )
      .in("status", ["published", "ongoing", "ended"])
      .order("start_at", { ascending: true });

    if (error) {
      throw error;
    }

    const events =
      data?.map((event) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        description: event.description ?? "暂无活动描述。",
        date: formatDate(event.start_at),
        location: event.location ?? "地点待定",
        beerCount: event.event_beers?.length ?? 0,
        status: mapStatus(event.status),
      })) ?? [];

    return {
      events,
      source: "database",
    };
  } catch {
    return {
      events: fallbackEvents.map((event) => ({
        id: event.id,
        slug: event.slug,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
        beerCount: event.beerCount,
        status: event.status,
      })),
      source: "fallback",
    };
  }
}

export async function getEventBySlug(slug: string): Promise<{
  event: EventDetail | null;
  source: "database" | "fallback";
}> {
  const fallbackEvent = getFallbackEventBySlug(slug);

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("events")
      .select(
        `
          id,
          slug,
          title,
          description,
          location,
          start_at,
          status,
          event_beers (
            id,
            serving_order,
            notes,
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
      .single();

    if (error) {
      throw error;
    }

    return {
      event: {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description ?? "暂无活动描述。",
        date: formatDate(data.start_at),
        location: data.location ?? "地点待定",
        status: mapStatus(data.status),
        theme: fallbackEvent?.theme ?? null,
        audience: fallbackEvent?.audience ?? null,
        schedule: fallbackEvent?.schedule ?? null,
        sourceNote: fallbackEvent?.sourceNote ?? null,
        beers:
          data.event_beers?.map((item) => {
            const beer = Array.isArray(item.beers) ? item.beers[0] : item.beers;

            return {
              id: item.id,
              servingOrder: item.serving_order,
              notes: item.notes,
              breweryName: beer?.brewery_name ?? "未知厂牌",
              productName: beer?.product_name ?? "未知酒款",
              styleName: beer?.style_name ?? "风格待定",
              abv: beer?.abv ?? null,
              volumeMl: beer?.volume_ml ?? null,
            };
          }) ?? [],
      },
      source: "database",
    };
  } catch {
    if (!fallbackEvent) {
      return {
        event: null,
        source: "fallback",
      };
    }

    return {
      event: {
        id: fallbackEvent.id,
        slug: fallbackEvent.slug,
        title: fallbackEvent.title,
        description: fallbackEvent.description,
        date: fallbackEvent.date,
        location: fallbackEvent.location,
        status: fallbackEvent.status,
        theme: fallbackEvent.theme,
        audience: fallbackEvent.audience,
        schedule: fallbackEvent.schedule,
        sourceNote: fallbackEvent.sourceNote,
        beers: fallbackEvent.beers.map((beer) => ({
          id: beer.id,
          servingOrder: beer.servingOrder,
          notes: beer.notes,
          breweryName: beer.breweryName,
          productName: beer.productName,
          styleName: beer.styleName,
          abv: beer.abv,
          volumeMl: beer.volumeMl,
        })),
      },
      source: "fallback",
    };
  }
}
