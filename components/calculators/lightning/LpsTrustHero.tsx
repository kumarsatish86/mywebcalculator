"use client";

import type { LpsStandardId } from "@/lib/calculators/engineering/lightningProtection";
import { LPS_STANDARDS } from "@/lib/calculators/engineering/lightningProtection";

type Props = {
  standardId: LpsStandardId;
  onStandardChange: (id: LpsStandardId) => void;
};

const STD_IDS = Object.keys(LPS_STANDARDS) as LpsStandardId[];

export function LpsTrustHero({ standardId, onStandardChange }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg" aria-hidden>
          ⚡
        </span>
        <p className="text-sm font-semibold text-[var(--text)]">Lightning Protection Workspace</p>
        <span className="font-mono text-xs text-amber-600 dark:text-amber-400" aria-label="4 of 5">
          ★★★★☆
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Study
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Professional
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Rules assisted
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          ~5 min
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Browser only
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {STD_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onStandardChange(id)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              standardId === id
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent-bright)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {LPS_STANDARDS[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}
