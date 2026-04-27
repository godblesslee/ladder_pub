"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { removeBeerFromEventAction } from "@/app/(admin)/admin/actions";

type AdminEventBeerItem = {
  id: string;
  beerId: string;
  breweryName: string;
  productName: string;
  styleName: string;
  abv: number | null;
  countryCode: string | null;
  servingOrder: number | null;
  notes: string | null;
};

type AdminEventBeersClientProps = {
  eventId: string;
  eventTitle: string;
  beers: AdminEventBeerItem[];
  availableBeers: {
    id: string;
    breweryName: string;
    productName: string;
    styleName: string;
    abv: number | null;
  }[];
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

type NewBeerForm = {
  breweryName: string;
  productName: string;
  styleName: string;
  abv: string;
};

export function AdminEventBeersClient({
  eventId,
  eventTitle,
  beers,
  availableBeers,
}: AdminEventBeersClientProps) {
  const router = useRouter();
  const [localBeers, setLocalBeers] = useState(beers);
  const [selectedBeerId, setSelectedBeerId] = useState("");
  const [newBeerNotes, setNewBeerNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showNewBeerForm, setShowNewBeerForm] = useState(false);
  const [newBeer, setNewBeer] = useState<NewBeerForm>({
    breweryName: "",
    productName: "",
    styleName: "",
    abv: "",
  });
  const [breweries, setBreweries] = useState<string[]>([]);
  const [showBrewerySuggestions, setShowBrewerySuggestions] = useState(false);
  const [error, setError] = useState("");

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

  async function handleRemove(beerId: string) {
    await removeBeerFromEventAction(eventId, beerId);
    setLocalBeers(localBeers.filter((b) => b.beerId !== beerId));
    router.refresh();
  }

  async function handleAddBeer(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBeerId) return;

    try {
      const res = await fetch("/api/admin/event-beers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          beerId: selectedBeerId,
          notes: newBeerNotes,
          servingOrder: localBeers.length + 1,
        }),
      });

      if (res.ok) {
        router.refresh();
        setSelectedBeerId("");
        setNewBeerNotes("");
        setShowAddForm(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleBreweryChange(value: string) {
    setNewBeer({ ...newBeer, breweryName: value });
    setShowBrewerySuggestions(true);
  }

  function handleSelectBrewery(brewery: string) {
    setNewBeer({ ...newBeer, breweryName: brewery });
    setShowBrewerySuggestions(false);
  }

  function handleBreweryBlur() {
    setTimeout(() => setShowBrewerySuggestions(false), 150);
  }

  async function handleCreateAndAddBeer(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!newBeer.breweryName || !newBeer.productName || !newBeer.styleName) {
      setError("厂牌、产品名称和种类为必填项");
      return;
    }

    try {
      const res = await fetch("/api/admin/beers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          breweryName: newBeer.breweryName,
          productName: newBeer.productName,
          styleName: newBeer.styleName,
          abv: newBeer.abv ? Number(newBeer.abv) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "创建酒款失败");
        return;
      }

      const data = await res.json();
      const newBeerId = data.id;

      const addRes = await fetch("/api/admin/event-beers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          beerId: newBeerId,
          notes: newBeerNotes,
          servingOrder: localBeers.length + 1,
        }),
      });

      if (addRes.ok) {
        router.refresh();
        setSelectedBeerId("");
        setNewBeerNotes("");
        setNewBeer({ breweryName: "", productName: "", styleName: "", abv: "" });
        setShowAddForm(false);
        setShowNewBeerForm(false);
      }
    } catch (err) {
      setError("操作失败，请稍后再试");
      console.error(err);
    }
  }

  const filteredBreweries = newBeer.breweryName
    ? breweries.filter((b) =>
        b.toLowerCase().includes(newBeer.breweryName.toLowerCase())
      )
    : breweries;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href={`/admin/events/${eventId}`}
            className="text-sm text-muted hover:text-foreground"
          >
            ← 返回活动编辑
          </Link>
          <h2 className="mt-3 text-2xl font-semibold text-foreground">
            {eventTitle} · 酒款配置
          </h2>
          <p className="mt-1 text-sm text-muted">
            管理本场活动的待评测酒款，可添加酒款库的酒款，或新建酒款（同步入库）。
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="rounded-full bg-[rgba(215,163,61,0.14)] px-4 py-2.5 text-sm font-medium text-accent-strong"
        >
          添加酒款
        </button>
      </div>

      {showAddForm && (
        <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
          <p className="text-lg font-semibold text-foreground">添加酒款到本场活动</p>

          {showNewBeerForm ? (
            <form onSubmit={handleCreateAndAddBeer} className="mt-4 space-y-4">
              <p className="text-sm text-muted">新建酒款（同时加入酒款库）</p>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="relative space-y-2">
                  <span className="text-xs text-muted-strong">厂牌 *</span>
                  <div className="relative">
                    <input
                      value={newBeer.breweryName}
                      onChange={(e) => handleBreweryChange(e.target.value)}
                      onFocus={() => setShowBrewerySuggestions(true)}
                      onBlur={handleBreweryBlur}
                      className="w-full rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                      placeholder="选择或输入厂牌"
                      autoComplete="off"
                    />
                    {showBrewerySuggestions && filteredBreweries.length > 0 && (
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
                  <span className="text-xs text-muted-strong">产品名称 *</span>
                  <input
                    value={newBeer.productName}
                    onChange={(e) =>
                      setNewBeer({ ...newBeer, productName: e.target.value })
                    }
                    className="w-full rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                    placeholder="例如：不拉芝批评社交IPA"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs text-muted-strong">种类 *</span>
                  <input
                    value={newBeer.styleName}
                    onChange={(e) =>
                      setNewBeer({ ...newBeer, styleName: e.target.value })
                    }
                    className="w-full rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                    placeholder="例如：社交IPA"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-xs text-muted-strong">酒精度</span>
                  <input
                    value={newBeer.abv}
                    onChange={(e) =>
                      setNewBeer({ ...newBeer, abv: e.target.value })
                    }
                    className="w-full rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                    placeholder="例如：5.2"
                  />
                </label>
              </div>

              <label className="block space-y-2">
                <span className="text-xs text-muted-strong">活动备注（可选）</span>
                <input
                  value={newBeerNotes}
                  onChange={(e) => setNewBeerNotes(e.target.value)}
                  className="w-full rounded-[16px] border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm outline-none"
                  placeholder="这款酒在本场活动的备注"
                />
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-4 py-2.5 text-sm font-semibold text-[#2b2114]"
                >
                  创建并添加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowNewBeerForm(false);
                    setError("");
                    setNewBeer({ breweryName: "", productName: "", styleName: "", abv: "" });
                  }}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm text-muted"
                >
                  返回选择
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleAddBeer} className="mt-4 space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-strong">从酒款库选择</span>
                <select
                  value={selectedBeerId}
                  onChange={(e) => setSelectedBeerId(e.target.value)}
                  className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                >
                  <option value="">选择一款酒...</option>
                  {availableBeers
                    .filter((b) => !localBeers.some((lb) => lb.beerId === b.id))
                    .map((beer) => (
                      <option key={beer.id} value={beer.id}>
                        {beer.productName} · {beer.breweryName} · {beer.styleName}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-muted-strong">活动备注（可选）</span>
                <input
                  value={newBeerNotes}
                  onChange={(e) => setNewBeerNotes(e.target.value)}
                  className="w-full rounded-[18px] border border-white/8 bg-white/[0.04] px-4 py-3 text-sm outline-none"
                  placeholder="这款酒在本场活动的备注"
                />
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!selectedBeerId}
                  className="rounded-full bg-[linear-gradient(180deg,#f3c652,#d9a33c)] px-4 py-2.5 text-sm font-semibold text-[#2b2114] disabled:opacity-50"
                >
                  添加
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setSelectedBeerId("");
                    setNewBeerNotes("");
                  }}
                  className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2.5 text-sm text-muted"
                >
                  取消
                </button>
              </div>

              <div className="border-t border-white/8 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewBeerForm(true)}
                  className="text-sm text-accent-strong hover:underline"
                >
                  + 酒款库里没有？新建一个酒款
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6">
        <p className="text-sm font-medium text-muted-strong">
          本场共 {localBeers.length} 款酒
        </p>

        <div className="mt-4 space-y-3">
          {localBeers.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.02] px-4 py-8 text-sm text-muted">
              还没有添加酒款，点击上方「添加酒款」开始配置。
            </div>
          ) : (
            localBeers.map((beer, index) => (
              <div
                key={beer.beerId}
                className="rounded-[22px] border border-[rgba(215,163,61,0.16)] bg-[rgba(215,163,61,0.06)] px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-[rgba(215,163,61,0.14)] px-2 py-1 text-xs font-medium text-accent-strong">
                        #{index + 1}
                      </span>
                      <div>
                        <Link
                          href={`/admin/beers/${beer.beerId}`}
                          className="text-sm font-medium text-foreground hover:text-accent-strong"
                        >
                          {beer.productName}
                        </Link>
                        <p className="mt-1 text-xs text-muted">
                          {beer.breweryName} · {beer.styleName}
                          {beer.abv ? ` · ABV ${beer.abv}%` : ""}
                          {beer.countryCode
                            ? ` · ${mapCountryCodeLabel(beer.countryCode)}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    {beer.notes && (
                      <p className="mt-2 text-xs text-muted">{beer.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(beer.beerId)}
                    className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-muted hover:border-white/12 hover:text-red-400"
                  >
                    移除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}