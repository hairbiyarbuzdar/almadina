"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BagIcon } from "./icons";

const SHOP_MENU = [
  {
    title: "Shop by Category",
    links: ["Cleansers", "Moisturizers", "Serums & Oils", "Masks", "Sunscreen"],
  },
  {
    title: "By Concern",
    links: [
      "Dryness",
      "Acne & Blemishes",
      "Anti-Aging",
      "Brightening",
      "Sensitive Skin",
      "Redness",
    ],
  },
  {
    title: "Essentials",
    links: ["New Arrivals", "Best Sellers", "Gift Sets", "Bundles", "Our Story"],
  },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openShop = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShopOpen(true);
  };
  const closeShop = () => {
    closeTimer.current = setTimeout(() => setShopOpen(false), 120);
  };
  const closeShopNow = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setShopOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-black/5">
      {/* Announcement bar */}
      <div className="bg-brand text-white text-center text-xs tracking-wide py-2 px-4">
        Free shipping on all orders over Rs 22,000
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-24">
          {/* Mobile menu button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden -ml-1 p-2 text-ink"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <span className="block w-6 space-y-[5px]">
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
              <span className="block h-px bg-current" />
            </span>
          </button>

          {/* Logo (left) */}
          <Link
            href="/"
            className="font-display text-2xl lg:text-[28px] font-semibold tracking-[0.3em] text-ink lg:pl-4"
          >
            AL-MADINA
          </Link>

          {/* Nav links (center) */}
          <nav className="hidden lg:flex items-center gap-12 text-[13px] font-medium tracking-[0.18em] text-ink">
            <Link
              href="/shop"
              onMouseEnter={openShop}
              onMouseLeave={closeShop}
              onClick={closeShopNow}
              aria-expanded={shopOpen}
              className="uppercase hover:text-brand transition-colors"
            >
              <span
                className={`pb-1 border-b-2 transition-colors ${
                  shopOpen ? "border-ink" : "border-transparent"
                }`}
              >
                Shop
              </span>
            </Link>
            <Link
              href="/our-story"
              className="uppercase hover:text-brand transition-colors"
            >
              Our Story
            </Link>
            <a
              href="#"
              className="uppercase hover:text-brand transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Icons (right) */}
          <div className="flex items-center text-ink">
            <button
              aria-label="Cart"
              className="relative hover:text-brand transition-colors"
            >
              <BagIcon className="w-5 h-5" />
              <Badge>0</Badge>
            </button>
          </div>
        </div>
      </div>

      {/* Shop mega-menu (desktop) */}
      <div
        onMouseEnter={openShop}
        onMouseLeave={closeShop}
        className={`hidden lg:block absolute inset-x-0 top-full border-t border-black/5 bg-white shadow-[0_24px_40px_-24px_rgba(0,0,0,0.25)] transition-all duration-200 ${
          shopOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-1 pointer-events-none"
        }`}
      >
        <div className="mx-auto max-w-7xl px-8 py-12 grid grid-cols-[1fr_1fr_1fr_1.3fr] gap-10">
          {SHOP_MENU.map((col, i) => (
            <div
              key={col.title}
              className={i > 0 ? "border-l border-black/10 pl-10" : ""}
            >
              <h3 className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-6">
                {col.title}
              </h3>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href={link === "Our Story" ? "/our-story" : "/shop"}
                      onClick={closeShopNow}
                      className="text-[15px] text-ink hover:text-brand transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Featured promo */}
          <div className="border-l border-black/10 pl-10">
            <h3 className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-6">
              Featured
            </h3>
            <div className="relative overflow-hidden bg-cream mb-4 aspect-[4/3]">
              <Image
                src="/products/intensive-glow-c-serum.jpg"
                alt="Intensive Glow C+ Serum"
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <p className="font-display text-lg text-ink leading-snug">
              Intensive Glow C+ Serum
            </p>
            <p className="text-sm text-ink-soft mt-1 mb-3">
              Our brightening bestseller — now 15% off this week.
            </p>
            <Link
              href="/shop"
              onClick={closeShopNow}
              className="text-xs uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-brand hover:border-brand transition-colors"
            >
              Explore More
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="lg:hidden border-t border-black/5 bg-white px-4 py-4 space-y-5">
          {SHOP_MENU.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ink-soft mb-2">
                {col.title}
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {col.links.map((link) => (
                  <Link
                    key={link}
                    href={link === "Our Story" ? "/our-story" : "/shop"}
                    onClick={() => setOpen(false)}
                    className="text-sm text-ink hover:text-brand"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-black/5 pt-4 flex gap-6">
            <Link
              href="/our-story"
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-[0.18em] text-ink"
            >
              Our Story
            </Link>
            <a href="#" className="text-sm uppercase tracking-[0.18em] text-ink">
              Contact
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-brand text-white text-[10px] leading-4 text-center">
      {children}
    </span>
  );
}
