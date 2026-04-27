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

export type AdminTemplateListItem = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  versionCount: number;
  latestVersionLabel: string;
  updatedAtLabel: string;
};

export type AdminTemplateEditorData = {
  template: {
    id: string;
    name: string;
    description: string;
    status: string;
  } | null;
  versions: {
    id: string;
    versionNumber: number;
    publishedAt: string | null;
    fieldCount: number;
  }[];
  snapshotJson: TemplateSnapshotJson | null;
};

export type TemplateSection = {
  key: string;
  title: string;
  fields: TemplateField[];
};

export type TemplateField = {
  key: string;
  label: string;
  type: "single_select" | "multi_select" | "textarea" | "number" | "sort";
  options?: string[];
  required?: boolean;
};

export type TemplateSnapshotJson = {
  sections: TemplateSection[];
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
        beerId: item.beer_id as string,
        servingOrder: item.serving_order as number | null,
        notes: (item.notes ?? "") as string,
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

export type AdminBeerDetailData = {
  beer: {
    id: string;
    breweryName: string;
    productName: string;
    styleName: string;
    abv: string | null;
    volumeMl: string | null;
    countryCode: string | null;
    retailPriceRange: string | null;
    imageUrl: string | null;
    description: string | null;
  } | null;
};

export async function getAdminBeerDetailData(
  beerId: string,
): Promise<AdminBeerDetailData> {
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
      abv: data.abv !== null ? String(data.abv) : null,
      volumeMl: data.volume_ml !== null ? String(data.volume_ml) : null,
      countryCode: data.country_code,
      retailPriceRange: data.retail_price_range,
      imageUrl: data.image_url,
      description: data.description,
    },
  };
}

export async function getAdminTemplates(): Promise<AdminTemplateListItem[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("review_templates")
    .select(
      `
        id,
        name,
        description,
        status,
        created_at,
        review_template_versions ( count )
      `,
    )
    .eq("organization_id", DEFAULT_ORGANIZATION_ID)
    .order("created_at", { ascending: false });

  if (!data) {
    return [];
  }

  return data.map((template) => {
    const versions = template.review_template_versions as { count: number }[] | null;
    const versionCount = versions?.[0]?.count ?? 0;

    return {
      id: template.id,
      name: template.name,
      description: template.description,
      status: template.status === "published" ? "已发布" : template.status === "draft" ? "草稿" : "已归档",
      versionCount,
      latestVersionLabel: versionCount > 0 ? `V${versionCount}` : "无版本",
      updatedAtLabel: formatDateTimeLabel(template.created_at),
    };
  });
}

export async function getAdminTemplateEditorData(
  templateId?: string,
): Promise<AdminTemplateEditorData> {
  const supabase = createAdminClient();

  if (!templateId) {
    return {
      template: null,
      versions: [],
      snapshotJson: { sections: [] },
    };
  }

  const { data: template } = await supabase
    .from("review_templates")
    .select("id, name, description, status")
    .eq("id", templateId)
    .eq("organization_id", DEFAULT_ORGANIZATION_ID)
    .maybeSingle();

  if (!template) {
    return {
      template: null,
      versions: [],
      snapshotJson: { sections: [] },
    };
  }

  const { data: versions } = await supabase
    .from("review_template_versions")
    .select("id, version_number, published_at, snapshot_json")
    .eq("template_id", templateId)
    .order("version_number", { ascending: false });

  const versionItems = (versions ?? []).map((v) => {
    const snapshot = v.snapshot_json as TemplateSnapshotJson | null;
    const fieldCount = snapshot?.sections?.reduce(
      (acc, section) => acc + (section.fields?.length ?? 0),
      0,
    ) ?? 0;

    return {
      id: v.id,
      versionNumber: v.version_number,
      publishedAt: v.published_at,
      fieldCount,
    };
  });

  const latestSnapshot = versions?.[0]?.snapshot_json as TemplateSnapshotJson | null;

  return {
    template: {
      id: template.id,
      name: template.name,
      description: template.description ?? "",
      status: template.status,
    },
    versions: versionItems,
    snapshotJson: latestSnapshot ?? { sections: [] },
  };
}

export type AdminEventBeerItem = {
  id: string;
  beerId: string;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  countryCode: string | null;
  servingOrder: number | null;
  notes: string | null;
  customLabel: string | null;
  vintage: string | null;
  batchNo: string | null;
  blindCode: string | null;
};

export type AdminEventBeersData = {
  eventId: string;
  eventTitle: string;
  beers: AdminEventBeerItem[];
};

export async function getAdminEventBeersData(
  eventId: string,
): Promise<AdminEventBeersData> {
  const supabase = createAdminClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, title")
    .eq("id", eventId)
    .maybeSingle();

  if (!event) {
    return { eventId, eventTitle: "", beers: [] };
  }

  const { data: eventBeers } = await supabase
    .from("event_beers")
    .select(
      `
        id,
        beer_id,
        serving_order,
        notes,
        custom_label,
        vintage,
        batch_no,
        blind_code,
        beers (
          brewery_name,
          product_name,
          style_name,
          abv,
          country_code
        )
      `,
    )
    .eq("event_id", eventId)
    .order("serving_order", { ascending: true });

  const items: AdminEventBeerItem[] = (eventBeers ?? []).map((eb) => {
    const beer = Array.isArray(eb.beers) ? eb.beers[0] : eb.beers;
    return {
      id: eb.id,
      beerId: eb.beer_id,
      breweryName: beer?.brewery_name ?? "",
      productName: beer?.product_name ?? "",
      styleName: beer?.style_name ?? "",
      abv: beer?.abv ?? null,
      countryCode: beer?.country_code ?? null,
      servingOrder: eb.serving_order,
      notes: eb.notes,
      customLabel: eb.custom_label,
      vintage: eb.vintage,
      batchNo: eb.batch_no,
      blindCode: eb.blind_code,
    };
  });

  return {
    eventId: event.id,
    eventTitle: event.title,
    beers: items,
  };
}
