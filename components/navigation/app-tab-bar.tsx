"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AppTabBarProps = {
  currentPath?: string;
};

const tabs = [
  { href: "/", label: "首页", icon: HomeIcon },
  { href: "/my-events", label: "活动", icon: CalendarIcon },
  { href: "/my-beers", label: "酒单", icon: GlassIcon },
];

function isActiveTab(currentPath: string, href: string) {
  if (href === "/") {
    return currentPath === "/";
  }

  if (href === "/my-events") {
    return (
      currentPath === "/my-events" ||
      currentPath.startsWith("/my-events/") ||
      currentPath === "/events" ||
      (currentPath.startsWith("/events/") && !currentPath.includes("/beers/"))
    );
  }

  if (href === "/my-beers") {
    return (
      currentPath === "/my-beers" ||
      currentPath.startsWith("/my-beers/") ||
      currentPath.includes("/beers/")
    );
  }

  return currentPath === href || currentPath.startsWith(`${href}/`);
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M4.75 10.25L12 4.75L19.25 10.25V18.25C19.25 18.6642 18.9142 19 18.5 19H14.25V14.75C14.25 14.3358 13.9142 14 13.5 14H10.5C10.0858 14 9.75 14.3358 9.75 14.75V19H5.5C5.08579 19 4.75 18.6642 4.75 18.25V10.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 3.75V6.25M17 3.75V6.25M4.75 8.25H19.25M6 20.25H18C18.6904 20.25 19.25 19.6904 19.25 19V7C19.25 6.30964 18.6904 5.75 18 5.75H6C5.30964 5.75 4.75 6.30964 4.75 7V19C4.75 19.6904 5.30964 20.25 6 20.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.25 11.5H8.26M12 11.5H12.01M15.75 11.5H15.76M8.25 15.25H8.26M12 15.25H12.01M15.75 15.25H15.76"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
      <path
        d="M7 5.25H17L16 11.75C15.7319 13.4922 14.2314 14.75 12.4688 14.75H11.5312C9.76863 14.75 8.26814 13.4922 8 11.75L7 5.25Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 5.25V4.5C9.25 4.08579 9.58579 3.75 10 3.75H14C14.4142 3.75 14.75 4.08579 14.75 4.5V5.25M10.5 14.75V18.25M13.5 14.75V18.25M8.25 18.25H15.75"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppTabBar({ currentPath }: AppTabBarProps) {
  const pathname = usePathname();
  const activePath = pathname ?? currentPath ?? "/";

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2">
      <div className="mx-auto flex w-full max-w-[680px] items-center justify-between gap-2 rounded-[28px] border border-white/8 bg-[rgba(21,18,16,0.92)] p-1.5 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {tabs.map((tab) => {
          const isActive = isActiveTab(activePath, tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`group relative flex flex-1 flex-col items-center justify-center rounded-[20px] px-3 py-2 text-center transition-all duration-200 ${
                isActive
                  ? "bg-[linear-gradient(180deg,rgba(215,163,61,0.24),rgba(215,163,61,0.08))] text-white shadow-[0_14px_30px_rgba(215,163,61,0.16),inset_0_1px_0_rgba(255,255,255,0.08)]"
                  : "text-muted hover:bg-white/4"
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  isActive
                    ? "bg-white/8 text-accent-strong"
                    : "bg-transparent text-muted group-hover:text-muted-strong"
                }`}
              >
                <Icon />
              </span>
              <span className="mt-1.5 text-[11px] font-medium tracking-[0.12em]">
                {tab.label}
              </span>
              {isActive ? (
                <span className="mt-1.5 h-1 w-5 rounded-full bg-accent-strong" />
              ) : (
                <span className="mt-1.5 h-1 w-5 rounded-full bg-transparent" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
