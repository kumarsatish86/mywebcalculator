import type { AiInsight, ChartSlice } from "./aiFinanceSmartRich";
import {
  AD_SCALE_STEPS,
  COST_LEVERS,
  FUNNEL_BENCHMARKS,
  MEETING_TIPS,
  PRICING_TIPS,
  PROFIT_BENCHMARKS,
  ROAS_BENCHMARKS,
  ROI_DECISION_STEPS,
  WORKLOAD_TIPS,
} from "./aiBusinessKnowledge";
import type { PricingModel } from "./aiBusinessSmart";

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

type RichResult = {
  healthScore: number;
  grade: string;
  insights: AiInsight[];
  chartSlices?: ChartSlice[];
  compareRows?: { label: string; target: number; actual: number }[];
  projection?: { month: number; balance: number }[];
  scenarios?: { label: string; months: number; monthly: number }[];
  schedule?: { time: string; activity: string }[];
  steps?: { step: number; text: string }[];
  rankedItems?: { name: string; score: number; status: string }[];
  milestones?: { week: number; target: number }[];
  usageTips?: string[];
  phases?: { phase: string; days: number; focus: string }[];
  pricingTiers?: { tier: string; price: number; marginPct: number }[];
  funnelSteps?: { stage: string; count: number; rate: string }[];
  rankedLevers?: { name: string; save: number; effort: string }[];
  quadrants?: { quadrant: string; tasks: string[] }[];
};

const FILLS = ["#6548f5", "#0d9488", "#f59e0b", "#94a3b8", "#f43f5e", "#22c55e"];

export function profitAnalyzerRich(params: {
  revenue: number;
  cogs: number;
  opex: number;
  growthPct?: number;
}): RichResult & { grossProfit: number; netProfit: number; grossMargin: number; netMargin: number; breakevenRevenue: number } | { error: string } {
  if (params.revenue <= 0) return { error: "Revenue must be positive." };
  if (params.cogs < 0 || params.opex < 0) return { error: "Costs cannot be negative." };

  const grossProfit = params.revenue - params.cogs;
  const netProfit = grossProfit - params.opex;
  const grossMargin = (grossProfit / params.revenue) * 100;
  const netMargin = (netProfit / params.revenue) * 100;
  const opexPct = (params.opex / params.revenue) * 100;
  const cogsRatio = params.cogs / params.revenue;
  const breakevenRevenue = cogsRatio < 1 ? params.opex / (1 - cogsRatio) : params.revenue * 2;
  const growth = params.growthPct ?? 3;

  let healthScore = 60;
  if (grossMargin >= PROFIT_BENCHMARKS.grossMin) healthScore += 15;
  if (netMargin >= PROFIT_BENCHMARKS.netMin) healthScore += 15;
  if (opexPct <= PROFIT_BENCHMARKS.opexMax) healthScore += 10;
  if (netProfit < 0) healthScore = 30;
  healthScore = Math.max(0, Math.min(100, healthScore));

  const gapToNetTarget = PROFIT_BENCHMARKS.netMin - netMargin;
  const insights: AiInsight[] = [
    { priority: netMargin < 10 ? "high" : "medium", title: "Net margin", detail: `${netMargin.toFixed(1)}% net (₹${Math.round(netProfit).toLocaleString("en-IN")}) on ₹${params.revenue.toLocaleString("en-IN")} revenue.` },
    { priority: "medium", title: "Breakeven", detail: `Need ~₹${Math.round(breakevenRevenue).toLocaleString("en-IN")} revenue to cover opex at current COGS ratio.` },
    { priority: gapToNetTarget > 0 ? "high" : "low", title: "Benchmark gap", detail: gapToNetTarget > 0 ? `${gapToNetTarget.toFixed(1)} pts below ${PROFIT_BENCHMARKS.netMin}% net target — trim opex or lift gross margin first.` : "Net margin meets benchmark — reinvest surplus in growth." },
    { priority: "low", title: "Growth path", detail: `At ${growth}% mo revenue growth, net profit reaches ~₹${Math.round(netProfit * Math.pow(1 + growth / 100, 6)).toLocaleString("en-IN")} in 6 months (flat margins).` },
  ];

  return {
    grossProfit,
    netProfit,
    grossMargin,
    netMargin,
    breakevenRevenue,
    healthScore,
    grade: netMargin >= 20 ? "Strong" : netMargin >= 10 ? "Healthy" : netProfit >= 0 ? "Thin" : "Loss",
    insights,
    chartSlices: [
      { name: "COGS", value: params.cogs, fill: FILLS[0] },
      { name: "Opex", value: params.opex, fill: FILLS[1] },
      { name: "Net profit", value: Math.max(0, netProfit), fill: FILLS[2] },
    ],
    compareRows: [
      { label: "Gross %", target: PROFIT_BENCHMARKS.grossMin, actual: grossMargin },
      { label: "Net %", target: PROFIT_BENCHMARKS.netMin, actual: netMargin },
      { label: "Opex %", target: PROFIT_BENCHMARKS.opexMax, actual: opexPct },
    ],
    projection: Array.from({ length: 13 }, (_, m) => ({
      month: m,
      balance: Math.round(netProfit * Math.pow(1 + growth / 100, m)),
    })),
    milestones: [1, 3, 6, 12].map((m) => ({ week: m, target: Math.round(netProfit * Math.pow(1 + growth / 100, m)) })),
    steps: [
      { step: 1, text: grossMargin < PROFIT_BENCHMARKS.grossMin ? "Review COGS: renegotiate suppliers or adjust pricing." : "Protect gross margin — focus on opex efficiency." },
      { step: 2, text: opexPct > PROFIT_BENCHMARKS.opexMax ? `Cut opex by ${(opexPct - PROFIT_BENCHMARKS.opexMax).toFixed(0)} pts of revenue.` : "Opex within band — audit subscriptions quarterly." },
      { step: 3, text: "Track net margin weekly; alert if it drops 2+ pts month-over-month." },
    ],
    usageTips: PRICING_TIPS.slice(0, 2),
  };
}

