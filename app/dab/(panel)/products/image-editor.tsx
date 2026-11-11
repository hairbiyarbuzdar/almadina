"use client";

import { useEffect, useRef, useState } from "react";
import { MAX_PRODUCT_IMAGES, validateImageFile } from "@/app/lib/product-images";

export type ImageDraft = { key: string; preview: string; url?: string; file?: File };

export function ImageEditor({ images, onChange, disabled }: {
  images: ImageDraft[];
  onChange: (images: ImageDraft[]) => void;
  disabled: boolean;
}) {
  const [error, setError] = useState<string>();
  const objectUrls = useRef(new Set<string>());
  useEffect(() => {
    const urls = objectUrls.current;
    return () => { for (const url of urls) URL.revokeObjectURL(url); };
  }, []);

  const remove = (image: ImageDraft) => {
    if (objectUrls.current.delete(image.preview)) URL.revokeObjectURL(image.preview);
    onChange(images.filter((item) => item.key !== image.key));
    setError(undefined);
  };

  return <section aria-labelledby="product-images-title" className="space-y-3">
    <h2 id="product-images-title" className="text-sm font-medium text-ink">Product images</h2>
    <p className="text-xs text-ink-soft">The first image is the cover shown in the shop. Add up to 12 photos; 5 MB each, 15 MB of uploads per save.</p>
    {images.length === 0 && <div className="aspect-square rounded border border-dashed border-black/20 grid place-items-center text-sm text-ink-soft">Add a product photo to get started.</div>}
    <ol className="space-y-3">
      {images.map((image, index) => <li key={image.key} className="flex gap-3 border border-black/10 rounded p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.preview} alt={`Product photo ${index + 1} preview`} className="w-16 h-16 object-cover rounded bg-cream shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-ink">{index === 0 ? "Cover image" : `Photo ${index + 1}`}</p>
          <div className="flex flex-wrap gap-x-3">
            {index > 0 && <button type="button" disabled={disabled} onClick={() => onChange([image, ...images.filter((item) => item.key !== image.key)])} aria-label={`Make photo ${index + 1} the cover`} className="text-xs text-ink underline underline-offset-4 min-h-11">Make cover</button>}
            {index > 1 && <button type="button" disabled={disabled} onClick={() => {
              const next = [...images];
              [next[index - 1], next[index]] = [next[index], next[index - 1]];
              onChange(next);
            }} aria-label={`Move photo ${index + 1} earlier`} className="text-xs text-ink-soft underline underline-offset-4 min-h-11">Move earlier</button>}
            <button type="button" disabled={disabled} onClick={() => remove(image)} aria-label={`Remove photo ${index + 1}`} className="text-xs text-ink-soft underline underline-offset-4 min-h-11">Remove</button>
          </div>
        </div>
      </li>)}
    </ol>
    <label className="block text-sm text-ink">
      Add photos
      <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif,image/gif" disabled={disabled || images.length >= MAX_PRODUCT_IMAGES} onChange={(event) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        if (!files.length) return;
        try {
          if (images.length + files.length > MAX_PRODUCT_IMAGES) throw new Error("Add up to 12 photos. Remove a photo before adding more.");
          files.forEach(validateImageFile);
          if ([...images.flatMap((v) => v.file ? [v.file] : []), ...files].reduce((sum, file) => sum + file.size, 0) > 15 * 1024 * 1024) throw new Error("Upload up to 15 MB per save. Save these photos first, then add more.");
          const added = files.map((file) => {
            const preview = URL.createObjectURL(file);
            objectUrls.current.add(preview);
            return { key: crypto.randomUUID(), preview, file };
          });
          onChange([...images, ...added]);
          setError(undefined);
        } catch (error) { setError(error instanceof Error ? error.message : "Could not add these photos."); }
      }} className="mt-2 block w-full text-xs text-ink-soft file:mr-3 file:py-2 file:px-3 file:border file:border-black/15 file:bg-cream file:text-ink disabled:opacity-50" />
    </label>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </section>;
}
