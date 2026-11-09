"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { slugify } from "@/app/lib/products";
import { supabaseAdmin, PRODUCT_BUCKET } from "@/app/lib/supabase";
import { requireAdmin } from "@/app/lib/require-admin";
import { parseVariants, wholeNumber, type VariantInput } from "@/app/lib/variants";

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
  await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "").trim();
  const price = wholeNumber(formData.get("price"), 1);
  const hasVariants = formData.get("hasVariants") === "on";
  const optionName = hasVariants ? String(formData.get("optionName") ?? "").trim() : null;
  const stock = hasVariants ? 0 : wholeNumber(formData.get("stock"));
  let variants: VariantInput[] = [];
  try {
    if (hasVariants) {
      if (!optionName || optionName.length > 40) return { error: "Enter an option name, such as Shade (up to 40 characters)." };
      variants = parseVariants(String(formData.get("variants") ?? "[]"));
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Check the variations and try again." };
  }
  if (stock === null) return { error: "Enter a whole stock quantity of zero or more." };

  if (!name) return { error: "Product name is required." };
  if (!categoryId) return { error: "Please choose a category." };
  if (!price || price <= 0) return { error: "Please enter a valid price." };
  const files = [...formData.values()].filter((value): value is File => value instanceof File && value.size > 0);
  if (files.reduce((sum, file) => sum + file.size, 0) > 15 * 1024 * 1024) {
    return { error: "Upload up to 15 MB of images per save. Save fewer images, then add the rest." };
  }

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
    try {
      image = await saveUploadedImage(file, base);
    } catch {
      return { error: "Could not upload the product image. Please try again." };
    }
  }
  if (!image) return { error: "Please upload a product image." };

  for (const [index, variant] of variants.entries()) {
    const variantFile = formData.get(`variantImage-${index}`);
    if (variantFile instanceof File && variantFile.size > 0) {
      if (!variantFile.type.startsWith("image/") || variantFile.size > 5 * 1024 * 1024) {
        return { error: `The image for “${variant.name}” must be an image smaller than 5 MB.` };
      }
      try {
        variant.image = await saveUploadedImage(variantFile, `${base}-variation-${index}`);
      } catch {
        return { error: `Could not upload the image for “${variant.name}”. Please try again.` };
      }
    }
  }

  const rating = Math.min(5, Math.max(1, toInt(formData.get("rating"), 5)));

  const data = {
    name,
    slug,
    categoryId,
    price,
    wasPrice: optInt(formData.get("wasPrice")),
    badge: strOrNull(formData.get("badge")),
    stock,
    optionName,
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

  try {
    await prisma.$transaction(async (tx) => {
      const existing = id ? await tx.productVariant.findMany({ where: { productId: id } }) : [];
      if (variants.some((v) => v.id && !existing.some((e) => e.id === v.id))) {
        throw new Error("A variation does not belong to this product. Reload and try again.");
      }
      const product = id
        ? await tx.product.update({ where: { id }, data })
        : await tx.product.create({ data });
      // Retain omitted variations for historical orders. Stored rows are normally
      // disabled in the editor, rather than removed or recreated.
      await tx.productVariant.updateMany({
        where: { productId: product.id, id: { notIn: variants.flatMap((v) => v.id ? [v.id] : []) } },
        data: { active: false },
      });
      for (const [position, variant] of variants.entries()) {
        const { id: variantId, ...values } = variant;
        if (variantId) {
          await tx.productVariant.update({ where: { id: variantId }, data: { ...values, position } });
        } else {
          await tx.productVariant.create({ data: { ...values, position, productId: product.id } });
        }
      }
    });
  } catch (error) {
    const code = (error as { code?: string }).code;
    return { error: code === "P2002"
      ? "A variation with that name already exists. Rename or re-enable the existing variation."
      : "Could not save the product. Check your variations and try again." };
  }

  revalidatePath("/", "layout");
  redirect("/dab/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  redirect("/dab/products");
}

export async function updateStock(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const stock = wholeNumber(formData.get("stock"));
  if (id && stock !== null) {
    await prisma.product.updateMany({ where: { id, optionName: null }, data: { stock } });
  }
  revalidatePath("/dab/products");
}
