"use client";

import { useCallback, useMemo, useState } from "react";
import { CalculatorShell } from "@/components/CalculatorShell";
import {
  BucketTable,
  ChartBlock,
  HealthScoreBadge,
  InsightPanel,
  RebalanceTable,
  ScenarioCards,
} from "@/components/calculators/ai-finance/AiFinanceUi";
import { useLoanInitialInput } from "@/components/calculators/LoanInitialInputsContext";
import { FieldInput, FieldLabel } from "@/components/fields";
import { useLoanUrlSync } from "@/hooks/useLoanUrlSync";
import { AI_FINANCE_URL, type AiRiskProfile } from "@/lib/calculators/aiFinanceSmart";
import type { BudgetFramework } from "@/lib/calculators/aiFinanceSmartRich";
import type { GoalType } from "@/lib/calculators/aiFinanceInvestRich";
import { LOAN_URL } from "@/lib/calculators/loanUrlParams";
import { computeHostResult } from "./aiFinanceHostCompute";
import type { AiFinanceSlug } from "./aiFinanceHostTypes";

type Config = { title: string; description: string; mode: import("./aiFinanceHostTypes").Mode };

const AI_NOTE =
  "Smart analysis engine runs in your browser—multi-factor scoring, benchmarks, and projections. Not a live LLM; educational use only.";

const CONFIG: Record<AiFinanceSlug, Config> = {
  "aist-ai-budget-planner": {
    title: "AI budget planner",
    description:
      "Granular needs/wants split, financial health score, framework comparison (50/30/20 · 70/20/10 · 80/20), and category-level guidance.",
    mode: "budget",
  },
  "aist-ai-expense-analyzer": {
    title: "AI expense analyzer",
    description: "Eight spending categories, income benchmarks, fixed vs variable view, and prioritized cut recommendations.",
    mode: "expenseAnalyze",
  },
  "aist-ai-monthly-savings-planner": {
    title: "AI monthly savings planner",
    description: "Inflation-adjusted goals, return assumptions, savings path chart, milestones, and what-if scenarios.",
    mode: "savingsPlan",
  },
  "aist-ai-expense-optimization-tool": {
    title: "AI expense optimization tool",
    description: "Ranked cut list by ease of win, category breakdown chart, and target reduction math.",
    mode: "expenseOptimize",
  },
  "aist-ai-subscription-cost-analyzer": {
    title: "AI subscription cost analyzer",
    description: "Per-service burn, overlap detection, annualized waste estimate, and trim insights.",
    mode: "subscription",
  },
  "aist-ai-investment-planner": {
    title: "AI investment planner",
    description:
      "Inflation-adjusted goals, existing corpus, goal-type guidance, wealth projection, allocation donut, return scenarios, and SIP stress scoring.",
    mode: "investment",
  },
  "aist-ai-portfolio-analyzer": {
    title: "AI portfolio analyzer",
    description:
      "Four-asset drift score, target vs actual bars, rupee rebalance trades, equity sub-split, age-aware targets, and benchmark context.",
    mode: "portfolio",
  },
  "aist-ai-sip-strategy-optimizer": {
    title: "AI SIP strategy optimizer",
    description:
      "Flat vs step-up SIP comparison, inflation-adjusted corpus, wealth path chart, confidence band, and step-up scenarios.",
    mode: "sip",
  },
  "aist-ai-risk-analyzer-investor": {
    title: "AI risk analyzer (investor profile)",
    description:
      "Multi-factor capacity score from age, horizon, stability, emergency buffer, and loss tolerance with factor breakdown chart.",
    mode: "risk",
  },
  "aist-ai-asset-allocation-calculator": {
    title: "AI asset allocation calculator",
    description:
      "Rule-of-100 vs risk-adjusted mix, horizon guardrails, allocation donut, target compare bars, and portfolio scenarios.",
    mode: "allocation",
  },
  "aist-ai-loan-advisor": {
    title: "AI loan advisor",
    description:
      "DTI verdict, risk band, income breakdown chart, DTI benchmark compare, tenure scenarios, and free-cash stress check.",
    mode: "loanAdvisor",
  },
  "aist-ai-emi-strategy-optimizer": {
    title: "AI EMI strategy optimizer",
    description:
      "Full tenure ladder, interest compare bars, principal vs interest split, budget-fit filtering, and optimal plan insights.",
    mode: "emiOptimize",
  },
  "aist-ai-debt-repayment-planner": {
    title: "AI debt repayment planner",
    description:
      "Snowball vs avalanche with payoff path chart, interest compare, payoff order, third-debt support, and extra-payment scenarios.",
    mode: "debtRepay",
  },
  "aist-ai-credit-score-improver": {
    title: "AI credit score improver",
    description:
      "Factor-weighted score model, utilization benchmark compare, improvement path scenarios, and prioritized action insights.",
    mode: "creditScore",
  },
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-[var(--muted)]">{label}</span>
      <span className="font-mono text-right">{value}</span>
    </div>
  );
}