export function roiAdvisorRich(params: {
  investment: number;
  returns: number;
  months: number;
}): RichResult & { roiPct: number; paybackMonths: number; annualized: number; npvProxy: number } | { error: string } {
  if (params.investment <= 0) return { error: "Investment must be positive." };
  if (params.months <= 0) return { error: "Period must be at least 1 month." };

  const gain = params.returns - params.investment;
  const roiPct = (gain / params.investment) * 100;
  const paybackMonths = gain > 0 ? params.investment / (gain / params.months) : 999;
  const annualized = (Math.pow(params.returns / params.investment, 12 / params.months) - 1) * 100;
  const npvProxy = gain - params.investment * 0.12 * (params.months / 12);
  const costOfCapital = 12;

  return {
    roiPct,
    paybackMonths: Math.min(paybackMonths, 120),
    annualized,
    npvProxy,
    healthScore: Math.min(95, Math.max(30, 50 + roiPct / 2)),
    grade: roiPct >= 50 ? "Strong ROI" : roiPct >= 20 ? "Acceptable" : roiPct >= 0 ? "Marginal" : "Negative",
    insights: [
      { priority: roiPct < 20 ? "high" : "medium", title: "Return", detail: `${roiPct.toFixed(1)}% ROI over ${params.months} mo — annualized ~${annualized.toFixed(1)}% vs ${costOfCapital}% hurdle.` },
      { priority: "medium", title: "Payback", detail: gain > 0 ? `Break-even in ~${Math.ceil(paybackMonths)} months at current run-rate.` : "Investment not yet recovered — revisit assumptions." },
      { priority: npvProxy < 0 ? "high" : "low", title: "Risk-adjusted", detail: npvProxy >= 0 ? `NPV proxy +₹${Math.round(npvProxy).toLocaleString("en-IN")} after ${costOfCapital}% cost of capital.` : `Below hurdle by ~₹${Math.abs(Math.round(npvProxy)).toLocaleString("en-IN")} — delay or renegotiate.` },
      { priority: "low", title: "Compare alt", detail: "Benchmark vs FD, mutual fund, or organic growth before scaling." },
    ],
    chartSlices: [
      { name: "Invested", value: params.investment, fill: FILLS[0] },
      { name: "Gain", value: Math.max(0, gain), fill: FILLS[2] },
    ],
    compareRows: [
      { label: "ROI %", target: 30, actual: roiPct },
      { label: "Payback mo", target: 12, actual: Math.min(paybackMonths, 36) },
      { label: "Annual %", target: 25, actual: annualized },
    ],
    scenarios: [
      { label: "Downside (−20%)", months: params.months, monthly: params.investment + gain * 0.5 },
      { label: "Base case", months: params.months, monthly: params.returns },
      { label: "Upside (+20%)", months: params.months, monthly: params.returns + gain * 0.25 },
    ],
    projection: Array.from({ length: Math.min(params.months, 12) + 1 }, (_, i) => ({
      month: i,
      balance: Math.round(params.investment + (gain / params.months) * i),
    })),
    steps: ROI_DECISION_STEPS.map((text, i) => ({ step: i + 1, text })),
    milestones: [3, 6, 12].filter((m) => m <= params.months).map((m) => ({
      week: m,
      target: Math.round(params.investment + (gain / params.months) * m),
    })),
  };
}

