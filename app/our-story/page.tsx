import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TruckIcon, RefreshIcon, HeartIcon, StarIcon } from "../components/icons";
import { Reveal, RevealStagger, CountUp } from "../components/animations";

export const metadata: Metadata = {
  title: "Our Story — Al-Madina",
  description:
    "For more than 25 years, Al-Madina has crafted clean, effective cosmetics and skincare loved across generations.",
};

const STATS = [
  { value: "25+", label: "Years of craft" },
  { value: "120+", label: "Products created" },
  { value: "2", label: "Store locations" },
  { value: "1000s", label: "Happy customers" },
];

const STORES = [
  {
    image: "/story/store-1.jpg",
    city: "Quetta",
    address: "Churi Gali, Quetta",
  },
  {
    image: "/story/store-2.jpg",
    city: "Hub Chowki",
    address: "Lasi Road, Hub Chowki",
  },
];

const TIMELINE = [
  {
    year: "1999",
    title: "A single counter",
    text: "Haji Murtaza opens a modest beauty counter in Quetta, hand-blending creams for a loyal neighbourhood following.",
  },
  {
    year: "2006",
    title: "Our first flagship",
    text: "Growing demand leads to our first dedicated store in Churi Gali, Quetta — and our first in-house formulation lab.",
  },
  {
    year: "2013",
    title: "Going clean",
    text: "We reformulate the entire range around clean, non-toxic ingredients, years ahead of the trend.",
  },
  {
    year: "2019",
    title: "A second home",
    text: "We open our second store on Lasi Road, Hub Chowki — bringing Al-Madina beyond Quetta.",
  },
  {
    year: "2024",
    title: "A new chapter",
    text: "We bring the full collection online, so the ritual you love is only a tap away.",
  },
];

const VALUES = [
  {
    Icon: HeartIcon,
    title: "Clean & Non-Toxic",
    text: "Every formula is free from parabens, sulphates and needless fillers — only what your skin needs.",
  },
  {
    Icon: RefreshIcon,
    title: "Cruelty-Free",
    text: "Never tested on animals. Kindness is part of the recipe, from first draft to final bottle.",
  },
  {
    Icon: StarIcon,
    title: "Proven by Time",
    text: "25 years of feedback from real customers shapes everything we make — and everything we don't.",
  },
  {
    Icon: TruckIcon,
    title: "Made for Everyone",
    text: "Skincare designed for all skin types, tones and generations. Beauty, inspired by real life.",
  },
];

export default function OurStoryPage() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <Image
          src="/story/story-hero.jpg"
          alt="Inside an Al-Madina store"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-ink/45" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center text-center min-h-[52vh] lg:min-h-[62vh] text-white">
            <p className="text-[11px] uppercase tracking-[0.25em] mb-4 text-white/80">
              Est. 1999
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mb-5">
              Our Story
            </h1>
            <p className="max-w-xl text-white/85 leading-relaxed">
              Twenty-five years of blending science, nature and a genuine love
              for skin — one honest formula at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Heritage intro */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[5/6] overflow-hidden bg-cream order-1 lg:order-none">
            <Image
              src="/story/heritage.jpg"
              alt="Hand-crafted Al-Madina formulations"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand mb-5">
              Since 1999
            </p>
            <h2 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-6">
              A quarter-century in the making
            </h2>
            <div className="space-y-4 text-ink-soft leading-relaxed">
              <p>
                Al-Madina began in 1999 in Quetta, when Haji Murtaza opened a
                single counter with a simple belief: good skincare should be
                honest, effective and made for real people. What started by hand
                has grown into a name trusted by families across generations.
              </p>
              <p>
                For more than 25 years we&apos;ve stayed close to what matters —
                clean ingredients, careful craft, and formulas we&apos;d happily
                use ourselves. We&apos;ve grown, but the promise behind every
                bottle hasn&apos;t changed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
          <RevealStagger className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <p className="font-display text-5xl lg:text-6xl text-ink">
                  <CountUp value={s.value} />
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-ink-soft mt-2">
                  {s.label}
                </p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-ink">
              The journey
            </h2>
            <p className="text-ink-soft mt-3">
              Milestones from a 25-year love of skin
            </p>
          </Reveal>
          <RevealStagger as="ol" className="relative border-l border-black/10 ml-3 space-y-12" stagger={0.15}>
            {TIMELINE.map((t) => (
              <li key={t.year} className="relative pl-8">
                <span className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 rounded-full bg-brand ring-4 ring-white" />
                <p className="font-display text-2xl text-brand mb-1">{t.year}</p>
                <h3 className="text-lg font-medium text-ink mb-1.5">{t.title}</h3>
                <p className="text-ink-soft leading-relaxed">{t.text}</p>
              </li>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Values */}
      <section className="bg-sage-soft py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-14">
            <h2 className="font-display text-4xl sm:text-5xl text-ink">
              What we stand for
            </h2>
            <p className="text-ink-soft mt-3">
              The principles that have guided us since day one
            </p>
          </Reveal>
          <RevealStagger className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {VALUES.map(({ Icon, title, text }) => (
              <div key={title} className="text-center">
                <Icon className="w-9 h-9 mx-auto text-brand mb-4" />
                <h3 className="text-base font-medium text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-soft leading-relaxed">{text}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Founder note */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative aspect-[4/5] max-w-md overflow-hidden bg-cream order-1 lg:order-none">
            <Image
              src="/story/founder.jpg"
              alt="Al-Madina founder"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.25em] text-brand mb-6">
              A note from our founder
            </p>
            <blockquote className="font-display text-2xl sm:text-3xl text-ink leading-snug mb-6">
              &ldquo;We never set out to chase trends. We set out to make
              skincare our own families could trust — and 25 years later,
              that&apos;s still the only brief that matters.&rdquo;
            </blockquote>
            <p className="text-ink font-medium">Haji Murtaza</p>
            <p className="text-sm text-ink-soft">Founder, Al-Madina · Since 1999</p>
          </div>
        </div>
      </section>

      {/* Visit our store */}
      <section className="bg-cream py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-12">
            <h2 className="font-display text-4xl sm:text-5xl text-ink">
              Come say hello
            </h2>
            <p className="text-ink-soft mt-3 max-w-md mx-auto">
              Find us in Quetta and Hub Chowki. Visit us in-store for a personal
              skincare consultation.
            </p>
          </Reveal>
          <RevealStagger className="grid sm:grid-cols-2 gap-8" y={30}>
            {STORES.map((store) => (
              <div key={store.city}>
                <div className="relative aspect-[4/3] overflow-hidden bg-mist mb-5">
                  <Image
                    src={store.image}
                    alt={`Al-Madina store in ${store.city}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="font-display text-2xl text-ink">{store.city}</h3>
                <p className="text-ink-soft mt-1">{store.address}</p>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-24">
        <Reveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-ink mb-4">
            Discover the collection
          </h2>
          <p className="text-ink-soft mb-8 max-w-md mx-auto">
            Twenty-five years of craft, in every bottle. Find the ritual that
            fits your skin.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
          >
            Shop the Collection
          </Link>
        </Reveal>
      </section>
    </main>
  );
}
