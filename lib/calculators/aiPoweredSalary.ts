import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import type { AiInsight } from "./aiFinanceSmartRich";
import { salaryBenchmark } from "./hrEmployerTools";

export type AiSalaryCurrencyCode = LoanCurrencyCode;

export type LocationTier = "metro" | "tier1" | "tier2" | "tier3";

export const AI_SALARY_URL = {
  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  H: "h",
  L: "l",
  M: "m",
  P: "p",
  R: "r",
  S: "s",
  T: "t",
  W: "w",
  Y: "y",
} as const;

export const LOCATION_TIERS: { id: LocationTier; label: string; multiplier: number }[] = [
  { id: "metro", label: "Metro (Mumbai, Delhi, Bengaluru)", multiplier: 1.15 },
  { id: "tier1", label: "Tier 1 city", multiplier: 1.0 },
  { id: "tier2", label: "Tier 2 city", multiplier: 0.85 },
  { id: "tier3", label: "Tier 3 / smaller city", multiplier: 0.72 },
];

function locationMultiplier(tier: LocationTier): number {
  return LOCATION_TIERS.find((t) => t.id === tier)?.multiplier ?? 1;
}

function experienceMultiplier(years: number): number {
  const capped = Math.max(0, Math.min(years, 25));
  return 1 + capped * 0.055 + Math.max(0, capped - 10) * 0.02;
}

function skillsMultiplier(score: number): number {
  const clamped = Math.max(1, Math.min(score, 10));
  return 0.88 + ((clamped - 1) / 9) * 0.32;
}

function gradeFromScore(score: number): string {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 55) return "Fair";
  return "Needs attention";
}

function offerGrade(score: number): string {
  if (score >= 85) return "Strong offer";
  if (score >= 70) return "Competitive";
  if (score >= 55) return "Acceptable";
  return "Below market";
}

