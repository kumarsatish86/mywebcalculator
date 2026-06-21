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
  AI_DAILY_URL,
  parseRoundTrip,
  parseSplitMethod,
  parseTripStyle,
  type SplitMethod,
  type TripStyle,
} from "@/lib/calculators/aiDailyLifeSmart";
import { computeDailyLifeHostResult } from "./aiDailyLifeHostCompute";
import type { AiDailyLifeSlug, Mode } from "./aiDailyLifeHostTypes";

type Config = { title: string; description: string; mode: Mode };

const SCORE_LABEL: Record<Mode, string> = {
  expenseSplitter: "Split fairness",
  billPlanner: "Bill health",
  lifestyleCost: "Budget balance",
  bestDealFinder: "Deal score",
  discountOptimizer: "Stack efficiency",
  priceComparison: "Value score",
  tripCost: "Trip readiness",
  travelBudget: "Budget fit",
  fuelCost: "Efficiency score",
};

function chartProps(mode: Mode): {
  valueFormat: ChartValueFormat;
  projectionTitle?: string;
  compareTitle?: string;
} {
  switch (mode) {
    case "lifestyleCost":
      return { valueFormat: "percent", compareTitle: "50/30/20 benchmark" };
    case "priceComparison":
      return { valueFormat: "score", compareTitle: "Offer scores" };
    case "fuelCost":
      return { valueFormat: "currency", compareTitle: "Cost breakdown", projectionTitle: "Trip count projection" };
    case "tripCost":
      return { valueFormat: "currency", compareTitle: "Category vs target", projectionTitle: "Trip spend path" };
    case "travelBudget":
      return { valueFormat: "currency", compareTitle: "Category allocation" };
    case "billPlanner":
      return { valueFormat: "currency", compareTitle: "Bill vs avg share", projectionTitle: "Monthly buffer" };
    default:
      return { valueFormat: "currency", compareTitle: "Target vs actual" };
  }
}

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM or financial advice; educational use only.";

