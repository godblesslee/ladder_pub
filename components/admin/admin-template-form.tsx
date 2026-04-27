"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveTemplateAction } from "@/app/(admin)/admin/actions";
import type { TemplateSection, TemplateField } from "@/lib/data/admin";

type AdminTemplateFormProps = {
  template?: {
    id: string;
    name: string;
    description: string;
    status: string;
  } | null;
  versions?: {
    id: string;
    versionNumber: number;
    publishedAt: string | null;
    fieldCount: number;
  }[];
  snapshotJson?: {
    sections: TemplateSection[];
  } | null;
};

const FIELD_TYPES = [
  { value: "single_select", label: "单选" },
  { value: "multi_select", label: "多选" },
  { value: "textarea", label: "文本框" },
  { value: "number", label: "数值评分" },
  { value: "sort", label: "排序" },
] as const;

export function AdminTemplateForm({
  template,
  versions = [],
  snapshotJson,
}: AdminTemplateFormProps) {
  const router = useRouter();
  const [name, setName] = useState(template?.name ?? "");
  const [description, setDescription] = useState(template?.description ?? "");
  const [status, setStatus] = useState(template?.status ?? "draft");
  const [sections, setSections] = useState<TemplateSection[]>(
    snapshotJson?.sections ?? []
  );
  const [error, setError] = useState("");

  function addSection() {
    const newSection: TemplateSection = {
      key: `section_${Date.now()}`,
      title: "",
      fields: [],
    };
    setSections([...sections, newSection]);
  }

  function removeSection(index: number) {
    setSections(sections.filter((_, i) => i !== index));
  }

  function updateSection(index: number, updates: Partial<TemplateSection>) {
    setSections(
      sections.map((s, i) => (i === index ? { ...s, ...updates } : s))
    );
  }

  function addField(sectionIndex: number) {
    const newField: TemplateField = {
      key: `field_${Date.now()}`,
      label: "",
      type: "single_select",
      options: [],
    };
    const updated = [...sections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      fields: [...updated[sectionIndex].fields, newField],
    };
    setSections(updated);
  }

  function removeField(sectionIndex: number, fieldIndex: number) {
    const updated = [...sections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      fields: updated[sectionIndex].fields.filter((_, i) => i !== fieldIndex),
    };
    setSections(updated);
  }

  function updateField(
    sectionIndex: number,
    fieldIndex: number,
    updates: Partial<TemplateField>
  ) {
    const updated = [...sections];
    updated[sectionIndex] = {
      ...updated[sectionIndex],
      fields: updated[sectionIndex].fields.map((f, i) =>
        i === fieldIndex ? { ...f, ...updates } : f
      ),
    };
    setSections(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("模板名称为必填项");
      return;
    }

    if (sections.length === 0) {
      setError("至少需要一个分组");
      return;
    }

    const hasEmptySection = sections.some((s) => !s.title.trim());
    if (hasEmptySection) {
      setError("分组标题不能为空");
      return;
    }

    const hasEmptyField = sections.some((s) =>
      s.fields.some((f) => !f.label.trim())
    );
    if (hasEmptyField) {
      setError("字段名称不能为空");
      return;
    }

    const formData = new FormData();
    if (template?.id) {
      formData.set("id", template.id);
    }
    formData.set("name", name);
    formData.set("description", description);
    formData.set("status", status);
    formData.set("snapshot", JSON.stringify({ sections }));

    try {
      await saveTemplateAction(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">模板名称</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：啤酒品鉴表中文版"
            />
          </label>
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">状态</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="archived">已归档</option>
            </select>
          </label>
          <label className="space-y-3 md:col-span-2">
            <span className="text-sm font-medium text-muted-strong">描述</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-7 outline-none"
              placeholder="模板的用途说明"
            />
          </label>
        </div>
      </section>

      {versions.length > 0 && (
        <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-sm font-medium text-muted-strong">历史版本</p>
          <div className="mt-3 space-y-2">
            {versions.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-[16px] border border-white/8 bg-white/[0.02] px-4 py-3 text-sm"
              >
                <span className="text-muted">
                  V{v.versionNumber} · {v.fieldCount} 个字段
                </span>
                <span className="text-muted">
                  {v.publishedAt
                    ? new Date(v.publishedAt).toLocaleDateString("zh-CN")
                    : "未发布"}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-foreground">分组与字段</p>
          <button
            type="button"
            onClick={addSection}
            className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
          >
            添加分组
          </button>
        </div>

        <div className="mt-6 space-y-6">
          {sections.map((section, sectionIndex) => (
            <div
              key={section.key}
              className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
            >
              <div className="flex items-center gap-3">
                <input
                  value={section.title}
                  onChange={(e) =>
                    updateSection(sectionIndex, { title: e.target.value })
                  }
                  className="flex-1 rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                  placeholder="分组标题（例如：外观）"
                />
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-2 text-xs text-muted hover:border-white/12"
                >
                  删除分组
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {section.fields.map((field, fieldIndex) => (
                  <div
                    key={field.key}
                    className="rounded-[16px] border border-white/5 bg-white/[0.02] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        value={field.label}
                        onChange={(e) =>
                          updateField(sectionIndex, fieldIndex, {
                            label: e.target.value,
                          })
                        }
                        className="flex-1 rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-2 text-sm outline-none"
                        placeholder="字段名称"
                      />
                      <select
                        value={field.type}
                        onChange={(e) =>
                          updateField(sectionIndex, fieldIndex, {
                            type: e.target.value as TemplateField["type"],
                          })
                        }
                        className="rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-2 text-sm outline-none"
                      >
                        {FIELD_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeField(sectionIndex, fieldIndex)}
                        className="rounded-full border border-white/8 bg-white/[0.04] px-2 py-1.5 text-xs text-muted hover:border-white/12"
                      >
                        ×
                      </button>
                    </div>

                    {(field.type === "single_select" ||
                      field.type === "multi_select") && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs text-muted">选项（每行一个）</p>
                        <textarea
                          value={(field.options ?? []).join("\n")}
                          onChange={(e) =>
                            updateField(sectionIndex, fieldIndex, {
                              options: e.target.value
                                .split("\n")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                          rows={3}
                          className="w-full rounded-[14px] border border-white/8 bg-white/[0.04] px-3 py-2 text-sm leading-6 outline-none"
                          placeholder="选项1&#10;选项2&#10;选项3"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addField(sectionIndex)}
                className="mt-4 rounded-full border border-dashed border-white/12 px-3 py-2 text-xs text-muted transition hover:border-white/20 hover:text-foreground"
              >
                + 添加字段
              </button>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-muted">
              还没有添加分组，点击上方「添加分组」开始配置。
            </div>
          )}
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full border border-white/8 bg-white/[0.04] px-5 py-3 text-sm text-muted transition hover:border-white/12 hover:text-foreground"
        >
          取消
        </button>
        <button
          type="submit"
          className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-5 py-3 text-sm font-semibold text-[#2b2114] shadow-[0_18px_40px_rgba(215,163,61,0.18)]"
        >
          保存模板
        </button>
      </div>
    </form>
  );
}