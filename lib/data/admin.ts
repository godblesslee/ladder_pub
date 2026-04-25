import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_ORGANIZATION_ID = "11111111-1111-1111-1111-111111111111";

type EventStatus = "draft" | "published" | "ongoing" | "ended";

export type AdminDashboardData = {
  eventCount: number;
  beerCount: number;
  publishedEventCount: number;
  latestEventTitle: string | null;
};

export type AdminEventListItem = {
  id: string;
  title: string;
  slug: string;
  status: EventStatus;
  location: string | null;
  startAtLabel: string;
  beerCount: number;
  templateLabel: string;
};

export type AdminBeerListItem = {
  id: string;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  volumeMl: number | null;
  countryCode: string | null;
  retailPriceRange: string | null;
  updatedAtLabel: string;
};

export type AdminTemplateOption = {
  id: string;
  label: string;
};

export type AdminBeerOption = {
  id: string;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  countryCode: string | null;
  retailPriceRange: string | null;
};

export type AdminAssignedBeer = {
  beerId: string;
  servingOrder: number | null;
  notes: string;
};

export type AdminEventEditorData = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    startAt: string;
    endAt: string;
    coverImageUrl: string;
    status: EventStatus;
    templateVersionId: string;
    publishedAt: string;
  } | null;
  templates: AdminTemplateOption[];
  beers: AdminBeerOption[];
  assignedBeers: AdminAssignedBeer[];
};

export type AdminBeerEditorData = {
  beer: {
    id: string;
    breweryName: string;
    productName: string;
    styleName: string;
    abv: string;
    volumeMl: string;
    countryCode: string;
    retailPriceRange: string;
    imageUrl: string;
    description: string;
  } | null;
};

export const DEFAULT_EVENT_LOCATION = "DN武夷山数字游民公社A幢";

function formatTemplateLabel(name: string, versionNumber: number | null | undefined) {
  const suffix = `V${versionNumber ?? 1}`;
  return name.includes(suffix) ? name : `${name} · ${suffix}`;
}

function mapAdminEventStatus(status: EventStatus) {
  switch (status) {
    case "draft":
      return "草稿";
    case "published":
      return "已发布";
    case "ongoing":
      return "进行中";
    case "ended":
      return "已结束";
    default:
      return status;
  }
}

function normalizeAdminLocation(location: string | null) {
  if (!location) {
    return "地点待定";
  }

  if (location.includes("DN武夷山")) {
    return DEFAULT_EVENT_LOCATION;
  }

  return location;
}

function formatDateTimeLabel(value: string | null) {
  if (!value) {
    return "未设置";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatDateTimeLocalValue(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (input: number) => String(input).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createAdminClient();
  const [{ count: eventCount }, { count: beerCount }, { count: publishedEventCount }, latest] =
    await Promise.all([
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", DEFAULT_ORGANIZATION_ID),
      supabase
        .from("beers")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", DEFAULT_ORGANIZATION_ID),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", DEFAULT_ORGANIZATION_ID)
        .in("status", ["published", "ongoing", "ended"]),
      supabase
        .from("events")
        .select("title")
        .eq("organization_id", DEFAULT_ORGANIZATION_ID)
        .order("start_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  return {
    eventCount: eventCount ?? 0,
    beerCount: beerCount ?? 0,
    publishedEventCount: publishedEventCount ?? 0,
    latestEventTitle: latest.data?.title ?? null,
  };
}

export async function getAdminEvents(): Promise<AdminEventListItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      `
        id,
        title,
        slug,
        status,
        location,
        start_at,
        event_beers ( id ),
        review_template_versions (
          version_number,
          review_templates ( name )
        )
      `,
    )
    .eq("organization_id", DEFAULT_ORGANIZATION_ID)
    .order("start_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((event) => {
    const templateVersion = Array.isArray(event.review_template_versions)
      ? event.review_template_versions[0]
      : event.review_template_versions;
    const template = templateVersion?.review_templates;
    const templateItem = Array.isArray(template) ? template[0] : template;

    return {
      id: event.id,
      title: event.title,
      slug: event.slug,
      status: mapAdminEventStatus(event.status as EventStatus) as EventStatus,
      location: normalizeAdminLocation(event.location),
      startAtLabel: formatDateTimeLabel(event.start_at),
      beerCount: event.event_beers?.length ?? 0,
      templateLabel: templateItem
        ? formatTemplateLabel(templateItem.name, templateVersion?.version_number)
        : "未绑定模板",
    };
  });
}

