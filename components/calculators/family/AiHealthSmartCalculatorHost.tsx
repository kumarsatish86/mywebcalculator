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
import {
  AI_HEALTH_URL,
  parseActivityLevel,
  parseDietType,
  parseExperienceLevel,
  parseFitnessGoal,
  parseGymSplit,
  parseHomeEquipment,
  parseHomeSpace,
  parseSex,
  parseWorkoutFocus,
  type ActivityLevel,
  type DietType,
  type ExperienceLevel,
  type FitnessGoal,
  type GymSplit,
  type HomeEquipment,
  type HomeSpace,
  type Sex,
  type WorkoutFocus,
} from "@/lib/calculators/aiHealthSmart";
import { computeHealthHostResult } from "./aiHealthHostCompute";
import type { AiHealthSlug, Mode } from "./aiHealthHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  fitnessPlanner: "Fitness readiness",
  weightLoss: "Plan sustainability",
  dietPlanner: "Nutrition balance",
  calorieOptimization: "Macro alignment",
  workoutGenerator: "Session readiness",
  muscleGain: "Bulk feasibility",
  homeWorkout: "Home readiness",
  gymRoutine: "Program balance",
  sleepOptimizer: "Sleep score",
  stressAnalyzer: "Wellness score",
  dailyHabit: "Habit stack score",
};

