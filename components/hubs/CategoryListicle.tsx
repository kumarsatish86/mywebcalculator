import Link from "next/link";
import { getByCategory } from "@/lib/registry";
import type { CalculatorCategory } from "@/lib/types";
import { getCategoryHub, getSubcategorySections } from "@/lib/category-tree";

const subEmoji: Record<string, string> = {
  "loans-emi": "🏦",
  "investment-wealth": "📈",
  "salary-income": "💵",
  "banking-credit": "💳",
  mathematics: "📐",
  science: "🔬",
  "exam-score": "🎓",
  "body-metrics": "⚖️",
  "diet-nutrition": "🥗",
  medical: "🏥",
  electrical: "⚡",
  civil: "🏗️",
  "it-dev": "💻",
  "home-utility": "🏠",
  "shopping-discount": "🛍️",
  travel: "✈️",
  "unit-converters": "📏",
  currency: "💱",
  "time-date": "🕐",
  "business-finance": "💼",
  marketing: "📣",
  "hr-productivity": "👥",
  "smart-tools": "🤖",
  generators: "✍️",
};

type AccentConfig = {
  topBar: string;
  iconGradient: string;
  badge: string;
  sectionPill: string;
};

const catAccent: Record<CalculatorCategory, AccentConfig> = {
  finance: {
    topBar: "from-emerald-500 to-teal-400",
    iconGradient: "from-emerald-500 to-teal-400",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    sectionPill:
      "border-emerald-200/70 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100",
  },
  education: {
    topBar: "from-blue-500 to-sky-400",
    iconGradient: "from-blue-500 to-sky-400",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    sectionPill: "border-blue-200/70 bg-blue-50/60 text-blue-700 hover:bg-blue-100",
  },
  health: {
    topBar: "from-rose-500 to-pink-400",
    iconGradient: "from-rose-500 to-pink-400",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    sectionPill: "border-rose-200/70 bg-rose-50/60 text-rose-700 hover:bg-rose-100",
  },
  engineering: {
    topBar: "from-amber-500 to-orange-400",
    iconGradient: "from-amber-500 to-orange-400",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    sectionPill:
      "border-amber-200/70 bg-amber-50/60 text-amber-700 hover:bg-amber-100",
  },
  daily: {
    topBar: "from-violet-500 to-purple-400",
    iconGradient: "from-violet-500 to-purple-400",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    sectionPill:
      "border-violet-200/70 bg-violet-50/60 text-violet-700 hover:bg-violet-100",
  },
  conversion: {
    topBar: "from-teal-500 to-cyan-400",
    iconGradient: "from-teal-500 to-cyan-400",
    badge: "border-teal-200 bg-teal-50 text-teal-700",
    sectionPill: "border-teal-200/70 bg-teal-50/60 text-teal-700 hover:bg-teal-100",
  },
  business: {
    topBar: "from-slate-600 to-gray-500",
    iconGradient: "from-slate-600 to-gray-500",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    sectionPill:
      "border-slate-200/70 bg-slate-50/60 text-slate-700 hover:bg-slate-100",
  },
  ai: {
    topBar: "from-fuchsia-500 to-indigo-400",
    iconGradient: "from-fuchsia-500 to-indigo-400",
    badge: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    sectionPill:
      "border-fuchsia-200/70 bg-fuchsia-50/60 text-fuchsia-700 hover:bg-fuchsia-100",
  },
};

const MAX_CHIPS = 6;

export function CategoryListicle({ category }: { category: CalculatorCategory }) {
  const hub = getCategoryHub(category);
  const items = getByCategory(category);
  const accent = catAccent[category];

  return (
    <div className="md:columns-2 md:gap-5">
      {hub.subcategories.map((sub) => {
        const subItems = items.filter((item) => item.subCategorySlug === sub.slug);
        const sections = getSubcategorySections(category, sub.slug);
        const emoji = subEmoji[sub.slug] ?? "🧮";

        return (
          <div
            key={sub.slug}
            className="relative mb-5 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]/70 p-5 shadow-[var(--shadow-card)] backdrop-blur-xl last:mb-0"
          >
            {/* Colored top accent bar */}
            <div
              className={`absolute inset-x-0 top-0 h-0.5 rounded-t-2xl bg-gradient-to-r ${accent.topBar}`}
            />

            {/* Card header */}
            <div className="flex items-start justify-between gap-3 pt-1">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent.iconGradient} text-xl shadow-sm`}
                  aria-hidden
                >
                  {emoji}
                </div>
                <Link
                  href={`${hub.path}/${sub.slug}`}
                  className="group/title focus:outline-none"
                >
                  <h2 className="text-base font-semibold leading-snug text-[var(--text)] underline-offset-3 transition-colors group-hover/title:text-[var(--accent)]">
                    {sub.title}
                    <span className="ml-1 opacity-0 transition-opacity group-hover/title:opacity-100">
                      →
                    </span>
                  </h2>
                </Link>
              </div>
              {subItems.length > 0 && (
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${accent.badge}`}
                >
                  {subItems.length} live
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-2.5 text-sm leading-relaxed text-[var(--muted)]">
              {sub.description}
            </p>

            {/* Section-hub pills */}
            {sections.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--accent-bright)]">
                  {sections.length} topic {sections.length === 1 ? "hub" : "hubs"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sections.map((sec) => (
                    <Link
                      key={sec.slug}
                      href={`${hub.path}/${sub.slug}/${sec.slug}`}
                      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${accent.sectionPill}`}
                    >
                      {sec.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Live calculator chips */}
            {subItems.length > 0 && (
              <div className="mt-4">
                {sections.length > 0 && (
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
                    Live calculators
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {subItems.slice(0, MAX_CHIPS).map((c) => (
                    <Link
                      key={c.slug}
                      href={`/calculators/${c.slug}`}
                      className="rounded-lg border border-[var(--border)] bg-[var(--surface)]/80 px-2.5 py-1 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)]/40 hover:text-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      {c.shortTitle}
                    </Link>
                  ))}
                  {subItems.length > MAX_CHIPS && (
                    <Link
                      href={`${hub.path}/${sub.slug}`}
                      className="rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/[0.05] px-2.5 py-1 text-xs font-semibold text-[var(--accent)] transition-colors hover:bg-[var(--accent)]/[0.1] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                    >
                      +{subItems.length - MAX_CHIPS} more
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {sections.length === 0 && subItems.length === 0 && (
              <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)]/50 p-5 text-center text-sm text-[var(--muted)]">
                {sub.emptyState ?? "Calculators coming soon…"}
              </p>
            )}

            {/* View all footer */}
            <div className="mt-5 border-t border-[var(--border)] pt-4">
              <Link
                href={`${hub.path}/${sub.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-bright)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
              >
                Explore {sub.title} →
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
