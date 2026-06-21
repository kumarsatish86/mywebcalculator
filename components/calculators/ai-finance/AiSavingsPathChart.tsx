"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartReady } from "@/components/calculator-content/charts/useChartReady";
import type { ChartValueFormat } from "./AiFinanceUi";

function yTick(format: ChartValueFormat, v: number): string {
  if (format === "currency") return `₹${Number(v) / 100000}L`;
  if (format === "percent") return `${v}%`;
  return String(v);
}

function tip(format: ChartValueFormat, v: number): string {
  if (format === "currency") return `₹${Number(v).toLocaleString("en-IN")}`;
  if (format === "percent") return `${Number(v).toFixed(1)}%`;
  return Number(v).toFixed(1);
}

export default function AiSavingsPathChart({
  points,
  valueFormat = "currency",
  xLabel = "Month",
}: {
  points: { month: number; balance: number }[];
  valueFormat?: ChartValueFormat;
  xLabel?: string;
}) {
  const ready = useChartReady();
  if (!ready) return <div className="h-[220px] w-full min-h-[220px]" />;
  return (
    <div className="h-[220px] w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="savingsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => yTick(valueFormat, Number(v))} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [tip(valueFormat, Number(v)), valueFormat === "currency" ? "Balance" : "Score"]}
            labelFormatter={(m) => `${xLabel} ${m}`}
          />
          <Area type="monotone" dataKey="balance" stroke="#22c55e" fill="url(#savingsFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
