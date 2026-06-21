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
import { AI_CONV_URL, parseEnergy, parseUnit, type EnergyLevel, type UnitKey } from "@/lib/calculators/aiConversionSmart";
import { UNIT_TO_BASE } from "@/lib/calculators/aiConversionKnowledge";
import { computeConversionHostResult } from "./aiConversionHostCompute";
import type { AiConversionSlug, Mode } from "./aiConversionHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  unitConversion: "Conversion fit",
  currencyTrend: "Forecast confidence",
  timeZonePlanner: "Overlap score",
  timeManagement: "Capacity balance",
  productivityScore: "Productivity score",
  dailyRoutine: "Routine efficiency",
};

function chartProps(mode: Mode): { valueFormat: ChartValueFormat; projectionTitle?: string; compareTitle?: string } {
  switch (mode) {
    case "unitConversion":
      return { valueFormat: "count", compareTitle: "Related unit equivalents" };
    case "currencyTrend":
      return { valueFormat: "currency", compareTitle: "FX benchmarks", projectionTitle: "Conversion path" };
    case "timeZonePlanner":
      return { valueFormat: "score", compareTitle: "Zone overlap scores" };
    case "timeManagement":
      return { valueFormat: "score", compareTitle: "Task time allocation" };
    case "productivityScore":
      return { valueFormat: "score", compareTitle: "Productivity benchmarks", projectionTitle: "Score improvement path" };
    case "dailyRoutine":
      return { valueFormat: "score", compareTitle: "Activity time blocks" };
    default:
      return { valueFormat: "currency" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or financial advice; educational use only.";

const CONFIG: Record<AiConversionSlug, Config> = {
  "aist-ai-unit-conversion-advisor": { title: "AI unit conversion advisor", description: "Length, weight, temperature, and volume conversions with precision guidance, related equivalents, and common mistake alerts.", mode: "unitConversion" },
  "aist-ai-currency-trend-predictor": { title: "AI currency trend predictor", description: "Spot conversion plus bearish/base/bullish bands from trend and volatility — planning scenarios, not trading signals.", mode: "currencyTrend" },
  "aist-ai-time-zone-planner": { title: "AI time zone planner", description: "Multi-zone overlap finder, best meeting slots, and fair-scheduling tips for distributed teams.", mode: "timeZonePlanner" },
  "aist-ai-time-management-planner": { title: "AI time management planner", description: "Priority-ranked day blocks with 15% buffer, utilization score, and overflow alerts.", mode: "timeManagement" },
  "aist-ai-productivity-score-calculator": { title: "AI productivity score calculator", description: "Focus, deep work, completion rate, and interruption scoring with ranked improvement levers.", mode: "productivityScore" },
  "aist-ai-daily-routine-optimizer": { title: "AI daily routine optimizer", description: "Energy-curve scheduling — high-energy tasks first, phased day structure, and free-time balance.", mode: "dailyRoutine" },
};

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

const UNIT_OPTIONS = (Object.keys(UNIT_TO_BASE) as UnitKey[]).map((k) => ({ key: k, label: UNIT_TO_BASE[k].label }));

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

export function AiConversionSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiConversionSlug] ?? CONFIG["aist-ai-unit-conversion-advisor"];
  const mode = config.mode;

  const [val, setVal] = useState(useLoanInitialInput(AI_CONV_URL.VAL, "100"));
  const [from, setFrom] = useState<UnitKey>(parseUnit(useLoanInitialInput("from", "km")));
  const [to, setTo] = useState<UnitKey>(parseUnit(useLoanInitialInput("to", "mi")));
  const [amt, setAmt] = useState(useLoanInitialInput(AI_CONV_URL.AMT, "1000"));
  const [rate, setRate] = useState(useLoanInitialInput(AI_CONV_URL.RATE, "83.5"));
  const [trend, setTrend] = useState(useLoanInitialInput(AI_CONV_URL.TREND, "1.2"));
  const [vol, setVol] = useState(useLoanInitialInput(AI_CONV_URL.VOL, "6"));
  const [days, setDays] = useState(useLoanInitialInput(AI_CONV_URL.DAYS, "30"));
  const [tz1, setTz1] = useState(useLoanInitialInput(AI_CONV_URL.TZ1, "0"));
  const [tz2, setTz2] = useState(useLoanInitialInput(AI_CONV_URL.TZ2, "5.5"));
  const [tz3, setTz3] = useState(useLoanInitialInput(AI_CONV_URL.TZ3, "8"));
  const [ws, setWs] = useState(useLoanInitialInput(AI_CONV_URL.WORK_START, "9"));
  const [we, setWe] = useState(useLoanInitialInput(AI_CONV_URL.WORK_END, "18"));
  const [mdur, setMdur] = useState(useLoanInitialInput(AI_CONV_URL.MEET_DUR, "60"));
  const [hrs, setHrs] = useState(useLoanInitialInput(AI_CONV_URL.HRS, "8"));
  const [t1, setT1] = useState(useLoanInitialInput(AI_CONV_URL.T1, "Deep project"));
  const [t2, setT2] = useState(useLoanInitialInput(AI_CONV_URL.T2, "Meetings"));
  const [t3, setT3] = useState(useLoanInitialInput(AI_CONV_URL.T3, "Email & admin"));
  const [t4, setT4] = useState(useLoanInitialInput(AI_CONV_URL.T4, "Learning"));
  const [h1, setH1] = useState(useLoanInitialInput(AI_CONV_URL.H1, "3"));
  const [h2, setH2] = useState(useLoanInitialInput(AI_CONV_URL.H2, "2"));
  const [h3, setH3] = useState(useLoanInitialInput(AI_CONV_URL.H3, "1.5"));
  const [h4, setH4] = useState(useLoanInitialInput(AI_CONV_URL.H4, "1"));
  const [p1, setP1] = useState(useLoanInitialInput(AI_CONV_URL.P1, "9"));
  const [p2, setP2] = useState(useLoanInitialInput(AI_CONV_URL.P2, "7"));
  const [p3, setP3] = useState(useLoanInitialInput(AI_CONV_URL.P3, "5"));
  const [p4, setP4] = useState(useLoanInitialInput(AI_CONV_URL.P4, "6"));
  const [fcs, setFcs] = useState(useLoanInitialInput(AI_CONV_URL.FOCUS, "5"));
  const [intr, setIntr] = useState(useLoanInitialInput(AI_CONV_URL.INTR, "12"));
  const [done, setDone] = useState(useLoanInitialInput(AI_CONV_URL.DONE, "7"));
  const [plan, setPlan] = useState(useLoanInitialInput(AI_CONV_URL.PLAN, "9"));
  const [deep, setDeep] = useState(useLoanInitialInput(AI_CONV_URL.DEEP, "2"));
  const [wake, setWake] = useState(useLoanInitialInput(AI_CONV_URL.WAKE, "6"));
  const [sleep, setSleep] = useState(useLoanInitialInput(AI_CONV_URL.SLEEP, "23"));
  const [a1, setA1] = useState(useLoanInitialInput(AI_CONV_URL.A1, "Exercise"));
  const [a2, setA2] = useState(useLoanInitialInput(AI_CONV_URL.A2, "Deep work"));
  const [a3, setA3] = useState(useLoanInitialInput(AI_CONV_URL.A3, "Meetings"));
  const [a4, setA4] = useState(useLoanInitialInput(AI_CONV_URL.A4, "Family time"));
  const [a5, setA5] = useState(useLoanInitialInput(AI_CONV_URL.A5, "Reading"));
  const [d1, setD1] = useState(useLoanInitialInput(AI_CONV_URL.D1, "1"));
  const [d2, setD2] = useState(useLoanInitialInput(AI_CONV_URL.D2, "3"));
  const [d3, setD3] = useState(useLoanInitialInput(AI_CONV_URL.D3, "2"));
  const [d4, setD4] = useState(useLoanInitialInput(AI_CONV_URL.D4, "2"));
  const [d5, setD5] = useState(useLoanInitialInput(AI_CONV_URL.D5, "0.5"));
  const [e1, setE1] = useState<EnergyLevel>(parseEnergy(useLoanInitialInput(AI_CONV_URL.E1, "high")));
  const [e2, setE2] = useState<EnergyLevel>(parseEnergy(useLoanInitialInput(AI_CONV_URL.E2, "high")));
  const [e3, setE3] = useState<EnergyLevel>(parseEnergy(useLoanInitialInput(AI_CONV_URL.E3, "medium")));
  const [e4, setE4] = useState<EnergyLevel>(parseEnergy(useLoanInitialInput(AI_CONV_URL.E4, "low")));
  const [e5, setE5] = useState<EnergyLevel>(parseEnergy(useLoanInitialInput(AI_CONV_URL.E5, "low")));

  const inputs = useMemo(
    () => ({
      val, from, to, amt, rate, trend, vol, days, tz1, tz2, tz3, ws, we, mdur, hrs,
      t1, t2, t3, t4, h1, h2, h3, h4, p1, p2, p3, p4, fcs, intr, done, plan, deep,
      wake, sleep, a1, a2, a3, a4, a5, d1, d2, d3, d4, d5, e1, e2, e3, e4, e5,
    }),
    [val, from, to, amt, rate, trend, vol, days, tz1, tz2, tz3, ws, we, mdur, hrs, t1, t2, t3, t4, h1, h2, h3, h4, p1, p2, p3, p4, fcs, intr, done, plan, deep, wake, sleep, a1, a2, a3, a4, a5, d1, d2, d3, d4, d5, e1, e2, e3, e4, e5],
  );

  const shareParams = useCallback(
    () => ({
      [AI_CONV_URL.VAL]: val, from, to,
      [AI_CONV_URL.AMT]: amt, [AI_CONV_URL.RATE]: rate, [AI_CONV_URL.TREND]: trend, [AI_CONV_URL.VOL]: vol, [AI_CONV_URL.DAYS]: days,
      [AI_CONV_URL.TZ1]: tz1, [AI_CONV_URL.TZ2]: tz2, [AI_CONV_URL.TZ3]: tz3, [AI_CONV_URL.WORK_START]: ws, [AI_CONV_URL.WORK_END]: we, [AI_CONV_URL.MEET_DUR]: mdur,
      [AI_CONV_URL.HRS]: hrs, [AI_CONV_URL.T1]: t1, [AI_CONV_URL.T2]: t2, [AI_CONV_URL.T3]: t3, [AI_CONV_URL.T4]: t4,
      [AI_CONV_URL.H1]: h1, [AI_CONV_URL.H2]: h2, [AI_CONV_URL.H3]: h3, [AI_CONV_URL.H4]: h4,
      [AI_CONV_URL.P1]: p1, [AI_CONV_URL.P2]: p2, [AI_CONV_URL.P3]: p3, [AI_CONV_URL.P4]: p4,
      [AI_CONV_URL.FOCUS]: fcs, [AI_CONV_URL.INTR]: intr, [AI_CONV_URL.DONE]: done, [AI_CONV_URL.PLAN]: plan, [AI_CONV_URL.DEEP]: deep,
      [AI_CONV_URL.WAKE]: wake, [AI_CONV_URL.SLEEP]: sleep,
      [AI_CONV_URL.A1]: a1, [AI_CONV_URL.A2]: a2, [AI_CONV_URL.A3]: a3, [AI_CONV_URL.A4]: a4, [AI_CONV_URL.A5]: a5,
      [AI_CONV_URL.D1]: d1, [AI_CONV_URL.D2]: d2, [AI_CONV_URL.D3]: d3, [AI_CONV_URL.D4]: d4, [AI_CONV_URL.D5]: d5,
      [AI_CONV_URL.E1]: e1, [AI_CONV_URL.E2]: e2, [AI_CONV_URL.E3]: e3, [AI_CONV_URL.E4]: e4, [AI_CONV_URL.E5]: e5,
    }),
    [val, from, to, amt, rate, trend, vol, days, tz1, tz2, tz3, ws, we, mdur, hrs, t1, t2, t3, t4, h1, h2, h3, h4, p1, p2, p3, p4, fcs, intr, done, plan, deep, wake, sleep, a1, a2, a3, a4, a5, d1, d2, d3, d4, d5, e1, e2, e3, e4, e5],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeConversionHostResult(mode, inputs), [mode, inputs]);

  const field = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

  const energySelect = (id: string, label: string, value: EnergyLevel, set: (v: EnergyLevel) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select id={id} value={value} onChange={(e) => set(parseEnergy(e.target.value))} className={selectCls}>
        <option value="high">High energy</option>
        <option value="medium">Medium energy</option>
        <option value="low">Low energy</option>
      </select>
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
        {mode === "unitConversion" && (
          <>
            {field("val", "Value", val, setVal)}
            <div>
              <FieldLabel htmlFor="from">From unit</FieldLabel>
              <select id="from" value={from} onChange={(e) => setFrom(parseUnit(e.target.value))} className={selectCls}>
                {UNIT_OPTIONS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="to">To unit</FieldLabel>
              <select id="to" value={to} onChange={(e) => setTo(parseUnit(e.target.value))} className={selectCls}>
                {UNIT_OPTIONS.map((u) => <option key={u.key} value={u.key}>{u.label}</option>)}
              </select>
            </div>
          </>
        )}
        {mode === "currencyTrend" && (
          <>
            {field("amt", "Amount", amt, setAmt)}
            {field("rate", "Exchange rate", rate, setRate)}
            {field("trend", "30-day trend %", trend, setTrend)}
            {field("vol", "Volatility %", vol, setVol)}
            {field("days", "Forecast horizon (days)", days, setDays)}
          </>
        )}
        {mode === "timeZonePlanner" && (
          <>
            {field("tz1", "Zone 1 UTC offset (e.g. 5.5)", tz1, setTz1)}
            {field("tz2", "Zone 2 UTC offset", tz2, setTz2)}
            {field("tz3", "Zone 3 UTC offset", tz3, setTz3)}
            {field("ws", "Work start (ref zone, 0–23)", ws, setWs)}
            {field("we", "Work end (ref zone)", we, setWe)}
            {field("mdur", "Meeting duration (min)", mdur, setMdur)}
          </>
        )}
        {mode === "timeManagement" && (
          <>
            {field("hrs", "Hours available", hrs, setHrs)}
            {[["t1", t1, setT1, "h1", h1, setH1, "p1", p1, setP1], ["t2", t2, setT2, "h2", h2, setH2, "p2", p2, setP2], ["t3", t3, setT3, "h3", h3, setH3, "p3", p3, setP3], ["t4", t4, setT4, "h4", h4, setH4, "p4", p4, setP4]].map(([tk, tv, ts, hk, hv, hs, pk, pv, ps]) => (
              <div key={tk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                <div><FieldLabel htmlFor={tk as string}>Task</FieldLabel><FieldInput id={tk as string} value={tv as string} onChange={(e) => (ts as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(hk as string, "Hours", hv as string, hs as (v: string) => void)}
                {field(pk as string, "Priority (0–10)", pv as string, ps as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "productivityScore" && (
          <>
            {field("fcs", "Focus hours / day", fcs, setFcs)}
            {field("deep", "Deep work hours", deep, setDeep)}
            {field("done", "Tasks completed", done, setDone)}
            {field("plan", "Tasks planned", plan, setPlan)}
            {field("intr", "Interruptions / day", intr, setIntr)}
          </>
        )}
        {mode === "dailyRoutine" && (
          <>
            {field("wake", "Wake hour (0–23)", wake, setWake)}
            {field("sleep", "Sleep hour", sleep, setSleep)}
            {[["a1", a1, setA1, "d1", d1, setD1, "e1", e1, setE1], ["a2", a2, setA2, "d2", d2, setD2, "e2", e2, setE2], ["a3", a3, setA3, "d3", d3, setD3, "e3", e3, setE3], ["a4", a4, setA4, "d4", d4, setD4, "e4", e4, setE4], ["a5", a5, setA5, "d5", d5, setD5, "e5", e5, setE5]].map(([ak, av, as, dk, dv, ds, ek, ev, es]) => (
              <div key={ak as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                <div><FieldLabel htmlFor={ak as string}>Activity</FieldLabel><FieldInput id={ak as string} value={av as string} onChange={(e) => (as as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(dk as string, "Hours", dv as string, ds as (v: string) => void)}
                {energySelect(ek as string, "Energy", ev as EnergyLevel, es as (v: EnergyLevel) => void)}
              </div>
            ))}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock slices={result.chartSlices} compare={result.compareRows} projection={result.projection} compareTitle={chart.compareTitle} projectionTitle={chart.projectionTitle} valueFormat={chart.valueFormat} compareFormat={chart.valueFormat} />
          {result.relatedUnits?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Related equivalents</p>
              {result.relatedUnits.map((r) => (
                <div key={r.unit} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{r.unit}</span><span className="font-mono">{r.value}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.overlapWindows?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Meeting windows</p>
              {result.overlapWindows.map((w) => (
                <div key={w.slot} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-mono font-medium">{w.slot}</p>
                  <p className="mt-1 text-[var(--muted)]">{w.zones}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedLevers?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Improvement levers</p>
              {result.rankedLevers.map((l) => (
                <div key={l.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{l.name}</span><span className="font-mono">+{l.save} pts · {l.effort}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Day phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-medium">{p.phase}</p>
                  <p className="mt-1 text-[var(--muted)]">{p.focus}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.schedule?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Schedule</p>
              {result.schedule.map((s) => (
                <div key={`${s.time}-${s.activity}`} className="flex justify-between gap-4 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--muted)]">{s.time}</span><span>{s.activity}</span>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Task ranking</p>
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
                  <span>{mode === "currencyTrend" ? `Day ${m.week}` : mode === "productivityScore" || mode === "dailyRoutine" ? `Week ${m.week}` : `Period ${m.week}`}</span>
                  <span className="font-mono">
                    {mode === "productivityScore" || mode === "dailyRoutine" ? `${m.target}/100` : mode === "currencyTrend" ? `₹${m.target.toLocaleString("en-IN")}` : String(m.target)}
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
              <ScenarioCards scenarios={result.scenarios} valueFormat="currency" />
            </div>
          ) : null}
        </>
      )}
    </CalculatorShell>
  );
}
