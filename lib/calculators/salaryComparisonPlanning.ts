import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";
import { costOfLivingAdjustedSalary } from "./internationalSalary";
import { annualFromMonthly, monthlyFromAnnual } from "./salaryCore";

export type PlanningCurrencyCode = LoanCurrencyCode;

export const SALARY_PLANNING_URL = {
  A: "a",
  B: "b",
  P: "p",
  Y: "y",
  C: "c",
  X: "x",
  T: "t",
  M: "m",
} as const;

export function formatPlanningMoney(amount: number, currency: PlanningCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseSalaryPlanningSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(SALARY_PLANNING_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function salaryComparison(params: {
  salaryA: number;
  salaryB: number;
}): {
  salaryA: number;
  salaryB: number;
  difference: number;
  percentDifference: number;
  higher: "A" | "B" | "equal";
} {
  const difference = params.salaryB - params.salaryA;
  const percentDifference = params.salaryA > 0 ? (difference / params.salaryA) * 100 : 0;
  const higher = difference > 0 ? "B" : difference < 0 ? "A" : "equal";
  return { salaryA: params.salaryA, salaryB: params.salaryB, difference, percentDifference, higher };
}

export function offerComparison(params: {
  offerA: number;
  offerB: number;
  bonusAPercent: number;
  bonusBPercent: number;
  colA?: number;
  colB?: number;
}): {
  offerA: number;
  offerB: number;
  totalA: number;
  totalB: number;
  adjustedB: number | null;
  difference: number;
  adjustedDifference: number | null;
  betterOffer: "A" | "B" | "equal";
} {
  const totalA = params.offerA * (1 + params.bonusAPercent / 100);
  const totalB = params.offerB * (1 + params.bonusBPercent / 100);
  let adjustedB: number | null = null;
  let adjustedDifference: number | null = null;
  if (params.colA && params.colB && params.colA > 0 && params.colB > 0) {
    const adj = costOfLivingAdjustedSalary({
      salary: totalB,
      fromColIndex: params.colB,
      toColIndex: params.colA,
    });
    if (!("error" in adj)) {
      adjustedB = adj.adjustedSalary;
      adjustedDifference = adjustedB - totalA;
    }
  }
  const compareB = adjustedB ?? totalB;
  const difference = totalB - totalA;
  const betterOffer = compareB > totalA ? "B" : compareB < totalA ? "A" : "equal";
  return {
    offerA: params.offerA,
    offerB: params.offerB,
    totalA,
    totalB,
    adjustedB,
    difference,
    adjustedDifference,
    betterOffer,
  };
}

export function costOfLivingComparison(params: {
  salaryA: number;
  colA: number;
  salaryB: number;
  colB: number;
}): {
  salaryA: number;
  salaryB: number;
  colA: number;
  colB: number;
  equivalentBInA: number;
  equivalentAInB: number;
  purchasingPowerDiff: number;
  betterInPP: "A" | "B" | "equal";
} | { error: string } {
  if (params.colA <= 0 || params.colB <= 0) return { error: "Cost-of-living indices must be positive." };
  const equivalentBInA = params.salaryB * (params.colA / params.colB);
  const equivalentAInB = params.salaryA * (params.colB / params.colA);
  const purchasingPowerDiff = equivalentBInA - params.salaryA;
  const betterInPP = purchasingPowerDiff > 0 ? "B" : purchasingPowerDiff < 0 ? "A" : "equal";
  return {
    salaryA: params.salaryA,
    salaryB: params.salaryB,
    colA: params.colA,
    colB: params.colB,
    equivalentBInA,
    equivalentAInB,
    purchasingPowerDiff,
    betterInPP,
  };
}

export function salaryGrowth(params: {
  currentSalary: number;
  annualGrowthPercent: number;
  years: number;
}): {
  currentSalary: number;
  annualGrowthPercent: number;
  years: number;
  finalSalary: number;
  totalGrowth: number;
  growthPercent: number;
  yearlyProjection: { year: number; salary: number }[];
} {
  const yearlyProjection: { year: number; salary: number }[] = [];
  let salary = params.currentSalary;
  yearlyProjection.push({ year: 0, salary });
  for (let y = 1; y <= params.years; y += 1) {
    salary *= 1 + params.annualGrowthPercent / 100;
    yearlyProjection.push({ year: y, salary });
  }
  const finalSalary = salary;
  const totalGrowth = finalSalary - params.currentSalary;
  const growthPercent = params.currentSalary > 0 ? (totalGrowth / params.currentSalary) * 100 : 0;
  return {
    currentSalary: params.currentSalary,
    annualGrowthPercent: params.annualGrowthPercent,
    years: params.years,
    finalSalary,
    totalGrowth,
    growthPercent,
    yearlyProjection,
  };
}

export function promotionSalary(params: {
  currentSalary: number;
  increasePercent: number;
}): {
  currentSalary: number;
  increasePercent: number;
  increaseAmount: number;
  newSalary: number;
} {
  const increaseAmount = params.currentSalary * (params.increasePercent / 100);
  return {
    currentSalary: params.currentSalary,
    increasePercent: params.increasePercent,
    increaseAmount,
    newSalary: params.currentSalary + increaseAmount,
  };
}

export function incrementSalary(params: {
  currentSalary: number;
  incrementPercent: number;
}): {
  currentSalary: number;
  incrementPercent: number;
  incrementAmount: number;
  newSalary: number;
  monthlyIncrement: number;
} {
  const result = promotionSalary({
    currentSalary: params.currentSalary,
    increasePercent: params.incrementPercent,
  });
  return {
    currentSalary: result.currentSalary,
    incrementPercent: result.increasePercent,
    incrementAmount: result.increaseAmount,
    newSalary: result.newSalary,
    monthlyIncrement: result.increaseAmount / 12,
  };
}

export { annualFromMonthly, monthlyFromAnnual };
