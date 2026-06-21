import type { AiInsight, BudgetFramework, ChartSlice } from "@/lib/calculators/aiFinanceSmartRich";
import {
  analyzeExpensesRich,
  monthlySavingsPlanRich,
  optimizeExpensesRich,
  planBudgetRich,
  subscriptionAnalyzerRich,
} from "@/lib/calculators/aiFinanceSmartRich";
import {
  investmentPlanRich,
  portfolioAnalyzeRich,
  sipStrategyOptimizeRich,
  type GoalType,
} from "@/lib/calculators/aiFinanceInvestRich";
import {
  assetAllocationRich,
  creditScoreRich,
  debtRepayRich,
  emiOptimizeRich,
  loanAdvisorRich,
  riskAnalyzeRich,
} from "@/lib/calculators/aiFinanceLoanRich";
import { formatAiInr, type AiRiskProfile } from "@/lib/calculators/aiFinanceSmart";
import { parseAprPercent, parseNonNegative, parsePositive, parseTermToMonths } from "@/lib/calculators/loanInputParse";
import type { Mode } from "./aiFinanceHostTypes";

export type HostResult =
  | { error: string }
  | {
      primary: string;
      primaryLabel: string;
      rows?: { label: string; value: string }[];
      healthScore?: number;
      grade?: string;
      insights?: AiInsight[];
      chartSlices?: ChartSlice[];
      compareRows?: { label: string; target: number; actual: number }[];
      projection?: { month: number; balance: number }[];
      scenarios?: { label: string; months: number; monthly: number }[];
      buckets?: { label: string; actual: number; target: number; status: string }[];
      rankedCuts?: { name: string; suggestedCut: number; ease: string }[];
      sipCompare?: { month: number; flat: number; stepUp: number }[];
      rebalance?: { asset: string; deltaPercent: number; deltaAmount: number; action: string }[];
      equitySubSplit?: { label: string; percent: number }[];
      payoffOrder?: string[];
    };

export type HostInputs = Record<string, string | AiRiskProfile | BudgetFramework>;

