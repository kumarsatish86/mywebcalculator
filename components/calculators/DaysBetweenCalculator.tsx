"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { daysBetweenDates } from "@/lib/calculators/daysBetween";

function parseLocalDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function DaysBetweenCalculator() {
  const [a, setA] = useState(() => new Date().toISOString().slice(0, 10));
  const [b, setB] = useState("2030-01-01");

  const result = useMemo(() => {
    const da = parseLocalDate(a);
    const db = parseLocalDate(b);
    if (!da || !db) return { error: "Pick two valid dates." } as const;
    return daysBetweenDates(da, db);
  }, [a, b]);

  return (
    <CalculatorShell
      title="Days between dates"
      description="Uses calendar dates in your local timezone (noon anchor to avoid DST edge quirks)."
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-3 text-sm">
            <p className="font-mono text-4xl font-semibold text-[var(--accent-bright)]">
              {result.days}
              <span className="ml-2 text-lg font-normal text-[var(--muted)]">days</span>
            </p>
            <div className="grid gap-2 border-t border-[var(--border)] pt-4">
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Weeks</span>
                <span className="font-mono">{result.weeks.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[var(--muted)]">Months (≈)</span>
                <span className="font-mono">{result.monthsApprox.toFixed(1)}</span>
              </div>
            </div>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="d1">Start date</FieldLabel>
          <FieldInput
            id="d1"
            type="date"
            value={a}
            onChange={(e) => setA(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="d2">End date</FieldLabel>
          <FieldInput
            id="d2"
            type="date"
            value={b}
            onChange={(e) => setB(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
