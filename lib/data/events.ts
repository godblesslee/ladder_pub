import { createClient } from "@/lib/supabase/server";
import { sampleEvents } from "@/lib/product";

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
    const supabase = await createClient();
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
      events: sampleEvents.map((event, index) => ({
        id: `fallback-${index + 1}`,
        slug: undefined,
        ...event,
      })),
      source: "fallback",
    };
  }
}

export async function getEventBySlug(slug: string): Promise<{
  event: EventDetail | null;
  source: "database" | "fallback";
}> {
  try {
    const supabase = await createClient();
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
    if (slug !== "first-digital-tasting-session") {
      return {
        event: null,
        source: "fallback",
      };
    }

    return {
      event: {
        id: "fallback-event-1",
        slug,
        title: "首场数字化品鉴测试场",
        description:
          "用于验证活动列表、Supabase 数据读取和后续测评流程的第一场测试活动。",
        date: "2026/05/18",
        location: "小酒馆测试场",
        status: "已上线",
        beers: [
          {
            id: "fallback-beer-1",
            servingOrder: 1,
            notes: "首杯示例酒款",
            breweryName: "Misty Range Brewing",
            productName: "Signal Peak West Coast IPA",
            styleName: "West Coast IPA",
            abv: 6.8,
            volumeMl: 330,
          },
        ],
      },
      source: "fallback",
    };
  }
}
