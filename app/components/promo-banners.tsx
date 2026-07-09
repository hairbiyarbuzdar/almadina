import Image from "next/image";
import Link from "next/link";

export function PromoBanners() {
  return (
    <section className="pb-20 lg:pb-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left — new collection */}
          <div className="relative flex items-center overflow-hidden bg-cream min-h-[280px] p-8 sm:p-10">
            {/* Real product photo */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
              <Image
                src="/products/intensive-glow-c-serum.jpg"
                alt="Intensive Glow C+ Serum"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cream to-transparent" />
            </div>
            <div className="relative z-10 max-w-[55%]">
              <p className="text-[11px] uppercase tracking-[0.22em] text-ink-soft mb-3">
                New Collection
              </p>
              <h3 className="font-display text-3xl sm:text-4xl leading-tight text-ink mb-6">
                Intensive Glow
                <br />
                C+ Serum
              </h3>
              <Link
                href="/shop"
                className="inline-flex items-center border border-ink text-ink text-xs uppercase tracking-widest px-6 py-3 hover:bg-ink hover:text-white transition-colors"
              >
                Explore More
              </Link>
            </div>
          </div>

          {/* Right — sale */}
          <div className="relative flex items-center overflow-hidden bg-sage min-h-[280px] p-8 sm:p-10">
            {/* Real product photo */}
            <div className="absolute right-0 top-0 bottom-0 w-1/2">
              <Image
                src="/products/hyaluronic-acid-serum.jpg"
                alt="Al-Madina collection"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-sage to-transparent" />
            </div>
            <div className="relative z-10 max-w-[55%]">
              <h3 className="font-display text-3xl sm:text-4xl leading-tight text-ink mb-3">
                25% off Everything
              </h3>
              <p className="text-ink-soft text-sm mb-6 max-w-[16rem]">
                Makeup with extended range in colors for every human.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center bg-white text-ink text-xs uppercase tracking-widest px-6 py-3 hover:bg-ink hover:text-white transition-colors"
              >
                Shop Sale
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