const CONFIG: Record<AiDailyLifeSlug, Config> = {
  "aist-ai-expense-splitter-groups": {
    title: "AI expense splitter (for groups)",
    description: "Fair bill split with tip, per-person shares, settlement amounts, and group insights.",
    mode: "expenseSplitter",
  },
  "aist-ai-bill-planner": {
    title: "AI bill planner",
    description: "Monthly bill load vs income, leftover buffer, and due-order schedule.",
    mode: "billPlanner",
  },
  "aist-ai-lifestyle-cost-calculator": {
    title: "AI lifestyle cost calculator",
    description: "Needs, wants, and savings breakdown with 50/30/20 benchmark compare.",
    mode: "lifestyleCost",
  },
  "aist-ai-best-deal-finder": {
    title: "AI best deal finder",
    description: "Unit-price comparison across stores to find the true cheapest offer.",
    mode: "bestDealFinder",
  },
  "aist-ai-discount-optimizer": {
    title: "AI discount optimizer",
    description: "Stack percentage off, coupons, and cashback to reveal effective price.",
    mode: "discountOptimizer",
  },
  "aist-ai-price-comparison-advisor": {
    title: "AI price comparison advisor",
    description: "Multi-retailer score balancing price, shipping, and warranty.",
    mode: "priceComparison",
  },
  "aist-ai-trip-cost-planner": {
    title: "AI trip cost planner",
    description: "Flights, stay, food, and activities total with per-person and daily burn.",
    mode: "tripCost",
  },
  "aist-ai-travel-budget-optimizer": {
    title: "AI travel budget optimizer",
    description: "Budget-to-category allocation by trip style with scenario cards.",
    mode: "travelBudget",
  },
  "aist-ai-fuel-cost-predictor": {
    title: "AI fuel cost predictor",
    description: "Trip fuel litres and cost from distance, mileage, and pump price.",
    mode: "fuelCost",
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

export function AiDailyLifeSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiDailyLifeSlug] ?? CONFIG["aist-ai-expense-splitter-groups"];
  const mode = config.mode;

  const [tot, setTot] = useState(useLoanInitialInput(AI_DAILY_URL.TOTAL, "2500"));
  const [ppl, setPpl] = useState(useLoanInitialInput(AI_DAILY_URL.PEOPLE, "4"));
  const [tip, setTip] = useState(useLoanInitialInput(AI_DAILY_URL.TIP, "10"));
  const [p1, setP1] = useState(useLoanInitialInput(AI_DAILY_URL.P1, "1"));
  const [p2, setP2] = useState(useLoanInitialInput(AI_DAILY_URL.P2, "1"));
  const [p3, setP3] = useState(useLoanInitialInput(AI_DAILY_URL.P3, "1"));
  const [p4, setP4] = useState(useLoanInitialInput(AI_DAILY_URL.P4, "1"));
  const [method, setMethod] = useState<SplitMethod>(parseSplitMethod(useLoanInitialInput("method", "equal")));
  const [inc, setInc] = useState(useLoanInitialInput(AI_DAILY_URL.INCOME, "50000"));
  const [b1n, setB1n] = useState(useLoanInitialInput(AI_DAILY_URL.B1N, "Rent"));
  const [b1a, setB1a] = useState(useLoanInitialInput(AI_DAILY_URL.B1A, "18000"));
  const [b2n, setB2n] = useState(useLoanInitialInput(AI_DAILY_URL.B2N, "Utilities"));
  const [b2a, setB2a] = useState(useLoanInitialInput(AI_DAILY_URL.B2A, "2500"));
  const [b3n, setB3n] = useState(useLoanInitialInput(AI_DAILY_URL.B3N, "Internet"));
  const [b3a, setB3a] = useState(useLoanInitialInput(AI_DAILY_URL.B3A, "999"));
  const [b4n, setB4n] = useState(useLoanInitialInput(AI_DAILY_URL.B4N, "Insurance"));
  const [b4a, setB4a] = useState(useLoanInitialInput(AI_DAILY_URL.B4A, "1500"));
  const [rent, setRent] = useState(useLoanInitialInput(AI_DAILY_URL.RENT, "15000"));
  const [food, setFood] = useState(useLoanInitialInput(AI_DAILY_URL.FOOD, "8000"));
  const [trn, setTrn] = useState(useLoanInitialInput(AI_DAILY_URL.TRANSPORT, "3000"));
  const [sub, setSub] = useState(useLoanInitialInput(AI_DAILY_URL.SUBS, "1500"));
  const [ent, setEnt] = useState(useLoanInitialInput(AI_DAILY_URL.ENT, "2000"));
  const [sv, setSv] = useState(useLoanInitialInput(AI_DAILY_URL.SAVE, "5000"));
  const [pr1, setPr1] = useState(useLoanInitialInput(AI_DAILY_URL.PR1, "299"));
  const [pr2, setPr2] = useState(useLoanInitialInput(AI_DAILY_URL.PR2, "549"));
  const [pr3, setPr3] = useState(useLoanInitialInput(AI_DAILY_URL.PR3, "799"));
  const [q1, setQ1] = useState(useLoanInitialInput(AI_DAILY_URL.Q1, "1"));
  const [q2, setQ2] = useState(useLoanInitialInput(AI_DAILY_URL.Q2, "2"));
  const [q3, setQ3] = useState(useLoanInitialInput(AI_DAILY_URL.Q3, "3"));
  const [orig, setOrig] = useState(useLoanInitialInput(AI_DAILY_URL.ORIG, "5000"));
  const [disc, setDisc] = useState(useLoanInitialInput(AI_DAILY_URL.DISC, "20"));
  const [cpn, setCpn] = useState(useLoanInitialInput(AI_DAILY_URL.COUPON, "200"));
  const [cb, setCb] = useState(useLoanInitialInput(AI_DAILY_URL.CASHBACK, "5"));
  const [o1, setO1] = useState(useLoanInitialInput(AI_DAILY_URL.O1, "12000"));
  const [o2, setO2] = useState(useLoanInitialInput(AI_DAILY_URL.O2, "11500"));
  const [o3, setO3] = useState(useLoanInitialInput(AI_DAILY_URL.O3, "11800"));
  const [s1, setS1] = useState(useLoanInitialInput(AI_DAILY_URL.S1, "0"));
  const [s2, setS2] = useState(useLoanInitialInput(AI_DAILY_URL.S2, "199"));
  const [s3, setS3] = useState(useLoanInitialInput(AI_DAILY_URL.S3, "99"));
  const [w1, setW1] = useState(useLoanInitialInput(AI_DAILY_URL.W1, "70"));
  const [w2, setW2] = useState(useLoanInitialInput(AI_DAILY_URL.W2, "85"));
  const [w3, setW3] = useState(useLoanInitialInput(AI_DAILY_URL.W3, "60"));
  const [dys, setDys] = useState(useLoanInitialInput(AI_DAILY_URL.DAYS, "5"));
  const [trv, setTrv] = useState(useLoanInitialInput(AI_DAILY_URL.TRAVELERS, "2"));
  const [flt, setFlt] = useState(useLoanInitialInput(AI_DAILY_URL.FLIGHT, "8000"));
  const [htl, setHtl] = useState(useLoanInitialInput(AI_DAILY_URL.HOTEL, "3500"));
  const [fd, setFd] = useState(useLoanInitialInput(AI_DAILY_URL.FOOD_DAY, "800"));
  const [act, setAct] = useState(useLoanInitialInput(AI_DAILY_URL.ACTIVITIES, "2000"));
  const [bud, setBud] = useState(useLoanInitialInput(AI_DAILY_URL.BUDGET, "50000"));
  const [style, setStyle] = useState<TripStyle>(parseTripStyle(useLoanInitialInput("style", "comfort")));
  const [dist, setDist] = useState(useLoanInitialInput(AI_DAILY_URL.DIST, "120"));
  const [mpg, setMpg] = useState(useLoanInitialInput(AI_DAILY_URL.MILEAGE, "15"));
  const [fuel, setFuel] = useState(useLoanInitialInput(AI_DAILY_URL.FUEL, "102"));
  const [rnd, setRnd] = useState(useLoanInitialInput(AI_DAILY_URL.ROUND, "1"));

  const inputs = useMemo(
    () => ({
      tot, ppl, tip, p1, p2, p3, p4, method, inc, b1n, b1a, b2n, b2a, b3n, b3a, b4n, b4a,
      rent, food, trn, sub, ent, sv, pr1, pr2, pr3, q1, q2, q3, orig, disc, cpn, cb,
      o1, o2, o3, s1, s2, s3, w1, w2, w3, dys, trv, flt, htl, fd, act, bud, style, dist, mpg, fuel, rnd,
    }),
    [tot, ppl, tip, p1, p2, p3, p4, method, inc, b1n, b1a, b2n, b2a, b3n, b3a, b4n, b4a, rent, food, trn, sub, ent, sv, pr1, pr2, pr3, q1, q2, q3, orig, disc, cpn, cb, o1, o2, o3, s1, s2, s3, w1, w2, w3, dys, trv, flt, htl, fd, act, bud, style, dist, mpg, fuel, rnd],
  );

  const shareParams = useCallback(
    () => ({
      [AI_DAILY_URL.TOTAL]: tot, [AI_DAILY_URL.PEOPLE]: ppl, [AI_DAILY_URL.TIP]: tip,
      [AI_DAILY_URL.P1]: p1, [AI_DAILY_URL.P2]: p2, [AI_DAILY_URL.P3]: p3, [AI_DAILY_URL.P4]: p4, method,
      [AI_DAILY_URL.INCOME]: inc, [AI_DAILY_URL.B1N]: b1n, [AI_DAILY_URL.B1A]: b1a, [AI_DAILY_URL.B2N]: b2n, [AI_DAILY_URL.B2A]: b2a,
      [AI_DAILY_URL.B3N]: b3n, [AI_DAILY_URL.B3A]: b3a, [AI_DAILY_URL.B4N]: b4n, [AI_DAILY_URL.B4A]: b4a,
      [AI_DAILY_URL.RENT]: rent, [AI_DAILY_URL.FOOD]: food, [AI_DAILY_URL.TRANSPORT]: trn, [AI_DAILY_URL.SUBS]: sub,
      [AI_DAILY_URL.ENT]: ent, [AI_DAILY_URL.SAVE]: sv,
      [AI_DAILY_URL.PR1]: pr1, [AI_DAILY_URL.PR2]: pr2, [AI_DAILY_URL.PR3]: pr3, [AI_DAILY_URL.Q1]: q1, [AI_DAILY_URL.Q2]: q2, [AI_DAILY_URL.Q3]: q3,
      [AI_DAILY_URL.ORIG]: orig, [AI_DAILY_URL.DISC]: disc, [AI_DAILY_URL.COUPON]: cpn, [AI_DAILY_URL.CASHBACK]: cb,
      [AI_DAILY_URL.O1]: o1, [AI_DAILY_URL.O2]: o2, [AI_DAILY_URL.O3]: o3, [AI_DAILY_URL.S1]: s1, [AI_DAILY_URL.S2]: s2, [AI_DAILY_URL.S3]: s3,
      [AI_DAILY_URL.W1]: w1, [AI_DAILY_URL.W2]: w2, [AI_DAILY_URL.W3]: w3,
      [AI_DAILY_URL.DAYS]: dys, [AI_DAILY_URL.TRAVELERS]: trv, [AI_DAILY_URL.FLIGHT]: flt, [AI_DAILY_URL.HOTEL]: htl,
      [AI_DAILY_URL.FOOD_DAY]: fd, [AI_DAILY_URL.ACTIVITIES]: act, [AI_DAILY_URL.BUDGET]: bud, style,
      [AI_DAILY_URL.DIST]: dist, [AI_DAILY_URL.MILEAGE]: mpg, [AI_DAILY_URL.FUEL]: fuel, [AI_DAILY_URL.ROUND]: rnd,
    }),
    [tot, ppl, tip, p1, p2, p3, p4, method, inc, b1n, b1a, b2n, b2a, b3n, b3a, b4n, b4a, rent, food, trn, sub, ent, sv, pr1, pr2, pr3, q1, q2, q3, orig, disc, cpn, cb, o1, o2, o3, s1, s2, s3, w1, w2, w3, dys, trv, flt, htl, fd, act, bud, style, dist, mpg, fuel, rnd],
  );

  useLoanUrlSync(shareParams, [inputs]);

  const result = useMemo(() => computeDailyLifeHostResult(mode, inputs), [mode, inputs]);

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
        {mode === "expenseSplitter" && (
          <>
            {field("tot", "Bill total (₹)", tot, setTot)}
            {field("ppl", "People", ppl, setPpl)}
            {field("tip", "Tip %", tip, setTip)}
            <div>
              <FieldLabel htmlFor="method">Split method</FieldLabel>
              <select id="method" value={method} onChange={(e) => setMethod(parseSplitMethod(e.target.value))} className={selectCls}>
                <option value="equal">Equal</option>
                <option value="weighted">Weighted shares</option>
              </select>
            </div>
            {method === "weighted" && (
              <>
                {field("p1", "Person 1 weight", p1, setP1)}
                {field("p2", "Person 2 weight", p2, setP2)}
                {field("p3", "Person 3 weight", p3, setP3)}
                {field("p4", "Person 4 weight", p4, setP4)}
              </>
            )}
          </>
        )}
        {mode === "billPlanner" && (
          <>
            {field("inc", "Monthly income (₹)", inc, setInc)}
            {[["b1n", b1n, setB1n, "b1a", b1a, setB1a], ["b2n", b2n, setB2n, "b2a", b2a, setB2a], ["b3n", b3n, setB3n, "b3a", b3a, setB3a], ["b4n", b4n, setB4n, "b4a", b4a, setB4a]].map(([nk, nv, ns, ak, av, as]) => (
              <div key={nk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div><FieldLabel htmlFor={nk as string}>Bill</FieldLabel><FieldInput id={nk as string} value={nv as string} onChange={(e) => (ns as (v: string) => void)(e.target.value)} className="mt-2" /></div>
                {field(ak as string, "Amount (₹)", av as string, as as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "lifestyleCost" && (
          <>
            {field("rent", "Rent / housing (₹)", rent, setRent)}
            {field("food", "Food (₹)", food, setFood)}
            {field("trn", "Transport (₹)", trn, setTrn)}
            {field("sub", "Subscriptions (₹)", sub, setSub)}
            {field("ent", "Entertainment (₹)", ent, setEnt)}
            {field("sv", "Savings goal (₹)", sv, setSv)}
          </>
        )}
        {mode === "bestDealFinder" && (
          <>
            {[["pr1", pr1, setPr1, "q1", q1, setQ1, "Store A"], ["pr2", pr2, setPr2, "q2", q2, setQ2, "Store B"], ["pr3", pr3, setPr3, "q3", q3, setQ3, "Store C"]].map(([pk, pv, ps, qk, qv, qs, label]) => (
              <div key={pk as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                {field(pk as string, `${label} price (₹)`, pv as string, ps as (v: string) => void)}
                {field(qk as string, `${label} qty`, qv as string, qs as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "discountOptimizer" && (
          <>
            {field("orig", "Original price (₹)", orig, setOrig)}
            {field("disc", "Discount %", disc, setDisc)}
            {field("cpn", "Coupon (₹)", cpn, setCpn)}
            {field("cb", "Cashback %", cb, setCb)}
          </>
        )}
        {mode === "priceComparison" && (
          <>
            {[["o1", o1, setO1, "s1", s1, setS1, "w1", w1, setW1, "Retailer A"], ["o2", o2, setO2, "s2", s2, setS2, "w2", w2, setW2, "Retailer B"], ["o3", o3, setO3, "s3", s3, setS3, "w3", w3, setW3, "Retailer C"]].map(([ok, ov, os, sk, sv, ss, wk, wv, ws, label]) => (
              <div key={ok as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                {field(ok as string, `${label} price`, ov as string, os as (v: string) => void)}
                {field(sk as string, "Shipping", sv as string, ss as (v: string) => void)}
                {field(wk as string, "Warranty (0–100)", wv as string, ws as (v: string) => void)}
              </div>
            ))}
          </>
        )}
        {mode === "tripCost" && (
          <>
            {field("dys", "Trip days", dys, setDys)}
            {field("trv", "Travelers", trv, setTrv)}
            {field("flt", "Flight per person (₹)", flt, setFlt)}
            {field("htl", "Hotel / night (₹)", htl, setHtl)}
            {field("fd", "Food / day / person (₹)", fd, setFd)}
            {field("act", "Activities per person (₹)", act, setAct)}
          </>
        )}
        {mode === "travelBudget" && (
          <>
            {field("bud", "Total budget (₹)", bud, setBud)}
            {field("dys", "Trip days", dys, setDys)}
            <div>
              <FieldLabel htmlFor="style">Trip style</FieldLabel>
              <select id="style" value={style} onChange={(e) => setStyle(parseTripStyle(e.target.value))} className={selectCls}>
                <option value="budget">Budget</option>
                <option value="comfort">Comfort</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
          </>
        )}
        {mode === "fuelCost" && (
          <>
            {field("dist", "One-way distance (km)", dist, setDist)}
            {field("mpg", "Mileage (km/L)", mpg, setMpg)}
            {field("fuel", "Fuel price (₹/L)", fuel, setFuel)}
            <div>
              <FieldLabel htmlFor="rnd">Round trip</FieldLabel>
              <select id="rnd" value={rnd} onChange={(e) => setRnd(e.target.value)} className={selectCls}>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
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
          {result.settlements?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Settlements</p>
              {result.settlements.map((s) => (
                <div key={s.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.name} · {s.direction}</span>
                  <span className="font-mono">₹{s.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.allocation?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Budget allocation</p>
              {result.allocation.map((a) => (
                <div key={a.category} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{a.category}</span>
                  <span className="font-mono">₹{a.amount.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.schedule?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Schedule</p>
              {result.schedule.map((s) => (
                <div key={`${s.time}-${s.activity}`} className="flex justify-between gap-4 rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span className="font-mono text-[var(--muted)]">{s.time}</span>
                  <span className="text-right">{s.activity}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.steps?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Stack breakdown</p>
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
                  <span>{s.name}</span>
                  <span className="font-mono">{s.score} · {s.status}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.milestones?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Cost milestones</p>
              {result.milestones.map((m) => (
                <div key={m.week} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{m.week} trips/wk</span>
                  <span className="font-mono">₹{m.target.toLocaleString("en-IN")}</span>
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
              <ScenarioCards scenarios={result.scenarios} valueFormat={mode === "lifestyleCost" ? "currency" : "currency"} />
            </div>
          ) : null}
          {result.insights && result.insights.length > 3 ? <InsightPanel insights={result.insights.slice(3)} title="More insights" /> : null}
        </>
      )}
    </CalculatorShell>
  );
}
