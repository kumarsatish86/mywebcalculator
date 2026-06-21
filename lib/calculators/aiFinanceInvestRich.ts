import type { AiRiskProfile } from "./aiFinanceSmart";
import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";

export type GoalType = "general" | "retirement" | "education" | "house";

export type AllocationMix = { equity: number; debt: number; gold: number; cash: number };

const TARGET_BY_RISK: Record<AiRiskProfile, AllocationMix> = {
  low: { equity: 30, debt: 55, gold: 10, cash: 5 },
  medium: { equity: 60, debt: 25, gold: 10, cash: 5 },
  high: { equity: 80, debt: 10, gold: 7, cash: 3 },
};

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

function monthlySipForGoal(goal: number, months: number, annualReturn: number): number {
  const r = annualReturn / 100 / 12;
  if (r <= 0) return goal / months;
  return (goal * r) / (Math.pow(1 + r, months) - 1);
}

export function projectWealthPath(params: {
  monthlySip: number;
  months: number;
  annualReturn: number;
  existingCorpus?: number;
  stepUpPercent?: number;
}): { projection: { month: number; balance: number }[]; totalInvested: number; gains: number } {
  const r = params.annualReturn / 100 / 12;
  let balance = params.existingCorpus ?? 0;
  let sip = params.monthlySip;
  let invested = balance;
  const projection: { month: number; balance: number }[] = [{ month: 0, balance: Math.round(balance) }];

  for (let m = 1; m <= params.months; m++) {
    if (m > 1 && m % 12 === 1 && params.stepUpPercent) {
      sip *= 1 + params.stepUpPercent / 100;
    }
    balance = balance * (1 + r) + sip;
    invested += sip;
    if (m % 3 === 0 || m === params.months) {
      projection.push({ month: m, balance: Math.round(balance) });
    }
  }

  return {
    projection,
    totalInvested: Math.round(invested),
    gains: Math.round(balance - invested),
  };
}

export function projectSipCompare(params: {
  targetCorpus: number;
  months: number;
  annualReturn: number;
  existingCorpus?: number;
  stepUpPercent: number;
}): {
  flatSip: number;
  stepUpStartSip: number;
  compare: { month: number; flat: number; stepUp: number }[];
  stepUpTotalInvested: number;
  flatTotalInvested: number;
} {
  const inflatedGoal = params.targetCorpus;
  const flatSip = monthlySipForGoal(
    Math.max(0, inflatedGoal - (params.existingCorpus ?? 0) * Math.pow(1 + params.annualReturn / 100 / 12, params.months)),
    params.months,
    params.annualReturn,
  );

  let stepStart = flatSip * 0.85;
  for (let i = 0; i < 20; i++) {
    const path = projectWealthPath({
      monthlySip: stepStart,
      months: params.months,
      annualReturn: params.annualReturn,
      existingCorpus: params.existingCorpus,
      stepUpPercent: params.stepUpPercent,
    });
    const end = path.projection[path.projection.length - 1]?.balance ?? 0;
    if (Math.abs(end - inflatedGoal) < inflatedGoal * 0.02) break;
    stepStart *= end < inflatedGoal ? 1.05 : 0.95;
  }

  const flatPath = projectWealthPath({
    monthlySip: flatSip,
    months: params.months,
    annualReturn: params.annualReturn,
    existingCorpus: params.existingCorpus,
  });
  const stepPath = projectWealthPath({
    monthlySip: stepStart,
    months: params.months,
    annualReturn: params.annualReturn,
    existingCorpus: params.existingCorpus,
    stepUpPercent: params.stepUpPercent,
  });

  const monthSet = new Set([...flatPath.projection.map((p) => p.month), ...stepPath.projection.map((p) => p.month)]);
  const compare = [...monthSet]
    .sort((a, b) => a - b)
    .map((month) => ({
      month,
      flat: flatPath.projection.find((p) => p.month === month)?.balance ?? 0,
      stepUp: stepPath.projection.find((p) => p.month === month)?.balance ?? 0,
    }));

  return {
    flatSip,
    stepUpStartSip: stepStart,
    compare,
    flatTotalInvested: flatPath.totalInvested,
    stepUpTotalInvested: stepPath.totalInvested,
  };
}

