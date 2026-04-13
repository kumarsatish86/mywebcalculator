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

/** Illustrative: hypothetical cumulative GPA path toward a target over terms. */
const data = [
  { term: "Now", gpa: 3.1 },
  { term: "+1", gpa: 3.25 },
  { term: "+2", gpa: 3.38 },
  { term: "+3", gpa: 3.48 },
  { term: "+4", gpa: 3.55 },
];

export default function GradeNeededDemoChart() {
  const ready = useChartReady();
  if (!ready) return <div className="h-[280px] w-full min-h-[280px] min-w-0" />;
  return (
    <div className="h-[280px] w-full min-h-[280px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="term" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[2.8, 4]} tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [Number(v).toFixed(2), "Illustrative GPA"]}
          />
          <Line type="monotone" dataKey="gpa" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: "#6548f5" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
