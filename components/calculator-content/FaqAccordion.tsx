import type { CalculatorFaqItem } from "@/lib/types";

type FaqAccordionProps = {
  items: CalculatorFaqItem[];
  /** Defaults for calculator detail pages. */
  title?: string;
  subtitle?: string;
  /**
   * Shared `name` groups `<details>` into an exclusive accordion in supporting browsers.
   * Use a unique value if multiple FAQ blocks could appear on one document.
   */
  detailsGroupName?: string;
};

export function FaqAccordion({
  items,
  title = "Frequently asked questions",
  subtitle = "Quick answers about this calculator. For legal or financial decisions, consult a professional.",
  detailsGroupName = "mwc-faq",
}: FaqAccordionProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]/60 p-6 backdrop-blur-md sm:p-8">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">{subtitle}</p>
      <ul className="mt-8 space-y-2">
        {items.map((item, i) => (
          <li
            key={`${detailsGroupName}-${i}`}
            className="rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/40"
          >
            <details className="group" name={detailsGroupName} open={i === 0}>
              <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-strong)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring)] [&::-webkit-details-marker]:hidden">
                <span>{item.question}</span>
                <span className="shrink-0 text-[var(--accent)] group-open:hidden" aria-hidden>
                  +
                </span>
                <span className="hidden shrink-0 text-[var(--accent)] group-open:inline" aria-hidden>
                  −
                </span>
              </summary>
              <p className="border-t border-[var(--border)] px-4 py-4 text-sm leading-relaxed text-[var(--muted)]">
                {item.answer}
              </p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
}
