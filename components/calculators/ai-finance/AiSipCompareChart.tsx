"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartReady } from "@/components/calculator-content/charts/useChartReady";

export default function AiSipCompareChart({
  points,
}: {
  points: { month: number; flat: number; stepUp: number }[];
}) {
  const ready = useChartReady();
  if (!ready) return <div className="h-[240px] w-full min-h-[240px]" />;
  return (
    <div className="h-[240px] w-full min-h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${Number(v) / 100000}L`} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v, name) => [`₹${Number(v).toLocaleString("en-IN")}`, name === "flat" ? "Flat SIP" : "Step-up SIP"]}
            labelFormatter={(m) => `Month ${m}`}
          />
          <Legend />
          <Line type="monotone" dataKey="flat" stroke="#94a3b8" strokeWidth={2} dot={false} name="Flat SIP" />
          <Line type="monotone" dataKey="stepUp" stroke="#22c55e" strokeWidth={2} dot={false} name="Step-up SIP" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
