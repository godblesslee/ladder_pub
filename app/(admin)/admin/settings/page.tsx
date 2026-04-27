import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow">Settings</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
          后台设置
        </h2>
      </div>

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="mb-6">
          <p className="text-lg font-semibold text-foreground">修改管理员密码</p>
          <p className="mt-2 text-sm leading-6 text-muted">
            默认密码为 123456，登录后请及时修改。
          </p>
        </div>
        <AdminSettingsForm />
      </section>
    </div>
  );
}