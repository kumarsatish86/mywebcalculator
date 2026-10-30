"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useState, useTransition } from "react";
import { GlassCard } from "@/components/GlassCard";
import { HeroOrbLazy } from "@/components/HeroOrbLazy";
import { SEARCH_EXAMPLE_CHIPS } from "@/lib/search/intentCatalog";
import { matchIntent, type SearchSuggestion } from "@/lib/search/matchIntent";
import { CALCULATOR_REGISTRY } from "@/lib/registry";

/**
 * Search-first homepage hero — NL query → intent suggestions (client matcher).
 */
export function HomeSearchHero() {
  const inputId = useId();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSuggestion[]>([]);
  const [pending, startTransition] = useTransition();
  const totalCount = CALCULATOR_REGISTRY.length;

  const runSearch = useCallback((q: string) => {
    startTransition(() => {
      setResults(matchIntent(q, 10));
    });
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => runSearch(query), 180);
    return () => window.clearTimeout(t);
  }, [query, runSearch]);

  const journeyHint = useMemo(
    () => results.find((r) => r.journeyId)?.journeyId,
    [results],
  );

  return (
    <section className="relative pb-14 pt-6 md:pb-20 md:pt-10">
      <HeroOrbLazy />
      <div className="relative mx-auto max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/[0.07] px-4 py-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent-bright)]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
            Ask → Analyze → Decide
          </span>
        </div>

        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-[var(--text)] md:text-5xl lg:text-6xl">
          What do you want to{" "}
          <span className="bg-gradient-to-r from-[var(--accent)] via-[#8b68ff] to-[var(--accent-bright)] bg-clip-text text-transparent">
            calculate today?
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-[var(--muted)] md:text-lg">
          Type naturally—we match intents to tools in your browser. No account. No live LLM for search.
        </p>

        <label htmlFor={inputId} className="sr-only">
          Search calculators
        </label>
        <div className="relative mt-8">
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder='e.g. “I want to buy a 60 lakh house”'
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-5 py-4 text-base text-[var(--text)] shadow-[var(--shadow-card)] outline-none ring-[var(--ring)] placeholder:text-[var(--muted)] focus:ring-2"
            autoComplete="off"
          />
          {pending ? (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
              Matching…
            </span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SEARCH_EXAMPLE_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => setQuery(chip.query)}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/[0.06]"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {journeyHint ? (
          <p className="mt-4 text-sm text-[var(--muted)]">
            Tip: open the{" "}
            <Link href={`/journeys/${journeyHint}`} className="font-semibold text-[var(--accent)] underline-offset-2 hover:underline">
              guided journey
            </Link>{" "}
            for a step-by-step path.
          </p>
        ) : null}

        {results.length > 0 ? (
          <ul className="mt-8 grid gap-3 text-left sm:grid-cols-2">
            {results.map((r) => (
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
        ) : query.trim() ? (
          <p className="mt-8 text-sm text-[var(--muted)]">No strong matches—try EMI, GST, BMI, or cloud cost.</p>
        ) : null}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 border-t border-[var(--border)] pt-8 text-left">
          <div>
            <p className="text-2xl font-bold text-[var(--accent)]">{totalCount}+</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Free tools</p>
          </div>
          <div className="hidden h-8 w-px bg-[var(--border)] sm:block" />
          <div>
            <p className="text-2xl font-bold text-[var(--accent-bright)]">Ask first</p>
            <p className="mt-0.5 text-xs font-medium text-[var(--muted)]">Then browse hubs</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {[
          { t: "Natural search", d: "Intent matching over the full registry—private, instant." },
          { t: "Smart results", d: "Flagship tools show KPIs, risk, and suggestions." },
          { t: "Journeys", d: "Connected paths like Buying a home—not 500 random links." },
        ].map((card) => (
          <GlassCard key={card.t} className="h-full" hover>
            <h3 className="text-base font-semibold text-[var(--text)]">{card.t}</h3>
            <p className="mt-1.5 text-sm text-[var(--muted)]">{card.d}</p>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
