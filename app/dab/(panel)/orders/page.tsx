import { prisma } from "@/app/lib/prisma";
import { OrdersTable, type OrderRow } from "./orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const rows: OrderRow[] = orders.map((o) => ({
    id: o.id,
    number: o.number,
    name: o.name,
    phone: o.phone,
    address: o.address,
    city: o.city,
    subtotal: o.subtotal,
    status: o.status,
    paymentMethod: o.paymentMethod,
    createdAt: o.createdAt.toISOString(),
    items: o.items.map((i) => ({
      id: i.id,
      name: i.name,
      price: i.price,
      qty: i.qty,
    })),
  }));

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Orders</h1>
        <p className="text-sm text-ink-soft mt-1">
          {orders.length} order{orders.length === 1 ? "" : "s"} total
        </p>
      </header>

      <OrdersTable orders={rows} />
    </div>
  );
}
