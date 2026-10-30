"use client";

import type { DiMode } from "@/lib/calculators/dailyInterestDecision";

const MODES: { id: DiMode; label: string }[] = [
  { id: "quick", label: "Quick" },
  { id: "planner", label: "Financial Planner" },
  { id: "compare", label: "Compare Loans" },
  { id: "delay", label: "Delay Cost" },
  { id: "prepay", label: "Foreclosure / Prepay" },
  { id: "penalty", label: "Penalty" },
];

type Props = {
  mode: DiMode;
  onMode: (m: DiMode) => void;
};

export function DiModeTabs({ mode, onMode }: Props) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-px">
      {MODES.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onMode(m.id)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
            mode === m.id
              ? "bg-[var(--accent)] text-[var(--accent-fg,white)]"
              : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)]"
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