function parseRisk(raw: string): AiRiskProfile {
  if (raw === "low" || raw === "high") return raw;
  return "medium";
}

function parseFramework(raw: string): BudgetFramework {
  if (raw === "70-20-10" || raw === "80-20") return raw;
  return "50-30-20";
}

function parseGoalType(raw: string): GoalType {
  if (raw === "retirement" || raw === "education" || raw === "house") return raw;
  return "general";
}

const selectCls =
  "mt-2 w-full rounded-lg border border-[var(--border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--text)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]";

export function AiFinanceSmartCalculatorHost({ slug }: { slug: string }) {
  const config = CONFIG[slug as AiFinanceSlug] ?? CONFIG["aist-ai-budget-planner"];
  const mode = config.mode;

  const [income, setIncome] = useState(useLoanInitialInput(AI_FINANCE_URL.I, "100000"));
  const [framework, setFramework] = useState<BudgetFramework>(parseFramework(useLoanInitialInput("fw", "50-30-20")));
  const [rent, setRent] = useState(useLoanInitialInput("rnt", "28000"));
  const [utilities, setUtilities] = useState(useLoanInitialInput("ut", "4000"));
  const [emi, setEmi] = useState(useLoanInitialInput("em", "12000"));
  const [insurance, setInsurance] = useState(useLoanInitialInput("ins", "2000"));
  const [groceries, setGroceries] = useState(useLoanInitialInput("gr", "8000"));
  const [transport, setTransport] = useState(useLoanInitialInput("tr", "6000"));
  const [entertainment, setEntertainment] = useState(useLoanInitialInput("ent", "5000"));
  const [shopping, setShopping] = useState(useLoanInitialInput("sh", "4000"));
  const [other, setOther] = useState(useLoanInitialInput(AI_FINANCE_URL.OT, "3000"));
  const [savingsGoal, setSavingsGoal] = useState(useLoanInitialInput("sg", "20000"));
  const [housing, setHousing] = useState(useLoanInitialInput("h", "30000"));
  const [food, setFood] = useState(useLoanInitialInput("fd", "12000"));
  const [subscriptions, setSubscriptions] = useState(useLoanInitialInput("sb", "2500"));
  const [healthcare, setHealthcare] = useState(useLoanInitialInput("hc", "2000"));
  const [education, setEducation] = useState(useLoanInitialInput("edu", "0"));
  const [goal, setGoal] = useState(useLoanInitialInput(AI_FINANCE_URL.GOAL, "500000"));
  const [months, setMonths] = useState(useLoanInitialInput(AI_FINANCE_URL.MONTHS, "24"));
  const [expenses, setExpenses] = useState(useLoanInitialInput("ex", "70000"));
  const [inflation, setInflation] = useState(useLoanInitialInput("inf", "5"));
  const [existingSavings, setExistingSavings] = useState(useLoanInitialInput("es", "50000"));
  const [targetCut, setTargetCut] = useState(useLoanInitialInput(AI_FINANCE_URL.TARGET, "10"));
  const [sub1, setSub1] = useState(useLoanInitialInput("s1", "649"));
  const [sub2, setSub2] = useState(useLoanInitialInput("s2", "499"));
  const [sub3, setSub3] = useState(useLoanInitialInput("s3", "119"));
  const [sub4, setSub4] = useState(useLoanInitialInput("s4", "299"));
  const [sub1name, setSub1name] = useState(useLoanInitialInput("s1n", "Streaming"));
  const [sub2name, setSub2name] = useState(useLoanInitialInput("s2n", "Cloud"));
  const [sub3name, setSub3name] = useState(useLoanInitialInput("s3n", "Music"));
  const [sub4name, setSub4name] = useState(useLoanInitialInput("s4n", "VPN"));
  const [years, setYears] = useState(useLoanInitialInput("yr", "10"));
  const [returnPct, setReturnPct] = useState(useLoanInitialInput(AI_FINANCE_URL.RETURN, "12"));
  const [risk, setRisk] = useState<AiRiskProfile>(parseRisk(useLoanInitialInput(AI_FINANCE_URL.RK, "medium")));
  const [equity, setEquity] = useState(useLoanInitialInput(AI_FINANCE_URL.EQ, "55"));
  const [debt, setDebt] = useState(useLoanInitialInput(AI_FINANCE_URL.DB, "35"));
  const [otherAlloc, setOtherAlloc] = useState(useLoanInitialInput("oa", "10"));
  const [gold, setGold] = useState(useLoanInitialInput("gld", "7"));
  const [cash, setCash] = useState(useLoanInitialInput("cs", "3"));
  const [portfolioValue, setPortfolioValue] = useState(useLoanInitialInput("pv", "1500000"));
  const [goalType, setGoalType] = useState<GoalType>(parseGoalType(useLoanInitialInput("gt", "general")));
  const [stepUpPct, setStepUpPct] = useState(useLoanInitialInput("sup", "10"));
  const [age, setAge] = useState(useLoanInitialInput(AI_FINANCE_URL.AGE, "32"));
  const [stability, setStability] = useState(useLoanInitialInput("st", "75"));
  const [principal, setPrincipal] = useState(useLoanInitialInput(LOAN_URL.P, "2500000"));
  const [apr, setApr] = useState(useLoanInitialInput(LOAN_URL.A, "8.5"));
  const [termRaw, setTermRaw] = useState(useLoanInitialInput(LOAN_URL.T, "20"));
  const [existingDebt, setExistingDebt] = useState(useLoanInitialInput("ed", "15000"));
  const [maxEmi, setMaxEmi] = useState(useLoanInitialInput("me", "35000"));
  const [d1b, setD1b] = useState(useLoanInitialInput(AI_FINANCE_URL.D1B, "50000"));
  const [d1a, setD1a] = useState(useLoanInitialInput(AI_FINANCE_URL.D1A, "18"));
  const [d1m, setD1m] = useState(useLoanInitialInput(AI_FINANCE_URL.D1M, "2000"));
  const [d2b, setD2b] = useState(useLoanInitialInput(AI_FINANCE_URL.D2B, "25000"));
  const [d2a, setD2a] = useState(useLoanInitialInput(AI_FINANCE_URL.D2A, "24"));
  const [d2m, setD2m] = useState(useLoanInitialInput(AI_FINANCE_URL.D2M, "1000"));
  const [extra, setExtra] = useState(useLoanInitialInput(AI_FINANCE_URL.EXTRA, "2000"));
  const [utilization, setUtilization] = useState(useLoanInitialInput(AI_FINANCE_URL.UTIL, "35"));
  const [payHistory, setPayHistory] = useState(useLoanInitialInput(AI_FINANCE_URL.PAYH, "85"));
  const [acctAge, setAcctAge] = useState(useLoanInitialInput("aa", "4"));
  const [inquiries, setInquiries] = useState(useLoanInitialInput("inq", "2"));
  const [emergencyMonths, setEmergencyMonths] = useState(useLoanInitialInput("emf", "6"));
  const [lossTolerance, setLossTolerance] = useState(useLoanInitialInput("lt", "50"));
  const [targetScore, setTargetScore] = useState(useLoanInitialInput("ts", "750"));
  const [d1name, setD1name] = useState(useLoanInitialInput("d1n", "Credit card"));
  const [d2name, setD2name] = useState(useLoanInitialInput("d2n", "Personal loan"));
  const [d3b, setD3b] = useState(useLoanInitialInput("d3b", "0"));
  const [d3a, setD3a] = useState(useLoanInitialInput("d3a", "0"));
  const [d3m, setD3m] = useState(useLoanInitialInput("d3m", "0"));
  const [d3name, setD3name] = useState(useLoanInitialInput("d3n", "Other debt"));

  const inputs = useMemo(
    () => ({
      income,
      framework,
      rent,
      utilities,
      emi,
      insurance,
      groceries,
      transport,
      entertainment,
      shopping,
      other,
      savingsGoal,
      housing,
      food,
      subscriptions,
      healthcare,
      education,
      goal,
      months,
      expenses,
      inflation,
      existingSavings,
      targetCut,
      sub1,
      sub2,
      sub3,
      sub4,
      sub1name,
      sub2name,
      sub3name,
      sub4name,
      years,
      returnPct,
      risk,
      equity,
      debt,
      otherAlloc,
      gold,
      cash,
      portfolioValue,
      goalType,
      stepUpPct,
      age,
      stability,
      principal,
      apr,
      termRaw,
      existingDebt,
      maxEmi,
      d1b,
      d1a,
      d1m,
      d2b,
      d2a,
      d2m,
      extra,
      utilization,
      payHistory,
      acctAge,
      inquiries,
      emergencyMonths,
      lossTolerance,
      targetScore,
      d1name,
      d2name,
      d3b,
      d3a,
      d3m,
      d3name,
    }),
    [
      income,
      framework,
      rent,
      utilities,
      emi,
      insurance,
      groceries,
      transport,
      entertainment,
      shopping,
      other,
      savingsGoal,
      housing,
      food,
      subscriptions,
      healthcare,
      education,
      goal,
      months,
      expenses,
      inflation,
      existingSavings,
      targetCut,
      sub1,
      sub2,
      sub3,
      sub4,
      sub1name,
      sub2name,
      sub3name,
      sub4name,
      years,
      returnPct,
      risk,
      equity,
      debt,
      otherAlloc,
      gold,
      cash,
      portfolioValue,
      goalType,
      stepUpPct,
      age,
      stability,
      principal,
      apr,
      termRaw,
      existingDebt,
      maxEmi,
      d1b,
      d1a,
      d1m,
      d2b,
      d2a,
      d2m,
      extra,
      utilization,
      payHistory,
      acctAge,
      inquiries,
      emergencyMonths,
      lossTolerance,
      targetScore,
      d1name,
      d2name,
      d3b,
      d3a,
      d3m,
      d3name,
    ],
  );

  const shareParams = useCallback(
    () => ({
      [AI_FINANCE_URL.I]: income,
      fw: framework,
      rnt: rent,
      ut: utilities,
      em: emi,
      ins: insurance,
      gr: groceries,
      tr: transport,
      ent: entertainment,
      sh: shopping,
      [AI_FINANCE_URL.OT]: other,
      sg: savingsGoal,
      h: housing,
      fd: food,
      sb: subscriptions,
      hc: healthcare,
      edu: education,
      [AI_FINANCE_URL.GOAL]: goal,
      [AI_FINANCE_URL.MONTHS]: months,
      ex: expenses,
      inf: inflation,
      es: existingSavings,
      [AI_FINANCE_URL.TARGET]: targetCut,
      s1: sub1,
      s2: sub2,
      s3: sub3,
      s4: sub4,
      s1n: sub1name,
      s2n: sub2name,
      s3n: sub3name,
      s4n: sub4name,
      yr: years,
      [AI_FINANCE_URL.RETURN]: returnPct,
      [AI_FINANCE_URL.RK]: risk,
      [AI_FINANCE_URL.EQ]: equity,
      [AI_FINANCE_URL.DB]: debt,
      oa: otherAlloc,
      gld: gold,
      cs: cash,
      pv: portfolioValue,
      gt: goalType,
      sup: stepUpPct,
      [AI_FINANCE_URL.AGE]: age,
      st: stability,
      [LOAN_URL.P]: principal,
      [LOAN_URL.A]: apr,
      [LOAN_URL.T]: termRaw,
      ed: existingDebt,
      me: maxEmi,
      [AI_FINANCE_URL.D1B]: d1b,
      [AI_FINANCE_URL.D1A]: d1a,
      [AI_FINANCE_URL.D1M]: d1m,
      [AI_FINANCE_URL.D2B]: d2b,
      [AI_FINANCE_URL.D2A]: d2a,
      [AI_FINANCE_URL.D2M]: d2m,
      [AI_FINANCE_URL.EXTRA]: extra,
      [AI_FINANCE_URL.UTIL]: utilization,
      [AI_FINANCE_URL.PAYH]: payHistory,
      aa: acctAge,
      inq: inquiries,
      emf: emergencyMonths,
      lt: lossTolerance,
      ts: targetScore,
      d1n: d1name,
      d2n: d2name,
      d3b,
      d3a,
      d3m,
      d3n: d3name,
    }),
    [
      income,
      framework,
      rent,
      utilities,
      emi,
      insurance,
      groceries,
      transport,
      entertainment,
      shopping,
      other,
      savingsGoal,
      housing,
      food,
      subscriptions,
      healthcare,
      education,
      goal,
      months,
      expenses,
      inflation,
      existingSavings,
      targetCut,
      sub1,
      sub2,
      sub3,
      sub4,
      sub1name,
      sub2name,
      sub3name,
      sub4name,
      years,
      returnPct,
      risk,
      equity,
      debt,
      otherAlloc,
      gold,
      cash,
      portfolioValue,
      goalType,
      stepUpPct,
      age,
      stability,
      principal,
      apr,
      termRaw,
      existingDebt,
      maxEmi,
      d1b,
      d1a,
      d1m,
      d2b,
      d2a,
      d2m,
      extra,
      utilization,
      payHistory,
      acctAge,
      inquiries,
      emergencyMonths,
      lossTolerance,
      targetScore,
      d1name,
      d2name,
      d3b,
      d3a,
      d3m,
      d3name,
    ],
  );

  useLoanUrlSync(shareParams, [inputs, framework, principal, apr, termRaw, income]);

  const result = useMemo(() => computeHostResult(mode, inputs), [mode, inputs]);

  const field = (id: string, label: string, value: string, set: (v: string) => void) => (
    <div key={id}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldInput id={id} inputMode="decimal" value={value} onChange={(e) => set(e.target.value)} className="mt-2" />
    </div>
  );

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
              <HealthScoreBadge score={result.healthScore} grade={result.grade} />
            ) : null}
            <div>
              <p className="text-[var(--muted)]">{result.primaryLabel}</p>
              <p className="font-mono text-2xl font-semibold text-[var(--accent-bright)] sm:text-3xl">{result.primary}</p>
            </div>
            {result.rows?.length ? (
              <div className="grid gap-2 border-t border-[var(--border)] pt-3">
                {result.rows.map((row, i) => (
                  <Row key={`${row.label}-${i}`} label={row.label} value={row.value} />
                ))}
              </div>
            ) : null}
            {result.insights?.length ? <InsightPanel insights={result.insights.slice(0, 3)} /> : null}
          </div>
        )
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {mode === "budget" && (
          <>
            {field("income", "Monthly income (₹)", income, setIncome)}
            <div>
              <FieldLabel htmlFor="framework">Budget framework</FieldLabel>
              <select id="framework" value={framework} onChange={(e) => setFramework(parseFramework(e.target.value))} className={selectCls}>
                <option value="50-30-20">50 / 30 / 20</option>
                <option value="70-20-10">70 / 20 / 10</option>
                <option value="80-20">80 / 20 (aggressive payoff)</option>
              </select>
            </div>
            {field("rent", "Rent / housing (₹)", rent, setRent)}
            {field("utilities", "Utilities (₹)", utilities, setUtilities)}
            {field("emi", "Loan EMIs (₹)", emi, setEmi)}
            {field("insurance", "Insurance (₹)", insurance, setInsurance)}
            {field("groceries", "Groceries (₹)", groceries, setGroceries)}
            {field("transport", "Transport (₹)", transport, setTransport)}
            {field("entertainment", "Entertainment (₹)", entertainment, setEntertainment)}
            {field("shopping", "Shopping (₹)", shopping, setShopping)}
            {field("other", "Other wants (₹)", other, setOther)}
            {field("savingsGoal", "Monthly savings goal (₹)", savingsGoal, setSavingsGoal)}
          </>
        )}

        {mode === "expenseAnalyze" && (
          <>
            {field("income", "Monthly income (₹, optional)", income, setIncome)}
            {field("housing", "Housing (₹)", housing, setHousing)}
            {field("food", "Food & dining (₹)", food, setFood)}
            {field("transport", "Transport (₹)", transport, setTransport)}
            {field("subscriptions", "Subscriptions (₹)", subscriptions, setSubscriptions)}
            {field("healthcare", "Healthcare (₹)", healthcare, setHealthcare)}
            {field("education", "Education (₹)", education, setEducation)}
            {field("shopping", "Shopping (₹)", shopping, setShopping)}
            {field("other", "Other (₹)", other, setOther)}
          </>
        )}

        {mode === "savingsPlan" && (
          <>
            {field("income", "Monthly income (₹)", income, setIncome)}
            {field("expenses", "Monthly expenses (₹)", expenses, setExpenses)}
            {field("goal", "Savings goal (₹)", goal, setGoal)}
            {field("months", "Months to goal", months, setMonths)}
            {field("returnPct", "Expected return % (SIP)", returnPct, setReturnPct)}
            {field("inflation", "Inflation % (annual)", inflation, setInflation)}
            {field("existingSavings", "Existing savings (₹)", existingSavings, setExistingSavings)}
          </>
        )}

        {mode === "expenseOptimize" && (
          <>
            {field("income", "Monthly income (₹, optional)", income, setIncome)}
            {field("housing", "Housing (₹)", housing, setHousing)}
            {field("food", "Food (₹)", food, setFood)}
            {field("transport", "Transport (₹)", transport, setTransport)}
            {field("subscriptions", "Subscriptions (₹)", subscriptions, setSubscriptions)}
            {field("entertainment", "Entertainment (₹)", entertainment, setEntertainment)}
            {field("shopping", "Shopping (₹)", shopping, setShopping)}
            {field("targetCut", "Target cut %", targetCut, setTargetCut)}
          </>
        )}

        {mode === "subscription" && (
          <>
            {[
              [sub1name, setSub1name, sub1, setSub1, "s1"],
              [sub2name, setSub2name, sub2, setSub2, "s2"],
              [sub3name, setSub3name, sub3, setSub3, "s3"],
              [sub4name, setSub4name, sub4, setSub4, "s4"],
            ].map(([n, sn, a, sa, key], i) => (
              <div key={key as string} className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor={`${key}-n`}>Service {i + 1}</FieldLabel>
                  <FieldInput id={`${key}-n`} value={n as string} onChange={(e) => (sn as (v: string) => void)(e.target.value)} className="mt-2" />
                </div>
                {field(`${key}-a`, "Monthly (₹)", a as string, sa as (v: string) => void)}
              </div>
            ))}
          </>
        )}

        {(mode === "investment" || mode === "sip") && (
          <>
            {field("goal", mode === "sip" ? "Target corpus (₹)" : "Goal (₹)", goal, setGoal)}
            {field("years", "Years", years, setYears)}
            {field("returnPct", "Expected return %", returnPct, setReturnPct)}
            {field("inflation", "Inflation % (annual)", inflation, setInflation)}
            {field("existingSavings", "Existing corpus (₹)", existingSavings, setExistingSavings)}
            {mode === "sip" && field("stepUpPct", "Yearly step-up %", stepUpPct, setStepUpPct)}
            {mode === "investment" && (
              <>
                {field("income", "Monthly income (₹, optional)", income, setIncome)}
                <div>
                  <FieldLabel htmlFor="goalType">Goal type</FieldLabel>
                  <select
                    id="goalType"
                    value={goalType}
                    onChange={(e) => setGoalType(parseGoalType(e.target.value))}
                    className={selectCls}
                  >
                    <option value="general">General wealth</option>
                    <option value="retirement">Retirement</option>
                    <option value="education">Education</option>
                    <option value="house">Home down-payment</option>
                  </select>
                </div>
                <div>
                  <FieldLabel htmlFor="risk">Risk profile</FieldLabel>
                  <select id="risk" value={risk} onChange={(e) => setRisk(parseRisk(e.target.value))} className={selectCls}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {mode === "portfolio" && (
          <>
            {field("equity", "Equity %", equity, setEquity)}
            {field("debt", "Debt %", debt, setDebt)}
            {field("gold", "Gold %", gold, setGold)}
            {field("cash", "Cash %", cash, setCash)}
            {field("portfolioValue", "Portfolio value (₹)", portfolioValue, setPortfolioValue)}
            {field("age", "Age", age, setAge)}
            {field("years", "Horizon (years)", years, setYears)}
            <div>
              <FieldLabel htmlFor="risk">Risk profile</FieldLabel>
              <select id="risk" value={risk} onChange={(e) => setRisk(parseRisk(e.target.value))} className={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        )}

        {mode === "risk" && (
          <>
            {field("age", "Age", age, setAge)}
            {field("years", "Horizon (years)", years, setYears)}
            {field("stability", "Income stability (0–100)", stability, setStability)}
            {field("emergencyMonths", "Emergency fund (months)", emergencyMonths, setEmergencyMonths)}
            {field("lossTolerance", "Loss tolerance (0–100)", lossTolerance, setLossTolerance)}
          </>
        )}

        {mode === "allocation" && (
          <>
            {field("age", "Age", age, setAge)}
            {field("years", "Horizon (years)", years, setYears)}
            {field("portfolioValue", "Portfolio value (₹, optional)", portfolioValue, setPortfolioValue)}
            <div>
              <FieldLabel htmlFor="risk">Risk profile</FieldLabel>
              <select id="risk" value={risk} onChange={(e) => setRisk(parseRisk(e.target.value))} className={selectCls}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </>
        )}

        {(mode === "loanAdvisor" || mode === "emiOptimize") && (
          <>
            {mode === "loanAdvisor" && field("income", "Monthly income (₹)", income, setIncome)}
            {mode === "loanAdvisor" && field("existingDebt", "Existing EMIs (₹)", existingDebt, setExistingDebt)}
            {field("principal", "Loan amount (₹)", principal, setPrincipal)}
            {field("apr", "APR %", apr, setApr)}
            {mode === "loanAdvisor" ? (
              <>
                {field("term", "Term (years)", termRaw, setTermRaw)}
                {field("emergencyMonths", "Emergency buffer (months)", emergencyMonths, setEmergencyMonths)}
              </>
            ) : (
              field("maxEmi", "Max affordable EMI (₹)", maxEmi, setMaxEmi)
            )}
          </>
        )}

        {mode === "debtRepay" && (
          <>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="d1n">Debt 1 name</FieldLabel>
                <FieldInput id="d1n" value={d1name} onChange={(e) => setD1name(e.target.value)} className="mt-2" />
              </div>
              {field("d1b", "Debt 1 balance (₹)", d1b, setD1b)}
              {field("d1a", "Debt 1 APR %", d1a, setD1a)}
              {field("d1m", "Debt 1 min pay (₹)", d1m, setD1m)}
            </div>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="d2n">Debt 2 name</FieldLabel>
                <FieldInput id="d2n" value={d2name} onChange={(e) => setD2name(e.target.value)} className="mt-2" />
              </div>
              {field("d2b", "Debt 2 balance (₹)", d2b, setD2b)}
              {field("d2a", "Debt 2 APR %", d2a, setD2a)}
              {field("d2m", "Debt 2 min pay (₹)", d2m, setD2m)}
            </div>
            <div className="sm:col-span-2 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="d3n">Debt 3 name (optional)</FieldLabel>
                <FieldInput id="d3n" value={d3name} onChange={(e) => setD3name(e.target.value)} className="mt-2" />
              </div>
              {field("d3b", "Debt 3 balance (₹)", d3b, setD3b)}
              {field("d3a", "Debt 3 APR %", d3a, setD3a)}
              {field("d3m", "Debt 3 min pay (₹)", d3m, setD3m)}
            </div>
            {field("extra", "Extra payment (₹)", extra, setExtra)}
          </>
        )}

        {mode === "creditScore" && (
          <>
            {field("utilization", "Utilization %", utilization, setUtilization)}
            {field("payHistory", "Payment history (0–100)", payHistory, setPayHistory)}
            {field("acctAge", "Oldest account (years)", acctAge, setAcctAge)}
            {field("inquiries", "Hard inquiries (12 mo)", inquiries, setInquiries)}
            {field("targetScore", "Target score", targetScore, setTargetScore)}
          </>
        )}
      </div>

      {"error" in result ? null : (
        <>
          <ChartBlock
            slices={result.chartSlices}
            compare={result.compareRows}
            projection={result.projection}
            sipCompare={result.sipCompare}
            compareTitle={
              mode === "budget"
                ? "Framework targets vs actual"
                : mode === "portfolio"
                  ? "Target vs current allocation"
                  : mode === "loanAdvisor"
                    ? "DTI benchmarks vs your load"
                    : mode === "emiOptimize"
                      ? "Total interest by tenure"
                      : mode === "debtRepay"
                        ? "Strategy comparison"
                        : mode === "creditScore"
                          ? "Score benchmarks"
                          : mode === "risk"
                            ? "Capacity factor scores"
                            : mode === "allocation"
                              ? "Rule-of-100 vs suggested"
                              : undefined
            }
          />
          {result.payoffOrder?.length ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Recommended payoff order</p>
              {result.payoffOrder.map((step) => (
                <div key={step} className="rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  {step}
                </div>
              ))}
            </div>
          ) : null}
          {result.rebalance?.length ? <RebalanceTable rows={result.rebalance} /> : null}
          {result.equitySubSplit?.length ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Equity sleeve split (suggested)</p>
              {result.equitySubSplit.map((s) => (
                <div key={s.label} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>{s.label}</span>
                  <span className="font-mono">{s.percent}%</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.buckets?.length ? <BucketTable rows={result.buckets} /> : null}
          {result.scenarios?.length ? (
            <div className="mt-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">What-if scenarios</p>
              <ScenarioCards scenarios={result.scenarios} />
            </div>
          ) : null}
          {result.rankedCuts?.length ? (
            <div className="mt-6 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Ranked cuts</p>
              {result.rankedCuts.map((r) => (
                <div key={r.name} className="flex justify-between rounded-lg border border-[var(--border)] px-3 py-2 text-sm">
                  <span>
                    {r.name} <span className="text-[var(--muted)]">({r.ease})</span>
                  </span>
                  <span className="font-mono">−₹{r.suggestedCut.toLocaleString("en-IN")}</span>
                </div>
              ))}
            </div>
          ) : null}
          {result.insights && result.insights.length > 3 ? (
            <InsightPanel insights={result.insights.slice(3)} title="More insights" />
          ) : null}
        </>
      )}
    </CalculatorShell>
  );
}
