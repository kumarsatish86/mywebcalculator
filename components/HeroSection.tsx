import Link from "next/link";
import { GlassCard } from "./GlassCard";
import { HeroOrbLazy } from "./HeroOrbLazy";
import { CALCULATOR_REGISTRY } from "@/lib/registry";

const ctaClass =
  "inline-block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]";

const featureCards = [
  {
    icon: "⚡",
    iconBg: "from-amber-400/30 to-yellow-300/15",
    iconBorder: "border-amber-300/40",
    t: "Instant answers",
    d: "Client-side, private, no accounts.",
  },
  {
    icon: "📈",
    iconBg: "from-emerald-400/30 to-teal-300/15",
    iconBorder: "border-emerald-300/40",
    t: "Built to grow",
    d: "One home for every calculator you add next.",
  },
  {
    icon: "✨",
    iconBg: "from-violet-400/30 to-purple-300/15",
    iconBorder: "border-violet-300/40",
    t: "Motion with care",
    d: "Honors reduced-motion preferences.",
  },
] as const;

/** Server-rendered hero — headline visible in HTML immediately for LCP. */
export function HeroSection() {
  const totalCount = CALCULATOR_REGISTRY.length;

  return (
    <section className="relative pb-16 pt-6 md:pb-24 md:pt-10">
      <HeroOrbLazy />
      <div className="relative max-w-3xl">
        {/* Pill badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.07] px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-bright)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            mywebcalculator.com
          </span>
        </div>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--text)] md:text-6xl">
          Calculators that feel
          <br className="hidden sm:block" />
          like a{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] via-[#8b68ff] to-[var(--accent-bright)] bg-clip-text text-transparent">
            different orbit.
          </span>
        </h1>

        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
          Study, finance, and just-for-fun tools — sharp math, soft glass, and motion that respects
          your eyes.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/education"
            className={`${ctaClass} bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-7 py-3.5 text-sm font-semibold text-white shadow-[var(--shadow-glow)] hover:shadow-lg focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]`}
          >
            Explore study tools
          </Link>
          <Link
            href="/finance"
            className={`${ctaClass} border border-[var(--border)] bg-[var(--surface)] px-7 py-3.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-strong)]`}
          >
            Finance calculators
          </Link>
        </div>

        {/* Stats bar */}
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-8">
          <div>
            <p className="text-2xl font-bold text-[var(--accent)]">{totalCount}+</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Free tools</p>
          </div>
          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />
          <div>
            <p className="text-2xl font-bold text-[var(--accent-bright)]">8</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Categories</p>
          </div>
          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />
          <div>
            <p className="text-2xl font-bold text-[var(--text)]">100%</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Private &amp; free</p>
          </div>
        </div>
      </div>

      {/* Feature cards with icons */}
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <GlassCard key={card.t} className="h-full" hover>
            <div className="flex items-start gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border bg-gradient-to-br text-xl ${card.iconBg} ${card.iconBorder}`}
              >
                {card.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text)]">{card.t}</h3>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{card.d}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
