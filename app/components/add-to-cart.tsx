"use client";

import { useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useCart } from "../lib/cart-context";
import { useFlyToCart } from "./fly-to-cart";
import { priceToNumber, type Product } from "../lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { addItem } = useCart();
  const fly = useFlyToCart();
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const controls = useAnimationControls();

  const outOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAdd = () => {
    if (busy || outOfStock) return;

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
          price: priceToNumber(product.price),
          image: product.image,
          size: product.size,
        },
        qty,
      );
      setBusy(false);
    };

    const source = document.querySelector("[data-product-image]");
    const rect = source?.getBoundingClientRect();

    if (fly && rect) {
      setBusy(true);
      // Fly a clone to the cart; increment the count when it lands.
      fly(product.image, rect, addNow);
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
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="w-9 h-9 text-ink-soft hover:text-ink"
          >
            −
          </button>
          <span className="w-9 text-center text-sm">{qty}</span>
          <button
            onClick={() => setQty((q) => q + 1)}
            aria-label="Increase quantity"
            className="w-9 h-9 text-ink-soft hover:text-ink"
          >
            +
          </button>
        </div>
        {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
          <span className="text-xs text-sale">Only {product.stock} left</span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <motion.button
          type="button"
          disabled={busy || outOfStock}
          onClick={handleAdd}
          animate={controls}
          whileTap={{ scale: 0.96 }}
          className="flex-1 bg-ink text-white text-xs uppercase tracking-widest py-4 px-6 hover:bg-brand transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of Stock" : `Add to Cart — ${product.price}`}
        </motion.button>
      </div>
    </div>
  );
}
