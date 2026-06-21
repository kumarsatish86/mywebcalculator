import type { AiRiskProfile } from "./aiFinanceSmart";

export type AiInsightPriority = "high" | "medium" | "low";

export type AiInsight = {
  priority: AiInsightPriority;
  title: string;
  detail: string;
};

export type BudgetFramework = "50-30-20" | "70-20-10" | "80-20";

export type BucketStatus = "ok" | "warning" | "over";

export type BudgetBucket = {
  id: string;
  label: string;
  actual: number;
  target: number;
  shareOfIncome: number;
  status: BucketStatus;
};

export type ChartSlice = { name: string; value: number; fill: string };

const FRAMEWORK_SPLITS: Record<BudgetFramework, { needs: number; wants: number; savings: number }> = {
  "50-30-20": { needs: 0.5, wants: 0.3, savings: 0.2 },
  "70-20-10": { needs: 0.7, wants: 0.2, savings: 0.1 },
  "80-20": { needs: 0.8, wants: 0.2, savings: 0 },
};

function bucketStatus(actual: number, target: number): BucketStatus {
  if (target <= 0) return actual > 0 ? "over" : "ok";
  const ratio = actual / target;
  if (ratio <= 1.05) return "ok";
  if (ratio <= 1.2) return "warning";
  return "over";
}

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

