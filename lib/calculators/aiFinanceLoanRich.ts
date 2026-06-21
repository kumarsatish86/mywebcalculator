import type { AiRiskProfile } from "./aiFinanceSmart";
import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  adviseSmartLoan,
  assessLoanRisk,
  generateEmiPlans,
  pickBestEmiPlan,
  type EmiPlanOption,
} from "./loanAdvisory";
import { monthlyLoanPayment } from "./loanPayment";

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

type RichBase = {
  healthScore: number;
  grade: string;
  insights: AiInsight[];
  chartSlices?: ChartSlice[];
  compareRows?: { label: string; target: number; actual: number }[];
  projection?: { month: number; balance: number }[];
  scenarios?: { label: string; months: number; monthly: number }[];
};

export function riskAnalyzeRich(params: {
  age: number;
  horizonYears: number;
  incomeStability: number;
  emergencyFundMonths?: number;
  lossTolerance?: number;
}): RichBase & { profile: AiRiskProfile; equityCap: number; capacityScore: number } | { error: string } {
  if (params.age < 18 || params.age > 80) return { error: "Enter age between 18 and 80." };
  if (params.horizonYears <= 0) return { error: "Investment horizon must be positive." };

  const agePts = params.age < 35 ? 25 : params.age < 50 ? 18 : 10;
  const horizonPts = params.horizonYears >= 10 ? 30 : params.horizonYears >= 5 ? 20 : 10;
  const stabilityPts = params.incomeStability >= 70 ? 30 : params.incomeStability >= 40 ? 18 : 8;
  const emergencyPts = (params.emergencyFundMonths ?? 6) >= 6 ? 10 : (params.emergencyFundMonths ?? 6) >= 3 ? 5 : 0;
  const lossTolPts = (params.lossTolerance ?? 50) >= 70 ? 5 : (params.lossTolerance ?? 50) >= 40 ? 3 : 0;

  const capacityScore = agePts + horizonPts + stabilityPts + emergencyPts + lossTolPts;
  const profile: AiRiskProfile = capacityScore >= 75 ? "high" : capacityScore >= 50 ? "medium" : "low";
  const equityCap = profile === "high" ? 80 : profile === "medium" ? 60 : 40;
  const healthScore = Math.min(100, Math.round(capacityScore * 0.95));

  const insights: AiInsight[] = [];
  if ((params.emergencyFundMonths ?? 6) < 6) {
    insights.push({
      priority: "high",
      title: "Emergency buffer",
      detail: "Build 6–12 months of expenses in liquid debt before increasing equity beyond basics.",
    });
  }
  if (params.horizonYears < 5) {
    insights.push({
      priority: "high",
      title: "Short horizon",
      detail: "Goals under 5 years rarely suit high equity — cap equity near 40–50% for near-term needs.",
    });
  }
  if (params.incomeStability < 50) {
    insights.push({
      priority: "medium",
      title: "Income volatility",
      detail: "Variable income warrants higher debt/cash sleeve — avoid max equity even if age allows it.",
    });
  }
  insights.push({
    priority: "low",
    title: "Equity ceiling",
    detail: `Suggested max equity allocation near ${equityCap}% for this ${profile} capacity profile.`,
  });

  return {
    profile,
    equityCap,
    capacityScore,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    compareRows: [
      { label: "Age factor", target: 25, actual: agePts },
      { label: "Horizon", target: 30, actual: horizonPts },
      { label: "Stability", target: 30, actual: stabilityPts },
      { label: "Emergency fund", target: 10, actual: emergencyPts },
    ],
    chartSlices: [
      { name: "Age", value: agePts, fill: "#6548f5" },
      { name: "Horizon", value: horizonPts, fill: "#0d9488" },
      { name: "Stability", value: stabilityPts, fill: "#f59e0b" },
      { name: "Buffer", value: emergencyPts + lossTolPts, fill: "#94a3b8" },
    ],
  };
}

