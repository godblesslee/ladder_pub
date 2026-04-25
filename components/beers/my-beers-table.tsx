"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  formatBeerBrandLabel,
  formatBeerStyleLabel,
} from "@/lib/beer-display";
import type { MyBeerReviewItem } from "@/lib/data/reviews";

type MyBeersTableProps = {
  reviews: MyBeerReviewItem[];
};

type FilterSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

type FilterToggleProps = {
  active: boolean;
  onClick: () => void;
};

function normalizeScoreBucket(score: number | null) {
  if (score === null) {
    return "未评分";
  }

  if (score >= 8) {
    return "8分及以上";
  }

  if (score >= 6) {
    return "6-7分";
  }

  return "5分及以下";
}

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
      return value ?? "未设置";
  }
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="flex min-w-0 flex-col gap-2">
      <span className="pl-1 text-[11px] font-medium tracking-[0.08em] text-muted-strong">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full min-w-0 rounded-[18px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] px-3.5 text-[13px] text-foreground outline-none transition focus:border-[rgba(215,163,61,0.26)]"
      >
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#1c1815]">
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function FilterToggle({ active, onClick }: FilterToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 items-center justify-between rounded-[18px] border px-4 text-[13px] transition ${
        active
          ? "border-[rgba(215,163,61,0.26)] bg-[rgba(215,163,61,0.12)] text-accent-strong"
          : "border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] text-muted-strong"
      }`}
    >
      <span>我的最爱</span>
      <span
        className={`text-sm leading-none transition ${
          active ? "text-accent-strong" : "text-muted/75"
        }`}
      >
        ★
      </span>
    </button>
  );
}

export function MyBeersTable({ reviews }: MyBeersTableProps) {
  const [breweryFilter, setBreweryFilter] = useState("全部厂牌");
  const [styleFilter, setStyleFilter] = useState("全部种类");
  const [countryFilter, setCountryFilter] = useState("全部国别");
  const [priceFilter, setPriceFilter] = useState("全部价格");
  const [scoreFilter, setScoreFilter] = useState("全部评分");
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const favoriteIds = useMemo(
    () =>
      new Set(
        [...reviews]
          .sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0))
          .slice(0, 5)
          .map((review) => review.id),
      ),
    [reviews],
  );

  const styleOptions = useMemo(
    () => [
      "全部种类",
      ...new Set(reviews.map((review) => formatBeerStyleLabel(review.styleName))),
    ],
    [reviews],
  );
  const breweryOptions = useMemo(
    () => [
      "全部厂牌",
      ...new Set(reviews.map((review) => formatBeerBrandLabel(review.breweryName))),
    ],
    [reviews],
  );
  const countryOptions = useMemo(
    () => [
      "全部国别",
      ...new Set(reviews.map((review) => mapCountryCodeLabel(review.countryCode))),
    ],
    [reviews],
  );
  const priceOptions = useMemo(
    () => [
      "全部价格",
      ...new Set(
        reviews
          .map((review) => review.retailPriceRange)
          .filter((value): value is string => Boolean(value)),
      ),
    ],
    [reviews],
  );
  const scoreOptions = useMemo(
    () => ["全部评分", "8分及以上", "6-7分", "5分及以下", "未评分"],
    [],
  );

  const filteredReviews = useMemo(
    () =>
      reviews.filter((review) => {
        if (
          breweryFilter !== "全部厂牌" &&
          formatBeerBrandLabel(review.breweryName) !== breweryFilter
        ) {
          return false;
        }

        if (
          styleFilter !== "全部种类" &&
          formatBeerStyleLabel(review.styleName) !== styleFilter
        ) {
          return false;
        }

        if (
          countryFilter !== "全部国别" &&
          mapCountryCodeLabel(review.countryCode) !== countryFilter
        ) {
          return false;
        }

        if (
          priceFilter !== "全部价格" &&
          (review.retailPriceRange ?? "未设置") !== priceFilter
        ) {
          return false;
        }

        if (
          scoreFilter !== "全部评分" &&
          normalizeScoreBucket(review.totalScore) !== scoreFilter
        ) {
          return false;
        }

        if (favoriteOnly && !favoriteIds.has(review.id)) {
          return false;
        }

        return true;
      }),
    [
      breweryFilter,
      countryFilter,
      favoriteIds,
      favoriteOnly,
      priceFilter,
      reviews,
      scoreFilter,
      styleFilter,
    ],
  );

  return (
    <section className="section-card rounded-[30px] px-5 py-5 sm:px-6 sm:py-6">
      <div className="rounded-[24px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-3.5 sm:p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(5,minmax(0,1fr))_auto] sm:items-end">
          <FilterSelect
            label="厂牌"
            value={breweryFilter}
            options={breweryOptions}
            onChange={setBreweryFilter}
          />
          <FilterSelect
            label="种类"
            value={styleFilter}
            options={styleOptions}
            onChange={setStyleFilter}
          />
          <FilterSelect
            label="国别"
            value={countryFilter}
            options={countryOptions}
            onChange={setCountryFilter}
          />
          <FilterSelect
            label="价格范围"
            value={priceFilter}
            options={priceOptions}
            onChange={setPriceFilter}
          />
          <FilterSelect
            label="评分"
            value={scoreFilter}
            options={scoreOptions}
            onChange={setScoreFilter}
          />
          <div className="col-span-2 sm:col-span-1">
            <label className="flex min-w-0 flex-col gap-2">
              <span className="pl-1 text-[11px] font-medium tracking-[0.08em] text-muted-strong">
                收藏筛选
              </span>
              <FilterToggle
                active={favoriteOnly}
                onClick={() => setFavoriteOnly((value) => !value)}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="mt-5 hidden overflow-hidden rounded-[26px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:block">
        <div className="grid grid-cols-[minmax(0,2.38fr)_minmax(0,1.56fr)_34px_18px] gap-1.5 border-b border-white/6 px-4 py-3 text-[9px] uppercase tracking-[0.18em] text-muted/72">
          <span>酒款</span>
          <span>种类</span>
          <span className="text-right">评分</span>
          <span className="text-right">★</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="px-4 py-9 text-sm leading-7 text-muted">
            当前筛选条件下还没有酒款记录。
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Link
              key={review.id}
              href={
                review.eventSlug
                  ? `/events/${review.eventSlug}/beers/${review.eventBeerId}`
                  : "/my-beers"
              }
              className="grid grid-cols-[minmax(0,2.38fr)_minmax(0,1.56fr)_34px_18px] items-center gap-1.5 border-b border-white/6 px-4 py-4 transition last:border-b-0 hover:bg-white/[0.03]"
            >
              <div className="min-w-0">
                <p className="truncate text-[15px] font-medium leading-5 text-foreground">
                  {review.beerName}
                </p>
                <p className="mt-1.5 truncate text-[12px] leading-5 text-muted">
                  {formatBeerBrandLabel(review.breweryName)}
                </p>
              </div>

              <div className="min-w-0">
                <p className="truncate text-[14px] leading-5 text-foreground/86">
                  {formatBeerStyleLabel(review.styleName)}
                </p>
                <p className="mt-1.5 truncate text-[12px] leading-5 text-muted">
                  {review.abv ? `ABV ${review.abv}%` : "ABV --"}
                </p>
              </div>

              <div className="justify-self-end self-center text-right text-[12px] font-medium tracking-[0.02em] text-accent-strong">
                {review.totalScore !== null ? `${review.totalScore}/10` : "--"}
              </div>

              <div className="justify-self-end self-center text-right text-[13px] leading-none text-accent-strong/90">
                {favoriteIds.has(review.id) ? "★" : ""}
              </div>
            </Link>
          ))
        )}
      </div>

      <div className="mt-5 grid gap-3 sm:hidden">
        {filteredReviews.length === 0 ? (
          <div className="rounded-[24px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.028),rgba(255,255,255,0.012))] px-4 py-6 text-sm leading-7 text-muted">
            当前筛选条件下还没有酒款记录。
          </div>
        ) : (
          filteredReviews.map((review) => (
            <Link
              key={review.id}
              href={
                review.eventSlug
                  ? `/events/${review.eventSlug}/beers/${review.eventBeerId}`
                  : "/my-beers"
              }
              className="rounded-[24px] border border-white/7 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.018))] px-4 py-4 transition hover:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium leading-6 text-foreground">
                    {review.beerName}
                  </p>
                  <p className="mt-1 truncate text-[12px] leading-5 text-muted">
                    {formatBeerBrandLabel(review.breweryName)}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-[13px] font-medium text-accent-strong">
                    {review.totalScore !== null ? `${review.totalScore}/10` : "--"}
                  </p>
                  {favoriteIds.has(review.id) ? (
                    <p className="mt-1 text-[12px] leading-none text-accent-strong/90">★</p>
                  ) : null}
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 text-[12px] leading-5">
                <p className="truncate text-foreground/84">
                  {formatBeerStyleLabel(review.styleName)}
                </p>
                <p className="shrink-0 text-muted">
                  {review.abv ? `ABV ${review.abv}%` : "ABV --"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
