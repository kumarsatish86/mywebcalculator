"use client";

import { loanBalanceOverTime } from "@/lib/calculators/loanPayment";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartReady } from "./useChartReady";

const DEMO = { principal: 25000, apr: 6.5, years: 5 };

export default function LoanBalanceDemoChart() {
  const ready = useChartReady();
  const raw = loanBalanceOverTime(DEMO.principal, DEMO.apr, { termYears: DEMO.years });
  const data =
    "error" in raw
      ? []
      : raw.filter((_, i) => i % 2 === 0 || i === raw.length - 1).map((d) => ({
          month: d.month,
          balance: Math.round(d.balance),
        }));

  if (!ready) return <div className="h-[300px] w-full min-h-[300px] min-w-0" />;

  return (
    <div className="h-[300px] w-full min-h-[300px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: "Month", position: "insideBottom", offset: -4, fill: "var(--muted)", fontSize: 11 }} />
          <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, "Balance"]}
            labelFormatter={(m) => `Month ${m}`}
          />
          <Line type="monotone" dataKey="balance" stroke="#6548f5" strokeWidth={2} dot={false} name="Remaining balance" />
        </LineChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-[var(--muted)]">
        Demo: ${DEMO.principal.toLocaleString()} @ {DEMO.apr}% APR, {DEMO.years} years
      </p>
    </div>
  );
}
