"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm text-muted transition hover:border-white/12 hover:text-foreground"
    >
      退出登录
    </button>
  );
}
