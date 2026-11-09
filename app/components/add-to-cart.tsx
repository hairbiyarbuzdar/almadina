"use client";

import { useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useCart } from "../lib/cart-context";
import { useFlyToCart } from "./fly-to-cart";
import { formatPrice, priceToNumber, type Product, type ProductVariant } from "../lib/products";
import { cartLineKey } from "../lib/cart-lines";

export function AddToCart({ product, variant }: { product: Product; variant?: ProductVariant }) {
  const { addItem, items } = useCart();
  const fly = useFlyToCart();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const controls = useAnimationControls();

  const needsSelection = Boolean(product.optionName) && !variant;
  const stock = variant?.stock ?? product.stock;
  const price = variant ? variant.price ?? product.basePrice ?? priceToNumber(product.price) : priceToNumber(product.price);
  const image = variant?.image || product.image;
  const existingQty = items.find((item) => cartLineKey(item) === cartLineKey({ slug: product.slug, variantId: variant?.id }))?.qty ?? 0;
  const remaining = stock === undefined ? 999 : Math.max(0, Math.min(999, stock) - existingQty);
  const outOfStock = stock !== undefined && stock <= 0;
  const atLimit = remaining <= 0 && !outOfStock;
  const displayQty = Math.max(1, Math.min(qty, remaining));

  const handleAdd = () => {
    if (busy || outOfStock || needsSelection || remaining <= 0) return;

    // Press feedback on the button itself (keyframes need a tween, not a spring).
    controls.start({
      scale: [1, 0.96, 1.03, 1],
      transition: { duration: 0.35, ease: "easeOut", times: [0, 0.3, 0.65, 1] },
    });

    const addNow = () => {
      addItem(
        {
          slug: product.slug,
          name: product.name,
          price,
          image,
          size: product.size,
          variantId: variant?.id,
          variantName: variant ? `${product.optionName}: ${variant.name}` : undefined,
          stock,
        },
        Math.min(displayQty, remaining),
      );
      setBusy(false);
    };

    const source = document.querySelector("[data-product-image]");
    const rect = source?.getBoundingClientRect();

    if (fly && rect) {
      setBusy(true);
      // Fly a clone to the cart; increment the count when it lands.
      fly(image, rect, addNow);
    } else {
      addNow();
    }
  };

  return (
    <div className="max-w-md mb-8">
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm text-ink-soft">Quantity</span>
        <div className="flex items-center border border-black/15">
          <button
            onClick={() => setQty(Math.max(1, displayQty - 1))}
            disabled={displayQty <= 1 || needsSelection}
            aria-label="Decrease quantity"
            className="w-11 h-11 text-ink-soft hover:text-ink disabled:opacity-40"
          >
            −
          </button>
          <span className="w-9 text-center text-sm">{displayQty}</span>
          <button
            onClick={() => setQty(Math.min(remaining, displayQty + 1))}
            disabled={needsSelection || displayQty >= remaining}
            aria-label="Increase quantity"
            className="w-11 h-11 text-ink-soft hover:text-ink disabled:opacity-40"
          >
            +
          </button>
        </div>
        {!needsSelection && stock !== undefined && stock > 0 && stock <= 5 && (
          <span className="text-xs text-sale">Only {stock} left</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          type="button"
          disabled={busy || outOfStock || needsSelection || atLimit}
          onClick={handleAdd}
          animate={controls}
          whileTap={{ scale: 0.96 }}
          className="flex-1 bg-ink text-white text-xs uppercase tracking-widest py-4 px-6 hover:bg-brand transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {needsSelection ? `Choose ${product.optionName?.toLowerCase()}` : outOfStock ? "Sold out" : atLimit ? "All available stock is in your cart" : busy ? "Adding…" : `Add to Cart — ${formatPrice(price)}`}
        </motion.button>
      </div>
    </div>
  );
}
