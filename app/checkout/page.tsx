"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../lib/cart-context";
import { formatPrice } from "../lib/products";
import { CheckIcon } from "../components/icons";
import { STORE, waLink } from "../lib/store-config";
import { placeOrder } from "./actions";

type PayMethod = "cod" | "online";

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [payment, setPayment] = useState<PayMethod>("cod");
  const [placedMethod, setPlacedMethod] = useState<PayMethod>("cod");
  const [placedTotal, setPlacedTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    setSubmitting(true);
    const res = await placeOrder({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      address: String(fd.get("address") ?? ""),
      city: String(fd.get("city") ?? ""),
      paymentMethod: payment,
      items: items.map((i) => ({
        slug: i.slug,
        name: i.name,
        price: i.price,
        qty: i.qty,
      })),
    });
    setSubmitting(false);
    if (res.ok) {
      setOrderNumber(res.orderNumber ?? null);
      setPlacedMethod(payment);
      setPlacedTotal(subtotal);
      setPlaced(true);
      clear(); // empties the cart + clears browser storage
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(res.error ?? "Something went wrong.");
    }
  };

  // Order confirmation
  if (placed) {
    return (
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand/10 grid place-items-center mb-6">
            <CheckIcon className="w-8 h-8 text-brand" />
          </div>
          <h1 className="font-display text-4xl text-ink mb-3">
            Thank you for your order
          </h1>
          {orderNumber != null && (
            <p className="text-ink font-medium mb-4">Order #{orderNumber}</p>
          )}

          {placedMethod === "online" ? (
            <div className="text-left bg-cream border border-black/10 rounded-lg p-5 mb-8">
              <p className="text-sm text-ink-soft mb-3">
                To complete your order, send{" "}
                <span className="text-ink font-medium">
                  {formatPrice(placedTotal)}
                </span>{" "}
                via Easypaisa to:
              </p>
              <div className="bg-white border border-black/10 rounded px-4 py-3 mb-3">
                <p className="text-lg font-medium text-ink">
                  {STORE.easypaisaNumber}
                </p>
                <p className="text-xs text-ink-soft">{STORE.easypaisaName}</p>
              </div>
              <p className="text-sm text-ink-soft">
                Then send a screenshot of the payment to our WhatsApp{" "}
                <span className="text-ink font-medium">
                  {STORE.whatsappDisplay}
                </span>
                . We&apos;ll confirm your order once received.
              </p>
              <a
                href={waLink(
                  STORE.whatsapp,
                  `Assalam-o-Alaikum! I've placed order #${orderNumber} (${formatPrice(
                    placedTotal,
                  )}) and paid via Easypaisa. Here is my payment screenshot:`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest px-5 py-3 hover:opacity-90 transition-opacity"
              >
                Send screenshot on WhatsApp
              </a>
            </div>
          ) : (
            <p className="text-ink-soft mb-8">
              Your order has been placed. We&apos;ll contact you shortly to
              confirm delivery. Payment is{" "}
              <span className="text-ink font-medium">cash on delivery</span>.
            </p>
          )}

          <Link
            href="/shop"
            className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  // Avoid flashing the empty state before the stored cart has loaded.
  if (!hydrated) {
    return <main className="flex-1 min-h-[50vh]" />;
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="font-display text-4xl text-ink mb-3">
            Your cart is empty
          </h1>
          <p className="text-ink-soft mb-8">
            Add a few favourites before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-8 py-4 hover:bg-brand transition-colors"
          >
            Shop the Collection
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="font-display text-4xl sm:text-5xl text-ink mb-10">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Delivery details */}
          <form onSubmit={handleSubmit} className="order-2 lg:order-1">
            <h2 className="text-sm uppercase tracking-[0.18em] text-ink mb-6">
              Delivery details
            </h2>
            <div className="space-y-4">
              <Field label="Full name" name="name" autoComplete="name" />
              <Field
                label="Phone number"
                name="phone"
                type="tel"
                autoComplete="tel"
              />
              <Field
                label="Address"
                name="address"
                autoComplete="street-address"
              />
              <Field label="City" name="city" autoComplete="address-level2" />
            </div>

            {/* Payment method */}
            <div className="mt-8">
              <h2 className="text-sm uppercase tracking-[0.18em] text-ink mb-4">
                Payment method
              </h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors ${
                    payment === "cod"
                      ? "border-ink bg-cream"
                      : "border-black/15 hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "cod"}
                    onChange={() => setPayment("cod")}
                  />
                  <span className="text-sm text-ink">Cash on Delivery</span>
                </label>

                <label
                  className={`flex items-center gap-3 border px-4 py-3 cursor-pointer transition-colors ${
                    payment === "online"
                      ? "border-ink bg-cream"
                      : "border-black/15 hover:border-ink/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === "online"}
                    onChange={() => setPayment("online")}
                  />
                  <span className="text-sm text-ink">
                    Online payment (Easypaisa)
                  </span>
                </label>
              </div>

              {payment === "online" && (
                <div className="mt-4 border border-brand/30 bg-brand/5 rounded p-4 text-sm">
                  <p className="text-ink-soft mb-2">
                    Send{" "}
                    <span className="text-ink font-medium">
                      {formatPrice(subtotal)}
                    </span>{" "}
                    via Easypaisa to:
                  </p>
                  <p className="text-lg font-medium text-ink">
                    {STORE.easypaisaNumber}
                  </p>
                  <p className="text-xs text-ink-soft mb-3">
                    {STORE.easypaisaName}
                  </p>
                  <p className="text-ink-soft">
                    After placing your order, send a screenshot of the payment
                    to our WhatsApp{" "}
                    <span className="text-ink font-medium">
                      {STORE.whatsappDisplay}
                    </span>{" "}
                    and we&apos;ll confirm it.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full bg-ink text-white text-xs uppercase tracking-widest py-4 hover:bg-brand transition-colors disabled:opacity-50"
            >
              {submitting
                ? "Placing order…"
                : `Place Order · ${formatPrice(subtotal)}`}
            </button>
          </form>

          {/* Order summary */}
          <div className="order-1 lg:order-2">
            <h2 className="text-sm uppercase tracking-[0.18em] text-ink mb-6">
              Order summary
            </h2>
            <div className="divide-y divide-black/5 border-y border-black/10">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-4 py-4">
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-cream">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink">{item.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">Qty {item.qty}</p>
                  </div>
                  <span className="text-sm font-medium text-ink">
                    {formatPrice(item.lineTotal)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mt-5 text-sm">
              <Row label="Subtotal" value={formatPrice(subtotal)} />
              <Row label="Shipping" value="Free" />
              <div className="flex items-center justify-between pt-3 border-t border-black/10 text-base">
                <span className="font-medium text-ink">Total</span>
                <span className="font-medium text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
        {label}<span className="text-red-500"> *</span>
      </label>
      <input
        type={type}
        name={name}
        required
        autoComplete={autoComplete}
        className="w-full border border-black/15 px-4 py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-ink"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-ink-soft">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
