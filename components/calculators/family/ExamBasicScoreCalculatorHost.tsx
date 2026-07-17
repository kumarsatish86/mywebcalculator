"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_BASIC_SCORE_URL,
  bestOfNSubjects,
  gradeFromPercentage,
  marksPercentage,
  passFail,
  requiredMarksToPass,
  scoreAverage,
  scoreImprovement,
  subjectWisePercentage,
  totalMarks,
  weightedPercentage,
} from "@/lib/calculators/examBasicScore";

type BasicSlug =
  | "marks-percentage-calculator"
  | "total-marks-calculator"
  | "subject-wise-percentage-calculator"
  | "weighted-percentage-calculator"
  | "grade-percentage-calculator"
  | "score-average-calculator"
  | "best-of-n-subjects-calculator"
  | "pass-fail-calculator"
  | "score-improvement-calculator"
  | "required-marks-to-pass-calculator";

type Mode =
  | "marksPct"
  | "totalMarks"
  | "subjectPct"
  | "weightedPct"
  | "grade"
  | "average"
  | "bestOfN"
  | "passFail"
  | "improvement"
  | "requiredPass";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  wDefault: string;
  mDefault: string;
};

const CONFIG: Record<BasicSlug, Config> = {
  "marks-percentage-calculator": {
    title: "Marks percentage",
    description: "Convert obtained and total marks into a percentage and remaining marks.",
    mode: "marksPct",
    aDefault: "78",
    bDefault: "100",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    mDefault: "",
  },
  "total-marks-calculator": {
    title: "Total marks",
    description: "Sum comma-separated subject marks and show average.",
    mode: "totalMarks",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "72,85,68,90",
    mDefault: "",
  },
  "subject-wise-percentage-calculator": {
    title: "Subject-wise percentage",
    description: "Percentage per subject when each paper shares the same maximum marks.",
    mode: "subjectPct",
    aDefault: "100",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "72,85,68,90",
    mDefault: "",
  },
  "weighted-percentage-calculator": {
    title: "Weighted percentage",
    description: "Blend scores with matching weights (e.g. theory vs practical).",
    mode: "weightedPct",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "80,70,90",
    mDefault: "50,30,20",
  },
  "grade-percentage-calculator": {
    title: "Grade from percentage",
    description: "Map a percentage to a letter grade and performance band.",
    mode: "grade",
    aDefault: "82",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    mDefault: "",
  },
  "score-average-calculator": {
    title: "Score average",
    description: "Average, min, and max from comma-separated scores.",
    mode: "average",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "72,85,68,90,76",
    mDefault: "",
  },
  "best-of-n-subjects-calculator": {
    title: "Best of N subjects",
    description: "Keep the top N marks and total them (common board rule).",
    mode: "bestOfN",
    aDefault: "4",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "72,85,68,90,76,81",
    mDefault: "",
  },
  "pass-fail-calculator": {
    title: "Pass / fail",
    description: "Compare marks against a pass mark and show the margin.",
    mode: "passFail",
    aDefault: "42",
    bDefault: "40",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    mDefault: "",
  },
  "score-improvement-calculator": {
    title: "Score improvement",
    description: "Delta and percent change from a previous score to the current one.",
    mode: "improvement",
    aDefault: "520",
    bDefault: "578",
    cDefault: "0",
    rDefault: "0",
    wDefault: "",
    mDefault: "",
  },
  "required-marks-to-pass-calculator": {
    title: "Required marks to pass",
    description: "Marks still needed on remaining papers to hit overall pass %.",
    mode: "requiredPass",
    aDefault: "120",
    bDefault: "200",
    cDefault: "100",
    rDefault: "40",
    wDefault: "",
    mDefault: "",
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

export function ExamBasicScoreCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as BasicSlug] ?? CONFIG["marks-percentage-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.W, config.wDefault));
  const [m, setM] = useState(useLoanInitialInput(EXAM_BASIC_SCORE_URL.M, config.mDefault));

  const num = (n: number, d = 1) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_BASIC_SCORE_URL.A]: a,
      [EXAM_BASIC_SCORE_URL.B]: b,
      [EXAM_BASIC_SCORE_URL.C]: c,
      [EXAM_BASIC_SCORE_URL.R]: r,
    };
    if (
      config.mode === "totalMarks" ||
      config.mode === "subjectPct" ||
      config.mode === "average" ||
      config.mode === "bestOfN"
    ) {
      return { ...base, [EXAM_BASIC_SCORE_URL.W]: w };
    }
    if (config.mode === "weightedPct") {
      return { ...base, [EXAM_BASIC_SCORE_URL.W]: w, [EXAM_BASIC_SCORE_URL.M]: m };
    }
    return base;
  }, [a, b, c, r, w, m, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w, m]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "marksPct": {
        const obtP = parseNonNegative(a, "Obtained marks");
        const totP = parsePositive(b, "Total marks");
        if (!obtP.ok) return { error: obtP.error };
        if (!totP.ok) return { error: totP.error };
        const computed = marksPercentage({ obtained: obtP.value, total: totP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.percent),
          primaryLabel: "Percentage",
          rows: [
            { label: "Remaining marks", value: num(computed.remaining, 1) },
            { label: "Obtained / total", value: `${num(obtP.value, 1)} / ${num(totP.value, 1)}` },
          ],
        };
      }
      case "totalMarks": {
        if (!w.trim()) return { error: "Enter at least one mark (comma-separated)." };
        const computed = totalMarks({ marksCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.total, 1),
          primaryLabel: "Total marks",
          rows: [
            { label: "Subjects", value: String(computed.subjects) },
            { label: "Average", value: num(computed.average, 1) },
          ],
        };
      }
      case "subjectPct": {
        const maxP = parsePositive(a, "Max per subject");
        if (!maxP.ok) return { error: maxP.error };
        if (!w.trim()) return { error: "Enter at least one mark (comma-separated)." };
        const computed = subjectWisePercentage({ marksCsv: w, maxPerSubject: maxP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.averagePercent),
          primaryLabel: "Average %",
          rows: computed.subjects.map((s) => ({
            label: `Subject ${s.index}`,
            value: `${num(s.marks, 1)} → ${pct(s.percent)}`,
          })),
        };
      }
      case "weightedPct": {
        if (!w.trim()) return { error: "Enter scores (comma-separated)." };
        if (!m.trim()) return { error: "Enter weights (comma-separated)." };
        const computed = weightedPercentage({ scoresCsv: w, weightsCsv: m });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.weightedPercent),
          primaryLabel: "Weighted %",
          rows: [{ label: "Components", value: String(computed.components) }],
        };
      }
      case "grade": {
        const pctP = parseAprPercent(a, "Percentage");
        if (!pctP.ok) return { error: pctP.error };
        const computed = gradeFromPercentage({ percent: pctP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.grade,
          primaryLabel: "Grade",
          rows: [
            { label: "Band", value: computed.band },
            { label: "Percentage", value: pct(pctP.value) },
          ],
        };
      }
      case "average": {
        if (!w.trim()) return { error: "Enter at least one score (comma-separated)." };
        const computed = scoreAverage({ scoresCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.average, 1),
          primaryLabel: "Average",
          rows: [
            { label: "Count", value: String(computed.count) },
            { label: "Min", value: num(computed.min, 1) },
            { label: "Max", value: num(computed.max, 1) },
          ],
        };
      }
      case "bestOfN": {
        const nP = parsePositive(a, "Best of N");
        if (!nP.ok) return { error: nP.error };
        if (!w.trim()) return { error: "Enter at least one mark (comma-separated)." };
        const computed = bestOfNSubjects({ marksCsv: w, bestN: Math.round(nP.value) });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.total, 1),
          primaryLabel: "Best-of total",
          rows: [
            { label: "Selected", value: computed.selected.map((x) => num(x, 1)).join(", ") },
            { label: "Average", value: num(computed.average, 1) },
          ],
        };
      }
      case "passFail": {
        const marksP = parseNonNegative(a, "Marks");
        const passP = parseNonNegative(b, "Pass mark");
        if (!marksP.ok) return { error: marksP.error };
        if (!passP.ok) return { error: passP.error };
        const computed = passFail({ marks: marksP.value, passMark: passP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.status,
          primaryLabel: "Result",
          rows: [{ label: "Margin", value: num(computed.margin, 1) }],
        };
      }
      case "improvement": {
        const prevP = parseNonNegative(a, "Previous score");
        const currP = parseNonNegative(b, "Current score");
        if (!prevP.ok) return { error: prevP.error };
        if (!currP.ok) return { error: currP.error };
        const computed = scoreImprovement({ previous: prevP.value, current: currP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.delta, 1),
          primaryLabel: "Delta",
          rows: [{ label: "Percent change", value: pct(computed.percentChange) }],
        };
      }
      case "requiredPass": {
        const soFarP = parseNonNegative(a, "Marks so far");
        const maxSoFarP = parseNonNegative(b, "Max so far");
        const remainP = parseNonNegative(c, "Remaining max");
        const passPctP = parseAprPercent(r, "Pass %");
        if (!soFarP.ok) return { error: soFarP.error };
        if (!maxSoFarP.ok) return { error: maxSoFarP.error };
        if (!remainP.ok) return { error: remainP.error };
        if (!passPctP.ok) return { error: passPctP.error };
        const computed = requiredMarksToPass({
          marksSoFar: soFarP.value,
          maxSoFar: maxSoFarP.value,
          remainingMax: remainP.value,
          passPercent: passPctP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.alreadySafe ? "Already safe" : num(computed.required, 1),
          primaryLabel: computed.alreadySafe ? "Status" : "Required on remaining",
          rows: [
            { label: "Overall target", value: num(computed.overallTarget, 1) },
            { label: "Already safe", value: computed.alreadySafe ? "Yes" : "No" },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, w, m]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "marksPct" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-obtained">Obtained marks</FieldLabel>
                <FieldInput
                  id="ebs-obtained"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-total">Total marks</FieldLabel>
                <FieldInput
                  id="ebs-total"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "totalMarks" ? (
            <div>
              <FieldLabel htmlFor="ebs-marks-csv">Marks (CSV)</FieldLabel>
              <FieldInput id="ebs-marks-csv" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "subjectPct" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-subj-marks">Marks (CSV)</FieldLabel>
                <FieldInput id="ebs-subj-marks" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-max">Max per subject</FieldLabel>
                <FieldInput
                  id="ebs-max"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "weightedPct" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-scores">Scores (CSV)</FieldLabel>
                <FieldInput id="ebs-scores" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-weights">Weights (CSV)</FieldLabel>
                <FieldInput id="ebs-weights" value={m} onChange={(ev) => setM(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "grade" ? (
            <div>
              <FieldLabel htmlFor="ebs-percent">Percentage</FieldLabel>
              <FieldInput
                id="ebs-percent"
                value={a}
                onChange={(ev) => setA(ev.target.value)}
                inputMode="decimal"
              />
            </div>
          ) : null}

          {config.mode === "average" ? (
            <div>
              <FieldLabel htmlFor="ebs-avg-scores">Scores (CSV)</FieldLabel>
              <FieldInput id="ebs-avg-scores" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "bestOfN" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-best-marks">Marks (CSV)</FieldLabel>
                <FieldInput id="ebs-best-marks" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-best-n">Best of N</FieldLabel>
                <FieldInput
                  id="ebs-best-n"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "passFail" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-pf-marks">Marks</FieldLabel>
                <FieldInput
                  id="ebs-pf-marks"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-pass-mark">Pass mark</FieldLabel>
                <FieldInput
                  id="ebs-pass-mark"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "improvement" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-prev">Previous score</FieldLabel>
                <FieldInput
                  id="ebs-prev"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-curr">Current score</FieldLabel>
                <FieldInput
                  id="ebs-curr"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
            </>
          ) : null}

          {config.mode === "requiredPass" ? (
            <>
              <div>
                <FieldLabel htmlFor="ebs-so-far">Marks so far</FieldLabel>
                <FieldInput
                  id="ebs-so-far"
                  value={a}
                  onChange={(ev) => setA(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-max-so-far">Max so far</FieldLabel>
                <FieldInput
                  id="ebs-max-so-far"
                  value={b}
                  onChange={(ev) => setB(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-remain-max">Remaining max</FieldLabel>
                <FieldInput
                  id="ebs-remain-max"
                  value={c}
                  onChange={(ev) => setC(ev.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div>
                <FieldLabel htmlFor="ebs-pass-pct">Pass %</FieldLabel>
                <FieldInput
                  id="ebs-pass-pct"
                  value={r}
                  onChange={(ev) => setR(ev.target.value)}
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
