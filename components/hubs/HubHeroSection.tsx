import Link from "next/link";
import { getByCategory } from "@/lib/registry";
import { getCategoryHub } from "@/lib/category-tree";
import type { CalculatorCategory } from "@/lib/types";

type CatTheme = {
  emoji: string;
  headlineStart: string;
  headlineEnd: string;
  gradient: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  statAccent: string;
  blobA: string;
  blobB: string;
  subPill: string;
};

const catTheme: Record<CalculatorCategory, CatTheme> = {
  finance: {
    emoji: "💰",
    headlineStart: "Money that",
    headlineEnd: "adds up.",
    gradient: "from-emerald-500 to-teal-400",
    pillBg: "bg-emerald-500/[0.08]",
    pillBorder: "border-emerald-500/25",
    pillText: "text-emerald-700",
    statAccent: "text-emerald-600",
    blobA: "#10b981",
    blobB: "#0d9488",
    subPill:
      "border-emerald-200/70 bg-emerald-50/80 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
  },
  education: {
    emoji: "📚",
    headlineStart: "Academic",
    headlineEnd: "mastery.",
    gradient: "from-blue-500 to-sky-400",
    pillBg: "bg-blue-500/[0.07]",
    pillBorder: "border-blue-500/25",
    pillText: "text-blue-700",
    statAccent: "text-blue-600",
    blobA: "#3b82f6",
    blobB: "#0ea5e9",
    subPill:
      "border-blue-200/70 bg-blue-50/80 text-blue-700 hover:border-blue-300 hover:bg-blue-100",
  },
  health: {
    emoji: "❤️",
    headlineStart: "Wellness by",
    headlineEnd: "the numbers.",
    gradient: "from-rose-500 to-pink-400",
    pillBg: "bg-rose-500/[0.07]",
    pillBorder: "border-rose-500/25",
    pillText: "text-rose-700",
    statAccent: "text-rose-600",
    blobA: "#f43f5e",
    blobB: "#ec4899",
    subPill:
      "border-rose-200/70 bg-rose-50/80 text-rose-700 hover:border-rose-300 hover:bg-rose-100",
  },
  engineering: {
    emoji: "⚙️",
    headlineStart: "Technical",
    headlineEnd: "precision.",
    gradient: "from-amber-500 to-orange-400",
    pillBg: "bg-amber-500/[0.07]",
    pillBorder: "border-amber-500/25",
    pillText: "text-amber-700",
    statAccent: "text-amber-600",
    blobA: "#f59e0b",
    blobB: "#f97316",
    subPill:
      "border-amber-200/70 bg-amber-50/80 text-amber-700 hover:border-amber-300 hover:bg-amber-100",
  },
  daily: {
    emoji: "🏠",
    headlineStart: "Everyday",
    headlineEnd: "orbit.",
    gradient: "from-violet-500 to-purple-400",
    pillBg: "bg-violet-500/[0.07]",
    pillBorder: "border-violet-500/25",
    pillText: "text-violet-700",
    statAccent: "text-violet-600",
    blobA: "#8b5cf6",
    blobB: "#a855f7",
    subPill:
      "border-violet-200/70 bg-violet-50/80 text-violet-700 hover:border-violet-300 hover:bg-violet-100",
  },
  conversion: {
    emoji: "🔄",
    headlineStart: "Units without",
    headlineEnd: "friction.",
    gradient: "from-teal-500 to-cyan-400",
    pillBg: "bg-teal-500/[0.07]",
    pillBorder: "border-teal-500/25",
    pillText: "text-teal-700",
    statAccent: "text-teal-600",
    blobA: "#14b8a6",
    blobB: "#06b6d4",
    subPill:
      "border-teal-200/70 bg-teal-50/80 text-teal-700 hover:border-teal-300 hover:bg-teal-100",
  },
  business: {
    emoji: "💼",
    headlineStart: "Operate with",
    headlineEnd: "clarity.",
    gradient: "from-slate-600 to-gray-500",
    pillBg: "bg-slate-500/[0.07]",
    pillBorder: "border-slate-500/25",
    pillText: "text-slate-700",
    statAccent: "text-slate-700",
    blobA: "#475569",
    blobB: "#6b7280",
    subPill:
      "border-slate-200/70 bg-slate-50/80 text-slate-700 hover:border-slate-300 hover:bg-slate-100",
  },
  ai: {
    emoji: "🤖",
    headlineStart: "Smart",
    headlineEnd: "assistants.",
    gradient: "from-fuchsia-500 to-indigo-400",
    pillBg: "bg-fuchsia-500/[0.07]",
    pillBorder: "border-fuchsia-500/25",
    pillText: "text-fuchsia-700",
    statAccent: "text-fuchsia-600",
    blobA: "#d946ef",
    blobB: "#6366f1",
    subPill:
      "border-fuchsia-200/70 bg-fuchsia-50/80 text-fuchsia-700 hover:border-fuchsia-300 hover:bg-fuchsia-100",
  },
};

export function HubHeroSection({ category }: { category: CalculatorCategory }) {
  const hub = getCategoryHub(category);
  const allItems = getByCategory(category);
  const theme = catTheme[category];

  return (
    <section className="relative overflow-hidden pb-8 pt-4 md:pb-14 md:pt-8">
      {/* Ambient blobs — static gradients, fully server-rendered */}
      <div
        className="pointer-events-none absolute -right-24 -top-12 hidden h-80 w-80 rounded-full opacity-[0.18] blur-3xl md:block"
        style={{ background: `radial-gradient(circle, ${theme.blobA} 0%, transparent 65%)` }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 top-20 hidden h-56 w-56 rounded-full opacity-[0.13] blur-3xl md:block"
        style={{ background: `radial-gradient(circle, ${theme.blobB} 0%, transparent 65%)` }}
        aria-hidden
      />

      <div className="relative max-w-3xl">
        {/* Pill eyebrow */}
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 ${theme.pillBg} ${theme.pillBorder}`}
        >
          <span aria-hidden>{theme.emoji}</span>
          <span className={`text-xs font-semibold uppercase tracking-[0.2em] ${theme.pillText}`}>
            {hub.hubEyebrow}
          </span>
        </div>

        {/* Headline with gradient on last phrase */}
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
          {theme.headlineStart}{" "}
          <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
            {theme.headlineEnd}
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
          {hub.hubSubtitle}
        </p>

        {/* Stats bar */}
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-6">
          <div>
            <p className={`text-2xl font-bold ${theme.statAccent}`}>{allItems.length}+</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Live tools</p>
          </div>
          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />
          <div>
            <p className="text-2xl font-bold text-[var(--text)]">{hub.subcategories.length}</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Subcategories</p>
          </div>
          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />
          <div>
            <p className="text-2xl font-bold text-[var(--text)]">100%</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Free &amp; private</p>
          </div>
        </div>

        {/* Quick-nav subcategory pills */}
        <div className="mt-5 flex flex-wrap gap-2">
          {hub.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`${hub.path}/${sub.slug}`}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] ${theme.subPill}`}
            >
              {sub.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