export function formatAiSalaryMoney(amount: number, currency: AiSalaryCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseAiPoweredSalarySearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(AI_SALARY_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function aiSalaryEstimate(params: {
  baseMarketAnnual: number;
  yearsExperience: number;
  locationTier: LocationTier;
  skillsScore: number;
}): {
  estimatedAnnual: number;
  rangeLow: number;
  rangeHigh: number;
  experienceMultiplier: number;
  locationMultiplier: number;
  skillsMultiplier: number;
  confidenceScore: number;
  grade: string;
  insights: AiInsight[];
} | { error: string } {
  if (params.baseMarketAnnual <= 0) return { error: "Base market salary must be positive." };
  if (params.yearsExperience < 0) return { error: "Years of experience cannot be negative." };

  const expMult = experienceMultiplier(params.yearsExperience);
  const locMult = locationMultiplier(params.locationTier);
  const skillMult = skillsMultiplier(params.skillsScore);
  const estimatedAnnual = params.baseMarketAnnual * expMult * locMult * skillMult;
  const rangeLow = estimatedAnnual * 0.9;
  const rangeHigh = estimatedAnnual * 1.12;

  const confidenceScore = Math.min(
    95,
    55 +
      Math.min(params.yearsExperience, 10) * 2 +
      (params.skillsScore >= 7 ? 10 : params.skillsScore >= 5 ? 5 : 0) +
      (params.locationTier === "metro" || params.locationTier === "tier1" ? 5 : 0),
  );

  const insights: AiInsight[] = [];
  if (params.skillsScore >= 8) {
    insights.push({
      priority: "low",
      title: "High-demand skills premium",
      detail: "Your skills score adds meaningful upside—highlight certifications and project outcomes in negotiations.",
    });
  } else if (params.skillsScore <= 4) {
    insights.push({
      priority: "medium",
      title: "Upskill to widen range",
      detail: "Target in-demand skills for your role to move toward the upper end of the estimated band.",
    });
  }
  if (params.yearsExperience < 3) {
    insights.push({
      priority: "medium",
      title: "Early-career band",
      detail: "Estimates vary more for junior roles—cross-check with peers and recent offer data for your city.",
    });
  }
  if (locMult < 1) {
    insights.push({
      priority: "low",
      title: "Location adjustment applied",
      detail: `Non-metro tiers typically pay ${Math.round((1 - locMult) * 100)}% below major hubs for the same role.`,
    });
  }

  return {
    estimatedAnnual,
    rangeLow,
    rangeHigh,
    experienceMultiplier: expMult,
    locationMultiplier: locMult,
    skillsMultiplier: skillMult,
    confidenceScore,
    grade: gradeFromScore(confidenceScore),
    insights,
  };
}

export function aiOfferAnalyze(params: {
  offerAnnual: number;
  marketMedianAnnual: number;
  bonusPercent: number;
  benefitsPercent: number;
}): {
  totalCompAnnual: number;
  marketMedianAnnual: number;
  vsMarketPercent: number;
  offerScore: number;
  grade: string;
  verdict: "strong" | "competitive" | "weak";
  insights: AiInsight[];
} | { error: string } {
  const bench = salaryBenchmark({
    offerAnnual: params.offerAnnual * (1 + params.bonusPercent / 100 + params.benefitsPercent / 100),
    marketMedianAnnual: params.marketMedianAnnual,
  });
  if ("error" in bench) return bench;

  const totalCompAnnual =
    params.offerAnnual * (1 + params.bonusPercent / 100) + params.offerAnnual * (params.benefitsPercent / 100);
  const vsMarketPercent = bench.differencePercent;

  let offerScore = 50 + vsMarketPercent * 1.5;
  if (params.bonusPercent >= 10) offerScore += 5;
  if (params.benefitsPercent >= 15) offerScore += 5;
  offerScore = Math.max(0, Math.min(100, offerScore));

  let verdict: "strong" | "competitive" | "weak" = "competitive";
  if (offerScore >= 75) verdict = "strong";
  else if (offerScore < 55) verdict = "weak";

  const insights: AiInsight[] = [];
  if (verdict === "weak") {
    insights.push({
      priority: "high",
      title: "Negotiate before accepting",
      detail: "Total compensation trails market—ask for base, signing bonus, or equity to close the gap.",
    });
  } else if (verdict === "strong") {
    insights.push({
      priority: "low",
      title: "Above-market package",
      detail: "Confirm growth path and variable pay clarity before finalizing.",
    });
  }
  if (params.benefitsPercent < 10) {
    insights.push({
      priority: "medium",
      title: "Benefits may be thin",
      detail: "Factor health insurance, PF match, and leave policy—low benefits % can hide a weaker package.",
    });
  }

  return {
    totalCompAnnual,
    marketMedianAnnual: params.marketMedianAnnual,
    vsMarketPercent,
    offerScore,
    grade: offerGrade(offerScore),
    verdict,
    insights,
  };
}

export function aiSalaryNegotiation(params: {
  currentOfferAnnual: number;
  marketMedianAnnual: number;
  walkAwayAnnual: number;
}): {
  recommendedAskAnnual: number;
  likelyCounterLow: number;
  likelyCounterHigh: number;
  gapToMarket: number;
  negotiationScore: number;
  grade: string;
  insights: AiInsight[];
} | { error: string } {
  if (params.walkAwayAnnual > params.currentOfferAnnual * 1.5) {
    return { error: "Walk-away minimum seems high relative to current offer—check inputs." };
  }
  if (params.marketMedianAnnual <= 0) return { error: "Market median must be positive." };

  const gapToMarket = params.marketMedianAnnual - params.currentOfferAnnual;
  const targetFromMarket = params.marketMedianAnnual * 1.05;
  const targetFromOffer = params.currentOfferAnnual * 1.12;
  const recommendedAskAnnual = Math.max(
    params.walkAwayAnnual,
    Math.min(targetFromMarket, Math.max(targetFromOffer, params.walkAwayAnnual)),
  );
  const likelyCounterLow = params.currentOfferAnnual + gapToMarket * 0.35;
  const likelyCounterHigh = Math.min(recommendedAskAnnual, params.marketMedianAnnual * 1.08);

  const room = recommendedAskAnnual - params.currentOfferAnnual;
  const negotiationScore = Math.min(
    95,
    45 + (room / params.currentOfferAnnual) * 100 + (gapToMarket > 0 ? 15 : 0),
  );

  const insights: AiInsight[] = [
    {
      priority: gapToMarket > params.currentOfferAnnual * 0.1 ? "high" : "medium",
      title: "Anchor with market data",
      detail: `Lead with median benchmarks (${gapToMarket > 0 ? "you are below market" : "you are at or above market"}).`,
    },
    {
      priority: "medium",
      title: "Counter range",
      detail: `Expect employer counter between your ask and current offer—set walk-away at ${params.walkAwayAnnual > 0 ? "your minimum" : "a defined floor"}.`,
    },
  ];
  if (recommendedAskAnnual <= params.currentOfferAnnual) {
    insights.push({
      priority: "low",
      title: "Limited upside",
      detail: "Current offer is already near market—negotiate benefits, bonus, or role scope instead of base.",
    });
  }

  return {
    recommendedAskAnnual,
    likelyCounterLow: Math.max(params.currentOfferAnnual, likelyCounterLow),
    likelyCounterHigh: Math.max(likelyCounterLow, likelyCounterHigh),
    gapToMarket,
    negotiationScore,
    grade: gradeFromScore(negotiationScore),
    insights,
  };
}

export function aiCareerGrowthPredict(params: {
  currentAnnual: number;
  annualRaisePercent: number;
  yearsToProject: number;
  promotionBumpPercent?: number;
  promotionEveryYears?: number;
}): {
  projections: { year: number; salary: number }[];
  endingSalary: number;
  totalEarnings: number;
  growthScore: number;
  grade: string;
  insights: AiInsight[];
} | { error: string } {
  if (params.currentAnnual <= 0) return { error: "Current salary must be positive." };
  if (params.yearsToProject <= 0) return { error: "Projection years must be positive." };

  const promoEvery = params.promotionEveryYears ?? 4;
  const promoBump = params.promotionBumpPercent ?? 12;
  const raiseRate = params.annualRaisePercent / 100;

  const projections: { year: number; salary: number }[] = [];
  let salary = params.currentAnnual;
  let totalEarnings = 0;

  for (let y = 1; y <= params.yearsToProject; y += 1) {
    salary *= 1 + raiseRate;
    if (promoEvery > 0 && y % promoEvery === 0) {
      salary *= 1 + promoBump / 100;
    }
    projections.push({ year: y, salary });
    totalEarnings += salary;
  }

  const endingSalary = projections[projections.length - 1]?.salary ?? params.currentAnnual;
  const cagr =
    params.yearsToProject > 0
      ? (Math.pow(endingSalary / params.currentAnnual, 1 / params.yearsToProject) - 1) * 100
      : 0;
  const growthScore = Math.min(95, 40 + cagr * 8 + (params.annualRaisePercent >= 8 ? 10 : 0));

  const insights: AiInsight[] = [];
  if (params.annualRaisePercent < 6) {
    insights.push({
      priority: "high",
      title: "Below typical hike band",
      detail: "Many tech roles see 8–12% annual bumps—job switches often accelerate growth beyond stay-put raises.",
    });
  }
  if (promoEvery > 0 && params.yearsToProject >= promoEvery) {
    insights.push({
      priority: "medium",
      title: "Promotion cycles modeled",
      detail: `A ~${promoBump}% promotion bump every ${promoEvery} years is included—adjust if your ladder differs.`,
    });
  }

  return {
    projections,
    endingSalary,
    totalEarnings,
    growthScore,
    grade: gradeFromScore(growthScore),
    insights,
  };
}

export function aiIncomePlan(params: {
  currentAnnual: number;
  targetAnnual: number;
  yearsHorizon: number;
  annualRaisePercent: number;
  sideIncomeMonthly: number;
}): {
  projectedAnnualAtHorizon: number;
  gapAtHorizon: number;
  yearsToTarget: number | null;
  monthlyGapToday: number;
  planScore: number;
  grade: string;
  insights: AiInsight[];
} | { error: string } {
  if (params.currentAnnual <= 0) return { error: "Current income must be positive." };
  if (params.targetAnnual <= 0) return { error: "Target income must be positive." };
  if (params.yearsHorizon <= 0) return { error: "Planning horizon must be positive." };

  const sideAnnual = params.sideIncomeMonthly * 12;
  const raiseRate = params.annualRaisePercent / 100;

  let salary = params.currentAnnual;
  let yearsToTarget: number | null = null;
  for (let y = 1; y <= 30; y += 1) {
    salary = salary * (1 + raiseRate) + sideAnnual;
    if (yearsToTarget === null && salary >= params.targetAnnual) {
      yearsToTarget = y;
    }
  }

  let projected = params.currentAnnual;
  for (let y = 0; y < params.yearsHorizon; y += 1) {
    projected = projected * (1 + raiseRate) + sideAnnual;
  }

  const gapAtHorizon = params.targetAnnual - projected;
  const monthlyGapToday = Math.max(0, (params.targetAnnual - params.currentAnnual - sideAnnual) / 12);

  let planScore = 70;
  if (yearsToTarget !== null && yearsToTarget <= params.yearsHorizon) planScore += 20;
  else if (gapAtHorizon > 0) planScore -= Math.min(30, (gapAtHorizon / params.targetAnnual) * 40);
  if (params.sideIncomeMonthly > 0) planScore += 5;
  planScore = Math.max(0, Math.min(100, planScore));

  const insights: AiInsight[] = [];
  if (yearsToTarget === null) {
    insights.push({
      priority: "high",
      title: "Target not reached in 30 years",
      detail: "Raise assumptions or side income may be too low—increase skills, switch roles, or extend side revenue.",
    });
  } else if (yearsToTarget > params.yearsHorizon) {
    insights.push({
      priority: "medium",
      title: "Horizon too short",
      detail: `At current assumptions you hit target in ~${yearsToTarget} years—extend horizon or boost growth levers.`,
    });
  } else {
    insights.push({
      priority: "low",
      title: "On track",
      detail: `Projected to reach target in ~${yearsToTarget} years with stated raise and side income.`,
    });
  }

  return {
    projectedAnnualAtHorizon: projected,
    gapAtHorizon,
    yearsToTarget,
    monthlyGapToday,
    planScore,
    grade: gradeFromScore(planScore),
    insights,
  };
}
