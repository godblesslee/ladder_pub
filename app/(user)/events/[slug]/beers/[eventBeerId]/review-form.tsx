"use client";

import { useActionState, useState, type FormEvent } from "react";

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
  checked: boolean;
  disabled: boolean;
  onChange?: (checked: boolean) => void;
};

type AnswerValue = string | string[] | undefined;

function getAnswerText(value: AnswerValue) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.trim().length > 0);
  }

  if (typeof value === "string" && value.trim().length > 0) {
    return value.trim();
  }

  return null;
}

function getSectionAccentClass(sectionKey: string) {
  switch (sectionKey) {
    case "appearance":
      return "text-[#d7b46a]";
    case "aroma":
      return "text-[#c99a64]";
    case "flavor":
      return "text-[#bf7d5f]";
    case "palate":
      return "text-[#ab8a6a]";
    default:
      return "text-foreground/92";
  }
}

function ChoiceChip({
  name,
  value,
  label,
  type,
  checked,
  disabled,
  onChange,
}: ChoiceChipProps) {
  return (
    <label className="group relative cursor-pointer">
      <input
        className="peer sr-only"
        type={type}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
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
  const [answers, setAnswers] = useState<Record<string, string | string[]>>(
    initialValues.answers,
  );
  const [totalScore, setTotalScore] = useState<number | null>(initialValues.totalScore);
  const [publicNote, setPublicNote] = useState(initialValues.publicNote);
  const [clientMessage, setClientMessage] = useState("");

  function updateSingleSelect(fieldKey: string, value: string) {
    setClientMessage("");
    setAnswers((current) => ({
      ...current,
      [fieldKey]: value,
    }));
  }

  function updateMultiSelect(fieldKey: string, value: string, checked: boolean) {
    setClientMessage("");
    setAnswers((current) => {
      const currentValues = Array.isArray(current[fieldKey]) ? current[fieldKey] : [];
      const nextValues = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);

      return {
        ...current,
        [fieldKey]: nextValues,
      };
    });
  }

  function updateTextValue(fieldKey: string, value: string) {
    setClientMessage("");
    setAnswers((current) => ({
      ...current,
      [fieldKey]: value,
    }));
  }

  function handleScoreChange(score: number) {
    setClientMessage("");
    setTotalScore(score);
  }

  function handlePublicNoteChange(value: string) {
    setClientMessage("");
    setPublicNote(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (isReadOnly) {
      return;
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

    if (totalScore === null) {
      missingFields.push("总评分");
    }

    if (missingFields.length > 0) {
      event.preventDefault();
      setClientMessage(`还有未填写项：${missingFields.join("、")}`);
    }
  }

  if (isReadOnly) {
    const answeredSections = sections
      .map((section) => ({
        ...section,
        fields: section.fields
          .map((field) => ({
            ...field,
            answer: getAnswerText(answers[field.key]),
          }))
          .filter((field) => field.answer !== null),
      }))
      .filter((section) => section.fields.length > 0);

    return (
      <div className="space-y-5 pb-8">
        <section className="section-card rounded-[28px] px-6 py-6 sm:rounded-[32px] sm:px-7 sm:py-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
                Review Record
              </p>
              <p className="mt-3 text-sm leading-6 text-muted">
                这杯酒的测评已经{reviewStatusLabel ?? "提交"}，当前展示的是你当时留下的记录。
              </p>
            </div>
            <div className="rounded-[22px] border border-[rgba(215,163,61,0.18)] bg-[rgba(215,163,61,0.1)] px-4 py-3 text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-strong/70">
                Score
              </p>
              <p className="mt-1 text-2xl font-semibold text-accent-strong">
                {totalScore ?? "--"}
                <span className="ml-1 text-base text-accent-strong/75">/10</span>
              </p>
            </div>
          </div>
          {publicNote.trim() ? (
            <div className="mt-5 border-t border-white/8 pt-5">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
                公开评论
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-strong">{publicNote}</p>
            </div>
          ) : null}
        </section>

        {answeredSections.map((section) => (
          <section
            key={section.key}
            className="section-card rounded-[28px] px-6 py-6 sm:rounded-[32px] sm:px-7 sm:py-7"
          >
            <div className="flex items-center justify-between gap-3">
              <h2
                className={`text-lg font-medium ${getSectionAccentClass(section.key)}`}
              >
                {section.title}
              </h2>
              <span className="text-[11px] uppercase tracking-[0.16em] text-muted">
                {section.fields.length} 项记录
              </span>
            </div>
            <div className="mt-5 space-y-3">
              {section.fields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-start gap-4 rounded-[20px] border border-white/6 bg-[rgba(255,255,255,0.025)] px-4 py-3.5"
                >
                  <p className="w-[74px] shrink-0 pt-0.5 text-[15px] italic leading-7 text-muted/78">
                    {field.label}
                  </p>
                  {Array.isArray(field.answer) ? (
                    <div className="flex flex-wrap gap-2">
                      {field.answer.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-[12px] text-foreground/84"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-0.5 text-[15px] leading-7 text-foreground/88">
                      {field.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-8 pb-8">
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
          <h2
            className={`text-2xl font-semibold sm:text-[2rem] ${getSectionAccentClass(section.key)}`}
          >
            {section.title}
          </h2>
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
                        checked={answers[field.key] === option}
                        disabled={isReadOnly}
                        onChange={() => updateSingleSelect(field.key, option)}
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
                        checked={
                          Array.isArray(answers[field.key]) &&
                          answers[field.key].includes(option)
                        }
                        disabled={isReadOnly}
                        onChange={(checked) =>
                          updateMultiSelect(field.key, option, checked)
                        }
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
                    value={
                      typeof answers[field.key] === "string"
                        ? answers[field.key]
                        : ""
                    }
                    disabled={isReadOnly}
                    onChange={(event) =>
                      updateTextValue(field.key, event.target.value)
                    }
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
                  checked={totalScore === score}
                  disabled={isReadOnly}
                  onChange={() => handleScoreChange(score)}
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
              value={publicNote}
              disabled={isReadOnly}
              onChange={(event) => handlePublicNoteChange(event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="section-card rounded-[28px] px-6 py-6 sm:rounded-[32px] sm:px-7 sm:py-7">
        <div className="flex flex-col gap-4">
          {clientMessage ? (
            <p className="text-sm leading-6 text-muted">{clientMessage}</p>
          ) : state.message ? (
            <p
              className={`text-sm leading-6 ${state.success ? "text-success" : "text-muted"}`}
            >
              {state.message}
            </p>
          ) : isReadOnly ? (
            <p className="text-sm leading-6 text-muted">
              当前是历史记录查看模式，如需重新测评，建议由组织者开启新的活动场次。
            </p>
          ) : (
            <p className="text-sm leading-6 text-muted">
              已支持回填已保存内容，可以回来继续补完这杯的记录。
            </p>
          )}
          <button
            type="submit"
            disabled={pending || isReadOnly}
            className="w-full rounded-[24px] bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-6 py-4 text-base font-semibold text-[#2b2114] shadow-[0_18px_40px_rgba(215,163,61,0.18)] disabled:opacity-60"
          >
            {isReadOnly ? "已提交，不可修改" : pending ? "提交中..." : "保存 demo 测评"}
          </button>
        </div>
      </section>
    </form>
  );
}
