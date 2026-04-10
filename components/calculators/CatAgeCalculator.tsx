"use client";

import { useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { FieldInput, FieldLabel } from "@/components/fields";
import { humanToCatYears } from "@/lib/calculators/catAge";

export function CatAgeCalculator() {
  const [human, setHuman] = useState("5");

  const cat = useMemo(() => {
    const y = Number(human);
    if (Number.isNaN(y) || y < 0) return { error: "Enter a non-negative number." } as const;
    return { years: humanToCatYears(y) };
  }, [human]);

  return (
    <CalculatorShell
      title="Cat years"
      description="A playful rule-of-thumb conversion — not a substitute for veterinary guidance."
      result={
        "error" in cat ? (
          <p className="text-sm font-medium text-rose-700">{cat.error}</p>
        ) : (
          <div className="space-y-2">
            <p className="font-mono text-4xl font-semibold text-[var(--accent-bright)]">
              {cat.years.toFixed(1)}
            </p>
            <p className="text-sm text-[var(--muted)]">equivalent &quot;cat years&quot;</p>
          </div>
        )
      }
    >
      <div>
        <FieldLabel htmlFor="hy">Human years</FieldLabel>
        <FieldInput
          id="hy"
          inputMode="decimal"
          value={human}
          onChange={(e) => setHuman(e.target.value)}
          className="mt-2"
        />
      </div>
    </CalculatorShell>
  );
}
