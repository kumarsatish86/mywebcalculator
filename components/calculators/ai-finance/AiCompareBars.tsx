"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useChartReady } from "@/components/calculator-content/charts/useChartReady";
import type { ChartValueFormat } from "./AiFinanceUi";

function yTick(format: ChartValueFormat, v: number): string {
  if (format === "currency") return `₹${Number(v) / 1000}k`;
  if (format === "percent") return `${v}%`;
  if (format === "score") return String(Math.round(v));
  return String(Math.round(v));
}

function tip(format: ChartValueFormat, v: number): string {
  if (format === "currency") return `₹${Number(v).toLocaleString("en-IN")}`;
  if (format === "percent") return `${Number(v).toFixed(1)}%`;
  if (format === "score") return String(Math.round(v));
  return Number(v).toFixed(1);
}

export default function AiCompareBars({
  rows,
  valueFormat = "currency",
}: {
  rows: { label: string; target: number; actual: number }[];
  valueFormat?: ChartValueFormat;
}) {
  const ready = useChartReady();
  const data = rows.map((r) => ({ name: r.label, target: Math.round(r.target * 10) / 10, actual: Math.round(r.actual * 10) / 10 }));
  if (!ready) return <div className="h-[200px] w-full min-h-[200px]" />;
  return (
    <div className="h-[200px] w-full min-h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => yTick(valueFormat, Number(v))} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v, name) => [tip(valueFormat, Number(v)), name === "target" ? "Target" : "Actual"]}
          />
          <Bar dataKey="target" fill="#94a3b8" name="target" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#6548f5" name="actual" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
