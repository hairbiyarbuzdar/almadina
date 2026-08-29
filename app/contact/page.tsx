import type { Metadata } from "next";
import { ContactForm } from "../components/contact-form";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  WhatsAppIcon,
} from "../components/icons";

export const metadata: Metadata = {
  title: "Contact — Al-Madina",
  description:
    "Visit Al-Madina in Quetta and Hub Chowki, or get in touch by phone, WhatsApp or email.",
};

const PHONE = "+92 319 0189227";
const WHATSAPP = "923190189227"; // digits only, country code first
const EMAIL = "hairbiyarbuzdar@gmail.com";

const STORES = [
  {
    city: "Quetta",
    address: "Churi Gali, Quetta",
    hours: "Mon–Sat · 11am – 9pm",
    mapQuery: "Churi Gali, Quetta",
  },
  {
    city: "Hub Chowki",
    address: "Lasi Road, Hub Chowki",
    hours: "Mon–Sat · 11am – 9pm",
    mapQuery: "Lasi Road, Hub Chowki",
  },
];

export default function ContactPage() {
  return (
    <main className="flex-1">
      {/* Header */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 py-16 lg:py-20 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-brand mb-4">
            Get in touch
          </p>
          <h1 className="font-display text-5xl sm:text-6xl text-ink mb-4">
            Contact Us
          </h1>
          <p className="text-ink-soft max-w-md mx-auto">
            Questions about a product or your order? We&apos;re here to help —
            or come visit us in-store.
          </p>
        </div>
      </section>

      {/* Form + details */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div>
            <h2 className="text-sm uppercase tracking-[0.18em] text-ink mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          <div>
            <h2 className="text-sm uppercase tracking-[0.18em] text-ink mb-6">
              Reach us directly
            </h2>
            <ul className="space-y-5">
              <ContactRow
                Icon={PhoneIcon}
                label="Phone"
                value={PHONE}
                href={`tel:${PHONE.replace(/\s/g, "")}`}
              />
              <ContactRow
                Icon={WhatsAppIcon}
                label="WhatsApp"
                value="Message us"
                href={`https://wa.me/${WHATSAPP}`}
              />
              <ContactRow
                Icon={MailIcon}
                label="Email"
                value={EMAIL}
                href={`mailto:${EMAIL}`}
              />
              <ContactRow
                Icon={ClockIcon}
                label="Store hours"
                value="Mon–Sat · 11am – 9pm"
              />
            </ul>

            <div className="mt-8 border-t border-black/10 pt-6">
              <p className="text-sm text-ink-soft leading-relaxed">
                Prefer to order on WhatsApp? Send us your favourites and we&apos;ll
                arrange cash-on-delivery anywhere in Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Store locations */}
      <section className="bg-cream py-16 lg:py-20">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl sm:text-5xl text-ink text-center mb-12">
            Visit our stores
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {STORES.map((store) => (
              <div key={store.city} className="bg-white border border-black/10">
                <div className="relative aspect-[16/10] bg-mist">
                  <iframe
                    title={`Map of ${store.city} store`}
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      store.mapQuery,
                    )}&output=embed`}
                    className="absolute inset-0 w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-ink mb-3">
                    {store.city}
                  </h3>
                  <p className="flex items-start gap-2 text-ink-soft text-sm mb-1.5">
                    <MapPinIcon className="w-4 h-4 mt-0.5 shrink-0 text-ink" />
                    {store.address}
                  </p>
                  <p className="flex items-start gap-2 text-ink-soft text-sm mb-4">
                    <ClockIcon className="w-4 h-4 mt-0.5 shrink-0 text-ink" />
                    {store.hours}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      store.mapQuery,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs uppercase tracking-widest text-ink border-b border-ink pb-0.5 hover:text-brand hover:border-brand transition-colors"
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactRow({
  Icon,
  label,
  value,
  href,
}: {
  Icon: (props: { className?: string }) => React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span className="grid place-items-center w-10 h-10 rounded-full bg-cream text-ink shrink-0">
        <Icon className="w-5 h-5" />
      </span>
      <span>
        <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft">
          {label}
        </span>
        <span className="text-ink">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="flex items-center gap-4 group"
        >
          {content}
        </a>
      ) : (
        <div className="flex items-center gap-4">{content}</div>
      )}
    </li>
  );
}
