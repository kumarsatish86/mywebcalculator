/** Static visual for “span between two calendar points” (illustrative, not to scale). */
export function DaysBetweenTimeline() {
  return (
    <div className="relative py-10">
      <div className="absolute left-[12%] right-[12%] top-1/2 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r from-[var(--accent)] via-[var(--accent-bright)] to-[var(--accent)] opacity-40" />
      <div className="relative flex justify-between px-4 sm:px-8">
        {["Start date", "Calendar days computed", "End date"].map((label, i) => (
          <div key={label} className="flex max-w-[28%] flex-col items-center gap-3 text-center">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--border)] bg-[var(--surface-strong)] text-sm font-bold text-[var(--text)] shadow-sm ${i === 1 ? "scale-110 border-[var(--accent)]/50" : ""}`}
              aria-hidden
            >
              {i + 1}
            </span>
            <span className="text-xs font-medium text-[var(--muted)] sm:text-sm">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
