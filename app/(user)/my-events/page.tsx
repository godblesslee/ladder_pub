import { PageIntro } from "@/components/shared/page-intro";

const myEvents = [
  { title: "比利时修道院风格夜", time: "2026-05-10 19:30", progress: "已完成 3 / 6" },
  { title: "山系 IPA 对照场", time: "2026-05-24 20:00", progress: "未开始" },
];

export default function MyEventsPage() {
  return (
    <main className="grain min-h-screen py-14">
      <div className="page-shell">
        <PageIntro
          eyebrow="My Events"
          title="我参与的活动"
          description="后续这里会按时间先后排序，并显示每场活动的完成进度。"
        />
        <div className="mt-8 space-y-4">
          {myEvents.map((event) => (
            <article
              key={event.title}
              className="section-card rounded-[24px] p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{event.title}</h2>
                  <p className="mt-2 text-sm text-muted">{event.time}</p>
                </div>
                <span className="rounded-full bg-surface-strong px-3 py-2 text-sm font-medium text-accent">
                  {event.progress}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
