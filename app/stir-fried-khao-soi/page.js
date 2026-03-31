"use client";

import AllMenusNav from "../components/AllMenusNav";
import Image from "next/image";
import Link from "next/link";
import { HiMagnifyingGlassPlus, HiMagnifyingGlassMinus } from "react-icons/hi2";
import { useCallback, useEffect, useRef, useState } from "react";

const ZOOM_SCALE = 2;

export default function StirFriedKhaoSoiMenuPage() {
  const [zoomActive, setZoomActive] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const frameRef = useRef(null);
  const dragRef = useRef(null);

  const toggleZoom = useCallback(() => {
    setZoomActive((prev) => {
      const next = !prev;
      if (!next) {
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
        dragRef.current = null;
      }
      return next;
    });
  }, []);

  const clampOffset = useCallback((nextOffset) => {
    if (!frameRef.current) return nextOffset;
    const rect = frameRef.current.getBoundingClientRect();
    const maxX = Math.max(0, (rect.width * (ZOOM_SCALE - 1)) / 2);
    const maxY = Math.max(0, (rect.height * (ZOOM_SCALE - 1)) / 2);
    return {
      x: Math.max(-maxX, Math.min(maxX, nextOffset.x)),
      y: Math.max(-maxY, Math.min(maxY, nextOffset.y)),
    };
  }, []);

  const onFramePointerDown = useCallback(
    (event) => {
      if (!zoomActive) return;
      if (event.pointerType === "mouse" && event.button !== 0) return;
      if (event.currentTarget.setPointerCapture) {
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      dragRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: offset.x,
        originY: offset.y,
      };
      setIsDragging(true);
    },
    [zoomActive, offset.x, offset.y],
  );

  const onFrameTouchStart = useCallback(
    (event) => {
      if (!zoomActive) return;
      const touch = event.touches?.[0];
      if (!touch) return;
      dragRef.current = {
        pointerId: "touch",
        startX: touch.clientX,
        startY: touch.clientY,
        originX: offset.x,
        originY: offset.y,
      };
      setIsDragging(true);
    },
    [zoomActive, offset.x, offset.y],
  );

  const onFramePointerMove = useCallback(
    (event) => {
      if (!zoomActive || !dragRef.current) return;
      if (dragRef.current.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      const nextOffset = clampOffset({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
      setOffset(nextOffset);
    },
    [zoomActive, clampOffset],
  );

  const onFrameTouchMove = useCallback(
    (event) => {
      if (!zoomActive || !dragRef.current) return;
      const touch = event.touches?.[0];
      if (!touch) return;
      event.preventDefault();
      const dx = touch.clientX - dragRef.current.startX;
      const dy = touch.clientY - dragRef.current.startY;
      const nextOffset = clampOffset({
        x: dragRef.current.originX + dx,
        y: dragRef.current.originY + dy,
      });
      setOffset(nextOffset);
    },
    [zoomActive, clampOffset],
  );

  const onFramePointerEnd = useCallback((event) => {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  }, []);

  const onFrameTouchEnd = useCallback(() => {
    if (dragRef.current?.pointerId === "touch") {
      dragRef.current = null;
      setIsDragging(false);
    }
  }, []);

  useEffect(() => {
    if (!zoomActive) return;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setZoomActive(false);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
        dragRef.current = null;
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [zoomActive]);

  return (
    <div
      className="relative h-[100dvh] max-h-[100dvh] w-full overflow-hidden bg-[#0a0a0c] text-white"
      style={{ WebkitUserSelect: "none", WebkitTouchCallout: "none" }}
    >
      <button
        type="button"
        onClick={toggleZoom}
        aria-pressed={zoomActive}
        aria-label={zoomActive ? "Exit zoom" : "Zoom menu"}
        className="fixed right-3 top-3 z-[100] flex h-12 w-12 items-center justify-center rounded-full border border-[#d4af37]/55 bg-black/65 text-[#e8c56a] shadow-lg backdrop-blur-sm transition hover:border-[#d4af37] hover:bg-black/80 hover:text-[#f0d078] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4af37] sm:right-4 sm:top-4"
      >
        {zoomActive ? (
          <HiMagnifyingGlassMinus className="h-6 w-6" aria-hidden />
        ) : (
          <HiMagnifyingGlassPlus className="h-6 w-6" aria-hidden />
        )}
      </button>

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-2 pt-14 sm:pt-2">
        <div
          ref={frameRef}
          className="relative h-full max-h-[100dvh] w-auto max-w-full shrink-0 touch-none"
          style={{
            aspectRatio: `${637} / ${897}`,
            transform: zoomActive
              ? `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${ZOOM_SCALE})`
              : "translate3d(0, 0, 0) scale(1)",
            transformOrigin: "50% 50%",
            transition: zoomActive
              ? isDragging
                ? "none"
                : "transform 120ms ease-out"
              : "transform 320ms ease-out",
            WebkitUserSelect: "none",
            WebkitTouchCallout: "none",
            touchAction: zoomActive ? "none" : "manipulation",
            willChange: "transform",
          }}
          onPointerDown={onFramePointerDown}
          onPointerMove={onFramePointerMove}
          onPointerUp={onFramePointerEnd}
          onPointerCancel={onFramePointerEnd}
          onPointerLeave={onFramePointerEnd}
          onTouchStart={onFrameTouchStart}
          onTouchMove={onFrameTouchMove}
          onTouchEnd={onFrameTouchEnd}
        >
          <Image
            src="/stir-fried-khao-soi-menu.png"
            alt="Stir-fried Khao-soi menu — scallop, toppings, and prices"
            fill
            priority
            className="block select-none object-contain"
            sizes="100vw"
            quality={92}
            draggable={false}
          />
        </div>
      </div>

      <Link
        href="/"
        className="pointer-events-auto fixed left-3 top-3 z-[99] rounded-md bg-black/45 px-2 py-1.5 text-[11px] font-medium text-white/80 outline-none ring-[#d4af37] backdrop-blur-sm transition hover:text-white focus-visible:ring-2 sm:left-4 sm:top-4"
      >
        ← eMenu
      </Link>

      <AllMenusNav />
    </div>
  );
}
