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
import { AI_BUSINESS_URL, parsePricingModel, type PricingModel } from "@/lib/calculators/aiBusinessSmart";
import { computeBusinessHostResult } from "./aiBusinessHostCompute";
import type { AiBusinessSlug, Mode } from "./aiBusinessHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  profitAnalyzer: "Profit health",
  roiAdvisor: "ROI score",
  costOptimizer: "Cost efficiency",
  pricingStrategy: "Price fit",
  adBudget: "Ad efficiency",
  roiPredictorAds: "Campaign ROI",
  campaignPerformance: "Campaign score",
  workloadPlanner: "Capacity balance",
  taskPrioritizer: "Priority clarity",
  meetingOptimizer: "Focus score",
};

function chartProps(mode: Mode): { valueFormat: ChartValueFormat; projectionTitle?: string; compareTitle?: string } {
  switch (mode) {
    case "profitAnalyzer":
      return { valueFormat: "currency", compareTitle: "Margin benchmarks", projectionTitle: "Profit growth path" };
    case "costOptimizer":
      return { valueFormat: "currency", compareTitle: "Cost benchmarks", projectionTitle: "Cost reduction path" };
    case "adBudget":
      return { valueFormat: "currency", compareTitle: "ROAS & spend", projectionTitle: "Budget scale path" };
    case "roiPredictorAds":
      return { valueFormat: "currency", compareTitle: "Ad KPI benchmarks", projectionTitle: "Cumulative ad profit" };
    case "roiAdvisor":
      return { valueFormat: "currency", compareTitle: "ROI benchmarks", projectionTitle: "Investment recovery path" };
    case "campaignPerformance":
      return { valueFormat: "percent", compareTitle: "Funnel benchmarks", projectionTitle: "Profit projection" };
    case "pricingStrategy":
      return { valueFormat: "currency", compareTitle: "Price ladder" };
    case "workloadPlanner":
    case "taskPrioritizer":
      return { valueFormat: "score", compareTitle: "Task allocation" };
    case "meetingOptimizer":
      return { valueFormat: "percent", compareTitle: "Focus benchmarks", projectionTitle: "Meeting hours reduction" };
    default:
      return { valueFormat: "currency" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or professional advice; educational use only.";

const CONFIG: Record<AiBusinessSlug, Config> = {
  "aist-ai-profit-analyzer": { title: "AI profit analyzer", description: "Gross/net margin, breakeven revenue, benchmark gaps, and 12-month profit projection with action steps.", mode: "profitAnalyzer" },
  "aist-ai-roi-advisor": { title: "AI ROI advisor", description: "ROI, payback, annualized return, NPV proxy, downside/base/upside scenarios, and decision checklist.", mode: "roiAdvisor" },
  "aist-ai-business-cost-optimizer": { title: "AI business cost optimizer", description: "Fixed vs variable analysis, ranked savings levers, 90-day phases, and cost reduction scenarios.", mode: "costOptimizer" },
  "aist-ai-pricing-strategy-calculator": { title: "AI pricing strategy calculator", description: "Cost-plus, competitive, and value models with Starter/Standard/Pro tiers and revenue projection.", mode: "pricingStrategy" },
  "aist-ai-ad-budget-optimizer": { title: "AI ad budget optimizer", description: "ROAS, MER, attribution-aware optimal spend, scale milestones, and budget scenarios.", mode: "adBudget" },
  "aist-ai-roi-predictor-ads": { title: "AI ROI predictor (ads)", description: "ROAS, ROI %, monthly profit run-rate, revenue milestones, and scale playbook steps.", mode: "roiPredictorAds" },
  "aist-ai-campaign-performance-analyzer": { title: "AI campaign performance analyzer", description: "Full funnel CTR→CVR→CPA with LTV/CPA economics, ROAS proxy, and fix recommendations.", mode: "campaignPerformance" },
  "aist-ai-workload-planner": { title: "AI workload planner", description: "Hour blocks with 15% buffer, utilization score, day phases, and capacity milestones.", mode: "workloadPlanner" },
  "aist-ai-task-prioritizer": { title: "AI task prioritizer", description: "Eisenhower matrix quadrants, ranked queue, execution slots, and do-first overload alerts.", mode: "taskPrioritizer" },
  "aist-ai-meeting-time-optimizer": { title: "AI meeting time optimizer", description: "Focus %, weekly/annual meeting cost, −30% reduction target, and cost scenarios.", mode: "meetingOptimizer" },
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

export function AiBusinessSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiBusinessSlug] ?? CONFIG["aist-ai-profit-analyzer"];
  const mode = config.mode;

  const [rev, setRev] = useState(useLoanInitialInput(AI_BUSINESS_URL.REVENUE, "500000"));
  const [cogs, setCogs] = useState(useLoanInitialInput(AI_BUSINESS_URL.COGS, "180000"));
  const [opex, setOpex] = useState(useLoanInitialInput(AI_BUSINESS_URL.OPEX, "200000"));
  const [inv, setInv] = useState(useLoanInitialInput(AI_BUSINESS_URL.INVEST, "100000"));
  const [ret, setRet] = useState(useLoanInitialInput(AI_BUSINESS_URL.RETURNS, "140000"));
  const [mo, setMo] = useState(useLoanInitialInput(AI_BUSINESS_URL.MONTHS, "12"));
  const [fix, setFix] = useState(useLoanInitialInput(AI_BUSINESS_URL.FIXED, "150000"));
  const [v, setV] = useState(useLoanInitialInput(AI_BUSINESS_URL.VARIABLE, "320000"));
  const [cost, setCost] = useState(useLoanInitialInput(AI_BUSINESS_URL.COST, "500"));
  const [mar, setMar] = useState(useLoanInitialInput(AI_BUSINESS_URL.MARGIN, "35"));
  const [cmp, setCmp] = useState(useLoanInitialInput(AI_BUSINESS_URL.COMPETITOR, "899"));
  const [model, setModel] = useState<PricingModel>(parsePricingModel(useLoanInitialInput("model", "cost-plus")));
  const [roas, setRoas] = useState(useLoanInitialInput(AI_BUSINESS_URL.TARGET_ROAS, "4"));
  const [ads, setAds] = useState(useLoanInitialInput(AI_BUSINESS_URL.AD_SPEND, "80000"));
  const [adr, setAdr] = useState(useLoanInitialInput(AI_BUSINESS_URL.AD_REV, "180000"));
  const [imp, setImp] = useState(useLoanInitialInput(AI_BUSINESS_URL.IMPRESSIONS, "100000"));
  const [clk, setClk] = useState(useLoanInitialInput(AI_BUSINESS_URL.CLICKS, "2500"));
  const [cnv, setCnv] = useState(useLoanInitialInput(AI_BUSINESS_URL.CONVERSIONS, "85"));
  const [hrs, setHrs] = useState(useLoanInitialInput(AI_BUSINESS_URL.HOURS, "8"));
  const [t1, setT1] = useState(useLoanInitialInput(AI_BUSINESS_URL.T1, "Deep work"));
  const [t2, setT2] = useState(useLoanInitialInput(AI_BUSINESS_URL.T2, "Meetings"));
  const [t3, setT3] = useState(useLoanInitialInput(AI_BUSINESS_URL.T3, "Admin"));
  const [t4, setT4] = useState(useLoanInitialInput(AI_BUSINESS_URL.T4, "Email"));
  const [h1, setH1] = useState(useLoanInitialInput(AI_BUSINESS_URL.H1, "3"));
  const [h2, setH2] = useState(useLoanInitialInput(AI_BUSINESS_URL.H2, "2"));
  const [h3, setH3] = useState(useLoanInitialInput(AI_BUSINESS_URL.H3, "1.5"));
  const [h4, setH4] = useState(useLoanInitialInput(AI_BUSINESS_URL.H4, "1"));
  const [u1, setU1] = useState(useLoanInitialInput(AI_BUSINESS_URL.U1, "8"));
  const [u2, setU2] = useState(useLoanInitialInput(AI_BUSINESS_URL.U2, "7"));
  const [u3, setU3] = useState(useLoanInitialInput(AI_BUSINESS_URL.U3, "5"));
  const [u4, setU4] = useState(useLoanInitialInput(AI_BUSINESS_URL.U4, "6"));
  const [i1, setI1] = useState(useLoanInitialInput(AI_BUSINESS_URL.I1, "9"));
  const [i2, setI2] = useState(useLoanInitialInput(AI_BUSINESS_URL.I2, "6"));
  const [i3, setI3] = useState(useLoanInitialInput(AI_BUSINESS_URL.I3, "3"));
  const [i4, setI4] = useState(useLoanInitialInput(AI_BUSINESS_URL.I4, "7"));
  const [mtg, setMtg] = useState(useLoanInitialInput(AI_BUSINESS_URL.MEETINGS, "12"));
  const [mdur, setMdur] = useState(useLoanInitialInput(AI_BUSINESS_URL.MEET_DUR, "45"));
  const [fcs, setFcs] = useState(useLoanInitialInput(AI_BUSINESS_URL.FOCUS, "6"));
  const [team, setTeam] = useState(useLoanInitialInput(AI_BUSINESS_URL.TEAM, "5"));
  const [gr, setGr] = useState(useLoanInitialInput(AI_BUSINESS_URL.GROWTH, "3"));
  const [attr, setAttr] = useState(useLoanInitialInput(AI_BUSINESS_URL.ATTR, "40"));
  const [ltv, setLtv] = useState(useLoanInitialInput(AI_BUSINESS_URL.LTV, "2000"));
  const [rate, setRate] = useState(useLoanInitialInput(AI_BUSINESS_URL.RATE, "800"));
  const [units, setUnits] = useState(useLoanInitialInput(AI_BUSINESS_URL.UNITS, "100"));

  const inputs = useMemo(
    () => ({
      rev, cogs, opex, inv, ret, mo, fix, var: v, cost, mar, cmp, model, roas, ads, adr, imp, clk, cnv,
      hrs, t1, t2, t3, t4, h1, h2, h3, h4, u1, u2, u3, u4, i1, i2, i3, i4, mtg, mdur, fcs, team, gr, attr, ltv, rate, units,
    }),
    [rev, cogs, opex, inv, ret, mo, fix, v, cost, mar, cmp, model, roas, ads, adr, imp, clk, cnv, hrs, t1, t2, t3, t4, h1, h2, h3, h4, u1, u2, u3, u4, i1, i2, i3, i4, mtg, mdur, fcs, team, gr, attr, ltv, rate, units],
  );

  const shareParams = useCallback(
    () => ({
      [AI_BUSINESS_URL.REVENUE]: rev, [AI_BUSINESS_URL.COGS]: cogs, [AI_BUSINESS_URL.OPEX]: opex,
      [AI_BUSINESS_URL.INVEST]: inv, [AI_BUSINESS_URL.RETURNS]: ret, [AI_BUSINESS_URL.MONTHS]: mo,
      [AI_BUSINESS_URL.FIXED]: fix, [AI_BUSINESS_URL.VARIABLE]: v, [AI_BUSINESS_URL.COST]: cost,
      [AI_BUSINESS_URL.MARGIN]: mar, [AI_BUSINESS_URL.COMPETITOR]: cmp, model,
      [AI_BUSINESS_URL.TARGET_ROAS]: roas, [AI_BUSINESS_URL.AD_SPEND]: ads, [AI_BUSINESS_URL.AD_REV]: adr,
      [AI_BUSINESS_URL.IMPRESSIONS]: imp, [AI_BUSINESS_URL.CLICKS]: clk, [AI_BUSINESS_URL.CONVERSIONS]: cnv,
      [AI_BUSINESS_URL.HOURS]: hrs, [AI_BUSINESS_URL.T1]: t1, [AI_BUSINESS_URL.T2]: t2, [AI_BUSINESS_URL.T3]: t3, [AI_BUSINESS_URL.T4]: t4,
      [AI_BUSINESS_URL.H1]: h1, [AI_BUSINESS_URL.H2]: h2, [AI_BUSINESS_URL.H3]: h3, [AI_BUSINESS_URL.H4]: h4,
      [AI_BUSINESS_URL.U1]: u1, [AI_BUSINESS_URL.U2]: u2, [AI_BUSINESS_URL.U3]: u3, [AI_BUSINESS_URL.U4]: u4,
      [AI_BUSINESS_URL.I1]: i1, [AI_BUSINESS_URL.I2]: i2, [AI_BUSINESS_URL.I3]: i3, [AI_BUSINESS_URL.I4]: i4,
      [AI_BUSINESS_URL.MEETINGS]: mtg, [AI_BUSINESS_URL.MEET_DUR]: mdur, [AI_BUSINESS_URL.FOCUS]: fcs, [AI_BUSINESS_URL.TEAM]: team,
      [AI_BUSINESS_URL.GROWTH]: gr, [AI_BUSINESS_URL.ATTR]: attr, [AI_BUSINESS_URL.LTV]: ltv, [AI_BUSINESS_URL.RATE]: rate, [AI_BUSINESS_URL.UNITS]: units,
    }),
    [rev, cogs, opex, inv, ret, mo, fix, v, cost, mar, cmp, model, roas, ads, adr, imp, clk, cnv, hrs, t1, t2, t3, t4, h1, h2, h3, h4, u1, u2, u3, u4, i1, i2, i3, i4, mtg, mdur, fcs, team, gr, attr, ltv, rate, units],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeBusinessHostResult(mode, inputs), [mode, inputs]);

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
        {mode === "profitAnalyzer" && (
          <>{field("rev", "Revenue (₹)", rev, setRev)}{field("cogs", "COGS (₹)", cogs, setCogs)}{field("opex", "Operating expenses (₹)", opex, setOpex)}{field("gr", "Monthly growth %", gr, setGr)}</>
        )}
        {mode === "roiAdvisor" && (
          <>{field("inv", "Investment (₹)", inv, setInv)}{field("ret", "Total returns (₹)", ret, setRet)}{field("mo", "Period (months)", mo, setMo)}</>
        )}
        {mode === "costOptimizer" && (
          <>{field("rev", "Revenue (₹)", rev, setRev)}{field("fix", "Fixed costs (₹)", fix, setFix)}{field("var", "Variable costs (₹)", v, setV)}</>
        )}
        {mode === "pricingStrategy" && (
          <>
            {field("cost", "Unit cost (₹)", cost, setCost)}
            {field("mar", "Target margin %", mar, setMar)}
            {field("cmp", "Competitor price (₹)", cmp, setCmp)}
            {field("units", "Expected units / month", units, setUnits)}
            <div>
              <FieldLabel htmlFor="model">Pricing model</FieldLabel>
              <select id="model" value={model} onChange={(e) => setModel(parsePricingModel(e.target.value))} className={selectCls}>
                <option value="cost-plus">Cost-plus</option>
                <option value="competitive">Competitive</option>
                <option value="value">Value-based</option>
              </select>
            </div>
          </>
        )}
        {(mode === "adBudget" || mode === "roiPredictorAds") && (
          <>
            {mode === "adBudget" && field("rev", "Revenue (₹)", rev, setRev)}
            {field("ads", "Ad spend (₹)", ads, setAds)}
            {mode === "adBudget" && field("roas", "Target ROAS", roas, setRoas)}
            {mode === "adBudget" && field("attr", "Ad attribution %", attr, setAttr)}
            {mode === "roiPredictorAds" && (
              <>
                {field("adr", "Ad-attributed revenue (₹)", adr, setAdr)}
                {field("mo", "Period (months)", mo, setMo)}
              </>
            )}
          </>
        )}
        {mode === "campaignPerformance" && (
          <>
            {field("imp", "Impressions", imp, setImp)}
            {field("clk", "Clicks", clk, setClk)}
            {field("cnv", "Conversions", cnv, setCnv)}
            {field("ads", "Spend (₹)", ads, setAds)}
            {field("ltv", "Customer LTV (₹)", ltv, setLtv)}
          </>
        )}
        {mode === "workloadPlanner" && (
          <>
            {field("hrs", "Hours available", hrs, setHrs)}
            {[["t1", t1, setT1, "h1", h1, setH1], ["t2", t2, setT2, "h2", h2, setH2], ["t3", t3, setT3, "h3", h3, setH3], ["t4", t4, setT4, "h4", h4, setH4]].map(([tk, tv, ts, hk, hv, hs]) => (
              <div key={tk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel htmlFor={tk as string}>Task</FieldLabel><FieldInput id={tk as string} value={tv as string} onChange={(e) => (ts as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(hk as string, "Hours", hv as string, hs as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "taskPrioritizer" && (
          <>
            {[["t1", t1, setT1, "u1", u1, setU1, "i1", i1, setI1], ["t2", t2, setT2, "u2", u2, setU2, "i2", i2, setI2], ["t3", t3, setT3, "u3", u3, setU3, "i3", i3, setI3], ["t4", t4, setT4, "u4", u4, setU4, "i4", i4, setI4]].map(([tk, tv, ts, uk, uv, us, ik, iv, is]) => (
              <div key={tk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                <div><FieldLabel htmlFor={tk as string}>Task</FieldLabel><FieldInput id={tk as string} value={tv as string} onChange={(e) => (ts as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(uk as string, "Urgency (0–10)", uv as string, us as (v: string) => void)}
                {field(ik as string, "Importance (0–10)", iv as string, is as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "meetingOptimizer" && (
          <>
            {field("mtg", "Meetings / week", mtg, setMtg)}
            {field("mdur", "Avg duration (min)", mdur, setMdur)}
            {field("fcs", "Focus hours / day", fcs, setFcs)}
            {field("team", "Team size", team, setTeam)}
            {field("rate", "Hourly cost (₹/person)", rate, setRate)}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock slices={result.chartSlices} compare={result.compareRows} projection={result.projection} compareTitle={chart.compareTitle} projectionTitle={chart.projectionTitle} valueFormat={chart.valueFormat} compareFormat={chart.valueFormat} />
          {result.phases?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Optimization phases</p>
              {result.phases.map((p) => (
                <div key={p.phase} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <div className="flex justify-between gap-4"><span className="font-medium">{p.phase}</span><span className="font-mono text-[var(--muted)]">{p.days} days</span></div>
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
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Ranking</p>
              {result.rankedItems.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name}</span><span className="font-mono">{s.score} · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.rankedLevers?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Savings levers</p>
              {result.rankedLevers.map((l) => (
                <div key={l.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{l.name}</span>
                  <span className="font-mono">₹{l.save.toLocaleString("en-IN")} · {l.effort}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.pricingTiers?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Pricing tiers</p>
              {result.pricingTiers.map((t) => (
                <div key={t.tier} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-medium">{t.tier}</span>
                  <span className="font-mono">₹{t.price.toLocaleString("en-IN")} · {t.marginPct}% margin</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.funnelSteps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Conversion funnel</p>
              {result.funnelSteps.map((f) => (
                <div key={f.stage} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{f.stage}</span>
                  <span className="font-mono">{f.count.toLocaleString("en-IN")} · {f.rate}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.quadrants?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Eisenhower matrix</p>
              {result.quadrants.filter((q) => q.tasks.length).map((q) => (
                <div key={q.quadrant} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <p className="font-medium">{q.quadrant}</p>
                  <p className="mt-1 text-[var(--muted)]">{q.tasks.join(" · ") || "—"}</p>
                </div>
              ))}
            </div>
          ) : null}
          {result.milestones?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {mode === "meetingOptimizer" ? "Meeting reduction milestones" : mode === "workloadPlanner" ? "Capacity checkpoints" : "Milestones"}
              </p>
              {result.milestones.map((m) => (
                <div key={m.week} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{mode === "meetingOptimizer" ? `Week ${m.week}` : mode === "roiPredictorAds" ? `Month ${m.week}` : `Period ${m.week}`}</span>
                  <span className="font-mono">{mode === "meetingOptimizer" ? `${m.target}h meetings` : `₹${m.target.toLocaleString("en-IN")}`}</span>
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
              <ScenarioCards scenarios={result.scenarios} valueFormat={mode === "roiAdvisor" ? "currency" : "currency"} />
            </div>
          ) : null}
          {result.insights && result.insights.length > 3 ? <InsightPanel insights={result.insights.slice(3)} title="More insights" /> : null}
        </>
      )}
    </CalculatorShell>
  );
}
