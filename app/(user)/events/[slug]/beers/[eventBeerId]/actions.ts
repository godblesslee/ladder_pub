"use server";

import { revalidatePath } from "next/cache";

import { saveDemoReview } from "@/lib/data/reviews";

export async function submitReviewAction(
  _prevState: { message: string; success: boolean } | null,
  formData: FormData,
) {
  try {
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

    await saveDemoReview({
      eventSlug,
      eventBeerId,
      totalScore: totalScoreValue ? Number(totalScoreValue) : null,
      publicNote,
      answers,
    });

    revalidatePath(`/events/${eventSlug}`);
    revalidatePath(`/events/${eventSlug}/beers/${eventBeerId}`);

    return {
      success: true,
      message: "测评已保存到 Supabase（当前为 demo 提交链路）。",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "提交失败，请稍后再试。",
    };
  }
}
