"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import type {
  DailyInterestDecision,
  DecisionOption,
} from "@/lib/calculators/dailyInterestDecision";

type Props = {
  result: DailyInterestDecision;
  currency: LoanCurrencyCode;
  onApplyOption: (opt: DecisionOption) => void;
  compact?: boolean;
  showCompare?: boolean;
  showDelay?: boolean;
  showPrepay?: boolean;
};

function AnimatedMoney({ value, currency }: { value: number; currency: LoanCurrencyCode }) {
  const formatted = formatLoanMoney(value, currency);
  return (
    <motion.span
      key={formatted}
      initial={{ opacity: 0.4, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="tabular-nums"
    >
      {formatted}
    </motion.span>
  );
}

const TONE_DOT: Record<DailyInterestDecision["statusTone"], string> = {
  good: "bg-emerald-500",
  warn: "bg-amber-500",
  bad: "bg-rose-500",
  neutral: "bg-[var(--muted)]",
};

export function DiDecisionCenter({
  result,
  currency,
  onApplyOption,
  compact,
  showCompare,
  showDelay,
  showPrepay,
}: Props) {
  if (compact) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 shadow-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">Daily interest</p>
          <p className="font-mono text-xl font-semibold text-[var(--accent-bright)]">
            <AnimatedMoney value={result.dailyInterest} currency={currency} />
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2.5 w-2.5 rounded-full ${TONE_DOT[result.statusTone]}`} />
          <span className="font-semibold text-[var(--text)]">{result.statusLabel}</span>
          <span className="text-[var(--muted)]">{result.healthScore}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
        Financial Decision Center
      </p>

      <div className="rounded-xl border border-[var(--accent)]/25 bg-[var(--accent)]/5 px-4 py-5 text-center">
        <p className="text-xs uppercase tracking-wider text-[var(--muted)]">Daily interest</p>
        <p className="mt-1 font-mono text-4xl font-semibold tracking-tight text-[var(--accent-bright)] sm:text-5xl">
          <AnimatedMoney value={result.dailyInterest} currency={currency} />
        </p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          30-day ≈ <AnimatedMoney value={result.monthlyInterest} currency={currency} />
          {" · "}
          Year ≈ <AnimatedMoney value={result.yearlyInterest} currency={currency} />
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          For {result.days} days:{" "}
          <span className="font-mono text-[var(--text)]">
            <AnimatedMoney value={result.totalForDays} currency={currency} />
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2">
          <span className={`h-3 w-3 rounded-full ${TONE_DOT[result.statusTone]}`} aria-hidden />
          <div>
            <p className="text-[10px] uppercase text-[var(--muted)]">Status</p>
            <p className="text-sm font-semibold text-[var(--text)]">{result.statusLabel}</p>
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Health score</p>
          <p className="font-mono text-sm font-semibold">{result.healthScore} / 100</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Risk</p>
          <p className="text-sm font-semibold">{result.risk}</p>
        </div>
        <div className="rounded-lg border border-[var(--border)] px-3 py-2">
          <p className="text-[10px] uppercase text-[var(--muted)]">Efficiency</p>
          <p className="font-mono text-sm font-semibold">{result.interestEfficiency}</p>
        </div>
      </div>

      <p className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--text)]">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)]">
          Recommendation ·{" "}
        </span>
        {result.recommendation}
      </p>

      {showDelay ? (
        <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-xs">
          <p className="font-semibold text-[var(--text)]">Delay cost sketch</p>
          <dl className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div>
              <dt className="text-[var(--muted)]">Days</dt>
              <dd className="font-mono">{result.delay.days}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Interest</dt>
              <dd className="font-mono">{formatLoanMoney(result.delay.interest, currency)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Penalty</dt>
              <dd className="font-mono">{formatLoanMoney(result.delay.penalty, currency)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Total</dt>
              <dd className="font-mono font-semibold">{formatLoanMoney(result.delay.total, currency)}</dd>
            </div>
          </dl>
        </div>
      ) : null}

      {showPrepay ? (
        <div className="rounded-xl border border-[var(--border)] px-3 py-3 text-xs">
          <p className="font-semibold text-[var(--text)]">Prepay / extra payment (heuristic)</p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-[var(--muted)]">Lump interest saved</dt>
              <dd className="font-mono">{formatLoanMoney(result.prepay.interestSaved, currency)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Months earlier (est.)</dt>
              <dd className="font-mono">{result.prepay.monthsEarlier}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Extra monthly saved</dt>
              <dd className="font-mono">{formatLoanMoney(result.extraPayment.interestSaved, currency)}</dd>
            </div>
            <div>
              <dt className="text-[var(--muted)]">Months reduced (est.)</dt>
              <dd className="font-mono">{result.extraPayment.monthsReduced}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[10px] text-[var(--muted)]">
            Not amortization truth — confirm with{" "}
            <Link href="/calculators/loan-prepayment-savings-calculator" className="text-[var(--accent)]">
              prepayment savings
            </Link>{" "}
            or{" "}
            <Link href="/calculators/loan-foreclosure-calculator" className="text-[var(--accent)]">
              foreclosure
            </Link>
            .
          </p>
        </div>
      ) : null}

      {showCompare ? (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full min-w-[320px] text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--muted)]">
                <th className="px-3 py-2 font-semibold">Bank</th>
                <th className="px-3 py-2 font-semibold">APR</th>
                <th className="px-3 py-2 font-semibold">Daily</th>
                <th className="px-3 py-2 font-semibold">Annual</th>
              </tr>
            </thead>
            <tbody>
              {result.bankCompare.map((row) => (
                <tr key={row.bankId} className="border-b border-[var(--border)]/60">
                  <td className="px-3 py-2 font-medium text-[var(--text)]">{row.label}</td>
                  <td className="px-3 py-2 font-mono">{row.apr.toFixed(2)}%</td>
                  <td className="px-3 py-2 font-mono">{formatLoanMoney(row.daily, currency)}</td>
                  <td className="px-3 py-2 font-mono">{formatLoanMoney(row.annual, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-3 py-2 text-[10px] text-[var(--muted)]">
            Illustrative APRs for the selected loan type — not live quotes.
          </p>
        </div>
      ) : null}

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Next best actions
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {result.decisionOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onApplyOption(opt)}
              className="rounded-xl border border-[var(--border)] p-3 text-left transition hover:border-[var(--accent)]/50"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent)]">{opt.label}</p>
              <p className="mt-1 text-xs font-semibold text-[var(--text)]">{opt.action}</p>
              <p className="mt-2 font-mono text-sm text-[var(--accent-bright)]">
                ~{formatLoanMoney(opt.savingsEstimate, currency)}
              </p>
              <p className="mt-1 text-[10px] text-[var(--muted)]">{opt.blurb}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[280px] text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] text-[10px] uppercase text-[var(--muted)]">
              <th className="px-3 py-2 font-semibold">Question</th>
              <th className="px-3 py-2 font-semibold">Answer</th>
            </tr>
          </thead>
          <tbody>
            {result.intelligence.map((row) => (
              <tr key={row.question} className="border-b border-[var(--border)]/60">
                <td className="px-3 py-2 text-[var(--muted)]">{row.question}</td>
                <td className="px-3 py-2 font-medium text-[var(--text)]">{row.answer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="space-y-1.5 text-xs text-[var(--muted)]">
        {result.insights.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-[var(--accent)]" aria-hidden>
              ·
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>

      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">
          Next step toolkit
        </p>
        <ul className="space-y-1">
          {result.relatedSlugs.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/calculators/${r.slug}`}
                className="text-sm text-[var(--text)] hover:text-[var(--accent-bright)]"
              >
                {r.reason} →
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[10px] leading-relaxed text-[var(--muted)]">{result.disclaimer}</p>
    </div>
  );
}
