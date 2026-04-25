"use client";

import Link from "next/link";
import { useState } from "react";

type WalletCard = {
  id: string;
  href: string;
  eyebrow?: string;
  title: string;
  meta: string;
  metaAccent?: string;
  detail: string;
  badgeLabel?: string;
  badgeValue?: string;
  scoreLabel?: string;
  ctaLabel?: string;
  themeClassName: string;
};

type WalletStackProps = {
  cards: WalletCard[];
  revealPx?: number;
  cardHeight?: number;
};

const DEFAULT_CARD_REVEAL = 66;
const DEFAULT_CARD_HEIGHT = 224;

export function WalletStack({
  cards,
  revealPx = DEFAULT_CARD_REVEAL,
  cardHeight = DEFAULT_CARD_HEIGHT,
}: WalletStackProps) {
  const [activeId, setActiveId] = useState(cards[0]?.id ?? "");

  const visualOrder = [
    ...cards.filter((card) => card.id !== activeId).map((card) => card.id).reverse(),
    activeId,
  ];

  return (
    <div
      className="relative mt-5"
      style={{
        height: cardHeight + revealPx * Math.max(cards.length - 1, 0),
      }}
    >
      {cards.map((card) => {
        const position = visualOrder.indexOf(card.id);
        const isFrontCard = card.id === activeId;

        return (
        <Link
          key={card.id}
          href={card.href}
          onClick={(event) => {
            if (card.id !== activeId) {
              event.preventDefault();
              setActiveId(card.id);
            }
          }}
          className={`absolute inset-x-0 top-0 block rounded-[30px] border border-white/8 px-5 pb-5 pt-5 text-foreground shadow-[0_22px_60px_rgba(0,0,0,0.26)] transition-[transform,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${card.themeClassName} ${
            isFrontCard ? "shadow-[0_28px_70px_rgba(0,0,0,0.3)]" : ""
          }`}
          style={{
            zIndex: position + 1,
            height: cardHeight,
            transform: `translateY(${position * revealPx}px)`,
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              {card.eyebrow ? (
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-strong/80">
                  {card.eyebrow}
                </p>
              ) : null}
              <h3
                className={`${card.eyebrow ? "mt-3" : "mt-0.5"} line-clamp-1 text-xl font-semibold leading-snug`}
              >
                {card.title}
              </h3>
              <p className="mt-1.5 line-clamp-1 text-[13px] text-muted/90">
                {card.metaAccent ? (
                  <span className="text-accent-strong">{card.metaAccent}</span>
                ) : null}
                {card.metaAccent ? <span className="text-muted/55"> · </span> : null}
                <span>{card.meta}</span>
              </p>
            </div>
            {card.scoreLabel || card.badgeValue ? (
              <div className="rounded-[15px] border border-[rgba(215,163,61,0.14)] bg-[rgba(215,163,61,0.09)] px-2.5 py-1.5 text-right">
                <p className="text-[10px] uppercase tracking-[0.14em] text-accent-strong/70">
                  {card.scoreLabel ? "Score" : card.badgeLabel ?? "Info"}
                </p>
                <p className="mt-0.5 text-[15px] font-semibold text-accent-strong">
                  {card.scoreLabel ?? card.badgeValue}
                </p>
              </div>
            ) : null}
          </div>
          <div className="mt-6 flex items-end justify-between gap-4">
            <p className="line-clamp-2 text-sm leading-6 text-foreground/78">
              {card.detail}
            </p>
            <span className="shrink-0 text-sm font-semibold text-accent-strong">
              {card.ctaLabel ?? "查看 ›"}
            </span>
          </div>
          {!isFrontCard ? (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 rounded-b-[30px] bg-gradient-to-t from-[rgba(20,16,14,0.24)] to-transparent" />
          ) : null}
        </Link>
        );
      })}
    </div>
  );
}
