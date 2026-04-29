import Link from "next/link";

import { getAdminBeers } from "@/lib/data/admin";

export default async function AdminBeersPage() {
  const beers = await getAdminBeers();

  return (
    <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">酒款库</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            维护可复用的酒款基础信息，再在活动里选择并加入对应场次。
          </p>
        </div>
        <Link
          href="/admin/beers/new"
          className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
        >
          新建酒款
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {beers.map((beer) => (
          <Link
            key={beer.id}
            href={`/admin/beers/${beer.id}`}
            className="grid gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4 transition hover:border-white/12 hover:bg-white/[0.05] md:grid-cols-[minmax(0,2fr)_1.2fr_140px]"
          >
            <div className="min-w-0">
              <p className="truncate text-base font-medium text-foreground">
                {beer.productName}
              </p>
              <p className="mt-1 text-sm text-muted">
                {beer.breweryName} · {beer.styleName}
              </p>
            </div>
            <div className="text-sm text-muted">
              {beer.abv ? `ABV ${beer.abv}%` : "ABV --"}
              {beer.volumeMl ? ` · ${beer.volumeMl}ml` : ""}
              {beer.countryCode ? ` · ${beer.countryCode}` : ""}
            </div>
            <div className="text-sm text-muted md:text-right">{beer.updatedAtLabel}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
