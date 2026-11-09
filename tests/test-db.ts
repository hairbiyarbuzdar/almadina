import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

export function testDatabase() {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) throw new Error("Set TEST_DATABASE_URL to an isolated local database with migrations applied.");
  const parsed = new URL(url);
  if (!["localhost", "127.0.0.1"].includes(parsed.hostname) || !parsed.pathname.endsWith("_test")) {
    throw new Error("Tests require a local database whose name ends in _test.");
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

export async function fixture(db: ReturnType<typeof testDatabase>, slug: string, variations = true) {
  const category = await db.category.upsert({ where: { slug: "qa-makeup" }, update: {}, create: { slug: "qa-makeup", name: "QA Makeup" } });
  return db.product.create({ data: {
    slug, name: "QA Matte Lipstick", price: 1500, stock: variations ? 0 : 10,
    image: "/products/rose-water-toner.jpg", size: "4 g", blurb: "Choose your shade.",
    description: "A lipstick with a choice of shades.", benefits: ["Easy to apply"], ingredients: [], howToUse: "Apply to lips.",
    categoryId: category.id, optionName: variations ? "Shade" : null,
    ...(variations ? { variants: { create: [
      { name: "Ruby Red", color: "#ad233d", stock: 10, position: 0 },
      { name: "Nude Pink", color: "#c88d92", stock: 8, price: 1700, position: 1, image: "/products/daily-hydrating-cream.jpg" },
      { name: "Dark Brown", color: "#634337", stock: 0, position: 2 },
      { name: "Hidden Gold", stock: 5, active: false, position: 3 },
    ] } } : {}),
  }, include: { variants: { orderBy: { position: "asc" } } } });
}
