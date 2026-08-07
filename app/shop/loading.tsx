import { Skeleton, ProductGridSkeleton } from "../components/skeleton";

export default function ShopLoading() {
  return (
    <main className="flex-1">
      {/* Hero placeholder */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-4 min-h-[42vh] lg:min-h-[48vh]">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-44" />
            <Skeleton className="h-3 w-72 max-w-full" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        {/* Filter chips */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24" />
          ))}
        </div>

        <ProductGridSkeleton count={8} />
      </div>
    </main>
  );
}
