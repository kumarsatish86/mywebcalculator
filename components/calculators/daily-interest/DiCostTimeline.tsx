"use client";

import { motion } from "framer-motion";
import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import type { TimelinePoint } from "@/lib/calculators/dailyInterestDecision";

type Props = {
  timeline: TimelinePoint[];
  currency: LoanCurrencyCode;
};

export function DiCostTimeline({ timeline, currency }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">Cost timeline</p>
      <ol className="mt-3 flex flex-wrap items-stretch gap-2">
        {timeline.map((pt, i) => (
          <li key={pt.label} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="min-w-[88px] rounded-lg border border-[var(--border)] px-2.5 py-2"
            >
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">{pt.label}</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--text)]">
                {formatLoanMoney(pt.interest, currency)}
              </p>
            </motion.div>
            {i < timeline.length - 1 ? (
              <span className="text-[var(--border)]" aria-hidden>
                →
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
