import Link from "next/link";

import { getAdminTemplates } from "@/lib/data/admin";

export default async function AdminTemplatesPage() {
  const templates = await getAdminTemplates();

  return (
    <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">模板管理</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            配置活动测评表单的结构与字段，每场活动绑定一个版本。
          </p>
        </div>
        <Link
          href="/admin/templates/new"
          className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
        >
          新建模板
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {templates.length === 0 ? (
          <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-muted">
            还没有模板，可以新建一个来开始配置。
          </div>
        ) : (
          templates.map((template) => (
            <Link
              key={template.id}
              href={`/admin/templates/${template.id}`}
              className="grid gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/12 hover:bg-white/[0.05] md:grid-cols-[minmax(0,2fr)_1fr_1fr_140px]"
            >
              <div className="min-w-0">
                <p className="truncate text-base font-medium text-foreground">
                  {template.name}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {template.description || "暂无描述"}
                </p>
              </div>
              <div className="text-sm text-muted">
                {template.versionCount} 个版本 · {template.latestVersionLabel}
              </div>
              <div className="text-sm text-muted">{template.updatedAtLabel}</div>
              <div className="flex items-center justify-end">
                <span className="rounded-full bg-white/[0.05] px-3 py-1.5 text-xs text-muted-strong">
                  {template.status}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}