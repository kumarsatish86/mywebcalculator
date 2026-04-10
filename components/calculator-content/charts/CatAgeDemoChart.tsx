"use client";

import { humanToCatYears } from "@/lib/calculators/catAge";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16].map((human) => ({
  human,
  cat: Math.round(humanToCatYears(human) * 10) / 10,
}));

export default function CatAgeDemoChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid stroke="rgba(15,23,42,0.08)" vertical={false} />
          <XAxis dataKey="human" tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Human years", position: "insideBottom", offset: -4, fill: "var(--muted)", fontSize: 11 }} />
          <YAxis tick={{ fill: "var(--muted)", fontSize: 12 }} axisLine={false} tickLine={false} label={{ value: "Cat years (rule of thumb)", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "var(--surface-strong)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(v) => [String(v ?? ""), "Cat years (estimate)"]}
            labelFormatter={(h) => `${h} human years`}
          />
          <Line type="stepAfter" dataKey="cat" stroke="#db2777" strokeWidth={2} dot={{ r: 3, fill: "#6548f5" }} name="cat" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
