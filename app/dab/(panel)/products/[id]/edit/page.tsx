import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { ProductForm, type ProductFormValues } from "../../product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { position: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  const values: ProductFormValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    price: product.price,
    wasPrice: product.wasPrice,
    badge: product.badge,
    stock: product.stock,
    rating: product.rating,
    size: product.size,
    blurb: product.blurb,
    description: product.description,
    benefits: product.benefits,
    ingredients: (product.ingredients as { name: string; note: string }[]) ?? [],
    howToUse: product.howToUse,
    image: product.image,
    active: product.active,
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-6">
        <Link
          href="/dab/products"
          className="text-xs uppercase tracking-wide text-ink-soft hover:text-ink"
        >
          ← Products
        </Link>
        <h1 className="text-2xl font-semibold text-ink mt-2">Edit product</h1>
      </div>
      <ProductForm categories={categories} product={values} />
    </div>
  );
}
