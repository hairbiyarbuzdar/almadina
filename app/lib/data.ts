import { prisma } from "./prisma";
import { formatPrice, type Product, type Ingredient } from "./products";

type Row = {
  slug: string;
  name: string;
  price: number;
  wasPrice: number | null;
  badge: string | null;
  rating: number;
  image: string;
  blurb: string;
  size: string;
  description: string;
  benefits: string[];
  ingredients: unknown;
  howToUse: string;
  stock: number;
  category: { name: string };
};

function toProduct(row: Row): Product {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category.name,
    price: formatPrice(row.price),
    wasPrice: row.wasPrice != null ? formatPrice(row.wasPrice) : undefined,
    badge: row.badge ?? undefined,
    rating: row.rating,
    image: row.image,
    blurb: row.blurb,
    size: row.size,
    description: row.description,
    benefits: row.benefits,
    ingredients: (row.ingredients as Ingredient[]) ?? [],
    howToUse: row.howToUse,
    stock: row.stock,
  };
}

const withCategory = { category: { select: { name: true } } };

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: withCategory,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findFirst({
    where: { slug, active: true },
    include: withCategory,
  });
  return row ? toProduct(row) : null;
}

export async function getRelatedProducts(
  slug: string,
  limit = 4,
): Promise<Product[]> {
  const current = await prisma.product.findUnique({
    where: { slug },
    select: { categoryId: true },
  });
  const rows = await prisma.product.findMany({
    where: {
      active: true,
      slug: { not: slug },
    },
    include: withCategory,
    orderBy: { createdAt: "asc" },
  });
  const products = rows.map(toProduct);
  // Same-category first, then the rest.
  if (current) {
    const sameCat = await prisma.product.findMany({
      where: { active: true, slug: { not: slug }, categoryId: current.categoryId },
      select: { slug: true },
    });
    const sameSet = new Set(sameCat.map((p) => p.slug));
    products.sort((a, b) => {
      const av = sameSet.has(a.slug) ? 0 : 1;
      const bv = sameSet.has(b.slug) ? 0 : 1;
      return av - bv;
    });
  }
  return products.slice(0, limit);
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { active: true },
    include: withCategory,
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  return rows.map(toProduct);
}

export async function getCategoryNames(): Promise<string[]> {
  const cats = await prisma.category.findMany({
    orderBy: { position: "asc" },
    select: { name: true },
  });
  return cats.map((c) => c.name);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}
