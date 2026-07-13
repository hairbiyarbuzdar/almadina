const STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-blue-50 text-blue-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-black/5 text-ink-soft line-through",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded capitalize ${
        STYLES[status] ?? "bg-black/5 text-ink-soft"
      }`}
    >
      {status}
    </span>
  );
}
