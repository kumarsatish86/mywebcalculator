import Link from "next/link";
import { CALCULATOR_REGISTRY, getFeaturedSlugs } from "@/lib/registry";
import type { CalculatorCategory } from "@/lib/types";
import { SectionHeading } from "./SectionHeading";
import { GlassCard } from "./GlassCard";

const catStyle: Record<CalculatorCategory, { emoji: string; bg: string; text: string }> = {
  finance:     { emoji: "💰", bg: "bg-emerald-50",  text: "text-emerald-700" },
  education:   { emoji: "📚", bg: "bg-blue-50",     text: "text-blue-700"    },
  health:      { emoji: "❤️",  bg: "bg-rose-50",     text: "text-rose-700"   },
  engineering: { emoji: "⚙️",  bg: "bg-amber-50",    text: "text-amber-700"  },
  daily:       { emoji: "🏠", bg: "bg-violet-50",   text: "text-violet-700"  },
  conversion:  { emoji: "🔄", bg: "bg-teal-50",     text: "text-teal-700"    },
  business:    { emoji: "💼", bg: "bg-slate-50",    text: "text-slate-700"   },
  ai:          { emoji: "🤖", bg: "bg-fuchsia-50",  text: "text-fuchsia-700" },
};

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
        {featured.map((c) => {
          if (!c) return null;
          const style = catStyle[c.category] ?? { emoji: "🧮", bg: "bg-slate-50", text: "text-slate-700" };
          return (
            <li key={c.slug}>
              <Link href={`/calculators/${c.slug}`} className="group block focus:outline-none">
                <GlassCard className="h-full transition-all group-hover:border-[var(--accent)]/40 group-hover:shadow-[var(--shadow-glow)]">
                  <div className="flex items-start gap-4">
                    {/* Category icon */}
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${style.bg}`}
                      aria-hidden
                    >
                      {style.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold uppercase tracking-wider ${style.text}`}>
                        {c.category.charAt(0).toUpperCase() + c.category.slice(1)}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-[var(--text)]">{c.shortTitle}</h3>
                      <p className="mt-1.5 text-sm text-[var(--muted)]">{c.description}</p>
                    </div>
                    {/* Arrow button */}
                    <span
                      className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-sm text-[var(--accent)] transition-all group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white"
                      aria-hidden
                    >
                      →
                    </span>
                  </div>
                </GlassCard>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
