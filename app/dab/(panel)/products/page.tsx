import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatPrice } from "@/app/lib/products";
import { deleteProduct, updateStock } from "./actions";
import { DeleteButton } from "./delete-button";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Products</h1>
          <p className="text-sm text-ink-soft mt-1">
            {products.length} product{products.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href="/dab/products/new"
          className="bg-ink text-white text-xs uppercase tracking-widest px-5 py-3 hover:bg-brand transition-colors"
        >
          + Add product
        </Link>
      </header>

      <div className="bg-white border border-black/10 rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="text-left text-ink-soft border-b border-black/10">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-11 h-11 object-cover rounded bg-cream shrink-0"
                    />
                    <span className="text-ink">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-soft">{p.category.name}</td>
                <td className="px-4 py-3 text-ink">{formatPrice(p.price)}</td>
                <td className="px-4 py-3">
                  <form action={updateStock} className="flex items-center gap-1">
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      name="stock"
                      type="number"
                      defaultValue={p.stock}
                      min={0}
                      className={`w-16 border border-black/15 px-2 py-1 text-sm focus:outline-none focus:border-ink ${
                        p.stock <= 5 ? "text-red-600" : "text-ink"
                      }`}
                    />
                    <button
                      type="submit"
                      className="text-xs text-ink-soft hover:text-brand"
                      title="Save stock"
                    >
                      Save
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.active
                        ? "bg-green-50 text-green-700"
                        : "bg-black/5 text-ink-soft"
                    }`}
                  >
                    {p.active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/dab/products/${p.id}/edit`}
                      className="text-xs text-ink hover:text-brand"
                    >
                      Edit
                    </Link>
                    <DeleteButton action={deleteProduct.bind(null, p.id)} />
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-ink-soft">
                  No products yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
