"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/app/lib/products";
import { waLink } from "@/app/lib/store-config";
import { StatusBadge } from "./status-badge";
import { updateOrderStatus } from "./actions";
import { ORDER_STATUSES } from "./constants";

export type OrderItemRow = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

export type OrderRow = {
  id: string;
  number: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  subtotal: number;
  status: string;
  paymentMethod: string;
  createdAt: string; // ISO
  items: OrderItemRow[];
};

function paymentLabel(method: string): string {
  return method === "online" ? "Online / Easypaisa" : "Cash on Delivery";
}

/** The ready-made WhatsApp confirmation message sent to the customer. */
function buildConfirmMessage(o: OrderRow): string {
  return [
    `Assalam-o-Alaikum ${o.name},`,
    ``,
    `Your Al-Madina order #${o.number} is confirmed ✅`,
    ``,
    ...o.items.map(
      (i) => `• ${i.name} x ${i.qty} - ${formatPrice(i.price * i.qty)}`,
    ),
    ``,
    `Total: ${formatPrice(o.subtotal)} (${paymentLabel(o.paymentMethod)})`,
    `Delivery: ${o.address}, ${o.city}`,
    ``,
    `Thank you for shopping with Al-Madina!`,
  ].join("\n");
}

const FILTERS = ["all", "today", ...ORDER_STATUSES] as const;

function fmtDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function isToday(iso: string): boolean {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^#/, "");
    return orders.filter((o) => {
      if (filter === "today") {
        if (!isToday(o.createdAt)) return false;
      } else if (filter !== "all") {
        if (o.status !== filter) return false;
      }
      if (q) {
        const hay = `${o.number} ${o.name} ${o.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, query, filter]);

  const selected = selectedId
    ? orders.find((o) => o.id === selectedId) ?? null
    : null;

  return (
    <>
      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by order #, name or phone…"
          className="w-full lg:max-w-xs border border-black/15 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
        />
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs uppercase tracking-wide px-3 py-1.5 border rounded capitalize transition-colors ${
                filter === f
                  ? "bg-ink text-white border-ink"
                  : "border-black/15 text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-ink-soft mb-3">
        Showing {filtered.length} of {orders.length}
      </p>

      {/* Table */}
      <div className="bg-white border border-black/10 rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="text-left text-ink-soft border-b border-black/10">
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink font-medium whitespace-nowrap">
                  #{o.number}
                </td>
                <td className="px-4 py-3 text-ink-soft whitespace-nowrap">
                  {fmtDate(o.createdAt)}
                </td>
                <td className="px-4 py-3 text-ink">{o.name}</td>
                <td className="px-4 py-3 text-ink-soft">{o.city}</td>
                <td className="px-4 py-3 text-ink-soft">{o.phone}</td>
                <td className="px-4 py-3 text-ink-soft">{o.items.length}</td>
                <td className="px-4 py-3 text-ink">{formatPrice(o.subtotal)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={o.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <a
                      href={waLink(o.phone, buildConfirmMessage(o))}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[#128C4B] hover:opacity-70 whitespace-nowrap"
                      title="Send confirmation on WhatsApp"
                    >
                      Confirm
                    </a>
                    <button
                      onClick={() => setSelectedId(o.id)}
                      className="text-xs text-ink hover:text-brand"
                    >
                      View
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-ink-soft">
                  No orders match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex items-start sm:items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 bg-black/40"
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/10">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold text-ink">
                  Order #{selected.number}
                </h2>
                <StatusBadge status={selected.status} />
              </div>
              <button
                onClick={() => setSelectedId(null)}
                aria-label="Close"
                className="text-ink-soft hover:text-ink text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <p className="text-xs text-ink-soft">
                Placed {fmtDate(selected.createdAt)} · Cash on Delivery
              </p>

              {/* Customer */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Info label="Name" value={selected.name} />
                <Info label="Phone" value={selected.phone} />
                <Info label="City" value={selected.city} />
                <Info label="Address" value={selected.address} />
                <Info
                  label="Payment"
                  value={paymentLabel(selected.paymentMethod)}
                />
              </div>

              {/* Items */}
              <div className="border border-black/10 rounded overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink-soft border-b border-black/10">
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.items.map((it) => (
                      <tr
                        key={it.id}
                        className="border-b border-black/5 last:border-0"
                      >
                        <td className="px-3 py-2 text-ink">{it.name}</td>
                        <td className="px-3 py-2 text-ink-soft">{it.qty}</td>
                        <td className="px-3 py-2 text-ink text-right">
                          {formatPrice(it.price * it.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-black/10">
                      <td
                        colSpan={2}
                        className="px-3 py-2 text-right font-medium text-ink"
                      >
                        Total
                      </td>
                      <td className="px-3 py-2 text-right font-medium text-ink">
                        {formatPrice(selected.subtotal)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Status update */}
              <form
                action={updateOrderStatus}
                className="flex gap-2 pt-1"
                key={selected.status}
              >
                <input type="hidden" name="id" value={selected.id} />
                <select
                  name="status"
                  defaultValue={selected.status}
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
                  className="bg-ink text-white text-xs uppercase tracking-widest px-5 hover:bg-brand transition-colors"
                >
                  Update
                </button>
              </form>

              {/* Confirm the order with the customer over WhatsApp */}
              <a
                href={waLink(selected.phone, buildConfirmMessage(selected))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white text-xs uppercase tracking-widest py-3 hover:opacity-90 transition-opacity"
              >
                Confirm order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.12em] text-ink-soft">
        {label}
      </div>
      <div className="text-ink">{value}</div>
    </div>
  );
}
