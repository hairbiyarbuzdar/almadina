"use server";

import { prisma } from "../lib/prisma";
import { createOrder, type PlaceOrderInput, type PlaceOrderResult } from "../lib/place-order";

export type { PlaceOrderInput, PlaceOrderResult } from "../lib/place-order";

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  return createOrder(prisma, input);
}
