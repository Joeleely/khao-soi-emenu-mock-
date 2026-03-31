"use client";

import AllMenusNav from "./components/AllMenusNav";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

function BowlIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 10c0-1 2-4 8-4s8 3 8 4v2c0 4-3.5 7-8 7s-8-3-8-7v-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6 12h12"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** Hitbox %s are relative to the rendered image frame (height = screen, width = auto). */
const DEFAULT_DISH_PHOTO = "/menu-screen-bg.png";

const MENU = [
  {
    id: "wagyu",
    thai: "ข้าวซอยเส้นสด เนื้อออสเตรเลีย วากิว ริบอาย",
    english: "Khao-soi with Australian Wagyu Ribeye",
    prices: { large: "469.-", small: "339.-" },
    hitbox: { top: "23%", left: "3%", width: "35%", height: "5%" },
    detail: {
      photo: DEFAULT_DISH_PHOTO,
      blurb:
        "Tender Australian Wagyu ribeye with our golden curry broth, house pickles, and crispy noodles on the side.",
      highlights: [
        "Slow-simmered northern-style curry",
        "Wagyu ribeye, medium-rare finish",
        "Served with lime, shallots, and chili paste",
      ],
      note: "Contains coconut; shellfish traces possible in curry paste.",
    },
  },
  {
    id: "shank",
    thai: "ข้าวซอยเส้นสด เนื้อน่องลาย",
    english: "Khao-soi with Braised Beef Shank",
    prices: { large: "249.-", small: "189.-" },
    hitbox: { top: "75%", left: "4%", width: "20%", height: "8%" },
    detail: {
      photo: DEFAULT_DISH_PHOTO,
      blurb:
        "Fork-tender shank braised in aromatics until rich and silky, ladled over fresh egg noodles.",
      highlights: [
        "24-hour shank braise",
        "Classic khao-soi garnish set",
        "Balanced curry, defined noodle pull",
      ],
      note: "Contains soy, gluten (noodles), coconut.",
    },
  },
  {
    id: "chuck",
    thai: "ข้าวซอยเส้นสด เนื้อใบพาย",
    english: "Khao-soi with Torched Chuck Eye",
    prices: { large: "249.-", small: "189.-" },
    hitbox: { top: "75%", left: "38%", width: "20%", height: "8%" },
    detail: {
      photo: DEFAULT_DISH_PHOTO,
      blurb:
        "Chuck eye ribbons torched for smoky edges, then set in curry with fresh egg noodles.",
      highlights: [
        "Torch finish for caramelized aroma",
        "Hearty bowl texture",
        "Pairs well with Signature spice",
      ],
      note: "Contains coconut; may contain fish sauce.",
    },
  },
  {
    id: "braised",
    thai: "ข้าวซอยเส้นสดเนื้อตุ๋น",
    english: "Khao-soi with Braised Beef",
    prices: { large: "219.-", small: "159.-" },
    hitbox: { top: "75%", left: "70%", width: "25%", height: "8%" },
    detail: {
      photo: DEFAULT_DISH_PHOTO,
      blurb:
        "House braised beef in a comforting curry, with the full pickle, lime, and crispy noodle set.",
      highlights: [
        "Slow-cooked beef",
        "Crispy noodles & condiments",
        "Everyday comfort bowl",
      ],
      note: "Contains coconut, gluten.",
    },
  },
];

function PriceRow({ large, small }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#d4af37]">
      <span className="inline-flex items-center gap-1">
        <BowlIcon className="h-4 w-4 text-white/70" />
        <span className="tabular-nums">{large}</span>
      </span>
      <span className="inline-flex items-center gap-1 opacity-90">
        <BowlIcon className="h-3.5 w-3.5 text-white/50" />
        <span className="tabular-nums">{small}</span>
      </span>
    </div>
  );
}