export function investmentPlanRich(params: {
  goal: number;
  years: number;
  expectedReturn: number;
  risk: AiRiskProfile;
  existingCorpus?: number;
  inflationPercent?: number;
  monthlyIncome?: number;
  goalType?: GoalType;
  stepUpPercent?: number;
}):
  | {
      monthlySip: number;
      inflatedGoal: number;
      allocation: AllocationMix;
      allocationLabel: string;
      healthScore: number;
      grade: string;
      insights: AiInsight[];
      chartSlices: ChartSlice[];
      projection: { month: number; balance: number }[];
      compareRows: { label: string; target: number; actual: number }[];
      scenarios: { label: string; months: number; monthly: number }[];
      totalInvested: number;
      expectedGains: number;
      sipToIncomePct: number | null;
    }
  | { error: string } {
  if (params.years <= 0) return { error: "Horizon must be at least one year." };
  if (params.goal <= 0) return { error: "Goal must be positive." };

  const months = params.years * 12;
  const inflation = (params.inflationPercent ?? 0) / 100;
  const inflatedGoal = params.goal * Math.pow(1 + inflation, params.years);
  const fvExisting = (params.existingCorpus ?? 0) * Math.pow(1 + params.expectedReturn / 100, params.years);
  const needFromSip = Math.max(0, inflatedGoal - fvExisting);
  const monthlySip = monthlySipForGoal(needFromSip, months, params.expectedReturn);

  const alloc = TARGET_BY_RISK[params.risk];
  const path = projectWealthPath({
    monthlySip,
    months,
    annualReturn: params.expectedReturn,
    existingCorpus: params.existingCorpus,
    stepUpPercent: params.stepUpPercent,
  });

  const fdSip = monthlySipForGoal(needFromSip, months, 7);
  const sipToIncomePct =
    params.monthlyIncome && params.monthlyIncome > 0 ? (monthlySip / params.monthlyIncome) * 100 : null;

  let healthScore = 78;
  if (sipToIncomePct != null) {
    if (sipToIncomePct <= 20) healthScore += 12;
    else if (sipToIncomePct <= 35) healthScore += 5;
    else healthScore -= 15;
  }
  if ((params.existingCorpus ?? 0) > params.goal * 0.2) healthScore += 8;
  if (params.expectedReturn > 15) healthScore -= 8;
  healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

  const insights: AiInsight[] = [];
  if (inflation > 0) {
    insights.push({
      priority: "medium",
      title: "Inflation-adjusted target",
      detail: `₹${params.goal.toLocaleString("en-IN")} grows to ₹${Math.round(inflatedGoal).toLocaleString("en-IN")} in ${params.years} years at ${params.inflationPercent}% CPI.`,
    });
  }
  if (params.goalType === "retirement") {
    insights.push({
      priority: "high",
      title: "Retirement horizon",
      detail: "Favor gradual equity reduction 5–7 years before withdrawal; keep 12–18 months expenses in liquid debt.",
    });
  } else if (params.goalType === "education") {
    insights.push({
      priority: "medium",
      title: "Education goal",
      detail: "Shift 30–40% to debt 2–3 years before the fee date to reduce market timing risk.",
    });
  } else if (params.goalType === "house") {
    insights.push({
      priority: "medium",
      title: "Home down-payment",
      detail: "Cap equity at 60–70% inside 3 years of purchase; park near-term portion in short-duration debt.",
    });
  }
  insights.push({
    priority: "low",
    title: "Vs 7% fixed deposit",
    detail: `Same goal at 7% return needs ₹${Math.round(fdSip).toLocaleString("en-IN")}/month — ${monthlySip < fdSip ? "lower" : "higher"} SIP at your ${params.expectedReturn}% assumption.`,
  });
  if (sipToIncomePct != null && sipToIncomePct > 40) {
    insights.push({
      priority: "high",
      title: "SIP stress on income",
      detail: `SIP is ${sipToIncomePct.toFixed(0)}% of income — extend horizon or raise step-up instead of flat high SIP.`,
    });
  }

  const chartSlices: ChartSlice[] = [
    { name: "Equity", value: alloc.equity, fill: "#6548f5" },
    { name: "Debt", value: alloc.debt, fill: "#0d9488" },
    { name: "Gold", value: alloc.gold, fill: "#f59e0b" },
    { name: "Cash", value: alloc.cash, fill: "#94a3b8" },
  ];

  const conservative = monthlySipForGoal(needFromSip, months, Math.max(6, params.expectedReturn - 3));
  const aggressive = monthlySipForGoal(needFromSip, months, params.expectedReturn + 2);

  return {
    monthlySip,
    inflatedGoal,
    allocation: alloc,
    allocationLabel: `${alloc.equity}% equity · ${alloc.debt}% debt · ${alloc.gold}% gold · ${alloc.cash}% cash`,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    chartSlices,
    projection: path.projection,
    compareRows: [
      { label: "Your SIP", target: fdSip, actual: monthlySip },
      { label: "Goal corpus", target: inflatedGoal, actual: path.projection[path.projection.length - 1]?.balance ?? 0 },
    ],
    scenarios: [
      { label: `Conservative (${Math.max(6, params.expectedReturn - 3)}%)`, months, monthly: conservative },
      { label: `Base (${params.expectedReturn}%)`, months, monthly: monthlySip },
      { label: `Optimistic (${params.expectedReturn + 2}%)`, months, monthly: aggressive },
    ],
    totalInvested: path.totalInvested,
    expectedGains: path.gains,
    sipToIncomePct,
  };
}

