export function ChartSkeleton({ label = "Loading chart…" }: { label?: string }) {
  return (
    <div
      className="flex h-[280px] w-full items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/40 text-sm text-[var(--muted)]"
      role="status"
      aria-live="polite"
    >
      {label}
    </div>
  );
}