export function assetAllocationRich(params: {
  age: number;
  risk: AiRiskProfile;
  horizonYears?: number;
  portfolioValue?: number;
}): RichBase & { equity: number; debt: number; gold: number; cash: number; ruleOf100Equity: number } | { error: string } {
  if (params.age < 18) return { error: "Age must be at least 18." };

  const ruleOf100Equity = Math.max(20, Math.min(80, 100 - params.age));
  let equity = ruleOf100Equity;
  if (params.risk === "low") equity = Math.min(equity, 35);
  if (params.risk === "high") equity = Math.max(equity, 65);
  if (params.horizonYears != null && params.horizonYears < 5) equity = Math.min(equity, 45);

  const debt = Math.round((100 - equity) * 0.7);
  const gold = Math.round((100 - equity) * 0.2);
  const cash = Math.max(0, 100 - equity - debt - gold);

  const pv = params.portfolioValue ?? 1000000;
  let healthScore = 78;
  if (params.risk === "low" && equity <= 35) healthScore += 10;
  if (params.risk === "high" && equity >= 65) healthScore += 8;
  if (Math.abs(equity - ruleOf100Equity) <= 10) healthScore += 5;
  healthScore = Math.min(100, healthScore);

  const insights: AiInsight[] = [
    {
      priority: "medium",
      title: "Rule of 100 baseline",
      detail: `Age-based equity hint is ${ruleOf100Equity}% — your ${params.risk} risk profile adjusts to ${equity}%.`,
    },
  ];
  if (params.horizonYears != null && params.horizonYears < 5) {
    insights.push({
      priority: "high",
      title: "Near-term goal",
      detail: "Horizon under 5 years — shift 20–30% more to debt/liquid than age alone suggests.",
    });
  }
  insights.push({
    priority: "low",
    title: "Rebalance cadence",
    detail: "Review mix annually or after ±10% market move; gold sleeve hedges INR depreciation.",
  });

  return {
    equity,
    debt,
    gold,
    cash,
    ruleOf100Equity,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    chartSlices: [
      { name: "Equity", value: equity, fill: "#6548f5" },
      { name: "Debt", value: debt, fill: "#0d9488" },
      { name: "Gold", value: gold, fill: "#f59e0b" },
      { name: "Cash", value: cash, fill: "#94a3b8" },
    ],
    compareRows: [
      { label: "Equity", target: ruleOf100Equity, actual: equity },
      { label: "Debt", target: Math.round((100 - ruleOf100Equity) * 0.7), actual: debt },
      { label: "Gold", target: Math.round((100 - ruleOf100Equity) * 0.2), actual: gold },
    ],
    scenarios: [
      { label: "Conservative", months: 0, monthly: Math.round(pv * 0.3) },
      { label: "Suggested", months: 0, monthly: Math.round(pv * (equity / 100)) },
      { label: "Aggressive", months: 0, monthly: Math.round(pv * 0.85) },
    ],
  };
}

export function loanAdvisorRich(params: {
  grossIncome: number;
  existingDebt: number;
  principal: number;
  apr: number;
  termMonths: number;
  emergencyFundMonths?: number;
}): RichBase & {
  emi: number;
  totalInterest: number;
  newDti: number;
  verdict: string;
  riskBand: string;
  freeCash: number;
} | { error: string } {
  const base = adviseSmartLoan(params);
  if ("error" in base) return base;

  const risk = assessLoanRisk({
    grossIncome: params.grossIncome,
    existingDebt: params.existingDebt,
    emi: base.emi,
    apr: params.apr,
    termMonths: params.termMonths,
    emergencyFundMonths: params.emergencyFundMonths,
  });

  const freeCash = params.grossIncome - params.existingDebt - base.emi;
  const healthScore =
    base.verdict === "Strong" ? 92 : base.verdict === "Manageable" ? 78 : base.verdict === "Stretched" ? 52 : 32;

  const shorter = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: Math.max(12, params.termMonths - 60),
  });
  const longer = monthlyLoanPayment({
    principal: params.principal,
    annualRatePercent: params.apr,
    termMonths: params.termMonths + 60,
  });

  const insights: AiInsight[] = base.tips.map((t, i) => ({
    priority: i === 0 ? "high" : "medium",
    title: "Affordability",
    detail: t,
  }));
  if (risk.band === "Elevated" || risk.band === "High") {
    insights.unshift({
      priority: "high",
      title: `Risk band: ${risk.band}`,
      detail: risk.factors[0] ?? "Multiple stress factors detected.",
    });
  }
  if (freeCash < params.grossIncome * 0.15) {
    insights.push({
      priority: "medium",
      title: "Low free cash",
      detail: `Only ₹${Math.round(freeCash).toLocaleString("en-IN")}/mo left after EMIs — keep 15%+ buffer for shocks.`,
    });
  }

  return {
    emi: base.emi,
    totalInterest: base.totalInterest,
    newDti: base.newDti,
    verdict: base.verdict,
    riskBand: risk.band,
    freeCash,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: insights.slice(0, 5),
    chartSlices: [
      { name: "New EMI", value: base.emi, fill: "#6548f5" },
      { name: "Existing EMIs", value: params.existingDebt, fill: "#f59e0b" },
      { name: "Free cash", value: Math.max(0, freeCash), fill: "#22c55e" },
    ],
    compareRows: [
      { label: "DTI (30% cap)", target: params.grossIncome * 0.3, actual: params.existingDebt + base.emi },
      { label: "DTI (36% caution)", target: params.grossIncome * 0.36, actual: params.existingDebt + base.emi },
      { label: "DTI (43% limit)", target: params.grossIncome * 0.43, actual: params.existingDebt + base.emi },
    ],
    scenarios:
      !("error" in shorter) && !("error" in longer)
        ? [
            { label: `${Math.round((params.termMonths - 60) / 12)} yr (shorter)`, months: params.termMonths - 60, monthly: shorter.payment },
            { label: `${Math.round(params.termMonths / 12)} yr (chosen)`, months: params.termMonths, monthly: base.emi },
            { label: `${Math.round((params.termMonths + 60) / 12)} yr (longer)`, months: params.termMonths + 60, monthly: longer.payment },
          ]
        : undefined,
  };
}

