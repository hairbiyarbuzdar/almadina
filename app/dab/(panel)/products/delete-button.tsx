"use client";

export function DeleteButton({
  action,
  message = "Delete this? This cannot be undone.",
  label = "Delete",
}: {
  action: () => Promise<void>;
  message?: string;
  label?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(message)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-xs text-red-600 hover:text-red-700">
        {label}
      </button>
    </form>
  );
}
