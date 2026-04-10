import Link from "next/link";
import { GlassCard } from "./GlassCard";
import { HeroOrbLazy } from "./HeroOrbLazy";

const ctaClass =
  "inline-block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]";

const featureCards = [
  { t: "Instant answers", d: "Client-side, private, no accounts." },
  { t: "Built to grow", d: "One home for every calculator you add next." },
  { t: "Motion with care", d: "Honors reduced-motion preferences." },
] as const;

/**
 * Server-rendered hero so the headline is visible in HTML immediately (fixes LCP vs FCP gap
 * caused by framer-motion `initial={{ opacity: 0 }}` on the previous implementation).
 */
export function HeroSection() {
  return (
    <section className="relative pb-16 pt-6 md:pb-24 md:pt-10">
      <HeroOrbLazy />
      <div className="relative max-w-3xl">
        <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--accent-bright)]">
          mywebcalculator.com
        </p>
        <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-[var(--text)] md:text-6xl">
          Calculators that feel like a different orbit.
        </h1>
        <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-[var(--muted)]">
          Study, finance, and just-for-fun tools — sharp math, soft glass, and motion that respects
          your eyes.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/education"
            className={`${ctaClass} bg-gradient-to-r from-[var(--accent)] to-[var(--accent-bright)] px-6 py-3 text-sm font-semibold text-[var(--text-on-gradient)] shadow-[var(--shadow-glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-deep)]`}
          >
            Explore study tools
          </Link>
          <Link
            href="/finance"
            className={`${ctaClass} border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-medium text-[var(--text)]`}
          >
            Finance calculators
          </Link>
        </div>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <GlassCard key={card.t} className="h-full" hover>
            <h3 className="text-base font-semibold text-[var(--text)]">{card.t}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{card.d}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
