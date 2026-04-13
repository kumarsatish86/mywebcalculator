"use client";

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

const PV = 5000;
const RATE = 5.5;
const YEARS = 20;
const N = 12;

export default function CompoundGrowthDemoChart() {
  const ready = useChartReady();
  const points = [];
  for (let y = 0; y <= YEARS; y++) {
    const r = compoundFutureValue({
      principal: PV,
      annualRatePercent: RATE,
      years: y,
      compoundsPerYear: N,
    });
    if ("error" in r) break;
    points.push({ year: y, value: Math.round(r.futureValue) });
  }

  if (!ready) return <div className="h-[300px] w-full min-h-[300px] min-w-0" />;

  return (
    <div className="h-[300px] w-full min-h-[300px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="compoundFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d9488" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="year" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v) => `$${v / 1000}k`} tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [`$${Number(v).toLocaleString()}`, "Balance"]}
            labelFormatter={(y) => `Year ${y}`}
          />
          <Area type="monotone" dataKey="value" stroke="#0d9488" fill="url(#compoundFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-[var(--muted)]">
        Demo: ${PV.toLocaleString()} at {RATE}% nominal, monthly compounding
      </p>
    </div>
  );
}
