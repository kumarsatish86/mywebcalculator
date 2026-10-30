import Link from "next/link";
import { notFound } from "next/navigation";
import { GlassCard } from "@/components/GlassCard";
import { getCalculator } from "@/lib/registry";
import { getJourney, JOURNEY_DEFINITIONS } from "@/lib/journeys/definitions";

type Props = { params: Promise<{ journeySlug: string }> };

export function generateStaticParams() {
  return JOURNEY_DEFINITIONS.map((j) => ({ journeySlug: j.id }));
}

export async function generateMetadata({ params }: Props) {
  const { journeySlug } = await params;
  const journey = getJourney(journeySlug);
  if (!journey) return {};
  return {
    title: `${journey.title} journey`,
    description: journey.description,
  };
}

export default async function JourneyPage({ params }: Props) {
  const { journeySlug } = await params;
  const journey = getJourney(journeySlug);
  if (!journey) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">Journey</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text)] md:text-4xl">
        {journey.title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-[var(--muted)]">{journey.description}</p>

      <ol className="mt-10 space-y-4">
        {journey.steps.map((step, i) => {
          const def = getCalculator(step.slug);
          const href = def ? `/calculators/${step.slug}` : "#";
          return (
            <li key={step.slug}>
              <GlassCard className="!p-5" hover={Boolean(def)}>
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-sm font-bold text-[var(--accent)]">
                    {i + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-base font-semibold text-[var(--text)]">{step.title}</h2>
                    <p className="mt-1 text-sm text-[var(--muted)]">{step.blurb}</p>
                    {def ? (
                      <Link
                        href={href}
                        className="mt-3 inline-flex text-sm font-semibold text-[var(--accent)] underline-offset-2 hover:underline"
                      >
                        Open {def.shortTitle || def.title} →
                      </Link>
                    ) : (
                      <p className="mt-3 text-xs text-amber-700">Tool not in registry yet.</p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </li>
          );
        })}
      </ol>

      <p className="mt-8 text-sm text-[var(--muted)]">
        Share URL params between steps when inputs overlap (loan amount, rate, tenure) using each tool’s share link.
      </p>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-[var(--accent)] hover:underline">
        ← Back to search
      </Link>
    </div>
  );
}
