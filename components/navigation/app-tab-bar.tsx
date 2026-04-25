"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

type AppTabBarProps = {
  currentPath?: string;
};

const tabs = [
  { href: "/", label: "首页", icon: HomeIcon },
  { href: "/my-events", label: "活动", icon: CalendarIcon },
  { href: "/my-beers", label: "酒款", icon: GlassIcon },
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
        d="M7.35 4.85H14.95V18.45C14.95 18.8918 14.5918 19.25 14.15 19.25H8.15C7.70817 19.25 7.35 18.8918 7.35 18.45V4.85Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14.95 6.1H15.95C17.1098 6.1 18.05 7.0402 18.05 8.2V10.4C18.05 11.5598 17.1098 12.5 15.95 12.5H14.95"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8.7 8.4H13.2M8.7 11.7H13.2M8.7 15H13.2"
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
  const [previewPath, setPreviewPath] = useState<string | null>(null);
  const resolvedPath = previewPath ?? activePath;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom,0px)+10px)] pt-2">
      <div className="relative mx-auto flex w-full max-w-[600px] items-center justify-between gap-1 rounded-[26px] border border-white/10 bg-[linear-gradient(180deg,rgba(44,39,35,0.9),rgba(27,24,22,0.82))] p-1.5 shadow-[0_22px_60px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-[26px]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.34),transparent)]" />
        {tabs.map((tab) => {
          const isActive = isActiveTab(resolvedPath, tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onPointerDown={() => setPreviewPath(tab.href)}
              onClick={() => setPreviewPath(tab.href)}
              className="group relative flex flex-1 items-center justify-center rounded-full px-2 py-1 text-center transition-all duration-200"
            >
              <span
                className={`absolute inset-0 rounded-full border transition-all duration-200 ${
                  isActive
                    ? "border-[rgba(215,163,61,0.22)] bg-[linear-gradient(180deg,rgba(215,163,61,0.26),rgba(215,163,61,0.1))] shadow-[0_10px_24px_rgba(215,163,61,0.14),inset_0_1px_0_rgba(255,244,214,0.18)] backdrop-blur-[18px]"
                    : "border-transparent bg-transparent group-hover:border-white/8 group-hover:bg-white/[0.04]"
                }`}
              />
              <span
                className={`pointer-events-none absolute inset-x-4 top-0.5 h-px rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,230,171,0.7),transparent)] transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0"
                }`}
              />
              <span className="relative flex min-w-0 flex-col items-center justify-center py-0.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center transition-all duration-200 ${
                    isActive
                      ? "text-[rgba(255,248,238,0.98)]"
                      : "bg-transparent text-[rgba(232,223,214,0.72)] group-hover:text-[rgba(245,239,230,0.9)]"
                  }`}
                >
                  <Icon />
                </span>
                <span
                  className={`mt-0.5 text-[10px] font-medium tracking-[0.06em] transition-colors duration-200 ${
                    isActive
                      ? "text-[rgba(255,248,238,0.96)]"
                      : "text-[rgba(217,206,193,0.74)]"
                  }`}
                >
                  {tab.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
