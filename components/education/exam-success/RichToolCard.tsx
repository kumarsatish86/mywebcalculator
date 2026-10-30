"use client";

import Link from "next/link";
import type { CenterToolMeta } from "@/lib/education/examSuccessCenter";
import { relatedForSlug } from "@/lib/recommendations/relatedForSlug";

function Stars({ n }: { n: number }) {
  return (
    <span className="font-mono text-xs tracking-tight text-amber-600 dark:text-amber-400" aria-label={`${n} of 5 popularity`}>
      {"★".repeat(n)}
      {"☆".repeat(5 - n)}
    </span>
  );
}

export function RichToolCard({
  tool,
  onOpen,
}: {
  tool: CenterToolMeta;
  onOpen?: (slug: string) => void;
}) {
  const relatedCount = relatedForSlug(tool.slug, 6).length;
  return (
    <Link
      href={`/calculators/${tool.slug}`}
      onClick={() => onOpen?.(tool.slug)}
      className="group flex min-w-[220px] max-w-[280px] shrink-0 flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)]/80 p-4 transition hover:border-[var(--accent)]/50 hover:bg-[var(--surface)]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent-bright)]">
          {tool.title}
        </h3>
        {tool.aiAssisted ? (
          <span className="shrink-0 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--accent-bright)]">
            AI
          </span>
        ) : null}
      </div>
      <div className="mt-2">
        <Stars n={tool.popularity} />
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-[var(--muted)]">
        <div>
          <dt className="uppercase tracking-wider">Time</dt>
          <dd className="font-mono text-[var(--text)]">{tool.estMinutes} min</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wider">Level</dt>
          <dd className="capitalize text-[var(--text)]">{tool.difficulty}</dd>
        </div>
        <div className="col-span-2">
          <dt className="uppercase tracking-wider">Related</dt>
          <dd className="text-[var(--text)]">{relatedCount} tools</dd>
        </div>
      </dl>
      <span className="mt-3 text-xs font-semibold text-[var(--accent)] group-hover:text-[var(--accent-bright)]">
        Open →
      </span>
    </Link>
  );
}
