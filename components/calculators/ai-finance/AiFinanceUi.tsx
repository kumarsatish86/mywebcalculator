"use client";

import dynamic from "next/dynamic";
import type { AiInsight, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";

const AiDonutChart = dynamic(() => import("./AiDonutChart"), { ssr: false });
const AiSavingsPathChart = dynamic(() => import("./AiSavingsPathChart"), { ssr: false });
const AiCompareBars = dynamic(() => import("./AiCompareBars"), { ssr: false });
const AiSipCompareChart = dynamic(() => import("./AiSipCompareChart"), { ssr: false });

export type ChartValueFormat = "currency" | "percent" | "score" | "count";

function formatChartValue(v: number, format: ChartValueFormat): string {
  if (format === "currency") return `₹${Number(v).toLocaleString("en-IN")}`;
  if (format === "percent") return `${Number(v).toFixed(1)}%`;
  if (format === "score") return Number(v).toFixed(1);
  return String(Math.round(v));
}

export function formatScoreDisplay(score: number): string {
  if (!Number.isFinite(score)) return "—";
  if (score >= 0 && score <= 100) return String(Math.round(score));
  return score.toFixed(1);
}

export function HealthScoreBadge({ score, grade, scoreLabel = "Financial health" }: { score: number; grade: string; scoreLabel?: string }) {
  const color =
    score >= 85 ? "text-emerald-600" : score >= 70 ? "text-teal-600" : score >= 55 ? "text-amber-600" : "text-rose-600";
  const ring =
    score >= 85 ? "border-emerald-500/40" : score >= 70 ? "border-teal-500/40" : score >= 55 ? "border-amber-500/40" : "border-rose-500/40";
  return (
    <div className={`flex min-w-0 items-center gap-3 rounded-xl border ${ring} bg-[var(--input-bg)]/60 p-3`}>
      <div className={`shrink-0 font-mono text-3xl font-bold tabular-nums leading-none sm:text-4xl ${color}`}>
        {formatScoreDisplay(score)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{scoreLabel}</p>
        <p className={`truncate text-sm font-semibold ${color}`}>{grade}</p>
      </div>
    </div>
  );
}

const priorityStyles: Record<AiInsight["priority"], string> = {
  high: "border-rose-500/30 bg-rose-500/5",
  medium: "border-amber-500/30 bg-amber-500/5",
  low: "border-emerald-500/25 bg-emerald-500/5",
};

export function InsightPanel({ insights, title = "Smart insights" }: { insights: AiInsight[]; title?: string }) {
  if (!insights.length) return null;
  return (
    <div className="mt-4 space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent)]">{title}</p>
      <ul className="space-y-2">
        {insights.map((ins, i) => (
          <li key={`${ins.title}-${i}`} className={`rounded-lg border px-3 py-2 text-sm ${priorityStyles[ins.priority]}`}>
            <p className="font-medium text-[var(--text)]">{ins.title}</p>
            <p className="mt-0.5 text-[var(--muted)]">{ins.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChartBlock({
  slices,
  compare,
  projection,
  sipCompare,
  compareTitle,
  projectionTitle = "Wealth projection",
  valueFormat = "currency",
  compareFormat,
}: {
  slices?: ChartSlice[];
  compare?: { label: string; target: number; actual: number }[];
  projection?: { month: number; balance: number }[];
  sipCompare?: { month: number; flat: number; stepUp: number }[];
  compareTitle?: string;
  projectionTitle?: string;
  valueFormat?: ChartValueFormat;
  compareFormat?: ChartValueFormat;
}) {
  const cmpFmt = compareFormat ?? valueFormat;
  return (
    <div className="mt-6 space-y-6 border-t border-[var(--border)] pt-6">
      {slices && slices.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Breakdown</p>
          <AiDonutChart slices={slices} />
        </div>
      ) : null}
      {compare && compare.length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            {compareTitle ?? "Target vs actual"}
          </p>
          <AiCompareBars rows={compare} valueFormat={cmpFmt} />
        </div>
      ) : null}
      {sipCompare && sipCompare.length > 1 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Flat vs step-up wealth path</p>
          <AiSipCompareChart points={sipCompare} />
        </div>
      ) : null}
      {projection && projection.length > 1 ? (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">{projectionTitle}</p>
          <AiSavingsPathChart points={projection} valueFormat={valueFormat} xLabel={valueFormat === "currency" ? "Month" : "Week"} />
        </div>
      ) : null}
    </div>
  );
}

export function RebalanceTable({
  rows,
}: {
  rows: { asset: string; deltaPercent: number; deltaAmount: number; action: string }[];
}) {
  const actionColor = (a: string) =>
    a === "Buy" ? "text-emerald-600" : a === "Trim" ? "text-rose-600" : "text-[var(--muted)]";
  return (
    <div className="mt-4 overflow-x-auto">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Rebalance actions</p>
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--muted)]">
            <th className="pb-2 pr-2 font-medium">Asset</th>
            <th className="pb-2 pr-2 font-medium text-right">Shift %</th>
            <th className="pb-2 pr-2 font-medium text-right">Amount</th>
            <th className="pb-2 font-medium text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.asset} className="border-b border-[var(--border)]/60">
              <td className="py-2 pr-2 text-[var(--text)]">{r.asset}</td>
              <td className="py-2 pr-2 text-right font-mono">
                {r.deltaPercent > 0 ? "+" : ""}
                {r.deltaPercent.toFixed(1)}%
              </td>
              <td className="py-2 pr-2 text-right font-mono">
                {r.deltaAmount >= 0 ? "+" : "−"}₹{Math.abs(r.deltaAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </td>
              <td className={`py-2 text-right font-medium ${actionColor(r.action)}`}>{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BucketTable({
  rows,
}: {
  rows: { label: string; actual: number; target: number; status: string; share?: number }[];
}) {
  const statusColor = (s: string) =>
    s === "over" ? "text-rose-600" : s === "warning" ? "text-amber-600" : "text-emerald-600";
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[var(--border)] text-[var(--muted)]">
            <th className="pb-2 pr-2 font-medium">Category</th>
            <th className="pb-2 pr-2 font-medium text-right">Actual</th>
            <th className="pb-2 pr-2 font-medium text-right">Guideline</th>
            <th className="pb-2 font-medium text-right">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-[var(--border)]/60">
              <td className="py-2 pr-2 text-[var(--text)]">{r.label}</td>
              <td className="py-2 pr-2 text-right font-mono">₹{r.actual.toLocaleString("en-IN")}</td>
              <td className="py-2 pr-2 text-right font-mono text-[var(--muted)]">₹{Math.round(r.target).toLocaleString("en-IN")}</td>
              <td className={`py-2 text-right font-medium capitalize ${statusColor(r.status)}`}>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScenarioCards({
  scenarios,
  valueFormat = "currency",
}: {
  scenarios: { label: string; months: number; monthly: number }[];
  valueFormat?: ChartValueFormat;
}) {
  const fmt = (v: number) => {
    if (valueFormat === "percent") return `${v.toFixed(1)}%`;
    if (valueFormat === "score") return v.toFixed(1);
    if (valueFormat === "count") return String(Math.round(v));
    return `₹${v.toLocaleString("en-IN", { maximumFractionDigits: 0 })}/mo`;
  };
  const period = valueFormat === "currency" ? "months" : "weeks";
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-3">
      {scenarios.map((s) => (
        <div key={s.label} className="rounded-lg border border-[var(--border)] bg-[var(--input-bg)]/40 p-3 text-xs">
          <p className="font-medium text-[var(--text)]">{s.label}</p>
          <p className="mt-1 font-mono text-[var(--accent-bright)]">{fmt(s.monthly)}</p>
          <p className="text-[var(--muted)]">{s.months} {period}</p>
        </div>
      ))}
    </div>
  );
}
