import { notFound } from "next/navigation";
import Link from "next/link";

import { getAdminBeerDetailData } from "@/lib/data/admin";

type AdminBeerDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function mapCountryCodeLabel(value: string | null) {
  switch (value) {
    case "CN":
      return "中国";
    case "DE":
      return "德国";
    case "BE":
      return "比利时";
    case "US":
      return "美国";
    case "GB":
      return "英国";
    case "JP":
      return "日本";
    case "NL":
      return "荷兰";
    default:
      return value ?? "未知";
  }
}

export default async function AdminBeerDetailPage({
  params,
}: AdminBeerDetailPageProps) {
  const { id } = await params;
  const data = await getAdminBeerDetailData(id);

  if (!data.beer) {
    notFound();
  }

  const { beer } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">Beer Detail</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            酒款详情
          </h2>
        </div>
        <Link
          href={`/admin/beers/${id}/edit`}
          className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-4 py-2.5 text-sm font-semibold text-[#2b2114]"
        >
          编辑酒款
        </Link>
      </div>

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs text-muted">厂牌</p>
            <p className="mt-1 text-base font-medium text-foreground">{beer.breweryName}</p>
          </div>
          <div>
            <p className="text-xs text-muted">产品名称</p>
            <p className="mt-1 text-base font-medium text-foreground">{beer.productName}</p>
          </div>
          <div>
            <p className="text-xs text-muted">种类</p>
            <p className="mt-1 text-base font-medium text-foreground">{beer.styleName}</p>
          </div>
          <div>
            <p className="text-xs text-muted">酒精度</p>
            <p className="mt-1 text-base font-medium text-foreground">
              {beer.abv ? `${beer.abv}%` : "未设置"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">容量</p>
            <p className="mt-1 text-base font-medium text-foreground">
              {beer.volumeMl ? `${beer.volumeMl}ml` : "未设置"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">国别</p>
            <p className="mt-1 text-base font-medium text-foreground">
              {mapCountryCodeLabel(beer.countryCode)}
            </p>
          </div>
          {beer.retailPriceRange && (
            <div>
              <p className="text-xs text-muted">价格区间</p>
              <p className="mt-1 text-base font-medium text-foreground">{beer.retailPriceRange}</p>
            </div>
          )}
        </div>

        {beer.imageUrl && (
          <div className="mt-6">
            <p className="text-xs text-muted">图片</p>
            <img
              src={beer.imageUrl}
              alt={beer.productName}
              className="mt-2 max-w-[200px] rounded-[16px] border border-white/8"
            />
          </div>
        )}

        {beer.description && (
          <div className="mt-6">
            <p className="text-xs text-muted">描述</p>
            <p className="mt-2 text-sm leading-7 text-muted">{beer.description}</p>
          </div>
        )}
      </section>
    </div>
  );
}