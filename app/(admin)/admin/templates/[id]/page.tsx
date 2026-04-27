import { notFound } from "next/navigation";

import { AdminTemplateForm } from "@/components/admin/admin-template-form";
import { getAdminTemplateEditorData } from "@/lib/data/admin";

type AdminTemplateDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminTemplateDetailPage({
  params,
}: AdminTemplateDetailPageProps) {
  const { id } = await params;
  const data = await getAdminTemplateEditorData(id);

  if (!data.template) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Edit Template</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          编辑模板
        </h2>
      </div>
      <AdminTemplateForm
        template={data.template}
        versions={data.versions}
        snapshotJson={data.snapshotJson}
      />
    </div>
  );
}