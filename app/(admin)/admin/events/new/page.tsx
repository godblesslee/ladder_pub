import { AdminEventForm } from "@/components/admin/admin-event-form";
import { getAdminEventEditorData } from "@/lib/data/admin";

export default async function AdminNewEventPage() {
  const data = await getAdminEventEditorData();

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Create Event</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          新建活动
        </h2>
      </div>
      <AdminEventForm {...data} />
    </div>
  );
}
