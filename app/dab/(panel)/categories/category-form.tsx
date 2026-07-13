"use client";

import { useActionState } from "react";
import { saveCategory, type CategoryActionState } from "./actions";

const initial: CategoryActionState = { error: null };

export type CategoryValues = {
  id?: string;
  name?: string;
  position?: number;
};

export function CategoryForm({
  category,
  compact = false,
}: {
  category?: CategoryValues;
  compact?: boolean;
}) {
  const [state, formAction, pending] = useActionState(saveCategory, initial);
  const isEdit = Boolean(category?.id);

  return (
    <form
      action={formAction}
      className={compact ? "flex flex-wrap items-end gap-3" : "space-y-4 max-w-md"}
    >
      {category?.id && <input type="hidden" name="id" value={category.id} />}

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
          Name<span className="text-red-500"> *</span>
        </span>
        <input
          name="name"
          defaultValue={category?.name}
          required
          placeholder="e.g. Cleansers"
          className="w-full border border-black/15 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink"
        />
      </label>

      <label className="block">
        <span className="block text-xs uppercase tracking-[0.14em] text-ink-soft mb-1.5">
          Display order
        </span>
        <input
          name="position"
          type="number"
          defaultValue={category?.position ?? 0}
          className={`border border-black/15 px-3 py-2.5 text-sm text-ink focus:outline-none focus:border-ink ${
            compact ? "w-24" : "w-full"
          }`}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-white text-xs uppercase tracking-widest px-5 py-2.5 hover:bg-brand transition-colors disabled:opacity-50"
      >
        {pending ? "Saving…" : isEdit ? "Save changes" : "Add category"}
      </button>

      {state.error && (
        <p className="w-full text-sm text-red-600">{state.error}</p>
      )}
    </form>
  );
}