export function computeHostResult(mode: Mode, raw: HostInputs): HostResult {
  switch (mode) {
    case "budget": {
      const inc = parsePositive(String(raw.income), "Income");
      if (!inc.ok) return { error: inc.error };
      const r = planBudgetRich({
        income: inc.value,
        framework: (raw.framework as BudgetFramework) ?? "50-30-20",
        rent: Number(raw.rent) || 0,
        utilities: Number(raw.utilities) || 0,
        emi: Number(raw.emi) || 0,
        insurance: Number(raw.insurance) || 0,
        groceries: Number(raw.groceries) || 0,
        transport: Number(raw.transport) || 0,
        entertainment: Number(raw.entertainment) || 0,
        shopping: Number(raw.shopping) || 0,
        other: Number(raw.other) || 0,
        savingsGoal: Number(raw.savingsGoal) || 0,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.surplus),
        primaryLabel: "Monthly surplus",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        buckets: r.buckets.map((b) => ({ label: b.label, actual: b.actual, target: b.target, status: b.status })),
        rows: [
          { label: "Savings rate", value: `${r.savingsRate.toFixed(1)}%` },
          { label: "Needs (actual)", value: formatAiInr(r.needsActual) },
          { label: "Wants (actual)", value: formatAiInr(r.wantsActual) },
          { label: "Free cash", value: formatAiInr(r.savingsActual) },
        ],
      };
    }
    case "expenseAnalyze": {
      const r = analyzeExpensesRich({
        housing: Number(raw.housing) || 0,
        food: Number(raw.food) || 0,
        transport: Number(raw.transport) || 0,
        subscriptions: Number(raw.subscriptions) || 0,
        healthcare: Number(raw.healthcare) || 0,
        education: Number(raw.education) || 0,
        shopping: Number(raw.shopping) || 0,
        other: Number(raw.other) || 0,
        income: Number(raw.income) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.top,
        primaryLabel: "Top spend category",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        rows: [
          { label: "Total spend", value: formatAiInr(r.total) },
          { label: "Fixed (est.)", value: formatAiInr(r.fixedVsVariable.fixed) },
          { label: "Variable (est.)", value: formatAiInr(r.fixedVsVariable.variable) },
          ...r.categories.filter((c) => c.amount > 0).slice(0, 4).map((c) => ({
            label: c.name,
            value: `${formatAiInr(c.amount)} (${c.share.toFixed(0)}%)`,
          })),
        ],
      };
    }
    case "savingsPlan": {
      const inc = parsePositive(String(raw.income), "Income");
      const exp = parseNonNegative(String(raw.expenses), "Expenses");
      const g = parsePositive(String(raw.goal), "Goal");
      const m = parsePositive(String(raw.months), "Months");
      if (!inc.ok) return { error: inc.error };
      if (!exp.ok) return { error: exp.error };
      if (!g.ok) return { error: g.error };
      if (!m.ok) return { error: m.error };
      const r = monthlySavingsPlanRich({
        income: inc.value,
        expenses: exp.value,
        goal: g.value,
        months: m.value,
        expectedReturnPercent: Number(raw.returnPct) || 0,
        inflationPercent: Number(raw.inflation) || 0,
        existingSavings: Number(raw.existingSavings) || 0,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.requiredWithReturn),
        primaryLabel: "Required monthly savings",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        projection: r.projection,
        scenarios: r.scenarios,
        rows: [
          { label: "Feasible now?", value: r.feasible ? "Yes" : "No" },
          { label: "Gap vs surplus", value: formatAiInr(r.gap) },
          { label: "Flat (no return)", value: formatAiInr(r.requiredMonthly) },
        ],
      };
    }
    case "expenseOptimize": {
      const cut = parseAprPercent(String(raw.targetCut), "Target cut %");
      if (!cut.ok) return { error: cut.error };
      const categories = [
        { name: "Housing", amount: Number(raw.housing) || 0 },
        { name: "Food", amount: Number(raw.food) || 0 },
        { name: "Transport", amount: Number(raw.transport) || 0 },
        { name: "Subscriptions", amount: Number(raw.subscriptions) || 0 },
        { name: "Entertainment", amount: Number(raw.entertainment) || 0 },
        { name: "Shopping", amount: Number(raw.shopping) || 0 },
      ].filter((c) => c.amount > 0);
      const r = optimizeExpensesRich({ categories, targetCutPercent: cut.value, income: Number(raw.income) || undefined });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.targetCut),
        primaryLabel: "Target reduction",
        healthScore: r.healthScore,
        insights: r.insights,
        chartSlices: r.chartSlices,
        rankedCuts: r.rankedCuts.map((x) => ({ name: x.name, suggestedCut: x.suggestedCut, ease: x.ease })),
        rows: [{ label: "New budget", value: formatAiInr(r.newBudget) }],
      };
    }
    case "subscription": {
      const items = [
        { name: String(raw.sub1name || "Streaming"), monthly: Number(raw.sub1) || 0 },
        { name: String(raw.sub2name || "Cloud"), monthly: Number(raw.sub2) || 0 },
        { name: String(raw.sub3name || "Music"), monthly: Number(raw.sub3) || 0 },
        { name: String(raw.sub4name || "Other"), monthly: Number(raw.sub4) || 0 },
      ];
      const r = subscriptionAnalyzerRich({ items });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.annualCost),
        primaryLabel: "Annual subscription burn",
        healthScore: r.healthScore,
        insights: r.insights,
        chartSlices: r.chartSlices,
        rows: [
          { label: "Monthly total", value: formatAiInr(r.monthlyTotal) },
          { label: "Active services", value: String(r.count) },
          { label: "Waste estimate", value: formatAiInr(r.wasteEstimate) },
        ],
      };
    }
    case "investment": {
      const g = parsePositive(String(raw.goal), "Goal");
      const y = parsePositive(String(raw.years), "Years");
      const ret = parseAprPercent(String(raw.returnPct), "Expected return");
      if (!g.ok) return { error: g.error };
      if (!y.ok) return { error: y.error };
      if (!ret.ok) return { error: ret.error };
      const r = investmentPlanRich({
        goal: g.value,
        years: y.value,
        expectedReturn: ret.value,
        risk: raw.risk as AiRiskProfile,
        existingCorpus: Number(raw.existingSavings) || 0,
        inflationPercent: Number(raw.inflation) || 0,
        monthlyIncome: Number(raw.income) || undefined,
        goalType: (raw.goalType as GoalType) ?? "general",
        stepUpPercent: Number(raw.stepUpPct) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.monthlySip),
        primaryLabel: "Suggested monthly SIP",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        projection: r.projection,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "Inflation-adjusted goal", value: formatAiInr(r.inflatedGoal) },
          { label: "Smart allocation", value: r.allocationLabel },
          { label: "Total invested", value: formatAiInr(r.totalInvested) },
          { label: "Expected gains", value: formatAiInr(r.expectedGains) },
          ...(r.sipToIncomePct != null
            ? [{ label: "SIP vs income", value: `${r.sipToIncomePct.toFixed(1)}%` }]
            : []),
        ],
      };
    }
    case "portfolio": {
      const eq = parseAprPercent(String(raw.equity), "Equity %");
      const db = parseAprPercent(String(raw.debt), "Debt %");
      const gl = parseAprPercent(String(raw.gold), "Gold %");
      const cs = parseAprPercent(String(raw.cash), "Cash %");
      if (!eq.ok) return { error: eq.error };
      if (!db.ok) return { error: db.error };
      if (!gl.ok) return { error: gl.error };
      if (!cs.ok) return { error: cs.error };
      const r = portfolioAnalyzeRich({
        equityPercent: eq.value,
        debtPercent: db.value,
        goldPercent: gl.value,
        cashPercent: cs.value,
        risk: raw.risk as AiRiskProfile,
        portfolioValue: Number(raw.portfolioValue) || undefined,
        age: Number(raw.age) || undefined,
        horizonYears: Number(raw.years) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: String(r.healthScore),
        primaryLabel: "Alignment score /100",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rebalance: r.rebalance,
        equitySubSplit: r.equitySubSplit,
        rows: [
          { label: "Verdict", value: r.verdict },
          { label: "Portfolio value", value: formatAiInr(Number(raw.portfolioValue) || 1000000) },
        ],
      };
    }
    case "sip": {
      const g = parsePositive(String(raw.goal), "Target corpus");
      const y = parsePositive(String(raw.years), "Years");
      const ret = parseAprPercent(String(raw.returnPct), "Expected return");
      if (!g.ok) return { error: g.error };
      if (!y.ok) return { error: y.error };
      if (!ret.ok) return { error: ret.error };
      const r = sipStrategyOptimizeRich({
        targetCorpus: g.value,
        years: y.value,
        expectedReturn: ret.value,
        stepUpPercent: Number(raw.stepUpPct) || 10,
        existingCorpus: Number(raw.existingSavings) || 0,
        inflationPercent: Number(raw.inflation) || 0,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: formatAiInr(r.stepUpStartSip),
        primaryLabel: "Starting monthly SIP (step-up)",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        projection: r.projection,
        sipCompare: r.sipCompare,
        scenarios: r.scenarios,
        rows: [
          { label: "Flat SIP alternative", value: formatAiInr(r.flatSip) },
          { label: "Confidence", value: r.confidence },
          { label: "Months", value: String(r.totalMonths) },
          {
            label: "Invested (step-up vs flat)",
            value: `${formatAiInr(r.stepUpTotalInvested)} vs ${formatAiInr(r.flatTotalInvested)}`,
          },
        ],
      };
    }
    case "risk": {
      const a = parsePositive(String(raw.age), "Age");
      const h = parsePositive(String(raw.years), "Horizon");
      const st = parseAprPercent(String(raw.stability), "Stability");
      if (!a.ok) return { error: a.error };
      if (!h.ok) return { error: h.error };
      if (!st.ok) return { error: st.error };
      const r = riskAnalyzeRich({
        age: a.value,
        horizonYears: h.value,
        incomeStability: st.value,
        emergencyFundMonths: Number(raw.emergencyMonths) || undefined,
        lossTolerance: Number(raw.lossTolerance) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.profile.toUpperCase(),
        primaryLabel: "Risk profile",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        rows: [
          { label: "Capacity score", value: `${r.capacityScore}/100` },
          { label: "Equity cap", value: `${r.equityCap}%` },
        ],
      };
    }
    case "allocation": {
      const a = parsePositive(String(raw.age), "Age");
      if (!a.ok) return { error: a.error };
      const r = assetAllocationRich({
        age: a.value,
        risk: raw.risk as AiRiskProfile,
        horizonYears: Number(raw.years) || undefined,
        portfolioValue: Number(raw.portfolioValue) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: `${r.equity}% equity`,
        primaryLabel: "Suggested mix",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "Rule-of-100 equity", value: `${r.ruleOf100Equity}%` },
          { label: "Debt", value: `${r.debt}%` },
          { label: "Gold", value: `${r.gold}%` },
          { label: "Cash", value: `${r.cash}%` },
        ],
      };
    }
    case "loanAdvisor": {
      const inc = parsePositive(String(raw.income), "Income");
      const ed = parseNonNegative(String(raw.existingDebt), "Existing EMIs");
      const p = parsePositive(String(raw.principal), "Loan amount");
      const rate = parseAprPercent(String(raw.apr), "APR");
      const term = parseTermToMonths(String(raw.termRaw), "years", "Term");
      if (!inc.ok) return { error: inc.error };
      if (!ed.ok) return { error: ed.error };
      if (!p.ok) return { error: p.error };
      if (!rate.ok) return { error: rate.error };
      if (!term.ok) return { error: term.error };
      const r = loanAdvisorRich({
        grossIncome: inc.value,
        existingDebt: ed.value,
        principal: p.value,
        apr: rate.value,
        termMonths: term.value,
        emergencyFundMonths: Number(raw.emergencyMonths) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.verdict,
        primaryLabel: "Affordability verdict",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "New EMI", value: formatAiInr(r.emi) },
          { label: "Projected DTI", value: `${r.newDti.toFixed(1)}%` },
          { label: "Risk band", value: r.riskBand },
          { label: "Free cash after EMIs", value: formatAiInr(r.freeCash) },
          { label: "Total interest", value: formatAiInr(r.totalInterest) },
        ],
      };
    }
    case "emiOptimize": {
      const p = parsePositive(String(raw.principal), "Loan amount");
      const rate = parseAprPercent(String(raw.apr), "APR");
      const max = parsePositive(String(raw.maxEmi), "Max EMI");
      if (!p.ok) return { error: p.error };
      if (!rate.ok) return { error: rate.error };
      if (!max.ok) return { error: max.error };
      const r = emiOptimizeRich({ principal: p.value, apr: rate.value, maxAffordableEmi: max.value });
      if ("error" in r) return { error: r.error };
      const best = r.best;
      return {
        primary: best ? `${best.termYears} years` : "—",
        primaryLabel: "Optimal tenure",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: best
          ? [
              { label: "EMI", value: formatAiInr(best.emi) },
              { label: "Total interest", value: formatAiInr(best.totalInterest) },
              { label: "Fits budget?", value: best.fitsBudget ? "Yes" : "No" },
              { label: "Affordable plans", value: String(r.plans.filter((pl) => pl.fitsBudget).length) },
            ]
          : [{ label: "Plans", value: "None within cap" }],
      };
    }
    case "debtRepay": {
      const debts = [
        { balance: Number(raw.d1b) || 0, apr: Number(raw.d1a) || 0, minimum: Number(raw.d1m) || 0, name: String(raw.d1name || "Debt 1") },
        { balance: Number(raw.d2b) || 0, apr: Number(raw.d2a) || 0, minimum: Number(raw.d2m) || 0, name: String(raw.d2name || "Debt 2") },
        { balance: Number(raw.d3b) || 0, apr: Number(raw.d3a) || 0, minimum: Number(raw.d3m) || 0, name: String(raw.d3name || "Debt 3") },
      ].filter((d) => d.balance > 0);
      const ex = parseNonNegative(String(raw.extra), "Extra payment");
      if (!ex.ok) return { error: ex.error };
      const r = debtRepayRich({ debts, extraPayment: ex.value });
      if ("error" in r) return { error: r.error };
      return {
        primary: r.recommendation === "tie" ? "Either" : r.recommendation.charAt(0).toUpperCase() + r.recommendation.slice(1),
        primaryLabel: "Best strategy",
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        projection: r.projection,
        scenarios: r.scenarios,
        payoffOrder: r.payoffOrder,
        rows: [
          { label: "Snowball", value: `${r.snowball.months} mo · ${formatAiInr(r.snowball.totalInterest)} interest` },
          { label: "Avalanche", value: `${r.avalanche.months} mo · ${formatAiInr(r.avalanche.totalInterest)} interest` },
          { label: "Interest delta", value: formatAiInr(r.interestSaved) },
        ],
      };
    }
    case "creditScore": {
      const util = parseAprPercent(String(raw.utilization), "Utilization");
      const pay = parseAprPercent(String(raw.payHistory), "Payment history");
      const aa = parseNonNegative(String(raw.acctAge), "Account age");
      const inq = parseNonNegative(String(raw.inquiries), "Inquiries");
      if (!util.ok) return { error: util.error };
      if (!pay.ok) return { error: pay.error };
      if (!aa.ok) return { error: aa.error };
      if (!inq.ok) return { error: inq.error };
      const r = creditScoreRich({
        utilizationPercent: util.value,
        paymentHistoryScore: pay.value,
        accountAgeYears: aa.value,
        recentInquiries: inq.value,
        targetScore: Number(raw.targetScore) || undefined,
      });
      if ("error" in r) return { error: r.error };
      return {
        primary: String(r.estimatedScore),
        primaryLabel: `Score · ${r.band}`,
        healthScore: r.healthScore,
        grade: r.grade,
        insights: r.insights,
        chartSlices: r.chartSlices,
        compareRows: r.compareRows,
        scenarios: r.scenarios,
        rows: [
          { label: "Potential gain", value: `+${r.potentialGain} pts` },
          { label: "Utilization impact", value: `${r.factorImpacts[0]?.impact.toFixed(0)} pts` },
          { label: "Target score", value: String(raw.targetScore || 750) },
        ],
      };
    }
    default:
      return { error: "Unknown mode." };
  }
}
