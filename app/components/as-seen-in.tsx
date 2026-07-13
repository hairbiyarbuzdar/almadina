import { QuoteMark } from "./icons";
import { Reveal, RevealStagger } from "./animations";

const PRESS = [
  {
    brand: "Parker & Co.",
    quote:
      "Also the customer service is phenomenal. I would purchase again.",
  },
  {
    brand: "HAYDEN",
    quote: "Great product line. Very attentive staff to deal with.",
  },
  {
    brand: "GOOD MOOD",
    quote:
      "Looking to affordably upgrade your everyday dinnerware? Look no further than e Space.",
  },
];

export function AsSeenIn() {
  return (
    <section className="bg-sage-soft">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <Reveal as="h2" className="text-center font-display text-3xl sm:text-4xl text-ink mb-12">
          As seen in
        </Reveal>
        <RevealStagger className="grid gap-12 md:grid-cols-3">
          {PRESS.map((p) => (
            <figure key={p.brand} className="text-center">
              <div className="font-display text-2xl tracking-wide text-ink mb-5">
                {p.brand}
              </div>
              <blockquote className="relative text-sm text-ink-soft leading-relaxed max-w-xs mx-auto">
                <QuoteMark className="w-5 h-5 mx-auto mb-2 text-brand/60" />
                {p.quote}
              </blockquote>
            </figure>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