export function emiOptimizeRich(params: {
  principal: number;
  apr: number;
  maxAffordableEmi: number;
}): RichBase & { best: EmiPlanOption | null; plans: EmiPlanOption[] } | { error: string } {
  const plans = generateEmiPlans({
    principal: params.principal,
    apr: params.apr,
    maxAffordableEmi: params.maxAffordableEmi,
    termYearsCandidates: [5, 10, 15, 20, 25, 30],
  });
  if ("error" in plans) return plans;

  const best = pickBestEmiPlan(plans, params.maxAffordableEmi);
  const affordable = plans.filter((p) => p.fitsBudget);
  const healthScore = best?.fitsBudget ? 88 : affordable.length ? 65 : 40;

  const insights: AiInsight[] = [];
  for (const pl of plans.slice(0, 4)) {
    insights.push({
      priority: pl.termYears === best?.termYears ? "high" : pl.fitsBudget ? "medium" : "low",
      title: `${pl.termYears}-year plan`,
      detail: pl.fitsBudget
        ? `EMI ₹${Math.round(pl.emi).toLocaleString("en-IN")} · interest ₹${Math.round(pl.totalInterest).toLocaleString("en-IN")}${pl.termYears === best?.termYears ? " · optimal" : ""}`
        : `EMI ₹${Math.round(pl.emi).toLocaleString("en-IN")} exceeds cap of ₹${Math.round(params.maxAffordableEmi).toLocaleString("en-IN")}`,
    });
  }

  return {
    best,
    plans,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    compareRows: plans.slice(0, 5).map((p) => ({
      label: `${p.termYears}y interest`,
      target: best?.totalInterest ?? p.totalInterest,
      actual: p.totalInterest,
    })),
    chartSlices: best
      ? [
          { name: "Principal", value: params.principal, fill: "#6548f5" },
          { name: "Interest", value: best.totalInterest, fill: "#f59e0b" },
        ]
      : undefined,
    scenarios: plans
      .filter((p) => p.fitsBudget)
      .slice(0, 3)
      .map((p) => ({ label: `${p.termYears} years`, months: p.termMonths, monthly: p.emi })),
  };
}

type DebtLine = { balance: number; apr: number; minimum: number; name?: string };

function simulatePayoffRich(debts: DebtLine[], extra: number, order: "balance" | "apr") {
  const list = debts.map((d) => ({ ...d, bal: d.balance }));
  let months = 0;
  let totalInterest = 0;
  const projection: { month: number; balance: number }[] = [{ month: 0, balance: list.reduce((s, d) => s + d.bal, 0) }];

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
    if (months % 3 === 0 || !list.some((d) => d.bal > 0.01)) {
      projection.push({ month: months, balance: Math.round(list.reduce((s, d) => s + d.bal, 0)) });
    }
  }
  return { months, totalInterest, projection };
}

