"use client";

import { loanBalanceOverTime } from "@/lib/calculators/loanPayment";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  principal: number;
  apr: number;
  years: number;
};

export function UserLoanBalanceMini({ principal, apr, years }: Props) {
  const raw = loanBalanceOverTime(principal, apr, years);
  const data =
    "error" in raw
      ? []
      : (() => {
          const step = Math.max(1, Math.floor(raw.length / 40));
          return raw
            .filter((_, i) => i % step === 0 || i === raw.length - 1)
            .map((d) => ({ month: d.month, balance: Math.round(d.balance) }));
        })();

  if (data.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your balance path</p>
      <div className="mt-3 h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} tickFormatter={(v) => `$${v / 1000}k`} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              contentStyle={{
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, "Balance"]}
              labelFormatter={(m) => `Month ${m}`}
            />
            <Line type="monotone" dataKey="balance" stroke="#6548f5" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
