"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_COMPETITIVE_URL,
  attemptAccuracy,
  cutoffPredictor,
  examScoreEstimator,
  marksVsRank,
  negativeMarking,
  normalizationScore,
  percentileExam,
  rankPredictor,
  scoreScaling,
} from "@/lib/calculators/examCompetitive";

type CompSlug =
  | "cutoff-predictor-calculator"
  | "rank-predictor-calculator"
  | "percentile-calculator-exam"
  | "normalization-score-calculator"
  | "marks-vs-rank-calculator"
  | "score-scaling-calculator"
  | "negative-marking-calculator"
  | "attempt-accuracy-calculator"
  | "exam-score-estimator";

type Mode =
  | "cutoff"
  | "rank"
  | "percentile"
  | "normalization"
  | "marksRank"
  | "scaling"
  | "negMark"
  | "attemptAcc"
  | "scoreEst";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  tDefault: string;
  nDefault: string;
};

const CONFIG: Record<CompSlug, Config> = {
  "cutoff-predictor-calculator": {
    title: "Cut-off predictor",
    description: "Compare your score to an adjusted last-year cut-off with difficulty factor.",
    mode: "cutoff",
    aDefault: "285",
    bDefault: "270",
    cDefault: "1.05",
    rDefault: "0",
    tDefault: "0",
    nDefault: "0",
  },
  "rank-predictor-calculator": {
    title: "Rank predictor",
    description: "Illustrative percentile and rank from marks and candidate pool.",
    mode: "rank",
    aDefault: "420",
    bDefault: "500",
    cDefault: "0",
    rDefault: "0",
    tDefault: "1000000",
    nDefault: "0",
  },
  "percentile-calculator-exam": {
    title: "Percentile calculator",
    description: "Z-score and estimated percentile from mean and standard deviation.",
    mode: "percentile",
    aDefault: "285",
    bDefault: "240",
    cDefault: "45",
    rDefault: "0",
    tDefault: "0",
    nDefault: "0",
  },
  "normalization-score-calculator": {
    title: "Normalization score",
    description: "Map raw score from one session distribution to a target mean/std.",
    mode: "normalization",
    aDefault: "72",
    bDefault: "65",
    cDefault: "12",
    rDefault: "50",
    tDefault: "10",
    nDefault: "0",
  },
  "marks-vs-rank-calculator": {
    title: "Marks vs rank",
    description: "Rough rank estimate from marks vs top score and candidate count.",
    mode: "marksRank",
    aDefault: "380",
    bDefault: "500",
    cDefault: "0",
    rDefault: "0",
    tDefault: "800000",
    nDefault: "0",
  },
  "score-scaling-calculator": {
    title: "Score scaling",
    description: "Linear map from raw min–max range to a scaled min–max range.",
    mode: "scaling",
    aDefault: "72",
    bDefault: "0",
    cDefault: "100",
    rDefault: "0",
    tDefault: "100",
    nDefault: "0",
  },
  "negative-marking-calculator": {
    title: "Negative marking",
    description: "Net score from correct/wrong counts and per-question marking.",
    mode: "negMark",
    aDefault: "45",
    bDefault: "12",
    cDefault: "4",
    rDefault: "1",
    tDefault: "0",
    nDefault: "0",
  },
  "attempt-accuracy-calculator": {
    title: "Attempt accuracy",
    description: "Accuracy and wrong share from correct and wrong counts.",
    mode: "attemptAcc",
    aDefault: "38",
    bDefault: "10",
    cDefault: "0",
    rDefault: "0",
    tDefault: "0",
    nDefault: "0",
  },
  "exam-score-estimator": {
    title: "Exam score estimator",
    description: "Expected correct/wrong split and score at a given accuracy.",
    mode: "scoreEst",
    aDefault: "80",
    bDefault: "70",
    cDefault: "4",
    rDefault: "1",
    tDefault: "0",
    nDefault: "0",
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

export function ExamCompetitiveCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as CompSlug] ?? CONFIG["cutoff-predictor-calculator"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.T, config.tDefault));
  const [n, setN] = useState(useLoanInitialInput(EXAM_COMPETITIVE_URL.N, config.nDefault));

  const num = (n: number, d = 1) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(2)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_COMPETITIVE_URL.A]: a,
      [EXAM_COMPETITIVE_URL.B]: b,
      [EXAM_COMPETITIVE_URL.C]: c,
      [EXAM_COMPETITIVE_URL.R]: r,
      [EXAM_COMPETITIVE_URL.T]: t,
    };
    if (config.mode === "negMark" && n.trim()) {
      return { ...base, [EXAM_COMPETITIVE_URL.N]: n };
    }
    return base;
  }, [a, b, c, r, t, n, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, n]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "cutoff": {
        const scoreP = parseNonNegative(a, "Your score");
        const cutoffP = parseNonNegative(b, "Last year cut-off");
        const factorP = c.trim()
          ? parsePositive(c, "Difficulty factor")
          : { ok: true as const, value: 1 };
        if (!scoreP.ok) return { error: scoreP.error };
        if (!cutoffP.ok) return { error: cutoffP.error };
        if (!factorP.ok) return { error: factorP.error };
        const computed = cutoffPredictor({
          yourScore: scoreP.value,
          lastYearCutoff: cutoffP.value,
          difficultyFactor: factorP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.clears ? "Likely clears" : "Below cut-off",
          primaryLabel: "Prediction",
          rows: [
            { label: "Adjusted cut-off", value: num(computed.adjustedCutoff, 1) },
            { label: "Margin", value: `${computed.margin >= 0 ? "+" : ""}${num(computed.margin, 1)}` },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "rank": {
        const marksP = parseNonNegative(a, "Marks");
        const maxP = parsePositive(b, "Max marks");
        const poolP = t.trim() ? parsePositive(t, "Candidates") : { ok: true as const, value: undefined };
        if (!marksP.ok) return { error: marksP.error };
        if (!maxP.ok) return { error: maxP.error };
        if (!poolP.ok) return { error: poolP.error };
        const computed = rankPredictor({
          marks: marksP.value,
          maxMarks: maxP.value,
          candidates: poolP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `~${Math.round(computed.estimatedRank).toLocaleString()}`,
          primaryLabel: "Estimated rank",
          rows: [{ label: "Percentile", value: pct(computed.estimatedPercentile) }],
        };
      }
      case "percentile": {
        const scoreP = parseNonNegative(a, "Your score");
        const meanP = parseNonNegative(b, "Mean score");
        const stdP = parsePositive(c, "Std deviation");
        if (!scoreP.ok) return { error: scoreP.error };
        if (!meanP.ok) return { error: meanP.error };
        if (!stdP.ok) return { error: stdP.error };
        const computed = percentileExam({
          yourScore: scoreP.value,
          meanScore: meanP.value,
          stdDev: stdP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.estimatedPercentile),
          primaryLabel: "Estimated percentile",
          rows: [{ label: "Z-score", value: num(computed.zScore, 2) }],
        };
      }
      case "normalization": {
        const rawP = parseNonNegative(a, "Raw score");
        const sMeanP = parseNonNegative(b, "Session mean");
        const sStdP = parsePositive(c, "Session std");
        const tMeanP = parseNonNegative(r, "Target mean");
        const tStdP = parsePositive(t, "Target std");
        if (!rawP.ok) return { error: rawP.error };
        if (!sMeanP.ok) return { error: sMeanP.error };
        if (!sStdP.ok) return { error: sStdP.error };
        if (!tMeanP.ok) return { error: tMeanP.error };
        if (!tStdP.ok) return { error: tStdP.error };
        const computed = normalizationScore({
          rawScore: rawP.value,
          sessionMean: sMeanP.value,
          sessionStd: sStdP.value,
          targetMean: tMeanP.value,
          targetStd: tStdP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.normalized, 2),
          primaryLabel: "Normalized score",
          rows: [],
        };
      }
      case "marksRank": {
        const marksP = parseNonNegative(a, "Your marks");
        const topP = parsePositive(b, "Top marks");
        const candP = parsePositive(t, "Candidates");
        if (!marksP.ok) return { error: marksP.error };
        if (!topP.ok) return { error: topP.error };
        if (!candP.ok) return { error: candP.error };
        const computed = marksVsRank({
          marks: marksP.value,
          topMarks: topP.value,
          candidates: candP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `~${Math.round(computed.estimatedRank).toLocaleString()}`,
          primaryLabel: "Estimated rank",
          rows: [{ label: "Note", value: computed.note }],
        };
      }
      case "scaling": {
        const rawP = parseNonNegative(a, "Raw score");
        const rawMinP = parseNonNegative(b, "Raw min");
        const rawMaxP = parsePositive(c, "Raw max");
        const scaleMinP = parseNonNegative(r, "Scale min");
        const scaleMaxP = parsePositive(t, "Scale max");
        if (!rawP.ok) return { error: rawP.error };
        if (!rawMinP.ok) return { error: rawMinP.error };
        if (!rawMaxP.ok) return { error: rawMaxP.error };
        if (!scaleMinP.ok) return { error: scaleMinP.error };
        if (!scaleMaxP.ok) return { error: scaleMaxP.error };
        const computed = scoreScaling({
          raw: rawP.value,
          rawMin: rawMinP.value,
          rawMax: rawMaxP.value,
          scaleMin: scaleMinP.value,
          scaleMax: scaleMaxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.scaled, 2),
          primaryLabel: "Scaled score",
          rows: [],
        };
      }
      case "negMark": {
        const corP = parseNonNegative(a, "Correct");
        const wrongP = parseNonNegative(b, "Wrong");
        const mcP = parseNonNegative(c, "Marks per correct");
        const mwP = parseNonNegative(r, "Marks per wrong");
        if (!corP.ok) return { error: corP.error };
        if (!wrongP.ok) return { error: wrongP.error };
        if (!mcP.ok) return { error: mcP.error };
        if (!mwP.ok) return { error: mwP.error };
        const computed = negativeMarking({
          correct: corP.value,
          wrong: wrongP.value,
          marksPerCorrect: mcP.value,
          marksPerWrong: mwP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.score, 1),
          primaryLabel: "Net score",
          rows: [
            { label: "Attempted", value: String(computed.attempted) },
            { label: "Accuracy", value: pct(computed.accuracyPercent) },
          ],
        };
      }
      case "attemptAcc": {
        const corP = parseNonNegative(a, "Correct");
        const wrongP = parseNonNegative(b, "Wrong");
        if (!corP.ok) return { error: corP.error };
        if (!wrongP.ok) return { error: wrongP.error };
        const computed = attemptAccuracy({ correct: corP.value, wrong: wrongP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.accuracyPercent),
          primaryLabel: "Accuracy",
          rows: [
            { label: "Attempted", value: String(computed.attempted) },
            { label: "Wrong share", value: pct(computed.wrongPercent) },
          ],
        };
      }
      case "scoreEst": {
        const attP = parsePositive(a, "Attempted");
        const accP = parseAprPercent(b, "Expected accuracy %");
        const mcP = parseNonNegative(c, "Marks per correct");
        const mwP = parseNonNegative(r, "Marks per wrong");
        if (!attP.ok) return { error: attP.error };
        if (!accP.ok) return { error: accP.error };
        if (!mcP.ok) return { error: mcP.error };
        if (!mwP.ok) return { error: mwP.error };
        const computed = examScoreEstimator({
          attempted: attP.value,
          expectedAccuracyPercent: accP.value,
          marksPerCorrect: mcP.value,
          marksPerWrong: mwP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.expectedScore, 1),
          primaryLabel: "Expected score",
          rows: [
            { label: "Expected correct", value: num(computed.expectedCorrect, 1) },
            { label: "Expected wrong", value: num(computed.expectedWrong, 1) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, n]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "cutoff" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-score">Your score</FieldLabel>
                <FieldInput id="ec-score" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-cut">Last year cut-off</FieldLabel>
                <FieldInput id="ec-cut" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-factor">Difficulty factor</FieldLabel>
                <FieldInput id="ec-factor" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "rank" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-marks">Marks</FieldLabel>
                <FieldInput id="ec-marks" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-max">Max marks</FieldLabel>
                <FieldInput id="ec-max" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-pool">Candidates (optional)</FieldLabel>
                <FieldInput id="ec-pool" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "percentile" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-yscore">Your score</FieldLabel>
                <FieldInput id="ec-yscore" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-mean">Mean score</FieldLabel>
                <FieldInput id="ec-mean" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-std">Std deviation</FieldLabel>
                <FieldInput id="ec-std" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "normalization" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-raw">Raw score</FieldLabel>
                <FieldInput id="ec-raw" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-smean">Session mean</FieldLabel>
                <FieldInput id="ec-smean" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-sstd">Session std</FieldLabel>
                <FieldInput id="ec-sstd" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-tmean">Target mean</FieldLabel>
                <FieldInput id="ec-tmean" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-tstd">Target std</FieldLabel>
                <FieldInput id="ec-tstd" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "marksRank" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-mrk">Your marks</FieldLabel>
                <FieldInput id="ec-mrk" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-top">Top marks</FieldLabel>
                <FieldInput id="ec-top" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-cand">Candidates</FieldLabel>
                <FieldInput id="ec-cand" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "scaling" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-raws">Raw score</FieldLabel>
                <FieldInput id="ec-raws" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-rmin">Raw min</FieldLabel>
                <FieldInput id="ec-rmin" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-rmax">Raw max</FieldLabel>
                <FieldInput id="ec-rmax" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-smin">Scale min</FieldLabel>
                <FieldInput id="ec-smin" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-smax">Scale max</FieldLabel>
                <FieldInput id="ec-smax" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "negMark" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-cor">Correct</FieldLabel>
                <FieldInput id="ec-cor" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-wrong">Wrong</FieldLabel>
                <FieldInput id="ec-wrong" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-mc">Marks per correct</FieldLabel>
                <FieldInput id="ec-mc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-mw">Marks per wrong</FieldLabel>
                <FieldInput id="ec-mw" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "attemptAcc" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-acor">Correct</FieldLabel>
                <FieldInput id="ec-acor" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-awrong">Wrong</FieldLabel>
                <FieldInput id="ec-awrong" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "scoreEst" ? (
            <>
              <div>
                <FieldLabel htmlFor="ec-att">Attempted</FieldLabel>
                <FieldInput id="ec-att" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-eacc">Expected accuracy %</FieldLabel>
                <FieldInput id="ec-eacc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-emc">Marks per correct</FieldLabel>
                <FieldInput id="ec-emc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ec-emw">Marks per wrong</FieldLabel>
                <FieldInput id="ec-emw" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
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
              {result.rows.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {result.rows.map((row) => (
                    <Row key={row.label} label={row.label} value={row.value} />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </CalculatorShell>
  );
}
