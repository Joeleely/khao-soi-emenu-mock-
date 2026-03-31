"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CODE_TO_PATH = {
  Digit1: "/",
  Digit2: "/juice",
  Digit3: "/stir-fried-khao-soi",
};

/**
 * Option/Alt + 1 / 2 / 3 — jump between menu pages (physical number row).
 */
export default function GlobalMenuShortcuts() {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e) => {
      if (!e.altKey || e.metaKey || e.ctrlKey) return;
      const path = CODE_TO_PATH[e.code];
      if (!path) return;
      e.preventDefault();
      router.push(path);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return null;
}
