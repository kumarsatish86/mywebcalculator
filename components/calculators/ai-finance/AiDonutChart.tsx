"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import { useChartReady } from "@/components/calculator-content/charts/useChartReady";

export default function AiDonutChart({ slices }: { slices: ChartSlice[] }) {
  const ready = useChartReady();
  if (!ready) return <div className="h-[220px] w-full min-h-[220px]" />;
  return (
    <div className="h-[220px] w-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={slices} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
            {slices.map((s) => (
              <Cell key={s.name} fill={s.fill} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
