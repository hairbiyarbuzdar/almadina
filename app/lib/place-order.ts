import { Prisma, type PrismaClient } from "@/generated/prisma/client";
import { cartLineKey, type CartLine } from "./cart-lines";

type OrderItemInput = { slug: string; variantId?: string; name: string; price: number; qty: number };
export type PlaceOrderInput = {
  name: string;
  phone: string;
  address: string;
  city: string;
  paymentMethod: "cod" | "online";
  items: OrderItemInput[];
};
export type PlaceOrderResult = {
  ok: boolean;
  error?: string;
  orderId?: string;
  orderNumber?: number;
  subtotal?: number;
  cart?: CartLine[];
};

export async function createOrder(db: PrismaClient, input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const phone = typeof input?.phone === "string" ? input.phone.trim() : "";
  const address = typeof input?.address === "string" ? input.address.trim() : "";
  const city = typeof input?.city === "string" ? input.city.trim() : "";
  if (!name || !phone || !address || !city) return { ok: false, error: "Please fill in all delivery details." };
  if (name.length > 200 || phone.length > 40 || address.length > 1000 || city.length > 200) return { ok: false, error: "Please shorten your delivery details and try again." };
  if (!Array.isArray(input.items) || input.items.length === 0) return { ok: false, error: "Your cart is empty." };
  if (input.items.length > 100) return { ok: false, error: "Please order up to 100 different items at a time." };

  const lines = new Map<string, OrderItemInput>();
  for (const item of input.items) {
    if (!item || typeof item.slug !== "string" || !item.slug ||
      (item.variantId !== undefined && (typeof item.variantId !== "string" || !item.variantId)) ||
      !Number.isSafeInteger(item.qty) || item.qty < 1 || item.qty > 999 ||
      !Number.isSafeInteger(item.price) || item.price < 0) {
      return { ok: false, error: "An item in your cart is invalid. Remove it and add it again from the shop." };
    }
    const key = cartLineKey(item);
    const previous = lines.get(key);
    const qty = (previous?.qty ?? 0) + item.qty;
    if (qty > 999) return { ok: false, error: "Please order up to 999 of each item at a time." };
    lines.set(key, { ...item, qty });
  }

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const slugs = [...new Set([...lines.values()].map((i) => i.slug))].sort();
        // Consistent lock order also coordinates with admin product edits,
        // which update the parent before updating variations.
        await tx.$queryRaw(Prisma.sql`SELECT "id" FROM "Product" WHERE "slug" IN (${Prisma.join(slugs)}) ORDER BY "id" FOR UPDATE`);
        const products = await tx.product.findMany({ where: { slug: { in: slugs } }, include: { variants: true } });
        const bySlug = new Map(products.map((p) => [p.slug, p]));
        const cart: CartLine[] = [];
        const orderItems: { productId: string; variantId: string | null; variantName: string | null; name: string; price: number; qty: number }[] = [];
        let issue: string | undefined;
        for (const item of lines.values()) {
          const p = bySlug.get(item.slug);
          if (!p || !p.active) { issue ??= "A product is no longer available."; continue; }
          const variant = item.variantId ? p.variants.find((v) => v.id === item.variantId && v.active) : undefined;
          if ((p.optionName && !variant) || (!p.optionName && item.variantId)) {
            return { ok: false, error: `Please choose an available ${p.optionName?.toLowerCase() ?? "option"} for ${p.name} on its product page.` };
          }
          const price = variant?.price ?? p.price;
          const stock = variant?.stock ?? p.stock;
          const label = variant ? `${p.optionName}: ${variant.name}` : null;
          if (stock < item.qty) issue ??= stock <= 0 ? `${p.name}${label ? ` (${label})` : ""} has sold out.` : `Only ${stock} of ${p.name}${label ? ` (${label})` : ""} are available.`;
          if (price !== item.price) issue ??= `The price of ${p.name} has changed.`;
          const qty = Math.min(item.qty, Math.max(0, stock));
          if (qty > 0) cart.push({ slug: p.slug, name: p.name, price, image: variant?.image || p.image, size: p.size, qty, stock, variantId: variant?.id, variantName: label ?? undefined });
          orderItems.push({ productId: p.id, variantId: variant?.id ?? null, variantName: label, name: p.name, price, qty: item.qty });
        }
        if (issue) return { ok: false, error: `${issue} Your cart has been updated; please review it before placing your order.`, cart };
        const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
        if (!Number.isSafeInteger(subtotal) || subtotal > 2147483647) return { ok: false, error: "This order is too large. Please split it into smaller orders." };
        for (const item of orderItems) {
          const result = item.variantId
            ? await tx.productVariant.updateMany({ where: { id: item.variantId, productId: item.productId, active: true, stock: { gte: item.qty } }, data: { stock: { decrement: item.qty } } })
            : await tx.product.updateMany({ where: { id: item.productId, active: true, optionName: null, stock: { gte: item.qty } }, data: { stock: { decrement: item.qty } } });
          if (result.count !== 1) throw new Error("STOCK_CHANGED");
        }
        const order = await tx.order.create({ data: { name, phone, address, city, paymentMethod: input.paymentMethod === "online" ? "online" : "cod", subtotal, items: { create: orderItems } } });
        return { ok: true, orderId: order.id, orderNumber: order.number, subtotal };
      }, { isolationLevel: "Serializable", timeout: 15000 });
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (code === "P2034" && attempt < 2) continue;
      return { ok: false, error: error instanceof Error && error.message === "STOCK_CHANGED"
        ? "Stock has just changed. Please review your cart and try again."
        : "Could not place your order. Please try again." };
    }
  }
  return { ok: false, error: "The shop is busy. Please try again." };
}
