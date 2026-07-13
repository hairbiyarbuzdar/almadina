"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchIcon } from "./icons";

type SearchItem = {
  slug: string;
  name: string;
  category: string;
  price: string;
  image: string;
  blurb: string;
  ingredients: string[];
};

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load the catalogue once, the first time search is opened.
  useEffect(() => {
    if (!open || items.length > 0) return;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data: SearchItem[]) => setItems(data))
      .catch(() => setItems([]));
  }, [open, items.length]);

  // Focus the input and close on Escape when open.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Clear the query shortly after closing.
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setQuery(""), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return items
      .filter((p) => {
        const haystack = `${p.name} ${p.category} ${p.blurb} ${p.ingredients.join(
          " ",
        )}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 6);
  }, [query, items]);

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute top-0 inset-x-0 bg-white transition-transform duration-300 ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        role="dialog"
        aria-label="Search products"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 border-b border-black/15 pb-3">
            <SearchIcon className="w-5 h-5 text-ink-soft" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, ingredients, concerns…"
              className="flex-1 text-lg text-ink placeholder:text-ink-soft/60 focus:outline-none bg-transparent"
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              className="text-ink-soft hover:text-ink text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            {query.trim() && results.length === 0 && (
              <p className="text-sm text-ink-soft py-6 text-center">
                No products found for &ldquo;{query}&rdquo;.
              </p>
            )}

            {results.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/${p.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 py-3 hover:bg-cream -mx-2 px-2 rounded"
              >
                <div className="relative w-14 h-14 shrink-0 overflow-hidden bg-cream">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink truncate">{p.name}</p>
                  <p className="text-xs text-ink-soft">{p.category}</p>
                </div>
                <span className="text-sm text-ink font-medium">{p.price}</span>
              </Link>
            ))}

            {!query.trim() && (
              <p className="text-sm text-ink-soft py-6 text-center">
                Try “serum”, “dry skin”, “vitamin c” or “cleanser”.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
