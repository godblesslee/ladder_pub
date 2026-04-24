type SourceBadgeProps = {
  source: "database" | "fallback";
  fallbackLabel?: string;
};

export function SourceBadge({
  source,
  fallbackLabel = "当前展示的是本地示例数据，等远程表结构推送后会自动切到 Supabase 数据。",
}: SourceBadgeProps) {
  if (source === "database") {
    return (
      <p className="rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm text-success">
        当前内容来自 Supabase 远程数据。
      </p>
    );
  }

  return (
    <p className="rounded-2xl border border-border bg-white/70 px-4 py-3 text-sm text-muted">
      {fallbackLabel}
    </p>
  );
}
