"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { gradeNeededForTarget } from "@/lib/calculators/gradeNeeded";

export function GradeNeededCalculator() {
  const [currentGpa, setCurrentGpa] = useState("3.2");
  const [earned, setEarned] = useState("60");
  const [target, setTarget] = useState("3.5");
  const [newCredits, setNewCredits] = useState("15");

  const result = useMemo(() => {
    return gradeNeededForTarget({
      currentGpa: Number(currentGpa),
      earnedCredits: Number(earned),
      targetGpa: Number(target),
      newCredits: Number(newCredits),
    });
  }, [currentGpa, earned, target, newCredits]);

  return (
    <CalculatorShell
      title="Grade needed for target GPA"
      description="Uses your current cumulative GPA, credits already earned, target GPA, and credits you still plan to take."
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-4xl font-semibold tracking-tight text-[var(--accent-bright)]">
              {result.needed > 4
                ? "—"
                : result.needed < 0
                  ? "0.00"
                  : result.needed.toFixed(2)}
            </p>
            {result.needed > 4 ? (
              <p className="text-sm text-amber-800">
                That target may not be reachable on the remaining credits (needed GPA &gt; 4.0).
              </p>
            ) : null}
            {result.needed < 0 ? (
              <p className="text-sm text-[var(--muted)]">
                You could still reach the target even with lower grades on upcoming credits.
              </p>
            ) : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="cgpa">Current GPA (0–4)</FieldLabel>
          <FieldInput
            id="cgpa"
            inputMode="decimal"
            value={currentGpa}
            onChange={(e) => setCurrentGpa(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="earned">Credits earned</FieldLabel>
          <FieldInput
            id="earned"
            inputMode="decimal"
            value={earned}
            onChange={(e) => setEarned(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="tgpa">Target GPA</FieldLabel>
          <FieldInput
            id="tgpa"
            inputMode="decimal"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="mt-2"
          />
        </div>
        <div>
          <FieldLabel htmlFor="newc">Upcoming credits</FieldLabel>
          <FieldInput
            id="newc"
            inputMode="decimal"
            value={newCredits}
            onChange={(e) => setNewCredits(e.target.value)}
            className="mt-2"
          />
        </div>
      </div>
    </CalculatorShell>
  );
}
