type AdminOverviewCardsProps = {
  eventCount: number;
  beerCount: number;
  publishedEventCount: number;
  latestEventTitle: string | null;
};

const cards = [
  {
    key: "eventCount",
    label: "活动总数",
    description: "已创建的活动",
  },
  {
    key: "beerCount",
    label: "酒款库",
    description: "可复用的酒款条目",
  },
  {
    key: "publishedEventCount",
    label: "已上线活动",
    description: "对用户可见的场次",
  },
];

export function AdminOverviewCards({
  eventCount,
  beerCount,
  publishedEventCount,
  latestEventTitle,
}: AdminOverviewCardsProps) {
  const values = {
    eventCount,
    beerCount,
    publishedEventCount,
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article
          key={card.key}
          className="section-card rounded-[28px] px-5 py-5 sm:px-6"
        >
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
            {card.label}
          </p>
          <p className="mt-4 text-4xl font-semibold text-foreground">
            {values[card.key as keyof typeof values]}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted">{card.description}</p>
        </article>
      ))}

      <article className="section-card rounded-[28px] px-5 py-5 sm:col-span-3 sm:px-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
          最近活动
        </p>
        <p className="mt-4 text-xl font-semibold text-foreground">
          {latestEventTitle ?? "还没有最新活动"}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          先从“活动管理”进入，你可以继续编辑活动基础信息、配置本场酒款和绑定测评模板。
        </p>
      </article>
    </div>
  );
}
