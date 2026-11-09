export type CartLine = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
  variantId?: string;
  variantName?: string;
  stock?: number;
};

export function cartLineKey(line: { slug: string; variantId?: string }) {
  return JSON.stringify([line.slug, line.variantId ?? null]);
}

export function normalizeCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartLine>();
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const v = item as CartLine;
    if (typeof v.slug !== "string" || !v.slug || typeof v.name !== "string" ||
      typeof v.image !== "string" || typeof v.size !== "string" ||
      !Number.isSafeInteger(v.price) || v.price < 0 || !Number.isSafeInteger(v.qty) || v.qty <= 0 ||
      (v.variantId !== undefined && typeof v.variantId !== "string")) continue;
    const key = cartLineKey(v);
    const stock = Number.isSafeInteger(v.stock) && v.stock! >= 0 ? v.stock : undefined;
    const qty = Math.min(999, stock ?? 999, (lines.get(key)?.qty ?? 0) + v.qty);
    if (qty > 0) lines.set(key, { ...v, stock, qty });
  }
  return [...lines.values()];
}

export function addCartLine(lines: CartLine[], item: Omit<CartLine, "qty">, qty: number) {
  const key = cartLineKey(item);
  const previous = lines.find((line) => cartLineKey(line) === key);
  return normalizeCart([...lines.filter((line) => cartLineKey(line) !== key), { ...item, qty: (previous?.qty ?? 0) + qty }]);
}
