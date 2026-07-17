"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_PERFORMANCE_URL,
  accuracyCorrectVsWrong,
  improvementTracker,
  scoreTrend,
  subjectWisePerformance,
  timeEfficiency,
  weakTopicAnalyzer,
} from "@/lib/calculators/examPerformanceAnalysis";

type PerfSlug =
  | "subject-wise-performance-analyzer"
  | "accuracy-calculator-correct-vs-wrong"
  | "time-efficiency-calculator"
  | "weak-topic-analyzer"
  | "score-trend-calculator"
  | "improvement-tracker-calculator";

type Mode =
  | "subjectWise"
  | "accuracy"
  | "timeEff"
  | "weakTopic"
  | "scoreTrend"
  | "improvement";

type Config = {
  title: string;
  description: string;
  mode: Mode;
  aDefault: string;
  bDefault: string;
  cDefault: string;
  rDefault: string;
  wDefault: string;
};

const CONFIG: Record<PerfSlug, Config> = {
  "subject-wise-performance-analyzer": {
    title: "Subject-wise performance analyzer",
    description: "Parse subject scores (Name:score or CSV) and find strongest/weakest.",
    mode: "subjectWise",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "100",
    wDefault: "Math:72,Physics:55,Chem:68",
  },
  "accuracy-calculator-correct-vs-wrong": {
    title: "Accuracy calculator — correct vs wrong",
    description: "Accuracy and attempt rate from correct, wrong, and unattempted counts.",
    mode: "accuracy",
    aDefault: "42",
    bDefault: "18",
    cDefault: "40",
    rDefault: "0",
    wDefault: "",
  },
  "time-efficiency-calculator": {
    title: "Time efficiency calculator",
    description: "Seconds per question and pace vs a target minutes-per-question.",
    mode: "timeEff",
    aDefault: "50",
    bDefault: "75",
    cDefault: "1.5",
    rDefault: "0",
    wDefault: "",
  },
  "weak-topic-analyzer": {
    title: "Weak topic analyzer",
    description: "Tag topics as weak/ok/strong and list top focus areas.",
    mode: "weakTopic",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "Algebra:45,Calculus:72,Trigonometry:38",
  },
  "score-trend-calculator": {
    title: "Score trend calculator",
    description: "Average, slope, and improving/declining/stable from score history.",
    mode: "scoreTrend",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "520,535,548,560,572",
  },
  "improvement-tracker-calculator": {
    title: "Improvement tracker",
    description: "Absolute and relative gain from baseline to latest score.",
    mode: "improvement",
    aDefault: "520",
    bDefault: "578",
    cDefault: "720",
    rDefault: "0",
    wDefault: "",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function ExamPerformanceAnalysisCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as PerfSlug] ?? CONFIG["subject-wise-performance-analyzer"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_PERFORMANCE_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_PERFORMANCE_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_PERFORMANCE_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_PERFORMANCE_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(EXAM_PERFORMANCE_URL.W, config.wDefault));

  const num = (n: number, d = 1) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_PERFORMANCE_URL.A]: a,
      [EXAM_PERFORMANCE_URL.B]: b,
      [EXAM_PERFORMANCE_URL.C]: c,
      [EXAM_PERFORMANCE_URL.R]: r,
    };
    if (
      config.mode === "subjectWise" ||
      config.mode === "weakTopic" ||
      config.mode === "scoreTrend"
    ) {
      return { ...base, [EXAM_PERFORMANCE_URL.W]: w };
    }
    return base;
  }, [a, b, c, r, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "subjectWise": {
        const maxP = r.trim() ? parsePositive(r, "Max per subject") : { ok: true as const, value: 100 };
        if (!maxP.ok) return { error: maxP.error };
        if (!w.trim()) return { error: "Enter subject scores (Name:score or CSV)." };
        const computed = subjectWisePerformance({
          scoresCsv: w,
          maxPerSubject: maxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.averagePercent),
          primaryLabel: "Average %",
          rows: [
            { label: "Strongest", value: computed.strongest },
            { label: "Weakest", value: computed.weakest },
            ...computed.subjects.map((s) => ({
              label: s.name,
              value: `${num(s.score, 0)} (${pct(s.percent)})`,
            })),
          ],
        };
      }
      case "accuracy": {
        const corP = parseNonNegative(a, "Correct");
        const wrongP = parseNonNegative(b, "Wrong");
        const unP = c.trim() ? parseNonNegative(c, "Unattempted") : { ok: true as const, value: 0 };
        if (!corP.ok) return { error: corP.error };
        if (!wrongP.ok) return { error: wrongP.error };
        if (!unP.ok) return { error: unP.error };
        const computed = accuracyCorrectVsWrong({
          correct: corP.value,
          wrong: wrongP.value,
          unattempted: unP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.accuracyPercent),
          primaryLabel: "Accuracy",
          rows: [
            { label: "Attempted", value: String(computed.attempted) },
            { label: "Attempt rate", value: pct(computed.attemptRatePercent) },
          ],
        };
      }
      case "timeEff": {
        const qP = parsePositive(a, "Questions done");
        const minP = parsePositive(b, "Minutes used");
        const tgtP = c.trim()
          ? parsePositive(c, "Target min/question")
          : { ok: true as const, value: 1.5 };
        if (!qP.ok) return { error: qP.error };
        if (!minP.ok) return { error: minP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        const computed = timeEfficiency({
          questionsDone: qP.value,
          minutesUsed: minP.value,
          targetMinutesPerQuestion: tgtP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.secondsPerQuestion, 0)} sec/q`,
          primaryLabel: "Pace",
          rows: [
            { label: "Questions / min", value: num(computed.qpm, 2) },
            { label: "Vs target", value: computed.vsTarget },
          ],
        };
      }
      case "weakTopic": {
        if (!w.trim()) return { error: "Enter topics as Name:score (comma-separated)." };
        const computed = weakTopicAnalyzer({ topicsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.focusList.join(", "),
          primaryLabel: "Focus topics",
          rows: computed.topics.map((t) => ({
            label: t.name,
            value: `${num(t.score, 0)} (${t.tag})`,
          })),
        };
      }
      case "scoreTrend": {
        if (!w.trim()) return { error: "Enter at least 2 scores (comma-separated)." };
        const computed = scoreTrend({ scoresCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.trend,
          primaryLabel: "Trend",
          rows: [
            { label: "Tests", value: String(computed.count) },
            { label: "Average", value: num(computed.average, 1) },
            { label: "Slope / test", value: num(computed.slopePerTest, 2) },
          ],
        };
      }
      case "improvement": {
        const baseP = parseNonNegative(a, "Baseline score");
        const latestP = parseNonNegative(b, "Latest score");
        const maxP = parsePositive(c, "Max score");
        if (!baseP.ok) return { error: baseP.error };
        if (!latestP.ok) return { error: latestP.error };
        if (!maxP.ok) return { error: maxP.error };
        const computed = improvementTracker({
          baselineScore: baseP.value,
          latestScore: latestP.value,
          maxScore: maxP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `+${num(computed.absoluteGain, 1)}`,
          primaryLabel: "Absolute gain",
          rows: [
            { label: "Gain % of max", value: pct(computed.percentGainOfMax) },
            { label: "Relative improvement", value: pct(computed.relativeImprovementPercent) },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "subjectWise" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-scores">Subject scores (CSV)</FieldLabel>
                <FieldInput id="ep-scores" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
              <div>
                <FieldLabel htmlFor="ep-max">Max per subject</FieldLabel>
                <FieldInput id="ep-max" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "accuracy" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-cor">Correct</FieldLabel>
                <FieldInput id="ep-cor" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-wrong">Wrong</FieldLabel>
                <FieldInput id="ep-wrong" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-un">Unattempted (optional)</FieldLabel>
                <FieldInput id="ep-un" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "timeEff" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-q">Questions done</FieldLabel>
                <FieldInput id="ep-q" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-min">Minutes used</FieldLabel>
                <FieldInput id="ep-min" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-tgt">Target min/question</FieldLabel>
                <FieldInput id="ep-tgt" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "weakTopic" ? (
            <div>
              <FieldLabel htmlFor="ep-topics">Topics (Name:score CSV)</FieldLabel>
              <FieldInput id="ep-topics" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "scoreTrend" ? (
            <div>
              <FieldLabel htmlFor="ep-trend">Scores (CSV)</FieldLabel>
              <FieldInput id="ep-trend" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
          ) : null}

          {config.mode === "improvement" ? (
            <>
              <div>
                <FieldLabel htmlFor="ep-base">Baseline score</FieldLabel>
                <FieldInput id="ep-base" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-latest">Latest score</FieldLabel>
                <FieldInput id="ep-latest" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="ep-maxs">Max score</FieldLabel>
                <FieldInput id="ep-maxs" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
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
