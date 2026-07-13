import { NextResponse } from "next/server";
import { getProducts } from "../../lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  // Lightweight payload for the search overlay.
  const items = products.map((p) => ({
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    image: p.image,
    blurb: p.blurb,
    ingredients: p.ingredients.map((i) => i.name),
  }));
  return NextResponse.json(items);
}