export function businessCostOptimizerRich(params: {
  revenue: number;
  fixed: number;
  variable: number;
}): RichResult & { totalCost: number; costRatio: number; savingsPotential: number; marginAfterSave: number } | { error: string } {
  if (params.revenue <= 0) return { error: "Revenue must be positive." };

  const totalCost = params.fixed + params.variable;
  const costRatio = (totalCost / params.revenue) * 100;
  const variablePct = totalCost > 0 ? (params.variable / totalCost) * 100 : 0;
  const savingsPotential = Math.round(params.fixed * 0.08 + params.variable * 0.05);
  const marginAfterSave = ((params.revenue - totalCost + savingsPotential) / params.revenue) * 100;

  let healthScore = 75;
  if (costRatio > 85) healthScore -= 25;
  else if (costRatio > 70) healthScore -= 10;
  if (variablePct > 60) healthScore += 5;

  const rankedLevers = COST_LEVERS.map((l) => ({
    name: l.label,
    save: Math.round((l.id === "saas" ? params.fixed * 0.15 : params.fixed + params.variable) * l.typicalSave * (l.id === "automation" ? 0.5 : 1)),
    effort: l.typicalSave >= 0.1 ? "Medium" : "Low",
  })).sort((a, b) => b.save - a.save);

  return {
    totalCost,
    costRatio,
    savingsPotential,
    marginAfterSave,
    rankedLevers,
    healthScore,
    grade: gradeFromScore(healthScore),
    insights: [
      { priority: costRatio > 80 ? "high" : "medium", title: "Cost ratio", detail: `${costRatio.toFixed(0)}% of revenue — margin ${(100 - costRatio).toFixed(0)}% today, ${marginAfterSave.toFixed(0)}% after quick wins.` },
      { priority: "medium", title: "Fixed vs variable", detail: `${(100 - variablePct).toFixed(0)}% fixed · ${variablePct.toFixed(0)}% variable — high fixed slows downturn response.` },
      { priority: "high", title: "Top lever", detail: `${rankedLevers[0]?.name}: est. ₹${rankedLevers[0]?.save.toLocaleString("en-IN")} save (${rankedLevers[0]?.effort} effort).` },
      { priority: "low", title: "90-day plan", detail: `Target ₹${savingsPotential.toLocaleString("en-IN")} total savings in 3 phases below.` },
    ],
    chartSlices: [
      { name: "Fixed", value: params.fixed, fill: FILLS[0] },
      { name: "Variable", value: params.variable, fill: FILLS[1] },
      { name: "Margin", value: Math.max(0, params.revenue - totalCost), fill: FILLS[2] },
    ],
    compareRows: [
      { label: "Cost %", target: 65, actual: costRatio },
      { label: "Margin %", target: 35, actual: 100 - costRatio },
      { label: "Post-save", target: marginAfterSave, actual: marginAfterSave },
    ],
    phases: [
      { phase: "Audit (wk 1–2)", days: 14, focus: "Top 5 fixed contracts + SaaS stack" },
      { phase: "Renegotiate (wk 3–6)", days: 28, focus: "Vendor terms + subscription tiers" },
      { phase: "Automate (wk 7–12)", days: 42, focus: "Cut manual variable steps" },
    ],
    projection: [0, 1, 2, 3].map((m) => ({ month: m, balance: Math.round(totalCost - (savingsPotential * m) / 3) })),
    scenarios: [
      { label: "Current", months: 12, monthly: totalCost },
      { label: "Quick wins", months: 12, monthly: totalCost - savingsPotential },
      { label: "Full optimize", months: 12, monthly: totalCost - savingsPotential * 1.5 },
    ],
  };
}

