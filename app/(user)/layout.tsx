import { headers } from "next/headers";

import { AppTabBar } from "@/components/navigation/app-tab-bar";

export default async function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const currentPath = headersList.get("x-current-pathname") ?? "/";

  return (
    <div className="app-frame">
      <div className="app-screen">{children}</div>
      <AppTabBar currentPath={currentPath} />
    </div>
  );
}
