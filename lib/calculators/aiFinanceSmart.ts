import { adviseSmartLoan, generateEmiPlans, optimizeLoanScenarios, pickBestEmiPlan } from "./loanAdvisory";
import { formatLoanMoney } from "./loanFormat";
import { monthlyLoanPayment } from "./loanPayment";
import { LOAN_URL } from "./loanUrlParams";

export type AiRiskProfile = "low" | "medium" | "high";

export const AI_FINANCE_URL = {
  I: "i",
  FIXED: "fx",
  VARIABLE: "v",
  GOAL: "g",
  MONTHS: "m",
  RETURN: "rt",
  AGE: "ag",
  RK: "rk",
  EQ: "eq",
  DB: "db",
  OT: "ot",
  SUB: "sub",
  CNT: "cnt",
  TARGET: "tg",
  UTIL: "u",
  PAYH: "ph",
  D1B: "d1b",
  D1A: "d1a",
  D1M: "d1m",
  D2B: "d2b",
  D2A: "d2a",
  D2M: "d2m",
  EXTRA: "xp",
} as const;

export function parseAiFinanceSearchParams(sp: Record<string, string | string[] | undefined>): Record<string, string> {
  const out: Record<string, string> = {};
  const keys = [
    ...Object.values(AI_FINANCE_URL),
    ...Object.values(LOAN_URL),
    "fw",
    "rnt",
    "ut",
    "em",
    "ins",
    "gr",
    "tr",
    "ent",
    "sh",
    "sg",
    "h",
    "fd",
    "sb",
    "hc",
    "edu",
    "ex",
    "inf",
    "es",
    "s1",
    "s2",
    "s3",
    "s4",
    "s1n",
    "s2n",
    "s3n",
    "s4n",
    "yr",
    "ed",
    "me",
    "oa",
    "gld",
    "cs",
    "pv",
    "gt",
    "sup",
    "st",
    "aa",
    "inq",
    "emf",
    "lt",
    "ts",
    "d1n",
    "d2n",
    "d3b",
    "d3a",
    "d3m",
    "d3n",
  ];
  for (const k of keys) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function formatAiInr(amount: number): string {
  return formatLoanMoney(amount, "INR");
}

export function planBudget(params: {
  income: number;
  fixedExpenses: number;
  variableExpenses: number;
}): { needs: number; wants: number; savings: number; surplus: number; tips: string[] } | { error: string } {
  if (params.income <= 0) return { error: "Income must be positive." };
  const spent = params.fixedExpenses + params.variableExpenses;
  const needs = params.income * 0.5;
  const wants = params.income * 0.3;
  const savings = params.income * 0.2;
  const surplus = params.income - spent;
  const tips: string[] = [];
  if (spent > params.income) tips.push("Expenses exceed income — trim wants or fixed costs first.");
  else if (surplus < savings * 0.5) tips.push("Savings cushion is below a 20% target — look for recurring cuts.");
  else tips.push("Cash flow supports the 50/30/20 guideline at current inputs.");
  if (params.fixedExpenses > needs) tips.push("Fixed costs exceed 50% of income — renegotiate rent, EMIs, or utilities.");
  return { needs, wants, savings, surplus, tips };
}

export function analyzeExpenses(params: {
  housing: number;
  food: number;
  transport: number;
  other: number;
}): {
  total: number;
  categories: { name: string; amount: number; share: number }[];
  top: string;
  tips: string[];
} {
  const categories = [
    { name: "Housing", amount: params.housing },
    { name: "Food", amount: params.food },
    { name: "Transport", amount: params.transport },
    { name: "Other", amount: params.other },
  ].map((c) => ({ ...c, share: 0 }));
  const total = categories.reduce((s, c) => s + c.amount, 0);
  for (const c of categories) c.share = total > 0 ? (c.amount / total) * 100 : 0;
  const sorted = [...categories].sort((a, b) => b.amount - a.amount);
  const tips: string[] = [];
  if (sorted[0]?.share > 45) tips.push(`${sorted[0].name} dominates spend — prioritize cuts there.`);
  if (params.food / Math.max(total, 1) > 0.35) tips.push("Food share is high — meal planning or subscriptions may help.");
  if (total === 0) tips.push("Enter category amounts to see a breakdown.");
  return { total, categories, top: sorted[0]?.name ?? "—", tips };
}

export function monthlySavingsPlan(params: {
  income: number;
  expenses: number;
  goal: number;
  months: number;
}): { requiredMonthly: number; gap: number; feasible: boolean; tips: string[] } | { error: string } {
  if (params.months <= 0) return { error: "Timeline must be at least one month." };
  if (params.goal <= 0) return { error: "Goal must be positive." };
  const requiredMonthly = params.goal / params.months;
  const available = params.income - params.expenses;
  const gap = available - requiredMonthly;
  const tips: string[] = [];
  if (gap >= 0) tips.push("Current surplus covers the required savings rate.");
  else tips.push(`Increase income or cut ₹${Math.abs(gap).toFixed(0)}/month to hit the goal on time.`);
  return { requiredMonthly, gap, feasible: gap >= 0, tips };
}

export function optimizeExpenses(params: {
  totalExpenses: number;
  targetCutPercent: number;
}): { targetCut: number; newBudget: number; suggestions: string[] } | { error: string } {
  if (params.totalExpenses <= 0) return { error: "Total expenses must be positive." };
  if (params.targetCutPercent <= 0 || params.targetCutPercent > 50) {
    return { error: "Target cut should be between 1% and 50%." };
  }
  const targetCut = params.totalExpenses * (params.targetCutPercent / 100);
  return {
    targetCut,
    newBudget: params.totalExpenses - targetCut,
    suggestions: [
      "Audit subscriptions and downgrade unused tiers first.",
      "Swap brand premiums on food and transport for 10–15% quick wins.",
      "Renegotiate annual contracts (insurance, broadband) before cutting essentials.",
    ],
  };
}

export function subscriptionAnalyzer(params: {
  monthlyTotal: number;
  count: number;
}): { annualCost: number; perSub: number; tips: string[] } | { error: string } {
  if (params.monthlyTotal <= 0) return { error: "Monthly subscription total must be positive." };
  if (params.count <= 0) return { error: "Subscription count must be at least 1." };
  const annualCost = params.monthlyTotal * 12;
  const perSub = params.monthlyTotal / params.count;
  const tips: string[] = [];
  if (perSub > 999) tips.push("Average per subscription is high — check annual vs monthly billing.");
  if (params.count > 8) tips.push("Many active subscriptions — cancel overlaps (music, cloud, VPN).");
  tips.push(`Annualized burn: ${annualCost.toFixed(0)} — a 20% trim saves ${(annualCost * 0.2).toFixed(0)}/year.`);
  return { annualCost, perSub, tips };
}

export function investmentPlan(params: {
  goal: number;
  years: number;
  expectedReturn: number;
  risk: AiRiskProfile;
}): { monthlySip: number; allocation: string; tips: string[] } | { error: string } {
  if (params.years <= 0) return { error: "Horizon must be at least one year." };
  if (params.goal <= 0) return { error: "Goal must be positive." };
  const months = params.years * 12;
  const r = params.expectedReturn / 100 / 12;
  let monthlySip: number;
  if (r <= 0) monthlySip = params.goal / months;
  else monthlySip = (params.goal * r) / (Math.pow(1 + r, months) - 1);
  const allocation =
    params.risk === "low"
      ? "≈ 30% equity / 60% debt / 10% cash"
      : params.risk === "medium"
        ? "≈ 60% equity / 30% debt / 10% gold"
        : "≈ 80% equity / 15% debt / 5% gold";
  return {
    monthlySip,
    allocation,
    tips: ["Step-up SIP 10% yearly if income grows.", "Review allocation annually or after major life events."],
  };
}

export function portfolioAnalyze(params: {
  equityPercent: number;
  debtPercent: number;
  otherPercent: number;
  risk: AiRiskProfile;
}): { total: number; score: number; verdict: string; tips: string[] } | { error: string } {
  const total = params.equityPercent + params.debtPercent + params.otherPercent;
  if (Math.abs(total - 100) > 2) return { error: "Allocation should sum to about 100%." };
  const target =
    params.risk === "low" ? { eq: 30, db: 60 } : params.risk === "medium" ? { eq: 60, db: 30 } : { eq: 80, db: 15 };
  const drift = Math.abs(params.equityPercent - target.eq) + Math.abs(params.debtPercent - target.db);
  const score = Math.max(0, 100 - drift);
  let verdict = "Well aligned";
  if (score < 60) verdict = "Rebalance suggested";
  else if (score < 80) verdict = "Moderate drift";
  const tips: string[] = [];
  if (params.equityPercent > target.eq + 15) tips.push("Equity overweight vs risk profile — trim winners to rebalance.");
  if (params.debtPercent > target.db + 20) tips.push("Debt heavy — consider gradual equity SIP if horizon is long.");
  return { total, score, verdict, tips };
}

export function sipStrategyOptimize(params: {
  targetCorpus: number;
  years: number;
  expectedReturn: number;
  stepUpPercent?: number;
}): {
  baseSip: number;
  stepUpSipYear2: number;
  totalMonths: number;
  tips: string[];
} | { error: string } {
  const plan = investmentPlan({
    goal: params.targetCorpus,
    years: params.years,
    expectedReturn: params.expectedReturn,
    risk: "medium",
  });
  if ("error" in plan) return plan;
  const step = params.stepUpPercent ?? 10;
  return {
    baseSip: plan.monthlySip,
    stepUpSipYear2: plan.monthlySip * (1 + step / 100),
    totalMonths: params.years * 12,
    tips: [
      `Step-up ${step}% each year reduces initial SIP pressure.`,
      "Automate SIP date within 3 days of salary credit.",
    ],
  };
}

export function riskAnalyzeInvestor(params: {
  age: number;
  horizonYears: number;
  incomeStability: number;
}): { profile: AiRiskProfile; equityCap: number; tips: string[] } | { error: string } {
  if (params.age < 18 || params.age > 80) return { error: "Enter age between 18 and 80." };
  if (params.horizonYears <= 0) return { error: "Investment horizon must be positive." };
  let score = 0;
  if (params.age < 35) score += 2;
  else if (params.age < 50) score += 1;
  if (params.horizonYears >= 10) score += 2;
  else if (params.horizonYears >= 5) score += 1;
  if (params.incomeStability >= 70) score += 2;
  else if (params.incomeStability >= 40) score += 1;
  const profile: AiRiskProfile = score >= 5 ? "high" : score >= 3 ? "medium" : "low";
  const equityCap = profile === "high" ? 80 : profile === "medium" ? 60 : 40;
  return {
    profile,
    equityCap,
    tips: [
      profile === "low"
        ? "Prioritize emergency fund before aggressive equity."
        : "Keep 6–12 months expenses in liquid debt before topping equity.",
      `Suggested max equity allocation near ${equityCap}% for this profile.`,
    ],
  };
}

export function assetAllocation(params: { age: number; risk: AiRiskProfile }): {
  equity: number;
  debt: number;
  gold: number;
  cash: number;
} | { error: string } {
  if (params.age < 18) return { error: "Age must be at least 18." };
  const ruleOf100 = Math.max(20, Math.min(80, 100 - params.age));
  let equity = ruleOf100;
  if (params.risk === "low") equity = Math.min(equity, 35);
  if (params.risk === "high") equity = Math.max(equity, 65);
  const debt = Math.round((100 - equity) * 0.7);
  const gold = Math.round((100 - equity) * 0.2);
  const cash = 100 - equity - debt - gold;
  return { equity, debt, gold, cash: Math.max(0, cash) };
}

export function aiLoanAdvisor(params: {
  grossIncome: number;
  existingDebt: number;
  principal: number;
  apr: number;
  termMonths: number;
}) {
  return adviseSmartLoan(params);
}

export function aiEmiStrategyOptimize(params: {
  principal: number;
  apr: number;
  maxAffordableEmi?: number;
  termMonths?: number;
  prepaymentAmount?: number;
  prepaymentMonth?: number;
}) {
  const plans = generateEmiPlans({
    principal: params.principal,
    apr: params.apr,
    maxAffordableEmi: params.maxAffordableEmi,
  });
  if ("error" in plans) return plans;
  const best = pickBestEmiPlan(plans, params.maxAffordableEmi);
  const optimize =
    params.termMonths != null
      ? optimizeLoanScenarios({
          principal: params.principal,
          apr: params.apr,
          termMonths: params.termMonths,
          prepaymentAmount: params.prepaymentAmount,
          prepaymentMonth: params.prepaymentMonth,
        })
      : null;
  return { plans, best, optimize: optimize && !("error" in optimize) ? optimize : null };
}

type DebtLine = { balance: number; apr: number; minimum: number };

function simulatePayoff(debts: DebtLine[], extra: number, order: "balance" | "apr") {
  const list = debts.map((d) => ({ ...d, bal: d.balance }));
  let months = 0;
  let totalInterest = 0;
  while (list.some((d) => d.bal > 0.01) && months < 600) {
    months += 1;
    for (const d of list) {
      const interest = d.bal * (d.apr / 100 / 12);
      totalInterest += interest;
      d.bal += interest;
      d.bal = Math.max(0, d.bal - d.minimum);
    }
    const active = list.filter((d) => d.bal > 0.01);
    const target = [...active].sort((a, b) => (order === "balance" ? a.bal - b.bal : b.apr - a.apr))[0];
    if (target) target.bal = Math.max(0, target.bal - extra);
  }
  return { months, totalInterest };
}

export function debtRepaymentPlanner(params: {
  debts: DebtLine[];
  extraPayment: number;
}): {
  snowball: { months: number; totalInterest: number };
  avalanche: { months: number; totalInterest: number };
  recommendation: "snowball" | "avalanche" | "tie";
  tips: string[];
} | { error: string } {
  if (!params.debts.length) return { error: "Add at least one debt." };
  for (const d of params.debts) {
    if (d.balance <= 0 || d.minimum <= 0) return { error: "Each debt needs positive balance and minimum payment." };
  }
  const snowball = simulatePayoff(params.debts, params.extraPayment, "balance");
  const avalanche = simulatePayoff(params.debts, params.extraPayment, "apr");
  let recommendation: "snowball" | "avalanche" | "tie" = "tie";
  if (avalanche.totalInterest < snowball.totalInterest - 1) recommendation = "avalanche";
  else if (snowball.totalInterest < avalanche.totalInterest - 1) recommendation = "snowball";
  const tips: string[] = [];
  if (recommendation === "avalanche")
    tips.push("Avalanche saves more interest — target highest APR first.");
  else if (recommendation === "snowball")
    tips.push("Snowball finishes a small balance first for momentum.");
  else tips.push("Both strategies finish in similar time/interest at these inputs.");
  return { snowball, avalanche, recommendation, tips };
}

export function creditScoreImprover(params: {
  utilizationPercent: number;
  paymentHistoryScore: number;
  accountAgeYears: number;
  recentInquiries: number;
}): { estimatedScore: number; band: string; actions: string[] } | { error: string } {
  if (params.utilizationPercent < 0 || params.utilizationPercent > 100) {
    return { error: "Utilization must be 0–100%." };
  }
  let score = 650;
  score += Math.min(120, params.paymentHistoryScore * 1.2);
  score -= Math.max(0, params.utilizationPercent - 30) * 2;
  score += Math.min(40, params.accountAgeYears * 4);
  score -= params.recentInquiries * 8;
  score = Math.round(Math.max(300, Math.min(850, score)));
  const band = score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Needs work";
  const actions: string[] = [];
  if (params.utilizationPercent > 30) actions.push("Pay down revolving balances below 30% utilization.");
  if (params.paymentHistoryScore < 80) actions.push("Enable autopay — on-time history is the largest factor.");
  if (params.recentInquiries > 2) actions.push("Avoid new credit applications for 6–12 months.");
  if (!actions.length) actions.push("Maintain low utilization and on-time payments.");
  return { estimatedScore: score, band, actions };
}

export { monthlyLoanPayment };
