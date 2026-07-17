"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_VIRAL_URL,
  canIPassWithThisScore,
  cgpaNeededForPlacement,
  howMuchToScoreToPass,
  rankPredictorJeeNeet,
  whatIfXMarks,
} from "@/lib/calculators/examViralMicro";

type ViralSlug =
  | "how-much-should-i-score-to-pass"
  | "can-i-pass-with-this-score"
  | "what-if-i-get-x-marks-simulator"
  | "rank-predictor-jee-neet"
  | "cgpa-needed-for-placement-eligibility";

type Mode = "passNeeded" | "canPass" | "whatIf" | "rankPredict" | "cgpaPlacement";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  mDefault: string;
};

const CONFIG: Record<ViralSlug, Config> = {
  "how-much-should-i-score-to-pass": {
    title: "How much should I score to pass?",
    description: "Marks still needed on remaining papers to hit your pass threshold overall.",
    mode: "passNeeded",
    aDefault: "100",
    bDefault: "25",
    cDefault: "40",
    rDefault: "40",
    tDefault: "0",
    mDefault: "jee",
  },
  "can-i-pass-with-this-score": {
    title: "Can I pass with this score?",
    description: "Check whether your current marks meet the pass percentage on a paper or total.",
    mode: "canPass",
    aDefault: "72",
    bDefault: "100",
    cDefault: "0",
    rDefault: "40",
    tDefault: "0",
    mDefault: "jee",
  },
  "what-if-i-get-x-marks-simulator": {
    title: "What if I get X marks — simulator",
    description: "Blend current totals with a hypothetical new section to see updated percentage.",
    mode: "whatIf",
    aDefault: "200",
    bDefault: "300",
    cDefault: "50",
    rDefault: "100",
    tDefault: "0",
    mDefault: "jee",
  },
  "rank-predictor-jee-neet": {
    title: "Rank predictor — JEE / NEET",
    description: "Illustrative percentile and rank band from marks (not official counseling).",
    mode: "rankPredict",
    aDefault: "250",
    bDefault: "360",
    cDefault: "0",
    rDefault: "0",
    tDefault: "1200000",
    mDefault: "jee",
  },
  "cgpa-needed-for-placement-eligibility": {
    title: "CGPA needed for placement eligibility",
    description: "GPA required on remaining credits to reach a placement cut-off CGPA.",
    mode: "cgpaPlacement",
    aDefault: "7.5",
    bDefault: "6.8",
    cDefault: "80",
    rDefault: "40",
    tDefault: "0",
    mDefault: "jee",
  },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}

