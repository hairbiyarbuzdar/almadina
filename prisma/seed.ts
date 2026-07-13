import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PRODUCTS,
  CATEGORIES,
  priceToNumber,
} from "../app/lib/products";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding categories…");
  for (let i = 0; i < CATEGORIES.length; i++) {
    const name = CATEGORIES[i];
    const slug = slugify(name);
    await prisma.category.upsert({
      where: { slug },
      update: { name, position: i },
      create: { name, slug, position: i },
    });
  }

  console.log("Seeding products…");
  for (const p of PRODUCTS) {
    const category = await prisma.category.findFirst({
      where: { name: p.category },
    });
    if (!category) {
      console.warn(`  ! No category for ${p.slug} (${p.category}), skipping`);
      continue;
    }
    const data = {
      name: p.name,
      price: priceToNumber(p.price),
      wasPrice: p.wasPrice ? priceToNumber(p.wasPrice) : null,
      badge: p.badge ?? null,
      stock: 50,
      rating: p.rating,
      image: p.image,
      blurb: p.blurb,
      size: p.size,
      description: p.description,
      benefits: p.benefits,
      ingredients: p.ingredients,
      howToUse: p.howToUse,
      categoryId: category.id,
    };
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: data,
      create: { slug: p.slug, ...data },
    });
  }

  const [cats, prods] = await Promise.all([
    prisma.category.count(),
    prisma.product.count(),
  ]);
  console.log(`Done. ${cats} categories, ${prods} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
