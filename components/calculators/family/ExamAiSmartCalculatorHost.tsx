"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { parseAprPercent, parseNonNegative, parsePositive } from "@/lib/calculators/loanInputParse";
import {
  EXAM_AI_SMART_URL,
  aiRankPredictor,
  aiScoreImprovementPlanner,
  aiStudyStrategyGenerator,
  aiWeaknessAnalyzer,
} from "@/lib/calculators/examAiSmart";

type AiSlug =
  | "ai-rank-predictor"
  | "ai-score-improvement-planner"
  | "ai-weakness-analyzer"
  | "ai-study-strategy-generator";

type Mode = "rankPredict" | "improvement" | "weakness" | "strategy";

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
  wDefault: string;
};

const CONFIG: Record<AiSlug, Config> = {
  "ai-rank-predictor": {
    title: "AI rank predictor",
    description: "Heuristic percentile and rank vs last year’s cut-off marks.",
    mode: "rankPredict",
    aDefault: "420",
    bDefault: "500",
    cDefault: "380",
    rDefault: "0",
    tDefault: "1000000",
    mDefault: "balanced",
    wDefault: "Math:60,Physics:45,Chem:70",
  },
  "ai-score-improvement-planner": {
    title: "AI score improvement planner",
    description: "Weekly gap targets and study focus from current vs target percent.",
    mode: "improvement",
    aDefault: "62",
    bDefault: "75",
    cDefault: "8",
    rDefault: "12",
    tDefault: "0",
    mDefault: "balanced",
    wDefault: "Math:60,Physics:45,Chem:70",
  },
  "ai-weakness-analyzer": {
    title: "AI weakness analyzer",
    description: "Parse comma-separated subject scores and rank weak vs strong areas.",
    mode: "weakness",
    aDefault: "0",
    bDefault: "0",
    cDefault: "0",
    rDefault: "100",
    tDefault: "0",
    mDefault: "balanced",
    wDefault: "Math:60,Physics:45,Chem:70",
  },
  "ai-study-strategy-generator": {
    title: "AI study strategy generator",
    description: "Daily plan, mock cadence, and revision blocks by study style.",
    mode: "strategy",
    aDefault: "45",
    bDefault: "4",
    cDefault: "5",
    rDefault: "0",
    tDefault: "0",
    mDefault: "balanced",
    wDefault: "Math:60,Physics:45,Chem:70",
  },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function ExamAiSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiSlug] ?? CONFIG["ai-rank-predictor"];
  const [a, setA] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.A, config.aDefault));
  const [b, setB] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.B, config.bDefault));
  const [c, setC] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.C, config.cDefault));
  const [r, setR] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.R, config.rDefault));
  const [t, setT] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.T, config.tDefault));
  const [style, setStyle] = useState<"balanced" | "weakness-first" | "mock-heavy">(
    (useLoanInitialInput(EXAM_AI_SMART_URL.M, config.mDefault) as "balanced" | "weakness-first" | "mock-heavy") ||
      "balanced",
  );
  const [scoresCsv, setScoresCsv] = useState(useLoanInitialInput(EXAM_AI_SMART_URL.W, config.wDefault));

  const pct = (n: number) => `${n.toFixed(2)}%`;
  const num = (n: number, d = 1) => n.toFixed(d);

  const shareParams = useCallback(() => {
    const base = {
      [EXAM_AI_SMART_URL.A]: a,
      [EXAM_AI_SMART_URL.B]: b,
      [EXAM_AI_SMART_URL.C]: c,
      [EXAM_AI_SMART_URL.R]: r,
      [EXAM_AI_SMART_URL.T]: t,
    };
    if (config.mode === "weakness") {
      return { ...base, [EXAM_AI_SMART_URL.W]: scoresCsv, [EXAM_AI_SMART_URL.R]: r };
    }
    if (config.mode === "strategy") {
      return { ...base, [EXAM_AI_SMART_URL.M]: style };
    }
    return base;
  }, [a, b, c, r, t, scoresCsv, style, config.mode]);

  useLoanUrlSync(shareParams, [a, b, c, r, t, scoresCsv, style]);

  const result = useMemo(() => {
    switch (config.mode) {
      case "rankPredict": {
        const marksP = parseNonNegative(a, "Marks");
        const maxP = parsePositive(b, "Max marks");
        const cutP = parseNonNegative(c, "Last year cut-off");
        const poolP = t.trim() ? parsePositive(t, "Candidates") : { ok: true as const, value: undefined };
        if (!marksP.ok) return { error: marksP.error };
        if (!maxP.ok) return { error: maxP.error };
        if (!cutP.ok) return { error: cutP.error };
        if (!poolP.ok) return { error: poolP.error };
        const computed = aiRankPredictor({
          marks: marksP.value,
          maxMarks: maxP.value,
          lastYearCutoffMarks: cutP.value,
          candidates: poolP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `~${computed.estimatedRank.toLocaleString()}`,
          primaryLabel: "Estimated rank",
          rows: [
            { label: "Percentile", value: pct(computed.estimatedPercentile) },
            { label: "vs cut-off (marks)", value: num(computed.vsCutoff) },
            { label: "Outlook", value: computed.outlook },
          ],
        };
      }
      case "improvement": {
        const curP = parseAprPercent(a, "Current %");
        const tgtP = parseAprPercent(b, "Target %");
        const weeksP = parsePositive(c, "Weeks left");
        const hrsP = parseNonNegative(r, "Hours per week");
        if (!curP.ok) return { error: curP.error };
        if (!tgtP.ok) return { error: tgtP.error };
        if (!weeksP.ok) return { error: weeksP.error };
        if (!hrsP.ok) return { error: hrsP.error };
        const computed = aiScoreImprovementPlanner({
          currentPercent: curP.value,
          targetPercent: tgtP.value,
          weeksLeft: weeksP.value,
          hoursPerWeek: hrsP.value,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: `${num(computed.gapPoints)} pts`,
          primaryLabel: "Gap to target",
          rows: [
            { label: "Total study hours", value: num(computed.hoursTotal, 0) },
            { label: "Points per week", value: num(computed.pointsPerWeekNeeded) },
            ...computed.focusPlan.map((line, i) => ({ label: `Plan ${i + 1}`, value: line })),
          ],
        };
      }
      case "weakness": {
        const maxP = parsePositive(r, "Max per subject");
        if (!maxP.ok) return { error: maxP.error };
        const computed = aiWeaknessAnalyzer({ scoresCsv, maxPerSubject: maxP.value });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.weakest,
          primaryLabel: "Weakest subject",
          rows: [
            { label: "Strongest", value: computed.strongest },
            ...computed.subjects.map((s) => ({
              label: s.name,
              value: `${num(s.score, 0)} (${pct(s.percent)}) — ${s.tag}`,
            })),
            ...computed.advice.map((line, i) => ({ label: `Advice ${i + 1}`, value: line })),
          ],
        };
      }
      case "strategy": {
        const daysP = parsePositive(a, "Days until exam");
        const subjP = parsePositive(b, "Subjects");
        const hrsP = parsePositive(c, "Daily hours");
        if (!daysP.ok) return { error: daysP.error };
        if (!subjP.ok) return { error: subjP.error };
        if (!hrsP.ok) return { error: hrsP.error };
        const computed = aiStudyStrategyGenerator({
          daysUntilExam: daysP.value,
          subjectsCount: subjP.value,
          dailyHours: hrsP.value,
          style,
        });
        if ("error" in computed) return { error: computed.error };
        return {
          primary: computed.dailyPlan,
          primaryLabel: "Daily plan",
          rows: [
            { label: "Weekly mocks", value: String(computed.weeklyMocks) },
            { label: "Revision blocks", value: String(computed.revisionBlocks) },
            ...computed.strategyBullets.map((line, i) => ({ label: `Strategy ${i + 1}`, value: line })),
          ],
        };
      }
    }
  }, [config.mode, a, b, c, r, t, scoresCsv, style]);

  return (
    <CalculatorShell title={config.title} description={config.description}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          {config.mode === "rankPredict" ? (
            <>
              <div>
                <FieldLabel htmlFor="eas-marks">Your marks</FieldLabel>
                <FieldInput id="eas-marks" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-max">Max marks</FieldLabel>
                <FieldInput id="eas-max" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-cut">Last year cut-off marks</FieldLabel>
                <FieldInput id="eas-cut" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-pool">Candidates (optional)</FieldLabel>
                <FieldInput id="eas-pool" value={t} onChange={(ev) => setT(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "improvement" ? (
            <>
              <div>
                <FieldLabel htmlFor="eas-cur">Current %</FieldLabel>
                <FieldInput id="eas-cur" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-tgt">Target %</FieldLabel>
                <FieldInput id="eas-tgt" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-weeks">Weeks left</FieldLabel>
                <FieldInput id="eas-weeks" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-hrs">Hours per week</FieldLabel>
                <FieldInput id="eas-hrs" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "weakness" ? (
            <>
              <div>
                <FieldLabel htmlFor="eas-scores">Subject scores (CSV)</FieldLabel>
                <FieldInput
                  id="eas-scores"
                  value={scoresCsv}
                  onChange={(ev) => setScoresCsv(ev.target.value)}
                  placeholder="Math:60,Physics:45,Chem:70"
                />
              </div>
              <div>
                <FieldLabel htmlFor="eas-smax">Max per subject</FieldLabel>
                <FieldInput id="eas-smax" value={r} onChange={(ev) => setR(ev.target.value)} inputMode="decimal" />
              </div>
            </>
          ) : null}

          {config.mode === "strategy" ? (
            <>
              <div>
                <FieldLabel htmlFor="eas-days">Days until exam</FieldLabel>
                <FieldInput id="eas-days" value={a} onChange={(ev) => setA(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-subj">Number of subjects</FieldLabel>
                <FieldInput id="eas-subj" value={b} onChange={(ev) => setB(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-dhrs">Daily study hours</FieldLabel>
                <FieldInput id="eas-dhrs" value={c} onChange={(ev) => setC(ev.target.value)} inputMode="decimal" />
              </div>
              <div>
                <FieldLabel htmlFor="eas-style">Study style</FieldLabel>
                <select
                  id="eas-style"
                  className={selectCls}
                  value={style}
                  onChange={(ev) => setStyle(ev.target.value as "balanced" | "weakness-first" | "mock-heavy")}
                >
                  <option value="balanced">Balanced</option>
                  <option value="weakness-first">Weakness-first</option>
                  <option value="mock-heavy">Mock-heavy</option>
                </select>
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
