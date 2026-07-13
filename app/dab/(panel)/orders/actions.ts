"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { ORDER_STATUSES } from "./constants";

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (id && (ORDER_STATUSES as readonly string[]).includes(status)) {
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath(`/dab/orders/${id}`);
    revalidatePath("/dab/orders");
    revalidatePath("/dab");
  }
}
