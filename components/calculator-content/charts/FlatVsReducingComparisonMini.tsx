"use client";

import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartReady } from "./useChartReady";

type Props = {
  currency: LoanCurrencyCode;
  reducingTotalPaid: number;
  reducingInterest: number;
  flatTotalPaid: number;
  flatInterest: number;
};

export function FlatVsReducingComparisonMini({
  currency,
  reducingTotalPaid,
  reducingInterest,
  flatTotalPaid,
  flatInterest,
}: Props) {
  const ready = useChartReady();
  if (!ready) return <div className="mt-6 h-[260px] w-full min-h-[260px] min-w-0" />;

  const data = [
    {
      method: "Reducing",
      principal: Math.max(0, reducingTotalPaid - reducingInterest),
      interest: reducingInterest,
    },
    {
      method: "Flat",
      principal: Math.max(0, flatTotalPaid - flatInterest),
      interest: flatInterest,
    },
  ];

  const ariaLabel = `Stacked bar chart comparing total paid split into principal and interest for reducing-balance versus flat-rate loans. Reducing interest ${reducingInterest}, flat interest ${flatInterest}.`;

  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        Total payment composition
      </p>
      <div
        className="mt-3 h-[240px] w-full min-h-[240px] min-w-0"
        role="img"
        aria-label={ariaLabel}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
            <XAxis
              dataKey="method"
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickFormatter={(v) => formatLoanMoney(Number(v), currency)}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
                borderRadius: 12,
              }}
              formatter={(v, n) => [formatLoanMoney(Number(v), currency), n]}
            />
            <Legend />
            <Bar dataKey="principal" stackId="a" name="Principal" fill="#94a3b8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="interest" stackId="a" name="Interest" fill="#6548f5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Bars split total paid into principal and interest for each method.
      </p>
    </div>
  );
}