export function pricingStrategyRich(params: {
  unitCost: number;
  targetMargin: number;
  competitorPrice: number;
  model: PricingModel;
  monthlyUnits?: number;
}): RichResult & { recommendedPrice: number; floorPrice: number; ceilingPrice: number; projectedRevenue: number } | { error: string } {
  if (params.unitCost <= 0) return { error: "Unit cost must be positive." };
  if (params.targetMargin < 0 || params.targetMargin >= 100) return { error: "Target margin must be 0–99%." };

  const costPlus = params.unitCost / (1 - params.targetMargin / 100);
  let recommended = costPlus;
  if (params.model === "competitive") recommended = (costPlus + params.competitorPrice) / 2;
  if (params.model === "value") recommended = Math.max(costPlus, params.competitorPrice * 1.1);

  const floorPrice = params.unitCost * 1.05;
  const ceilingPrice = params.competitorPrice > 0 ? params.competitorPrice * 1.15 : costPlus * 1.3;
  const units = params.monthlyUnits ?? 100;

  const tierPrices = [
    { tier: "Starter", mult: 0.85 },
    { tier: "Standard", mult: 1 },
    { tier: "Pro", mult: 1.25 },
  ];
  const pricingTiers = tierPrices.map((t) => {
    const price = Math.round(recommended * t.mult);
    const marginPct = ((price - params.unitCost) / price) * 100;
    return { tier: t.tier, price, marginPct: Math.round(marginPct) };
  });

  return {
    recommendedPrice: Math.round(recommended),
    floorPrice: Math.round(floorPrice),
    ceilingPrice: Math.round(ceilingPrice),
    projectedRevenue: Math.round(recommended * units),
    pricingTiers,
    healthScore: recommended >= floorPrice && recommended <= ceilingPrice ? 85 : 68,
    grade: params.model === "value" ? "Premium band" : params.model === "competitive" ? "Market fit" : "Cost-plus",
    insights: [
      { priority: "high", title: "Recommended price", detail: `₹${Math.round(recommended).toLocaleString("en-IN")}/unit (${params.model}) — ${params.targetMargin}% target margin.` },
      { priority: "medium", title: "Monthly revenue", detail: `At ${units} units/mo → ₹${Math.round(recommended * units).toLocaleString("en-IN")} gross revenue.` },
      { priority: "medium", title: "Guardrails", detail: `Floor ₹${Math.round(floorPrice).toLocaleString("en-IN")} · ceiling ₹${Math.round(ceilingPrice).toLocaleString("en-IN")}.` },
      { priority: "low", title: "Tier strategy", detail: "Starter pulls volume; Pro captures willingness-to-pay — see tier table below." },
    ],
    chartSlices: pricingTiers.map((t, i) => ({ name: t.tier, value: t.price, fill: FILLS[i] })),
    compareRows: [
      { label: "Cost", target: recommended, actual: params.unitCost },
      { label: "Target", target: recommended, actual: recommended },
      { label: "Competitor", target: recommended, actual: params.competitorPrice || recommended },
    ],
    scenarios: [
      { label: "Floor", months: 1, monthly: floorPrice * units },
      { label: "Target", months: 1, monthly: recommended * units },
      { label: "Ceiling", months: 1, monthly: ceilingPrice * units },
    ],
    steps: PRICING_TIPS.map((t, i) => ({ step: i + 1, text: t })),
    usageTips: PRICING_TIPS,
  };
}

export function adBudgetOptimizerRich(params: {
  revenue: number;
  adSpend: number;
  targetRoas: number;
  adAttributionPct?: number;
}): RichResult & { currentRoas: number; optimalSpend: number; incrementalRevenue: number; mer: number } | { error: string } {
  if (params.revenue <= 0) return { error: "Revenue must be positive." };
  if (params.adSpend < 0) return { error: "Ad spend cannot be negative." };
  if (params.targetRoas <= 0) return { error: "Target ROAS must be positive." };

  const attr = (params.adAttributionPct ?? 40) / 100;
  const adAttributed = params.revenue * attr;
  const currentRoas = params.adSpend > 0 ? adAttributed / params.adSpend : 0;
  const optimalSpend = adAttributed / params.targetRoas;
  const incrementalRevenue = Math.max(0, (optimalSpend - params.adSpend) * params.targetRoas);
  const mer = params.adSpend > 0 ? params.revenue / params.adSpend : 0;

  let healthScore = 70;
  if (currentRoas >= ROAS_BENCHMARKS.good) healthScore += 15;
  else if (currentRoas >= ROAS_BENCHMARKS.ok) healthScore += 5;
  else if (currentRoas < ROAS_BENCHMARKS.weak && params.adSpend > 0) healthScore -= 15;

  return {
    currentRoas,
    optimalSpend,
    incrementalRevenue,
    mer,
    healthScore: Math.max(0, Math.min(100, Math.round(healthScore))),
    grade: currentRoas >= ROAS_BENCHMARKS.good ? "Efficient" : currentRoas >= ROAS_BENCHMARKS.ok ? "OK" : "Optimize",
    insights: [
      { priority: currentRoas < params.targetRoas ? "high" : "medium", title: "ROAS gap", detail: `${attr * 100}% attributed · current ${currentRoas.toFixed(1)}x vs target ${params.targetRoas}x.` },
      { priority: "medium", title: "Budget shift", detail: optimalSpend > params.adSpend ? `Scale +₹${Math.round(optimalSpend - params.adSpend).toLocaleString("en-IN")} if CPA holds.` : `Trim ₹${Math.round(params.adSpend - optimalSpend).toLocaleString("en-IN")} to hit ROAS target.` },
      { priority: "medium", title: "MER", detail: `Marketing efficiency ratio ${mer.toFixed(2)}x (total revenue / ad spend).` },
      { priority: "low", title: "Scale playbook", detail: AD_SCALE_STEPS[0] },
    ],
    chartSlices: [
      { name: "Ad spend", value: params.adSpend, fill: FILLS[0] },
      { name: "Optimal", value: Math.round(optimalSpend), fill: FILLS[1] },
      { name: "Attrib rev", value: adAttributed, fill: FILLS[2] },
    ],
    compareRows: [
      { label: "ROAS", target: params.targetRoas, actual: currentRoas },
      { label: "Spend", target: optimalSpend, actual: params.adSpend },
      { label: "MER", target: 5, actual: mer },
    ],
    projection: [0, 1, 2, 3].map((m) => ({ month: m, balance: Math.round(params.adSpend + ((optimalSpend - params.adSpend) * m) / 3) })),
    milestones: [1, 2, 3].map((m) => ({ week: m, target: Math.round(params.adSpend * (1 + m * 0.1)) })),
    steps: AD_SCALE_STEPS.map((t, i) => ({ step: i + 1, text: t })),
    scenarios: [
      { label: "Cut 20%", months: 3, monthly: params.adSpend * 0.8 },
      { label: "Optimal", months: 3, monthly: optimalSpend },
      { label: "Scale +15%", months: 3, monthly: optimalSpend * 1.15 },
    ],
  };
}

