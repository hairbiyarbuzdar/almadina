import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { deleteCategory } from "./actions";
import { CategoryForm } from "./category-form";
import { DeleteButton } from "../products/delete-button";

export const dynamic = "force-dynamic";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="p-6 lg:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-ink">Categories</h1>
        <p className="text-sm text-ink-soft mt-1">
          {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·
          order controls how they appear in the shop filter
        </p>
      </header>

      {error && (
        <p className="mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {/* Add new */}
      <div className="bg-white border border-black/10 rounded-lg p-5 mb-8">
        <h2 className="text-sm font-medium text-ink mb-4">Add a category</h2>
        <CategoryForm compact />
      </div>

      {/* List */}
      <div className="bg-white border border-black/10 rounded-lg overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-ink-soft border-b border-black/10">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Products</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-3 text-ink">{c.name}</td>
                <td className="px-4 py-3 text-ink-soft">{c.slug}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {c._count.products}
                </td>
                <td className="px-4 py-3 text-ink-soft">{c.position}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-4">
                    <Link
                      href={`/dab/categories/${c.id}/edit`}
                      className="text-xs text-ink hover:text-brand"
                    >
                      Edit
                    </Link>
                    {c._count.products === 0 ? (
                      <DeleteButton
                        action={deleteCategory.bind(null, c.id)}
                        message={`Delete "${c.name}"?`}
                      />
                    ) : (
                      <span
                        className="text-xs text-ink-soft/50"
                        title="Has products — move them first"
                      >
                        In use
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
