import type { LoanCurrencyCode } from "./loanFormat";
import { formatLoanMoney } from "./loanFormat";

export type GoalInvestmentCurrencyCode = LoanCurrencyCode;

export const GOAL_INVESTMENT_URL = {
  A: "a",
  B: "b",
  C: "c",
  R: "r",
  Y: "y",
  I: "i",
  W: "w",
  M: "m",
} as const;

export const DEFAULT_GOAL_RETURN = 12;
export const DEFAULT_GOAL_INFLATION = 6;
export const DEFAULT_WITHDRAWAL_RATE = 4;

export function formatGoalMoney(amount: number, currency: GoalInvestmentCurrencyCode): string {
  return formatLoanMoney(amount, currency);
}

export function parseGoalInvestmentSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of Object.values(GOAL_INVESTMENT_URL)) {
    const raw = sp[k];
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === "string" && v.trim() !== "") out[k] = v.trim();
  }
  return out;
}

export function inflateAmount(amountToday: number, inflationPercent: number, years: number): number {
  return amountToday * Math.pow(1 + inflationPercent / 100, years);
}

/** Monthly SIP for target FV with existing corpus growing at same rate. */
export function monthlySipForTarget(params: {
  targetAmount: number;
  years: number;
  annualReturnPercent: number;
  existingCorpus?: number;
}): number | { error: string } {
  if (params.targetAmount <= 0) return { error: "Target amount must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.annualReturnPercent < 0) return { error: "Expected return cannot be negative." };
  if ((params.existingCorpus ?? 0) < 0) return { error: "Existing corpus cannot be negative." };

  const months = Math.round(params.years * 12);
  const r = params.annualReturnPercent / 100 / 12;
  const existing = params.existingCorpus ?? 0;
  const futureOfExisting = existing * Math.pow(1 + r, months);
  const remaining = params.targetAmount - futureOfExisting;

  if (remaining <= 0) return 0;
  if (r === 0) return remaining / months;
  // SIP at end of month: FV = P × [((1+r)^n − 1) / r] × (1+r)  → solve for P
  return remaining / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
}

export type GoalPlanResult = {
  costToday: number;
  futureCost: number;
  existingCorpus: number;
  futureOfExisting: number;
  shortfall: number;
  requiredMonthlySip: number;
  totalSipInvested: number;
  years: number;
};

/** Generic goal planner: inflate cost, grow savings, compute SIP. */
export function goalPlan(params: {
  costToday: number;
  years: number;
  inflationPercent: number;
  expectedReturnPercent: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  if (params.costToday <= 0) return { error: "Goal cost must be positive." };
  if (params.years <= 0) return { error: "Years must be positive." };
  if (params.inflationPercent < 0) return { error: "Inflation cannot be negative." };

  const existingCorpus = params.existingCorpus ?? 0;
  const futureCost = inflateAmount(params.costToday, params.inflationPercent, params.years);
  const months = Math.round(params.years * 12);
  const r = params.expectedReturnPercent / 100 / 12;
  const futureOfExisting = existingCorpus * Math.pow(1 + r, months);
  const sipResult = monthlySipForTarget({
    targetAmount: futureCost,
    years: params.years,
    annualReturnPercent: params.expectedReturnPercent,
    existingCorpus,
  });
  if (typeof sipResult === "object" && "error" in sipResult) return sipResult;
  const requiredMonthlySip = sipResult;
  const shortfall = Math.max(0, futureCost - futureOfExisting);

  return {
    costToday: params.costToday,
    futureCost,
    existingCorpus,
    futureOfExisting,
    shortfall,
    requiredMonthlySip,
    totalSipInvested: requiredMonthlySip * months,
    years: params.years,
  };
}

export function childEducationPlan(params: {
  educationCostToday: number;
  yearsUntilCollege: number;
  educationInflationPercent?: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  return goalPlan({
    costToday: params.educationCostToday,
    years: params.yearsUntilCollege,
    inflationPercent: params.educationInflationPercent ?? 8,
    expectedReturnPercent: params.expectedReturnPercent ?? DEFAULT_GOAL_RETURN,
    existingCorpus: params.existingCorpus,
  });
}

export function childMarriagePlan(params: {
  marriageCostToday: number;
  yearsUntilEvent: number;
  inflationPercent?: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  return goalPlan({
    costToday: params.marriageCostToday,
    years: params.yearsUntilEvent,
    inflationPercent: params.inflationPercent ?? DEFAULT_GOAL_INFLATION,
    expectedReturnPercent: params.expectedReturnPercent ?? DEFAULT_GOAL_RETURN,
    existingCorpus: params.existingCorpus,
  });
}

export function wealthGoalPlan(params: {
  targetWealth: number;
  years: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  // Wealth target is already a future amount — no inflation on the goal itself
  return goalPlan({
    costToday: params.targetWealth,
    years: params.years,
    inflationPercent: 0,
    expectedReturnPercent: params.expectedReturnPercent ?? DEFAULT_GOAL_RETURN,
    existingCorpus: params.existingCorpus,
  });
}

export function dreamHomePlan(params: {
  homeCostToday: number;
  years: number;
  propertyInflationPercent?: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
  downPaymentPercent?: number;
}): (GoalPlanResult & { downPaymentToday: number; downPaymentFuture: number }) | { error: string } {
  const dpPct = params.downPaymentPercent ?? 20;
  if (dpPct <= 0 || dpPct > 100) return { error: "Down payment % must be between 1 and 100." };
  const downPaymentToday = params.homeCostToday * (dpPct / 100);
  const plan = goalPlan({
    costToday: downPaymentToday,
    years: params.years,
    inflationPercent: params.propertyInflationPercent ?? 5,
    expectedReturnPercent: params.expectedReturnPercent ?? DEFAULT_GOAL_RETURN,
    existingCorpus: params.existingCorpus,
  });
  if ("error" in plan) return plan;
  return {
    ...plan,
    downPaymentToday,
    downPaymentFuture: plan.futureCost,
  };
}

export function carPurchasePlan(params: {
  carCostToday: number;
  years: number;
  inflationPercent?: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  return goalPlan({
    costToday: params.carCostToday,
    years: params.years,
    inflationPercent: params.inflationPercent ?? 4,
    expectedReturnPercent: params.expectedReturnPercent ?? 8,
    existingCorpus: params.existingCorpus,
  });
}

export function vacationPlan(params: {
  vacationCostToday: number;
  years: number;
  inflationPercent?: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): GoalPlanResult | { error: string } {
  return goalPlan({
    costToday: params.vacationCostToday,
    years: params.years,
    inflationPercent: params.inflationPercent ?? 5,
    expectedReturnPercent: params.expectedReturnPercent ?? 8,
    existingCorpus: params.existingCorpus,
  });
}

/** Financial freedom ≈ expenses ÷ withdrawal rate, then SIP to reach. */
export function financialFreedomPlan(params: {
  annualExpenses: number;
  withdrawalRatePercent?: number;
  years: number;
  expectedReturnPercent?: number;
  existingCorpus?: number;
}): (GoalPlanResult & { freedomNumber: number }) | { error: string } {
  if (params.annualExpenses <= 0) return { error: "Annual expenses must be positive." };
  const wd = params.withdrawalRatePercent ?? DEFAULT_WITHDRAWAL_RATE;
  if (wd <= 0) return { error: "Withdrawal rate must be positive." };
  const freedomNumber = params.annualExpenses / (wd / 100);
  const plan = wealthGoalPlan({
    targetWealth: freedomNumber,
    years: params.years,
    expectedReturnPercent: params.expectedReturnPercent,
    existingCorpus: params.existingCorpus,
  });
  if ("error" in plan) return plan;
  return { ...plan, freedomNumber };
}

export function goalSipCalc(params: {
  goalAmount: number;
  years: number;
  expectedReturnPercent: number;
  existingCorpus?: number;
}): {
  goalAmount: number;
  requiredMonthlySip: number;
  totalInvested: number;
  futureOfExisting: number;
  years: number;
} | { error: string } {
  const sip = monthlySipForTarget({
    targetAmount: params.goalAmount,
    years: params.years,
    annualReturnPercent: params.expectedReturnPercent,
    existingCorpus: params.existingCorpus,
  });
  if (typeof sip === "object" && "error" in sip) return sip;
  const months = Math.round(params.years * 12);
  const r = params.expectedReturnPercent / 100 / 12;
  const existing = params.existingCorpus ?? 0;
  return {
    goalAmount: params.goalAmount,
    requiredMonthlySip: sip,
    totalInvested: sip * months,
    futureOfExisting: existing * Math.pow(1 + r, months),
    years: params.years,
  };
}