export function roiPredictorAdsRich(params: {
  adSpend: number;
  adRevenue: number;
  months: number;
}): RichResult & { roas: number; roiPct: number; profit: number; monthlyProfit: number } | { error: string } {
  if (params.adSpend <= 0) return { error: "Ad spend must be positive." };
  if (params.months <= 0) return { error: "Period must be positive." };

  const roas = params.adRevenue / params.adSpend;
  const profit = params.adRevenue - params.adSpend;
  const roiPct = (profit / params.adSpend) * 100;
  const monthlyProfit = profit / params.months;

  return {
    roas,
    roiPct,
    profit,
    monthlyProfit,
    healthScore: Math.min(95, Math.round(40 + roas * 12)),
    grade: roas >= 4 ? "Strong" : roas >= 2.5 ? "Profitable" : roas >= 1 ? "Break-even" : "Loss",
    insights: [
      { priority: roas < 2 ? "high" : "medium", title: "Ad ROI", detail: `${roiPct.toFixed(0)}% ROI · ${roas.toFixed(2)}x ROAS · ₹${Math.round(profit).toLocaleString("en-IN")} profit (${params.months} mo).` },
      { priority: "medium", title: "Run-rate", detail: `~₹${Math.round(monthlyProfit).toLocaleString("en-IN")}/mo profit at current efficiency.` },
      { priority: roas >= ROAS_BENCHMARKS.good ? "low" : "high", title: "Scale rule", detail: roas >= ROAS_BENCHMARKS.good ? "Safe to scale 15–20% if CPA stable 2 weeks." : "Fix creative + landing page before increasing budget." },
      { priority: "low", title: "Attribution", detail: "Blend last-click with blended ROAS for full-funnel view." },
    ],
    chartSlices: [
      { name: "Ad spend", value: params.adSpend, fill: FILLS[0] },
      { name: "Revenue", value: params.adRevenue, fill: FILLS[1] },
      { name: "Profit", value: Math.max(0, profit), fill: FILLS[2] },
    ],
    compareRows: [
      { label: "ROAS", target: ROAS_BENCHMARKS.good, actual: roas },
      { label: "ROI %", target: 100, actual: roiPct },
      { label: "Mo profit", target: monthlyProfit * 1.2, actual: monthlyProfit },
    ],
    milestones: Array.from({ length: Math.min(params.months, 6) }, (_, i) => ({
      week: i + 1,
      target: Math.round((params.adRevenue / params.months) * (i + 1)),
    })),
    projection: Array.from({ length: params.months + 1 }, (_, i) => ({
      month: i,
      balance: Math.round(params.adSpend + monthlyProfit * i),
    })),
    scenarios: [
      { label: "Weak (−15%)", months: params.months, monthly: params.adRevenue * 0.85 },
      { label: "Current", months: params.months, monthly: params.adRevenue },
      { label: "Optimized (+15%)", months: params.months, monthly: params.adRevenue * 1.15 },
    ],
    steps: AD_SCALE_STEPS.map((t, i) => ({ step: i + 1, text: t })),
  };
}

