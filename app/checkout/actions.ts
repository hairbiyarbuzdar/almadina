"use server";

import { prisma } from "../lib/prisma";

type OrderItemInput = {
  slug: string;
  name: string;
  price: number;
  qty: number;
};

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
};

export async function placeOrder(
  input: PlaceOrderInput,
): Promise<PlaceOrderResult> {
  const name = input.name?.trim();
  const phone = input.phone?.trim();
  const address = input.address?.trim();
  const city = input.city?.trim();
  const paymentMethod = input.paymentMethod === "online" ? "online" : "cod";

  if (!name || !phone || !address || !city) {
    return { ok: false, error: "Please fill in all delivery details." };
  }
  if (!input.items?.length) {
    return { ok: false, error: "Your cart is empty." };
  }

  // Resolve products from the DB so prices/names are authoritative.
  const slugs = input.items.map((i) => i.slug);
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
  });
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const orderItems = input.items.map((i) => {
    const p = bySlug.get(i.slug);
    return {
      productId: p?.id ?? null,
      name: p?.name ?? i.name,
      price: p ? p.price : i.price,
      qty: Math.max(1, Math.floor(i.qty)),
    };
  });
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          name,
          phone,
          address,
          city,
          subtotal,
          status: "pending",
          paymentMethod,
          items: {
            create: orderItems.map((i) => ({
              productId: i.productId,
              name: i.name,
              price: i.price,
              qty: i.qty,
            })),
          },
        },
      });
      // Reduce stock for known products.
      for (const i of orderItems) {
        if (i.productId) {
          await tx.product.update({
            where: { id: i.productId },
            data: { stock: { decrement: i.qty } },
          });
        }
      }
      return created;
    });

    return { ok: true, orderId: order.id, orderNumber: order.number };
  } catch {
    return { ok: false, error: "Could not place your order. Please try again." };
  }
}
