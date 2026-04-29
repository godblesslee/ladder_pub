"use client";

import { useState, useEffect } from "react";
import { saveBeerAction } from "@/app/(admin)/admin/actions";

type AdminBeerFormProps = {
  beer: {
    id: string;
    breweryName: string;
    productName: string;
    styleName: string;
    abv: string;
    volumeMl: string;
    countryCode: string;
    imageUrl: string;
    description: string;
  } | null;
};

export function AdminBeerForm({ beer }: AdminBeerFormProps) {
  const [breweryName, setBreweryName] = useState(beer?.breweryName ?? "");
  const [breweries, setBreweries] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchBreweries() {
      try {
        const res = await fetch("/api/admin/breweries");
        if (res.ok) {
          const data = await res.json();
          setBreweries(data.breweries);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchBreweries();
  }, []);

  const filteredBreweries = breweryName
    ? breweries.filter((b) =>
        b.toLowerCase().includes(breweryName.toLowerCase())
      )
    : breweries;

  function handleBreweryChange(value: string) {
    setBreweryName(value);
    setShowSuggestions(true);
  }

  function handleSelectBrewery(brewery: string) {
    setBreweryName(brewery);
    setShowSuggestions(false);
  }

  function handleBreweryBlur() {
    setTimeout(() => setShowSuggestions(false), 150);
  }

  return (
    <form action={saveBeerAction} className="space-y-6">
      <input type="hidden" name="id" value={beer?.id ?? ""} />

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="relative space-y-2">
            <span className="text-sm font-medium text-muted-strong">厂牌</span>
            <div className="relative">
              <input
                name="breweryName"
                value={breweryName}
                onChange={(e) => handleBreweryChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBreweryBlur}
                className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                placeholder="选择或输入厂牌"
                autoComplete="off"
              />
              {showSuggestions && filteredBreweries.length > 0 && (
                <div className="absolute z-10 mt-1 max-h-[200px] w-full overflow-y-auto rounded-[16px] border border-white/12 bg-[#1a1a1a] py-2 shadow-lg">
                  {filteredBreweries.slice(0, 10).map((brewery) => (
                    <button
                      key={brewery}
                      type="button"
                      onClick={() => handleSelectBrewery(brewery)}
                      className="w-full px-4 py-2 text-left text-sm text-muted hover:bg-white/[0.05] hover:text-foreground"
                    >
                      {brewery}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-strong">酒款名称</span>
            <input
              name="productName"
              defaultValue={beer?.productName ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：太行春雾"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-strong">种类</span>
            <input
              name="styleName"
              defaultValue={beer?.styleName ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：双倍浑浊 IPA"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-strong">ABV</span>
            <input
              name="abv"
              defaultValue={beer?.abv ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：7.2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-strong">容量（ml）</span>
            <input
              name="volumeMl"
              defaultValue={beer?.volumeMl ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="例如：330"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-muted-strong">国别</span>
            <select
              name="countryCode"
              defaultValue={beer?.countryCode ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
            >
              <option value="">未设置</option>
              <option value="CN">中国</option>
              <option value="DE">德国</option>
              <option value="BE">比利时</option>
              <option value="US">美国</option>
              <option value="GB">英国</option>
              <option value="JP">日本</option>
              <option value="NL">荷兰</option>
            </select>
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-muted-strong">图片 URL</span>
            <input
              name="imageUrl"
              defaultValue={beer?.imageUrl ?? ""}
              className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
              placeholder="https://..."
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-medium text-muted-strong">酒款描述</span>
            <textarea
              name="description"
              rows={5}
              defaultValue={beer?.description ?? ""}
              className="w-full rounded-[20px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm leading-7 outline-none"
              placeholder="记录这款酒适合怎么介绍、出现在什么场次里。"
            />
          </label>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-5 py-3 text-sm font-semibold text-[#2b2114] shadow-[0_18px_40px_rgba(215,163,61,0.18)]"
        >
          保存酒款
        </button>
      </div>
    </form>
  );
}