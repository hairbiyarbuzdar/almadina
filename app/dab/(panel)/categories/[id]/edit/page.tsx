import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { CategoryForm } from "../../category-form";

export const dynamic = "force-dynamic";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <Link
          href="/dab/categories"
          className="text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← Categories
        </Link>
        <h1 className="text-2xl font-semibold text-ink mt-2">Edit category</h1>
      </div>
      <div className="bg-white border border-black/10 rounded-lg p-6">
        <CategoryForm
          category={{
            id: category.id,
            name: category.name,
            position: category.position,
          }}
        />
      </div>
    </div>
  );
}
