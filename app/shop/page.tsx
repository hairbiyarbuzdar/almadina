import type { Metadata } from "next";
import Image from "next/image";
import { ShopGrid } from "../components/shop-grid";
import { getProducts, getCategoryNames } from "../lib/data";

export const metadata: Metadata = {
  title: "Shop — Al-Madina",
  description:
    "Browse the full Al-Madina collection of clean skincare — cleansers, serums, moisturizers, masks and more.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategoryNames(),
  ]);
  const initialCategory =
    category && categories.includes(category) ? category : "All";
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <Image
          src="/products/shop-hero.jpg"
          alt="Skincare ritual"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/35" />
        <div className="relative mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center min-h-[42vh] lg:min-h-[48vh] text-white">
            <p className="text-[11px] uppercase tracking-[0.25em] mb-4 text-white/80">
              The Collection
            </p>
            <h1 className="font-display text-5xl sm:text-6xl mb-4">Shop All</h1>
            <p className="max-w-md text-white/85 leading-relaxed">
              Clean, non-toxic formulas for every skin type — thoughtfully made
              and designed for everyone.
            </p>
          </div>
        </div>
      </section>

      <ShopGrid
        key={initialCategory}
        products={products}
        categories={categories}
        initialCategory={initialCategory}
      />
    </main>
  );
}
