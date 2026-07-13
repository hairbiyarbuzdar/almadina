import Image from "next/image";
import Link from "next/link";
import { RevealStagger } from "./animations";

export function Hero() {
  return (
    <section className="relative bg-cream overflow-hidden">
      {/* Desktop: photo occupies the right half at ~native size (stays sharp) */}
      <div className="hidden lg:block absolute top-0 right-0 h-full w-1/2">
        <Image
          src="/photo1.png"
          alt="Woman with clear, glowing skin holding a moisturizing cream"
          fill
          preload
          quality={90}
          sizes="50vw"
          className="object-cover object-[62%_center] brightness-[1.04] contrast-[1.03] saturate-[1.05]"
        />
        {/* blend the photo's left edge into the cream text area */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-cream to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 items-center min-h-[82vh] lg:min-h-[88vh]">
          {/* Copy */}
          <RevealStagger
            as="div"
            y={30}
            stagger={0.15}
            className="order-2 lg:order-1 max-w-md pb-12 lg:pb-0"
          >
            <p className="text-[11px] uppercase tracking-[0.25em] text-ink-soft mb-5">
              Essential Items
            </p>
            <h1 className="font-display text-5xl sm:text-6xl leading-[1.05] text-ink mb-6">
              Beauty Inspired
              <br />
              by Real Life
            </h1>
            <p className="text-ink-soft leading-relaxed mb-8 max-w-sm">
              Made using clean, non-toxic ingredients, our products are designed
              for everyone.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
            >
              Shop Now
            </Link>
          </RevealStagger>

          {/* Mobile / tablet: photo as a contained block (native orientation) */}
          <div className="order-1 lg:hidden -mx-4 sm:-mx-6 mb-8">
            <div className="relative w-full aspect-[896/1070] max-h-[62vh]">
              <Image
                src="/photo1.png"
                alt="Woman with clear, glowing skin holding a moisturizing cream"
                fill
                priority
                quality={90}
                sizes="100vw"
                className="object-cover object-center brightness-[1.04] contrast-[1.03] saturate-[1.05]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
