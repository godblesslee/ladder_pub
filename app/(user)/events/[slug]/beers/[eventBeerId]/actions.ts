"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/server";
import { getReviewSectionsForEvent, saveReview } from "@/lib/data/reviews";

export async function submitReviewAction(
  _prevState: { message: string; success: boolean } | null,
  formData: FormData,
) {
  try {
    const user = await getUser();

    if (!user) {
      return {
        success: false,
        message: "请先登录后再提交评测。",
      };
    }

    const eventSlug = String(formData.get("eventSlug") ?? "");
    const eventBeerId = String(formData.get("eventBeerId") ?? "");
    const totalScoreValue = String(formData.get("totalScore") ?? "");
    const publicNote = String(formData.get("publicNote") ?? "");

    const answers: Record<string, string | string[]> = {};

    for (const [key, value] of formData.entries()) {
      if (!key.startsWith("field:")) {
        continue;
      }

      const fieldKey = key.replace("field:", "");
      const existing = answers[fieldKey];
      const nextValue = String(value);

      if (existing === undefined) {
        answers[fieldKey] = nextValue;
      } else if (Array.isArray(existing)) {
        existing.push(nextValue);
      } else {
        answers[fieldKey] = [existing, nextValue];
      }
    }

    const sections = await getReviewSectionsForEvent(eventSlug, eventBeerId);

    if (!sections) {
      throw new Error("未找到这杯酒的评测模板，请刷新后重试。");
    }

    const missingFields = sections.flatMap((section) =>
      section.fields.flatMap((field) => {
        if (field.required === false) {
          return [];
        }

        const value = answers[field.key];

        if (Array.isArray(value)) {
          return value.length > 0 ? [] : [`${section.title} / ${field.label}`];
        }

        if (typeof value === "string") {
          return value.trim().length > 0 ? [] : [`${section.title} / ${field.label}`];
        }

        return [`${section.title} / ${field.label}`];
      }),
    );

    if (!totalScoreValue) {
      missingFields.push("总评分");
    }

    if (missingFields.length > 0) {
      throw new Error(`还有未填写项：${missingFields.join("、")}`);
    }

    await saveReview(user.id, {
      eventSlug,
      eventBeerId,
      totalScore: totalScoreValue ? Number(totalScoreValue) : null,
      publicNote,
      answers,
    });

    revalidatePath(`/events/${eventSlug}`);
    revalidatePath(`/events/${eventSlug}/beers/${eventBeerId}`);
    redirect(`/events/${eventSlug}`);
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "提交失败，请稍后再试。",
    };
  }
}
