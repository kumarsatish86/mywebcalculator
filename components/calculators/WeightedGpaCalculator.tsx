"use client";

import { useMemo, useRef, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput } from "@/components/fields";
import { computeWeightedGpa } from "@/lib/calculators/weightedGpa";
import { parseGradeInput } from "@/lib/calculators/letterGrade";

type Row = { id: string; credits: string; grade: string };

export function WeightedGpaCalculator() {
  const nextId = useRef(4);
  const [rows, setRows] = useState<Row[]>([
    { id: "1", credits: "", grade: "" },
    { id: "2", credits: "", grade: "" },
    { id: "3", credits: "", grade: "" },
  ]);
  const emptyRow = (): Row => {
    const id = String(nextId.current);
    nextId.current += 1;
    return { id, credits: "", grade: "" };
  };

  const result = useMemo(() => {
    const parsed: { credits: number; gradePoints: number }[] = [];
    for (const r of rows) {
      const c = Number(r.credits);
      if (!r.credits.trim() && !r.grade.trim()) continue;
      if (Number.isNaN(c) || c <= 0) {
        return { error: "Each row needs valid credit hours (or leave both empty)." } as const;
      }
      const g = parseGradeInput(r.grade);
      if ("error" in g) return { error: g.error } as const;
      parsed.push({ credits: c, gradePoints: g.points });
    }
    return computeWeightedGpa(parsed);
  }, [rows]);

  const resultKey = "error" in result ? result.error : result.gpa.toFixed(3);

  return (
    <CalculatorShell
      compact
      title="Weighted GPA"
      description="Enter credits and a letter grade (A, B+, …) or numeric points (0–4) per course. Leave a row blank to skip it."
      resultKey={resultKey}
      result={
        "error" in result ? (
          <p className="text-sm font-medium leading-snug text-rose-700">{result.error}</p>
        ) : (
          <p className="font-mono text-3xl font-semibold tracking-tight text-[var(--accent-bright)] sm:text-4xl">
            {result.gpa.toFixed(2)}
          </p>
        )
      }
    >
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--input-bg)]/25">
        <div
          className="grid grid-cols-[1.75rem_minmax(0,5.5rem)_1fr] gap-x-2 gap-y-0 border-b border-[var(--border)] bg-[var(--surface-strong)]/60 px-2 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--muted)] sm:grid-cols-[2rem_minmax(0,6.5rem)_1fr] sm:px-3 sm:text-xs"
          aria-hidden
        >
          <span className="text-center">#</span>
          <span>Credits</span>
          <span>Grade</span>
        </div>
        <ul className="divide-y divide-[var(--border)]">
          {rows.map((row, i) => (
            <li
              key={row.id}
              className="transition-colors hover:bg-[var(--surface)]/35 focus-within:bg-[var(--surface)]/45"
            >
              <div className="grid grid-cols-[1.75rem_minmax(0,5.5rem)_1fr] items-center gap-x-2 px-2 py-1.5 sm:grid-cols-[2rem_minmax(0,6.5rem)_1fr] sm:px-3 sm:py-2">
                <span className="text-center text-xs font-medium tabular-nums text-[var(--muted)]">
                  {i + 1}
                </span>
                <FieldInput
                  compact
                  aria-label={`Credits for course ${i + 1}`}
                  inputMode="decimal"
                  placeholder="3"
                  value={row.credits}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, credits: e.target.value } : r)),
                    )
                  }
                  className="rounded-lg"
                />
                <FieldInput
                  compact
                  aria-label={`Grade for course ${i + 1}`}
                  placeholder="A-, 3.5"
                  value={row.grade}
                  onChange={(e) =>
                    setRows((prev) =>
                      prev.map((r) => (r.id === row.id ? { ...r, grade: e.target.value } : r)),
                    )
                  }
                  className="rounded-lg"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          onClick={() => setRows((r) => [...r, emptyRow()])}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-strong)] px-3 py-1.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-sm"
        >
          Add course
        </button>
        {rows.length > 1 ? (
          <button
            type="button"
            onClick={() => setRows((r) => r.slice(0, -1))}
            className="rounded-lg border border-transparent px-3 py-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] sm:text-sm"
          >
            Remove last row
          </button>
        ) : null}
      </div>
    </CalculatorShell>
  );
}