export function planBudgetRich(params: {
  income: number;
  framework: BudgetFramework;
  rent: number;
  utilities: number;
  emi: number;
  insurance: number;
  groceries: number;
  transport: number;
  entertainment: number;
  shopping: number;
  other: number;
  savingsGoal: number;
}):
  | {
      healthScore: number;
      grade: string;
      framework: BudgetFramework;
      buckets: BudgetBucket[];
      needsActual: number;
      wantsActual: number;
      savingsActual: number;
      surplus: number;
      savingsRate: number;
      insights: AiInsight[];
      chartSlices: ChartSlice[];
      compareRows: { label: string; target: number; actual: number }[];
    }
  | { error: string } {
  if (params.income <= 0) return { error: "Income must be positive." };
  const split = FRAMEWORK_SPLITS[params.framework];
  const needsActual =
    params.rent + params.utilities + params.emi + params.insurance + params.groceries + params.transport;
  const wantsActual = params.entertainment + params.shopping + params.other;
  const totalSpend = needsActual + wantsActual;
  const savingsActual = Math.max(0, params.income - totalSpend);
  const surplus = params.income - totalSpend;
  const savingsRate = (savingsActual / params.income) * 100;

  const needsTarget = params.income * split.needs;
  const wantsTarget = params.income * split.wants;
  const savingsTarget = params.income * split.savings;

  const buckets: BudgetBucket[] = [
    { id: "rent", label: "Rent / housing", actual: params.rent, target: needsTarget * 0.35, shareOfIncome: (params.rent / params.income) * 100, status: "ok" },
    { id: "utilities", label: "Utilities", actual: params.utilities, target: needsTarget * 0.08, shareOfIncome: (params.utilities / params.income) * 100, status: "ok" },
    { id: "emi", label: "Loan EMIs", actual: params.emi, target: needsTarget * 0.25, shareOfIncome: (params.emi / params.income) * 100, status: "ok" },
    { id: "insurance", label: "Insurance", actual: params.insurance, target: needsTarget * 0.07, shareOfIncome: (params.insurance / params.income) * 100, status: "ok" },
    { id: "groceries", label: "Groceries", actual: params.groceries, target: needsTarget * 0.15, shareOfIncome: (params.groceries / params.income) * 100, status: "ok" },
    { id: "transport", label: "Transport", actual: params.transport, target: needsTarget * 0.1, shareOfIncome: (params.transport / params.income) * 100, status: "ok" },
    { id: "entertainment", label: "Entertainment", actual: params.entertainment, target: wantsTarget * 0.4, shareOfIncome: (params.entertainment / params.income) * 100, status: "ok" },
    { id: "shopping", label: "Shopping", actual: params.shopping, target: wantsTarget * 0.35, shareOfIncome: (params.shopping / params.income) * 100, status: "ok" },
    { id: "other", label: "Other wants", actual: params.other, target: wantsTarget * 0.25, shareOfIncome: (params.other / params.income) * 100, status: "ok" },
  ];
  for (const b of buckets) b.status = bucketStatus(b.actual, b.target);

  let healthScore = 100;
  if (surplus < 0) healthScore -= 35;
  else if (split.savings > 0 && savingsRate < split.savings * 100 * 0.5) healthScore -= 20;
  if (needsActual > needsTarget * 1.15) healthScore -= 15;
  if (wantsActual > wantsTarget * 1.2) healthScore -= 12;
  if (params.rent / params.income > 0.35) healthScore -= 10;
  if (params.emi / params.income > 0.4) healthScore -= 12;
  if (params.savingsGoal > 0 && savingsActual < params.savingsGoal) healthScore -= 8;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const insights: AiInsight[] = [];
  if (surplus < 0) {
    insights.push({
      priority: "high",
      title: "Monthly deficit",
      detail: `Spending exceeds income by ₹${Math.abs(surplus).toFixed(0)}. Freeze discretionary categories until balanced.`,
    });
  }
  if (params.rent / params.income > 0.35) {
    insights.push({
      priority: "high",
      title: "Housing cost elevated",
      detail: `Rent is ${((params.rent / params.income) * 100).toFixed(0)}% of income — benchmark is under 35%.`,
    });
  }
  if (params.emi / params.income > 0.4) {
    insights.push({
      priority: "high",
      title: "EMI load heavy",
      detail: "EMIs above 40% of gross income increase default risk — consider refinance or prepayment.",
    });
  }
  for (const b of buckets.filter((x) => x.status === "over").slice(0, 2)) {
    insights.push({
      priority: "medium",
      title: `${b.label} over guideline`,
      detail: `Actual ₹${b.actual.toFixed(0)} vs suggested cap ₹${b.target.toFixed(0)} (${b.shareOfIncome.toFixed(0)}% of income).`,
    });
  }
  if (params.savingsGoal > 0 && savingsActual >= params.savingsGoal) {
    insights.push({
      priority: "low",
      title: "Savings goal on track",
      detail: `Free cash ₹${savingsActual.toFixed(0)} meets your ₹${params.savingsGoal.toFixed(0)} monthly savings target.`,
    });
  } else if (params.savingsGoal > 0) {
    insights.push({
      priority: "medium",
      title: "Savings gap",
      detail: `Need ₹${(params.savingsGoal - savingsActual).toFixed(0)} more per month to hit your stated savings goal.`,
    });
  }
  if (!insights.length) {
    insights.push({
      priority: "low",
      title: "Balanced cash flow",
      detail: `Your split aligns with ${params.framework} at current inputs.`,
    });
  }

  const chartSlices: ChartSlice[] = [
    { name: "Needs", value: needsActual, fill: "#6548f5" },
    { name: "Wants", value: wantsActual, fill: "#0d9488" },
    { name: "Savings", value: Math.max(0, savingsActual), fill: "#22c55e" },
  ].filter((s) => s.value > 0);

  return {
    healthScore,
    grade: gradeFromScore(healthScore),
    framework: params.framework,
    buckets,
    needsActual,
    wantsActual,
    savingsActual,
    surplus,
    savingsRate,
    insights,
    chartSlices,
    compareRows: [
      { label: "Needs", target: needsTarget, actual: needsActual },
      { label: "Wants", target: wantsTarget, actual: wantsActual },
      { label: "Savings", target: savingsTarget, actual: savingsActual },
    ],
  };
}

export type ExpenseBenchmark = {
  name: string;
  amount: number;
  share: number;
  benchmarkMax: number;
  status: BucketStatus;
};