export function campaignPerformanceRich(params: {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ltv?: number;
}): RichResult & { ctr: number; cpc: number; cpa: number; cvr: number; roasProxy: number } | { error: string } {
  if (params.impressions <= 0) return { error: "Impressions must be positive." };
  if (params.spend < 0) return { error: "Spend cannot be negative." };

  const ctr = (params.clicks / params.impressions) * 100;
  const cpc = params.clicks > 0 ? params.spend / params.clicks : 0;
  const cpa = params.conversions > 0 ? params.spend / params.conversions : 0;
  const cvr = params.clicks > 0 ? (params.conversions / params.clicks) * 100 : 0;
  const ltv = params.ltv ?? 2000;
  const roasProxy = params.spend > 0 ? (params.conversions * ltv) / params.spend : 0;
  const ltvCpaRatio = cpa > 0 ? ltv / cpa : 0;

  let healthScore = 65;
  if (ctr >= FUNNEL_BENCHMARKS.ctr) healthScore += 10;
  if (cvr >= FUNNEL_BENCHMARKS.cvr) healthScore += 10;
  if (ltvCpaRatio >= 3) healthScore += 15;
  else if (ltvCpaRatio >= 1) healthScore += 5;

  const funnelSteps = [
    { stage: "Impressions", count: params.impressions, rate: "100%" },
    { stage: "Clicks", count: params.clicks, rate: `${ctr.toFixed(2)}% CTR` },
    { stage: "Conversions", count: params.conversions, rate: `${cvr.toFixed(1)}% CVR` },
  ];

  return {
    ctr,
    cpc,
    cpa,
    cvr,
    roasProxy,
    healthScore: Math.min(100, healthScore),
    grade: ltvCpaRatio >= 3 ? "Scalable" : ltvCpaRatio >= 1 ? "Break-even" : "Fix funnel",
    funnelSteps,
    insights: [
      { priority: ctr < FUNNEL_BENCHMARKS.ctr ? "high" : "medium", title: "Top of funnel", detail: `${ctr.toFixed(2)}% CTR (bench ${FUNNEL_BENCHMARKS.ctr}%) · ₹${cpc.toFixed(0)} CPC.` },
      { priority: cvr < FUNNEL_BENCHMARKS.cvr ? "high" : "medium", title: "Conversion", detail: `${cvr.toFixed(1)}% CVR · CPA ₹${Math.round(cpa).toLocaleString("en-IN")} vs LTV ₹${ltv.toLocaleString("en-IN")} (${ltvCpaRatio.toFixed(1)}x).` },
      { priority: ltvCpaRatio < 3 ? "high" : "low", title: "Unit economics", detail: ltvCpaRatio >= 3 ? "LTV/CPA healthy — room to scale spend." : "CPA too high for LTV — fix offer or audience before scaling." },
      { priority: "low", title: "ROAS proxy", detail: `Estimated ${roasProxy.toFixed(1)}x ROAS at assumed LTV.` },
    ],
    chartSlices: [
      { name: "Clicks", value: params.clicks, fill: FILLS[0] },
      { name: "Conversions", value: params.conversions * 50, fill: FILLS[2] },
      { name: "Spend (k)", value: params.spend / 1000, fill: FILLS[1] },
    ],
    compareRows: [
      { label: "CTR %", target: FUNNEL_BENCHMARKS.ctr, actual: ctr },
      { label: "CVR %", target: FUNNEL_BENCHMARKS.cvr, actual: cvr },
      { label: "LTV/CPA", target: 3, actual: ltvCpaRatio || 0 },
    ],
    rankedItems: [
      { name: "Awareness", score: Math.round(ctr * 10), status: ctr >= FUNNEL_BENCHMARKS.ctr ? "Strong" : "Weak" },
      { name: "Conversion", score: Math.round(cvr * 10), status: cvr >= FUNNEL_BENCHMARKS.cvr ? "Strong" : "Weak" },
      { name: "Economics", score: Math.round(Math.min(100, ltvCpaRatio * 25)), status: ltvCpaRatio >= 3 ? "Scale" : "Fix" },
    ],
    steps: [
      { step: 1, text: ctr < FUNNEL_BENCHMARKS.ctr ? "Test 3 new ad hooks to lift CTR." : "Maintain creative refresh cadence." },
      { step: 2, text: cvr < FUNNEL_BENCHMARKS.cvr ? "A/B landing page headline + single CTA." : "Optimize post-click flow for upsell." },
      { step: 3, text: "Compare CPA to LTV weekly; pause ad sets below 1x LTV/CPA." },
    ],
    projection: [0, 1, 2, 4].map((w) => ({ month: w, balance: Math.round(params.conversions * (1 + w * 0.05) * ltv - params.spend) })),
  };
}

