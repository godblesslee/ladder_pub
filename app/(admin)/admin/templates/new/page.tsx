import { AdminTemplateForm } from "@/components/admin/admin-template-form";

export default function NewTemplatePage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">New Template</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          新建模板
        </h2>
      </div>
      <AdminTemplateForm />
    </div>
  );
}