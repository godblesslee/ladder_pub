"use client";

import { useActionState } from "react";

import type { ReviewSection } from "@/lib/review-template";

import { submitReviewAction } from "./actions";

type ReviewFormProps = {
  eventSlug: string;
  eventBeerId: string;
  sections: ReviewSection[];
};

const initialState = { success: false, message: "" };

export function ReviewForm({
  eventSlug,
  eventBeerId,
  sections,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <input type="hidden" name="eventBeerId" value={eventBeerId} />

      {sections.map((section) => (
        <section
          key={section.key}
          className="rounded-[28px] border border-border bg-white/70 p-6"
        >
          <h2 className="text-2xl font-semibold">{section.title}</h2>
          <div className="mt-6 space-y-6">
            {section.fields.map((field) => (
              <div key={field.key} className="space-y-3">
                <label className="text-sm font-semibold text-foreground">
                  {field.label}
                </label>

                {field.type === "single_select" ? (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
                      >
                        <input
                          className="mr-2"
                          type="radio"
                          name={`field:${field.key}`}
                          value={option}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : null}

                {field.type === "multi_select" ? (
                  <div className="flex flex-wrap gap-2">
                    {field.options?.map((option) => (
                      <label
                        key={option}
                        className="rounded-full border border-border bg-surface px-4 py-2 text-sm text-muted"
                      >
                        <input
                          className="mr-2"
                          type="checkbox"
                          name={`field:${field.key}`}
                          value={option}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                ) : null}

                {field.type === "textarea" ? (
                  <textarea
                    name={`field:${field.key}`}
                    rows={4}
                    className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none"
                    placeholder="写下你的感受..."
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-[28px] border border-border bg-white/70 p-6">
        <h2 className="text-2xl font-semibold">总评分与分享</h2>
        <div className="mt-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold">总评分（0-10）</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              name="totalScore"
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold">公开评论 / 感受</label>
            <textarea
              name="publicNote"
              rows={5}
              className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none"
              placeholder="这杯酒让你想到什么？有什么想分享给别人？"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "提交中..." : "提交 demo 测评"}
        </button>
        {state.message ? (
          <p
            className={`text-sm ${state.success ? "text-success" : "text-muted"}`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
