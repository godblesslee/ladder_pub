import { createClient } from "@/lib/supabase/server";
import { sampleEvents } from "@/lib/product";

export type EventListItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  beerCount: number;
  status: string;
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
        ...event,
      })),
      source: "fallback",
    };
  }
}
