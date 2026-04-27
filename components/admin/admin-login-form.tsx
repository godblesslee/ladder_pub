"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminLoginFormProps = {
  onSuccess?: () => void;
};

export function AdminLoginForm({ onSuccess }: AdminLoginFormProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/admin");
          router.refresh();
        }
      } else {
        setError(data.error || "登录失败");
      }
    } catch {
      setError("登录失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm px-4">
        <div className="section-card rounded-[28px] px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">管理员登录</h1>
            <p className="mt-2 text-sm text-muted">输入密码以访问后台</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-muted-strong">密码</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                placeholder="输入管理员密码"
                required
              />
            </label>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-5 py-3 text-sm font-semibold text-[#2b2114] shadow-[0_18px_40px_rgba(215,163,61,0.18)] disabled:opacity-50"
            >
              {loading ? "登录中..." : "登录"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}