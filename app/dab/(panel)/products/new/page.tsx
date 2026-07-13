import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { ProductForm } from "../product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { position: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <Link
          href="/dab/products"
          className="text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← Products
        </Link>
        <h1 className="text-2xl font-semibold text-ink mt-2">Add product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
