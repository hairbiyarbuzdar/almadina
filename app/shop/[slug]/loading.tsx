import { Skeleton, ProductGridSkeleton } from "../../components/skeleton";

export default function ProductLoading() {
  return (
    <main className="flex-1">
      <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 pt-8 pb-20 lg:pb-28">
        {/* Breadcrumb */}
        <Skeleton className="h-3 w-40 mb-8" />

        {/* Image + summary */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Skeleton className="aspect-square w-full rounded-none" />

          <div className="lg:py-4 space-y-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-4/5" />
            </div>
            <Skeleton className="h-12 w-full max-w-md mt-4" />
          </div>
        </div>

        {/* Sections */}
        <div className="mt-20 lg:mt-28 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="space-y-3">
            <Skeleton className="h-7 w-48 mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-3 w-11/12" />
            ))}
          </div>
          <div className="space-y-3">
            <Skeleton className="h-7 w-40 mb-4" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-10/12" />
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12">
            <Skeleton className="h-8 w-56" />
          </div>
          <ProductGridSkeleton count={4} />
        </div>
      </section>
    </main>
  );
}
