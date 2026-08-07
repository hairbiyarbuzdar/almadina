import { Suspense } from "react";
import { Hero } from "./components/hero";
import { FeaturedProducts } from "./components/featured-products";
import { PromoBanners } from "./components/promo-banners";
import { Features } from "./components/features";
import { AsSeenIn } from "./components/as-seen-in";
import { getFeaturedProducts } from "./lib/data";
import { Skeleton, ProductGridSkeleton } from "./components/skeleton";

export const dynamic = "force-dynamic";

async function FeaturedSection() {
  const featured = await getFeaturedProducts(8);
  return <FeaturedProducts products={featured} />;
}

function FeaturedSkeleton() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 mb-12">
          <Skeleton className="h-9 w-72 max-w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
        <ProductGridSkeleton count={4} />
        <div className="flex justify-center mt-14">
          <Skeleton className="h-12 w-48" />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Suspense fallback={<FeaturedSkeleton />}>
        <FeaturedSection />
      </Suspense>
      <PromoBanners />
      <Features />
      <AsSeenIn />
    </main>
  );
}