export function analyzeExpensesRich(params: {
  housing: number;
  food: number;
  transport: number;
  subscriptions: number;
  healthcare: number;
  education: number;
  shopping: number;
  other: number;
  income?: number;
}):
  | {
      total: number;
      healthScore: number;
      grade: string;
      categories: ExpenseBenchmark[];
      top: string;
      insights: AiInsight[];
      chartSlices: ChartSlice[];
      fixedVsVariable: { fixed: number; variable: number };
    }
  | { error: string } {
  const categories: ExpenseBenchmark[] = [
    { name: "Housing", amount: params.housing, share: 0, benchmarkMax: 30, status: "ok" },
    { name: "Food", amount: params.food, share: 0, benchmarkMax: 15, status: "ok" },
    { name: "Transport", amount: params.transport, share: 0, benchmarkMax: 12, status: "ok" },
    { name: "Subscriptions", amount: params.subscriptions, share: 0, benchmarkMax: 5, status: "ok" },
    { name: "Healthcare", amount: params.healthcare, share: 0, benchmarkMax: 8, status: "ok" },
    { name: "Education", amount: params.education, share: 0, benchmarkMax: 10, status: "ok" },
    { name: "Shopping", amount: params.shopping, share: 0, benchmarkMax: 10, status: "ok" },
    { name: "Other", amount: params.other, share: 0, benchmarkMax: 10, status: "ok" },
  ];
  const total = categories.reduce((s, c) => s + c.amount, 0);
  if (total <= 0) return { error: "Enter at least one expense category." };

  const income = params.income && params.income > 0 ? params.income : total;
  for (const c of categories) {
    c.share = (c.amount / total) * 100;
    const incomeShare = (c.amount / income) * 100;
    c.status = incomeShare > c.benchmarkMax * 1.25 ? "over" : incomeShare > c.benchmarkMax ? "warning" : "ok";
  }

  const sorted = [...categories].sort((a, b) => b.amount - a.amount);
  let healthScore = 100;
  healthScore -= categories.filter((c) => c.status === "over").length * 12;
  healthScore -= categories.filter((c) => c.status === "warning").length * 5;
  if (sorted[0].share > 50) healthScore -= 10;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const insights: AiInsight[] = [];
  for (const c of categories.filter((x) => x.status === "over")) {
    insights.push({
      priority: "high",
      title: `${c.name} above benchmark`,
      detail: `${c.share.toFixed(0)}% of spend — guideline max ~${c.benchmarkMax}% of income.`,
    });
  }
  if (params.subscriptions > 0 && params.subscriptions / total > 0.08) {
    insights.push({
      priority: "medium",
      title: "Subscription creep",
      detail: "Subscriptions exceed 8% of spend — audit recurring charges.",
    });
  }
  const fixedAmt = params.housing + params.education + params.healthcare * 0.6;
  const variableAmt = total - fixedAmt;
  if (sorted[0]) {
    insights.push({
      priority: "medium",
      title: `Largest category: ${sorted[0].name}`,
      detail: `₹${sorted[0].amount.toFixed(0)} (${sorted[0].share.toFixed(0)}% of spend) — start cuts here.`,
    });
  }
  if (!insights.length) {
    insights.push({ priority: "low", title: "Spend mix looks balanced", detail: "No category far above common benchmarks." });
  }

  const COLORS = ["#6548f5", "#0d9488", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6", "#f97316", "#94a3b8"];
  const chartSlices = categories
    .filter((c) => c.amount > 0)
    .map((c, i) => ({ name: c.name, value: c.amount, fill: COLORS[i % COLORS.length] }));

  return {
    total,
    healthScore,
    grade: gradeFromScore(healthScore),
    categories,
    top: sorted[0]?.name ?? "—",
    insights: insights.slice(0, 5),
    chartSlices,
    fixedVsVariable: { fixed: fixedAmt, variable: variableAmt },
  };
}

export type SavingsMilestone = { month: number; balance: number; label: string };

export function monthlySavingsPlanRich(params: {
  income: number;
  expenses: number;
  goal: number;
  months: number;
  expectedReturnPercent?: number;
  inflationPercent?: number;
  existingSavings?: number;
}):
  | {
      requiredMonthly: number;
      requiredWithReturn: number;
      gap: number;
      feasible: boolean;
      healthScore: number;
      grade: string;
      insights: AiInsight[];
      projection: { month: number; balance: number }[];
      milestones: SavingsMilestone[];
      scenarios: { label: string; months: number; monthly: number }[];
    }
  | { error: string } {
  if (params.months <= 0) return { error: "Timeline must be at least one month." };
  if (params.goal <= 0) return { error: "Goal must be positive." };
  const available = params.income - params.expenses;
  const inflation = (params.inflationPercent ?? 0) / 100;
  const inflatedGoal = params.goal * Math.pow(1 + inflation, params.months / 12);
  const requiredMonthly = inflatedGoal / params.months;

  const r = (params.expectedReturnPercent ?? 0) / 100 / 12;
  let requiredWithReturn = requiredMonthly;
  if (r > 0) {
    const fvExisting = (params.existingSavings ?? 0) * Math.pow(1 + r, params.months);
    const need = inflatedGoal - fvExisting;
    requiredWithReturn = need > 0 ? (need * r) / (Math.pow(1 + r, params.months) - 1) : 0;
  }

  const gap = available - requiredWithReturn;
  const feasible = gap >= 0;

  let healthScore = feasible ? 78 : 42;
  if (feasible && available > requiredWithReturn * 1.25) healthScore += 15;
  if (!feasible) healthScore -= Math.min(30, (Math.abs(gap) / Math.max(requiredWithReturn, 1)) * 40);
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const monthlySave = Math.max(requiredWithReturn, available > 0 ? available : 0);
  const projection: { month: number; balance: number }[] = [];
  let balance = params.existingSavings ?? 0;
  for (let m = 0; m <= params.months; m++) {
    projection.push({ month: m, balance: Math.round(balance) });
    if (m < params.months) {
      balance = balance * (1 + r) + monthlySave;
    }
  }

  const milestones: SavingsMilestone[] = [];
  const marks = [0.25, 0.5, 0.75, 1];
  for (const frac of marks) {
    const target = inflatedGoal * frac;
    const hit = projection.find((p) => p.balance >= target);
    milestones.push({
      month: hit?.month ?? params.months,
      balance: target,
      label: `${(frac * 100).toFixed(0)}% of goal`,
    });
  }

  const insights: AiInsight[] = [];
  if (!feasible) {
    insights.push({
      priority: "high",
      title: "Savings rate too low",
      detail: `Increase income or cut ₹${Math.abs(gap).toFixed(0)}/month to stay on timeline.`,
    });
  } else {
    insights.push({
      priority: "low",
      title: "Plan is achievable",
      detail: `Surplus covers required ₹${requiredWithReturn.toFixed(0)}/month with current cash flow.`,
    });
  }
  if ((params.expectedReturnPercent ?? 0) > 0) {
    insights.push({
      priority: "medium",
      title: "Investment growth assumed",
      detail: `${params.expectedReturnPercent}% annual return lowers required SIP to ₹${requiredWithReturn.toFixed(0)}/month.`,
    });
  }
  if (inflation > 0) {
    insights.push({
      priority: "medium",
      title: "Inflation-adjusted target",
      detail: `Goal inflates to ₹${inflatedGoal.toFixed(0)} over ${params.months} months at ${params.inflationPercent}% CPI.`,
    });
  }

  const scenarios = [
    { label: "Current timeline", months: params.months, monthly: requiredWithReturn },
    { label: "+6 months buffer", months: params.months + 6, monthly: inflatedGoal / (params.months + 6) },
    { label: "10% higher savings", months: params.months, monthly: requiredWithReturn * 1.1 },
  ];

  return {
    requiredMonthly,
    requiredWithReturn,
    gap,
    feasible,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    projection,
    milestones,
    scenarios,
  };
}

export function optimizeExpensesRich(params: {
  categories: { name: string; amount: number }[];
  targetCutPercent: number;
  income?: number;
}):
  | {
      total: number;
      targetCut: number;
      newBudget: number;
      healthScore: number;
      insights: AiInsight[];
      rankedCuts: { name: string; amount: number; suggestedCut: number; ease: "easy" | "medium" | "hard" }[];
      chartSlices: ChartSlice[];
    }
  | { error: string } {
  const total = params.categories.reduce((s, c) => s + c.amount, 0);
  if (total <= 0) return { error: "Enter expense amounts." };
  if (params.targetCutPercent <= 0 || params.targetCutPercent > 50) {
    return { error: "Target cut should be between 1% and 50%." };
  }
  const targetCut = total * (params.targetCutPercent / 100);
  const easeMap: Record<string, "easy" | "medium" | "hard"> = {
    Subscriptions: "easy",
    Entertainment: "easy",
    Shopping: "medium",
    Food: "medium",
    Transport: "medium",
    Housing: "hard",
    Healthcare: "hard",
    Education: "hard",
  };
  const ranked = [...params.categories]
    .sort((a, b) => b.amount - a.amount)
    .map((c) => ({
      name: c.name,
      amount: c.amount,
      suggestedCut: Math.round(c.amount * (params.targetCutPercent / 100) * (easeMap[c.name] === "easy" ? 1.2 : easeMap[c.name] === "hard" ? 0.5 : 1)),
      ease: easeMap[c.name] ?? ("medium" as const),
    }));

  const insights: AiInsight[] = ranked.slice(0, 3).map((r, i) => ({
    priority: (i === 0 ? "high" : "medium") as AiInsightPriority,
    title: `Trim ${r.name}`,
    detail: `Suggested cut ₹${r.suggestedCut.toLocaleString()} (${r.ease} win).`,
  }));

  const COLORS = ["#6548f5", "#0d9488", "#f59e0b", "#ec4899", "#6366f1"];
  const chartSlices = params.categories
    .filter((c) => c.amount > 0)
    .map((c, i) => ({ name: c.name, value: c.amount, fill: COLORS[i % COLORS.length] }));

  return {
    total,
    targetCut,
    newBudget: total - targetCut,
    healthScore: Math.max(40, 100 - params.targetCutPercent),
    insights,
    rankedCuts: ranked,
    chartSlices,
  };
}

export function subscriptionAnalyzerRich(params: {
  items: { name: string; monthly: number }[];
}):
  | {
      monthlyTotal: number;
      annualCost: number;
      count: number;
      duplicates: string[];
      insights: AiInsight[];
      chartSlices: ChartSlice[];
      healthScore: number;
      wasteEstimate: number;
    }
  | { error: string } {
  const active = params.items.filter((i) => i.monthly > 0);
  if (!active.length) return { error: "Add at least one subscription." };
  const monthlyTotal = active.reduce((s, i) => s + i.monthly, 0);
  const annualCost = monthlyTotal * 12;
  const names = active.map((i) => i.name.toLowerCase());
  const duplicates: string[] = [];
  const groups = ["music", "stream", "cloud", "vpn", "news"];
  for (const g of groups) {
    const hits = active.filter((i) => i.name.toLowerCase().includes(g));
    if (hits.length > 1) duplicates.push(`${g} (${hits.length} services)`);
  }

  const wasteEstimate = active.filter((i) => i.monthly < 199).reduce((s, i) => s + i.monthly, 0) * 0.3;
  let healthScore = 88;
  if (active.length > 8) healthScore -= 20;
  if (monthlyTotal > 5000) healthScore -= 15;
  if (duplicates.length) healthScore -= 10;
  healthScore = Math.max(0, healthScore);

  const insights: AiInsight[] = [];
  if (duplicates.length) {
    insights.push({ priority: "high", title: "Overlapping services", detail: duplicates.join("; ") });
  }
  insights.push({
    priority: "medium",
    title: "Annual burn",
    detail: `₹${annualCost.toLocaleString()}/year — 15% trim saves ₹${(annualCost * 0.15).toFixed(0)}.`,
  });
  if (wasteEstimate > 500) {
    insights.push({
      priority: "low",
      title: "Low-tier stack",
      detail: `Small subscriptions may total ₹${wasteEstimate.toFixed(0)}/mo in low-usage spend.`,
    });
  }

  const COLORS = ["#6548f5", "#0d9488", "#f59e0b", "#ec4899", "#6366f1", "#14b8a6"];
  const chartSlices = active.map((i, idx) => ({
    name: i.name,
    value: i.monthly,
    fill: COLORS[idx % COLORS.length],
  }));

  return {
    monthlyTotal,
    annualCost,
    count: active.length,
    duplicates,
    insights,
    chartSlices,
    healthScore,
    wasteEstimate,
  };
}

export type { AiRiskProfile };
