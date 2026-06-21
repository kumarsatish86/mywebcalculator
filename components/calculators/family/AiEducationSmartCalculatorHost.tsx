"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import {
  ChartBlock,
  HealthScoreBadge,
  InsightPanel,
  ScenarioCards,
  type ChartValueFormat,
} from "@/components/calculators/ai-finance/AiFinanceUi";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { EDU_SUBJECTS, EDU_TOPICS, type EduSubject } from "@/lib/calculators/aiEducationKnowledge";
import {
  AI_EDUCATION_URL,
  parseEnergyPeak,
  parseExamType,
  parseNoteDepth,
  parseProblemType,
  type EnergyPeak,
  type ExamType,
  type NoteDepth,
  type ProblemType,
} from "@/lib/calculators/aiEducationSmart";
import { computeEducationHostResult } from "./aiEducationHostCompute";
import type { AiEducationSlug, Mode } from "./aiEducationHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  studyPlanner: "Readiness score",
  timetable: "Schedule balance",
  examPrep: "Prep readiness",
  dailySchedule: "Focus score",
  marksAnalyzer: "Performance score",
  weakArea: "Gap severity",
  rankPredictor: "Percentile score",
  improvementPlan: "Plan feasibility",
  conceptExplainer: "Mastery readiness",
  formulaGenerator: "Revision readiness",
  questionSolver: "Solution confidence",
  notesGenerator: "Notes completeness",
};

