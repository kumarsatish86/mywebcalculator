"use client";

import type { HrResult } from "@/lib/calculators/hrHelpers";

export function HrResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function formatHrResult(res: HrResult, num: (n: number, d?: number) => string) {
  if (!res.ok) return { error: res.error };
  const rows: { label: string; value: string }[] = [];
  if (res.amount !== undefined) rows.push({ label: "Amount", value: num(res.amount, 2) });
  if (res.amount2 !== undefined) rows.push({ label: "Amount 2", value: num(res.amount2, 2) });
  if (res.amount3 !== undefined) rows.push({ label: "Amount 3", value: num(res.amount3, 2) });
  if (res.pct !== undefined) rows.push({ label: "%", value: num(res.pct, 2) });
  if (res.rate !== undefined) rows.push({ label: "Rate", value: num(res.rate, 4) });
  if (res.hours !== undefined) rows.push({ label: "Hours", value: num(res.hours, 2) });
  if (res.days !== undefined) rows.push({ label: "Days", value: num(res.days, 2) });
  if (res.count !== undefined) rows.push({ label: "Count", value: num(res.count, 2) });
  if (res.score !== undefined) rows.push({ label: "Score", value: num(res.score, 2) });
  rows.push({ label: "Note", value: res.note });
  const primary =
    res.pct !== undefined && res.amount === undefined ? `${num(res.pct, 2)}%`
    : res.score !== undefined && res.amount === undefined ? num(res.score, 2)
    : res.amount !== undefined ? num(res.amount, 2)
    : res.hours !== undefined ? num(res.hours, 2)
    : res.days !== undefined ? num(res.days, 2)
    : res.count !== undefined ? num(res.count, 2)
    : "—";
  return { primary, primaryLabel: "Result", rows };
}

export const HR_DISCLAIMER =
  "HR planning estimate only — policies and statutes vary. Not legal or tax advice; verify with HR/payroll counsel.";
