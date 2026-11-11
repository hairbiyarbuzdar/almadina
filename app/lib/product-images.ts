export const MAX_PRODUCT_IMAGES = 12;
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export type ImageReference = { url: string } | { uploadKey: string };

/** Only retain images already belonging to this product; never trust client URLs. */
export function parseImageReferences(raw: string, allowedUrls: string[]): ImageReference[] {
  let rows: unknown;
  try { rows = JSON.parse(raw); } catch { throw new Error("Please reload the product images and try again."); }
  if (!Array.isArray(rows) || !rows.length) throw new Error("Add at least one product image.");
  if (rows.length > MAX_PRODUCT_IMAGES) throw new Error(`Add up to ${MAX_PRODUCT_IMAGES} product images.`);
  const seen = new Set<string>();
  return rows.map((row) => {
    if (!row || typeof row !== "object") throw new Error("Invalid product image.");
    if (typeof row.url === "string" && allowedUrls.includes(row.url)) {
      if (seen.has(row.url)) throw new Error("The same image is listed twice.");
      seen.add(row.url);
      return { url: row.url };
    }
    if (typeof row.uploadKey === "string" && /^[a-zA-Z0-9-]{1,80}$/.test(row.uploadKey)) {
      if (seen.has(row.uploadKey)) throw new Error("The same upload is listed twice.");
      seen.add(row.uploadKey);
      return { uploadKey: row.uploadKey };
    }
    throw new Error("A product image is no longer available. Reload and try again.");
  });
}

export function validateImageFile(file: File) {
  if (!IMAGE_TYPES.includes(file.type)) throw new Error("Choose JPG, PNG, WebP, AVIF, or GIF images.");
  if (!file.size || file.size > MAX_IMAGE_BYTES) throw new Error("Each image must be smaller than 5 MB.");
}
