import { AdminBeerForm } from "@/components/admin/admin-beer-form";

export default function AdminNewBeerPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Create Beer</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          新建酒款
        </h2>
      </div>
      <AdminBeerForm beer={null} />
    </div>
  );
}
