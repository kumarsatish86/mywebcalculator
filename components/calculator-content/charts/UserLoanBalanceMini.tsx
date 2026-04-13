"use client";

import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { formatLoanAxisTick, formatLoanMoney } from "@/lib/calculators/loanFormat";
import type { LoanTermInput } from "@/lib/calculators/loanPayment";
import { loanBalanceOverTime } from "@/lib/calculators/loanPayment";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartReady } from "./useChartReady";

type Props = {
  principal: number;
  apr: number;
  term: LoanTermInput;
  currency: LoanCurrencyCode;
  /** When set (e.g. prepayment simulation), overrides the standard amortization curve. */
  balanceSeries?: { month: number; balance: number }[];
  bankPennyRounding?: boolean;
};

export function UserLoanBalanceMini({
  principal,
  apr,
  term,
  currency,
  balanceSeries,
  bankPennyRounding = false,
}: Props) {
  const ready = useChartReady();
  const series: { month: number; balance: number }[] | null = (() => {
    if (balanceSeries) return balanceSeries;
    const s = loanBalanceOverTime(principal, apr, term, bankPennyRounding);
    return "error" in s ? null : s;
  })();

  const data =
    series && series.length > 0
      ? (() => {
          const step = Math.max(1, Math.floor(series.length / 40));
          return series
            .filter((_, i) => i % step === 0 || i === series.length - 1)
            .map((d) => ({ month: d.month, balance: Math.round(d.balance) }));
        })()
      : [];

  if (!ready || data.length === 0) return null;

  const lastBal = data[data.length - 1]?.balance ?? 0;
  const ariaLabel = `Chart: loan balance declines from about ${principal} to about ${lastBal} over ${data[data.length - 1]?.month ?? 0} months.`;

  return (
    <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your balance path</p>
      <div
        className="mt-3 h-[200px] w-full min-h-[200px] min-w-0"
        role="img"
        aria-label={ariaLabel}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted)" }}
              tickFormatter={(v) => formatLoanAxisTick(Number(v), currency)}
              axisLine={false}
              tickLine={false}
              width={52}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v) => [formatLoanMoney(Number(v), currency), "Balance"]}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Line type="monotone" dataKey="balance" stroke="#6548f5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