function chartProps(mode: Mode): {
  valueFormat: ChartValueFormat;
  projectionTitle?: string;
  compareTitle?: string;
} {
  switch (mode) {
    case "fitnessPlanner":
    case "dietPlanner":
    case "calorieOptimization":
      return { valueFormat: "count", compareTitle: "Macro / meal split" };
    case "weightLoss":
    case "muscleGain":
      return { valueFormat: "score", compareTitle: "Weight benchmarks", projectionTitle: "Weight projection" };
    case "workoutGenerator":
    case "homeWorkout":
    case "dailyHabit":
      return { valueFormat: "count", compareTitle: "Time allocation" };
    case "gymRoutine":
      return { valueFormat: "count", compareTitle: "Exercises per day" };
    case "sleepOptimizer":
      return { valueFormat: "score", compareTitle: "Sleep factors" };
    case "stressAnalyzer":
      return { valueFormat: "score", compareTitle: "Stress vs healthy (4)" };
    default:
      return { valueFormat: "count" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or medical advice; educational use only.";

const MEDICAL_DISCLAIMER = "Not medical advice. Consult a doctor before changing diet, exercise, or sleep routines.";

const CONFIG: Record<AiHealthSlug, Config> = {
  "aist-ai-fitness-planner": {
    title: "AI fitness planner",
    description: "TDEE, macro split, weekly training minutes, and day-by-day movement plan from your stats and goal.",
    mode: "fitnessPlanner",
  },
  "aist-ai-weight-loss-strategy-tool": {
    title: "AI weight loss strategy tool",
    description: "Sustainable deficit, weekly loss pace, milestones, and weight projection path to your target.",
    mode: "weightLoss",
  },
  "aist-ai-diet-planner": {
    title: "AI diet planner",
    description: "Veg, non-veg, or custom meal templates scaled to your calorie and protein targets.",
    mode: "dietPlanner",
  },
  "aist-ai-calorie-optimization-tool": {
    title: "AI calorie optimization tool",
    description: "BMR, TDEE, and optimized macro split for lose, maintain, or gain goals.",
    mode: "calorieOptimization",
  },
  "aist-ai-workout-generator": {
    title: "AI workout generator",
    description: "Focus-area sessions with sets, reps, rest periods, and progression tips.",
    mode: "workoutGenerator",
  },
  "aist-ai-muscle-gain-planner": {
    title: "AI muscle gain planner",
    description: "Lean bulk calories, protein target, weekly volume, and periodization phases.",
    mode: "muscleGain",
  },
  "aist-ai-home-workout-planner": {
    title: "AI home workout planner",
    description: "Space-aware circuits with bodyweight, basic, or full home equipment options.",
    mode: "homeWorkout",
  },
  "aist-ai-gym-routine-builder": {
    title: "AI gym routine builder",
    description: "Push-pull-legs, upper-lower, full-body, or bro splits with exercise lists per day.",
    mode: "gymRoutine",
  },
  "aist-ai-sleep-optimizer": {
    title: "AI sleep optimizer",
    description: "Sleep duration score, screen-curfew analysis, and step-by-step sleep hygiene path.",
    mode: "sleepOptimizer",
  },
  "aist-ai-stress-analyzer": {
    title: "AI stress analyzer",
    description: "Multi-factor stress index across work, health, social, and finance with coping insights.",
    mode: "stressAnalyzer",
  },
  "aist-ai-daily-habit-planner": {
    title: "AI daily habit planner",
    description: "Time-blocked habit stack from wake time with priority ordering and smart suggestions.",
    mode: "dailyHabit",
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

function bodyFields(
  age: string, setAge: (v: string) => void,
  wt: string, setWt: (v: string) => void,
  ht: string, setHt: (v: string) => void,
  sx: Sex, setSx: (v: Sex) => void,
  act: ActivityLevel, setAct: (v: ActivityLevel) => void,
) {
  return (
    <>
      <div>
        <FieldLabel htmlFor="age">Age</FieldLabel>
        <FieldInput id="age" inputMode="decimal" value={age} onChange={(e) => setAge(e.target.value)} className="mt-2" />
      </div>
      <div>
        <FieldLabel htmlFor="wt">Weight (kg)</FieldLabel>
        <FieldInput id="wt" inputMode="decimal" value={wt} onChange={(e) => setWt(e.target.value)} className="mt-2" />
      </div>
      <div>
        <FieldLabel htmlFor="ht">Height (cm)</FieldLabel>
        <FieldInput id="ht" inputMode="decimal" value={ht} onChange={(e) => setHt(e.target.value)} className="mt-2" />
      </div>
      <div>
        <FieldLabel htmlFor="sx">Sex</FieldLabel>
        <select id="sx" value={sx} onChange={(e) => setSx(parseSex(e.target.value))} className={selectCls}>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <FieldLabel htmlFor="act">Activity level</FieldLabel>
        <select id="act" value={act} onChange={(e) => setAct(parseActivityLevel(e.target.value))} className={selectCls}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="athlete">Athlete</option>
        </select>
      </div>
    </>
  );
}

export function AiHealthSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiHealthSlug] ?? CONFIG["aist-ai-fitness-planner"];
  const mode = config.mode;

  const [age, setAge] = useState(useLoanInitialInput(AI_HEALTH_URL.AGE, "28"));
  const [wt, setWt] = useState(useLoanInitialInput(AI_HEALTH_URL.WEIGHT, "72"));
  const [ht, setHt] = useState(useLoanInitialInput(AI_HEALTH_URL.HEIGHT, "170"));
  const [gl, setGl] = useState<FitnessGoal>(parseFitnessGoal(useLoanInitialInput(AI_HEALTH_URL.GOAL, "maintain")));
  const [dys, setDys] = useState(useLoanInitialInput(AI_HEALTH_URL.DAYS, "4"));
  const [tgt, setTgt] = useState(useLoanInitialInput(AI_HEALTH_URL.TARGET, "65"));
  const [wl, setWl] = useState(useLoanInitialInput(AI_HEALTH_URL.WEEKS, "12"));
  const [act, setAct] = useState<ActivityLevel>(parseActivityLevel(useLoanInitialInput(AI_HEALTH_URL.ACTIVITY, "moderate")));
  const [diet, setDiet] = useState<DietType>(parseDietType(useLoanInitialInput(AI_HEALTH_URL.DIET, "veg")));
  const [cal, setCal] = useState(useLoanInitialInput(AI_HEALTH_URL.CALORIES, "2000"));
  const [mls, setMls] = useState(useLoanInitialInput(AI_HEALTH_URL.MEALS, "4"));
  const [sx, setSx] = useState<Sex>(parseSex(useLoanInitialInput(AI_HEALTH_URL.SEX, "male")));
  const [fcs, setFcs] = useState<WorkoutFocus>(parseWorkoutFocus(useLoanInitialInput(AI_HEALTH_URL.FOCUS, "full")));
  const [dur, setDur] = useState(useLoanInitialInput(AI_HEALTH_URL.DURATION, "45"));
  const [lvl, setLvl] = useState<ExperienceLevel>(parseExperienceLevel(useLoanInitialInput(AI_HEALTH_URL.LEVEL, "intermediate")));
  const [exp, setExp] = useState<ExperienceLevel>(parseExperienceLevel(useLoanInitialInput(AI_HEALTH_URL.EXPERIENCE, "intermediate")));
  const [prt, setPrt] = useState(useLoanInitialInput(AI_HEALTH_URL.PROTEIN, "2"));
  const [sur, setSur] = useState(useLoanInitialInput(AI_HEALTH_URL.SURPLUS, "12"));
  const [spc, setSpc] = useState<HomeSpace>(parseHomeSpace(useLoanInitialInput(AI_HEALTH_URL.SPACE, "medium")));
  const [eqp, setEqp] = useState<HomeEquipment>(parseHomeEquipment(useLoanInitialInput(AI_HEALTH_URL.EQUIP, "basic")));
  const [spl, setSpl] = useState<GymSplit>(parseGymSplit(useLoanInitialInput(AI_HEALTH_URL.SPLIT, "push-pull-legs")));
  const [bed, setBed] = useState(useLoanInitialInput(AI_HEALTH_URL.BED, "23"));
  const [wake, setWake] = useState(useLoanInitialInput(AI_HEALTH_URL.WAKE, "7"));
  const [qlt, setQlt] = useState(useLoanInitialInput(AI_HEALTH_URL.QUALITY, "65"));
  const [scr, setScr] = useState(useLoanInitialInput(AI_HEALTH_URL.SCREEN, "45"));
  const [s1, setS1] = useState(useLoanInitialInput(AI_HEALTH_URL.S1, "6"));
  const [s2, setS2] = useState(useLoanInitialInput(AI_HEALTH_URL.S2, "4"));
  const [s3, setS3] = useState(useLoanInitialInput(AI_HEALTH_URL.S3, "5"));
  const [s4, setS4] = useState(useLoanInitialInput(AI_HEALTH_URL.S4, "5"));
  const [h1, setH1] = useState(useLoanInitialInput(AI_HEALTH_URL.H1, "Morning stretch"));
  const [h2, setH2] = useState(useLoanInitialInput(AI_HEALTH_URL.H2, "Deep work block"));
  const [h3, setH3] = useState(useLoanInitialInput(AI_HEALTH_URL.H3, "Walk / movement"));
  const [h4, setH4] = useState(useLoanInitialInput(AI_HEALTH_URL.H4, "Evening journal"));
  const [h1m, setH1m] = useState(useLoanInitialInput(AI_HEALTH_URL.H1M, "15"));
  const [h2m, setH2m] = useState(useLoanInitialInput(AI_HEALTH_URL.H2M, "60"));
  const [h3m, setH3m] = useState(useLoanInitialInput(AI_HEALTH_URL.H3M, "20"));
  const [h4m, setH4m] = useState(useLoanInitialInput(AI_HEALTH_URL.H4M, "10"));

  const inputs = useMemo(
    () => ({
      age, wt, ht, gl, dys, tgt, wl, act, diet, cal, mls, sx, fcs, dur, lvl, exp, prt, sur, spc, eqp, spl,
      bed, wake, qlt, scr, s1, s2, s3, s4, h1, h2, h3, h4, h1m, h2m, h3m, h4m,
    }),
    [age, wt, ht, gl, dys, tgt, wl, act, diet, cal, mls, sx, fcs, dur, lvl, exp, prt, sur, spc, eqp, spl, bed, wake, qlt, scr, s1, s2, s3, s4, h1, h2, h3, h4, h1m, h2m, h3m, h4m],
  );

  const shareParams = useCallback(
    () => ({
      [AI_HEALTH_URL.AGE]: age, [AI_HEALTH_URL.WEIGHT]: wt, [AI_HEALTH_URL.HEIGHT]: ht, [AI_HEALTH_URL.GOAL]: gl,
      [AI_HEALTH_URL.DAYS]: dys, [AI_HEALTH_URL.TARGET]: tgt, [AI_HEALTH_URL.WEEKS]: wl, [AI_HEALTH_URL.ACTIVITY]: act,
      [AI_HEALTH_URL.DIET]: diet, [AI_HEALTH_URL.CALORIES]: cal, [AI_HEALTH_URL.MEALS]: mls, [AI_HEALTH_URL.SEX]: sx,
      [AI_HEALTH_URL.FOCUS]: fcs, [AI_HEALTH_URL.DURATION]: dur, [AI_HEALTH_URL.LEVEL]: lvl, [AI_HEALTH_URL.EXPERIENCE]: exp,
      [AI_HEALTH_URL.PROTEIN]: prt, [AI_HEALTH_URL.SURPLUS]: sur, [AI_HEALTH_URL.SPACE]: spc, [AI_HEALTH_URL.EQUIP]: eqp,
      [AI_HEALTH_URL.SPLIT]: spl, [AI_HEALTH_URL.BED]: bed, [AI_HEALTH_URL.WAKE]: wake, [AI_HEALTH_URL.QUALITY]: qlt,
      [AI_HEALTH_URL.SCREEN]: scr, [AI_HEALTH_URL.S1]: s1, [AI_HEALTH_URL.S2]: s2, [AI_HEALTH_URL.S3]: s3, [AI_HEALTH_URL.S4]: s4,
      [AI_HEALTH_URL.H1]: h1, [AI_HEALTH_URL.H2]: h2, [AI_HEALTH_URL.H3]: h3, [AI_HEALTH_URL.H4]: h4,
      [AI_HEALTH_URL.H1M]: h1m, [AI_HEALTH_URL.H2M]: h2m, [AI_HEALTH_URL.H3M]: h3m, [AI_HEALTH_URL.H4M]: h4m,
    }),
    [age, wt, ht, gl, dys, tgt, wl, act, diet, cal, mls, sx, fcs, dur, lvl, exp, prt, sur, spc, eqp, spl, bed, wake, qlt, scr, s1, s2, s3, s4, h1, h2, h3, h4, h1m, h2m, h3m, h4m],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeHealthHostResult(mode, inputs), [mode, inputs]);

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
            <p className="text-xs text-[var(--muted)]">{MEDICAL_DISCLAIMER}</p>
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {(mode === "fitnessPlanner" || mode === "weightLoss" || mode === "calorieOptimization") &&
          bodyFields(age, setAge, wt, setWt, ht, setHt, sx, setSx, act, setAct)}
        {mode === "fitnessPlanner" && (
          <>
            <div>
              <FieldLabel htmlFor="gl">Goal</FieldLabel>
              <select id="gl" value={gl} onChange={(e) => setGl(parseFitnessGoal(e.target.value))} className={selectCls}>
                <option value="lose">Lose weight</option>
                <option value="maintain">Maintain</option>
                <option value="gain">Gain muscle</option>
              </select>
            </div>
            {field("dys", "Training days / week", dys, setDys)}
          </>
        )}
        {mode === "weightLoss" && (
          <>{field("tgt", "Target weight (kg)", tgt, setTgt)}{field("wl", "Weeks to target", wl, setWl)}</>
        )}
        {mode === "dietPlanner" && (
          <>
            {field("wt", "Weight (kg)", wt, setWt)}
            {field("cal", "Target calories", cal, setCal)}
            {field("mls", "Meals per day", mls, setMls)}
            <div>
              <FieldLabel htmlFor="diet">Diet type</FieldLabel>
              <select id="diet" value={diet} onChange={(e) => setDiet(parseDietType(e.target.value))} className={selectCls}>
                <option value="veg">Vegetarian</option>
                <option value="nonveg">Non-vegetarian</option>
                <option value="custom">Custom / flexible</option>
              </select>
            </div>
          </>
        )}
        {mode === "calorieOptimization" && (
          <div>
            <FieldLabel htmlFor="gl">Goal</FieldLabel>
            <select id="gl" value={gl} onChange={(e) => setGl(parseFitnessGoal(e.target.value))} className={selectCls}>
              <option value="lose">Lose</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain</option>
            </select>
          </div>
        )}
        {mode === "workoutGenerator" && (
          <>
            <div>
              <FieldLabel htmlFor="fcs">Focus</FieldLabel>
              <select id="fcs" value={fcs} onChange={(e) => setFcs(parseWorkoutFocus(e.target.value))} className={selectCls}>
                <option value="full">Full body</option>
                <option value="upper">Upper</option>
                <option value="lower">Lower</option>
                <option value="cardio">Cardio</option>
                <option value="core">Core</option>
              </select>
            </div>
            {field("dur", "Duration (min)", dur, setDur)}
            <div>
              <FieldLabel htmlFor="lvl">Level</FieldLabel>
              <select id="lvl" value={lvl} onChange={(e) => setLvl(parseExperienceLevel(e.target.value))} className={selectCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </>
        )}
        {mode === "muscleGain" && (
          <>
            {field("wt", "Weight (kg)", wt, setWt)}
            {field("dys", "Training days / week", dys, setDys)}
            {field("prt", "Protein (g/kg)", prt, setPrt)}
            {field("sur", "Surplus %", sur, setSur)}
            <div>
              <FieldLabel htmlFor="exp">Experience</FieldLabel>
              <select id="exp" value={exp} onChange={(e) => setExp(parseExperienceLevel(e.target.value))} className={selectCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </>
        )}
        {mode === "homeWorkout" && (
          <>
            {field("dur", "Session length (min)", dur, setDur)}
            {field("dys", "Days per week", dys, setDys)}
            <div>
              <FieldLabel htmlFor="spc">Space</FieldLabel>
              <select id="spc" value={spc} onChange={(e) => setSpc(parseHomeSpace(e.target.value))} className={selectCls}>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="eqp">Equipment</FieldLabel>
              <select id="eqp" value={eqp} onChange={(e) => setEqp(parseHomeEquipment(e.target.value))} className={selectCls}>
                <option value="none">Bodyweight only</option>
                <option value="basic">Basic (bands / dumbbells)</option>
                <option value="full">Full home gym</option>
              </select>
            </div>
          </>
        )}
        {mode === "gymRoutine" && (
          <>
            <div>
              <FieldLabel htmlFor="spl">Split</FieldLabel>
              <select id="spl" value={spl} onChange={(e) => setSpl(parseGymSplit(e.target.value))} className={selectCls}>
                <option value="push-pull-legs">Push / pull / legs</option>
                <option value="upper-lower">Upper / lower</option>
                <option value="full">Full body</option>
                <option value="bro">Bro split</option>
              </select>
            </div>
            {field("dys", "Days per week", dys, setDys)}
            <div>
              <FieldLabel htmlFor="fcs">Accessory focus</FieldLabel>
              <select id="fcs" value={fcs} onChange={(e) => setFcs(parseWorkoutFocus(e.target.value))} className={selectCls}>
                <option value="full">Balanced</option>
                <option value="upper">Upper emphasis</option>
                <option value="lower">Lower emphasis</option>
                <option value="core">Core emphasis</option>
              </select>
            </div>
          </>
        )}
        {mode === "sleepOptimizer" && (
          <>
            {field("bed", "Bedtime hour (0–23)", bed, setBed)}
            {field("wake", "Wake hour (0–23)", wake, setWake)}
            {field("qlt", "Sleep quality (0–100)", qlt, setQlt)}
            {field("scr", "Screen time before bed (min)", scr, setScr)}
          </>
        )}
        {mode === "stressAnalyzer" && (
          <>
            {field("s1", "Work stress (0–10)", s1, setS1)}
            {field("s2", "Health stress (0–10)", s2, setS2)}
            {field("s3", "Social stress (0–10)", s3, setS3)}
            {field("s4", "Finance stress (0–10)", s4, setS4)}
          </>
        )}
        {mode === "dailyHabit" && (
          <>
            {field("wake", "Wake hour (0–23)", wake, setWake)}
            {[["h1", h1, setH1, "h1m", h1m, setH1m], ["h2", h2, setH2, "h2m", h2m, setH2m], ["h3", h3, setH3, "h3m", h3m, setH3m], ["h4", h4, setH4, "h4m", h4m, setH4m]].map(([nk, nv, ns, mk, mv, ms]) => (
              <div key={nk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={nk as string}>Habit</FieldLabel>
                  <FieldInput id={nk as string} value={nv as string} onChange={(e) => (ns as (v: string) => void)(e.target.value)} className="mt-2" />
                </div>
                {field(mk as string, "Minutes", mv as string, ms as (v: string) => void)}
              </div>
            ))}
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
                  <span className="font-mono">{m.target} kg</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Training phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">{p.phase}</span>
                    <span className="font-mono text-[var(--muted)]">{p.days} wks</span>
                  </div>
                  <p className="mt-1 text-[var(--muted)]">{p.focus}</p>
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
          {result.schedule?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Schedule</p>
              {result.schedule.map((s) => (
                <div key={`${s.time}-${s.activity}`} className="flex justify-between gap-4 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="shrink-0 font-mono text-[var(--muted)]">{s.time}</span>
                  <span className="text-right">{s.activity}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.programDays?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Program</p>
              {result.programDays.map((p) => (
                <div key={p.day} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">{p.day} · {p.focus}</span>
                  </div>
                  <p className="mt-1 text-[var(--muted)]">{p.exercises.join(" · ")}</p>
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
          {result.exercises?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Exercises</p>
              {result.exercises.map((e) => (
                <div key={e.name} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-medium">{e.name}</p>
                  <p className="font-mono text-[var(--accent-bright)]">{e.sets} · rest {e.rest}</p>
                  {e.note ? <p className="text-[var(--muted)]">{e.note}</p> : null}
                </div>
              ))}
            </div>
          ) : null}
          {result.meals?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Meals</p>
              {result.meals.map((m) => (
                <div key={m.meal} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">{m.meal}</span>
                    <span className="font-mono text-[var(--muted)]">{m.kcal} kcal</span>
                  </div>
                  <ul className="mt-1 list-inside list-disc text-[var(--muted)]">{m.items.map((i) => <li key={i}>{i}</li>)}</ul>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedItems?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Stress ranking</p>
              {result.rankedItems.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name}</span>
                  <span className="font-mono">{s.score}/100 · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.scenarios?.length ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Scenarios</p>
              <ScenarioCards scenarios={result.scenarios} valueFormat="score" />
            </div>
          ) : null}
          {result.insights && result.insights.length > 3 ? <InsightPanel insights={result.insights.slice(3)} title="More insights" /> : null}
        </>
      )}
    </CalculatorShell>
  );
}
