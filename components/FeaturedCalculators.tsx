import Link from "next/link";
import { CALCULATOR_REGISTRY, getFeaturedSlugs } from "@/lib/registry";
import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "./GlassCard";

export function FeaturedCalculators() {
  const featured = getFeaturedSlugs()
    .map((slug) => CALCULATOR_REGISTRY.find((c) => c.slug === slug))
    .filter(Boolean);

  return (
    <section className="mt-10 space-y-10 md:mt-16">
      <SectionHeading
        eyebrow="Featured"
        title="Start with these"
        subtitle="Hand-picked tools that show off the experience — each opens in a focused, glass workspace."
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {featured.map((c) =>
          c ? (
            <li key={c.slug}>
              <Link href={`/calculators/${c.slug}`} className="group block focus:outline-none">
                <GlassCard className="h-full transition-colors group-hover:border-[var(--accent)]/40 group-hover:shadow-[var(--shadow-glow)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-[var(--accent)]">
                        {c.category.charAt(0).toUpperCase() + c.category.slice(1)}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-[var(--text)]">{c.shortTitle}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">{c.description}</p>
                    </div>
                    <span
                      className="shrink-0 rounded-lg border border-[var(--border)] px-2 py-1 text-xs font-medium text-[var(--accent-bright)] transition-colors group-hover:border-[var(--accent-bright)]/50"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </li>
          ) : null,
        )}
      </ul>
    </section>
  );
}
