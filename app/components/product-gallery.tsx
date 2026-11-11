"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge?: string }) {
  const [index, setIndex] = useState(0);
  const selected = Math.min(index, images.length - 1);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const go = (direction: number) => setIndex((current) => (current + direction + images.length) % images.length);

  return <section aria-label="Product photo gallery" className="min-w-0 space-y-3">
    <div data-product-image className="relative aspect-square overflow-hidden bg-cream" onTouchStart={(event) => {
      const point = event.touches[0];
      touch.current = { x: point.clientX, y: point.clientY };
    }} onTouchEnd={(event) => {
      const point = event.changedTouches[0];
      if (touch.current && images.length > 1) {
        const dx = point.clientX - touch.current.x;
        const dy = point.clientY - touch.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      }
      touch.current = null;
    }} onTouchCancel={() => { touch.current = null; }}>
      <Image src={images[selected]} alt={selected === 0 ? name : `${name} — photo ${selected + 1}`} fill loading="eager" sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      {badge && <span className={`absolute top-4 left-4 text-xs font-medium px-2.5 py-1 rounded ${badge.startsWith("-") ? "bg-sale text-white" : "bg-ink text-white"}`}>{badge}</span>}
    </div>
    {images.length > 1 && <>
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} aria-label="Previous product photo" className="min-h-11 px-3 text-sm text-ink border border-black/15 hover:border-ink focus-visible:outline-2 focus-visible:outline-brand">Previous</button>
        <p aria-live="polite" aria-atomic="true" className="text-xs text-ink-soft">Photo {selected + 1} of {images.length}</p>
        <button type="button" onClick={() => go(1)} aria-label="Next product photo" className="min-h-11 px-3 text-sm text-ink border border-black/15 hover:border-ink focus-visible:outline-2 focus-visible:outline-brand">Next</button>
      </div>
      <div aria-label="Product photo thumbnails" className="flex gap-2 overflow-x-auto pb-2">
        {images.map((src, i) => <button type="button" key={src} onClick={() => setIndex(i)} aria-label={`View photo ${i + 1} of ${images.length}`} aria-pressed={selected === i} className={`relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 border-2 overflow-hidden focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 ${selected === i ? "border-ink" : "border-transparent hover:border-ink/40"}`}>
          <Image src={src} alt="" fill sizes="80px" className="object-cover" />
        </button>)}
      </div>
    </>}
  </section>;
}
