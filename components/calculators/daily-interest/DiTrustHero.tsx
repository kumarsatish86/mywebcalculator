"use client";

import { LOAN_PRESETS, type LoanPresetId } from "@/lib/calculators/dailyInterestDecision";

type Props = {
  presetId: LoanPresetId;
  onPreset: (id: LoanPresetId) => void;
};

const PRESET_IDS = Object.keys(LOAN_PRESETS) as LoanPresetId[];

export function DiTrustHero({ presetId, onPreset }: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] bg-[var(--surface)]/60 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm font-semibold text-[var(--text)]">Daily Interest Decision Workspace</p>
        <span className="font-mono text-xs text-amber-600 dark:text-amber-400" aria-label="4 of 5">
          ★★★★☆
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Study
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Browser only
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          ~5 min
        </span>
        <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Actual/365
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PRESET_IDS.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => onPreset(id)}
            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${
              presetId === id
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent-bright)]"
                : "border-[var(--border)] text-[var(--muted)]"
            }`}
          >
            {LOAN_PRESETS[id].label}
          </button>
        ))}
      </div>
    </div>
  );
}
