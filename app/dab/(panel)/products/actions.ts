"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { slugify } from "@/app/lib/products";
import { supabaseAdmin, PRODUCT_BUCKET } from "@/app/lib/supabase";

export type ProductActionState = { error: string | null };

function toInt(value: FormDataEntryValue | null, fallback = 0): number {
  const n = parseInt(String(value ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : fallback;
}

function optInt(value: FormDataEntryValue | null): number | null {
  const s = String(value ?? "").replace(/[^\d]/g, "");
  return s ? parseInt(s, 10) : null;
}

function strOrNull(value: FormDataEntryValue | null): string | null {
  const s = String(value ?? "").trim();
  return s || null;
}

function parseLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function parseIngredients(
  value: FormDataEntryValue | null,
): { name: string; note: string }[] {
  return String(value ?? "")
    .split("\n")
    .map((line) => {
      const [name, ...rest] = line.split("|");
      return { name: name.trim(), note: rest.join("|").trim() };
    })
    .filter((i) => i.name);
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const existing = await prisma.product.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

async function saveUploadedImage(
  file: File,
  slugBase: string,
): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext =
    (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
    "jpg";
  const filename = `${slugBase}-${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .upload(filename, bytes, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage
    .from(PRODUCT_BUCKET)
    .getPublicUrl(filename);
  return data.publicUrl;
}

export async function saveProduct(
  _prev: ProductActionState,
  formData: FormData,
): Promise<ProductActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const price = toInt(formData.get("price"));

  if (!name) return { error: "Product name is required." };
  if (!categoryId) return { error: "Please choose a category." };
  if (!price || price <= 0) return { error: "Please enter a valid price." };

  const base = slugify(String(formData.get("slug") ?? "").trim() || name);
  if (!base) return { error: "Could not derive a slug from the name." };
  const slug = await uniqueSlug(base, id || undefined);

  // Image: use the newly uploaded file, else keep the current one.
  let image = String(formData.get("currentImage") ?? "").trim();
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) {
      return { error: "The uploaded file must be an image." };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { error: "Image must be smaller than 5 MB." };
    }
    image = await saveUploadedImage(file, base);
  }
  if (!image) return { error: "Please upload a product image." };

  const rating = Math.min(5, Math.max(1, toInt(formData.get("rating"), 5)));

  const data = {
    name,
    slug,
    categoryId,
    price,
    wasPrice: optInt(formData.get("wasPrice")),
    badge: strOrNull(formData.get("badge")),
    stock: toInt(formData.get("stock")),
    rating,
    size: String(formData.get("size") ?? "").trim(),
    blurb: String(formData.get("blurb") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    benefits: parseLines(formData.get("benefits")),
    ingredients: parseIngredients(formData.get("ingredients")),
    howToUse: String(formData.get("howToUse") ?? "").trim(),
    image,
    active: formData.get("active") === "on",
  };

  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    await prisma.product.create({ data });
  }

  redirect("/dab/products");
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  redirect("/dab/products");
}

export async function updateStock(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const stock = toInt(formData.get("stock"));
  if (id) {
    await prisma.product.update({ where: { id }, data: { stock } });
  }
  revalidatePath("/dab/products");
}
