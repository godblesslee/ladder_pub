import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold text-foreground mb-2">
          登录链接无效
        </h1>
        <p className="text-sm text-muted mb-8">
          链接已过期或已被使用，请重新获取登录链接。
        </p>

        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl bg-accent text-background font-semibold text-sm transition-all hover:bg-accent-strong"
        >
          返回登录
        </Link>
      </div>
    </div>
  );
}
