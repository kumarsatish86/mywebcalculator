"use client";

import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyInterestDecision } from "@/lib/calculators/dailyInterestDecision";
import type { LoanCurrencyCode } from "@/lib/calculators/loanFormat";
import { formatLoanMoney } from "@/lib/calculators/loanFormat";

type Props = {
  result: DailyInterestDecision;
  days: number;
  onDays: (d: number) => void;
  currency: LoanCurrencyCode;
};

export function DiChartPanel({ result, days, onDays, currency }: Props) {
  const scenarioSeries = result.chartByDay.map((pt) => {
    const row: Record<string, number> = { day: pt.day, current: pt.interest };
    for (const sc of result.aprScenarios) {
      if (sc.label === "Current") continue;
      row[sc.label] = (sc.daily / result.dailyInterest) * pt.interest;
    }
    return row;
  });

  return (
    <div className="space-y-3 rounded-xl border border-[var(--border)] p-4">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]" htmlFor="di-days-slider">
          Days horizon
        </label>
        <input
          id="di-days-slider"
          type="range"
          min={1}
          max={365}
          step={1}
          value={days}
          onChange={(e) => onDays(Number(e.target.value))}
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <p className="mt-1 font-mono text-xs text-[var(--text)]">
          {days} days · {formatLoanMoney(result.dailyInterest * days, currency)} accrued
        </p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={scenarioSeries}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} width={48} />
            <Tooltip
              formatter={(value) =>
                typeof value === "number" ? formatLoanMoney(value, currency) : String(value)
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="current" name="Current APR" stroke="var(--accent)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="+0.7%" name="+0.7%" stroke="#d97706" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
            <Line type="monotone" dataKey="+1.5%" name="+1.5%" stroke="#e11d48" strokeWidth={1.5} strokeDasharray="2 2" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
