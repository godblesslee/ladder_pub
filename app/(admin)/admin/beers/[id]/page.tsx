import { notFound } from "next/navigation";

import { AdminBeerForm } from "@/components/admin/admin-beer-form";
import { getAdminBeerEditorData } from "@/lib/data/admin";

type AdminBeerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminBeerDetailPage({
  params,
}: AdminBeerDetailPageProps) {
  const { id } = await params;
  const data = await getAdminBeerEditorData(id);

  if (!data.beer) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Edit Beer</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          编辑酒款
        </h2>
      </div>
      <AdminBeerForm beer={data.beer} />
    </div>
  );
}