function chartProps(mode: Mode): {
  valueFormat: ChartValueFormat;
  projectionTitle?: string;
  compareTitle?: string;
} {
  switch (mode) {
    case "studyPlanner":
      return { valueFormat: "count", compareTitle: "Hours vs even split" };
    case "timetable":
    case "dailySchedule":
      return { valueFormat: "count", compareTitle: "Time per subject" };
    case "examPrep":
      return { valueFormat: "percent", compareTitle: "Preparedness vs 75% target" };
    case "marksAnalyzer":
    case "weakArea":
      return { valueFormat: "percent", compareTitle: "Subject vs 75% target" };
    case "rankPredictor":
      return { valueFormat: "percent", compareTitle: "Score benchmarks", projectionTitle: "Score improvement path" };
    case "improvementPlan":
      return { valueFormat: "percent", projectionTitle: "Average score path", compareTitle: "Weekly milestones" };
    case "conceptExplainer":
      return { valueFormat: "percent", compareTitle: "Knowledge vs target" };
    case "formulaGenerator":
    case "notesGenerator":
      return { valueFormat: "count", compareTitle: "Section depth" };
    default:
      return { valueFormat: "percent" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM; educational use only.";

const CONFIG: Record<AiEducationSlug, Config> = {
  "aist-ai-study-planner": {
    title: "AI study planner",
    description: "Weighted subject hours, total timeline, readiness score, and hour allocation chart.",
    mode: "studyPlanner",
  },
  "aist-ai-timetable-generator": {
    title: "AI timetable generator",
    description: "Wake-to-sleep daily blocks with school, study, and break slots.",
    mode: "timetable",
  },
  "aist-ai-exam-preparation-strategy-tool": {
    title: "AI exam preparation strategy tool",
    description: "Foundation → revision → mock phases based on preparedness and exam type.",
    mode: "examPrep",
  },
  "aist-ai-daily-learning-schedule-generator": {
    title: "AI daily learning schedule generator",
    description: "Energy-aware hour-by-hour plan prioritising hardest subjects at peak focus.",
    mode: "dailySchedule",
  },
  "aist-ai-marks-analyzer": {
    title: "AI marks analyzer",
    description: "Subject-wise performance breakdown, grade band, and benchmark compare bars.",
    mode: "marksAnalyzer",
  },
  "aist-ai-weak-area-detector": {
    title: "AI weak area detector",
    description: "Gap analysis vs 75% benchmark with ranked weak subjects and drill priorities.",
    mode: "weakArea",
  },
  "aist-ai-rank-predictor": {
    title: "AI rank predictor",
    description: "Heuristic percentile and rank band from score, cohort size, and paper difficulty.",
    mode: "rankPredictor",
  },
  "aist-ai-performance-improvement-plan-generator": {
    title: "AI performance improvement plan generator",
    description: "Weekly gain targets, daily minute budget, and improvement path projection.",
    mode: "improvementPlan",
  },
  "aist-ai-concept-explainer": {
    title: "AI concept explainer",
    description: "Step-by-step study path for curated topics with prerequisite checks.",
    mode: "conceptExplainer",
  },
  "aist-ai-formula-generator": {
    title: "AI formula generator",
    description: "Subject-topic formula packs with usage notes for exam revision.",
    mode: "formulaGenerator",
  },
  "aist-ai-question-solver-step-by-step": {
    title: "AI question solver (step-by-step)",
    description: "Rule-based solver for linear, quadratic, percentage, Pythagoras, and circle area.",
    mode: "questionSolver",
  },
  "aist-ai-notes-generator": {
    title: "AI notes generator",
    description: "Structured Cornell-style note outlines at brief, standard, or detailed depth.",
    mode: "notesGenerator",
  },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

function parseSubject(raw: string): EduSubject {
  if (raw === "physics" || raw === "chemistry" || raw === "biology" || raw === "english" || raw === "computer") return raw;
  return "math";
}

export function AiEducationSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiEducationSlug] ?? CONFIG["aist-ai-study-planner"];
  const mode = config.mode;

  const [hpd, setHpd] = useState(useLoanInitialInput(AI_EDUCATION_URL.HOURS, "3"));
  const [dte, setDte] = useState(useLoanInitialInput(AI_EDUCATION_URL.DAYS, "30"));
  const [wh, setWh] = useState(useLoanInitialInput(AI_EDUCATION_URL.WAKE, "6"));
  const [sh, setSh] = useState(useLoanInitialInput(AI_EDUCATION_URL.SLEEP, "22"));
  const [ss, setSs] = useState(useLoanInitialInput(AI_EDUCATION_URL.SCHOOL_START, "8"));
  const [se, setSe] = useState(useLoanInitialInput(AI_EDUCATION_URL.SCHOOL_END, "15"));
  const [brk, setBrk] = useState(useLoanInitialInput("brk", "30"));
  const [s1n, setS1n] = useState(useLoanInitialInput("s1n", "Math"));
  const [s2n, setS2n] = useState(useLoanInitialInput("s2n", "Physics"));
  const [s3n, setS3n] = useState(useLoanInitialInput("s3n", "Chemistry"));
  const [s4n, setS4n] = useState(useLoanInitialInput("s4n", "English"));
  const [s5n, setS5n] = useState(useLoanInitialInput("s5n", ""));
  const [s6n, setS6n] = useState(useLoanInitialInput("s6n", ""));
  const [w1, setW1] = useState(useLoanInitialInput(AI_EDUCATION_URL.W1, "3"));
  const [w2, setW2] = useState(useLoanInitialInput(AI_EDUCATION_URL.W2, "2"));
  const [w3, setW3] = useState(useLoanInitialInput(AI_EDUCATION_URL.W3, "2"));
  const [w4, setW4] = useState(useLoanInitialInput(AI_EDUCATION_URL.W4, "1"));
  const [p1, setP1] = useState(useLoanInitialInput(AI_EDUCATION_URL.PREP1, "50"));
  const [p2, setP2] = useState(useLoanInitialInput(AI_EDUCATION_URL.PREP2, "45"));
  const [p3, setP3] = useState(useLoanInitialInput(AI_EDUCATION_URL.PREP3, "55"));
  const [p4, setP4] = useState(useLoanInitialInput(AI_EDUCATION_URL.PREP4, "60"));
  const [m1, setM1] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK1, "72"));
  const [m2, setM2] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK2, "65"));
  const [m3, setM3] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK3, "78"));
  const [m4, setM4] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK4, "70"));
  const [m5, setM5] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK5, "0"));
  const [m6, setM6] = useState(useLoanInitialInput(AI_EDUCATION_URL.MARK6, "0"));
  const [mx, setMx] = useState(useLoanInitialInput(AI_EDUCATION_URL.MAX, "500"));
  const [ms, setMs] = useState(useLoanInitialInput(AI_EDUCATION_URL.SCORE, "420"));
  const [tst, setTst] = useState(useLoanInitialInput(AI_EDUCATION_URL.STUDENTS, "5000"));
  const [diff, setDiff] = useState(useLoanInitialInput("diff", "55"));
  const [ca, setCa] = useState(useLoanInitialInput(AI_EDUCATION_URL.CURRENT, "62"));
  const [ta, setTa] = useState(useLoanInitialInput(AI_EDUCATION_URL.TARGET, "75"));
  const [wl, setWl] = useState(useLoanInitialInput(AI_EDUCATION_URL.WEEKS, "8"));
  const [sbj, setSbj] = useState<EduSubject>(parseSubject(useLoanInitialInput(AI_EDUCATION_URL.SUBJECT, "math")));
  const [tp, setTp] = useState(useLoanInitialInput(AI_EDUCATION_URL.TOPIC, "algebra"));
  const [prior, setPrior] = useState(useLoanInitialInput("prior", "50"));
  const [dp, setDp] = useState<NoteDepth>(parseNoteDepth(useLoanInitialInput(AI_EDUCATION_URL.DEPTH, "standard")));
  const [pt, setPt] = useState<ProblemType>(parseProblemType(useLoanInitialInput(AI_EDUCATION_URL.PROBLEM, "linear")));
  const [va, setVa] = useState(useLoanInitialInput(AI_EDUCATION_URL.A, "2"));
  const [vb, setVb] = useState(useLoanInitialInput(AI_EDUCATION_URL.B, "-6"));
  const [vc, setVc] = useState(useLoanInitialInput(AI_EDUCATION_URL.C, "0"));
  const [ep, setEp] = useState<EnergyPeak>(parseEnergyPeak(useLoanInitialInput(AI_EDUCATION_URL.ENERGY, "morning")));
  const [et, setEt] = useState<ExamType>(parseExamType(useLoanInitialInput(AI_EDUCATION_URL.EXAM, "board")));

  const inputs = useMemo(
    () => ({
      hpd, dte, wh, sh, ss, se, brk, s1n, s2n, s3n, s4n, s5n, s6n, w1, w2, w3, w4,
      p1, p2, p3, p4, m1, m2, m3, m4, m5, m6, mx, ms, tst, diff, ca, ta, wl, sbj, tp, prior, dp, pt, va, vb, vc, ep, et,
    }),
    [hpd, dte, wh, sh, ss, se, brk, s1n, s2n, s3n, s4n, s5n, s6n, w1, w2, w3, w4, p1, p2, p3, p4, m1, m2, m3, m4, m5, m6, mx, ms, tst, diff, ca, ta, wl, sbj, tp, prior, dp, pt, va, vb, vc, ep, et],
  );

  const shareParams = useCallback(
    () => ({
      [AI_EDUCATION_URL.HOURS]: hpd, [AI_EDUCATION_URL.DAYS]: dte, [AI_EDUCATION_URL.WAKE]: wh, [AI_EDUCATION_URL.SLEEP]: sh,
      [AI_EDUCATION_URL.SCHOOL_START]: ss, [AI_EDUCATION_URL.SCHOOL_END]: se, brk,
      s1n, s2n, s3n, s4n, s5n, s6n, [AI_EDUCATION_URL.W1]: w1, [AI_EDUCATION_URL.W2]: w2, [AI_EDUCATION_URL.W3]: w3, [AI_EDUCATION_URL.W4]: w4,
      [AI_EDUCATION_URL.PREP1]: p1, [AI_EDUCATION_URL.PREP2]: p2, [AI_EDUCATION_URL.PREP3]: p3, [AI_EDUCATION_URL.PREP4]: p4,
      [AI_EDUCATION_URL.MARK1]: m1, [AI_EDUCATION_URL.MARK2]: m2, [AI_EDUCATION_URL.MARK3]: m3, [AI_EDUCATION_URL.MARK4]: m4,
      [AI_EDUCATION_URL.MARK5]: m5, [AI_EDUCATION_URL.MARK6]: m6, [AI_EDUCATION_URL.MAX]: mx, [AI_EDUCATION_URL.SCORE]: ms,
      [AI_EDUCATION_URL.STUDENTS]: tst, diff, [AI_EDUCATION_URL.CURRENT]: ca, [AI_EDUCATION_URL.TARGET]: ta, [AI_EDUCATION_URL.WEEKS]: wl,
      [AI_EDUCATION_URL.SUBJECT]: sbj, [AI_EDUCATION_URL.TOPIC]: tp, prior, [AI_EDUCATION_URL.DEPTH]: dp, [AI_EDUCATION_URL.PROBLEM]: pt,
      [AI_EDUCATION_URL.A]: va, [AI_EDUCATION_URL.B]: vb, [AI_EDUCATION_URL.C]: vc, [AI_EDUCATION_URL.ENERGY]: ep, [AI_EDUCATION_URL.EXAM]: et,
    }),
    [hpd, dte, wh, sh, ss, se, brk, s1n, s2n, s3n, s4n, s5n, s6n, w1, w2, w3, w4, p1, p2, p3, p4, m1, m2, m3, m4, m5, m6, mx, ms, tst, diff, ca, ta, wl, sbj, tp, prior, dp, pt, va, vb, vc, ep, et],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeEducationHostResult(mode, inputs), [mode, inputs]);

  const field = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const subjectTopicFields = (
    <>
      <div>
        <FieldLabel htmlFor="sbj">Subject</FieldLabel>
        <select id="sbj" value={sbj} onChange={(e) => { setSbj(parseSubject(e.target.value)); setTp(EDU_TOPICS[parseSubject(e.target.value)][0]?.id ?? "algebra"); }} className={selectCls}>
          {EDU_SUBJECTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
      </div>
      <div>
        <FieldLabel htmlFor="tp">Topic</FieldLabel>
        <select id="tp" value={tp} onChange={(e) => setTp(e.target.value)} className={selectCls}>
          {EDU_TOPICS[sbj].map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
        </select>
      </div>
    </>
  );

  const chart = chartProps(mode);

  return (
    <CalculatorShell
      title={config.title}
      description={`${config.description} ${AI_NOTE}`}
      resultKey={"error" in result ? "err" : `${result.primary}-${result.healthScore ?? 0}`}
      result={
        "error" in result ? (
          <p className="text-sm font-medium text-rose-700">{result.error}</p>
        ) : (
          <div className="space-y-3 text-sm">
            {result.healthScore != null && result.grade ? (
              <HealthScoreBadge score={result.healthScore} grade={result.grade} scoreLabel={SCORE_LABEL[mode]} />
            ) : null}
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-2xl font-semibold text-[var(--accent-bright)] sm:text-3xl">{result.primary}</p>
            </div>
            {result.rows?.map((row, i) => <Row key={`${row.label}-${i}`} label={row.label} value={row.value} />)}
            {result.insights?.length ? <InsightPanel insights={result.insights.slice(0, 3)} /> : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "studyPlanner" && (
          <>
            {field("dte", "Days to exam", dte, setDte)}
            {field("hpd", "Study hours / day", hpd, setHpd)}
            {[["s1n", s1n, setS1n, "w1", w1, setW1], ["s2n", s2n, setS2n, "w2", w2, setW2], ["s3n", s3n, setS3n, "w3", w3, setW3], ["s4n", s4n, setS4n, "w4", w4, setW4]].map(([nk, nv, ns, wk, wv, ws]) => (
              <div key={nk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel htmlFor={nk as string}>Subject</FieldLabel><FieldInput id={nk as string} value={nv as string} onChange={(e) => (ns as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(wk as string, "Difficulty weight (1–5)", wv as string, ws as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "timetable" && (
          <>
            {field("wh", "Wake hour (0–23)", wh, setWh)}
            {field("sh", "Sleep hour (0–23)", sh, setSh)}
            {field("ss", "School start hour", ss, setSs)}
            {field("se", "School end hour", se, setSe)}
            {field("hpd", "Study hours / day", hpd, setHpd)}
            {field("brk", "Break after school (min)", brk, setBrk)}
            {field("s1n", "Subject 1", s1n, setS1n)}
            {field("s2n", "Subject 2", s2n, setS2n)}
            {field("s3n", "Subject 3", s3n, setS3n)}
          </>
        )}
        {mode === "examPrep" && (
          <>
            {field("dte", "Days left", dte, setDte)}
            <div><FieldLabel htmlFor="et">Exam type</FieldLabel><select id="et" value={et} onChange={(e) => setEt(parseExamType(e.target.value))} className={selectCls}><option value="board">Board</option><option value="competitive">Competitive</option><option value="unit">Unit test</option></select></div>
            {[["s1n", s1n, setS1n, "p1", p1, setP1], ["s2n", s2n, setS2n, "p2", p2, setP2], ["s3n", s3n, setS3n, "p3", p3, setP3], ["s4n", s4n, setS4n, "p4", p4, setP4]].map(([nk, nv, ns, pk, pv, ps]) => (
              <div key={nk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel htmlFor={nk as string}>Subject</FieldLabel><FieldInput id={nk as string} value={nv as string} onChange={(e) => (ns as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(pk as string, "Preparedness %", pv as string, ps as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "dailySchedule" && (
          <>
            {field("hpd", "Hours available today", hpd, setHpd)}
            <div><FieldLabel htmlFor="ep">Peak energy</FieldLabel><select id="ep" value={ep} onChange={(e) => setEp(parseEnergyPeak(e.target.value))} className={selectCls}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select></div>
            {field("s1n", "Subject 1 (priority 1–5)", s1n, setS1n)}{field("w1", "Priority", w1, setW1)}
            {field("s2n", "Subject 2", s2n, setS2n)}{field("w2", "Priority", w2, setW2)}
            {field("s3n", "Subject 3", s3n, setS3n)}{field("w3", "Priority", w3, setW3)}
          </>
        )}
        {(mode === "marksAnalyzer" || mode === "weakArea") && (
          <>
            {field("mx", "Max marks per subject", mx, setMx)}
            {[["s1n", s1n, setS1n, "m1", m1, setM1], ["s2n", s2n, setS2n, "m2", m2, setM2], ["s3n", s3n, setS3n, "m3", m3, setM3], ["s4n", s4n, setS4n, "m4", m4, setM4]].map(([nk, nv, ns, mk, mv, ms2]) => (
              <div key={nk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel htmlFor={nk as string}>Subject</FieldLabel><FieldInput id={nk as string} value={nv as string} onChange={(e) => (ns as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(mk as string, "Marks", mv as string, ms2 as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "rankPredictor" && (
          <>{field("ms", "Your score", ms, setMs)}{field("mx", "Max score", mx, setMx)}{field("tst", "Total students", tst, setTst)}{field("diff", "Paper difficulty (0–100)", diff, setDiff)}</>
        )}
        {mode === "improvementPlan" && (
          <>{field("ca", "Current average %", ca, setCa)}{field("ta", "Target average %", ta, setTa)}{field("wl", "Weeks left", wl, setWl)}</>
        )}
        {(mode === "conceptExplainer" || mode === "formulaGenerator" || mode === "notesGenerator") && (
          <>{subjectTopicFields}{mode === "conceptExplainer" && field("prior", "Prior knowledge (0–100)", prior, setPrior)}{mode === "notesGenerator" && (
            <div><FieldLabel htmlFor="dp">Depth</FieldLabel><select id="dp" value={dp} onChange={(e) => setDp(parseNoteDepth(e.target.value))} className={selectCls}><option value="brief">Brief</option><option value="standard">Standard</option><option value="detailed">Detailed</option></select></div>
          )}</>
        )}
        {mode === "questionSolver" && (
          <>
            <div><FieldLabel htmlFor="pt">Problem type</FieldLabel><select id="pt" value={pt} onChange={(e) => setPt(parseProblemType(e.target.value))} className={selectCls}><option value="linear">Linear equation</option><option value="quadratic">Quadratic</option><option value="percentage">Percentage</option><option value="pythagoras">Pythagoras</option><option value="area-circle">Circle area</option></select></div>
            {field("va", pt === "linear" || pt === "quadratic" ? "Coefficient a" : "Value a", va, setVa)}
            {field("vb", pt === "linear" || pt === "quadratic" ? "Constant b" : "Value b", vb, setVb)}
            {(pt === "quadratic" || pt === "linear") && field("vc", pt === "quadratic" ? "Constant c" : "Constant (optional)", vc, setVc)}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock
            slices={result.chartSlices}
            compare={result.compareRows}
            projection={result.projection}
            compareTitle={chart.compareTitle}
            projectionTitle={chart.projectionTitle}
            valueFormat={chart.valueFormat}
            compareFormat={chart.valueFormat}
          />
          {result.milestones?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Weekly milestones</p>
              {result.milestones.map((m) => (
                <div key={m.week} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>Week {m.week}</span>
                  <span className="font-mono">{m.target}%</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.usageTips?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">When to use</p>
              {result.usageTips.map((t) => (
                <div key={t} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]">{t}</div>
              ))}
            </div>
          ) : null}
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Exam phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">{p.phase}</span>
                    <span className="font-mono text-[var(--muted)]">{p.days} days</span>
                  </div>
                  <p className="mt-1 text-[var(--muted)]">{p.focus}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.schedule?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Schedule</p>
              {result.schedule.map((s) => (
                <div key={`${s.time}-${s.activity}`} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--muted)]">{s.time}</span>
                  <span>{s.activity}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.steps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Step-by-step</p>
              {result.steps.map((s) => (
                <div key={s.step} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--accent)]">Step {s.step}: </span>{s.text}
                </div>
              ))}
            </div>
          ) : null}
          {result.formulas?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Formulas</p>
              {result.formulas.map((f) => (
                <div key={f.name} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-medium">{f.name}</p>
                  <p className="font-mono text-[var(--accent-bright)]">{f.expression}</p>
                  {f.note ? <p className="text-[var(--muted)]">{f.note}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {result.outline?.length ? (
            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Notes outline</p>
              {result.outline.map((sec) => (
                <div key={sec.title} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-medium">{sec.title}</p>
                  <ul className="mt-1 list-inside list-disc text-[var(--muted)]">{sec.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedSubjects?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Subject ranking</p>
              {result.rankedSubjects.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name}</span>
                  <span className="font-mono">{s.score}% · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.scenarios?.length ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Scenarios</p>
              <ScenarioCards scenarios={result.scenarios} valueFormat={mode === "improvementPlan" ? "percent" : "currency"} />
            </div>
          ) : null}
          {result.insights && result.insights.length > 3 ? <InsightPanel insights={result.insights.slice(3)} title="More insights" /> : null}
        </>
      )}
    </CalculatorShell>
  );
}
