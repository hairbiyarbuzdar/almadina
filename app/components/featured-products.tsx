"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "../lib/products";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight } from "./icons";
import { Reveal } from "./animations";

gsap.registerPlugin(ScrollTrigger);

export function FeaturedProducts({ products }: { products: Product[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (dir: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.9, behavior: "smooth" });
  };

  // Reveal the cards as the rail scrolls into view.
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        rail.children,
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: { trigger: rail, start: "top 82%", once: true },
        },
      );
    }, railRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="featured" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-ink">
            Our Featured Products
          </h2>
          <p className="text-ink-soft mt-3">Get the skin you want to feel</p>
        </Reveal>

        <div className="relative">
          <Arrow side="left" onClick={() => scrollByPage(-1)} />

          <div
            ref={railRef}
            className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-1 px-1 pb-2"
          >
            {products.map((p) => (
              <div
                key={p.slug}
                className="snap-start shrink-0 w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>

          <Arrow side="right" onClick={() => scrollByPage(1)} />
        </div>

        <Reveal className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
          >
            View All Products
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Arrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={side === "left" ? "Previous products" : "Next products"}
      className={`hidden md:grid place-items-center absolute top-1/3 z-10 ${
        side === "left" ? "-left-5" : "-right-5"
      } w-10 h-10 rounded-full border border-black/10 bg-white/90 text-ink-soft shadow-sm hover:text-brand hover:border-brand transition-colors`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
