import Link from "next/link";

import { DashboardPreview } from "@/components/home/dashboard-preview";
import { SectionHeader } from "@/components/shared/section-header";
import {
  appModules,
  implementationSteps,
  organizerNeeds,
  platformPrinciples,
  sampleEvents,
} from "@/lib/product";

export default function Home() {
  return (
    <main className="grain min-h-screen pb-20">
      <section className="hero-grid overflow-hidden border-b border-border/80">
        <div className="page-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="eyebrow">Beer Tasting System</p>
                <div className="space-y-5">
                  <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl">
                    把纸质啤酒品鉴表，升级成真正可运营的活动系统。
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-muted">
                    这是一套面向线下品鉴活动的 Web App 骨架：用户可以按活动逐款测评，组织者可以维护酒款数据库与模板，历史记录还能沉淀成自己的品鉴档案。
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/events"
                  className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
                >
                  查看活动入口
                </Link>
                <Link
                  href="/admin"
                  className="rounded-full border border-border bg-white/70 px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
                >
                  查看后台骨架
                </Link>
              </div>

              <div className="flex flex-wrap gap-3">
                {platformPrinciples.map((item) => (
                  <span
                    key={item}
                    className="pill rounded-full px-4 py-2 text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <DashboardPreview />
          </div>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-18">
        <SectionHeader
          eyebrow="Core Modules"
          title="首批实现聚焦这 3 个用户视角"
          description="先把活动现场真的能用起来，再往社交和运营能力迭代。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {appModules.map((module) => (
            <article
              key={module.title}
              className="section-card rounded-[28px] p-6"
            >
              <p className="text-sm font-semibold text-accent">{module.title}</p>
              <p className="mt-3 text-sm leading-7 text-muted">
                {module.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell py-6">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-card rounded-[30px] p-7">
            <SectionHeader
              eyebrow="Organizer"
              title="组织者端必须先解决的 4 件事"
              description="这部分决定了模板能不能复用、活动能不能快速配置。"
            />
            <ul className="mt-6 space-y-4">
              {organizerNeeds.map((item) => (
                <li
                  key={item.title}
                  className="rounded-2xl border border-border bg-white/60 p-4"
                >
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-muted">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="section-card rounded-[30px] p-7">
            <SectionHeader
              eyebrow="Implementation"
              title="推荐开发顺序"
              description="现在仓库已经进入实现准备阶段，下一步就可以按里程碑推进。"
            />
            <ol className="mt-6 space-y-4">
              {implementationSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid gap-3 rounded-2xl border border-border bg-white/60 p-4 md:grid-cols-[44px_1fr]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="mt-2 text-sm leading-7 text-muted">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="page-shell py-14">
        <SectionHeader
          eyebrow="Preview"
          title="首页会先呈现什么"
          description="这里用静态数据模拟了活动列表，后续接上 Supabase 后可以直接替换。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {sampleEvents.map((event) => (
            <article
              key={event.title}
              className="section-card rounded-[28px] p-6"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-surface-strong px-3 py-1 text-xs font-semibold text-accent">
                  {event.status}
                </span>
                <span className="text-sm text-muted">{event.date}</span>
              </div>
              <h2 className="mt-5 text-2xl font-semibold text-foreground">
                {event.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {event.description}
              </p>
              <div className="mt-6 flex items-center justify-between text-sm text-muted">
                <span>{event.location}</span>
                <span>{event.beerCount} 款酒</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