export function ExamViralMicroCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as ViralSlug] ?? CONFIG["how-much-should-i-score-to-pass"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_VIRAL_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_VIRAL_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_VIRAL_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_VIRAL_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_VIRAL_URL.T, config.tDefault));
  const [exam, setExam] = useState<"jee" | "neet">(
    (useLoanInitialInput(EXAM_VIRAL_URL.M, config.mDefault) as "jee" | "neet") || "jee",
  );

  const pct = (n: number) => `${n.toFixed(2)}%`;
  const num = (n: number, d = 2) => n.toFixed(d);

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_VIRAL_URL.A]: a,
      [EXAM_VIRAL_URL.B]: b,
      [EXAM_VIRAL_URL.C]: c,
      [EXAM_VIRAL_URL.R]: r,
      [EXAM_VIRAL_URL.T]: t,
    };
    if (config.mode === "rankPredict") {
      return { ...base, [EXAM_VIRAL_URL.M]: exam };
    }
    return base;
  }, [a, b, c, r, t, exam, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, exam]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "passNeeded": {
        const totalP = parsePositive(a, "Total max marks");
        const passP = parseAprPercent(r, "Pass %");
        const scoredP = parseNonNegative(b, "Marks already scored");
        const remainP = parseNonNegative(c, "Remaining max marks");
        if (!totalP.ok) return { error: totalP.error };
        if (!passP.ok) return { error: passP.error };
        if (!scoredP.ok) return { error: scoredP.error };
        if (!remainP.ok) return { error: remainP.error };
        const computed = howMuchToScoreToPass({
          totalMaxMarks: totalP.value,
          passPercent: passP.value,
          marksAlreadyScored: scoredP.value,
          remainingMaxMarks: remainP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.canPass ? `${num(computed.marksStillNeeded)} marks` : "Cannot pass",
          primaryLabel: "Marks still needed",
          rows: [
            { label: "Pass marks threshold", value: num(computed.passMarksNeeded) },
            { label: "% needed on remaining", value: pct(computed.percentNeededOnRemaining) },
            { label: "Can pass?", value: computed.canPass ? "Yes" : "No" },
          ],
        };
      }
      case "canPass": {
        const scoredP = parseNonNegative(a, "Scored marks");
        const maxP = parsePositive(b, "Max marks");
        const passP = parseAprPercent(r, "Pass %");
        if (!scoredP.ok) return { error: scoredP.error };
        if (!maxP.ok) return { error: maxP.error };
        if (!passP.ok) return { error: passP.error };
        const computed = canIPassWithThisScore({
          scored: scoredP.value,
          maxMarks: maxP.value,
          passPercent: passP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.pass ? "Pass" : "Fail",
          primaryLabel: "Result",
          rows: [
            { label: "Your %", value: pct(computed.percent) },
            { label: "Margin (marks)", value: num(computed.marginMarks) },
            { label: "Pass threshold %", value: pct(passP.value) },
          ],
        };
      }
      case "whatIf": {
        const curP = parseNonNegative(a, "Current total");
        const curMaxP = parsePositive(b, "Current max");
        const addP = parseNonNegative(c, "Added marks");
        const addMaxP = parseNonNegative(r, "Added max");
        if (!curP.ok) return { error: curP.error };
        if (!curMaxP.ok) return { error: curMaxP.error };
        if (!addP.ok) return { error: addP.error };
        if (!addMaxP.ok) return { error: addMaxP.error };
        const computed = whatIfXMarks({
          currentTotal: curP.value,
          currentMax: curMaxP.value,
          addMarks: addP.value,
          addMax: addMaxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.newPercent),
          primaryLabel: "New percentage",
          rows: [
            { label: "New total", value: `${num(computed.newTotal)} / ${num(computed.newMax)}` },
            { label: "Change in %", value: `${computed.percentChange >= 0 ? "+" : ""}${num(computed.percentChange)} pts` },
          ],
        };
      }
      case "rankPredict": {
        const marksP = parseNonNegative(a, "Marks");
        const maxP = parsePositive(b, "Max marks");
        const poolP = t.trim() ? parsePositive(t, "Candidates") : { ok: true as const, value: undefined };
        if (!marksP.ok) return { error: marksP.error };
        if (!maxP.ok) return { error: maxP.error };
        if (!poolP.ok) return { error: poolP.error };
        const computed = rankPredictorJeeNeet({
          marks: marksP.value,
          maxMarks: maxP.value,
          exam,
          candidates: poolP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `~${Math.round(computed.estimatedRank).toLocaleString()}`,
          primaryLabel: "Estimated rank",
          rows: [
            { label: "Percentile", value: pct(computed.estimatedPercentile) },
            { label: "Band", value: computed.band },
            { label: "Exam", value: exam.toUpperCase() },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "cgpaPlacement": {
        const reqP = parseNonNegative(a, "Required CGPA");
        const curP = parseNonNegative(b, "Current CGPA");
        const doneP = parseNonNegative(c, "Completed credits");
        const remP = parsePositive(r, "Remaining credits");
        if (!reqP.ok) return { error: reqP.error };
        if (!curP.ok) return { error: curP.error };
        if (!doneP.ok) return { error: doneP.error };
        if (!remP.ok) return { error: remP.error };
        const computed = cgpaNeededForPlacement({
          requiredCgpa: reqP.value,
          currentCgpa: curP.value,
          completedCredits: doneP.value,
          remainingCredits: remP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.cgpaNeededOnRemaining),
          primaryLabel: "CGPA needed on remaining credits",
          rows: [
            { label: "Feasible?", value: computed.feasible ? "Yes" : "No" },
            { label: "Tip", value: computed.tip },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, exam]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "passNeeded" ? (
            <>
              <div>
                <FieldLabel htmlFor="ev-total">Total max marks</FieldLabel>
                <FieldInput id="ev-total" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-pass">Pass %</FieldLabel>
                <FieldInput id="ev-pass" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-scored">Marks already scored</FieldLabel>
                <FieldInput id="ev-scored" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-remain">Remaining max marks</FieldLabel>
                <FieldInput id="ev-remain" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "canPass" ? (
            <>
              <div>
                <FieldLabel htmlFor="ev-score">Scored marks</FieldLabel>
                <FieldInput id="ev-score" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-max">Max marks</FieldLabel>
                <FieldInput id="ev-max" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-passpct">Pass %</FieldLabel>
                <FieldInput id="ev-passpct" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "whatIf" ? (
            <>
              <div>
                <FieldLabel htmlFor="ev-cur">Current total marks</FieldLabel>
                <FieldInput id="ev-cur" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-curmax">Current max marks</FieldLabel>
                <FieldInput id="ev-curmax" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-add">Hypothetical marks</FieldLabel>
                <FieldInput id="ev-add" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-addmax">Hypothetical max marks</FieldLabel>
                <FieldInput id="ev-addmax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rankPredict" ? (
            <>
              <div>
                <FieldLabel htmlFor="ev-exam">Exam</FieldLabel>
                <select
                  id="ev-exam"
                  className={selectCls}
                  value={exam}
                  onChange={(ev) => setExam(ev.target.value as "jee" | "neet")}
                >
                  <option value="jee">JEE</option>
                  <option value="neet">NEET</option>
                </select>
              </div>
              <div>
                <FieldLabel htmlFor="ev-marks">Marks scored</FieldLabel>
                <FieldInput id="ev-marks" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-mmax">Max marks</FieldLabel>
                <FieldInput id="ev-mmax" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-pool">Candidates (optional)</FieldLabel>
                <FieldInput id="ev-pool" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "cgpaPlacement" ? (
            <>
              <div>
                <FieldLabel htmlFor="ev-req">Required CGPA</FieldLabel>
                <FieldInput id="ev-req" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-cgpa">Current CGPA</FieldLabel>
                <FieldInput id="ev-cgpa" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-done">Completed credits</FieldLabel>
                <FieldInput id="ev-done" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ev-remcred">Remaining credits</FieldLabel>
                <FieldInput id="ev-remcred" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
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