export function workloadPlannerRich(params: {
  hoursAvailable: number;
  tasks: { name: string; hours: number }[];
}): RichResult & { totalHours: number; utilization: number; bufferHours: number } | { error: string } {
  const tasks = params.tasks.filter((t) => t.name.trim() && t.hours > 0);
  if (!tasks.length) return { error: "Add at least one task with hours." };
  if (params.hoursAvailable <= 0) return { error: "Available hours must be positive." };

  const totalHours = tasks.reduce((s, t) => s + t.hours, 0);
  const bufferHours = Math.max(0, params.hoursAvailable * 0.15);
  const effectiveCapacity = params.hoursAvailable - bufferHours;
  const utilization = (totalHours / params.hoursAvailable) * 100;
  if (totalHours > params.hoursAvailable * 1.05) return { error: `Over capacity by ${(totalHours - params.hoursAvailable).toFixed(1)}h — defer lowest-priority task.` };

  const sorted = [...tasks].sort((a, b) => b.hours - a.hours);
  let block = 9;
  const schedule = sorted.map((t) => {
    const start = block;
    block += t.hours;
    return { time: `${String(Math.floor(start)).padStart(2, "0")}:00`, activity: `${t.name} (${t.hours}h)` };
  });
  schedule.push({ time: `${String(Math.floor(block)).padStart(2, "0")}:00`, activity: `Buffer · ${bufferHours.toFixed(1)}h flex` });

  return {
    totalHours,
    utilization,
    bufferHours,
    healthScore: utilization <= 85 ? 88 : utilization <= 100 ? 72 : 50,
    grade: utilization <= 80 ? "Balanced" : utilization <= 95 ? "Full" : "Tight",
    schedule,
    insights: [
      { priority: utilization > 90 ? "high" : "medium", title: "Utilization", detail: `${totalHours}h of ${params.hoursAvailable}h (${utilization.toFixed(0)}%) — ${bufferHours.toFixed(1)}h buffer reserved.` },
      { priority: "high", title: "Big rock", detail: `${sorted[0]?.name} (${sorted[0]?.hours}h) — block first in peak focus window.` },
      { priority: "medium", title: "Capacity", detail: `Effective capacity ${effectiveCapacity.toFixed(1)}h after 15% buffer.` },
      { priority: "low", title: "Weekly rhythm", detail: WORKLOAD_TIPS[2] },
    ],
    chartSlices: tasks.map((t, i) => ({ name: t.name.slice(0, 10), value: t.hours, fill: FILLS[i % FILLS.length] })),
    compareRows: tasks.map((t) => ({ label: t.name.slice(0, 8), target: effectiveCapacity / tasks.length, actual: t.hours })),
    phases: [
      { phase: "Morning", days: 1, focus: sorted[0]?.name ?? "Deep work" },
      { phase: "Midday", days: 1, focus: sorted[1]?.name ?? "Collaboration" },
      { phase: "Afternoon", days: 1, focus: sorted.slice(2).map((t) => t.name).join(", ") || "Admin" },
    ],
    usageTips: WORKLOAD_TIPS,
    milestones: [1, 2, 3, 4].map((d) => ({ week: d, target: Math.round((totalHours / tasks.length) * Math.min(d, tasks.length)) })),
  };
}

export function taskPrioritizerRich(params: {
  tasks: { name: string; urgency: number; importance: number }[];
}): RichResult & { topTask: string; doFirstCount: number } | { error: string } {
  const tasks = params.tasks.filter((t) => t.name.trim());
  if (!tasks.length) return { error: "Add at least one task." };

  const scored = tasks
    .map((t) => ({
      ...t,
      score: t.urgency * 0.55 + t.importance * 0.45,
      quadrant: t.urgency >= 7 && t.importance >= 7 ? "Do first" : t.importance >= 7 ? "Schedule" : t.urgency >= 7 ? "Delegate" : "Defer",
    }))
    .sort((a, b) => b.score - a.score);

  const quadrants = ["Do first", "Schedule", "Delegate", "Defer"].map((q) => ({
    quadrant: q,
    tasks: scored.filter((t) => t.quadrant === q).map((t) => t.name),
  }));

  const doFirstCount = scored.filter((t) => t.quadrant === "Do first").length;

  return {
    topTask: scored[0].name,
    doFirstCount,
    quadrants,
    healthScore: scored[0].score >= 7 ? 90 : 70,
    grade: doFirstCount > 2 ? "Crowded" : "Prioritized",
    rankedItems: scored.map((t) => ({ name: t.name, score: Math.round(t.score * 10), status: t.quadrant })),
    schedule: scored.slice(0, 4).map((t, i) => ({
      time: `Slot ${i + 1}`,
      activity: `${t.name} · ${t.quadrant} (${t.score.toFixed(1)}/10)`,
    })),
    insights: [
      { priority: "high", title: "Top priority", detail: `${scored[0].name} (${scored[0].quadrant}) — score ${scored[0].score.toFixed(1)}/10.` },
      { priority: doFirstCount > 2 ? "high" : "medium", title: "Matrix load", detail: `${doFirstCount} do-first · ${scored.filter((t) => t.quadrant === "Defer").length} defer — ${doFirstCount > 2 ? "too many urgent; delegate or reschedule." : "balanced queue."}` },
      { priority: "medium", title: "Execution", detail: "Complete slot 1 before opening slot 2 — no multitasking on do-first items." },
      { priority: "low", title: "Focus", detail: WORKLOAD_TIPS[1] },
    ],
    chartSlices: scored.slice(0, 4).map((t, i) => ({ name: t.name.slice(0, 10), value: t.score, fill: FILLS[i] })),
    compareRows: scored.slice(0, 3).map((t) => ({ label: t.name.slice(0, 8), target: 8, actual: t.score })),
    steps: scored.slice(0, 3).map((t, i) => ({ step: i + 1, text: `${t.quadrant}: ${t.name}` })),
  };
}

