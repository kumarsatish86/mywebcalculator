"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_TARGET_SCORE_URL,
  requiredMarksFinalExam,
  requiredOnRemaining,
  requiredScoreGap,
} from "@/lib/calculators/examTargetScore";

type TargetSlug =
  | "required-marks-to-pass-calculator-exam"
  | "required-marks-target-percentage-calculator"
  | "required-marks-final-exam-calculator"
  | "required-marks-distinction-calculator"
  | "required-score-rank-improvement-calculator"
  | "required-score-scholarship-eligibility-calculator"
  | "required-marks-clear-cutoff-calculator";

type Mode = "remaining" | "finalExam" | "gap";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  targetLabel: string;
};

const CONFIG: Record<TargetSlug, Config> = {
  "required-marks-to-pass-calculator-exam": {
    title: "Required marks to pass",
    description: "Marks still needed on remaining papers to hit overall pass percentage.",
    mode: "remaining",
    aDefault: "120",
    bDefault: "200",
    cDefault: "100",
    rDefault: "40",
    tDefault: "0",
    targetLabel: "Target / pass %",
  },
  "required-marks-target-percentage-calculator": {
    title: "Required marks for target %",
    description: "Back-solve remaining marks needed to reach a target overall percentage.",
    mode: "remaining",
    aDefault: "150",
    bDefault: "200",
    cDefault: "100",
    rDefault: "75",
    tDefault: "0",
    targetLabel: "Target %",
  },
  "required-marks-final-exam-calculator": {
    title: "Required marks on final exam",
    description: "Given coursework %, weights, and target overall %, find marks needed on the final.",
    mode: "finalExam",
    aDefault: "72",
    bDefault: "40",
    cDefault: "60",
    rDefault: "70",
    tDefault: "100",
    targetLabel: "Target overall %",
  },
  "required-marks-distinction-calculator": {
    title: "Required marks for distinction",
    description: "Remaining marks needed to reach a distinction-level overall percentage (default 75%).",
    mode: "remaining",
    aDefault: "160",
    bDefault: "200",
    cDefault: "100",
    rDefault: "75",
    tDefault: "0",
    targetLabel: "Distinction %",
  },
  "required-score-rank-improvement-calculator": {
    title: "Required score for rank improvement",
    description: "Gap between your current score and a target score for a better rank band.",
    mode: "gap",
    aDefault: "520",
    bDefault: "600",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    targetLabel: "Target score",
  },
  "required-score-scholarship-eligibility-calculator": {
    title: "Required score for scholarship",
    description: "Points still needed to reach a scholarship eligibility threshold.",
    mode: "gap",
    aDefault: "78",
    bDefault: "85",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    targetLabel: "Threshold score",
  },
  "required-marks-clear-cutoff-calculator": {
    title: "Required marks to clear cut-off",
    description: "Marks still needed on remaining papers to clear a cut-off overall percentage.",
    mode: "remaining",
    aDefault: "140",
    bDefault: "200",
    cDefault: "100",
    rDefault: "50",
    tDefault: "0",
    targetLabel: "Cut-off %",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function ExamTargetScoreCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as TargetSlug] ?? CONFIG["required-marks-to-pass-calculator-exam"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_TARGET_SCORE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_TARGET_SCORE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_TARGET_SCORE_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_TARGET_SCORE_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_TARGET_SCORE_URL.T, config.tDefault));

  const num = (n: number, d = 1) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_TARGET_SCORE_URL.A]: a,
      [EXAM_TARGET_SCORE_URL.B]: b,
      [EXAM_TARGET_SCORE_URL.C]: c,
      [EXAM_TARGET_SCORE_URL.R]: r,
    };
    if (config.mode === "finalExam") {
      return { ...base, [EXAM_TARGET_SCORE_URL.T]: t };
    }
    return base;
  }, [a, b, c, r, t, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "remaining": {
        const soFarP = parseNonNegative(a, "Marks so far");
        const maxSoFarP = parseNonNegative(b, "Max so far");
        const remainP = parseNonNegative(c, "Remaining max");
        const targetP = parseAprPercent(r, config.targetLabel);
        if (!soFarP.ok) return { error: soFarP.error };
        if (!maxSoFarP.ok) return { error: maxSoFarP.error };
        if (!remainP.ok) return { error: remainP.error };
        if (!targetP.ok) return { error: targetP.error };
        const computed = requiredOnRemaining({
          marksSoFar: soFarP.value,
          maxSoFar: maxSoFarP.value,
          remainingMax: remainP.value,
          targetPercent: targetP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.alreadyMet ? "Already met" : num(computed.required, 1),
          primaryLabel: computed.alreadyMet ? "Status" : "Required on remaining",
          rows: [
            { label: "Overall target", value: num(computed.overallTarget, 1) },
            { label: "Already met", value: computed.alreadyMet ? "Yes" : "No" },
          ],
        };
      }
      case "finalExam": {
        const cwPctP = parseAprPercent(a, "Coursework %");
        const cwWP = parseNonNegative(b, "Coursework weight %");
        const fwP = parseNonNegative(c, "Final weight %");
        const targetP = parseAprPercent(r, "Target overall %");
        const finalMaxP = parsePositive(t, "Final max marks");
        if (!cwPctP.ok) return { error: cwPctP.error };
        if (!cwWP.ok) return { error: cwWP.error };
        if (!fwP.ok) return { error: fwP.error };
        if (!targetP.ok) return { error: targetP.error };
        if (!finalMaxP.ok) return { error: finalMaxP.error };
        const computed = requiredMarksFinalExam({
          courseworkPercent: cwPctP.value,
          courseworkWeightPercent: cwWP.value,
          finalWeightPercent: fwP.value,
          targetOverallPercent: targetP.value,
          finalMaxMarks: finalMaxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.requiredFinalMarks, 1),
          primaryLabel: "Required final marks",
          rows: [{ label: "Required final %", value: pct(computed.requiredFinalPercent) }],
        };
      }
      case "gap": {
        const currP = parseNonNegative(a, "Current score");
        const tgtP = parseNonNegative(b, config.targetLabel);
        if (!currP.ok) return { error: currP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        const computed = requiredScoreGap({
          currentScore: currP.value,
          targetScore: tgtP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.alreadyMet ? "Already met" : num(computed.gap, 1),
          primaryLabel: computed.alreadyMet ? "Status" : "Score gap",
          rows: [
            { label: "Current", value: num(currP.value, 1) },
            { label: "Target", value: num(tgtP.value, 1) },
            { label: "Already met", value: computed.alreadyMet ? "Yes" : "No" },
          ],
        };
      }
    }
  }, [config.mode, config.targetLabel, a, b, c, r, t]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "remaining" ? (
            <>
              <div>
                <FieldLabel htmlFor="ets-so-far">Marks so far</FieldLabel>
                <FieldInput
                  id="ets-so-far"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-max-so-far">Max so far</FieldLabel>
                <FieldInput
                  id="ets-max-so-far"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-remain-max">Remaining max</FieldLabel>
                <FieldInput
                  id="ets-remain-max"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-target">{config.targetLabel}</FieldLabel>
                <FieldInput
                  id="ets-target"
                  value={r}
                  onChange={(ev) => setR(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "finalExam" ? (
            <>
              <div>
                <FieldLabel htmlFor="ets-cw">Coursework %</FieldLabel>
                <FieldInput
                  id="ets-cw"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-cw-w">Coursework weight %</FieldLabel>
                <FieldInput
                  id="ets-cw-w"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-fw">Final weight %</FieldLabel>
                <FieldInput
                  id="ets-fw"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-target-ov">Target overall %</FieldLabel>
                <FieldInput
                  id="ets-target-ov"
                  value={r}
                  onChange={(ev) => setR(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-final-max">Final max marks</FieldLabel>
                <FieldInput
                  id="ets-final-max"
                  value={t}
                  onChange={(ev) => setT(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "gap" ? (
            <>
              <div>
                <FieldLabel htmlFor="ets-current">Current score</FieldLabel>
                <FieldInput
                  id="ets-current"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ets-gap-target">{config.targetLabel}</FieldLabel>
                <FieldInput
                  id="ets-gap-target"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          {"error" in result ? (
            <p className="text-sm text-red-600">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[var(--muted)]">{result.primaryLabel}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{result.primary}</p>
              </div>
              <div className="space-y-2 text-sm">
                {result.rows.map((row) => (
                  <Row key={row.label} label={row.label} value={row.value} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
