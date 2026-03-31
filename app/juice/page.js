 "use client";

import AllMenusNav from "../components/AllMenusNav";
import Image from "next/image";
import Link from "next/link";
import { Great_Vibes } from "next/font/google";
import { TbHandClick } from "react-icons/tb";
import { useCallback, useEffect, useRef, useState } from "react";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const gold = "#e2bd62";

export default function FreshJuiceMenuPage() {
  const [isEntered, setIsEntered] = useState(false);
  const [showIntroCue, setShowIntroCue] = useState(false);
  const [introZoomActive, setIntroZoomActive] = useState(false);
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });
  const holdTimerRef = useRef(null);
  const suppressClickRef = useRef(false);
  const pointerStartRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const showCueId = setTimeout(() => setShowIntroCue(true), 180);
    const startZoomId = setTimeout(() => setIntroZoomActive(true), 900);
    const endZoomAndHideCueId = setTimeout(() => {
      setIntroZoomActive(false);
      setShowIntroCue(false);
    }, 1450);
    return () => {
      clearTimeout(showCueId);
      clearTimeout(startZoomId);
      clearTimeout(endZoomAndHideCueId);
    };
  }, []);

  useEffect(() => {
    const checkMobileCrop = () => {
      if (!frameRef.current) return;
      if (window.innerWidth > 768) return;
      const { width, height } = frameRef.current.getBoundingClientRect();
      if (!width || !height) return;
      const expectedRatio = 617 / 867;
      const currentRatio = width / height;
      const ratioDiff = Math.abs(currentRatio - expectedRatio);
      if (ratioDiff > 0.02) {
        console.warn("[juice] possible mobile crop detected", {
          viewport: { width: window.innerWidth, height: window.innerHeight },
          frame: { width, height },
          expectedRatio,
          currentRatio,
        });
      }
    };

    checkMobileCrop();
    window.addEventListener("resize", checkMobileCrop);
    return () => window.removeEventListener("resize", checkMobileCrop);
  }, []);

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
      pointerStartRef.current = { x: event.clientX, y: event.clientY };
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

  const onHoldEnd = useCallback((event) => {
    clearHoldTimer();
    if (pointerStartRef.current) {
      const dx = event.clientX - pointerStartRef.current.x;
      const dy = event.clientY - pointerStartRef.current.y;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const swipeDistance = 60;
      const mostlyHorizontal = absDx > absDy * 1.2;
      if (absDx >= swipeDistance && mostlyHorizontal) {
        suppressClickRef.current = true;
        setTimeout(() => {
          suppressClickRef.current = false;
        }, 0);
      }
    }
    pointerStartRef.current = null;
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
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black p-2">
        <div
          ref={frameRef}
          className="relative aspect-[617/867] h-full max-h-[100dvh] w-auto max-w-full shrink-0 touch-none"
          onPointerDown={onHoldStart}
          onPointerMove={onHoldMove}
          onPointerUp={onHoldEnd}
          onPointerCancel={onHoldEnd}
          onPointerLeave={onHoldEnd}
          style={{
            transform: zoom.active
              ? "scale(1.5)"
              : introZoomActive
                ? "scale(1.15)"
                : "scale(1)",
            transformOrigin: zoom.active ? `${zoom.x}% ${zoom.y}%` : "50% 50%",
            transition: zoom.active
              ? "transform 220ms ease-out"
              : "transform 420ms ease-out",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
          }}
        >
          <Image
            src="/fresh-fruit-juice-menu.png"
            alt=""
            fill
            priority
            className="block select-none object-contain"
            sizes="100vw"
            quality={90}
            draggable={false}
          />
          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 z-[9] -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
              showIntroCue ? "scale-100 opacity-100" : "scale-90 opacity-0"
            }`}
            aria-hidden
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-black/75 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#f3cf72] shadow-lg ring-1 ring-[#d4af37]/40">
              <TbHandClick className="h-4 w-4 animate-pulse" aria-hidden />
              Click
            </span>
          </div>
          <div className="pointer-events-none absolute inset-0 z-10 text-[clamp(10px,1.9vmin,15px)] leading-snug">
            <Link
              href="/"
              className="pointer-events-auto absolute left-[3%] top-[2%] z-20 rounded-md px-2 py-1 text-[11px] font-medium text-white/70 outline-none ring-[#d4af37] transition hover:text-white focus-visible:ring-2"
            >
              ← eMenu
            </Link>

           
          </div>
        </div>
      </div>

      <AllMenusNav />
    </div>
  );
}
