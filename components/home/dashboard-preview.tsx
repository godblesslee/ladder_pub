const previewColumns = [
  {
    title: "已上线活动",
    items: ["5 月 1 日啤酒入门评测活动", "山系 IPA 对照场", "六月盲评局"],
  },
  {
    title: "我参与的活动",
    items: ["5 月 1 日啤酒入门评测活动", "山系 IPA 对照场"],
  },
  {
    title: "我测评过的酒",
    items: ["科罗娜 7.8", "柏龙小麦白啤酒 8.4", "社交 IPA 8.6"],
  },
];

export function DashboardPreview() {
  return (
    <div className="section-card relative rounded-[36px] border border-border bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(239,228,208,0.9))] p-5 sm:p-6">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-soft/40 blur-3xl" />
      <div className="relative space-y-5">
        <div className="flex items-start justify-between gap-4 rounded-[28px] bg-[#2f2118] px-5 py-5 text-white shadow-xl shadow-[#6c461c]/15">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/60">
              Home Preview
            </p>
            <p className="mt-2 text-2xl font-semibold">小酒馆</p>
            <p className="mt-2 text-sm text-white/70">线下品鉴数字化工作台</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-3 py-2 text-right">
            <p className="text-xs text-white/60">Current</p>
            <p className="mt-1 text-sm font-semibold">MVP Design</p>
          </div>
        </div>

        <div className="grid gap-4">
          {previewColumns.map((column) => (
            <section
              key={column.title}
              className="rounded-[24px] border border-border bg-white/80 p-4"
            >
              <p className="text-sm font-semibold text-accent">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-2xl bg-surface px-3 py-2 text-sm text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
