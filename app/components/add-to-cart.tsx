"use client";

import { useState } from "react";
import { useCart } from "../lib/cart-context";
import { priceToNumber, type Product } from "../lib/products";

export function AddToCart({ product }: { product: Product }) {
  const { addItem, openCart } = useCart();
  const [qty, setQty] = useState(1);

  const outOfStock = product.stock !== undefined && product.stock <= 0;

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
        <button
          disabled={outOfStock}
          onClick={() => {
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
            openCart();
          }}
          className="flex-1 bg-ink text-white text-xs uppercase tracking-widest py-4 px-6 hover:bg-brand transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {outOfStock ? "Out of Stock" : `Add to Cart — ${product.price}`}
        </button>
        <button className="border border-ink text-ink text-xs uppercase tracking-widest py-4 px-6 hover:bg-ink hover:text-white transition-colors">
          Wishlist
        </button>
      </div>
    </div>
  );
}
