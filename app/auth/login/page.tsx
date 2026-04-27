"use client";

import { useState } from "react";
import { sendMagicLink } from "@/lib/supabase/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isLoading) return;
    if (!email) return;

    setIsLoading(true);
    setMessage(null);

    const result = await sendMagicLink(email);

    if (result.success) {
      setMessage({
        type: "success",
        text: "登录链接已发送到邮箱，请查收。",
      });
      setEmail("");
    } else {
      setMessage({
        type: "error",
        text: result.error || "发送失败，请稍后重试。",
      });
    }

    setIsLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-soft border border-accent/20 mb-6">
            <svg
              className="w-8 h-8 text-accent"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            登录小酒馆
          </h1>
          <p className="text-sm text-muted">
            输入邮箱，获取登录链接
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-strong mb-2"
            >
              邮箱地址
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/30 transition-all disabled:opacity-50"
            />
          </div>

          {message && (
            <div
              className={`px-4 py-3 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-success/10 border border-success/20 text-success"
                  : "bg-red-500/10 border border-red-500/20 text-red-400"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-accent text-background font-semibold text-sm transition-all hover:bg-accent-strong disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "发送中..." : "发送登录链接"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-muted/60">
          登录即表示你同意我们的服务条款
        </p>
      </div>
    </div>
  );
}
