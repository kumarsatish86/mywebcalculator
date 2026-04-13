"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useChartReady } from "./useChartReady";

/** Demo: credit-weighted grade points per course (grade points × credits). */
const data = [
  { course: "Writing", weighted: 14.8 },
  { course: "Calculus", weighted: 9.0 },
  { course: "History", weighted: 9.0 },
  { course: "Chem lab", weighted: 6.8 },
];

export default function WeightedGpaDemoChart() {
  const ready = useChartReady();
  if (!ready) return <div className="h-[300px] w-full min-h-[300px] min-w-0" />;
  return (
    <div className="h-[300px] w-full min-h-[300px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="course" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              color: "var(--text)",
            }}
            formatter={(v) => [`${Number(v).toFixed(1)} pts`, "Weighted points"]}
          />
          <Bar dataKey="weighted" fill="#6548f5" radius={[8, 8, 0, 0]} name="Grade pts × credits" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
