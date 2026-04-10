"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { examScoreNeeded } from "@/lib/calculators/examGrade";

export function ExamGradeCalculator() {
  const [current, setCurrent] = useState("82");
  const [weight, setWeight] = useState("30");
  const [desired, setDesired] = useState("85");

  const result = useMemo(() => {
    return examScoreNeeded({
      currentAvgPercent: Number(current),
      examWeightPercent: Number(weight),
      desiredPercent: Number(desired),
    });
  }, [current, weight, desired]);

  return (
    <CalculatorShell
      title="Exam score needed"
      description="Current average and desired final are percentages (0–100). Exam weight is how much of the grade the exam counts for (e.g. 30%)."
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-4xl font-semibold tracking-tight text-[var(--accent-bright)]">
              {Number.isFinite(result.neededPercent)
                ? `${result.neededPercent.toFixed(1)}%`
                : "—"}
            </p>
            {result.neededPercent > 100 ? (
              <p className="text-sm text-amber-800">
                You would need over 100% on the exam — consider adjusting the goal or weight.
              </p>
            ) : null}
            {result.neededPercent < 0 ? (
              <p className="text-sm text-[var(--muted)]">
                Even a 0% on the exam could still land at or above your target (check inputs).
              </p>
            ) : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <FieldLabel htmlFor="curr">Current average %</FieldLabel>
          <FieldInput
            id="curr"
            inputMode="decimal"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="w">Exam weight %</FieldLabel>
          <FieldInput
            id="w"
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="want">Desired final %</FieldLabel>
          <FieldInput
            id="want"
            inputMode="decimal"
            value={desired}
            onChange={(e) => setDesired(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