export function portfolioAnalyzeRich(params: {
  equityPercent: number;
  debtPercent: number;
  goldPercent: number;
  cashPercent: number;
  risk: AiRiskProfile;
  portfolioValue?: number;
  age?: number;
  horizonYears?: number;
}):
  | {
      healthScore: number;
      grade: string;
      verdict: string;
      insights: AiInsight[];
      chartSlices: ChartSlice[];
      targetSlices: ChartSlice[];
      compareRows: { label: string; target: number; actual: number }[];
      rebalance: { asset: string; deltaPercent: number; deltaAmount: number; action: string }[];
      equitySubSplit: { label: string; percent: number }[];
      total: number;
    }
  | { error: string } {
  const total = params.equityPercent + params.debtPercent + params.goldPercent + params.cashPercent;
  if (Math.abs(total - 100) > 2) return { error: "Allocation must sum to about 100%." };

  const target = { ...TARGET_BY_RISK[params.risk] };
  if (params.age != null && params.age > 50) {
    target.equity = Math.max(20, target.equity - (params.age - 50));
    target.debt = Math.min(65, target.debt + (params.age - 50) * 0.5);
  }

  const drift =
    Math.abs(params.equityPercent - target.equity) +
    Math.abs(params.debtPercent - target.debt) +
    Math.abs(params.goldPercent - target.gold);
  let healthScore = Math.max(0, Math.min(100, Math.round(100 - drift * 1.2)));
  let verdict = "Well aligned";
  if (healthScore < 60) verdict = "Rebalance suggested";
  else if (healthScore < 80) verdict = "Moderate drift";

  const pv = params.portfolioValue ?? 1000000;
  const rebalance = [
    { asset: "Equity", deltaPercent: target.equity - params.equityPercent, deltaAmount: (pv * (target.equity - params.equityPercent)) / 100, action: "" },
    { asset: "Debt", deltaPercent: target.debt - params.debtPercent, deltaAmount: (pv * (target.debt - params.debtPercent)) / 100, action: "" },
    { asset: "Gold", deltaPercent: target.gold - params.goldPercent, deltaAmount: (pv * (target.gold - params.goldPercent)) / 100, action: "" },
    { asset: "Cash", deltaPercent: target.cash - params.cashPercent, deltaAmount: (pv * (target.cash - params.cashPercent)) / 100, action: "" },
  ].map((r) => ({
    ...r,
    action: Math.abs(r.deltaPercent) < 2 ? "Hold" : r.deltaAmount > 0 ? "Buy" : "Trim",
  }));

  const insights: AiInsight[] = [];
  const topRebalance = rebalance.filter((r) => Math.abs(r.deltaPercent) >= 3).sort((a, b) => Math.abs(b.deltaPercent) - Math.abs(a.deltaPercent));
  for (const r of topRebalance.slice(0, 2)) {
    insights.push({
      priority: r.action === "Trim" || r.action === "Buy" ? "high" : "medium",
      title: `${r.action} ${r.asset}`,
      detail: `Shift ~${Math.abs(r.deltaPercent).toFixed(0)}% (≈ ₹${Math.abs(r.deltaAmount).toLocaleString("en-IN", { maximumFractionDigits: 0 })}) to align with ${params.risk} risk profile.`,
    });
  }
  if (params.equityPercent > 75) {
    insights.push({
      priority: "high",
      title: "Equity concentration",
      detail: "Equity above 75% raises drawdown risk — consider trimming after strong rally years.",
    });
  }
  if (params.horizonYears != null && params.horizonYears < 3 && params.equityPercent > 50) {
    insights.push({
      priority: "high",
      title: "Short horizon mismatch",
      detail: "Less than 3-year goals rarely suit >50% equity — move near-term slice to debt/liquid funds.",
    });
  }
  insights.push({
    priority: "low",
    title: "Benchmark context",
    detail: "Nifty 50 long-term CAGR is often quoted near 11–13% — your equity sleeve should match voluntary risk capacity, not past returns alone.",
  });

  const equitySubSplit = [
    { label: "Large cap (suggested)", percent: Math.round(params.equityPercent * 0.55) },
    { label: "Mid cap", percent: Math.round(params.equityPercent * 0.3) },
    { label: "Small cap", percent: Math.round(params.equityPercent * 0.15) },
  ];

  return {
    healthScore,
    grade: gradeFromScore(healthScore),
    verdict,
    insights: insights.slice(0, 5),
    chartSlices: [
      { name: "Equity", value: params.equityPercent, fill: "#6548f5" },
      { name: "Debt", value: params.debtPercent, fill: "#0d9488" },
      { name: "Gold", value: params.goldPercent, fill: "#f59e0b" },
      { name: "Cash", value: params.cashPercent, fill: "#94a3b8" },
    ],
    targetSlices: [
      { name: "Equity (target)", value: target.equity, fill: "#6548f588" },
      { name: "Debt (target)", value: target.debt, fill: "#0d948888" },
      { name: "Gold (target)", value: target.gold, fill: "#f59e0b88" },
      { name: "Cash (target)", value: target.cash, fill: "#94a3b888" },
    ],
    compareRows: [
      { label: "Equity", target: target.equity, actual: params.equityPercent },
      { label: "Debt", target: target.debt, actual: params.debtPercent },
      { label: "Gold", target: target.gold, actual: params.goldPercent },
      { label: "Cash", target: target.cash, actual: params.cashPercent },
    ],
    rebalance,
    equitySubSplit,
    total,
  };
}