export async function getAdminBeers(): Promise<AdminBeerListItem[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("beers")
    .select(
      "id, brewery_name, product_name, style_name, abv, volume_ml, country_code, retail_price_range, updated_at",
    )
    .eq("organization_id", DEFAULT_ORGANIZATION_ID)
    .order("updated_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data.map((beer) => ({
    id: beer.id,
    breweryName: beer.brewery_name,
    productName: beer.product_name,
    styleName: beer.style_name,
    abv: beer.abv,
    volumeMl: beer.volume_ml,
    countryCode: beer.country_code,
    retailPriceRange: beer.retail_price_range,
    updatedAtLabel: formatDateTimeLabel(beer.updated_at),
  }));
}

export async function getAdminEventEditorData(
  eventId?: string,
): Promise<AdminEventEditorData> {
  const supabase = createAdminClient();

  const [{ data: templates }, { data: beers }, eventResult] = await Promise.all([
    supabase
      .from("review_template_versions")
      .select(
        `
          id,
          version_number,
          review_templates!inner (
            name,
            organization_id
          )
        `,
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("beers")
      .select("id, brewery_name, product_name, style_name, abv, country_code, retail_price_range")
      .eq("organization_id", DEFAULT_ORGANIZATION_ID)
      .order("brewery_name", { ascending: true }),
    eventId
      ? supabase
          .from("events")
          .select(
            `
              id,
              title,
              slug,
              description,
              location,
              start_at,
              end_at,
              cover_image_url,
              status,
              template_version_id,
              published_at,
              event_beers (
                beer_id,
                serving_order,
                notes
              )
            `,
          )
          .eq("id", eventId)
          .maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const templateOptions =
    templates
      ?.filter((item) => {
        const template = Array.isArray(item.review_templates)
          ? item.review_templates[0]
          : item.review_templates;

        return template?.organization_id === DEFAULT_ORGANIZATION_ID;
      })
      .map((item) => {
        const template = Array.isArray(item.review_templates)
          ? item.review_templates[0]
          : item.review_templates;

        return {
          id: item.id,
          label: formatTemplateLabel(template?.name ?? "模板", item.version_number),
        };
      }) ?? [];

  const beerOptions =
    beers?.map((beer) => ({
      id: beer.id,
      breweryName: beer.brewery_name,
      productName: beer.product_name,
      styleName: beer.style_name,
      abv: beer.abv,
      countryCode: beer.country_code,
      retailPriceRange: beer.retail_price_range,
    })) ?? [];

  if (!eventResult.data) {
    return {
      event: null,
      templates: templateOptions,
      beers: beerOptions,
      assignedBeers: [],
    };
  }

  return {
    event: {
      id: eventResult.data.id,
      title: eventResult.data.title,
      slug: eventResult.data.slug,
      description: eventResult.data.description ?? "",
      location: eventResult.data.location ?? "",
      startAt: formatDateTimeLocalValue(eventResult.data.start_at),
      endAt: formatDateTimeLocalValue(eventResult.data.end_at),
      coverImageUrl: eventResult.data.cover_image_url ?? "",
      status: eventResult.data.status as EventStatus,
      templateVersionId: eventResult.data.template_version_id ?? "",
      publishedAt: eventResult.data.published_at ?? "",
    },
    templates: templateOptions,
    beers: beerOptions,
    assignedBeers:
      eventResult.data.event_beers?.map((item) => ({
        beerId: item.beer_id,
        servingOrder: item.serving_order,
        notes: item.notes ?? "",
      })) ?? [],
  };
}

export async function getAdminBeerEditorData(
  beerId?: string,
): Promise<AdminBeerEditorData> {
  if (!beerId) {
    return { beer: null };
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("beers")
    .select(
      `
        id,
        brewery_name,
        product_name,
        style_name,
        abv,
        volume_ml,
        country_code,
        retail_price_range,
        image_url,
        description
      `,
    )
    .eq("id", beerId)
    .maybeSingle();

  if (!data) {
    return { beer: null };
  }

  return {
    beer: {
      id: data.id,
      breweryName: data.brewery_name,
      productName: data.product_name,
      styleName: data.style_name,
      abv: data.abv === null ? "" : String(data.abv),
      volumeMl: data.volume_ml === null ? "" : String(data.volume_ml),
      countryCode: data.country_code ?? "",
      retailPriceRange: data.retail_price_range ?? "",
      imageUrl: data.image_url ?? "",
      description: data.description ?? "",
    },
  };
}
