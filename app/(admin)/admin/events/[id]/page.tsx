import { notFound } from "next/navigation";
import Link from "next/link";

import { AdminEventForm } from "@/components/admin/admin-event-form";
import { getAdminEventEditorData } from "@/lib/data/admin";

type AdminEventDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEventDetailPage({
  params,
}: AdminEventDetailPageProps) {
  const { id } = await params;
  const data = await getAdminEventEditorData(id);

  if (!data.event) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Edit Event</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            编辑活动
          </h2>
        </div>
        <Link
          href={`/admin/events/${id}/beers`}
          className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
        >
          管理活动酒款
        </Link>
      </div>
      <AdminEventForm {...data} />
    </div>
  );
}
