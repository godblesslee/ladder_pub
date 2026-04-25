"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminTabs = [
  { href: "/admin", label: "总览" },
  { href: "/admin/events", label: "活动管理" },
  { href: "/admin/beers", label: "酒款库" },
];

export function AdminTabs() {
  const pathname = usePathname() ?? "/admin";

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {adminTabs.map((tab) => {
        const isActive =
          tab.href === "/admin"
            ? pathname === "/admin"
            : pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-4 py-2.5 text-sm transition ${
              isActive
                ? "bg-[rgba(215,163,61,0.14)] text-accent-strong"
                : "bg-white/[0.04] text-muted hover:bg-white/[0.06] hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