export function meetingTimeOptimizerRich(params: {
  meetingsPerWeek: number;
  avgDurationMin: number;
  focusHoursPerDay: number;
  teamSize: number;
  hourlyRate?: number;
}): RichResult & { meetingHoursWeek: number; focusPct: number; costEstimate: number; annualCost: number; targetMeetings: number } | { error: string } {
  if (params.meetingsPerWeek < 0) return { error: "Meetings cannot be negative." };
  if (params.avgDurationMin <= 0) return { error: "Meeting duration must be positive." };

  const rate = params.hourlyRate ?? 800;
  const meetingHoursWeek = (params.meetingsPerWeek * params.avgDurationMin) / 60;
  const workHoursWeek = params.focusHoursPerDay * 5;
  const focusPct = Math.max(0, ((workHoursWeek - meetingHoursWeek) / workHoursWeek) * 100);
  const costEstimate = meetingHoursWeek * params.teamSize * rate;
  const annualCost = costEstimate * 52;
  const targetMeetings = Math.max(4, Math.round(params.meetingsPerWeek * 0.7));

  let healthScore = 80;
  if (focusPct < 50) healthScore -= 25;
  else if (focusPct < 65) healthScore -= 10;
  if (params.meetingsPerWeek > 15) healthScore -= 10;

  return {
    meetingHoursWeek,
    focusPct,
    costEstimate,
    annualCost,
    targetMeetings,
    healthScore: Math.max(0, Math.min(100, healthScore)),
    grade: focusPct >= 70 ? "Healthy" : focusPct >= 55 ? "Meeting-heavy" : "Overload",
    insights: [
      { priority: focusPct < 60 ? "high" : "medium", title: "Meeting load", detail: `${meetingHoursWeek.toFixed(1)}h/wk in meetings · ${focusPct.toFixed(0)}% focus time remaining.` },
      { priority: "high", title: "Hidden cost", detail: `~₹${Math.round(costEstimate).toLocaleString("en-IN")}/wk · ₹${Math.round(annualCost).toLocaleString("en-IN")}/yr (${params.teamSize} × ₹${rate}/h).` },
      { priority: "medium", title: "Reduction target", detail: `Cut to ~${targetMeetings} meetings/wk (−30%) to recover ${((params.meetingsPerWeek - targetMeetings) * params.avgDurationMin / 60).toFixed(1)}h focus.` },
      { priority: "low", title: "Quick win", detail: MEETING_TIPS[1] },
    ],
    compareRows: [
      { label: "Focus %", target: 70, actual: focusPct },
      { label: "Meet hrs", target: 8, actual: meetingHoursWeek },
      { label: "Meetings", target: 10, actual: params.meetingsPerWeek },
    ],
    steps: MEETING_TIPS.map((t, i) => ({ step: i + 1, text: t })),
    usageTips: MEETING_TIPS,
    projection: [0, 4, 8, 12].map((w) => ({
      month: w,
      balance: Math.round(meetingHoursWeek * Math.max(0.5, 1 - w * 0.025)),
    })),
    scenarios: [
      { label: "Current", months: 52, monthly: costEstimate },
      { label: "−30% meetings", months: 52, monthly: costEstimate * 0.7 },
      { label: "−50% + 25min", months: 52, monthly: costEstimate * 0.45 },
    ],
    milestones: [4, 8, 12].map((w) => ({ week: w, target: Math.round(meetingHoursWeek * (1 - w * 0.025)) })),
  };
}
