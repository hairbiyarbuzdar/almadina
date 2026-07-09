"use client";

import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "../lib/products";
import { ProductCard } from "./product-card";

const FILTERS = ["All", ...CATEGORIES] as const;

export function ShopGrid() {
  const [active, setActive] = useState<(typeof FILTERS)[number]>("All");

  const products =
    active === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === active);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-12">
        {FILTERS.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`text-xs uppercase tracking-widest px-4 py-2 border transition-colors ${
              active === cat
                ? "bg-ink text-white border-ink"
                : "border-black/15 text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-ink-soft mb-10">
        {products.length} {products.length === 1 ? "product" : "products"}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((p, i) => (
          <ProductCard key={p.slug} product={p} priority={i < 4} />
        ))}
      </div>
    </div>
  );
}
