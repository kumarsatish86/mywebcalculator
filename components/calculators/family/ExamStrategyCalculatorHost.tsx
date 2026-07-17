"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_STRATEGY_URL,
  mockTestPerformance,
  optimalAttempt,
  questionAttemptStrategy,
  speedVsAccuracy,
  timeAllocationPerSection,
} from "@/lib/calculators/examStrategy";

type StrategySlug =
  | "time-allocation-calculator-per-section"
  | "question-attempt-strategy-calculator"
  | "optimal-attempt-calculator"
  | "speed-vs-accuracy-calculator"
  | "mock-test-performance-calculator";

type Mode = "timeAlloc" | "attemptStrategy" | "optimalAttempt" | "speedAccuracy" | "mockPerf";

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

const CONFIG: Record<StrategySlug, Config> = {
  "time-allocation-calculator-per-section": {
    title: "Time allocation per section",
    description: "Split total exam minutes across sections by weight (e.g. 40,30,30).",
    mode: "timeAlloc",
    aDefault: "180",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "40,35,25",
  },
  "question-attempt-strategy-calculator": {
    title: "Question attempt strategy",
    description: "Split total questions by easy / medium / hard mix and suggested order.",
    mode: "attemptStrategy",
    aDefault: "90",
    bDefault: "50",
    cDefault: "35",
    rDefault: "15",
    wDefault: "",
  },
  "optimal-attempt-calculator": {
    title: "Optimal attempt calculator",
    description: "Expected score and attempt count given accuracy and marking scheme.",
    mode: "optimalAttempt",
    aDefault: "100",
    bDefault: "70",
    cDefault: "4",
    rDefault: "1",
    wDefault: "",
  },
  "speed-vs-accuracy-calculator": {
    title: "Speed vs accuracy",
    description: "Questions per minute, seconds per question, and pacing balance tip.",
    mode: "speedAccuracy",
    aDefault: "45",
    bDefault: "36",
    cDefault: "60",
    rDefault: "0",
    wDefault: "",
  },
  "mock-test-performance-calculator": {
    title: "Mock test performance",
    description: "Average, best, worst, and trend from comma-separated mock scores.",
    mode: "mockPerf",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "0",
    wDefault: "520,545,560,578,590",
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

export function ExamStrategyCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as StrategySlug] ?? CONFIG["time-allocation-calculator-per-section"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_STRATEGY_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_STRATEGY_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_STRATEGY_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_STRATEGY_URL.R, config.rDefault));
  const [w, setW] = useState(useLoanInitialInput(EXAM_STRATEGY_URL.W, config.wDefault));

  const num = (n: number, d = 1) => n.toFixed(d);
  const pct = (n: number) => `${n.toFixed(1)}%`;

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_STRATEGY_URL.A]: a,
      [EXAM_STRATEGY_URL.B]: b,
      [EXAM_STRATEGY_URL.C]: c,
      [EXAM_STRATEGY_URL.R]: r,
    };
    if (config.mode === "timeAlloc" || config.mode === "mockPerf") {
      return { ...base, [EXAM_STRATEGY_URL.W]: w };
    }
    return base;
  }, [a, b, c, r, w, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, w]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "timeAlloc": {
        const minP = parsePositive(a, "Total minutes");
        if (!minP.ok) return { error: minP.error };
        if (!w.trim()) return { error: "Enter section weights (comma-separated)." };
        const computed = timeAllocationPerSection({ totalMinutes: minP.value, weightsCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${computed.sections.length} sections`,
          primaryLabel: "Allocation plan",
          rows: computed.sections.map((s) => ({
            label: `Section ${s.index} (w=${s.weight})`,
            value: `${num(s.minutes)} min`,
          })),
        };
      }
      case "attemptStrategy": {
        const totalP = parsePositive(a, "Total questions");
        const easyP = parseNonNegative(b, "Easy %");
        const medP = parseNonNegative(c, "Medium %");
        const hardP = parseNonNegative(r, "Hard %");
        if (!totalP.ok) return { error: totalP.error };
        if (!easyP.ok) return { error: easyP.error };
        if (!medP.ok) return { error: medP.error };
        if (!hardP.ok) return { error: hardP.error };
        const computed = questionAttemptStrategy({
          totalQuestions: totalP.value,
          easyPct: easyP.value,
          mediumPct: medP.value,
          hardPct: hardP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.suggestedOrder,
          primaryLabel: "Suggested order",
          rows: [
            { label: "Easy", value: String(computed.easy) },
            { label: "Medium", value: String(computed.medium) },
            { label: "Hard", value: String(computed.hard) },
          ],
        };
      }
      case "optimalAttempt": {
        const totalP = parsePositive(a, "Total questions");
        const accP = parseAprPercent(b, "Accuracy %");
        const correctP = parseNonNegative(c, "Marks per correct");
        const wrongP = parseNonNegative(r, "Marks per wrong");
        if (!totalP.ok) return { error: totalP.error };
        if (!accP.ok) return { error: accP.error };
        if (!correctP.ok) return { error: correctP.error };
        if (!wrongP.ok) return { error: wrongP.error };
        const computed = optimalAttempt({
          totalQuestions: totalP.value,
          accuracyPercent: accP.value,
          marksCorrect: correctP.value,
          marksWrong: wrongP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: String(computed.optimalAttempts),
          primaryLabel: "Optimal attempts",
          rows: [
            { label: "Expected score", value: num(computed.expectedScore, 2) },
            { label: "Note", value: computed.note },
          ],
        };
      }
      case "speedAccuracy": {
        const attP = parsePositive(a, "Questions attempted");
        const corP = parseNonNegative(b, "Correct");
        const minP = parsePositive(c, "Minutes used");
        if (!attP.ok) return { error: attP.error };
        if (!corP.ok) return { error: corP.error };
        if (!minP.ok) return { error: minP.error };
        const computed = speedVsAccuracy({
          questionsAttempted: attP.value,
          correct: corP.value,
          minutesUsed: minP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: pct(computed.accuracyPercent),
          primaryLabel: "Accuracy",
          rows: [
            { label: "Questions / min", value: num(computed.qpm, 2) },
            { label: "Sec / question", value: num(computed.secondsPerQuestion, 0) },
            { label: "Balance tip", value: computed.balanceTip },
          ],
        };
      }
      case "mockPerf": {
        if (!w.trim()) return { error: "Enter at least 2 mock scores (comma-separated)." };
        const computed = mockTestPerformance({ scoresCsv: w });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: num(computed.average, 1),
          primaryLabel: "Average score",
          rows: [
            { label: "Mocks", value: String(computed.mocks) },
            { label: "Best", value: num(computed.best, 1) },
            { label: "Worst", value: num(computed.worst, 1) },
            { label: "Trend", value: computed.trend },
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, w]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "timeAlloc" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-minutes">Total minutes</FieldLabel>
                <FieldInput id="es-minutes" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-weights">Section weights (CSV)</FieldLabel>
                <FieldInput id="es-weights" value={w} onChange={(ev) => setW(ev.target.value)} />
              </div>
            </>
          ) : null}

          {config.mode === "attemptStrategy" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-totalq">Total questions</FieldLabel>
                <FieldInput id="es-totalq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-easy">Easy %</FieldLabel>
                <FieldInput id="es-easy" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-med">Medium %</FieldLabel>
                <FieldInput id="es-med" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-hard">Hard %</FieldLabel>
                <FieldInput id="es-hard" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "optimalAttempt" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-oq">Total questions</FieldLabel>
                <FieldInput id="es-oq" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-acc">Accuracy %</FieldLabel>
                <FieldInput id="es-acc" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-mc">Marks per correct</FieldLabel>
                <FieldInput id="es-mc" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-mw">Marks per wrong</FieldLabel>
                <FieldInput id="es-mw" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "speedAccuracy" ? (
            <>
              <div>
                <FieldLabel htmlFor="es-att">Questions attempted</FieldLabel>
                <FieldInput id="es-att" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-cor">Correct</FieldLabel>
                <FieldInput id="es-cor" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="es-min">Minutes used</FieldLabel>
                <FieldInput id="es-min" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "mockPerf" ? (
            <div>
              <FieldLabel htmlFor="es-scores">Mock scores (CSV)</FieldLabel>
              <FieldInput id="es-scores" value={w} onChange={(ev) => setW(ev.target.value)} />
            </div>
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
