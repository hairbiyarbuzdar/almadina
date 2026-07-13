import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { formatPrice } from "@/app/lib/products";
import { StatusBadge } from "../status-badge";
import { updateOrderStatus } from "../actions";
import { ORDER_STATUSES } from "../constants";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div className="p-6 lg:p-10 max-w-3xl">
      <div className="mb-6">
        <Link
          href="/dab/orders"
          className="text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← Orders
        </Link>
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-2xl font-semibold text-ink">
            Order #{order.number}
          </h1>
          <StatusBadge status={order.status} />
        </div>
        <p className="text-sm text-ink-soft mt-1">
          Placed {new Intl.DateTimeFormat("en-GB", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(order.createdAt)}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 mb-6">
        {/* Customer */}
        <div className="bg-white border border-black/10 rounded-lg p-5">
          <h2 className="text-sm font-medium text-ink mb-3">Customer</h2>
          <dl className="text-sm space-y-1.5">
            <Row label="Name" value={order.name} />
            <Row label="Phone" value={order.phone} />
            <Row label="City" value={order.city} />
            <Row label="Address" value={order.address} />
          </dl>
        </div>

        {/* Status control */}
        <div className="bg-white border border-black/10 rounded-lg p-5">
          <h2 className="text-sm font-medium text-ink mb-3">Update status</h2>
          <form action={updateOrderStatus} className="flex gap-2">
            <input type="hidden" name="id" value={order.id} />
            <select
              name="status"
              defaultValue={order.status}
              className="flex-1 border border-black/15 px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-ink capitalize"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-ink text-white text-xs uppercase tracking-widest px-4 hover:bg-brand transition-colors"
            >
              Save
            </button>
          </form>
          <p className="text-xs text-ink-soft mt-3">
            Payment: Cash on Delivery
          </p>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink-soft border-b border-black/10">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Qty</th>
              <th className="px-4 py-3 font-medium text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink">{it.name}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {formatPrice(it.price)}
                </td>
                <td className="px-4 py-3 text-ink-soft">{it.qty}</td>
                <td className="px-4 py-3 text-ink text-right">
                  {formatPrice(it.price * it.qty)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-black/10">
              <td colSpan={3} className="px-4 py-3 text-right font-medium text-ink">
                Total
              </td>
              <td className="px-4 py-3 text-right font-medium text-ink">
                {formatPrice(order.subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-ink-soft w-16 shrink-0">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
