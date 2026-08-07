import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "../../lib/data";
import { ProductCard } from "../../components/product-card";
import { AddToCart } from "../../components/add-to-cart";
import { Reveal, RevealStagger } from "../../components/animations";
import { StarIcon, CheckIcon, TruckIcon, RefreshIcon } from "../../components/icons";

// Render from the database on each request so dashboard edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product — Al-Madina" };
  return {
    title: `${product.name} — Al-Madina`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(slug);
  const onSale = product.badge?.startsWith("-");

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-8">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </nav>

        {/* Top: image + summary */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div
            data-product-image
            className="relative aspect-square overflow-hidden bg-cream"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {product.badge && (
              <span
                className={`absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded ${
                  onSale ? "bg-sale text-white" : "bg-ink text-white"
                }`}
              >
                {product.badge}
              </span>
            )}
          </div>

          <div className="lg:py-4">
            <p className="text-[11px] uppercase tracking-[0.22em] text-brand mb-3">
              {product.category}
            </p>
            <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-5">
              <Stars value={product.rating} />
              <span className="text-xs text-ink-soft">
                {product.rating}.0 · Verified reviews
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              {product.wasPrice && (
                <span className="text-lg text-ink-soft line-through">
                  {product.wasPrice}
                </span>
              )}
              <span className="text-2xl font-medium text-ink">
                {product.price}
              </span>
              <span className="text-sm text-ink-soft">/ {product.size}</span>
            </div>

            <p className="text-ink-soft leading-relaxed mb-8 max-w-md">
              {product.description}
            </p>

            <AddToCart product={product} />

            {/* Reassurance */}
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft border-t border-black/10 pt-6">
              <span className="flex items-center gap-2">
                <TruckIcon className="w-5 h-5 text-ink" />
                Free delivery over Rs 10,000
              </span>
              <span className="flex items-center gap-2">
                <RefreshIcon className="w-5 h-5 text-ink" />
                30-day returns
              </span>
            </div>
          </div>
        </div>

        {/* What it's used for */}
        <Reveal as="section" className="mt-20 lg:mt-28 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-ink mb-6">
              What it&apos;s used for
            </h2>
            <ul className="space-y-3.5">
              {product.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-brand shrink-0 mt-0.5" />
                  <span className="text-ink-soft leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* How to use */}
          <div>
            <h2 className="font-display text-3xl text-ink mb-6">How to use</h2>
            <p className="text-ink-soft leading-relaxed">{product.howToUse}</p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm text-ink bg-cream px-4 py-2 rounded-full">
              <span className="font-medium">Size:</span> {product.size}
            </div>
          </div>
        </Reveal>

        {/* Key ingredients */}
        <section className="mt-20 lg:mt-24">
          <Reveal as="h2" className="font-display text-3xl text-ink mb-8 text-center">
            Key ingredients
          </Reveal>
          <RevealStagger className="grid sm:grid-cols-3 gap-6">
            {product.ingredients.map((ing) => (
              <div
                key={ing.name}
                className="bg-cream p-6 text-center"
              >
                <h3 className="font-display text-xl text-ink mb-2">
                  {ing.name}
                </h3>
                <p className="text-sm text-ink-soft leading-relaxed">
                  {ing.note}
                </p>
              </div>
            ))}
          </RevealStagger>
        </section>
      </div>

      {/* Related */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <Reveal as="h2" className="font-display text-3xl sm:text-4xl text-ink text-center mb-12">
            You may also like
          </Reveal>
          <RevealStagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </RevealStagger>
        </div>
      </section>
    </main>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`w-4 h-4 ${i < value ? "text-brand" : "text-black/15"}`}
        />
      ))}
    </div>
  );
}
