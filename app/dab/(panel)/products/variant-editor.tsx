"use client";

import { useState } from "react";
import type { VariantInput } from "@/app/lib/variants";

type Row = Omit<VariantInput, "stock" | "price"> & { key: string; stock: string; price: string };

export function VariantEditor({ initial, enabled, onToggle, optionName }: {
  initial: VariantInput[];
  enabled: boolean;
  onToggle: (value: boolean) => void;
  optionName?: string | null;
}) {
  const [rows, setRows] = useState<Row[]>(() => initial.map((v) => ({
    ...v, key: v.id!, stock: String(v.stock), price: v.price == null ? "" : String(v.price),
  })));
  const update = (key: string, patch: Partial<Row>) => setRows((prev) => prev.map((r) => r.key === key ? { ...r, ...patch } : r));
  const move = (index: number, direction: number) => setRows((prev) => {
    const next = [...prev];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    return next;
  });
  const input = "w-full min-w-0 border border-black/15 rounded px-3 py-2.5 text-sm text-ink bg-white focus-visible:outline-2 focus-visible:outline-brand";

  return (
    <section className="border-t border-black/10 pt-6 space-y-4" aria-labelledby="variations-title">
      <h2 id="variations-title" className="text-base font-medium text-ink">Product variations</h2>
      <label className="flex items-center gap-3 text-sm text-ink">
        <input type="checkbox" name="hasVariants" checked={enabled} onChange={(e) => onToggle(e.target.checked)} className="accent-brand w-4 h-4" />
        This product has variations
      </label>
      <p className="text-sm text-ink-soft">Sell shades, colors, or sizes under one product. Each choice has its own stock.</p>
      {enabled && <>
        <label className="block text-sm text-ink">
          Option name <span className="text-ink-soft">(required)</span>
          <input name="optionName" defaultValue={optionName ?? "Shade"} required maxLength={40} placeholder="e.g. Shade, Color, Size" className={`${input} mt-1.5`} />
        </label>
        <input type="hidden" name="variants" value={JSON.stringify(rows)} />
        {rows.length === 0 && <p className="text-sm text-ink-soft bg-cream p-4">Add your first variation below, such as Ruby Red.</p>}
        <div className="space-y-5">
          {rows.map((row, index) => <fieldset key={row.key} className="border border-black/10 rounded-lg p-4 space-y-4">
            <legend className="px-1 text-sm font-medium text-ink">{row.name || `Variation ${index + 1}`}{!row.active && " · Hidden"}</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="text-sm text-ink">Name (required)
                <input aria-label={`Variation ${index + 1} name`} value={row.name} onChange={(e) => update(row.key, { name: e.target.value })} required maxLength={80} className={`${input} mt-1.5`} placeholder="Ruby Red" />
              </label>
              <label className="text-sm text-ink">Stock (required)
                <input aria-label={`Variation ${index + 1} stock`} type="number" min={0} max={2147483647} step={1} value={row.stock} onChange={(e) => update(row.key, { stock: e.target.value })} required className={`${input} mt-1.5`} />
              </label>
              <label className="text-sm text-ink">Price override (Rs)
                <input aria-label={`Variation ${index + 1} price`} type="number" min={1} max={2147483647} step={1} value={row.price} onChange={(e) => update(row.key, { price: e.target.value })} className={`${input} mt-1.5`} placeholder="Use product price" />
              </label>
              <div>
                <label className="text-sm text-ink flex items-center gap-3 min-h-11">
                  <input type="checkbox" checked={Boolean(row.color)} onChange={(e) => update(row.key, { color: e.target.checked ? "#b33b4f" : null })} className="accent-brand" />
                  Show color swatch
                </label>
                {row.color && <input type="color" aria-label={`Variation ${index + 1} swatch color`} value={row.color} onChange={(e) => update(row.key, { color: e.target.value })} className="w-full h-11 border border-black/15 rounded cursor-pointer" />}
              </div>
            </div>
            <label className="block text-sm text-ink">Variation image (optional)
              <input type="file" name={`variantImage-${index}`} accept="image/*" className="block w-full text-sm mt-2 file:border file:border-black/15 file:bg-cream file:px-3 file:py-2 file:mr-3" />
              <span className="block text-xs text-ink-soft mt-2">Uses the product image when no image is added. Maximum 5 MB per image, 15 MB combined per save.</span>
            </label>
            {row.image && <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.image} alt={`${row.name} current image`} className="w-14 h-14 rounded object-cover bg-cream" />
              <button type="button" onClick={() => update(row.key, { image: null })} className="text-sm text-ink-soft underline underline-offset-4 min-h-11">Use product image</button>
            </div>}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-ink min-h-11"><input type="checkbox" checked={row.active} onChange={(e) => update(row.key, { active: e.target.checked })} className="accent-brand" /> Available in shop</label>
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label={`Move variation ${index + 1} up`} className="border border-black/15 rounded px-3 min-h-11 text-xs disabled:opacity-40">Move up</button>
                <button type="button" disabled={index === rows.length - 1} onClick={() => move(index, 1)} aria-label={`Move variation ${index + 1} down`} className="border border-black/15 rounded px-3 min-h-11 text-xs disabled:opacity-40">Move down</button>
                {!row.id && <button type="button" onClick={() => setRows((prev) => prev.filter((v) => v.key !== row.key))} className="text-sm text-ink-soft underline underline-offset-4 px-2 min-h-11">Remove</button>}
              </div>
            </div>
          </fieldset>)}
        </div>
        <button type="button" disabled={rows.length >= 100} onClick={() => setRows((prev) => [...prev, { key: crypto.randomUUID(), name: "", stock: "0", price: "", color: null, image: null, active: true }])} className="border border-black/15 rounded px-4 min-h-11 text-sm text-ink hover:border-ink focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-40">Add variation</button>
        <p className="text-xs text-ink-soft">Uncheck “Available in shop” to hide a variation. Sold-out choices remain visible with a sold-out label. Existing variations are kept for order history.</p>
      </>}
    </section>
  );
}