export function debtRepayRich(params: {
  debts: DebtLine[];
  extraPayment: number;
}): RichBase & {
  snowball: { months: number; totalInterest: number };
  avalanche: { months: number; totalInterest: number };
  recommendation: "snowball" | "avalanche" | "tie";
  interestSaved: number;
  payoffOrder: string[];
} | { error: string } {
  if (!params.debts.length) return { error: "Add at least one debt." };
  for (const d of params.debts) {
    if (d.balance <= 0 || d.minimum <= 0) return { error: "Each debt needs positive balance and minimum payment." };
  }

  const snowball = simulatePayoffRich(params.debts, params.extraPayment, "balance");
  const avalanche = simulatePayoffRich(params.debts, params.extraPayment, "apr");
  let recommendation: "snowball" | "avalanche" | "tie" = "tie";
  if (avalanche.totalInterest < snowball.totalInterest - 1) recommendation = "avalanche";
  else if (snowball.totalInterest < avalanche.totalInterest - 1) recommendation = "snowball";

  const interestSaved = Math.abs(snowball.totalInterest - avalanche.totalInterest);
  const best = recommendation === "avalanche" ? avalanche : recommendation === "snowball" ? snowball : avalanche;
  const totalDebt = params.debts.reduce((s, d) => s + d.balance, 0);
  const healthScore = Math.max(35, Math.min(95, Math.round(100 - totalDebt / 50000 - best.months / 8)));

  const insights: AiInsight[] = [];
  if (recommendation === "avalanche") {
    insights.push({
      priority: "high",
      title: "Avalanche wins",
      detail: `Save ₹${Math.round(interestSaved).toLocaleString("en-IN")} interest vs snowball — attack highest APR first.`,
    });
  } else if (recommendation === "snowball") {
    insights.push({
      priority: "high",
      title: "Snowball wins",
      detail: "Clear smallest balance first for psychological momentum — slight interest trade-off.",
    });
  } else {
    insights.push({
      priority: "medium",
      title: "Strategies tie",
      detail: "Both finish in similar time/interest — pick snowball for motivation or avalanche for math purity.",
    });
  }
  const highestApr = [...params.debts].sort((a, b) => b.apr - a.apr)[0];
  if (highestApr && highestApr.apr > 18) {
    insights.push({
      priority: "medium",
      title: "High APR debt",
      detail: `${highestApr.name ?? "Debt"} at ${highestApr.apr}% — consider balance transfer if eligible.`,
    });
  }

  const payoffOrder =
    recommendation === "avalanche"
      ? [...params.debts].sort((a, b) => b.apr - a.apr).map((d, i) => `${i + 1}. ${d.name ?? "Debt"} (${d.apr}% APR)`)
      : [...params.debts].sort((a, b) => a.balance - b.balance).map((d, i) => `${i + 1}. ${d.name ?? "Debt"} (₹${d.balance.toLocaleString("en-IN")})`);

  return {
    snowball: { months: snowball.months, totalInterest: snowball.totalInterest },
    avalanche: { months: avalanche.months, totalInterest: avalanche.totalInterest },
    recommendation,
    interestSaved,
    payoffOrder,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights,
    projection: best.projection,
    compareRows: [
      { label: "Snowball interest", target: avalanche.totalInterest, actual: snowball.totalInterest },
      { label: "Avalanche interest", target: snowball.totalInterest, actual: avalanche.totalInterest },
      { label: "Months (best)", target: Math.min(snowball.months, avalanche.months), actual: best.months },
    ],
    chartSlices: params.debts.map((d, i) => ({
      name: d.name ?? `Debt ${i + 1}`,
      value: d.balance,
      fill: ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8"][i % 4],
    })),
    scenarios: [
      { label: "Snowball", months: snowball.months, monthly: params.extraPayment },
      { label: "Avalanche", months: avalanche.months, monthly: params.extraPayment },
      { label: "Extra +50%", months: Math.round(best.months * 0.85), monthly: params.extraPayment * 1.5 },
    ],
  };
}

