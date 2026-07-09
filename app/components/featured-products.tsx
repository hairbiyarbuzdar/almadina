import Link from "next/link";
import { PRODUCTS } from "../lib/products";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight } from "./icons";

// A hand-picked set of hero products for the landing page.
const FEATURED = [
  "natural-coconut-cleansing-oil",
  "rich-repair-night-cream",
  "intensive-glow-c-serum",
  "daily-shield-spf-50",
]
  .map((slug) => PRODUCTS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PRODUCTS)[number] => Boolean(p));

export function FeaturedProducts() {
  return (
    <section id="featured" className="py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-ink">
            Our Featured Products
          </h2>
          <p className="text-ink-soft mt-3">Get the skin you want to feel</p>
        </div>

        <div className="relative">
          <Arrow side="left" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {FEATURED.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <Arrow side="right" />
        </div>

        <div className="text-center mt-14">
          <Link
            href="/shop"
            className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}

function Arrow({ side }: { side: "left" | "right" }) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`hidden xl:grid place-items-center absolute top-1/3 ${
        side === "left" ? "-left-5" : "-right-5"
      } w-10 h-10 rounded-full border border-black/10 bg-white/80 text-ink-soft hover:text-brand hover:border-brand transition-colors`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
}
