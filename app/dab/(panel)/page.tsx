import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { formatPrice } from "../../lib/products";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const [products, categories, orders, lowStock, pending] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.count({ where: { status: "pending" } }),
  ]);

  const recentOrders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const stats = [
    { label: "Products", value: products, href: "/dab/products" },
    { label: "Categories", value: categories, href: "/dab/categories" },
    { label: "Orders", value: orders, href: "/dab/orders" },
    { label: "Low stock (≤5)", value: lowStock, href: "/dab/products" },
  ];

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Dashboard</h1>
        <p className="text-sm text-ink-soft mt-1">
          Welcome back. Here&apos;s a quick overview of your store.
        </p>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-black/10 rounded-lg p-5 hover:border-ink/30 transition-colors"
          >
            <p className="text-3xl font-semibold text-ink">{s.value}</p>
            <p className="text-xs uppercase tracking-wide text-ink-soft mt-1">
              {s.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <section className="bg-white border border-black/10 rounded-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
          <h2 className="text-sm font-medium text-ink">Recent orders</h2>
          <Link
            href="/dab/orders"
            className="text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
          >
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="px-5 py-8 text-sm text-ink-soft text-center">
            No orders yet. They&apos;ll appear here once customers check out.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink-soft border-b border-black/5">
                <th className="px-5 py-2 font-medium">Order</th>
                <th className="px-5 py-2 font-medium">Customer</th>
                <th className="px-5 py-2 font-medium">City</th>
                <th className="px-5 py-2 font-medium">Total</th>
                <th className="px-5 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-black/5 last:border-0">
                  <td className="px-5 py-3 text-ink font-medium">
                    #{o.number}
                  </td>
                  <td className="px-5 py-3 text-ink">{o.name}</td>
                  <td className="px-5 py-3 text-ink-soft">{o.city}</td>
                  <td className="px-5 py-3 text-ink">{formatPrice(o.subtotal)}</td>
                  <td className="px-5 py-3">
                    <span className="text-xs uppercase tracking-wide text-ink-soft">
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {pending > 0 && (
        <p className="text-xs text-ink-soft mt-4">
          {pending} order{pending === 1 ? "" : "s"} awaiting confirmation.
        </p>
      )}
    </div>
  );
}
