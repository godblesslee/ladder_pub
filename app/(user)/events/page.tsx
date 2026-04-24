import { PageIntro } from "@/components/shared/page-intro";
import { sampleEvents } from "@/lib/product";

export default function EventsPage() {
  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="Events"
          title="活动列表"
          description="这里将承接已上线活动、未来活动和活动详情入口。当前先用静态内容占位，后续接数据库。"
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {sampleEvents.map((event) => (
            <article
              key={event.title}
              className="section-card rounded-[28px] p-6"
            >
              <p className="text-sm font-semibold text-accent">{event.status}</p>
              <h2 className="mt-3 text-2xl font-semibold">{event.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                {event.description}
              </p>
              <p className="mt-6 text-sm text-muted">
                {event.date} · {event.location}
              </p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
