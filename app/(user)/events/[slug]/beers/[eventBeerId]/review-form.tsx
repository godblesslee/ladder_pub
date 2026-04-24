"use client";

import { useActionState } from "react";

import type { ReviewFormInitialValues } from "@/lib/data/reviews";
import type { ReviewSection } from "@/lib/review-template";

import { submitReviewAction } from "./actions";

type ReviewFormProps = {
  eventSlug: string;
  eventBeerId: string;
  sections: ReviewSection[];
  initialValues: ReviewFormInitialValues;
  isReadOnly: boolean;
  reviewStatusLabel: string | null;
};

const initialState = { success: false, message: "" };
const scoreOptions = Array.from({ length: 10 }, (_, index) => index + 1);

type ChoiceChipProps = {
  name: string;
  value: string;
  label: string;
  type: "radio" | "checkbox";
  defaultChecked: boolean;
  disabled: boolean;
};

function ChoiceChip({
  name,
  value,
  label,
  type,
  defaultChecked,
  disabled,
}: ChoiceChipProps) {
  return (
    <label className="group relative cursor-pointer">
      <input
        className="peer sr-only"
        type={type}
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <span className="flex items-center rounded-2xl border border-white/8 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-sm text-muted-strong transition-all peer-checked:border-[rgba(215,163,61,0.38)] peer-checked:bg-[rgba(215,163,61,0.12)] peer-checked:text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-60">
        <span>{label}</span>
      </span>
    </label>
  );
}

export function ReviewForm({
  eventSlug,
  eventBeerId,
  sections,
  initialValues,
  isReadOnly,
  reviewStatusLabel,
}: ReviewFormProps) {
  const [state, formAction, pending] = useActionState(
    submitReviewAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-8 pb-28">
      <input type="hidden" name="eventSlug" value={eventSlug} />
      <input type="hidden" name="eventBeerId" value={eventBeerId} />

      {isReadOnly ? (
        <section className="section-card rounded-[24px] p-5 text-sm leading-7 text-muted sm:rounded-[28px] sm:p-6">
          这杯酒的测评已经{reviewStatusLabel ?? "提交"}，当前页面仅用于查看历史记录，不支持再次修改。
        </section>
      ) : null}

      {sections.map((section) => (
        <section
          key={section.key}
          className="section-card rounded-[28px] px-6 py-7 sm:rounded-[32px] sm:px-7 sm:py-8"
        >
          <h2 className="text-2xl font-semibold sm:text-[2rem]">{section.title}</h2>
          <div className="mt-10 space-y-10">
            {section.fields.map((field) => (
              <div key={field.key} className="space-y-4">
                <label className="block text-lg font-semibold text-foreground">
                  {field.label}
                </label>

                {field.type === "single_select" ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {field.options?.map((option) => (
                      <ChoiceChip
                        key={option}
                        type="radio"
                        name={`field:${field.key}`}
                        value={option}
                        label={option}
                        defaultChecked={initialValues.answers[field.key] === option}
                        disabled={isReadOnly}
                      />
                    ))}
                  </div>
                ) : null}

                {field.type === "multi_select" ? (
                  <div className="flex flex-wrap gap-3 pt-1">
                    {field.options?.map((option) => (
                      <ChoiceChip
                        key={option}
                        type="checkbox"
                        name={`field:${field.key}`}
                        value={option}
                        label={option}
                        defaultChecked={
                          Array.isArray(initialValues.answers[field.key]) &&
                          initialValues.answers[field.key].includes(option)
                        }
                        disabled={isReadOnly}
                      />
                    ))}
                  </div>
                ) : null}

                {field.type === "textarea" ? (
                  <textarea
                    name={`field:${field.key}`}
                    rows={4}
                    className="mt-1 w-full rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-base text-foreground outline-none"
                    placeholder="写下你的感受..."
                    defaultValue={
                      typeof initialValues.answers[field.key] === "string"
                        ? initialValues.answers[field.key]
                        : ""
                    }
                    disabled={isReadOnly}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="section-card rounded-[28px] px-6 py-7 sm:rounded-[32px] sm:px-7 sm:py-8">
        <h2 className="text-2xl font-semibold sm:text-[2rem]">总评分与分享</h2>
        <div className="mt-10 space-y-8">
          <div className="space-y-4">
            <label className="block text-lg font-semibold">总评分（1-10）</label>
            <div className="flex flex-wrap gap-3 pt-1">
              {scoreOptions.map((score) => (
                <ChoiceChip
                  key={score}
                  type="radio"
                  name="totalScore"
                  value={String(score)}
                  label={`${score} 分`}
                  defaultChecked={initialValues.totalScore === score}
                  disabled={isReadOnly}
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <label className="block text-lg font-semibold">公开评论 / 感受</label>
            <textarea
              name="publicNote"
              rows={5}
              className="mt-1 w-full rounded-[24px] border border-white/8 bg-[rgba(255,255,255,0.04)] px-5 py-4 text-base text-foreground outline-none"
              placeholder="这杯酒让你想到什么？有什么想分享给别人？"
              defaultValue={initialValues.publicNote}
              disabled={isReadOnly}
            />
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/8 bg-[rgba(20,17,15,0.92)] px-4 py-3 backdrop-blur-xl">
        <div className="page-shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {state.message ? (
            <p
              className={`text-sm ${state.success ? "text-success" : "text-muted"}`}
            >
              {state.message}
            </p>
          ) : isReadOnly ? (
            <p className="text-sm text-muted">
              当前是历史记录查看模式，如需重新测评，建议由组织者开启新的活动场次。
            </p>
          ) : (
            <p className="text-sm text-muted">
              已支持回填已保存内容，可以回来继续补完这杯的记录。
            </p>
          )}
          <button
            type="submit"
            disabled={pending || isReadOnly}
            className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-6 py-3 text-sm font-semibold text-[#2b2114] disabled:opacity-60"
          >
            {isReadOnly ? "已提交，不可修改" : pending ? "提交中..." : "保存 demo 测评"}
          </button>
        </div>
      </div>
    </form>
  );
}
