"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { saveProduct, type ProductActionState } from "./actions";

type Ingredient = { name: string; note: string };

export type ProductFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  categoryId?: string;
  price?: number;
  wasPrice?: number | null;
  badge?: string | null;
  stock?: number;
  rating?: number;
  size?: string;
  blurb?: string;
  description?: string;
  benefits?: string[];
  ingredients?: Ingredient[];
  howToUse?: string;
  image?: string;
  active?: boolean;
};

const initial: ProductActionState = { error: null };

export function ProductForm({
  categories,
  product,
}: {
  categories: { id: string; name: string }[];
  product?: ProductFormValues;
}) {
  const [state, formAction, pending] = useActionState(saveProduct, initial);
  const [preview, setPreview] = useState<string | null>(product?.image ?? null);
  const isEdit = Boolean(product?.id);

  const benefitsText = (product?.benefits ?? []).join("\n");
  const ingredientsText = (product?.ingredients ?? [])
    .map((i) => `${i.name} | ${i.note}`)
    .join("\n");

  return (
    <form action={formAction} className="grid lg:grid-cols-3 gap-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <input type="hidden" name="currentImage" value={product?.image ?? ""} />

      {/* Main details */}
      <div className="lg:col-span-2 space-y-5 bg-white border border-black/10 rounded-lg p-6">
        <Field label="Name" name="name" defaultValue={product?.name} required />
        <Field
          label="Slug (optional)"
          name="slug"
          defaultValue={product?.slug}
          placeholder="auto-generated from name"
        />
        <Field
          label="Short blurb"
          name="blurb"
          defaultValue={product?.blurb}
        />
        <Area
          label="Description"
          name="description"
          defaultValue={product?.description}
          rows={4}
        />
        <Area
          label="Benefits (one per line)"
          name="benefits"
          defaultValue={benefitsText}
          rows={4}
          placeholder={"Brightens dull skin\nFades dark spots over time"}
        />
        <Area
          label="Ingredients (one per line: Name | what it does)"
          name="ingredients"
          defaultValue={ingredientsText}
          rows={4}
          placeholder={"15% Vitamin C | brightens and evens tone\nFerulic Acid | stabilises the formula"}
        />
        <Area
          label="How to use"
          name="howToUse"
          defaultValue={product?.howToUse}
          rows={3}
        />
      </div>

      {/* Sidebar */}
      <div className="space-y-5">
        <div className="bg-white border border-black/10 rounded-lg p-6 space-y-4">
          <div>
            <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
              Image
              {!isEdit && <span className="text-red-500"> *</span>}
            </span>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Preview"
                className="w-full aspect-square object-cover rounded border border-black/10 mb-3"
              />
            ) : (
              <div className="w-full aspect-square rounded border border-dashed border-black/20 grid place-items-center text-xs text-ink-soft mb-3">
                No image
              </div>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
              className="block w-full text-xs text-ink-soft file:mr-3 file:py-2 file:px-3 file:border file:border-black/15 file:bg-cream file:text-ink file:text-xs"
            />
          </div>

          <SelectField
            label="Category"
            name="categoryId"
            defaultValue={product?.categoryId}
            options={categories}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Price (Rs)"
              name="price"
              type="number"
              defaultValue={product?.price}
              required
            />
            <Field
              label="Was price (Rs)"
              name="wasPrice"
              type="number"
              defaultValue={product?.wasPrice ?? undefined}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Stock"
              name="stock"
              type="number"
              defaultValue={product?.stock ?? 0}
            />
            <Field
              label="Rating (1–5)"
              name="rating"
              type="number"
              defaultValue={product?.rating ?? 5}
            />
          </div>
          <Field label="Size" name="size" defaultValue={product?.size} placeholder="30 ml" />
          <Field
            label="Badge (optional)"
            name="badge"
            defaultValue={product?.badge ?? undefined}
            placeholder="-20% or Bestseller"
          />
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              name="active"
              defaultChecked={product?.active ?? true}
            />
            Visible in shop
          </label>
        </div>

        {state.error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {state.error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={pending}
            className="flex-1 bg-ink text-white text-xs uppercase tracking-widest py-3.5 hover:bg-brand transition-colors disabled:opacity-50"
          >
            {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
          </button>
          <Link
            href="/dab/products"
            className="px-5 py-3.5 text-xs uppercase tracking-widest border border-black/15 text-ink hover:border-ink transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className="w-full border border-black/15 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
      />
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  rows = 3,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
        {label}
      </span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        rows={rows}
        placeholder={placeholder}
        className="w-full border border-black/15 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink resize-y"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  options: { id: string; name: string }[];
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </span>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        className="w-full border border-black/15 px-3 py-2.5 text-sm text-ink bg-white focus:outline-none focus:border-ink"
      >
        <option value="" disabled>
          Choose a category…
        </option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
    </label>
  );
}
