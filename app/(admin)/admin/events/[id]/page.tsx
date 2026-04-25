import { notFound } from "next/navigation";

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
      <div>
        <p className="eyebrow">Edit Event</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          编辑活动
        </h2>
      </div>
      <AdminEventForm {...data} />
    </div>
  );
}
