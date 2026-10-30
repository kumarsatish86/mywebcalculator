"use client";

import Link from "next/link";
import { relatedForSlug } from "@/lib/recommendations/relatedForSlug";
import { journeyIdsForSlug, getJourney } from "@/lib/journeys/definitions";

export function RelatedToolsRail({ slug }: { slug: string }) {
  const related = relatedForSlug(slug, 8);
  const journeys = journeyIdsForSlug(slug)
    .map((id) => getJourney(id))
    .filter(Boolean);

  if (!related.length && !journeys.length) return null;

  return (
    <section className="mt-10 border-t border-[var(--border)] pt-8" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-lg font-semibold tracking-tight text-[var(--text)]">
        Next tools to try
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Deterministic recommendations from journeys and related hubs—not a live AI model.
      </p>

      {journeys.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {journeys.map((j) =>
            j ? (
              <Link
                key={j.id}
                href={`/journeys/${j.id}`}
                className="rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.07] px-3 py-1.5 text-xs font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/15"
              >
                Journey: {j.title}
              </Link>
            ) : null,
          )}
        </div>
      ) : null}

      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((r) => (
          <li key={r.slug}>
            <Link
              href={`/calculators/${r.slug}`}
              className="block h-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[var(--shadow-card)]"
            >
              <p className="text-sm font-semibold text-[var(--text)]">{r.title}</p>
              <p className="mt-1 text-xs text-[var(--muted)]">{r.reason}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
