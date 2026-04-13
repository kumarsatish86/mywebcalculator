"use client";

import { useId } from "react";
import { compoundFutureValue } from "@/lib/calculators/compoundInterest";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartReady } from "./useChartReady";

type Props = {
  principal: number;
  annualRatePercent: number;
  years: number;
  compoundsPerYear: number;
};

export function UserCompoundGrowthMini({
  principal,
  annualRatePercent,
  years,
  compoundsPerYear,
}: Props) {
  const ready = useChartReady();
  const gradId = useId().replace(/:/g, "");
  const yMax = Math.min(45, Math.max(1, Math.ceil(years)));
  const data: { year: number; value: number }[] = [];
  for (let y = 0; y <= yMax; y++) {
    const r = compoundFutureValue({
      principal,
      annualRatePercent,
      years: y,
      compoundsPerYear,
    });
    if ("error" in r) return null;
    data.push({ year: y, value: Math.round(r.futureValue) });
  }

  if (!ready || data.length === 0) return null;

  return (
    <div className="mt-8 rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/30 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Your growth path</p>
      <div className="mt-3 h-[200px] w-full min-h-[200px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(15,23,42,0.06)" vertical={false} />
            <XAxis dataKey="year" tick={{ fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "var(--muted)" }} tickFormatter={(v) => `$${v / 1000}k`} axisLine={false} tickLine={false} width={44} />
            <Tooltip
              contentStyle={{
                background: "var(--surface-strong)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                fontSize: 12,
              }}
              formatter={(v) => [`$${Number(v).toLocaleString()}`, "Balance"]}
              labelFormatter={(y) => `Year ${y}`}
            />
            <Area type="monotone" dataKey="value" stroke="#0d9488" fill={`url(#${gradId})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
