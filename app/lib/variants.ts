export type VariantInput = {
  id?: string;
  name: string;
  color: string | null;
  image: string | null;
  price: number | null;
  stock: number;
  active: boolean;
};

export function wholeNumber(value: unknown, min = 0): number | null {
  const text = String(value ?? "").trim();
  if (!/^\d+$/.test(text)) return null;
  const number = Number(text);
  return Number.isSafeInteger(number) && number >= min && number <= 2147483647
    ? number : null;
}

export function parseVariants(raw: string): VariantInput[] {
  const rows: unknown = JSON.parse(raw);
  if (!Array.isArray(rows) || rows.length === 0 || rows.length > 100) {
    throw new Error("Add between 1 and 100 variations.");
  }
  const names = new Set<string>();
  const ids = new Set<string>();
  return rows.map((row) => {
    if (!row || typeof row !== "object") throw new Error("Invalid variation.");
    const v = row as Record<string, unknown>;
    const name = String(v.name ?? "").trim();
    if (!name || name.length > 80) throw new Error("Each variation needs a name of up to 80 characters.");
    if (names.has(name.toLowerCase())) throw new Error(`The variation “${name}” is listed twice.`);
    names.add(name.toLowerCase());
    const id = typeof v.id === "string" && v.id ? v.id : undefined;
    if (id && ids.has(id)) throw new Error("A variation is listed twice.");
    if (id) ids.add(id);
    const stock = wholeNumber(v.stock);
    if (stock === null) throw new Error(`Enter a whole stock quantity of zero or more for “${name}”.`);
    const price = v.price === "" || v.price == null ? null : wholeNumber(v.price, 1);
    if (price === null && v.price !== "" && v.price != null) throw new Error(`Enter a valid price for “${name}”, or leave it blank.`);
    const color = String(v.color ?? "").trim() || null;
    if (color && !/^#[0-9a-f]{6}$/i.test(color)) throw new Error(`Choose a valid swatch color for “${name}”.`);
    const image = String(v.image ?? "").trim() || null;
    if (image && !(image.startsWith("/") && !image.startsWith("//")) && !/^https:\/\/[^\s]+$/i.test(image)) {
      throw new Error(`Use an uploaded image or an HTTPS image URL for “${name}”.`);
    }
    return { id, name, stock, price, color, image, active: v.active !== false };
  });
}
