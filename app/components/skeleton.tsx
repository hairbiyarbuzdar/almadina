// Shared loading skeletons — the same building blocks everywhere for a
// consistent shimmer while data loads.

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-black/[0.08] rounded ${className}`} />
  );
}

/** Matches the storefront ProductCard layout. */
export function ProductCardSkeleton() {
  return (
    <div>
      <Skeleton className="w-full aspect-square mb-4 rounded-none" />
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
