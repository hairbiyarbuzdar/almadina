"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";
import { slugify } from "@/app/lib/products";

export type CategoryActionState = { error: string | null };

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let n = 2;
  for (;;) {
    const existing = await prisma.category.findFirst({
      where: { slug, ...(excludeId ? { NOT: { id: excludeId } } : {}) },
      select: { id: true },
    });
    if (!existing) return slug;
    slug = `${base}-${n++}`;
  }
}

export async function saveCategory(
  _prev: CategoryActionState,
  formData: FormData,
): Promise<CategoryActionState> {
  const id = String(formData.get("id") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const position = parseInt(String(formData.get("position") ?? "0"), 10) || 0;

  if (!name) return { error: "Category name is required." };

  const base = slugify(name);
  if (!base) return { error: "Could not derive a slug from that name." };

  // Enforce unique name (schema also enforces it, but give a friendly message).
  const dupe = await prisma.category.findFirst({
    where: { name, ...(id ? { NOT: { id } } : {}) },
    select: { id: true },
  });
  if (dupe) return { error: "A category with that name already exists." };

  const slug = await uniqueSlug(base, id || undefined);

  if (id) {
    await prisma.category.update({
      where: { id },
      data: { name, slug, position },
    });
  } else {
    await prisma.category.create({ data: { name, slug, position } });
  }

  revalidatePath("/dab/categories");
  redirect("/dab/categories");
}

export async function deleteCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    redirect(
      `/dab/categories?error=${encodeURIComponent(
        "Move or remove its products before deleting this category.",
      )}`,
    );
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/dab/categories");
  redirect("/dab/categories");
}
