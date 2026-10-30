import Link from "next/link";
import type { CalculatorDefinition } from "@/lib/types";
import { getCategoryHub, subcategoryTitleForSlug } from "@/lib/category-tree";

export function CalculatorPageFrame({
  definition,
  /** Workspace hosts already include title, disclaimer, and toolkit — keep only breadcrumb chrome. */
  compact = false,
}: {
  definition: CalculatorDefinition;
  compact?: boolean;
}) {
  const hub = getCategoryHub(definition.category);
  const hubPath = hub.path;
  const subPath = `${hubPath}/${definition.subCategorySlug}`;
  const subTitle = subcategoryTitleForSlug(definition.category, definition.subCategorySlug);
  const hubLinkLabel = `${hub.title} calculators`;

  return (
    <div className={compact ? "mb-4 space-y-2" : "mb-8 space-y-4"}>
      <nav className="text-sm text-[var(--muted)]" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/"
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">
            /
          </li>
          <li>
            <Link
              href={hubPath}
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              {hubLinkLabel}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">
            /
          </li>
          <li>
            <Link
              href={subPath}
              className="font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] rounded"
            >
              {subTitle}
            </Link>
          </li>
          <li aria-hidden className="text-[var(--border)]">
            /
          </li>
          <li className="font-medium text-[var(--text)]" aria-current="page">
            {definition.shortTitle}
          </li>
        </ol>
      </nav>
      {compact ? (
        <div className="flex flex-wrap gap-2">
          <Link
            href={subPath}
            className="text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-bright)]"
          >
            ← {subTitle}
          </Link>
          <span className="text-xs text-[var(--border)]" aria-hidden>
            ·
          </span>
          <Link href={hubPath} className="text-xs font-medium text-[var(--muted)] hover:text-[var(--text)]">
            All {hub.title}
          </Link>
        </div>
      ) : (
        <>
          <p className="max-w-3xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
            {definition.longDescription}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href={subPath}
              className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              ← Back to {subTitle}
            </Link>
            <Link
              href={hubPath}
              className="inline-flex rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            >
              All {hub.title}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
