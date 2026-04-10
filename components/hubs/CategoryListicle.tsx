import Link from "next/link";
import { getByCategory } from "@/lib/registry";
import type { CalculatorCategory } from "@/lib/types";
import { getCategoryHub, getSubcategorySections } from "@/lib/category-tree";

export function CategoryListicle({ category }: { category: CalculatorCategory }) {
  const hub = getCategoryHub(category);
  const items = getByCategory(category);

  return (
    <div className="grid grid-cols-1 items-start gap-x-8 gap-y-14 md:grid-cols-2">
      {hub.subcategories.map((sub) => {
        const subItems = items.filter((item) => item.subCategorySlug === sub.slug);
        const sections = getSubcategorySections(category, sub.slug);
        return (
          <section key={sub.slug} className="space-y-4">
            <Link
              href={`${hub.path}/${sub.slug}`}
              className="group inline-flex max-w-full items-center gap-2 focus:outline-none"
            >
              <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] decoration-2 underline-offset-4 transition-colors group-hover:text-[var(--accent)] group-hover:underline group-hover:decoration-[var(--accent)]">
                {sub.title}
              </h2>
              <span className="text-[var(--muted)] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{sub.description}</p>
            {sections.length > 0 ? (
              <>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--accent-bright)]">
                  {sections.length} section hubs available
                </p>
                <ul className="space-y-2 border-l-2 border-[var(--border)] pl-4">
                  {sections.map((sec) => (
                    <li key={sec.slug}>
                      <Link
                        href={`${hub.path}/${sub.slug}/${sec.slug}`}
                        className="rounded text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      >
                        {sec.title}
                        <span className="ml-2 text-xs font-normal text-[var(--muted)]">
                          ({sec.calculators.length} planned)
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {subItems.length > 0 ? (
              <>
                {sections.length > 0 ? (
                  <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[var(--accent-bright)]">
                    Live calculators
                  </p>
                ) : null}
                <ul className="space-y-3 border-l-2 border-[var(--border)] pl-4">
                  {subItems.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/calculators/${c.slug}`}
                        className="group/link block rounded-r-lg py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                      >
                        <span className="font-medium text-[var(--text)] group-hover/link:text-[var(--accent)]">
                          {c.shortTitle}
                        </span>
                        <span className="mt-0.5 block text-sm text-[var(--muted)] group-hover/link:text-[var(--text)]/80">
                          {c.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            {sections.length === 0 && subItems.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 p-6 text-center text-sm text-[var(--muted)]">
                {sub.emptyState ?? "Calculators coming soon…"}
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
