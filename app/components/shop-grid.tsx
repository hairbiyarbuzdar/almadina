"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "../lib/products";
import { ProductCard } from "./product-card";
import { ChevronLeft, ChevronRight } from "./icons";

const PAGE_SIZE = 8;

/** Page numbers with ellipsis for large counts, e.g. [1, "...", 4, 5, 6, "...", 12]. */
function pageList(current: number, total: number): (number | "…")[] {
  const out: (number | "…")[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - 1 && i <= current + 1)) {
      out.push(i);
    } else if (out[out.length - 1] !== "…") {
      out.push("…");
    }
  }
  return out;
}

export function ShopGrid({
  products: allProducts,
  categories,
  initialCategory = "All",
}: {
  products: Product[];
  categories: string[];
  initialCategory?: string;
}) {
  const filters = ["All", ...categories];
  const [active, setActive] = useState<string>(initialCategory);
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);

  const products =
    active === "All"
      ? allProducts
      : allProducts.filter((p) => p.category === active);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paged = products.slice(start, start + PAGE_SIZE);

  const changeCategory = (cat: string) => {
    setActive(cat);
    setPage(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      ref={topRef}
      className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 py-14 lg:py-20 scroll-mt-28"
    >
      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2.5 mb-12">
        {filters.map((cat) => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
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

      {/* Grid — items animate in/out as the filter or page changes. */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 relative">
        <AnimatePresence mode="popLayout">
          {paged.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{
                type: "spring",
                visualDuration: 0.4,
                bounce: 0.18,
                delay: i * 0.03,
              }}
            >
              <ProductCard product={p} priority={i < 4} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-16">
          <button
            onClick={() => goToPage(safePage - 1)}
            disabled={safePage === 1}
            aria-label="Previous page"
            className="grid place-items-center w-9 h-9 border border-black/15 text-ink-soft hover:border-ink hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageList(safePage, totalPages).map((p, i) =>
            p === "…" ? (
              <span
                key={`e${i}`}
                className="w-9 h-9 grid place-items-center text-ink-soft text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p)}
                aria-current={p === safePage}
                className={`w-9 h-9 text-sm border transition-colors ${
                  p === safePage
                    ? "bg-ink text-white border-ink"
                    : "border-black/15 text-ink-soft hover:border-ink hover:text-ink"
                }`}
              >
                {p}
              </button>
            ),
          )}

          <button
            onClick={() => goToPage(safePage + 1)}
            disabled={safePage === totalPages}
            aria-label="Next page"
            className="grid place-items-center w-9 h-9 border border-black/15 text-ink-soft hover:border-ink hover:text-ink disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
