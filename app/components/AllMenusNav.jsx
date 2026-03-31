"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiBars3 } from "react-icons/hi2";

export const ALL_MENU_ROUTES = [
  { href: "/", label: "Khao-soi", hint: "⌥1" },
  { href: "/juice", label: "Fresh fruit juice", hint: "⌥2" },
  { href: "/stir-fried-khao-soi", label: "Stir-fried Khao-soi", hint: "⌥3" },
];

function pathMatches(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AllMenusNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const rootRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    document.addEventListener("pointerdown", onDoc);
    return () => document.removeEventListener("pointerdown", onDoc);
  }, [open, close]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div
      ref={rootRef}
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 [font-family:var(--font-kanit),system-ui,sans-serif]"
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="all-menus-panel"
        id="all-menus-trigger"
        className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/50 bg-black/75 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#e8c56a] shadow-lg backdrop-blur-sm transition hover:border-[#d4af37] hover:bg-black/85 hover:text-[#f0d078] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37]"
      >
        <HiBars3 className="h-4 w-4" aria-hidden />
        All menus
      </button>

      {open ? (
        <nav
          id="all-menus-panel"
          role="menu"
          aria-labelledby="all-menus-trigger"
          className="absolute bottom-full left-1/2 mb-3 w-[min(90vw,17rem)] -translate-x-1/2 rounded-xl border border-[#d4af37]/35 bg-[#141416]/95 py-2 shadow-2xl backdrop-blur-md"
        >
          <ul className="list-none p-0">
            {ALL_MENU_ROUTES.map((item) => {
              const current = pathMatches(pathname, item.href);
              return (
                <li key={item.href} role="none">
                  <Link
                    href={item.href}
                    role="menuitem"
                    onClick={close}
                    aria-current={current ? "page" : undefined}
                    className={`flex items-center justify-between gap-3 px-4 py-3 text-sm transition hover:bg-white/5 ${
                      current ? "text-[#f0d078]" : "text-white/90"
                    }`}
                  >
                    <span>{item.label}</span>
                    <kbd className="shrink-0 rounded border border-white/15 bg-black/40 px-1.5 py-0.5 text-[10px] font-normal text-white/45">
                      {item.hint}
                    </kbd>
                  </Link>
                </li>
              );
            })}
          </ul>
          <p className="border-t border-white/10 px-4 py-2 text-[10px] leading-snug text-white/45">
            Option / Alt + number row to switch pages.
          </p>
        </nav>
      ) : null}
    </div>
  );
}
