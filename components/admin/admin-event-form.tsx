 "use client";

import { useMemo, useState } from "react";

import { saveEventAction } from "@/app/(admin)/admin/actions";
import { DEFAULT_EVENT_LOCATION } from "@/lib/data/admin";
import type {
  AdminAssignedBeer,
  AdminBeerOption,
  AdminTemplateOption,
} from "@/lib/data/admin";

type AdminEventFormProps = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    startAt: string;
    endAt: string;
    coverImageUrl: string;
    status: "draft" | "published" | "ongoing" | "ended";
    templateVersionId: string;
    publishedAt: string;
  } | null;
  templates: AdminTemplateOption[];
  beers: AdminBeerOption[];
  assignedBeers: AdminAssignedBeer[];
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
      return value;
  }
}

export function AdminEventForm({
  event,
  templates,
  beers,
  assignedBeers,
}: AdminEventFormProps) {
  const [query, setQuery] = useState("");
  const [locationMode, setLocationMode] = useState(
    !event?.location || event.location === DEFAULT_EVENT_LOCATION ? "preset" : "custom",
  );
  const assignedBeerMap = new Map(
    assignedBeers.map((item) => [item.beerId, item]),
  );
  const selectedBeers = beers.filter((beer) => assignedBeerMap.has(beer.id));
  const filteredBeers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return beers;
    }

    return beers.filter((beer) =>
      [beer.productName, beer.breweryName, beer.styleName]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [beers, query]);

  return (
    <form action={saveEventAction} className="space-y-6">
      <input type="hidden" name="id" value={event?.id ?? ""} />
      <input type="hidden" name="publishedAt" value={event?.publishedAt ?? ""} />

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-x-5 gap-y-7 md:grid-cols-2">
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">活动标题</span>
            <input
              name="title"
              defaultValue={event?.title ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：5 月城市拉格入门夜"
            />
          </label>
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">活动链接标识</span>
            <input
              name="slug"
              defaultValue={event?.slug ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="留空则按标题自动生成"
            />
            <p className="min-h-[24px] text-xs leading-6 text-muted">
              用于活动详情页链接地址，通常不用手动改。
            </p>
          </label>
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">开始时间</span>
            <input
              type="datetime-local"
              name="startAt"
              defaultValue={event?.startAt ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            />
          </label>
          <label className="space-y-3">
            <span className="text-sm font-medium text-muted-strong">结束时间</span>
            <input
              type="datetime-local"
              name="endAt"
              defaultValue={event?.endAt ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            />
          </label>
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-strong">地点</span>
              <button
                type="button"
                onClick={() => setLocationMode("preset")}
                className={`rounded-full px-3 py-2 text-xs transition ${
                  locationMode === "preset"
                    ? "bg-[rgba(215,163,61,0.14)] text-accent-strong"
                    : "bg-white/[0.04] text-muted"
                }`}
              >
                固定地点
              </button>
              <button
                type="button"
                onClick={() => setLocationMode("custom")}
                className={`rounded-full px-3 py-2 text-xs transition ${
                  locationMode === "custom"
                    ? "bg-[rgba(215,163,61,0.14)] text-accent-strong"
                    : "bg-white/[0.04] text-muted"
                }`}
              >
                自定义
              </button>
            </div>
            {locationMode === "preset" ? (
              <select
                name="location"
                defaultValue={
                  event?.location && event.location !== DEFAULT_EVENT_LOCATION
                    ? DEFAULT_EVENT_LOCATION
                    : event?.location ?? DEFAULT_EVENT_LOCATION
                }
                className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              >
                <option value={DEFAULT_EVENT_LOCATION}>{DEFAULT_EVENT_LOCATION}</option>
              </select>
            ) : (
              <input
                name="location"
                defaultValue={
                  event?.location === DEFAULT_EVENT_LOCATION ? "" : event?.location ?? ""
                }
                className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                placeholder="输入其他活动地点"
              />
            )}
          </div>
          <label className="space-y-3 self-start">
            <span className="text-sm font-medium text-muted-strong">状态</span>
            <select
              name="status"
              defaultValue={event?.status ?? "draft"}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            >
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
              <option value="ongoing">进行中</option>
              <option value="ended">已结束</option>
            </select>
          </label>
          <label className="space-y-3 md:col-span-2">
            <span className="text-sm font-medium text-muted-strong">封面图片</span>
            <input
              name="coverImageUrl"
              defaultValue={event?.coverImageUrl ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-3 md:col-span-2">
            <span className="text-sm font-medium text-muted-strong">活动描述</span>
            <textarea
              name="description"
              rows={4}
              defaultValue={event?.description ?? ""}
              className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-7 outline-none"
              placeholder="这场活动的定位、亮点和适合人群。"
            />
          </label>
        </div>
      </section>

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-foreground">测评模板</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              每场活动绑定一个模板版本，前台评测表单会按这里的版本生成。
            </p>
          </div>
        </div>
        <div className="mt-5">
          <select
            name="templateVersionId"
            defaultValue={event?.templateVersionId ?? ""}
            className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
          >
            <option value="">暂不绑定模板</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.label}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">本场酒款配置</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              已加入的酒款单独管理，新增酒款时再从酒款库里搜索加入，后面扩到 100 款也不会乱。
            </p>
          </div>
          <label className="block sm:w-[280px]">
            <span className="sr-only">搜索酒款</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-full border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
              placeholder="搜索厂牌、酒名或种类"
            />
          </label>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3 text-xs text-muted">
            <span>本场已加入 {selectedBeers.length} 款</span>
            <span>在下面可继续添加或移除</span>
          </div>
          <div className="mt-3 space-y-3">
            {selectedBeers.length > 0 ? (
              selectedBeers.map((beer) => {
                const assigned = assignedBeerMap.get(beer.id);

                return (
                  <label
                    key={beer.id}
                    className="grid gap-3 rounded-[22px] border border-[rgba(215,163,61,0.16)] bg-[rgba(215,163,61,0.06)] px-4 py-4 transition md:grid-cols-[auto_minmax(0,2fr)_110px_minmax(0,1.45fr)] md:items-center"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name={`includeBeer:${beer.id}`}
                        defaultChecked
                        className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[var(--accent-strong)]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {beer.productName}
                        </p>
                        <p className="mt-1 text-xs text-muted">
                          {beer.breweryName} · {beer.styleName}
                          {beer.abv ? ` · ABV ${beer.abv}%` : ""}
                          {beer.countryCode
                            ? ` · ${mapCountryCodeLabel(beer.countryCode)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block" />
                    <input
                      type="number"
                      min="1"
                      name={`servingOrder:${beer.id}`}
                      defaultValue={assigned?.servingOrder ?? ""}
                      className="rounded-[16px] border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm outline-none"
                      placeholder="顺序"
                    />
                    <input
                      name={`notes:${beer.id}`}
                      defaultValue={assigned?.notes ?? ""}
                      className="rounded-[16px] border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm outline-none"
                      placeholder="活动内备注"
                    />
                  </label>
                );
              })
            ) : (
              <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-muted">
                这场活动还没有加入酒款。可以从下方酒款库里搜索并勾选加入。
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-white/8 pt-6">
          <div className="flex items-center justify-between gap-3 text-xs text-muted">
            <span>酒款库共 {beers.length} 条</span>
            <span>当前搜索结果 {filteredBeers.length} 条</span>
          </div>
          <div className="mt-3 space-y-3">
          {filteredBeers.map((beer) => {
            const assigned = assignedBeerMap.get(beer.id);

            return (
              <label
                key={beer.id}
                className={`grid gap-3 rounded-[22px] border px-4 py-4 transition md:grid-cols-[auto_minmax(0,2fr)_110px_minmax(0,1.45fr)] md:items-center ${
                  assigned
                    ? "border-[rgba(215,163,61,0.12)] bg-[rgba(215,163,61,0.04)] opacity-75"
                    : "border-white/8 bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name={`includeBeer:${beer.id}`}
                    defaultChecked={Boolean(assigned)}
                    className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-[var(--accent-strong)]"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {beer.productName}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {beer.breweryName} · {beer.styleName}
                      {beer.abv ? ` · ABV ${beer.abv}%` : ""}
                      {beer.countryCode
                        ? ` · ${mapCountryCodeLabel(beer.countryCode)}`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="hidden md:block" />
                <input
                  type="number"
                  min="1"
                  name={`servingOrder:${beer.id}`}
                  defaultValue={assigned?.servingOrder ?? ""}
                  className="rounded-[16px] border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm outline-none"
                  placeholder="顺序"
                  disabled={Boolean(assigned)}
                />
                <input
                  name={`notes:${beer.id}`}
                  defaultValue={assigned?.notes ?? ""}
                  className="rounded-[16px] border border-white/8 bg-white/[0.04] px-3 py-2.5 text-sm outline-none"
                  placeholder="活动内备注"
                  disabled={Boolean(assigned)}
                />
              </label>
            );
          })}
          {filteredBeers.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-muted">
              没有找到匹配的酒款，可以先去酒款库新建，再回来加入活动。
            </div>
          ) : null}
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-5 py-3 text-sm font-semibold text-[#2b2114] shadow-[0_18px_40px_rgba(215,163,61,0.18)]"
        >
          保存活动
        </button>
      </div>
    </form>
  );
}
