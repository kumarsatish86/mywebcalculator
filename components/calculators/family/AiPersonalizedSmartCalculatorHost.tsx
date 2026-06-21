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
import { AI_PERS_URL, parseCareerField, parseEducation, parseRisk, type CareerField, type EducationLevel, type RiskLevel } from "@/lib/calculators/aiPersonalizedSmart";
import { computePersonalizedHostResult } from "./aiPersonalizedHostCompute";
import type { AiPersonalizedSlug, Mode } from "./aiPersonalizedHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  careerPath: "Career fit",
  skillGap: "Role readiness",
  sideHustle: "Hustle fit",
  businessIdea: "Idea fit",
  incomeGrowth: "Growth feasibility",
};

function chartProps(mode: Mode): { valueFormat: ChartValueFormat; projectionTitle?: string; compareTitle?: string } {
  switch (mode) {
    case "careerPath":
      return { valueFormat: "score", compareTitle: "Skill benchmarks", projectionTitle: "Career progress path" };
    case "skillGap":
      return { valueFormat: "score", compareTitle: "Skill levels vs target", projectionTitle: "Readiness timeline" };
    case "sideHustle":
      return { valueFormat: "currency", compareTitle: "Income potential", projectionTitle: "Side income milestones" };
    case "businessIdea":
      return { valueFormat: "score", compareTitle: "Idea fit scores" };
    case "incomeGrowth":
      return { valueFormat: "currency", compareTitle: "Growth levers", projectionTitle: "Income growth path" };
    default:
      return { valueFormat: "currency" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or career/financial advice; educational brainstorming only.";

const CONFIG: Record<AiPersonalizedSlug, Config> = {
  "aist-ai-career-path-advisor": { title: "AI career path advisor", description: "Field fit score, next-role target, 18-month phases, skill benchmarks, and transition action steps.", mode: "careerPath" },
  "aist-ai-skill-gap-analyzer": { title: "AI skill gap analyzer", description: "Role readiness score, ranked skill gaps, 6-month learning phases, and course/project checklist.", mode: "skillGap" },
  "aist-ai-side-hustle-finder": { title: "AI side hustle finder", description: "Ranked hustles by hours, capital, skills, and risk with income scenarios and launch steps.", mode: "sideHustle" },
  "aist-ai-business-idea-generator": { title: "AI business idea generator", description: "Scored ideas from budget, market, competition, and interests with validation phases.", mode: "businessIdea" },
  "aist-ai-income-growth-planner": { title: "AI income growth planner", description: "Required growth rate, income projection, ranked levers, and milestone path to your goal.", mode: "incomeGrowth" },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

const ROLE_OPTIONS = [
  { value: "software-engineer", label: "Software engineer" },
  { value: "data-analyst", label: "Data analyst" },
  { value: "product-manager", label: "Product manager" },
  { value: "designer", label: "Designer" },
  { value: "marketer", label: "Marketer" },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function AiPersonalizedSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiPersonalizedSlug] ?? CONFIG["aist-ai-career-path-advisor"];
  const mode = config.mode;

  const [exp, setExp] = useState(useLoanInitialInput(AI_PERS_URL.EXP, "3"));
  const [curr, setCurr] = useState<CareerField>(parseCareerField(useLoanInitialInput(AI_PERS_URL.CURR, "tech")));
  const [target, setTarget] = useState<CareerField>(parseCareerField(useLoanInitialInput(AI_PERS_URL.TARGET, "tech")));
  const [edu, setEdu] = useState<EducationLevel>(parseEducation(useLoanInitialInput(AI_PERS_URL.EDU, "bachelor")));
  const [skills, setSkills] = useState(useLoanInitialInput(AI_PERS_URL.SKILLS, "4"));
  const [role, setRole] = useState(useLoanInitialInput("role", "software-engineer"));
  const [s1, setS1] = useState(useLoanInitialInput(AI_PERS_URL.S1, "6"));
  const [s2, setS2] = useState(useLoanInitialInput(AI_PERS_URL.S2, "5"));
  const [s3, setS3] = useState(useLoanInitialInput(AI_PERS_URL.S3, "4"));
  const [s4, setS4] = useState(useLoanInitialInput(AI_PERS_URL.S4, "5"));
  const [hrs, setHrs] = useState(useLoanInitialInput(AI_PERS_URL.HRS, "10"));
  const [cap, setCap] = useState(useLoanInitialInput(AI_PERS_URL.CAP, "15000"));
  const [risk, setRisk] = useState<RiskLevel>(parseRisk(useLoanInitialInput(AI_PERS_URL.RISK, "low")));
  const [int1, setInt1] = useState(useLoanInitialInput(AI_PERS_URL.INT1, "education"));
  const [int2, setInt2] = useState(useLoanInitialInput(AI_PERS_URL.INT2, "tech"));
  const [bud, setBud] = useState(useLoanInitialInput(AI_PERS_URL.BUD, "80000"));
  const [mkt, setMkt] = useState(useLoanInitialInput(AI_PERS_URL.MKT, "7"));
  const [comp, setComp] = useState(useLoanInitialInput(AI_PERS_URL.COMP, "6"));
  const [inc, setInc] = useState(useLoanInitialInput(AI_PERS_URL.INC, "65000"));
  const [goal, setGoal] = useState(useLoanInitialInput(AI_PERS_URL.GOAL, "100000"));
  const [save, setSave] = useState(useLoanInitialInput(AI_PERS_URL.SAVE, "15"));
  const [inv, setInv] = useState(useLoanInitialInput(AI_PERS_URL.INVEST, "30000"));
  const [mo, setMo] = useState(useLoanInitialInput(AI_PERS_URL.MO, "18"));

  const inputs = useMemo(
    () => ({ exp, curr, target, edu, skills, role, s1, s2, s3, s4, hrs, cap, risk, int1, int2, bud, mkt, comp, inc, goal, save, inv, mo }),
    [exp, curr, target, edu, skills, role, s1, s2, s3, s4, hrs, cap, risk, int1, int2, bud, mkt, comp, inc, goal, save, inv, mo],
  );

  const shareParams = useCallback(
    () => ({
      [AI_PERS_URL.EXP]: exp, [AI_PERS_URL.CURR]: curr, [AI_PERS_URL.TARGET]: target, [AI_PERS_URL.EDU]: edu, [AI_PERS_URL.SKILLS]: skills, role,
      [AI_PERS_URL.S1]: s1, [AI_PERS_URL.S2]: s2, [AI_PERS_URL.S3]: s3, [AI_PERS_URL.S4]: s4,
      [AI_PERS_URL.HRS]: hrs, [AI_PERS_URL.CAP]: cap, [AI_PERS_URL.RISK]: risk,
      [AI_PERS_URL.INT1]: int1, [AI_PERS_URL.INT2]: int2, [AI_PERS_URL.BUD]: bud, [AI_PERS_URL.MKT]: mkt, [AI_PERS_URL.COMP]: comp,
      [AI_PERS_URL.INC]: inc, [AI_PERS_URL.GOAL]: goal, [AI_PERS_URL.SAVE]: save, [AI_PERS_URL.INVEST]: inv, [AI_PERS_URL.MO]: mo,
    }),
    [exp, curr, target, edu, skills, role, s1, s2, s3, s4, hrs, cap, risk, int1, int2, bud, mkt, comp, inc, goal, save, inv, mo],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computePersonalizedHostResult(mode, inputs), [mode, inputs]);

  const field = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
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
        {mode === "careerPath" && (
          <>
            {field("exp", "Years of experience", exp, setExp)}
            {field("skills", "Relevant skills (count)", skills, setSkills)}
            <div>
              <FieldLabel htmlFor="curr">Current field</FieldLabel>
              <select id="curr" value={curr} onChange={(e) => setCurr(parseCareerField(e.target.value))} className={selectCls}>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="health">Health</option>
                <option value="creative">Creative</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="target">Target field</FieldLabel>
              <select id="target" value={target} onChange={(e) => setTarget(parseCareerField(e.target.value))} className={selectCls}>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="health">Health</option>
                <option value="creative">Creative</option>
                <option value="business">Business</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="edu">Education</FieldLabel>
              <select id="edu" value={edu} onChange={(e) => setEdu(parseEducation(e.target.value))} className={selectCls}>
                <option value="highschool">High school</option>
                <option value="bachelor">Bachelor&apos;s</option>
                <option value="master">Master&apos;s</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </>
        )}
        {mode === "skillGap" && (
          <>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="role">Target role</FieldLabel>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className={selectCls}>
                {ROLE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {field("s1", "Skill 1 level (0–10)", s1, setS1)}
            {field("s2", "Skill 2 level (0–10)", s2, setS2)}
            {field("s3", "Skill 3 level (0–10)", s3, setS3)}
            {field("s4", "Skill 4 level (0–10)", s4, setS4)}
          </>
        )}
        {mode === "sideHustle" && (
          <>
            {field("hrs", "Hours per week", hrs, setHrs)}
            {field("cap", "Starting capital (₹)", cap, setCap)}
            {field("skills", "Skill score (0–10)", skills, setSkills)}
            <div>
              <FieldLabel htmlFor="risk">Risk tolerance</FieldLabel>
              <select id="risk" value={risk} onChange={(e) => setRisk(parseRisk(e.target.value))} className={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        )}
        {mode === "businessIdea" && (
          <>
            {field("int1", "Interest 1 (e.g. education)", int1, setInt1)}
            {field("int2", "Interest 2 (e.g. tech)", int2, setInt2)}
            {field("bud", "Budget (₹)", bud, setBud)}
            {field("mkt", "Market opportunity (0–10)", mkt, setMkt)}
            {field("comp", "Competition level (0–10)", comp, setComp)}
          </>
        )}
        {mode === "incomeGrowth" && (
          <>
            {field("inc", "Current monthly income (₹)", inc, setInc)}
            {field("goal", "Goal monthly income (₹)", goal, setGoal)}
            {field("save", "Savings rate %", save, setSave)}
            {field("inv", "Skill investment budget (₹)", inv, setInv)}
            {field("mo", "Timeline (months)", mo, setMo)}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock slices={result.chartSlices} compare={result.compareRows} projection={result.projection} compareTitle={chart.compareTitle} projectionTitle={chart.projectionTitle} valueFormat={chart.valueFormat} compareFormat={chart.valueFormat} />
          {result.skillGaps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Skill gaps</p>
              {result.skillGaps.map((g) => (
                <div key={g.skill} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{g.skill}</span><span className="font-mono">{g.gap} pts · {g.priority}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.ideaScores?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Idea scores</p>
              {result.ideaScores.map((i) => (
                <div key={i.idea} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{i.idea}</span><span className="font-mono">{i.score}/100 · {i.fit}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedLevers?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Growth levers</p>
              {result.rankedLevers.map((l) => (
                <div key={l.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{l.name}</span><span className="font-mono">+{l.save}% · {l.effort}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Roadmap phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4"><span className="font-medium">{p.phase}</span><span className="font-mono text-[var(--muted)]">{p.days} days</span></div>
                  <p className="mt-1 text-[var(--muted)]">{p.focus}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.steps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Action steps</p>
              {result.steps.map((s) => (
                <div key={s.step} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--accent)]">Step {s.step}: </span>{s.text}
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedItems?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Rankings</p>
              {result.rankedItems.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name}</span><span className="font-mono">{s.score} · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.milestones?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Milestones</p>
              {result.milestones.map((m) => (
                <div key={m.week} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>Month {m.week}</span>
                  <span className="font-mono">
                    {mode === "careerPath" || mode === "skillGap" ? `${m.target}/100` : mode === "incomeGrowth" || mode === "sideHustle" ? `₹${m.target.toLocaleString("en-IN")}` : String(m.target)}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {result.usageTips?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Tips</p>
              {result.usageTips.map((t) => (
                <div key={t} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm text-[var(--muted)]">{t}</div>
              ))}
            </div>
          ) : null}
          {result.scenarios?.length ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Scenarios</p>
              <ScenarioCards scenarios={result.scenarios} valueFormat={mode === "businessIdea" ? "currency" : "currency"} />
            </div>
          ) : null}
        </>
      )}
    </CalculatorShell>
  );
}