export default function EMenuClient() {
  const [active, setActive] = useState(null);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const holdTimerRef = useRef(null);
  const suppressClickRef = useRef(false);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  useEffect(
    () => () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    },
    [],
  );

  const clearHoldTimer = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  }, []);

  const getPointPercent = useCallback((event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    return {
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    };
  }, []);

  const onHoldStart = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      const point = getPointPercent(event);
      clearHoldTimer();
      holdTimerRef.current = setTimeout(() => {
        suppressClickRef.current = true;
        setZoom({ active: true, ...point });
      }, 220);
    },
    [clearHoldTimer, getPointPercent],
  );

  const onHoldMove = useCallback(
    (event) => {
      if (!zoom.active) return;
      const point = getPointPercent(event);
      setZoom({ active: true, ...point });
    },
    [zoom.active, getPointPercent],
  );

  const onHoldEnd = useCallback(() => {
    clearHoldTimer();
    if (zoom.active) {
      setZoom((prev) => ({ ...prev, active: false }));
      setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    }
  }, [zoom.active, clearHoldTimer]);

  return (
    <div
      className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-black text-white"
      style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
    >
      {/* Image: always full viewport height, width follows aspect ratio (no horizontal stretch). */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black p-2">
        <Link
          href="/juice"
          className="absolute left-[3%] top-[2%] z-20 rounded-md px-2 py-1 text-[11px] font-medium text-white/70 outline-none ring-[#d4af37] transition hover:text-white focus-visible:ring-2"
        >
          Fruit juice →
        </Link>
        <Link
          href="/stir-fried-khao-soi"
          className="absolute right-[3%] top-[2%] z-20 rounded-md px-2 py-1 text-[11px] font-medium text-white/70 outline-none ring-[#d4af37] transition hover:text-white focus-visible:ring-2"
        >
          Stir-fried →
        </Link>
        <div
          className="relative aspect-[616/870] h-auto w-full max-h-full max-w-[calc(100dvh*616/870)] shrink-0 touch-none"
          onPointerDown={onHoldStart}
          onPointerMove={onHoldMove}
          onPointerUp={onHoldEnd}
          onPointerCancel={onHoldEnd}
          onPointerLeave={onHoldEnd}
          style={{
            transform: zoom.active ? "scale(1.7)" : "scale(1)",
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
            transition: "transform 220ms ease-out",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          <Image
            src="/menu-screen-bg.png"
            alt="Fresh Khao-Soi noodle menu"
            fill
            priority
            className="block select-none object-contain"
            sizes="100vw"
            quality={90}
            draggable={false}
          />
          <div className="absolute inset-0 z-10" role="presentation">
            {MENU.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (suppressClickRef.current) return;
                  setActive(item);
                }}
                className="absolute cursor-pointer border-0 bg-transparent p-0 opacity-0 outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#d4af37] focus-visible:ring-offset-2 focus-visible:ring-offset-black/60"
                style={{
                  top: item.hitbox.top,
                  left: item.hitbox.left,
                  width: item.hitbox.width,
                  height: item.hitbox.height,
                }}
                aria-label={`${item.english} — open details`}
              />
            ))}
          </div>
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="menu-modal-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-md"
            aria-label="Close menu detail"
            onClick={close}
          />
          <div className="relative z-[1] m-4 max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-2xl border border-[#d4af37]/35 bg-[#141416] p-6 shadow-2xl sm:m-0">
            <button
              type="button"
              onClick={close}
              className="absolute right-3 top-3 rounded-lg p-2 text-white/60 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
              aria-label="Close"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
            <p className="text-sm text-white/85">{active.thai}</p>
            <h3
              id="menu-modal-title"
              className="mt-1 text-lg font-semibold text-[#e8c56a]"
            >
              {active.english}
            </h3>
            {active.detail.photo ? (
              <div className="relative mt-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-[#d4af37]/25 bg-black/40">
                <Image
                  src={active.detail.photo}
                  alt={active.english}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 448px) 100vw, 448px"
                />
              </div>
            ) : null}
            <PriceRow large={active.prices.large} small={active.prices.small} />
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              {active.detail.blurb}
            </p>
            <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-white/70">
              {active.detail.highlights.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-4 border-t border-white/10 pt-3 text-xs text-white/50">
              {active.detail.note}
            </p>
          </div>
        </div>
      )}

      <AllMenusNav />
    </div>
  );
}