export function sipStrategyOptimizeRich(params: {
  targetCorpus: number;
  years: number;
  expectedReturn: number;
  stepUpPercent?: number;
  existingCorpus?: number;
  inflationPercent?: number;
}):
  | {
      baseSip: number;
      stepUpStartSip: number;
      flatSip: number;
      healthScore: number;
      grade: string;
      insights: AiInsight[];
      projection: { month: number; balance: number }[];
      sipCompare: { month: number; flat: number; stepUp: number }[];
      scenarios: { label: string; months: number; monthly: number }[];
      totalMonths: number;
      savingsVsFlat: number;
      flatTotalInvested: number;
      stepUpTotalInvested: number;
      confidence: string;
    }
  | { error: string } {
  if (params.years <= 0) return { error: "Horizon must be positive." };
  if (params.targetCorpus <= 0) return { error: "Target corpus must be positive." };

  const step = params.stepUpPercent ?? 10;
  const months = params.years * 12;
  const inflation = (params.inflationPercent ?? 0) / 100;
  const inflatedTarget = params.targetCorpus * Math.pow(1 + inflation, params.years);

  const cmp = projectSipCompare({
    targetCorpus: inflatedTarget,
    months,
    annualReturn: params.expectedReturn,
    existingCorpus: params.existingCorpus,
    stepUpPercent: step,
  });

  const stepPath = projectWealthPath({
    monthlySip: cmp.stepUpStartSip,
    months,
    annualReturn: params.expectedReturn,
    existingCorpus: params.existingCorpus,
    stepUpPercent: step,
  });

  let healthScore = 80;
  if (cmp.stepUpStartSip < cmp.flatSip * 0.9) healthScore += 10;
  if (params.expectedReturn > 14) healthScore -= 10;
  if ((params.existingCorpus ?? 0) > inflatedTarget * 0.15) healthScore += 8;
  healthScore = Math.max(0, Math.min(100, healthScore));

  const savingsVsFlat = cmp.flatTotalInvested - cmp.stepUpTotalInvested;
  const confidence =
    params.expectedReturn <= 10 ? "High (conservative return)" : params.expectedReturn <= 13 ? "Moderate" : "Low (aggressive return)";

  const insights: AiInsight[] = [
    {
      priority: "high",
      title: "Step-up advantage",
      detail: `Starting at ₹${Math.round(cmp.stepUpStartSip).toLocaleString("en-IN")}/mo with ${step}% yearly step-up vs flat ₹${Math.round(cmp.flatSip).toLocaleString("en-IN")}/mo — invested ${savingsVsFlat >= 0 ? "less" : "more"} overall with step-up.`,
    },
    {
      priority: "medium",
      title: "Confidence band",
      detail: `${confidence} — at ${params.expectedReturn}% expected return, review annually and cut step-up if income stalls.`,
    },
  ];
  if (inflation > 0) {
    insights.push({
      priority: "medium",
      title: "Inflation on corpus",
      detail: `Target inflates to ₹${Math.round(inflatedTarget).toLocaleString("en-IN")} over ${params.years} years.`,
    });
  }
  insights.push({
    priority: "low",
    title: "Automation tip",
    detail: "Schedule SIP within 3 days of salary credit; increase step-up month with annual increment.",
  });

  return {
    baseSip: cmp.stepUpStartSip,
    stepUpStartSip: cmp.stepUpStartSip,
    flatSip: cmp.flatSip,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    projection: stepPath.projection,
    sipCompare: cmp.compare,
    scenarios: [
      { label: `Step-up ${step}%`, months, monthly: cmp.stepUpStartSip },
      { label: "Flat SIP", months, monthly: cmp.flatSip },
      { label: `Step-up ${step + 5}%`, months, monthly: cmp.stepUpStartSip * 0.92 },
    ],
    totalMonths: months,
    savingsVsFlat,
    flatTotalInvested: cmp.flatTotalInvested,
    stepUpTotalInvested: cmp.stepUpTotalInvested,
    confidence,
  };
}
