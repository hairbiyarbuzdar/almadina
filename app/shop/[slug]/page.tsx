import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "../../lib/data";
import { priceToNumber } from "../../lib/products";
import { absoluteUrl, buildOpenGraph, SITE_NAME } from "../../lib/seo";
import { ProductCard } from "../../components/product-card";
import { ProductPurchase } from "../../components/product-purchase";
import { Reveal, RevealStagger } from "../../components/animations";
import { CheckIcon } from "../../components/icons";

// Render from the database on each request so dashboard edits show immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };

  const path = `/shop/${slug}`;
  const description = product.blurb || product.description.slice(0, 160);

  return {
    title: `${product.name} — ${product.size}`,
    description,
    alternates: { canonical: path },
    openGraph: buildOpenGraph({
      title: `${product.name} — ${SITE_NAME}`,
      description,
      path,
      image: product.image,
      imageWidth: 1200,
      imageHeight: 1200,
      imageAlt: product.name,
    }),
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${SITE_NAME}`,
      description,
      images: [product.image],
    },
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [product.image, ...(product.images ?? [])].map(absoluteUrl),
    category: product.category,
    brand: { "@type": "Brand", name: SITE_NAME },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      ratingCount: 1,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/shop/${slug}`),
      priceCurrency: "PKR",
      price: priceToNumber(product.price),
      availability:
        (product.stock ?? 0) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <nav className="text-xs uppercase tracking-[0.15em] text-ink-soft mb-8">
          <Link href="/shop" className="hover:text-ink">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <span>{product.category}</span>
        </nav>

        <ProductPurchase product={product} />

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
