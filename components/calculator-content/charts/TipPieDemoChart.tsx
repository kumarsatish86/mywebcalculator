"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useChartReady } from "./useChartReady";

const bill = 86.4;
const tipPct = 18;
const tip = bill * (tipPct / 100);
const data = [
  { name: "Bill", value: bill },
  { name: `Tip (${tipPct}%)`, value: tip },
];

const COLORS = ["#94a3b8", "#6548f5"];

export default function TipPieDemoChart() {
  const ready = useChartReady();
  if (!ready) return <div className="h-[280px] w-full min-h-[280px] min-w-0" />;
  return (
    <div className="h-[280px] w-full min-h-[280px] min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={68} outerRadius={100} paddingAngle={2}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [`$${Number(v).toFixed(2)}`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-[var(--muted)]">
        Demo split: ${bill.toFixed(2)} check + {tipPct}% tip
      </p>
    </div>
  );
}