export function creditScoreRich(params: {
  utilizationPercent: number;
  paymentHistoryScore: number;
  accountAgeYears: number;
  recentInquiries: number;
  targetScore?: number;
}): RichBase & {
  estimatedScore: number;
  band: string;
  factorImpacts: { factor: string; impact: number }[];
  potentialGain: number;
} | { error: string } {
  if (params.utilizationPercent < 0 || params.utilizationPercent > 100) {
    return { error: "Utilization must be 0–100%." };
  }

  const utilImpact = -Math.max(0, params.utilizationPercent - 30) * 2;
  const payImpact = Math.min(120, params.paymentHistoryScore * 1.2);
  const ageImpact = Math.min(40, params.accountAgeYears * 4);
  const inqImpact = -params.recentInquiries * 8;

  let score = 650 + payImpact + utilImpact + ageImpact + inqImpact;
  score = Math.round(Math.max(300, Math.min(850, score)));

  const band = score >= 750 ? "Excellent" : score >= 700 ? "Good" : score >= 650 ? "Fair" : "Needs work";
  const healthScore = Math.round(((score - 300) / 550) * 100);

  let potentialGain = 0;
  if (params.utilizationPercent > 30) potentialGain += Math.min(40, (params.utilizationPercent - 30) * 1.5);
  if (params.recentInquiries > 0) potentialGain += params.recentInquiries * 5;
  if (params.paymentHistoryScore < 90) potentialGain += 10;
  potentialGain = Math.round(potentialGain);

  const insights: AiInsight[] = [];
  if (params.utilizationPercent > 30) {
    insights.push({
      priority: "high",
      title: "High utilization",
      detail: `At ${params.utilizationPercent}%, pay revolving balances below 30% — could add ~${Math.round((params.utilizationPercent - 30) * 1.5)} pts.`,
    });
  }
  if (params.paymentHistoryScore < 80) {
    insights.push({
      priority: "high",
      title: "Payment history",
      detail: "Enable autopay on all cards — on-time history is the largest score driver.",
    });
  }
  if (params.recentInquiries > 2) {
    insights.push({
      priority: "medium",
      title: "Recent inquiries",
      detail: "Pause new credit applications for 6–12 months to let inquiry impact fade.",
    });
  }
  if (params.accountAgeYears < 3) {
    insights.push({
      priority: "low",
      title: "Thin file",
      detail: "Keep oldest account open — average age builds slowly; avoid closing first card.",
    });
  }
  if (!insights.length) {
    insights.push({
      priority: "low",
      title: "Maintain habits",
      detail: "Keep utilization low and payments on time — score is in a healthy band.",
    });
  }

  const target = params.targetScore ?? 750;
  if (score < target) {
    insights.unshift({
      priority: "medium",
      title: `Path to ${target}`,
      detail: `Estimated +${potentialGain} pts possible with utilization trim and no new inquiries.`,
    });
  }

  return {
    estimatedScore: score,
    band,
    factorImpacts: [
      { factor: "Utilization", impact: utilImpact },
      { factor: "Payment history", impact: payImpact },
      { factor: "Account age", impact: ageImpact },
      { factor: "Inquiries", impact: inqImpact },
    ],
    potentialGain,
    healthScore,
    grade: band,
    insights,
    chartSlices: [
      { name: "Utilization", value: Math.abs(utilImpact) + 30, fill: utilImpact < -10 ? "#f43f5e" : "#22c55e" },
      { name: "Payments", value: Math.max(10, params.paymentHistoryScore), fill: "#6548f5" },
      { name: "Age", value: Math.max(5, params.accountAgeYears * 5), fill: "#0d9488" },
      { name: "Inquiries", value: Math.max(5, params.recentInquiries * 10 + 5), fill: "#f59e0b" },
    ],
    compareRows: [
      { label: "Current score", target: target, actual: score },
      { label: "Utilization", target: 30, actual: params.utilizationPercent },
      { label: "Payment hist.", target: 90, actual: params.paymentHistoryScore },
    ],
    scenarios: [
      { label: "Fix utilization", months: 3, monthly: score + Math.round((params.utilizationPercent - 30) * 1.2) },
      { label: "No new inquiries", months: 6, monthly: score + params.recentInquiries * 4 },
      { label: `Target ${target}`, months: 12, monthly: Math.min(850, score + potentialGain) },
    ],
  };
}
