"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../lib/cart-context";
import { formatPrice } from "../lib/products";
import { BagIcon } from "./icons";

export function CartDrawer() {
  const { items, count, subtotal, setQty, removeItem, isOpen, closeCart } =
    useCart();

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white flex flex-col shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-black/10">
          <h2 className="text-sm uppercase tracking-[0.18em] text-ink">
            Your Cart ({count})
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="text-ink-soft hover:text-ink text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-4">
            <BagIcon className="w-10 h-10 text-black/20" />
            <p className="text-ink-soft">Your cart is empty.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="inline-flex items-center bg-ink text-white text-xs uppercase tracking-widest px-6 py-3 hover:bg-brand transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-black/5">
              {items.map((item) => (
                <div key={item.slug} className="flex gap-4 py-4">
                  <Link
                    href={`/shop/${item.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 shrink-0 overflow-hidden bg-cream"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm text-ink hover:text-brand line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-ink-soft mt-0.5">
                      {formatPrice(item.price)} · {item.size}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-black/15">
                        <button
                          onClick={() => setQty(item.slug, item.qty - 1)}
                          aria-label="Decrease quantity"
                          className="w-7 h-7 text-ink-soft hover:text-ink"
                        >
                          −
                        </button>
                        <span className="w-7 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => setQty(item.slug, item.qty + 1)}
                          aria-label="Increase quantity"
                          className="w-7 h-7 text-ink-soft hover:text-ink"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-medium text-ink">
                        {formatPrice(item.lineTotal)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.slug)}
                    aria-label={`Remove ${item.name}`}
                    className="text-ink-soft hover:text-ink text-lg leading-none self-start"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Subtotal</span>
                <span className="text-lg font-medium text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-ink-soft">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block text-center bg-ink text-white text-xs uppercase tracking-widest py-4 hover:bg-brand transition-colors"
              >
                Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full text-center text-xs uppercase tracking-widest text-ink-soft hover:text-ink"
              >
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
