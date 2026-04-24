import { PageIntro } from "@/components/shared/page-intro";

const adminCards = [
  {
    title: "活动管理",
    description: "创建活动、设置时间地点、上线状态与活动封面。",
  },
  {
    title: "酒款数据库",
    description: "维护厂牌、名称、风格、容量、国别、ABV 与图片。",
  },
  {
    title: "模板管理",
    description: "按分组配置测评字段、选项、排序与是否必填。",
  },
  {
    title: "测评记录",
    description: "查看提交进度、活动结果与公开分享内容。",
  },
];

export default function AdminPage() {
  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="Admin"
          title="后台骨架"
          description="这里是组织者工作台的入口。后续会继续拆成活动、酒款、模板和记录等子模块。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {adminCards.map((card) => (
            <article
              key={card.title}
              className="section-card rounded-[28px] p-6"
            >
              <h2 className="text-2xl font-semibold">{card.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
