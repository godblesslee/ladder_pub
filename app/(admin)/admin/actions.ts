"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";

const DEFAULT_ORGANIZATION_ID = "11111111-1111-1111-1111-111111111111";

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, "-")
    .replace(/[^a-z0-9-\u4e00-\u9fa5]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function toNullableString(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized.length > 0 ? normalized : null;
}

function toNullableNumber(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  const parsed = Number(normalized);
  return Number.isNaN(parsed) ? null : parsed;
}

function toNullableDate(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  return normalized ? new Date(normalized).toISOString() : null;
}

export async function saveBeerAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const breweryName = String(formData.get("breweryName") ?? "").trim();
  const productName = String(formData.get("productName") ?? "").trim();
  const styleName = String(formData.get("styleName") ?? "").trim();

  if (!breweryName || !productName || !styleName) {
    throw new Error("厂牌、酒款名称和种类为必填项。");
  }

  const payload = {
    organization_id: DEFAULT_ORGANIZATION_ID,
    brewery_name: breweryName,
    product_name: productName,
    style_name: styleName,
    abv: toNullableNumber(formData.get("abv")),
    volume_ml: toNullableNumber(formData.get("volumeMl")),
    country_code: toNullableString(formData.get("countryCode")),
    retail_price_range: toNullableString(formData.get("retailPriceRange")),
    image_url: toNullableString(formData.get("imageUrl")),
    description: toNullableString(formData.get("description")),
    updated_at: new Date().toISOString(),
  };

  const query = id
    ? supabase.from("beers").update(payload).eq("id", id).select("id").single()
    : supabase.from("beers").insert(payload).select("id").single();

  const { data, error } = await query;

  if (error || !data) {
    throw new Error(error?.message ?? "保存酒款失败，请稍后再试。");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/beers");
  redirect(`/admin/beers/${data.id}`);
}

export async function removeBeerFromEventAction(eventId: string, beerId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("event_beers")
    .delete()
    .eq("event_id", eventId)
    .eq("beer_id", beerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/admin/events/${eventId}/beers`);
}

export async function saveTemplateAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim();
  const snapshotStr = String(formData.get("snapshot") ?? "{}").trim();

  if (!name) {
    throw new Error("模板名称为必填项");
  }

  let snapshot: Record<string, unknown>;
  try {
    snapshot = JSON.parse(snapshotStr);
  } catch {
    throw new Error("模板结构数据格式错误");
  }

  const templatePayload = {
    organization_id: DEFAULT_ORGANIZATION_ID,
    name,
    description: description || null,
    status,
  };

  let templateId = id;

  if (id) {
    const { data, error } = await supabase
      .from("review_templates")
      .update(templatePayload)
      .eq("id", id)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "更新模板失败");
    }
  } else {
    const { data, error } = await supabase
      .from("review_templates")
      .insert(templatePayload)
      .select("id")
      .single();

    if (error || !data) {
      throw new Error(error?.message ?? "创建模板失败");
    }
    templateId = data.id;
  }

  const { data: existingVersions } = await supabase
    .from("review_template_versions")
    .select("id, version_number")
    .eq("template_id", templateId)
    .order("version_number", { ascending: false })
    .limit(1);

  const nextVersion = (existingVersions?.[0]?.version_number ?? 0) + 1;

  const versionPayload = {
    template_id: templateId,
    version_number: nextVersion,
    snapshot_json: snapshot as never,
    published_at: status === "published" ? new Date().toISOString() : null,
  };

  const { error: versionError } = await supabase
    .from("review_template_versions")
    .insert(versionPayload);

  if (versionError) {
    throw new Error(versionError.message);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/templates");
  redirect(`/admin/templates/${templateId}`);
}

export async function saveEventAction(formData: FormData) {
  const supabase = createAdminClient();
  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const providedSlug = String(formData.get("slug") ?? "").trim();

  if (!title) {
    throw new Error("活动标题为必填项。");
  }

  const startAt = toNullableDate(formData.get("startAt"));

  if (!startAt) {
    throw new Error("开始时间为必填项。");
  }

  const status = String(formData.get("status") ?? "draft").trim();
  const nextSlug = (providedSlug || slugify(title) || `event-${Date.now()}`).slice(0, 80);
  const existingPublishedAt = String(formData.get("publishedAt") ?? "").trim();
  const shouldPublish = status !== "draft";
  const publishedAt = shouldPublish
    ? existingPublishedAt || new Date().toISOString()
    : null;

  const eventPayload = {
    organization_id: DEFAULT_ORGANIZATION_ID,
    title,
    slug: nextSlug,
    description: toNullableString(formData.get("description")),
    location: toNullableString(formData.get("location")),
    start_at: startAt,
    end_at: toNullableDate(formData.get("endAt")),
    cover_image_url: toNullableString(formData.get("coverImageUrl")),
    status,
    template_version_id: toNullableString(formData.get("templateVersionId")),
    published_at: publishedAt,
  };

  const eventQuery = id
    ? supabase.from("events").update(eventPayload).eq("id", id).select("id").single()
    : supabase.from("events").insert(eventPayload).select("id").single();

  const { data: savedEvent, error: eventError } = await eventQuery;

  if (eventError || !savedEvent) {
    throw new Error(eventError?.message ?? "保存活动失败，请稍后再试。");
  }

  const eventId = savedEvent.id;
  const beerIds = new Set<string>();

  for (const [key] of formData.entries()) {
    const [, beerId] = key.split(":");

    if (beerId) {
      beerIds.add(beerId);
    }
  }

  if (beerIds.size > 0) {
    const selectedBeers = [...beerIds]
      .filter((beerId) => formData.get(`includeBeer:${beerId}`) === "on")
      .map((beerId) => ({
        event_id: eventId,
        beer_id: beerId,
        serving_order: toNullableNumber(formData.get(`servingOrder:${beerId}`)),
        notes: toNullableString(formData.get(`notes:${beerId}`)),
      }));

    const { error: deleteError } = await supabase
      .from("event_beers")
      .delete()
      .eq("event_id", eventId);

    if (deleteError) {
      throw new Error(deleteError.message);
    }

    if (selectedBeers.length > 0) {
      const { error: beersError } = await supabase
        .from("event_beers")
        .insert(selectedBeers);

      if (beersError) {
        throw new Error(beersError.message);
      }
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/events");
  revalidatePath(`/admin/events/${eventId}`);
  redirect(`/admin/events/${eventId}`);
}
