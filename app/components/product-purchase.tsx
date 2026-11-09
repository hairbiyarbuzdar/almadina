"use client";

import { useState } from "react";
import Image from "next/image";
import { formatPrice, priceToNumber, type Product } from "../lib/products";
import { AddToCart } from "./add-to-cart";
import { StarIcon, TruckIcon, RefreshIcon } from "./icons";

export function ProductPurchase({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState<string>();
  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant ? variant.price ?? product.basePrice ?? priceToNumber(product.price) : priceToNumber(product.price);
  const image = variant?.image || product.image;
  const hasVariants = Boolean(product.optionName);
  const wasPrice = product.wasPrice && priceToNumber(product.wasPrice) > price ? product.wasPrice : null;

  return <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
    <div data-product-image className="relative aspect-square overflow-hidden bg-cream">
      <Image src={image} alt={`${product.name}${variant ? ` — ${variant.name}` : ""}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      {product.badge && <span className={`absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded ${product.badge.startsWith("-") ? "bg-sale text-white" : "bg-ink text-white"}`}>{product.badge}</span>}
    </div>
    <div className="lg:py-4 min-w-0">
      <p className="text-[11px] uppercase tracking-[0.22em] text-brand mb-3">{product.category}</p>
      <h1 className="font-display text-4xl sm:text-5xl text-ink leading-tight mb-4">{product.name}</h1>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex gap-0.5" aria-label={`${product.rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, i) => <StarIcon key={i} className={`w-4 h-4 ${i < product.rating ? "text-brand" : "text-black/15"}`} />)}
        </div>
        <span className="text-xs text-ink-soft">{product.rating}.0 · Verified reviews</span>
      </div>
      <div className="flex flex-wrap items-baseline gap-3 mb-6" aria-live="polite" aria-atomic="true">
        {wasPrice && <span className="text-lg text-ink-soft line-through">{wasPrice}</span>}
        <span className="text-2xl font-medium text-ink">{!variant && product.priceVaries ? "From " : ""}{formatPrice(price)}</span>
        {product.size && <span className="text-sm text-ink-soft">/ {product.size}</span>}
      </div>
      <p className="text-ink-soft leading-relaxed mb-8 max-w-md">{product.description}</p>
      {hasVariants && <fieldset className="mb-6">
        <legend className="text-sm font-medium text-ink mb-3">{product.optionName}: {variant?.name ?? "Choose an option"}</legend>
        <div className="flex flex-wrap gap-2">
          {(product.variants ?? []).map((v) => <label key={v.id} className={`relative flex items-center gap-2 min-h-11 px-3 py-2 border rounded text-sm cursor-pointer focus-within:outline-2 focus-within:outline-brand focus-within:outline-offset-2 ${variantId === v.id ? "border-ink bg-cream text-ink" : "border-black/15 text-ink-soft hover:border-ink/50"}`}>
            <input type="radio" name="product-variation" value={v.id} checked={variantId === v.id} onChange={() => setVariantId(v.id)} className="w-4 h-4 accent-brand shrink-0" />
            {v.color && <span aria-hidden="true" className="w-5 h-5 rounded-full border border-black/15 shrink-0" style={{ backgroundColor: v.color }} />}
            <span className="break-words">{v.name}{v.stock <= 0 && <span className="block text-xs">Sold out</span>}</span>
          </label>)}
        </div>
        {(product.variants?.length ?? 0) === 0 && <p className="text-sm text-ink-soft">No options are available right now.</p>}
        <p className="text-xs text-ink-soft mt-3" aria-live="polite">{variant ? `${product.optionName}: ${variant.name} · ${variant.stock > 0 ? "In stock" : "Sold out — please choose another option"}` : `Select a ${product.optionName?.toLowerCase()} before adding to your cart.`}</p>
      </fieldset>}
      <AddToCart key={variantId ?? "unselected"} product={product} variant={variant} />
      <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-soft border-t border-black/10 pt-6">
        <span className="flex items-center gap-2"><TruckIcon className="w-5 h-5 text-ink" />Free delivery over Rs 10,000</span>
        <span className="flex items-center gap-2"><RefreshIcon className="w-5 h-5 text-ink" />30-day returns</span>
      </div>
    </div>
  </div>;
}
