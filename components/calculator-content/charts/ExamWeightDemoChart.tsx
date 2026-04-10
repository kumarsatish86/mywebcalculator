"use client";

import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

/** One row: stacked bar showing 70% prior work vs 30% final exam weight. */
const data = [{ name: "Course grade", before: 70, final: 30 }];

export default function ExamWeightDemoChart() {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fill: "var(--muted)", fontSize: 12 }} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [`${Number(v)}%`, ""]}
          />
          <Legend />
          <Bar dataKey="before" stackId="a" fill="#94a3b8" name="Course work (example)" radius={[0, 0, 0, 0]} />
          <Bar dataKey="final" stackId="a" fill="#6548f5" name="Final exam (example)" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
