"use client";

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

type Row = { i: number; v: number };

export default function SparkTrendDemoChart({ values }: { values: number[] }) {
  const ready = useChartReady();
  const data: Row[] = values.map((v, i) => ({ i, v }));
  if (!ready) return <div className="h-[220px] w-full min-h-[220px] min-w-0" />;
  return (
    <div className="h-[220px] w-full min-h-[220px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="i" tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 1]} tick={{ fill: "var(--muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [Number(v).toFixed(3), "Demo series"]}
            labelFormatter={(i) => `Step ${i}`}
          />
          <Line type="monotone" dataKey="v" stroke="#0d9488" strokeWidth={2} dot={{ r: 2, fill: "#6548f5" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
