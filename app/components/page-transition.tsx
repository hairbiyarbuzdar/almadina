"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// Horizontal offset (% of width) between the top and bottom of the curtain's
// edges — this is what makes the wipe diagonal rather than a straight wipe.
const SLANT = 14;

function labelFor(pathname: string): string {
  if (pathname === "/") return "Home";
  if (pathname === "/shop") return "Shop";
  if (pathname.startsWith("/shop/")) {
    const slug = pathname.split("/").pop() ?? "";
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (pathname === "/our-story") return "Our Story";
  if (pathname === "/contact") return "Contact";
  if (pathname === "/checkout") return "Checkout";
  return "Al-Madina";
}

export function PageTransition() {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    // Don't play on the initial load.
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const overlay = overlayRef.current;
    const curtain = curtainRef.current;
    const label = labelRef.current;
    if (!overlay || !curtain || !label) return;

    // Parallelogram between a left edge and a right edge, both slanted by SLANT.
    const s = { leftX: 100, rightX: 100 };
    const apply = () => {
      curtain.style.clipPath = `polygon(${s.leftX + SLANT}% 0%, ${
        s.rightX + SLANT
      }% 0%, ${s.rightX}% 100%, ${s.leftX}% 100%)`;
    };
    apply();
    label.textContent = labelFor(pathname);

    const ease = "expo.out"; // ~cubic-bezier(0.22, 1, 0.36, 1)

    const tl = gsap.timeline();
    tl.set(overlay, { autoAlpha: 1, pointerEvents: "auto" })
      .set(label, { autoAlpha: 0, y: 14 })
      // 1) cover: leading edge sweeps in from the right
      .to(s, { leftX: -SLANT, duration: 0.35, ease, onUpdate: apply })
      // 2) reveal the page name once covered
      .to(label, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" }, "-=0.18")
      .to({}, { duration: 0.14 })
      .to(label, { autoAlpha: 0, y: -14, duration: 0.2, ease: "power2.in" })
      // 3) reveal: trailing edge sweeps off to the left, exposing the new page
      .to(s, { rightX: -SLANT, duration: 0.45, ease, onUpdate: apply }, "<")
      .set(overlay, { autoAlpha: 0, pointerEvents: "none" });

    return () => {
      tl.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={overlayRef}
      aria-hidden
      className="fixed inset-0 z-[9999] overflow-hidden invisible opacity-0"
    >
      <div
        ref={curtainRef}
        className="absolute inset-0 bg-ink"
        style={{
          clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
          willChange: "clip-path",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <span
          ref={labelRef}
          className="font-display text-cream text-5xl sm:text-7xl text-center leading-tight tracking-wide"
        />
      </div>
    </div>
  );
}
